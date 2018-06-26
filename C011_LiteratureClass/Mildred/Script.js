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
var C011_LiteratureClass_Mildred_LosingTest = false;

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
function C011_LiteratureClass_Mildred_StartQuiz(QuizChapter, Opponent) {

	// If the player has read the chapter, the answer generates at 3 seconds per letter, if the book was read twice, it's 2 seconds
	var AnswerGenSpeed = 0;
	if (GameLogQuery("C009_Library", "", "ReadChapter" + QuizChapter)) AnswerGenSpeed = 2500;
	if (GameLogQuery("C009_Library", "", "ReadTwice")) AnswerGenSpeed = 1500;

	// Loads the quiz
	if (Opponent == "Sidney") QuizLoad("Player", C011_LiteratureClass_Mildred_QuizPlayerStatus, "Sidney", C011_LiteratureClass_Mildred_QuizSidneyStatus, "Mildred", "Clothed", "Easy", AnswerGenSpeed, 3, "Classroom", "MonteCristoChapter" + QuizChapter, "C011_LiteratureClass_Mildred_EndQuiz");
	else QuizLoad("Player", C011_LiteratureClass_Mildred_QuizPlayerStatus, "Mildred", C011_LiteratureClass_Mildred_QuizMildredStatus, "Sidney", "Clothed", "Hard", AnswerGenSpeed, 3, "Classroom", "MonteCristoChapter" + QuizChapter, "C011_LiteratureClass_Mildred_EndQuizMildred");

}

// Chapter 11 - When the quiz ends against Sidney
function C011_LiteratureClass_Mildred_EndQuiz(Victory) {

	// The next chapter to test
	C011_LiteratureClass_Mildred_TestChapter++;
	
	// On a victory
	if (Victory) {
		
		C011_LiteratureClass_Mildred_PlayerVictoryCount++;

		// If Sidney was already hit, she gets hit again (chastity version)
		if (C011_LiteratureClass_Mildred_QuizSidneyStatus == "RedButt_Cuffs_Chastity") { 
			OverridenIntroText = GetText("TestSidneyCropAgain");
			OverridenIntroImage = "TestSidneyRedButtChastity.jpg";
		}
	
		// If Sidney was already hit, she gets hit again
		if (C011_LiteratureClass_Mildred_QuizSidneyStatus == "RedButt_Cuffs") { 
			OverridenIntroText = GetText("TestSidneyCropAgain");
			OverridenIntroImage = "TestSidneyRedButt.jpg";
		}

		// If Sidney was stripped, she gets hit (chastity version)
		if (C011_LiteratureClass_Mildred_QuizSidneyStatus == "NoSkirt_Cuffs_Chastity") { 
			C011_LiteratureClass_Mildred_QuizSidneyStatus = "RedButt_Cuffs_Chastity";
			OverridenIntroText = GetText("TestSidneyCrop");
			OverridenIntroImage = "TestSidneyRedButtChastity.jpg";
		}
		
		// If Sidney was stripped, she gets hit
		if (C011_LiteratureClass_Mildred_QuizSidneyStatus == "NoSkirt_Cuffs") { 
			C011_LiteratureClass_Mildred_QuizSidneyStatus = "RedButt_Cuffs";
			OverridenIntroText = GetText("TestSidneyCrop");
			OverridenIntroImage = "TestSidneyRedButt.jpg";
		}

		// If Sidney was cuffed, she gets stripped of her skirt (can reveal her chastity belt)
		if (C011_LiteratureClass_Mildred_QuizSidneyStatus == "Clothed_Cuffs") { 
			if (ActorSpecificHasInventory("Sidney", "ChastityBelt")) { 
				C011_LiteratureClass_Mildred_QuizSidneyStatus = "NoSkirt_Cuffs_Chastity";
				OverridenIntroText = GetText("TestSidneyNoSkirtChastity"); 
				OverridenIntroImage = "TestSidneyNoSkirtChastity.jpg"; 
			}
			else { 
				C011_LiteratureClass_Mildred_QuizSidneyStatus = "NoSkirt_Cuffs";
				OverridenIntroText = GetText("TestSidneyNoSkirt"); 
				OverridenIntroImage = "TestSidneyNoSkirt.jpg"; 
			}
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

		// If the player was already hit, she gets hit again (chastity version)
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "RedButt_Cuffs_Chastity") { 
			OverridenIntroText = GetText("TestPlayerCropAgain");
			OverridenIntroImage = "TestPlayerRedButtChastity.jpg";
		}
		
		// If the player was already hit, she gets hit again
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "RedButt_Cuffs") { 
			OverridenIntroText = GetText("TestPlayerCropAgain");
			OverridenIntroImage = "TestPlayerRedButt.jpg";
		}

		// If the player was stripped, she gets hit (chastity version)
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "NoSkirt_Cuffs_Chastity") { 
			C011_LiteratureClass_Mildred_QuizPlayerStatus = "RedButt_Cuffs_Chastity";
			OverridenIntroText = GetText("TestPlayerCrop");
			OverridenIntroImage = "TestPlayerRedButtChastity.jpg";
		}
		
		// If the player was stripped, she gets hit
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "NoSkirt_Cuffs") { 
			C011_LiteratureClass_Mildred_QuizPlayerStatus = "RedButt_Cuffs";
			OverridenIntroText = GetText("TestPlayerCrop");
			OverridenIntroImage = "TestPlayerRedButt.jpg";
		}

		// If the player was cuffed, she gets stripped of her skirt (can reveal her chastity belt)
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "Clothed_Cuffs") { 
			if (Common_PlayerChaste) { 
				C011_LiteratureClass_Mildred_QuizPlayerStatus = "NoSkirt_Cuffs_Chastity";
				OverridenIntroText = GetText("TestPlayerNoSkirtChastity"); 
				OverridenIntroImage = "TestPlayerNoSkirtChastity.jpg"; 
			}
			else { 
				C011_LiteratureClass_Mildred_QuizPlayerStatus = "NoSkirt_Cuffs";
				OverridenIntroText = GetText("TestPlayerNoSkirt"); 
				OverridenIntroImage = "TestPlayerNoSkirt.jpg"; 
			}
		}
	
		// If the player wasn't cuffed, she gets cuffed
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "Clothed") { 
			PlayerLockInventory("Cuffs");
			C011_LiteratureClass_Mildred_QuizPlayerStatus = "Clothed_Cuffs";
			OverridenIntroText = GetText("TestPlayerCuffs");
			OverridenIntroImage = "TestPlayerCuffs.jpg";
		}
	
	}

	// Flag to tell that player is currently losing the test
	C011_LiteratureClass_Mildred_LosingTest = (C011_LiteratureClass_Mildred_PlayerVictoryCount < C011_LiteratureClass_Mildred_SidneyVictoryCount);

}

// Chapter 11 - When the quiz ends against Mildred
function C011_LiteratureClass_Mildred_EndQuizMildred(Victory) {

	// The next chapter to test
	C011_LiteratureClass_Mildred_TestChapter++;

	// On a victory
	if (Victory) {
		
		C011_LiteratureClass_Mildred_PlayerVictoryCount++;

		// If Mildred was already hit, she gets hit again
		if (C011_LiteratureClass_Mildred_QuizMildredStatus == "RedButt_Cuffs") { 
			OverridenIntroText = GetText("TestMildredCropAgain");
			OverridenIntroImage = "TestMildredRedButt.jpg";
		}

		// If Mildred was stripped, she gets hit
		if (C011_LiteratureClass_Mildred_QuizMildredStatus == "NoSkirt_Cuffs") { 
			C011_LiteratureClass_Mildred_QuizMildredStatus = "RedButt_Cuffs";
			OverridenIntroText = GetText("TestMildredCrop");
			OverridenIntroImage = "TestMildredRedButt.jpg";
		}

		// If Mildred was cuffed, she gets stripped of her skirt
		if (C011_LiteratureClass_Mildred_QuizMildredStatus == "Clothed_Cuffs") { 
			C011_LiteratureClass_Mildred_QuizMildredStatus = "NoSkirt_Cuffs";
			OverridenIntroText = GetText("TestMildredNoSkirt");
			OverridenIntroImage = "TestMildredNoSkirt.jpg";
		}
	
		// If Mildred wasn't cuffed, she gets cuffed
		if (C011_LiteratureClass_Mildred_QuizMildredStatus == "Clothed") { 
			CurrentActor = "Mildred";
			ActorAddInventory("Cuffs");
			CurrentActor = "Mildred";
			C011_LiteratureClass_Mildred_QuizMildredStatus = "Clothed_Cuffs";
			OverridenIntroText = GetText("TestMildredCuffs");
			OverridenIntroImage = "TestMildredCuffs.jpg";
		}
		
	} else {

		C011_LiteratureClass_Mildred_MildredVictoryCount++;
	
		// If the player was already hit, she gets hit again (chastity version)
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "RedButt_Cuffs_Chastity") { 
			OverridenIntroText = GetText("TestPlayerCropAgainMildred");
			OverridenIntroImage = "TestPlayerRedButtChastity.jpg";
		}
		
		// If the player was already hit, she gets hit again
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "RedButt_Cuffs") { 
			OverridenIntroText = GetText("TestPlayerCropAgainMildred");
			OverridenIntroImage = "TestPlayerRedButt.jpg";
		}

		// If the player was stripped, she gets hit (chastity version)
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "NoSkirt_Cuffs_Chastity") { 
			C011_LiteratureClass_Mildred_QuizPlayerStatus = "RedButt_Cuffs_Chastity";
			OverridenIntroText = GetText("TestPlayerCropMildred");
			OverridenIntroImage = "TestPlayerRedButtChastity.jpg";
		}
		
		// If the player was stripped, she gets hit
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "NoSkirt_Cuffs") { 
			C011_LiteratureClass_Mildred_QuizPlayerStatus = "RedButt_Cuffs";
			OverridenIntroText = GetText("TestPlayerCropMildred");
			OverridenIntroImage = "TestPlayerRedButt.jpg";
		}

		// If the player was cuffed, she gets stripped of her skirt (can reveal her chastity belt)
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "Clothed_Cuffs") { 
			if (Common_PlayerChaste) { 
				C011_LiteratureClass_Mildred_QuizPlayerStatus = "NoSkirt_Cuffs_Chastity";
				OverridenIntroText = GetText("TestPlayerNoSkirtMildredChastity"); 
				OverridenIntroImage = "TestPlayerNoSkirtChastity.jpg";
			}
			else { 
				C011_LiteratureClass_Mildred_QuizPlayerStatus = "NoSkirt_Cuffs";
				OverridenIntroText = GetText("TestPlayerNoSkirtMildred"); 
				OverridenIntroImage = "TestPlayerNoSkirt.jpg"; 
			}
		}
	
		// If the player wasn't cuffed, she gets cuffed
		if (C011_LiteratureClass_Mildred_QuizPlayerStatus == "Clothed") {
			PlayerLockInventory("Cuffs");
			C011_LiteratureClass_Mildred_QuizPlayerStatus = "Clothed_Cuffs";
			OverridenIntroText = GetText("TestPlayerCuffsMildred");
			OverridenIntroImage = "TestPlayerCuffs.jpg";
		}

	}

}

// Chapter 11 - Mildred starts the test for the player and Sidney
function C011_LiteratureClass_Mildred_StartTest() {
	if (C011_LiteratureClass_Mildred_GoodStudentCount >= 2) ActorChangeAttitude(1, 0);
	CurrentTime = CurrentTime + 50000;
	C011_LiteratureClass_Mildred_StartQuiz(C011_LiteratureClass_Mildred_TestChapter.toString(), "Sidney");
}

// Chapter 11 - Starts the test against Mildred
function C011_LiteratureClass_Mildred_StartTestMildred() {
	CurrentTime = CurrentTime + 50000;
	if (C011_LiteratureClass_Mildred_TestChapter >= 6) {
		C011_LiteratureClass_Mildred_TestChapter = 1;
		C011_LiteratureClass_Mildred_PlayerVictoryCount = 0;
	}
	C011_LiteratureClass_Mildred_StartQuiz(C011_LiteratureClass_Mildred_TestChapter.toString(), "Mildred");
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
	ActorLoad("Mildred", "");
	LeaveIcon = "";
}

// Chapter 11 - Mildred check if the player or Sidney won
function C011_LiteratureClass_Mildred_CheckForWinner() {
	OverridenIntroImage = "";
	if (C011_LiteratureClass_Mildred_PlayerVictoryCount < C011_LiteratureClass_Mildred_SidneyVictoryCount) {
		ActorChangeAttitude(-1, -1);
		C011_LiteratureClass_Mildred_CurrentStage = 200;
		OverridenIntroText = GetText("ShameForDefeat");
		GameLogSpecificAdd(CurrentChapter, "", "LostVersusSidney");
	} else GameLogSpecificAdd(CurrentChapter, "", "WonVersusSidney");
}

// Chapter 11 - Checks who's the winner between Mildred and the player
function C011_LiteratureClass_Mildred_CheckForWinnerMildred() {
	OverridenIntroImage = "";
	if (C011_LiteratureClass_Mildred_PlayerVictoryCount >= C011_LiteratureClass_Mildred_MildredVictoryCount) {
		GameLogSpecificAdd(CurrentChapter, "", "WonVersusMildred");
		ActorChangeAttitude(1, 1);
		C011_LiteratureClass_Mildred_CurrentStage = 150;
		OverridenIntroText = GetText("MildredShameForDefeat");
	} else {
		GameLogSpecificAdd(CurrentChapter, "", "LostVersusMildred");
		if (C011_LiteratureClass_Mildred_QuizMildredStatus != "Clothed")
			OverridenIntroText = GetText("MildredFreedBySidney");
	}
}

// Chapter 11 - Mildred can gag the player if she's too noisy
function C011_LiteratureClass_Mildred_GagPlayer() {
	if ((C011_LiteratureClass_Mildred_QuizPlayerStatus == "NoSkirt_Cuffs") || (C011_LiteratureClass_Mildred_QuizPlayerStatus == "RedButt_Cuffs")) C011_LiteratureClass_Mildred_CurrentStage = 240;
	if ((C011_LiteratureClass_Mildred_QuizPlayerStatus == "NoSkirt_Cuffs_Chastity") || (C011_LiteratureClass_Mildred_QuizPlayerStatus == "RedButt_Cuffs_Chastity")) C011_LiteratureClass_Mildred_CurrentStage = 250;
	PlayerLockInventory("BallGag");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 11 - Mildred leaves the player to continue the test
function C011_LiteratureClass_Mildred_MildredLeave() {
	CurrentActor = "";
}

// Chapter 11 - 5 minutes between each tests
function C011_LiteratureClass_Mildred_WaitTest() {
	CurrentTime = CurrentTime + 290000;
}

// Chapter 11 - Ends the chapter
function C011_LiteratureClass_Mildred_EndChapter() {
	SetScene(CurrentChapter, "Outro");
}

// Chapter 11 - Frees both the player and Mildred
function C011_LiteratureClass_Mildred_FreeBoth() {
	CurrentActor = "Mildred";
	ActorRemoveInventory("Cuffs");
	CurrentActor = "";
	PlayerReleaseBondage();
}

// Chapter 11 - Takes Mildred items
function C011_LiteratureClass_Mildred_TakeItems() {
	GameLogSpecificAdd(CurrentChapter, "", "ClassLeader");
	PlayerAddInventory("Cuffs", 2);
	PlayerAddInventory("CuffsKey", 1);
	PlayerAddInventory("BallGag", 1);
	PlayerAddInventory("Crop", 1);
}

// Chapter 11 - Ends as a strict leader
function C011_LiteratureClass_Mildred_StrictLeader() {
	ActorSpecificChangeAttitude("Sidney", 0, 2);
	ActorSpecificChangeAttitude("Natalie", 0, 2);
	GameLogSpecificAdd(CurrentChapter, "", "StrictLeader");
}

// Chapter 11 - Ends as a fair leader
function C011_LiteratureClass_Mildred_FairLeader() {
	ActorSpecificChangeAttitude("Sidney", 1, 1);
	ActorSpecificChangeAttitude("Natalie", 1, 1);
	GameLogSpecificAdd(CurrentChapter, "", "FairLeader");
}

// Chapter 11 - Ends as an easy leader
function C011_LiteratureClass_Mildred_EasyLeader() {
	ActorSpecificChangeAttitude("Sidney", 2, 0);
	ActorSpecificChangeAttitude("Natalie", 2, 0);
	GameLogSpecificAdd(CurrentChapter, "", "EasyLeader");
}

// Chapter 11 - Give up the test before it ends (only available if the player is losing)
function C011_LiteratureClass_Mildred_GiveUpTest() {
	GameLogSpecificAdd(CurrentChapter, "", "GiveUpVersusSidney");
	GameLogSpecificAdd(CurrentChapter, "", "LostVersusSidney");
	OverridenIntroImage = "";
}