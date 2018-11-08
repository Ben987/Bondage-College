var C012_AfterClass_Humiliation_CurrentStage = 0;
var C012_AfterClass_Humiliation_List = ["Art", "Detention", "Karate", "Pool", "Restaurant", "School", "Subway", "Tennis"];

// Chapter 12 After Class - Humiliation Load
function C012_AfterClass_Humiliation_Load() {
	
	// Loads the scene
	LeaveIcon = "";
	LeaveScreen = "Dorm";
	LoadInteractions();
	C012_AfterClass_Humiliation_Process();
	GameLogSpecificAdd(CurrentChapter, "", "EventHumiliated");

}

// Chapter 12 After Class - Humiliation Run
function C012_AfterClass_Humiliation_Run() {
	BuildInteraction(C012_AfterClass_Humiliation_CurrentStage);
}

// Chapter 12 After Class - Humiliation Click
function C012_AfterClass_Humiliation_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Humiliation_CurrentStage);

}

// Chapter 12 After Class - process the humiliation scene
function C012_AfterClass_Humiliation_Process() {	
	CurrentTime = CurrentTime + 290000;
	var HumiliationType = C012_AfterClass_Humiliation_List[Math.floor(Math.random() * C012_AfterClass_Humiliation_List.length)];
	OverridenIntroImage = "Humiliation" + HumiliationType + (Common_PlayerChaste ? "Chastity": "") + ".jpg";
	C012_AfterClass_Humiliation_List.splice(C012_AfterClass_Humiliation_List.indexOf(HumiliationType), 1);
}

// Chapter 12 After Class - Returns to the dorm
function C012_AfterClass_Humiliation_BackToDorm() {
	CurrentTime = CurrentTime + 290000;
	C012_AfterClass_Dorm_LeavingGuest();
	SetScene(CurrentChapter, "Dorm");
}