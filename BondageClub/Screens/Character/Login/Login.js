"use strict";
var LoginBackground = "Dressing";
var LoginMessage = "";
var LoginCredits = null;
var LoginCreditsPosition = 0;
var LoginThankYou = "";
var LoginThankYouList = ["Alvin", "Bryce", "Christian", "Designated", "Dick", "EugeneTooms", "Gopanka", "Jdmsouls22", "Jyeoh", "Laioken", "Michal", "Mindtie", "Nick", "Overlord", "Paradox", "Rashiash", "Ryner", "Shadow", "Shaun", "Simeon", "Simon", "Sky Lord", "Terry", "Winterisbest", "William", "Xepherio", "Zack"];
var LoginThankYouNext = 0;

// Loads the next thank you bubble
function LoginDoNextThankYou() {
	LoginThankYou = CommonRandomItemFromList(LoginThankYou, LoginThankYouList);
	CharacterAppearanceFullRandom(Player);
	if (Math.random() >= 0.5) InventoryWearRandom(Player, "ItemFeet"); else InventoryRemove(Player, "ItemFeet");
	if (Math.random() >= 0.5) InventoryWearRandom(Player, "ItemLegs"); else InventoryRemove(Player, "ItemLegs");
	if (Math.random() >= 0.5) InventoryWearRandom(Player, "ItemArms"); else InventoryRemove(Player, "ItemArms");
	LoginThankYouNext = CommonTime() + 4000;
}

// Draw the credits 
function LoginDrawCredits() {

	// For each credits in the list
	LoginCreditsPosition++;
	MainCanvas.font = "30px Arial";
	for(var C = 0; C < LoginCredits.length; C++) {

		// Sets the Y position (it scrolls from bottom to top)
		var Y = 800 - Math.floor(LoginCreditsPosition * CommonRunInterval / 10) + (C * 50);

		// Draw the text if it's in drawing range
		if ((Y > 0) && (Y <= 999)) {

			// The "CreditTypeRepeat" starts scrolling again, other credit types are translated
			var Cred = LoginCredits[C][0].trim();
			if (Cred == "CreditTypeRepeat") {
				LoginCreditsPosition = 0;
				return;
			} else {
				if (Cred.substr(0, 10) == "CreditType") DrawText(TextGet(Cred), 320, Y, "white");
				else {
					if (Cred.indexOf("|") == -1) DrawText(Cred, 320, Y, "white");
					else {
						DrawText(Cred.substring(0, Cred.indexOf("|")), 180, Y, "white");
						DrawText(Cred.substring(Cred.indexOf("|") + 1, 1000), 460, Y, "white");
					}
				}
			}

		}

	}

	// Restore the canvas font
	MainCanvas.font = "36px Arial";
	
}

// Loads the character login screen
function LoginLoad() {

	// Resets the player and other characters
	Character = [];
	CharacterReset(0, "Female3DCG");
	LoginDoNextThankYou();
	CharacterLoadCSVDialog(Player);
	LoginMessage = "";
	if (LoginCredits == null) CommonReadCSV("LoginCredits", CurrentModule, CurrentScreen, "GameCredits");

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

	// Draw the credits
	if (LoginCredits != null) LoginDrawCredits();
	
	// Draw the login controls
	if (LoginMessage == "") LoginMessage = TextGet("EnterNamePassword");
	DrawText(TextGet("Welcome"), 1000, 50, "White", "Black");
	DrawText(LoginMessage, 1000, 100, "White", "Black");
	DrawText(TextGet("AccountName"), 1000, 200, "White", "Black");
	DrawElementPosition("InputName", 1000, 260, 500);
	DrawText(TextGet("Password"), 1000, 350, "White", "Black");
	DrawElementPosition("InputPassword", 1000, 410, 500);
	DrawButton(925, 500, 150, 60, TextGet("Login"), "White", "");
	DrawText(TextGet("CreateNewCharacter"), 1000, 670, "White", "Black");
	DrawButton(850, 740, 300, 60, TextGet("NewCharacter"), "White", "");
	if (CheatAllow) DrawButton(850, 870, 300, 60, TextGet("Cheats"), "White", "");

	// Draw the character and thank you bubble
	DrawCharacter(Player, 1400, 100, 0.9);
	if (LoginThankYouNext < CommonTime()) LoginDoNextThankYou();
	DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 1400, 16);
	DrawText(TextGet("ThankYou") + " " + LoginThankYou, 1625, 53, "Black", "Gray");

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
		CharacterAppearanceValidate(Player);
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword").parentNode.removeChild(document.getElementById("InputPassword"));
		CommonSetScreen("Room", "MainHall");
	} else LoginMessage = TextGet("ErrorLoadingCharacterData");
}

// When the user clicks on the character login screen
function LoginClick() {
	
	// Opens the cheat panel
	if (CheatAllow && ((MouseX >= 850) && (MouseX <= 1150) && (MouseY >= 870) && (MouseY <= 930))) {
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword").parentNode.removeChild(document.getElementById("InputPassword"));
		CommonSetScreen("Character", "Cheat");
	}
	
	// If we must create a new character
	if ((MouseX >= 850) && (MouseX <= 1150) && (MouseY >= 740) && (MouseY <= 800)) {
		document.getElementById("InputName").parentNode.removeChild(document.getElementById("InputName"));
		document.getElementById("InputPassword").parentNode.removeChild(document.getElementById("InputPassword"));
		CharacterAppearanceSetDefault(Player);
		InventoryRemove(Player, "ItemFeet");
		InventoryRemove(Player, "ItemLegs");
		InventoryRemove(Player, "ItemArms");
		CommonSetScreen("Character", "Appearance");
	}
	
	// If we must try to login
	if ((MouseX >= 925) && (MouseX <= 1075) && (MouseY >= 500) && (MouseY <= 560)) {
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
