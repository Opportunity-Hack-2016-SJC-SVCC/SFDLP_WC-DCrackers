app.controller('RegisterCtrl', function(LocalStorageFactory) {

    //console.log(JSON.stringify(LocalStorageFactory.getObject('registerData')));

    //flag which was set to identify if user has filled up registration form to redirect on verify page
    if (angular.isDefined(LocalStorageFactory.getObject('userId').flag)) {
        $state.go('verifyRegister');
    }

    $scope.registerData = {};

    $scope.tryRegister = function() {

        var registerData = {};

        //Check for Validations

        if (!$scope.registerData.fullName || $scope.registerData.fullName.length < 3) {
            $rootScope.showAlert('Please check your Name', 'Error');
            return;
        } else if (!$scope.registerData.phoneNumber || $scope.registerData.phoneNumber.length !== 10) {
            $rootScope.showAlert('Please check your phone Number !', 'Error');
            return;
        }



        //$cordovaVibration.vibrate(100);

        registerData = $scope.registerData;
        registerData.device = $cordovaDevice.getDevice();


        //Send Registration request to server

        console.log('===== ApiEndpoint : ' + ApiEndpoint.url);
        console.log('===== ' + JSON.stringify(registerData));

        var res = $http.post(ApiEndpoint.url + '/checkExistingUser', registerData);

        // Storing Register Data in LocalStorage
        LocalStorageFactory.setObject('registerData', registerData);


        $ionicLoading.show();

        res.success(function(data, status, headers, config) {
            $ionicLoading.hide();
            if (data.status === "true") {
                LocalStorageFactory.setObject('flag', {
                    flag: 1
                });
                $scope.showConfirm('Exist', 'You have already registered for notifyer. Any previous registered device with this number will not receive any further notification!', registerData);
            } else if (data.status === "false") {
                $ionicLoading.show();
                var response = $http.post(ApiEndpoint.url + '/register', registerData);
                response.success(function(data) {
                    $ionicLoading.hide();
                    if (data.status == "success") {
                        LocalStorageFactory.setObject('flag', {
                            flag: 1
                        });
                        $state.go('verifyRegister');
                    }
                });
            } else {
                $rootScope.showAlert(data.msg, 'Error');
                console.log('===== ' + JSON.stringify(data));
            }
        });

        res.error(function(data, status, headers, config) {
            $ionicLoading.hide();
            //alert('===== ' + JSON.stringify(config));
            //$rootScope.showAlert('Please check your Internet Connection', 'Error');
            console.log('===== ' + JSON.stringify(config));

        });
    };

    $scope.showConfirm = function(tit, msg, regdata) {
        var confirmPopup = $ionicPopup.confirm({
            title: tit,
            template: msg
        });
        confirmPopup.then(function(res) {
            if (res) {
                $ionicLoading.show();
                var result = $http.post(ApiEndpoint.url + '/register', regdata);
                result.success(function(data) {
                    $ionicLoading.hide();
                    if (data.status == "success") {
                        $state.go('verifyRegister');
                    } else {
                        $rootScope.showAlert('Error occured in connection', 'Fail');
                    }
                });
            } else {
                return false;
            }
        });
    };
    $scope.tryVerifySms = function() {
        if ($scope.registerData.smsCode.length == 6) {
            var registerData = LocalStorageFactory.getObject('registerData');
            registerData.smsCode = $scope.registerData.smsCode;
            $ionicLoading.show();
            var res = $http.post(ApiEndpoint.url + '/verifyRegister', registerData);
            res.success(function(data, status, headers, config) {
				$ionicLoading.hide();
                if (data.status === "success") {
                    registerData.verified = true;
                    // Storing Register Data in LocalStorage
                    LocalStorageFactory.setObject('registerData', registerData);
					
					// Push one sample notification to client
					var currentdate = new Date(); 
					var datetime = currentdate.getFullYear()+"-"+(currentdate.getMonth()+1)+"-"+ currentdate.getDate()+" "+currentdate.getHours()+ ":"+ currentdate.getMinutes()+ ":"+ currentdate.getSeconds();
					
					var not_data = {
						id:"1",
						sender_id:"Notifyer",
						msg:{type:'Text',value:"Welcome to Notifyer. You will receive notification vai various brands soon."},
						createdOn:datetime,
						route:"T"
					};
					var sql = 'INSERT INTO notifications (id, sender_id, type, value, createdOn, status, route) values (?,?,?,?,?,?,?)';
					//console.log(sql);
					console.log("**********----------->" + JSON.stringify(not_data));
					var res = DB.query(sql, [not_data.id, not_data.sender_id, not_data.msg.type, not_data.msg.value, not_data.createdOn, "Delivered", not_data.route]);
                    PushRegisterFactory.register();
                    //$state.go('home');
                } else {
                    console.log(JSON.stringify(data));
                    $rootScope.showAlert(data.msg, 'Error');
                }
            });
            res.error(function(data, status, headers, config) {
                console.log(">>>>>>>>> " + JSON.stringify(config) + " <<<<<<<<<");
                $ionicLoading.hide();
                $rootScope.showAlert('Please check your Internet Connection', 'Error');
            });
        } else {
            $rootScope.showAlert('Please check your verification code', 'Alert');
        }
    };

    $scope.ChangeNum = function() {
        LocalStorageFactory.removeItem('flag');
        $state.go('register');
    };

    $scope.ResendCode = function() {
        $ionicLoading.show();
        var regdata = LocalStorageFactory.getObject('registerData');
        var req = {
            phoneNumber: regdata.phoneNumber
        };
        $http.post(ApiEndpoint.url + '/resendCode', req).success(function(data) {
            $scope.registerData.smsCode = "";
            $ionicLoading.hide();
            $rootScope.showAlert(data.msg, 'success');
        }).error(function(error) {
            $ionicLoading.hide();
            $rootScope.showAlert('Problem occured while requesting code!', 'Error');
        });
    };

});