"use strict";
var WardrobeBackground = "PrivateDark";
var WardrobeCharacter = [];
var WardrobeSelection = -1;

// Load the wardrobe character names
function WardrobeLoadCharacterNames() {
	if (Player.WardrobeCharacterNames == null) Player.WardrobeCharacterNames = [];
	var Push = false;
	while (Player.WardrobeCharacterNames.length <= 12) {
		Player.WardrobeCharacterNames.push(Player.Name);
		Push = true;
	}
	if (Push) {
		ServerSend("AccountUpdate", { WardrobeCharacterNames: Player.WardrobeCharacterNames });
	}
}

// Loads all wardrobe characters 
function WardrobeLoadCharacters(Fast) {
	Fast = Fast == null ? false : Fast;
	var W = null;
	WardrobeLoadCharacterNames();
	if (Player.Wardrobe == null) Player.Wardrobe = [];
	for (var P = 0; P < 12; P++) {
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
		if (Fast) {
			WardrobeFastLoad(WardrobeCharacter[W], W);
		}
		ServerSend("AccountUpdate", { Wardrobe: Player.Wardrobe });
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
	DrawButton(500, 25, 225, 65, TextGet("Load"), "White");
	DrawButton(750, 25, 225, 65, TextGet("Save"), "White");
	DrawButton(1750, 25, 225, 65, TextGet("Return"), "White");
	DrawText(TextGet("SelectAppareance"), 1375, 60, "White", "Gray");
	for(var C = 0; C < 12; C++)
		if (C < 6) {
			DrawCharacter(WardrobeCharacter[C], 500 + C * 250, 100, 0.45);
			if (WardrobeSelection == C) DrawEmptyRect(500 + C * 250, 105, 225, 440, "Cyan");
		}
		else {
			DrawCharacter(WardrobeCharacter[C], 500 + (C - 6) * 250, 550, 0.45);
			if (WardrobeSelection == C) DrawEmptyRect(500 + (C - 6) * 250, 555, 225, 440, "Cyan");
		}
}

// Loads the character appearance screen and keeps a backup of the previous appearance
function WardrobeClick() {
	
	// If we must go back to the room
	if ((MouseX >= 1750) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 90)) 
		CommonSetScreen("Room", "Private");
	
	// If we must load a saved outfit
	if ((MouseX >= 500) && (MouseX < 725) && (MouseY >= 25) && (MouseY < 90) && (WardrobeSelection >= 0))
		WardrobeFastLoad(Player, WardrobeSelection);

	// If we must save an outfit
	if ((MouseX >= 750) && (MouseX < 975) && (MouseY >= 25) && (MouseY < 90) && (WardrobeSelection >= 0))
		WardrobeFastSave(Player, WardrobeSelection);

	// If we must select a different wardrobe
	if ((MouseX >= 500) && (MouseX < 2000) && (MouseY >= 100) && (MouseY < 1000))
		for(var C = 0; C < 12; C++)
			if (C < 6) {
				if ((MouseX >= 500 + C * 250) && (MouseX <= 725 + C * 250) && (MouseY >= 100) && (MouseY <= 450))
					WardrobeSelection = C;
			}
			else {
				if ((MouseX >= 500 + (C - 6) * 250) && (MouseX <= 725 + (C - 6) * 250) && (MouseY >= 550) && (MouseY <= 1000))
					WardrobeSelection = C;
			}
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
function WardrobeFastLoad(C, W) {
	if (Player.Wardrobe != null && Player.Wardrobe[W] != null) {
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
		CharacterLoadCanvas(C);
		if (C.ID == 0 && C.OnlineID != null) ServerPlayerAppearanceSync();
		if (C.ID == 0 || C.AccountName.indexOf("Online-") == 0) ChatRoomCharacterUpdate(C);
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
		if (WardrobeCharacter != null && WardrobeCharacter[W] != null && C.AccountName != WardrobeCharacter[W].AccountName) {
			WardrobeFastLoad(WardrobeCharacter[W], W);
		}
		if (Push == null || Push) ServerSend("AccountUpdate", { Wardrobe: Player.Wardrobe });
	}
}