var C001_BeforeClass_Bag_CurrentStage = 0;

// Chapter 1 - Bag Load
function C001_BeforeClass_Bag_Load() {
	LeaveIcon = "Leave";
	LeaveScreen = "Classroom";
	LoadInteractions();
}

// Chapter 1 - Bag Run
function C001_BeforeClass_Bag_Run() {
	BuildInteraction(C001_BeforeClass_Bag_CurrentStage);
}

// Chapter 1 - Bag Click
function C001_BeforeClass_Bag_Click() {	
	ClickInteraction(C001_BeforeClass_Bag_CurrentStage);
}

// Add rope to the inventory
function C001_BeforeClass_Bag_GetRope() {
	PlayerAddInventory("Rope", 2);
	GameLogSpecificAdd(CurrentChapter, "Sidney", "StealRopes");
	AchievementUnlock("LearningTheRopes");
}

// If the player annoys Sidney by pulling on her back
function C001_BeforeClass_Bag_SidneyAnnoy() {
	SetScene(CurrentChapter, "Sidney");
}

// If the player ask Sidney about the ropes
function C001_BeforeClass_Bag_SidneyRope() {
	C001_BeforeClass_Sidney_CurrentStage = 100;
	SetScene(CurrentChapter, "Sidney");
}
