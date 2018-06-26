var C008_DramaClass_SarahIntro_CurrentStage = 0;
var C008_DramaClass_SarahIntro_AmandaMissing = false;
var C008_DramaClass_SarahIntro_IsDamsel = false;
var C008_DramaClass_SarahIntro_IsBothFree = true;
var C008_DramaClass_SarahIntro_IsRestrained = false;
var C008_DramaClass_SarahIntro_IsGagged = false;
var C008_DramaClass_SarahIntro_IsChaste = false;
var C008_DramaClass_SarahIntro_IsPlayReady = false;
var C008_DramaClass_SarahIntro_CanUntie = false;
var C008_DramaClass_SarahIntro_CanUnstrap = false;
var C008_DramaClass_SarahIntro_CanUngag = false;
var C008_DramaClass_SarahIntro_SlapDone = false;
var C008_DramaClass_SarahIntro_MasturbateCount = 0;
var C008_DramaClass_SarahIntro_ViolenceDone = false;
var C008_DramaClass_SarahIntro_OrgasmDone = false;
var C008_DramaClass_SarahIntro_TiedUpCommentDone = false;
var C008_DramaClass_SarahIntro_PlayerBondageDone = false;
var C008_DramaClass_SarahIntro_PlayerIsRoped = false;
var C008_DramaClass_SarahIntro_PlayerInArmbinder = false;
var C008_DramaClass_SarahIntro_PlayerIsCuffed = false;
var C008_DramaClass_SarahIntro_ReadyHug = false;
var C008_DramaClass_SarahIntro_AmandaReadyHug = false;
var C008_DramaClass_SarahIntro_HugDone = false;
var C008_DramaClass_SarahIntro_HugImage = "";

// Calculates the scene parameters
function C008_DramaClass_SarahIntro_CalcParams() {
	C008_DramaClass_SarahIntro_IsRestrained = ActorIsRestrained();
	C008_DramaClass_SarahIntro_IsGagged = ActorIsGagged();
	C008_DramaClass_SarahIntro_IsChaste = (ActorHasInventory("ChastityBelt"));
	C008_DramaClass_SarahIntro_IsBothFree = (!C008_DramaClass_SarahIntro_IsRestrained && !C008_DramaClass_SarahIntro_IsGagged && !Common_PlayerRestrained && !Common_PlayerGagged);
	C008_DramaClass_SarahIntro_IsPlayReady = (C008_DramaClass_SarahIntro_IsBothFree && (C008_DramaClass_SarahIntro_AmandaMissing || (C008_DramaClass_AmandaIntro_CurrentStage == 50)) && (Common_PlayerCostume != ""));
	C008_DramaClass_SarahIntro_CanUntie = (ActorHasInventory("Rope") && !Common_PlayerRestrained);
	C008_DramaClass_SarahIntro_CanUnstrap = (ActorHasInventory("Armbinder") && !Common_PlayerRestrained);
	C008_DramaClass_SarahIntro_CanUngag = (C008_DramaClass_SarahIntro_IsGagged && !Common_PlayerRestrained);
	C008_DramaClass_SarahIntro_PlayerIsRoped = (PlayerHasLockedInventory("Rope"));
	C008_DramaClass_SarahIntro_PlayerInArmbinder = (PlayerHasLockedInventory("Armbinder"));
	C008_DramaClass_SarahIntro_PlayerIsCuffed = (PlayerHasLockedInventory("Cuffs"));
	C008_DramaClass_SarahIntro_ReadyHug = (!C008_DramaClass_SarahIntro_IsRestrained && !C008_DramaClass_SarahIntro_IsGagged && !C008_DramaClass_SarahIntro_IsChaste && Common_PlayerUnderwear && !Common_PlayerRestrained && !Common_PlayerGagged && !Common_PlayerChaste);
	C008_DramaClass_SarahIntro_AmandaReadyHug = ((C008_DramaClass_AmandaIntro_CurrentStage == 40) && !ActorSpecificHasInventory("Amanda", "Cuffs") && !ActorSpecificHasInventory("Amanda", "Rope") && !ActorSpecificHasInventory("Amanda", "Armbinder") && !ActorSpecificHasInventory("Amanda", "BallGag") && !ActorSpecificHasInventory("Amanda", "TapeGag") && !ActorSpecificHasInventory("Amanda", "ClothGag") && !ActorSpecificHasInventory("Amanda", "ChastityBelt"));
}

// Chapter 8 - Sarah Intro Load
function C008_DramaClass_SarahIntro_Load() {

	// Load the scene parameters
	ActorLoad("Sarah", "DressingRoom");
	LoadInteractions();
	C008_DramaClass_SarahIntro_CalcParams();
	
	// Check if Amanda is missing for this scene and if Sarah is the damsel
	C008_DramaClass_SarahIntro_AmandaMissing = GameLogQuery("C007_LunchBreak", "Amanda", "Stranded");
	C008_DramaClass_SarahIntro_IsDamsel = (C008_DramaClass_JuliaIntro_SarahRole == "Damsel");
	
	// Sarah can ungag the player if needed at first
	if ((C008_DramaClass_SarahIntro_CurrentStage == 0) && (Common_PlayerGagged))
		C008_DramaClass_SarahIntro_CurrentStage = 100;

}

// Chapter 8 - Sarah Intro Run
function C008_DramaClass_SarahIntro_Run() {
	BuildInteraction(C008_DramaClass_SarahIntro_CurrentStage);
	if (C008_DramaClass_SarahIntro_CurrentStage != 310) DrawInteractionActor();
	else DrawImage(C008_DramaClass_SarahIntro_HugImage, 600, 0);
}

// Chapter 8 - Sarah Intro Click
function C008_DramaClass_SarahIntro_Click() {	

	// Regular and inventory interactions
	ClickInteraction(C008_DramaClass_SarahIntro_CurrentStage);
	var ClickInv = GetClickedInventory();
	
	// The player can whip her to help her strip
	if ((ClickInv == "Crop") && (C008_DramaClass_SarahIntro_CurrentStage == 10) && !Common_PlayerRestrained) {
		OverridenIntroText = GetText("CropToStrip");
		C008_DramaClass_SarahIntro_CurrentStage = 20;
		ActorChangeAttitude(0, 1);
		C008_DramaClass_SarahIntro_Strip();
	}

	// The player can whip her to help her find her costume
	if ((ClickInv == "Crop") && (C008_DramaClass_SarahIntro_CurrentStage == 0) && !Common_PlayerRestrained) {
		OverridenIntroText = GetText("CropToSearch");
		C008_DramaClass_SarahIntro_CurrentStage = 10;
		ActorChangeAttitude(0, 1);
		CurrentTime = CurrentTime + 60000;
	}
	
	// Sarah can tease the player if she wants to use a toy on stage 0 or 10
	if (((ClickInv == "Rope") || (ClickInv == "Armbinder") || (ClickInv == "Cuffs") || (ClickInv == "TapeGag") || (ClickInv == "BallGag") || (ClickInv == "ClothGag") || (ClickInv == "ChastityBelt") || (ClickInv == "VibratingEgg")) && (C008_DramaClass_SarahIntro_CurrentStage < 20))
		OverridenIntroText = GetText("CostumeBeforeFun");

	// Sarah refuses but tease the player on stage 30
	if (((ClickInv == "Rope") || (ClickInv == "Armbinder") || (ClickInv == "Cuffs") || (ClickInv == "TapeGag") || (ClickInv == "BallGag") || (ClickInv == "ClothGag") || (ClickInv == "ChastityBelt") || (ClickInv == "VibratingEgg")) && (C008_DramaClass_SarahIntro_CurrentStage == 30))
		OverridenIntroText = GetText("CostumeBlocksFun");
	
	// Sarah can be restrained on stage 20
	if ((C008_DramaClass_SarahIntro_CurrentStage == 20) && (ClickInv != "")) {
		
		// Sarah can refuse the belt if she's not submissive enough or not tied up
		if ((ClickInv == "ChastityBelt") && !C008_DramaClass_SarahIntro_IsRestrained && (ActorGetValue(ActorSubmission) < 10)) {
			OverridenIntroText = GetText("RefuseBelt");
			CurrentTime = CurrentTime + 60000;
			return;
		}
		
		// Apply the clicked restrain
		ActorApplyRestrain(ClickInv);
		C008_DramaClass_SarahIntro_CalcParams();
		if (ClickInv == "Crop") C008_DramaClass_SarahIntro_ViolenceDone = true;

	}

}

// Chapter 8 - Sarah Check Ungag - Sarah will ungag the player if she's submissive or loves her
function C008_DramaClass_SarahIntro_CheckUngag() {	
	if ((ActorGetValue(ActorLove)) > 0 || (ActorGetValue(ActorSubmission) > 0)) {
		PlayerUngag();
		OverridenIntroText = GetText("UngagPlayer");
	}
}

// Chapter 8 - Sarah Random Bondage - Sarah can tie up the player if she's not too submissive
function C008_DramaClass_SarahIntro_RandomBondage() {
	if (ActorGetValue(ActorSubmission) < 5) {
		if (Common_PlayerUnderwear || Common_PlayerNaked) {
			if (PlayerHasInventory("Cuffs") || PlayerHasInventory("Rope") || PlayerHasInventory("Armbinder") || PlayerHasInventory("BallGag") || PlayerHasInventory("TapeGag") || PlayerHasInventory("ClothGag")) {
				PlayerRandomBondage();
				C008_DramaClass_SarahIntro_CalcParams();
				OverridenIntroText = GetText("PlayerRandomBondage");
				CurrentTime = CurrentTime + 60000;
				if (!C008_DramaClass_SarahIntro_PlayerBondageDone) {
					C008_DramaClass_SarahIntro_PlayerBondageDone = true;
					ActorChangeAttitude(0, -2);
				}
			} else OverridenIntroText = GetText("NoBondageItem");				
		} else OverridenIntroText = GetText("UndressBeforeBondage");
	}
}

// Chapter 8 - Sarah Strip
function C008_DramaClass_SarahIntro_Strip() {
	ActorSetCloth("Underwear");
	CurrentTime = CurrentTime + 60000;
}

// Chapter 8 - Sarah Costume
function C008_DramaClass_SarahIntro_Costume() {
	if (C008_DramaClass_SarahIntro_IsChaste) OverridenIntroText = GetText("DressWithBelt");
	if (C008_DramaClass_SarahIntro_IsDamsel) ActorSetCloth("Damsel");
	else ActorSetCloth("Heroine");
}

// Chapter 8 - Sarah likes being slapped
function C008_DramaClass_SarahIntro_Slap() {
	if (!C008_DramaClass_SarahIntro_SlapDone) {
		ActorChangeAttitude(1, 0);
		C008_DramaClass_SarahIntro_SlapDone = true;
		C008_DramaClass_SarahIntro_ViolenceDone = true;
	}
}

// Chapter 8 - Sarah becomes more submissive if she's offered to be tied up
function C008_DramaClass_SarahIntro_TiedUpComment() {
	if (!C008_DramaClass_SarahIntro_TiedUpCommentDone) {
		C008_DramaClass_SarahIntro_TiedUpCommentDone = true;
		ActorChangeAttitude(0, 1);
	}
}

// Chapter 8 - Sarah spank
function C008_DramaClass_SarahIntro_Spank() {
	C008_DramaClass_SarahIntro_ViolenceDone = true;
}

// Chapter 8 - Sarah Untie
function C008_DramaClass_SarahIntro_Untie() {
	ActorUntie();
	C008_DramaClass_SarahIntro_CalcParams();
}

// Chapter 8 - Sarah Ungag
function C008_DramaClass_SarahIntro_Ungag() {
	ActorUngag();
	C008_DramaClass_SarahIntro_CalcParams();
}

// Chapter 8 - Sarah Test Untie Player (Sarah will do it if she likes the player or is submissive)
function C008_DramaClass_SarahIntro_TestUntiePlayer() {
	if (!C008_DramaClass_SarahIntro_IsRestrained) {
		if ((ActorGetValue(ActorLove)) > 0 || (ActorGetValue(ActorSubmission) >= 5)) {
			PlayerReleaseBondage();
			C008_DramaClass_SarahIntro_CalcParams();			
			if (!C008_DramaClass_SarahIntro_IsGagged) OverridenIntroText = GetText("UntiePlayer");
			else OverridenIntroText = GetText("HelpWhileGagged");
			CurrentTime = CurrentTime + 60000;
		} else {
			if (C008_DramaClass_SarahIntro_IsGagged) OverridenIntroText = GetText("CannotFreeGagged");
		}
	} else OverridenIntroText = GetText("CannotFree");
}

// Chapter 8 - Sarah Test Unstrap Player (Sarah will do it if she likes the player or is submissive)
function C008_DramaClass_SarahIntro_TestUnstrapPlayer() {
	if (!C008_DramaClass_SarahIntro_IsRestrained) {
		if ((ActorGetValue(ActorLove)) > 0 || (ActorGetValue(ActorSubmission) >= 5)) {
			PlayerReleaseBondage();
			C008_DramaClass_SarahIntro_CalcParams();			
			if (!C008_DramaClass_SarahIntro_IsGagged) OverridenIntroText = GetText("UnstrapPlayer");
			else OverridenIntroText = GetText("HelpWhileGagged");
			CurrentTime = CurrentTime + 60000;
		} else {
			if (C008_DramaClass_SarahIntro_IsGagged) OverridenIntroText = GetText("CannotFreeGagged");
		}
	} else OverridenIntroText = GetText("CannotFree");
}

// Chapter 8 - Sarah Test Uncuff Player (Sarah never has cuff keys but can interact)
function C008_DramaClass_SarahIntro_TestUncuffPlayer() {
	if (!C008_DramaClass_SarahIntro_IsRestrained) {
		if (C008_DramaClass_SarahIntro_IsGagged) OverridenIntroText = GetText("CannotFreeGagged");
	} else OverridenIntroText = GetText("CannotFree");
}

// Chapter 8 - Sarah Masturbate - Only works if restrained and not chaste
function C008_DramaClass_SarahIntro_Masturbate() {
	if (C008_DramaClass_SarahIntro_IsRestrained) {
		if (!ActorIsChaste()) {
			
			// She can get an orgasm with the vibrating egg or if she was hit
			C008_DramaClass_SarahIntro_MasturbateCount++;
			if (C008_DramaClass_SarahIntro_ViolenceDone || ActorHasInventory("VibratingEgg")) {				
				if ((C008_DramaClass_SarahIntro_MasturbateCount >= 3) && !C008_DramaClass_SarahIntro_OrgasmDone) {
					OverridenIntroText = GetText("MasturbateOrgasm");
					ActorAddOrgasm();
					ActorChangeAttitude(1, 0);
					C008_DramaClass_SarahIntro_OrgasmDone = true;
					C008_DramaClass_SarahIntro_CurrentStage = 200;
				} else OverridenIntroText = GetText("MasturbateGood");
			} else OverridenIntroText = GetText("Masturbate");
			
		} else OverridenIntroText = GetText("MasturbateBelt");
	}
}

// Chapter 8 - Sarah Start Hugs
function C008_DramaClass_SarahIntro_StartHugs() {
	LeaveIcon = "";
}

// Chapter 8 - Sarah Hug
function C008_DramaClass_SarahIntro_Hug(HugImage) {
	if (HugImage.slice(-3) == "Hug") GameLogAdd("Hug");
	if (HugImage.slice(-4) == "Kiss") GameLogAdd("Kiss");
	C008_DramaClass_SarahIntro_HugImage = CurrentChapter + "/HugImages/" + HugImage + ".png";
	C008_DramaClass_SarahIntro_HugDone = true;
}

// Chapter 8 - Sarah Allow Leave
function C008_DramaClass_SarahIntro_AllowLeave() {
	LeaveIcon = "Leave";
}

// Chapter 8 - Sarah Start Drama
function C008_DramaClass_SarahIntro_StartDrama() {
	SetScene("C008_DramaClass", "Transition");
}