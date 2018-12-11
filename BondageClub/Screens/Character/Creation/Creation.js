var CreationBackground = "Dressing";
var CreationMessage = "";

// Loads the character login screen
function CreationLoad() {

	// Gets the info to import Bondage College data
	var DefaultName = "";
	if ((localStorage.getItem("BondageClubImportSource") != null) && (localStorage.getItem("BondageClubImportSource") == "BondageCollege")) {
		ImportBondageCollegeData = true;
		if (localStorage.getItem("BondageCollegeExportName") != null) DefaultName = localStorage.getItem("BondageCollegeExportName");
	} else ImportBondageCollegeData = null;

	// Creates a text box to enter the character name
	var InputCharacter = document.createElement('input');
	InputCharacter.setAttribute("ID", "InputCharacter");
	InputCharacter.setAttribute("name", "InputCharacter");
	InputCharacter.setAttribute("type", "text");
	InputCharacter.setAttribute("value", DefaultName);
	InputCharacter.setAttribute("maxlength", "20");
	InputCharacter.setAttribute("onfocus", "this.removeAttribute('readonly');");
	InputCharacter.addEventListener("keypress", KeyDown);
	document.body.appendChild(InputCharacter);
	
	// Creates a text box to enter the account name
	var InputName = document.createElement('input');
	InputName.setAttribute("ID", "InputName");
	InputName.setAttribute("name", "InputName");
	InputName.setAttribute("type", "text");
	InputName.setAttribute("value", "");
	InputName.setAttribute("maxlength", "20");
	InputName.setAttribute("onfocus", "this.removeAttribute('readonly');");
	InputName.addEventListener("keypress", KeyDown);
	document.body.appendChild(InputName);

	// Creates a text box to enter the account password
	var InputPassword1 = document.createElement('input');
	InputPassword1.setAttribute("ID", "InputPassword1");
	InputPassword1.setAttribute("name", "InputPassword1");
	InputPassword1.setAttribute("type", "password");
	InputPassword1.setAttribute("value", "");
	InputPassword1.setAttribute("maxlength", "20");
	InputPassword1.addEventListener("keypress", KeyDown);
	document.body.appendChild(InputPassword1);

	// Creates a text box to enter the account password again
	var InputPassword2 = document.createElement('input');
	InputPassword2.setAttribute("ID", "InputPassword2");
	InputPassword2.setAttribute("name", "InputPassword2");
	InputPassword2.setAttribute("type", "password");
	InputPassword2.setAttribute("value", "");
	InputPassword2.setAttribute("maxlength", "20");
	InputPassword2.addEventListener("keypress", KeyDown);
	document.body.appendChild(InputPassword2);
	
	// Creates a text box to enter the account email
	var InputEmail = document.createElement('input');
	InputEmail.setAttribute("ID", "InputEmail");
	InputEmail.setAttribute("name", "InputEmail");
	InputEmail.setAttribute("type", "text");
	InputEmail.setAttribute("value", "");
	InputEmail.setAttribute("maxlength", "100");
	InputEmail.addEventListener("keypress", KeyDown);
	document.body.appendChild(InputEmail);

}

// Run the characther creation  screen 
function CreationRun() {
	
	// Places the controls on the screen
	document.getElementById("InputCharacter").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 + MainCanvas.height * -0.35) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
	document.getElementById("InputName").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 + MainCanvas.height * -0.22) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
	document.getElementById("InputPassword1").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 + MainCanvas.height * -0.09) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
	document.getElementById("InputPassword2").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 + MainCanvas.height * 0.04) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
	document.getElementById("InputEmail").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 + MainCanvas.height * 0.17) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
		
	// Draw the character, the labels and buttons
	if (CreationMessage == "") CreationMessage = TextGet("EnterAccountCharacterInfo");
	DrawCharacter(Player, 500, 0, 1);
	DrawText(CreationMessage, 1267, 50, "White", "Black");
	DrawText(TextGet("CharacterName"), 1267, 120, "White", "Black");
	DrawText(TextGet("AccountName"), 1267, 250, "White", "Black");
	DrawText(TextGet("Password"), 1267, 380, "White", "Black");
	DrawText(TextGet("ConfirmPassword"), 1267, 510, "White", "Black");
	DrawText(TextGet("Email"), 1267, 640, "White", "Black");
	DrawButton(1080, 820, 370, 60, TextGet("CreateAccount"), "White", "");
	DrawText(TextGet("AccountAlreadyExists"), 1180, 950, "White", "Black");
	DrawButton(1440, 920, 120, 60, TextGet("Login"), "White", "");
	
	// Draw the importation check box
	if (ImportBondageCollegeData != null) {
		DrawText(TextGet("ImportBondageCollege"), 1217, 774, "White", "Black");
		DrawButton(1480, 740, 64, 64, "", "White", ImportBondageCollegeData ? "Icons/Checked.png" : "");
	}

}

// When the ajax response returns, we analyze it's data
function CreationResponse(CharacterData) {
	if ((CharacterData != null) && (CharacterData == "account_created")) {
		
		// Keep the character data and pushes it's appearance to the server
		Player.Name = document.getElementById("InputCharacter").value.trim();
		Player.AccountName = document.getElementById("InputName").value.trim();
		Player.AccountPassword = document.getElementById("InputPassword1").value.trim();
		
		// Imports logs, inventory and Sarah status from the Bondage College
		ImportBondageCollege(Player);

		// Flush the controls and enters the main hall
		CharacterAppearanceSave(Player);
		document.getElementById("InputCharacter").parentNode.removeChild(document.getElementById("InputCharacter"));
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword1").parentNode.removeChild(document.getElementById("InputPassword1"));
		document.getElementById("InputPassword2").parentNode.removeChild(document.getElementById("InputPassword2"));
		document.getElementById("InputEmail").parentNode.removeChild(document.getElementById("InputEmail"));
		CommonSetScreen("Room", "MainHall");
		
	} else CreationMessage = TextGet("Error") + " " + CharacterData;
}

// When the user clicks on the character creation screen
function CreationClick() {

	// If we must check or uncheck the importation checkbox
	if ((MouseX >= 1480) && (MouseX <= 1544) && (MouseY >= 740) && (MouseY <= 804) && (ImportBondageCollegeData != null))
		ImportBondageCollegeData = !ImportBondageCollegeData;

	// If we must go back to the login screen
	if ((MouseX >= 1440) && (MouseX <= 1560) && (MouseY >= 920) && (MouseY <= 980)) {
		document.getElementById("InputCharacter").parentNode.removeChild(document.getElementById("InputCharacter"));
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword1").parentNode.removeChild(document.getElementById("InputPassword1"));
		document.getElementById("InputPassword2").parentNode.removeChild(document.getElementById("InputPassword2"));
		document.getElementById("InputEmail").parentNode.removeChild(document.getElementById("InputEmail"));
		CommonSetScreen("Character", "Login");
	}
	
	// If we must try to create a new account
	if ((MouseX >= 1080) && (MouseX <= 1450) && (MouseY >= 820) && (MouseY <= 880)) {
		
		// First, we make sure both passwords are the same
		var CharacterName = document.getElementById("InputCharacter").value.trim();
		var Name = document.getElementById("InputName").value.trim();
		var Password1 = document.getElementById("InputPassword1").value.trim();
		var Password2 = document.getElementById("InputPassword2").value.trim();
		var Email = document.getElementById("InputEmail").value.trim();
		
		// If both password matches
		if (Password1 == Password2) {

			// Makes sure the data is valid
			var LN = /^[a-zA-Z0-9 ]+$/;
			var LS = /^[a-zA-Z ]+$/;
			var E = /^[a-zA-Z0-9@.]+$/;
			if (CharacterName.match(LS) && Name.match(LN) && Password1.match(LN) && (Email.match(E) || Email == "") && (CharacterName.length > 0) && (CharacterName.length <= 20) && (Name.length > 0) && (Name.length <= 20) && (Password1.length > 0) && (Password1.length <= 20) && (Email.length <= 100)) {

				// Calls the PHP page to create the accounts
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == XMLHttpRequest.DONE) {
						if (xmlhttp.status == 200) CreationResponse(xmlhttp.responseText.trim().toString());
						else CreationMessage = TextGet("Error") + " " + xmlhttp.status.toString();
					}
				};
				xmlhttp.open("GET", AccountAddress + "?command=account_create&character=" + CharacterName + "&account=" + Name + "&password=" + Password1 + "&email=" + Email, true);
				xmlhttp.send();

			} else CreationMessage = TextGet("InvalidData");

		} else CreationMessage = TextGet("BothPasswordDoNotMatch");
	}

}