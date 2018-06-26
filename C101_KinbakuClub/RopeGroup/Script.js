var C101_KinbakuClub_RopeGroup_CurrentStage = 0;
var C101_KinbakuClub_RopeGroup_Random = 0;
var C101_KinbakuClub_RopeGroup_LeftTwin = "";
var C101_KinbakuClub_RopeGroup_RightTwin = "";
var C101_KinbakuClub_RopeGroup_LucyOnRight = false;
var C101_KinbakuClub_RopeGroup_TwinsRevealed = false;
var C101_KinbakuClub_RopeGroup_IntroDone = false;
var C101_KinbakuClub_RopeGroup_Kidnapper = false;
var C101_KinbakuClub_RopeGroup_TwoTiedTwins = true;
var C101_KinbakuClub_RopeGroup_LeftTwinKidnapped = false;
var C101_KinbakuClub_RopeGroup_RightTwinKidnapped = false;
var C101_KinbakuClub_RopeGroup_PersistantKidnapper = false;
var C101_KinbakuClub_RopeGroup_LeftTwinReleased = false;
var C101_KinbakuClub_RopeGroup_RightTwinReleased = false;
var C101_KinbakuClub_RopeGroup_Amelia210NotDone = true;
var C101_KinbakuClub_RopeGroup_Amelia220NotDone = true;
var C101_KinbakuClub_RopeGroup_Amelia230NotDone = true;
var C101_KinbakuClub_RopeGroup_Amelia250NotDone = true;
var C101_KinbakuClub_RopeGroup_Charlotte310NotDone = true;
var C101_KinbakuClub_RopeGroup_Charlotte320NotDone = true;
var C101_KinbakuClub_RopeGroup_Charlotte330NotDone = true;
var C101_KinbakuClub_RopeGroup_Charlotte340NotDone = true;
var C101_KinbakuClub_RopeGroup_Charlotte350NotDone = true;
var C101_KinbakuClub_RopeGroup_Charlotte360NotDone = true;
var C101_KinbakuClub_RopeGroup_LeftTwinToldNaughty = false;
var C101_KinbakuClub_RopeGroup_RightTwinToldNaughty = false;
var C101_KinbakuClub_RopeGroup_LeftTwinToldTighter = false;
var C101_KinbakuClub_RopeGroup_RightTwinToldTighter = false;
var C101_KinbakuClub_RopeGroup_KeptTickling = false;


//Stage layout
//0		- Intro -
//50	- Intro in bondage -
//100	- Select Actor -
//110	- Second kidnapping -
//200	- Talking to Amelia -
//300	- Talking to Charlotte -
//400	- Talking to bound twins -
//500	- Amelia with|Player in bondage -
//600	
//700	- Twin after release -


// Calculates the scene parameters
function C101_KinbakuClub_RopeGroup_CalcParams() {
	C101_KinbakuClub_RopeGroup_Kidnapper = C101_KinbakuClub_Slaves_ReadyForSlaves;
	C101_KinbakuClub_RopeGroup_TwoTiedTwins = (!C101_KinbakuClub_RopeGroup_LeftTwinKidnapped && !C101_KinbakuClub_RopeGroup_RightTwinKidnapped && !C101_KinbakuClub_RopeGroup_LeftTwinReleased && !C101_KinbakuClub_RopeGroup_RightTwinReleased);
}


// Chapter 101 - RopeGroup Load
function C101_KinbakuClub_RopeGroup_Load() {

	// After intro player has a choice each time she goes to the group, until a twin is released
	if (C101_KinbakuClub_RopeGroup_CurrentStage > 100 && C101_KinbakuClub_RopeGroup_CurrentStage < 700) {
		C101_KinbakuClub_RopeGroup_CurrentStage = 100;
	}

	// Load the scene parameters
	if (C101_KinbakuClub_RopeGroup_CurrentStage < 100) {
		ActorLoad("Amelia", "ClubRoom1");
	} else {
		LeaveScreen = "ClubRoom1";
		LeaveIcon = "Leave";
	}
	LoadInteractions();
	C101_KinbakuClub_RopeGroup_CalcParams();

	// Load correct CurrentStage if player is bound, gagged or not
	if (Common_PlayerGagged || Common_PlayerRestrained) {
		C101_KinbakuClub_RopeGroup_CurrentStage = 50;
	}
	if (C101_KinbakuClub_RopeGroup_CurrentStage == 50 && !Common_PlayerGagged && !Common_PlayerRestrained) {
		if (C101_KinbakuClub_RopeGroup_IntroDone) C101_KinbakuClub_RopeGroup_CurrentStage = 100;
		else C101_KinbakuClub_RopeGroup_CurrentStage = 10;
	}

	// Determine which twin is Lucy
	if (C101_KinbakuClub_RopeGroup_RightTwin == "") {
		C101_KinbakuClub_RopeGroup_Random = Math.floor(Math.random() * 2);
		if (C101_KinbakuClub_RopeGroup_Random == 0)	{
			C101_KinbakuClub_RopeGroup_LeftTwin = "Lucy";
			C101_KinbakuClub_RopeGroup_RightTwin = "Heather";
		}
		else {
			C101_KinbakuClub_RopeGroup_LeftTwin = "Heather";
			C101_KinbakuClub_RopeGroup_RightTwin = "Lucy";
		}
	}
}

// Chapter 101 - RopeGroup Run
function C101_KinbakuClub_RopeGroup_Run() {
	BuildInteraction(C101_KinbakuClub_RopeGroup_CurrentStage);
	

	// changing images
	// Group view
	if (C101_KinbakuClub_RopeGroup_CurrentStage == 100) {
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/RopeGroupAmelia.png", 600, 20);
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/RopeGroupCharlotte.jpg", 818, 0);
		if (!C101_KinbakuClub_RopeGroup_LeftTwinReleased && !C101_KinbakuClub_RopeGroup_LeftTwinKidnapped) DrawImage(CurrentChapter + "/" + CurrentScreen + "/RopeGroupTwinLeftStart.png", 985, 98);
		if (!C101_KinbakuClub_RopeGroup_RightTwinReleased && !C101_KinbakuClub_RopeGroup_RightTwinKidnapped) DrawImage(CurrentChapter + "/" + CurrentScreen + "/RopeGroupTwinRightStart.png", 847, 110);
	}	
}

// Chapter 101 - RopeGroup Click
function C101_KinbakuClub_RopeGroup_Click() {	

	// Regular and inventory interactions
	ClickInteraction(C101_KinbakuClub_RopeGroup_CurrentStage);
	var ClickInv = GetClickedInventory();
	
	C101_KinbakuClub_RopeGroup_CalcParams();

}




// Chapter 101 - RopeGroup - Introduction done
function C101_KinbakuClub_RopeGroup_Introduced() {
	C101_KinbakuClub_RopeGroup_IntroDone = true;
}

// Chapter 101 - RopeGroup - set actor to Amelia
function C101_KinbakuClub_RopeGroup_LoadAmelia() {
	ActorLoad("Amelia", "ClubRoom1");
}

// Chapter 101 - RopeGroup - set actor to Charlotte
function C101_KinbakuClub_RopeGroup_LoadCharlotte() {
	ActorLoad("Charlotte", "ClubRoom1");
}

// Chapter 101 - RopeGroup - set actor to Heather
function C101_KinbakuClub_RopeGroup_LoadHeather() {
	ActorLoad("Heather", "ClubRoom1");
}

// Chapter 101 - RopeGroup - set actor to Lucy
function C101_KinbakuClub_RopeGroup_LoadLucy() {
	ActorLoad("Lucy", "ClubRoom1");
}

// Chapter 101 - RopeGroup - Load unknown twin on the right
function C101_KinbakuClub_RopeGroup_LoadRightTwin() {
	ActorLoad(C101_KinbakuClub_RopeGroup_RightTwin, "ClubRoom1");
	if (!C101_KinbakuClub_RopeGroup_TwinsRevealed) ActorSpecificConcealment(C101_KinbakuClub_RopeGroup_RightTwin, true);
}

// Chapter 101 - RopeGroup - Load unknown twin on the left
function C101_KinbakuClub_RopeGroup_LoadLeftTwin() {
	ActorLoad(C101_KinbakuClub_RopeGroup_LeftTwin, "ClubRoom1");
	if (!C101_KinbakuClub_RopeGroup_TwinsRevealed) ActorSpecificConcealment(C101_KinbakuClub_RopeGroup_LeftTwin, true);
}

// Chapter 101 - RopeGroup - Load unknown remaining twin
function C101_KinbakuClub_RopeGroup_LoadRemainingTwin() {
	if (C101_KinbakuClub_RopeGroup_LeftTwinKidnapped || C101_KinbakuClub_RopeGroup_LeftTwinReleased) {
		C101_KinbakuClub_RopeGroup_CurrentStage = 450;
		C101_KinbakuClub_RopeGroup_LoadRightTwin();
	}
	else C101_KinbakuClub_RopeGroup_LoadLeftTwin();
}

// Chapter 101 - RopeGroup - Reveal the twins
function C101_KinbakuClub_RopeGroup_RevealTwins() {
	C101_KinbakuClub_RopeGroup_TwinsRevealed = true;
	ActorSpecificConcealment("Heather", false);
	ActorSpecificConcealment("Lucy", false);
}

// Chapter 101 - RopeGroup - Player can leave again.
function C101_KinbakuClub_RopeGroup_CanLeave() {
	LeaveIcon = "Leave";
}

// Chapter 101 - RopeGroup - Player threatens amelia to try stopping her.
function C101_KinbakuClub_RopeGroup_TryStopMe() {
	if (ActorGetValue(ActorSubmission) <= 0) {
		C101_KinbakuClub_RopeGroup_CurrentStage = 125;
		OverridenIntroText = GetText("StoppingYou");
	} else LeaveIcon = "Leave";
}

// Chapter 101 - RopeGroup - Player is locked in manacles by Amelia
function C101_KinbakuClub_RopeGroup_PlayerLockedAway() {
	C101_KinbakuClub_Slaves_CurrentStage = 116;
	SetScene(CurrentChapter, "Slaves");
}

// Chapter 101 - RopeGroup - Prevent rerunning conversation loops
function C101_KinbakuClub_RopeGroup_Amelia210Done() {
	C101_KinbakuClub_RopeGroup_Amelia210NotDone = false;
}

// Chapter 101 - RopeGroup - Prevent rerunning conversation loops
function C101_KinbakuClub_RopeGroup_Amelia220Done() {
	C101_KinbakuClub_RopeGroup_Amelia220NotDone = false;
}

// Chapter 101 - RopeGroup - Prevent rerunning conversation loops
function C101_KinbakuClub_RopeGroup_Amelia230Done() {
	C101_KinbakuClub_RopeGroup_Amelia230NotDone = false;
}

// Chapter 101 - RopeGroup - Prevent rerunning conversation loops
function C101_KinbakuClub_RopeGroup_Amelia250Done() {
	C101_KinbakuClub_RopeGroup_Amelia250NotDone = false;
}

// Chapter 101 - RopeGroup - Amelia helps strap the player into an armbinder
function C101_KinbakuClub_RopeGroup_PlayerArmbinded() {
	PlayerRemoveInventory("Armbinder", 1)
	PlayerLockInventory("Armbinder");
	CurrentTime = CurrentTime + 60000;
}

// Chapter 101 - RopeGroup - Amelia ties up the player in underwear
function C101_KinbakuClub_RopeGroup_AmeliaTies() {
	PlayerClothes("Underwear");
	PlayerLockInventory("Rope");
	CurrentTime = CurrentTime + 120000;
}

// Chapter 101 - RopeGroup - Amelia ties up the player in unfiorm
function C101_KinbakuClub_RopeGroup_AmeliaTiesDom() {
	PlayerLockInventory("Rope");
	CurrentTime = CurrentTime + 60000;
}

// Chapter 101 - RopeGroup - Amelia can force tie a submissive player
function C101_KinbakuClub_RopeGroup_NotTieMe() {
	if (ActorGetValue(ActorSubmission) <= -3) {
		OverridenIntroText = GetText("ForceTied");
		C101_KinbakuClub_RopeGroup_AmeliaTies();
		ActorChangeAttitude(0, -1)
		C101_KinbakuClub_RopeGroup_CurrentStage = 500;
	}
}

// Chapter 101 - RopeGroup - Player tells Amelia to tie charlotte instead
function C101_KinbakuClub_RopeGroup_TieCharlotte() {
	if (ActorSpecificGetValue("Charlotte", ActorSubmission) >= 4) OverridenIntroText = GetText("YouTry");
}








// Chapter 101 - RopeGroup - Prevent rerunning conversation loops
function C101_KinbakuClub_RopeGroup_Charlotte310Done() {
	C101_KinbakuClub_RopeGroup_Charlotte310NotDone = false;
}

// Chapter 101 - RopeGroup - Prevent rerunning conversation loops
function C101_KinbakuClub_RopeGroup_Charlotte320Done() {
	C101_KinbakuClub_RopeGroup_Charlotte320NotDone = false;
}

// Chapter 101 - RopeGroup - Prevent rerunning conversation loops
function C101_KinbakuClub_RopeGroup_Charlotte330Done() {
	C101_KinbakuClub_RopeGroup_Charlotte330NotDone = false;
}

// Chapter 101 - RopeGroup - Prevent rerunning conversation loops
function C101_KinbakuClub_RopeGroup_Charlotte340Done() {
	C101_KinbakuClub_RopeGroup_Charlotte340NotDone = false;
}

// Chapter 101 - RopeGroup - Prevent rerunning conversation loops
function C101_KinbakuClub_RopeGroup_Charlotte350Done() {
	C101_KinbakuClub_RopeGroup_Charlotte350NotDone = false;
}

// Chapter 101 - RopeGroup - Prevent rerunning conversation loops
function C101_KinbakuClub_RopeGroup_Charlotte360Done() {
	C101_KinbakuClub_RopeGroup_Charlotte360NotDone = false;
}

// Chapter 101 - RopeGroup - Grabs the selected twin
function C101_KinbakuClub_RopeGroup_Kidnap() {
	if (C101_KinbakuClub_RopeGroup_LeftTwinKidnapped || C101_KinbakuClub_RopeGroup_RightTwinKidnapped) {
		C101_KinbakuClub_RopeGroup_LoadAmelia()
		LeaveIcon = "";
		if (C101_KinbakuClub_RopeGroup_PersistantKidnapper) {
			C101_KinbakuClub_RopeGroup_CurrentStage = 120;
			OverridenIntroText = GetText("StopKidnapper");
		} else {
			C101_KinbakuClub_RopeGroup_CurrentStage = 110;
			OverridenIntroText = GetText("WarnKidnapper");
			C101_KinbakuClub_RopeGroup_PersistantKidnapper = true;
		}
	} else {
		if (C101_KinbakuClub_RopeGroup_CurrentStage == 450)	C101_KinbakuClub_RopeGroup_RightTwinKidnapped = true;
		else C101_KinbakuClub_RopeGroup_LeftTwinKidnapped = true;
		SetScene(CurrentChapter, "SlaveTwin");
	}
}

// Chapter 101 - RopeGroup - Release the twin on the right
function C101_KinbakuClub_RopeGroup_ReleaseTwin() {
}

// Chapter 101 - RopeGroup - Trick to tell twins appart
function C101_KinbakuClub_RopeGroup_WouldYourSister() {
	if (ActorGetValue(ActorName) == "Lucy") OverridenIntroText = GetText("WouldYourSisterNod");
	if (ActorGetValue(ActorName) == "Heather") OverridenIntroText = GetText("WouldYourSisterShake");
}

// Chapter 101 - RopeGroup - Player tells bound twin she is naught and should be punished
function C101_KinbakuClub_RopeGroup_NaughtyLeft() {
	if (!C101_KinbakuClub_RopeGroup_LeftTwinToldNaughty) ActorSpecificChangeAttitude(C101_KinbakuClub_RopeGroup_LeftTwin, -1, 1)
	C101_KinbakuClub_RopeGroup_LeftTwinToldNaughty = true;
}

// Chapter 101 - RopeGroup - Player tells bound twin she is naught and should be punished
function C101_KinbakuClub_RopeGroup_NaughtyRight() {
	if (!C101_KinbakuClub_RopeGroup_RightTwinToldNaughty) ActorSpecificChangeAttitude(C101_KinbakuClub_RopeGroup_RightTwin, -1, 1)
	C101_KinbakuClub_RopeGroup_RightTwinToldNaughty = true;
}

// Chapter 101 - RopeGroup - Player tells bound twin her ropes should be made even tighter
function C101_KinbakuClub_RopeGroup_TighterLeft() {
	if (!C101_KinbakuClub_RopeGroup_LeftTwinToldTighter) ActorSpecificChangeAttitude(C101_KinbakuClub_RopeGroup_LeftTwin, 0, 1)
	C101_KinbakuClub_RopeGroup_LeftTwinToldTighter = true;
}

// Chapter 101 - RopeGroup - Player tells bound twin her ropes should be made even tighter
function C101_KinbakuClub_RopeGroup_TighterRight() {
	if (!C101_KinbakuClub_RopeGroup_RightTwinToldTighter) ActorSpecificChangeAttitude(C101_KinbakuClub_RopeGroup_RightTwin, 0, 1)
	C101_KinbakuClub_RopeGroup_RightTwinToldTighter = true;
}

// Chapter 101 - RopeGroup - Player continues tickling the twin once she is crying.
function C101_KinbakuClub_RopeGroup_CharlotteDislike() {
	if (!C101_KinbakuClub_RopeGroup_KeptTickling) {
		ActorSpecificChangeAttitude("Charlotte", -1, 0)
		ActorSpecificChangeAttitude(C101_KinbakuClub_RopeGroup_RightTwin, -1, 1)
	}
	C101_KinbakuClub_RopeGroup_KeptTickling = true;
}

// Chapter 101 - RopeGroup - 
function C101_KinbakuClub_RopeGroup_template() {
}