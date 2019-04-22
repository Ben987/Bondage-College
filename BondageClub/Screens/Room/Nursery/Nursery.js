"use strict";
var NurseryBackground = "Nursery";
var NurserySituation = null;
var NurseryJustClicked = null;
var NurseryNurse = null;
var NurseryABDL1 = null;
var NurseryABDL2 = null;
var NurseryPlayerIsBadBaby = false;
//var NurseryAdultBaby = null;
var NurseryPlayerAppearance = null;
//var NurseryNurseAppearance = null;
//var NurseryAdultBabyAppearance = null;
var RandomNumber = 0;
var RandomResult = null;
var RandomResultB = null;
var PreviousDress = "";
var PreviousDressColor = "";
var NurseryPlayerKeepsLoosingBinky = false;
var NurseryEventProgress = -1;
//var NurseryActivity = "";
//var NurseryProgress = 0;	
//var NurseryProgressAuto = 0;					

// Returns TRUE if
function NurseryPlayerIsPacified() { return (CharacterAppearanceGetCurrentValue(Player, "ItemMouth", "Name") == "PacifierGag") }
function NurseryPlayerIsHarnessPacified() { return (CharacterAppearanceGetCurrentValue(Player, "ItemMouth", "Name") == "HarnessPacifierGag") }
function NurseryPlayerLostBinky() { return Player.CanTalk() && !NurseryPlayerKeepsLoosingBinky }
function NurseryPlayerLostBinkyAgain() { return Player.CanTalk() && NurseryPlayerKeepsLoosingBinky }
function NurseryPlayerWearingBabyDress() { return (CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name") == "AdultBabyDress1" || CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name") == "AdultBabyDress2" || CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name") == "AdultBabyDress3") }
function NurseryPlayerPacified() { return !Player.CanTalk() && !NurseryPlayerIsBadBaby }
function NurseryPlayerPacifiedBad() { return !Player.CanTalk() && NurseryPlayerIsBadBaby }

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
	NurseryPlayerIsBadBaby = false;
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
		if (NurseryEventProgress >= 0) NurseryEventDrawProgress();
		else DrawButton(1500, 25, 300, 75, "Escape", "White");
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
			NurseryActivity = "GateEscape"
			NurseryJustClicked = true;
		}
	}
	if (NurserySituation == "AtGate") {
		if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk() && !NurseryJustClicked) NurserySituation = "Admitted";
		if ((MouseX >= 1500) && (MouseX < 1800) && (MouseY >= 25) && (MouseY < 100) && NurseryEventProgress < 0) NurseryEscapeGate();
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if (NurserySituation == ("AtGate") || NurserySituation == ( "Admitted")) {
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355)) CharacterSetCurrent(NurseryNurse);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475)) NurseryPlayerSpitOutPacifier();
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) NurseryEventProgress = -1;
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
	PreviousDress = RandomResultB
	RandomNumber = Math.floor(Math.random() * 3);
	if (RandomNumber == 0) RandomResultB = "AdultBabyDress1";
	if (RandomNumber == 1) RandomResultB = "AdultBabyDress2";
	if (RandomNumber == 2) RandomResultB = "AdultBabyDress3";
	if (RandomResultB == PreviousDress) NurseryRandomDressSelection();
}

// Random selection for dress colours
function NurseryRandomColourSelection() {
	PreviousDressColor = RandomResult
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
	if (RandomResult == PreviousDress) NurseryRandomDressSelection();
}

// When the player undresses ready to join the nursery
function NurseryPlayerUndress() {
	CharacterChangeMoney(Player, -10);
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
		NurseryPlayerIsBadBaby = true;
	}
}

// Player can spits out regular pacifier
function NurseryPlayerSpitOutPacifier() {
	InventoryRemove(Player, "ItemMouth")
}

// Player can spits out regular pacifier
function NurseryPlayerRePacified() {
	if (NurseryPlayerKeepsLoosingBinky) {
		InventoryWear(Player, "HarnessPacifierGag", "ItemMouth");
		NurseryPlayerKeepsLoosingBinky = false;
	} else {
		InventoryWear(Player, "PacifierGag", "ItemMouth");
		NurseryPlayerKeepsLoosingBinky = true;
	}
}

// Nurse will not remove a bad babies harness pacifier
function NurseryPlayerDePacified() {
	if (NurseryPlayerIsBadBaby) DialogFind(NurseryNurse, "BadBaby");
	else DialogRemoveItem("ItemMouth");
}

// Player released and changed back into regular clothes
function NurseryPlayerRedressed() {
	NurseryPlayerUndress();
	CharacterDress(Player, NurseryPlayerAppearance);
	NurserySituation = null;
}

// Player will loose skill progress or level from drinking special milk
function NurseryPlayerSkillsAmnesia() {
	SkillRetard("Bondage")
	SkillRetard("Evasion")
	SkillRetard("Willpower")
	SkillRetard("Dressage")
}

// Player changes dress
function NurseryPlayerChangeDress() {
	CharacterChangeMoney(Player, -5);
	NurseryPlayerWearBabyDress();
}

// Player changes dress
function NurseryPlayerChangeDressColor() {
	CharacterChangeMoney(Player, -5);
	NurseryRandomColourSelection();
	InventoryWear(Player, RandomResultB, "Cloth", RandomResult);
}

// Player changes dress
function NurseryPlayerRemoveDress() {
	InventoryRemove(Player, "Cloth")
}

// Player gives an adorable ABDL reply
function NurseryPlayerCuteRelpy() {
	DialogChangeReputation("ABDL", 1);
	DialogRemove();
}

// Player can try to escape the nursery as an ABDL 
function NurseryEscapeGate() {
	NurseryGenericProgressStart(60, 0, 0, null, null, null, null, 0, null, 0, null, 2,  null);
	NurseryEventProgress = 0;
}

// Standard progress meter and instructions
function NurseryEventDrawProgress() {
	
	DrawProgressBar(1200, 700, 600, 100, NurseryEventProgress)
}


//	DrawRect(300, 25, 225, 225, "white");
//	DrawImage(StableProgressItem, 302, 27);
//	DrawText(StableProgressOperation, 1000, 50, "White", "Black");





// Nursery activities

//function NurseryDrawProgress() {
//	//if (NurseryProgress >= 0) {
//		DrawButton(1750, 25, 225, 75, "Cancel", "White");
//		NurseryProgress = NurseryProgress + NurseryProgressAuto;
//	//	if (NurseryProgress < 0) NurseryProgress = 0;
//	//	var NurseryGenericPlayerPosition = (1700 * NurseryProgress/100) + 50;
//
//	//	NurserySecondProgress = NurserySecondProgress + NurserySecondProgressAuto;
//	//	if (NurserySecondProgress < 0) NurserySecondProgress = 0;
//	//	var NurseryGenericSecondPosition = (1700 * NurserySecondProgress/100) + 50;
//
//
//	//	if (NurseryProgressSecondCharacter == null) {
//	//		DrawRect(300, 25, 225, 225, "white");
//	//		DrawImage(NurseryProgressItem, 302, 27);
//	//		DrawText(NurseryProgressOperation, 1000, 50, "White", "Black");
//	//		DrawText(DialogFind(Player, (CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 1000, 150, "White", "Black");
//	//		DrawRect(200, 300, 20, 675, "white");
//	//		DrawRect(1800, 300, 20, 675, "white");
//	//		DrawCharacter(Player, NurseryGenericPlayerPosition, 300, 0.7); //todo pose change
//	//	} else {
//	//		DrawText(DialogFind(Player, (CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 600, 25, "White", "Black");
//	//		DrawRect(200, 200, 20, 800, "white");
//	//		DrawRect(1800, 200, 20, 800, "white");
//	//		DrawCharacter(Player, NurseryGenericPlayerPosition, 200, 0.4); //todo pose change
//	//		DrawCharacter(NurseryProgressSecondCharacter, NurseryGenericSecondPosition, 600, 0.4); //todo pose change
//	//	}
//		if (NurseryProgress >= 100) {
//			NurseryGenericFinished();
//		} else if (NurserySecondProgress >= 100) {
//			NurseryGenericCancel(); 
//		}
//	//}
//}
var NurseryProgress = -1;
var NurserySecondProgress = -1;
var NurseryProgressAuto = 0;
var NurserySecondProgressAuto = 0;
var NurseryProgressClick = 0;
var NurseryProgressLastKeyPress = 0;
var NurseryProgressItem = '';
var NurseryProgressFinished = false; 
var NurseryProgressCharacter = null;
var NurseryProgressSecondCharacter = null;
var NurseryProgressEndStage = 0;
var NurseryProgressEndDialog = null;
var NurseryProgressCancelStage = null;
var NurseryProgressCancelDialog = null;
var NurseryProgressBehavior = 0;
var NurseryProgressOperation = null;
var NurseryProgressStruggleCount = null;

function NurseryGenericProgressStart(Timer, S, S2, Item, Background, Character, SecondCharacter, Stage, CurrentDialog, CancelStage, CancelCurrentDialog, Behavior, ProgressOperation) {
	DialogLeave()
	if (Timer < 1) Timer = 1;
	//Charakter
	NurseryProgressAuto = CommonRunInterval * (0.1333 + (S * 0.1333)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5));
	NurseryProgressClick = CommonRunInterval * 2.5 / (Timer * CheatFactor("DoubleItemSpeed", 0.5));
	NurseryProgress = 0;
	if (S < 0) { NurseryProgressAuto = NurseryProgressAuto / 2; NurseryProgressClick = NurseryProgressClick / 2; }
	//Second Caracter
	NurserySecondProgressAuto = CommonRunInterval * (0.1333 + (S2 * 0.1333)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5));
	if (S2 < 0) { NurserySecondProgressAuto = NurserySecondProgressAuto / 2; }
	NurserySecondProgress = 0;
	
	NurseryBackground = Background;
	NurseryProgressItem = Item;
	NurseryProgress = 0;
	NurseryProgressFinished = false;
	NurseryProgressCharacter = Character;
	NurseryProgressSecondCharacter = SecondCharacter;
	NurseryProgressEndStage = Stage;
	NurseryProgressEndDialog = CurrentDialog;
	NurseryProgressCancelStage = CancelStage;
	NurseryProgressCancelDialog = CancelCurrentDialog;
	NurseryProgressBehavior = Behavior;
	NurseryProgressStruggleCount = 0;
	NurseryProgressOperation = ProgressOperation;
}

function NurseryGenericDrawProgress() {
	if (NurseryProgress >= 0) {
//		DrawButton(1750, 25, 225, 75, "Cancel", "White");
//		DrawText(NurseryProgressOperation, 1500, 650, "White", "Black"); //todo generic text
		NurseryProgress = NurseryProgress + NurseryProgressAuto;
		if (NurseryProgress < 0) NurseryProgress = 0;
		var NurseryGenericPlayerPosition = (1700 * NurseryProgress/100) + 50;

		NurserySecondProgress = NurserySecondProgress + NurserySecondProgressAuto;
		if (NurserySecondProgress < 0) NurserySecondProgress = 0;
		var NurseryGenericSecondPosition = (1700 * NurserySecondProgress/100) + 50;


		if (NurseryProgressSecondCharacter == null) {
			DrawRect(300, 25, 225, 225, "white");
			DrawImage(NurseryProgressItem, 302, 27);
			DrawText(NurseryProgressOperation, 1000, 50, "White", "Black");
			DrawText(DialogFind(Player, (CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 1000, 150, "White", "Black");
			DrawRect(200, 300, 20, 675, "white");
			DrawRect(1800, 300, 20, 675, "white");
			DrawCharacter(Player, NurseryGenericPlayerPosition, 300, 0.7); //todo pose change
		} else {
			DrawText(DialogFind(Player, (CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 600, 25, "White", "Black");
			DrawRect(200, 200, 20, 800, "white");
			DrawRect(1800, 200, 20, 800, "white");
			DrawCharacter(Player, NurseryGenericPlayerPosition, 200, 0.4); //todo pose change
			DrawCharacter(NurseryProgressSecondCharacter, NurseryGenericSecondPosition, 600, 0.4); //todo pose change
		}
		if (NurseryProgress >= 100) {
			NurseryGenericFinished();
		} else if (NurserySecondProgress >= 100) {
			NurseryGenericCancel(); 
		}
	}
}

function NurseryGenericFinished(){
	NurseryProgressFinished = true;
	NurseryGenericProgressEnd()
}

function NurseryGenericCancel(){
	NurseryProgressFinished = false;
	NurseryGenericProgressEnd()
}

function NurseryGenericProgressEnd() {
	NurseryProgress = -1;
	NurseryBackground = "HorseNursery"
	CharacterSetCurrent(NurseryProgressCharacter);
	if (NurseryProgressFinished) {
		NurseryProgressCharacter.Stage = NurseryProgressEndStage;
		NurseryProgressCharacter.CurrentDialog = DialogFind(NurseryProgressCharacter, NurseryProgressEndDialog);
		NurseryPlayerTrainingBehavior += NurseryProgressBehavior;
	} else {
		NurseryProgressCharacter.Stage = NurseryProgressCancelStage;
		NurseryProgressCharacter.CurrentDialog = DialogFind(NurseryProgressCharacter, NurseryProgressCancelDialog);
		NurseryPlayerTrainingBehavior -= NurseryProgressBehavior;
	}
}

function NurseryKeyDown() {
	if (((KeyPress == 65) || (KeyPress == 83) || (KeyPress == 97) || (KeyPress == 115)) && (NurseryProgress >= 0)) {
		NurseryGenericRun((NurseryProgressLastKeyPress == KeyPress));
		NurseryProgressLastKeyPress = KeyPress;
	}
}

function NurseryGenericRun(Reverse) {
	if (NurseryProgressAuto >= 0)
		NurseryProgress = NurseryProgress + NurseryProgressClick * (Reverse ? -1 : 1);
	else
		NurseryProgress = NurseryProgress + NurseryProgressClick * (Reverse ? -1 : 1) + ((100 - NurseryProgress) / 50);
	if (NurseryProgress < 0) NurseryProgress = 0;
	NurseryProgressStruggleCount++;
	if ((NurseryProgressStruggleCount >= 50) && (NurseryProgressClick == 0)) NurseryProgressOperation = DialogFind(Player, "Impossible");
}