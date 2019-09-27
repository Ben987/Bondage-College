var C101_KinbakuClub_Slaves_CurrentStage = 0;
var C101_KinbakuClub_Slaves_ReadyForSlaves = false;
var C101_KinbakuClub_Slaves_Manacles = false; // True when player has inspected them.
var C101_KinbakuClub_Slaves_Padlocks = false; // True when player has inspected them.
var C101_KinbakuClub_Slaves_Rings = false; // True when player has inspected them.
var C101_KinbakuClub_Slaves_SelfSlaveAvailable = false;
var C101_KinbakuClub_Slaves_ReadyMessageDone = false;
var C101_KinbakuClub_Slaves_ChastityWarning = false; // For the warning before actually locking them on.
var C101_KinbakuClub_Slaves_ManacleWarning = false; // For the warning before actually locking them on.
var C101_KinbakuClub_Slaves_ManacleTime = 0; // Count of how many waiting actions after locking manacles to trigger Jenna.
var C101_KinbakuClub_Slaves_JennaDone = false; // false if Jenna hasn't already reappeared.
var C101_KinbakuClub_Slaves_JennaWillGag = false; // jenna will gag a noise player if she leaves them
var C101_KinbakuClub_Slaves_WaitingDone = false;
var C101_KinbakuClub_Slaves_SelfShackle = false; // true if player shackles herself.
var C101_KinbakuClub_Slaves_EricaShackle = false; // true if player is shackled by Erica.
var C101_KinbakuClub_Slaves_AmeliaShackle = false; // true if player is shackled by Amelia.
var C101_KinbakuClub_Slaves_AllShackle = false; // true if player is shackled by the whole club.
var C101_KinbakuClub_Slaves_ButErica = false; // option if player is told the whole club knows about the shackles.
var C101_KinbakuClub_Slaves_ChasteGagged = false;
var C101_KinbakuClub_Slaves_GaggedNotChaste = false;
var C101_KinbakuClub_Slaves_GameStartTime = 0; // Records when time when Jenna starts teasing.
var C101_KinbakuClub_Slaves_GameTime = 0; // How long the game lasted
var C101_KinbakuClub_Slaves_PreviousTime = 0; // used for slowly increasing the players arousal state even if they do nothing.
var C101_KinbakuClub_Slaves_PlayerArousal = 0; // how aroused the player is when playing with Jenna.
var C101_KinbakuClub_Slaves_PlayerArousalChange = 0; // for working out the base rate for arousal increase
var C101_KinbakuClub_Slaves_PlayerArousalMod = 0; // for altering arousal depending on options selected
var C101_KinbakuClub_Slaves_PlayerVeryAroused = false; // if jenna thinks the player is aroused enough to let her submit.
var C101_KinbakuClub_Slaves_PlayerNotVeryArousedGagged = false; // combined arousal and gag variables.
var C101_KinbakuClub_Slaves_PlayerVeryArousedGagged = false; // combined arousal and gag variables.
var C101_KinbakuClub_Slaves_TeaseImage = 0; // image used for Jenna's hand is no special images.
var C101_KinbakuClub_Slaves_Random = 0; // used for random numbers other than for responses.
var C101_KinbakuClub_Slaves_Option1 = false; // For selecting available responses.
var C101_KinbakuClub_Slaves_Option2 = false;
var C101_KinbakuClub_Slaves_Option3 = false;
var C101_KinbakuClub_Slaves_Option4 = false;
var C101_KinbakuClub_Slaves_Option5 = false;
var C101_KinbakuClub_Slaves_Option6 = false;
var C101_KinbakuClub_Slaves_Option7 = false;
var C101_KinbakuClub_Slaves_Option8 = false;
var C101_KinbakuClub_Slaves_Option9 = false;
var C101_KinbakuClub_Slaves_Option9Gagged = false;
var C101_KinbakuClub_Slaves_Option10 = false;
var C101_KinbakuClub_Slaves_Option10Gagged = false;
var C101_KinbakuClub_Slaves_Option11 = false;
var C101_KinbakuClub_Slaves_Option12 = false;
var C101_KinbakuClub_Slaves_BreathingDoneOnce = false;
var C101_KinbakuClub_Slaves_ShortLeashWarning = 0; // increases as Jenna threatens player with shortening the leash chain.
var C101_KinbakuClub_Slaves_ShortLeash = false; // true if Jenna shortens the players leash chain.
var C101_KinbakuClub_Slaves_LanguageWarning = false;
var C101_KinbakuClub_Slaves_PlayerBreastsExposed = false; // true if Jenna starts playing with nipples.
var C101_KinbakuClub_Slaves_PlayerPantiesDown = false; // when Jenna is teasing player's crotch without chastity belt.
var C101_KinbakuClub_Slaves_BananaCount = 0; // keep track of how often player uses a safeword.
var C101_KinbakuClub_Slaves_NotGaggingForIt = true; // If player can still say banana
var C101_KinbakuClub_Slaves_NotGaggedForIt = false; // If player can still try to say banana
var C101_KinbakuClub_Slaves_TimeDone = false;
var C101_KinbakuClub_Slaves_NotTriedHardEnough = false;
var C101_KinbakuClub_Slaves_HandsSpecial = 0; // 0 = hands doing nothing special, numbers mean different special hand actions.
var C101_KinbakuClub_Slaves_HandsSpecialTime = 0; // Time when a special hands image started
var C101_KinbakuClub_Slaves_AlreadyGround = false;
var C101_KinbakuClub_Slaves_LongerDone = false;
var C101_KinbakuClub_Slaves_NewMistress = false;
var C101_KinbakuClub_Slaves_PlayerAlreadyCollared = false;

// Calculates the scene parameters
function C101_KinbakuClub_Slaves_CalcParams() {
	C101_KinbakuClub_Slaves_SelfSlaveAvailable = C101_KinbakuClub_Slaves_ReadyForSlaves && Common_PlayerNotRestrained;
	C101_KinbakuClub_Slaves_ChasteGagged = Common_PlayerChaste && Common_PlayerGagged;
	C101_KinbakuClub_Slaves_GaggedNotChaste = Common_PlayerGagged && !Common_PlayerChaste;
	C101_KinbakuClub_Slaves_Option9Gagged = C101_KinbakuClub_Slaves_Option9 && Common_PlayerGagged;
	C101_KinbakuClub_Slaves_Option10Gagged = C101_KinbakuClub_Slaves_Option10 && Common_PlayerGagged;
	C101_KinbakuClub_Slaves_PlayerNotVeryArousedGagged = !C101_KinbakuClub_Slaves_PlayerVeryAroused && Common_PlayerGagged;
	C101_KinbakuClub_Slaves_PlayerVeryArousedGagged = C101_KinbakuClub_Slaves_PlayerVeryAroused && Common_PlayerGagged;
	C101_KinbakuClub_Slaves_PlayerVeryAroused = (C101_KinbakuClub_Slaves_PlayerArousal > 400);
	C101_KinbakuClub_Slaves_NotGaggedForIt = C101_KinbakuClub_Slaves_NotGaggingForIt && Common_PlayerGagged;
	if (PlayerHasLockedInventory("Manacles")) PlayerClothes("Underwear");
	C101_KinbakuClub_Slaves_PlayerAlreadyCollared = PlayerHasLockedInventory("Collar")
}

// Chapter 101 - Slaves Load
function C101_KinbakuClub_Slaves_Load() {

	// Bag stage starts at 0
	if (C101_KinbakuClub_Slaves_CurrentStage <= 100) {
		C101_KinbakuClub_Slaves_CurrentStage = 0;
		LeaveScreen = "ClubRoom4";
		LeaveIcon = "";
	}

	// Player when shackled by Erica
	if (C101_KinbakuClub_Slaves_CurrentStage == 115) {
		ActorLoad("Erica", "ClubRoom4");
		PlayerLockInventory("Manacles");
		LeaveIcon = "";
		C101_KinbakuClub_Slaves_EricaShackle = true;
	}

	// Player when shackled by Amelia
	if (C101_KinbakuClub_Slaves_CurrentStage == 116) {
		LeaveScreen = "ClubRoom4";
		PlayerLockInventory("Manacles");
		LeaveIcon = "";
		C101_KinbakuClub_Slaves_AmeliaShackle = true;
	}

	// Player when a slave
	if (C101_KinbakuClub_Slaves_CurrentStage == 120) {
		LeaveScreen = "ClubRoom4";
		LeaveIcon = "Leave";
	}

	LoadInteractions();
	C101_KinbakuClub_Slaves_CalcParams()
}

// Chapter 101 - Slaves Run
function C101_KinbakuClub_Slaves_Run() {
	BuildInteraction(C101_KinbakuClub_Slaves_CurrentStage);
	
	// Composite images
	// Player trying on collar loosely
	if (C101_KinbakuClub_Slaves_CurrentStage == 100) {
		if (PlayerHasLockedInventory("BallGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/UnlockedCollarBallGag.jpg", 780, 130);
		if (PlayerHasLockedInventory("ClothGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/UnlockedCollarClothGag.jpg", 780, 130);
		if (PlayerHasLockedInventory("TapeGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/UnlockedCollarTapeGag.jpg", 780, 130);
	}

	// Player with collar locked on and to wall. Wists and ankles free
	if (C101_KinbakuClub_Slaves_CurrentStage == 110) {
		if (PlayerHasLockedInventory("BallGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/HalfwayBallGag.jpg", 840, 35);
		if (PlayerHasLockedInventory("ClothGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/HalfwayClothGag.jpg", 840, 35);
		if (PlayerHasLockedInventory("TapeGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/HalfwayTapeGag.jpg", 840, 35);
		if (PlayerHasLockedInventory("ChastityBelt")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/HalfwayChastityBelt.jpg", 825, 250);
	}

	// Player fully locked in manacles.
	if ((C101_KinbakuClub_Slaves_CurrentStage >= 115) && (C101_KinbakuClub_Slaves_CurrentStage <= 300)) {

		// Players expression while Jenna is there
		if (C101_KinbakuClub_Slaves_CurrentStage == 115 || C101_KinbakuClub_Slaves_CurrentStage >= 130) {
			DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaNeutral.png", 870, 81);
			if (ActorGetValue(ActorSubmission) > 1) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaDom.png", 870, 81);
			if (ActorGetValue(ActorSubmission) < -1) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaSub.png", 870, 81);
			if (C101_KinbakuClub_Slaves_HandsSpecial == 4 && C101_KinbakuClub_Slaves_PlayerArousal <= 250) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaEyesShut.png", 870, 81);
			if (C101_KinbakuClub_Slaves_HandsSpecial == 4 && C101_KinbakuClub_Slaves_PlayerArousal > 250) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaEyesShutIntensify.png", 870, 81);
		}
		if (C101_KinbakuClub_Slaves_CurrentStage == 230) {
			DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseHugNeutral.png", 870, 81);
			if (ActorGetValue(ActorLove) > 1) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseHugLove.png", 870, 81);
			if (ActorGetValue(ActorLove) < -1) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseHugHate.png", 870, 81);
		}
		if (C101_KinbakuClub_Slaves_CurrentStage == 300) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaOrgasm.png", 870, 81);
		if (C101_KinbakuClub_Slaves_PlayerVeryAroused) DrawImage(CurrentChapter + "/" + CurrentScreen + "/VeryAroused.png", 870, 81);

		// Players gag
		if (PlayerHasLockedInventory("BallGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesBallGag.png", 875, 60);
		if (PlayerHasLockedInventory("ClothGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesClothGag.png", 870, 128);
		if (PlayerHasLockedInventory("TapeGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesTapeGag.png", 887, 130);
		
		// Players clothing etc.
		if (PlayerHasLockedInventory("ChastityBelt")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesChastityBelt.png", 850, 330);
		if (C101_KinbakuClub_Slaves_PlayerBreastsExposed) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesExposed.jpg", 855, 210);
		if ((C101_KinbakuClub_Slaves_PlayerPantiesDown) && !PlayerHasLockedInventory("ChastityBelt")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesPantiesDown.png", 830, 365);
		if (C101_KinbakuClub_Slaves_ShortLeash) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseShortLeash.png", 955, 10);

		// Erica full body
		if (C101_KinbakuClub_Slaves_CurrentStage == 115) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesErica.png", 906, 0);

		// Jenna full body
		if ((C101_KinbakuClub_Slaves_CurrentStage >= 130 && C101_KinbakuClub_Slaves_CurrentStage < 190) || (C101_KinbakuClub_Slaves_CurrentStage >= 240 && C101_KinbakuClub_Slaves_CurrentStage <= 260)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJenna.png", 945, 0);
		if ((C101_KinbakuClub_Slaves_CurrentStage == 190) || (C101_KinbakuClub_Slaves_CurrentStage == 195)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaPointing.png", 600, 0);
		if (C101_KinbakuClub_Slaves_CurrentStage == 200) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaGloves.png", 600, 0);
		if (C101_KinbakuClub_Slaves_CurrentStage == 220) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaStopped.png", 785, 325);
		if (C101_KinbakuClub_Slaves_CurrentStage == 230) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaHug.png", 725, 0);
		if (C101_KinbakuClub_Slaves_CurrentStage == 270) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaWand.png", 785, 0);
		if (C101_KinbakuClub_Slaves_CurrentStage == 280 || C101_KinbakuClub_Slaves_CurrentStage == 290 || C101_KinbakuClub_Slaves_CurrentStage == 300) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaWandPleasure.png", 895, 55);
		if (C101_KinbakuClub_Slaves_CurrentStage == 285 || C101_KinbakuClub_Slaves_CurrentStage == 286) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaWandStop.png", 860, 55);
		if (C101_KinbakuClub_Slaves_CurrentStage == 295) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerManaclesJennaSlap.png", 885, 35);
	
		//Jenna hands only
		if (C101_KinbakuClub_Slaves_CurrentStage == 210) {
			// Special hands images, which default to normal tease and text after 5 seconds
			if (CurrentTime > (C101_KinbakuClub_Slaves_HandsSpecialTime + 5000)) {
				C101_KinbakuClub_Slaves_HandsSpecial = 0;
				OverridenIntroText = GetText("TeaseStage1");
				if (C101_KinbakuClub_Slaves_PlayerBreastsExposed) OverridenIntroText = GetText("TeaseStage2");
				if (C101_KinbakuClub_Slaves_PlayerPantiesDown) OverridenIntroText = GetText("TeaseStage3");
				if (C101_KinbakuClub_Slaves_PlayerArousal >= 500) OverridenIntroText = GetText("TeaseStage4");
			}
			if (C101_KinbakuClub_Slaves_HandsSpecial == 1) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseBreastsOut.png", 895, 215); // Breasts pulled out
			if (C101_KinbakuClub_Slaves_HandsSpecial == 2) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeasePantiesDown.png", 863, 422); // Panties pulled down
			if (C101_KinbakuClub_Slaves_HandsSpecial == 3) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseDisruptBreathingControl.png", 873, 100); // Jenna pinching nose and covering mouth
			if (C101_KinbakuClub_Slaves_HandsSpecial == 5) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseLightSpank.png", 827, 319); // Light Spank and tease (Belly button)
			if (C101_KinbakuClub_Slaves_HandsSpecial == 6) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseSpank.png", 812, 157); // Spank while holding Collar
			if (C101_KinbakuClub_Slaves_HandsSpecial == 7) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseHoldCollar.png", 855, 145); // Jenna holding collar and not brushing
		
			// hands normal teasing images, staged general teasing actions
			if (C101_KinbakuClub_Slaves_HandsSpecial == 0 || C101_KinbakuClub_Slaves_HandsSpecial == 4 || C101_KinbakuClub_Slaves_HandsSpecial == 9) {
				if (!C101_KinbakuClub_Slaves_PlayerBreastsExposed) {
					if (C101_KinbakuClub_Slaves_TeaseImage == 0) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseBody1.png", 775, 230);
					if (C101_KinbakuClub_Slaves_TeaseImage == 1) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseBody2.png", 803, 283);
					if (C101_KinbakuClub_Slaves_TeaseImage == 2) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseBody3.png", 820, 170);
				}
				if (C101_KinbakuClub_Slaves_PlayerBreastsExposed && !C101_KinbakuClub_Slaves_PlayerPantiesDown) {
					if (C101_KinbakuClub_Slaves_TeaseImage == 0) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseNipple1.png", 850, 225);
					if (C101_KinbakuClub_Slaves_TeaseImage == 1) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseNipple2.png", 847, 225);
					if (C101_KinbakuClub_Slaves_TeaseImage == 2) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseNipple3.png", 836, 237);
				}
				if (C101_KinbakuClub_Slaves_PlayerPantiesDown && !Common_PlayerChaste) {
					if (C101_KinbakuClub_Slaves_TeaseImage == 0) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseClit1.png", 855, 380);
					if (C101_KinbakuClub_Slaves_TeaseImage == 1) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseClit2.png", 855, 380);
					if (C101_KinbakuClub_Slaves_TeaseImage == 2) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseClit3.png", 855, 380);
				}
				if (C101_KinbakuClub_Slaves_PlayerPantiesDown && Common_PlayerChaste) {
					if (C101_KinbakuClub_Slaves_TeaseImage == 0) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseChaste1.png", 855, 380);
					if (C101_KinbakuClub_Slaves_TeaseImage == 1) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseChaste2.png", 855, 380);
					if (C101_KinbakuClub_Slaves_TeaseImage == 2) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TeaseChaste3.png", 855, 380);
				}
			}
		}
	}

	// Jenna teasing arousal game
	// Players arousal will steadily increase with time while Jenna is teasing her.
	if (C101_KinbakuClub_Slaves_CurrentStage == 210) {
		if (CurrentTime > (C101_KinbakuClub_Slaves_PreviousTime + 1000)) {
			C101_KinbakuClub_Slaves_PreviousTime = CurrentTime;
			C101_KinbakuClub_Slaves_TeaseImage++
			if (C101_KinbakuClub_Slaves_TeaseImage > 2) C101_KinbakuClub_Slaves_TeaseImage = 0;
			C101_KinbakuClub_Slaves_PlayerArousalChange = 1;
			if (ActorGetValue(ActorSubmission) < -1) C101_KinbakuClub_Slaves_PlayerArousalChange++;
			if (PlayerHasLockedInventory("VibratingEgg")) C101_KinbakuClub_Slaves_PlayerArousalChange++;
			if (C101_KinbakuClub_Slaves_PlayerBreastsExposed) C101_KinbakuClub_Slaves_PlayerArousalChange++;
			if (C101_KinbakuClub_Slaves_PlayerPantiesDown) C101_KinbakuClub_Slaves_PlayerArousalChange++;
			C101_KinbakuClub_Slaves_PlayerArousal = C101_KinbakuClub_Slaves_PlayerArousal + C101_KinbakuClub_Slaves_PlayerArousalChange;
		}
		if (C101_KinbakuClub_Slaves_PlayerArousal > 500) {
			C101_KinbakuClub_Slaves_PlayerArousal = 500;
			C101_KinbakuClub_Slaves_RandomSelection()
			if (!C101_KinbakuClub_Slaves_TimeDone) {
				C101_KinbakuClub_Slaves_GameTime = (CurrentTime - C101_KinbakuClub_Slaves_GameStartTime);
				C101_KinbakuClub_Slaves_TimeDone = true;
			}
		}
		if (C101_KinbakuClub_Slaves_PlayerArousal < 0) C101_KinbakuClub_Slaves_PlayerArousal = 0;
		C101_KinbakuClub_Slaves_PlayerVeryAroused = C101_KinbakuClub_Slaves_PlayerArousal > 400;
		if (C101_KinbakuClub_Slaves_PlayerArousal > 200 && !C101_KinbakuClub_Slaves_PlayerBreastsExposed) C101_KinbakuClub_Slaves_PlayerBreastsTease();
		if (C101_KinbakuClub_Slaves_PlayerArousal > 350 && !C101_KinbakuClub_Slaves_PlayerPantiesDown) C101_KinbakuClub_Slaves_PlayerClitTease();
	}

	// Draw the players arousal level
	if ((C101_KinbakuClub_Slaves_CurrentStage >= 190 && C101_KinbakuClub_Slaves_CurrentStage <= 310) || (C101_KinbakuClub_Slaves_CurrentStage == 120 && C101_KinbakuClub_Slaves_ShortLeash)) {
		DrawRect(638, 48, 14, 504, "white");
		DrawRect(640, 50, 10, (500 - C101_KinbakuClub_Slaves_PlayerArousal), "#66FF66");
		DrawRect(640, (550 - C101_KinbakuClub_Slaves_PlayerArousal), 10, C101_KinbakuClub_Slaves_PlayerArousal, "red");
		if (C101_KinbakuClub_Slaves_CurrentStage == 300 && !C101_KinbakuClub_Slaves_LongerDone)  DrawImage(CurrentChapter + "/" + CurrentScreen + "/Gushing.png", 601, 2);
	}
}

// Chapter 101 - Slaves Click
function C101_KinbakuClub_Slaves_Click() {

	// Regular and inventory interactions
	ClickInteraction(C101_KinbakuClub_Slaves_CurrentStage);
	var ClickInv = GetClickedInventory();
	if (C101_KinbakuClub_Slaves_CurrentStage == 120) InventoryClick(GetClickedInventory(), "C101_KinbakuClub", "Slaves");
	
	if ((C101_KinbakuClub_Slaves_CurrentStage == 100) || (C101_KinbakuClub_Slaves_CurrentStage == 110)) {
		if ((ClickInv == "BallGag") && !PlayerHasLockedInventory("BallGag")) {
			PlayerUngag();
			PlayerRemoveInventory("BallGag", 1);
			PlayerLockInventory("BallGag");
			OverridenIntroText = GetText("PlayerBallGag");
			CurrentTime = CurrentTime + 60000;
		}
		if ((ClickInv == "ClothGag") && !PlayerHasLockedInventory("ClothGag")) {
			PlayerUngag();
			PlayerRemoveInventory("ClothGag", 1);
			PlayerLockInventory("ClothGag");
			OverridenIntroText = GetText("PlayerClothGag");
			CurrentTime = CurrentTime + 60000;
		}
		if ((ClickInv == "TapeGag") && !PlayerHasLockedInventory("TapeGag")) {
			PlayerUngag();
			PlayerRemoveInventory("TapeGag", 1);
			PlayerLockInventory("TapeGag");
			OverridenIntroText = GetText("PlayerTapeGag");
			CurrentTime = CurrentTime + 60000;
		}
		if ((C101_KinbakuClub_Slaves_CurrentStage == 110) && (ClickInv == "VibratingEgg") && !PlayerHasLockedInventory("VibratingEgg") && !Common_PlayerChaste) {
			PlayerRemoveInventory("VibratingEgg", 1);
			PlayerLockInventory("VibratingEgg");
			OverridenIntroText = GetText("PlayerVibratingEgg");
			CurrentTime = CurrentTime + 60000;
		}
		if ((C101_KinbakuClub_Slaves_CurrentStage == 110) && (ClickInv == "ChastityBelt") && !PlayerHasLockedInventory("ChastityBelt")) {
			if (C101_KinbakuClub_Slaves_ChastityWarning) {
				PlayerRemoveInventory("ChastityBelt", 1);
				PlayerLockInventory("ChastityBelt");
				OverridenIntroText = GetText("PlayerChastityBelt2");
				CurrentTime = CurrentTime + 60000;
			} else {
				C101_KinbakuClub_Slaves_ChastityWarning = true;
				OverridenIntroText = GetText("PlayerChastityBelt1");
			}
		}
	}
	C101_KinbakuClub_Slaves_CalcParams();
}

// Chapter 101 - Slaves - Leaving the bag stage
function C101_KinbakuClub_Slaves_Leave() {
	if (C101_KinbakuClub_Slaves_ReadyForSlaves && !C101_KinbakuClub_Slaves_ReadyMessageDone) {
		C101_KinbakuClub_Slaves_ReadyMessageDone = true;
		C101_KinbakuClub_Slaves_CurrentStage = 40
	}
	else SetScene(CurrentChapter, "ClubRoom4");
}

// Chapter 101 - Slaves - Player has inspected the manacles
function C101_KinbakuClub_Slaves_ManaclesCheck() {
	C101_KinbakuClub_Slaves_Manacles = true;
	if (C101_KinbakuClub_Slaves_Manacles && C101_KinbakuClub_Slaves_Padlocks && C101_KinbakuClub_Slaves_Rings) C101_KinbakuClub_Slaves_ReadyForSlaves = true;
}

// Chapter 101 - Slaves - Player has inspected the padlocks
function C101_KinbakuClub_Slaves_PadlocksCheck() {
	C101_KinbakuClub_Slaves_Padlocks = true;
	if (C101_KinbakuClub_Slaves_Manacles && C101_KinbakuClub_Slaves_Padlocks && C101_KinbakuClub_Slaves_Rings) C101_KinbakuClub_Slaves_ReadyForSlaves = true;
}

// Chapter 101 - Slaves - Player has inspected the wall rings
function C101_KinbakuClub_Slaves_RingsCheck() {
	C101_KinbakuClub_Slaves_Rings = true;
	if (C101_KinbakuClub_Slaves_Manacles && C101_KinbakuClub_Slaves_Padlocks && C101_KinbakuClub_Slaves_Rings) C101_KinbakuClub_Slaves_ReadyForSlaves = true;
}

// Chapter 101 - Slaves - Player padlocks the neck manacle on and to the wall.
function C101_KinbakuClub_Slaves_NeckManacle() {
	PlayerLockInventory("Manacles");
	C101_KinbakuClub_Slaves_SelfShackle = true;
}

// Chapter 101 - Slaves - Player removes their gag.
function C101_KinbakuClub_Slaves_PlayerRemoveGag() {
	PlayerUngag();
}

// Chapter 101 - Slaves - Player padlocks the ankle and wrist manacles.
function C101_KinbakuClub_Slaves_FullManacle() {
	if (C101_KinbakuClub_Slaves_ManacleWarning) {
		C101_KinbakuClub_Slaves_CurrentStage = 120;
		OverridenIntroText = GetText("LockAllManacles");
		LeaveIcon = "Leave";
	}
	C101_KinbakuClub_Slaves_ManacleWarning = true;
}

// Chapter 101 - Slaves - The actor leaves player manacled
function C101_KinbakuClub_Slaves_ActorLeaves() {
	LeaveIcon = "Leave";
}

// Chapter 101 - Slaves - Player spends time exploring their predicament.
function C101_KinbakuClub_Slaves_ExploreManacles() {
	C101_KinbakuClub_Slaves_ManacleTime++
	CurrentTime = CurrentTime + 30000;
}

// Chapter 101 - Slaves - Player waits in manacles, Jenna may appear
function C101_KinbakuClub_Slaves_WaitJenna() {
	C101_KinbakuClub_Slaves_ExploreManacles();
	if (C101_KinbakuClub_Slaves_WaitingDone) CurrentTime = (C101_KinbakuClub_JennaIntro_LeaveTime * 60 * 60 * 1000);
	if (C101_KinbakuClub_Slaves_JennaDone) C101_KinbakuClub_Slaves_WaitingDone = true;
	if ((C101_KinbakuClub_Slaves_ManacleTime > 2) && (!C101_KinbakuClub_Slaves_JennaDone)) {
		C101_KinbakuClub_Slaves_CurrentStage = 130;
		ActorLoad("Jenna", "ClubRoom4");
		OverridenIntroText = GetText("JennaAppears");
		LeaveIcon = "";
		C101_KinbakuClub_Slaves_JennaDone = true;
		C101_KinbakuClub_Slaves_JennaWillGag = true;
		if (PlayerHasLockedInventory("VibratingEgg")) C101_KinbakuClub_Slaves_PlayerArousal = 125;
		if (PlayerHasLockedInventory("ChastityBelt")) C101_KinbakuClub_Slaves_PlayerArousal = 75;
		if (PlayerHasLockedInventory("ChastityBelt") && PlayerHasLockedInventory("VibratingEgg")) C101_KinbakuClub_Slaves_PlayerArousal = 175;
	}
}

// Chapter 101 - Slaves - Jenna gags the player when they shout out at her.
function C101_KinbakuClub_Slaves_PlayerGagged() {
	PlayerLockInventory("BallGag");
	CurrentTime = CurrentTime + 60000;
}

// Chapter 101 - Slaves - Text change if player is dominant enough when staring at Jenna
function C101_KinbakuClub_Slaves_StareJenna() {
	if (ActorGetValue(ActorSubmission) >= 0) {
		OverridenIntroText = GetText("StareDown");
		ActorChangeAttitude(0, 1);
	}
}

// Chapter 101 - Slaves - Dominant player can get Jenna to ungag her
function C101_KinbakuClub_Slaves_PlayerMightRemoveGag() {
	if ((ActorGetValue(ActorLove) >= 0) && (ActorGetValue(ActorSubmission) >= 2)) {
		PlayerUngag();
		OverridenIntroText = GetText("JennaRemovesGag");
	}
}

// Chapter 101 - Slaves - Player claims she shackled herself
function C101_KinbakuClub_Slaves_ClaimSelf() {
	if (!C101_KinbakuClub_Slaves_SelfShackle) {
		OverridenIntroText = GetText("LieToJenna");
		ActorChangeAttitude(-1, 0);
	}
}

// Chapter 101 - Slaves - Player claims Erica shackled her
function C101_KinbakuClub_Slaves_ClaimErica() {
	if (!C101_KinbakuClub_Slaves_EricaShackle) {
		OverridenIntroText = GetText("LieToJenna");
		ActorChangeAttitude(-1, 0);
	}
}

// Chapter 101 - Slaves - Player claims Amelia shackled her
function C101_KinbakuClub_Slaves_ClaimAmelia() {
	if (!C101_KinbakuClub_Slaves_AmeliaShackle) {
		OverridenIntroText = GetText("LieToJenna");
		ActorChangeAttitude(-1, 0);
	}
}

// Chapter 101 - Slaves - Player claims they all helped shackled her
function C101_KinbakuClub_Slaves_ClaimAll() {
	if (!C101_KinbakuClub_Slaves_AllShackle) {
		OverridenIntroText = GetText("LieToJenna");
		ActorChangeAttitude(-1, 0);
	}
}

// Chapter 101 - Slaves - The whole club knows anything locked in those shackles is Jenna's, but Erica still said you could use them.
function C101_KinbakuClub_Slaves_EricaTrick() {
	C101_KinbakuClub_Slaves_ButErica = true;
}

// Chapter 101 - Slaves - Jenna leaves the player manacled
function C101_KinbakuClub_Slaves_JennaLeaves() {
	if (C101_KinbakuClub_Slaves_NewMistress) {
		if (C101_KinbakuClub_Slaves_PlayerAlreadyCollared) {
			C101_KinbakuClub_Slaves_CurrentStage = 350;
			OverridenIntroText = GetText("SeeCollar");
		} else {
			OverridenIntroText = GetText("Mistress");
			C101_KinbakuClub_Slaves_CurrentStage = 330;
		}
		C101_KinbakuClub_Slaves_NewMistress = false;
	}
	else {
		if (!PlayerHasLockedInventory("Manacles")) PlayerClothes("");
		ActorLoad("", "ClubRoom4");
		LeaveIcon = "Leave";
	}
}

// Chapter 101 - Slaves - Jenna starts teasing the player
function C101_KinbakuClub_Slaves_StartGame() {
	C101_KinbakuClub_Slaves_GameStartTime = CurrentTime;
	C101_KinbakuClub_Slaves_RandomSelection()
}

// Chapter 101 - Slaves - Player tries begging before she is aroused enough
function C101_KinbakuClub_Slaves_NoEnd() {
	C101_KinbakuClub_Slaves_NormalArousalIncrease()
	C101_KinbakuClub_Slaves_RandomSelection()
}

// Chapter 101 - Slaves - Player begs Jenna to cum
function C101_KinbakuClub_Slaves_EndGame() {
	C101_KinbakuClub_Slaves_PlayerArousal = 500;
	if (!C101_KinbakuClub_Slaves_TimeDone) {
		C101_KinbakuClub_Slaves_GameTime = (CurrentTime - C101_KinbakuClub_Slaves_GameStartTime);
	}
	Common_Number = msToTime(C101_KinbakuClub_Slaves_GameTime);
	OverridenIntroText = GetText("DecentTime");
	if (C101_KinbakuClub_Slaves_GameTime < 500000) {
		C101_KinbakuClub_Slaves_NotTriedHardEnough = true;
		OverridenIntroText = GetText("LooseTime")
	}
	if (C101_KinbakuClub_Slaves_GameTime > 1000000) OverridenIntroText = GetText("ImpressiveTime")
	if (C101_KinbakuClub_Slaves_TimeDone) {
		OverridenIntroText = GetText("DecentPeakTime");
		if (C101_KinbakuClub_Slaves_GameTime < 500000) {
			C101_KinbakuClub_Slaves_NotTriedHardEnough = true;
			OverridenIntroText = GetText("LoosePeakTime")
		}
		if (C101_KinbakuClub_Slaves_GameTime > 1000000) OverridenIntroText = GetText("ImpressivePeakTime")
	}
}

// Chapter 101 - Slaves - Select a random choice of the variable options during the game.
function C101_KinbakuClub_Slaves_RandomSelection() {
	// Select 8 random numbers, each between 1 and 12
	var randomNumbers = []
	for (var i = 0; i < 8; i++) {
		randomNumbers.push(Math.floor((Math.random() * 12) + 1));
	}
	
	var active = C101_KinbakuClub_Slaves_PlayerArousal < 500;
	
	C101_KinbakuClub_Slaves_Option1 = active && randomNumbers.includes(1) ? true : false;
	C101_KinbakuClub_Slaves_Option2 = active && randomNumbers.includes(2) ? true : false;
	C101_KinbakuClub_Slaves_Option3 = active && randomNumbers.includes(3) ? true : false;
	C101_KinbakuClub_Slaves_Option4 = active && randomNumbers.includes(4) ? true : false;
	C101_KinbakuClub_Slaves_Option5 = active && randomNumbers.includes(5) ? true : false;
	C101_KinbakuClub_Slaves_Option6 = active && randomNumbers.includes(6) ? true : false;
	C101_KinbakuClub_Slaves_Option7 = active && randomNumbers.includes(7) ? true : false;
	C101_KinbakuClub_Slaves_Option8 = active && randomNumbers.includes(8) ? true : false;
	C101_KinbakuClub_Slaves_Option9 = active && randomNumbers.includes(9) ? true : false;
	C101_KinbakuClub_Slaves_Option10 = active && randomNumbers.includes(10) ? true : false;
	C101_KinbakuClub_Slaves_Option11 = active && randomNumbers.includes(11) ? true : false;
	C101_KinbakuClub_Slaves_Option12 = active && randomNumbers.includes(12) ? true : false;
	
	C101_KinbakuClub_Slaves_TextDisplay()
	C101_KinbakuClub_Slaves_CalcParams();
}

// Chapter 101 - Slaves - Jenna exposes players breast and starts to tease her nipples
function C101_KinbakuClub_Slaves_PlayerBreastsTease() {
	C101_KinbakuClub_Slaves_TextDisplay()
	OverridenIntroText = GetText("BreastsOut");
	C101_KinbakuClub_Slaves_PlayerBreastsExposed = true;
	C101_KinbakuClub_Slaves_HandsSpecial = 1;
}

// Chapter 101 - Slaves - Jenna exposes players crotch (if not chaste) and starts to tease her clit
function C101_KinbakuClub_Slaves_PlayerClitTease() {
	C101_KinbakuClub_Slaves_TextDisplay()
	C101_KinbakuClub_Slaves_PlayerPantiesDown = true;
	OverridenIntroText = GetText("ClitBrushChaste");
	if (!Common_PlayerChaste) {
		OverridenIntroText = GetText("PantiesDown");
		C101_KinbakuClub_Slaves_HandsSpecial = 2;
	} 
}

// Chapter 101 - Slaves - Tease select 1 (Pinch your arm.)
function C101_KinbakuClub_Slaves_Select1() {
	C101_KinbakuClub_Slaves_NormalArousalIncrease()
	C101_KinbakuClub_Slaves_RandomSelection();
	// variable arousal decrease
	C101_KinbakuClub_Slaves_PlayerArousalReduction()
	C101_KinbakuClub_Slaves_ArousalVariation();
}

// Chapter 101 - Slaves - Tease Select 2 (Struggle playfully.)
function C101_KinbakuClub_Slaves_Select2() {
	C101_KinbakuClub_Slaves_NormalArousalIncrease()
	C101_KinbakuClub_Slaves_RandomSelection();
	// variable high arousal increase
	C101_KinbakuClub_Slaves_PlayerArousalMod = 10;
	C101_KinbakuClub_Slaves_ArousalVariation();
}

// Chapter 101 - Slaves - Tease Select 3 (Regulate your breathing.)
function C101_KinbakuClub_Slaves_Select3() {
	C101_KinbakuClub_Slaves_NormalArousalIncrease()
	C101_KinbakuClub_Slaves_RandomSelection();
	// normally variable arousal decrease
	// occasionally Jenna will pinch nose and cover mouth to unsettle breathing, no arousal change
	C101_KinbakuClub_Slaves_Random = Math.floor(Math.random() * 3);
	if (C101_KinbakuClub_Slaves_Random == 2 && C101_KinbakuClub_Slaves_BreathingDoneOnce) {
		OverridenIntroText = GetText("DisruptBreathing");
		C101_KinbakuClub_Slaves_HandsSpecial = 3;
		C101_KinbakuClub_Slaves_PlayerArousalMod = 5;
	} else {
		C101_KinbakuClub_Slaves_PlayerArousalReduction()
	}
	C101_KinbakuClub_Slaves_BreathingDoneOnce = true;
	C101_KinbakuClub_Slaves_ArousalVariation();
}

// Chapter 101 - Slaves - Tease Select 4 (Close your eyes.)
function C101_KinbakuClub_Slaves_Select4() {
	C101_KinbakuClub_Slaves_NormalArousalIncrease()
	C101_KinbakuClub_Slaves_RandomSelection();
	// at low arousal has a calming effect, variable arousal decrease
	// at higher arousal makes the brush more noticeable, variable arousal increase
	C101_KinbakuClub_Slaves_HandsSpecial = 4;
	if (C101_KinbakuClub_Slaves_PlayerArousal > 250) {
		C101_KinbakuClub_Slaves_PlayerArousalMod = 10;
		OverridenIntroText = GetText("IntensifySenses");
	} else C101_KinbakuClub_Slaves_PlayerArousalReduction()
	C101_KinbakuClub_Slaves_ArousalVariation();
}

// Chapter 101 - Slaves - Tease Select 5 (Giggle.)
function C101_KinbakuClub_Slaves_Select5() {
	C101_KinbakuClub_Slaves_NormalArousalIncrease()
	C101_KinbakuClub_Slaves_RandomSelection();
	// Needs spank and brush image
	// variable arousal increase
	C101_KinbakuClub_Slaves_HandsSpecial = 5;
	C101_KinbakuClub_Slaves_PlayerArousalMod = 10;
	C101_KinbakuClub_Slaves_ArousalVariation();
}

// Chapter 101 - Slaves - Tease Select 6 (Laugh.)
function C101_KinbakuClub_Slaves_Select6() {
	C101_KinbakuClub_Slaves_NormalArousalIncrease()
	C101_KinbakuClub_Slaves_RandomSelection();
	// Needs spank and hold collar image
	// slight variable arousal increase if sub and love
	C101_KinbakuClub_Slaves_HandsSpecial = 6;
	ActorChangeAttitude(0, -1);
	if ((ActorGetValue(ActorLove) >= 2) && (ActorGetValue(ActorSubmission) <= -2)) {
		C101_KinbakuClub_Slaves_PlayerArousalMod = 5;
		C101_KinbakuClub_Slaves_ArousalVariation()
	}
}

// Chapter 101 - Slaves - Tease Select 7 (Sit down.)
function C101_KinbakuClub_Slaves_Select7() {
	C101_KinbakuClub_Slaves_RandomSelection();
	if (!C101_KinbakuClub_Slaves_ShortLeash) {
		ActorChangeAttitude(0, -1);
		C101_KinbakuClub_Slaves_HandsSpecial = 5;
		C101_KinbakuClub_Slaves_PlayerArousalMod = 5;
		C101_KinbakuClub_Slaves_NormalArousalIncrease()
		C101_KinbakuClub_Slaves_ArousalVariation()
	}
	if (C101_KinbakuClub_Slaves_ShortLeash) {
		OverridenIntroText = GetText("NoSit");
		C101_KinbakuClub_Slaves_NormalArousalIncrease()
	}
	if (C101_KinbakuClub_Slaves_ShortLeashWarning >= 2 && !C101_KinbakuClub_Slaves_ShortLeash) {
		C101_KinbakuClub_Slaves_ShortLeash = true;
		OverridenIntroText = GetText("ShortenLeash");
		ActorChangeAttitude(-1, 0);
	}
	C101_KinbakuClub_Slaves_ShortLeashWarning++
}

// Chapter 101 - Slaves - Tease Select 8 (Think of your|favorite things.)
function C101_KinbakuClub_Slaves_Select8() {
	C101_KinbakuClub_Slaves_NormalArousalIncrease()
	C101_KinbakuClub_Slaves_RandomSelection();
	// if low arousal, think of non arousing happy times. variable arousal increase
	// if moderate or high arousal, struggle with sexy thoughts. variable arousal increase or decrease
	C101_KinbakuClub_Slaves_PlayerArousalReduction()
	if (C101_KinbakuClub_Slaves_PlayerArousal > 250) {
		OverridenIntroText = GetText("SexyThoughts");
		C101_KinbakuClub_Slaves_PlayerArousalMod = 10;
	}
	// if high arousal and already had/given an orgasm, think of earlier orgasm and variable high arousal increase
	//if ((ActorSpecificGetValue(Amanda, ActorOrgasmCount) + ActorSpecificGetValue(Sarah, ActorOrgasmCount) + ActorSpecificGetValue(Sidney, ActorOrgasmCount) + ActorSpecificGetValue(Jennifer, ActorOrgasmCount) + ActorSpecificGetValue(Yuki, ActorOrgasmCount) + ActorSpecificGetValue(Natalie, ActorOrgasmCount) + ActorSpecificGetValue(Erica, ActorOrgasmCount) + ActorSpecificGetValue(Lauren, ActorOrgasmCount)) > 3) {
	//	OverridenIntroText = GetText("RememberOrgasms");
	//	C101_KinbakuClub_Slaves_PlayerArousalMod = 15;
	//}
	C101_KinbakuClub_Slaves_ArousalVariation();
}

// Chapter 101 - Slaves - Tease Select 9 Eeek, no that's|spot is sensitive.
function C101_KinbakuClub_Slaves_Select9() {
	C101_KinbakuClub_Slaves_NormalArousalIncrease()
	C101_KinbakuClub_Slaves_RandomSelection();
	// variable arousal increase
	C101_KinbakuClub_Slaves_PlayerArousalMod = 10;
	C101_KinbakuClub_Slaves_ArousalVariation();
}

// Chapter 101 - Slaves - Tease Select 10 Aaarrgh|you bitch.
function C101_KinbakuClub_Slaves_Select10() {
	C101_KinbakuClub_Slaves_NormalArousalIncrease()
	// on second try Jenna will gag player ungagged player
	if (C101_KinbakuClub_Slaves_LanguageWarning && !Common_PlayerGagged) {
		OverridenIntroText = GetText("BadLanguageGagged");
		ActorChangeAttitude(0, -2);
		PlayerLockInventory("ClothGag");
		CurrentTime = CurrentTime + 30000;
	}
	C101_KinbakuClub_Slaves_RandomSelection();
	// after warning Jenna will spank already gagged player, spank image
	if (Common_PlayerGagged) C101_KinbakuClub_Slaves_HandsSpecial = 6;
	C101_KinbakuClub_Slaves_LanguageWarning = true;
}

// Chapter 101 - Slaves - Tease Select 11 (Try to|avoid Jenna.)
function C101_KinbakuClub_Slaves_Select11() {
	C101_KinbakuClub_Slaves_RandomSelection();
	if (C101_KinbakuClub_Slaves_ShortLeash) {
		C101_KinbakuClub_Slaves_NormalArousalIncrease()
		OverridenIntroText = GetText("NoAvoid");
	}
	if (!C101_KinbakuClub_Slaves_ShortLeash) {
		C101_KinbakuClub_Slaves_HandsSpecial = 7;
	}
	if (C101_KinbakuClub_Slaves_ShortLeashWarning >= 2 && !C101_KinbakuClub_Slaves_ShortLeash) {
		C101_KinbakuClub_Slaves_ShortLeash = true;
		OverridenIntroText = GetText("ShortenLeash");
		ActorChangeAttitude(-1, -1);
	}
	C101_KinbakuClub_Slaves_ShortLeashWarning++
}

// Chapter 101 - Slaves - Tease Select 12 (Moan softly.)
function C101_KinbakuClub_Slaves_Select12() {
	C101_KinbakuClub_Slaves_NormalArousalIncrease()
	C101_KinbakuClub_Slaves_RandomSelection();
	// variable moderate to high arousal increase.
	C101_KinbakuClub_Slaves_PlayerArousalMod = 15;
	C101_KinbakuClub_Slaves_ArousalVariation();
}

// Chapter 101 - Slaves - If player tries banana and then says she is ok too often.
function C101_KinbakuClub_Slaves_CryWolf() {
	C101_KinbakuClub_Slaves_RandomSelection();
	C101_KinbakuClub_Slaves_BananaCount++
	if (C101_KinbakuClub_Slaves_BananaCount > 2) {
		OverridenIntroText = GetText("NoBanana");
		C101_KinbakuClub_Slaves_CurrentStage = 210;
		C101_KinbakuClub_Slaves_NormalArousalIncrease()
	}
	if (C101_KinbakuClub_Slaves_PlayerArousal >= 500) {
		OverridenIntroText = GetText("WhatWasThat");
		C101_KinbakuClub_Slaves_CurrentStage = 210;
		C101_KinbakuClub_Slaves_NotGaggingForIt = false;
	}
	
}

// Chapter 101 - Slaves - Player says banana and then immediately says she is OK
function C101_KinbakuClub_Slaves_FalseBanana() {
	C101_KinbakuClub_Slaves_RandomSelection();
	if (!Common_PlayerGagged) PlayerLockInventory("BallGag");
	C101_KinbakuClub_Slaves_HandsSpecial = 6;
}

// Chapter 101 - Slaves - time delay on special text even if no special hands images
function C101_KinbakuClub_Slaves_TextDisplay() {
	C101_KinbakuClub_Slaves_HandsSpecialTime = CurrentTime;
	C101_KinbakuClub_Slaves_HandsSpecial = 9;
}

//Chapter 101 - Slaves - Increases arousal during options to match rate to if no options were selected
function C101_KinbakuClub_Slaves_NormalArousalIncrease() {
	C101_KinbakuClub_Slaves_PlayerArousal = C101_KinbakuClub_Slaves_PlayerArousal + (C101_KinbakuClub_Slaves_PlayerArousalChange * 10);
}


// Chapter 101 - Slaves - Jenna refits players underwear.
function C101_KinbakuClub_Slaves_UnderwearBack() {
	if (C101_KinbakuClub_Slaves_PlayerBreastsExposed) {
		C101_KinbakuClub_Slaves_ShortLeash = false;
		C101_KinbakuClub_Slaves_PlayerBreastsExposed = false;
		C101_KinbakuClub_Slaves_PlayerPantiesDown = false;
		OverridenIntroText = GetText("CoverUp");
		if (Common_PlayerGagged) {
			PlayerUngag();
			OverridenIntroText = GetText("CoverUpGag");
		}
	}
}

// Chapter 101 - Slaves - Jenna rolls back a stage of exposure and and decreases arousal. 
function C101_KinbakuClub_Slaves_TeaseStageBack() {
		if (C101_KinbakuClub_Slaves_PlayerBreastsExposed && !C101_KinbakuClub_Slaves_PlayerPantiesDown) C101_KinbakuClub_Slaves_PlayerBreastsExposed = false;
		if (C101_KinbakuClub_Slaves_PlayerPantiesDown) C101_KinbakuClub_Slaves_PlayerBreastsExposed = false;
		C101_KinbakuClub_Slaves_PlayerArousal = C101_KinbakuClub_Slaves_PlayerArousal - 150
}

// Chapter 101 - Slaves - Reduction modified for stage
function C101_KinbakuClub_Slaves_PlayerArousalReduction() {
	C101_KinbakuClub_Slaves_PlayerArousalMod = -(C101_KinbakuClub_Slaves_PlayerArousalChange * 8 + 10);
}

// Chapter 101 - Slaves - For options for increase or decrease the players arousal
function C101_KinbakuClub_Slaves_ArousalVariation() {
	C101_KinbakuClub_Slaves_Random = Math.floor(Math.random() * 20);
	C101_KinbakuClub_Slaves_Random = (C101_KinbakuClub_Slaves_Random - 10);
	C101_KinbakuClub_Slaves_PlayerArousal = (C101_KinbakuClub_Slaves_PlayerArousal + C101_KinbakuClub_Slaves_Random + C101_KinbakuClub_Slaves_PlayerArousalMod)
}

// Chapter 101 - Slaves - 
function C101_KinbakuClub_Slaves_Relief() {
	if (ActorGetValue(ActorLove) > 2 && !C101_KinbakuClub_Slaves_NotTriedHardEnough) {
		C101_KinbakuClub_Slaves_PlayerArousal = C101_KinbakuClub_Slaves_PlayerArousal -50
		C101_KinbakuClub_Slaves_CurrentStage = 270;
		OverridenIntroText = GetText("Reward");
	}
	else {
		if (ActorGetValue(ActorLove) > 2 && C101_KinbakuClub_Slaves_NotTriedHardEnough) OverridenIntroText = GetText("NoReward");
		C101_KinbakuClub_Slaves_LeftSmart();
	}
}

// Chapter 101 - Slaves - Option for Jenna to relief player or leave her frustrated.
function C101_KinbakuClub_Slaves_LeftSmart() {
	C101_KinbakuClub_Slaves_ShortLeash = false;
	C101_KinbakuClub_Slaves_PlayerBreastsExposed = false;
	C101_KinbakuClub_Slaves_PlayerPantiesDown = false;
	C101_KinbakuClub_Slaves_JennaLeaves()
}

// Chapter 101 - Lauren - goes to discipline outro
function C101_KinbakuClub_Slaves_Discipline() {
	SetScene(CurrentChapter, "Discipline");
}

// Chapter 101 - Slaves - player is too eager for the magic wand
function C101_KinbakuClub_Slaves_Grind() {
	if (C101_KinbakuClub_Slaves_AlreadyGround) {
		OverridenIntroText = GetText("DoubleGrind");
		C101_KinbakuClub_Slaves_CurrentStage = 120;
		C101_KinbakuClub_Slaves_LeftSmart()
	}
	C101_KinbakuClub_Slaves_AlreadyGround = true;
}

// Chapter 101 - Slaves - Arousal level peaked again
function C101_KinbakuClub_Slaves_Vibed() {
	C101_KinbakuClub_Slaves_PlayerArousal = 500;
}


// Chapter 101 - Slaves - Player calls jenna 'mistress jenna'
function C101_KinbakuClub_Slaves_MistressJenna() {
	C101_KinbakuClub_Slaves_NewMistress = true;
}

// Chapter 101 - Slaves - Player calls jenna bitch a second time.
function C101_KinbakuClub_Slaves_Bitch() {
	if (!Common_PlayerGagged) PlayerLockInventory("BallGag");
	C101_KinbakuClub_Slaves_ShortLeash = true;
	ActorLoad("", "ClubRoom4");
	LeaveIcon = "";
}

// Chapter 101 - Slaves - Player post orgasm
function C101_KinbakuClub_Slaves_Relieved() {
	if (C101_KinbakuClub_Slaves_PlayerArousal == 500) C101_KinbakuClub_Slaves_PlayerArousal = 0;
	if (PlayerHasLockedInventory("VibratingEgg")) C101_KinbakuClub_Slaves_PlayerArousal = 125;
	if (PlayerHasLockedInventory("ChastityBelt")) C101_KinbakuClub_Slaves_PlayerArousal = 75;
	if (PlayerHasLockedInventory("ChastityBelt") && PlayerHasLockedInventory("VibratingEgg")) C101_KinbakuClub_Slaves_PlayerArousal = 175;
	PlayerReleaseBondage()
	C101_KinbakuClub_Slaves_JennaWillGag = false;
	C101_KinbakuClub_Slaves_ShortLeash = false;
	C101_KinbakuClub_Slaves_PlayerBreastsExposed = false;
	C101_KinbakuClub_Slaves_PlayerPantiesDown = false;
	CurrentTime = CurrentTime + 60000
}

// Chapter 101 - Slaves - player asks jenna to keep masturbating her
function C101_KinbakuClub_Slaves_Longer() {
	if (C101_KinbakuClub_Slaves_LongerDone) {
		OverridenIntroText = GetText("DoneFor");
		C101_KinbakuClub_Slaves_CurrentStage = 310;
		C101_KinbakuClub_Slaves_Relieved()
	}
	C101_KinbakuClub_Slaves_LongerDone = true;
	C101_KinbakuClub_Slaves_PlayerArousal = 300
}

// Chapter 101 - Slaves - Jenna becomes players mistress
function C101_KinbakuClub_Slaves_MistressesCollar() {
	Common_PlayerOwner = "Jenna";
	PlayerLockInventory("Collar");
	C999_Common_Collar_LockedOn = true;
	C999_Common_Collar_KeyHolder = "Jenna";
	CurrentTime = CurrentTime + 30000
}

// Chapter 101 - Slaves - Jenna locks a loose collar
function C101_KinbakuClub_Slaves_CollarCheck() {
	if (!C999_Common_Collar_LockedOn) {
		C101_KinbakuClub_Slaves_MistressesCollar()
		OverridenIntroText = GetText("LockCollar");
		C101_KinbakuClub_Slaves_CurrentStage = 370;
	}
}
