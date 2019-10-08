var C002_FirstClass_Amanda_CurrentStage = 0;
var C002_FirstClass_Amanda_BowRemarkReady = true;
var C002_FirstClass_Amanda_SubdueRemarkReady = false;
var C002_FirstClass_Amanda_CropDone = false;
var C002_FirstClass_Amanda_BondageHugReady = false;
var C002_FirstClass_Amanda_BondageHugDone = false;
var C002_FirstClass_Amanda_BondageBefore = false;
var C002_FirstClass_Amanda_TickleDone = false;
var C002_FirstClass_Amanda_KissSarahDone = false;

// Chapter 2 - Amanda Load
function C002_FirstClass_Amanda_Load() {

	// Load the scene parameters	
	ActorLoad("Amanda", "Classroom");
	LoadInteractions();
	if (C002_FirstClass_Classroom_MildredSubdueSuccess) C002_FirstClass_Amanda_BowRemarkReady = false;
	C002_FirstClass_Amanda_BondageBefore = (ActorGetValue(ActorBondageCount) > 0);

	// Stage jumps depending on actor bondage if subdue was tried
	if ((C002_FirstClass_Classroom_MildredSubdueFailed) || (C002_FirstClass_Classroom_MildredSubdueSuccess)) {
		if ((parseInt(C002_FirstClass_Amanda_CurrentStage) < 100) && (C002_FirstClass_Classroom_MildredSubdueSuccess)) C002_FirstClass_Amanda_SubdueRemarkReady = true;
		C002_FirstClass_Amanda_CurrentStage = C002_FirstClass_Classroom_CalcStage();
	}
	
	// The remark cannot be done if the player is gagged, also calculate the bondage hug
	if (Common_PlayerGagged) C002_FirstClass_Amanda_SubdueRemarkReady = false;
	C002_FirstClass_Amanda_BondageHugReady = ((C002_FirstClass_Amanda_CurrentStage > 100) && (Common_PlayerNotRestrained) && (Common_PlayerNotGagged) && (C002_FirstClass_Classroom_MildredSubdueSuccess) && (ActorSpecificHasInventory("Amanda", "Rope")) && (ActorSpecificHasInventory("Sarah", "Rope")));

}

// Chapter 2 - Amanda Run
function C002_FirstClass_Amanda_Run() {
	
	// Regular interactions
	BuildInteraction(C002_FirstClass_Amanda_CurrentStage);
	
	// Bondage hug
	if ((C002_FirstClass_Amanda_CurrentStage == 160) || (C002_FirstClass_Amanda_CurrentStage == 170)) {
		OverridenIntroImage = "";
		if ((ActorSpecificHasInventory("Amanda", "BallGag")) && (ActorSpecificHasInventory("Sarah", "BallGag"))) OverridenIntroImage = "Hug_Amanda_Rope_BallGag_Sarah_Rope_BallGag.jpg";
		if ((ActorSpecificHasInventory("Amanda", "BallGag")) && (!ActorSpecificHasInventory("Sarah", "BallGag"))) OverridenIntroImage = "Hug_Amanda_Rope_BallGag_Sarah_Rope.jpg";
		if ((!ActorSpecificHasInventory("Amanda", "BallGag")) && (ActorSpecificHasInventory("Sarah", "BallGag"))) OverridenIntroImage = "Hug_Amanda_Rope_Sarah_Rope_BallGag.jpg";
		if ((!ActorSpecificHasInventory("Amanda", "BallGag")) && (!ActorSpecificHasInventory("Sarah", "BallGag"))) OverridenIntroImage = "Hug_Amanda_Rope_Sarah_Rope.jpg";		
	}
	
}

// Chapter 2 - Amanda Click
function C002_FirstClass_Amanda_Click() {	

	// Keep the stage on entry
	var EntryStage = C002_FirstClass_Amanda_CurrentStage;

	// Regular interactions
	ClickInteraction(C002_FirstClass_Amanda_CurrentStage);
	var ClickedInv = GetClickedInventory();
	
	// If the player wants to gag Amanda
	if ((C002_FirstClass_Amanda_CurrentStage >= 100) && (ClickedInv == "BallGag") && (ActorHasInventory("BallGag") == false) && (Common_PlayerNotRestrained)) {
		if ((ActorGetValue(ActorSubmission) >= 2) || (ActorHasInventory("Rope")) || (ActorHasInventory("Cuffs"))) {
			if (ActorGetValue(ActorSubmission) >= 4) OverridenIntroText = GetText("BallGagWilling");
			else OverridenIntroText = GetText("BallGagReluctant");
			PlayerRemoveInventory("BallGag", 1);
			ActorAddInventory("BallGag");
			if (C002_FirstClass_Amanda_CurrentStage == 160) C002_FirstClass_Amanda_CurrentStage = 170;
			else C002_FirstClass_Amanda_CurrentStage = C002_FirstClass_Classroom_CalcStage();
		} else OverridenIntroText = GetText("BallGagRefuse");
		CurrentTime = CurrentTime + 60000;
	}

	// If the player wants to cuff Amanda
	if ((C002_FirstClass_Amanda_CurrentStage >= 100) && (ClickedInv == "Cuffs") && (ActorHasInventory("Cuffs") == false) && (Common_PlayerNotRestrained)) {
		if ((ActorGetValue(ActorSubmission) >= 2) || (ActorHasInventory("Rope"))) {
			if (ActorHasInventory("Rope")) { OverridenIntroText = GetText("CuffsReplaceRope"); PlayerAddInventory("Rope", 1); ActorRemoveInventory("Rope"); }
			else if (ActorGetValue(ActorSubmission) >= 4) OverridenIntroText = GetText("CuffsWilling");
			else OverridenIntroText = GetText("CuffsReluctant");
			PlayerRemoveInventory("Cuffs", 1);
			ActorAddInventory("Cuffs");
			C002_FirstClass_Amanda_CurrentStage = C002_FirstClass_Classroom_CalcStage();
		} else OverridenIntroText = GetText("CuffsRefuse");
		CurrentTime = CurrentTime + 60000;
	}

	// If the player wants to uncuff Amanda
	if ((C002_FirstClass_Amanda_CurrentStage >= 100) && (ClickedInv == "CuffsKey") && (ActorHasInventory("Cuffs") == true) && (Common_PlayerNotRestrained)) {
		OverridenIntroText = GetText("CuffsUnlock");
		PlayerAddInventory("Cuffs", 1);
		ActorRemoveInventory("Cuffs");
		C002_FirstClass_Amanda_CurrentStage = C002_FirstClass_Classroom_CalcStage();
		CurrentTime = CurrentTime + 60000;
	}

	// If the player wants to rope Amanda
	if ((C002_FirstClass_Amanda_CurrentStage >= 100) && (ClickedInv == "Rope") && (ActorHasInventory("Rope") == false) && (Common_PlayerNotRestrained)) {
		if ((ActorGetValue(ActorSubmission) >= 2) || (ActorHasInventory("Cuffs"))) {
			if (ActorHasInventory("Cuffs")) { OverridenIntroText = GetText("RopeReplaceCuffs"); PlayerAddInventory("Cuffs", 1); ActorRemoveInventory("Cuffs"); }
			else if (ActorGetValue(ActorSubmission) >= 4) OverridenIntroText = GetText("RopeWilling");
			else OverridenIntroText = GetText("RopeReluctant");
			PlayerRemoveInventory("Rope", 1);
			ActorAddInventory("Rope");
			C002_FirstClass_Amanda_CurrentStage = C002_FirstClass_Classroom_CalcStage();
		} else OverridenIntroText = GetText("RopeRefuse");
		CurrentTime = CurrentTime + 60000;
	}

	// If the player wants to crop Amanda
	if ((C002_FirstClass_Amanda_CurrentStage >= 100) && (ClickedInv == "Crop") && (Common_PlayerNotRestrained)) {
		if (ActorHasInventory("BallGag")) OverridenIntroText = GetText("CropGagged");
		else OverridenIntroText = GetText("Crop");
		if (C002_FirstClass_Amanda_CropDone == false) { C002_FirstClass_Amanda_CropDone = true; ActorChangeAttitude(-2, 0); }
		CurrentTime = CurrentTime + 60000;
	}
	
	// If the stage changed, we remove the Overridden image, also check for the bondage hug
	if (EntryStage != C002_FirstClass_Amanda_CurrentStage) OverridenIntroImage = "";
	C002_FirstClass_Amanda_BondageHugReady = ((C002_FirstClass_Amanda_CurrentStage > 100) && (Common_PlayerNotRestrained) && (Common_PlayerNotGagged) && (C002_FirstClass_Classroom_MildredSubdueSuccess) && (ActorSpecificHasInventory("Amanda", "Rope")) && (ActorSpecificHasInventory("Sarah", "Rope")));

}

// Chapter 2 - Amanda Ungag
function C002_FirstClass_Amanda_Ungag() {
	PlayerAddInventory("BallGag", 1);
	ActorRemoveInventory("BallGag");
}

// Chapter 2 - Amanda Untie
function C002_FirstClass_Amanda_Untie() {
	PlayerAddInventory("Rope", 1);
	ActorRemoveInventory("Rope");
}

// Chapter 2 - Amanda Tickle
function C002_FirstClass_Amanda_Tickle() {
	if (C002_FirstClass_Amanda_TickleDone == false) {
		C002_FirstClass_Amanda_TickleDone = true;
		ActorChangeAttitude(1, 0);
	}
}

// Chapter 2 - Amanda Bow Remark
function C002_FirstClass_Amanda_BowRemark() {
	C002_FirstClass_Amanda_BowRemarkReady = false;
}

// Chapter 2 - Amanda Subdue Remark
function C002_FirstClass_Amanda_SubdueRemark() {
	C002_FirstClass_Amanda_SubdueRemarkReady = false;
}

// Chapter 2 - Amanda Agrees to Help
function C002_FirstClass_Amanda_AgreeHelp() {
	C002_FirstClass_Classroom_AmandaAgree = true;
}

// Chapter 2 - Amanda Bondage Hug 
function C002_FirstClass_Amanda_BondageHug() {
	if (C002_FirstClass_Amanda_BondageHugDone == false) { 
		C002_FirstClass_Amanda_BondageHugDone = true;
		ActorChangeAttitude(1, 0);
	}
}

// Chapter 2 - Amanda Separate from Sarah hug
function C002_FirstClass_Amanda_Separate() {
	OverridenIntroImage = "";
}

// Chapter 2 - Amanda Kiss Sarah
function C002_FirstClass_Amanda_KissSarah() {
	if (C002_FirstClass_Amanda_KissSarahDone == false) {
		C002_FirstClass_Amanda_KissSarahDone = true;
		ActorChangeAttitude(1, 0);
		PlayerAddSkill("Seduction", 1);
		GameLogAdd("KissSarah");
	}
}