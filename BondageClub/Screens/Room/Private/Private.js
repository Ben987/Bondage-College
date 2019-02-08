"use strict";
var PrivateBackground = "Private";
var PrivateVendor = null;
var PrivateCharacter = [];
var PrivateCharacterTypeList = ["NPC_Private_VisitorShy", "NPC_Private_VisitorHorny", "NPC_Private_VisitorTough"];
var PrivateCharacterToSave = 0;
var PrivateReleaseTimer = 0;

// Returns TRUE if a specific dialog option is allowed
function PrivateIsCaged() { return (CurrentCharacter.Cage == null) ? false : true }
function PrivateVendorCanPlay() { return (LogQuery("RentRoom", "PrivateRoom") && LogQuery("Wardrobe", "PrivateRoom") && LogQuery("Cage", "PrivateRoom") && Player.CanInteract() && PrivateVendor.CanInteract()) }
function PrivateAllowChange() { return (!CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") + 25 >= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateWontChange() { return (!CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") + 25 < NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateIsRestrained() { return (CurrentCharacter.IsRestrained()) }
function PrivateAllowRestain() { return (CurrentCharacter.IsRestrained() || (ReputationGet("Dominant") + 25 >= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateNobodyGagged() { return (Player.CanTalk() && CurrentCharacter.CanTalk()) }
function PrivateCanMasturbate() { return (CharacterIsNaked(CurrentCharacter) && !CurrentCharacter.IsVulvaChaste() && !Player.IsRestrained()) }
function PrivateCanFondle() { return (!CurrentCharacter.IsBreastChaste() && !Player.IsRestrained()) }
function PrivateAllowRestainPlayer() { return (!Player.IsRestrained() && !CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") - 25 <= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateWontRestainPlayer() { return (!Player.IsRestrained() && !CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") - 25 > NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateAllowReleasePlayer() { return (Player.IsRestrained() && CurrentCharacter.CanInteract() && CommonTime() > PrivateReleaseTimer) }
function PrivateWontReleasePlayer() { return (Player.IsRestrained() && CurrentCharacter.CanInteract() && CommonTime() <= PrivateReleaseTimer) }
function PrivateWillKneel() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling() && (ReputationGet("Dominant") > NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateWontKneel() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling() && (ReputationGet("Dominant") <= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateCannotKneel() { return (!CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling()) }
function PrivateCanStandUp() { return (CurrentCharacter.CanKneel() && CurrentCharacter.IsKneeling()) }
function PrivateCannotStandUp() { return (!CurrentCharacter.CanKneel() && CurrentCharacter.IsKneeling()) }
function PrivateKneel() { CharacterSetActivePose(CurrentCharacter, (CurrentCharacter.ActivePose == null) ? "Kneel" : null); }

// Loads the private room vendor NPC
function PrivateLoad() {
	
	// Loads the vendor and NPC from storage
	PrivateVendor = CharacterLoadNPC("NPC_Private_Vendor");
	PrivateVendor.AllowItem = false;
	if (PrivateCharacter.length == 0) {
		PrivateCharacter.push(Player);
		PrivateLoadCharacter(1);
		PrivateLoadCharacter(2);
		PrivateLoadCharacter(3);
	} else {
		NPCTraitDialog(PrivateVendor);
		for(var C = 1; C < PrivateCharacter.length; C++)
			NPCTraitDialog(PrivateCharacter[C]);
	}

	// Checks if we allow items on each NPC based on their trait and dominant reputation of the player
	if (PrivateCharacter.length >= 2) PrivateCharacter[1].AllowItem = ((ReputationGet("Dominant") + 25 >= NPCTraitGet(PrivateCharacter[1], "Dominant")) || PrivateCharacter[1].IsRestrained());
	if (PrivateCharacter.length >= 3) PrivateCharacter[2].AllowItem = ((ReputationGet("Dominant") + 25 >= NPCTraitGet(PrivateCharacter[2], "Dominant")) || PrivateCharacter[2].IsRestrained());
	if (PrivateCharacter.length >= 4) PrivateCharacter[3].AllowItem = ((ReputationGet("Dominant") + 25 >= NPCTraitGet(PrivateCharacter[3], "Dominant")) || PrivateCharacter[3].IsRestrained());

}

// Draw all the characters in the private room
function PrivateDrawCharacter() {

	// Defines the character position in the private screen
	var X = 1000 - PrivateCharacter.length * 250;
	var S = (PrivateCharacter.length == 4) ? 470 : 500;

	// For each character to draw
	for(var C = 0; C < PrivateCharacter.length; C++) {
		if (PrivateCharacter[C].Cage != null) DrawImage("Screens/Room/Private/CageBack.png", X + C * S, 0);
		DrawCharacter(PrivateCharacter[C], X + C * S, 0, 1);
		if (PrivateCharacter[C].Cage != null) DrawImage("Screens/Room/Private/CageFront.png", X + C * S, 0);
		DrawButton(X + 145 + C * S, 900, 90, 90, "", "White", "Icons/Character.png");
		if (LogQuery("Cage", "PrivateRoom"))
			if ((Player.Cage == null) || (C == 0))
				DrawButton(X + 265 + C * S, 900, 90, 90, "", "White", "Icons/Cage.png");
	}
	
}

// Run the private room
function PrivateRun() {
	
	// The vendor is only shown if the room isn't rent
	if (LogQuery("RentRoom", "PrivateRoom")) {
		PrivateDrawCharacter();
		if ((Player.Cage == null) && Player.CanWalk()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Shop.png");
		DrawButton(1885, 385, 90, 90, "", "White", "Icons/Dress.png");
		if (LogQuery("Wardrobe", "PrivateRoom")) DrawButton(1885, 505, 90, 90, "", "White", "Icons/Wardrobe.png");
	} else {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(PrivateVendor, 1000, 0, 1);
	}
	
	// Standard buttons
	if (Player.CanWalk() && (Player.Cage == null)) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	if (Player.CanKneel()) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Kneel.png");
	
	// If we must save a character status after a dialog
	if (PrivateCharacterToSave > 0) {
		PrivateSaveCharacter(PrivateCharacterToSave);
		PrivateCharacterToSave = 0;
	}

}

// Checks if the user clicked on a cage button
function PrivateClickCharacterButton() {
	
	// Defines the character position in the private screen
	var X = 1000 - PrivateCharacter.length * 250;
	var S = (PrivateCharacter.length == 4) ? 470 : 500;

	// For each character, we find the one to cage, doesn't allow to do it if already in a cage
	for(var C = 0; C < PrivateCharacter.length; C++) {
		if ((MouseX >= X + 265 + C * S) && (MouseX <= X + 355 + C * S))
			if ((Player.Cage == null) || (C == 0)) {
				PrivateCharacter[C].Cage = (PrivateCharacter[C].Cage == null) ? true : null;
				PrivateSaveCharacter(C);
			}
		if ((MouseX >= X + 145 + C * S) && (MouseX <= X + 235 + C * S))
			InformationSheetLoadCharacter(PrivateCharacter[C]);
	}

}

// Checks if the user clicked on a character
function PrivateClickCharacter() {

	// Defines the character position in the private screen
	var X = 1000 - PrivateCharacter.length * 250;
	var S = (PrivateCharacter.length == 4) ? 470 : 500;

	// For each character, we find the one that was clicked and open it's dialog
	for(var C = 0; C < PrivateCharacter.length; C++)
		if ((MouseX >= X + C * S) && (MouseX <= X + S + C * S)) {
			PrivateCharacterToSave = C;
			CharacterSetCurrent(PrivateCharacter[C]);
		}

}

// When the user clicks in the private room
function PrivateClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000) && !LogQuery("RentRoom", "PrivateRoom")) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && !LogQuery("RentRoom", "PrivateRoom")) CharacterSetCurrent(PrivateVendor);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk() && (Player.Cage == null)) { CharacterAppearanceValidate(Player); CommonSetScreen("Room", "MainHall"); }
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235) && LogQuery("RentRoom", "PrivateRoom") && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && LogQuery("RentRoom", "PrivateRoom") && Player.CanWalk() && (Player.Cage == null)) CharacterSetCurrent(PrivateVendor);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && LogQuery("RentRoom", "PrivateRoom")) { CharacterAppearanceReturnRoom = "Private"; CommonSetScreen("Character", "Appearance"); }
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 505) && (MouseY < 595) && LogQuery("RentRoom", "PrivateRoom") && LogQuery("Wardrobe", "PrivateRoom")) CommonSetScreen("Character", "Wardrobe");
	if ((MouseX <= 1885) && (MouseY < 900) && LogQuery("RentRoom", "PrivateRoom") && (Player.Cage == null)) PrivateClickCharacter();
	if ((MouseX <= 1885) && (MouseY >= 900) && LogQuery("RentRoom", "PrivateRoom") && LogQuery("Cage", "PrivateRoom")) PrivateClickCharacterButton();
}

// When the player rents the room
function PrivateRentRoom() {
	CharacterChangeMoney(Player, -250);
	LogAdd("RentRoom", "PrivateRoom");
}

// When the player gets the wardrobe
function PrivateGetWardrobe() {
	CharacterChangeMoney(Player, -100);
	LogAdd("Wardrobe", "PrivateRoom");
}

// When the player gets the cage
function PrivateGetCage() {
	CharacterChangeMoney(Player, -150);
	LogAdd("Cage", "PrivateRoom");
}

// Loads the private room character
function PrivateLoadCharacter(ID) {
	var Char = JSON.parse(localStorage.getItem("BondageClubPrivateRoomCharacter" + Player.AccountName + ID.toString()));
	if (Char != null) {
		var C = CharacterLoadNPC("NPC_Private_Custom");
		C.Name = Char.Name;
		C.AccountName = "NPC_Private_Custom" + ID.toString();
		if (Char.Appearance != null) C.Appearance = Char.Appearance.slice();
		if (Char.AppearanceFull != null) C.AppearanceFull = Char.AppearanceFull.slice();
		if (Char.Trait != null) C.Trait = Char.Trait.slice();
		if (Char.Cage != null) C.Cage = Char.Cage;
		AssetReload(C);
		NPCTraitDialog(C);
		CharacterRefresh(C);
		PrivateCharacter.push(C);
	}
}

// Saves the private room character info
function PrivateSaveCharacter(ID) {
	if (PrivateCharacter[ID] != null) {
		var C = {
			Name: PrivateCharacter[ID].Name,
			Trait: PrivateCharacter[ID].Trait,
			Cage: PrivateCharacter[ID].Cage,
			AccountName: PrivateCharacter[ID].AccountName,
			Appearance: PrivateCharacter[ID].Appearance.slice(),
			AppearanceFull: PrivateCharacter[ID].AppearanceFull.slice()
		};
		localStorage.setItem("BondageClubPrivateRoomCharacter" + Player.AccountName + ID.toString(), JSON.stringify(C));
	} else localStorage.removeItem("BondageClubPrivateRoomCharacter" + Player.AccountName + ID.toString());
};

// When a new character is added to the room
function PrivateAddCharacter(Template) {
	var C = CharacterLoadNPC("NPC_Private_Custom");
	C.Name = Template.Name;
	C.AccountName = "NPC_Private_Custom" + PrivateCharacter.length.toString();
	C.Appearance = Template.Appearance.slice();
	C.AppearanceFull = Template.Appearance.slice();
	NPCTraitGenerate(C);
	NPCTraitDialog(C);
	CharacterRefresh(C);
	PrivateCharacter.push(C);
	PrivateSaveCharacter(PrivateCharacter.length - 1);
	C.AllowItem = ((ReputationGet("Dominant") + 25 >= NPCTraitGet(C, "Dominant")) || C.IsRestrained());
}

// Returns the ID of the private room current character
function PrivateGetCurrentID() {
	if ((PrivateCharacter[3] != null) && (CurrentCharacter.Name == PrivateCharacter[3].Name)) return 3;
	if ((PrivateCharacter[2] != null) && (CurrentCharacter.Name == PrivateCharacter[2].Name)) return 2;
	return 1;
}

// When the player kicks out a character
function PrivateKickOut() {
	var ID = PrivateGetCurrentID();
	PrivateCharacter[ID] = null;
	PrivateCharacter.splice(ID, 1);
	PrivateSaveCharacter(1);
	PrivateSaveCharacter(2);
	PrivateSaveCharacter(3);
	if (PrivateCharacter[1] != null) PrivateCharacter[1].AccountName = "NPC_Private_Custom1";
	if (PrivateCharacter[2] != null) PrivateCharacter[2].AccountName = "NPC_Private_Custom2";
	DialogLeave();
}

// When the player tells the character to change
function PrivateChange(NewCloth) {
	if (NewCloth == "Cloth") CharacterDress(CurrentCharacter, CurrentCharacter.AppearanceFull);
	if (NewCloth == "Underwear") CharacterUnderwear(CurrentCharacter, CurrentCharacter.AppearanceFull);
	if (NewCloth == "Naked") CharacterNaked(CurrentCharacter);
}

// When a custom NPC restrains the player, there's a minute timer before release
function PrivateRestrainPlayer() {
	CharacterFullRandomRestrain(Player);
	PrivateReleaseTimer = CommonTime() + 60000;
}