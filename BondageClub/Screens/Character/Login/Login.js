var LoginBackground = "Dressing";
var LoginMessage = "";

// Loads the character login screen
function LoginLoad() {

	// Resets the player and other characters
	Character = [];
	CharacterReset(0, "Female3DCG");
	CharacterLoadCSVDialog(Player);
	LoginMessage = "";

	// Creates a text box to enter the player name
	var InputName = document.createElement('input');
	InputName.setAttribute("ID", "InputName");
	InputName.setAttribute("name", "InputName");
	InputName.setAttribute("type", "text");
	InputName.setAttribute("value", "");
	InputName.setAttribute("maxlength", "20");
	InputName.addEventListener("keypress", KeyDown);
	document.body.appendChild(InputName);

	// Creates a text box to enter the player name
	var InputPassword = document.createElement('input');
	InputPassword.setAttribute("ID", "InputPassword");
	InputPassword.setAttribute("name", "InputPassword");
	InputPassword.setAttribute("type", "password");
	InputPassword.setAttribute("value", "");
	InputPassword.setAttribute("maxlength", "20");
	InputPassword.addEventListener("keypress", KeyDown);
	document.body.appendChild(InputPassword);

}

// Run the character login screen 
function LoginRun() {
	
	// Position the login fields on the screen
	document.getElementById("InputName").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 - MainCanvas.height / 4) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
	document.getElementById("InputPassword").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 - MainCanvas.height / 10) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
		
	// Draw the character and labels
	if (LoginMessage == "") LoginMessage = TextGet("EnterNamePassword");
	DrawCharacter(Player, 500, 0, 1);
	DrawText(TextGet("Welcome"), 1265, 50, "White", "Black");
	DrawText(LoginMessage, 1265, 100, "White", "Black");
	DrawText(TextGet("AccountName"), 1265, 217, "White", "Black");
	DrawText(TextGet("Password"), 1265, 368, "White", "Black");
	DrawButton(1200, 500, 130, 60, TextGet("Login"), "White", "");
	DrawText(TextGet("CreateNewCharacter"), 1265, 700, "White", "Black");
	DrawButton(1125, 800, 280, 60, TextGet("NewCharacter"), "White", "");

}

// When the character logs, we analyze the data
function LoginResponse(CharacterData) {
	var C = JSON.parse(CharacterData);
	if ((C.CharacterName != null) && (C.AccountName != null)) {
		Player.Name = C.CharacterName;
		Player.AccountName = C.AccountName;
		Player.AccountPassword = document.getElementById("InputPassword").value.trim();
		Player.AssetFamily = C.AssetFamily;
		if (CommonIsNumeric(C.Money)) Player.Money = C.Money;
		Player.Owner = C.Owner;
		Player.Lover = C.Lover;
		CharacterAppearanceLoadFromAccount(Player, C.Appearance);
		InventoryRemove(Player, "ItemMisc");
		InventoryLoad(Player, C.Inventory, false);
		LogLoad(C.Log);
		ReputationLoad(C.Reputation);
		SkillLoad(C.Skill);
		CharacterLoadCSVDialog(Player);
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword").parentNode.removeChild(document.getElementById("InputPassword"));
		CommonSetScreen("Room", "MainHall");
	} else LoginMessage = TextGet("ErrorLoadingCharacterData");
}

// When the user clicks on the character login screen
function LoginClick() {

	if ((MouseX >= 0) && (MouseX < 200))
		MiniGameLockPick();
	
	// If we must create a new character
	if ((MouseX >= 1125) && (MouseX <= 1375) && (MouseY >= 800) && (MouseY <= 860)) {
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword").parentNode.removeChild(document.getElementById("InputPassword"));
		CommonSetScreen("Character", "Appearance");
	}
	
	// If we must try to login
	if ((MouseX >= 1200) && (MouseX <= 1300) && (MouseY >= 500) && (MouseY <= 560)) {
		var Name = document.getElementById("InputName").value.trim();
		var Password = document.getElementById("InputPassword").value.trim();
		var letters = /^[a-zA-Z0-9]+$/;
		if (Name.match(letters) && Password.match(letters) && (Name.length > 0) && (Name.length <= 20) && (Password.length > 0) && (Password.length <= 20)) {

			// Calls the PHP page to check if the login is correct
			LoginMessage = TextGet("ValidatingNamePassword");
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				   if (xmlhttp.status == 200) {
					   if (xmlhttp.responseText.trim().substring(0, 1) == "{") LoginResponse(xmlhttp.responseText);
					   else LoginMessage = TextGet("InvalidNamePassword");
				   } else LoginMessage = TextGet("Error") + " " + xmlhttp.status.toString();
				}
			};
			xmlhttp.open("GET", AccountAddress + "?command=account_log&account=" + Name + "&password=" + Password, true);
			xmlhttp.send();

		} else LoginMessage = TextGet("InvalidNamePassword");
	}
	
}
