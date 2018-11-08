var C012_AfterClass_Roommates_CurrentStage = 0;
var C012_AfterClass_Roommates_SidneyAvail = false;
var C012_AfterClass_Roommates_EmptyDorm = true;
var C012_AfterClass_Roommates_IntroText = "";
var C012_AfterClass_Roommates_CurrentActor = "";
var C012_AfterClass_Roommates_ChitChatCount = 0;
var C012_AfterClass_Roommates_ModifierLove = 0;
var C012_AfterClass_Roommates_ModifierSub = 0;
var C012_AfterClass_Roommates_IsolationAvail = true;
var C012_AfterClass_Roommates_IsolationVisit = false;
var C012_AfterClass_Roommates_JenniferBelt = false;
var C012_AfterClass_Roommates_WearingTennisOutfit = false;

// Chapter 12 After Class - Roommates Load
function C012_AfterClass_Roommates_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	C012_AfterClass_Roommates_ChitChatCount = 0;
	C012_AfterClass_Roommates_ModifierLove = 0;
	C012_AfterClass_Roommates_ModifierSub = 0;
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C012_AfterClass_Roommates_WearingTennisOutfit = (Common_PlayerCloth == "Tennis");
	C012_AfterClass_Roommates_IsolationAvail = !GameLogQuery(CurrentChapter, "Sarah", "IsolationVisit");
	C012_AfterClass_Roommates_IsolationVisit = GameLogQuery(CurrentChapter, "Sarah", "IsolationVisit")

	// If we must put the previous text or previous actor back
	if (C012_AfterClass_Roommates_IntroText != "") { OverridenIntroText = C012_AfterClass_Roommates_IntroText; C012_AfterClass_Roommates_IntroText = ""; }
	if (C012_AfterClass_Roommates_CurrentActor != "") ActorLoad(C012_AfterClass_Roommates_CurrentActor, "");

	// No leaving from the roommates
	LeaveIcon = "";
	LeaveScreen = "";

}

// Chapter 12 After Class - Roommates Run - The background changes based on the time of day (special running background for stage 302)
function C012_AfterClass_Roommates_Run() {
	BuildInteraction(C012_AfterClass_Roommates_CurrentStage);
	if (CurrentActor != "") {
		if ((C012_AfterClass_Roommates_CurrentStage >= 322) && (C012_AfterClass_Roommates_CurrentStage <= 329)) OverridenIntroImage = "RunningWithJennifer.jpg";
		else if (CurrentTime >= 18.5 * 60 * 60 * 1000) OverridenIntroImage = "KitchenNight.jpg";
		else OverridenIntroImage = "KitchenDay.jpg";
		if ((C012_AfterClass_Roommates_CurrentStage < 322) || (C012_AfterClass_Roommates_CurrentStage > 329)) DrawActor(CurrentActor, 600, 0, 1);
	}
}

// Chapter 12 After Class - Roommates Click
function C012_AfterClass_Roommates_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Roommates_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_Roommates_IntroText = OverridenIntroText;
		C012_AfterClass_Roommates_CurrentActor = CurrentActor; 
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 12 After Class - When the player leaves the roommates
function C012_AfterClass_Roommates_Leave() {
	CurrentTime = CurrentTime + 110000;
	C012_AfterClass_Dorm_LeavingGuest();
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - A roommate might answer when the player knocks
function C012_AfterClass_Roommates_Knock() {
	
	// Amanda is available after 21:00
	CurrentTime = CurrentTime + 50000;
	if ((CurrentTime >= 21 * 60 * 60 * 1000) && !GameLogQuery(CurrentChapter, "Amanda", "EnterDormFromLibrary") && !GameLogQuery(CurrentChapter, "Amanda", "EnterDormFromRoommates")) {
		OverridenIntroText = "";
		ActorLoad("Amanda", "Dorm");
		LeaveIcon = "";
		if (ActorGetValue(ActorLove) >= 10) ActorSetPose("Happy");
		if (ActorGetValue(ActorLove) <= -10) ActorSetPose("Angry");
		ActorSetCloth("Pajamas");
		C012_AfterClass_Roommates_CurrentStage = 100;
		return;
	}

	// Sarah is available before 20:00
	if ((CurrentTime < 20 * 60 * 60 * 1000) && !GameLogQuery(CurrentChapter, "Sarah", "EnterDormFromRoommates"))
		if (!GameLogQuery(CurrentChapter, "Sarah", "IsolationStranded") || GameLogQuery(CurrentChapter, "Sarah", "IsolationRescue")) {
			OverridenIntroText = "";
			ActorLoad("Sarah", "Dorm");
			LeaveIcon = "";
			if (ActorGetValue(ActorLove) >= 10) ActorSetPose("Happy");
			if (ActorGetValue(ActorLove) <= -10) ActorSetPose("Angry");
			if (ActorGetValue(ActorSubmission) >= 10) ActorSetPose("Shy");
			if (ActorGetValue(ActorSubmission) <= -10) ActorSetPose("Cocky");
			ActorSetCloth("BrownDress");
			C012_AfterClass_Roommates_CurrentStage = 200;
			return;
		}

	// Jennifer is available before 18:00 but Sarah answers first if she's there
	if ((CurrentTime < 18 * 60 * 60 * 1000) && !GameLogQuery(CurrentChapter, "Jennifer", "EnterDormFromRoommates")) C012_AfterClass_Roommates_LoadJennifer();

}

// Chapter 12 After Class - When the player chit-chats with the actor
function C012_AfterClass_Roommates_ChitChat() {

	// It slowly raises love
	C012_AfterClass_Roommates_ChitChatCount++;
	CurrentTime = CurrentTime + 290000;
	if (C012_AfterClass_Roommates_ChitChatCount % 5 == 4) ActorChangeAttitude(1, 0);
	
	// Sarah will kick the player out after 20:00
	if ((CurrentTime >= 20 * 60 * 60 * 1000) && (CurrentActor == "Sarah")) {
		OverridenIntroText = GetText("SarahKickOutAfter20");
		C012_AfterClass_Roommates_CurrentStage = 201;
	}

	// Jennifer will kick the player out after 18:00
	if ((CurrentTime >= 18 * 60 * 60 * 1000) && (CurrentActor == "Jennifer")) {
		OverridenIntroText = GetText("JenniferKickOutAfter18");
		C012_AfterClass_Roommates_CurrentStage = 311;
	}
	
}

// Chapter 12 After Class - Tests if Amanda will follow the player to her dorm
function C012_AfterClass_Roommates_TestInviteAmanda() {
	if (ActorGetValue(ActorLove) >= 10) {
		OverridenIntroText = GetText("GoDormLoveAmanda");
		C012_AfterClass_Roommates_CurrentStage = 120;
	}
	if (ActorGetValue(ActorSubmission) >= 10) {
		OverridenIntroText = GetText("GoDormDommeAmanda");
		C012_AfterClass_Roommates_CurrentStage = 120;
	}
}

// Chapter 12 After Class - When the player leaves with Amanda
function C012_AfterClass_Roommates_TestIsolationSarah() {
	if (GameLogQuery(CurrentChapter, "Sarah", "IsolationTalk")) {
		OverridenIntroText = GetText("NoIsolationIntroSarah");
		C012_AfterClass_Roommates_CurrentStage = 210;
	} else GameLogAdd("IsolationTalk");
}

// Chapter 12 After Class - Tests if Sarah will follow the player to her dorm
function C012_AfterClass_Roommates_TestInviteSarah() {
	if (ActorGetValue(ActorLove) >= 10) {
		OverridenIntroText = GetText("GoDormLoveSarah");
		C012_AfterClass_Roommates_CurrentStage = 211;
	}
	if (ActorGetValue(ActorSubmission) >= 10) {
		OverridenIntroText = GetText("GoDormDommeSarah");
		C012_AfterClass_Roommates_CurrentStage = 211;
	}
	if (GameLogQuery(CurrentChapter, "Sarah", "IsolationVisit") && (ActorGetValue(ActorLove) >= 0)) {
		OverridenIntroText = GetText("GoDormIsolationSarah");
		C012_AfterClass_Roommates_CurrentStage = 211;
	}
}

// Chapter 12 After Class - Tests if Jennifer will go the player dorm and cancel her plans to run and swim (10+ required)
function C012_AfterClass_Roommates_TestInviteJennifer() {
	if (ActorGetValue(ActorLove) >= 10) {
		OverridenIntroText = GetText("GoDormLoveJennifer");
		C012_AfterClass_Roommates_CurrentStage = 312;
	}
	if (ActorGetValue(ActorSubmission) >= 10) {
		OverridenIntroText = GetText("GoDormDommeJennifer");
		C012_AfterClass_Roommates_CurrentStage = 312;
	}
}

// Chapter 12 After Class - When the player leaves with Amanda
function C012_AfterClass_Roommates_LeaveWithAmanda() {
	GameLogAdd("EnterDormFromRoommates");
	GameLogAdd("AllowPajamas");
	C012_AfterClass_Roommates_Leave();
}

// Chapter 12 After Class - When the player leaves with Sarah
function C012_AfterClass_Roommates_LeaveWithSarah() {
	GameLogAdd("EnterDormFromRoommates");
	C012_AfterClass_Roommates_Leave();
}

// Chapter 12 After Class - When the player leaves with Jennifer
function C012_AfterClass_Roommates_LeaveWithJennifer() {
	GameLogAdd("EnterDormFromRoommates");
	C012_AfterClass_Roommates_Leave();
}

// Chapter 12 After Class - When the player leaves with Sarah
function C012_AfterClass_Roommates_EnterIsolation() {
	CurrentTime = CurrentTime + 290000;
	GameLogAdd("IsolationVisit");
	ActorSetCloth("Clothed");
	SetScene(CurrentChapter, "Isolation");
}

// Chapter 12 After Class - Sarah might force the player to go to the isolation room
function C012_AfterClass_Roommates_TestRefuseIsolation() {
	if (ActorGetValue(ActorSubmission) <= -10) {
		ActorSetPose("Angry");
		OverridenIntroText = GetText("CannotRefuseIsolation");
		C012_AfterClass_Roommates_CurrentStage = 225;
	}
}

// Chapter 12 After Class - Sarah can introduce the player to Jennifer before 18:00
function C012_AfterClass_Roommates_CheckJenniferAvail() {
	if ((CurrentTime < 18 * 60 * 60 * 1000) && !GameLogQuery(CurrentChapter, "Jennifer", "EnterDormFromPool") && !GameLogQuery(CurrentChapter, "Jennifer", "EnterDormFromRoommates")) {
		C012_AfterClass_Roommates_CurrentStage = 202;
		OverridenIntroText = GetText("SarahIntroduceJennifer");
	}
}

// Chapter 12 After Class - Loads Jennifer
function C012_AfterClass_Roommates_LoadJennifer() {
	OverridenIntroText = "";
	ActorLoad("Jennifer", "Dorm");
	LeaveIcon = "";
	C012_AfterClass_Roommates_JenniferBelt = (ActorHasInventory("ChastityBelt"));
	if (ActorGetValue(ActorLove) >= 10) ActorSetPose("Happy");
	if (ActorGetValue(ActorLove) <= -10) ActorSetPose("Angry");
	if (ActorGetValue(ActorSubmission) >= 10) ActorSetPose("Shy");
	if (ActorGetValue(ActorSubmission) <= -10) ActorSetPose("Cocky");
	ActorSetCloth("Clothed");
	if (C012_AfterClass_Roommates_CurrentStage == 0) C012_AfterClass_Roommates_CurrentStage = 300;
	else C012_AfterClass_Roommates_CurrentStage = 310;
	return;
}

// Chapter 12 After Class - When both the player and Jennifer changes in their tennis clothes
function C012_AfterClass_Roommates_WearTennisOutfit() {
	PlayerClothes("Tennis");
	ActorSetPose("");
	ActorSetCloth("Tennis");
	CurrentTime = CurrentTime + 50000;
}

// Chapter 12 After Class - When Jennifer and the player enters the running track +5 minutes
function C012_AfterClass_Roommates_EnterTrack() {
	CurrentTime = CurrentTime + 290000;
}

// Chapter 12 After Class - When the player goes running with Jennifer, it raises their friendship
function C012_AfterClass_Roommates_RunWithJennifer() {
	GameLogAdd("Running");
	ActorChangeAttitude(PlayerGetSkillLevel("Sports") + 1, 0);
	if (PlayerGetSkillLevel("Sports") == 0) { OverridenIntroText = GetText("RaceJenniferDefeat"); ActorChangeAttitude(0, -1); }
	if (PlayerGetSkillLevel("Sports") == 1) { OverridenIntroText = GetText("RaceJenniferTie"); }
	if (PlayerGetSkillLevel("Sports") >= 2) { OverridenIntroText = GetText("RaceJenniferVictory"); ActorChangeAttitude(0, 1); }
	if (CurrentTime <= 18.70 * 60 * 60 * 1000) CurrentTime = 18.75 * 60 * 60 * 1000;
	else CurrentTime = CurrentTime + 290000;
}

// Chapter 12 After Class - When the player goes swimming with Jennifer, she changes for the bikini
function C012_AfterClass_Roommates_PoolWithJennifer() {
	if (CurrentTime <= 18.95 * 60 * 60 * 1000) CurrentTime = 19 * 60 * 60 * 1000;
	else CurrentTime = CurrentTime + 290000;
	PlayerClothes("RedBikini");
	ActorSetCloth("Swimsuit");
	SetScene(CurrentChapter, "Pool");
}

// Chapter 12 After Class - Test if Jennifer can skip her pool trip
function C012_AfterClass_Roommates_TestSkipPool() {
	if ((ActorGetValue(ActorLove) >= 10) || (ActorGetValue(ActorSubmission) >= 10)) {
		OverridenIntroText = GetText("JenniferSkipPool");
		C012_AfterClass_Roommates_CurrentStage = 325;
	}
}