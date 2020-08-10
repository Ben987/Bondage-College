"use strict";
var LoginBackground = "Dressing";
var LoginMessage = "";
var LoginCredits = null;
var LoginCreditsPosition = 0;
var LoginThankYou = "";
var LoginThankYouList = ["Alvin", "BlueEyedCat", "BlueWiner", "Bryce", "Christian", "Desch", "Dini", "Epona", "Escurse", "Fluffythewhat", 
						 "Greendragon", "John", "Michal", "Mindtie", "Misa", "MuchyCat", "Mzklopyu", "Nera", "Nick", "Overlord", 
						 "Rashiash", "Ray", "Reire", "Robin", "Rutherford", "Ryner", "Samuel", "Setsu", "Shadow", "Sky", 
						 "Tam", "Thomas", "Trent", "William", "Xepherio"];
var LoginThankYouNext = 0;
var LoginSubmitted = false;
var LoginIsRelog = false;
var LoginErrorMessage = "";
/* DEBUG: To measure FPS - uncomment this and change the + 4000 to + 40
var LoginLastCT = 0;
var LoginFrameCount = 0;
var LoginFrameTotalTime = 0;*/

/**
 * Loads the next thank you bubble
 * @returns {void} Nothing
 */
function LoginDoNextThankYou() {
	LoginThankYou = CommonRandomItemFromList(LoginThankYou, LoginThankYouList);
	CharacterRelease(Player);
	CharacterAppearanceFullRandom(Player);
	CharacterFullRandomRestrain(Player);
	LoginThankYouNext = CommonTime() + 4000;
}

/**
 * Draw the credits
 * @returns {void} Nothing
 */
function LoginDrawCredits() {

	/* DEBUG: To measure FPS - uncomment this and change the + 4000 to + 40
	var CT = CommonTime();
	if (CT - LoginLastCT < 10000) {
		LoginFrameCount++;
		if (LoginFrameCount > 1000)
			LoginFrameTotalTime = LoginFrameTotalTime + CT - LoginLastCT;
	}
	LoginLastCT = CT;
	if (LoginFrameCount > 1000) DrawText("Average FPS: " + (1000 / (LoginFrameTotalTime / (LoginFrameCount - 1000))).toFixed(2).toString(), 1000, 975, "white");
	else DrawText("Calculating Average FPS...", 1000, 975, "white");*/

	// For each credits in the list
	LoginCreditsPosition++;
	MainCanvas.font = "30px Arial";
	for (let C = 0; C < LoginCredits.length; C++) {

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

/**
 * Loads the character login screen
 * @returns {void} Nothing
 */
function LoginLoad() {

	// Resets the player and other characters
	Character = [];
	CharacterReset(0, "Female3DCG");
	LoginDoNextThankYou();
	CharacterLoadCSVDialog(Player);
	LoginStatusReset();
	LoginErrorMessage = "";
	LoginUpdateMessage();
	if (LoginCredits == null) CommonReadCSV("LoginCredits", CurrentModule, CurrentScreen, "GameCredits");
	ActivityDictionaryLoad();
	OnlneGameDictionaryLoad();
	ElementCreateInput("InputName", "text", "", "20");
	ElementCreateInput("InputPassword", "password", "", "20");

}

/**
 * Runs the character login screen
 * @returns {void} Nothing
 */
function LoginRun() {

	// Draw the credits
	if (LoginCredits != null) LoginDrawCredits();

	if (!LoginMessage) LoginUpdateMessage();
	
	// Draw the login controls
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

/**
 * Make sure the slave collar is equipped or unequipped based on the owner
 * @returns {void} Nothing
 */
function LoginValidCollar() {
 	if ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name == "SlaveCollar") && (Player.Owner == "")) {
 		InventoryRemove(Player, "ItemNeck");
		InventoryRemove(Player, "ItemNeckAccessories");
		InventoryRemove(Player, "ItemNeckRestraints");
	}
 	if ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name != "SlaveCollar") && (InventoryGet(Player, "ItemNeck").Asset.Name != "ClubSlaveCollar") && (Player.Owner != "")) {
 		InventoryRemove(Player, "ItemNeck");
	}
	if ((InventoryGet(Player, "ItemNeck") == null) && (Player.Owner != "")) {
		InventoryWear(Player, "SlaveCollar", "ItemNeck");
		if (CurrentScreen == "ChatRoom") ChatRoomCharacterItemUpdate(Player, "ItemNeck");
	}
}

/**
 * Adds or confiscates Club Mistress items from the player. Only players that are club Mistresses can have the Mistress
 * Padlock & Key
 * @returns {void} Nothing
 */
function LoginMistressItems() {
	if (LogQuery("ClubMistress", "Management")) {
		InventoryAdd(Player, "MistressGloves", "Gloves", false);
		InventoryAdd(Player, "MistressBoots", "Shoes", false);
		InventoryAdd(Player, "MistressTop", "Cloth", false);
		InventoryAdd(Player, "MistressBottom", "ClothLower", false);
		InventoryAdd(Player, "MistressPadlock", "ItemMisc", false);
		InventoryAdd(Player, "MistressPadlockKey", "ItemMisc", false);
		InventoryAdd(Player, "MistressTimerPadlock", "ItemMisc", false);
	} else {
		InventoryDelete(Player, "MistressPadlock", "ItemMisc", false);
		InventoryDelete(Player, "MistressPadlockKey", "ItemMisc", false);
		InventoryDelete(Player, "MistressTimerPadlock", "ItemMisc", false);
		InventoryDelete(Player, "MistressGloves", "Gloves", false);
		InventoryDelete(Player, "MistressBoots", "Shoes", false);
		InventoryDelete(Player, "MistressTop", "Cloth", false);
		InventoryDelete(Player, "MistressBottom", "ClothLower", false);
	}
}

/**
 * Adds or confiscates pony equipment from the player. Only players that are ponies or trainers can have the pony
 * equipment.
 * @returns {void} Nothing
 */
function LoginStableItems() {
	if (LogQuery("JoinedStable", "PonyExam") || LogQuery("JoinedStable", "TrainerExam")) {
		InventoryAdd(Player, "HarnessPonyBits", "ItemMouth", false);
		InventoryAdd(Player, "HarnessPonyBits", "ItemMouth2", false);
		InventoryAdd(Player, "HarnessPonyBits", "ItemMouth3", false);
		InventoryAdd(Player, "PonyBoots", "Shoes", false);
		InventoryAdd(Player, "PonyBoots", "ItemBoots", false);
		InventoryAdd(Player,"PonyHood", "ItemHood", false);
		InventoryAdd(Player,"HoofMittens", "ItemHands", false);
	} else {
		InventoryDelete(Player, "HarnessPonyBits", "ItemMouth", false);
		InventoryDelete(Player, "HarnessPonyBits", "ItemMouth2", false);
		InventoryDelete(Player, "HarnessPonyBits", "ItemMouth3", false);
		InventoryDelete(Player, "PonyBoots", "Shoes", false);
		InventoryDelete(Player, "PonyBoots", "ItemBoots", false);
		InventoryDelete(Player, "PonyHood", "ItemHood",false)
		InventoryDelete(Player,"HoofMittens", "ItemHands", false);
	}
}

/**
 * Ensures lover-exclusive items are removed if the player has no lovers.
 * @returns {void} Nothing
 */
function LoginLoversItems() {
	var LoversNumbers = Player.GetLoversNumbers();

	//check to remove love leather collar slave collar if no lover
	if (LoversNumbers.length < 1) {
		var Collar = InventoryGet(Player,"ItemNeck");
		if (Collar && Collar.Property && (Collar.Asset.Name == "SlaveCollar") && (Collar.Property.Type == "LoveLeatherCollar")) {
			Collar.Property = null;
			Collar.Color = "Default";
		}
	}

	// remove any item that was lover locked if the number on the lock does not match any lover
	for (let A = 0; A < Player.Appearance.length; A++) {
		if (Player.Appearance[A].Property && Player.Appearance[A].Property.LockedBy && Player.Appearance[A].Property.LockedBy.startsWith("Lovers")
			&& Player.Appearance[A].Property.MemberNumber && (LoversNumbers.indexOf(Player.Appearance[A].Property.MemberNumber) < 0)) {
			InventoryRemove(Player, Player.Appearance[A].Asset.Group.Name);
			A--;
		}
	}
}

/**
 * Checks every owned item to see if its BuyGroup contains an item the player does not have. This allows the player to
 * collect any items that have been added to the game which are in a BuyGroup that they have already purchased.
 * @returns {void} Nothing
 */
function LoginValideBuyGroups() {
	for (let A = 0; A < Asset.length; A++)
		if ((Asset[A].BuyGroup != null) && InventoryAvailable(Player, Asset[A].Name, Asset[A].Group.Name))
			for (let B = 0; B < Asset.length; B++)
				if ((Asset[B] != null) && (Asset[B].BuyGroup != null) && (Asset[B].BuyGroup == Asset[A].BuyGroup) && !InventoryAvailable(Player, Asset[B].Name, Asset[B].Group.Name))
					InventoryAdd(Player, Asset[B].Name, Asset[B].Group.Name, false);
}

/**
 * Checks if the player arrays contains any item that does not exists and saves them.
 * @returns {void} Nothing
 */
function LoginValidateArrays() { 
	var CleanBlockItems = AssetCleanArray(Player.BlockItems);
	if (CleanBlockItems.length != Player.BlockItems.length) { 
		Player.BlockItems = CleanBlockItems;
		ServerSend("AccountUpdate", { BlockItems: Player.BlockItems });
	}
	
	var CleanLimitedItems = AssetCleanArray(Player.LimitedItems);
	if (CleanLimitedItems.length != Player.LimitedItems.length) { 
		Player.LimitedItems = CleanLimitedItems;
		ServerSend("AccountUpdate", { LimitedItems: Player.LimitedItems });
	}

	var CleanHiddenItems = AssetCleanArray(Player.HiddenItems);
	if (CleanHiddenItems.length != Player.HiddenItems.length) {
		Player.HiddenItems = CleanHiddenItems;
		ServerSend("AccountUpdate", { HiddenItems: Player.HiddenItems });
	}
}

/**
 * Handles player login response data
 * @param {Character | string} C - The Login response data - this will either be the player's character data if the
 * login was successful, or a string error message if the login failed.
 * @returns {void} Nothing
 */
function LoginResponse(C) {

	// If the return package contains a name and a account name
	if (typeof C === "object") {

		// In relog mode, we jump back to the previous screen, keeping the current game flow
		if (RelogData != null) {
			LoginUpdateMessage();
			ElementRemove("InputPassword");
			Player.OnlineID = C.ID.toString();
			CurrentModule = RelogData.Module;
			CurrentScreen = RelogData.Screen;
			CurrentCharacter = RelogData.Character;
			TextLoad();
			if ((ChatRoomData != null) && (ChatRoomData.Name != null) && (ChatRoomData.Name != "") && (RelogChatLog != null)) {
				CommonSetScreen("Online", "ChatSearch");
				ChatRoomPlayerCanJoin = true;
				ServerSend("ChatRoomJoin", { Name: ChatRoomData.Name });
			}
			return;
		}

		// In regular mode, we set the account properties for a new club session
		if ((C.Name != null) && (C.AccountName != null)) {

			// Make sure we have values
			if (C.Appearance == null) C.Appearance = [];
			if (C.AssetFamily == null) C.AssetFamily = "Female3DCG";

			// Sets the player character info
			Player.Name = C.Name;
			Player.AccountName = C.AccountName;
			Player.AssetFamily = C.AssetFamily;
			Player.Title = C.Title;
			if (CommonIsNumeric(C.Money)) Player.Money = C.Money;
			Player.Owner = ((C.Owner == null) || (C.Owner == "undefined")) ? "" : C.Owner;
			Player.Game = C.Game;
			Player.Description = C.Description;
			Player.Creation = C.Creation;
			Player.Wardrobe = CharacterDecompressWardrobe(C.Wardrobe);
			WardrobeFixLength();
			Player.OnlineID = C.ID.toString();
			Player.MemberNumber = C.MemberNumber;
			Player.BlockItems = ((C.BlockItems == null) || !Array.isArray(C.BlockItems)) ? [] : C.BlockItems;
			Player.LimitedItems = ((C.LimitedItems == null) || !Array.isArray(C.LimitedItems)) ? [] : C.LimitedItems;
			Player.HiddenItems = ((C.HiddenItems == null) || !Array.isArray(C.HiddenItems)) ? [] : C.HiddenItems;
			Player.WardrobeCharacterNames = C.WardrobeCharacterNames;
			WardrobeCharacter = [];

			// Loads the ownership data
			Player.Ownership = C.Ownership;
			if ((Player.Ownership != null) && (Player.Ownership.Name != null))
				Player.Owner = (Player.Ownership.Stage == 1) ? Player.Ownership.Name : "";

			// Ensures lovership data is compatible and converts lovers to lovership
			Player.Lovership = Array.isArray(C.Lovership) ? C.Lovership : C.Lovership != undefined ? [C.Lovership] : [];
			if ((C.Lover != null) && (C.Lover != "undefined") && C.Lover.startsWith("NPC-")) {
				Player.Lover = C.Lover;
				ServerPlayerSync();
			}

			// Gets the online preferences
			Player.LabelColor = C.LabelColor;
			Player.ItemPermission = C.ItemPermission;
			Player.ChatSettings = C.ChatSettings;
			Player.VisualSettings = C.VisualSettings;
			Player.AudioSettings = C.AudioSettings;
			Player.GameplaySettings = C.GameplaySettings;
			Player.ArousalSettings = C.ArousalSettings;
			Player.WhiteList = ((C.WhiteList == null) || !Array.isArray(C.WhiteList)) ? [] : C.WhiteList;
			Player.BlackList = ((C.BlackList == null) || !Array.isArray(C.BlackList)) ? [] : C.BlackList;
			Player.FriendList = ((C.FriendList == null) || !Array.isArray(C.FriendList)) ? [] : C.FriendList;
			Player.GhostList = ((C.GhostList == null) || !Array.isArray(C.GhostList)) ? [] : C.GhostList;

			// Loads the player character model and data
			Player.Appearance = ServerAppearanceLoadFromBundle(Player, C.AssetFamily, C.Appearance);
			InventoryLoad(Player, C.Inventory);
			LogLoad(C.Log);
			ReputationLoad(C.Reputation);
			SkillLoad(C.Skill);

			// Calls the preference init to make sure the preferences are loaded correctly
			PreferenceInit(Player);
			ActivitySetArousal(Player, 0);
			ActivityTimerProgress(Player, 0);

			// Loads the dialog and removes the login controls
			CharacterLoadCSVDialog(Player);
			PrivateCharacterMax = 4 + (LogQuery("Expansion", "PrivateRoom") ? 4 : 0) + (LogQuery("SecondExpansion", "PrivateRoom") ? 4 : 0);
			CharacterRefresh(Player, false);
			ElementRemove("InputName");
			ElementRemove("InputPassword");
			if (ManagementIsClubSlave()) CharacterNaked(Player);

			// Starts the game in the main hall while loading characters in the private room
			PrivateCharacter = [];
			PrivateCharacter.push(Player);
			if (C.PrivateCharacter != null)
				for (let P = 0; P < C.PrivateCharacter.length; P++)
					PrivateCharacter.push(C.PrivateCharacter[P]);
			SarahSetStatus();

			// Fixes a few items
			var InventoryBeforeFixes = InventoryStringify(Player);
			InventoryRemove(Player, "ItemMisc");
			if (LogQuery("JoinedSorority", "Maid") && !InventoryAvailable(Player, "MaidOutfit2", "Cloth")) InventoryAdd(Player, "MaidOutfit2", "Cloth", false);
			if ((InventoryGet(Player, "ItemArms") != null) && (InventoryGet(Player, "ItemArms").Asset.Name == "FourLimbsShackles")) InventoryRemove(Player, "ItemArms");
			LoginValidCollar();
			LoginMistressItems();
			LoginStableItems();
			LoginLoversItems();
			LoginValideBuyGroups();
			LoginValidateArrays();
			if (InventoryBeforeFixes != InventoryStringify(Player)) ServerPlayerInventorySync();
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

		} else {
            LoginStatusReset("ErrorLoadingCharacterData");
        }
	} else LoginStatusReset(C);
    LoginUpdateMessage();
}

/**
 * Handles player click events on the character login screen
 * @returns {void} Nothing
 */
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
		LoginUpdateMessage();
	}
	
}

/**
 * Handles player keyboard events on the character login screen, "enter" will login
 * @returns {void} Nothing
 */
function LoginKeyDown() {
	if (KeyPress == 13) LoginDoLogin();
}

/**
 * Attempt to log the user in based on their input username and password
 * @returns {void} Nothing
 */
function LoginDoLogin() {

    // Ensure the login request is not sent twice
	if (!LoginSubmitted) {
		var Name = ElementValue("InputName");
		var Password = ElementValue("InputPassword");
		var letters = /^[a-zA-Z0-9]+$/;
		if (Name.match(letters) && Password.match(letters) && (Name.length > 0) && (Name.length <= 20) && (Password.length > 0) && (Password.length <= 20)) {
		    LoginSetSubmitted();
			ServerSend("AccountLogin", { AccountName: Name, Password: Password });
		} else LoginStatusReset("InvalidNamePassword");
	}
    LoginUpdateMessage();

}

/**
 * Sets the state of the login page to the submitted state
 * @returns {void} Nothing
 */
function LoginSetSubmitted() {
    LoginSubmitted = true;
    if (ServerIsConnected) LoginErrorMessage = "";
}

/**
 * Resets the login submission state
 * @param {boolean} IsRelog - whether or not we're on the relog screen
 * @param {string} ErrorMessage - the login error message to set if the login is invalid - if not specified, will clear the login error message
 * @returns {void} Nothing
 */
function LoginStatusReset(ErrorMessage, IsRelog) {
    LoginSubmitted = false;
    LoginIsRelog = !!IsRelog;
    if (ErrorMessage) LoginErrorMessage = ErrorMessage;
}

/**
 * Updates the message on the login page
 * @returns {void} Nothing
 */
function LoginUpdateMessage() {
	LoginMessage = TextGet(LoginGetMessageKey());
}

/**
 * Retrieves the correct message key based on the current state of the login page
 * @returns {string} The key of the message to display
 */
function LoginGetMessageKey() {
    if (LoginErrorMessage) return LoginErrorMessage;
    else if (!ServerIsConnected) return "ConnectingToServer";
    else if (LoginSubmitted) return "ValidatingNamePassword";
    else return LoginIsRelog ? "EnterPassword" : "EnterNamePassword";
}
