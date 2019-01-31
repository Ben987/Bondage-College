"use strict";

var StableBackground = "HorseStable";
var StableTrainer = null;
var StablePony = null;

////////////////////////////////////////////////////////////////////////////////////////////
//General Room function
////////////////////////////////////////////////////////////////////////////////////////////
// functions for Dialogs
function StableProgressResultFinished() {return StableProgressFinished;}

// Loads the shibari dojo characters with many restrains
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
		InventoryWear(StablePony, "Ears2", "Hat"); //todo
		InventoryWear(StablePony, "HarnessBallGag", "ItemMouth"); //todo
		InventoryWear(StablePony, "LeatherCollar", "ItemNeck");
		InventoryWear(StablePony, "LeatherArmbinder", "ItemArms");
		InventoryWear(StablePony, "LeatherHarness", "ItemTorso");
		InventoryWear(StablePony, "BlackButtPlug", "ItemButt");  //todo
		StablePony.AllowItem = false;

	}
}

// Run the stable, draw all 3 characters
function StableRun() {
	if (StableProgress >= 0) {
		DrawButton(1750, 25, 225, 75, "Cancel", "White");
		DrawCharacter(Player, 500, 0, 1);
		StableGenericDrawProgress();
	} else {
		DrawCharacter(Player, 250, 0, 1);
		DrawCharacter(StableTrainer, 750, 0, 1);
		DrawCharacter(StablePony, 1250, 0, 1);
		if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		DrawButton(1885, 145, 90, 90, "", "White", "Screens/Room/Stable/Horse.png");
	}
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
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) StableMiniGameStart("HorseWalk", "Normal");
	}
}

////////////////////////////////////////////////////////////////////////////////////////////
//Special Room function
////////////////////////////////////////////////////////////////////////////////////////////
//Start the Demo
function StableTrialTraining() {
	StableGenericProgressStart(60, 0, "Screens/Room/Stable/toyhorse.png", "HorseStableDark", StableTrainer, 0, "StableTrainerToyHorse");
}

//Start the Simple Training
function StableTreadmillTraining() {
	StableGenericProgressStart(60, 0, "Screens/Room/Stable/treadmill.png", "HorseStableDark", StableTrainer);
}

//Start the Hard Training
function StableCarriageTraining() {
	StableGenericProgressStart(60, 0, "Screens/Room/Stable/horsecarriage.png", "HorseStableDark", StableTrainer);
}

function StableCanBecomePony(){
	return StableCheckInventory(Player, "HarnessBallGag", "ItemMouth")
		&& StableCheckInventory(Player, "LeatherCollar", "ItemNeck")
		&& StableCheckInventory(Player, "LeatherArmbinder", "ItemArms")
		&& StableCheckInventory(Player, "LeatherHarness", "ItemTorso")
		&& StableCheckInventory(Player, "BlackButtPlug", "ItemButt");

}

////////////////////////////////////////////////////////////////////////////////////////////
//Mini Game
////////////////////////////////////////////////////////////////////////////////////////////
// When the mini game starts
function StableMiniGameStart(GameType, Difficulty) {
	MiniGameStart(GameType, Difficulty, "StableMiniGameEnd");
}

// When the mini game ends, we go back to the stable
function StableMiniGameEnd() {
	CommonSetScreen("Room", "Stable");
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

function StableGenericProgressStart(Timer, S, Item, Background, Character, Stage, CurrentDialog) {
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
}

function StableGenericDrawProgress() {
	if (StableProgress >= 0) {
		DrawImage(StableProgressItem, 1200, 250);
		//DrawText(DialogProgressOperation, 1500, 650, "White", "Black"); //todo
		StableProgress = StableProgress + StableProgressAuto;
		if (StableProgress < 0) StableProgress = 0;
		DrawProgressBar(1200, 700, 600, 100, StableProgress);
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
	//SkillProgress("Elegance", DialogProgressSkill); //todo
	CharacterSetCurrent(StableProgressCharacter);
	StableProgressCharacter.Stage = StableProgressEndStage;
	StableProgressCharacter.CurrentDialog = DialogFind(StableProgressCharacter, StableProgressEndDialog);
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
}

////////////////////////////////////////////////////////////////////////////////////////////
//Help function
////////////////////////////////////////////////////////////////////////////////////////////
function StableCheckInventory(C, Name, Group) {
	for (var I = C.Inventory.length - 1; I > -1; I--)
		if ((C.Inventory[I].Name == Name) && (C.Inventory[I].Group == Group)) {
			return true;
		}
	return false;
}