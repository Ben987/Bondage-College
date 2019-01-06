var C012_AfterClass_RockShow_CurrentStage = 0;
var C012_AfterClass_RockShow_IntroText = "";
var C012_AfterClass_RockShow_SongCount = 0;
var C012_AfterClass_RockShow_MasturbateSidneyDone = false;
var C012_AfterClass_RockShow_MasturbatePlayerDone = false;
var C012_AfterClass_RockShow_CanMasturbateSidney = false;
var C012_AfterClass_RockShow_MasturbateCount = 0;
var C012_AfterClass_RockShow_SearchDone = false;

// Chapter 12 After Class - Rock Show Load
function C012_AfterClass_RockShow_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	ActorLoad("Sidney", "");
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	Common_PlayerPose = "BackWatchShow";
	ActorSetPose("BackWatchShow");

	// If we must put the previous text back
	if (C012_AfterClass_RockShow_IntroText != "") { OverridenIntroText = C012_AfterClass_RockShow_IntroText; C012_AfterClass_RockShow_IntroText = ""; }

	// No leaving from the rock show
	LeaveIcon = "";
	LeaveScreen = "";

}

// Chapter 12 After Class - Rock Show Run
function C012_AfterClass_RockShow_Run() {
	BuildInteraction(C012_AfterClass_RockShow_CurrentStage);
	if (parseInt(C012_AfterClass_RockShow_CurrentStage) >= 200) {
		DrawActor(CurrentActor, 680, 0, 1);	
		DrawActor("Player", 500, 0, 1);
	} else {
		DrawActor("Player", 500, 0, 1);
		DrawActor(CurrentActor, 680, 0, 1);		
	}
}

// Chapter 12 After Class - Rock Show Click
function C012_AfterClass_RockShow_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_RockShow_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_RockShow_IntroText = OverridenIntroText;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 12 After Class - When the player leaves the rock show
function C012_AfterClass_RockShow_Wait(WaitTime) {
	CurrentTime = CurrentTime + WaitTime;
}

// Chapter 12 After Class - When the player listens until the next song
function C012_AfterClass_RockShow_NextSong() {
	
	// The more songs, the more Sidney will like the player
	C012_AfterClass_RockShow_SongCount++;
	CurrentTime = CurrentTime + 290000;
	if (C012_AfterClass_RockShow_SongCount == 5) ActorChangeAttitude(1, 0);
	if (C012_AfterClass_RockShow_SongCount == 12) ActorChangeAttitude(1, 0);
	if (C012_AfterClass_RockShow_SongCount == 20) ActorChangeAttitude(1, 0);
	if (C012_AfterClass_RockShow_SongCount == 30) ActorChangeAttitude(1, 0);
	C012_AfterClass_RockShow_CanMasturbateSidney = ((C012_AfterClass_RockShow_SongCount >= 2) && !C012_AfterClass_RockShow_MasturbateSidneyDone && !ActorIsChaste() && (ActorGetValue(ActorSubmission) > -5));

	// Sidney can start masturbating the player if she's dominant enough (15% odds + submission level, so 35% if -20 submission)
	if ((C012_AfterClass_RockShow_SongCount >= 2) && !C012_AfterClass_RockShow_MasturbatePlayerDone && (ActorGetValue(ActorSubmission) < 5)) {
		if (Math.floor(Math.random() * 100) + ActorGetValue(ActorSubmission) < 15) {
			C012_AfterClass_RockShow_MasturbatePlayerDone = true;
			if (!Common_PlayerChaste) {
				C012_AfterClass_RockShow_CurrentStage = 200;
				C012_AfterClass_RockShow_MasturbateCount = 0;
				GameLogAdd("RockShowPlayerMastubate");
				ActorSetPose("BackWatchShowHandLeft");
				OverridenIntroText = GetText("SidneyStartMasturbate");
			} else {
				ActorChangeAttitude(0, 1);
				OverridenIntroText = GetText("SidneyDrumsBelt");
			}
		}
	}

}

// Chapter 12 After Class - When the player starts to masturbate Sidney
function C012_AfterClass_RockShow_StartMasturbateSidney() {
	C012_AfterClass_RockShow_MasturbateSidneyDone = true;
	C012_AfterClass_RockShow_CanMasturbateSidney = false;
	C012_AfterClass_RockShow_MasturbateCount = 0;
	GameLogAdd("RockShowSidneyMastubate");
	Common_PlayerPose = "BackWatchShowHandRight";
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When Sidney masturbates the player (4 times is required with an egg, 6 without)
function C012_AfterClass_RockShow_MasturbatePlayer() {
	C012_AfterClass_RockShow_MasturbateCount++;
	CurrentTime = CurrentTime + 50000;
	if ((C012_AfterClass_RockShow_MasturbateCount >= 6) || (PlayerHasLockedInventory("VibratingEgg") && (C012_AfterClass_RockShow_MasturbateCount >= 4))) {
		OverridenIntroText = GetText("PlayerReadyToClimax");
		C012_AfterClass_RockShow_CurrentStage = 220;
	}
}

// Chapter 12 After Class - When the player masturbates Sidney 
function C012_AfterClass_RockShow_MasturbateSidney(Factor) {
	C012_AfterClass_RockShow_MasturbateCount = C012_AfterClass_RockShow_MasturbateCount + Factor;
	if (C012_AfterClass_RockShow_MasturbateCount < 0) C012_AfterClass_RockShow_MasturbateCount = 0;
	CurrentTime = CurrentTime + 50000;
	if ((C012_AfterClass_RockShow_MasturbateCount >= 10) || (PlayerHasLockedInventory("VibratingEgg") && (C012_AfterClass_RockShow_MasturbateCount >= 7))) {
		OverridenIntroText = GetText("SidneyReadyToClimax");
		C012_AfterClass_RockShow_CurrentStage = 110;
	}
}

// Chapter 12 After Class - When the player gets an orgasm
function C012_AfterClass_RockShow_OrgasmPlayer() {
	CurrentTime = CurrentTime + 50000;
	ActorAddOrgasm();
	GameLogAdd("RockShowPlayerOrgasm");
}

function C012_AfterClass_RockShow_BackToShow() {
	Common_PlayerPose = "BackWatchShow";
	ActorSetPose("BackWatchShow");
}

// Chapter 12 After Class - When the player leaves the rock show
function C012_AfterClass_RockShow_Leave() {
	CurrentTime = CurrentTime + 290000;
	C012_AfterClass_Dorm_LeavingGuest();
	GameLogAdd("BackFromRockShow");
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - When the player searches at the rock show, 1 sleeping pill can be found
function C012_AfterClass_RockShow_Search() {
	CurrentTime = CurrentTime + 50000;
	if (!C012_AfterClass_RockShow_SearchDone) {
		C012_AfterClass_RockShow_SearchDone = true;
		OverridenIntroText = GetText("FindSleepingPill");
		PlayerAddInventory("SleepingPill", 1);
	}
}