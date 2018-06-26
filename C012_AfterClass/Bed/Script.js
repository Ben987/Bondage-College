var C012_AfterClass_Bed_CurrentStage = 0;
var C012_AfterClass_Bed_PleasureUp = 0;
var C012_AfterClass_Bed_PleasureDown = 0;
var C012_AfterClass_Bed_NextPossibleOrgasmTime = 0;
var C012_AfterClass_Bed_MasturbationRequired = 0;

// Chapter 12 After Class - Bed Load
function C012_AfterClass_Bed_Load() {
	LeaveIcon = "Leave";
	LeaveScreen = "Dorm";
	LoadInteractions();
	C012_AfterClass_Bed_CurrentStage = 0;
	C012_AfterClass_Bed_PleasureUp = 0;
	C012_AfterClass_Bed_PleasureDown = 0;
	if (PlayerHasLockedInventory("VibratingEgg")) C012_AfterClass_Bed_MasturbationRequired = 2;
	else C012_AfterClass_Bed_MasturbationRequired = 3;
}

// Chapter 12 After Class - Bed Run
function C012_AfterClass_Bed_Run() {
	BuildInteraction(C012_AfterClass_Bed_CurrentStage);
	if (C012_AfterClass_Bed_CurrentStage == 100) { Common_PlayerPose = "LieMasturbate"; DrawTransparentPlayerImage(600, 0, 1); Common_PlayerPose = ""; }
	if (C012_AfterClass_Bed_CurrentStage == 110) { Common_PlayerPose = "LieMasturbateOrgasm"; DrawTransparentPlayerImage(600, 0, 1); Common_PlayerPose = ""; }
	if (C012_AfterClass_Bed_CurrentStage == 120) { Common_PlayerPose = "LieMasturbateOrgasm"; DrawTransparentPlayerImage(600, 0, 1); Common_PlayerPose = ""; }
}

// Chapter 12 After Class - Bed Click
function C012_AfterClass_Bed_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Bed_CurrentStage);

}

// Chapter 12 After Class - Fall asleep and ends the chapter
function C012_AfterClass_Bed_EndChapter() {	
	SetScene(CurrentChapter, "Outro");
}

// Chapter 12 After Class - Gets in bed to masturbate
function C012_AfterClass_Bed_StartMasturbate() {
	if (!Common_PlayerRestrained) {
		if (C012_AfterClass_Dorm_Guest.length == 0) {
			if (Common_PlayerNaked) OverridenIntroText = GetText("LayNaked");
			else OverridenIntroText = GetText("StripNaked");
			PlayerClothes("Naked");
			C012_AfterClass_Bed_CurrentStage = 100;
			CurrentTime = CurrentTime + 50000;			
		} else OverridenIntroText = GetText("CannotMasturbateWithGuest");
	}
}

// Chapter 12 After Class - Masturbate the upper body (cannot lead to orgasm but helps)
function C012_AfterClass_Bed_MasturbateUp() {
	CurrentTime = CurrentTime + 50000;		
	if (CurrentTime >= C012_AfterClass_Bed_NextPossibleOrgasmTime) C012_AfterClass_Bed_PleasureUp++;
	else OverridenIntroText = GetText("NotInTheMood");
}

// Chapter 12 After Class - Masturbate the lower body
function C012_AfterClass_Bed_MasturbateDown() {
	CurrentTime = CurrentTime + 50000;
	if (CurrentTime >= C012_AfterClass_Bed_NextPossibleOrgasmTime) {
		if (Common_PlayerChaste) OverridenIntroText = GetText("Chaste");
		else {
			C012_AfterClass_Bed_PleasureDown++;
			if ((C012_AfterClass_Bed_PleasureUp >= C012_AfterClass_Bed_MasturbationRequired) && (C012_AfterClass_Bed_PleasureDown >= C012_AfterClass_Bed_MasturbationRequired)) {
				C012_AfterClass_Bed_CurrentStage = 110;
				OverridenIntroText = GetText("GettingClose");
			}
		}
	}
	else OverridenIntroText = GetText("NotInTheMood");
}

// Chapter 12 After Class - When the player stops masturbating
function C012_AfterClass_Bed_StopMasturbate() {
	C012_AfterClass_Bed_PleasureUp = 0;
	C012_AfterClass_Bed_PleasureDown = 0;
}

// Chapter 12 After Class - Player climax, it will be possible to masturbate again in 1 hour or 1/2 hour with the egg
function C012_AfterClass_Bed_Climax() {
	CurrentTime = CurrentTime + 50000;
	C012_AfterClass_Bed_PleasureUp = 0;
	C012_AfterClass_Bed_PleasureDown = 0;
	if (PlayerHasLockedInventory("VibratingEgg")) C012_AfterClass_Bed_NextPossibleOrgasmTime = CurrentTime + 1800000;
	else C012_AfterClass_Bed_NextPossibleOrgasmTime = CurrentTime + 3600000;
}
