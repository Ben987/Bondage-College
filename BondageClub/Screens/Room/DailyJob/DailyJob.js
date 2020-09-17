"use strict";
var DailyJobBackground = "MainHall";
var DailyJobOpponent = null;
var DailyJobPuppyMistress = null;
var DailyJobPuppy1 = null;
var DailyJobPuppy2 = null;
var DailyJobPuppy3 = null;
var DailyJobPuppy4 = null;
var DailyJobDojoTeacher = null;

/**
 * Triggered when a player is fully restrained from a daily job dialog
 * @returns {void} - Nothing
 */
function DailyJobPlayerFullRestrain() { CharacterFullRandomRestrain(Player, "ALL") };

/**
 * Loads a puppy girl and fully restrain her
 * @param {number} GirlNum - Number of the puppy to load
 * @returns {Character} - The generated puppy girl
 */
function DailyJobPuppyLoad(GirlNum) {
	var C = (GirlNum == "0") ? Player : CharacterLoadNPC("NPC_DailyJob_PuppyGirl" + GirlNum);
	CharacterNaked(C);
	InventoryWear(C, CommonRandomItemFromList("", ["BitchSuit", "BitchSuitExposed", "HempRope", "Chains", "ArmbinderJacket", "StraitLeotard", "LeatherStraitJacket", "BoxTieArmbinder"]), "ItemArms", null, 8);
	InventoryWear(C, CommonRandomItemFromList("", ["Ears1", "Ears2", "PonyEars1", "BunnyEars1", "BunnyEars2", "PuppyEars1", "FoxEars1", "WolfEars1", "WolfEars2", "FoxEars2", "FoxEars3", "PuppyEars2"]), "HairAccessory1", null, 8);
	InventoryWear(C, CommonRandomItemFromList("", ["FoxTailsStrap", "PuppyTailStrap", "RaccoonStrap", "PuppyTailStrap1", "FoxTailStrap1", "FoxTailStrap2", "WolfTailStrap1", "WolfTailStrap2", "WolfTailStrap3"]), "TailStraps", null, 8);
	if (InventoryGet(C, "ItemMouth") == null) InventoryWearRandom(C, "ItemMouth", 8);
	if (InventoryGet(C, "ItemNeck") == null) InventoryWearRandom(C, "ItemNeck", 8);
	if (InventoryGet(C, "ItemNeckRestraints") == null) InventoryWear(C, "ChainLeash", "ItemNeckRestraints", null, 8);
	if (GirlNum != "0") CharacterSetActivePose(C, "Kneel", true);
	return C;
}

/**
 * Loads the daily job room screen characters. This changes based on the current job being performed.
 * @returns {void} - Nothing
 */
function DailyJobLoad() {
	DailyJobBackground = "MainHall";
	if ((DailyJobOpponent == null) && (IntroductionJobCurrent == "DomKidnap")) {
		DailyJobOpponent = CharacterLoadNPC("NPC_DailyJob_Opponent");
		DailyJobOpponent.AllowItem = false;
	}
	if ((DailyJobPuppyMistress == null) && (IntroductionJobCurrent == "DomPuppy")) {
		DailyJobPuppyMistress = CharacterLoadNPC("NPC_DailyJob_PuppyMistress");
		DailyJobPuppyMistress.AllowItem = false;
		DailyJobPuppy1 = DailyJobPuppyLoad("1");
		DailyJobPuppy2 = DailyJobPuppyLoad("2");
		DailyJobPuppy3 = DailyJobPuppyLoad("3");
		DailyJobPuppy4 = DailyJobPuppyLoad("4");
	}
	if ((DailyJobPuppyMistress == null) && (IntroductionJobCurrent == "SubDojo")) {
		DailyJobDojoTeacher = CharacterLoadNPC("NPC_DailyJob_DojoTeacher");
		CharacterNaked(DailyJobDojoTeacher);
		InventoryWear(DailyJobDojoTeacher, "ChineseDress" + (Math.floor(Math.random() * 2) + 1).toString(), "Cloth");
		InventoryWear(DailyJobDojoTeacher, "Ribbons4", "HairAccessory1");
	}
}

/**
 * Runs and draws the daily job room. Empty as daily jobs are ran from other rooms.
 * @returns {void} - Nothing
 */
function DailyJobRun() {
}


/**
 * Handles clicks in the daily job room. Empty as daily jobs are ran from other rooms.
 * @returns {void} - Nothing
 */
function DailyJobClick() {
}

/**
 * In search mission, draws the extra button for the job
 * @returns {void} - Nothing
 */
function DailyJobSubSearchRun() {
	if (IntroductionJobCurrent == "SubSearch") {
		DrawButton(1885, 885, 90, 90, "", "White", "Icons/Search.png");
		if (DailyJobSubSearchIsActive() && (IntroductionJobCount > 0) && (IntroductionJobPosition.ClickScreen == CurrentScreen)) DrawEmptyRect(IntroductionJobPosition.ClickX - 100, IntroductionJobPosition.ClickY - 100, 200, 200, "Cyan", 3);
		if (DailyJobSubSearchIsActive() && (IntroductionJobCount <= 0)) DrawImage("Screens/Room/DailyJob/Jewelry.png", 730, 290);
	}
}

/**
 * In search mission, handles clicks on the extra button for the job
 * @returns {void} - Nothing
 */
function DailyJobSubSearchClick() {
	if (IntroductionJobCurrent == "SubSearch") {
		if (DailyJobSubSearchIsActive() && (MouseX >= IntroductionJobPosition.X - 100) && (MouseX <= IntroductionJobPosition.X + 100) && (MouseY >= IntroductionJobPosition.Y - 100) && (MouseY <= IntroductionJobPosition.Y + 100)) IntroductionJobProgress("SubSearch", CurrentScreen);
		if (DailyJobSubSearchIsActive() && (IntroductionJobCount > 0) && (MouseX <= 1900)) { IntroductionJobPosition.ClickX = MouseX; IntroductionJobPosition.ClickY = MouseY; IntroductionJobPosition.ClickScreen = CurrentScreen; }
		if (MouseIn(1885, 885, 90, 90)) IntroductionJobPosition.Active = !IntroductionJobPosition.Active;
	}
}

/**
 * Checks if the player is currently searching for a daily job
 * @returns {boolean} - Returns TRUE if the job search process is active
 */
function DailyJobSubSearchIsActive() {
	return ((IntroductionJobCurrent == "SubSearch") && IntroductionJobPosition.Active);
}

/**
 * Triggered when the kidnap daily job fight minigame is started
 * @returns {void} - Nothing
 */
function DailyJobKidnapStart() {
	KidnapStart(DailyJobOpponent, "MainHallDark", 7, "DailyJobKidnapEnd()");
}


/**
 * Triggered at the end of the kidnap daily job fight mini-game
 * @returns {void} - Nothing
 */
function DailyJobKidnapEnd() {
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (DailyJobOpponent.KidnapMaxWillpower - DailyJobOpponent.KidnapWillpower)) * 2);
	DailyJobOpponent.Stage = (KidnapVictory) ? "100" : "200";
	if (KidnapVictory) CharacterRelease(Player);
	else CharacterRelease(DailyJobOpponent);
	if (KidnapVictory) DailyJobOpponent.AllowItem = true;
	CommonSetScreen("Room", "DailyJob");
	CharacterSetCurrent(DailyJobOpponent);
	DailyJobOpponent.CurrentDialog = DialogFind(DailyJobOpponent, (KidnapVictory) ? "KidnapVictory" : "KidnapDefeat");
}

/**
 * Triggered when the kidnap daily job fight mini-game is won. Sends the player back to the main hall.
 * @returns {void} - Nothing
 */
function DailyJobKidnapSuccess() {
	CommonSetScreen("Room", "MainHall");
	CurrentCharacter = null;
	IntroductionMaid.Stage = "432";
	IntroductionJobCount = 0;
}

/**
 * Triggered when the kidnap daily job fight mini-game is lost. Sends the player back to the main hall and allow the player to retry later.
 * @returns {void} - Nothing
 */
function DailyJobKidnapFail() {
	CommonSetScreen("Room", "MainHall");
	DailyJobOpponent.Stage = "10";
	CurrentCharacter = null;
	DialogChangeReputation("Dominant", -1);
}

/**
 * Triggered when the puppy walker job minigame is started
 * @returns {void} - Nothing
 */
function DailyJobPuppyGameStart() {
	MiniGameStart("PuppyWalker", 0, "DailyJobPuppyGameEnd");
}

/**
 * Triggered at the end of the puppy walker job fight mini-game
 * @returns {void} - Nothing
 */
function DailyJobPuppyGameEnd() {
	CommonSetScreen("Room", "DailyJob");
	DailyJobPuppyMistress.Stage = (MiniGameVictory) ? "100" : "200";
	CharacterSetCurrent(DailyJobPuppyMistress);
	if (MiniGameVictory) IntroductionJobDone();
	IntroductionMaid.Stage = "0";
	DailyJobPuppyMistress.CurrentDialog = DialogFind(DailyJobPuppyMistress, (MiniGameVictory) ? "PuppyVictory" : "PuppyDefeat");
}

/**
 * Triggered when a daily job ends, sends the player back to the main hall
 * @returns {void} - Nothing
 */
function DailyJobEnd() {
	CommonSetScreen("Room", "MainHall");
	CurrentCharacter = null;
}

/**
 * Triggered when the player is turned into a puppy by the Mistress
 * @returns {void} - Nothing
 */
function DailyJobPuppyPlayer() {
	DailyJobPuppyLoad("0");
}

/**
 * Triggered when the player is restrained during the dojo minigame
 * @returns {void} - Nothing
 */
function DailyJobDojoRestrainPlayer() {
	InventoryWear(Player, "HempRope", "ItemArms", "Default", 7);
	if (InventoryGet(Player, "ItemTorso") == null) {
		InventoryWear(Player, "HempRopeHarness", "ItemTorso", "Default", 7);
		InventoryGet(Player, "ItemTorso").Property = { Type: "Harness", Difficulty: 0, Effect: [] };
	}
	CharacterRefresh(Player);
}

/**
 * Triggered when the dojo struggle job minigame is started
 * @returns {void} - Nothing
 */
function DailyJobDojoGameStart() {
	MiniGameStart("DojoStruggle", 0, "DailyJobDojoGameEnd");
}

/**
 * Triggered at the end of the dojo struggle job minigame 
 * @returns {void} - Nothing
 */
function DailyJobDojoGameEnd() {
	CommonSetScreen("Room", "DailyJob");
	DailyJobDojoTeacher.Stage = (MiniGameVictory) ? "100" : "200";
	CharacterSetCurrent(DailyJobDojoTeacher);
	if (MiniGameVictory) IntroductionJobDone();
	IntroductionMaid.Stage = "0";
	DailyJobDojoTeacher.CurrentDialog = DialogFind(DailyJobDojoTeacher, (MiniGameVictory) ? "DojoStruggleVictory" : "DojoStruggleDefeat");
}