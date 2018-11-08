var C012_AfterClass_Jennifer_CurrentStage = 0;
var C012_AfterClass_Jennifer_IntroText = "";
var C012_AfterClass_Jennifer_HasEgg = false;
var C012_AfterClass_Jennifer_HasBelt = false;
var C012_AfterClass_Jennifer_ChatAvail = false;
var C012_AfterClass_Jennifer_SpankCount = 0;
var C012_AfterClass_Jennifer_IsNaked = false;
var	C012_AfterClass_Jennifer_IsGagged = false;
var	C012_AfterClass_Jennifer_IsRoped = false;
var	C012_AfterClass_Jennifer_IsStrapped = false;
var C012_AfterClass_Jennifer_CanMasturbate = false;
var C012_AfterClass_Jennifer_PleasurePlayerAvail = false;
var C012_AfterClass_Jennifer_SexAvail = false;
var C012_AfterClass_Jennifer_PleasurePlayerCount = 0;
var C012_AfterClass_Jennifer_PleasurePlayerSpeed = 0;
var C012_AfterClass_Jennifer_MasturbateCount = 0;
var C012_AfterClass_Jennifer_CanSetCurfew22 = false;
var C012_AfterClass_Jennifer_AllowTennisOutfit = false;
var C012_AfterClass_Jennifer_AllowSwimsuit = false;
var C012_AfterClass_Jennifer_AllowTraining = false;
var C012_AfterClass_Jennifer_AllowSexAfterDate = false;
var C012_AfterClass_Jennifer_CanKickOut = false;
var C012_AfterClass_Jennifer_RefuseSubmitCount = 0;
var C012_AfterClass_Jennifer_SubTrainingCount = 0;

// In her school clothes, Jennifer can have many poses when she talks
function C012_AfterClass_Jennifer_SetPose() {
	ActorSetPose("");
	if (((ActorGetValue(ActorCloth) == "Clothed") || (ActorGetValue(ActorCloth) == "")) && !ActorIsRestrained() && !ActorIsGagged()) {
		var Love = ActorGetValue(ActorLove);
		var Sub = ActorGetValue(ActorSubmission);	
		if ((Sub <= -10) && (Math.abs(Sub) >= Math.abs(Love))) ActorSetPose("Cocky");
		if ((Sub >= 10) && (Math.abs(Sub) >= Math.abs(Love))) ActorSetPose("Shy");
		if ((Love >= 10) && (Math.abs(Love) >= Math.abs(Sub))) ActorSetPose("Happy");
		if ((Love <= -10) && (Math.abs(Love) >= Math.abs(Sub))) ActorSetPose("Angry");
		if (Common_ActorIsOwner) {
			if (GameLogQuery(CurrentChapter, CurrentActor, "HasCrop")) ActorSetPose("DominantCrop");
			else ActorSetPose("Dominant");
		}
		if (Common_ActorIsOwned) ActorSetPose("Shy");
	}
}

// Calculate the scene parameters
function C012_AfterClass_Jennifer_CalcParams() {
	C012_AfterClass_Jennifer_HasEgg = ActorHasInventory("VibratingEgg");
	C012_AfterClass_Jennifer_HasBelt = ActorHasInventory("ChastityBelt");
	C012_AfterClass_Jennifer_IsNaked = (ActorGetValue(ActorCloth) == "Naked");
	C012_AfterClass_Jennifer_IsGagged = ActorIsGagged();
	C012_AfterClass_Jennifer_IsRoped = (ActorHasInventory("Rope") || ActorHasInventory("TwoRopes") || ActorHasInventory("ThreeRopes"));
	C012_AfterClass_Jennifer_IsStrapped = ActorHasInventory("Armbinder");
	C012_AfterClass_Jennifer_PleasurePlayerAvail = (!Common_PlayerChaste && !ActorIsGagged() && !ActorIsRestrained() && Common_ActorIsOwned && !GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm"));
	C012_AfterClass_Jennifer_SexAvail = (!Common_PlayerRestrained && !Common_PlayerChaste && !GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm") && !GameLogQuery(CurrentChapter, "Jennifer", "NextPossibleOrgasm") && !GameLogQuery(CurrentChapter, "Player", "AmandaAndSarahInBed"));
	if (GameLogQuery(CurrentChapter, "", "EventBlockChanging") && (C012_AfterClass_Dorm_Guest.indexOf(Common_PlayerOwner) >= 0) && !Common_PlayerNaked) C012_AfterClass_Jennifer_SexAvail = false;
	C012_AfterClass_Jennifer_CanMasturbate = (!Common_PlayerRestrained && !C012_AfterClass_Jennifer_HasBelt && (ActorGetValue(ActorCloth) == "Naked"));	
	C012_AfterClass_Jennifer_CanKickOut = (!Common_ActorIsOwner && !Common_ActorIsLover);
	C012_AfterClass_Jennifer_AllowTennisOutfit = (GameLogQuery("C007_LunchBreak", CurrentActor, "Lunch") || GameLogQuery("C012_AfterClass", CurrentActor, "Running") || GameLogQuery("C012_AfterClass", CurrentActor, "SubTraining"));
	C012_AfterClass_Jennifer_AllowSwimsuit = GameLogQuery("C012_AfterClass", CurrentActor, "EnterDormFromPool");
	C012_AfterClass_Jennifer_AllowTraining = GameLogQuery("C012_AfterClass", CurrentActor, "UnlockTraining");
	C012_AfterClass_Jennifer_SetPose();
}

// Chapter 12 After Class - Jennifer Load
function C012_AfterClass_Jennifer_Load() {
	
	// Loads the scene
	LoadInteractions();
	ActorLoad("Jennifer", "Dorm");
	Common_PlayerPose = "";
	if (C012_AfterClass_Jennifer_CurrentStage == 3915) Common_PlayerPose = "FoldPunishment";

	// Jennifer's parameters
	C012_AfterClass_Jennifer_CalcParams();	
	C012_AfterClass_Jennifer_ChatAvail = !GameLogQuery(CurrentChapter, CurrentActor, "ChatDone");
	C012_AfterClass_Jennifer_SpankMaxCount = 10 - Math.floor(ActorGetValue(ActorLove) / 7);
	if (C012_AfterClass_Jennifer_SpankMaxCount < 6) C012_AfterClass_Jennifer_SpankMaxCount = 6;
	if (C012_AfterClass_Jennifer_SpankMaxCount > 12) C012_AfterClass_Jennifer_SpankMaxCount = 12;
	
	// Loads the previous text if needed
	if (C012_AfterClass_Jennifer_IntroText != "") {
		OverridenIntroText = C012_AfterClass_Jennifer_IntroText;
		C012_AfterClass_Jennifer_IntroText = "";
	} else {
		
		// If the player is grounded
		if (GameLogQuery(CurrentChapter, "", "EventGrounded")) {
			
			// Skip to the punishment end phase, no talking while being grounded
			C012_AfterClass_Jennifer_AllowLeave();
			C012_AfterClass_Jennifer_CurrentStage = 3999;
			C012_AfterClass_Dorm_SetPunishmentPose();

		} else {

			// A random event can be triggered when Jennifer is clicked on
			if (C012_AfterClass_Jennifer_CurrentStage == 0)
				if ((CurrentText != null) && (Math.floor(Math.random() * 8) == 0))
					if (!GameLogQuery(CurrentChapter, CurrentActor, "EventGeneric") && Common_ActorIsOwner)
						C012_AfterClass_Jennifer_RandomJenniferDommeEvent();

		}

	}

}

// Chapter 12 After Class - Jennifer Run
function C012_AfterClass_Jennifer_Run() {

	// The curfew 22 option isn't available after 22
	C012_AfterClass_Jennifer_CanSetCurfew22 = (CurrentTime < 22 * 60 * 60 * 1000);
	BuildInteraction(C012_AfterClass_Jennifer_CurrentStage);

	// Draw the watching actors for ceremonies
	if (((C012_AfterClass_Jennifer_CurrentStage >= 320) && (C012_AfterClass_Jennifer_CurrentStage < 340)) || ((C012_AfterClass_Jennifer_CurrentStage >= 290) && (C012_AfterClass_Jennifer_CurrentStage < 300))) C012_AfterClass_Dorm_DrawOtherActors();

	// Draw the actor alone or with the player depending on the stage
	if ((C012_AfterClass_Jennifer_CurrentStage != 3201) && (C012_AfterClass_Jennifer_CurrentStage != 3211) && (C012_AfterClass_Jennifer_CurrentStage != 632) && (C012_AfterClass_Jennifer_CurrentStage != 633) && (C012_AfterClass_Jennifer_CurrentStage != 634) && (C012_AfterClass_Jennifer_CurrentStage != 791) && (C012_AfterClass_Jennifer_CurrentStage != 194) && (C012_AfterClass_Jennifer_CurrentStage != 540) && (C012_AfterClass_Jennifer_CurrentStage != 550) && (C012_AfterClass_Jennifer_CurrentStage != 560) && (C012_AfterClass_Jennifer_CurrentStage != 591) && (C012_AfterClass_Jennifer_CurrentStage != 592) && (C012_AfterClass_Jennifer_CurrentStage != 593) && (C012_AfterClass_Jennifer_CurrentStage != 810) && (C012_AfterClass_Jennifer_CurrentStage != 820) && (C012_AfterClass_Jennifer_CurrentStage != 830) && (C012_AfterClass_Jennifer_CurrentStage != 840)) {
		if (((C012_AfterClass_Jennifer_CurrentStage >= 3090) && (C012_AfterClass_Jennifer_CurrentStage <= 3099)) || ((C012_AfterClass_Jennifer_CurrentStage >= 3901) && (C012_AfterClass_Jennifer_CurrentStage <= 3999))) {
			DrawActor("Player", 475, 0, 1);
			DrawActor(CurrentActor, 750, 0, 1);
		} else {
			DrawInteractionActor();
			if ((C012_AfterClass_Jennifer_CurrentStage >= 321) && (C012_AfterClass_Jennifer_CurrentStage < 340)) DrawActor("Player", 600, 100, 1);
		}
	}
	
}

// Chapter 12 After Class - Jennifer Click
function C012_AfterClass_Jennifer_Click() {

	// Regular interactions
	ClickInteraction(C012_AfterClass_Jennifer_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if ((ClickInv == "Player") && (LeaveIcon == "Leave")) {
		C012_AfterClass_Jennifer_IntroText = OverridenIntroText;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}
	
	// Jennifer can be restrained on stage 0 and 10
	if ((C012_AfterClass_Jennifer_CurrentStage <= 10) && (ClickInv != "") && (ClickInv != "Player") && !Common_PlayerRestrained) {
		
		// Jennifer becomes more submissive from the crop
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

		// Jennifer will turn the tables on the player if -5 submission or less
		if ((ActorGetValue(ActorSubmission) <= -5) && !ActorIsRestrained() && !ActorIsGagged() && (ClickInv != "CuffsKey")) {
			PlayerRandomRestrain();
			if (Common_PlayerRestrained) {
				PlayerRandomGag();
				if (Common_ActorIsOwner) {
					EventSetGenericTimer();
					OverridenIntroText = GetText("TurnTablesFromMistress");
				}
				else OverridenIntroText = GetText("TurnTables");
				C012_AfterClass_Jennifer_CalcParams();
				CurrentTime = CurrentTime + 50000;
			} else OverridenIntroText = GetText("RefuseBondage");
			return;
		}

		// Jennifer will refuse any bondage if 4 submission or less
		if ((ActorGetValue(ActorSubmission) < 5) && !ActorIsRestrained() && !ActorIsGagged() && (ClickInv != "CuffsKey")) {
			OverridenIntroText = GetText("RefuseBondage");
			return;
		}
		
		// Jennifer can only wear the belt if she's naked
		if (!ActorIsChaste() && (ActorGetValue(ActorCloth) != "Naked") && (ClickInv == "ChastityBelt")) {
			OverridenIntroText = GetText("NakedForBelt");
			return;
		}

		// A second rope can be applied if Jennifer isn't fully clothed
		if ((ActorGetValue(ActorCloth) != "Naked") && (ActorGetValue(ActorCloth) != "Underwear") && (ClickInv == "Rope") && (ActorHasInventory("Rope"))) {
			OverridenIntroText = GetText("StripForSecondRope");
			return;
		}
		
		// Apply the clicked restrain
		ActorApplyRestrain(ClickInv);
		C012_AfterClass_Jennifer_CalcParams();

	}	

}

// Chapter 12 After Class - Jennifer can make love with the player if (Love + seduction * 2) >= 12 or >= 25 on the next time or Jennifer is the player girlfriend/submissive
function C012_AfterClass_Jennifer_GaggedAnswer() {
	if (ActorIsGagged()) {
		var GagTalk = Math.floor(Math.random() * 8) + 1;
		OverridenIntroText = GetText("GaggedAnswer" + GagTalk.toString());		
	}
}

// Chapter 12 After Class - Jennifer can make love with the player if (Love + seduction * 2) >= 12 on the next time or Jennifer is the player girlfriend/submissive
function C012_AfterClass_Jennifer_TestSex() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained()) {
			if (!ActorIsChaste()) {
				var LoveChance = ActorGetValue(ActorLove) + PlayerGetSkillLevel("Seduction") * 2;
				if ((LoveChance >= 12) || Common_ActorIsLover || Common_ActorIsOwned) {
					C012_AfterClass_Jennifer_CurrentStage = 650;
					OverridenIntroText = "";
				}
			} else OverridenIntroText = GetText("UnlockBeltBeforeSex");
		} else OverridenIntroText = GetText("ReleaseBeforeTalk");
	} else C012_AfterClass_Jennifer_GaggedAnswer();
}

// Chapter 12 After Class - Jennifer can be dated at +20 love
function C012_AfterClass_Jennifer_TestLove() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained() && !Common_PlayerRestrained) {
			if (!Common_PlayerNaked && (ActorGetValue(ActorCloth) != "Naked")) {
				if (ActorGetValue(ActorLove) >= 20) {
					ActorSetPose("");
					C012_AfterClass_Jennifer_CurrentStage = 100;
					OverridenIntroText = "";
				}
			} else OverridenIntroText = GetText("CantDateWhileNaked");
		} else OverridenIntroText = GetText("CantDateWhileRestrained");
	} else C012_AfterClass_Jennifer_GaggedAnswer();
}

// Chapter 12 After Class - Jennifer can be dominated at +20 submission
function C012_AfterClass_Jennifer_TestDomme() {
	if (PlayerHasInventory("Collar")) {
		if (!ActorIsGagged()) {
			if (ActorGetValue(ActorSubmission) >= 20) {
				C012_AfterClass_Jennifer_CurrentStage = 200;
				C012_AfterClass_Jennifer_RefuseSubmitCount = 0;
				OverridenIntroText = "";
				LeaveIcon = "";
			}
		} else C012_AfterClass_Jennifer_GaggedAnswer();
	} else OverridenIntroText = GetText("CollarToEnslave");
}

// Chapter 12 After Class - Jennifer can become the player Mistress at -20 submission
function C012_AfterClass_Jennifer_TestSub() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained() && !Common_PlayerRestrained) {
			if (ActorGetValue(ActorSubmission) <= -20) {
				if (Common_PlayerOwner == "") {
					if (!PlayerHasLockedInventory("Collar")) {
						C012_AfterClass_Jennifer_CurrentStage = 300;
						if (ActorGetValue(ActorCloth) != "Clothed") OverridenIntroText = GetText("ChangeForDommeSpeech");
						else OverridenIntroText = "";
						ActorSetCloth("Clothed");
						ActorSetPose("Dominant");
						LeaveIcon = "";
					} else OverridenIntroText = GetText("PlayerUncollarFirst");
				} else OverridenIntroText = GetText("AlreadyOwned");
			}
		} else OverridenIntroText = GetText("CantDateWhileRestrained");
	} else C012_AfterClass_Jennifer_GaggedAnswer();
}

// Chapter 12 After Class - The player can strip for Jennifer
function C012_AfterClass_Jennifer_PlayerStrip() {
	PlayerClothes("Naked");
	Common_PlayerPose = "BackShy";
}

// Chapter 12 After Class - The player can strip for Jennifer
function C012_AfterClass_Jennifer_SetPlayerPose(NewPose) {
	Common_PlayerPose = NewPose;
}

// Chapter 12 After Class - When the player gets collared
function C012_AfterClass_Jennifer_PlayerCollared() {
	LeaveIcon = "";
	Common_PlayerOwner = CurrentActor;
	Common_ActorIsOwner = true;
	PlayerLockInventory("Collar");
	CurrentTime = CurrentTime + 50000;
	EventSetGenericTimer();
}

// Chapter 12 After Class - When the player stands up after her collaring
function C012_AfterClass_Jennifer_PlayerStandUp() {
	Common_PlayerPose = "";
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - The player can trigger a random Domme event from Jennifer (3000 events)
function C012_AfterClass_Jennifer_RandomJenniferDommeEvent() {
	
	// Makes sure the next random event can be triggered
	if (!GameLogQuery(CurrentChapter, CurrentActor, "EventGeneric")) {

		// 1 event per 15 minutes maximum, the event is random and drawn from the Mistress pool
		EventSetGenericTimer();
		C012_AfterClass_Jennifer_CurrentStage = EventRandomPlayerSubmissive();

	}

	// If Jennifer doesn't respond, we end the scene right there
	if (C012_AfterClass_Jennifer_CurrentStage == 0) C012_AfterClass_Jennifer_AllowLeave();
	
}

// Chapter 12 After Class - As a Domme, Jennifer can force the player to change
function C012_AfterClass_Jennifer_ForceChangePlayer(NewCloth) {
	PlayerClothes(NewCloth);
	if (C012_AfterClass_Jennifer_CurrentStage < 3900) ActorSetPose("Happy");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - As a Domme, Jennifer can force the player into some random bondage
function C012_AfterClass_Jennifer_ForceRandomBondage(BondageType) {
	if ((BondageType == "Full") || (BondageType == "Gag")) {
		PlayerRandomGag();
		if (!Common_PlayerGagged && (BondageType == "Gag")) OverridenIntroText = GetText("CantFindRestrain");
	}
	if ((BondageType == "Full") || (BondageType == "Restrain")) {
		PlayerRandomRestrain();
		if (!Common_PlayerRestrained) OverridenIntroText = GetText("CantFindRestrain");
	}
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Jennifer can unbind the player on some events
function C012_AfterClass_Jennifer_TestUnbind() {

	// Bound and gagged, there's not much she can do
	if (ActorIsGagged() && ActorIsRestrained()) {
		C012_AfterClass_Jennifer_GaggedAnswer();
	}
	else {

		// Before the next event time, she will always refuse (skip is owned)
		if (!GameLogQuery(CurrentChapter, CurrentActor, "EventGeneric") || Common_ActorIsOwned) {
			
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

	}

}

// Chapter 12 After Class - When the player disobey, she can get punished
function C012_AfterClass_Jennifer_DoActivity(ActivityType, Enjoyment, BonusStage) {
	
	// Launch the activity, some can have a bonus stage
	if ((ActivityType == "PushUp") || (ActivityType == "SitUp")) PlayerClothes("Underwear");
	C012_AfterClass_Jennifer_CurrentStage = EventDoActivity(ActivityType, Enjoyment, C012_AfterClass_Jennifer_CurrentStage, 3290, BonusStage);

}

// Chapter 12 After Class - When the player disobey, she can get punished
function C012_AfterClass_Jennifer_TestPunish() {

	// The more love, the less chances the player will be punished
	if (EventRandomChance("Love")) {
		C012_AfterClass_Jennifer_AllowLeave();
	} else {
		ActorSetPose("Angry");
		OverridenIntroText = "";
		C012_AfterClass_Jennifer_CurrentStage = 3900;
	}

}

// Chapter 12 After Class - Allows the player to leave the scene
function C012_AfterClass_Jennifer_AllowLeave() {
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - Jennifer can confiscate the player keys
function C012_AfterClass_Jennifer_ConfiscateKeys() {
	PlayerRemoveInventory("CuffsKey", 99);
	GameLogAdd("HasCuffsKey");
	C012_AfterClass_Jennifer_AllowLeave();
}

// Chapter 12 After Class - Jennifer can confiscate the player crop(s)
function C012_AfterClass_Jennifer_ConfiscateCrop() {
	PlayerRemoveInventory("Crop", 99);
	GameLogAdd("HasCrop");
	C012_AfterClass_Jennifer_SetPose();
	C012_AfterClass_Jennifer_AllowLeave();
}

// Chapter 12 After Class - Jennifer can confiscate the player keys
function C012_AfterClass_Jennifer_BegForOrgasm(Begged) {
	
	// If the player begs for it, Jennifer will do it randomly based on love, if not it's based on hate
	if (EventRandomChance(Begged ? "Love" : "Hate")) {
		ActorAddOrgasm();
		EventLogEnd();
		OverridenIntroText = GetText(Begged ? "MasturbatePlayerOrgasm" : "MasturbatePlayerOrgasmForced");
		C012_AfterClass_Jennifer_CurrentStage = 3223;
	}

}

// Chapter 12 After Class - Jennifer will tell the player if she can change clothes or not
function C012_AfterClass_Jennifer_IsChangingBlocked() {
	if (GameLogQuery(CurrentChapter, CurrentActor, "EventBlockChanging"))
		OverridenIntroText = GetText("ChangingIsBlocked");
}

// Chapter 12 After Class - Jennifer will tell the player if she can change clothes or not
function C012_AfterClass_Jennifer_TestBlockChanging() {
	
	// The less love, the higher the chances Jennifer will block changing
	if (EventRandomChance("Hate")) {
		OverridenIntroText = "";
		GameLogAddTimer("EventBlockChanging", CurrentTime + 1000000 + Math.floor(Math.random() * 10000000));
		C012_AfterClass_Jennifer_CurrentStage = 3091;
	} else C012_AfterClass_Jennifer_AllowLeave();

}

// Chapter 12 After Class - Jennifer will tell the player if she can change clothes or not
function C012_AfterClass_Jennifer_ReleaseBeforePunish() {
	ActorSetPose("ReadyToPunish");
	if (Common_PlayerRestrained || Common_PlayerGagged) {
		if (Common_PlayerNaked) {
			C012_AfterClass_Jennifer_CurrentStage = 3903;		
			OverridenIntroText = GetText("ReleaseBeforePunishAlreadyNaked");
		}
		else OverridenIntroText = GetText("ReleaseBeforePunishNotNaked");
		PlayerReleaseBondage();
		CurrentTime = CurrentTime + 50000;
	} else {
		if (Common_PlayerNaked) {
			C012_AfterClass_Jennifer_CurrentStage = 3903;		
			OverridenIntroText = GetText("PunishSinceNaked");
		}		
	}
}

// Chapter 12 After Class - Set Jennifer Pose
function C012_AfterClass_Jennifer_ActorSetPose(NewPose) {
	ActorSetPose(NewPose);
}

// Chapter 12 After Class - Starts the punishment
function C012_AfterClass_Jennifer_StartPunishment() {
	C012_AfterClass_Jennifer_CurrentStage = EventRandomPlayerPunishment();
}

// Chapter 12 After Class - Jennifer can tie up the player with her own rope
function C012_AfterClass_Jennifer_RopePlayer() {
	PlayerLockInventory("Rope");
	PlayerRemoveInventory("Rope", 1);
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Jennifer can gag the player with her stuff
function C012_AfterClass_Jennifer_GagPlayer() {
	PlayerRandomGag();
	if (!Common_PlayerGagged) PlayerLockInventory("ClothGag");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Jennifer can use the egg on the player
function C012_AfterClass_Jennifer_InsertEgg() {
	PlayerLockInventory("VibratingEgg");
	PlayerRemoveInventory("VibratingEgg", 1);
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Ends the punishment and sets the duration between 30 minutes and 1.5 hours
function C012_AfterClass_Jennifer_EndPunishment(PunishmentType) {
	if (PunishmentType == "SleepBoundAndGagged") GameLogAdd("Event" + PunishmentType);
	else GameLogAddTimer("Event" + PunishmentType, CurrentTime + 1800000 + Math.floor(Math.random() * 3600000));
	EventSetGenericTimer();
	C012_AfterClass_Jennifer_AllowLeave();
}

// Chapter 12 After Class - Ends any bondage and resets the pose
function C012_AfterClass_Jennifer_ReleasePlayer() {
	Common_PlayerPose = "";
	EventSetGenericTimer();
	PlayerReleaseBondage();
	C012_AfterClass_Jennifer_AllowLeave();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Flags the chat as done and doesn't allow the player to leave
function C012_AfterClass_Jennifer_StartChat() {
	if (!ActorIsGagged()) {
		ActorSetPose("");
		C012_AfterClass_Jennifer_CurrentStage = 500;
		GameLogAdd("ChatDone");
		LeaveIcon = "";
		C012_AfterClass_Jennifer_ChatAvail = false;
	} else C012_AfterClass_Jennifer_GaggedAnswer();
}

// Chapter 12 After Class - Flags the chat as done and doesn't allow the player to leave
function C012_AfterClass_Jennifer_StartTraining() {
	ActorSetPose("");
	LeaveIcon = "";
}

// Chapter 12 After Class - When Jennifer locks the belt on the player
function C012_AfterClass_Jennifer_LockChastityBelt() {
	PlayerLockInventory("ChastityBelt");
	PlayerRemoveInventory("ChastityBelt", 1);
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When Jennifer spanks the player
function C012_AfterClass_Jennifer_JenniferSpankPlayer() {
	C012_AfterClass_Jennifer_SpankCount++;
	if (C012_AfterClass_Jennifer_SpankCount > C012_AfterClass_Jennifer_SpankMaxCount) {
		C012_AfterClass_Jennifer_CurrentStage = 3933;
		OverridenIntroText = "";
		OverridenIntroImage = "";
	} else {
		OverridenIntroText = GetText("SpankPlayer" + C012_AfterClass_Jennifer_SpankCount.toString());
		var Img = (C012_AfterClass_Jennifer_SpankCount % 2).toString();
		if ((C012_AfterClass_Jennifer_SpankCount < 5) && !Common_PlayerChaste) OverridenIntroImage = "JenniferSpankPlayer" + Img + ".jpg";
		if ((C012_AfterClass_Jennifer_SpankCount >= 5) && !Common_PlayerChaste) OverridenIntroImage = "JenniferSpankPlayerRedButt" + Img + ".jpg";
		if ((C012_AfterClass_Jennifer_SpankCount < 5) && Common_PlayerChaste) OverridenIntroImage = "JenniferSpankPlayerChastity" + Img + ".jpg";
		if ((C012_AfterClass_Jennifer_SpankCount >= 5) && Common_PlayerChaste) OverridenIntroImage = "JenniferSpankPlayerChastityRedButt" + Img + ".jpg";
	}
}

// Chapter 12 After Class - The player can ask Jennifer to change clothes
function C012_AfterClass_Jennifer_TestChange() {
	if (!ActorIsRestrained()) {
		if ((ActorGetValue(ActorLove) >= 10) || (ActorGetValue(ActorSubmission) >= 10) || Common_ActorIsOwned || Common_ActorIsLover) {
			if (Common_ActorIsOwned) OverridenIntroText = GetText("AcceptChangeFromMistress");
			else 
				if (Common_ActorIsLover) OverridenIntroText = GetText("AcceptChangeFromLover");
				else OverridenIntroText = GetText("AcceptChange");
			C012_AfterClass_Jennifer_CurrentStage = 600;
		}
		C012_AfterClass_Jennifer_GaggedAnswer();
	} else OverridenIntroText = GetText("CannotActWhileRestrained");
}

// Chapter 12 After Class - Jennifer can change clothes when the player asks for it
function C012_AfterClass_Jennifer_ForceChangeActor(NewCloth) {
	if (ActorGetValue(ActorCloth) != NewCloth) {
		ActorSetCloth(NewCloth);
		C012_AfterClass_Jennifer_CalcParams();
		CurrentTime = CurrentTime + 50000;
	} else OverridenIntroText = GetText("NoNeedToChange");
	C012_AfterClass_Jennifer_GaggedAnswer();
}

// Chapter 12 After Class - When the player gives up on enslaving Jennifer
function C012_AfterClass_Jennifer_EndEnslaveJennifer() {
	C012_AfterClass_Jennifer_CalcParams();
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - Release Jennifer from any restrain before her collaring
function C012_AfterClass_Jennifer_EnslaveRelease() {
	ActorUntie();
	if (ActorHasInventory("Cuffs")) { PlayerAddInventory("Cuffs", 1); ActorRemoveInventory("Cuffs"); }
	if (ActorGetValue(ActorCloth) == "Naked") {
		C012_AfterClass_Jennifer_CurrentStage = 291;
		ActorSetPose("Shy");
	}
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Jennifer gets naked for her collaring
function C012_AfterClass_Jennifer_EnslaveStrip() {
	ActorSetCloth("Naked");
	ActorSetPose("Shy");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Jennifer can be ungagged
function C012_AfterClass_Jennifer_Ungag() {
	ActorUngag();
	C012_AfterClass_Jennifer_CalcParams();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Jennifer can be untied
function C012_AfterClass_Jennifer_Untie() {
	ActorUntie();
	C012_AfterClass_Jennifer_CalcParams();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When Jennifer gets collared
function C012_AfterClass_Jennifer_LockCollarJennifer() {
	ActorSetOwner("Player");
	PlayerRemoveInventory("Collar", 1);
	C012_AfterClass_Jennifer_CalcParams();
	ActorSetPose("Kneel");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - The player can decide how Jennifer will spend her evening
function C012_AfterClass_Jennifer_SetCurfew(CurfewType) {
	GameLogAddTimer("CurfewStay", -1);
	GameLogAddTimer("Curfew22", -1);
	GameLogAddTimer("Curfew24", -1);
	GameLogAddTimer("CurfewNone", -1);
	GameLogAdd("Curfew" + CurfewType);
}

// Chapter 12 After Class - The player can decide how Jennifer will spend her evening
function C012_AfterClass_Jennifer_BackToDorm() {
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Starts the pleasure player scene
function C012_AfterClass_Jennifer_TestPleasurePlayer() {
	LeaveIcon = "";
	if (ActorGetValue(ActorCloth) == "Naked") C012_AfterClass_Jennifer_CurrentStage = 631;
}

// Chapter 12 After Class - When Jennifer starts pleasuring the player (starts to count at 2 with a vibrating egg)
function C012_AfterClass_Jennifer_StartPleasurePlayer() {
	PlayerClothes("Naked");
	if (ActorIsChaste()) OverridenIntroImage = "JenniferPleasurePlayerChastity.jpg";
	else OverridenIntroImage = "JenniferPleasurePlayer.jpg";
	CurrentTime = CurrentTime + 50000;
	if (PlayerHasLockedInventory("VibratingEgg")) C012_AfterClass_Jennifer_PleasurePlayerCount = 2;
	else C012_AfterClass_Jennifer_PleasurePlayerCount = 0;
	C012_AfterClass_Jennifer_PleasurePlayerSpeed = 0;
}

// Chapter 12 After Class - When Jennifer pleasures the player
function C012_AfterClass_Jennifer_PleasurePlayer() {
	
	// The more it progresses, the faster Jennifer must go
	CurrentTime = CurrentTime + 50000;
	var StartCount = C012_AfterClass_Jennifer_PleasurePlayerCount;
	if ((C012_AfterClass_Jennifer_PleasurePlayerCount >= 0) && (C012_AfterClass_Jennifer_PleasurePlayerCount <= 1) && (C012_AfterClass_Jennifer_PleasurePlayerSpeed == 0)) C012_AfterClass_Jennifer_PleasurePlayerCount++;
	if ((C012_AfterClass_Jennifer_PleasurePlayerCount >= 2) && (C012_AfterClass_Jennifer_PleasurePlayerCount <= 3) && (C012_AfterClass_Jennifer_PleasurePlayerSpeed == 1)) C012_AfterClass_Jennifer_PleasurePlayerCount++;
	if ((C012_AfterClass_Jennifer_PleasurePlayerCount >= 4) && (C012_AfterClass_Jennifer_PleasurePlayerCount <= 9) && (C012_AfterClass_Jennifer_PleasurePlayerSpeed == 2)) C012_AfterClass_Jennifer_PleasurePlayerCount++;
	
	// At 6 counts, an orgasm is achieved, the next one will be slower
	if (C012_AfterClass_Jennifer_PleasurePlayerCount >= 6) {
		OverridenIntroText = GetText("OrgasmFromJenniferPleasure");
		ActorAddOrgasm();
		GameLogSpecificAddTimer(CurrentChapter, "Player", "NextPossibleOrgasm", PlayerHasLockedInventory("VibratingEgg") ? CurrentTime + 1800000 : CurrentTime + 3600000);
		if (ActorIsChaste()) OverridenIntroImage = "JenniferPleasurePlayerChastityOrgasm.jpg";
		else OverridenIntroImage = "JenniferPleasurePlayerOrgasm.jpg";
		C012_AfterClass_Jennifer_CurrentStage = 634;
		C012_AfterClass_Jennifer_PleasurePlayerCount = 0;
		C012_AfterClass_Jennifer_PleasurePlayerSpeed = 0;
	} else {
		if (StartCount == C012_AfterClass_Jennifer_PleasurePlayerCount) OverridenIntroText = GetText("PleasureFromJenniferNoProgress");
	}
	
}

// Chapter 12 After Class - When Jennifer pleasures the player and is forced in a new position or speed
function C012_AfterClass_Jennifer_PleasurePlayerSetSpeed(SpeedFactor) {
	C012_AfterClass_Jennifer_PleasurePlayerSpeed = C012_AfterClass_Jennifer_PleasurePlayerSpeed + SpeedFactor;
	if (C012_AfterClass_Jennifer_PleasurePlayerSpeed < 0) C012_AfterClass_Jennifer_PleasurePlayerSpeed = 0;
	if (C012_AfterClass_Jennifer_PleasurePlayerSpeed > 2) C012_AfterClass_Jennifer_PleasurePlayerSpeed = 2;
}

// Chapter 12 After Class - When Jennifer stops pleasuring the player
function C012_AfterClass_Jennifer_StopPleasureFromJennifer() {
	OverridenIntroImage = "";
}

// Chapter 12 After Class - When Jennifer pleasures for the player ends
function C012_AfterClass_Jennifer_EndPleasureFromJennifer(LoveFactor, SubFactor) {
	if (!GameLogQuery(CurrentChapter, CurrentActor, "PleasureFromJennifer")) {
		GameLogAdd("PleasureFromJennifer");
		ActorChangeAttitude(LoveFactor, SubFactor);
	}
	C012_AfterClass_Jennifer_EndEnslaveJennifer();
}

// Chapter 12 After Class - When the player kisses Jennifer
function C012_AfterClass_Jennifer_Kiss() {
	CurrentTime = CurrentTime + 50000;	
	if (Common_ActorIsOwner) OverridenIntroText = GetText("KissJenniferOwner");
	else if (C012_AfterClass_Jennifer_IsGagged) OverridenIntroText = GetText("KissJenniferGagged");
	else if (!GameLogQuery(CurrentChapter, CurrentActor, "Kiss")) {
		GameLogAdd("Kiss");
		if (PlayerGetSkillLevel("Seduction") > 0) {
			ActorChangeAttitude(PlayerGetSkillLevel("Seduction"), 0);
			OverridenIntroText = GetText("KissJenniferSeduction");
		}
	}
}

// Chapter 12 After Class - When the player spanks Jennifer, with the fighting skill it can affect her submission level
function C012_AfterClass_Jennifer_Spank() {
	CurrentTime = CurrentTime + 50000;
	if (PlayerGetSkillLevel("Fighting") > 0) {
		OverridenIntroText = GetText("SpankWithStrength");
		if (!GameLogQuery(CurrentChapter, CurrentActor, "Spank")) {
			GameLogAdd("Spank");
			ActorChangeAttitude(0, PlayerGetSkillLevel("Fighting"));
		}
	}
}

// Chapter 12 After Class - When the player tickles Jennifer, it doesn't affect her
function C012_AfterClass_Jennifer_Tickle() {
	if ((Common_ActorIsOwner || (ActorGetValue(ActorSubmission) <= -5)) && !ActorIsRestrained()) OverridenIntroText = GetText("NoTickling");
	else CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When the player starts to masturbate Jennifer
function C012_AfterClass_Jennifer_StartMasturbate() {
	if ((ActorGetValue(ActorLove) >= 10) || (ActorGetValue(ActorSubmission) >= 10) || (ActorIsRestrained())) {
		CurrentTime = CurrentTime + 50000;
		if (!GameLogQuery(CurrentChapter, CurrentActor, "NextPossibleOrgasm")) {
			C012_AfterClass_Jennifer_MasturbateCount = 0;
			C012_AfterClass_Jennifer_CurrentStage = 640;
			OverridenIntroText = GetText("StartMasturbateJennifer");
			LeaveIcon = "";
			if (!ActorIsRestrained()) ActorSetPose("StandPleasure");
		} else OverridenIntroText = GetText("MasturbateNotInTheMood");
	}
}

// Chapter 12 After Class - When the player masturbates Jennifer
function C012_AfterClass_Jennifer_Masturbate(Factor) {
	CurrentTime = CurrentTime + 50000;
	C012_AfterClass_Jennifer_MasturbateCount = C012_AfterClass_Jennifer_MasturbateCount + Factor;
	if (C012_AfterClass_Jennifer_MasturbateCount < 0) C012_AfterClass_Jennifer_MasturbateCount = 0;
	if (C012_AfterClass_Jennifer_MasturbateCount >= 5) {
		C012_AfterClass_Jennifer_CurrentStage = 641;
		OverridenIntroText = GetText("ReadyForOrgasm");
	}
}

// Chapter 12 After Class - When Jennifer is masturbated to an orgasm
function C012_AfterClass_Jennifer_JenniferOrgasm() {
	CurrentTime = CurrentTime + 50000;
	ActorAddOrgasm();
	if (!GameLogQuery(CurrentChapter, CurrentActor, "NextPossibleOrgasm")) {
		GameLogSpecificAddTimer(CurrentChapter, CurrentActor, "NextPossibleOrgasm", ActorHasInventory("VibratingEgg") ? CurrentTime + 3600000 : CurrentTime + 7200000);
		ActorChangeAttitude(2, -1);
	}
}

// Chapter 12 After Class - When Jennifer is masturbated to an orgasm
function C012_AfterClass_Jennifer_JenniferDeniedOrgasm() {
	CurrentTime = CurrentTime + 50000;
	if (!GameLogQuery(CurrentChapter, CurrentActor, "OrgasmDeniedFromMasturbation")) {
		GameLogAdd("OrgasmDeniedFromMasturbation");
		ActorChangeAttitude(-2, 1);
	}
	C012_AfterClass_Jennifer_EndEnslaveJennifer();
}

// Chapter 12 After Class - Tests if the player is already dating someone else
function C012_AfterClass_Jennifer_TestRelationship() {
	if (GameLogQuery(CurrentChapter, CurrentActor, "LoverBreakUp")) {
		OverridenIntroText = GetText("AlreadyBrokeUp");
		C012_AfterClass_Jennifer_CurrentStage = 0;
	} else {
		if (Common_PlayerLover != "") {
			OverridenIntroText = GetText("AlreadyLoved");
			C012_AfterClass_Jennifer_CurrentStage = 105;
		}
	}
}

// Chapter 12 After Class - Start Dating Jennifer
function C012_AfterClass_Jennifer_StartDating() {
	CurrentTime = CurrentTime + 50000;
	Common_PlayerLover = "Jennifer";
	Common_ActorIsLover = true;
	C012_AfterClass_Jennifer_AllowSexAfterDate = (!Common_PlayerChaste && !ActorIsChaste());
}

// Chapter 12 After Class - Start Dating Jennifer
function C012_AfterClass_Jennifer_BothNaked() {
	ActorSetCloth("Naked");
	PlayerClothes("Naked");
	C012_AfterClass_Jennifer_CalcParams();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Get in bed with Jennifer to make love
function C012_AfterClass_Jennifer_MakeLove() {
	CurrentTime = CurrentTime + 50000;
	ActorSetCloth("Naked");
	PlayerClothes("Naked");
	C012_AfterClass_Bed_Partner = "Jennifer";
	SetScene(CurrentChapter, "Bed");
}

// Chapter 12 After Class - Test if the player can start the serious dialog
function C012_AfterClass_Jennifer_TestTalk() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained()) C012_AfterClass_Jennifer_CurrentStage = 20;
		else OverridenIntroText = GetText("ReleaseBeforeTalk");
	} else C012_AfterClass_Jennifer_GaggedAnswer();	
}

// Chapter 12 After Class - When the player breaks up with Jennifer
function C012_AfterClass_Jennifer_BreakUp() {
	GameLogAdd("LoverBreakUp");
	Common_PlayerLover = "";
	Common_ActorIsLover = false;
	ActorSetPose("");
	LeaveIcon = "";
}

// Chapter 12 After Class - When Jennifer leaves the room after the break up
function C012_AfterClass_Jennifer_JenniferLeave() {
	CurrentActor = "";
	LeaveIcon = "Leave";
	C012_AfterClass_Dorm_Guest.splice("Jennifer");
}

// Chapter 12 After Class - When Jennifer is kicked out, it can destroy the players couple
function C012_AfterClass_Jennifer_KickedOut() {
	GameLogAdd("KickedOutFromDorm");
	if (CurrentActor == Common_PlayerLover) {
		ActorChangeAttitude(-5, 0);
		C012_AfterClass_Jennifer_BreakUp();
	}
	CurrentActor = "";
}

// Chapter 12 After Class - When Jennifer brings the player out naked to be humiliated
function C012_AfterClass_Jennifer_StartPlayerHumiliation() {
	SetScene(CurrentChapter, "Humiliation");
}

// Chapter 12 After Class - When the player and Jennifer starts to train in fighting
function C012_AfterClass_Jennifer_StartFight() {
	CurrentTime = CurrentTime + 50000;
	ActorSetCloth("Clothed");
	PlayerClothes("Clothed");
}

// Chapter 12 After Class - Pick a winner in a fight against Jennifer (25% to win + 25% per level in fighting + 2% per domination point)
function C012_AfterClass_Jennifer_Fight(AutoLose) {
	CurrentTime = CurrentTime + 50000;
	var P = 25 + (PlayerGetSkillLevel("Fighting") * 25) + (ActorGetValue(ActorSubmission) * 2);
	if ((Math.floor(Math.random() * 100) < P) && !AutoLose) {
		if (C012_AfterClass_Jennifer_CurrentStage < 590) C012_AfterClass_Jennifer_CurrentStage = 560;
		if (C012_AfterClass_Jennifer_CurrentStage >= 590) C012_AfterClass_Jennifer_CurrentStage = 593;
		OverridenIntroText = GetText("WinFightAgainstJennifer");
		if (!GameLogQuery(CurrentChapter, CurrentActor, "UnlockTraining")) ActorChangeAttitude(0, 2);
	}
}

// Chapter 12 After Class - Unlocks the training option with Jennifer
function C012_AfterClass_Jennifer_UnlockTraining() {
	GameLogAdd("UnlockTraining");
	C012_AfterClass_Jennifer_AllowTraining = true;
	C012_AfterClass_Jennifer_AllowLeave();
}

// Chapter 12 After Class - Jennifer will refuse to submit after 2 strikes
function C012_AfterClass_Jennifer_RefuseSubmit() {
	C012_AfterClass_Jennifer_RefuseSubmitCount++;
}

// Chapter 12 After Class - Jennifer will accept the collar below 2 strikes
function C012_AfterClass_Jennifer_TestEnslave() {
	if (C012_AfterClass_Jennifer_RefuseSubmitCount <= 1) {
		C012_AfterClass_Jennifer_CurrentStage = 290;
		OverridenIntroText = GetText("AcceptCollar");
	} else C012_AfterClass_Jennifer_EndEnslaveJennifer();
}

// Chapter 12 After Class - Jennifer changes to her tennis outfit to train
function C012_AfterClass_Jennifer_ChangeToTrain() {
	if (ActorGetValue(ActorCloth) != "Tennis") {
		CurrentTime = CurrentTime + 50000;
		ActorSetCloth("Tennis");
		OverridenIntroText = GetText("TennisToTrain");
	}
}

// Chapter 12 After Class - Jennifer loves when the player trains her, it raises the love level
function C012_AfterClass_Jennifer_SubTraining() {
	CurrentTime = CurrentTime + 110000;
	if (!GameLogQuery("C012_AfterClass", CurrentActor, "SubTraining")) {
		GameLogAdd("SubTraining");
		ActorChangeAttitude(1, 1);
	}
	C012_AfterClass_Jennifer_SubTrainingCount++;
	if (C012_AfterClass_Jennifer_SubTrainingCount % 12 == 11) ActorChangeAttitude(1, 0);
}