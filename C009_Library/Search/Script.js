var C009_Library_Search_CurrentStage = 0;
var C009_Library_Search_SearchCounterDone = false;
var C009_Library_Search_SearchCabinetDone = false;
var C009_Library_Search_CanLearnRopeMastery = true;
var C009_Library_Search_CanSit = false;
var C009_Library_Search_MasturbateCount = 0;
var C009_Library_Search_IntroText = "";
var C009_Library_Search_CanClimb = false;
var C009_Library_Search_ClimbDone = false;
var C009_Library_Search_MagazineConfiscated = false;
var C009_Library_Search_PenInHole = false;
var C009_Library_Search_CanStealEgg = true;
var C009_Library_Search_CanStealPill = true;
var C009_Library_Search_CanStealArmbinder = true;
var C009_Library_Search_CanStealTape = true;
var C009_Library_Search_CanCheckYuki = true;
var C009_Library_Search_BondageClubInvitationTaken = false;

// Chapter 9 Library - Search Area Load
function C009_Library_Search_Load() {
	if ((C009_Library_Search_CurrentStage != 87) && (C009_Library_Search_CurrentStage != 88)) LeaveIcon = "Leave";
	LeaveScreen = "Library";
	LoadInteractions();
	if (C009_Library_Search_IntroText != "") OverridenIntroText = C009_Library_Search_IntroText;
	C009_Library_Search_IntroText = "";
	C009_Library_Search_CanCheckYuki = (C009_Library_Yuki_CurrentStage == 410);
	Common_SelfBondageAllowed = false;
	C009_Library_Search_CanSit = (!Common_PlayerGagged && !Common_PlayerRestrained);
	C009_Library_Search_CanClimb = (PlayerGetSkillLevel("Sports") >= 1);
	if (GameLogQuery("C003_MorningDetention", "Yuki", "StealVibratingEgg")) C009_Library_Search_CanStealEgg = false;
	if (GameLogQuery("C003_MorningDetention", "Yuki", "StealSleepingPill")) C009_Library_Search_CanStealPill = false;
}

// Chapter 9 Library - Search Area Run
function C009_Library_Search_Run() {
	BuildInteraction(C009_Library_Search_CurrentStage);
}

// Chapter 9 Library - Search Area Click
function C009_Library_Search_Click() {	

	// Regular interactions
	ClickInteraction(C009_Library_Search_CurrentStage);

	// Can open the player screen from here
	var ClickInv = GetClickedInventory();
	if (ClickInv != "") {
		C009_Library_Search_IntroText = OverridenIntroText;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 9 - Library Search behind the counter
function C009_Library_Search_SearchCounter() {
	if (!C009_Library_Search_SearchCounterDone) {
		OverridenIntroText = GetText("FindItem");
		PlayerAddRandomItem();
		C009_Library_Search_SearchCounterDone = true;
	}
}

// Chapter 9 - Library Search for the "Sweet Gwendoline" magazine
function C009_Library_Search_SearchGwendoline() {
	if (C009_Library_Search_MagazineConfiscated) {
		C009_Library_Search_CurrentStage = 32;
		OverridenIntroText = GetText("NoMoreSweetGwendoline");
	}
}

// Chapter 9 - Library Masturbate, if the player has the egg, she can climax multiple times, if not, only 1 time
function C009_Library_Search_Masturbate() {
	if (Common_PlayerChaste) {
		OverridenIntroText = GetText("CannotMasturbate");
	} else {

		// Yuki can catch the player masturbating, 1 chance out of 12
		if (C009_Library_Yuki_CanFindPlayer && (Math.floor(Math.random() * 12) == 0)) {
			PlayerUngag();
			if (!C009_Library_Yuki_AllowSecondChance) C009_Library_Yuki_CurrentStage = 290;
			if (C009_Library_Yuki_CurrentStage < 100) C009_Library_Yuki_CurrentStage = 90;
			if ((C009_Library_Yuki_CurrentStage >= 100) && (C009_Library_Yuki_CurrentStage <= 210)) C009_Library_Yuki_CurrentStage = 190;
			C009_Library_Yuki_AllowSecondChance = false;
			SetScene(CurrentChapter, "Yuki");
			LeaveIcon = "";
			GameLogAdd("CaughtInHole");	
		} else {
			C009_Library_Search_MasturbateCount++;
			if (C009_Library_Search_MasturbateCount == 3) { GameLogSpecificAdd(CurrentChapter, "", "SweetGwendolineOrgasm"); OverridenIntroText = GetText("Orgasm"); }
			if ((C009_Library_Search_MasturbateCount >= 4) && !PlayerHasLockedInventory("VibratingEgg")) OverridenIntroText = GetText("OrgasmEnough");
			if ((C009_Library_Search_MasturbateCount >= 4) && PlayerHasLockedInventory("VibratingEgg")) {
				OverridenIntroText = GetText("OrgasmRepeat");
				C009_Library_Search_MasturbateCount = 0;
			}
		}
		
	}
}

// Chapter 9 - Library Learn Rope Mastery, the player needs 15 minutes
function C009_Library_Search_LearnRopeMastery() {
	if (CurrentTime <= 15 * 60 * 60 * 1000) {
		PlayerAddSkill("RopeMastery", 1);
		CurrentTime = CurrentTime + 0.25 * 60 * 60 * 1000;
		C009_Library_Search_CanLearnRopeMastery = false;
	} else OverridenIntroText = GetText("TrainRopeMasteryNoTime");
}

// Chapter 9 - Library Set Read Progression
function C009_Library_Search_SetReadProgress() {
	C009_Library_Library_BookProgress = C009_Library_Search_CurrentStage;
}

// Chapter 9 - Library Read Time
function C009_Library_Search_ReadTime() {
	GameLogSpecificAdd(CurrentChapter, "", "ReadChapter" + (C009_Library_Search_CurrentStage - 41).toString());
	C009_Library_Library_BookProgress = C009_Library_Search_CurrentStage;
	CurrentTime = CurrentTime + 170000;
}

// Chapter 9 - Library Read Full Book
function C009_Library_Search_ReadFull() {
	GameLogSpecificAdd(CurrentChapter, "", "ReadTwice");
	C009_Library_Library_BookProgress = C009_Library_Search_CurrentStage;
	CurrentTime = CurrentTime + 890000;
}

// Chapter 9 - Library Climb
function C009_Library_Search_Climb() {
	if (!C009_Library_Search_ClimbDone) {
		C009_Library_Search_ClimbDone = true;
		OverridenIntroText = GetText("ClimbFindItem");
		PlayerAddRandomItem();
	}
}

// Chapter 9 - Library Unlock Door
function C009_Library_Search_UnlockDoor() {
	C009_Library_Library_FoundLockedDoor = true;
	if (C009_Library_Library_FoundKey) {
		GameLogSpecificAdd(CurrentChapter, "", "UnlockDoor");
		C009_Library_Library_DoorOpen = true;
		C009_Library_Search_CurrentStage = 81;
		OverridenIntroText = GetText("OpenKey");
	}
}

// Chapter 9 - Library Force Door
function C009_Library_Search_ForceDoor() {
	C009_Library_Library_FoundLockedDoor = true;
	if (PlayerGetSkillLevel("Fighting") >= 2) {
		GameLogSpecificAdd(CurrentChapter, "", "ForceDoor");
		C009_Library_Library_DoorOpen = true;
		C009_Library_Search_CurrentStage = 81;
		OverridenIntroText = GetText("OpenForce");
	}
}

// Chapter 9 - Library Open Door
function C009_Library_Search_OpenDoor() {
	C009_Library_Library_CurrentZone = "010";
	SetScene(CurrentChapter, "Library");
}

// Chapter 9 - Library No Leaving
function C009_Library_Search_NoLeave() {
	LeaveIcon = "";
}

// Chapter 9 - Library Allow Leaving
function C009_Library_Search_AllowLeave() {
	LeaveIcon = "Leave";
}

// Chapter 9 - Library - When the player gets stuck in a the hole
function C009_Library_Search_StuckInHole() {
	C009_Library_Library_StuckInHole = true;
}

// Chapter 9 - Library - Wait for two minutes in the hole (There's 1 chance out of 12 that Yuki finds the player)
function C009_Library_Search_TwoMinutes() {
	CurrentTime = CurrentTime + 110000;
	if (C009_Library_Yuki_CanFindPlayer && (Math.floor(Math.random() * 12) == 0)) {
		PlayerUngag();
		if (!C009_Library_Yuki_AllowSecondChance) C009_Library_Yuki_CurrentStage = 280;
		if (C009_Library_Yuki_CurrentStage < 100) C009_Library_Yuki_CurrentStage = 80;
		if ((C009_Library_Yuki_CurrentStage >= 100) && (C009_Library_Yuki_CurrentStage <= 210)) C009_Library_Yuki_CurrentStage = 180;
		C009_Library_Yuki_AllowSecondChance = false;
		C009_Library_Library_StuckInHole = false;
		SetScene(CurrentChapter, "Yuki");
		if (C009_Library_Yuki_CurrentStage == 280) ActorSetPose("Angry");
		LeaveIcon = "";
		GameLogAdd("CaughtInHole");
	}
}

// Chapter 9 - Library - When the player struggles to go back from the hole (it works with Sports 1 or more)
function C009_Library_Search_StruggleBack() {
	C009_Library_Search_TwoMinutes();
	if ((PlayerGetSkillLevel("Sports") >= 1) && (CurrentScreen == "Search")) {
		C009_Library_Library_StuckInHole = false;
		OverridenIntroText = GetText("StruggleBackFromHolde");
		LeaveIcon = "Leave";
		C009_Library_Search_CurrentStage = 85;
	}
}

// Chapter 9 - Library - The player can leave a pen in the dark hole
function C009_Library_Search_LeavePenInHole() {
	C009_Library_Search_PenInHole = true;
}

// Chapter 9 - Library - The player can take the pen in the dark hole
function C009_Library_Search_TakePenInHole() {
	C009_Library_Search_PenInHole = false;
}

// Chapter 9 - Library - The player can steal from Yuki's bag
function C009_Library_Search_StealEgg() {
	C009_Library_Search_CanStealEgg = false;
	PlayerAddInventory("VibratingEgg", 1);
	GameLogSpecificAdd(CurrentChapter, "Yuki", "StealVibratingEgg");
}

// Chapter 9 - Library - The player can steal from Yuki's bag
function C009_Library_Search_StealPill() {
	C009_Library_Search_CanStealPill = false;
	PlayerAddInventory("SleepingPill", 1);
	GameLogSpecificAdd(CurrentChapter, "Yuki", "StealSleepingPill");
}

// Chapter 9 - Library - The player can steal from Yuki's bag
function C009_Library_Search_StealArmbinder() {
	C009_Library_Search_CanStealArmbinder = false;
	PlayerAddInventory("Armbinder", 1);
	GameLogSpecificAdd(CurrentChapter, "Yuki", "StealArmbinder");
}

// Chapter 9 - Library - The player can steal from Yuki's bag
function C009_Library_Search_StealTape() {
	C009_Library_Search_CanStealTape = false;
	PlayerAddInventory("TapeGag", 6);
	GameLogSpecificAdd(CurrentChapter, "Yuki", "StealTapeGag");
}

// Chapter 9 - Library - The player can search on Yuki's desk
function C009_Library_Search_SearchDesk() {
	if (!C009_Library_Library_FoundKey) {
		C009_Library_Library_FoundKey = true;
		OverridenIntroText = GetText("FindKey");
	}
}

// Chapter 9 - Library - The player can check on Yuki if she's sleeping
function C009_Library_Search_CheckYuki() {
	SetScene(CurrentChapter, "Yuki");
}

// Chapter 9 - Library - The player can search for the Story of O
function C009_Library_Search_SearchO() {
	if (!C009_Library_Search_BondageClubInvitationTaken) {
		C009_Library_Search_CurrentStage = 101;
		OverridenIntroText = GetText("FindO");
	}
}

// Chapter 9 - Library - The player can take the bondage club invitation
function C009_Library_Search_TakeInvitation() {
	C009_Library_Search_BondageClubInvitationTaken = true;
	GameLogSpecificAdd(CurrentChapter, "", "BondageClubInvitation");
}

// Chapter 9 - Library Search in the wooden cabinet
function C009_Library_Search_SearchCabinet() {
	if (!C009_Library_Search_SearchCabinetDone) {
		OverridenIntroText = GetText("FindCabinet");
		PlayerAddInventory("Collar", 1);
		C009_Library_Search_SearchCabinetDone = true;
	}
}
