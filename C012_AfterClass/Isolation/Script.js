var C012_AfterClass_Isolation_CurrentStage = 0;
var C012_AfterClass_Isolation_IntroText = "";
var C012_AfterClass_Isolation_CurrentActor = "";
var C012_AfterClass_Isolation_IsolationEscape = false;
var C012_AfterClass_Isolation_IsolationStuck = false;
var C012_AfterClass_Isolation_SarahOnCross = false;
var C012_AfterClass_Isolation_SarahOnPillory = false;
var C012_AfterClass_Isolation_SarahOnHorse = false;
var C012_AfterClass_Isolation_SarahRestrained = false;
var C012_AfterClass_Isolation_PlayerRestrained = false;
var C012_AfterClass_Isolation_CuteRemarkDone = false;
var C012_AfterClass_Isolation_WetRemarkDone = false;
var C012_AfterClass_Isolation_DommeRemarkDone = false;
var C012_AfterClass_Isolation_SpankDone = false;
var C012_AfterClass_Isolation_MasturbateDone = false;
var C012_AfterClass_Isolation_DontLikeRemarkDone = false;

// Chapter 12 After Class - Isolation Load
function C012_AfterClass_Isolation_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	ActorLoad("Sarah", "");
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C012_AfterClass_Isolation_IsolationEscape = GameLogQuery("C006_Isolation", "", "Escape");
	C012_AfterClass_Isolation_IsolationStuck = (GameLogQuery("C006_Isolation", "", "Pillory") || GameLogQuery("C006_Isolation", "", "Cross"));

	// If we must put the previous text or previous actor back
	if (C012_AfterClass_Isolation_IntroText != "") { OverridenIntroText = C012_AfterClass_Isolation_IntroText; C012_AfterClass_Isolation_IntroText = ""; }
	if (C012_AfterClass_Isolation_CurrentActor != "") ActorLoad(C012_AfterClass_Isolation_CurrentActor, "");

	// No leaving from the room
	LeaveIcon = "";
	LeaveScreen = "";

}

// Chapter 12 After Class - Isolation Run
function C012_AfterClass_Isolation_Run() {
	BuildInteraction(C012_AfterClass_Isolation_CurrentStage);
}

// Chapter 12 After Class - Isolation Click
function C012_AfterClass_Isolation_Click() {	

	// Regular interactions
	OverridenIntroImage = "";
	ClickInteraction(C012_AfterClass_Isolation_CurrentStage);

	// The image can switch if Sarah is stranded
	if ((C012_AfterClass_Isolation_CurrentStage >= 20) && (C012_AfterClass_Isolation_CurrentStage < 100)) {
		if (C012_AfterClass_Isolation_SarahOnCross) OverridenIntroImage = "IsolationCrossSarah.jpg";
		if (C012_AfterClass_Isolation_SarahOnPillory) OverridenIntroImage = "IsolationPillorySarah.jpg";
		if (C012_AfterClass_Isolation_SarahOnHorse) OverridenIntroImage = "IsolationHorseSarah.jpg";
	}

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_Isolation_IntroText = OverridenIntroText;
		C012_AfterClass_Isolation_CurrentActor = CurrentActor; 
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 12 After Class - When the player leaves the isolation room
function C012_AfterClass_Isolation_Leave(LeaveType) {
	CurrentTime = CurrentTime + 290000;
	C012_AfterClass_Dorm_LeavingGuest();
	if (LeaveType == "Sarah") GameLogAdd("EnterDormFromRoommates");
	if (LeaveType == "Stranded") GameLogAdd("IsolationStranded");
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - When the player searches, a collar and cuffs can be found
function C012_AfterClass_Isolation_Search() {
	CurrentTime = CurrentTime + 110000;
	if (!GameLogQuery(CurrentChapter, "Player", "IsolationFindCollar")) {
		GameLogSpecificAdd(CurrentChapter, "Player", "IsolationFindCollar");
		OverridenIntroText = GetText("FindCollar");
		PlayerAddInventory("Collar", 1);
	}
}

// Chapter 12 After Class - The player can cruise Sarah when she's restrained
function C012_AfterClass_Isolation_CuteRemark() {
	if (!C012_AfterClass_Isolation_CuteRemarkDone) {
		C012_AfterClass_Isolation_CuteRemarkDone = true;
		ActorChangeAttitude(1, 0);
	}
}

// Chapter 12 After Class - The player can tell Sarah she's wet when she's restrained
function C012_AfterClass_Isolation_WetRemark() {
	if (!C012_AfterClass_Isolation_WetRemarkDone) {
		C012_AfterClass_Isolation_WetRemarkDone = true;
		ActorChangeAttitude(0, 1);
	}
}

// Chapter 12 After Class - The player on a device can become more submissive to Sarah
function C012_AfterClass_Isolation_DommeRemark() {
	if (!C012_AfterClass_Isolation_DommeRemarkDone) {
		C012_AfterClass_Isolation_DommeRemarkDone = true;
		ActorChangeAttitude(0, -1);
	}
}

// Chapter 12 After Class - When the player is negative
function C012_AfterClass_Isolation_DontLikeRemark() {
	if (!C012_AfterClass_Isolation_DontLikeRemarkDone) {
		C012_AfterClass_Isolation_DontLikeRemarkDone = true;
		ActorChangeAttitude(-1, 0);
	}	
}

// Chapter 12 After Class - The player can spank Sarah on the Pillory
function C012_AfterClass_Isolation_Spank() {
	if (!C012_AfterClass_Isolation_SpankDone) {
		C012_AfterClass_Isolation_SpankDone = true;
		ActorChangeAttitude(1, 1);
	}
}

// Chapter 12 After Class - The player can spank Sarah on the Pillory
function C012_AfterClass_Isolation_Masturbate() {
	if (!C012_AfterClass_Isolation_MasturbateDone) {
		C012_AfterClass_Isolation_MasturbateDone = true;
		ActorChangeAttitude(1, -1);
	}
}

// Chapter 12 After Class - The player can lock up Sarah
function C012_AfterClass_Isolation_LockSarah(LockType) {
	C012_AfterClass_Isolation_SarahRestrained = (LockType != "");
	C012_AfterClass_Isolation_SarahOnCross = (LockType == "Cross");
	C012_AfterClass_Isolation_SarahOnPillory = (LockType == "Pillory");
	C012_AfterClass_Isolation_SarahOnHorse = (LockType == "Horse");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - The player can be locked up
function C012_AfterClass_Isolation_LockPlayer(LockType) {
	C012_AfterClass_Isolation_PlayerRestrained = (LockType != "");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Wait for 15 minutes
function C012_AfterClass_Isolation_Wait() {
	CurrentTime = CurrentTime + 900000;
}

// Chapter 12 After Class - The player can check on Sarah
function C012_AfterClass_Isolation_CheckSarah() {
	if (C012_AfterClass_Isolation_SarahOnCross) OverridenIntroImage = "CrossSarah.jpg";
	if (C012_AfterClass_Isolation_SarahOnPillory) OverridenIntroImage = "PillorySarah.jpg";
	if (C012_AfterClass_Isolation_SarahOnHorse) OverridenIntroImage = "HorseSarah.jpg";
}