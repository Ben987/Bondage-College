var C004_ArtClass_Julia_CurrentStage = 0;
var C004_ArtClass_Julia_BigHugDone = false;
var C004_ArtClass_Julia_BigHugReady = false;
var C004_ArtClass_Julia_Sandro = true;
var C004_ArtClass_Julia_AllowUnderwear = false;
var C004_ArtClass_Julia_AllowNaked = false;
var C004_ArtClass_Julia_AllowShibari = false;
var C004_ArtClass_Julia_IsRestrained = false;
var C004_ArtClass_Julia_IsGagged = false;
var C004_ArtClass_Julia_TickleDone = false;
var C004_ArtClass_Julia_TightenDone = false;
var C004_ArtClass_Julia_CanBegForRelease = false;
var C004_ArtClass_Julia_EggConfirm = false;
var C004_ArtClass_Julia_EggInside = false;
var C004_ArtClass_Julia_WorkOfArtReady = true;
var C004_ArtClass_Julia_PaintAvail = true;
var C004_ArtClass_Julia_CanDoSelfBondage = true;
var C004_ArtClass_Julia_SelfBondageDone = false;

// New image depending on Julia's bondage
function C004_ArtClass_Julia_GetImage() {
	if (C004_ArtClass_Julia_CurrentStage != 60) OverridenIntroImage = "";
	if ((C004_ArtClass_ArtRoom_JuliaStage == 5) && (C004_ArtClass_Julia_CurrentStage >= 150)) OverridenIntroImage = "JuliaRope.jpg";
	if ((C004_ArtClass_ArtRoom_JuliaStage == 6) && (C004_ArtClass_Julia_CurrentStage >= 150)) OverridenIntroImage = "JuliaRopeBallGag.jpg";
	if ((C004_ArtClass_ArtRoom_JuliaStage == 7) && (C004_ArtClass_Julia_CurrentStage >= 150)) OverridenIntroImage = "JuliaRopeTapeGag.jpg";
}

// Chapter 4 - Julia Load
function C004_ArtClass_Julia_Load() {

	// Set the timer limits at 10:15
	StartTimer(10.25 * 60 * 60 * 1000, "C004_ArtClass", "Outro");

	// Load the scene parameters
	ActorLoad("Julia", "ArtRoom");
	LoadInteractions();
	C004_ArtClass_Julia_EggConfirm = false;

	// Julia progression
	if (C004_ArtClass_Julia_CurrentStage == 100) C004_ArtClass_Julia_CurrentStage = 110;
	if (C004_ArtClass_Julia_CurrentStage == 130) C004_ArtClass_Julia_CurrentStage = 140;
	if ((C004_ArtClass_Julia_CurrentStage == 160) || (C004_ArtClass_Julia_CurrentStage == 180)) C004_ArtClass_Julia_CurrentStage = 170;
	C004_ArtClass_Julia_Sandro = ((C004_ArtClass_ArtRoom_JuliaStage >= 1) && Common_PlayerNotGagged);	
	C004_ArtClass_Julia_AllowUnderwear = ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && Common_PlayerNotGagged && Common_PlayerClothed);
	C004_ArtClass_Julia_AllowNaked = ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && Common_PlayerNotGagged && Common_PlayerUnderwear);
	C004_ArtClass_Julia_GetImage();
	
	// When the talk is over, allow the player to leave
	if (C004_ArtClass_Julia_CurrentStage >= 60) LeaveIcon = "Leave";
	else LeaveIcon = "";	
	C004_ArtClass_Julia_BigHugReady = (!C004_ArtClass_Julia_BigHugDone && Common_PlayerNotGagged && (C004_ArtClass_Julia_CurrentStage >= 60));
	C004_ArtClass_Julia_AllowShibari = ((Common_BondageAllowed == false) && (C004_ArtClass_ArtRoom_JuliaStage >= 4));
	
	// If we allow the player to beg to be released or do self bondage
	C004_ArtClass_Julia_CanBegForRelease = ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && Common_PlayerRestrained && Common_PlayerGagged);
	C004_ArtClass_Julia_CanDoSelfBondage = ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && !Common_PlayerRestrained && !Common_PlayerGagged && Common_PlayerNaked && Common_BondageAllowed && PlayerHasInventory("Rope") && (PlayerGetSkillLevel("RopeMastery") >= 1));

	// A player with seduction has an extra option
	if (PlayerGetSkillLevel("Seduction") == 0) C004_ArtClass_Julia_WorkOfArtReady = false;
	
}

// Chapter 4 - Julia Run
function C004_ArtClass_Julia_Run() {
	BuildInteraction(C004_ArtClass_Julia_CurrentStage);
}

// Chapter 4 - Julia Click
function C004_ArtClass_Julia_Click() {	

	// Regular interactions
	ClickInteraction(C004_ArtClass_Julia_CurrentStage);
	var ClickInv = GetClickedInventory();
	
	// When the talk is over, allow the player to leave
	if (C004_ArtClass_Julia_CurrentStage >= 60) LeaveIcon = "Leave";

	// When the user wants to use any item and bondage isn't allowed
	if (!Common_BondageAllowed && ((ClickInv == "Rope") || (ClickInv == "BallGag") || (ClickInv == "TapeGag") || (ClickInv == "Crop") || (ClickInv == "Cuffs") || (ClickInv == "VibratingEgg")) && Common_PlayerNotRestrained)
		OverridenIntroText = GetText("NoBondage");

	// When the user wants to use the rope on Julia
	if (Common_BondageAllowed && (ClickInv == "Rope") && !ActorHasInventory("Rope") && Common_PlayerNotRestrained) {
	
		// It can work if Julia is submissive, else the player gets tied up
		if (ActorGetValue(ActorSubmission) > 0) {
			OverridenIntroText = GetText("RopeJulia");
			C004_ArtClass_Julia_CurrentStage = 170;
			C004_ArtClass_ArtRoom_JuliaStage = 5;
			C004_ArtClass_Julia_IsRestrained = true;
			ActorAddInventory("Rope");
		} else {
			if (Common_PlayerNaked) OverridenIntroText = GetText("RopePlayer");
			else OverridenIntroText = GetText("RopeStripPlayer");
			PlayerClothes("Naked");
			PlayerLockInventory("Rope");
			PlayerRemoveInventory("Rope", 1);
			C004_ArtClass_Julia_CanDoSelfBondage = false;
		}

		// Time and item are consumed
		PlayerRemoveInventory("Rope", 1);
		CurrentTime = CurrentTime + 60000;		
	}

	// When the user wants to use the BallGag
	if (Common_BondageAllowed && (ClickInv == "BallGag") && (C004_ArtClass_ArtRoom_JuliaStage >= 5) && !ActorHasInventory("BallGag") && Common_PlayerNotRestrained) {
		OverridenIntroText = GetText("BallGag");
		C004_ArtClass_Julia_CurrentStage = 170;
		C004_ArtClass_Julia_Ungag();
		C004_ArtClass_ArtRoom_JuliaStage = 6;
		ActorAddInventory("BallGag");
		PlayerRemoveInventory("BallGag", 1);
		C004_ArtClass_Julia_IsGagged = true;
		CurrentTime = CurrentTime + 60000;
	}

	// When the user wants to use the tape gag
	if (Common_BondageAllowed && (ClickInv == "TapeGag") && (C004_ArtClass_ArtRoom_JuliaStage >= 5) && !ActorHasInventory("TapeGag") && Common_PlayerNotRestrained) {
		OverridenIntroText = GetText("TapeGag");
		C004_ArtClass_Julia_CurrentStage = 170;
		C004_ArtClass_Julia_Ungag();
		C004_ArtClass_ArtRoom_JuliaStage = 7;
		ActorAddInventory("TapeGag");
		PlayerRemoveInventory("TapeGag", 1);
		C004_ArtClass_Julia_IsGagged = true;
		CurrentTime = CurrentTime + 60000;
	}
	
	// When the user wants to use the crop
	if (Common_BondageAllowed && (ClickInv == "Crop") && ActorHasInventory("Rope") && Common_PlayerNotRestrained) {
		OverridenIntroText = GetText("Crop");
		CurrentTime = CurrentTime + 60000;
	}

	// When the user wants to use the vibrating egg on Julia
	if (Common_BondageAllowed && (ClickInv == "VibratingEgg") && !ActorHasInventory("VibratingEgg") && ActorHasInventory("Rope") && Common_PlayerNotRestrained) {		
		if (C004_ArtClass_Julia_EggConfirm == false) {
			C004_ArtClass_Julia_EggConfirm = true;
			OverridenIntroText = GetText("VibratingEggWarning");
		} else {
			ActorAddInventory("VibratingEgg");
			PlayerRemoveInventory("VibratingEgg", 1);
			OverridenIntroText = GetText("VibratingEggInsert");
			C004_ArtClass_Julia_EggInside = true;
		}
	}
	
	// Get the correct image for Julia
	C004_ArtClass_Julia_GetImage();
	
}

// Chapter 4 - Julia Big Hug
function C004_ArtClass_Julia_BigHug() {
	if (C004_ArtClass_Julia_BigHugDone == false) {
		C004_ArtClass_Julia_BigHugDone = true;
		ActorChangeAttitude(1, 0);
		C004_ArtClass_Julia_BigHugReady = false;
		OverridenIntroImage = "JuliaHug.jpg";
		GameLogAdd("Hug");
	}
}

// Chapter 4 - Julia Remove Top
function C004_ArtClass_Julia_RemoveTop() {
	if (C004_ArtClass_ArtRoom_JuliaStage <= 1) 
		C004_ArtClass_ArtRoom_JuliaStage = 2;
}

// Chapter 4 - Julia Strip
function C004_ArtClass_Julia_Strip() {
	if (C004_ArtClass_ArtRoom_JuliaStage <= 2) 
		C004_ArtClass_ArtRoom_JuliaStage = 3;
}

// Chapter 4 - Julia Query New Model
function C004_ArtClass_Julia_QueryNewModel() {
	if (ActorGetValue(ActorSubmission) <= 0) {
		OverridenIntroText = GetText("NewModelAgree");
		ActorChangeAttitude(0, -1);
		C004_ArtClass_Julia_CurrentStage = 160;
		C004_ArtClass_ArtRoom_ExtraModel = "Player";
		PlayerClothes("Clothed");
	}
}

// Chapter 4 - Julia Recover all inventory from an actor (except the egg)
function C004_ArtClass_Julia_RecoverInventory(ActorToRecover) {
	CurrentActor = ActorToRecover;
	if (ActorHasInventory("BallGag")) { PlayerAddInventory("BallGag", 1); ActorRemoveInventory("BallGag"); }
	if (ActorHasInventory("Rope")) { PlayerAddInventory("Rope", 1); ActorRemoveInventory("Rope"); }
	ActorRemoveInventory("TapeGag");
}

// Chapter 4 - Julia Change Model
function C004_ArtClass_Julia_NewModel(ModelName) {

	// Recover the player ropes if needed
	PlayerReleaseBondage();

	// Reset Sarah model
	C004_ArtClass_ArtRoom_SarahStage = 0;
	if (C004_ArtClass_Sarah_CurrentStage > 130) C004_ArtClass_Sarah_CurrentStage = 130;
	C004_ArtClass_Julia_RecoverInventory("Sarah");

	// Reset Jennifer model
	C004_ArtClass_ArtRoom_JenniferStage = 0;
	if (C004_ArtClass_Jennifer_CurrentStage > 100) C004_ArtClass_Jennifer_CurrentStage = 100;
	C004_ArtClass_Julia_RecoverInventory("Jennifer");

	// Set the new model
	CurrentActor = "Julia";
	C004_ArtClass_ArtRoom_ExtraModel = ModelName;
	PlayerClothes("Clothed");
	if (C004_ArtClass_Julia_IsGagged) OverridenIntroText = GetText("NewModelGagged");

}

// Chapter 4 - Julia Player Remove Outfit
function C004_ArtClass_Julia_PlayerRemoveOutfit() {
	PlayerClothes("Underwear");
	if (C004_ArtClass_Julia_IsGagged) OverridenIntroText = GetText("PlayerUndressGagged");
}

// Chapter 4 - Julia Player Strip
function C004_ArtClass_Julia_PlayerStrip() {
	PlayerClothes("Naked");
	if (C004_ArtClass_Julia_IsGagged) OverridenIntroText = GetText("PlayerStripGagged");
}

// Chapter 4 - Julia Shibari Start
function C004_ArtClass_Julia_ShibariStart() {
	Common_BondageAllowed = true;
	C004_ArtClass_Julia_AllowShibari = false;
	PlayerAddInventory("Rope", 2);
}

// Chapter 4 - Julia Ungag
function C004_ArtClass_Julia_Ungag() {
	if (ActorHasInventory("BallGag")) {
		PlayerAddInventory("BallGag", 1);
		ActorRemoveInventory("BallGag");
	}
	ActorRemoveInventory("TapeGag");
	C004_ArtClass_Julia_IsGagged = false;
	C004_ArtClass_ArtRoom_JuliaStage = 5;
}

// Chapter 4 - Julia Try Ungag
function C004_ArtClass_Julia_TryUngag() {
	if (Common_PlayerNotRestrained) C004_ArtClass_Julia_Ungag();
	else OverridenIntroText = GetText("FailUngag");
}

// Chapter 4 - Julia Release
function C004_ArtClass_Julia_Release() {
	if (Common_PlayerNotRestrained) {
		C004_ArtClass_Julia_IsRestrained = false;
		PlayerAddInventory("Rope", 1);
		ActorRemoveInventory("Rope");
		C004_ArtClass_Julia_Ungag();
		C004_ArtClass_ArtRoom_JuliaStage = 4;
	} else {
		OverridenIntroText = GetText("FailUntie");
	}
}

// Chapter 4 - Julia Tighten
function C004_ArtClass_Julia_Tighten() {
	if (Common_PlayerNotRestrained) {
		if (C004_ArtClass_Julia_TightenDone == false) {
			if (C004_ArtClass_Julia_IsGagged) OverridenIntroText = GetText("TightenGagged");
			else OverridenIntroText = GetText("Tighten");
			ActorChangeAttitude(0, 1);
			C004_ArtClass_Julia_TightenDone = true;
		}
	} else {
		OverridenIntroText = GetText("FailTighten");
	}
}

// Chapter 4 - Julia Tickle
function C004_ArtClass_Julia_Tickle() {
	if (C004_ArtClass_Julia_TickleDone == false) {
		if (Common_PlayerNotRestrained) OverridenIntroText = GetText("Tickle");
		else OverridenIntroText = GetText("TickleRestrained");
		ActorChangeAttitude(1, 0);
		C004_ArtClass_Julia_TickleDone = true;
	}	
}

// Chapter 4 - Julia Change Model
function C004_ArtClass_Julia_ChangeModel() {
	if (C004_ArtClass_Julia_IsGagged) OverridenIntroText = GetText("AskNewModelGagged");
}

// Chapter 4 - Julia Beg For Release
function C004_ArtClass_Julia_BegForRelease() {
	if (!C004_ArtClass_Julia_IsRestrained) {
		if (ActorGetValue(ActorLove) >= 3) {
			OverridenIntroText = GetText("PlayerUngag");
			PlayerUngag();
			C004_ArtClass_Julia_CanBegForRelease = false;
			CurrentTime = CurrentTime + 60000;
		} else {
			OverridenIntroText = GetText("PlayerStayGagged");
		}		
	} else {
		OverridenIntroText = GetText("JuliaRestrainedPlayerGagged");
	}	
}

// Chapter 4 - Julia Gagged Speech
function C004_ArtClass_Julia_GaggedSpeach() {
	if ((C004_ArtClass_ArtRoom_JuliaStage == 6) || (C004_ArtClass_ArtRoom_JuliaStage == 7))
		OverridenIntroText = GetText("GaggedSpeach");
}

// Chapter 4 - Julia Work of Art comment
function C004_ArtClass_Julia_WorkOfArt() {
	C004_ArtClass_Julia_WorkOfArtReady = false;
	ActorChangeAttitude(1, 0);
}

// Chapter 4 - Julia Paint, can only be done if there's 30 minutes left for the class
function C004_ArtClass_Julia_Paint() {
	if (C004_ArtClass_ArtRoom_ExtraModel != "Player") {
		if (CurrentTime <= 9.75 * 60 * 60 * 1000) {
			C004_ArtClass_Sarah_PaintAvail = false;
			C004_ArtClass_Jennifer_PaintAvail = false;
			C004_ArtClass_Julia_PaintAvail = false;
			ActorChangeAttitude(2, 0);
			GameLogAdd("Paint");
			CurrentTime = CurrentTime + 0.5 * 60 * 60 * 1000;
			if (PlayerGetSkillLevel("Arts") >= 1) {
				ActorSpecificChangeAttitude("Julia", PlayerGetSkillLevel("Arts"), 0);
				ActorSpecificChangeAttitude("Sarah", PlayerGetSkillLevel("Arts"), 0);
				ActorSpecificChangeAttitude("Jennifer", PlayerGetSkillLevel("Arts"), 0);
			}
			PlayerAddSkill("Arts", 1);
		} else OverridenIntroText = GetText("NoTimeToPaint");
	} else OverridenIntroText = GetText("CantPaintIfModel");
}

// Chapter 4 - Julia, the player can do "Self-Shibari" with the rope mastery skill
function C004_ArtClass_Julia_SelfBondage() {
	PlayerLockInventory("Rope");
	PlayerRemoveInventory("Rope", 1);
	C004_ArtClass_Julia_CanDoSelfBondage = false;
	CurrentTime = CurrentTime + 50000;
	if (!C004_ArtClass_Julia_SelfBondageDone) {
		C004_ArtClass_Julia_SelfBondageDone = true;
		ActorChangeAttitude(1, 1);
		GameLogAdd("SelfBondage");
	}
}

// Chapter 4 - Julia Hug
function C004_ArtClass_Julia_Hug() {
	GameLogAdd("Hug");
}