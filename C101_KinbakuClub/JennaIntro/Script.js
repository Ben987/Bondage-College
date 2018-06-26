var C101_KinbakuClub_JennaIntro_CurrentStage = 5;
var C101_KinbakuClub_JennaIntro_LeaveTime = 18.00;
var C101_KinbakuClub_JennaIntro_TransitionTime = 17.45;
var C101_KinbakuClub_JennaIntro_TimerOutcome = "Outro"
var C101_KinbakuClub_JennaIntro_IntroText = "";
var C101_KinbakuClub_JennaIntro_LeaveIcon = "";
var C101_KinbakuClub_JennaIntro_NotAsked = false;
var C101_KinbakuClub_JennaIntro_Concerned = false;
var C101_KinbakuClub_JennaIntro_Chloe = false;
var C101_KinbakuClub_JennaIntro_Natalie = false;
var C101_KinbakuClub_JennaIntro_FirstLoad = true;


// Chapter 101 - Jenna Load
function C101_KinbakuClub_JennaIntro_Load() {

	Common_SelfBondageAllowed = false;

	// Load the scene parameters
	ActorLoad("Jenna", "ClubRoom1");
	LoadInteractions();

	// Previous club experiance
	if (C101_KinbakuClub_JennaIntro_FirstLoad) {
		if (GameLogQuery("", "", "KinbakuClubInfo")) C101_KinbakuClub_JennaIntro_Natalie = true;
		if (GameLogQuery("C007_LunchBreak", "Natalie", "Lunch")) {
			C101_KinbakuClub_JennaIntro_CurrentStage = 0;
			C101_KinbakuClub_JennaIntro_NotAsked = true;
			C101_KinbakuClub_JennaIntro_Concerned = true;
			C101_KinbakuClub_JennaIntro_Chloe = true;
		}
		if (GameLogQuery("C007_LunchBreak", "Natalie", "Stranded")) C101_KinbakuClub_JennaIntro_CurrentStage = 100;
		C101_KinbakuClub_JennaIntro_FirstLoad = false;
	}

	// Player can't leave until Jenna is finished
	if (C101_KinbakuClub_JennaIntro_CurrentStage == 80) LeaveIcon = "Leave";
	else LeaveIcon = "";

}

// Chapter 101 - Jenna Run
function C101_KinbakuClub_JennaIntro_Run() {
    BuildInteraction(C101_KinbakuClub_JennaIntro_CurrentStage);
}


// Chapter 101 - Jenna Click
function C101_KinbakuClub_JennaIntro_Click() {

	// Regular and inventory interactions
    ClickInteraction(C101_KinbakuClub_JennaIntro_CurrentStage);
    var ClickInv = GetClickedInventory();
    if (ClickInv == "Player") {
        C101_KinbakuClub_JennaIntro_IntroText = OverridenIntroText;
        C101_KinbakuClub_JennaIntro_LeaveIcon = LeaveIcon;
        InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
    }
}

// Chapter 101 - Short cut to club room with skills and items
function C101_KinbakuClub_JennaIntro_ShortCut() {
	PlayerAddInventory("Cuffs", 4);
	PlayerAddInventory("CuffsKey", 1);
	PlayerAddInventory("Rope", 4);
	PlayerAddInventory("BallGag", 4);
	PlayerAddInventory("TapeGag", 8);
	PlayerAddInventory("ClothGag", 4);
	PlayerAddInventory("Collar", 4);
	PlayerAddInventory("Crop", 1);
	PlayerAddInventory("VibratingEgg", 4);
	PlayerAddInventory("ChastityBelt", 4);
	PlayerAddInventory("Armbinder", 4);
	PlayerAddInventory("Blindfold", 4);
	C101_KinbakuClub_JennaIntro_Done()
	SetScene(CurrentChapter, "ClubRoom1")
	PlayerAddSkill("Arts", 1);
	PlayerAddSkill("Fighting", 1);
	PlayerAddSkill("RopeMastery", 1);
	PlayerAddSkill("Sports", 1);
	PlayerAddSkill("Seduction", 1);
	C101_KinbakuClub_Erica_Kidnapper = true;
	C101_KinbakuClub_Slaves_ReadyForSlaves = true;
}

// Chapter 101 - Player skips club explanation
function C101_KinbakuClub_JennaIntro_SkipExplanation() {
	C101_KinbakuClub_JennaIntro_NotAsked = false;
	C101_KinbakuClub_JennaIntro_Concerned = false;
}

// Chapter 101 - Player asks about Natalie
function C101_KinbakuClub_JennaIntro_Asked() {
	C101_KinbakuClub_JennaIntro_NotAsked = false;
	C101_KinbakuClub_JennaIntro_LeaveTime = C101_KinbakuClub_JennaIntro_TransitionTime;
	C101_KinbakuClub_JennaIntro_TimerOutcome = "Transition"
	LeaveIcon = "";
}

// Chapter 101 - Complimentry rope
function C101_KinbakuClub_JennaIntro_GetRope() {
	PlayerAddInventory("Rope", 1);
}

// Chapter 101 - Player shows Concern about Natalie
function C101_KinbakuClub_JennaIntro_ShowConcern() {
	C101_KinbakuClub_JennaIntro_Concerned = false;
}

// Chapter 101 - Player asks about Chloe
function C101_KinbakuClub_JennaIntro_AskChloe() {
	C101_KinbakuClub_JennaIntro_Chloe = false;
}

// Chapter 101 - Jenna is Done with player.
function C101_KinbakuClub_JennaIntro_Done() {
	StartTimer(C101_KinbakuClub_JennaIntro_LeaveTime * 60 * 60 * 1000, "C101_KinbakuClub", C101_KinbakuClub_JennaIntro_TimerOutcome);
	LeaveIcon = "Leave";
	Common_SelfBondageAllowed = true;
}

// Chapter 101 - Player askes to be tied up.
function C101_KinbakuClub_JennaIntro_CuffPlayer() {
	PlayerLockInventory("Cuffs");
	PlayerLockInventory("BallGag");
	PlayerRemoveInventory("CuffsKey", 99);
	C101_KinbakuClub_JennaIntro_Done()
}


// Chapter 101 - When the club set on the player to discipline her for evil ending Natalie.
function C101_KinbakuClub_JennaIntro_Discipline() {
    SetScene(CurrentChapter, "Discipline");
}

