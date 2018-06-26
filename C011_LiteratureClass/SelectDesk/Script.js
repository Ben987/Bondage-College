var C011_LiteratureClass_SelectDesk_CurrentStage = 0;
var C011_LiteratureClass_SelectDesk_IntroText = "";
var C011_LiteratureClass_SelectDesk_CurrentActor = "";
var C011_LiteratureClass_SelectDesk_FrontDesk = false;
var C011_LiteratureClass_SelectDesk_BackDesk = false;
var C011_LiteratureClass_SelectDesk_SidneyWasPig = false;
var C011_LiteratureClass_SelectDesk_NatalieLunch = false;
var C011_LiteratureClass_SelectDesk_PigRemarkDone = false;
var C011_LiteratureClass_SelectDesk_NataliePeaceOfferDone = false;
var C011_LiteratureClass_SelectDesk_NatalieIgnorePlayer = false;
var C011_LiteratureClass_SelectDesk_SidneyIgnorePlayer = false;
var C011_LiteratureClass_SelectDesk_HasSeduction = false;

// Chapter 11 - Literature Class Select Desk Load
function C011_LiteratureClass_SelectDesk_Load() {

	// Set the timer limits at 15:35
	StartTimer(15.6666667 * 60 * 60 * 1000, CurrentChapter, "MildredIntro");
	
	// Load the scene parameters (loads Jennifer first in case we are starting directly in chapter 10)
	LoadInteractions();
	LeaveIcon = "";
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C011_LiteratureClass_SelectDesk_SidneyWasPig = GameLogQuery("C010_Revenge", "Sidney", "Pig");
	C011_LiteratureClass_SelectDesk_NatalieLunch = GameLogQuery("C007_LunchBreak", "Natalie", "Lunch");
	C011_LiteratureClass_SelectDesk_HasSeduction = (PlayerGetSkillLevel("Seduction") > 0);

	// If we must put the previous text back
	if (C011_LiteratureClass_SelectDesk_IntroText != "") OverridenIntroText = C011_LiteratureClass_SelectDesk_IntroText;

}

// Chapter 11 - Literature Class Select Desk Run
function C011_LiteratureClass_SelectDesk_Run() {
	
	// Build the text interactions
	BuildInteraction(C011_LiteratureClass_SelectDesk_CurrentStage);

}

// Chapter 11 - Literature Class Select Desk Click
function C011_LiteratureClass_SelectDesk_Click() {	

	// Regular interactions
	ClickInteraction(C011_LiteratureClass_SelectDesk_CurrentStage);
	
	// The player can click on herself
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C011_LiteratureClass_SelectDesk_IntroText = OverridenIntroText;
		C011_LiteratureClass_SelectDesk_CurrentActor = CurrentActor;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 11 - Literature Class Select Front Desk
function C011_LiteratureClass_SelectDesk_SelectFront() {
	C011_LiteratureClass_SelectDesk_FrontDesk = true;
	GameLogAdd("FrontDesk");
}

// Chapter 11 - Literature Class Select Back Desk
function C011_LiteratureClass_SelectDesk_SelectBack() {
	C011_LiteratureClass_SelectDesk_BackDesk = true;
	GameLogAdd("BackDesk");
}

// Chapter 11 - Literature Class - Check the front row neighbors
function C011_LiteratureClass_SelectDesk_CheckFront() {
	
	// Loads Natalie
	ActorLoad("Natalie", "");
	LeaveIcon = "";
	
	// If Natalie was stranded, she will be angry at the player
	if (GameLogQuery("C007_LunchBreak", "Natalie", "Stranded")) {
		C011_LiteratureClass_SelectDesk_CurrentStage = 190;
		OverridenIntroText = GetText("NatalieAngry");
		return;
	}

	// If Natalie ignores the player
	if (C011_LiteratureClass_SelectDesk_NatalieIgnorePlayer) {
		C011_LiteratureClass_SelectDesk_CurrentStage = 180;
		OverridenIntroText = GetText("NatalieIgnore");
		return;
	}

	// If the player already had lunch with Natalie and knows about the Kinbaku club
	if (C011_LiteratureClass_SelectDesk_NatalieLunch) {
		C011_LiteratureClass_SelectDesk_CurrentStage = 120;
		OverridenIntroText = GetText("NatalieClubIntro");
		return;
	}

}

// Chapter 11 - Literature Class - Check the back row neighbors
function C011_LiteratureClass_SelectDesk_CheckBack() {

	// Loads Natalie
	ActorLoad("Sidney", "");
	LeaveIcon = "";
	
	// Sidney can ignore the player
	if (C011_LiteratureClass_SelectDesk_SidneyIgnorePlayer) {
		C011_LiteratureClass_SelectDesk_CurrentStage = 280;
		OverridenIntroText = GetText("SidneyIgnore");
		return;
	}

	// If she was made a pig in the revenge scenario, she gets angry
	if (C011_LiteratureClass_SelectDesk_SidneyWasPig) {
		C011_LiteratureClass_SelectDesk_CurrentStage = 290;
		OverridenIntroText = GetText("SidneyPig");
		return;
	}
	
	// With 8 submission or more, Sidney switches to sub mode
	if (ActorGetValue(ActorSubmission) >= 8) {
		C011_LiteratureClass_SelectDesk_CurrentStage = 240;
		OverridenIntroText = GetText("SidneySub");
		return;
	}

	// If she hates the player, she gets angry
	if (ActorGetValue(ActorLove) <= -8) {
		C011_LiteratureClass_SelectDesk_CurrentStage = 290;
		OverridenIntroText = GetText("SidneyAngry");
		return;
	}

	// With -8 submission or more, Sidney switches to Domme mode
	if (ActorGetValue(ActorSubmission) <= -8) {
		C011_LiteratureClass_SelectDesk_CurrentStage = 250;
		OverridenIntroText = GetText("SidneyDomme");
		return;
	}

	// With 8 love or more, Sidney switches to friend mode
	if (ActorGetValue(ActorLove) >= 8) {
		C011_LiteratureClass_SelectDesk_CurrentStage = 230;
		OverridenIntroText = GetText("SidneyLove");
		return;
	}
	
}

// Chapter 11 - Literature Class - Unload the current actor
function C011_LiteratureClass_SelectDesk_UnloadActor() {
	CurrentActor = "";
}

// Chapter 11 - Literature Class - Sidney is humiliated if the player says "SOOOWEE!"
function C011_LiteratureClass_SelectDesk_PigRemark() {
	if (!C011_LiteratureClass_SelectDesk_PigRemarkDone) {
		C011_LiteratureClass_SelectDesk_PigRemarkDone = true;
		ActorChangeAttitude(-1, 1);
	}
}

// Chapter 11 - Literature Class - Natalie will be tempted by the peace offer
function C011_LiteratureClass_SelectDesk_NataliePeaceOffer() {
	if (!C011_LiteratureClass_SelectDesk_NataliePeaceOfferDone) {
		C011_LiteratureClass_SelectDesk_NataliePeaceOfferDone = true;
		ActorChangeAttitude(1, -1);
	}
}

// Chapter 11 - Literature Class - Add two minutes to the timer
function C011_LiteratureClass_SelectDesk_WaitTwoMinutes() {
	CurrentTime = CurrentTime + 110000;
}

// Chapter 11 - Literature Class - Natalie can turn around and ignore the player
function C011_LiteratureClass_SelectDesk_NatalieOut() {
	C011_LiteratureClass_SelectDesk_NatalieIgnorePlayer = true;
}

// Chapter 11 - Literature Class - Logs the fact that the players knows about the club meeting from Natalie
function C011_LiteratureClass_SelectDesk_KinbakuClubInfo() {
	GameLogAdd("KinbakuClubInfo");
}

// Chapter 11 - Literature Class - Sidney can turn around and ignore the player
function C011_LiteratureClass_SelectDesk_SidneyOut() {
	C011_LiteratureClass_SelectDesk_SidneyIgnorePlayer = true;
}

// Chapter 11 - Literature Class - Sidney can force the player to move to the front row
function C011_LiteratureClass_SelectDesk_MoveToFront() {
	CurrentActor = "";
	GameLogAdd("KickedFromBackDesk");
	GameLogAdd("FrontDesk");
	C011_LiteratureClass_SelectDesk_FrontDesk = true;
	C011_LiteratureClass_SelectDesk_BackDesk = false;
	CurrentTime = CurrentTime + 50000;
}

// Chapter 11 - Literature Class - The player keeps in mind that Sidney will cheat
function C011_LiteratureClass_SelectDesk_AdmitCheat() {
	C011_LiteratureClass_Mildred_KnowCheat = true;
}