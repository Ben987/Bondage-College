"use strict";

var StableBackground = "HorseStable";
var StableTrainer = null;
var StablePony = null;
var StablePlayerAppearance = null;
var StablePlayerDressOff = false;
var StablePlayerIsPony = false;
var StablePlayerTrainingLessons = 0;
var StablePlayerTrainingBehavior = 0;

////////////////////////////////////////////////////////////////////////////////////////////
//General Room function
////////////////////////////////////////////////////////////////////////////////////////////
// functions for Dialogs
function StablePlayerIsDressOff() {return StablePlayerDressOff;} 
function StablePlayerIsCollared() {return StableCharacterAppearanceGroupAvailable(Player, "ItemNeck")}
function StablePlayerOtherPony()  {return StableTrainer.Stage == "StableTrainingOtherPoniesBack";}
function StablePlayerIsolation()  {return StableTrainer.Stage == "StableTrainingIsolationBack";}


// Loads the stable characters with many restrains
function StableLoad() {
	// Default load
	if (StableTrainer == null) {
		StableTrainer = CharacterLoadNPC("NPC_Stable_Trainer");
		InventoryWear(StableTrainer, "Jeans1", "ClothLower", "#bbbbbb");
		InventoryWear(StableTrainer, "Boots1", "Shoes", "#3d0200");
		InventoryWear(StableTrainer, "Gloves1", "Gloves", "#cccccc");
		InventoryWear(StableTrainer, "TShirt1", "Cloth", "#aa8080");
		InventoryWear(StableTrainer, "Beret1", "Hat", "#202020");
		StableTrainer.AllowItem = false;
		
		StablePony = CharacterLoadNPC("NPC_Stable_Pony");
		CharacterNaked(StablePony);
		InventoryWear(StablePony, "LeatherCollar", "ItemNeck");
		StableWearPonyEquipment(StablePony, 0);
		StablePony.AllowItem = false;
	}
}

// Run the stable, draw all 3 characters
function StableRun() {
	if (StableProgress >= 0) {
		DrawButton(1750, 25, 225, 75, "Cancel", "White");
		DrawCharacter(Player, 500, 0, 1); //todo pose change
		StableGenericDrawProgress();
	} else {
		DrawCharacter(Player, 250, 0, 1);
		DrawCharacter(StableTrainer, 750, 0, 1);
		DrawCharacter(StablePony, 1250, 0, 1);
		if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
//		DrawButton(1885, 145, 90, 90, "", "White", "Screens/Room/Stable/Horse.png");
	}
	StablePlayerIsPony = LogQuery("JoinedStable", "Pony");

}

// When the user clicks in the stable
function StableClick() {
	if (StableProgress >= 0) {
		// If the user wants to speed up the add / swap / remove progress
		if ((MouseX >= 1000) && (MouseX < 2000) && (MouseY >= 600) && (MouseY < 1000) && (DialogProgress >= 0) && CommonIsMobile) StableGenericRun(false);
		if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 100)) StableGenericCancel();
	} else {
		if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(StableTrainer);
		if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(StablePony);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
//		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) StableMiniGameStart("HorseWalk", "Normal");
	}
}

////////////////////////////////////////////////////////////////////////////////////////////
//Special Room function
////////////////////////////////////////////////////////////////////////////////////////////
//Start the Demo
function StableTrialTraining() {
	StableGenericProgressStart(60, 0, "Screens/Room/Stable/toyhorse.png", "HorseStableDark", StableTrainer, 0, "StableTrainerToyHorseFin", 0, "StableTrainerToyHorseCancel", 2,  TextGet("Toyhorse"));
}

function StablePayTheFee(){
	CharacterChangeMoney(Player, -50);
}

//Check if the Player can become a Pony
function StableCanBecomePony(){
	if (ReputationGet("Dominant") > -30) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomePonySubIntro");
	} else if (!(StableCheckInventory(Player, "HarnessBallGag", "ItemMouth") && StableCheckInventory(Player, "LeatherArmbinder", "ItemArms") && StableCheckInventory(Player, "LeatherHarness", "ItemTorso") && StableCheckInventory(Player, "BlackButtPlug", "ItemButt"))) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomePonyEquipmentIntro");
		StableTrainer.Stage = "StableBecomePonyEquipment";
	} else if (StableCharacterAppearanceGroupAvailable(Player, "ItemNeck")) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomePonyCollarIntro");
	} else if (Player.Money < 50) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomePonyMoneyIntro");
	} else {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomePonyTrueIntro");
		StableTrainer.Stage = "StableBecomePonyTrue";
	}
}

//Check if the Player can Start a Lesson
function StablePlayerStartTrainingLesson() {
	if (!StablePlayerIsCollared()) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingStartCollar");
	} else {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingStartIntro");
		StableTrainer.Stage = "StableTrainingStart";
	}
}

//Select a Lesson
function StablePlayerGetTrainingLesson() {
	if (StablePlayerTrainingLessons > 5) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingEndIntro");
		StableTrainer.Stage = "StableTrainingEnd";
	} else {
		var TrainSelection = Math.random() * 11;
		if (TrainSelection < 3) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingGallopIntro");
			StableTrainer.Stage = "StableTrainingGallop";
		} else if (TrainSelection < 5) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingWalkIntro");
			StableTrainer.Stage = "StableTrainingWalk";
		} else if (TrainSelection < 7) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingDanceIntro");
			StableTrainer.Stage = "StableTrainingDance";
		} else if (TrainSelection < 8) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingTreadmillIntro");
			StableTrainer.Stage = "StableTrainingTreadmill";
		} else if (TrainSelection < 9) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingCarriageIntro");
			StableTrainer.Stage = "StableTrainingCarriage";
		} else if (TrainSelection < 10) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingCarrotsIntro");
			StableTrainer.Stage = "StableTrainingCarrots";
		} else if (TrainSelection < 11) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingHurdlesIntro");
			StableTrainer.Stage = "StableTrainingHurdles";
		}
	}
}

//Start Traning Gallop
function StablePlayerTrainingGallop(Behavior) {
	StablePlayerTrainingLessons++;
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 2;
	SkillProgress("Dressage", StableDifficulty * 5);
	if ((Math.random() * StableDifficulty) < StableDressage) {
		StablePlayerTrainingBehavior += 2;
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingPassIntro");
		StableTrainer.Stage = "StableTrainingPass";
	} else {
		StablePlayerTrainingBehavior -= 2;
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailIntro");
		StableTrainer.Stage = "StableTrainingFail";
	}
}

//Start Traning Walk
function StablePlayerTrainingWalk(Behavior) {
	StablePlayerTrainingLessons++;
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 4;
	SkillProgress("Dressage", StableDifficulty * 5);
	if ((Math.random() * StableDifficulty) < StableDressage) {
		StablePlayerTrainingBehavior += 2;
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingPassIntro");
		StableTrainer.Stage = "StableTrainingPass";
	} else {
		StablePlayerTrainingBehavior -= 2;
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailIntro");
		StableTrainer.Stage = "StableTrainingFail";
	}
}

//Start Traning Dance
function StablePlayerTrainingDance(Behavior) {
	StablePlayerTrainingLessons++;
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 6;
	SkillProgress("Dressage", StableDifficulty * 5);
	if ((Math.random() * StableDifficulty) < StableDressage) {
		StablePlayerTrainingBehavior += 2;
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingPassIntro");
		StableTrainer.Stage = "StableTrainingPass";
	} else {
		StablePlayerTrainingBehavior -= 2;
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailIntro");
		StableTrainer.Stage = "StableTrainingFail";
	}
}

//Start Traning Hurdle
function StablePlayerTrainingHurdles(Behavior){
	StablePlayerTrainingLessons++;
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 8;
	SkillProgress("Dressage", StableDifficulty * 5);
	if ((Math.random() * StableDifficulty) < StableDressage) {
		StablePlayerTrainingBehavior += 2;
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingPassIntro");
		StableTrainer.Stage = "StableTrainingPass";
	} else {
		StablePlayerTrainingBehavior -= 2;
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailIntro");
		StableTrainer.Stage = "StableTrainingFail";
	}
}

//Start Traning Treadmill
function StablePlayerTrainingTreadmill(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 6;
	SkillProgress("Dressage", StableDifficulty * 5);
	StableGenericProgressStart(StableDifficulty * 20, StableDressage, "Screens/Room/Stable/treadmill.png", "HorseStableDark", StableTrainer, "StableTrainingPass", "StableTrainingPassIntro", "StableTrainingFail", "StableTrainingFailIntro", 2, TextGet("Treadmill"));
	StablePlayerTrainingLessons += 2;
}

//Start Traning Carriage
function StablePlayerTrainingCarriage(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 6;
	SkillProgress("Dressage", StableDifficulty * 5);
	StableGenericProgressStart(StableDifficulty * 20, StableDressage, "Screens/Room/Stable/horsecarriage.png", "HorseStableDark", StableTrainer, "StableTrainingPass", "StableTrainingPassIntro", "StableTrainingFail", "StableTrainingFailIntro", 2, TextGet("Carriage"));
	StablePlayerTrainingLessons += 2;
}

//Start Traning Carrots - MiniGame
function StablePlayerTrainingCarrots(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	//todo minigame integr.
	MiniGameStart("HorseWalk", "Normal", "StablePlayerTrainingCarrotsEnd");
	StablePlayerTrainingLessons += 3;
}

//End Traning Carrots - MiniGame
function StablePlayerTrainingCarrotsEnd() {
	CommonSetScreen("Room", "Stable");
	CharacterSetCurrent(StableTrainer);
	if (MiniGameVictory) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingPassIntro");
		StableTrainer.Stage = "StableTrainingPass";
		StablePlayerTrainingBehavior += 2;
	} else {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailIntro");
		StableTrainer.Stage = "StableTrainingFail";
		StablePlayerTrainingBehavior -= 2;
	}		
}

//Reward for passed
function StablePlayerTrainingPass(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	if (StablePlayerTrainingBehavior <= 0) {
		StableCheckEquipment(Player);
 	} else {
		var PassSelection = Math.random() * 6;
		if (PassSelection < 1) {
			StablePlayerTrainingBehavior -= 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingPettingIntro");
			StableTrainer.Stage = "StableTrainingPetting";
		} else if (PassSelection < 2) {
			StablePlayerTrainingBehavior -= 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingScratchingIntro");
			StableTrainer.Stage = "StableTrainingScratching";
		} else if (PassSelection < 3) {
			StablePlayerTrainingBehavior -= 2;
			for(var i = 0; i < Player.Appearance.length; i++) 
				if (Player.Appearance[i].Asset.Group.Name == "HairBack") Player.Appearance[i].Asset.Name = "HairBack19";
			CharacterRefresh(Player);
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingStraightenIntro");
			StableTrainer.Stage = "StableTrainingStraighten";
		} else if (PassSelection < 4) {
			StablePlayerTrainingBehavior -= 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingSpongeIntro");
			StableTrainer.Stage = "StableTrainingSponge";
		} else if (PassSelection < 5) {
			StablePlayerTrainingBehavior -= 2;
			InventoryRemove(Player, "ItemMouth");
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingOoatcakeIntro");
			StableTrainer.Stage = "StableTrainingOatcake";
		} else if (PassSelection < 6) {
			StablePlayerTrainingBehavior -= 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingOtherPoniesIntro");
			StableTrainer.Stage = "StableTrainingOtherPonies";
		}
	}
}

//Guarantee for failed
function StablePlayerTrainingFail(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	if (StablePlayerTrainingBehavior >= 0) {
		StableCheckEquipment(Player);
 	} else {
		var FailSelection = Math.random() * 8;
		if (FailSelection < 1) {
			StablePlayerTrainingBehavior += 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailPopsIntro");
			StableTrainer.Stage = "StableTrainingFailPops";
		} else if (FailSelection < 2) {
			StablePlayerTrainingBehavior += 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailBackIntro");
			StableTrainer.Stage = "StableTrainingFailBack";
		} else if (FailSelection < 3) {
			StablePlayerTrainingBehavior += 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailHipIntro");
			StableTrainer.Stage = "StableTrainingFailHip";
			
		} else if (FailSelection < 4) {
			StablePlayerTrainingBehavior += 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailButtIntro");
			StableTrainer.Stage = "StableTrainingFailButt";
			
		} else if (FailSelection < 5) {
			StablePlayerTrainingBehavior += 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailLegsIntro");
			StableTrainer.Stage = "StableTrainingFailLegs";
			
		} else if (FailSelection < 6) {
			StablePlayerTrainingBehavior += 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailBreastIntro");
			StableTrainer.Stage = "StableTrainingFailBreast";
			
		} else if (FailSelection < 7) {
			StablePlayerTrainingBehavior += 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailWaterIntro");
			StableTrainer.Stage = "StableTrainingFailWater";
			
		} else if (FailSelection < 8) {
			StablePlayerTrainingBehavior += 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailStableIntro");
			StableTrainer.Stage = "StableTrainingFailStable";
		}
	}
}

function StablePlayerOtherPonys() {
	CharacterSetCurrent(StablePony);
	StableTrainer.Stage = "StableTrainingOtherPoniesBack";
}

function StablePlayerToStable() {
	InventoryWear(Player, "LeatherBelt", "ItemFeet");
	CharacterSetCurrent(Player);
	StableTrainer.Stage = "StableTrainingIsolationBack";
	//todo timer
}

//Start the Pony introduction
function StableDressPonyStart(){
	if (StablePlayerAppearance == null) StablePlayerAppearance = Player.Appearance.slice();
	StablePlayerDressOff = true;
	CharacterNaked(Player);
}

// When the player becomes a pony
function StableBecomePonyFin(){
	InventoryWear(Player, "Ears2", "Hat");
	LogAdd("JoinedStable", "Pony");
}

//Stop the Traning and Remove some Items
function StableTrainingStoped() {
	InventoryRemove(Player, "ItemArms");
	StablePlayerTrainingLessons = 0;
}

//Dress Caracter Back
function StableDressBackPlayer() {
	Player.Appearance = StablePlayerAppearance.slice();
	StablePlayerDressOff = false;
	CharacterRefresh(Player);
}

//Start the Equipment Check
function StableCheckEquipment() {
	StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingCheckEquipmentIntro");
	StableTrainer.Stage = "StableTrainingCheckEquipment";
}

//Dress the Equipment to the Player
function StablePlayerWearEquipment(Behavior) {
	StablePlayerTrainingBehavior = 0;
	StablePlayerTrainingBehavior += parseInt(Behavior);
	StableWearPonyEquipment(Player);
	StablePlayerGetTrainingLesson();
}

//Dress Characker like a Pony
function StableWearPonyEquipment(C) {
	InventoryWear(C, "Ears2", "Hat");
	InventoryWear(C, "LeatherHarness", "ItemTorso");
	InventoryWear(C, "HarnessBallGag", "ItemMouth");
	InventoryWear(C, "LeatherArmbinder", "ItemArms");
	InventoryWear(C, "BlackButtPlug", "ItemButt");
	InventoryRemove(C, "ItemFeet");
	InventoryRemove(C, "ItemLegs");
	CharacterRefresh(Player);
}

////////////////////////////////////////////////////////////////////////////////////////////
//Generic Progress Bar
////////////////////////////////////////////////////////////////////////////////////////////
var StableProgress = -1;
var StableProgressAuto = 0;
var StableProgressClick = 0;
var StableProgressLastKeyPress = 0;
var StableProgressItem = '';
var StableProgressFinished = false; 
var StableProgressCharacter = null;
var StableProgressEndStage = 0;
var StableProgressEndDialog = null;
var StableProgressCancelStage = null;
var StableProgressCancelDialog = null;
var StableProgressBehavior = 0;
var StableProgressOperation = null;
var StableProgressStruggleCount = null;

function StableGenericProgressStart(Timer, S, Item, Background, Character, Stage, CurrentDialog, CancelStage, CancelCurrentDialog, Behavior, ProgressOperation) {
	DialogLeave()
	if (Timer < 1) Timer = 1;
	StableProgressAuto = CommonRunInterval * (0.1333 + (S * 0.1333)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5));
	StableProgressClick = CommonRunInterval * 2.5 / (Timer * CheatFactor("DoubleItemSpeed", 0.5));
	if (S < 0) { StableProgressAuto = StableProgressAuto / 2; StableProgressClick = StableProgressClick / 2; }
	StableBackground = Background;
	StableProgressItem = Item;
	StableProgress = 0;
	StableProgressFinished = false;
	StableProgressCharacter = Character;
	StableProgressEndStage = Stage;
	StableProgressEndDialog = CurrentDialog;
	StableProgressCancelStage = CancelStage;
	StableProgressCancelDialog = CancelCurrentDialog;
	StableProgressBehavior = Behavior;
	StableProgressStruggleCount = 0;
	StableProgressOperation = ProgressOperation;
}

function StableGenericDrawProgress() {
	if (StableProgress >= 0) {
		DrawRect(1385, 250, 225, 225, "white");
		DrawImage(StableProgressItem, 1387, 252);
		DrawText(StableProgressOperation, 1500, 650, "White", "Black"); //todo generic text
		StableProgress = StableProgress + StableProgressAuto;
		if (StableProgress < 0) StableProgress = 0;
		DrawProgressBar(1200, 700, 600, 100, StableProgress);
		DrawText(DialogFind(Player, (CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 1500, 900, "White", "Black");
		if (StableProgress >= 100) {
			StableGenericFinished();
		}
	}
}

function StableGenericFinished(){
	StableProgressFinished = true;
	StableGenericProgressEnd()
}

function StableGenericCancel(){
	StableProgressFinished = false;
	StableGenericProgressEnd()
}

function StableGenericProgressEnd() {
	StableProgress = -1;
	StableBackground = "HorseStable"
	CharacterSetCurrent(StableProgressCharacter);
	if (StableProgressFinished) {
		StableProgressCharacter.Stage = StableProgressEndStage;
		StableProgressCharacter.CurrentDialog = DialogFind(StableProgressCharacter, StableProgressEndDialog);
		StablePlayerTrainingBehavior += StableProgressBehavior;
	} else {
		StableProgressCharacter.Stage = StableProgressCancelStage;
		StableProgressCharacter.CurrentDialog = DialogFind(StableProgressCharacter, StableProgressCancelDialog);
		StablePlayerTrainingBehavior -= StableProgressBehavior;
	}
}

function StableKeyDown() {
	if (((KeyPress == 65) || (KeyPress == 83) || (KeyPress == 97) || (KeyPress == 115)) && (StableProgress >= 0)) {
		StableGenericRun((StableProgressLastKeyPress == KeyPress));
		StableProgressLastKeyPress = KeyPress;
	}
}

function StableGenericRun(Reverse) {
	if (StableProgressAuto >= 0)
		StableProgress = StableProgress + StableProgressClick * (Reverse ? -1 : 1);
	else
		StableProgress = StableProgress + StableProgressClick * (Reverse ? -1 : 1) + ((100 - StableProgress) / 50);
	if (StableProgress < 0) StableProgress = 0;
	StableProgressStruggleCount++;
	if ((StableProgressStruggleCount >= 50) && (StableProgressClick == 0)) StableProgressOperation = DialogFind(Player, "Impossible");
}

////////////////////////////////////////////////////////////////////////////////////////////
//Help function
////////////////////////////////////////////////////////////////////////////////////////////
function StableCheckInventory(C, Name, Group) {
	for (var I = C.Inventory.length - 1; I > -1; I--)
		if ((C.Inventory[I].Name == Name) && (C.Inventory[I].Group == Group))
			return true;
	return false;
}

// Returns true if a Appearance Group for Character available
function StableCharacterAppearanceGroupAvailable(C, AppearanceGroup) {
	for (var I = 0; I < C.Appearance.length; I++)
		if (C.Appearance[I].Asset.Group.Name == AppearanceGroup)
			return true;
	return false;
}