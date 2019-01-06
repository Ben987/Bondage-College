var C012_AfterClass_Pub_CurrentStage = 0;
var C012_AfterClass_Pub_SidneyAvail = false;
var C012_AfterClass_Pub_EmptyPub = true;
var C012_AfterClass_Pub_IntroText = "";
var C012_AfterClass_Pub_CurrentActor = "";
var C012_AfterClass_Pub_HasSeduction = false;
var C012_AfterClass_Pub_SidneyBelted = false;
var C012_AfterClass_Pub_ChastityBeltDeal = false;
var C012_AfterClass_Pub_WaitTimeWithSidney = 0;

// Calculates who's in the pub depending on the time of the day
function C012_AfterClass_Pub_WhoInIsPub() {

	// Sets who's at the pub at what time
	C012_AfterClass_Pub_SidneyAvail = ((CurrentTime >= 17 * 60 * 60 * 1000) && (CurrentTime <= 19 * 60 * 60 * 1000) && !GameLogQuery(CurrentChapter, "Sidney", "Pub"));
	C012_AfterClass_Pub_EmptyPub = (!C012_AfterClass_Pub_SidneyAvail);

}

// Chapter 12 After Class - Pub Load
function C012_AfterClass_Pub_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C012_AfterClass_Pub_HasSeduction = (PlayerGetSkillLevel("Seduction") >= 1);
	C012_AfterClass_Pub_SidneyBelted = (ActorHasInventory("ChastityBelt"));

	// If we must put the previous text or previous actor back
	if (C012_AfterClass_Pub_IntroText != "") { OverridenIntroText = C012_AfterClass_Pub_IntroText; C012_AfterClass_Pub_IntroText = ""; }
	if (C012_AfterClass_Pub_CurrentActor != "") ActorLoad(C012_AfterClass_Pub_CurrentActor, "");
	if (C012_AfterClass_Pub_CurrentStage == 0) C012_AfterClass_Pub_WhoInIsPub();

	// No leaving from the pub
	LeaveIcon = "";
	LeaveScreen = "";
	
}

// Chapter 12 After Class - Pub Run
function C012_AfterClass_Pub_Run() {
	BuildInteraction(C012_AfterClass_Pub_CurrentStage);
	if (CurrentActor != "") {
		DrawActor(CurrentActor, 600, 0, 1);
		if (C012_AfterClass_Pub_CurrentStage < 210) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PubCounter.jpg", 600, 500);
		if ((C012_AfterClass_Pub_CurrentStage >= 220) && (C012_AfterClass_Pub_CurrentStage <= 229)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PubCounter.jpg", 600, 500);
	}
	if ((C012_AfterClass_Pub_CurrentStage >= 210) && (C012_AfterClass_Pub_CurrentStage <= 219)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/Pusher.png", 600, 0);
}

// Chapter 12 After Class - Pub Click
function C012_AfterClass_Pub_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Pub_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_Pub_IntroText = OverridenIntroText;
		C012_AfterClass_Pub_CurrentActor = CurrentActor; 
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}
	
}

// Chapter 12 After Class - When the player leaves the pub
function C012_AfterClass_Pub_Leave() {
	CurrentTime = CurrentTime + 290000;
	C012_AfterClass_Dorm_LeavingGuest();
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Wait for a while and recalculate who's in the pub
function C012_AfterClass_Pub_Wait() {
	CurrentTime = CurrentTime + 290000;	
	C012_AfterClass_Pub_WhoInIsPub();
}

// Chapter 12 After Class - Meet Sidney
function C012_AfterClass_Pub_SidneyStart() {

	// Load Sidney data
	ActorLoad("Sidney", "");
	ActorSetCloth("Shorts");
	GameLogAdd("Pub");
	LeaveIcon = "";
	var Love = ActorGetValue(ActorLove);
	var Sub = ActorGetValue(ActorSubmission);
	
	// If Sidney is belted
	if (ActorHasInventory("ChastityBelt")) {
		ActorSetPose("Angry");
		C012_AfterClass_Pub_CurrentStage = 100;
		return;
	}
	
	// If Sidney has the egg
	if (ActorHasInventory("VibratingEgg")) {
		ActorSetPose("Angry");
		C012_AfterClass_Pub_CurrentStage = 110;
		return;
	}
	
	// If Sidney is dominant and more so than love/hate
	if ((Sub <= -8) && (Math.abs(Sub) >= Math.abs(Love))) {
		ActorSetPose("Point");
		C012_AfterClass_Pub_CurrentStage = 120;
		return;
	}

	// If Sidney is submissive and more so than love/hate
	if ((Sub >= 8) && (Math.abs(Sub) >= Math.abs(Love))) {
		ActorSetPose("Shy");
		C012_AfterClass_Pub_CurrentStage = 130;
		return;
	}
	
	// If Sidney hates the player
	if (Love <= -8) {
		ActorSetPose("Fuck");
		C012_AfterClass_Pub_CurrentStage = 140;
		return;
	}

	// If Sidney loves the player
	if (Love >= 8) {
		ActorSetPose("Wave");
		C012_AfterClass_Pub_CurrentStage = 150;
		return;
	}

	// If the player was class leader in chapter 11
	if (GameLogQuery("C011_LiteratureClass", "", "ClassLeader")) {
		C012_AfterClass_Pub_CurrentStage = 160;
		return;
	}

	// If the player left Sidney as a pig in chapter 10
	if (GameLogQuery("C010_Revenge", "", "Pig")) {
		ActorSetPose("Angry");
		C012_AfterClass_Pub_CurrentStage = 170;
		return;
	}

	// If the player went to detention in chapter 3
	if (GameLogQuery("C001_BeforeClass", "", "FightVictory") || GameLogQuery("C001_BeforeClass", "", "FightDefeat") || GameLogQuery("C001_BeforeClass", "", "PublicBondage")) {
		C012_AfterClass_Pub_CurrentStage = 180;
		return;
	}
	
	// No special feelings and conversation
	C012_AfterClass_Pub_CurrentStage = 190;

}

// Chapter 12 After Class - Leave Sidney
function C012_AfterClass_Pub_SidneyEnd() {
	C012_AfterClass_Pub_WhoInIsPub();
	CurrentActor = "";
}

// Chapter 12 After Class - When Sidney ducks to hide
function C012_AfterClass_Pub_SetPose(NewPose) {
	ActorSetPose(NewPose);
}

// Chapter 12 After Class - When the player meets Sidney pusher
function C012_AfterClass_Pub_SetActor(NewActor) {
	CurrentActor = NewActor;
}

// Chapter 12 After Class - When the player leaves with Sidney
function C012_AfterClass_Pub_LeaveWithSidney(NewPose) {
	CurrentTime = CurrentTime + 290000;
	GameLogAdd("EnterDormFromPub");
	ActorSetPose(NewPose);
}

// Chapter 12 After Class - When the player leaves with Sidney
function C012_AfterClass_Pub_BackToDorm() {
	ActorSetPose("");
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Logs an event
function C012_AfterClass_Pub_GameLog(NewLog) {
	GameLogSpecificAdd(CurrentChapter, CurrentActor, NewLog);
	if ((NewLog == "DebtChastityBelt") && !C012_AfterClass_Pub_SidneyBelted) C012_AfterClass_Pub_ChastityBeltDeal = true;
}

// Chapter 12 After Class - The pusher can give a chastity belt to the player
function C012_AfterClass_Pub_GetChastityBelt() {
	PlayerAddInventory("ChastityBelt", 1);
	GameLogSpecificAdd(CurrentChapter, CurrentActor, "DebtChastityBelt");
	if (!C012_AfterClass_Pub_SidneyBelted) C012_AfterClass_Pub_ChastityBeltDeal = true;
}

// Chapter 12 After Class - Spend some time with Sidney (can raise relationship)
function C012_AfterClass_Pub_WaitWithSidney() {
	CurrentTime = CurrentTime + 290000;
	C012_AfterClass_Pub_WaitTimeWithSidney++;
	if (C012_AfterClass_Pub_WaitTimeWithSidney == 4) ActorChangeAttitude(1, 0);
	if (C012_AfterClass_Pub_WaitTimeWithSidney == 10) ActorChangeAttitude(1, 0);
	if (CurrentTime >= 19 * 60 * 60 * 1000) {
		C012_AfterClass_Pub_SidneyEnd();
		OverridenIntroText = GetText("SidneyLeavesOnTime");
		C012_AfterClass_Pub_CurrentStage = 0;
	}
}

// Chapter 12 After Class - When the player searches, 1 crop can be found
function C012_AfterClass_Pub_Search() {
	CurrentTime = CurrentTime + 50000;
	if (!GameLogQuery(CurrentChapter, "Player", "PubFindCrop")) {
		GameLogSpecificAdd(CurrentChapter, "Player", "PubFindCrop");
		OverridenIntroText = GetText("FindCrop");
		PlayerAddInventory("Crop", 1);
	}
}
