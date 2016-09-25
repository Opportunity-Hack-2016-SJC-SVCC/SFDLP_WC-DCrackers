<?php

	include("db.php");

	if(isset($_GET['action']) && $_GET['action'] == "newRequest") {

		//echo $_FILES["fileUpload"]["tmp_name"];
		//print_r($_FILES);
		//print_r($_POST);
		$userid = $_POST['userid'];
		$target_dir = "uploads/";
		$target_file = $target_dir . time(). basename($_FILES["fileUpload"]["name"]);
		move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file);

		$id = uniqid();

		$query = "insert into queue (id,filepath,userid, datetime) values('".$id."', '".$target_file."', '".$userid."', '".date('Y-m-d H:i:s')."')";

		mysql_query($query) or die(mysql_error());

		/**
		sleep(10); // Initial Sleep

		while(1) {


			

			$query = "select * from queue where id = '" . $id . "' and processed = 1";

			$result = mysql_query($query);

			if($row = mysql_fetch_array($result)) {

				$return['decodedText'] = $row['decodedText'];
				break;

			} 

			sleep(3);


		}
		**/
		$return['status'] = "success";
		$return['id'] = $id;

		echo json_encode($return);



	}

	if(isset($_GET['action']) && $_GET['action'] == "signup") {

		$request = json_decode(file_get_contents('php://input'));

		print_r($request);	

		$email = $request->email;
		$fullname = $request->fullname;
		$phonenumber = $request->phonenumber;
		$password = md5($request->password);

		$query = "insert into users (email, fullname, phonenumber, password) values ('$email','$fullname', '$phonenumber', '$password')";
		//echo $query;

		$result = mysql_query($query) or die(mysql_error());
		$response = new stdClass();
		$response->result = true;
		echo json_encode($response);


	}

	if(isset($_GET['action']) && $_GET['action'] == "login") {

		//echo file_get_contents('php://input');

		$request = json_decode(file_get_contents('php://input'));


		//print_r($request);
		
		$username = $request->username;
		$password = md5($request->password);

		$query = "select * from users where username = '$username' and password = '$password'";
		//echo $query;
		$result = mysql_query($query) or die(mysql_error());

		$response = new stdClass();

		if($row = mysql_fetch_array($result)) {

			
			$response->result = true;
			$response->userid = $row['userid'];

			


		}else {
			$response->result = false;
		
		}
		//print_r($response);

		echo json_encode($response);

	}

	if(isset($_GET['action']) && $_GET['action'] == "getList"){

		$userid = $_GET['userid'];

		$query = "select * from queue where userid = '" .$userid . "' order by datetime desc";

		$result = mysql_query($query) or die(mysql_error());


		while($row[] = mysql_fetch_array($result)) {

		}
		$lastElementIndex = count($row) -1;
		unset($row[$lastElementIndex]);
		echo json_encode($row);

	}

	if(isset($_GET['action']) && $_GET['action'] == "saveToken"){

		$request = json_decode(file_get_contents('php://input'));
		$userid = $request->userid;
		$deviceToken = $request->deviceToken;

		//print_r($_POST);

		$query = "update users set deviceToken = '".$deviceToken."' where userid = '" .$userid . "'";
		//echo $query;
		$result = mysql_query($query) or die(mysql_error());


		$response = new stdClass();
		$response->result = true;

		echo json_encode($response);

	}

	if(isset($_GET['action']) && $_GET['action'] == "updateListName"){

		$request = json_decode(file_get_contents('php://input'));
		$queueid = $request->queueid;
		$listName = $request->listName;

		//print_r($_POST);

		$query = "update queue set listName = '".$listName."' where id = '" .$queueid . "'";
		//echo $query;
		$result = mysql_query($query) or die(mysql_error());


		$response = new stdClass();
		$response->result = true;

		echo json_encode($response);

	}


	if(isset($_GET['action']) && $_GET['action'] == "newFeedback"){

		$request = json_decode(file_get_contents('php://input'));
		$requestuuid = $request->requestuuid;
		$feedbackstar = $request->feedbackstar;
		$feedbackcomment = $request->feedbackcomment;

		//print_r($_POST);

		$query = "update request set feedbackstar = ".$feedbackstar.", feedbackcomment = '".$feedbackcomment."' where requestid = '" .$requestuuid . "'";
		//echo $query;
		$result = mysql_query($query) or die(mysql_error());


		$response = new stdClass();
		$response->result = true;

		echo json_encode($response);
		

	}

	if(isset($_GET['action']) && $_GET['action'] == "listrequest"){
		$request = json_decode(file_get_contents('php://input'));
		$uuid = $request->uuid;
		

		//print_r($_POST);

		$query = "select * from request where uuid = '" .$uuid . "' order by requestid desc";

		$result = mysql_query($query) or die(mysql_error());


		while($row[] = mysql_fetch_array($result)) {

		}
		$lastElementIndex = count($row) -1;
		unset($row[$lastElementIndex]);
		echo json_encode($row);
		

	}

	if(isset($_GET['action']) && $_GET['action'] == "createrequest"){
		$request = json_decode(file_get_contents('php://input'));
		
		$uuid = $request->uuid;
		$address = $request->address;
		$datetimestring = $request->datetimestring;
		$description = $request->description;
		$howtoreach = $request->howtoreach;
		$numberofworkers = $request->numberofworkers;
		$typeofservice = $request->type;
		

		//print_r($_POST);

		$query = "insert into request (uuid, typeofservice, numberofworkers, datetimestring, address, howtoreach, description) values ('$uuid','$typeofservice', '$numberofworkers', '$datetimestring', '$address','$howtoreach', '$description')";
		//echo $query;

		$result = mysql_query($query) or die(mysql_error());
		$response = new stdClass();
		$response->result = true;
		echo json_encode($response);
		

	}

	if(isset($_GET['action']) && $_GET['action'] == "signin"){
		$request = json_decode(file_get_contents('php://input'));
		$email = $request->email;
		$password = $request->password;
		
		//print_r($request);
		//print_r($_POST);

		$query = "select * from user where email = '" .$email . "' and password = '$password'";
		echo $query;
		$result = mysql_query($query) or die(mysql_error());


		$row = mysql_fetch_array($result);

		$response = new stdClass();
		if($row['uuid'] != "") {
			
			$response->result = true;
			$response->uuid = $row['uuid'];
		}else {
			$response->result = false;
		}
		
		echo json_encode($response);
		

	}

	
?>
