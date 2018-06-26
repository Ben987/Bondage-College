var C008_DramaClass_AmandaIntro_CurrentStage = 0;
var C008_DramaClass_AmandaIntro_SarahMissing = false;
var C008_DramaClass_AmandaIntro_IsHeroine = false;
var C008_DramaClass_AmandaIntro_ChangingCount = 0;
var C008_DramaClass_AmandaIntro_IsBothFree = true;
var C008_DramaClass_AmandaIntro_IsRestrained = false;
var C008_DramaClass_AmandaIntro_IsGagged = false;
var C008_DramaClass_AmandaIntro_IsChaste = false;
var C008_DramaClass_AmandaIntro_IsPlayReady = false;
var C008_DramaClass_AmandaIntro_CanUntie = false;
var C008_DramaClass_AmandaIntro_CanUnstrap = false;
var C008_DramaClass_AmandaIntro_CanUngag = false;
var C008_DramaClass_AmandaIntro_MasturbateCount = 0;
var C008_DramaClass_AmandaIntro_OrgasmDone = false;
var C008_DramaClass_AmandaIntro_PlayerIsRoped = false;
var C008_DramaClass_AmandaIntro_PlayerIsCuffed = false;
var C008_DramaClass_AmandaIntro_PlayerInArmbinder = false;
var C008_DramaClass_AmandaIntro_PrettyCommentDone = false;
var C008_DramaClass_AmandaIntro_TickleDone = false;
var C008_DramaClass_AmandaIntro_SpankDone = false;
var C008_DramaClass_AmandaIntro_HugDone = false;
var C008_DramaClass_AmandaIntro_SlapDone = false;
var C008_DramaClass_AmandaIntro_PlayerBondageDone = false;
var C008_DramaClass_AmandaIntro_CropDone = false;
var C008_DramaClass_AmandaIntro_KeyTaken = false;
var C008_DramaClass_AmandaIntro_ReadyHug = false;
var C008_DramaClass_AmandaIntro_SarahReadyHug = false;
var C008_DramaClass_AmandaIntro_HugImage = "";

// Calculates the scene parameters
function C008_DramaClass_AmandaIntro_CalcParams() {
	C008_DramaClass_AmandaIntro_IsRestrained = ActorIsRestrained();
	C008_DramaClass_AmandaIntro_IsGagged = ActorIsGagged();
	C008_DramaClass_AmandaIntro_IsChaste = (ActorHasInventory("ChastityBelt"));
	C008_DramaClass_AmandaIntro_IsBothFree = (!C008_DramaClass_AmandaIntro_IsRestrained && !C008_DramaClass_AmandaIntro_IsGagged && !Common_PlayerRestrained && !Common_PlayerGagged);
	C008_DramaClass_AmandaIntro_IsPlayReady = (C008_DramaClass_AmandaIntro_IsBothFree && (C008_DramaClass_AmandaIntro_SarahMissing || (C008_DramaClass_SarahIntro_CurrentStage == 30)) && (Common_PlayerCostume != ""));
	C008_DramaClass_AmandaIntro_CanUntie = (ActorHasInventory("Rope") && !Common_PlayerRestrained);
	C008_DramaClass_AmandaIntro_CanUnstrap = (ActorHasInventory("Armbinder") && !Common_PlayerRestrained);
	C008_DramaClass_AmandaIntro_CanUngag = (C008_DramaClass_AmandaIntro_IsGagged && !Common_PlayerRestrained);
	C008_DramaClass_AmandaIntro_PlayerIsRoped = (PlayerHasLockedInventory("Rope"));
	C008_DramaClass_AmandaIntro_PlayerInArmbinder = (PlayerHasLockedInventory("Armbinder"));
	C008_DramaClass_AmandaIntro_PlayerIsCuffed = (PlayerHasLockedInventory("Cuffs"));
	C008_DramaClass_AmandaIntro_ReadyHug = (!C008_DramaClass_AmandaIntro_IsRestrained && !C008_DramaClass_AmandaIntro_IsGagged && !C008_DramaClass_AmandaIntro_IsChaste && Common_PlayerUnderwear && !Common_PlayerRestrained && !Common_PlayerGagged && !Common_PlayerChaste);
	C008_DramaClass_AmandaIntro_SarahReadyHug = ((C008_DramaClass_SarahIntro_CurrentStage == 20) && !ActorSpecificHasInventory("Sarah", "Cuffs") && !ActorSpecificHasInventory("Sarah", "Rope") && !ActorSpecificHasInventory("Sarah", "Armbinder") && !ActorSpecificHasInventory("Sarah", "BallGag") && !ActorSpecificHasInventory("Sarah", "TapeGag") && !ActorSpecificHasInventory("Sarah", "ClothGag") && !ActorSpecificHasInventory("Sarah", "ChastityBelt"));
}

// Chapter 8 - Amanda Intro Load
function C008_DramaClass_AmandaIntro_Load() {

	// Load the scene parameters
	ActorLoad("Amanda", "DressingRoom");
	LoadInteractions();
	C008_DramaClass_AmandaIntro_CalcParams();
	
	// Check if Sarah is missing for this scene and if Amanda is the Heroine
	C008_DramaClass_AmandaIntro_SarahMissing = GameLogQuery("C007_LunchBreak", "Sarah", "Stranded");
	C008_DramaClass_AmandaIntro_IsHeroine = (C008_DramaClass_JuliaIntro_AmandaRole == "Heroine");
	C008_DramaClass_AmandaIntro_TakeKey();

}

// Chapter 8 - Amanda Intro Run
function C008_DramaClass_AmandaIntro_Run() {
	BuildInteraction(C008_DramaClass_AmandaIntro_CurrentStage);
	if ((C008_DramaClass_AmandaIntro_CurrentStage != 20) && (C008_DramaClass_AmandaIntro_CurrentStage != 310)) DrawInteractionActor();
	if (C008_DramaClass_AmandaIntro_CurrentStage == 310) DrawImage(C008_DramaClass_AmandaIntro_HugImage, 600, 0);
}

// Chapter 8 - Amanda Intro Click
function C008_DramaClass_AmandaIntro_Click() {	

	// Regular and inventory interactions
	ClickInteraction(C008_DramaClass_AmandaIntro_CurrentStage);
	var ClickInv = GetClickedInventory();
	
	// Amanda can take the keys if the player is too submissive
	if (ClickInv == "CuffsKey")
		C008_DramaClass_AmandaIntro_TakeKey();

	// Amanda will not accept any item when she's dressed
	if (((ClickInv == "Rope") || (ClickInv == "Armbinder") || (ClickInv == "Cuffs") || (ClickInv == "TapeGag") || (ClickInv == "BallGag") || (ClickInv == "ClothGag") || (ClickInv == "ChastityBelt") || (ClickInv == "VibratingEgg")) && (C008_DramaClass_AmandaIntro_CurrentStage < 20))
		OverridenIntroText = GetText("StripBeforeFun");

	// Amanda will not accept any item when she's costumed
	if (((ClickInv == "Rope") || (ClickInv == "Armbinder") || (ClickInv == "Cuffs") || (ClickInv == "TapeGag") || (ClickInv == "BallGag") || (ClickInv == "ClothGag") || (ClickInv == "ChastityBelt") || (ClickInv == "VibratingEgg")) && (C008_DramaClass_AmandaIntro_CurrentStage == 50))
		OverridenIntroText = GetText("CostumeBlocksFun");
	
	// Amanda can be restrained on stage 40
	if ((C008_DramaClass_AmandaIntro_CurrentStage == 40) && (ClickInv != "") && (ClickInv != "Player") && !Common_PlayerRestrained) {
	
		// Amande doesn't like the crop but becomes more submissive
		if ((ClickInv == "Crop") && (!C008_DramaClass_AmandaIntro_CropDone)) {
			C008_DramaClass_AmandaIntro_CropDone = true;
			ActorChangeAttitude(-1, 1);
			return;
		}

		// Amande cannot be tied up if she's not at least a little submissive
		if ((ActorGetValue(ActorSubmission) < 2) && (ClickInv != "CuffsKey")) {
			OverridenIntroText = GetText("RefuseBondage");
			return;			
		}

		// Amanda can refuse the belt if she's not submissive enough or not tied up
		if ((ClickInv == "ChastityBelt") && !C008_DramaClass_AmandaIntro_IsRestrained && (ActorGetValue(ActorSubmission) < 10)) {
			OverridenIntroText = GetText("RefuseBelt");
			return;
		}
	
		// Apply the clicked restrain
		ActorApplyRestrain(ClickInv);
		C008_DramaClass_AmandaIntro_CalcParams();

	}

}

// Chapter 8 - Amanda can take the keys from the player
function C008_DramaClass_AmandaIntro_TakeKey() {
	if ((PlayerHasInventory("CuffsKey")) && (!C008_DramaClass_AmandaIntro_IsRestrained) && (ActorGetValue(ActorSubmission) < -2) && (C008_DramaClass_AmandaIntro_CurrentStage == 40)) {
		PlayerRemoveInventory("CuffsKey", 99);
		OverridenIntroText = GetText("TakeKey");
		LeaveIcon = "";
		C008_DramaClass_AmandaIntro_CurrentStage = 200;
		C008_DramaClass_AmandaIntro_KeyTaken = true;
	}
}

// Chapter 8 - Amanda Allow Leave
function C008_DramaClass_AmandaIntro_AllowLeave() {
	LeaveIcon = "Leave";
}

// Chapter 8 - Amanda can cuff the player
function C008_DramaClass_AmandaIntro_CuffPlayer() {
	PlayerRemoveInventory("Cuffs", 1);
	PlayerLockInventory("Cuffs");
	C008_DramaClass_AmandaIntro_CalcParams();
	LeaveIcon = "Leave";
}

// Chapter 8 - Amanda Strip
function C008_DramaClass_AmandaIntro_Strip() {
	ActorSetCloth("Underwear");
	CurrentTime = CurrentTime + 60000;
}

// Chapter 8 - Amanda No Leave
function C008_DramaClass_AmandaIntro_StripNoLeave() {
	LeaveIcon = "";
	ActorSetCloth("Underwear");
}

// Chapter 8 - Amanda Changing - She takes 3 tries to wear her armor
function C008_DramaClass_AmandaIntro_Changing() {
	C008_DramaClass_AmandaIntro_ChangingCount++;
	if (C008_DramaClass_AmandaIntro_ChangingCount >= 3) {
		OverridenIntroText = GetText("ChangeComplete");
		ActorChangeAttitude(1, 0);
		C008_DramaClass_AmandaIntro_CurrentStage = 50;
		C008_DramaClass_AmandaIntro_Costume();
		LeaveIcon = "Leave";
	}
}

// Chapter 8 - Amanda - If the player cheated and is submissive, she gets tied up
function C008_DramaClass_AmandaIntro_CheatedCover() {
	if (ActorGetValue(ActorSubmission) <= 0) {
		OverridenIntroText = GetText("CheaterPunishment");
		GameLogAdd("CheaterPunishment");
		CurrentTime = CurrentTime + 60000;
		PlayerClothes("Underwear");
		if (PlayerHasInventory("Rope")) PlayerRemoveInventory("Rope", 1);
		PlayerLockInventory("Rope");
		C008_DramaClass_AmandaIntro_CalcParams();
	}
	LeaveIcon = "Leave";
}

// Chapter 8 - Amanda - She likes the pretty comment
function C008_DramaClass_AmandaIntro_PrettyComment() {
	if (!C008_DramaClass_AmandaIntro_PrettyCommentDone) {
		C008_DramaClass_AmandaIntro_PrettyCommentDone = true;
		if (PlayerGetSkillLevel("Seduction") >= 1) ActorChangeAttitude(2, 0);
		else ActorChangeAttitude(1, 0);
	}
}

// Chapter 8 - Amanda - She likes being tickled
function C008_DramaClass_AmandaIntro_Tickle() {
	if (!C008_DramaClass_AmandaIntro_TickleDone) {
		C008_DramaClass_AmandaIntro_TickleDone = true;
		ActorChangeAttitude(1, 0);
	}
}

// Chapter 8 - Amanda - She doesn't like being spanked
function C008_DramaClass_AmandaIntro_Spank() {
	if (!C008_DramaClass_AmandaIntro_SpankDone) {
		C008_DramaClass_AmandaIntro_SpankDone = true;
		ActorChangeAttitude(-1, 0);
	}
}

// Chapter 8 - Amanda - She hates and fear being slapped
function C008_DramaClass_AmandaIntro_Slap() {
	if (!C008_DramaClass_AmandaIntro_SlapDone) {
		C008_DramaClass_AmandaIntro_SlapDone = true;
		ActorChangeAttitude(-2, 1);
	}
}

// Chapter 8 - Amanda Costume
function C008_DramaClass_AmandaIntro_Costume() {
	if (C008_DramaClass_AmandaIntro_IsChaste) OverridenIntroText = GetText("DressWithBelt");
	if (C008_DramaClass_AmandaIntro_IsHeroine) ActorSetCloth("Heroine");
	else ActorSetCloth("Villain");
}

// Chapter 8 - Amanda Untie
function C008_DramaClass_AmandaIntro_Untie() {
	ActorUntie();
	C008_DramaClass_AmandaIntro_CalcParams();
}

// Chapter 8 - Amanda Ungag
function C008_DramaClass_AmandaIntro_Ungag() {
	ActorUngag();
	C008_DramaClass_AmandaIntro_CalcParams();
}

// Chapter 8 - Amanda Masturbate - Only works if restrained and not chaste
function C008_DramaClass_AmandaIntro_Masturbate() {
	if (C008_DramaClass_AmandaIntro_IsRestrained) {
		if (!ActorIsChaste()) {
			
			// She can get an orgasm if she's bound and gagged, and was complimented, tickled or hugged
			C008_DramaClass_AmandaIntro_MasturbateCount++;
			if (C008_DramaClass_AmandaIntro_HugDone || C008_DramaClass_AmandaIntro_PrettyCommentDone || C008_DramaClass_AmandaIntro_TickleDone) {
				if ((C008_DramaClass_AmandaIntro_MasturbateCount >= 3) && !C008_DramaClass_AmandaIntro_OrgasmDone) {
					OverridenIntroText = GetText("MasturbateOrgasm");
					ActorAddOrgasm();
					ActorChangeAttitude(1, 0);
					C008_DramaClass_AmandaIntro_OrgasmDone = true;
					C008_DramaClass_AmandaIntro_CurrentStage = 100;
				} else OverridenIntroText = GetText("MasturbateGood");
			} else OverridenIntroText = GetText("Masturbate");
			
		} else OverridenIntroText = GetText("MasturbateBelt");
	}
}

// Chapter 8 - Amanda Random Bondage - Amanda can tie up the player if she's not too submissive
function C008_DramaClass_AmandaIntro_RandomBondage() {
	if (ActorGetValue(ActorSubmission) < 5) {
		if (Common_PlayerUnderwear || Common_PlayerNaked) {
			if (PlayerHasInventory("Cuffs") || PlayerHasInventory("Rope") || PlayerHasInventory("Armbinder") || PlayerHasInventory("BallGag") || PlayerHasInventory("TapeGag") || PlayerHasInventory("ClothGag")) {
				PlayerRandomBondage();
				C008_DramaClass_AmandaIntro_CalcParams();
				OverridenIntroText = GetText("PlayerRandomBondage");
				CurrentTime = CurrentTime + 60000;
				if (!C008_DramaClass_AmandaIntro_PlayerBondageDone) {
					C008_DramaClass_AmandaIntro_PlayerBondageDone = true;
					ActorChangeAttitude(0, -2);
				}				
			} else OverridenIntroText = GetText("NoBondageItem");
		} else OverridenIntroText = GetText("UndressBeforeBondage");
	}
}

// Chapter 8 - Amanda Test Untie Player (Amanda will do it if she likes the player or is submissive)
function C008_DramaClass_AmandaIntro_TestUntiePlayer() {
	if (!C008_DramaClass_AmandaIntro_IsRestrained) {
		if ((ActorGetValue(ActorLove)) > 0 || (ActorGetValue(ActorSubmission) >= 5)) {
			PlayerReleaseBondage();
			C008_DramaClass_AmandaIntro_CalcParams();
			if (!C008_DramaClass_AmandaIntro_IsGagged) OverridenIntroText = GetText("UntiePlayer");
			else OverridenIntroText = GetText("HelpWhileGagged");
			CurrentTime = CurrentTime + 60000;
		} else {
			if (C008_DramaClass_SarahIntro_IsGagged) OverridenIntroText = GetText("CannotFreeGagged");
		}
	} else OverridenIntroText = GetText("CannotFree");
}

// Chapter 8 - Amanda Test Unstrap Player (Amanda will do it if she likes the player or is submissive)
function C008_DramaClass_AmandaIntro_TestUnstrapPlayer() {
	if (!C008_DramaClass_AmandaIntro_IsRestrained) {
		if ((ActorGetValue(ActorLove)) > 0 || (ActorGetValue(ActorSubmission) >= 5)) {
			PlayerReleaseBondage();
			C008_DramaClass_AmandaIntro_CalcParams();
			if (!C008_DramaClass_AmandaIntro_IsGagged) OverridenIntroText = GetText("UnstrapPlayer");
			else OverridenIntroText = GetText("HelpWhileGagged");
			CurrentTime = CurrentTime + 60000;
		} else {
			if (C008_DramaClass_SarahIntro_IsGagged) OverridenIntroText = GetText("CannotFreeGagged");
		}
	} else OverridenIntroText = GetText("CannotFree");
}

// Chapter 8 - Amanda Test Untie Player (Amanda will do it if she likes the player or is submissive)
function C008_DramaClass_AmandaIntro_TestUncuffPlayer() {
	if (!C008_DramaClass_AmandaIntro_IsRestrained) {
		if (C008_DramaClass_AmandaIntro_KeyTaken) {
			if ((ActorGetValue(ActorLove)) > 0 || (ActorGetValue(ActorSubmission) >= 5)) {
				PlayerReleaseBondage();
				C008_DramaClass_AmandaIntro_CalcParams();
				if (!C008_DramaClass_AmandaIntro_IsGagged) OverridenIntroText = GetText("UncuffAccept");
				else OverridenIntroText = GetText("HelpWhileGagged");
				CurrentTime = CurrentTime + 60000;
			} else OverridenIntroText = GetText("UncuffRefuse");
		} else {
			if (C008_DramaClass_SarahIntro_IsGagged) OverridenIntroText = GetText("CannotFreeGagged");
		}
	} else OverridenIntroText = GetText("CannotFree");
}

// Chapter 8 - Amanda Start Hugs
function C008_DramaClass_AmandaIntro_StartHugs() {
	LeaveIcon = "";
}

// Chapter 8 - Amanda Hug
function C008_DramaClass_AmandaIntro_Hug(HugImage) {
	if (HugImage.slice(-3) == "Hug") GameLogAdd("Hug");
	if (HugImage.slice(-4) == "Kiss") GameLogAdd("Kiss");
	C008_DramaClass_AmandaIntro_HugImage = CurrentChapter + "/HugImages/" + HugImage + ".png";
	if (!C008_DramaClass_AmandaIntro_HugDone) {
		C008_DramaClass_AmandaIntro_HugDone = true;
		ActorChangeAttitude(1, 0);
	}
}

// Chapter 8 - Amanda Start Drama
function C008_DramaClass_AmandaIntro_StartDrama() {
	SetScene("C008_DramaClass", "Transition");
}