var CharacterCreationMessage = "";

// Loads the character login screen
function CharacterCreation_Load() {

	CharacterCreationMessage = "Enter your account & character information";

	// Creates a text box to enter the character name
	var InputCharacter = document.createElement('input');
	InputCharacter.setAttribute("ID", "InputCharacter");
	InputCharacter.setAttribute("name", "InputCharacter");
	InputCharacter.setAttribute("type", "text");
	InputCharacter.setAttribute("value", "");
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
function CharacterCreation_Run() {
	
	// Places the controls on the screen
	document.getElementById("InputCharacter").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 + MainCanvas.height * -0.35) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
	document.getElementById("InputName").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 + MainCanvas.height * -0.22) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
	document.getElementById("InputPassword1").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 + MainCanvas.height * -0.09) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
	document.getElementById("InputPassword2").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 + MainCanvas.height * 0.04) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
	document.getElementById("InputEmail").setAttribute("style", "font-size:" + (MainCanvas.width / 50) + "px; font-family:Arial; position:absolute; padding-left:10px; left:50%; top:" + (window.innerHeight / 2 + MainCanvas.height * 0.17) + "px; width:" + (MainCanvas.width / 4) + "px; height:" + (MainCanvas.width / 40) + "px;");
		
	// Draw the background and the character twice
	DrawImage("Backgrounds/DressingRoom.jpg", 0, 0);
	DrawCharacter(Character[0], 500, 0, 1);
	DrawText(CharacterCreationMessage, 1267, 50, "White", "Black");
	DrawText("Character name: (letters & spaces)", 1267, 120, "White", "Black");
	DrawText("Account name: (letters & numbers)", 1267, 250, "White", "Black");
	DrawText("Account password: (letters & numbers)", 1267, 380, "White", "Black");
	DrawText("Confirm password: (letters & numbers)", 1267, 510, "White", "Black");
	DrawText("Email address: (for password recovery)", 1267, 640, "White", "Black");
	DrawButton(1120, 770, 290, 60, "Create your account", "White", "");
	DrawText("Your account already exists?", 1200, 930, "White", "Black");
	DrawButton(1430, 900, 100, 60, "Login", "White", "");
}

// When the ajax response returns, we analyze it's data
function CharacterCreation_Response(CharacterData) {
	if ((CharacterData != null) && (CharacterData == "account_created")) {
		Character[0].Name = document.getElementById("InputCharacter").value.trim();
		Character[0].AccountName = document.getElementById("InputName").value.trim();
		Character[0].AccountPassword = document.getElementById("InputPassword1").value.trim();
		InventoryLoad(Character[0], null, true);
		CharacterAppearanceSave(Character[0]);
		document.getElementById("InputCharacter").parentNode.removeChild(document.getElementById("InputCharacter"));
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword1").parentNode.removeChild(document.getElementById("InputPassword1"));
		document.getElementById("InputPassword2").parentNode.removeChild(document.getElementById("InputPassword2"));
		document.getElementById("InputEmail").parentNode.removeChild(document.getElementById("InputEmail"));
		SetScreen("MainHall");
	} else CharacterCreationMessage = "Error: " + CharacterData;
}

// When the user clicks on the character creation screen
function CharacterCreation_Click() {
	
	// If we must go back to the login screen
	if ((MouseX >= 1430) && (MouseX <= 1530) && (MouseY >= 900) && (MouseY <= 960)) {
		document.getElementById("InputCharacter").parentNode.removeChild(document.getElementById("InputCharacter"));
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword1").parentNode.removeChild(document.getElementById("InputPassword1"));
		document.getElementById("InputPassword2").parentNode.removeChild(document.getElementById("InputPassword2"));
		document.getElementById("InputEmail").parentNode.removeChild(document.getElementById("InputEmail"));
		SetScreen("CharacterLogin");
	}
	
	// If we must try to create a new account
	if ((MouseX >= 1120) && (MouseX <= 1410) && (MouseY >= 770) && (MouseY <= 830)) {
		
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
			if (CharacterName.match(LS) && Name.match(LN) && Password1.match(LN) && Email.match(E) && (CharacterName.length > 0) && (CharacterName.length <= 20) && (Name.length > 0) && (Name.length <= 20) && (Password1.length > 0) && (Password1.length <= 20) && (Email.length >= 5) && (Email.length <= 100)) {

				// Calls the PHP page to create the accounts
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == XMLHttpRequest.DONE) {
						if (xmlhttp.status == 200) CharacterCreation_Response(xmlhttp.responseText.trim().toString());
						else CharacterCreationMessage = "Error " + xmlhttp.status.toString() + " on account service";
					}
				};
				xmlhttp.open("GET", CharacterAccountAddress + "?command=account_create&character=" + CharacterName + "&account=" + Name + "&password=" + Password1 + "&email=" + Email, true);
				xmlhttp.send();
			
			} else CharacterCreationMessage = "Invalid character, account name, password or email";

		} else CharacterCreationMessage = "Both passwords do not match";
	}

}

function CharacterCreation_KeyDown() {	
}