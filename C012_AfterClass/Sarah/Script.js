var C012_AfterClass_Sarah_CurrentStage = 0;
var C012_AfterClass_Sarah_IntroText = "";
var C012_AfterClass_Sarah_HasEgg = false;
var C012_AfterClass_Sarah_HasBelt = false;
var C012_AfterClass_Sarah_ChatAvail = false;
var	C012_AfterClass_Sarah_IsGagged = false;
var	C012_AfterClass_Sarah_IsRoped = false;
var	C012_AfterClass_Sarah_IsStrapped = false;
var C012_AfterClass_Sarah_IsRestrained = false;
var C012_AfterClass_Sarah_CanMasturbate = false;
var C012_AfterClass_Sarah_PleasurePlayerAvail = false;
var C012_AfterClass_Sarah_SexAvail = false;
var C012_AfterClass_Sarah_PleasurePlayerCount = 0;
var C012_AfterClass_Sarah_PleasurePlayerSpeed = 0;
var C012_AfterClass_Sarah_MasturbateCount = 0;
var C012_AfterClass_Sarah_AllowSexAfterDate = false;
var C012_AfterClass_Sarah_SidneyIsOwner = false;
var C012_AfterClass_Sarah_CanKickOut = false;
var C012_AfterClass_Sarah_HaveCuffs = false;
var C012_AfterClass_Sarah_DateAmandaAvail = false;
var	C012_AfterClass_Sarah_AllowDamsel = false;
var C012_AfterClass_Sarah_AllowHeroine = false;
var C012_AfterClass_Sarah_BondageClubInvitationBySarah = false;
var C012_AfterClass_Sarah_BondageClubInvitation = false;
var C012_AfterClass_Sarah_AmandaHeartBroken = false;
var C012_AfterClass_Sarah_DatingAmanda = false;
var C012_AfterClass_Sarah_HasPigPicture = false;
var C012_AfterClass_Sarah_IsNaked = false;
var C012_AfterClass_Sarah_MasturbateWhilePleasure = false;

// In her shorts, Sarah can have many poses when she talks
function C012_AfterClass_Sarah_SetPose() {
	if (((ActorGetValue(ActorCloth) == "") || (ActorGetValue(ActorCloth) == "Clothed") || (ActorGetValue(ActorCloth) == "BrownDress")) && !ActorIsRestrained() && !ActorIsGagged()) {
		var Love = ActorGetValue(ActorLove);
		var Sub = ActorGetValue(ActorSubmission);
		if ((Sub <= -10) && (Math.abs(Sub) >= Math.abs(Love))) ActorSetPose("Cocky");
		if ((Sub >= 10) && (Math.abs(Sub) >= Math.abs(Love))) ActorSetPose("Shy");
		if ((Love >= 10) && (Math.abs(Love) >= Math.abs(Sub))) ActorSetPose("Happy");
		if ((Love <= -10) && (Math.abs(Love) >= Math.abs(Sub))) ActorSetPose("Angry");
		if (Common_ActorIsOwned) ActorSetPose("Shy");
	} else {
		if ((ActorGetValue(ActorCloth) == "Naked") && !ActorIsRestrained() && !ActorIsGagged() && (ActorGetValue(ActorSubmission) >= 10)) ActorSetPose("Shy");
		else ActorSetPose("");
	}
}

// Calculate the scene parameters
function C012_AfterClass_Sarah_CalcParams() {
	C012_AfterClass_Sarah_IsNaked = (ActorGetValue(ActorCloth) == "Naked");
	C012_AfterClass_Sarah_HasEgg = ActorHasInventory("VibratingEgg");
	C012_AfterClass_Sarah_HasBelt = ActorHasInventory("ChastityBelt");
	C012_AfterClass_Sarah_IsGagged = ActorIsGagged();	
	C012_AfterClass_Sarah_IsRoped = (ActorHasInventory("Rope") || ActorHasInventory("TwoRopes") || ActorHasInventory("ThreeRopes"));
	C012_AfterClass_Sarah_IsStrapped = ActorHasInventory("Armbinder");
	C012_AfterClass_Sarah_IsRestrained = ActorIsRestrained();
	C012_AfterClass_Sarah_PleasurePlayerAvail = (!Common_PlayerChaste && !ActorIsGagged() && !ActorIsRestrained() && Common_ActorIsOwned && !GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm"));
	C012_AfterClass_Sarah_SexAvail = (!Common_PlayerRestrained && !Common_PlayerChaste && !GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm") && !GameLogQuery(CurrentChapter, "Sarah", "NextPossibleOrgasm"));
	if (GameLogQuery(CurrentChapter, "", "EventBlockChanging") && (C012_AfterClass_Dorm_Guest.indexOf(Common_PlayerOwner) >= 0) && !Common_PlayerNaked) C012_AfterClass_Sarah_SexAvail = false;
	C012_AfterClass_Sarah_CanMasturbate = (!Common_PlayerRestrained && !C012_AfterClass_Sarah_HasBelt && (ActorGetValue(ActorCloth) == "Naked"));	
	C012_AfterClass_Sarah_CanKickOut = (!Common_ActorIsOwner && !Common_ActorIsLover);
	C012_AfterClass_Sarah_SidneyIsOwner = (Common_PlayerOwner == "Sidney");
	C012_AfterClass_Sarah_HaveCuffs = (PlayerHasInventory("Cuffs"));
	C012_AfterClass_Sarah_DateAmandaAvail = (!GameLogQuery(CurrentChapter, CurrentActor, "DatingAmanda") && (Common_PlayerLover != "Amanda") && (Common_PlayerLover != "Sarah"));
	C012_AfterClass_Sarah_AllowDamsel = (GameLogQuery("C008_DramaClass", "Player", "RoleVillain") || GameLogQuery("C008_DramaClass", "Player", "RoleHeroine"));
	C012_AfterClass_Sarah_AllowHeroine = GameLogQuery("C008_DramaClass", "Player", "RoleDamsel");
	C012_AfterClass_Sarah_BondageClubInvitationBySarah = GameLogQuery(CurrentChapter, CurrentActor, "BondageClubInvitationBySarah");
	C012_AfterClass_Sarah_BondageClubInvitation = GameLogQuery("", "", "BondageClubInvitation");
	C012_AfterClass_Sarah_AmandaHeartBroken = (GameLogQuery(CurrentChapter, "Sarah", "AmandaHeartBroken") && (Common_PlayerLover == "Sarah"));
	C012_AfterClass_Sarah_AmandaAvail = ((C012_AfterClass_Dorm_Guest.indexOf("Amanda") >= 0) && !ActorSpecificIsRestrained("Amanda") && !ActorSpecificIsGagged("Amanda"));
	C012_AfterClass_Sarah_DatingAmanda = (GameLogQuery(CurrentChapter, "Sarah", "DatingAmanda") && (C012_AfterClass_Dorm_Guest.indexOf("Amanda") >= 0));
	C012_AfterClass_Sarah_HasPigPicture = (GameLogQuery("", "Sidney", "Pig") && !GameLogQuery(CurrentChapter, "Sarah", "PigPictureDone"));
	C012_AfterClass_Sarah_SetPose();
}

// Chapter 12 After Class - Sarah Load
function C012_AfterClass_Sarah_Load() {
	
	// Loads the scene
	LoadInteractions();
	ActorLoad("Sarah", "Dorm");
	Common_PlayerPose = "";
	if (Common_ActorIsOwned) GameLogAddTimer("EventGenericNext", CurrentTime + 1200000 + Math.floor(Math.random() * 1200000));
	
	// At stage 400, Sarah is leaving
	if (C012_AfterClass_Sarah_CurrentStage == 400) { ActorUngag(); LeaveIcon = ""; }
	
	// Sarah's parameters
	C012_AfterClass_Sarah_CalcParams();	
	C012_AfterClass_Sarah_ChatAvail = !GameLogQuery(CurrentChapter, "Sidney", "AllowPigCostume");
	C012_AfterClass_Sarah_SpankMaxCount = 10 - Math.floor(ActorGetValue(ActorLove) / 7);
	if (C012_AfterClass_Sarah_SpankMaxCount < 6) C012_AfterClass_Sarah_SpankMaxCount = 6;
	if (C012_AfterClass_Sarah_SpankMaxCount > 12) C012_AfterClass_Sarah_SpankMaxCount = 12;

	// Loads the previous text if needed
	if (C012_AfterClass_Sarah_IntroText != "") {
		OverridenIntroText = C012_AfterClass_Sarah_IntroText;
		C012_AfterClass_Sarah_IntroText = "";
	} else {
		
		// If the player is grounded
		if (GameLogQuery(CurrentChapter, "", "EventGrounded")) {
			
			// Skip to the punishment end phase, no talking while being grounded
			C012_AfterClass_Sarah_AllowLeave();
			C012_AfterClass_Sarah_CurrentStage = 3999;
			C012_AfterClass_Dorm_SetPunishmentPose();

		} else {

			// If there's a crossover between two actors
			if ((C012_AfterClass_Sarah_CurrentStage == 0) && !GameLogQuery(CurrentChapter, CurrentActor, "MetSidney") && (C012_AfterClass_Dorm_Guest.indexOf("Sidney") >= 0) && !Common_PlayerRestrained && !Common_PlayerGagged && !ActorIsGagged() && !ActorIsRestrained()) {
				LeaveIcon = "";
				if ((ActorGetValue(ActorCloth) == "") || (ActorGetValue(ActorCloth) == "Clothed") || (ActorGetValue(ActorCloth) == "BrownDress")) ActorSetPose("Angry");
				else ActorSetPose("");
				C012_AfterClass_Sarah_CurrentStage = 700;
				GameLogAdd("MetSidney");
			}

		}

	}

}

// Chapter 12 After Class - Sarah Run
function C012_AfterClass_Sarah_Run() {

	// Build the regular interactions
	BuildInteraction(C012_AfterClass_Sarah_CurrentStage);

	// Draw the watching actors for ceremonies
	if ((C012_AfterClass_Sarah_CurrentStage >= 250) && (C012_AfterClass_Sarah_CurrentStage < 300)) C012_AfterClass_Dorm_DrawOtherActors();

	// Draw the actor alone or with the player depending on the stage
	if ((C012_AfterClass_Sarah_CurrentStage != 150) && (C012_AfterClass_Sarah_CurrentStage != 151)) {
		if ((C012_AfterClass_Sarah_CurrentStage != 410) && (C012_AfterClass_Sarah_CurrentStage != 3932) && (C012_AfterClass_Sarah_CurrentStage != 633) && (C012_AfterClass_Sarah_CurrentStage != 634) && (C012_AfterClass_Sarah_CurrentStage != 791) && (C012_AfterClass_Sarah_CurrentStage != 194)) {
			if (((C012_AfterClass_Sarah_CurrentStage >= 3090) && (C012_AfterClass_Sarah_CurrentStage <= 3099)) || ((C012_AfterClass_Sarah_CurrentStage >= 3901) && (C012_AfterClass_Sarah_CurrentStage <= 3999))) {
				DrawActor("Player", 475, 0, 1);
				DrawActor(CurrentActor, 750, 0, 1);
			} else {
				DrawInteractionActor();
				if ((C012_AfterClass_Sarah_CurrentStage >= 392) && (C012_AfterClass_Sarah_CurrentStage < 400)) DrawActor("Player", 600, 100, 1);
			}		
		}
	} else {
		DrawActor("Sarah", 500, 0, 1);
		DrawActor("Amanda", 800, 0, 0.8);
	}

}

// Chapter 12 After Class - Sarah Click
function C012_AfterClass_Sarah_Click() {

	// Regular interactions
	ClickInteraction(C012_AfterClass_Sarah_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if ((ClickInv == "Player") && (LeaveIcon == "Leave")) {
		C012_AfterClass_Sarah_IntroText = OverridenIntroText;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}
	
	// Sarah can be restrained on stage 0 and 10
	if ((C012_AfterClass_Sarah_CurrentStage <= 10) && (ClickInv != "") && (ClickInv != "Player") && !Common_PlayerRestrained) {
		
		// Sarah becomes more submissive from the crop
		if (ClickInv == "Crop") {
			if (ActorIsGagged()) OverridenIntroText = GetText("CropWhileGagged");
			else if (Common_ActorIsOwned) OverridenIntroText = GetText("CropFromMistress");
			else OverridenIntroText = GetText("Crop");
			if (!GameLogQuery(CurrentChapter, CurrentActor, "CropDone")) {
				ActorChangeAttitude(0, 1);
				GameLogAdd("CropDone");
			}
			CurrentTime = CurrentTime + 50000;
			return;
		}

		// Sarah will turn the tables on the player if -10 submission or less
		if ((ActorGetValue(ActorSubmission) <= -10) && !ActorIsRestrained() && !ActorIsGagged() && (ClickInv != "CuffsKey")) {
			PlayerRandomRestrain();
			if (Common_PlayerRestrained) {
				PlayerRandomGag();
				OverridenIntroText = GetText("TurnTables");
				C012_AfterClass_Sarah_CalcParams();
				CurrentTime = CurrentTime + 50000;
			} else OverridenIntroText = GetText("RefuseBondage");
			return;
		}
	
		// Sarah can only wear the belt if she's naked
		if (!ActorIsChaste() && (ActorGetValue(ActorCloth) != "Naked") && (ClickInv == "ChastityBelt")) {
			OverridenIntroText = GetText("NakedForBelt");
			return;
		}

		// Sarah will refuse the chastity belt if she's not restrained 
		if (!ActorIsChaste() && !ActorIsRestrained() && (ActorGetValue(ActorSubmission) < 10) && (ClickInv == "ChastityBelt")) {
			OverridenIntroText = GetText("RefuseBelt");
			return;
		}
		
		// A second rope can be applied if Sarah isn't fully clothed
		if ((ActorGetValue(ActorCloth) != "Naked") && (ActorGetValue(ActorCloth) != "Underwear") && (ClickInv == "Rope") && (ActorHasInventory("Rope"))) {
			OverridenIntroText = GetText("StripForSecondRope");
			return;
		}
		
		// Cannot use rope or armbinder in the school play costumes
		if ((ActorGetValue(ActorCloth) == "Heroine") && ((ClickInv == "Rope") || (ClickInv == "Armbinder"))) {
			OverridenIntroText = GetText("NoRestrainInCostume");
			return;			
		}

		// Cannot use restrains in the damsel gown
		if ((ActorGetValue(ActorCloth) == "Damsel") && ((ClickInv == "Rope") || (ClickInv == "Armbinder") || (ClickInv == "Cuffs"))) {
			OverridenIntroText = GetText("NoRestrainInCostume");
			return;			
		}
		
		// Apply the clicked restrain
		ActorApplyRestrain(ClickInv);
		C012_AfterClass_Sarah_CalcParams();

	}	

}

// Chapter 12 After Class - Sarah can make love with the player if (Love + seduction * 2) >= 12 or >= 25 on the next time or Sarah is the player girlfriend/submissive
function C012_AfterClass_Sarah_GaggedAnswer() {
	if (ActorIsGagged()) {
		var GagTalk = Math.floor(Math.random() * 8) + 1;
		OverridenIntroText = GetText("GaggedAnswer" + GagTalk.toString());		
	}
}

// Chapter 12 After Class - Sarah can make love with the player if (Love + seduction * 2) >= 12 on the next time or Sarah is the player girlfriend/submissive
function C012_AfterClass_Sarah_TestSex() {
	if (!ActorIsGagged()) {
		if (!GameLogQuery(CurrentChapter, "Sarah", "DatingAmanda") || Common_ActorIsOwned) {
			if (!ActorIsRestrained()) {
				if (!ActorIsChaste()) {
					var LoveChance = ActorGetValue(ActorLove) + PlayerGetSkillLevel("Seduction") * 2;
					if ((LoveChance >= 12) || Common_ActorIsLover || Common_ActorIsOwned) {
						C012_AfterClass_Sarah_CurrentStage = 100;
						OverridenIntroText = "";
					}
				} else OverridenIntroText = GetText("UnlockBeltBeforeSex");
			} else OverridenIntroText = GetText("ReleaseBeforeTalk");
		} else OverridenIntroText = GetText("RefuseSexForLover");
	} else C012_AfterClass_Sarah_GaggedAnswer();
}

// Chapter 12 After Class - Sarah can be dominated at +20 submission
function C012_AfterClass_Sarah_TestDomme() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained()) {
			if (PlayerHasInventory("Collar")) {
				if (ActorGetValue(ActorSubmission) >= 20) {
					C012_AfterClass_Sarah_CurrentStage = 200;
					OverridenIntroText = "";
					LeaveIcon = "";
				}
			} else OverridenIntroText = GetText("CollarToEnslave");
		} else OverridenIntroText = GetText("ReleaseBeforeTalk");
	} else C012_AfterClass_Sarah_GaggedAnswer();
}

// Chapter 12 After Class - Sarah can become the player Mistress at -20 submission
function C012_AfterClass_Sarah_TestSub() {
	if (!ActorIsGagged()) {
		if (Common_PlayerOwner != "")
			OverridenIntroText = GetText("AlreadyOwned");
		else
			C012_AfterClass_Sarah_CurrentStage = 300;
	}
	else C012_AfterClass_Sarah_GaggedAnswer();
}

// Chapter 12 After Class - Sets a new pose for the player
function C012_AfterClass_Sarah_SetPlayerPose(NewPose) {
	Common_PlayerPose = NewPose;
}

// Chapter 12 After Class - Sarah can unbind the player on some events
function C012_AfterClass_Sarah_TestUnbind() {
		
	// Check if the event succeeds randomly (skip is owned)
	if (EventRandomChance("Love") || Common_ActorIsOwned) {
		
		// Can only release if not restrained
		if (!ActorIsRestrained()) {
			if (ActorIsGagged()) OverridenIntroText = GetText("ReleasePlayerGagged");
			else OverridenIntroText = GetText("ReleasePlayer");				
			PlayerReleaseBondage();
			CurrentTime = CurrentTime + 50000;
		} else OverridenIntroText = GetText("CannotReleasePlayer");
		
	} else EventSetGenericTimer();
	
}

// Chapter 12 After Class - Allows the player to leave the scene
function C012_AfterClass_Sarah_AllowLeave() {
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - Sarah can confiscate the player keys
function C012_AfterClass_Sarah_BegForOrgasm() {
	
	// If the player begs for it, Sarah will do it randomly based on love, if not it's based on hate
	if (EventRandomChance("Love")) {
		ActorAddOrgasm();
		EventLogEnd();
		OverridenIntroText = GetText("MasturbatePlayerOrgasm");
		C012_AfterClass_Sarah_CurrentStage = 3223;
	}

}

// Chapter 12 After Class - Set Sarah Pose
function C012_AfterClass_Sarah_ActorSetPose(NewPose) {
	ActorSetPose(NewPose);
}

// Chapter 12 After Class - Ends any bondage and resets the pose
function C012_AfterClass_Sarah_ReleasePlayer() {
	Common_PlayerPose = "";
	EventSetGenericTimer();
	PlayerReleaseBondage();
	C012_AfterClass_Sarah_AllowLeave();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Flags the chat as done and doesn't allow the player to leave
function C012_AfterClass_Sarah_StartChat() {
	if (!ActorIsGagged()) {
		ActorSetPose("");
		GameLogAdd("ChatDone");
		LeaveIcon = "";
		C012_AfterClass_Sarah_ChatAvail = false;
	} else C012_AfterClass_Sarah_GaggedAnswer();
}

// Chapter 12 After Class - Ends the chat with Sarah
function C012_AfterClass_Sarah_EndChat() {
	if (ActorGetValue(ActorPose) == "Kneel") ActorSetPose("Shy");
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - The player can ask Sarah to change clothes
function C012_AfterClass_Sarah_TestChange() {
	if (!ActorIsRestrained()) {
		if ((ActorGetValue(ActorLove) >= 5) || (ActorGetValue(ActorSubmission) >= 5) || Common_ActorIsOwned || Common_ActorIsLover) {
			if (Common_ActorIsOwned) OverridenIntroText = GetText("AcceptChangeFromMistress");
			else 
				if (Common_ActorIsLover) OverridenIntroText = GetText("AcceptChangeFromLover");
				else OverridenIntroText = GetText("AcceptChange");
			C012_AfterClass_Sarah_CurrentStage = 600;
		}
		C012_AfterClass_Sarah_GaggedAnswer();
	} else OverridenIntroText = GetText("CannotActWhileRestrained");
}

// Chapter 12 After Class - Sarah can change clothes when the player asks for it
function C012_AfterClass_Sarah_ForceChangeActor(NewCloth) {
	if (ActorGetValue(ActorCloth) != NewCloth) {
		ActorSetCloth(NewCloth);
		C012_AfterClass_Sarah_CalcParams();
		CurrentTime = CurrentTime + 50000;
	} else OverridenIntroText = GetText("NoNeedToChange");
	C012_AfterClass_Sarah_GaggedAnswer();
}

// Chapter 12 After Class - Check if Sarah wants to be collared
function C012_AfterClass_Sarah_TestEnslaveSarah() {
	if (ActorIsRestrained()) C012_AfterClass_Sarah_CurrentStage = 285;
	else if (ActorGetValue(ActorCloth) == "Naked") { C012_AfterClass_Sarah_CurrentStage = 291; ActorSetPose("Shy"); }
	else C012_AfterClass_Sarah_CurrentStage = 290;
	OverridenIntroText = GetText("AcceptCollar");
}

// Chapter 12 After Class - When the player gives up on enslaving Sarah
function C012_AfterClass_Sarah_EndEnslaveSarah() {
	C012_AfterClass_Sarah_CalcParams();
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - Sarah gets naked for her collaring
function C012_AfterClass_Sarah_EnslaveStrip() {
	ActorSetCloth("Naked");
	ActorSetPose("Shy");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Sarah can be ungagged
function C012_AfterClass_Sarah_Ungag() {
	ActorUngag();
	C012_AfterClass_Sarah_CalcParams();
	LeaveIcon = "Leave";
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Sarah can be untied
function C012_AfterClass_Sarah_Untie() {
	ActorUntie();
	C012_AfterClass_Sarah_CalcParams();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When Sarah gets collared
function C012_AfterClass_Sarah_LockCollarSarah() {
	ActorSetOwner("Player");
	GameLogAddTimer("EventGenericNext", CurrentTime + 1200000 + Math.floor(Math.random() * 1200000));
	PlayerRemoveInventory("Collar", 1);
	C012_AfterClass_Sarah_CalcParams();
	ActorSetPose("Kneel");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - The player can decide how Sarah will spend her evening
function C012_AfterClass_Sarah_SetCurfew(CurfewType) {
	GameLogAddTimer("CurfewStay", -1);
	GameLogAddTimer("Curfew22", -1);
	GameLogAddTimer("Curfew24", -1);
	GameLogAddTimer("CurfewNone", -1);
	GameLogAdd("Curfew" + CurfewType);
}

// Chapter 12 After Class - Go back to the main dorm room
function C012_AfterClass_Sarah_BackToDorm() {
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Starts the pleasure player scene
function C012_AfterClass_Sarah_TestPleasurePlayer() {
	LeaveIcon = "";
	if (ActorGetValue(ActorCloth) == "Naked") C012_AfterClass_Sarah_CurrentStage = 631;
}

// Chapter 12 After Class - When Sarah starts pleasuring the player (starts to count at 2 with a vibrating egg)
function C012_AfterClass_Sarah_StartPleasurePlayer(MasturbateWhilePleasure) {
	C012_AfterClass_Sarah_MasturbateWhilePleasure = MasturbateWhilePleasure;
	PlayerClothes("Naked");
	OverridenIntroImage = "SarahPleasurePlayer1.jpg";
	CurrentTime = CurrentTime + 50000;
	if (PlayerHasLockedInventory("VibratingEgg")) C012_AfterClass_Sarah_PleasurePlayerCount = 2;
	else C012_AfterClass_Sarah_PleasurePlayerCount = 0;
	C012_AfterClass_Sarah_PleasurePlayerSpeed = 0;
}

// Chapter 12 After Class - When Sarah pleasures the player
function C012_AfterClass_Sarah_PleasurePlayer() {
	
	// The more it progresses, the faster Sarah must go
	CurrentTime = CurrentTime + 50000;
	var StartCount = C012_AfterClass_Sarah_PleasurePlayerCount;
	if ((C012_AfterClass_Sarah_PleasurePlayerCount >= 0) && (C012_AfterClass_Sarah_PleasurePlayerCount <= 1) && (C012_AfterClass_Sarah_PleasurePlayerSpeed == 0)) C012_AfterClass_Sarah_PleasurePlayerCount++;
	if ((C012_AfterClass_Sarah_PleasurePlayerCount >= 2) && (C012_AfterClass_Sarah_PleasurePlayerCount <= 3) && (C012_AfterClass_Sarah_PleasurePlayerSpeed == 1)) C012_AfterClass_Sarah_PleasurePlayerCount++;
	if ((C012_AfterClass_Sarah_PleasurePlayerCount >= 4) && (C012_AfterClass_Sarah_PleasurePlayerCount <= 9) && (C012_AfterClass_Sarah_PleasurePlayerSpeed == 2)) C012_AfterClass_Sarah_PleasurePlayerCount++;
	if (C012_AfterClass_Sarah_MasturbateWhilePleasure) OverridenIntroText = GetText("SarahPleasureMastubate");

	// 3 images will rotate
	if (OverridenIntroImage == "SarahPleasurePlayer1.jpg") OverridenIntroImage = "SarahPleasurePlayer2.jpg";
	else if (OverridenIntroImage == "SarahPleasurePlayer2.jpg") OverridenIntroImage = "SarahPleasurePlayer3.jpg";
	else OverridenIntroImage = "SarahPleasurePlayer1.jpg";

	// At 6 counts, an orgasm is achieved, the next one will be slower
	if (C012_AfterClass_Sarah_PleasurePlayerCount >= 6) {
		if (C012_AfterClass_Sarah_MasturbateWhilePleasure) OverridenIntroText = GetText("OrgasmFromSarahPleasureMastubate");
		else OverridenIntroText = GetText("OrgasmFromSarahPleasure");
		ActorAddOrgasm();
		GameLogSpecificAddTimer(CurrentChapter, "Player", "NextPossibleOrgasm", PlayerHasLockedInventory("VibratingEgg") ? CurrentTime + 1800000 : CurrentTime + 3600000);
		if (C012_AfterClass_Sarah_MasturbateWhilePleasure) GameLogSpecificAddTimer(CurrentChapter, CurrentActor, "NextPossibleOrgasm", CurrentTime + 3600000);
		if (PlayerHasLockedInventory("Collar")) OverridenIntroImage = "PlayerCollarCloseUpOrgasm.jpg";
		else OverridenIntroImage = "PlayerCloseUpOrgasm.jpg";
		C012_AfterClass_Sarah_CurrentStage = 634;
		C012_AfterClass_Sarah_PleasurePlayerCount = 0;
		C012_AfterClass_Sarah_PleasurePlayerSpeed = 0;
	} else {
		if (StartCount == C012_AfterClass_Sarah_PleasurePlayerCount) OverridenIntroText = GetText("PleasureFromSarahNoProgress");
	}
	
}

// Chapter 12 After Class - When Sarah pleasures the player and is forced in a new position or speed
function C012_AfterClass_Sarah_PleasurePlayerSetSpeed(SpeedFactor) {
	C012_AfterClass_Sarah_PleasurePlayerSpeed = C012_AfterClass_Sarah_PleasurePlayerSpeed + SpeedFactor;
	if (C012_AfterClass_Sarah_PleasurePlayerSpeed < 0) C012_AfterClass_Sarah_PleasurePlayerSpeed = 0;
	if (C012_AfterClass_Sarah_PleasurePlayerSpeed > 2) C012_AfterClass_Sarah_PleasurePlayerSpeed = 2;
}

// Chapter 12 After Class - When Sarah stops pleasuring the player
function C012_AfterClass_Sarah_StopPleasureFromSarah() {
	OverridenIntroImage = "";
}

// Chapter 12 After Class - When Sarah pleasures for the player ends
function C012_AfterClass_Sarah_EndPleasureFromSarah(LoveFactor, SubFactor) {
	if (!GameLogQuery(CurrentChapter, CurrentActor, "PleasureFromSarah")) {
		GameLogAdd("PleasureFromSarah");
		ActorChangeAttitude(LoveFactor, SubFactor);
	}
	C012_AfterClass_Sarah_EndEnslaveSarah();
}

// Chapter 12 After Class - When the player kisses Sarah
function C012_AfterClass_Sarah_Kiss() {
	CurrentTime = CurrentTime + 50000;	
	if (Common_ActorIsOwner) OverridenIntroText = GetText("KissSarahOwner");
	else if (C012_AfterClass_Sarah_IsGagged) OverridenIntroText = GetText("KissSarahGagged");
	else if (!GameLogQuery(CurrentChapter, CurrentActor, "Kiss")) {
		GameLogAdd("Kiss");
		ActorChangeAttitude(1 + PlayerGetSkillLevel("Seduction"), 0);
		if (PlayerGetSkillLevel("Seduction") > 0) OverridenIntroText = GetText("KissSarahSeduction");
	}
}

// Chapter 12 After Class - When the player spanks Sarah, with the fighting skill it can affect her submission level
function C012_AfterClass_Sarah_Spank() {
	CurrentTime = CurrentTime + 50000;
	if (!GameLogQuery(CurrentChapter, CurrentActor, "Spank")) {
		GameLogAdd("Spank");
		ActorChangeAttitude(1, 1 + PlayerGetSkillLevel("Fighting"));
	}
	if (PlayerGetSkillLevel("Fighting") > 0) OverridenIntroText = GetText("SpankWithStrength");
}

// Chapter 12 After Class - When the player tickles Sarah, it doesn't affect her
function C012_AfterClass_Sarah_Tickle() {
	CurrentTime = CurrentTime + 50000;
	if ((Common_ActorIsOwner || (ActorGetValue(ActorSubmission) <= -5)) && !ActorIsRestrained()) OverridenIntroText = GetText("DoubleTickling");
}

// Chapter 12 After Class - When the player starts to masturbate Sarah
function C012_AfterClass_Sarah_StartMasturbate() {
	if ((ActorGetValue(ActorLove) >= 5) || (ActorGetValue(ActorSubmission) >= 5) || (ActorIsRestrained())) {
		CurrentTime = CurrentTime + 50000;
		if (!GameLogQuery(CurrentChapter, CurrentActor, "NextPossibleOrgasm")) {
			C012_AfterClass_Sarah_MasturbateCount = 0;
			C012_AfterClass_Sarah_CurrentStage = 640;
			OverridenIntroText = GetText("StartMasturbateSarah");
			LeaveIcon = "";
		} else OverridenIntroText = GetText("MasturbateNotInTheMood");
	}
}

// Chapter 12 After Class - When the player masturbates Sarah, she can only climax if she's restrained
function C012_AfterClass_Sarah_Masturbate(Factor, CanClimax) {
	CurrentTime = CurrentTime + 50000;
	C012_AfterClass_Sarah_MasturbateCount = C012_AfterClass_Sarah_MasturbateCount + Factor;
	if (C012_AfterClass_Sarah_MasturbateCount < 0) C012_AfterClass_Sarah_MasturbateCount = 0;
	if ((C012_AfterClass_Sarah_MasturbateCount >= (ActorHasInventory("VibratingEgg") ? 5 : 7)) && CanClimax && ActorIsRestrained()) {
		C012_AfterClass_Sarah_CurrentStage = 641;
		OverridenIntroText = GetText("ReadyForOrgasm");
	}
}

// Chapter 12 After Class - When Sarah is masturbated to an orgasm
function C012_AfterClass_Sarah_SarahOrgasm() {
	CurrentTime = CurrentTime + 50000;
	ActorAddOrgasm();
	if (!GameLogQuery(CurrentChapter, CurrentActor, "NextPossibleOrgasm")) {
		GameLogSpecificAddTimer(CurrentChapter, CurrentActor, "NextPossibleOrgasm", CurrentTime + 3600000);
		ActorChangeAttitude(2, -1);
	}
}

// Chapter 12 After Class - When Sarah is masturbated to an orgasm
function C012_AfterClass_Sarah_SarahDeniedOrgasm() {
	CurrentTime = CurrentTime + 50000;
	if (!GameLogQuery(CurrentChapter, CurrentActor, "OrgasmDeniedFromMasturbation")) {
		GameLogAdd("OrgasmDeniedFromMasturbation");
		ActorChangeAttitude(-2, 1);
	}
	C012_AfterClass_Sarah_EndEnslaveSarah();
}

// Chapter 12 After Class - Tests if the player is already dating someone else
function C012_AfterClass_Sarah_TestRelationship() {
	if (GameLogQuery(CurrentChapter, CurrentActor, "DatingSarah")) {
		OverridenIntroText = GetText("AlreadyDatingSarah");
		C012_AfterClass_Sarah_CurrentStage = 0;
	} else {
		if (GameLogQuery(CurrentChapter, CurrentActor, "LoverBreakUp")) {
			OverridenIntroText = GetText("AlreadyBrokeUp");
			C012_AfterClass_Sarah_CurrentStage = 0;
		} else {
			if (Common_PlayerLover != "") {
				if (Common_PlayerLover == "Sarah") {
					OverridenIntroText = GetText("AlreadyLovedBySarah");
					C012_AfterClass_Sarah_CurrentStage = 0;
				} else {
					OverridenIntroText = GetText("AlreadyLoved");
					C012_AfterClass_Sarah_CurrentStage = 105;
				}
			}
		}
	}
}

// Chapter 12 After Class - Start Dating Sarah
function C012_AfterClass_Sarah_StartDating() {
	CurrentTime = CurrentTime + 50000;
	Common_PlayerLover = "Sarah";
	Common_ActorIsLover = true;
	C012_AfterClass_Sarah_CalcParams();
	C012_AfterClass_Sarah_AllowSexAfterDate = (!Common_PlayerChaste && !ActorIsChaste());
}

// Chapter 12 After Class - Start Dating Sarah
function C012_AfterClass_Sarah_BothNaked() {
	ActorSetCloth("Naked");
	PlayerClothes("Naked");
	C012_AfterClass_Sarah_CalcParams();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Get in bed with Sarah to make love
function C012_AfterClass_Sarah_MakeLove() {
	CurrentTime = CurrentTime + 50000;
	ActorSetCloth("Naked");
	PlayerClothes("Naked");
	C012_AfterClass_Bed_Partner = "Sarah";
	SetScene(CurrentChapter, "Bed");
}

// Chapter 12 After Class - Test if the player can start the break up dialog
function C012_AfterClass_Sarah_TestTalk() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained()) C012_AfterClass_Sarah_CurrentStage = 20;
		else OverridenIntroText = GetText("ReleaseBeforeTalk");
	} else C012_AfterClass_Sarah_GaggedAnswer();	
}

// Chapter 12 After Class - When the player breaks up with Sarah
function C012_AfterClass_Sarah_BreakUp() {
	GameLogAdd("LoverBreakUp");
	Common_PlayerLover = "";
	Common_ActorIsLover = false;
	ActorSetPose("");
	LeaveIcon = "";
}

// Chapter 12 After Class - When Sarah leaves the room after the break up
function C012_AfterClass_Sarah_SarahLeave() {
	CurrentActor = "";
	LeaveIcon = "Leave";
	C012_AfterClass_Dorm_Guest.splice("Sarah");
}

// Chapter 12 After Class - When Sarah forces the player to kick someone out
function C012_AfterClass_Sarah_KickActor(KickedActor) {
	if (KickedActor == "Sidney") C012_AfterClass_Sidney_CurrentStage = 790;
	SetScene(CurrentChapter, KickedActor);
}

// Chapter 12 After Class - When Sarah is kicked for another actor
function C012_AfterClass_Sarah_KickForActor(KickedForActor) {
	ActorSpecificChangeAttitude(KickedForActor, 2, 1);
}

// Chapter 12 After Class - When Sarah is kicked out, it can destroy the players couple
function C012_AfterClass_Sarah_KickedOut() {
	GameLogAdd("KickedOutFromDorm");
	GameLogSpecificAddTimer(CurrentChapter, "Player", "AmandaAndSarahInBed", 1);
	if (CurrentActor == Common_PlayerLover) {
		ActorChangeAttitude(-5, 0);
		C012_AfterClass_Sarah_BreakUp();
	}
	CurrentActor = "";
}

// Chapter 12 After Class - Sarah can invite the player to the Bondage Club
function C012_AfterClass_Sarah_BondageClubInvite(InviteType) {
	if (InviteType == "Love") ActorChangeAttitude(2, 0);
	if (InviteType == "Sub") ActorChangeAttitude(0, -2);
	GameLogAdd("BondageClubInvitationBySarah");
	C012_AfterClass_Sarah_BondageClubInvitationBySarah = true;
}

// Chapter 12 After Class - Test if Sarah and the player can go to the bondage club
function C012_AfterClass_Sarah_TestBondageClub() {
	if (!ActorIsGagged()) {
		if (CurrentTime >= 20 * 60 * 60 * 1000) {
			if (!ActorIsRestrained()) {
				C012_AfterClass_Sarah_CurrentStage = 30;
				if (Common_PlayerRestrained) {
					PlayerReleaseBondage();
					OverridenIntroText = GetText("ReleasePlayerForBondageClub");
				} else OverridenIntroText = GetText("ReadyForBondageClub");
			} else OverridenIntroText = GetText("ReleaseBeforeBondageClub");
		}
	} else C012_AfterClass_Sarah_GaggedAnswer();
}

// Chapter 12 After Class - Test if Amanda will try to prevent the player from dating Sarah
function C012_AfterClass_Sarah_AmandaJoinForLove() {
	if (!ActorSpecificIsRestrained("Amanda") && (C012_AfterClass_Dorm_Guest.indexOf("Amanda") >= 0)) {
		C012_AfterClass_Sarah_CurrentStage = 150;
		CurrentActor = "Amanda";
		ActorUngag();
		ActorSetCloth("Clothed");
		ActorSetPose("Angry");
		CurrentActor = "Sarah";
		OverridenIntroText = GetText("AmandaPreventDatingSarah");
	}
}

// Chapter 12 After Class - Amanda can leave if the player starts to date Sarah in front of her
function C012_AfterClass_Sarah_AmandaLeave() {
	GameLogSpecificAdd(CurrentChapter, "Amanda", "KickedOutFromDorm");
	GameLogSpecificAdd(CurrentChapter, "Sarah", "AmandaHeartBroken");
	C012_AfterClass_Sarah_AmandaHeartBroken = true;
}

// Chapter 12 After Class - The player can match Amanda and Sarah
function C012_AfterClass_Sarah_AmandaDatingScene() {
	C012_AfterClass_Amanda_CurrentStage = 800;
	ActorSetPose("");
	SetScene(CurrentChapter, "Amanda");
	ActorSetPose("");
	LeaveIcon = "";
}

// Chapter 12 After Class - When the player shares a Sidney pig picture with Sarah
function C012_AfterClass_Sarah_PigPictureDone() {
	GameLogAdd("PigPictureDone");
	C012_AfterClass_Sarah_HasPigPicture = false;
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Sarah gives the pig costume to the player
function C012_AfterClass_Sarah_GetPigCostume() {
	GameLogSpecificAdd(CurrentChapter, "Sidney", "AllowPigCostume");
	CurrentTime = CurrentTime + 50000;
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - The player can stop Sarah's random events
function C012_AfterClass_Sarah_StopEvents() {
	GameLogAdd("StopEvents");
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - Enter the Bondage Club with Sarah
function C012_AfterClass_Sarah_EnterBondageClub() {
	GameLogAdd("VisitBondageClubWithSarah");
	SetScene("C013_BondageClub", "Intro");
}