var C012_AfterClass_Roommates_CurrentStage = 0;
var C012_AfterClass_Roommates_SidneyAvail = false;
var C012_AfterClass_Roommates_EmptyDorm = true;
var C012_AfterClass_Roommates_IntroText = "";
var C012_AfterClass_Roommates_CurrentActor = "";

// Chapter 12 After Class - Roommates Load
function C012_AfterClass_Roommates_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;

	// If we must put the previous text or previous actor back
	if (C012_AfterClass_Roommates_IntroText != "") { OverridenIntroText = C012_AfterClass_Roommates_IntroText; C012_AfterClass_Roommates_IntroText = ""; }
	if (C012_AfterClass_Roommates_CurrentActor != "") ActorLoad(C012_AfterClass_Roommates_CurrentActor, "");

	// No leaving from the roommates
	LeaveIcon = "";
	LeaveScreen = "";

}

// Chapter 12 After Class - Roommates Run
function C012_AfterClass_Roommates_Run() {
	BuildInteraction(C012_AfterClass_Roommates_CurrentStage);
	if (CurrentActor != "") {
		DrawActor(CurrentActor, 500, 0, 1.3333);
	}
}

// Chapter 12 After Class - Roommates Click
function C012_AfterClass_Roommates_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Roommates_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_Roommates_IntroText = OverridenIntroText;
		C012_AfterClass_Roommates_CurrentActor = CurrentActor; 
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 12 After Class - When the player leaves the roommates
function C012_AfterClass_Roommates_Leave() {
	CurrentTime = CurrentTime + 110000;
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Wait for a while and recalculate who's in the roommates
function C012_AfterClass_Roommates_Knock() {
}
