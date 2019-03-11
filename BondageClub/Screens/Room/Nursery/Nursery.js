"use strict";
var NurseryBackground = "Nursery";
var NurserySituation = null;
var NurseryJustClicked = null;
var NurseryNurse = null;
var NurseryABDL1 = null;
var NurseryABDL2 = null;
//var NurseryAdultBaby = null;
var NurseryPlayerAppearance = null;
//var NurseryNurseAppearance = null;
//var NurseryAdultBabyAppearance = null;
var RandomNumber = 0;
var RandomResult = null;
var RandomResultB = null;

// Returns TRUE if
function NurseryPlayerIsPacified() { return (CharacterAppearanceGetCurrentValue(Player, "ItemMouth", "Name") == "PacifierGag") }
function NurseryPlayerIsHarnessPacified() { return (CharacterAppearanceGetCurrentValue(Player, "ItemMouth", "Name") == "HarnessPacifierGag") }

// Loads the nursery room
function NurseryLoad() {
	if (NurseryPlayerAppearance == null) NurseryPlayerAppearance = Player.Appearance.slice();
	if (NurserySituation != null && CharacterAppearanceGetCurrentValue(Player, "Panties", "Name") != "Diapers1") NurserySituation = null;
	NurseryNurse = CharacterLoadNPC("NPC_Nursery_Nurse");
	NurseryNurseOutfitForNPC(NurseryNurse);
	NurseryABDL1 = CharacterLoadNPC("NPC_Nursery_ABDL1");
	if (CharacterAppearanceGetCurrentValue(NurseryABDL1, "Panties", "Name") != "Diapers1") NurseryABDLOutfitForNPC(NurseryABDL1);
	NurseryABDL2 = CharacterLoadNPC("NPC_Nursery_ABDL2");
	if (CharacterAppearanceGetCurrentValue(NurseryABDL2, "Panties", "Name") != "Diapers1") NurseryABDLOutfitForNPC(NurseryABDL2);
	NurseryNurse.AllowItem = false;
}

// Run the nursery
function NurseryRun() {
	if (NurserySituation == null) {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(NurseryNurse, 1000, 0, 1);
	}
	if (NurserySituation == "Admitted") {
		DrawCharacter(Player, 250, 0, 1);
		DrawCharacter(NurseryABDL1, 750, 0, 1);
		DrawCharacter(NurseryABDL2, 1250, 0, 1);
	}
	if (NurserySituation == "AtGate") {
		DrawCharacter(Player, 500, 0, 1);
		DrawImage("Screens/Room/Nursery/NurseryGate.png", 0, 0);
		DrawButton(1500, 25, 300, 75, "Escape - To do -", "White");
	}
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (NurserySituation == ("AtGate") || NurserySituation == ( "Admitted")) {
		DrawButton(1885, 265, 90, 90, "", "White", "Icons/Crying.png");
		if (CharacterAppearanceGetCurrentValue(Player, "ItemMouth", "Name") == "PacifierGag") DrawButton(1885, 385, 90, 90, "", "White", "Icons/SpitOutPacifier.png");
	}
}

// When the user clicks in the nursery
function NurseryClick() {
	if (NurserySituation == null) {
		if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(NurseryNurse);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) {
			NurseryPlayerAppearance = null;
			CommonSetScreen("Room", "MainHall");
		}
	}
	if (NurserySituation == "Admitted") {
		if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(NurseryABDL1);
		if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(NurseryABDL2);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) {
			NurserySituation = "AtGate";
			NurseryJustClicked = true;
		}
	}
	if (NurserySituation == "AtGate") {
		if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk() && !NurseryJustClicked) NurserySituation = "Admitted";
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if (NurserySituation == ("AtGate") || NurserySituation == ( "Admitted")) {
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355)) CharacterSetCurrent(NurseryNurse);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475)) NurseryPlayerSpitOutPacifier();
	}
	NurseryJustClicked = null;
}

// Sets the outfit for the NPC Nurse
function NurseryNurseOutfitForNPC(CurrentNPC) {
	InventoryWear(CurrentNPC, "NurseUniform", "Cloth", "Default");
	InventoryWear(CurrentNPC, "NurseCap", "Hat", "Default");
	InventoryWear(CurrentNPC, "Stockings2", "Socks", "Default");
}

// Sets the outfit for the NPC ABDL
function NurseryABDLOutfitForNPC(CurrentNPC) {
	CharacterNaked(CurrentNPC);
	NurseryRandomDressSelection();
	NurseryRandomColourSelection();
	InventoryWear(CurrentNPC, RandomResultB, "Cloth", RandomResult);
	InventoryWear(CurrentNPC, "Diapers1", "Panties", "Default");
	RandomNumber = Math.floor(Math.random() * 7);
	if (RandomNumber == 1 ) {
		InventoryWear(CurrentNPC, "PacifierGag", "ItemMouth");
	}
	if (RandomNumber == 2 ) {
		InventoryWear(CurrentNPC, "PacifierGag", "ItemMouth");
		InventoryWear(CurrentNPC, "PaddedMittens", "ItemArms");
	}
	if (RandomNumber == 3 ) {
		InventoryWear(CurrentNPC, "PacifierGag", "ItemMouth");
		InventoryWear(CurrentNPC, "PaddedMittensHarness", "ItemArms");
		InventoryWear(CurrentNPC, "AdultBabyHarness", "ItemTorso");
	}
	if (RandomNumber == 4 ) {
		InventoryWear(CurrentNPC, "HarnessPacifierGag", "ItemMouth");
		InventoryWear(CurrentNPC, "PaddedMittensHarnessLocked", "ItemArms");
		InventoryWear(CurrentNPC, "AdultBabyHarness", "ItemTorso");
	}
	if (RandomNumber >= 5 ) {
		InventoryWear(CurrentNPC, "PaddedMittens", "ItemArms");
	}
	//if (RandomNumber != 0 ) {
	//	if (RandomNumber == 1) RandomResult = "PacifierGag";
	//	if (RandomNumber == 2) RandomResult = "HarnessPacifierGag";
	//	InventoryWear(CurrentNPC, RandomResult, "ItemMouth");
	//}
	//RandomNumber = Math.floor(Math.random() * 3);
	//if (RandomNumber != 0 ) {
	//	if (RandomNumber == 1) RandomResult = "PaddedMittens";
	//	if (RandomNumber == 2) RandomResult = "PaddedMittensLocked";
	//	InventoryWear(CurrentNPC, RandomResult, "ItemArms");
	//}
}

// Random dress selection
function NurseryRandomDressSelection() {
	RandomNumber = Math.floor(Math.random() * 3);
	if (RandomNumber == 0) RandomResultB = "AdultBabyDress1";
	if (RandomNumber == 1) RandomResultB = "AdultBabyDress2";
	if (RandomNumber == 2) RandomResultB = "AdultBabyDress3";
}

// Random selection for dress colours
function NurseryRandomColourSelection() {
	RandomNumber = Math.floor(Math.random() * 12);
	if (RandomNumber == 0) RandomResult = "Default";
	if (RandomNumber == 1) RandomResult = "#808080";
	if (RandomNumber == 2) RandomResult = "#aa8080";
	if (RandomNumber == 3) RandomResult = "#80aa80";
	if (RandomNumber == 4) RandomResult = "#8080aa";
	if (RandomNumber == 5) RandomResult = "#8194ff";
	if (RandomNumber == 6) RandomResult = "#80aaaa";
	if (RandomNumber == 7) RandomResult = "#aa80aa";
	if (RandomNumber == 8) RandomResult = "#898c00";
	if (RandomNumber == 9) RandomResult = "#008402";
	if (RandomNumber == 10) RandomResult = "#840000";
	if (RandomNumber == 11) RandomResult = "#5f38ff";
}

// When the player undresses ready to join the nursery
function NurseryPlayerUndress() {
	CharacterRelease(Player);
	InventoryRemove(Player, "ItemTorso");
	CharacterNaked(Player);
}

// When the player puts on diapers or has them put on
function NurseryPlayerGetsDiapered(DomChange) {
	ReputationProgress("Dominant", DomChange)
	ReputationProgress("ABDL", 1)
	InventoryWear(Player, "Diapers1", "Panties", "Default");
	NurserySituation = "Admitted";
}

// When the player puts on a AB dress or has it put on
function NurseryPlayerWearBabyDress() {
	NurseryRandomDressSelection();
	NurseryRandomColourSelection();
	InventoryWear(Player, RandomResultB, "Cloth", RandomResult);
}

// Restraints used on player
function NurseryPlayerRestrained(RestraintSet) {
	if (RestraintSet == 1) {
		InventoryWear(Player, "PaddedMittens", "ItemArms", "Default");
		InventoryWear(Player, "PacifierGag", "ItemMouth", "Default");
	}
	if (RestraintSet == 2) {
		InventoryWear(Player, "PaddedMittensHarness", "ItemArms", "Default");
		InventoryWear(Player, "AdultBabyHarness", "ItemTorso", "Default");
	}
	if (RestraintSet == 3) {
		InventoryWear(Player, "HarnessPacifierGag", "ItemMouth", "Default");
		InventoryWear(Player, "PaddedMittensHarnessLocked", "ItemArms", "Default");
	}
}

// Player can spits out regular pacifier
function NurseryPlayerSpitOutPacifier() {
	InventoryRemove(Player, "ItemMouth")
}

// Player released and changed back into regular clothes
function NurseryPlayerRedressed() {
	NurseryPlayerUndress();
	CharacterDress(Player, NurseryPlayerAppearance);
	NurserySituation = null;
}