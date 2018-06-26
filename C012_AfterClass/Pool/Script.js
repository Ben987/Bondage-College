var C012_AfterClass_Pool_CurrentStage = 0;
var C012_AfterClass_Pool_EmptyPool = true;
var C012_AfterClass_Pool_IntroText = "";
var C012_AfterClass_Pool_CurrentActor = "";
var C012_AfterClass_Pool_HasSports = false;
var C012_AfterClass_Pool_SwimCount = 0;

// Chapter 12 After Class - Check who's in the Pool
function C012_AfterClass_Pool_WhoInIsPool() {
	
}

// Chapter 12 After Class - Pool Load
function C012_AfterClass_Pool_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C012_AfterClass_Pool_HasSports = (PlayerGetSkillLevel("Sports") > 0);

	// If we must put the previous text or previous actor back
	if (C012_AfterClass_Pool_IntroText != "") { OverridenIntroText = C012_AfterClass_Pool_IntroText; C012_AfterClass_Pool_IntroText = ""; }
	if (C012_AfterClass_Pool_CurrentActor != "") ActorLoad(C012_AfterClass_Pool_CurrentActor, "");
	if (C012_AfterClass_Pool_CurrentStage <= 99) C012_AfterClass_Pool_WhoInIsPool();

	// No leaving from the Pool
	LeaveIcon = "";
	LeaveScreen = "";

}

// Chapter 12 After Class - Pool Run
function C012_AfterClass_Pool_Run() {
	BuildInteraction(C012_AfterClass_Pool_CurrentStage);
	if (CurrentActor != "") {
		DrawActor(CurrentActor, 600, 0, 1);
	}
}

// Chapter 12 After Class - Pool Click
function C012_AfterClass_Pool_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Pool_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_Pool_IntroText = OverridenIntroText;
		C012_AfterClass_Pool_CurrentActor = CurrentActor; 
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 12 After Class - When the player leaves the Pool
function C012_AfterClass_Pool_Leave() {
	CurrentTime = CurrentTime + 290000;
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Wait for a while and recalculate who's in the Pool
function C012_AfterClass_Pool_Wait() {
	CurrentTime = CurrentTime + 290000;	
	C012_AfterClass_Pool_WhoInIsPool();
}

// Chapter 12 After Class - Swim - Adds a counter and can raise sports level after 5 counters
function C012_AfterClass_Pool_Swim() {
	CurrentTime = CurrentTime + 290000;	
	C012_AfterClass_Pool_SwimCount++;
	if ((C012_AfterClass_Pool_SwimCount >= 5) && !GameLogQuery(CurrentChapter, "", "LearnToSwim")) {
		GameLogSpecificAdd(CurrentChapter, "", "LearnToSwim");
		PlayerAddSkill("Sports", 1);
		C012_AfterClass_Pool_HasSports = true;
		OverridenIntroText = GetText("LearnSwim");
	}
}
