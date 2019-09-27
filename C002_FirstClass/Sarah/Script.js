var C002_FirstClass_Sarah_CurrentStage = 0;
var C002_FirstClass_Sarah_BackupStage = 0;
var C002_FirstClass_Sarah_SubdueSuccess = false;
var C002_FirstClass_Sarah_SubdueNotDone = true;
var C002_FirstClass_Sarah_CropDone = false;
var C002_FirstClass_Sarah_BondageHugReady = false;
var C002_FirstClass_Sarah_BondageHugDone = false;
var C002_FirstClass_Sarah_BondageDuoDone = false;

// Calculate the current Sarah stage
function C002_FirstClass_Sarah_CalcStage() {

	// Keep the backup stage to resume conversation
	var EntryStage = C002_FirstClass_Sarah_CurrentStage;
	if (C002_FirstClass_Sarah_CurrentStage < 100) C002_FirstClass_Sarah_BackupStage = C002_FirstClass_Sarah_CurrentStage;
	
	// Calculate the correct stage (100 comes back to the previous conversation)
	if (C002_FirstClass_Sarah_CurrentStage <= 150) {
		C002_FirstClass_Sarah_CurrentStage = C002_FirstClass_Classroom_CalcStage();
		if (C002_FirstClass_Sarah_CurrentStage == 100) C002_FirstClass_Sarah_CurrentStage = C002_FirstClass_Sarah_BackupStage;
	}

	// If the stage changed, we scrap the Overridden image
	if (EntryStage != C002_FirstClass_Sarah_CurrentStage) OverridenIntroImage = "";
	
	// The bondage hug is only available if Amanda and Sarah are in ropes
	C002_FirstClass_Sarah_BondageHugReady = ((C002_FirstClass_Sarah_CurrentStage > 100) && (C002_FirstClass_Sarah_CurrentStage < 200) && (Common_PlayerNotRestrained) && (Common_PlayerNotGagged) && (C002_FirstClass_Classroom_MildredSubdueSuccess) && (ActorSpecificHasInventory("Amanda", "Rope")) && (ActorSpecificHasInventory("Sarah", "Rope")));

	// In bondage hug, the image can vary
	if ((C002_FirstClass_Sarah_CurrentStage == 160) || (C002_FirstClass_Sarah_CurrentStage == 170)) {
		OverridenIntroImage = "";
		if ((ActorSpecificHasInventory("Amanda", "BallGag")) && (ActorSpecificHasInventory("Sarah", "BallGag"))) OverridenIntroImage = "Hug_Amanda_Rope_BallGag_Sarah_Rope_BallGag.jpg";
		if ((ActorSpecificHasInventory("Amanda", "BallGag")) && (!ActorSpecificHasInventory("Sarah", "BallGag"))) OverridenIntroImage = "Hug_Amanda_Rope_BallGag_Sarah_Rope.jpg";
		if ((!ActorSpecificHasInventory("Amanda", "BallGag")) && (ActorSpecificHasInventory("Sarah", "BallGag"))) OverridenIntroImage = "Hug_Amanda_Rope_Sarah_Rope_BallGag.jpg";
		if ((!ActorSpecificHasInventory("Amanda", "BallGag")) && (!ActorSpecificHasInventory("Sarah", "BallGag"))) OverridenIntroImage = "Hug_Amanda_Rope_Sarah_Rope.jpg";
	}
	
}

// Chapter 2 - Sarah Load
function C002_FirstClass_Sarah_Load() {

	// Load the scene parameters	
	ActorLoad("Sarah", "Classroom");
	LoadInteractions();

	// Jumps to the correct stage
	C002_FirstClass_Sarah_SubdueSuccess = ((C002_FirstClass_Classroom_MildredSubdueSuccess) && !C002_FirstClass_Classroom_MildredSubdueFailed && Common_PlayerNotGagged);
	C002_FirstClass_Sarah_SubdueNotDone = (!C002_FirstClass_Sarah_SubdueSuccess && Common_PlayerNotGagged);
	if ((C002_FirstClass_Classroom_MildredSubdueFailed) && (C002_FirstClass_Sarah_CurrentStage == 0)) C002_FirstClass_Sarah_CurrentStage = 200;
	if ((C002_FirstClass_Classroom_MildredSubdueFailed) && !ActorHasInventory("BallGag") && (C002_FirstClass_Sarah_CurrentStage > 0) && (C002_FirstClass_Sarah_CurrentStage < 100)) C002_FirstClass_Sarah_CurrentStage = 240;
	if ((C002_FirstClass_Classroom_MildredSubdueFailed) && ActorHasInventory("BallGag") && (C002_FirstClass_Sarah_CurrentStage > 0) && (C002_FirstClass_Sarah_CurrentStage < 100)) C002_FirstClass_Sarah_CurrentStage = 260;

	// The bondage hug is only available if Amanda and Sarah are in ropes
	if (C002_FirstClass_Sarah_CurrentStage == 160) { C002_FirstClass_Sarah_CurrentStage = 140; C002_FirstClass_Sarah_CalcStage(); }
	if (C002_FirstClass_Sarah_CurrentStage == 170) { C002_FirstClass_Sarah_CurrentStage = 150; C002_FirstClass_Sarah_CalcStage(); }
	C002_FirstClass_Sarah_BondageHugReady = ((C002_FirstClass_Sarah_CurrentStage > 100) && (C002_FirstClass_Sarah_CurrentStage < 200) && (Common_PlayerNotRestrained) && (Common_PlayerNotGagged) && (C002_FirstClass_Classroom_MildredSubdueSuccess) && (ActorSpecificHasInventory("Amanda", "Rope")) && (ActorSpecificHasInventory("Sarah", "Rope")));

}

// Chapter 2 - Sarah Run
function C002_FirstClass_Sarah_Run() {
	BuildInteraction(C002_FirstClass_Sarah_CurrentStage);
}

// Chapter 2 - Sarah Click
function C002_FirstClass_Sarah_Click() {	

	// Regular interactions
	ClickInteraction(C002_FirstClass_Sarah_CurrentStage);
	var ClickedInv = GetClickedInventory();

	// If the player wants to gag Sarah
	if ((ClickedInv == "BallGag") && (ActorHasInventory("BallGag") == false) && (C002_FirstClass_Classroom_MildredSubdueSuccess) && (Common_PlayerNotRestrained)) {
		OverridenIntroText = GetText("BallGag");
		PlayerRemoveInventory("BallGag", 1);
		ActorAddInventory("BallGag");
		if (C002_FirstClass_Sarah_CurrentStage == 160) C002_FirstClass_Sarah_CurrentStage = 170;
		CurrentTime = CurrentTime + 60000;
	}

	// If the player wants to cuff Sarah
	if ((ClickedInv == "Cuffs") && (ActorHasInventory("Cuffs") == false) && (C002_FirstClass_Classroom_MildredSubdueSuccess) && (Common_PlayerNotRestrained)) {
		if (ActorHasInventory("Rope")) { OverridenIntroText = GetText("CuffsReplaceRope"); PlayerAddInventory("Rope", 1); ActorRemoveInventory("Rope"); }
		else OverridenIntroText = GetText("Cuffs");
		PlayerRemoveInventory("Cuffs", 1);
		ActorAddInventory("Cuffs");
		CurrentTime = CurrentTime + 60000;
	}

	// If the player wants to uncuff Sarah
	if ((ClickedInv == "CuffsKey") && (ActorHasInventory("Cuffs") == true) && (C002_FirstClass_Classroom_MildredSubdueSuccess) && (Common_PlayerNotRestrained)) {
		OverridenIntroText = GetText("Unlock");
		PlayerAddInventory("Cuffs", 1);
		ActorRemoveInventory("Cuffs");
		CurrentTime = CurrentTime + 60000;
	}

	// If the player wants to rope Sarah
	if ((ClickedInv == "Rope") && (ActorHasInventory("Rope") == false) && (C002_FirstClass_Classroom_MildredSubdueSuccess) && (Common_PlayerNotRestrained)) {
		if (ActorHasInventory("Cuffs")) { OverridenIntroText = GetText("RopeReplaceCuffs"); PlayerAddInventory("Cuffs", 1); ActorRemoveInventory("Cuffs"); }
		else OverridenIntroText = GetText("Rope");
		PlayerRemoveInventory("Rope", 1);
		ActorAddInventory("Rope");
		CurrentTime = CurrentTime + 60000;
	}

	// If the player wants to crop Sarah
	if ((ClickedInv == "Crop") && (C002_FirstClass_Classroom_MildredSubdueSuccess) && (Common_PlayerNotRestrained)) {
		if (ActorHasInventory("BallGag")) OverridenIntroText = GetText("CropGagged");
		else OverridenIntroText = GetText("Crop");
		if (C002_FirstClass_Sarah_CropDone == false) { C002_FirstClass_Sarah_CropDone = true; ActorChangeAttitude(1, 1); }
		CurrentTime = CurrentTime + 60000;
	}

	// Recalculate the stage
	C002_FirstClass_Sarah_CalcStage();
	
}

// Chapter 2 - Sarah Ungag
function C002_FirstClass_Sarah_Ungag() {
	PlayerAddInventory("BallGag", 1);
	ActorRemoveInventory("BallGag");
}

// Chapter 2 - Sarah Untie
function C002_FirstClass_Sarah_Untie() {
	PlayerAddInventory("Rope", 1);
	ActorRemoveInventory("Rope");
}

// Chapter 2 - Sarah Agrees to Help
function C002_FirstClass_Sarah_AgreeHelp() {
	C002_FirstClass_Classroom_SarahAgree = true;
}

// Chapter 2 - Sarah annoys Mildred
function C002_FirstClass_Sarah_AnnoyMildred() {
	ActorAddInventory("Cuffs");
	ActorAddInventory("BallGag");
}

// Chapter 2 - Sarah Bondage Hug 
function C002_FirstClass_Sarah_BondageHug() {
	C002_FirstClass_Sarah_CalcStage();
	if (C002_FirstClass_Sarah_BondageHugDone == false) { C002_FirstClass_Sarah_BondageHugDone = true; ActorChangeAttitude(1, 0); }
}

// Chapter 2 - Sarah Separate from Amanda hug
function C002_FirstClass_Sarah_Separate() {
	OverridenIntroImage = "";
}

// Chapter 2 - Sarah Bondage Duo Comment
function C002_FirstClass_Sarah_BondageDuo() {
	if (C002_FirstClass_Sarah_BondageDuoDone == false) { C002_FirstClass_Sarah_BondageDuoDone = true; ActorChangeAttitude(0, 1); }
}

// Chapter 2 - Sarah kisses Amanda
function C002_FirstClass_Sarah_KissAmanda() {
	GameLogAdd("KissAmanda");
}