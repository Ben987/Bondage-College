"use strict";
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

	// Creates the text fields element
	ElementCreateInput("InputCharacter", "text", DefaultName, "20");
	ElementCreateInput("InputName", "text", "", "20");
	ElementCreateInput("InputPassword1", "password", "", "20");
	ElementCreateInput("InputPassword2", "password", "", "20");
	ElementCreateInput("InputEmail", "text", "", "100");

}

// Run the character creation screen 
function CreationRun() {

	// Places the controls on the screen
	ElementPosition("InputCharacter", 1250, 175, 500);
	ElementPosition("InputName", 1250, 305, 500);
	ElementPosition("InputPassword1", 1250, 435, 500);
	ElementPosition("InputPassword2", 1250, 565, 500);
	ElementPosition("InputEmail", 1250, 695, 500);
		
	// Draw the character, the labels and buttons
	if (CreationMessage == "") CreationMessage = TextGet("EnterAccountCharacterInfo");
	DrawCharacter(Player, 500, 0, 1);
	DrawText(CreationMessage, 1250, 50, "White", "Black");
	DrawText(TextGet("CharacterName"), 1250, 120, "White", "Black");
	DrawText(TextGet("AccountName"), 1250, 250, "White", "Black");
	DrawText(TextGet("Password"), 1250, 380, "White", "Black");
	DrawText(TextGet("ConfirmPassword"), 1250, 510, "White", "Black");
	DrawText(TextGet("Email"), 1250, 640, "White", "Black");
	DrawButton(1050, 825, 400, 60, TextGet("CreateAccount"), "White", "");
	DrawText(TextGet("AccountAlreadyExists"), 1180, 950, "White", "Black");
	DrawButton(1440, 920, 120, 60, TextGet("Login"), "White", "");
	
	// Draw the importation check box
	if (ImportBondageCollegeData != null) {
		DrawText(TextGet("ImportBondageCollege"), 1217, 783, "White", "Black");
		DrawButton(1480, 750, 64, 64, "", "White", ImportBondageCollegeData ? "Icons/Checked.png" : "");
	}

}

// When the server response returns, we analyze it's data
function CreationResponse(data) {
	if ((data != null) && (data.ServerAnswer != null)) {
		if (data.ServerAnswer == "AccountCreated") {

			// Keep the character data and pushes it's appearance to the server
			Player.Name = ElementValue("InputCharacter");
			Player.AccountName = ElementValue("InputName");
			Player.Creation = CurrentTime;
			Player.Money = 100;
			Player.OnlineID = data.OnlineID;
			Player.MemberNumber = data.MemberNumber;
			Player.ItemPermission = 2;
			Player.WhiteList = [];
			Player.BlackList = [];
			Player.FriendList = [];
			Player.GhostList = [];
			Player.Lovership = [];

			// Imports logs, inventory and Sarah status from the Bondage College
			CreationMessage = "";
			PrivateCharacter = [];
			PrivateCharacter.push(Player);
			Log = [];
			ImportBondageCollege(Player);

			// Calls the preference init to make sure the preferences are loaded correctly
			PreferenceInit(Player);
			ActivitySetArousal(Player, 0);

			// Flush the controls and enters the main hall
			ServerPlayerAppearanceSync();
			ElementRemove("InputCharacter");
			ElementRemove("InputName");
			ElementRemove("InputPassword1");
			ElementRemove("InputPassword2");
			ElementRemove("InputEmail");
			CommonSetScreen("Room", "MainHall");

			// A maid will introduce the player to the club and explain the basic rules
			MainHallMaidIntroduction();

		} else CreationMessage = TextGet("Error") + " " + data.ServerAnswer;		
	} else {
		if ((data != null) && (typeof data === "string")) CreationMessage = data;
		else CreationMessage = TextGet("InvalidServerAnswer");
	}
}

// When the user clicks on the character creation screen
function CreationClick() {

	// If we must check or uncheck the importation checkbox
	if ((MouseX >= 1480) && (MouseX <= 1544) && (MouseY >= 750) && (MouseY <= 814) && (ImportBondageCollegeData != null))
		ImportBondageCollegeData = !ImportBondageCollegeData;

	// If we must go back to the login screen
	if ((MouseX >= 1440) && (MouseX <= 1560) && (MouseY >= 920) && (MouseY <= 980)) {
		CreationExit();
	}
	
	// If we must try to create a new account (make sure we don't create it twice)
	if ((MouseX >= 1050) && (MouseX <= 1450) && (MouseY >= 825) && (MouseY <= 885) && (CreationMessage != TextGet("CreatingCharacter"))) {
		
		// First, we make sure both passwords are the same
		var CharacterName = ElementValue("InputCharacter");
		var Name = ElementValue("InputName");
		var Password1 = ElementValue("InputPassword1");
		var Password2 = ElementValue("InputPassword2");
		var Email = ElementValue("InputEmail");
		
		// If both password matches
		if (Password1 == Password2) {

			// Makes sure the data is valid
			var LN = /^[a-zA-Z0-9]+$/;
			var LS = /^[a-zA-Z ]+$/;
			var E = /^[a-zA-Z0-9@.!#$%&'*+/=?^_`{|}~-]+$/;
			if (CharacterName.match(LS) && Name.match(LN) && Password1.match(LN) && (Email.match(E) || Email == "") && (CharacterName.length > 0) && (CharacterName.length <= 20) && (Name.length > 0) && (Name.length <= 20) && (Password1.length > 0) && (Password1.length <= 20) && (Email.length <= 100)) {
				CreationMessage = TextGet("CreatingCharacter");
				ServerSend("AccountCreate", { Name: CharacterName, AccountName: Name, Password: Password1, Email: Email } );
			}
			else 
				CreationMessage = TextGet("InvalidData");

		} else CreationMessage = TextGet("BothPasswordDoNotMatch");
	}

}

// when the user exit this screen
function CreationExit() {
	ElementRemove("InputCharacter");
	ElementRemove("InputName");
	ElementRemove("InputPassword1");
	ElementRemove("InputPassword2");
	ElementRemove("InputEmail");
	CommonSetScreen("Character", "Login");
}