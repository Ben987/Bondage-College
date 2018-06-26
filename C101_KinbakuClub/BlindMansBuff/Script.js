var C101_KinbakuClub_BlindMansBuff_CurrentStage = 0;
var C101_KinbakuClub_BlindMansBuff_PlayerIsCuffed = false;
var C101_KinbakuClub_BlindMansBuff_PlayerCuffCall = false;
var C101_KinbakuClub_BlindMansBuff_PlayerIsGagged = false;
var C101_KinbakuClub_BlindMansBuff_TouchSomebody = false;
var C101_KinbakuClub_BlindMansBuff_FeelSomebody = false;
var C101_KinbakuClub_BlindMansBuff_PlayerRobbed = false;
var C101_KinbakuClub_BlindMansBuff_Random = 0; // Random number score for response
var C101_KinbakuClub_BlindMansBuff_Result = 0; // Random number score for lose life, response or sense victory
var C101_KinbakuClub_BlindMansBuff_TooSlow = false; // staying still won't save you
var C101_KinbakuClub_BlindMansBuff_EricaHelping = true;
var C101_KinbakuClub_BlindMansBuff_GagCall = 0;
var C101_KinbakuClub_BlindMansBuff_PlayerGaggedOnly = false;
var C101_KinbakuClub_BlindMansBuff_PlayerIsFree = true;

// Calculates the scene parameters
function C101_KinbakuClub_BlindMansBuff_CalcParams() {
	C101_KinbakuClub_BlindMansBuff_PlayerIsCuffed = PlayerHasLockedInventory("Cuffs");
	//if (!PlayerHasLockedInventory("Cuffs")) C101_KinbakuClub_BlindMansBuff_PlayerIsCuffed = false;
	C101_KinbakuClub_BlindMansBuff_PlayerIsGagged = Common_PlayerGagged;
	C101_KinbakuClub_BlindMansBuff_PlayerIsFree = Common_PlayerNotRestrained;
}

// Chapter 101 - BlindMansBuff Load
function C101_KinbakuClub_BlindMansBuff_Load() {

	// Load the scene parameters
	LoadInteractions();
	C101_KinbakuClub_BlindMansBuff_CalcParams();
	LeaveIcon = "";
	if (C101_KinbakuClub_BlindMansBuff_CurrentStage == 15) {
		C101_KinbakuClub_BlindMansBuff_CurrentStage = 10;
	}
	if (C101_KinbakuClub_Lauren_LaurenChairCuffed) {
		C101_KinbakuClub_BlindMansBuff_CurrentStage = 5;
		LeaveIcon = "Wait";
	}
	if ((C101_KinbakuClub_BlindMansBuff_CurrentStage <= 25) && (!PlayerHasLockedInventory("Blindfold"))) {
		LeaveIcon = "Leave";
		LeaveScreen = "ClubRoom1";
		C101_KinbakuClub_BlindMansBuff_CurrentStage = 15;
	}
	if (C101_KinbakuClub_Erica_CurrentStage >= 100) C101_KinbakuClub_BlindMansBuff_EricaHelping = false;
}

// Chapter 101 - BlindMansBuff Run
function C101_KinbakuClub_BlindMansBuff_Run() {
	BuildInteraction(C101_KinbakuClub_BlindMansBuff_CurrentStage);
}

// Chapter 101 - BlindMansBuff Click
function C101_KinbakuClub_BlindMansBuff_Click() {	

	// Regular and inventory interactions
	ClickInteraction(C101_KinbakuClub_BlindMansBuff_CurrentStage);
	var ClickInv = GetClickedInventory();
	if (C101_KinbakuClub_BlindMansBuff_CurrentStage <= 25 && ClickInv == "Player") {
        C101_KinbakuClub_BlindMansBuff_IntroText = OverridenIntroText;
        C101_KinbakuClub_BlindMansBuff_LeaveIcon = LeaveIcon;
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

	// Recalculates the scene parameters
    C101_KinbakuClub_BlindMansBuff_CalcParams();
}


// Chapter 101 - BlindMansBuff - What happened? Find, lose or nothing.
function C101_KinbakuClub_BlindMansBuff_WhatHappened() {
	C101_KinbakuClub_BlindMansBuff_Result = Math.floor(Math.random() * 20);
	if ((C101_KinbakuClub_BlindMansBuff_Result <= 3) && (!C101_KinbakuClub_BlindMansBuff_TooSlow)) {
		C101_KinbakuClub_BlindMansBuff_CurrentStage = 20;
		C101_KinbakuClub_BlindMansBuff_Random = Math.floor(Math.random() * 4);
		if (C101_KinbakuClub_BlindMansBuff_Random == 0)	OverridenIntroText = GetText("Lost0");
		if (C101_KinbakuClub_BlindMansBuff_Random == 1) OverridenIntroText = GetText("Lost1");
		if (C101_KinbakuClub_BlindMansBuff_Random == 2) OverridenIntroText = GetText("Lost2");
		if (C101_KinbakuClub_BlindMansBuff_Random == 3) OverridenIntroText = GetText("Lost3");
	}
	if ((C101_KinbakuClub_BlindMansBuff_Result <= 3) && (C101_KinbakuClub_BlindMansBuff_TooSlow)) {
		C101_KinbakuClub_BlindMansBuff_CurrentStage = 20;
		OverridenIntroText = GetText("Lost1");
	}
	C101_KinbakuClub_BlindMansBuff_TooSlow = false;
	if (C101_KinbakuClub_BlindMansBuff_Result >= 16) {
		if (!PlayerHasLockedInventory("Cuffs")) {
			C101_KinbakuClub_BlindMansBuff_TouchSomebody = true;
			OverridenIntroText = GetText("Touching");
		}
		if (PlayerHasLockedInventory("Cuffs")) {
			C101_KinbakuClub_BlindMansBuff_FeelSomebody = true;
			OverridenIntroText = GetText("Feeling");
		}
	}
}

// Chapter 101 - BlindMansBuff - Stand still and listen
function C101_KinbakuClub_BlindMansBuff_StandStill() {
	C101_KinbakuClub_BlindMansBuff_TouchSomebody = false;
	C101_KinbakuClub_BlindMansBuff_FeelSomebody = false;
	C101_KinbakuClub_BlindMansBuff_Random = Math.floor(Math.random() * 4);
	if (C101_KinbakuClub_BlindMansBuff_Random == 0)	OverridenIntroText = GetText("Listen0");
	if (C101_KinbakuClub_BlindMansBuff_Random == 1) OverridenIntroText = GetText("Listen1");
	if (C101_KinbakuClub_BlindMansBuff_Random == 2) OverridenIntroText = GetText("Listen2");
	if (C101_KinbakuClub_BlindMansBuff_Random == 3) OverridenIntroText = GetText("Listen3");
	C101_KinbakuClub_BlindMansBuff_TooSlow = true;
}

// Chapter 101 - BlindMansBuff - Go forwards
function C101_KinbakuClub_BlindMansBuff_Fore() {
	C101_KinbakuClub_BlindMansBuff_TouchSomebody = false;
	C101_KinbakuClub_BlindMansBuff_FeelSomebody = false;
	C101_KinbakuClub_BlindMansBuff_Random = Math.floor(Math.random() * 4);
	if (C101_KinbakuClub_BlindMansBuff_Random == 0)	OverridenIntroText = GetText("Forwards0");
	if (C101_KinbakuClub_BlindMansBuff_Random == 1) OverridenIntroText = GetText("Forwards1");
	if (C101_KinbakuClub_BlindMansBuff_Random == 2) OverridenIntroText = GetText("Forwards2");
	if (C101_KinbakuClub_BlindMansBuff_Random == 3) OverridenIntroText = GetText("Forwards3");
	C101_KinbakuClub_BlindMansBuff_WhatHappened()
}

// Chapter 101 - BlindMansBuff - Go backwards
function C101_KinbakuClub_BlindMansBuff_Aft() {
	C101_KinbakuClub_BlindMansBuff_TouchSomebody = false;
	C101_KinbakuClub_BlindMansBuff_FeelSomebody = false;
	C101_KinbakuClub_BlindMansBuff_Random = Math.floor(Math.random() * 4);
	if (C101_KinbakuClub_BlindMansBuff_Random == 0)	OverridenIntroText = GetText("Backwards0");
	if (C101_KinbakuClub_BlindMansBuff_Random == 1) OverridenIntroText = GetText("Backwards1");
	if (C101_KinbakuClub_BlindMansBuff_Random == 2) OverridenIntroText = GetText("Backwards2");
	if (C101_KinbakuClub_BlindMansBuff_Random == 3) OverridenIntroText = GetText("Backwards3");
	C101_KinbakuClub_BlindMansBuff_WhatHappened()
}

// Chapter 101 - BlindMansBuff - Turn left or right
function C101_KinbakuClub_BlindMansBuff_Turn() {
	C101_KinbakuClub_BlindMansBuff_TouchSomebody = false;
	C101_KinbakuClub_BlindMansBuff_FeelSomebody = false;
	C101_KinbakuClub_BlindMansBuff_Random = Math.floor(Math.random() * 4);
	if (C101_KinbakuClub_BlindMansBuff_Random == 0)	OverridenIntroText = GetText("Turn0");
	if (C101_KinbakuClub_BlindMansBuff_Random == 1) OverridenIntroText = GetText("Turn1");
	if (C101_KinbakuClub_BlindMansBuff_Random == 2) OverridenIntroText = GetText("Turn2");
	if (C101_KinbakuClub_BlindMansBuff_Random == 3) OverridenIntroText = GetText("Turn3");
	C101_KinbakuClub_BlindMansBuff_WhatHappened()
}

// Chapter 101 - BlindMansBuff - Marco
function C101_KinbakuClub_BlindMansBuff_Marco() {
	C101_KinbakuClub_BlindMansBuff_TouchSomebody = false;
	C101_KinbakuClub_BlindMansBuff_FeelSomebody = false;
	C101_KinbakuClub_BlindMansBuff_Random = Math.floor(Math.random() * 4);
	if (C101_KinbakuClub_BlindMansBuff_Random == 0)	OverridenIntroText = GetText("Marco0");
	if (C101_KinbakuClub_BlindMansBuff_Random == 1) OverridenIntroText = GetText("Marco1");
	if (C101_KinbakuClub_BlindMansBuff_Random == 2) OverridenIntroText = GetText("Marco2");
	if (C101_KinbakuClub_BlindMansBuff_Random == 3) OverridenIntroText = GetText("Marco3");
}

// Chapter 101 - BlindMansBuff - Player asks to be uncuffed
function C101_KinbakuClub_BlindMansBuff_SomeoneUncuff() {
	C101_KinbakuClub_BlindMansBuff_TouchSomebody = false;
	C101_KinbakuClub_BlindMansBuff_FeelSomebody = false;
	if (C101_KinbakuClub_BlindMansBuff_PlayerCuffCall && !C101_KinbakuClub_BlindMansBuff_PlayerRobbed) {
		C101_KinbakuClub_BlindMansBuff_Theft()
	}
	C101_KinbakuClub_BlindMansBuff_PlayerCuffCall = true;
}

// Chapter 101 - BlindMansBuff - Items theft
function C101_KinbakuClub_BlindMansBuff_Theft() {
	OverridenIntroText = GetText("StealItems");
	PlayerRemoveAllInventory();
	C101_KinbakuClub_BlindMansBuff_PlayerRobbed = true;
}

// Chapter 101 - BlindMansBuff - Complain about the theft
function C101_KinbakuClub_BlindMansBuff_Complain() {
	PlayerLockInventory("BallGag");
	OverridenIntroText = GetText("ShutUp");
	C101_KinbakuClub_BlindMansBuff_TouchSomebody = false;
	C101_KinbakuClub_BlindMansBuff_FeelSomebody = false;
}

// Chapter 101 - BlindMansBuff - Life lost
function C101_KinbakuClub_BlindMansBuff_LifeLost() {
	if (Common_PlayerRestrained && Common_PlayerGagged && C101_KinbakuClub_BlindMansBuff_PlayerRobbed) {
		OverridenIntroText = GetText("GameOver");
		C101_KinbakuClub_BlindMansBuff_CurrentStage = 30;
	}
	if (Common_PlayerRestrained && C101_KinbakuClub_BlindMansBuff_PlayerRobbed && Common_PlayerNotGagged) { //&& (C101_KinbakuClub_BlindMansBuff_CurrentStage == 20)) {
		OverridenIntroText = GetText("Gagged");
		if (PlayerHasInventory("BallGag")) PlayerRemoveInventory("BallGag", 1);
		PlayerLockInventory("BallGag");
	}
	if (Common_PlayerRestrained && (!C101_KinbakuClub_BlindMansBuff_PlayerRobbed)) {
		C101_KinbakuClub_BlindMansBuff_Theft()
	}
	if (Common_PlayerNotRestrained) {
		OverridenIntroText = GetText("Cuffed");
		if (PlayerHasInventory("Cuffs")) PlayerRemoveInventory("Cuffs", 1);
		PlayerLockInventory("Cuffs");
	}
}

// Chapter 101 - BlindMansBuff - Player tries to capture someone
function C101_KinbakuClub_BlindMansBuff_Capture() {
	C101_KinbakuClub_BlindMansBuff_Result = Math.floor(Math.random() * 20);
	if ((C101_KinbakuClub_BlindMansBuff_TouchSomebody) && (C101_KinbakuClub_BlindMansBuff_Result >= 7)) {
		C101_KinbakuClub_BlindMansBuff_CurrentStage = 100;
		OverridenIntroText = GetText("Wrestle");
	}
	if ((C101_KinbakuClub_BlindMansBuff_FeelSomebody) && (C101_KinbakuClub_BlindMansBuff_Result >= 10)) {
		C101_KinbakuClub_BlindMansBuff_CurrentStage = 100;
		OverridenIntroText = GetText("Pin");
	}
	if (C101_KinbakuClub_BlindMansBuff_Result <= 5) {
		C101_KinbakuClub_BlindMansBuff_CurrentStage = 20;
		OverridenIntroText = GetText("Dodged");
	}
	C101_KinbakuClub_BlindMansBuff_TouchSomebody = false;
	C101_KinbakuClub_BlindMansBuff_FeelSomebody = false;
}

// Chapter 101 - BlindMansBuff - When the player looses the game
function C101_KinbakuClub_BlindMansBuff_Lost() {
	if (Common_PlayerNotRestrained || Common_PlayerNotGagged || (Common_PlayerRestrained && !PlayerHasLockedInventory("Cuffs")) || (Common_PlayerGagged && !PlayerHasLockedInventory("BallGag"))) {
		PlayerReleaseBondage()
		if (PlayerHasInventory("Cuffs")) PlayerRemoveInventory("Cuffs", 1);
		PlayerLockInventory("Cuffs");
		if (PlayerHasInventory("BallGag")) PlayerRemoveInventory("BallGag", 1);
		PlayerLockInventory("BallGag");
	}
}

// Chapter 101 - BlindMansBuff - When the player looses the game
function C101_KinbakuClub_BlindMansBuff_GameOver() {
	C101_KinbakuClub_BlindMansBuff_CurrentStage = 10;
	C101_KinbakuClub_Lauren_CurrentStage = 600;
	SetScene(CurrentChapter, "Lauren");
}

// Chapter 101 - BlindMansBuff - Player has their handcuffs unlocked
function C101_KinbakuClub_BlindMansBuff_UnCuffed() {
	PlayerUnlockInventory("Cuffs");
	C101_KinbakuClub_BlindMansBuff_CalcParams()
}

// Chapter 101 - BlindMansBuff - Player has their ropes untied
function C101_KinbakuClub_BlindMansBuff_Untie() {
	PlayerUnlockInventory("rope");
	C101_KinbakuClub_BlindMansBuff_CalcParams()
}

// Chapter 101 - BlindMansBuff - Gagged player calls out after winning BB game
function C101_KinbakuClub_BlindMansBuff_SlaveCall() {
	if (C101_KinbakuClub_BlindMansBuff_EricaHelping) C101_KinbakuClub_BlindMansBuff_CurrentStage == 110;
	if (C101_KinbakuClub_BlindMansBuff_GagCall >= 1) {
		OverridenIntroText = GetText("Helped");
		PlayerUnlockInventory("BallGag");
		C101_KinbakuClub_BlindMansBuff_CalcParams()
	}
	C101_KinbakuClub_BlindMansBuff_GagCall++;
}

// Chapter 101 - BlindMansBuff - Player removers blindfold
function C101_KinbakuClub_BlindMansBuff_UnBlindfold() {
	PlayerUnlockInventory("Blindfold");
	PlayerAddInventory("Blindfold", 1);
	PlayerUngag()
	if (C101_KinbakuClub_BlindMansBuff_CurrentStage >= 100) {
		C101_KinbakuClub_BlindMansBuff_CurrentStage = 10;
		C101_KinbakuClub_Lauren_CurrentStage = 300;
		SetScene(CurrentChapter, "Lauren");
	} else {
		LeaveIcon = "Leave";
		LeaveScreen = "ClubRoom1";
	}
}

// Chapter 101 - BlindMansBuff - Player is collared
function C101_KinbakuClub_BlindMansBuff_Collared() {
	PlayerLockInventory("Collar");
}

// Chapter 101 - BlindMansBuff - Erica removes kidnapped players blindfold
function C101_KinbakuClub_BlindMansBuff_EricaKidnap1() {
	PlayerUnlockInventory("Blindfold");
	C101_KinbakuClub_Erica_CurrentStage = 110;
	SetScene(CurrentChapter, "Erica");
}

function C101_KinbakuClub_BlindMansBuff_EricaKidnap2() {
	PlayerUnlockInventory("Blindfold");
	C101_KinbakuClub_Erica_CurrentStage = 111;
	SetScene(CurrentChapter, "Erica");
}

function C101_KinbakuClub_BlindMansBuff_EricaKidnap3() {
	PlayerUnlockInventory("Blindfold");
	C101_KinbakuClub_Erica_CurrentStage = 112;
	SetScene(CurrentChapter, "Erica");
}