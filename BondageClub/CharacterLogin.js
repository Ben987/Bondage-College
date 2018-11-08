var CharacterLoginMessage = "";

// Loads the character login screen
function CharacterLogin_Load() {

	CharacterLoginMessage = "Enter your name and password";

	// Creates a text box to enter the player name
	var InputName = document.createElement('input');
	InputName.setAttribute("ID", "InputName");
	InputName.setAttribute("name", "InputName");
	InputName.setAttribute("type", "text");
	InputName.setAttribute("value", "");
	InputName.setAttribute("maxlength", "20");
	InputName.setAttribute("onfocus", "this.removeAttribute('readonly');");
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
function CharacterLogin_Run() {
	
	// Position the login fields on the screen
	document.getElementById("InputName").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 - MainCanvas.height / 4) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
	document.getElementById("InputPassword").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 - MainCanvas.height / 10) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
		
	// Draw the background and the character twice
	DrawImage("Backgrounds/DressingRoom.jpg", 0, 0);
	DrawCharacter(Character[0], 500, 0, 1);
	DrawText("Welcome to the Bondage Club", 1250, 50, "White", "Black");
	DrawText(CharacterLoginMessage, 1250, 100, "White", "Black");
	DrawText("Account Name", 1250, 217, "White", "Black");
	DrawText("Password", 1250, 368, "White", "Black");
	DrawButton(1200, 500, 100, 60, "Login", "White", "");
	DrawText("Or create a new character", 1250, 700, "White", "Black");
	DrawButton(1125, 800, 250, 60, "New Character", "White", "");

}

// When the character logs, we analyze the data
function CharacterLogin_Response(CharacterData) {
	var C = JSON.parse(CharacterData);
	if ((C.CharacterName != null) && (C.AccountName != null)) {
		Character[0].Name = C.CharacterName;
		Character[0].AccountName = C.AccountName;
		Character[0].AccountPassword = document.getElementById("InputPassword").value.trim();
		CharacterAppearanceLoad(Character[0], C.Appearance);
		InventoryLoad(Character[0], C.Inventory);
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword").parentNode.removeChild(document.getElementById("InputPassword"));
		SetScreen("MainHall");
	} else CharacterLoginMessage = "Error loading character data";
}

// When the user clicks on the character login screen
function CharacterLogin_Click() {
	
	// If we must create a new character
	if ((MouseX >= 1125) && (MouseX <= 1375) && (MouseY >= 800) && (MouseY <= 860)) {
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword").parentNode.removeChild(document.getElementById("InputPassword"));
		SetScreen("CharacterAppearance");
	}
	
	// If we must try to login
	if ((MouseX >= 1200) && (MouseX <= 1300) && (MouseY >= 500) && (MouseY <= 560)) {
		var Name = document.getElementById("InputName").value.trim();
		var Password = document.getElementById("InputPassword").value.trim();
		var letters = /^[a-zA-Z0-9]+$/;
		if (Name.match(letters) && Password.match(letters) && (Name.length > 0) && (Name.length <= 20) && (Password.length > 0) && (Password.length <= 20)) {

			// Calls the PHP page to check if the login is correct
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				   if (xmlhttp.status == 200) {
					   if (xmlhttp.responseText.trim().substring(0, 1) == "{") CharacterLogin_Response(xmlhttp.responseText);
					   else CharacterLoginMessage = "Incorrect name or password";
				   } else CharacterLoginMessage = "Error " + xmlhttp.status.toString() + " on account service";
				}
			};
			xmlhttp.open("GET", CharacterAccountAddress + "?command=account_log&account=" + Name + "&password=" + Password, true);
			xmlhttp.send();

		} else CharacterCreationMessage = "Invalid name or password";
	}
	
}

function CharacterLogin_KeyDown() {
}