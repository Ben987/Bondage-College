"use strict";

var StableBackground = "HorseStable";
var StableTrainer = null;
var StablePony = null;
var StablePonyPass = false;
var StablePonyFail = false;
var StablePlayerAppearance = null;
var StablePlayerDressOff = false;
var StablePlayerIsPony = false;
var StablePlayerIsExamPony = false;
var StablePlayerIsTrainer = false;
var StablePlayerIsExamTrainer = false;
var StablePlayerIsNewby = false;
var StablePlayerTrainingActiv = false;
var StablePlayerTrainingLessons = 0;
var StablePlayerTrainingBehavior = 0;
var StableTrainerTrainingExercises = 0;
var StablePlayerInIsolation = false;
var StablePlayerInIsolationStart = null;
var StablePlayerInIsolationEnd = null;
var StableExamPoint = 0;

////////////////////////////////////////////////////////////////////////////////////////////
//General Room function
////////////////////////////////////////////////////////////////////////////////////////////
// functions for Dialogs
function StablePlayerIsDressOff() {return StablePlayerDressOff;} 
function StablePlayerIsCollared() {return StableCharacterAppearanceGroupAvailable(Player, "ItemNeck")}
function StablePlayerOtherPony()  {return StableTrainer.Stage == "StableTrainingOtherPoniesBack" || StableTrainer.Stage == "StableTrainingEnd";}
function StablePlayerIsolation()  {return StableTrainer.Stage == "StableTrainingIsolationBack";}
function StableTrainingExercisesAvailable() {return (StableTrainerTrainingExercises > 0);}
function StablePlayerAllowedPonyExamen() {return (!StablePlayerIsExamPony && StablePlayerIsPony && (SkillGetLevel(Player, "Dressage") >= 6));}
function StablePlayerDisallowedPonyExamen() {return (!StablePlayerIsExamPony && StablePlayerIsPony && (SkillGetLevel(Player, "Dressage") < 6));}
function StablePlayerAllowedTrainerExamen() {return (!StablePlayerIsExamTrainer && StablePlayerIsTrainer && (SkillGetLevel(Player, "Dressage") >= 6) && (Player.Money > 99));}
function StablePlayerDisallowedTrainerExamen() {return (!StablePlayerIsExamTrainer && StablePlayerIsTrainer && (SkillGetLevel(Player, "Dressage") < 6));}

//BadGirlClub
function StableCanHideDice() {return (LogQuery("Joined", "BadGirl") && LogQuery("Stolen", "BadGirl") && !LogQuery("Hide", "BadGirl"))}


// Loads the stable characters with many restrains
function StableLoad() {
	StablePlayerIsPony = (LogQuery("JoinedStable", "Pony") && (ReputationGet("Dominant") < -30)) && !StablePlayerDressOff;
	StablePlayerIsExamPony = LogQuery("JoinedStable", "PonyExam");
	StablePlayerIsTrainer = (LogQuery("JoinedStable", "Trainer") && (ReputationGet("Dominant") > 30)) && !StablePlayerDressOff;
	StablePlayerIsExamTrainer = LogQuery("JoinedStable", "TrainerExam");
	StablePlayerIsNewby = (!LogQuery("JoinedStable", "Pony") && !LogQuery("JoinedStable", "Trainer"));

	// Give items to the player in case they completed the exam before they were added
	if(StablePlayerIsExamTrainer || StablePlayerIsExamPony) {
		InventoryAdd(Player, "HarnessPonyBits", "ItemMouth");
		InventoryAdd(Player, "PonyBoots", "Shoes");
	}
	
	// Default load
	if (StableTrainer == null) {
		StableTrainer = CharacterLoadNPC("NPC_Stable_Trainer");
		StableWearTrainerEquipment(StableTrainer);
		if (StablePlayerIsExamTrainer){
			StableTrainer.AllowItem = true;
		} else {
			StableTrainer.AllowItem = false;
		}
		StablePony = CharacterLoadNPC("NPC_Stable_Pony");
		CharacterNaked(StablePony);
		InventoryWear(StablePony, "LeatherCollar", "ItemNeck");
		StableWearPonyEquipment(StablePony, 0);
		if (StablePlayerIsExamTrainer){
			StablePony.AllowItem = false;
		} else {
			StablePony.AllowItem = false;
		}
	}
	StablePlayerInIsolation = false;
}

// Run the stable, draw all 3 characters
function StableRun() {
	if (StableProgress >= 0) {
		StableGenericDrawProgress();
	} else if (StablePlayerInIsolation == true) {
		DrawCharacter(Player, 750, 0, 1);
		DrawText(TextGet("InStable"), 1750, 925, "White", "Black");
		DrawProgressBar(1525, 955, 450, 35, (1 - ((StablePlayerInIsolationEnd - CommonTime()) / (StablePlayerInIsolationEnd - StablePlayerInIsolationStart))) * 100);
		if ((StablePlayerInIsolationEnd != null) && (CommonTime() >= StablePlayerInIsolationEnd)) {
			StablePlayerInIsolation = false;
		}
	} else {
		DrawCharacter(Player, 250, 0, 1);
		DrawCharacter(StableTrainer, 750, 0, 1);
		DrawCharacter(StablePony, 1250, 0, 1);
		if (Player.CanWalk() && (!StablePlayerTrainingActiv || StablePlayerIsExamPony)) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
		if (StableCanHideDice()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/DiceHide.png", TextGet("HideDice"));
		//DrawButton(1885, 265, 90, 90, "", "White", "Screens/Room/Stable/Horse.png");
	}
	StablePlayerIsPony = (LogQuery("JoinedStable", "Pony") && (ReputationGet("Dominant") < -30)) && !StablePlayerDressOff;
	StablePlayerIsExamPony = LogQuery("JoinedStable", "PonyExam");
	StablePlayerIsTrainer = (LogQuery("JoinedStable", "Trainer") && (ReputationGet("Dominant") > 30));
	StablePlayerIsExamTrainer = LogQuery("JoinedStable", "TrainerExam");
	StablePlayerIsNewby = (!LogQuery("JoinedStable", "Pony") && !LogQuery("JoinedStable", "Trainer"));
}

// When the user clicks in the stable
function StableClick() {
	if (StablePlayerInIsolation == true) {
		if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	} else if (StableProgress >= 0) {
		// If the user wants to speed up the add / swap / remove progress
		if ((MouseX >= 0) && (MouseX < 2000) && (MouseY >= 200) && (MouseY < 1000) && (StableProgress >= 0) && CommonIsMobile) StableGenericRun(false);
		if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 100)) StableGenericCancel();
	} else {
		if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(StableTrainer);
		if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(StablePony);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk() && (!StablePlayerTrainingActiv || StablePlayerIsExamPony)) CommonSetScreen("Room", "MainHall");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && StableCanHideDice()) StableHideDice();
	}
}

////////////////////////////////////////////////////////////////////////////////////////////
//Special Room function - Player is Pony
////////////////////////////////////////////////////////////////////////////////////////////
//Start the Demo for a Ponytraining
function StableTrialPonyTraining() {
	StableGenericProgressStart(60, 0, 0, "Screens/Room/Stable/toyhorse.png", "HorseStableDark", StableTrainer, null, 0, "StableTrainerToyHorseFin", 0, "StableTrainerToyHorseCancel", 2,  TextGet("Toyhorse"));
	SkillProgress("Dressage", 15);
}

//Start the Demo for a Trainer-training
function StableTrialTrainerTraining() {
	MiniGameStart("HorseWalk", "WhipPony", "StableTrialTrainerTrainingEnd");
}

function StableTrialTrainerTrainingEnd() {
	CommonSetScreen("Room", "Stable");
	CharacterSetCurrent(StableTrainer);
	if (MiniGameVictory) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainerToyHorseFin");
	} else {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainerToyHorseCancel");
	}
}

function StablePayTheFee(){
	CharacterChangeMoney(Player, -50);
}

//Check if the Player can become a Pony
function StableCanBecomePony(){
	if (ReputationGet("Dominant") > -30) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomePonySubIntro");
	} else if (!(StableCheckInventory(Player, "HarnessBallGag", "ItemMouth") && StableCheckInventory(Player, "LeatherArmbinder", "ItemArms") && StableCheckInventory(Player, "LeatherHarness", "ItemTorso") && StableCheckInventory(Player, "HorsetailPlug", "ItemButt"))) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomePonyEquipmentIntro");
		StableTrainer.Stage = "StableBecomePonyEquipment";
	} else if (!StableCharacterAppearanceGroupAvailable(Player, "ItemNeck")) {
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
		StablePlayerTrainingActiv = true;
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
		var TrainSelection = Math.random() * (10 + SkillGetLevel(Player, "Dressage"));
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
		} else if (TrainSelection < 12) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingRaceIntro");
			StableTrainer.Stage = "StableTrainingRace";
		} else if (TrainSelection < 13) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingDanceIntro");
			StableTrainer.Stage = "StableTrainingDance";
		} else if (TrainSelection < 14) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingHurdlesIntro");
			StableTrainer.Stage = "StableTrainingHurdles";
		} else if (TrainSelection < 15) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingTreadmillIntro");
			StableTrainer.Stage = "StableTrainingTreadmill";
		} else if (TrainSelection < 16) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingStrongRaceIntro");
			StableTrainer.Stage = "StableTrainingStrongRace";
		} else if (TrainSelection < 17) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingCarriageIntro");
			StableTrainer.Stage = "StableTrainingCarriage";
		} else if (TrainSelection < 18) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingHurdlesIntro");
			StableTrainer.Stage = "StableTrainingHurdles";
		} else if (TrainSelection < 19) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingStrongTreadmillIntro");
			StableTrainer.Stage = "StableTrainingStrongTreadmill";
		} else if (TrainSelection < 20) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingStrongCarriageIntro");
			StableTrainer.Stage = "StableTrainingStrongCarriage";
		}
	}
}

//Start Traning Gallop
function StablePlayerTrainingGallop(Behavior) {
	StablePlayerTrainingLessons++;
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 3;
	SkillProgress("Dressage", StableDifficulty * 5);
	if ((Math.random() * StableDifficulty) < StableDressage) {
		StablePlayerTrainingBehavior += 2;
		if (StablePlayerTrainingBehavior > 2) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingSuccessPassIntro");
			StableTrainer.Stage = "StableTrainingSuccessPass";
		} else {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingSuccessFailIntro");
			StableTrainer.Stage = "StableTrainingSuccessFail";
		}
	} else {
		StablePlayerTrainingBehavior -= 2;
		if (StablePlayerTrainingBehavior >= 0) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingPassPunishIntro");
			StableTrainer.Stage = "StableTrainingPassPunish";
		} else {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailPunishIntro");
			StableTrainer.Stage = "StableTrainingPunishFail";
		}
	}
}

//Start Traning Walk
function StablePlayerTrainingWalk(Behavior) {
	StablePlayerTrainingLessons++;
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 6;
	SkillProgress("Dressage", StableDifficulty * 5);
	if ((Math.random() * StableDifficulty) < StableDressage) {
		StablePlayerTrainingBehavior += 2;
		if (StablePlayerTrainingBehavior > 2) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingSuccessPassIntro");
			StableTrainer.Stage = "StableTrainingSuccessPass";
		} else {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingSuccessFailIntro");
			StableTrainer.Stage = "StableTrainingSuccessFail";
		}
	} else {
		StablePlayerTrainingBehavior -= 2;
		if (StablePlayerTrainingBehavior >= 0) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingPassPunishIntro");
			StableTrainer.Stage = "StableTrainingPassPunish";
		} else {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailPunishIntro");
			StableTrainer.Stage = "StableTrainingPunishFail";
		}
	}
}

//Start Traning Dance
function StablePlayerTrainingDance(Behavior) {
	StablePlayerTrainingLessons++;
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 9;
	SkillProgress("Dressage", StableDifficulty * 5);
	if ((Math.random() * StableDifficulty) < StableDressage) {
		StablePlayerTrainingBehavior += 2;
		if (StablePlayerTrainingBehavior > 2) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingSuccessPassIntro");
			StableTrainer.Stage = "StableTrainingSuccessPass";
		} else {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingSuccessFailIntro");
			StableTrainer.Stage = "StableTrainingSuccessFail";
		}
	} else {
		StablePlayerTrainingBehavior -= 2;
		if (StablePlayerTrainingBehavior >= 0) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingPassPunishIntro");
			StableTrainer.Stage = "StableTrainingPassPunish";
		} else {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailPunishIntro");
			StableTrainer.Stage = "StableTrainingPunishFail";
		}
	}
}

//Start Traning Hurdle
function StablePlayerTrainingHurdles(Behavior){
	StablePlayerTrainingBehavior += parseInt(Behavior);
	MiniGameStart("HorseWalk", "Hurdle", "StablePlayerTrainingHurdlesEnd");
	StablePlayerTrainingLessons += 2;
}

function StablePlayerTrainingHurdlesEnd() {	
	CommonSetScreen("Room", "Stable");
	CharacterSetCurrent(StableTrainer);
	if (MiniGameVictory) {
		StablePlayerTrainingBehavior += 2;
		if (StablePlayerTrainingBehavior > 2) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingSuccessPassIntro");
			StableTrainer.Stage = "StableTrainingSuccessPass";
		} else {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingSuccessFailIntro");
			StableTrainer.Stage = "StableTrainingSuccessFail";
		}
	} else {
		StablePlayerTrainingBehavior -= 2;
		if (StablePlayerTrainingBehavior >= 0) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingPassPunishIntro");
			StableTrainer.Stage = "StableTrainingPassPunish";
		} else {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailPunishIntro");
			StableTrainer.Stage = "StableTrainingPunishFail";
		}
	}
}

//Start Traning Treadmill
function StablePlayerTrainingTreadmill(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 6;
	SkillProgress("Dressage", StableDifficulty * 5);
	StableGenericProgressStart((StableDifficulty + StableDressage) * 20, StableDressage, StableDressage, "Screens/Room/Stable/treadmill.png", "HorseStableDark", StableTrainer, null, "StableTrainingPass", "StableTrainingPassIntro", "StableTrainingFail", "StableTrainingFailIntro", 2, TextGet("Treadmill"));
	StablePlayerTrainingLessons += 2;
}

//Start Traning Strong Treadmill
function StablePlayerTrainingStrongTreadmill(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 2;
	InventoryWear(Player, "LeatherBelt", "ItemLegs");
	SkillProgress("Dressage", (StableDifficulty + 6) * 10);
	StableGenericProgressStart((StableDifficulty + StableDressage) * 20, StableDressage - 6, StableDressage, "Screens/Room/Stable/treadmill.png", "HorseStableDark", StableTrainer, null, "StableTrainingPass", "StableTrainingPassIntro", "StableTrainingFail", "StableTrainingFailIntro", 2, TextGet("Treadmill"));
	StablePlayerTrainingLessons += 2;
}

//Start Traning Carriage
function StablePlayerTrainingCarriage(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 9;
	SkillProgress("Dressage", StableDifficulty * 5);
	StableGenericProgressStart((StableDifficulty + StableDressage) * 20, StableDressage, StableDressage, "Screens/Room/Stable/horsecarriage.png", "HorseStableDark", StableTrainer, null, "StableTrainingPass", "StableTrainingPassIntro", "StableTrainingFail", "StableTrainingFailIntro", 2, TextGet("Carriage"));
	StablePlayerTrainingLessons += 2;
}

//Start Traning Strong Carriage
function StablePlayerTrainingStrongCarriage(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 3;
	InventoryWear(Player, "LeatherBelt", "ItemLegs");
	SkillProgress("Dressage", (StableDifficulty + 6) * 10);
	StableGenericProgressStart((StableDifficulty + StableDressage) * 20, StableDressage - 6, StableDressage, "Screens/Room/Stable/horsecarriage.png", "HorseStableDark", StableTrainer, null, "StableTrainingPass", "StableTrainingPassIntro", "StableTrainingFail", "StableTrainingFailIntro", 2, TextGet("Carriage"));
	StablePlayerTrainingLessons += 2;
}

//Start Traning Race
function StablePlayerTrainingRace(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 9;
	SkillProgress("Dressage", StableDifficulty * 5);
	StableGenericProgressStart((StableDifficulty + StableDressage) * 20, StableDressage, StableDressage + 1, "Screens/Room/Stable/treadmill.png", "HorseStableDark", StableTrainer, StablePony, "StableTrainingPass", "StableTrainingPassIntro", "StableTrainingFail", "StableTrainingFailIntro", 2, TextGet("Treadmill"));
	StablePlayerTrainingLessons += 2;
}

//Start Traning Strong Race
function StablePlayerTrainingStrongRace(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 9;
	SkillProgress("Dressage", StableDifficulty * 5);
	StableGenericProgressStart((StableDifficulty + StableDressage) * 20, StableDressage, StableDressage + 3, "Screens/Room/Stable/treadmill.png", "HorseStableDark", StableTrainer, StablePony, "StableTrainingPass", "StableTrainingPassIntro", "StableTrainingFail", "StableTrainingFailIntro", 2, TextGet("Treadmill"));
	StablePlayerTrainingLessons += 2;
}

//Start Traning Carrots - MiniGame
function StablePlayerTrainingCarrots(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	MiniGameStart("HorseWalk", "Carrot", "StablePlayerTrainingCarrotsEnd");
	StablePlayerTrainingLessons += 2;
}

//End Traning Carrots - MiniGame
function StablePlayerTrainingCarrotsEnd() {
	CommonSetScreen("Room", "Stable");
	CharacterSetCurrent(StableTrainer);
	if (MiniGameVictory) {
		StablePlayerTrainingBehavior += 2;
		if (StablePlayerTrainingBehavior > 2) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingSuccessPassIntro");
			StableTrainer.Stage = "StableTrainingSuccessPass";
		} else {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingSuccessFailIntro");
			StableTrainer.Stage = "StableTrainingSuccessFail";
		}
	} else {
		StablePlayerTrainingBehavior -= 2;
		if (StablePlayerTrainingBehavior >= 0) {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingPassPunishIntro");
			StableTrainer.Stage = "StableTrainingPassPunish";
		} else {
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingFailPunishIntro");
			StableTrainer.Stage = "StableTrainingPunishFail";
		}
	}
}

//Reward for passed
function StablePlayerTrainingPass(Behavior) {
	StablePlayerTrainingBehavior += parseInt(Behavior);
	if (StablePlayerTrainingBehavior <= 0) {
		StableCheckEquipment(Player);
 	} else {
		var PassSelection = Math.random() * 7;
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
			StablePonyStraightens(Player);
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
		} else if (PassSelection < 7) {
			StablePlayerTrainingBehavior -= 2;
			StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableTrainingRunOutIntro");
			StableTrainer.Stage = "StableTrainingRunOut";
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
	StablePlayerInIsolation = true;
	StablePlayerInIsolationStart = CommonTime();
	StablePlayerInIsolationEnd = CommonTime() + 40000 + Math.floor(Math.random() * 40000);
	InventoryWear(Player, "LeatherBelt", "ItemFeet");
	StableTrainer.Stage = "StableTrainingIsolationBack";
	DialogLeave();
}

//Start the Pony introduction
function StableDressPonyStart(){
	StablePlayerAppearance = Player.Appearance.slice();
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
	StablePlayerTrainingActiv = false;
	StablePony.AllowItem = false;
	InventoryRemove(Player, "ItemArms");
	StablePlayerTrainingLessons = 0;
}

//Player can go to ponies after training
function StablePlayerToHerd() {
	StableWearPonyEquipment(Player);
	StablePony.AllowItem = true;
	CharacterSetCurrent(StablePony);
}

//Dress Caracter Back
function StableDressBackPlayer() {
	CharacterRelease(Player);
	CharacterNaked(Player);
	//Release Harnes, Plug, Ears2
	for(var E = 0; E < Player.Appearance.length; E++)
	if ((Player.Appearance[E].Asset.Group.Name == "ItemTorso") || (Player.Appearance[E].Asset.Group.Name == "Hat") || (Player.Appearance[E].Asset.Group.Name == "ItemButt")) {
		Player.Appearance.splice(E, 1);
		E--;
	}
	CharacterDress(Player, StablePlayerAppearance);
	StablePlayerDressOff = false;
	StablePony.AllowItem = false;
	CharacterRefresh(Player);
	StableTrainerTrainingExercises = 0;
	StablePlayerIsPony = (LogQuery("JoinedStable", "Pony") && (ReputationGet("Dominant") < -30)) && !StablePlayerDressOff;
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
	if (!StablePlayerIsCollared()) InventoryWear(Player, "LeatherCollar", "ItemNeck");
	StablePlayerGetTrainingLesson();
}

//Dress Characker like a Pony
function StableWearPonyEquipment(C) {
	CharacterNaked(C);
	InventoryWear(C, "PonyEars1", "Hat");
	InventoryWear(C, "LeatherHarness", "ItemTorso");
	InventoryWear(C, "HarnessPonyBits", "ItemMouth");
	InventoryWear(C, "LeatherArmbinder", "ItemArms");
	InventoryWear(C, "HorsetailPlug", "ItemButt");
	InventoryWear(C, "PonyBoots", "Shoes");
	InventoryRemove(C, "ItemLegs");
	CharacterRefresh(C);
}

////////////////////////////////////////////////////////////////////////////////////////////
//Special Room function - Player Pony Exam
////////////////////////////////////////////////////////////////////////////////////////////
function StablePlayerStartExam() {
	CharacterChangeMoney(Player, -50);
	if (!StablePlayerDressOff) StablePlayerAppearance = Player.Appearance.slice();
	if (!StablePlayerIsCollared()) InventoryWear(Player, "LeatherCollar", "ItemNeck");
	StableWearPonyEquipment(Player);
	StableExamPoint = 0;
	StablePlayerDressOff = true;
	StablePlayerTrainingActiv = true;
	StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamHurdlesIntro");
	StableTrainer.Stage = "StableExamHurdle";
}

function StablePlayerExamHurdles() {
	MiniGameStart("HorseWalk", "Hurdle", "StablePlayerExamHurdlesEnd");
}

function StablePlayerExamHurdlesEnd() {	
	CommonSetScreen("Room", "Stable");
	CharacterSetCurrent(StableTrainer);
	if (MiniGameVictory) {
		StableExamPoint++
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamRaceIntro");
		StableTrainer.Stage = "StableExamRace";
	} else {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamFailIntro");
		StableTrainer.Stage = "StableExamFail";
	}
}

function StablePlayerExamRace() {
	var StableDressage = SkillGetLevel(Player, "Dressage");
	var StableDifficulty = 9;
	SkillProgress("Dressage", StableDifficulty * 5);
	StableGenericProgressStart((StableDifficulty + StableDressage) * 20, StableDressage, StableDressage + 2, "Screens/Room/Stable/treadmill.png", "HorseStableDark", StableTrainer, StablePony, "StableExamDressage", "StableExamDressageIntro", "StableExamFail", "StableExamFailIntro", 2, TextGet("Treadmill"));
}

function StablePlayerExamDressage() {
	var StableDressage = SkillGetLevel(Player, "Dressage");
	SkillProgress("Dressage", 50);
	if ((Math.random() * 6) < (StableDressage - 5)) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamPassIntro");
		StableTrainer.Stage = "StableExamPass";
	} else {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamFailIntro");
		StableTrainer.Stage = "StableExamFail";
	}
}

function StablePlayerExamPass() {
	LogAdd("JoinedStable", "PonyExam");
	LoginStableItems();
	StablePlayerExamEnd();
	StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamAwardIntro");
	StableTrainer.Stage = "StableExamAward1";
}

function StablePlayerExamEnd() {
	StablePlayerTrainingActiv = false;
	CharacterRelease(Player);
	CharacterNaked(Player);
	//Release Harnes, Plug, Ears2
	for(var E = 0; E < Player.Appearance.length; E++)
	if ((Player.Appearance[E].Asset.Group.Name == "ItemTorso") || (Player.Appearance[E].Asset.Group.Name == "Hat") || (Player.Appearance[E].Asset.Group.Name == "ItemButt")) {
		Player.Appearance.splice(E, 1);
		E--;
	}
	CharacterDress(Player, StablePlayerAppearance);
	StablePlayerDressOff = false;
	StablePlayerIsPony = (LogQuery("JoinedStable", "Pony") && (ReputationGet("Dominant") < -30)) && !StablePlayerDressOff;
	StablePony.AllowItem = false;
	CharacterRefresh(Player);
}

////////////////////////////////////////////////////////////////////////////////////////////
//Special Room function - Player is Trainer
////////////////////////////////////////////////////////////////////////////////////////////
//Check if the Player can become a Trainer
function StableCanBecomeTrainer() {
	if (SkillGetLevel(Player, "Dressage") < 3) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomeTrainerDressageIntro");
	} else if (ReputationGet("Dominant") < 30) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomeTrainerDomIntro");
	} else if (!(StableCheckInventory(Player, "LeatherCrop", "ItemPelvis") && StableCheckInventory(Player, "LeatherWhip", "ItemPelvis") && StableCheckInventory(Player, "LeatherCrop", "ItemBreast") && StableCheckInventory(Player, "LeatherWhip", "ItemBreast") && StableCheckInventory(Player, "LeatherBelt", "ItemLegs") && StableCheckInventory(Player, "LeatherBelt", "ItemFeet"))) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomeTrainerEquipmentIntro");
	} else if (Player.Money < 500) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomeTrainerMoneyIntro");
	} else {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableBecomeTrainerTrueIntro");
		StableTrainer.Stage = "StableBecomeTrainerTrue";
	}
}

//Player become a Trainer
function StableBecomeTrainer() {
	CharacterChangeMoney(Player, -500);
	LogAdd("JoinedStable", "Trainer");
	StablePlayerAppearance = Player.Appearance.slice();
	StableWearTrainerEquipment(Player);
	StableTrainerTrainingExercises = 3 + SkillGetLevel(Player, "Dressage");
	StablePlayerDressOff = true;
}

//Dress as Trainer
function StableWearTrainerEquipment(C) {
	InventoryWear(C, "Jeans1", "ClothLower", "#bbbbbb");
	InventoryWear(C, "Boots1", "Shoes", "#3d0200");
	InventoryWear(C, "Gloves1", "Gloves", "#cccccc");
	InventoryWear(C, "TShirt1", "Cloth", "#aa8080");
	InventoryWear(C, "Beret1", "Hat", "#202020");
}

//Player Start as a Trainer a rotine
function StableTrainerStart() {
	if (!StablePlayerDressOff)StablePlayerAppearance = Player.Appearance.slice();
	CharacterChangeMoney(Player, -10);
	StableWearTrainerEquipment(Player);
	StableTrainerTrainingExercises = 3 + SkillGetLevel(Player, "Dressage");
	StablePlayerDressOff = true;
	StablePony.AllowItem = true;
}

//Dress the Equipment to the Pony
function StablePonyWearEquipment() {
	StablePonyPass = false;
	StablePonyFail = false;
	StableWearPonyEquipment(StablePony);
	var PonyBehavior = Math.random();
	if (PonyBehavior < 0.4) {
		StablePony.CurrentDialog = DialogFind(StablePony, "StablePonyCheckEquipmentWait");
		StablePonyPass = true;
	} else if (PonyBehavior < 0.8) {
		StablePony.CurrentDialog = DialogFind(StablePony, "StablePonyCheckEquipmentWhinny");
	} else {
		StablePony.CurrentDialog = DialogFind(StablePony, "StablePonyCheckEquipmentKick");
		StablePonyFail = true;
	}
}

function StablePonyTraining(probability) {
	if (parseInt(probability) > Math.random() * 100) {
		StablePony.CurrentDialog = DialogFind(StablePony, "StablePonyPassIntro");
		SkillProgress("Dressage", (100 - probability));
		StablePony.Stage = 23;
		StablePonyPass = true;
	} else {
		StablePony.CurrentDialog = DialogFind(StablePony, "StablePonyFailIntro");
		StablePony.Stage = 24;
		StablePonyFail = true;
	}
	StableTrainerTrainingExercises -= 1;
}

//Start Traning Hurdle for Player as Trainer
function StablePonyTrainingHurdles() {
	MiniGameStart("HorseWalk", "HurdleTraining", "StablePonyTrainingHurdlesEnd");
	StableTrainerTrainingExercises -= 2;
}

function StablePonyTrainingHurdlesEnd() {	
	CommonSetScreen("Room", "Stable");
	CharacterSetCurrent(StablePony);
	if (MiniGameVictory) {
		StablePony.CurrentDialog = DialogFind(StablePony, "StablePonyPassIntro");
		StablePony.Stage = 23;
		StablePonyPass = true;
	} else {
		StablePony.CurrentDialog = DialogFind(StablePony, "StablePonyFailIntro");
		StablePony.Stage = 24;
		StablePonyFail = true;
	}
}

//Start the Trainer-training
function StableTrainerWhip() {
	MiniGameStart("HorseWalk", "WhipPony", "StableTrainerWhipEnd");
	StableTrainerTrainingExercises -= 2;
}

function StableTrainerWhipEnd() {
	CommonSetScreen("Room", "Stable");
	CharacterSetCurrent(StablePony);
	if (MiniGameVictory) {
		StablePony.CurrentDialog = DialogFind(StablePony, "StablePonyPassIntro");
		StablePony.Stage = 23;
		StablePonyPass = true;
	} else {
		StablePony.CurrentDialog = DialogFind(StablePony, "StablePonyFailIntro");
		StablePony.Stage = 24;
		StablePonyFail = true;
	}
}

function StablePonyStraightens(C) {
	C = C ? C : StablePony;
	var Color = CharacterAppearanceGetCurrentValue(C,"HairBack", "Color");
	CharacterAppearanceNextItem(C, "HairBack");
	for (var A = 0; A < C.Appearance.length;A++){
		if (C.Appearance[A].Asset.Group.Name == "HairBack"){
			C.Appearance[A].Color = Color;
		}
	}
	CharacterRefresh(C);
}

////////////////////////////////////////////////////////////////////////////////////////////
//Special Room function - Player Trainer Exam
////////////////////////////////////////////////////////////////////////////////////////////
function StablePlayerStartTExam() {
	CharacterChangeMoney(Player, -50);
	if (!StablePlayerDressOff)StablePlayerAppearance = Player.Appearance.slice();
	StableWearTrainerEquipment(Player);
	StablePlayerDressOff = true;
	StablePony.AllowItem = true;
	StableExamPoint = 0;
	StablePlayerTrainingActiv = true;
	StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamTKnowIntro");
	StableTrainer.Stage = "StableExamTKnow";
}

function StablePlayerTExamKnow() {
	var StableDressage = SkillGetLevel(Player, "Dressage");
	SkillProgress("Dressage", 50);
	if ((Math.random() * 6) < (StableDressage - 5)) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamTWhipIntro");
		StableTrainer.Stage = "StableExamTWhipe";
	} else {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamFailIntro");
		StableTrainer.Stage = "StableExamFail";
	}
}

function StablePlayerTExamWhip() {
	MiniGameStart("HorseWalk", "WhipPony", "StablePlayerTExamWhipEnd");
}

function StablePlayerTExamWhipEnd() {
	CommonSetScreen("Room", "Stable");
	CharacterSetCurrent(StableTrainer);
	if (MiniGameVictory) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamTHurdlesIntro");
		StableTrainer.Stage = "StableExamTHurdle";
	} else {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamFailIntro");
		StableTrainer.Stage = "StableExamFail";
	}
}

function StablePlayerTExamHurdles() {
	MiniGameStart("HorseWalk", "HurdleTraining", "StablePlayerTExamHurdlesEnd");
}

function StablePlayerTExamHurdlesEnd() {	
	CommonSetScreen("Room", "Stable");
	CharacterSetCurrent(StableTrainer);
	if (MiniGameVictory) {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamTPassIntro");
		StableTrainer.Stage = "StableExamTPass";
	} else {
		StableTrainer.CurrentDialog = DialogFind(StableTrainer, "StableExamFailIntro");
		StableTrainer.Stage = "StableExamFail";
	}
}

function StablePlayerTExamPass() {
	LogAdd("JoinedStable", "TrainerExam");
	LoginStableItems();
	CharacterChangeMoney(Player, -50);
	StablePlayerTExamEnd();
}

function StablePlayerTExamEnd() {
	StablePlayerTrainingActiv = false;
	CharacterDress(Player, StablePlayerAppearance);
	StablePlayerDressOff = false;
	StablePlayerIsTrainer = (LogQuery("JoinedStable", "Trainer") && (ReputationGet("Dominant") > 30));
	StablePony.AllowItem = false;
	CharacterRefresh(Player);
}

////////////////////////////////////////////////////////////////////////////////////////////
//Run the Line
////////////////////////////////////////////////////////////////////////////////////////////
var StableProgress = -1;
var StableSecondProgress = -1;
var StableProgressAuto = 0;
var StableSecondProgressAuto = 0;
var StableProgressClick = 0;
var StableProgressLastKeyPress = 0;
var StableProgressItem = '';
var StableProgressFinished = false; 
var StableProgressCharacter = null;
var StableProgressSecondCharacter = null;
var StableProgressEndStage = 0;
var StableProgressEndDialog = null;
var StableProgressCancelStage = null;
var StableProgressCancelDialog = null;
var StableProgressBehavior = 0;
var StableProgressOperation = null;
var StableProgressStruggleCount = null;

function StableGenericProgressStart(Timer, S, S2, Item, Background, Character, SecondCharacter, Stage, CurrentDialog, CancelStage, CancelCurrentDialog, Behavior, ProgressOperation) {
	DialogLeave()
	if (Timer < 1) Timer = 1;
	//Charakter
	StableProgressAuto = TimerRunInterval * (0.1333 + (S * 0.1333)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5));
	StableProgressClick = TimerRunInterval * 2.5 / (Timer * CheatFactor("DoubleItemSpeed", 0.5));
	StableProgress = 0;
	if (S < 0) { StableProgressAuto = StableProgressAuto / 2; StableProgressClick = StableProgressClick / 2; }
	//Second Caracter
	StableSecondProgressAuto = TimerRunInterval * (0.1333 + (S2 * 0.1333)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5));
	if (S2 < 0) { StableSecondProgressAuto = StableSecondProgressAuto / 2; }
	StableSecondProgress = 0;
	
	StableBackground = Background;
	StableProgressItem = Item;
	StableProgress = 0;
	StableProgressFinished = false;
	StableProgressCharacter = Character;
	StableProgressSecondCharacter = SecondCharacter;
	StableProgressEndStage = Stage;
	StableProgressEndDialog = CurrentDialog;
	StableProgressCancelStage = CancelStage;
	StableProgressCancelDialog = CancelCurrentDialog;
	StableProgressBehavior = Behavior;
	StableProgressStruggleCount = 0;
	StableProgressOperation = ProgressOperation;
}

/*function StableGenericDrawProgress() {
	if (StableProgress >= 0) {
		DrawButton(1750, 25, 225, 75, "Cancel", "White");
		DrawCharacter(Player, 500, 0, 1);
		DrawRect(1385, 250, 225, 225, "white");
		DrawImage(StableProgressItem, 1387, 252);
		DrawText(StableProgressOperation, 1500, 650, "White", "Black");
		StableProgress = StableProgress + StableProgressAuto;
		if (StableProgress < 0) StableProgress = 0;
		DrawProgressBar(1200, 700, 600, 100, StableProgress);
		DrawText(DialogFind(Player, (CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 1500, 900, "White", "Black");
		if (StableProgress >= 100) {
			StableGenericFinished();
		}
	}
}*/

function StableGenericDrawProgress() {
	if (StableProgress >= 0) {
		DrawButton(1750, 25, 225, 75, "Cancel", "White");
		StableProgress = StableProgress + StableProgressAuto;
		if (StableProgress < 0) StableProgress = 0;
		var StableGenericPlayerPosition = (1700 * StableProgress/100) + 50;

		StableSecondProgress = StableSecondProgress + StableSecondProgressAuto;
		if (StableSecondProgress < 0) StableSecondProgress = 0;
		var StableGenericSecondPosition = (1700 * StableSecondProgress/100) + 50;


		if (StableProgressSecondCharacter == null) {
			DrawRect(300, 25, 225, 225, "white");
			DrawImage(StableProgressItem, 302, 27);
			DrawText(StableProgressOperation, 1000, 50, "White", "Black");
			DrawText(DialogFind(Player, (CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 1000, 150, "White", "Black");
			DrawRect(200, 300, 20, 675, "white");
			DrawRect(1800, 300, 20, 675, "white");
			DrawCharacter(Player, StableGenericPlayerPosition, 300, 0.7);
		} else {
			DrawText(DialogFind(Player, (CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 600, 25, "White", "Black");
			DrawRect(200, 200, 20, 800, "white");
			DrawRect(1800, 200, 20, 800, "white");
			DrawCharacter(Player, StableGenericPlayerPosition, 200, 0.4);
			DrawCharacter(StableProgressSecondCharacter, StableGenericSecondPosition, 600, 0.4);
		}
		if (StableProgress >= 100) {
			StableGenericFinished();
		} else if (StableSecondProgress >= 100) {
			StableGenericCancel(); 
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
//Help function & BadGirlClub
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

// Try to Hide the Dice for BadGirlsClub
function StableHideDice() {
	if (Math.random() < 0.25) {
		PrisonMeetPoliceIntro("HorseStable");
	} else {
		CharacterSetCurrent(Player);
		Player.CurrentDialog = TextGet("SuccessHide");
		LogDelete("Stolen", "BadGirl");
		LogAdd("Hide", "BadGirl");
	}
}
