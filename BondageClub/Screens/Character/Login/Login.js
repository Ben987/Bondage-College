"use strict";
var LoginBackground = "Dressing";
var LoginMessage = "";
var LoginCredits = null;
var LoginCreditsPosition = 0;
var LoginThankYou = "";
var LoginThankYouList = ["Alvin", "Bryce", "Christian", "Dan", "Desch", "Dick", "Dini", "DonOlaf", "Escurse", "Ethan", "Greendragon", "John", "Kitten", "Laioken", "Lennart", "Michal", "Mindtie", "Misa",
						 "MunchyCat", "Nick", "Overlord", "Rashiash", "Robin", "Ryner", "Samuel", "Setsu", "Shadow", "Shinonon", "Simeon", "Sky", "Terry", "Victor", "William", "Winterisbest", "Xepherio"];
var LoginThankYouNext = 0;

// Loads the next thank you bubble
function LoginDoNextThankYou() {
	LoginThankYou = CommonRandomItemFromList(LoginThankYou, LoginThankYouList);
	CharacterRelease(Player);
	CharacterAppearanceFullRandom(Player);
	CharacterFullRandomRestrain(Player);
	LoginThankYouNext = CommonTime() + 4000;
}

// Draw the credits 
function LoginDrawCredits() {

	// For each credits in the list
	LoginCreditsPosition++;
	MainCanvas.font = "30px Arial";
	for(var C = 0; C < LoginCredits.length; C++) {

		// Sets the Y position (it scrolls from bottom to top)
		var Y = 800 - Math.floor(LoginCreditsPosition * 2) + (C * 50);

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
	ElementCreateInput("InputName", "text", "", "20");
	ElementCreateInput("InputPassword", "password", "", "20");

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
	ElementPosition("InputName", 1000, 260, 500);
	DrawText(TextGet("Password"), 1000, 350, "White", "Black");
	ElementPosition("InputPassword", 1000, 410, 500);
	DrawButton(775, 500, 200, 60, TextGet("Login"), "White", "");
	DrawButton(1025, 500, 200, 60, TextGet("Language"), "White", "");
	DrawText(TextGet("CreateNewCharacter"), 1000, 670, "White", "Black");
	DrawButton(825, 740, 350, 60, TextGet("NewCharacter"), "White", "");
	DrawButton(825, 870, 350, 60, TextGet(CheatAllow ? "Cheats" : "PasswordReset"), "White", "");

	// Draw the character and thank you bubble
	DrawCharacter(Player, 1400, 100, 0.9);
	if (LoginThankYouNext < CommonTime()) LoginDoNextThankYou();
	DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 1400, 16);
	DrawText(TextGet("ThankYou") + " " + LoginThankYou, 1625, 53, "Black", "Gray");

}

// Make sure the slave collar is equipped or unequipped based on the owner
function LoginValidCollar() {
 	if (InventoryIsWorn(Player, "ItemNeck", "SlaveCollar") && (Player.Owner == "")) InventoryRemove(Player, "ItemNeck");
 	if ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name != "SlaveCollar") && (InventoryGet(Player, "ItemNeck").Asset.Name != "ClubSlaveCollar") && (Player.Owner != "")) InventoryRemove(Player, "ItemNeck");
	if ((InventoryGet(Player, "ItemNeck") == null) && (Player.Owner != "")) InventoryWear(Player, "SlaveCollar", "ItemNeck");
}

// Only players that are club Mistresses can have the Mistress Padlock & Key
function LoginMistressItems() {
	if (LogQuery("ClubMistress", "Management")) {
		InventoryAdd(Player, "MistressGloves", "Gloves", false);
		InventoryAdd(Player, "MistressBoots", "Shoes", false);
		InventoryAdd(Player, "MistressTop", "Cloth", false);
		InventoryAdd(Player, "MistressBottom", "ClothLower", false);
		InventoryAdd(Player, "MistressPadlock", "ItemMisc", false);
		InventoryAdd(Player, "MistressPadlockKey", "ItemMisc", false);
	} else {
		InventoryDelete(Player, "MistressPadlock", "ItemMisc", false);
		InventoryDelete(Player, "MistressPadlockKey", "ItemMisc", false);
		InventoryDelete(Player, "MistressGloves", "Gloves", false);
		InventoryDelete(Player, "MistressBoots", "Shoes", false);
		InventoryDelete(Player, "MistressTop", "Cloth", false);
		InventoryDelete(Player, "MistressBottom", "ClothLower", false);
	}
	ServerPlayerInventorySync();
}

// Only players that are ponies or trainers can have the pony equipment
function LoginStableItems() {
	if (LogQuery("JoinedStable", "PonyExam") || LogQuery("JoinedStable", "TrainerExam")) {
		InventoryAdd(Player, "HarnessPonyBits", "ItemMouth", false);
		InventoryAdd(Player, "PonyBoots", "Shoes", false);
		InventoryAdd(Player, "PonyBoots", "ItemBoots", false);
	} else {
		InventoryDelete(Player, "HarnessPonyBits", "ItemMouth", false);
		InventoryDelete(Player, "PonyBoots", "Shoes", false);
		InventoryDelete(Player, "PonyBoots", "ItemBoots", false);
	}
	ServerPlayerInventorySync();
}

// When the character logs, we analyze the data
function LoginResponse(C) {

	// If the return package contains a name and a account name
	if (typeof C === "object") {
		if ((C.Name != null) && (C.AccountName != null)) {

			// Make sure we have values
			LoginMessage = "";
			if (C.Appearance == null) C.Appearance = [];
			if (C.AssetFamily == null) C.AssetFamily = "Female3DCG";

			// Sets the player character info
			Player.Name = C.Name;
			Player.AccountName = C.AccountName;
			Player.AssetFamily = C.AssetFamily;
			Player.Title = C.Title;
			if (CommonIsNumeric(C.Money)) Player.Money = C.Money;
			Player.Owner = ((C.Owner == null) || (C.Owner == "undefined")) ? "" : C.Owner;
			Player.Lover = ((C.Lover == null) || (C.Lover == "undefined")) ? "" : C.Lover;
			Player.Description = C.Description;
			Player.Creation = C.Creation;
			Player.Wardrobe = C.Wardrobe;
			Player.OnlineID = C.ID.toString();
			Player.MemberNumber = C.MemberNumber;
			Player.BlockItems = ((C.BlockItems == null) || !Array.isArray(C.BlockItems)) ? [] : C.BlockItems;
			Player.WardrobeCharacterNames = C.WardrobeCharacterNames;
			WardrobeCharacter = [];

			// Loads the ownership data
			Player.Ownership = C.Ownership;
			if ((Player.Ownership != null) && (Player.Ownership.Name != null))
				Player.Owner = (Player.Ownership.Stage == 1) ? Player.Ownership.Name : "";

			// Gets the online preferences
			Player.LabelColor = C.LabelColor;
			Player.ItemPermission = C.ItemPermission;
			Player.ChatSettings = C.ChatSettings;
			Player.VisualSettings = C.VisualSettings;
			Player.AudioSettings = C.AudioSettings;
			Player.GameplaySettings = C.GameplaySettings;
			Player.WhiteList = C.WhiteList;
			Player.BlackList = C.BlackList;
			Player.FriendList = C.FriendList;

			// Loads the player character model and data
			Player.Appearance = ServerAppearanceLoadFromBundle(Player, C.AssetFamily, C.Appearance);
			InventoryLoad(Player, C.Inventory);
			LogLoad(C.Log);
			ReputationLoad(C.Reputation);
			SkillLoad(C.Skill);
			CharacterLoadCSVDialog(Player);
			PrivateCharacterMax = (LogQuery("Expansion", "PrivateRoom")) ? 8 : 4;
			CharacterRefresh(Player, false);
			ElementRemove("InputName");
			ElementRemove("InputPassword");
			if (ManagementIsClubSlave()) CharacterNaked(Player);

			// Starts the game in the main hall while loading characters in the private room
			PrivateCharacter = [];
			PrivateCharacter.push(Player);
			if (C.PrivateCharacter != null)
				for(var P = 0; P < C.PrivateCharacter.length; P++)
					PrivateCharacter.push(C.PrivateCharacter[P]);
			SarahSetStatus();

			// Fixes a few items
			InventoryRemove(Player, "ItemMisc");
			if (LogQuery("JoinedSorority", "Maid") && !InventoryAvailable(Player, "MaidOutfit2", "Cloth")) InventoryAdd(Player, "MaidOutfit2", "Cloth");
			if (InventoryIsWorn(Player, "ItemArms", "FourLimbsShackles")) InventoryRemove(Player, "ItemArms");
			LoginValidCollar();
			LoginMistressItems();
			LoginStableItems();
			CharacterAppearanceValidate(Player);

			// If the player must log back in the cell
			if (LogQuery("Locked", "Cell")) {
				CommonSetScreen("Room", "Cell");
			} else {

				// If the player must log back in the asylum
				if (LogQuery("Committed", "Asylum")) {
					CharacterRelease(Player);
					AsylumEntranceWearPatientClothes(Player);
					if (ReputationGet("Asylum") <= -50) AsylumEntrancePlayerJacket("Normal");
					CommonSetScreen("Room", "AsylumBedroom");
				} else {

					// If the player must start in her room, in her cage
					if (LogQuery("SleepCage", "Rule") && (Player.Owner != "") && PrivateOwnerInRoom()) {
						InventoryRemove(Player, "ItemFeet");
						InventoryRemove(Player, "ItemLegs");
						Player.Cage = true;
						CharacterSetActivePose(Player, "Kneel");
						CommonSetScreen("Room", "Private");
					} else {
						CommonSetScreen("Room", "MainHall");
						MainHallMaidIntroduction();
					}

				}

			}

		} else LoginMessage = TextGet("ErrorLoadingCharacterData");
	} else LoginMessage = TextGet(C);

}

// When the user clicks on the character login screen
function LoginClick() {
	
	// Opens the cheat panel
	if (CheatAllow && ((MouseX >= 825) && (MouseX <= 1175) && (MouseY >= 870) && (MouseY <= 930))) {
		ElementRemove("InputName");
		ElementRemove("InputPassword");
		CommonSetScreen("Character", "Cheat");
	}

	// Opens the password reset screen
	if (!CheatAllow && ((MouseX >= 825) && (MouseX <= 1175) && (MouseY >= 870) && (MouseY <= 930))) {
		ElementRemove("InputName");
		ElementRemove("InputPassword");
		CommonSetScreen("Character", "PasswordReset");
	}

	// If we must create a new character
	if ((MouseX >= 825) && (MouseX <= 1175) && (MouseY >= 740) && (MouseY <= 800)) {
		ElementRemove("InputName");
		ElementRemove("InputPassword");
		CharacterAppearanceSetDefault(Player);
		InventoryRemove(Player, "ItemFeet");
		InventoryRemove(Player, "ItemLegs");
		InventoryRemove(Player, "ItemArms");
		CharacterAppearanceLoadCharacter(Player);
	}
	
	// Try to login
	if ((MouseX >= 775) && (MouseX <= 975) && (MouseY >= 500) && (MouseY <= 560)) {
		LoginDoLogin();
	}

	// If we must change the language
	if ((MouseX >= 1025) && (MouseX <= 1225) && (MouseY >= 500) && (MouseY <= 560)) {
		TranslationNextLanguage();
		TextLoad();
		AssetLoadDescription("Female3DCG");
		LoginMessage = "";
	}
	
}

// When the user press "enter" we try to login
function LoginKeyDown() {
	if (KeyPress == 13) {
		LoginDoLogin();
	}
}

// If we must try to login (make sure we don't send the login query twice)
function LoginDoLogin() {
	if (LoginMessage != TextGet("ValidatingNamePassword")) {
		var Name = ElementValue("InputName");
		var Password = ElementValue("InputPassword");
		var letters = /^[a-zA-Z0-9]+$/;
		if (Name.match(letters) && Password.match(letters) && (Name.length > 0) && (Name.length <= 20) && (Password.length > 0) && (Password.length <= 20)) {
			LoginMessage = TextGet("ValidatingNamePassword");
			ServerSend("AccountLogin", { AccountName: Name, Password: Password });
		} else {
			LoginMessage = TextGet("InvalidNamePassword");
		}
	}
}