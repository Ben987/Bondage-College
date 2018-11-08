var C001_BeforeClass_Amanda_CurrentStage = 0;
var C001_BeforeClass_Amanda_BackupStage = 0;
var C001_BeforeClass_Amanda_Kiss_Done = false;
var C001_BeforeClass_Amanda_Spank_Done = false;
var C001_BeforeClass_Amanda_Strip_Done = false;
var C001_BeforeClass_Amanda_ForceKiss_Done = false;
var C001_BeforeClass_Amanda_Tickle_Done = false;
var C001_BeforeClass_Amanda_SidneyInBondage = false;
var C001_BeforeClass_Amanda_BondageNotConfronted = true;
var C001_BeforeClass_Amanda_StopRopeSubAllowed = true;

// Chapter 1 - Amanda Load
function C001_BeforeClass_Amanda_Load() {

	// Load the scene parameters
	ActorLoad("Amanda", "Classroom");
	LoadInteractions();
	C001_BeforeClass_Amanda_SidneyInBondage = ActorSpecificHasInventory("Sidney", "Rope");

	// She dresses back automatically if not tied up, she comes back to face if she's tied up
	if (C001_BeforeClass_Amanda_CurrentStage == 220) C001_BeforeClass_Amanda_CurrentStage = 200;
	if ((C001_BeforeClass_Amanda_CurrentStage >= 240) && (C001_BeforeClass_Amanda_CurrentStage <= 269)) C001_BeforeClass_Amanda_CurrentStage = 230;
	
}

// Chapter 1 - Amanda Run
function C001_BeforeClass_Amanda_Run() {
	BuildInteraction(C001_BeforeClass_Amanda_CurrentStage);
}

// Chapter 1 - Amanda Click
function C001_BeforeClass_Amanda_Click() {	

	// Regular interactions
	ClickInteraction(C001_BeforeClass_Amanda_CurrentStage);
	
	// Special code for when the user wants to use the rope
	if ((C001_BeforeClass_Amanda_CurrentStage < 200) && (GetClickedInventory() == "Rope")) {
		C001_BeforeClass_Amanda_BackupStage = C001_BeforeClass_Amanda_CurrentStage;
		C001_BeforeClass_Amanda_CurrentStage = 200;
		OverridenIntroText = GetText("RopeInquiry");
	}
	
}

// Chapter 1 - Amanda Tie
function C001_BeforeClass_Amanda_Tie() {
	ActorAddInventory("Rope");
	PlayerRemoveInventory("Rope", 1);
}

// Chapter 1 - Amanda Untie
function C001_BeforeClass_Amanda_Untie() {
	ActorRemoveInventory("Rope");
	PlayerAddInventory("Rope", 1);
}

// Chapter 1 - Amanda Stop Rope
function C001_BeforeClass_Amanda_StopRope() {
	C001_BeforeClass_Amanda_CurrentStage = C001_BeforeClass_Amanda_BackupStage;
}

// Chapter 1 - Amanda Stop in a submissive fashion
function C001_BeforeClass_Amanda_StopRopeSub() {
	C001_BeforeClass_Amanda_StopRopeSubAllowed = false;
	C001_BeforeClass_Amanda_CurrentStage = C001_BeforeClass_Amanda_BackupStage;
}

// Chapter 1 - Amanda Confront Bondage
function C001_BeforeClass_Amanda_ConfrontBondage() {
	C001_BeforeClass_Amanda_BondageNotConfronted = false;
}

// Chapter 1 - Amanda Kiss (extra love if the player has seduction)
function C001_BeforeClass_Amanda_Kiss() {
	if (C001_BeforeClass_Amanda_Kiss_Done == false) {
		C001_BeforeClass_Amanda_Kiss_Done = true;
		if (PlayerGetSkillLevel("Seduction") >= 1) ActorChangeAttitude(2, 0);
		else ActorChangeAttitude(1, 0);
		OverridenIntroText = GetText("Kiss");
		GameLogAdd("Kiss");
	}
}

// Chapter 1 - Amanda Force Kiss
function C001_BeforeClass_Amanda_ForceKiss() {
	if (C001_BeforeClass_Amanda_ForceKiss_Done == false) {
		C001_BeforeClass_Amanda_ForceKiss_Done = true;
		ActorChangeAttitude(-1, 0);
		OverridenIntroText = GetText("KissSidney");
		GameLogAdd("KissSidney");
		AchievementUnlock("MatchMadeInHell");
	}
}

// Chapter 1 - Amanda Spank
function C001_BeforeClass_Amanda_Spank() {
	if (C001_BeforeClass_Amanda_Spank_Done == false) {
		C001_BeforeClass_Amanda_Spank_Done = true;
		ActorChangeAttitude(-1, 1);
		OverridenIntroText = GetText("Spank");
	}
}

// Chapter 1 - Amanda Strip
function C001_BeforeClass_Amanda_Strip() {
	if (C001_BeforeClass_Amanda_Strip_Done == false) {
		C001_BeforeClass_Amanda_Strip_Done = true;
		ActorChangeAttitude(-1, 0);
		OverridenIntroText = GetText("Strip");
	}
}

// Chapter 1 - Amanda Tickle
function C001_BeforeClass_Amanda_Tickle() {
	if (C001_BeforeClass_Amanda_Tickle_Done == false) {
		C001_BeforeClass_Amanda_Tickle_Done = true;
		ActorChangeAttitude(1, 0);
	}
}