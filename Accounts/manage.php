<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");
header("content-type: text/plain; charset=utf-8"); 
?>

<?php

// Returns the character file name
function GetFileName() {	
	return 'characters/'.hash('tiger192,3', strtoupper($_GET["account"])).'.json';
}

// Returns TRUE if the email address is valid
function ValidEmail($email) {
    return (preg_match("/(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/", $email) || !preg_match("/^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/", $email)) ? false : true;
}

// For any transaction, we validate the login
function ValidLogin(&$data) {
	
	// Checks if the login parameters are valid
	if (isset($_GET["account"]) && isset($_GET["password"]) && ($_GET["account"] != "") && ($_GET["password"] != "")) {
		
		// The character file is named like the account, the password is hashed in the file
		$file = GetFileName();
		if (file_exists($file)) {
			$myfile = fopen($file, "r") or die("Unable to open file!");
			if (filesize($file) > 0) {
				$data = fread($myfile, filesize($file));
				fclose($myfile);
				$arr = json_decode($data);
				if (password_verify($_GET["password"], $arr->Password)) {
					return true;
				} else echo "invalid_password";
			} else echo "empty_account";
		} else echo "account_doesnt_exist";
	} else echo "parameter_error";
	return false;

}

// There needs to be a command first
if (isset($_GET["command"])) {

	// Checks if all the parameters are there to create an account
	if ($_GET["command"] == "account_create")
		if (isset($_GET["account"]) && ($_GET["account"] != "") && !(preg_match('/[^A-Za-z0-9]+/', $_GET["account"])))
			if (isset($_GET["password"]) && ($_GET["password"] != "") && !(preg_match('/[^A-Za-z0-9]+/', $_GET["password"])))
				if (isset($_GET["character"]) && ($_GET["character"] != "") && !(preg_match('/[^A-Za-z ]+/', $_GET["character"])))
					if (isset($_GET["email"]) && (($_GET["email"] == "") || ValidEmail($_GET["email"]))) {
			
						// The character file is named like her, we check if it already exists
						$file = GetFileName();
						if (!file_exists($file)) {
							$arr = new stdClass();
							$arr->AccountName = $_GET["account"];
							$arr->Password = password_hash($_GET["password"], PASSWORD_DEFAULT);
							$arr->Email = password_hash($_GET["email"], PASSWORD_DEFAULT);
							$arr->CharacterName = $_GET["character"];
							$handle = fopen($file, 'w') or die('Cannot open file: '.$file);
							fwrite($handle, json_encode($arr));
							fclose($handle);
							echo "account_created";		
						} else echo "account_already_exist";
						
					} else echo "parameter_email_error";
				else echo "parameter_character_error";
			else echo "parameter_password_error";
		else echo "parameter_account_error";

	// Checks if all the parameters are there to log in
	if ($_GET["command"] == "account_log") 
		if (ValidLogin($data))
			echo $data;

	// Add an item to the account inventory
	if ($_GET["command"] == "inventory_add") 
		if (ValidLogin($data))
			if (isset($_GET["name"]) && isset($_GET["group"]) && ($_GET["name"] != "") && ($_GET["group"] != "")) {

				// If the item is already in inventory, we exit
				$arr = json_decode($data);
				if (!isset($arr->Inventory)) $arr->Inventory = [];
				foreach ($arr->Inventory as $item)
					if (($item->Name == $_GET["name"]) && ($item->Group == $_GET["group"]))
						die("already_in_inventory");

				// Create the inventory item and add it
				$inventory = new stdClass();
				$inventory->Name = $_GET["name"];
				$inventory->Group = $_GET["group"];
				array_push($arr->Inventory, $inventory);

				// Overwrite the file
				$file = GetFileName();
				$myfile = fopen($file, "w") or die("Unable to open file!");
				fwrite($myfile, json_encode($arr));
				fclose($myfile);
				echo "inventory_added";
					
			} else echo "parameter_error";

	// Add an item to the account inventory
	if ($_GET["command"] == "appearance_update") 
		if (ValidLogin($data)) 
			if (isset($_GET["family"]) && ($_GET["family"] != "")) {

				// Decodes the data
				$arr = json_decode($data);
				$arr->AssetFamily = $_GET["family"];
				$arr->Appearance = [];
				
				// Fills the appearance array
				$p = 0;
				while (isset($_GET["name".$p]) && isset($_GET["group".$p]) && isset($_GET["color".$p]) && ($_GET["name".$p] != "") && ($_GET["group".$p] != "") && ($_GET["color".$p] != "")) {

					// Adds the appearance in the array
					$appearance = new stdClass();
					$appearance->Name = $_GET["name".$p];
					$appearance->Group = $_GET["group".$p];
					$appearance->Color = str_replace("|", "#", $_GET["color".$p]);
					array_push($arr->Appearance, $appearance);
					$p++;
				
				}

				// Overwrite the file
				$file = GetFileName();
				$myfile = fopen($file, "w") or die("Unable to open file!");
				fwrite($myfile, json_encode($arr));
				fclose($myfile);
				echo "appearance_updated";
				
			} else echo "missing_family";
		
	// Add an entry to the account log
	if ($_GET["command"] == "log_add") 
		if (ValidLogin($data))
			if (isset($_GET["name"]) && isset($_GET["group"]) && ($_GET["name"] != "") && ($_GET["group"] != "")) {

				// If the entry is already in the log, we exit
				$arr = json_decode($data);
				if (!isset($arr->Log)) $arr->Log = [];
				foreach ($arr->Log as $item)
					if (($item->Name == $_GET["name"]) && ($item->Group == $_GET["group"]))
						die("already_in_log");

				// Create the log entry and add it
				$log = new stdClass();
				$log->Name = $_GET["name"];
				$log->Group = $_GET["group"];
				array_push($arr->Log, $log);

				// Overwrite the file
				$file = GetFileName();
				$myfile = fopen($file, "w") or die("Unable to open file!");
				fwrite($myfile, json_encode($arr));
				fclose($myfile);
				echo "log_added";

			} else echo "parameter_error";

		
	// Update the reputation for the character
	if ($_GET["command"] == "reputation_set")
		if (ValidLogin($data))
			if (isset($_GET["type"]) && isset($_GET["value"]) && ($_GET["type"] != "") && ($_GET["value"] != "")) {

				// If the entry is already in the reputation array, we update it
				$arr = json_decode($data);
				$found = false;
				if (!isset($arr->Reputation)) $arr->Reputation = [];
				foreach ($arr->Reputation as $item)
					if ($item->Type == $_GET["type"]) {
						$item->Value = $_GET["value"];
						$found = true;
					}
					
				// Create the reputation entry and add it
				if (!$found) {
					$rep = new stdClass();
					$rep->Type = $_GET["type"];
					$rep->Value = $_GET["value"];
					array_push($arr->Reputation, $rep);
				}

				// Overwrite the file
				$file = GetFileName();
				$myfile = fopen($file, "w") or die("Unable to open file!");
				fwrite($myfile, json_encode($arr));
				fclose($myfile);
				echo "reputation_updated";

			} else echo "parameter_error";

	// Update the skill for the character
	if ($_GET["command"] == "skill_set")
		if (ValidLogin($data))
			if (isset($_GET["type"]) && isset($_GET["level"]) && isset($_GET["progress"]) && ($_GET["type"] != "") && ($_GET["level"] != "") && ($_GET["progress"] != "")) {

				// If the entry is already in the skill array, we update it
				$arr = json_decode($data);
				$found = false;
				if (!isset($arr->Skill)) $arr->Skill = [];
				foreach ($arr->Skill as $item)
					if ($item->Type == $_GET["type"]) {
						$item->Level = $_GET["level"];
						$item->Progress = $_GET["progress"];
						$found = true;
					}
					
				// Create the skill entry and add it
				if (!$found) {
					$skill = new stdClass();
					$skill->Type = $_GET["type"];
					$skill->Level = $_GET["level"];
					$skill->Progress = $_GET["progress"];
					array_push($arr->Skill, $skill);
				}

				// Overwrite the file
				$file = GetFileName();
				$myfile = fopen($file, "w") or die("Unable to open file!");
				fwrite($myfile, json_encode($arr));
				fclose($myfile);
				echo "skill_updated";

			} else echo "parameter_error";
			
	// Update many character values
	if ($_GET["command"] == "update_character") 
		if (ValidLogin($data)) {
			
				// Saves specific character values passed as parameters
				$arr = json_decode($data);
				if (isset($_GET["money"]) && ($_GET["money"] != "")) $arr->Money = $_GET["money"];
				if (isset($_GET["owner"]) && ($_GET["owner"] != "")) $arr->Owner = $_GET["owner"];
				if (isset($_GET["lover"]) && ($_GET["lover"] != "")) $arr->Lover = $_GET["lover"];

				// Overwrite the file
				$file = GetFileName();
				$myfile = fopen($file, "w") or die("Unable to open file!");
				fwrite($myfile, json_encode($arr));
				fclose($myfile);
				echo "log_added";
			
		}
			
} else echo "no_command_error";

?>