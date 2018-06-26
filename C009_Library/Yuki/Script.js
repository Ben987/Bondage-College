var C009_Library_Yuki_CurrentStage = 0;
var C009_Library_Yuki_BookAlreadyFound = false;
var C009_Library_Yuki_DetentionBondage = false;
var C009_Library_Yuki_DetentionFighting = false;
var C009_Library_Yuki_IsolationMildred = false;
var C009_Library_Yuki_IsolationYuki = false;
var C009_Library_Yuki_IsolationPleasureYuki = false;
var C009_Library_Yuki_IsolationOrgasmYuki = false;
var C009_Library_Yuki_IsolationEarlyReleaseYuki = false;
var	C009_Library_Yuki_IsolationEscapeYuki = false;
var	C009_Library_Yuki_HasEgg = false;
var	C009_Library_Yuki_CanFindPlayer = true;
var C009_Library_Yuki_AllowSecondChance = true;
var C009_Library_Yuki_PenInHole = false;
var C009_Library_Yuki_AnnoyCount = 0;
var C009_Library_Yuki_TickleDone = false;
var C009_Library_Yuki_CaressDone = false;
var C009_Library_Yuki_OrgasmDone = false;
var C009_Library_Yuki_MasturbateCount = 0;
var C009_Library_Yuki_ReleaseConfirm = false;
var C009_Library_Yuki_SleepingPillFromHole = false;
var C009_Library_Yuki_SleepingPillFromPleasure = false;
var C009_Library_Yuki_CanAskForDoor = false;
var C009_Library_Yuki_PenAvail = true;
var C009_Library_Yuki_PleasureDone = false;
var C009_Library_Yuki_CanPleasure = false;
var C009_Library_Yuki_Pleasure1 = 0;
var C009_Library_Yuki_Pleasure2 = 0;
var C009_Library_Yuki_Pleasure3 = 0;
var C009_Library_Yuki_Pleasure4 = 0;
var C009_Library_Yuki_Pleasure5 = 0;
var C009_Library_Yuki_LittlePet = false;
var C009_Library_Yuki_ReleaseDone = false;

// Chapter 9 Library - Yuki Load
function C009_Library_Yuki_Load() {

	// Load the scene parameters
	ActorLoad("Yuki", "Library");
	LoadInteractions();
	Common_SelfBondageAllowed = false;
	C009_Library_Yuki_ReleaseConfirm = false;
	C009_Library_Yuki_CanAskForDoor = (C009_Library_Library_FoundLockedDoor && !C009_Library_Library_DoorOpen);
	if ((C009_Library_Yuki_CurrentStage >= 500) && (C009_Library_Yuki_CurrentStage < 600)) C009_Library_Library_CurrentZone = "008";
	else C009_Library_Library_CurrentZone = "007";
	
	// A few variables on what already happened
	C009_Library_Yuki_PenInHole = (C009_Library_Search_PenInHole && !GameLogQuery("C009_Library", "Yuki", "StuckInHole") && C009_Library_Yuki_PenAvail);
	C009_Library_Yuki_BookAlreadyFound = (C009_Library_Library_BookProgress > 40);
	C009_Library_Yuki_DetentionBondage = GameLogQuery("C001_BeforeClass", "", "PublicBondage");
	C009_Library_Yuki_DetentionFighting = (GameLogQuery("C001_BeforeClass", "Sidney", "FightVictory") || GameLogQuery("C001_BeforeClass", "Sidney", "FightDefeat"));
	C009_Library_Yuki_IsolationMildred = GameLogQuery("C006_Isolation", "Mildred", "Isolation");
	C009_Library_Yuki_IsolationYuki = GameLogQuery("C006_Isolation", "Yuki", "Isolation");
	C009_Library_Yuki_IsolationPleasureYuki = GameLogQuery("C006_Isolation", "Yuki", "Pleasure");
	C009_Library_Yuki_IsolationOrgasmYuki = GameLogQuery("C006_Isolation", "Yuki", "Orgasm");
	C009_Library_Yuki_IsolationEarlyReleaseYuki = (GameLogQuery("C006_Isolation", "", "Release") && C009_Library_Yuki_IsolationYuki);
	C009_Library_Yuki_IsolationEscapeYuki = (GameLogQuery("C006_Isolation", "", "Escape") && C009_Library_Yuki_IsolationYuki);
	C009_Library_Yuki_HasEgg = ActorHasInventory("VibratingEgg");

	// The first dialog can be different depending on what happened before
	if (C009_Library_Yuki_CurrentStage == 6) C009_Library_Yuki_CurrentStage = 0;
	if ((C009_Library_Yuki_CurrentStage == 0) && (Common_PlayerRestrained || Common_PlayerGagged)) C009_Library_Yuki_CurrentStage = 5;
	if ((C009_Library_Yuki_CurrentStage == 0) && C009_Library_Yuki_IsolationOrgasmYuki && C009_Library_Yuki_IsolationEarlyReleaseYuki) C009_Library_Yuki_CurrentStage = 10;
	if ((C009_Library_Yuki_CurrentStage == 0) && C009_Library_Yuki_IsolationEscapeYuki) C009_Library_Yuki_CurrentStage = 20;
	if ((C009_Library_Yuki_CurrentStage == 0) && C009_Library_Yuki_IsolationPleasureYuki && !C009_Library_Yuki_IsolationOrgasmYuki) C009_Library_Yuki_CurrentStage = 30;
	if ((C009_Library_Yuki_CurrentStage == 0) && C009_Library_Yuki_IsolationYuki) C009_Library_Yuki_CurrentStage = 40;
	if ((C009_Library_Yuki_CurrentStage == 0) && C009_Library_Yuki_IsolationMildred) C009_Library_Yuki_CurrentStage = 50;
	if ((C009_Library_Yuki_CurrentStage == 0) && C009_Library_Yuki_DetentionFighting) C009_Library_Yuki_CurrentStage = 60;
	if ((C009_Library_Yuki_CurrentStage == 0) && C009_Library_Yuki_DetentionBondage) C009_Library_Yuki_CurrentStage = 70;
	
	// The player can pleasure Yuki if love + seduction * 2 >= 5 and no chastity belt
	C009_Library_Yuki_CanPleasure = (!C009_Library_Yuki_PleasureDone && !ActorIsChaste() && (ActorGetValue(ActorLove) + (PlayerGetSkillLevel("Seduction") * 2) >= 5));

	// Yuki can force the player if submission -5 and no chastity belt
	if ((C009_Library_Yuki_CurrentStage == 200) && !C009_Library_Yuki_PleasureDone && !ActorIsChaste() && (ActorGetValue(ActorSubmission) <= -5)) {
		C009_Library_Yuki_CurrentStage = 700;
		OverridenIntroText = GetText("GrabForPleasure");
		C009_Library_Yuki_StartPleasure();
	}

	// Yuki can force the player if submission -1, an egg and no chastity belt
	if ((C009_Library_Yuki_CurrentStage == 200) && !C009_Library_Yuki_PleasureDone && !ActorIsChaste() && ActorHasInventory("VibratingEgg") && (ActorGetValue(ActorSubmission) <= 0)) {
		C009_Library_Yuki_CurrentStage = 700;
		OverridenIntroText = GetText("GrabForPleasureEgg");
		C009_Library_Yuki_StartPleasure();
	}

}

// Chapter 9 Library - Yuki Run
function C009_Library_Yuki_Run() {
	BuildInteraction(C009_Library_Yuki_CurrentStage);
	if (C009_Library_Yuki_CurrentStage < 250) DrawInteractionActor();
	if ((C009_Library_Yuki_CurrentStage >= 270) && (C009_Library_Yuki_CurrentStage < 300)) DrawInteractionActor();
	if ((C009_Library_Yuki_CurrentStage >= 300) && (C009_Library_Yuki_CurrentStage < 320)) { DrawActor("Yuki", 480, 0, 1); DrawActor("Player", 720, 30, 1); }
	if ((C009_Library_Yuki_CurrentStage >= 400) && (C009_Library_Yuki_CurrentStage < 500)) DrawInteractionActor();
	if ((C009_Library_Yuki_CurrentStage >= 530) && (C009_Library_Yuki_CurrentStage < 700)) DrawInteractionActor();
	if ((C009_Library_Yuki_CurrentStage >= 700) && (C009_Library_Yuki_CurrentStage <= 720)) DrawActor("Player", 675, 0, 0.75);
	if (C009_Library_Yuki_CurrentStage >= 730) DrawInteractionActor();
}

// Chapter 9 Library - Yuki Click
function C009_Library_Yuki_Click() {

	// Regular and inventory interactions
	ClickInteraction(C009_Library_Yuki_CurrentStage);
	var ClickInv = GetClickedInventory();
	
	// Allows the player to access the menu if she could leave the scene
	if ((ClickInv == "Player") && (LeaveIcon != "")) {
		C009_Library_Yuki_IntroText = OverridenIntroText;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}
	
	// The player can slide an egg in Yuki if she's stuck in the hole with no panties
	if ((ClickInv == "VibratingEgg") && !ActorHasInventory("ChastityBelt") && !ActorHasInventory("VibratingEgg") && (C009_Library_Yuki_CurrentStage == 510) && !Common_PlayerRestrained) {
		OverridenIntroText = GetText("VibratingEggInHole");
		ActorChangeAttitude(0, 1);
		PlayerRemoveInventory("VibratingEgg", 1);
		ActorAddInventory("VibratingEgg");
		GameLogAdd("VibratingEgg");
	}

	// The player can slide a sleeping pill in Yuki's anus if she's stuck in the hole with no panties
	if ((ClickInv == "SleepingPill") && !ActorHasInventory("ChastityBelt") && !C009_Library_Yuki_SleepingPillFromHole && (C009_Library_Yuki_CurrentStage == 510) && !Common_PlayerRestrained) {
		C009_Library_Yuki_SleepingPillFromHole = true;
		OverridenIntroText = GetText("SleepingPillInHole");
		PlayerRemoveInventory("SleepingPill", 1);
		GameLogAdd("Drug");
	}

	// The player can slide an egg in Yuki if she's getting pleasured
	if ((ClickInv == "VibratingEgg") && !ActorHasInventory("VibratingEgg") && (C009_Library_Yuki_CurrentStage == 710)) {
		OverridenIntroText = GetText("VibratingEggPleasure");
		PlayerRemoveInventory("VibratingEgg", 1);
		ActorAddInventory("VibratingEgg");
		GameLogAdd("VibratingEgg");
	}

	// The player can slide a sleeping pill in Yuki's anus if she's stuck in the hole with no panties
	if ((ClickInv == "SleepingPill") && !C009_Library_Yuki_SleepingPillFromPleasure && (C009_Library_Yuki_CurrentStage == 710)) {
		C009_Library_Yuki_SleepingPillFromPleasure = true;
		OverridenIntroText = GetText("SleepingPillPleasure");
		PlayerRemoveInventory("SleepingPill", 1);
		GameLogAdd("Drug");
	}

	// The player can lock the chastity belt on Yuki if she's stuck in the hole with no panties
	if ((ClickInv == "ChastityBelt") && !ActorHasInventory("ChastityBelt") && (C009_Library_Yuki_CurrentStage == 510) && !Common_PlayerRestrained) {
		OverridenIntroText = GetText("ChastityBeltInHole");
		PlayerRemoveInventory("ChastityBelt", 1);
		ActorAddInventory("ChastityBelt");
		GameLogAdd("ChastityBelt");
		ActorChangeAttitude(-1, 1);
		C009_Library_Yuki_CurrentStage = 520;
		CurrentTime = CurrentTime + 50000;
	}
	
	// If an item is used while Yuki is sleeping, she will wake up
	if ((ClickInv != "Player") && (ClickInv != "") && (C009_Library_Yuki_CurrentStage == 410) && !Common_PlayerRestrained) {
		C009_Library_Yuki_Wake();
		C009_Library_Yuki_CurrentStage = 420;
		OverridenIntroText = GetText("ItemWakeUp");
		GameLogAdd("DrugAwake");
	}
	
}

// Chapter 9 Library - Yuki - When the player leaves to find her book
function C009_Library_Yuki_PlayerLeaveForBook() {
	C009_Library_Library_CurrentZone = "007";
	SetScene(CurrentChapter, "Library");
}

// Chapter 9 Library - Yuki Allow Leaving
function C009_Library_Yuki_AllowLeave() {
	LeaveIcon = "Leave";
}

// Chapter 9 Library - Yuki confiscates the Sweet Gwendoline magazine
function C009_Library_Yuki_NoMoreSweetGwendoline() {
	C009_Library_Search_MagazineConfiscated = true;
}

// Chapter 9 Library - Yuki can help to player to retrieve her pencil if she likes the player
function C009_Library_Yuki_TestForHelp() {
	if (ActorGetValue(ActorLove) >= 0) {
		OverridenIntroText = GetText("AcceptToHelp");
		C009_Library_Yuki_CurrentStage = 220;
		LeaveIcon = "";
		GameLogAdd("HelpPlayerFromHole");
	}
}

// Chapter 9 Library - Yuki will restrain the player is she's annoyed 3 times
function C009_Library_Yuki_AnnoyYuki() {
	C009_Library_Yuki_AnnoyCount++;
	if (C009_Library_Yuki_AnnoyCount >= 3) {
		if (!C009_Library_Search_CanStealArmbinder && PlayerHasInventory("Armbinder")) PlayerRemoveInventory("Armbinder", 1);
		PlayerLockInventory("Armbinder");
		PlayerUnlockInventory("ClothGag");
		PlayerUnlockInventory("BallGag");
		PlayerUnlockInventory("TapeGag");
		GameLogAdd("ArmbinderOnPlayer");
		ActorSetPose("Angry");
		C009_Library_Library_LockedArmbinder = true;
		OverridenIntroText = GetText("Annoyed");
		C009_Library_Yuki_CurrentStage = 300;
		LeaveIcon = "";
	}
}

// Chapter 9 Library - Yuki starts to crawl in the hole
function C009_Library_Yuki_CrawlInHole() {
	CurrentTime = CurrentTime + 50000;
}

// Chapter 9 Library - Yuki can get stuck in the hole
function C009_Library_Yuki_StuckInHole() {
	LeaveIcon = "Leave";
	C009_Library_Yuki_CanFindPlayer = false;
	C009_Library_Library_CurrentZone = "008";
	GameLogAdd("StuckInHole");
}

// Chapter 9 Library - The player can leave for the regular hole scene
function C009_Library_Yuki_LeaveForHole() {
	C009_Library_Yuki_PenInHole = false;
	C009_Library_Search_PenInHole = false;
	C009_Library_Yuki_PenAvail = false;
	C009_Library_Library_CurrentZone = "008";
	C009_Library_Search_CurrentStage = 85;
	SetScene(CurrentChapter, "Search");
}

// Chapter 9 Library - When Yuki gags the player
function C009_Library_Yuki_GagPlayer() {
	PlayerLockInventory("TapeGag");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 9 Library - Wait 2 minutes
function C009_Library_Yuki_TwoMinutes() {
	CurrentTime = CurrentTime + 110000;	
}

// Chapter 9 Library - Yuki Tickle
function C009_Library_Yuki_Tickle() {
	if (!C009_Library_Yuki_TickleDone) {
		C009_Library_Yuki_TickleDone = true;
		ActorChangeAttitude(-1, 1);
	}
}

// Chapter 9 Library - Yuki Caress
function C009_Library_Yuki_Caress() {
	if (!C009_Library_Yuki_CaressDone) {
		C009_Library_Yuki_CaressDone = true;
		ActorChangeAttitude(1, 0);
	}
}

// Chapter 9 Library - Yuki Caress
function C009_Library_Yuki_Masturbate() {
	C009_Library_Yuki_MasturbateCount++;
	if ((C009_Library_Yuki_MasturbateCount >= 3) && !C009_Library_Yuki_OrgasmDone && ActorHasInventory("VibratingEgg")) {
		C009_Library_Yuki_CurrentStage = 511;
		C009_Library_Yuki_OrgasmDone = true;
		OverridenIntroText = GetText("ReadyForOrgasm");
	}
}

// Chapter 9 Library - Yuki can get an orgasm in the hole
function C009_Library_Yuki_HoleOrgasm() {
	ActorAddOrgasm();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 9 Library - Yuki can be released from the hole
function C009_Library_Yuki_ReleaseFromHole() {
	if (!C009_Library_Yuki_ReleaseConfirm) {
		C009_Library_Yuki_ReleaseConfirm = true;
	} else {
		CurrentTime = CurrentTime + 50000;
		C009_Library_Yuki_CurrentStage = 530;
		ActorSetPose("Angry");
		GameLogAdd("ReleaseFromHole");
		PlayerReleaseBondage();
		OverridenIntroText = GetText("ReleaseFromHole");
		C009_Library_Yuki_CanFindPlayer = true;
		LeaveIcon = "";
	}
}

// Chapter 9 Library - Yuki can fall asleep if she had a sleeping pill
function C009_Library_Yuki_TestSleep() {
	C009_Library_Library_CurrentZone = "007";
	if (C009_Library_Yuki_SleepingPillFromHole) {
		C009_Library_Yuki_SleepingPillFromHole = false;
		OverridenIntroText = GetText("DizzySleep");
		C009_Library_Yuki_CurrentStage = 400;
		ActorSetPose("Sleepy");
		CurrentTime = CurrentTime + 50000;		
		LeaveIcon = "Leave";
	}
}

// Chapter 9 Library - Yuki restrains the player in an armbinder
function C009_Library_Yuki_RestrainPlayer() {
	if (!C009_Library_Search_CanStealArmbinder && PlayerHasInventory("Armbinder")) PlayerRemoveInventory("Armbinder", 1);
	LeaveIcon = "";
	PlayerLockInventory("Armbinder");
	GameLogAdd("ArmbinderOnPlayer");
	ActorSetPose("Angry");
	C009_Library_Library_LockedArmbinder = true;
	CurrentTime = CurrentTime + 50000;
}

// Chapter 9 Library - Yuki can free the player before any chat or on stage 200 but only once
function C009_Library_Yuki_TestRelease() {
	if ((ActorGetValue(ActorLove) >= -2) && !C009_Library_Yuki_ReleaseDone) {
		PlayerReleaseBondage();
		CurrentTime = CurrentTime + 50000;
		C009_Library_Yuki_ReleaseDone = true;
	} else OverridenIntroText = GetText("RefuseHelp");
}

// Chapter 9 Library - Yuki set a new pose
function C009_Library_Yuki_SetPose(NewPose) {
	ActorSetPose("");
}

// Chapter 9 Library - Yuki set a new pose
function C009_Library_Yuki_Sleep() {
	ActorSetPose("Sleeping");
	GameLogAdd("Sleep");
	LeaveIcon = "Leave";
	CurrentTime = CurrentTime + 50000;
	C009_Library_Library_CurrentZone = "007";
	C009_Library_Yuki_CanFindPlayer = false;
}

// Chapter 9 Library - When Yuki sleeps, the player can search the room
function C009_Library_Yuki_StartSearch() {
	C009_Library_Search_CurrentStage = 70;
	SetScene(CurrentChapter, "Search");
}

// Chapter 9 Library - When Yuki is awoken
function C009_Library_Yuki_Wake() {
	ActorSetPose("Sleepy");
	CurrentTime = CurrentTime + 50000;
	LeaveIcon = "";
	C009_Library_Yuki_CanFindPlayer = true;
	C009_Library_Yuki_AllowSecondChance = false;
	GameLogAdd("DrugAwake");
}

// Chapter 9 Library - In some intro, Yuki will not allow a second chance
function C009_Library_Yuki_NoSecondChance() {
	C009_Library_Yuki_AllowSecondChance = false;
}

// Chapter 9 Library - In some situations, Yuki will want pleasure from the player
function C009_Library_Yuki_StartPleasure() {
	C009_Library_Yuki_PleasureDone = true;
	C009_Library_Yuki_CanPleasure = false;
	LeaveIcon = "";
	PlayerReleaseBondage();
	Common_PlayerPose = "KneelPleasureToYuki";
	CurrentTime = CurrentTime + 50000;
	GameLogAdd("PleasureStart");
}

// Chapter 9 Library - Yuki pleasure dialog will be blocked
function C009_Library_Yuki_NoPleasure() {
	C009_Library_Yuki_PleasureDone = true;
	C009_Library_Yuki_CanPleasure = false;
	Common_PlayerPose = "";
	LeaveIcon = "Leave";
}

// Chapter 9 Library - The player can try to stop pleasuring Yuki
function C009_Library_Yuki_TestPullAway() {
	if ((ActorGetValue(ActorSubmission) <= -5) || ((ActorGetValue(ActorSubmission) <= 0) && (ActorHasInventory("VibratingEgg")))) {
		OverridenIntroText = GetText("ForceEat");
		C009_Library_Yuki_CurrentStage = 710;
	} else C009_Library_Yuki_NoPleasure();
}

// Chapter 9 Library - Yuki Pleasure 
function C009_Library_Yuki_Pleasure(PleasureType) {
	
	// The player must pleasure her in 3 different ways and at least 5 times to make her climax)
	if (PleasureType == 1) C009_Library_Yuki_Pleasure1++;
	if (PleasureType == 2) C009_Library_Yuki_Pleasure2++;
	if (PleasureType == 3) C009_Library_Yuki_Pleasure3++;
	if (PleasureType == 4) C009_Library_Yuki_Pleasure4++;
	if (PleasureType == 5) C009_Library_Yuki_Pleasure5++;
	if ((C009_Library_Yuki_Pleasure1 > 0) && (C009_Library_Yuki_Pleasure2 > 0) && (C009_Library_Yuki_Pleasure3 > 0) && (C009_Library_Yuki_Pleasure4 > 0) && (C009_Library_Yuki_Pleasure5 > 0) && (C009_Library_Yuki_Pleasure1 + C009_Library_Yuki_Pleasure2 + C009_Library_Yuki_Pleasure3 + C009_Library_Yuki_Pleasure4 + C009_Library_Yuki_Pleasure5 >= 5)) {
		
		// Yuki gets an orgasm
		Common_PlayerPose = "KneelPleasureToYukiOrgasm";
		OverridenIntroText = GetText("DeskOrgasm");
		C009_Library_Yuki_CurrentStage = 720;
		GameLogAdd("PleasureSuccess");
		ActorChangeAttitude(2, 0);
		ActorAddOrgasm();
		C009_Library_Yuki_LittlePet = true;
		
	} else {
		
		// If the player took too long to try all 3 pleasures, she gives up
		if (C009_Library_Yuki_Pleasure1 + C009_Library_Yuki_Pleasure2 + C009_Library_Yuki_Pleasure3 + C009_Library_Yuki_Pleasure4 + C009_Library_Yuki_Pleasure5 >= 7) {
			OverridenIntroText = GetText("StopPleasure");
			ActorSetPose("Angry");
			GameLogAdd("PleasureFail");
			ActorChangeAttitude(-1, 0);
			if (ActorHasInventory("VibratingEgg")) ActorChangeAttitude(-1, 0);
			Common_PlayerPose = "";
			C009_Library_Yuki_CurrentStage = 750;
		}
		
	}
}

// Chapter 9 Library - Yuki, stops the pleasure dialog
function C009_Library_Yuki_StopPleasure() {
	
	// Release the player
	C009_Library_Yuki_NoPleasure();
	ActorSetPose("");
	Common_PlayerPose = "";

	// Yuki can fall asleep if she was drugged
	if (C009_Library_Yuki_SleepingPillFromPleasure) {
		OverridenIntroText = GetText("DizzySleep");
		C009_Library_Yuki_CurrentStage = 400;
		ActorSetPose("Sleepy");
	}
	
}