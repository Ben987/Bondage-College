var C012_AfterClass_Sidney_CurrentStage = 0;
var C012_AfterClass_Sidney_IntroText = "";
var C012_AfterClass_Sidney_HasEgg = false;
var C012_AfterClass_Sidney_HasBelt = false;
var C012_AfterClass_Sidney_ChatAvail = false;
var C012_AfterClass_Sidney_SpankCount = 0;
var C012_AfterClass_Sidney_EnslaveCount = 0;
var	C012_AfterClass_Sidney_IsGagged = false;
var	C012_AfterClass_Sidney_IsRoped = false;
var	C012_AfterClass_Sidney_IsStrapped = false;
var C012_AfterClass_Sidney_CanMasturbate = false;
var C012_AfterClass_Sidney_PusherDealAvail = false;
var C012_AfterClass_Sidney_PleasurePlayerAvail = false;
var C012_AfterClass_Sidney_SexAvail = false;
var C012_AfterClass_Sidney_PleasurePlayerCount = 0;
var C012_AfterClass_Sidney_PleasurePlayerSpeed = 0;
var C012_AfterClass_Sidney_MasturbateCount = 0;
var C012_AfterClass_Sidney_CanSetCurfew22 = false;
var C012_AfterClass_Sidney_AllowBlackLingerie = false;
var C012_AfterClass_Sidney_AllowPigCostume = false;
var C012_AfterClass_Sidney_AllowSexAfterDate = false;
var C012_AfterClass_Sidney_AmandaIsOwner = false;
var C012_AfterClass_Sidney_CanKickOut = false;

// Sidney can only check her cell phone if she's dressed
function C012_AfterClass_Sidney_CheckCellPhone() {
	if (((ActorGetValue(ActorCloth) == "Shorts") || (ActorGetValue(ActorCloth) == "BlackLingerie")) && !ActorHasInventory("Collar") && !ActorIsRestrained() && !ActorIsGagged()) ActorSetPose("CheckCellPhone");
	LeaveIcon = "Leave";
}

// In her shorts, Sidney can have many poses when she talks
function C012_AfterClass_Sidney_SetPose() {
	if ((ActorGetValue(ActorCloth) == "Shorts") && !ActorIsRestrained() && !ActorIsGagged()) {
		var Love = ActorGetValue(ActorLove);
		var Sub = ActorGetValue(ActorSubmission);	
		if ((Sub <= -10) && (Math.abs(Sub) >= Math.abs(Love))) ActorSetPose("Point");
		if ((Sub >= 10) && (Math.abs(Sub) >= Math.abs(Love))) ActorSetPose("Shy");
		if ((Love >= 10) && (Math.abs(Love) >= Math.abs(Sub))) ActorSetPose("Happy");
		if ((Love <= -10) && (Math.abs(Love) >= Math.abs(Sub))) ActorSetPose("Mad");
		if (Common_ActorIsOwned) ActorSetPose("Shy");
	} else {
		if ((ActorGetValue(ActorPose) != "Pig") || !ActorHasInventory("TwoRopes")) {
			ActorSetPose("");
			if ((ActorGetValue(ActorCloth) == "Naked") && !ActorIsRestrained() && !ActorIsGagged() && (ActorGetValue(ActorSubmission) >= 10)) ActorSetPose("Shy");
			if ((ActorGetValue(ActorCloth) == "BlackLingerie") && !ActorIsRestrained() && !ActorIsGagged() && (ActorGetValue(ActorLove) >= 10) && (ActorGetValue(ActorLove) > ActorGetValue(ActorSubmission))) ActorSetPose("Happy");
			if ((ActorGetValue(ActorCloth) == "BlackLingerie") && !ActorIsRestrained() && !ActorIsGagged() && (ActorGetValue(ActorSubmission) >= 10) && (ActorGetValue(ActorLove) <= ActorGetValue(ActorSubmission))) ActorSetPose("Point");
			if ((ActorGetValue(ActorCloth) == "BlackLingerie") && !ActorIsRestrained() && !ActorIsGagged() && (Common_ActorIsOwner)) ActorSetPose("Point");
		}
	}
}

// Calculate the scene parameters
function C012_AfterClass_Sidney_CalcParams() {
	C012_AfterClass_Sidney_HasEgg = ActorHasInventory("VibratingEgg");
	C012_AfterClass_Sidney_HasBelt = ActorHasInventory("ChastityBelt");
	C012_AfterClass_Sidney_IsGagged = ActorIsGagged();	
	C012_AfterClass_Sidney_IsRoped = (ActorHasInventory("Rope") || ActorHasInventory("TwoRopes") || ActorHasInventory("ThreeRopes"));
	C012_AfterClass_Sidney_IsStrapped = ActorHasInventory("Armbinder");
	C012_AfterClass_Sidney_PusherDealAvail = (!C012_AfterClass_Sidney_HasBelt && PlayerHasInventory("ChastityBelt") && GameLogQuery(CurrentChapter, "", "DebtChastityBelt") && !GameLogQuery(CurrentChapter, "", "DebtChastityBeltDone"));
	C012_AfterClass_Sidney_PleasurePlayerAvail = (!Common_PlayerChaste && !ActorIsGagged() && !ActorIsRestrained() && Common_ActorIsOwned && !GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm"));
	C012_AfterClass_Sidney_SexAvail = (!Common_PlayerRestrained && !Common_PlayerChaste && !GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm") && !GameLogQuery(CurrentChapter, "Sidney", "NextPossibleOrgasm") && !GameLogQuery(CurrentChapter, "Player", "AmandaAndSarahInBed"));
	if (GameLogQuery(CurrentChapter, "", "EventBlockChanging") && (C012_AfterClass_Dorm_Guest.indexOf(Common_PlayerOwner) >= 0) && !Common_PlayerNaked) C012_AfterClass_Sidney_SexAvail = false;
	C012_AfterClass_Sidney_CanMasturbate = (!Common_PlayerRestrained && !C012_AfterClass_Sidney_HasBelt && (ActorGetValue(ActorCloth) == "Naked"));	
	C012_AfterClass_Sidney_CanKickOut = (!Common_ActorIsOwner && !Common_ActorIsLover);
	C012_AfterClass_Sidney_AmandaIsOwner = (Common_PlayerOwner == "Amanda");
	C012_AfterClass_Sidney_AllowBlackLingerie = GameLogQuery(CurrentChapter, CurrentActor, "AllowBlackLingerie");
	C012_AfterClass_Sidney_AllowPigCostume = (GameLogQuery(CurrentChapter, CurrentActor, "AllowPigCostume") && !Common_PlayerRestrained);
	C012_AfterClass_Sidney_SetPose();
}

// Chapter 12 After Class - Sidney Load
function C012_AfterClass_Sidney_Load() {
	
	// Loads the scene
	LoadInteractions();
	ActorLoad("Sidney", "Dorm");
	Common_PlayerPose = "";
	if (C012_AfterClass_Sidney_CurrentStage == 3915) Common_PlayerPose = "TwoRopesPunishment";
	
	// At stage 400, Sidney is leaving
	if (C012_AfterClass_Sidney_CurrentStage == 400) { ActorUngag(); LeaveIcon = ""; }

	// Sidney's parameters
	C012_AfterClass_Sidney_CalcParams();	
	C012_AfterClass_Sidney_ChatAvail = !GameLogQuery(CurrentChapter, CurrentActor, "ChatDone");
	C012_AfterClass_Sidney_SpankCount = 0;
	C012_AfterClass_Sidney_SpankMaxCount = 10 - Math.floor(ActorGetValue(ActorLove) / 7);
	if (C012_AfterClass_Sidney_SpankMaxCount < 6) C012_AfterClass_Sidney_SpankMaxCount = 6;
	if (C012_AfterClass_Sidney_SpankMaxCount > 12) C012_AfterClass_Sidney_SpankMaxCount = 12;
	
	// Loads the previous text if needed
	if (C012_AfterClass_Sidney_IntroText != "") {
		OverridenIntroText = C012_AfterClass_Sidney_IntroText;
		C012_AfterClass_Sidney_IntroText = "";
	} else {
		
		// If the player is grounded
		if (GameLogQuery(CurrentChapter, "", "EventGrounded")) {
			
			// Skip to the punishment end phase, no talking while being grounded
			C012_AfterClass_Sidney_AllowLeave();
			C012_AfterClass_Sidney_CurrentStage = 3999;
			C012_AfterClass_Dorm_SetPunishmentPose();

		} else {

			// If there's a crossover between two actors
			if ((C012_AfterClass_Sidney_CurrentStage == 0) && !GameLogQuery(CurrentChapter, CurrentActor, "MetSarah") && (C012_AfterClass_Dorm_Guest.indexOf("Sarah") >= 0) && !Common_PlayerRestrained && !Common_PlayerGagged && !ActorIsGagged() && !ActorIsRestrained()) {
				LeaveIcon = "";
				if ((ActorGetValue(ActorCloth) == "Shorts") && !Common_ActorIsOwned) ActorSetPose("Point");
				else ActorSetPose("");
				C012_AfterClass_Sidney_CurrentStage = 710;
				GameLogAdd("MetSarah");
			}

			// If there's a crossover between two actors
			if ((C012_AfterClass_Sidney_CurrentStage == 0) && !GameLogQuery(CurrentChapter, CurrentActor, "MetAmanda") && (C012_AfterClass_Dorm_Guest.indexOf("Amanda") >= 0) && !Common_PlayerRestrained && !Common_PlayerGagged && !ActorIsGagged() && !ActorIsRestrained()) {
				LeaveIcon = "";
				if ((ActorGetValue(ActorCloth) == "Shorts") && !Common_ActorIsOwned) ActorSetPose("Point");
				else ActorSetPose("");
				C012_AfterClass_Sidney_CurrentStage = 700;
				GameLogAdd("MetAmanda");
			}
		
			// A random event can be triggered when Sidney is clicked on
			if (C012_AfterClass_Sidney_CurrentStage == 0)
				if ((CurrentText != null) && (Math.floor(Math.random() * 8) == 0)) {
					if (!GameLogQuery(CurrentChapter, CurrentActor, "EventGeneric") && Common_ActorIsOwner)
						C012_AfterClass_Sidney_RandomSidneyDommeEvent();
					if (!GameLogQuery(CurrentChapter, CurrentActor, "LingerieShow") && (C012_AfterClass_Sidney_CurrentStage == 0) && Common_ActorIsLover && !Common_PlayerGagged && !Common_PlayerRestrained && !ActorIsRestrained() && !ActorIsGagged()) {
						C012_AfterClass_Sidney_CurrentStage = 660;
						LeaveIcon = "";
					}
					if (GameLogQuery(CurrentChapter, CurrentActor, "AllowBlackLingerie") && (C012_AfterClass_Sidney_CurrentStage == 0) && Common_ActorIsLover && Common_ActorIsOwner && !ActorIsRestrained() && !ActorIsGagged() && (ActorGetValue(ActorCloth) != "BlackLingerie")) {
						C012_AfterClass_Sidney_CurrentStage = 670;
						LeaveIcon = "";
					}
				}

		}

	}

}

// Chapter 12 After Class - Sidney Run
function C012_AfterClass_Sidney_Run() {

	// The curfew 22 option isn't available after 22
	C012_AfterClass_Sidney_CanSetCurfew22 = (CurrentTime < 22 * 60 * 60 * 1000);
	BuildInteraction(C012_AfterClass_Sidney_CurrentStage);

	// Draw the watching actors for ceremonies
	if (((C012_AfterClass_Sidney_CurrentStage >= 340) && (C012_AfterClass_Sidney_CurrentStage < 400)) || ((C012_AfterClass_Sidney_CurrentStage >= 291) && (C012_AfterClass_Sidney_CurrentStage < 300))) C012_AfterClass_Dorm_DrawOtherActors();

	// Draw the actor alone or with the player depending on the stage
	if ((C012_AfterClass_Sidney_CurrentStage != 410) && (C012_AfterClass_Sidney_CurrentStage != 3931) && (C012_AfterClass_Sidney_CurrentStage != 3932) && (C012_AfterClass_Sidney_CurrentStage != 3933) && (C012_AfterClass_Sidney_CurrentStage != 632) && (C012_AfterClass_Sidney_CurrentStage != 633) && (C012_AfterClass_Sidney_CurrentStage != 634) && (C012_AfterClass_Sidney_CurrentStage != 662) && (C012_AfterClass_Sidney_CurrentStage != 663) && (C012_AfterClass_Sidney_CurrentStage != 791) && (C012_AfterClass_Sidney_CurrentStage != 194)) {
		if (((C012_AfterClass_Sidney_CurrentStage >= 3090) && (C012_AfterClass_Sidney_CurrentStage <= 3099)) || ((C012_AfterClass_Sidney_CurrentStage >= 3901) && (C012_AfterClass_Sidney_CurrentStage <= 3999))) {
			DrawActor("Player", 475, 0, 1);
			DrawActor(CurrentActor, 750, 0, 1);
		} else {
			DrawInteractionActor();
			if ((C012_AfterClass_Sidney_CurrentStage >= 340) && (C012_AfterClass_Sidney_CurrentStage < 400)) DrawActor("Player", 600, 100, 1);		
		}		
	}
	
}

// Chapter 12 After Class - Sidney Click
function C012_AfterClass_Sidney_Click() {

	// Regular interactions
	ClickInteraction(C012_AfterClass_Sidney_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if ((ClickInv == "Player") && (LeaveIcon == "Leave")) {
		C012_AfterClass_Sidney_IntroText = OverridenIntroText;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}
	
	// Sidney can be restrained on stage 0 and 10
	if ((C012_AfterClass_Sidney_CurrentStage <= 10) && (ClickInv != "") && (ClickInv != "Player") && !Common_PlayerRestrained) {
		
		// Sidney becomes more submissive from the crop
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

		// Sidney will turn the tables on the player if -5 submission or less
		if ((ActorGetValue(ActorSubmission) <= -5) && !ActorIsRestrained() && !ActorIsGagged() && (ClickInv != "CuffsKey")) {
			PlayerRandomRestrain();
			if (Common_PlayerRestrained) {
				PlayerRandomGag();
				if (Common_ActorIsOwner) {
					EventSetGenericTimer();
					OverridenIntroText = GetText("TurnTablesFromMistress");
				}
				else OverridenIntroText = GetText("TurnTables");
				C012_AfterClass_Sidney_CalcParams();
				CurrentTime = CurrentTime + 50000;
			} else OverridenIntroText = GetText("RefuseBondage");
			return;
		}

		// Sidney will refuse any bondage if 4 submission or less
		if ((ActorGetValue(ActorSubmission) < 5) && !ActorIsRestrained() && !ActorIsGagged() && (ClickInv != "CuffsKey")) {
			OverridenIntroText = GetText("RefuseBondage");
			return;
		}
		
		// Sidney can only wear the belt if she's naked
		if (!ActorIsChaste() && (ActorGetValue(ActorCloth) != "Naked") && (ClickInv == "ChastityBelt")) {
			OverridenIntroText = GetText("NakedForBelt");
			return;
		}

		// A second rope can be applied if Sidney isn't fully clothed
		if ((ActorGetValue(ActorCloth) != "Naked") && (ActorGetValue(ActorCloth) != "Underwear") && (ActorGetValue(ActorCloth) != "BlackLingerie") && (ClickInv == "Rope") && (ActorHasInventory("Rope"))) {
			OverridenIntroText = GetText("StripForSecondRope");
			return;
		}
		
		// Sidney cannot have 3 ropes if she's wearing the pig costume
		if ((ActorGetValue(ActorPose) == "Pig") && (ClickInv == "Rope"))
			return;
		
		// Apply the clicked restrain
		ActorApplyRestrain(ClickInv);
		C012_AfterClass_Sidney_CalcParams();

	}	

}

// Chapter 12 After Class - Sidney can make love with the player if (Love + seduction * 2) >= 12 or >= 25 on the next time or Sidney is the player girlfriend/submissive
function C012_AfterClass_Sidney_GaggedAnswer() {
	if (ActorIsGagged()) {
		var GagTalk = Math.floor(Math.random() * 8) + 1;
		OverridenIntroText = GetText("GaggedAnswer" + GagTalk.toString());		
	}
}

// Chapter 12 After Class - Sidney can make love with the player if (Love + seduction * 2) >= 12 on the next time or Sidney is the player girlfriend/submissive
function C012_AfterClass_Sidney_TestSex() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained()) {
			if (!ActorIsChaste()) {
				var LoveChance = ActorGetValue(ActorLove) + PlayerGetSkillLevel("Seduction") * 2;
				if ((LoveChance >= 12) || Common_ActorIsLover || Common_ActorIsOwned) {
					C012_AfterClass_Sidney_CurrentStage = 650;
					OverridenIntroText = "";
				}
			} else OverridenIntroText = GetText("UnlockBeltBeforeSex");
		} else OverridenIntroText = GetText("ReleaseBeforeTalk");
	} else C012_AfterClass_Sidney_GaggedAnswer();
}

// Chapter 12 After Class - Sidney can be dated at +20 love
function C012_AfterClass_Sidney_TestLove() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained() && !Common_PlayerRestrained) {
			if (!Common_PlayerNaked && (ActorGetValue(ActorCloth) != "Naked")) {
				if (ActorGetValue(ActorLove) >= 20) {
					ActorSetPose("");
					C012_AfterClass_Sidney_CurrentStage = 100;
					OverridenIntroText = "";
				}
			} else OverridenIntroText = GetText("CantDateWhileNaked");
		} else OverridenIntroText = GetText("CantDateWhileRestrained");
	} else C012_AfterClass_Sidney_GaggedAnswer();
}

// Chapter 12 After Class - Sidney can be dominated at +20 submission
function C012_AfterClass_Sidney_TestDomme() {
	if (PlayerHasInventory("Collar")) {
		if (!ActorIsGagged()) {
			if (ActorGetValue(ActorSubmission) >= 20) {
				if (!GameLogQuery(CurrentChapter, CurrentActor, "EnslaveDone")) {
					if (ActorIsRestrained()) C012_AfterClass_Sidney_EnslaveCount = 1;
					else C012_AfterClass_Sidney_EnslaveCount = 0;
					C012_AfterClass_Sidney_CurrentStage = 200;
					OverridenIntroText = "";
					LeaveIcon = "";
					GameLogAdd("EnslaveDone");
				} else OverridenIntroText = GetText("EnslaveAlreadyTried");
			}
		} else C012_AfterClass_Sidney_GaggedAnswer();
	} else OverridenIntroText = GetText("CollarToEnslave");
}

// Chapter 12 After Class - Sidney can become the player Mistress at -20 submission
function C012_AfterClass_Sidney_TestSub() {
	if (!ActorIsGagged()) {
		if (ActorGetValue(ActorSubmission) <= -20) {
			C012_AfterClass_Sidney_CurrentStage = 300;
			OverridenIntroText = "";
		}
	} else C012_AfterClass_Sidney_GaggedAnswer();
}

// Chapter 12 After Class - Tests if the player can submit (no restrains first)
function C012_AfterClass_Sidney_TestSubmit() {
	if (Common_PlayerOwner != "") {
		OverridenIntroText = GetText("AlreadyOwned");
	} else {
		if (ActorIsRestrained()) {
			OverridenIntroText = GetText("UnrestrainFirst");
		} else {
			if (ActorIsChaste()) {
				OverridenIntroText = GetText("UnchasteFirst");
			} else {
				if (PlayerHasLockedInventory("Collar")) {
					OverridenIntroText = GetText("PlayerUncollarFirst");					
				} else {					
					if (Common_PlayerRestrained) {
						OverridenIntroText = GetText("PlayerUnrestrainFirst");
					} else {
						if (Common_PlayerNaked) {
							OverridenIntroText = GetText("GetOnYourKnees");
							C012_AfterClass_Sidney_PlayerStrip();
							C012_AfterClass_Sidney_CurrentStage = 340;
						} else {
							C012_AfterClass_Sidney_CurrentStage = 330;						
						}
					}					
				}
			}
		}
	}
}

// Chapter 12 After Class - The player can strip for Sidney
function C012_AfterClass_Sidney_PlayerStrip() {
	ActorSetPose("");
	PlayerClothes("Naked");
	Common_PlayerPose = "BackShy";
}

// Chapter 12 After Class - The player can strip for Sidney
function C012_AfterClass_Sidney_SetPlayerPose(NewPose) {
	Common_PlayerPose = NewPose;
}

// Chapter 12 After Class - When the player gets collared
function C012_AfterClass_Sidney_PlayerCollared() {
	LeaveIcon = "";
	Common_PlayerOwner = CurrentActor;
	Common_ActorIsOwner = true;
	PlayerLockInventory("Collar");
	CurrentTime = CurrentTime + 50000;
	EventSetGenericTimer();
}

// Chapter 12 After Class - When the player gets collared
function C012_AfterClass_Sidney_PlayerStandUp() {
	Common_PlayerPose = "";
	if (ActorGetValue(ActorCloth) != "Shorts") {
		ActorSetCloth("Shorts");
		OverridenIntroText = GetText("ChangeAfterCollaring");
	}
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - The player can trigger a random Domme event from Sidney (3000 events)
function C012_AfterClass_Sidney_RandomSidneyDommeEvent() {
	
	// Makes sure the next random event can be triggered
	if (!GameLogQuery(CurrentChapter, CurrentActor, "EventGeneric")) {

		// 1 event per 15 minutes maximum, the event is random and drawn from the Mistress pool
		EventSetGenericTimer();
		C012_AfterClass_Sidney_CurrentStage = EventRandomPlayerSubmissive();

	}

	// If Sidney doesn't respond, she checks her cell phone
	if (C012_AfterClass_Sidney_CurrentStage == 0) C012_AfterClass_Sidney_CheckCellPhone();
	
}

// Chapter 12 After Class - As a Domme, Sidney can force the player to change
function C012_AfterClass_Sidney_ForceChangePlayer(NewCloth) {
	PlayerClothes(NewCloth);
	if (C012_AfterClass_Sidney_CurrentStage < 3900) ActorSetPose("Happy");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - As a Domme, Sidney can force the player into some random bondage
function C012_AfterClass_Sidney_ForceRandomBondage(BondageType) {
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

// Chapter 12 After Class - Sidney can unbind the player on some events
function C012_AfterClass_Sidney_TestUnbind() {

	// Bound and gagged, there's not much she can do
	if (ActorIsGagged() && ActorIsRestrained()) {
		C012_AfterClass_Sidney_GaggedAnswer();
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
function C012_AfterClass_Sidney_DoActivity(ActivityType, Enjoyment, BonusStage) {
	
	// Launch the activity, some can have a bonus stage
	C012_AfterClass_Sidney_CurrentStage = EventDoActivity(ActivityType, Enjoyment, C012_AfterClass_Sidney_CurrentStage, 3290, BonusStage);

}

// Chapter 12 After Class - When the player disobey, she can get punished
function C012_AfterClass_Sidney_TestPunish() {

	// The more love, the less chances the player will be punished
	if (EventRandomChance("Love")) {
		C012_AfterClass_Sidney_CheckCellPhone();
	} else {
		ActorSetPose("Angry");
		OverridenIntroText = "";
		C012_AfterClass_Sidney_CurrentStage = 3900;
	}

}

// Chapter 12 After Class - Allows the player to leave the scene
function C012_AfterClass_Sidney_AllowLeave() {
	C012_AfterClass_Sidney_CheckCellPhone();
}

// Chapter 12 After Class - The player can beg Sidney to be released before she exits
function C012_AfterClass_Sidney_TestReleaseBeforeExit() {

	// Check if the event succeeds randomly
	if (EventRandomChance("Love")) {
		OverridenIntroText = GetText("ReleaseBeforeExit");
		PlayerReleaseBondage();
		CurrentTime = CurrentTime + 50000;
	}
	
}

// Chapter 12 After Class - Sidney can confiscate the player keys
function C012_AfterClass_Sidney_ConfiscateKeys() {
	PlayerRemoveInventory("CuffsKey", 99);
	GameLogAdd("HasCuffsKey");
	C012_AfterClass_Sidney_AllowLeave();
}

// Chapter 12 After Class - Sidney can confiscate the player crop(s)
function C012_AfterClass_Sidney_ConfiscateCrop() {
	PlayerRemoveInventory("Crop", 99);
	GameLogAdd("HasCrop");
	C012_AfterClass_Sidney_AllowLeave();
}

// Chapter 12 After Class - Sidney can confiscate the player keys
function C012_AfterClass_Sidney_BegForOrgasm(Begged) {
	
	// If the player begs for it, Sidney will do it randomly based on love, if not it's based on hate
	if (EventRandomChance(Begged ? "Love" : "Hate")) {
		ActorAddOrgasm();
		EventLogEnd();
		OverridenIntroText = GetText(Begged ? "MasturbatePlayerOrgasm" : "MasturbatePlayerOrgasmForced");
		C012_AfterClass_Sidney_CurrentStage = 3223;
	}

}

// Chapter 12 After Class - Sidney will tell the player if she can change clothes or not
function C012_AfterClass_Sidney_IsChangingBlocked() {
	if (GameLogQuery(CurrentChapter, CurrentActor, "EventBlockChanging"))
		OverridenIntroText = GetText("ChangingIsBlocked");
}

// Chapter 12 After Class - Sidney will tell the player if she can change clothes or not
function C012_AfterClass_Sidney_TestBlockChanging() {
	
	// The less love, the higher the chances Sidney will block changing
	if (EventRandomChance("Hate")) {
		OverridenIntroText = "";
		GameLogAddTimer("EventBlockChanging", CurrentTime + 1000000 + Math.floor(Math.random() * 10000000));
		C012_AfterClass_Sidney_CurrentStage = 3091;
	} else C012_AfterClass_Sidney_AllowLeave();

}

// Chapter 12 After Class - Sidney will tell the player if she can change clothes or not
function C012_AfterClass_Sidney_ReleaseBeforePunish() {
	ActorSetPose("ReadyToPunish");
	if (Common_PlayerRestrained || Common_PlayerGagged) {
		if (Common_PlayerNaked) {
			C012_AfterClass_Sidney_CurrentStage = 3903;		
			OverridenIntroText = GetText("ReleaseBeforePunishAlreadyNaked");
		}
		else OverridenIntroText = GetText("ReleaseBeforePunishNotNaked");
		PlayerReleaseBondage();
		CurrentTime = CurrentTime + 50000;
	} else {
		if (Common_PlayerNaked) {
			C012_AfterClass_Sidney_CurrentStage = 3903;		
			OverridenIntroText = GetText("PunishSinceNaked");
		}		
	}
}

// Chapter 12 After Class - Set Sidney Pose
function C012_AfterClass_Sidney_ActorSetPose(NewPose) {
	ActorSetPose(NewPose);
}

// Chapter 12 After Class - Starts the punishment
function C012_AfterClass_Sidney_StartPunishment() {
	C012_AfterClass_Sidney_CurrentStage = EventRandomPlayerPunishment();
}

// Chapter 12 After Class - Sidney can tie up the player with her own rope
function C012_AfterClass_Sidney_RopePlayer() {
	PlayerLockInventory("Rope");
	PlayerRemoveInventory("Rope", 1);
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Sidney can gag the player with her stuff
function C012_AfterClass_Sidney_GagPlayer() {
	PlayerRandomGag();
	if (!Common_PlayerGagged) PlayerLockInventory("ClothGag");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Sidney can use the egg on the player
function C012_AfterClass_Sidney_InsertEgg() {
	PlayerLockInventory("VibratingEgg");
	PlayerRemoveInventory("VibratingEgg", 1);
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Ends the punishment and sets the duration between 30 minutes and 1.5 hours
function C012_AfterClass_Sidney_EndPunishment(PunishmentType) {
	GameLogAddTimer("Event" + PunishmentType, CurrentTime + 1800000 + Math.floor(Math.random() * 3600000));
	EventSetGenericTimer();
	C012_AfterClass_Sidney_AllowLeave();
}

// Chapter 12 After Class - Ends any bondage and resets the pose
function C012_AfterClass_Sidney_ReleasePlayer() {
	Common_PlayerPose = "";
	EventSetGenericTimer();
	PlayerReleaseBondage();
	C012_AfterClass_Sidney_AllowLeave();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Flags the chat as done and doesn't allow the player to leave
function C012_AfterClass_Sidney_StartChat() {
	if (!ActorIsGagged()) {
		ActorSetPose("");
		C012_AfterClass_Sidney_CurrentStage = 500;
		GameLogAdd("ChatDone");
		LeaveIcon = "";
		C012_AfterClass_Sidney_ChatAvail = false;
	} else C012_AfterClass_Sidney_GaggedAnswer();
}

// Chapter 12 After Class - Ends the chat with Sidney
function C012_AfterClass_Sidney_EndChat() {
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - When Sidney locks the belt on the player
function C012_AfterClass_Sidney_LockChastityBelt() {
	PlayerLockInventory("ChastityBelt");
	PlayerRemoveInventory("ChastityBelt", 1);
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When Sidney spanks the player
function C012_AfterClass_Sidney_SidneySpankPlayer() {
	C012_AfterClass_Sidney_SpankCount++;
	if (C012_AfterClass_Sidney_SpankCount > C012_AfterClass_Sidney_SpankMaxCount) {
		C012_AfterClass_Sidney_CurrentStage = 3933;
		OverridenIntroText = "";
		OverridenIntroImage = "";
	} else {
		OverridenIntroText = GetText("SpankPlayer" + C012_AfterClass_Sidney_SpankCount.toString());
		var Img = (C012_AfterClass_Sidney_SpankCount % 2).toString();
		if ((C012_AfterClass_Sidney_SpankCount < 5) && !Common_PlayerChaste) OverridenIntroImage = "SidneySpankPlayer" + Img + ".jpg";
		if ((C012_AfterClass_Sidney_SpankCount >= 5) && !Common_PlayerChaste) OverridenIntroImage = "SidneySpankPlayerRedButt" + Img + ".jpg";
		if ((C012_AfterClass_Sidney_SpankCount < 5) && Common_PlayerChaste) OverridenIntroImage = "SidneySpankPlayerChastity" + Img + ".jpg";
		if ((C012_AfterClass_Sidney_SpankCount >= 5) && Common_PlayerChaste) OverridenIntroImage = "SidneySpankPlayerChastityRedButt" + Img + ".jpg";
	}
}

// Chapter 12 After Class - The player can ask Sidney to change clothes
function C012_AfterClass_Sidney_TestChange() {
	if (!ActorIsRestrained()) {
		if ((ActorGetValue(ActorLove) >= 10) || (ActorGetValue(ActorSubmission) >= 10) || Common_ActorIsOwned || Common_ActorIsLover) {
			if (Common_ActorIsOwned) OverridenIntroText = GetText("AcceptChangeFromMistress");
			else 
				if (Common_ActorIsLover) OverridenIntroText = GetText("AcceptChangeFromLover");
				else OverridenIntroText = GetText("AcceptChange");
			C012_AfterClass_Sidney_CurrentStage = 600;
		}
		C012_AfterClass_Sidney_GaggedAnswer();
	} else OverridenIntroText = GetText("CannotActWhileRestrained");
}

// Chapter 12 After Class - Sidney can change clothes when the player asks for it
function C012_AfterClass_Sidney_ForceChangeActor(NewCloth) {
	if (ActorGetValue(ActorCloth) != NewCloth) {
		ActorSetCloth(NewCloth);
		C012_AfterClass_Sidney_CalcParams();
		CurrentTime = CurrentTime + 50000;
	} else OverridenIntroText = GetText("NoNeedToChange");
	C012_AfterClass_Sidney_GaggedAnswer();
}

// Chapter 12 After Class - Increases the slavery count for Sidney, 5 is required to collar her
function C012_AfterClass_Sidney_EnslaveSidneyCount() {
	C012_AfterClass_Sidney_EnslaveCount++;
}

// Chapter 12 After Class - Check if Sidney wants to be collared, 5 counts are required
function C012_AfterClass_Sidney_TestEnslaveSidney() {
	if (C012_AfterClass_Sidney_EnslaveCount >= 5) {
		if (ActorIsRestrained()) C012_AfterClass_Sidney_CurrentStage = 285;
		else if (ActorGetValue(ActorCloth) == "Naked") { C012_AfterClass_Sidney_CurrentStage = 291; ActorSetPose("Shy"); }
		else C012_AfterClass_Sidney_CurrentStage = 290;
		OverridenIntroText = GetText("AcceptCollar");
	} else LeaveIcon = "Leave";
}

// Chapter 12 After Class - When the player gives up on enslaving Sidney
function C012_AfterClass_Sidney_EndEnslaveSidney() {
	C012_AfterClass_Sidney_CalcParams();
	LeaveIcon = "Leave";
}

// Chapter 12 After Class - Release Sidney from any restrain before her collaring
function C012_AfterClass_Sidney_EnslaveRelease() {
	ActorUntie();
	if (ActorHasInventory("Cuffs")) { PlayerAddInventory("Cuffs", 1); ActorRemoveInventory("Cuffs"); }
	if (ActorGetValue(ActorCloth) == "Naked") {
		C012_AfterClass_Sidney_CurrentStage = 291;
		ActorSetPose("Shy");
	}
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Sidney gets naked for her collaring
function C012_AfterClass_Sidney_EnslaveStrip() {
	ActorSetCloth("Naked");
	ActorSetPose("Shy");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Sidney can be ungagged
function C012_AfterClass_Sidney_Ungag() {
	ActorUngag();
	C012_AfterClass_Sidney_CalcParams();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Sidney can be untied
function C012_AfterClass_Sidney_Untie() {
	ActorUntie();
	if (ActorGetValue(ActorPose) == "Pig") ActorSetPose("");
	C012_AfterClass_Sidney_CalcParams();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When Sidney gets collared
function C012_AfterClass_Sidney_LockCollarSidney() {
	ActorSetOwner("Player");
	PlayerRemoveInventory("Collar", 1);
	C012_AfterClass_Sidney_CalcParams();
	ActorSetPose("Kneel");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - The player can decide how Sidney will spend her evening
function C012_AfterClass_Sidney_SetCurfew(CurfewType) {
	GameLogAddTimer("CurfewStay", -1);
	GameLogAddTimer("Curfew22", -1);
	GameLogAddTimer("Curfew24", -1);
	GameLogAddTimer("CurfewNone", -1);
	GameLogAdd("Curfew" + CurfewType);
}

// Chapter 12 After Class - The player can decide how Sidney will spend her evening
function C012_AfterClass_Sidney_BackToDorm() {
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Sidney will accept the chastity belt deal if she's not too dominant (-5 and up)
function C012_AfterClass_Sidney_TestBelt() {
	ActorChangeAttitude(0, 1);
	GameLogAdd("DebtChastityBeltDone");
	C012_AfterClass_Sidney_CalcParams();
	if (ActorGetValue(ActorSubmission) >= -5) {
		if (ActorGetValue(ActorCloth) == "Naked") C012_AfterClass_Sidney_CurrentStage = 622;
		else C012_AfterClass_Sidney_CurrentStage = 621;
		OverridenIntroText = GetText("AcceptPusherDeal");
		LeaveIcon = "";
	}
}

// Chapter 12 After Class - Sidney can be locked in a chastity belt to follow the pusher deal
function C012_AfterClass_Sidney_LockBeltSidney() {
	PlayerRemoveInventory("ChastityBelt", 1);
	ActorAddInventory("ChastityBelt");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Starts the pleasure player scene
function C012_AfterClass_Sidney_TestPleasurePlayer() {
	LeaveIcon = "";
	if (ActorGetValue(ActorCloth) == "Naked") C012_AfterClass_Sidney_CurrentStage = 631;
}

// Chapter 12 After Class - When Sidney starts pleasuring the player (starts to count at 2 with a vibrating egg)
function C012_AfterClass_Sidney_StartPleasurePlayer() {
	PlayerClothes("Naked");
	if (ActorIsChaste()) OverridenIntroImage = "SidneyPleasurePlayerChastity.jpg";
	else OverridenIntroImage = "SidneyPleasurePlayer.jpg";
	CurrentTime = CurrentTime + 50000;
	if (PlayerHasLockedInventory("VibratingEgg")) C012_AfterClass_Sidney_PleasurePlayerCount = 2;
	else C012_AfterClass_Sidney_PleasurePlayerCount = 0;
	C012_AfterClass_Sidney_PleasurePlayerSpeed = 0;
}

// Chapter 12 After Class - When Sidney pleasures the player
function C012_AfterClass_Sidney_PleasurePlayer() {
	
	// The more it progresses, the faster Sidney must go
	CurrentTime = CurrentTime + 50000;
	var StartCount = C012_AfterClass_Sidney_PleasurePlayerCount;
	if ((C012_AfterClass_Sidney_PleasurePlayerCount >= 0) && (C012_AfterClass_Sidney_PleasurePlayerCount <= 1) && (C012_AfterClass_Sidney_PleasurePlayerSpeed == 0)) C012_AfterClass_Sidney_PleasurePlayerCount++;
	if ((C012_AfterClass_Sidney_PleasurePlayerCount >= 2) && (C012_AfterClass_Sidney_PleasurePlayerCount <= 3) && (C012_AfterClass_Sidney_PleasurePlayerSpeed == 1)) C012_AfterClass_Sidney_PleasurePlayerCount++;
	if ((C012_AfterClass_Sidney_PleasurePlayerCount >= 4) && (C012_AfterClass_Sidney_PleasurePlayerCount <= 9) && (C012_AfterClass_Sidney_PleasurePlayerSpeed == 2)) C012_AfterClass_Sidney_PleasurePlayerCount++;
	
	// At 6 counts, an orgasm is achieved, the next one will be slower
	if (C012_AfterClass_Sidney_PleasurePlayerCount >= 6) {
		OverridenIntroText = GetText("OrgasmFromSidneyPleasure");
		ActorAddOrgasm();
		GameLogSpecificAddTimer(CurrentChapter, "Player", "NextPossibleOrgasm", PlayerHasLockedInventory("VibratingEgg") ? CurrentTime + 1800000 : CurrentTime + 3600000);
		if (ActorIsChaste()) OverridenIntroImage = "SidneyPleasurePlayerChastityOrgasm.jpg";
		else OverridenIntroImage = "SidneyPleasurePlayerOrgasm.jpg";
		C012_AfterClass_Sidney_CurrentStage = 634;
		C012_AfterClass_Sidney_PleasurePlayerCount = 0;
		C012_AfterClass_Sidney_PleasurePlayerSpeed = 0;
	} else {
		if (StartCount == C012_AfterClass_Sidney_PleasurePlayerCount) OverridenIntroText = GetText("PleasureFromSidneyNoProgress");
	}
	
}

// Chapter 12 After Class - When Sidney pleasures the player and is forced in a new position or speed
function C012_AfterClass_Sidney_PleasurePlayerSetSpeed(SpeedFactor) {
	C012_AfterClass_Sidney_PleasurePlayerSpeed = C012_AfterClass_Sidney_PleasurePlayerSpeed + SpeedFactor;
	if (C012_AfterClass_Sidney_PleasurePlayerSpeed < 0) C012_AfterClass_Sidney_PleasurePlayerSpeed = 0;
	if (C012_AfterClass_Sidney_PleasurePlayerSpeed > 2) C012_AfterClass_Sidney_PleasurePlayerSpeed = 2;
}

// Chapter 12 After Class - When Sidney stops pleasuring the player
function C012_AfterClass_Sidney_StopPleasureFromSidney() {
	OverridenIntroImage = "";
}

// Chapter 12 After Class - When Sidney pleasures for the player ends
function C012_AfterClass_Sidney_EndPleasureFromSidney(LoveFactor, SubFactor) {
	if (!GameLogQuery(CurrentChapter, CurrentActor, "PleasureFromSidney")) {
		GameLogAdd("PleasureFromSidney");
		ActorChangeAttitude(LoveFactor, SubFactor);
	}
	C012_AfterClass_Sidney_EndEnslaveSidney();
}

// Chapter 12 After Class - When the player kisses Sidney
function C012_AfterClass_Sidney_Kiss() {
	CurrentTime = CurrentTime + 50000;	
	if (Common_ActorIsOwner) OverridenIntroText = GetText("KissSidneyOwner");
	else if (C012_AfterClass_Sidney_IsGagged) OverridenIntroText = GetText("KissSidneyGagged");
	else if (!GameLogQuery(CurrentChapter, CurrentActor, "Kiss")) {
		GameLogAdd("Kiss");
		if (PlayerGetSkillLevel("Seduction") > 0) {
			ActorChangeAttitude(PlayerGetSkillLevel("Seduction"), 0);
			OverridenIntroText = GetText("KissSidneySeduction");
		}
	}
}

// Chapter 12 After Class - When the player spanks Sidney, with the fighting skill it can affect her submission level
function C012_AfterClass_Sidney_Spank() {
	CurrentTime = CurrentTime + 50000;
	if (PlayerGetSkillLevel("Fighting") > 0) {
		OverridenIntroText = GetText("SpankWithStrength");
		if (!GameLogQuery(CurrentChapter, CurrentActor, "Spank")) {
			GameLogAdd("Spank");
			ActorChangeAttitude(0, PlayerGetSkillLevel("Fighting"));
		}
	}
}

// Chapter 12 After Class - When the player tickles Sidney, it doesn't affect her
function C012_AfterClass_Sidney_Tickle() {
	if ((Common_ActorIsOwner || (ActorGetValue(ActorSubmission) <= -5)) && !ActorIsRestrained()) OverridenIntroText = GetText("NoTickling");
	else CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When the player starts to masturbate Sidney
function C012_AfterClass_Sidney_StartMasturbate() {
	if ((ActorGetValue(ActorLove) >= 10) || (ActorGetValue(ActorSubmission) >= 10) || (ActorIsRestrained())) {
		CurrentTime = CurrentTime + 50000;
		if (!GameLogQuery(CurrentChapter, CurrentActor, "NextPossibleOrgasm")) {
			C012_AfterClass_Sidney_MasturbateCount = 0;
			C012_AfterClass_Sidney_CurrentStage = 640;
			OverridenIntroText = GetText("StartMasturbateSidney");
			LeaveIcon = "";
			if (!ActorIsGagged() && !ActorIsRestrained()) ActorSetPose("StandPleasure");
		} else OverridenIntroText = GetText("MasturbateNotInTheMood");
	}
}

// Chapter 12 After Class - When the player masturbates Sidney
function C012_AfterClass_Sidney_Masturbate(Factor) {
	CurrentTime = CurrentTime + 50000;
	C012_AfterClass_Sidney_MasturbateCount = C012_AfterClass_Sidney_MasturbateCount + Factor;
	if (C012_AfterClass_Sidney_MasturbateCount < 0) C012_AfterClass_Sidney_MasturbateCount = 0;
	if (C012_AfterClass_Sidney_MasturbateCount >= 5) {
		C012_AfterClass_Sidney_CurrentStage = 641;
		OverridenIntroText = GetText("ReadyForOrgasm");
	}
}

// Chapter 12 After Class - When Sidney is masturbated to an orgasm
function C012_AfterClass_Sidney_SidneyOrgasm() {
	CurrentTime = CurrentTime + 50000;
	ActorAddOrgasm();
	if (!GameLogQuery(CurrentChapter, CurrentActor, "NextPossibleOrgasm")) {
		GameLogSpecificAddTimer(CurrentChapter, CurrentActor, "NextPossibleOrgasm", ActorHasInventory("VibratingEgg") ? CurrentTime + 3600000 : CurrentTime + 7200000);
		ActorChangeAttitude(2, -1);
	}
}

// Chapter 12 After Class - When Sidney is masturbated to an orgasm
function C012_AfterClass_Sidney_SidneyDeniedOrgasm() {
	CurrentTime = CurrentTime + 50000;
	if (!GameLogQuery(CurrentChapter, CurrentActor, "OrgasmDeniedFromMasturbation")) {
		GameLogAdd("OrgasmDeniedFromMasturbation");
		ActorChangeAttitude(-2, 1);
	}
	C012_AfterClass_Sidney_EndEnslaveSidney();
}

// Chapter 12 After Class - Tests if the player is already dating someone else
function C012_AfterClass_Sidney_TestRelationship() {
	if (GameLogQuery(CurrentChapter, CurrentActor, "LoverBreakUp")) {
		OverridenIntroText = GetText("AlreadyBrokeUp");
		C012_AfterClass_Sidney_CurrentStage = 0;
	} else {
		if (Common_PlayerLover != "") {
			OverridenIntroText = GetText("AlreadyLoved");
			C012_AfterClass_Sidney_CurrentStage = 105;
		}
	}
}

// Chapter 12 After Class - Start Dating Sidney
function C012_AfterClass_Sidney_StartDating() {
	CurrentTime = CurrentTime + 50000;
	Common_PlayerLover = "Sidney";
	Common_ActorIsLover = true;
	C012_AfterClass_Sidney_AllowSexAfterDate = (!Common_PlayerChaste && !ActorIsChaste());
}

// Chapter 12 After Class - Start Dating Sidney
function C012_AfterClass_Sidney_BothNaked() {
	ActorSetCloth("Naked");
	PlayerClothes("Naked");
	C012_AfterClass_Sidney_CalcParams();
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - Get in bed with Sidney to make love
function C012_AfterClass_Sidney_MakeLove() {
	CurrentTime = CurrentTime + 50000;
	ActorSetCloth("Naked");
	PlayerClothes("Naked");
	C012_AfterClass_Bed_Partner = "Sidney";
	SetScene(CurrentChapter, "Bed");
}

// Chapter 12 After Class - Test Sidney to go on a date with her
function C012_AfterClass_Sidney_TestGoOnDate() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained()) {
			if (!GameLogQuery(CurrentChapter, CurrentActor, "RockShowTogether")) {
				if (CurrentTime >= 20 * 60 * 60 * 1000) {
					OverridenIntroText = GetText("RockShowAlreadyStarted");
					C012_AfterClass_Sidney_CurrentStage = 185;
				} else C012_AfterClass_Sidney_CurrentStage = 180;
			} else OverridenIntroText = GetText("AlreadyWentOut");
		} else OverridenIntroText = GetText("ReleaseBeforeTalk");
	} else C012_AfterClass_Sidney_GaggedAnswer();	
}

// Chapter 12 After Class - Test if the player can start the serious dialog
function C012_AfterClass_Sidney_TestTalk() {
	if (!ActorIsGagged()) {
		if (!ActorIsRestrained()) C012_AfterClass_Sidney_CurrentStage = 20;
		else OverridenIntroText = GetText("ReleaseBeforeTalk");
	} else C012_AfterClass_Sidney_GaggedAnswer();	
}

// Chapter 12 After Class - When the player breaks up with Sidney
function C012_AfterClass_Sidney_BreakUp() {
	GameLogAdd("LoverBreakUp");
	Common_PlayerLover = "";
	Common_ActorIsLover = false;
	ActorSetPose("");
	LeaveIcon = "";
}

// Chapter 12 After Class - When Sidney leaves the room after the break up
function C012_AfterClass_Sidney_SidneyLeave() {
	CurrentActor = "";
	LeaveIcon = "Leave";
	C012_AfterClass_Dorm_Guest.splice("Sidney");
}

// Chapter 12 After Class - When Sidney and the player leaves for the rock show
function C012_AfterClass_Sidney_LeaveForRockShow() {
	CurrentTime = CurrentTime + 290000;
	PlayerReleaseBondage();
	ActorSetCloth("Shorts");
	PlayerClothes("BlackDress");
	GameLogAdd("RockShowTogether");
	SetScene(CurrentChapter, "RockShow");
}

// Chapter 12 After Class - Starts the lingerie show
function C012_AfterClass_Sidney_StartLingerieShow() {
	GameLogAdd("LingerieShow");
}

// Chapter 12 After Class - Unlocks the black lingerie for Sidney
function C012_AfterClass_Sidney_UnlockBlackLingerie() {
	GameLogAdd("AllowBlackLingerie");
	LeaveIcon = "Leave";
	C012_AfterClass_Sidney_AllowBlackLingerie = true;
}

// Chapter 12 After Class - When Sidney forces the player to kick someone out
function C012_AfterClass_Sidney_KickActor(KickedActor) {
	if (KickedActor == "Amanda") C012_AfterClass_Amanda_CurrentStage = 790;
	if (KickedActor == "Sarah") C012_AfterClass_Sarah_CurrentStage = 790;
	SetScene(CurrentChapter, KickedActor);
}

// Chapter 12 After Class - When Sidney is kicked for another actor
function C012_AfterClass_Sidney_KickForActor(KickedForActor) {
	ActorSpecificChangeAttitude(KickedForActor, 2, 1);
}

// Chapter 12 After Class - When Sidney is kicked out, it can destroy the players couple
function C012_AfterClass_Sidney_KickedOut() {
	GameLogAdd("KickedOutFromDorm");
	if (CurrentActor == Common_PlayerLover) {
		ActorChangeAttitude(-5, 0);
		C012_AfterClass_Sidney_BreakUp();
	}
	CurrentActor = "";
}

// Chapter 12 After Class - When Sidney changes back to her short to spank the player
function C012_AfterClass_Sidney_ChangeBackToShort() {
	if (ActorGetValue(ActorCloth) != "Shorts") {
		ActorSetCloth("Shorts");
		CurrentTime = CurrentTime + 50000;
		OverridenIntroText = GetText("SpankInShorts");
	}
}

// Chapter 12 After Class - Sidney can only wear the pig costume when she's in 2 or 3 ropes
function C012_AfterClass_Sidney_TestPigCostume() {

	// Only works if naked
	if (ActorGetValue(ActorCloth) == "Naked") {

		// Give back one rope if there's three
		if (ActorHasInventory("ThreeRopes")) {
			ActorRemoveInventory("ThreeRopes");
			ActorAddInventory("TwoRopes");
			PlayerAddInventory("Rope", 1);
		}

		// Allow the pig costume if she's tied up with two ropes
		if (ActorHasInventory("TwoRopes")) {
			ActorSetPose("Pig");
			CurrentTime = CurrentTime + 50000;
			if (!GameLogQuery(CurrentChapter, "Sidney", "Pig")) {
				OverridenIntroText = GetText("ForcePigCostumePicture");
				GameLogAdd("Pig");
			} else OverridenIntroText = GetText("ForcePigCostume");
		}
	
	}

}

// Chapter 12 After Class - When Sidney brings the player out naked to be humiliated
function C012_AfterClass_Sidney_StartPlayerHumiliation() {
	SetScene(CurrentChapter, "Humiliation");
}