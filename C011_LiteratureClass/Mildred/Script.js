var C011_LiteratureClass_Mildred_CurrentStage = 0;
var C011_LiteratureClass_Mildred_Angry = false;
var C011_LiteratureClass_Mildred_GoodStudentCount = 0;
var C011_LiteratureClass_Mildred_KnowCheat = false;
var C011_LiteratureClass_Mildred_QuizPlayerStatus = "Clothed";
var C011_LiteratureClass_Mildred_QuizSidneyStatus = "Clothed";
var C011_LiteratureClass_Mildred_QuizMildredStatus = "Clothed";
var C011_LiteratureClass_Mildred_TestChapter = 1;
var C011_LiteratureClass_Mildred_PlayerVictoryCount = 0;
var C011_LiteratureClass_Mildred_SidneyVictoryCount = 0;
var C011_LiteratureClass_Mildred_MildredVictoryCount = 0;

// Chapter 11 - Mildred Load
function C011_LiteratureClass_Mildred_Load() {

	// Load the scene parameters
	ActorLoad("Mildred", "");
	LoadInteractions();
	StartTimer(16.5 * 60 * 60 * 1000, "C011_LiteratureClass", "Outro");
	C011_LiteratureClass_Mildred_Angry = (GameLogQuery("C002_FirstClass", "Mildred", "Subdue") && GameLogQuery("C006_Isolation", "", "Isolation"));
	LeaveIcon = "";

}

// Chapter 11 - Mildred Run
function C011_LiteratureClass_Mildred_Run() {
	BuildInteraction(C011_LiteratureClass_Mildred_CurrentStage);
}

// Chapter 11 - Mildred Click
function C011_LiteratureClass_Mildred_Click() {

	// Regular interactions
	ClickInteraction(C011_LiteratureClass_Mildred_CurrentStage);
	var ClickedInv = GetClickedInventory();
	
}

// Chapter 11 - Mildred recognizes that the player is being a good student
function C011_LiteratureClass_Mildred_GoodStudent() {
	C011_LiteratureClass_Mildred_GoodStudentCount++;
}

// Chapter 11 - Mildred will cuff the player if she was in isolation with and she wasn't good
function C011_LiteratureClass_Mildred_CheckForCuffs() {
	if (C011_LiteratureClass_Mildred_GoodStudentCount >= 3) ActorChangeAttitude(1, 0);
	if (C011_LiteratureClass_Mildred_Angry && (C011_LiteratureClass_Mildred_GoodStudentCount < 3)) {
		OverridenIntroText = GetText("MildredComesForCuffs");
		if (C011_LiteratureClass_SelectDesk_FrontDesk) C011_LiteratureClass_Mildred_CurrentStage = 31;
		else C011_LiteratureClass_Mildred_CurrentStage = 35;
	}
	C011_LiteratureClass_Mildred_GoodStudentCount = 0;
}

// Chapter 11 - Mildred cuffs the player
function C011_LiteratureClass_Mildred_CuffPlayer() {
	PlayerLockInventory("Cuffs");
	C011_LiteratureClass_Mildred_QuizPlayerStatus = "Clothed_Cuffs";
	CurrentTime = CurrentTime + 50000;
}

// Chapter 11 - Starts the quiz for a specific chapter
function C011_LiteratureClass_Mildred_StartQuiz(QuizChapter) {

	// If the player has read the chapter, the answer generates at 3 seconds per letter, if the book was read twice, it's 2 seconds
	var AnswerGenSpeed = 0;
	if (GameLogQuery("C009_Library", "", "ReadChapter" + QuizChapter)) AnswerGenSpeed = 3000;
	if (GameLogQuery("C009_Library", "", "ReadTwice")) AnswerGenSpeed = 2000;

	// Loads the quiz
	QuizLoad("Player", C011_LiteratureClass_Mildred_QuizPlayerStatus, "Sidney", C011_LiteratureClass_Mildred_QuizSidneyStatus, "Mildred", "Clothed", "Easy", AnswerGenSpeed, 5, "Classroom", "MonteCristoChapter" + QuizChapter, "C011_LiteratureClass_Mildred_EndQuiz");

}

// Chapter 11 - When the quiz ends
function C011_LiteratureClass_Mildred_EndQuiz(Victory) {

	// The next chapter to test
	C011_LiteratureClass_Mildred_TestChapter++;
	
	// On a victory
	if (Victory) {
		
		C011_LiteratureClass_Mildred_PlayerVictoryCount++;

		// If Sidney was already hit, she gets hit again
		if (C011_LiteratureClass_Mildred_QuizSidneyStatus == "RedButt_Cuffs") { 
			OverridenIntroText = GetText("TestSidneyCropAgain");
			OverridenIntroImage = "TestSidneyRedButt.jpg";
		}

		// If Sidney was stripped, she gets hit
		if (C011_LiteratureClass_Mildred_QuizSidneyStatus == "NoSkirt_Cuffs") { 
			C011_LiteratureClass_Mildred_QuizSidneyStatus = "RedButt_Cuffs";
			OverridenIntroText = GetText("TestSidneyCrop");
			OverridenIntroImage = "TestSidneyRedButt.jpg";
		}

		// If Sidney was cuffed, she gets stripped of her skirt
		if (C011_LiteratureClass_Mildred_QuizSidneyStatus == "Clothed_Cuffs") { 
			C011_LiteratureClass_Mildred_QuizSidneyStatus = "NoSkirt_Cuffs";
			OverridenIntroText = GetText("TestSidneyNoSkirt");
			OverridenIntroImage = "TestSidneyNoSkirt.jpg";
		}
	
		// If Sidney wasn't cuffed, she gets cuffed
		if (C011_LiteratureClass_Mildred_QuizSidneyStatus == "Clothed") { 
			CurrentActor = "Sidney";
			ActorAddInventory("Cuffs");
			CurrentActor = "Mildred";
			C011_LiteratureClass_Mildred_QuizSidneyStatus = "Clothed_Cuffs";
			OverridenIntroText = GetText("TestSidneyCuffs");
			OverridenIntroImage = "TestSidneyCuffs.jpg";
		}
		
	} else {

		C011_LiteratureClass_Mildred_SidneyVictoryCount++;
	
		// If the player was already hit, she gets hit again
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "RedButt_Cuffs") { 
			OverridenIntroText = GetText("TestPlayerCropAgain");
			OverridenIntroImage = "TestPlayerRedButt.jpg";
		}

		// If the player was stripped, she gets hit
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "NoSkirt_Cuffs") { 
			C011_LiteratureClass_Mildred_QuizPlayerStatus = "RedButt_Cuffs";
			OverridenIntroText = GetText("TestPlayerCrop");
			OverridenIntroImage = "TestPlayerRedButt.jpg";
		}

		// If the player was cuffed, she gets stripped of her skirt
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "Clothed_Cuffs") { 
			C011_LiteratureClass_Mildred_QuizPlayerStatus = "NoSkirt_Cuffs";
			OverridenIntroText = GetText("TestPlayerNoSkirt");
			OverridenIntroImage = "TestPlayerNoSkirt.jpg";
		}
	
		// If the player wasn't cuffed, she gets cuffed
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "Clothed") { 
			PlayerLockInventory("Cuffs");
			C011_LiteratureClass_Mildred_QuizPlayerStatus = "Clothed_Cuffs";
			OverridenIntroText = GetText("TestPlayerCuffs");
			OverridenIntroImage = "TestPlayerCuffs.jpg";
		}
	
	}

}

// Chapter 11 - Mildred starts the test for the player and Sidney
function C011_LiteratureClass_Mildred_StartTest() {
	if (C011_LiteratureClass_Mildred_GoodStudentCount >= 2) ActorChangeAttitude(1, 0);
	CurrentTime = CurrentTime + 50000;
	C011_LiteratureClass_Mildred_StartQuiz(C011_LiteratureClass_Mildred_TestChapter.toString());
}

// Chapter 11 - Mildred can switch focus to Sidney for a short while
function C011_LiteratureClass_Mildred_SwitchSidney() {
	if (!C011_LiteratureClass_SelectDesk_FrontDesk) {
		C011_LiteratureClass_Mildred_CurrentStage = 47;
		OverridenIntroText = GetText("SidneyStares");
		ActorLoad("Sidney", "");
		LeaveIcon = "";
		ActorAddInventory("Cuffs");
		C011_LiteratureClass_Mildred_QuizSidneyStatus = "Clothed_Cuffs";
	} else {
		CurrentActor = "Sidney";
		ActorAddInventory("Cuffs");
		CurrentActor = "Mildred";
	}
}

// Chapter 11 - Mildred takes back focus
function C011_LiteratureClass_Mildred_SwitchMildred() {
	ActorLoad("Sidney", "");
	LeaveIcon = "";
}

// Chapter 11 - Mildred check if the player or Sidney won
function C011_LiteratureClass_Mildred_CheckForWinner() {
	OverridenIntroImage = "";
	if (C011_LiteratureClass_Mildred_PlayerVictoryCount < C011_LiteratureClass_Mildred_SidneyVictoryCount) {
		ActorChangeAttitude(-1, -1);
		C011_LiteratureClass_Mildred_CurrentStage = 200;
		OverridenIntroText = GetText("ShameForDefeat");
	}
}

function C011_LiteratureClass_Mildred_MildredLeave() {
	CurrentActor = "";
}

function C011_LiteratureClass_Mildred_WaitTest() {
	CurrentTime = CurrentTime + 290000;
}

function C011_LiteratureClass_Mildred_EndChapter() {
	SetScene(CurrentChapter, "Outro");
}