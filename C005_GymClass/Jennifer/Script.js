var C005_GymClass_Jennifer_CurrentStage = 0;
var C005_GymClass_Jennifer_PracticeMode = false;
var C005_GymClass_Jennifer_EasyMode = false;
var C005_GymClass_Jennifer_DefeatedHardMode = false;
var C005_GymClass_Jennifer_DefeatedHardModePerfect = false;
var C005_GymClass_Jennifer_DefeatedHardModeBonus = false;
var C005_GymClass_Jennifer_RopeGiven = false;
var C005_GymClass_Jennifer_EggInside = false;
var C005_GymClass_Jennifer_EggConfirm = false;
var C005_GymClass_Jennifer_EggCommentDone = false;
var C005_GymClass_Jennifer_AdorableCommentDone = false;
var C005_GymClass_Jennifer_CrotchRopeDone = false;
var C005_GymClass_Jennifer_TickleDone = false;
var C005_GymClass_Jennifer_SpankDone = false;
var C005_GymClass_Jennifer_CropDone = false;
var C005_GymClass_Jennifer_CrotchRopePlayerDone = false;
var C005_GymClass_Jennifer_CuddleDone = false;
var C005_GymClass_Jennifer_PlayerHasBallGag = false;
var C005_GymClass_Jennifer_PlayerHasTapeGag = false;
var C005_GymClass_Jennifer_Turnabout = false;
var C005_GymClass_Jennifer_TrainingReady = true;
var C005_GymClass_Jennifer_CollarFound = false;

// Chapter 5 - Jennifer Load
function C005_GymClass_Jennifer_Load() {

	// Load the scene parameters
	ActorLoad("Jennifer", "GymClass");
	GameLogAdd("Judo");
	LoadInteractions();
	StartTimer(11.5 * 60 * 60 * 1000, CurrentChapter, "Outro");
	LeaveIcon = "";
	
	// Jennifer scene specific parameters
	C005_GymClass_Jennifer_EggInside = (ActorHasInventory("VibratingEgg"));
	C005_GymClass_Jennifer_EggConfirm = false;
	C005_GymClass_Jennifer_PlayerHasBallGag = (PlayerHasInventory("BallGag"));
	C005_GymClass_Jennifer_PlayerHasTapeGag = (PlayerHasInventory("TapeGag"));
	
	// If the player can collect the hard mode bonus (better bonus if the match was perfect)
	if (C005_GymClass_Jennifer_DefeatedHardMode && !C005_GymClass_Jennifer_DefeatedHardModeBonus) {
		ActorChangeAttitude(1, 1);
		if (C005_GymClass_Jennifer_DefeatedHardModePerfect) {
			PlayerAddInventory("BallGag", 1);
			ActorChangeAttitude(0, 1);
		}
		C005_GymClass_Jennifer_DefeatedHardModeBonus = true;
	}
	
	// If there's no egg, we skip the stage 0
	if (!C005_GymClass_Jennifer_EggInside && (C005_GymClass_Jennifer_CurrentStage == 0))
		C005_GymClass_Jennifer_CurrentStage = 5;

	// If the rope was given, we take it back if there was a defeat
	if ((C005_GymClass_Jennifer_RopeGiven == false) && (C005_GymClass_Jennifer_CurrentStage == 110)) {
		C005_GymClass_Jennifer_RopeGiven = true;
		PlayerAddInventory("Rope", 1);
	}
	
	// If the rope was given, we take it back if there was a defeat
	if ((C005_GymClass_Jennifer_RopeGiven == true) && (C005_GymClass_Jennifer_CurrentStage == 210)) {
		C005_GymClass_Jennifer_RopeGiven = false;
		PlayerRemoveInventory("Rope", 1);
	}

	// If the player won, we restrain Jennifer
	if ((C005_GymClass_Jennifer_CurrentStage == 400) && !ActorHasInventory("Rope") && PlayerHasInventory("Rope")) {
		PlayerRemoveInventory("Rope", 1);
		ActorAddInventory("Rope");		
	}

}

// Chapter 5 - Jennifer Run
function C005_GymClass_Jennifer_Run() {
	BuildInteraction(C005_GymClass_Jennifer_CurrentStage);
}

// Chapter 5 - Jennifer Click
function C005_GymClass_Jennifer_Click() {
	
	// Regular interactions
	ClickInteraction(C005_GymClass_Jennifer_CurrentStage);
	
	// If we want to access player inventory (we can do it at every moment expect when Jennifer is tied up)
	if ((MouseX <= 74) || (C005_GymClass_Jennifer_CurrentStage < 400) || (C005_GymClass_Jennifer_CurrentStage >= 500)) {
		InventoryClick(GetClickedInventory(), "C005_GymClass", "Jennifer");
	}
	else {
		
		// Retrieve which item was clicked
		var ClickInv = GetClickedInventory();

		// When the user wants to use the crop
		if ((ClickInv == "Crop") && ActorHasInventory("Rope") && Common_PlayerNotRestrained) {
			OverridenIntroText = GetText("Crop");
			if (C005_GymClass_Jennifer_CropDone == false) { C005_GymClass_Jennifer_CropDone = true; ActorChangeAttitude(-1, 1); }
			CurrentTime = CurrentTime + 60000;
		}
		
		// When the user wants to use a BallGag	
		if ((ClickInv == "BallGag") && ActorHasInventory("Rope") && !ActorHasInventory("BallGag") && Common_PlayerNotRestrained && ((C005_GymClass_Jennifer_CurrentStage == 400) || (C005_GymClass_Jennifer_CurrentStage == 410) || (C005_GymClass_Jennifer_CurrentStage == 430))) {
			OverridenIntroText = GetText("BallGag");
			C005_GymClass_Jennifer_CurrentStage = 420;
			C005_GymClass_Jennifer_Ungag();
			ActorAddInventory("BallGag");
			PlayerRemoveInventory("BallGag", 1);
			CurrentTime = CurrentTime + 60000;
		}

		// When the user wants to use a tape gag
		if ((ClickInv == "TapeGag") && ActorHasInventory("Rope") && !ActorHasInventory("TapeGag") && Common_PlayerNotRestrained && ((C005_GymClass_Jennifer_CurrentStage == 400) ||(C005_GymClass_Jennifer_CurrentStage == 410) || (C005_GymClass_Jennifer_CurrentStage == 420))) {
			OverridenIntroText = GetText("TapeGag");
			C005_GymClass_Jennifer_CurrentStage = 430;
			C005_GymClass_Jennifer_Ungag();
			ActorAddInventory("TapeGag");
			PlayerRemoveInventory("TapeGag", 1);
			CurrentTime = CurrentTime + 60000;
		}		
		
		// When the user wants to use the vibrating egg on Jennifer
		if ((ClickInv == "VibratingEgg") && !ActorHasInventory("VibratingEgg") && ActorHasInventory("Rope") && Common_PlayerNotRestrained) {		
			if (C005_GymClass_Jennifer_EggConfirm == false) {
				C005_GymClass_Jennifer_EggConfirm = true;
				OverridenIntroText = GetText("VibratingEggWarning");
			} else {
				ActorAddInventory("VibratingEgg");
				PlayerRemoveInventory("VibratingEgg", 1);
				ActorChangeAttitude(-1, 0);
				OverridenIntroText = GetText("VibratingEggInsert");
				C005_GymClass_Jennifer_EggInside = true;
			}
		}
		
	}
}

// Chapter 5 - Jennifer Start Practice
function C005_GymClass_Jennifer_StartPractice() {
	C005_GymClass_Jennifer_PracticeMode = true;
	SetScene(CurrentChapter, "GymFight");
}

// Chapter 5 - Jennifer Explain Mobile
function C005_GymClass_Jennifer_ExplainMobile() {
	if (IsMobile) 
		OverridenIntroText = GetText("ExplainMobile");
}

// Chapter 5 - Jennifer Get Rope
function C005_GymClass_Jennifer_GetRope() {
	PlayerAddInventory("Rope", 1);
	C005_GymClass_Jennifer_RopeGiven = true;
}

// Chapter 5 - Jennifer Start Fight
function C005_GymClass_Jennifer_StartFight() {
	C005_GymClass_Jennifer_PracticeMode = false;
	SetScene(CurrentChapter, "GymFight");
}

// Chapter 5 - Jennifer Start the winning fight
function C005_GymClass_Jennifer_StartWinFight(EasyMode) {
	C005_GymClass_Jennifer_EasyMode = EasyMode;
	SetScene(CurrentChapter, "WinFight");
}

// Chapter 5 - Jennifer Start the losing fight
function C005_GymClass_Jennifer_StartLoseFight(EasyMode) {
	C005_GymClass_Jennifer_EasyMode = EasyMode;
	SetScene(CurrentChapter, "LoseFight");
}

// Chapter 5 - Jennifer Egg Comment
function C005_GymClass_Jennifer_EggComment() {
	if (C005_GymClass_Jennifer_EggCommentDone == false) {
		C005_GymClass_Jennifer_EggCommentDone = true;
		ActorChangeAttitude(-1, 1);
	}
}

// Chapter 5 - Jennifer Adorable Comment
function C005_GymClass_Jennifer_AdorableComment() {
	if (C005_GymClass_Jennifer_AdorableCommentDone == false) {
		C005_GymClass_Jennifer_AdorableCommentDone = true;
		ActorChangeAttitude(1, 0);
	}
}

// Chapter 5 - Jennifer Tickle
function C005_GymClass_Jennifer_Tickle() {
	if (C005_GymClass_Jennifer_TickleDone == false) {
		C005_GymClass_Jennifer_TickleDone = true;
		ActorChangeAttitude(-1, 0);
	}
}

// Chapter 5 - Jennifer Spank
function C005_GymClass_Jennifer_Spank() {
	if (C005_GymClass_Jennifer_SpankDone == false) {
		C005_GymClass_Jennifer_SpankDone = true;
		ActorChangeAttitude(0, 1);
	}
}

// Chapter 5 - Jennifer - When the player tries Jennifer Crotch Rope
function C005_GymClass_Jennifer_CrotchRope() {
	if (C005_GymClass_Jennifer_CrotchRopeDone == false) {
		C005_GymClass_Jennifer_CrotchRopeDone = true;
		OverridenIntroText = GetText("CrotchRope");
		C005_GymClass_Jennifer_CurrentStage = parseInt(C005_GymClass_Jennifer_CurrentStage) + 40;
	}
}

// Chapter 5 - Jennifer Ungag
function C005_GymClass_Jennifer_Ungag() {
	ActorRemoveInventory("TapeGag");
	if (ActorHasInventory("BallGag")) {
		ActorRemoveInventory("BallGag");
		PlayerAddInventory("BallGag", 1);
	}
}

// Chapter 5 - Jennifer Release
function C005_GymClass_Jennifer_Release() {
	C005_GymClass_Jennifer_Ungag();
	ActorRemoveInventory("Rope");
	PlayerAddInventory("Rope", 1);
}

// Chapter 5 - Jennifer End Chapter
function C005_GymClass_Jennifer_EndChapter() {
	SetScene(CurrentChapter, "Outro");
}

// Chapter 5 - Tape Gag Player
function C005_GymClass_Jennifer_TapeGagPlayer() {
	PlayerRemoveInventory("TapeGag", 1);
	PlayerLockInventory("TapeGag");
	C005_GymClass_Jennifer_PlayerHasTapeGag = (PlayerHasInventory("TapeGag"));
	CurrentTime = CurrentTime + 50000;
}

// Chapter 5 - BallGag Player
function C005_GymClass_Jennifer_BallGagPlayer() {
	PlayerRemoveInventory("BallGag", 1);
	PlayerLockInventory("BallGag");
	C005_GymClass_Jennifer_PlayerHasBallGag = (PlayerHasInventory("BallGag"));
	CurrentTime = CurrentTime + 50000;
}

// Chapter 5 - Ungag Player (Jennifer only does if the player is likable and not submissive))
function C005_GymClass_Jennifer_UngagPlayer() {
	if (ActorGetValue(ActorLove) + ActorGetValue(ActorSubmission) >= 0) {
		OverridenIntroText = GetText("UngagPlayer");
		if (PlayerHasLockedInventory("BallGag")) {
			PlayerUnlockInventory("BallGag");
			PlayerAddInventory("BallGag", 1);
		}
		PlayerUnlockInventory("TapeGag");
		C005_GymClass_Jennifer_CurrentStage = 510;
	}
}

// Chapter 5 - Release Player
function C005_GymClass_Jennifer_ReleasePlayer() {
	CurrentTime = CurrentTime + 50000;
	if (PlayerHasLockedInventory("BallGag")) {
		PlayerUnlockInventory("BallGag");
		PlayerAddInventory("BallGag", 1);
	}
	PlayerUnlockInventory("TapeGag");
	PlayerUnlockInventory("Rope");
	PlayerClothes("Judo");
	C005_GymClass_Jennifer_CurrentStage = 600;
}

// Chapter 5 - Check to Release Player (Jennifer helps or put the player in trouble depending on the relationship)
function C005_GymClass_Jennifer_CheckReleasePlayer() {
	if (ActorGetValue(ActorLove) + ActorGetValue(ActorSubmission) >= 0) {
		OverridenIntroText = GetText("ReleasePlayer");
		C005_GymClass_Jennifer_ReleasePlayer();
	} else {
		if ((ActorGetValue(ActorLove) < 0) && (ActorGetValue(ActorSubmission) < 0)) {
			PlayerLockInventory("BallGag");
			C005_GymClass_Jennifer_CurrentStage = 520;
			OverridenIntroText = GetText("GagPlayer");
		}
	}
}

// Chapter 5 - Crotch Rope Player
function C005_GymClass_Jennifer_CrotchRopePlayer() {
	if ((C005_GymClass_Jennifer_CrotchRopePlayerDone == false) && PlayerHasLockedInventory("VibratingEgg")) {
		if (Common_PlayerGagged) OverridenIntroText = GetText("PlayerOrgasmGagged");
		else OverridenIntroText = GetText("PlayerOrgasm");
		ActorAddOrgasm();
		CurrentTime = CurrentTime + 50000;
		C005_GymClass_Jennifer_CrotchRopePlayerDone = true;
		C005_GymClass_Jennifer_CurrentStage = parseInt(C005_GymClass_Jennifer_CurrentStage) + 40;
	}
}

// Chapter 5 - Jennifer Cuddle
function C005_GymClass_Jennifer_Cuddle() {
	if (C005_GymClass_Jennifer_CuddleDone == false) {
		C005_GymClass_Jennifer_CuddleDone = true;
		ActorChangeAttitude(1, 0);
		GameLogAdd("Hug");
	}
}

// Chapter 5 - Jennifer Orgasm
function C005_GymClass_Jennifer_Orgasm() {
	ActorAddOrgasm();
}

// Chapter 5 - Jennifer fighting skill training, the player can learn the fighting skill if there's 30 or more left
function C005_GymClass_Jennifer_TrainFighting() {
	if (CurrentTime <= 11 * 60 * 60 * 1000) {
		OverridenIntroText = GetText("TrainFighting");
		PlayerAddSkill("Fighting", 1);
		GameLogAdd("Train");
		CurrentTime = CurrentTime + 0.5 * 60 * 60 * 1000;
		C005_GymClass_Jennifer_TrainingReady = false;
	} else OverridenIntroText = GetText("TrainFightingNoTime");
}

// Chapter 5 - The player can find a collar while searching
function C005_GymClass_Jennifer_Search() {
	if (C005_GymClass_Jennifer_CollarFound == false) {
		C005_GymClass_Jennifer_CollarFound = true;
		PlayerAddInventory("Collar", 1);
		OverridenIntroText = GetText("FindCollar");
	}
}
