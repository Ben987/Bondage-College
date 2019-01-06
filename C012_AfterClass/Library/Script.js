var C012_AfterClass_Library_CurrentStage = 0;
var C012_AfterClass_Library_AmandaAvail = false;
var C012_AfterClass_Library_EmptyLibrary = true;
var C012_AfterClass_Library_IntroText = "";
var C012_AfterClass_Library_CurrentActor = "";
var C012_AfterClass_Library_HasSeduction = false;
var C012_AfterClass_Library_HasEgg = false;
var C012_AfterClass_Library_AmandaBelted = false;
var C012_AfterClass_Library_StudyTimeWithAmanda = 0;
var C012_AfterClass_Library_StudyTimeHelpedByAmanda = 0;
var C012_AfterClass_Library_StudyTimeHelpAmanda = 0;
var C012_AfterClass_Library_PoemAvail = false;
var C012_AfterClass_Library_PlayerDormAvail = true;
var C012_AfterClass_Library_AmandaDormAvail = true;
var C012_AfterClass_Library_DinnerAvail = true;

// Calculates who's in the library depending on the time of the day
function C012_AfterClass_Library_WhoIsInLibrary() {

	// Sets who's at the library at what time
	C012_AfterClass_Library_PlayerDormAvail = true;
	C012_AfterClass_Library_AmandaDormAvail = true;
	C012_AfterClass_Library_DinnerAvail = true;
	C012_AfterClass_Library_AmandaAvail = ((CurrentTime >= 18 * 60 * 60 * 1000) && (CurrentTime <= 21 * 60 * 60 * 1000) && !GameLogQuery(CurrentChapter, "Amanda", "EnterDormFromLibrary"));
	C012_AfterClass_Library_EmptyLibrary = (!C012_AfterClass_Library_AmandaAvail);
	C012_AfterClass_Library_PoemAvail = (!GameLogQuery(CurrentChapter, "Amanda", "StartPoem") && (C012_AfterClass_Library_StudyTimeWithAmanda + C012_AfterClass_Library_StudyTimeHelpAmanda + C012_AfterClass_Library_StudyTimeHelpedByAmanda >= 3));
	
	// Closing time when the player is alone
	if ((CurrentTime >= 21 * 60 * 60 * 1000) && (CurrentActor == "")) {
		OverridenIntroText = GetText("LibraryClosingAlone");
		C012_AfterClass_Library_CurrentStage = 10;
	}

	// Closing time when the player is with Amanda
	if ((CurrentTime >= 21 * 60 * 60 * 1000) && (CurrentActor == "Amanda")) {
		if (ActorGetValue(ActorSubmission) >= 10) ActorSetPose("Shy");
		else ActorSetPose("");
		OverridenIntroText = GetText("LibraryClosingAmanda");
		C012_AfterClass_Library_CurrentStage = 230;
	}
	
}

// Chapter 12 After Class - Library Load
function C012_AfterClass_Library_Load() {

	// Loads the scene to search in the wardrobe
	LoadInteractions();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C012_AfterClass_Library_HasSeduction = (PlayerGetSkillLevel("Seduction") >= 1);
	C012_AfterClass_Library_HasEgg = (PlayerHasLockedInventory("VibratingEgg"));
	C012_AfterClass_Library_AmandaBelted = (ActorHasInventory("ChastityBelt"));

	// If we must put the previous text or previous actor back
	if (C012_AfterClass_Library_IntroText != "") { OverridenIntroText = C012_AfterClass_Library_IntroText; C012_AfterClass_Library_IntroText = ""; }
	if ((C012_AfterClass_Library_CurrentActor != "") && (C012_AfterClass_Library_CurrentStage != 0)) ActorLoad(C012_AfterClass_Library_CurrentActor, "");
	if (C012_AfterClass_Library_CurrentStage == 0) C012_AfterClass_Library_WhoIsInLibrary();

	// No leaving from the library
	LeaveIcon = "";
	LeaveScreen = "";
	
}

// Chapter 12 After Class - Library Run (In stage 3XX we are in study mode with both the player and Amanda)
function C012_AfterClass_Library_Run() {
	BuildInteraction(C012_AfterClass_Library_CurrentStage);
	if (CurrentActor != "") {
		if ((C012_AfterClass_Library_CurrentStage >= 300) && (C012_AfterClass_Library_CurrentStage <= 399)) {
			DrawActor("Player", 390, 100, 1.2);
			DrawActor(CurrentActor, 680, 100, 1.2);
		} else DrawActor(CurrentActor, 600, 0, 1);
	}
}

// Chapter 12 After Class - Library Click
function C012_AfterClass_Library_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Library_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_Library_IntroText = OverridenIntroText;
		C012_AfterClass_Library_CurrentActor = CurrentActor;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}
	
}

// Chapter 12 After Class - When the player leaves the library
function C012_AfterClass_Library_Leave() {
	CurrentTime = CurrentTime + 290000;
	C012_AfterClass_Dorm_LeavingGuest();
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Wait for a while and recalculate who's in the library
function C012_AfterClass_Library_Wait() {
	CurrentTime = CurrentTime + 290000;	
	C012_AfterClass_Library_WhoIsInLibrary();
}

// Chapter 12 After Class - Meet Amanda
function C012_AfterClass_Library_AmandaStart() {

	// Load Amanda data
	ActorLoad("Amanda", "");
	ActorSetCloth("");
	ActorSetPose("");
	LeaveIcon = "";
	var Love = ActorGetValue(ActorLove);
	var Sub = ActorGetValue(ActorSubmission);
	
	// If the intro is already done, we jump to the study stage
	if (GameLogQuery(CurrentChapter, "Amanda", "LibraryIntro")) {
		if (Sub >= 10) ActorSetPose("Shy");
		C012_AfterClass_Library_CurrentStage = 200;
		return;
	} else GameLogAdd("LibraryIntro");
	
	// If Amanda is dominant and more so than love/hate
	if ((Sub <= -10) && (Math.abs(Sub) >= Math.abs(Love))) {
		ActorSetPose("Point");
		C012_AfterClass_Library_CurrentStage = 100;
		return;
	}

	// If Amanda is submissive and more so than love/hate
	if ((Sub >= 10) && (Math.abs(Sub) >= Math.abs(Love))) {
		ActorSetPose("Shy");
		C012_AfterClass_Library_CurrentStage = 110;
		return;
	}
	
	// If Amanda hates the player
	if (Love <= -10) {
		ActorSetPose("Angry");
		C012_AfterClass_Library_CurrentStage = 120;
		return;
	}

	// If Amanda loves the player
	if (Love >= 10) {
		ActorSetPose("Love");
		C012_AfterClass_Library_CurrentStage = 130;
		return;
	}
	
	// If Amanda is belted
	if (ActorHasInventory("ChastityBelt")) {
		ActorSetPose("Angry");
		C012_AfterClass_Library_CurrentStage = 140;
		return;
	}
	
	// If Amanda has the egg
	if (ActorHasInventory("VibratingEgg")) {
		ActorSetPose("Shy");
		C012_AfterClass_Library_CurrentStage = 150;
		return;
	}
	
	// If the player was locked in the locker in chapter 10
	if (GameLogQuery("C010_Revenge", "Player", "Locker")) {
		ActorSetPose("Point");
		C012_AfterClass_Library_CurrentStage = 160;
		return;
	}

	// If Amanda was locked in the locker in chapter 10
	if (GameLogQuery("C010_Revenge", "Amanda", "Locker")) {
		ActorSetPose("Shy");
		C012_AfterClass_Library_CurrentStage = 170;
		return;
	}

	// If the player tied up Mildred in chapter 2
	if (GameLogQuery("C002_FirstClass", "Mildred", "Subdue")) {
		ActorSetPose("Love");
		C012_AfterClass_Library_CurrentStage = 180;
		return;
	}
	
	// No special feelings and conversation
	C012_AfterClass_Library_CurrentStage = 190;

}

// Chapter 12 After Class - Leave Amanda
function C012_AfterClass_Library_AmandaEnd() {
	C012_AfterClass_Library_WhoIsInLibrary();
	CurrentActor = "";
}

// Chapter 12 After Class - When the current actor changes pose
function C012_AfterClass_Library_SetPose(NewPose) {
	ActorSetPose(NewPose);
}

// Chapter 12 After Class - When the player leaves with Amanda
function C012_AfterClass_Library_LeaveWithAmanda() {
	GameLogAdd("EnterDormFromLibrary");
	C012_AfterClass_Library_Leave();
}

// Chapter 12 After Class - When the player searches, duct tape can be found
function C012_AfterClass_Library_Search() {
	CurrentTime = CurrentTime + 110000;
	if (!GameLogQuery(CurrentChapter, "Player", "LibraryFindTape")) {
		GameLogSpecificAdd(CurrentChapter, "Player", "LibraryFindTape");
		OverridenIntroText = GetText("FindTape");
		PlayerAddInventory("TapeGag", 8);
	}
}

// Chapter 12 After Class - When the player starts to study with Amanda
function C012_AfterClass_Library_StartStudy() {
	Common_PlayerPose = "BackStudy";
	ActorSetPose("BackStudy");
}

// Chapter 12 After Class - When the player stops to study with Amanda
function C012_AfterClass_Library_StopStudy() {
	ActorSetPose("");
}

// Chapter 12 After Class - Tests if Amanda will go back to the player dorm (+10 love or +10 submission or +0 love and poem required)
function C012_AfterClass_Library_TestPlayerDorm() {
	C012_AfterClass_Library_PlayerDormAvail = false;
	if (ActorGetValue(ActorLove) >= 10) {
		OverridenIntroText = GetText("GoDormLove");
		C012_AfterClass_Library_CurrentStage = 220;
		return;
	}
	if (ActorGetValue(ActorSubmission) >= 10) {
		OverridenIntroText = GetText("GoDormDomme");
		C012_AfterClass_Library_CurrentStage = 220;
		return;
	}
	if (GameLogQuery(CurrentChapter, "Amanda", "FinishPoem") && (ActorGetValue(ActorLove) >= 0)) {
		OverridenIntroText = GetText("GoDormPoem");
		C012_AfterClass_Library_CurrentStage = 220;
		return;
	}
}

// Chapter 12 After Class - Tests if the player can go back to Amanda's dorm (always no for now)
function C012_AfterClass_Library_TestAmandaDorm() {
	C012_AfterClass_Library_AmandaDormAvail = false;
}

// Chapter 12 After Class - Tests if Amanda will go get dinner with the player (always no for now)
function C012_AfterClass_Library_TestDinner() {
	C012_AfterClass_Library_DinnerAvail = false;
}

// Chapter 12 After Class - When the player study with Amanda (raises love slowly)
function C012_AfterClass_Library_StudyWithAmanda() {
	C012_AfterClass_Library_StudyTimeWithAmanda++;
	CurrentTime = CurrentTime + 290000;
	if (C012_AfterClass_Library_StudyTimeWithAmanda % 6 == 5) ActorChangeAttitude(1, 0);
	C012_AfterClass_Library_WhoIsInLibrary();
}

// Chapter 12 After Class - When the player helps Amanda (raises Amanda submission slowly)
function C012_AfterClass_Library_HelpAmanda() {
	C012_AfterClass_Library_StudyTimeHelpAmanda++;
	CurrentTime = CurrentTime + 290000;
	if (C012_AfterClass_Library_StudyTimeHelpAmanda % 6 == 5) ActorChangeAttitude(0, 1);
	C012_AfterClass_Library_WhoIsInLibrary();
}

// Chapter 12 After Class - When Amanda helps the player (lowers Amanda submission slowly)
function C012_AfterClass_Library_HelpPlayer() {
	C012_AfterClass_Library_StudyTimeHelpedByAmanda++;
	CurrentTime = CurrentTime + 290000;
	if (C012_AfterClass_Library_StudyTimeHelpedByAmanda % 6 == 5) ActorChangeAttitude(0, -1);
	C012_AfterClass_Library_WhoIsInLibrary();
}

// Chapter 12 After Class - When the player starts the poem, it won't be available again
function C012_AfterClass_Library_StartPoem() {
	GameLogAdd("StartPoem");
	C012_AfterClass_Library_PoemAvail = false;
}

// Chapter 12 After Class - When the player finishes the poem (it raises seduction)
function C012_AfterClass_Library_FinishPoem() {
	GameLogAdd("FinishPoem");
	PlayerAddSkill("Seduction", 1);
}
