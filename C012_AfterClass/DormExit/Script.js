var C012_AfterClass_DormExit_CurrentStage = 0;
var C012_AfterClass_DormExit_KnowKinbakuClub = false;
var C012_AfterClass_DormExit_KnowBondageClub = false;

// Chapter 12 After Class - Dorm Exit Load
function C012_AfterClass_DormExit_Load() {
	
	// Loads the scene to search in the wardrobe
	LeaveIcon = "Leave";
	LeaveScreen = "Dorm";
	LoadInteractions();
	
	// The player can go to clubs if she heard about them
	C012_AfterClass_DormExit_KnowKinbakuClub = (GameLogQuery("C007_LunchBreak", "Natalie", "Lunch") || GameLogQuery("", "", "KinbakuClubInfo"));
	C012_AfterClass_DormExit_KnowBondageClub = GameLogQuery("", "", "BondageClubInvitation");
	C012_AfterClass_DormExit_RescueSarahAvail = (GameLogQuery(CurrentChapter, "Sarah", "IsolationStranded") && !GameLogQuery(CurrentChapter, "Sarah", "IsolationRescue"));

}

// Chapter 12 After Class - Dorm Exit  Run
function C012_AfterClass_DormExit_Run() {
	BuildInteraction(C012_AfterClass_DormExit_CurrentStage);
}

// Chapter 12 After Class - Dorm Exit  Click
function C012_AfterClass_DormExit_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_DormExit_CurrentStage);

}

// Chapter 12 After Class - Launch the Kinbaku club chapter if the player isn't restrained, gagged and is wearing school clothes
function C012_AfterClass_DormExit_LaunchKinbaku() {
	if (!Common_PlayerRestrained && !Common_PlayerGagged) {
		if (Common_PlayerClothed && (Common_PlayerCostume == "")) {
			if (CurrentTime > (18 * 60 * 60 * 1000)) OverridenIntroText = GetText("ClubHasFinished");
			else {
				CurrentTime = CurrentTime + 290000;
				if (C101_KinbakuClub_JennaIntro_CurrentStage == 80) SetScene("C101_KinbakuClub", "ClubRoom1");
				else SetScene("C101_KinbakuClub", "Intro");
			}
		} else OverridenIntroText = GetText("SchoolClothesFirst");
	} else OverridenIntroText = GetText("UnrestrainFirst");
}

// Chapter 12 After Class - Launch the Roommates Dorm
function C012_AfterClass_DormExit_LaunchRoommatesDorm() {
	if (!Common_PlayerRestrained && !Common_PlayerGagged) {
		if (Common_PlayerClothed && ((Common_PlayerCostume == "") || (Common_PlayerCostume == "BlackDress") || (Common_PlayerCostume == "Teacher") || (Common_PlayerCostume == "Tennis"))) {
			CurrentTime = CurrentTime + 110000;
			SetScene(CurrentChapter, "Roommates");
		} else OverridenIntroText = GetText("RegularClothesFirst");
	} else OverridenIntroText = GetText("UnrestrainFirst");
}

// Chapter 12 After Class - Launch the Pub
function C012_AfterClass_DormExit_LaunchPub() {
	if (!Common_PlayerRestrained && !Common_PlayerGagged) {
		if (Common_PlayerClothed && ((Common_PlayerCostume == "") || (Common_PlayerCostume == "BlackDress") || (Common_PlayerCostume == "Teacher"))) {
			CurrentTime = CurrentTime + 290000;
			SetScene(CurrentChapter, "Pub");
		} else OverridenIntroText = GetText("RegularClothesFirst");
	} else OverridenIntroText = GetText("UnrestrainFirst");
}

// Chapter 12 After Class - Launch the pool
function C012_AfterClass_DormExit_LaunchPool() {
	if (!Common_PlayerRestrained && !Common_PlayerGagged) {
		if (Common_PlayerClothed && (Common_PlayerCostume == "RedBikini")) {
			CurrentTime = CurrentTime + 290000;
			SetScene(CurrentChapter, "Pool");
		} else OverridenIntroText = GetText("SwimsuitFirst");
	} else OverridenIntroText = GetText("UnrestrainFirst");
}

// Chapter 12 After Class - Launch the library
function C012_AfterClass_DormExit_LaunchLibrary() {
	if (!Common_PlayerRestrained && !Common_PlayerGagged) {
		if (Common_PlayerClothed && (Common_PlayerCostume == "")) {
			if (CurrentTime < (20.9 * 60 * 60 * 1000)) {
				CurrentTime = CurrentTime + 290000;
				C012_AfterClass_Library_CurrentStage = 0;
				SetScene(CurrentChapter, "Library");				
			} else OverridenIntroText = GetText("LibraryClosed");
		} else OverridenIntroText = GetText("SchoolClothesFirst");
	} else OverridenIntroText = GetText("UnrestrainFirst");
}

// Chapter 12 After Class - Launch the rescue mission for Sarah
function C012_AfterClass_DormExit_LaunchRescueSarah() {
	if (!Common_PlayerRestrained && !Common_PlayerGagged) {
		if (Common_PlayerClothed && (Common_PlayerCostume == "")) {
			CurrentTime = CurrentTime + 290000;
			if (CurrentTime >= 20 * 60 * 60 * 1000) C012_AfterClass_Isolation_CurrentStage = 500;
			else C012_AfterClass_Isolation_CurrentStage = 400;
			SetScene(CurrentChapter, "Isolation");
			C012_AfterClass_Isolation_LockSarah("");
			GameLogAdd("IsolationRescue");
		} else OverridenIntroText = GetText("SchoolClothesFirst");
	} else OverridenIntroText = GetText("UnrestrainFirst");
}

// Chapter 12 After Class - Check if the player can go to the Bondage Club
function C012_AfterClass_DormExit_LaunchBondageClub() {
	if (!Common_PlayerRestrained && !Common_PlayerGagged) {
		if (Common_PlayerClothed && ((Common_PlayerCostume == "") || (Common_PlayerCostume == "BlackDress") || (Common_PlayerCostume == "Teacher"))) {
			if (CurrentTime >= 20 * 60 * 60 * 1000) {
				C012_AfterClass_DormExit_CurrentStage = 10;
			} else OverridenIntroText = GetText("TooEarlyForBondageClub");
		} else OverridenIntroText = GetText("RegularClothesFirst");
	} else OverridenIntroText = GetText("UnrestrainFirst");
}

// Chapter 12 After Class - Enter the Bondage Club
function C012_AfterClass_DormExit_EnterBondageClub() {
	SetScene("C013_BondageClub", "Intro");
}