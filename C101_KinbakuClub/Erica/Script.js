var C101_KinbakuClub_Erica_CurrentStage = 0;
var C101_KinbakuClub_Erica_Loop1 = true;
var C101_KinbakuClub_Erica_Loop2 = true;
var C101_KinbakuClub_Erica_Poverty = false;
var C101_KinbakuClub_Erica_SellMe = false;
var C101_KinbakuClub_Erica_PlayerIsGagged = false;
var C101_KinbakuClub_Erica_PlayerNotGagged = true;
var C101_KinbakuClub_Erica_PlayerNotBound = true;
var C101_KinbakuClub_Erica_PlayerBoundAndGagged = false;
var C101_KinbakuClub_Erica_PlayerIsFree = false;
var C101_KinbakuClub_Erica_PlayerBallGag = false;
var C101_KinbakuClub_Erica_PlayerClothGag = true;
var C101_KinbakuClub_Erica_PlayerRingGag = false;
var C101_KinbakuClub_Erica_First = true; // intro for stage 100
var C101_KinbakuClub_Erica_Again = false; // intro for stage 100
var C101_KinbakuClub_Erica_Kidnapper = false; // Signal that player can try kidnapping other actors.
var C101_KinbakuClub_Erica_Alone = 0; // time count when eric first leaves slave player alone.
var C101_KinbakuClub_Erica_GagRub = 0;
var C101_KinbakuClub_Erica_Pleasure1 = 0;
var C101_KinbakuClub_Erica_Pleasure2 = 0;
var C101_KinbakuClub_Erica_Pleasure3 = 0;
var C101_KinbakuClub_Erica_Pleasure4 = 0;
var C101_KinbakuClub_Erica_PleasuredErica = false;
var C101_KinbakuClub_Erica_Refuse = 0; // when player pulls back from pleasuring Erica
var C101_KinbakuClub_Erica_GoodEgg = false; // true if erica decides to use a normal egg.
var C101_KinbakuClub_Erica_PullCount = 0; // how many times the player trys pulling
var C101_KinbakuClub_Erica_EricaBroken = false; // if player brakes ericas will.
var C101_KinbakuClub_Erica_NoJoy = false;
var C101_KinbakuClub_Erica_EricaLeftCuffed = false;
var C101_KinbakuClub_Erica_EricaTied = false;
var C101_KinbakuClub_Erica_MasturbateCount = 0;
var C101_KinbakuClub_Erica_OrgasmDone = false;
var C101_KinbakuClub_Erica_EricaGagged = false;
var C101_KinbakuClub_Erica_EricaUnGagged = false; //After ungagging her, player can question slave erica
var C101_KinbakuClub_Erica_EricaBlindfolded = false;
var C101_KinbakuClub_Erica_SpankDone = false;
var C101_KinbakuClub_Erica_BrokenCollarDone = false;
var C101_KinbakuClub_Erica_SlaveGagged = true;
var C101_KinbakuClub_Erica_SlaveUnGagged = false;
var C101_KinbakuClub_Erica_SpecialEgg = false; // player asked about the erica's eggs.
var C101_KinbakuClub_Erica_CropDone = false;
var C101_KinbakuClub_Erica_NipplesDone = false;
var C101_KinbakuClub_Erica_Egg = false;
var C101_KinbakuClub_Erica_NoKeys = false;
var C101_KinbakuClub_Erica_Keys = false;
var C101_KinbakuClub_Erica_PlayerIsSlave = false;
var C101_KinbakuClub_Erica_Kidnapped = 0; // for intro text when erica removes a kidnapped players blindfold

// Calculates the scene parameters
function C101_KinbakuClub_Erica_CalcParams() {
	C101_KinbakuClub_Erica_PlayerIsGagged = (Common_PlayerGagged);
	C101_KinbakuClub_Erica_PlayerNotGagged = (!Common_PlayerGagged);
	C101_KinbakuClub_Erica_PlayerNotBound = (Common_PlayerNotRestrained);
	C101_KinbakuClub_Erica_EricaTied = ActorHasInventory("Rope");
	C101_KinbakuClub_Erica_EricaGagged = ActorIsGagged();
	C101_KinbakuClub_Erica_EricaBlindfolded = ActorHasInventory("Blindfold");
	C101_KinbakuClub_Erica_Keys = (C101_KinbakuClub_Erica_EricaUnGagged && C101_KinbakuClub_Erica_NoKeys);
}

// Chapter 101 - Erica Load
function C101_KinbakuClub_Erica_Load() {

	// Load the scene parameters
	ActorLoad("Erica", "ClubRoom2");
	LoadInteractions();
	C101_KinbakuClub_Erica_CalcParams();

	// Different stage if player approaches Erica while bound or gagged
	if ((C101_KinbakuClub_Erica_CurrentStage <= 100) && (Common_PlayerRestrained || Common_PlayerGagged || PlayerHasLockedInventory("Collar"))) {
		C101_KinbakuClub_Erica_LastStage = C101_KinbakuClub_Erica_CurrentStage;
		C101_KinbakuClub_Erica_CurrentStage = 100;
		LeaveIcon = "";
	} else LeaveIcon = "Leave";
	
	// If non bondage Player talks to Erica again
	if ((!PlayerHasLockedInventory("Rope") || !PlayerHasLockedInventory("Cuffs") || !PlayerHasLockedInventory("BallGag") || !PlayerHasLockedInventory("TapeGag") || !PlayerHasLockedInventory("ClothGag")) && (C101_KinbakuClub_Erica_CurrentStage == 90)) {
		C101_KinbakuClub_Erica_PlayerIsFree = true;
		C101_KinbakuClub_Erica_CurrentStage = C101_KinbakuClub_Erica_LastStage;
		if (C101_KinbakuClub_Erica_CurrentStage == 90) {
			C101_KinbakuClub_Erica_CurrentStage = 100;
		}
	} else C101_KinbakuClub_Erica_PlayerIsFree = false;
	
	// After loose fight and kidnapped during blind mans buff
	if (C101_KinbakuClub_Erica_CurrentStage >= 110 && C101_KinbakuClub_Erica_CurrentStage <= 270) LeaveIcon = "";

	// No leave straight after fight without restraining erica enough first
	if (C101_KinbakuClub_Erica_CurrentStage == 300) LeaveIcon = "";

	// Stage 310 and 320
	if (C101_KinbakuClub_Erica_CurrentStage == 320) C101_KinbakuClub_Erica_CurrentStage = 310
	if ((Common_PlayerRestrained) && (C101_KinbakuClub_Erica_CurrentStage == 310)) C101_KinbakuClub_Erica_CurrentStage = 325
	if ((!Common_PlayerRestrained) && (C101_KinbakuClub_Erica_CurrentStage == 325)) C101_KinbakuClub_Erica_CurrentStage = 310

	// Stage >= 400
	if (C101_KinbakuClub_Erica_CurrentStage >= 400) C101_KinbakuClub_Erica_CurrentStage = 290;
}

// Chapter 101 - Erica Run
function C101_KinbakuClub_Erica_Run() {
	BuildInteraction(C101_KinbakuClub_Erica_CurrentStage);
	if ((C101_KinbakuClub_Erica_CurrentStage == 310) || (C101_KinbakuClub_Erica_CurrentStage == 315) || (C101_KinbakuClub_Erica_CurrentStage == 325)) {
		if (ActorHasInventory("Rope")) {
			DrawInteractionActor();
		}
		if (ActorHasInventory("Cuffs")) OverridenIntroImage = "EricaCuffs.jpg";
		if (ActorHasInventory("Cuffs") && ActorHasInventory("Collar")) OverridenIntroImage = "EricaCollarCuffs.jpg";
		if (!ActorHasInventory("Rope") && !ActorHasInventory("Cuffs")) OverridenIntroImage = "EricaCaptured.jpg";
	}

	// Player gag images when erica is angry
	if (C101_KinbakuClub_Erica_CurrentStage == 410) {
		if (PlayerHasLockedInventory("BallGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/EricaGrabAngryBallGag.jpg", 777, 70);
		if (PlayerHasLockedInventory("ClothGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/EricaGrabAngryClothGag.jpg", 770, 186);
		if (PlayerHasLockedInventory("TapeGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/EricaGrabAngryTapeGag.jpg", 795, 194);
	}
}

// Chapter 101 - Erica Click
function C101_KinbakuClub_Erica_Click() {	

	// Regular and inventory interactions
	ClickInteraction(C101_KinbakuClub_Erica_CurrentStage);
	var ClickInv = GetClickedInventory();
	
	// Erica can be tied up at stage 310
	if ((C101_KinbakuClub_Erica_CurrentStage == 310) && (ClickInv != "") && (ClickInv != "Player") && !Common_PlayerRestrained) {

		
		// When the player wants to cuff erica
		if ((ClickInv == "Cuffs") && !ActorHasInventory("Rope")) {
			ActorApplyRestrain("Cuffs");
		}

		if (ActorHasInventory("Cuffs") && (ClickInv == "Collar")) {
			C101_KinbakuClub_Erica_EricaLeftCuffed = true;
			ActorApplyRestrain("Collar");
			LeaveIcon = "Leave";
			C101_KinbakuClub_Erica_Break()
		}

		// Erica reists some items if she is not tied up.
		if (!ActorHasInventory("Rope") && ((ClickInv == "BallGag") || (ClickInv == "ClothGag") || (ClickInv == "TapeGag") || (ClickInv == "Blindfold") || (ClickInv == "VibratingEgg"))) {
			OverridenIntroText = GetText("InsufficientRestraint");
		}

		// When the player wants to use the rope.
		if (ClickInv == "Rope") {
			if (ActorHasInventory("Cuffs")) {
				C101_KinbakuClub_Erica_EricaLeftCuffed = false;
				ActorRemoveInventory("Cuffs");
				PlayerAddInventory("Cuffs", 1);
			}
			ActorApplyRestrain("Rope");
			OverridenIntroImage = "";
			LeaveIcon = "Leave";
		}

		// Apply the clicked restrain only after Erica is tied
		if (ActorHasInventory("Rope")) ActorApplyRestrain(ClickInv);
		if (ActorHasInventory("Rope")) ActorSetCloth("Underwear");
		
		// When the user wants to use the crop on Erica
		if ((ClickInv == "Crop") && ActorHasInventory("Rope")) {
			if (!C101_KinbakuClub_Erica_CropDone) {
				C101_KinbakuClub_Erica_CropDone = true;
				ActorChangeAttitude(0, 1);
			}
			C101_KinbakuClub_Erica_Break();
			if (C101_KinbakuClub_Erica_EricaBroken) {
				OverridenIntroText = GetText("HumiliationCrop");
			}
		}
		
		C101_KinbakuClub_Erica_Break();

		// Humiliated responses to items.
		if ((ClickInv == "Blindfold") && (C101_KinbakuClub_Erica_EricaBroken)) OverridenIntroText = GetText("HumiliatedBlindfold");
		if ((ClickInv == "BallGag") && (C101_KinbakuClub_Erica_EricaBroken)) OverridenIntroText = GetText("HumiliatedBallGag");
		if ((ClickInv == "ClothGag") && (C101_KinbakuClub_Erica_EricaBroken)) OverridenIntroText = GetText("HumiliatedClothGag");
		if ((ClickInv == "TapeGag") && (C101_KinbakuClub_Erica_EricaBroken)) OverridenIntroText = GetText("HumiliatedTapeGag");
		if ((ClickInv == "Collar") && (!C101_KinbakuClub_Erica_EricaBroken)) C101_KinbakuClub_Erica_BrokenCollarDone = true;
		if ((ClickInv == "Collar") && (C101_KinbakuClub_Erica_EricaBroken) && (!C101_KinbakuClub_Erica_BrokenCollarDone)) {
			OverridenIntroText = GetText("HumiliatedCollar");
			C101_KinbakuClub_Erica_BrokenCollarDone = true;
		}

		C101_KinbakuClub_Erica_CalcParams()
	}
}

// Chapter 101 - Erica - Did these girls|ask for this? Loop
function C101_KinbakuClub_Erica_StopLoop1() {
	C101_KinbakuClub_Erica_Loop1 = false;
}

// Chapter 101 - Erica - You can't just|kidnap people. Loop
function C101_KinbakuClub_Erica_StopLoop2() {
	C101_KinbakuClub_Erica_Loop2 = false;
}

// Chapter 101 - Erica - Offers to enslave you for profit
function C101_KinbakuClub_Erica_SlaveOffer() {
	C101_KinbakuClub_Erica_SellMe = true;
}

// Chapter 101 - Erica - Player can't leave now
function C101_KinbakuClub_Erica_NoLeave() {
	LeaveIcon = "";
}

// Chapter 101 - Erica - Can't afford a slave
function C101_KinbakuClub_Erica_NotRichEnough() {
	C101_KinbakuClub_Erica_Poverty = true;
}

// Chapter 101 - Erica - Player gains option to kidnap other members
function C101_KinbakuClub_Erica_TryKidnapping() {
	C101_KinbakuClub_Erica_Kidnapper = true;
}

// Chapter 101 - Erica - Kidnap Fight
function C101_KinbakuClub_Erica_Fight() {	
	SetScene(CurrentChapter, "Fight");
	C101_KinbakuClub_Erica_Kidnapper = true;
}

// Chapter 101 - Erica - Player in partial bondage is collared
function C101_KinbakuClub_Erica_CollarLocked() {
	CurrentTime = CurrentTime + 60000;
	PlayerLockInventory("Collar");
}

// Chapter 101 - Erica - Player in partial bondage resists slavery
function C101_KinbakuClub_Erica_ResistedSlavery() {
	if ((Common_PlayerNotRestrained) && (C101_KinbakuClub_Erica_First)) {
		ActorChangeAttitude(1, 0);
	}
	if ((Common_PlayerNotGagged) && (C101_KinbakuClub_Erica_First)) {
		ActorChangeAttitude(-1, 0);
	}
	C101_KinbakuClub_Erica_First = false;
	C101_KinbakuClub_Erica_Again = true;
	LeaveIcon = "Leave";
}

// Chapter 101 - Erica - Player is bound and gagged how Erica wants her
function C101_KinbakuClub_Erica_PlayerSlaved() {
	C101_KinbakuClub_Erica_PlayerIsSlave = true;
	CurrentTime = CurrentTime + 180000;
	PlayerClothes("Underwear");
	PlayerReleaseBondage();
	PlayerLockInventory("Rope");
	PlayerLockInventory("ClothGag");
	PlayerLockInventory("Collar");
	C101_KinbakuClub_Erica_CalcParams();
}

// Chapter 101 - Erica - Player resists when grabbed from behind
function C101_KinbakuClub_Erica_ResistKidnap() {
	if (ActorGetValue(ActorSubmission) >= 1 ) {
		C101_KinbakuClub_Erica_CurrentStage = 90;
		OverridenIntroText = GetText("EscapeKidnap");
		LeaveIcon = "Leave";
		C101_KinbakuClub_Erica_First = false;
		C101_KinbakuClub_Erica_Again = true;
	} else C101_KinbakuClub_Erica_PlayerSlaved()
}

// Chapter 101 - Erica - When player agrees to be kissed better.
function C101_KinbakuClub_Erica_KissedBetter() {
	OverridenIntroImage = "KissBetter.jpg";
}

// Chapter 101 - Erica - remove special; images
function C101_KinbakuClub_Erica_ResetImage() {
	OverridenIntroImage = "";
}

// Chapter 101 - Erica - While Player is Erica's slave and left alone
function C101_KinbakuClub_Erica_AloneTime() {
	CurrentTime = CurrentTime + 60000;
	if (C101_KinbakuClub_Erica_GagRub > 3) {
		OverridenIntroImage = "EricaPlayerSlaveBall.jpg";
	}
	if (C101_KinbakuClub_Erica_GagRub == 3) {
		C101_KinbakuClub_Erica_GagRub++
	}
	if (C101_KinbakuClub_Erica_CurrentStage == 200) {
		if (C101_KinbakuClub_Erica_Alone >= 6) {
			OverridenIntroImage = ""
			if (PlayerHasLockedInventory("BallGag")) OverridenIntroImage = "EricaPlayerKneelingBall.jpg";
			C101_KinbakuClub_Erica_CurrentStage = 210;
			OverridenIntroText = GetText("EarnKeep");
		}
		C101_KinbakuClub_Erica_Alone++
	}
}

// Chapter 101 - Erica - When Player nuzzles Erica
function C101_KinbakuClub_Erica_AloneTimeNuzzle() {
	if (PlayerHasLockedInventory("BallGag")) {
		OverridenIntroText = GetText("NuzzleBallGag");
		if (C101_KinbakuClub_Erica_CurrentStage == 200) ActorChangeAttitude(-2, 1);
	}
	C101_KinbakuClub_Erica_AloneTime()
}

// Chapter 101 - Erica - Player tries to remove the gag, rubbing against the chair
function C101_KinbakuClub_Erica_AloneTimeGag() {
	if (PlayerHasLockedInventory("ClothGag")) {
		if (C101_KinbakuClub_Erica_GagRub >= 1) {
			OverridenIntroText = GetText("LooseClothGag");
		}
		if (C101_KinbakuClub_Erica_GagRub >= 2) {
			OverridenIntroText = GetText("ChangeGag");
			CurrentTime = CurrentTime + 80000;
			PlayerUnlockInventory("ClothGag");
			PlayerLockInventory("BallGag");
			OverridenIntroImage = "EricaPlayerKneelingBall.jpg";
		}
		C101_KinbakuClub_Erica_GagRub++
	} else {
		OverridenIntroText = GetText("RubBallGag");
	}
	C101_KinbakuClub_Erica_AloneTime()
	C101_KinbakuClub_Erica_CalcParams();
}

// Chapter 101 - Erica - Player ungagged for pleasure
function C101_KinbakuClub_Erica_PlayerUngag() {
	CurrentTime = CurrentTime + 80000;
	PlayerUnlockInventory("BallGag");
	PlayerUnlockInventory("ClothGag");
	OverridenIntroImage = "";
	C101_KinbakuClub_Erica_CalcParams();
}

// Chapter 101 - Erica - When Player is slave and pleasures her
function C101_KinbakuClub_Erica_Pleasure(PleasureType) {
	
	// The player must pleasure her in 3 different ways and at least 5 times to make her climax)
	if (PleasureType == 1) C101_KinbakuClub_Erica_Pleasure1++;
	if (PleasureType == 2) C101_KinbakuClub_Erica_Pleasure2++;
	if (PleasureType == 3) C101_KinbakuClub_Erica_Pleasure3++;
	if (PleasureType == 4) C101_KinbakuClub_Erica_Pleasure4++;
	if ((C101_KinbakuClub_Erica_Pleasure2 > 1) && (C101_KinbakuClub_Erica_Pleasure3 > 0) && (C101_KinbakuClub_Erica_Pleasure1 + C101_KinbakuClub_Erica_Pleasure2 + C101_KinbakuClub_Erica_Pleasure3 >= 4)) {
		
		// Erica gets an orgasm
		OverridenIntroText = GetText("EricaPleasureOrgasm");
		C101_KinbakuClub_Erica_CurrentStage = 250;
		ActorChangeAttitude(1, 0);
		ActorAddOrgasm();
		C101_KinbakuClub_Erica_PleasuredErica = true;
	}

	// If the player took too long to try all 3 pleasures or pulls back too often, she gives up
	if (C101_KinbakuClub_Erica_Pleasure1 + C101_KinbakuClub_Erica_Pleasure2 + C101_KinbakuClub_Erica_Pleasure3 + C101_KinbakuClub_Erica_Pleasure4 >= 7) {
		OverridenIntroText = GetText("StopPleasure");
		ActorChangeAttitude(-1, 0);
		C101_KinbakuClub_Erica_CurrentStage = 250;
	}
}

// Chapter 101 - Erica - Player bites erica
function C101_KinbakuClub_Erica_Bite() {
	C101_KinbakuClub_Erica_Pleasure4++
	ActorChangeAttitude(-1, 1);
	CurrentTime = CurrentTime + 60000;
	PlayerLockInventory("BallGag");
	C101_KinbakuClub_Erica_PlayerRingGag = true;
	C101_KinbakuClub_Erica_CalcParams();
}

// Chapter 101 - Erica - Player tries to pull away from Erica's pleasure
function C101_KinbakuClub_Erica_PullBack() {
	if (C101_KinbakuClub_Erica_Refuse == 1) {
		OverridenIntroText = GetText("LetOut");
		C101_KinbakuClub_Erica_CurrentStage = 240;
	}
	if (C101_KinbakuClub_Erica_Refuse >= 2) {
		C101_KinbakuClub_Erica_Pleasure(4)
	}
	C101_KinbakuClub_Erica_Refuse++
}

// Chapter 101 - Erica - Player asks to be released
function C101_KinbakuClub_Erica_PlayerRelease() {
	CurrentTime = CurrentTime + 80000;
	PlayerLockInventory("BallGag");
	if ((ActorGetValue(ActorLove) - ActorGetValue(ActorSubmission) <= 0) && (!C101_KinbakuClub_Erica_PlayerRingGag)) {
		OverridenIntroText = GetText("Free");
		PlayerUnlockInventory("BallGag");
		C101_KinbakuClub_Erica_CurrentStage = 280;
	}
	if ((ActorGetValue(ActorLove) - ActorGetValue(ActorSubmission) <= 2) && (C101_KinbakuClub_Erica_PlayerRingGag)) {
		OverridenIntroText = GetText("Freeish");
		PlayerUnlockInventory("BallGag");
		C101_KinbakuClub_Erica_CurrentStage = 280;
	}
	C101_KinbakuClub_Erica_CalcParams();
}

// Chapter 101 - Erica - Player asks Erica for pleasure, player only teased if not liked enough.
function C101_KinbakuClub_Erica_PlayerPleasure() {
	if ((ActorGetValue(ActorLove) >= 4) && (C101_KinbakuClub_Erica_PleasuredErica)) {
		OverridenIntroText = GetText("PleasurePlayer");
		C101_KinbakuClub_Erica_GoodEgg = true;
	}
	CurrentTime = CurrentTime + 80000;
	PlayerLockInventory("BallGag");	
	C101_KinbakuClub_Erica_CalcParams();
}

// Chapter 101 - Erica - Player gets and vibe egg
function C101_KinbakuClub_Erica_AddedEgg() {
	if (PlayerHasLockedInventory("VibratingEgg")) OverridenIntroText = GetText("ChangeEgg");
	else PlayerLockInventory("VibratingEgg");
}

// Chapter 101 - Erica - If the player pulls the crotch rope while allown
function C101_KinbakuClub_Erica_AloneTimeEgg() {
	C101_KinbakuClub_Erica_PullCount++
	if (C101_KinbakuClub_Erica_GoodEgg) {
		OverridenIntroText = GetText("PullGood1");
		if (C101_KinbakuClub_Erica_PullCount >= 2) OverridenIntroText = GetText("PullGood2");
		if (C101_KinbakuClub_Erica_PullCount >= 3) OverridenIntroText = GetText("PullGood3");
		if (C101_KinbakuClub_Erica_PullCount == 4) {
			OverridenIntroText = GetText("PullGood4");
			ActorAddOrgasm();
			ActorChangeAttitude(1, -1);
		}
		if (C101_KinbakuClub_Erica_PullCount >= 5) OverridenIntroText = GetText("PullGood5");
	}
	else {
		if (C101_KinbakuClub_Erica_PullCount >= 2) OverridenIntroText = GetText("PullFrustrating2");
		if (C101_KinbakuClub_Erica_PullCount >= 3) OverridenIntroText = GetText("PullFrustrating3");
		if (C101_KinbakuClub_Erica_PullCount >= 4) {
			OverridenIntroText = GetText("PullFrustrating4");
			C101_KinbakuClub_Erica_NoJoy = true;
		}
	}
	C101_KinbakuClub_Erica_AloneTime()
}

// Chapter 101 - Erica - Player waits for help
function C101_KinbakuClub_Erica_SkipToTransition() {
	CurrentTime = (C101_KinbakuClub_JennaIntro_LeaveTime * 60 * 60 * 1000);
}

// Chapter 101 - Erica - remove players Collar
function C101_KinbakuClub_Erica_PlayerReleased() {
	CurrentTime = CurrentTime + 60000;
	if (!C999_Common_Collar_LockedOn) PlayerUnlockInventory("Collar")
	C101_KinbakuClub_Erica_PlayerIsSlave = false;
	LeaveIcon = "Leave"
}

// Chapter 101 - Erica - remove players Collar but gets gagged
function C101_KinbakuClub_Erica_PlayerReleasedGag() {
	CurrentTime = CurrentTime + 60000;
	PlayerLockInventory("BallGag")
	if (!C999_Common_Collar_LockedOn) PlayerUnlockInventory("Collar")
	C101_KinbakuClub_Erica_PlayerIsSlave = false;
	LeaveIcon = "Leave"
}

// Chapter 101 - Erica - Player gets a collar after capturing erica
function C101_KinbakuClub_Erica_GetCollar() {
	PlayerAddInventory("Collar", 1);
}

// Chapter 101 - Erica - Player removes Erica's gag
function C101_KinbakuClub_Erica_EricaUngag() {
	CurrentTime = CurrentTime + 60000;
	ActorUngag()
	C101_KinbakuClub_Erica_EricaUnGagged = true;
	if (C101_KinbakuClub_Erica_EricaBroken) {
		OverridenIntroText = GetText("HumiliatedUngag")
	}
	C101_KinbakuClub_Erica_CalcParams()
}

// Chapter 101 - Erica - Player removes Erica's blindfold
function C101_KinbakuClub_Erica_EricaUnBlindfold() {
	if (ActorHasInventory("Blindfold")) {
		ActorRemoveInventory("Blindfold"); PlayerAddInventory("Blindfold", 1);
	}
	C101_KinbakuClub_Erica_CalcParams()
}

// Chapter 101 - Erica - Player masturbates erica
function C101_KinbakuClub_Erica_Break() {
	if ((C101_KinbakuClub_Erica_OrgasmDone) && (C101_KinbakuClub_Erica_SpankDone || C101_KinbakuClub_Erica_CropDone) && (C101_KinbakuClub_Erica_NipplesDone) && ActorHasInventory("Collar")) {
		C101_KinbakuClub_Erica_EricaBroken = true;
		ActorSetPose("Humiliated");
	}
	C101_KinbakuClub_Erica_CalcParams()
}

// Chapter 101 - Erica - Player masturbates erica
function C101_KinbakuClub_Erica_EricaMasturbate() {
	CurrentTime = CurrentTime + 60000;
	C101_KinbakuClub_Erica_MasturbateCount++;
	if (ActorHasInventory("VibratingEgg")) {
		C101_KinbakuClub_Erica_MasturbateCount++;
	}
	if ((C101_KinbakuClub_Erica_MasturbateCount >= 5) && (!C101_KinbakuClub_Erica_OrgasmDone)) {
		OverridenIntroText = GetText("EricaMasturbateOrgasm");
		ActorAddOrgasm();
		ActorChangeAttitude(0, 2);
		C101_KinbakuClub_Erica_OrgasmDone = true;
	}
	if (C101_KinbakuClub_Erica_EricaBroken) OverridenIntroText = GetText("HumiliatedMasturbate");
	C101_KinbakuClub_Erica_Break();
}

// Chapter 101 - Erica - player spanks erica
function C101_KinbakuClub_Erica_EricaSpanked() {
	if (!C101_KinbakuClub_Erica_SpankDone) {
		ActorChangeAttitude(0, 1);
		C101_KinbakuClub_Erica_SpankDone = true;
	}
	C101_KinbakuClub_Erica_Break();
	if (C101_KinbakuClub_Erica_EricaBroken) {
		OverridenIntroText = GetText("HumiliatedSpank");
	}
}

// Chapter 101 - Erica - player plays with erica's nipples.
function C101_KinbakuClub_Erica_EricaNipples() {
	if (!C101_KinbakuClub_Erica_NipplesDone) {
		ActorChangeAttitude(0, 1);
		C101_KinbakuClub_Erica_NipplesDone = true;
	}
	C101_KinbakuClub_Erica_Break()
	if (C101_KinbakuClub_Erica_EricaBroken) {
		OverridenIntroText = GetText("HumiliatedNipples");
	}
}

// Chapter 101 - Erica - When player has other slaves, no exit
function C101_KinbakuClub_Erica_OtherSlaves() {
	LeaveIcon = ""
}

// Chapter 101 - Erica - When player goes to erica calcparams
function C101_KinbakuClub_Erica_GotoErica() {
	C101_KinbakuClub_Erica_CalcParams()
	LeaveIcon = "Leave"
}

// Chapter 101 - Erica - if erica interogates erica after breaking her
function C101_KinbakuClub_Erica_EricaInterogate() {
	if (C101_KinbakuClub_Erica_EricaBroken) {
		OverridenIntroText = GetText("HumiliatedKey");
	}
}

// Chapter 101 - Erica - Ericas response after player has broken her
function C101_KinbakuClub_Erica_EricaIsBroken() {
	if (C101_KinbakuClub_Erica_EricaBroken) OverridenIntroText = GetText("HumiliatedBroken");
	if (C101_KinbakuClub_Erica_EricaBroken && C101_KinbakuClub_Erica_EricaGagged) OverridenIntroText = GetText("HumiliatedBrokenGagged");
	if (!C101_KinbakuClub_Erica_EricaBroken && C101_KinbakuClub_Erica_EricaGagged) OverridenIntroText = GetText("NotBrokenGagged");
}

// Chapter 101 - Erica - player lets erica go
function C101_KinbakuClub_Erica_EricaFreed() {
	OverridenIntroImage = "";
	ActorUntie();
	ActorUngag();
	C101_KinbakuClub_Erica_CalcParams()
	CurrentTime = CurrentTime + 60000;
	if (!C101_KinbakuClub_Erica_EricaBroken) {
		C101_KinbakuClub_Erica_CurrentStage = 400;
		OverridenIntroText = GetText("UnbrokenLetGo");
		if (ActorGetValue(ActorLove) >= 1) LeaveIcon = "Leave";
		else LeaveIcon = "";
	}
}

// Chapter 101 - Erica - player removes dancer slave's gag
function C101_KinbakuClub_Erica_SlaveUngag() {
	CurrentTime = CurrentTime + 60000;
	PlayerAddInventory("BallGag", 1);
	C101_KinbakuClub_Erica_SlaveGagged = false;
	C101_KinbakuClub_Erica_SlaveUnGagged = true;
	OverridenIntroImage = "SlaveDancer.jpg";
}

// Chapter 101 - Erica - player ask about padlock keys
function C101_KinbakuClub_Erica_SlaveKeys() {
	C101_KinbakuClub_Erica_NoKeys = true;
}

// Chapter 101 - Erica - player trys to pleasure dance slave
function C101_KinbakuClub_Erica_SlavePleasure() {
	if (C101_KinbakuClub_Erica_SlaveUnGagged) {
		OverridenIntroText = GetText("SlaveEgg");
		C101_KinbakuClub_Erica_Egg = true;
	}
}

// Chapter 101 - Erica - Player asks dancer slave about the egg
function C101_KinbakuClub_Erica_SlaveWhatEgg() {
	if (C101_KinbakuClub_Erica_SlaveGagged) {
		OverridenIntroText = GetText("SlaveMmmph");
	}
}

// Chapter 101 - Erica - Player leaves erica's slaves
function C101_KinbakuClub_Erica_LeaveSlave() {
	if (C101_KinbakuClub_Erica_SlaveUnGagged) {
		OverridenIntroText = GetText("SlavePleaseGag");
		PlayerRemoveInventory("BallGag", 1);
		C101_KinbakuClub_Erica_SlaveGagged = true;
		C101_KinbakuClub_Erica_SlaveUnGagged = false;
		OverridenIntroImage = "";
	}
}

// Chapter 101 - Erica - Player gets manacled
function C101_KinbakuClub_Erica_ManacledSlave() {
	C101_KinbakuClub_Slaves_CurrentStage = 115;
	SetScene(CurrentChapter, "Slaves");
}

// Chapter 101 - Erica - Player resists and gets the bad end alternative
function C101_KinbakuClub_Erica_BadEnd() {
	PlayerRemoveAllInventory();
	SetScene(CurrentChapter, "EricaBadEnd");
}