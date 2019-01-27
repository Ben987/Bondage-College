"use strict";
var WardrobeBackground = "PrivateDark";
var WardrobeCharacter = [];
var WardrobeSelection = -1;

// Loads the wardrobe screen
function WardrobeLoad() {
	WardrobeSelection = -1;
	for(var C = 0; C < 12; C++)
		WardrobeCharacter[C] = CharacterLoadFromStorage("BondageClubWardrobe" + Player.AccountName + C.toString());
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
		CharacterAppearanceCopy(WardrobeCharacter[WardrobeSelection], Player);

	// If we must save an outfit
	if ((MouseX >= 750) && (MouseX < 975) && (MouseY >= 25) && (MouseY < 90) && (WardrobeSelection >= 0)) {
		CharacterAppearanceCopy(Player, WardrobeCharacter[WardrobeSelection]);
		localStorage.setItem("BondageClubWardrobe" + Player.AccountName + WardrobeSelection.toString(), JSON.stringify(Player.Appearance));
	}
	
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