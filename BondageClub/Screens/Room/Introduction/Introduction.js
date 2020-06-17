"use strict";
var IntroductionBackground = "Introduction";
var IntroductionMaid = null;
var IntroductionSub = null;
var IntroductionMaidOpinion = 0;
var IntroductionHasBasicItems = false;
var IntroductionSubRestrained = false;
var IntroductionIsMaid = false;
var IntroductionIsHeadMaid = false;
var IntroductionRescueScenario = "";
var IntroductionRescueScenarioList = ["LatexWoman", "Newcomer", "MaidFight", "SalesWoman"];
var IntroductionJobList = ["DomPuppy", "DomLock", "DomKidnap", "DomTrainer", "SubSearch", "SubDojo", "SubActivity", "SubMaid"];
var IntroductionJobCurrent = "";
var IntroductionJobCount = 1;
var IntroductionJobParam = null;
var IntroductionJobPosition = { Active: false, X: 1000, Y: 1000 };
var IntroductionJobLockList = ["MetalPadlock", "IntricatePadlock", "TimerPadlock", "CombinationPadlock", "ExclusivePadlock"];
var IntroductionJobSearchList = ["MaidQuarters", "LARP", "KidnapLeague", "SlaveMarket"];
var IntroductionJobMember = [];

// Returns TRUE if the dialog situation is allowed
function IntroductionIsRescueScenario(ScenarioName) { return (IntroductionRescueScenario == ScenarioName) }
function IntroductionIsBothFree() { return (!IntroductionMaid.IsRestrained() && IntroductionMaid.CanTalk() && !IntroductionSub.IsRestrained() && IntroductionMaid.CanTalk()) }
function IntroductionIsMaidRestrained() { return (IntroductionMaid.IsRestrained() || !IntroductionMaid.CanTalk()) }
function IntroductionNoTitle() { return (!LogQuery("JoinedSorority", "Maid") && !LogQuery("ClubMistress", "Management")) }
function IntroductionJobIsComplete() { return (IntroductionJobCount <= 0) }
function IntroductionCanTakeJob() { return (IntroductionJobAnyAvailable() && !Player.IsRestrained() && Player.CanTalk() && !IntroductionMaid.IsRestrained() && IntroductionMaid.CanTalk() && !ManagementIsClubSlave()) }
function IntroductionCannotTakeJobDone() { return (!IntroductionJobAnyAvailable() && !Player.IsRestrained() && Player.CanTalk() && !IntroductionMaid.IsRestrained() && IntroductionMaid.CanTalk() && !ManagementIsClubSlave()) }
function IntroductionCannotTakeJobRestrained() { return (IntroductionJobAnyAvailable() && (Player.IsRestrained() || !Player.CanTalk() || IntroductionMaid.IsRestrained() || !IntroductionMaid.CanTalk()) && !ManagementIsClubSlave()) }

// Loads the introduction room
function IntroductionLoad() {

	// Checks if the player already has the basic items
	IntroductionHasBasicItems = (InventoryAvailable(Player, "NylonRope", "ItemFeet") && InventoryAvailable(Player, "NylonRope", "ItemLegs") && InventoryAvailable(Player, "NylonRope", "ItemArms") && InventoryAvailable(Player, "ClothGag", "ItemMouth"));
	IntroductionIsMaid = LogQuery("JoinedSorority", "Maid");
	IntroductionIsHeadMaid = LogQuery("LeadSorority", "Maid");
	
	// Creates two characters to begin with
	IntroductionMaid = CharacterLoadNPC("NPC_Introduction_Maid");
	IntroductionSub = CharacterLoadNPC("NPC_Introduction_Sub");

	// Rescue mission load
	if ((MaidQuartersCurrentRescue == "IntroductionClass") && !MaidQuartersCurrentRescueStarted) {
		MaidQuartersCurrentRescueStarted = true;
		InventoryAdd(IntroductionMaid, "LeatherArmbinder", "ItemArms");
		InventoryAdd(IntroductionMaid, "LeatherBelt", "ItemLegs");
		InventoryAdd(IntroductionMaid, "LeatherBelt", "ItemFeet");
		InventoryWear(IntroductionMaid, "LeatherArmbinder", "ItemArms");
		InventoryWear(IntroductionMaid, "LeatherBelt", "ItemLegs");
		InventoryWear(IntroductionMaid, "LeatherBelt", "ItemFeet");
		InventoryWearRandom(IntroductionMaid, "ItemMouth");
		InventoryAdd(IntroductionSub, "LeatherArmbinder", "ItemArms");
		InventoryAdd(IntroductionSub, "LeatherBelt", "ItemLegs");
		InventoryAdd(IntroductionSub, "LeatherBelt", "ItemFeet");
		InventoryWear(IntroductionSub, "LeatherArmbinder", "ItemArms");
		InventoryWear(IntroductionSub, "LeatherBelt", "ItemLegs");
		InventoryWear(IntroductionSub, "LeatherBelt", "ItemFeet");
		InventoryWearRandom(IntroductionSub, "ItemMouth");
		IntroductionMaid.Stage = "MaidRescue";
		IntroductionMaid.AllowItem = true;
		IntroductionSub.Stage = "MaidRescue";
		IntroductionRescueScenario = CommonRandomItemFromList(IntroductionRescueScenario, IntroductionRescueScenarioList);
	}

}

// Run the main introduction room, draw all 3 characters
function IntroductionRun() {
	IntroductionSubRestrained = (!IntroductionSub.CanTalk() && !IntroductionSub.CanWalk() && !IntroductionSub.CanInteract());
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(IntroductionMaid, 750, 0, 1);
	DrawCharacter(IntroductionSub, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the introduction room
function IntroductionClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(IntroductionMaid);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(IntroductionSub);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// The maid opinion will affect the global player Domme/sub reputation at the end of the first training
function IntroductionChangeMaidOpinion(Bonus) {
	IntroductionMaidOpinion = IntroductionMaidOpinion + parseInt(Bonus);
}

// Gives focus on certain body parts with rectangles
function IntroductionSetZone(NewZone) {
	for (var A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == NewZone) {
			Player.FocusGroup = AssetGroup[A];
			CurrentCharacter.FocusGroup = AssetGroup[A];
			break;
		}
}

// Clears the body part focus rectangles
function IntroductionClearZone() {
	Player.FocusGroup = null;
	CurrentCharacter.FocusGroup = null;
}

// The maid can give basic items to the player
function IntroductionGetBasicItems() {
	InventoryAdd(Player, "NylonRope", "ItemFeet");
	InventoryAdd(Player, "NylonRope", "ItemLegs");
	InventoryAdd(Player, "NylonRope", "ItemArms");
	InventoryAdd(Player, "ClothGag", "ItemMouth");
	InventoryAdd(Player, "ClothGag", "ItemMouth2");
	InventoryAdd(Player, "ClothGag", "ItemMouth3");
	IntroductionHasBasicItems = true;
}

// Saves the maid opinion of the player to the server
function IntroductionSaveMaidOpinion() {
	if (!LogQuery("MaidOpinion", "Introduction")) {
		LogAdd("MaidOpinion", "Introduction");
		ReputationProgress("Dominant", IntroductionMaidOpinion);
	}
}

// Returns TRUE if the maid can restrain the player
function IntroductionAllowRestrainPlayer() {
	return (Player.CanInteract() && IntroductionMaid.CanInteract());
}

// Gags the player unless she's head maid
function IntroductionGagPlayer() {
	if (IntroductionIsHeadMaid) {
		CharacterRelease(Player);
		IntroductionMaid.CurrentDialog = DialogFind(IntroductionMaid, "ReleaseHeadMaid");
		IntroductionMaid.Stage = "370";
	} else DialogWearItem("ClothGag", "ItemMouth");
}

// When the player rescue both girls and completes the mission
function IntroductionCompleteRescue() {
	IntroductionMaid.AllowItem = LogQuery("LeadSorority", "Maid");
	CharacterRelease(IntroductionMaid);
	CharacterRelease(IntroductionSub);
	MaidQuartersCurrentRescueCompleted = true;
	IntroductionSub.Stage = "0";
}

// When a job is done, no new job can be taken on the same day, the day is based on the server date
function IntroductionJobDone() {
	CharacterChangeMoney(Player, 100);
	var NextDay = Math.floor(CurrentTime / (24 * 60 * 60 * 1000)) + 1;
	LogAdd("DailyJobDone", "Introduction", NextDay * 24 * 60 * 60 * 1000);
	IntroductionJobCurrent = "";
}

// Returns TRUE if a specific daily job is available for the player, each job is available in a rotating fashion
function IntroductionJobAvailable(JobName) {
	if (LogQuery("DailyJobDone", "Introduction")) return false;
	if ((JobName.substr(0, 3) == "Dom") && (ReputationGet("Dominant") <= -50)) return false;
	if ((JobName.substr(0, 3) == "Sub") && (ReputationGet("Dominant") >= 50)) return false;
	var Day = Math.floor(CurrentTime / (24 * 60 * 60 * 1000));
	if (Day % (IntroductionJobList.length / 2) != IntroductionJobList.indexOf(JobName) % (IntroductionJobList.length / 2)) return false;
	return true;
}

// Returns TRUE if any job is available for the player
function IntroductionJobAnyAvailable() {
	for (var J = 0; J < IntroductionJobList.length; J++)
		if (IntroductionJobAvailable(IntroductionJobList[J]))
			return true;
	return false;
}

// Cancels the job and hits the reputation a little
function IntroductionJobStart(JobName, JobCount) {
	IntroductionJobCurrent = JobName;
	IntroductionJobCount = parseInt(JobCount);
	IntroductionJobParam = null;
	if (JobName == "DomLock") {
		var Day = Math.floor(CurrentTime / (24 * 60 * 60 * 1000));
		IntroductionJobParam = IntroductionJobLockList[Day % IntroductionJobLockList.length];
	}
	if (JobName == "SubActivity") IntroductionJobParam = "100";
	if (JobName == "SubSearch") {
		IntroductionJobParam = IntroductionJobSearchList[Math.floor(Math.random() * IntroductionJobSearchList.length)];
		IntroductionJobPosition = { Active: false, X: Math.floor(Math.random() * 1700) + 100, Y: Math.floor(Math.random() * 800) + 100 };
	}
	IntroductionJobMember = [];
}

// Cancels the job and hits the reputation a little
function IntroductionJobGiveUp() {
	if (ReputationGet("Dominant") < 0) DialogChangeReputation("Dominant", 1);
	if (ReputationGet("Dominant") > 0) DialogChangeReputation("Dominant", -1);
	IntroductionJobCurrent = "";
}

// Shows the lock description that the player must apply
function IntroductionJobLockType() {
	var Item = AssetGet(Player.AssetFamily, "ItemMisc", IntroductionJobParam);
	if (Item != null) IntroductionMaid.CurrentDialog = DialogFind(IntroductionMaid, "JobLockType").replace("LockType", Item.Description);
}

// When a possible progress is registered, we check if it counts toward the daily job
function IntroductionJobProgress(JobName, Param, UniqueMember) {
	if ((UniqueMember == true) && (CurrentScreen != "ChatRoom")) return;
	if ((IntroductionJobCurrent == JobName) && (IntroductionJobParam == Param)) {
		if ((UniqueMember == true) && ((CurrentCharacter == null) || (CurrentCharacter.ID == 0) || (CurrentCharacter.MemberNumber == null) || (CurrentCharacter.MemberNumber < 1) || (IntroductionJobMember.indexOf(CurrentCharacter.MemberNumber) >= 0))) return;
		if (UniqueMember == true) IntroductionJobMember.push(CurrentCharacter.MemberNumber);
		IntroductionJobCount--;
	}
}

// When the daily kidnapping job starts
function IntroductionJobBouncerStart() {
	CommonSetScreen("Room", "DailyJob");
	CharacterSetCurrent(DailyJobOpponent);
	CharacterRelease(DailyJobOpponent);
	DailyJobOpponent.CurrentDialog = DialogFind(IntroductionMaid, "JobKidnapIntro" + DailyJobOpponent.Stage.toString() + Math.floor(Math.random() * 4).toString());
}

// When the daily dog walking job starts
function IntroductionJobPuppyStart() {
	CommonSetScreen("Room", "DailyJob");
	CharacterSetCurrent(DailyJobPuppyMistress);
	DailyJobPuppyMistress.CurrentDialog = DialogFind(IntroductionMaid, "JobPuppyIntro" + DailyJobPuppyMistress.Stage.toString() + Math.floor(Math.random() * 4).toString());
}

// When the daily dojo job starts
function IntroductionJobDojoStart() {
	CommonSetScreen("Room", "DailyJob");
	DailyJobBackground = "Shibari";
	CharacterSetCurrent(DailyJobDojoTeacher);
	DailyJobDojoTeacher.CurrentDialog = DialogFind(IntroductionMaid, "JobDojoIntro" + DailyJobDojoTeacher.Stage.toString() + Math.floor(Math.random() * 4).toString());
}