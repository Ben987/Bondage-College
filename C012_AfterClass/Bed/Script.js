var C012_AfterClass_Bed_CurrentStage = 0;
var C012_AfterClass_Bed_PleasureUp = 0;
var C012_AfterClass_Bed_PleasureDown = 0;
var C012_AfterClass_Bed_MasturbationRequired = 0;
var C012_AfterClass_Bed_MistressApproveMasturbate = "";
var C012_AfterClass_Bed_Partner = "";
var C012_AfterClass_Bed_ShowCollar = false;
var C012_AfterClass_Bed_SexCount = 0;
var C012_AfterClass_Bed_SexPleasurePlayer = 0;
var C012_AfterClass_Bed_SexPleasurePartner = 0;
var C012_AfterClass_Bed_CanDateSarah = false;
var C012_AfterClass_Bed_AmandaOwner = false;
var C012_AfterClass_Bed_SexSoft = false;
var C012_AfterClass_Bed_SexWild = false;

// Chapter 12 After Class - Prepares the bed image that will be rendered for sex scenes
function C012_AfterClass_Bed_PrepareImage(PartnerOrgasm, PlayerOrgasm, WorkAnim) {
	var ImageName = "Sex" + CurrentActor;
	if (C012_AfterClass_Bed_ShowCollar) {
		if (ActorHasInventory("Collar")) ImageName = ImageName + "Collar";
		else ImageName = ImageName + "NoCollar";
	}
	if (PartnerOrgasm) ImageName = ImageName + "Orgasm";
	ImageName = ImageName + "Player";
	if (C012_AfterClass_Bed_ShowCollar) {
		if (PlayerHasLockedInventory("Collar") && (CurrentActor != "Amanda")) ImageName = ImageName + "Collar";
		else ImageName = ImageName + "NoCollar";
	}
	if (PlayerOrgasm) ImageName = ImageName + "Orgasm";
	if (WorkAnim && !PlayerOrgasm && !PartnerOrgasm) ImageName = ImageName + "Work";
	OverridenIntroImage = ImageName + ".jpg";
}

// Chapter 12 After Class - Bed Load
function C012_AfterClass_Bed_Load() {

	// If the player is alone in bed
	LoadInteractions();

	// If Amanda and Sarah are in bed
	if (GameLogQuery(CurrentChapter, "Player", "AmandaAndSarahInBed")) {

		// Interrupts the lovers
		ActorLoad("Sarah", "Dorm");
		C012_AfterClass_Bed_AmandaOwner = (Common_PlayerOwner == "Amanda");
		if (ActorSpecificHasInventory("Amanda", "ChastityBelt") || ActorSpecificHasInventory("Sarah", "ChastityBelt")) C012_AfterClass_Bed_CurrentStage = 810;
		else C012_AfterClass_Bed_CurrentStage = 800;
		if (ActorSpecificHasInventory("Amanda", "ChastityBelt")) OverridenIntroImage = "AmandaChastityBeltSarahBed.jpg";
		else OverridenIntroImage = "AmandaSarahBed.jpg";
	
	} else {

		// If there's no partner in bed
		if (C012_AfterClass_Bed_Partner == "") {
			
			// Starts the masturbation mini game
			LeaveIcon = "Leave";
			LeaveScreen = "Dorm";
			C012_AfterClass_Bed_CurrentStage = 0;
			C012_AfterClass_Bed_PleasureUp = 0;
			C012_AfterClass_Bed_PleasureDown = 0;
			C012_AfterClass_Bed_MistressApproveMasturbate = "";
			if (PlayerHasLockedInventory("VibratingEgg")) C012_AfterClass_Bed_MasturbationRequired = 2;
			else C012_AfterClass_Bed_MasturbationRequired = 3;
			
		} else {
			
			// With a partner, they can make love, some girls are a little harder to please
			C012_AfterClass_Bed_CanDateSarah = ((Common_PlayerLover == "") && !GameLogQuery(CurrentChapter, "Amanda", "DatingSarah"));
			ActorLoad(C012_AfterClass_Bed_Partner, "Dorm");
			if (C012_AfterClass_Bed_Partner == "Sidney") C012_AfterClass_Bed_CurrentStage = 200;
			if (C012_AfterClass_Bed_Partner == "Amanda") C012_AfterClass_Bed_CurrentStage = 300;
			if (C012_AfterClass_Bed_Partner == "Sarah") C012_AfterClass_Bed_CurrentStage = 400;
			if (C012_AfterClass_Bed_Partner == "Jennifer") C012_AfterClass_Bed_CurrentStage = 500;
			C012_AfterClass_Bed_ShowCollar = (C012_AfterClass_Bed_Partner == "Sidney");
			C012_AfterClass_Bed_PrepareImage(false, false);
			C012_AfterClass_Bed_SexSoft = false;
			C012_AfterClass_Bed_SexWild = false;
			C012_AfterClass_Bed_SexCount = 0;
			C012_AfterClass_Bed_SexPleasurePartner = ActorHasInventory("VibratingEgg") ? 3 : 0;
			C012_AfterClass_Bed_SexPleasurePlayer = PlayerHasLockedInventory("VibratingEgg") ? 3 : 0;
			if (CurrentActor == "Amanda") C012_AfterClass_Bed_SexPleasurePartner = C012_AfterClass_Bed_SexPleasurePartner - 1;
			if (CurrentActor == "Sarah") C012_AfterClass_Bed_SexPleasurePartner = C012_AfterClass_Bed_SexPleasurePartner + 2;		
			if (CurrentActor == "Sidney") C012_AfterClass_Bed_SexPleasurePartner = C012_AfterClass_Bed_SexPleasurePartner + 1;
			if (CurrentActor == "Jennifer") C012_AfterClass_Bed_SexPleasurePartner = C012_AfterClass_Bed_SexPleasurePartner - 2;
			LeaveIcon = "";

		}
		
	}
	
}

// Chapter 12 After Class - Bed Run
function C012_AfterClass_Bed_Run() {
	BuildInteraction(C012_AfterClass_Bed_CurrentStage);
	if (C012_AfterClass_Bed_CurrentStage == 100) { Common_PlayerPose = "LieMasturbate"; DrawTransparentPlayerImage(600, 0, 1); Common_PlayerPose = ""; }
	if (C012_AfterClass_Bed_CurrentStage == 110) { Common_PlayerPose = "LieMasturbateOrgasm"; DrawTransparentPlayerImage(600, 0, 1); Common_PlayerPose = ""; }
	if (C012_AfterClass_Bed_CurrentStage == 120) { Common_PlayerPose = "LieMasturbateOrgasm"; DrawTransparentPlayerImage(600, 0, 1); Common_PlayerPose = ""; }
	if ((C012_AfterClass_Bed_CurrentStage == 900) && (CurrentActor != "")) DrawActor(CurrentActor, 600, 0, 1);
}

// Chapter 12 After Class - Bed Click
function C012_AfterClass_Bed_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Bed_CurrentStage);

}

// Chapter 12 After Class - Fall asleep and ends the chapter
function C012_AfterClass_Bed_EndChapter(OutroType) {
	C012_AfterClass_Outro_Type = OutroType;
	SetScene(CurrentChapter, "Outro");
}

// Chapter 12 After Class - Checks if there's no guest that's not related to the player (love or BDSM)
function C012_AfterClass_Bed_AllRelatedGuest() {
	
	// Loops in all guests to find one that's not related
	for (var G = 0; G < C012_AfterClass_Dorm_Guest.length; G++) {
		ActorLoad(C012_AfterClass_Dorm_Guest[G], "Dorm");
		if (!Common_ActorIsLover && !Common_ActorIsOwner && !Common_ActorIsOwned) {
			CurrentActor = "";		
			return false;			
		}	
	}
	
	// If the player Mistress is around, she might punish her for masturbating or changing clothes
	for (var G = 0; G < C012_AfterClass_Dorm_Guest.length; G++) {
		if (Common_ActorIsOwner && (CurrentActor == Common_PlayerOwner)) {
			
			// If the player strips without being allowed, she gets punished
			if (!Common_PlayerNaked && GameLogQuery(CurrentChapter, "", "EventBlockChanging")) {
				CurrentTime = CurrentTime + 50000;
				if (Common_PlayerOwner == "Sidney") C012_AfterClass_Sidney_CurrentStage = 3800;
				if (Common_PlayerOwner == "Amanda") C012_AfterClass_Amanda_CurrentStage = 3800;
				if (Common_PlayerOwner == "Jennifer") C012_AfterClass_Jennifer_CurrentStage = 3800;
				SetScene(CurrentChapter, Common_PlayerOwner);
				ActorSetPose("Angry");
				LeaveIcon = "";
				return false;
			} else {
				
				// Hints the player if she will get punished or not
				if (EventRandomChance("Hate")) C012_AfterClass_Bed_MistressApproveMasturbate = "NO";
				else C012_AfterClass_Bed_MistressApproveMasturbate = "YES";

			}

		}
	}
	
	// No guest found, we allow the player to masturbate
	CurrentActor = "";
	return true;

}

// Chapter 12 After Class - Gets in bed to masturbate
function C012_AfterClass_Bed_StartMasturbate() {
	if (!Common_PlayerRestrained) {
		if (C012_AfterClass_Bed_AllRelatedGuest()) {
			if (Common_PlayerNaked) OverridenIntroText = GetText("LayNaked");
			else OverridenIntroText = GetText("StripNaked");
			if (C012_AfterClass_Bed_MistressApproveMasturbate == "YES") OverridenIntroText = GetText("LayMistressApprove");
			if (C012_AfterClass_Bed_MistressApproveMasturbate == "NO") OverridenIntroText = GetText("LayMistressDisapprove");
			PlayerClothes("Naked");
			C012_AfterClass_Bed_CurrentStage = 100;
			CurrentTime = CurrentTime + 50000;			
		} else if (CurrentActor == "") OverridenIntroText = GetText("CannotMasturbateWithGuest");
	}
}

// Chapter 12 After Class - Checks if the Mistress will punish the player for masturbating
function C012_AfterClass_Bed_CheckMistress() {
	if (C012_AfterClass_Bed_MistressApproveMasturbate == "NO") {
		CurrentTime = CurrentTime + 50000;
		if (Common_PlayerOwner == "Sidney") C012_AfterClass_Sidney_CurrentStage = 3810;
		if (Common_PlayerOwner == "Amanda") C012_AfterClass_Amanda_CurrentStage = 3810;
		if (Common_PlayerOwner == "Jennifer") C012_AfterClass_Jennifer_CurrentStage = 3810;
		SetScene(CurrentChapter, Common_PlayerOwner);
		ActorSetPose("Angry");
		LeaveIcon = "";
		return false;
	}
}


// Chapter 12 After Class - Masturbate the upper body (cannot lead to orgasm but helps)
function C012_AfterClass_Bed_MasturbateUp() {
	CurrentTime = CurrentTime + 50000;
	if (!GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm")) C012_AfterClass_Bed_PleasureUp++;
	else OverridenIntroText = GetText("NotInTheMood");
	C012_AfterClass_Bed_CheckMistress();
}

// Chapter 12 After Class - Masturbate the lower body
function C012_AfterClass_Bed_MasturbateDown() {
	CurrentTime = CurrentTime + 50000;
	if (!GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm")) {
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
	C012_AfterClass_Bed_CheckMistress();
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
	GameLogSpecificAddTimer(CurrentChapter, "Player", "NextPossibleOrgasm", PlayerHasLockedInventory("VibratingEgg") ? CurrentTime + 1800000 : CurrentTime + 3600000);
}

// Chapter 12 After Class - When the player wants to leave the bed with a lover
function C012_AfterClass_Bed_LeaveBedFromSex() {
	
	// If the actor is the owner and she didn't came, she will not let the player leave the bed
	if (Common_ActorIsOwner && (C012_AfterClass_Bed_SexPleasurePartner > -100)) {
		OverridenIntroText = GetText("SexStop" + CurrentActor + "Refuse");
		return;
	}
	
	// The actor will dislike the player if she didn't had her orgasm
	if (C012_AfterClass_Bed_SexPleasurePartner > -100) ActorChangeAttitude(-1, 0);
	if ((C012_AfterClass_Bed_SexPleasurePlayer < -100) && (C012_AfterClass_Bed_SexPleasurePartner > -100)) { ActorChangeAttitude(-1, 0); OverridenIntroText = GetText("SexStop" + CurrentActor + "PartnerNoOrgasm"); }
	if ((C012_AfterClass_Bed_SexPleasurePlayer > -100) && (C012_AfterClass_Bed_SexPleasurePartner < -100)) OverridenIntroText = GetText("SexStop" + CurrentActor + "PlayerNoOrgasm");
	C012_AfterClass_Bed_CurrentStage = 900;
	C012_AfterClass_Bed_OffBed();

}

// Chapter 12 After Class - Go back to the dorm scene
function C012_AfterClass_Bed_BackToDorm() {
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Main sex event with the partenr, there's a pleasure factor for each and a flag to tell if an orgasm is possible or not
function C012_AfterClass_Bed_Sex(PleasurePartner, PleasurePlayer, CanOrgasm, WorkAnim) {
	
	// Raise the level for both lovers
	CurrentTime = CurrentTime + 50000;
	C012_AfterClass_Bed_SexPleasurePartner = C012_AfterClass_Bed_SexPleasurePartner + PleasurePartner;
	C012_AfterClass_Bed_SexPleasurePlayer = C012_AfterClass_Bed_SexPleasurePlayer + PleasurePlayer;
	
	// More sex options opens when the scene progress
	C012_AfterClass_Bed_SexCount++;
	C012_AfterClass_Bed_SexSoft = (C012_AfterClass_Bed_SexCount >= 3);
	C012_AfterClass_Bed_SexWild = (C012_AfterClass_Bed_SexCount >= 6);
	
	// if an orgasm can be achieved from the activity, we trigger both orgasms at level 10 and they can be simultaneous
	var PartnerOrgasm = false;
	var PlayerOrgasm = false;
	if (CanOrgasm) {
		
		// When the partner achieves her orgasm
		if (C012_AfterClass_Bed_SexPleasurePartner >= 10) { 
			PartnerOrgasm = true; 
			C012_AfterClass_Bed_SexPleasurePartner = -10000000; 
			ActorChangeAttitude(1, 0);
			OverridenIntroText = GetText("Sex" + CurrentActor + "PartnerOrgasm");
			GameLogSpecificAddTimer(CurrentChapter, CurrentActor, "NextPossibleOrgasm", ActorHasInventory("VibratingEgg") ? CurrentTime + 3600000 : CurrentTime + 7200000);
		}
		
		// When the player achieves her orgasm
		if (C012_AfterClass_Bed_SexPleasurePlayer >= 10) { 
			PlayerOrgasm = true; 
			C012_AfterClass_Bed_SexPleasurePlayer = -10000000;
			GameLogSpecificAddTimer(CurrentChapter, "Player", "NextPossibleOrgasm", PlayerHasLockedInventory("VibratingEgg") ? CurrentTime + 1800000 : CurrentTime + 3600000);

			// A simultaneous orgasm gives one extra love
			if (PartnerOrgasm) {
				OverridenIntroText = GetText("Sex" + CurrentActor + "SimultaneousOrgasm");
				ActorChangeAttitude(1, 0);				
			} else OverridenIntroText = GetText("Sex" + CurrentActor + "PlayerOrgasm");

		}
		
		// If the sex scene must end, we jump to the next stage
		if ((C012_AfterClass_Bed_SexPleasurePlayer < -100) && (C012_AfterClass_Bed_SexPleasurePartner < -100))
			C012_AfterClass_Bed_CurrentStage = parseInt(C012_AfterClass_Bed_CurrentStage) + 10;

	}

	// Prepares the final image
	C012_AfterClass_Bed_PrepareImage(PartnerOrgasm, PlayerOrgasm, WorkAnim);

}

// Chapter 12 After Class - Renders a final image after sex
function C012_AfterClass_Bed_AfterSex() {
	CurrentTime = CurrentTime + 50000;
	C012_AfterClass_Bed_PrepareImage(false, false);	
}

// Chapter 12 After Class - When everyone gets off the bed
function C012_AfterClass_Bed_OffBed() {
	LeaveIcon = "Leave";
	OverridenIntroImage = "";
	ActorSetPose("");
}

// Chapter 12 After Class - The dating scene with Sarah starts from the bed
function C012_AfterClass_Bed_TestLoveSarah() {
	if (ActorGetValue(ActorLove) >= 20) {
		C012_AfterClass_Sarah_CurrentStage = 110;
		SetScene(CurrentChapter, "Sarah");
	}
}

// Chapter 12 After Class - When Amanda and Sarah are forced to get out of the bed
function C012_AfterClass_Bed_LoversOffBed() {
	CurrentActor = "";
	ActorSpecificChangeAttitude("Amanda", -1, 0);
	ActorSpecificChangeAttitude("Sarah", -1, 0);
	GameLogSpecificAddTimer(CurrentChapter, "Player", "AmandaAndSarahInBed", 1);
	OverridenIntroImage = "";
}