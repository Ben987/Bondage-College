var C001_BeforeClass_Sidney_CurrentStage = 0;
var C001_BeforeClass_Sidney_BackupStage = 0;
var C001_BeforeClass_Sidney_PantiesRemark_Done = false;
var C001_BeforeClass_Sidney_AmandaInBondage = false;
var C001_BeforeClass_Sidney_BondageNotConfronted = true;
var C001_BeforeClass_Sidney_TickleDone = false;
var C001_BeforeClass_Sidney_BondageFlag = false;

// Chapter 1 - Sidney Load
function C001_BeforeClass_Sidney_Load() {

	// Load the scene parameters
	ActorLoad("Sidney", "Classroom");
	LoadInteractions();
	C001_BeforeClass_Sidney_AmandaInBondage = ActorSpecificHasInventory("Amanda", "Rope");
	
	// She resets back to the facing position if in bondage
	if ((C001_BeforeClass_Sidney_CurrentStage >= 230) && (C001_BeforeClass_Sidney_CurrentStage <= 259)) C001_BeforeClass_Sidney_CurrentStage = 220;
	
}

// Chapter 1 - Sidney Run
function C001_BeforeClass_Sidney_Run() {
	BuildInteraction(C001_BeforeClass_Sidney_CurrentStage);
}

// Chapter 1 - Sidney Click
function C001_BeforeClass_Sidney_Click() {	

	// Regular interaction
	ClickInteraction(C001_BeforeClass_Sidney_CurrentStage);

	// Special code for when the user wants to use the rope
	if ((C001_BeforeClass_Sidney_CurrentStage < 200) && (GetClickedInventory() == "Rope")) {
		C001_BeforeClass_Sidney_BackupStage = C001_BeforeClass_Sidney_CurrentStage;
		C001_BeforeClass_Sidney_CurrentStage = 200;
		OverridenIntroText = GetText("MyRopes");
	}
	
}

// Chapter 1 - Sidney Fight
function C001_BeforeClass_Sidney_Fight() {	
	SetScene(CurrentChapter, "FightIntro");
}

// Chapter 1 - Sidney Give Rope
function C001_BeforeClass_Sidney_GiveRope() {
	PlayerRemoveInventory("Rope", 2);
}

// Chapter 1 - Sidney Stop Rope
function C001_BeforeClass_Sidney_StopRope() {
	C001_BeforeClass_Sidney_CurrentStage = C001_BeforeClass_Sidney_BackupStage;
}

// Chapter 1 - Sidney Tie
function C001_BeforeClass_Sidney_Tie() {
	ActorAddInventory("Rope");
	PlayerRemoveInventory("Rope", 1);
	if (C001_BeforeClass_Sidney_BondageFlag == false) {
		ActorChangeAttitude(-1, 0);
		OverridenIntroText = GetText("Bondage");
		C001_BeforeClass_Sidney_BondageFlag = true;
	}	
}

// Chapter 1 - Sidney Tickle
function C001_BeforeClass_Sidney_Tickle() {
	if (C001_BeforeClass_Sidney_TickleDone == false) {
		ActorChangeAttitude(-1, 0);
		OverridenIntroText = GetText("Tickle");
		C001_BeforeClass_Sidney_TickleDone = true;
	}
}

// Chapter 1 - Sidney Tie Sub
function C001_BeforeClass_Sidney_TieSub() {
	ActorAddInventory("Rope");
	PlayerRemoveInventory("Rope", 1);
}

// Chapter 1 - Sidney Untie
function C001_BeforeClass_Sidney_Untie() {
	ActorRemoveInventory("Rope");
	PlayerAddInventory("Rope", 1);
}

// Chapter 1 - Sidney Confront Bondage
function C001_BeforeClass_Sidney_ConfrontBondage() {
	C001_BeforeClass_Sidney_BondageNotConfronted = false;
}

// Chapter 1 - Sidney Panties Remark
function C001_BeforeClass_Sidney_PantiesRemark() {
	if (C001_BeforeClass_Sidney_PantiesRemark_Done == false) {
		C001_BeforeClass_Sidney_PantiesRemark_Done = true;
		ActorChangeAttitude(0, 1);
		OverridenIntroText = GetText("Panties");
	}
}

// Chapter 1 - Force Sidney to kiss Amanda
function C001_BeforeClass_Sidney_KissAmanda() {
	GameLogAdd("KissAmanda");
	AchievementUnlock("MatchMadeInHell");
}