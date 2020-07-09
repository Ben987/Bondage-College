"use strict";
var WardrobeBackground = "PrivateDark";
var WardrobeCharacter = [];
var WardrobeSelection = -1;
var WardrobeOffset = 0;
var WardrobeSize = 24;

// Load the wardrobe character names
function WardrobeLoadCharacterNames() {
	if (Player.WardrobeCharacterNames == null) Player.WardrobeCharacterNames = [];
	var Push = false;
	while (Player.WardrobeCharacterNames.length <= WardrobeSize) {
		Player.WardrobeCharacterNames.push(Player.Name);
		Push = true;
	}
	if (Push) ServerSend("AccountUpdate", { WardrobeCharacterNames: Player.WardrobeCharacterNames });
}

// Makes sure the wardrobe is of the correct length
function WardrobeFixLength() {
	if (Player.Wardrobe != null) {
		if (Player.Wardrobe.length > WardrobeSize) Player.Wardrobe = Player.Wardrobe.slice(0, WardrobeSize - 1);
		while (Player.Wardrobe.length < WardrobeSize) Player.Wardrobe.push(null);
	}
}

// Loads all wardrobe characters 
function WardrobeLoadCharacters(Fast) {
	Fast = Fast == null ? false : Fast;
	var W = null;
	WardrobeLoadCharacterNames();
	if (Player.Wardrobe == null) Player.Wardrobe = [];
	for (var P = 0; P < WardrobeSize; P++) {
		if (WardrobeCharacter.length <= P && ((W == null) || !Fast)) {

			// Creates a character
			CharacterReset(Character.length, "Female3DCG");
			var C = Character[Character.length - 1];
			C.AccountName = "Wardrobe-" + P.toString();
			C.Name = Player.WardrobeCharacterNames[P];
			CharacterAppearanceBuildAssets(C);

			// Loads from player data or generates at full random
			if (Player.Wardrobe[P] != null) {
				C.Appearance = [];
				WardrobeFastLoad(C, P);
			} else {
				CharacterAppearanceFullRandom(C);
				WardrobeFastSave(C, P, false);
				W = P;
			}

			// Keep the character
			WardrobeCharacter.push(C);

		} else if (W != null) {

			// randomize only one character
			CharacterAppearanceFullRandom(WardrobeCharacter[W]);
			WardrobeFastSave(WardrobeCharacter[W], P, false);

		}
	}
	if (W != null) {
		WardrobeFixLength();
		if (Fast) WardrobeFastLoad(WardrobeCharacter[W], W);
		ServerSend("AccountUpdate", { Wardrobe: CharacterCompressWardrobe(Player.Wardrobe) });
	}
}

// Loads the wardrobe screen
function WardrobeLoad() {
	WardrobeSelection = -1;
	WardrobeLoadCharacters(false);
}

// Shows the wardrobe screen
function WardrobeRun() {
	DrawCharacter(Player, 0, 0, 1);
	DrawButton(500, 25, 225, 60, TextGet("Load"), "White");
	DrawButton(750, 25, 225, 60, TextGet("Save"), "White");
	DrawButton(1000, 25, 60, 60, "", "White", "Icons/Small/Next.png");
	DrawButton(1750, 25, 225, 60, TextGet("Return"), "White");
	DrawText(TextGet("SelectAppareance"), 1405, 60, "White", "Gray");
	for (var C = 0; C < 12; C++)
		if (C < 6) {
			DrawCharacter(WardrobeCharacter[C + WardrobeOffset], 500 + C * 250, 100, 0.45);
			if (WardrobeSelection == C + WardrobeOffset) DrawEmptyRect(500 + C * 250, 105, 225, 440, "Cyan");
		}
		else {
			DrawCharacter(WardrobeCharacter[C + WardrobeOffset], 500 + (C - 6) * 250, 550, 0.45);
			if (WardrobeSelection == C + WardrobeOffset) DrawEmptyRect(500 + (C - 6) * 250, 555, 225, 440, "Cyan");
		}
}

// Loads the character appearance screen and keeps a backup of the previous appearance
function WardrobeClick() {

	// If we must go back to the room
	if ((MouseX >= 1750) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 85))
		WardrobeExit();

	// If we must move to the next page
	if ((MouseX >= 1000) && (MouseX < 1060) && (MouseY >= 25) && (MouseY < 85)) {
		WardrobeOffset = WardrobeOffset + 12;
		if (WardrobeOffset >= WardrobeSize) WardrobeOffset = 0;
	}

	// If we must load a saved outfit
	if ((MouseX >= 500) && (MouseX < 725) && (MouseY >= 25) && (MouseY < 85) && (WardrobeSelection >= 0))
		WardrobeFastLoad(Player, WardrobeSelection);

	// If we must save an outfit
	if ((MouseX >= 750) && (MouseX < 975) && (MouseY >= 25) && (MouseY < 85) && (WardrobeSelection >= 0))
		WardrobeFastSave(Player, WardrobeSelection);

	// If we must select a different wardrobe
	if ((MouseX >= 500) && (MouseX < 2000) && (MouseY >= 100) && (MouseY < 1000))
		for (var C = 0; C < 12; C++)
			if (C < 6) {
				if ((MouseX >= 500 + C * 250) && (MouseX <= 725 + C * 250) && (MouseY >= 100) && (MouseY <= 450))
					WardrobeSelection = C + WardrobeOffset;
			}
			else
				if ((MouseX >= 500 + (C - 6) * 250) && (MouseX <= 725 + (C - 6) * 250) && (MouseY >= 550) && (MouseY <= 1000))
					WardrobeSelection = C + WardrobeOffset;
}

// when the user exit this screen
function WardrobeExit() {
	CommonSetScreen("Room", "Private");
}

// Set a wardrobe character name, sync it with server
function WardrobeSetCharacterName(W, Name, Push) {
	Player.WardrobeCharacterNames[W] = Name;
	if (WardrobeCharacter != null && WardrobeCharacter[W] != null) {
		WardrobeCharacter[W].Name = Name;
	}
	if (Push == null || Push != false) {
		ServerSend("AccountUpdate", { WardrobeCharacterNames: Player.WardrobeCharacterNames });
	}
}

// Bundle an asset in wardrobe format
function WardrobeAssetBundle(A) {
	return { Name: A.Asset.Name, Group: A.Asset.Group.Name, Color: A.Color };
}

// Load character appearance from wardrobe, only load clothes on others
function WardrobeFastLoad(C, W, Update) {
	var savedExpression = {};
	if (C == Player) savedExpression = WardrobeGetExpression(Player);
	if ((Player.Wardrobe != null) && (Player.Wardrobe[W] != null) && (Player.Wardrobe[W].length > 0)) {
		var AddAll = C.ID == 0 || C.AccountName.indexOf("Wardrobe-") == 0;
		C.Appearance = C.Appearance
			.filter(a => a.Asset.Group.Category != "Appearance" || (!a.Asset.Group.Clothing && !AddAll))
		Player.Wardrobe[W]
			.filter(w => w.Name != null && w.Group != null)
			.filter(w => C.Appearance.find(a => a.Asset.Group.Name == w.Group) == null)
			.forEach(w => {
				var A = Asset.find(a =>
					a.Group.Name == w.Group
					&& a.Group.Category == "Appearance"
					&& (AddAll || a.Group.Clothing)
					&& a.Name == w.Name
					&& (a.Value == 0 || InventoryAvailable(Player, a.Name, a.Group.Name)));
				if (A != null) CharacterAppearanceSetItem(C, w.Group, A, w.Color, 0, false);
			});
		// Adds any critical appearance asset that could be missing, adds the default one
		AssetGroup
			.filter(g => g.Category == "Appearance" && !g.AllowNone)
			.forEach(g => {
				if (C.Appearance.find(a => a.Asset.Group.Name == g.Name) == null) {
					C.Appearance.push({ Asset: Asset.find(a => a.Group.Name == g.Name), Difficulty: 0, Color: "Default" });
				}
			});
		// Restores the expressions the player had previously per item in the appearance
		if (C == Player) {
			Player.Appearance.forEach(item => {
				if (savedExpression[item.Asset.Group.Name] != null) {
					if (item.Property == null) item.Property = {};
					item.Property.Expression = savedExpression[item.Asset.Group.Name];
					
				}
			});
		}
		CharacterLoadCanvas(C);
		if (Update == null || Update) {
			if (C.ID == 0 && C.OnlineID != null) ServerPlayerAppearanceSync();
			if (C.ID == 0 || C.AccountName.indexOf("Online-") == 0) ChatRoomCharacterUpdate(C);
		}
	}
}

// Saves character appearance in Player's wardrobe, use Player's body as base for others
function WardrobeFastSave(C, W, Push) {
	if (Player.Wardrobe != null) {
		var AddAll = C.ID == 0 || C.AccountName.indexOf("Wardrobe-") == 0;
		Player.Wardrobe[W] = C.Appearance
			.filter(a => a.Asset.Group.Category == "Appearance")
			.filter(a => AddAll || a.Asset.Group.Clothing)
			.map(WardrobeAssetBundle);
		if (!AddAll) {
			// Using Player's body as base
			Player.Wardrobe[W] = Player.Wardrobe[W].concat(Player.Appearance
				.filter(a => a.Asset.Group.Category == "Appearance")
				.filter(a => !a.Asset.Group.Clothing)
				.map(WardrobeAssetBundle));
		}
		WardrobeFixLength();
		if (WardrobeCharacter != null && WardrobeCharacter[W] != null && C.AccountName != WardrobeCharacter[W].AccountName) WardrobeFastLoad(WardrobeCharacter[W], W);
		if ((Push == null) || Push) ServerSend("AccountUpdate", { Wardrobe: CharacterCompressWardrobe(Player.Wardrobe) });
	}
}

//Returns the expressions of character C as a single big object
function WardrobeGetExpression(C) {
	var characterExpression = {}
	ServerAppearanceBundle(C.Appearance).filter(item=>item.Property != null && item.Property.Expression != null).forEach(item => characterExpression[item.Group] = item.Property.Expression);
	return characterExpression;
}
