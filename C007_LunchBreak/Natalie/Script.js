var C007_LunchBreak_Natalie_CurrentStage = 0;
var C007_LunchBreak_Natalie_MatchCount = 0; // At 2 or more, there's a good match
var C007_LunchBreak_Natalie_TickleDone = false;
var C007_LunchBreak_Natalie_KissDone = false;
var C007_LunchBreak_Natalie_MasturbateCount = 0;
var C007_LunchBreak_Natalie_OrgasmDone = 0;
var C007_LunchBreak_Natalie_CropDone = false;
var C007_LunchBreak_Natalie_SpankDone = false;
var C007_LunchBreak_Natalie_IsRoped = false;
var C007_LunchBreak_Natalie_IsGagged = false;
var C007_LunchBreak_Natalie_IsBlindfolded = false;
var C007_LunchBreak_Natalie_Clothes = 0;
var C007_LunchBreak_Natalie_IntroText = "";
var C007_LunchBreak_Natalie_LeaveIcon = "";
var C007_LunchBreak_Natalie_LoveCount = 0;
var C007_LunchBreak_Natalie_IsBoundAndGagged = false;
var C007_LunchBreak_Natalie_Others = 0;
var C007_LunchBreak_Natalie_VibratorPlayer = 0; // the intensity of your vibrator
var C007_LunchBreak_Natalie_Remote = true; // you still have your remote
var C007_LunchBreak_Natalie_NoRemote = false; // true if you drop your remote
var C007_LunchBreak_Natalie_Knee = false; // when Natalie is using here knee while hugging
var C007_LunchBreak_Natalie_Intensify = false; // once Natalie has started upping the vibe setting
var C007_LunchBreak_Natalie_VibratorNatalie = 0; // the intensity of Natalies vibrator
var C007_LunchBreak_Natalie_BadStage = 0; // for choice images when tied as a bad match
var C007_LunchBreak_Natalie_TwoRopes = false;


// Calculates the screen parameters
function C007_LunchBreak_Natalie_CalcParams() {

	// No special images by default
	OverridenIntroImage = "";
        
    // Between 200 and 240, the image evolves with the number of matches
    if ((C007_LunchBreak_Natalie_CurrentStage >= 200) && (C007_LunchBreak_Natalie_CurrentStage <= 240)) {
        var Img = "0";
        if (C007_LunchBreak_Natalie_MatchCount == 1) Img = "1";
        if (C007_LunchBreak_Natalie_MatchCount >= 2) Img = "2";
        OverridenIntroImage = "NataliePlayerSubLunch" + Img + ".jpg";
    }

    // Between 250 and 290, the image evolves with the number of matches
    if ((C007_LunchBreak_Natalie_CurrentStage >= 250) && (C007_LunchBreak_Natalie_CurrentStage <= 290)) {
        var Img = "0";
        if (C007_LunchBreak_Natalie_MatchCount == 1) Img = "1";
        if (C007_LunchBreak_Natalie_MatchCount >= 2) Img = "2";
        OverridenIntroImage = "NataliePlayerDomLunch" + Img + ".jpg";
    }

    // At 360. The image changes with player action.
    if (C007_LunchBreak_Natalie_CurrentStage == 360) {
        if (C007_LunchBreak_Natalie_BadStage == 1) OverridenIntroImage = "NataliePlayerBadNoEscape.jpg";
        if (C007_LunchBreak_Natalie_BadStage == 2) OverridenIntroImage = "NataliePlayerBadNoHelp.jpg";
        if (C007_LunchBreak_Natalie_BadStage == 3) OverridenIntroImage = "NataliePlayerBadChloeSuspended0.jpg";
        if (C007_LunchBreak_Natalie_BadStage == 4) OverridenIntroImage = "NataliePlayerBadChloeSuspended1.jpg";
        if (C007_LunchBreak_Natalie_BadStage == 5) OverridenIntroImage = "NataliePlayerBadChloeSuspended2.jpg";
        if (C007_LunchBreak_Natalie_BadStage == 6) OverridenIntroImage = "NataliePlayerBadStruggling.jpg";
        if (C007_LunchBreak_Natalie_BadStage == 7) OverridenIntroImage = "NataliePlayerBad.jpg";
    }

    // At 400, the player can dominate Natalie with many restraints, the image changes accordingly
    if ((C007_LunchBreak_Natalie_CurrentStage >= 430) && (C007_LunchBreak_Natalie_CurrentStage <= 460)) {
        var Img = "";
        if (C007_LunchBreak_Natalie_Clothes == 0) Img = Img + "Uniform";
        if (C007_LunchBreak_Natalie_Clothes == 1) Img = Img + "Underwear";
        if (C007_LunchBreak_Natalie_Clothes == 2) Img = Img + "Naked";
        if (ActorHasInventory("Rope") && !C007_LunchBreak_Natalie_TwoRopes) Img = Img + "Rope";
		if (ActorHasInventory("Rope") && C007_LunchBreak_Natalie_TwoRopes) Img = Img + "Desk";
		if (ActorHasInventory("BallGag")) Img = Img + "BallGag";
        if (ActorHasInventory("ClothGag")) Img = Img + "ClothGag";
        if (ActorHasInventory("TapeGag")) Img = Img + "TapeGag";
        if (ActorHasInventory("Blindfold")) Img = Img + "Blindfold";
		OverridenIntroImage = "NataliePlayerDom" + Img + ".jpg";
    }

    // At 660, the image changes with intensity, knee and remote drop
    if (C007_LunchBreak_Natalie_CurrentStage == 660) {
        var Img = "";
        if (C007_LunchBreak_Natalie_Intensify) Img = Img + "Intensify";
        if (C007_LunchBreak_Natalie_NoRemote) Img = Img + "Drop";
        if (C007_LunchBreak_Natalie_Knee) Img = Img + "Knee";
        OverridenIntroImage = "NataliePlayerHug" + Img + ".jpg";
    }

    // Keep the status of Natalie
    if ((C007_LunchBreak_Natalie_TwoRopes) && (C007_LunchBreak_Natalie_IsGagged)) C007_LunchBreak_Natalie_IsBoundAndGagged = true;
}



// Chapter 7 - Natalie Load
function C007_LunchBreak_Natalie_Load() {

    // Load the scene parameters
    ActorLoad("Natalie", "ActorSelect");
    LoadInteractions();
    C007_LunchBreak_Natalie_CalcParams();

    // If Natalie doesn't like the player and isn't subbie enough, she leaves and don't talk
    if ((ActorGetValue(ActorLove) <= -3) && (ActorGetValue(ActorSubmission) <= 2) && (C007_LunchBreak_Natalie_CurrentStage == 0)) {
        C007_LunchBreak_Natalie_CurrentStage = 5;
        C007_LunchBreak_ActorSelect_NatalieAvail = false;
    }

    // If we must put the previous text back
    if ((C007_LunchBreak_Natalie_IntroText != "") && (C007_LunchBreak_Natalie_CurrentStage > 0)) {
        OverridenIntroText = C007_LunchBreak_Natalie_IntroText;
        LeaveIcon = C007_LunchBreak_Natalie_LeaveIcon;
    }

}



// Chapter 7 - Natalie Run
function C007_LunchBreak_Natalie_Run() {
    BuildInteraction(C007_LunchBreak_Natalie_CurrentStage);
}



// Chapter 7 - Natalie Click
function C007_LunchBreak_Natalie_Click() {

    // Regular and inventory interactions
    ClickInteraction(C007_LunchBreak_Natalie_CurrentStage);
    var ClickInv = GetClickedInventory();
    if (ClickInv == "Player") {
        C007_LunchBreak_Natalie_IntroText = OverridenIntroText;
        C007_LunchBreak_Natalie_LeaveIcon = LeaveIcon;
        InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
    }

    // When the user wants to use a second rope
    if ((C007_LunchBreak_Natalie_CurrentStage == 430) && (ClickInv == "Rope") && ActorHasInventory("Rope") && !C007_LunchBreak_Natalie_TwoRopes) {
        OverridenIntroText = GetText("SecondRope");
        PlayerRemoveInventory("Rope", 1);
        CurrentTime = CurrentTime + 120000;
        C007_LunchBreak_Natalie_TwoRopes = true;
        C007_LunchBreak_Natalie_TimeLimit()
    }

    // When the user wants to use the rope
    if ((C007_LunchBreak_Natalie_CurrentStage == 430) && (ClickInv == "Rope") && !ActorHasInventory("Rope")) {
        OverridenIntroText = GetText("FirstRope");
        ActorAddInventory("Rope");
        PlayerRemoveInventory("Rope", 1);
        CurrentTime = CurrentTime + 120000;
        C007_LunchBreak_Natalie_IsRoped = true;
        C007_LunchBreak_Natalie_TimeLimit()
    }

    // When the user wants to use the cuffs
    if ((C007_LunchBreak_Natalie_CurrentStage == 430) && (ClickInv == "Cuffs")) {
        OverridenIntroText = GetText("Cuffs");
        C007_LunchBreak_Natalie_TimeLimit()
    }

    // When the user wants to use the blindfold
    if ((C007_LunchBreak_Natalie_CurrentStage == 430) && (ClickInv == "Blindfold") && !ActorHasInventory("Blindfold")) {
        OverridenIntroText = GetText("Blindfold");
        ActorAddInventory("Blindfold");
        PlayerRemoveInventory("Blindfold", 1);
        CurrentTime = CurrentTime + 60000;
        C007_LunchBreak_Natalie_IsBlindfolded = true;
        C007_LunchBreak_Natalie_TimeLimit()
    }

    // When the user wants to use the BallGag
    if ((C007_LunchBreak_Natalie_CurrentStage == 430) && (ClickInv == "BallGag") && !ActorHasInventory("BallGag")) {
        OverridenIntroText = GetText("BallGag");
        C007_LunchBreak_Natalie_Ungag();
        ActorAddInventory("BallGag");
        PlayerRemoveInventory("BallGag", 1);
        CurrentTime = CurrentTime + 60000;
        C007_LunchBreak_Natalie_IsGagged = true;
        C007_LunchBreak_Natalie_TimeLimit()
    }

    // When the user wants to use the ClothGag
    if ((C007_LunchBreak_Natalie_CurrentStage == 430) && (ClickInv == "ClothGag") && !ActorHasInventory("ClothGag")) {
        OverridenIntroText = GetText("ClothGag");
        C007_LunchBreak_Natalie_Ungag();
        ActorAddInventory("ClothGag");
        PlayerRemoveInventory("ClothGag", 1);
        CurrentTime = CurrentTime + 60000;
        C007_LunchBreak_Natalie_IsGagged = true;
        C007_LunchBreak_Natalie_TimeLimit()
    }

    // When the user wants to use the tape gag
    if ((C007_LunchBreak_Natalie_CurrentStage == 430) && (ClickInv == "TapeGag") && !ActorHasInventory("TapeGag")) {
        OverridenIntroText = GetText("TapeGag");
        C007_LunchBreak_Natalie_Ungag();
        ActorAddInventory("TapeGag");
        PlayerRemoveInventory("TapeGag", 1);
        CurrentTime = CurrentTime + 60000;
        C007_LunchBreak_Natalie_IsGagged = true;
        C007_LunchBreak_Natalie_TimeLimit()
    }

    // When the user wants to use the crop on Natalie
    if ((C007_LunchBreak_Natalie_CurrentStage == 430) && (ClickInv == "Crop")) {
        OverridenIntroText = GetText("Crop");
        if (!C007_LunchBreak_Natalie_CropDone) {
            C007_LunchBreak_Natalie_CropDone = true;
            ActorChangeAttitude(0, 1);
        }
        CurrentTime = CurrentTime + 60000;
        C007_LunchBreak_Natalie_TimeLimit()
    }

    // When the user wants to use the egg
    if ((C007_LunchBreak_Natalie_CurrentStage == 430) && (ClickInv == "VibratingEgg") && !ActorHasInventory("VibratingEgg")) {
        OverridenIntroText = GetText("VibratingEgg");
        ActorChangeAttitude(0, 1);
        ActorAddInventory("VibratingEgg");
        PlayerRemoveInventory("VibratingEgg", 1);
        CurrentTime = CurrentTime + 60000;
        C007_LunchBreak_Natalie_TimeLimit()
    }	
    
    // When the user wants to use the collar (+20 submission and a ceremony is required)
    if ((C007_LunchBreak_Natalie_CurrentStage == 430) && (ClickInv == "Collar") && !ActorHasInventory("Collar"))
        OverridenIntroText = GetText("Collar");
    C007_LunchBreak_Natalie_TimeLimit()

    // When the user wants to use a bondage item when subbie
    if ((C007_LunchBreak_Natalie_CurrentStage >= 500) && (C007_LunchBreak_Natalie_CurrentStage < 540) && ((ClickInv == "Collar") || (ClickInv == "VibratingEgg") || (ClickInv == "Crop") || (ClickInv == "TapeGag") || (ClickInv == "BallGag") || (ClickInv == "Rope")))
        OverridenIntroText = GetText("SubbieNoItem");

    // When the user wants to use a bondage item together
    if ((C007_LunchBreak_Natalie_CurrentStage >= 600) && (C007_LunchBreak_Natalie_CurrentStage < 630) && ((ClickInv == "Collar") || (ClickInv == "VibratingEgg") || (ClickInv == "Crop") || (ClickInv == "TapeGag") || (ClickInv == "BallGag") || (ClickInv == "Rope")))
        OverridenIntroText = GetText("TogetherNoItem");

    // Recalculates the scene parameters
    C007_LunchBreak_Natalie_CalcParams();

}



// Chapter 7 - Initial Kinbaku, questions and eating

// Chapter 7 - Natalie mentions the KC
function C007_LunchBreak_Natalie_ClubMention() {
    Common_ClubStatus = "ClubMentioned";
}

// Chapter 7 - Natalie Start Lunch
function C007_LunchBreak_Natalie_StartLunch() {
    CurrentTime = CurrentTime + 120000;
    Common_ClubStatus = "ClubLunchVisited";
    LeaveIcon = "";
}

// Chapter 7 - Natalie End Lunch
function C007_LunchBreak_Natalie_EndLunch() {
    C007_LunchBreak_ActorSelect_NatalieAvail = false;
}

// Chapter 7 - Natalie tied up first
function C007_LunchBreak_Natalie_NatalieTied() {
    CurrentTime = CurrentTime + 60000;
    ActorAddInventory("Rope");
    C007_LunchBreak_Natalie_IsRoped = true;
}

// Chapter 7 - Natalie - Player Upper body Is Tied with Roped
function C007_LunchBreak_Natalie_PlayerRope() {
    PlayerLockInventory("Rope");
    CurrentTime = CurrentTime + 60000;
}

// Chapter 7 - Natalie Eat Lunch (adds 10 minutes)
function C007_LunchBreak_Natalie_Eat() {
    CurrentTime = CurrentTime + 300000;
}

// Chapter 7 - Natalie Good Match and eat food
function C007_LunchBreak_Natalie_EatGoodMatch() {
    C007_LunchBreak_Natalie_MatchCount++;
    C007_LunchBreak_Natalie_CalcParams();
    CurrentTime = CurrentTime + 300000;
}

// Chapter 7 - Natalie Bad Match and eat food
function C007_LunchBreak_Natalie_EatBadMatch() {
    C007_LunchBreak_Natalie_MatchCount--;
    C007_LunchBreak_Natalie_CalcParams();
    CurrentTime = CurrentTime + 300000;
}

// Chapter 7 - Natalie Test Match - if the match is 2 or better, we go to a bonus part
function C007_LunchBreak_Natalie_TestMatch() {
    C007_LunchBreak_Natalie_CurrentStage = -1; // No mode
    if ((C007_LunchBreak_Natalie_MatchCount >= 2) && ActorHasInventory("Rope")) C007_LunchBreak_Natalie_CurrentStage = 400; // Dom mode
    if ((C007_LunchBreak_Natalie_MatchCount >= 2) && !ActorHasInventory("Rope")) C007_LunchBreak_Natalie_CurrentStage = 500; // Sub mode
    if ((C007_LunchBreak_Natalie_MatchCount <= 1) && ActorHasInventory("Rope")) C007_LunchBreak_Natalie_CurrentStage = 300; // Dom mode
    if ((C007_LunchBreak_Natalie_MatchCount <= 1) && !ActorHasInventory("Rope")) C007_LunchBreak_Natalie_CurrentStage = 320; // Sub mode
    else ActorChangeAttitude(-1, 0);
}



// Chapter 7 - Player is a bad match section
// Chapter 7 - Natalie escapes your ropes
function C007_LunchBreak_Natalie_NatalieEscape() {
    ActorRemoveInventory("Rope");
    C007_LunchBreak_Natalie_IsRoped = false;
}

// Chapter 7 - Natalie - Player Subbie rope
function C007_LunchBreak_Natalie_SubbieRope() {
    PlayerLockInventory("Rope");
}

// Chapter 7 - Natalie - Player Subbie Cloth Gag
function C007_LunchBreak_Natalie_SubbieClothGag() {
    PlayerLockInventory("ClothGag");
}

// Chapter 7 - (Look for an escape.)
function C007_LunchBreak_Natalie_NoEscape() {
    C007_LunchBreak_Natalie_BadStage = 1;
    CurrentTime = CurrentTime + 120000;
    if (CurrentTime >= 12.66667 * 60 * 60 * 1000) {
        OverridenIntroText = GetText("NatalieReturns");
        C007_LunchBreak_Natalie_CurrentStage = 365;
    }
}

// Chapter 7 - (Try calling for help.)
function C007_LunchBreak_Natalie_NoHelp() {
    C007_LunchBreak_Natalie_BadStage = 2;
    CurrentTime = CurrentTime + 120000;
    if (CurrentTime >= 12.66667 * 60 * 60 * 1000) {
        OverridenIntroText = GetText("NatalieReturns");
        C007_LunchBreak_Natalie_CurrentStage = 365;
    }
}

// Chapter 7 - (Look at what the|others are doing.)
function C007_LunchBreak_Natalie_ChloeSuspended() {
    if (C007_LunchBreak_Natalie_Others == 0) {
        C007_LunchBreak_Natalie_BadStage = 3;
    }
    if (C007_LunchBreak_Natalie_Others == 1) {
        C007_LunchBreak_Natalie_BadStage = 4;
        OverridenIntroText = GetText("Chloe1");
    }
    if (C007_LunchBreak_Natalie_Others >= 2) {
        C007_LunchBreak_Natalie_BadStage = 5;
        OverridenIntroText = GetText("Chloe2");
    }
    C007_LunchBreak_Natalie_Others++;
    CurrentTime = CurrentTime + 120000;
    if (CurrentTime >= 12.66667 * 60 * 60 * 1000) {
        OverridenIntroText = GetText("NatalieReturns");
        C007_LunchBreak_Natalie_CurrentStage = 365;
    }
}

// Chapter 7 - (Try struggling again.)
function C007_LunchBreak_Natalie_Struggle() {
    C007_LunchBreak_Natalie_BadStage = 6;
    CurrentTime = CurrentTime + 120000;
    if (CurrentTime >= 12.66667 * 60 * 60 * 1000) {
        OverridenIntroText = GetText("NatalieReturns");
        C007_LunchBreak_Natalie_CurrentStage = 365;
    }
}

// Chapter 7 - Natalie Bad Wait - She comes back at 12:40
function C007_LunchBreak_Natalie_Wait() {
    C007_LunchBreak_Natalie_BadStage = 7;
    CurrentTime = CurrentTime + 120000;
    if (CurrentTime >= 12.66667 * 60 * 60 * 1000) {
        OverridenIntroText = GetText("NatalieReturns");
        C007_LunchBreak_Natalie_CurrentStage = 365;
    }
}

// Chapter 7 - Natalie - Player Bad Ungag
function C007_LunchBreak_Natalie_BadUngag() {
    PlayerUnlockInventory("ClothGag");
}

// Chapter 7 - Natalie - Player Release
function C007_LunchBreak_Natalie_PlayerRelease() {
    PlayerUnlockAllInventory();
}

// Chapter 7 - Natalie End Chapter
function C007_LunchBreak_Natalie_EndChapter() {
    C007_LunchBreak_ActorSelect_Kinbaku = true;
    SetScene(CurrentChapter, "Outro");
}



// Chapter 7 - Natalie Player Good Dom
// Chapter 7 - Natalie - Player asks for more items
function C007_LunchBreak_Natalie_GetToys() {
    PlayerAddInventory("Rope", 1);
    PlayerAddInventory("Blindfold", 1);
    PlayerAddInventory("BallGag", 1);
    PlayerAddInventory("ClothGag", 1);
    PlayerAddInventory("VibratingEgg", 1);
}

// Chapter 7 - Natalie is untied and strips
function C007_LunchBreak_Natalie_UntieStrip() {
    ActorRemoveInventory("Rope");
    PlayerAddInventory("Rope", 1);
    C007_LunchBreak_Natalie_IsRoped = false;
    C007_LunchBreak_Natalie_Clothes = 1;
    CurrentTime = CurrentTime + 60000;
}

// Chapter 7 - Natalie strips naked
function C007_LunchBreak_Natalie_NatalieNaked() {
    C007_LunchBreak_Natalie_Clothes = 2;
    CurrentTime = CurrentTime + 60000;
}

// Chapter 7 - Natalie puts here clothes back on
function C007_LunchBreak_Natalie_NatilieClothed() {
    C007_LunchBreak_Natalie_Clothes = 0;
    CurrentTime = CurrentTime + 60000;
}


// Chapter 7 - Natalie Tickle
function C007_LunchBreak_Natalie_Tickle() {
    CurrentTime = CurrentTime + 60000;
    if (ActorHasInventory("Rope")) {
        OverridenIntroText = GetText("TickleTied");
        if (!C007_LunchBreak_Natalie_TickleDone) {
            C007_LunchBreak_Natalie_TickleDone = true;
            ActorChangeAttitude(-1, 1);
        }
    }
    C007_LunchBreak_Natalie_TimeLimit()
}

// Chapter 7 - Natalie Spank
function C007_LunchBreak_Natalie_Spank() {
    CurrentTime = CurrentTime + 60000;
    if (!C007_LunchBreak_Natalie_SpankDone) {
        ActorChangeAttitude(-1, 1);
        C007_LunchBreak_Natalie_SpankDone = true;
    }
    C007_LunchBreak_Natalie_TimeLimit()
}

// Chapter 7 - Natalie Kiss
function C007_LunchBreak_Natalie_Kiss() {
    CurrentTime = CurrentTime + 60000;
    if ((C007_LunchBreak_Natalie_IsRoped) && (!C007_LunchBreak_Natalie_IsGagged)) {
        OverridenIntroText = GetText("KissTied");
        if (!C007_LunchBreak_Natalie_KissDone) {
            C007_LunchBreak_Natalie_KissDone = true;
            ActorChangeAttitude(1, 0);
        }
    }
    if (C007_LunchBreak_Natalie_IsGagged) {
        OverridenIntroText = GetText("KissGagged");
        if (!C007_LunchBreak_Natalie_KissDone) {
            C007_LunchBreak_Natalie_KissDone = true;
            ActorChangeAttitude(0, 1);
        }
    }
    C007_LunchBreak_Natalie_TimeLimit()
}

// Chapter 7 - Natalie Dom Masturbate (only when tied up, quicker with egg and 2 stage)
function C007_LunchBreak_Natalie_DomMasturbate() {
    if (!ActorHasInventory("Rope")) {
        OverridenIntroText = GetText("NoMasturbate");
    }
    if (ActorHasInventory("Rope")) {
        CurrentTime = CurrentTime + 60000;
        C007_LunchBreak_Natalie_MasturbateCount++;
        if (ActorHasInventory("VibratingEgg")) {
            C007_LunchBreak_Natalie_MasturbateCount++;
        }
        if ((C007_LunchBreak_Natalie_MasturbateCount >= 5) && (C007_LunchBreak_Natalie_OrgasmDone < 1)) {
            OverridenIntroText = GetText("NatalieOrgasm1");
            ActorAddOrgasm();
            ActorChangeAttitude(0, 1);
            C007_LunchBreak_Natalie_OrgasmDone++;
        }
        if ((C007_LunchBreak_Natalie_MasturbateCount >= 9) && (C007_LunchBreak_Natalie_OrgasmDone < 2)) {
            OverridenIntroText = GetText("NatalieOrgasm2");
            ActorAddOrgasm();
            ActorChangeAttitude(2, 1);
            C007_LunchBreak_Natalie_OrgasmDone++;
        }
    }
    C007_LunchBreak_Natalie_TimeLimit()
}

// Chapter 7 - Natalie Untie
function C007_LunchBreak_Natalie_Untie() {
    if (ActorHasInventory("Rope")) {
        CurrentTime = CurrentTime + 120000;
        ActorRemoveInventory("Rope");
        PlayerAddInventory("Rope", 1);
        if (C007_LunchBreak_Natalie_TwoRopes) {
            CurrentTime = CurrentTime + 120000;
            PlayerAddInventory("Rope", 1);
            C007_LunchBreak_Natalie_TwoRopes = false;
        }
        C007_LunchBreak_Natalie_IsRoped = false;
    }
    C007_LunchBreak_Natalie_TimeLimit()
}

// Chapter 7 - Natalie Ungag
function C007_LunchBreak_Natalie_Ungag() {
    CurrentTime = CurrentTime + 60000;
    ActorRemoveInventory("TapeGag");
    if (ActorHasInventory("BallGag")) {
        ActorRemoveInventory("BallGag");
        PlayerAddInventory("BallGag", 1);
    }
    if (ActorHasInventory("ClothGag")) {
        ActorRemoveInventory("ClothGag");
        PlayerAddInventory("ClothGag", 1);
    }
    C007_LunchBreak_Natalie_IsGagged = false;
    C007_LunchBreak_Natalie_TimeLimit()
}

// Chapter 7 - Natalie UnBlindfold
function C007_LunchBreak_Natalie_Unblind() {
    CurrentTime = CurrentTime + 60000;
    ActorRemoveInventory("Blindfold");
    PlayerAddInventory("Blindfold", 1);
    C007_LunchBreak_Natalie_IsBlindfolded = false;
    C007_LunchBreak_Natalie_TimeLimit()
}

// Chapter 7 - Natalie dom time limit
function C007_LunchBreak_Natalie_TimeLimit() {
    if ((C007_LunchBreak_Natalie_CurrentStage == 430) && (CurrentTime >= 12.66667 * 60 * 60 * 1000)) {
        OverridenIntroText = GetText("OutOfTime");
        C007_LunchBreak_Natalie_NatalieRelease()
        C007_LunchBreak_Natalie_CurrentStage = 490;
    }
}

// Chapter 7 - Natalie is released
function C007_LunchBreak_Natalie_NatalieRelease() {
    ActorRemoveInventory("TapeGag");
    if (ActorHasInventory("BallGag")) {
        ActorRemoveInventory("BallGag");
        PlayerAddInventory("BallGag", 1);
    }
    if (ActorHasInventory("ClothGag")) {
        ActorRemoveInventory("ClothGag");
        PlayerAddInventory("ClothGag", 1);
    }
    C007_LunchBreak_Natalie_IsGagged = false;
    if (ActorHasInventory("Rope")) {
        ActorRemoveInventory("Rope");
        PlayerAddInventory("Rope", 1);
        if (C007_LunchBreak_Natalie_TwoRopes) {
            PlayerAddInventory("Rope", 1);
            C007_LunchBreak_Natalie_TwoRopes = false;
        }
    }
    C007_LunchBreak_Natalie_IsRoped = false;
    if (ActorHasInventory("Blindfold")) {
        ActorRemoveInventory("Blindfold");
        PlayerAddInventory("Blindfold", 1);
    }
    C007_LunchBreak_Natalie_IsBlindfolded = false;
}

// Chapter 7 - Natalie turns on the player for letting her go with a lame excuse.
function C007_LunchBreak_Natalie_PlayerBoundGagged() {
    CurrentTime = CurrentTime + 180000;
    PlayerLockInventory("Rope")
    PlayerLockInventory("ClothGag")
}

// Chapter 7 - Natalie Evil End Chapter (Leave her bound and gagged)
function C007_LunchBreak_Natalie_EvilEnd() {
    C007_LunchBreak_ActorSelect_EvilEnding = true;
    Common_PlayerCrime = "NatalieStranded";
    SetScene(CurrentChapter, "Outro");
}



// Chapter 7 - Natalie - Player Good Sub

// Chapter 7 - Natalie - role reversal
function C007_LunchBreak_Natalie_PlayerReversal() {
    CurrentTime = CurrentTime + 240000;
    PlayerUnlockAllInventory();
    ActorAddInventory("Rope")
}


// Chapter 7 - Natalie - Player Strip
function C007_LunchBreak_Natalie_PlayerStrip() {
    CurrentTime = CurrentTime + 60000;
    PlayerClothes("Underwear");
}

// Chapter 7 - Natalie - Player Blindfolded
function C007_LunchBreak_Natalie_PlayerBlindfold() {
    CurrentTime = CurrentTime + 60000;
    PlayerLockInventory("Blindfold");
}

// Chapter 7 - Natalie - Player Has Egg Inserted
function C007_LunchBreak_Natalie_PlayerEgg() {
    CurrentTime = CurrentTime + 30000;
    PlayerLockInventory("VibratingEgg");
}

// Cha[ter 7 - Natalie - Player is BallGagged
function C007_LunchBreak_Natalie_PlayerBallGag() {
    CurrentTime = CurrentTime + 60000;
    PlayerLockInventory("BallGag");
}

// Chapter 7 - Natalie - Player Subbie Masturbate (After 3 times, the player cums)
function C007_LunchBreak_Natalie_SubbieMasturbate() {
    CurrentTime = CurrentTime + 120000;
    C007_LunchBreak_Natalie_MasturbateCount++;
    if (C007_LunchBreak_Natalie_MasturbateCount >= 4) {
        OverridenIntroText = GetText("SubbieMasturbate");
        ActorAddOrgasm();
        ActorChangeAttitude(1, 0);
        PlayerUnlockInventory("BallGag");
        PlayerUnlockInventory("Blindfold");
        PlayerUnlockInventory("Rope");
        CurrentTime = CurrentTime + 120000;
        C007_LunchBreak_Natalie_CurrentStage = 590;
    }
}

// Chapter 7 - Natalie - Player Has Egg Extracted
function C007_LunchBreak_Natalie_PlayerNoEgg() {
    CurrentTime = CurrentTime + 120000;
    PlayerUnlockInventory("VibratingEgg");
    PlayerClothes("Clothed");
}

// Chapter 7 - Natalie - Player gets dressed
function C007_LunchBreak_Natalie_PlayerClothed() {
    CurrentTime = CurrentTime + 60000;
    PlayerClothes("Clothed");
}



// Chapter 7 - Natalie Bound togther section
// Chapter 7 - Natalie - Player is Handcuffed
function C007_LunchBreak_Natalie_PlayerCuffed() {
    CurrentTime = CurrentTime + 60000;
    PlayerLockInventory("Cuffs");
    C999_Common_Cuffs_KeyOutOfReach = true;
}

// Chapter 7 - Natalie - Player is gagged with double open mouth gag - Seems to cuse lockup between stages 630-640
function C007_LunchBreak_Natalie_OpenGag() {
    CurrentTime = CurrentTime + 60000;
    PlayerLockInventory("DoubleOpenGag");
}

// Chapter 7 - Natalie - Use Vibrator remote when hugging Natalie
function C007_LunchBreak_Natalie_VibeNatalie() {
    C007_LunchBreak_Natalie_VibratorNatalie++;
    C007_LunchBreak_Natalie_Knee = false;
    CurrentTime = CurrentTime + 60000;
    if (C007_LunchBreak_Natalie_VibratorNatalie <= 1) OverridenIntroText = GetText("Remote1");
    if (C007_LunchBreak_Natalie_VibratorNatalie == 2) OverridenIntroText = GetText("Remote2");
    if (C007_LunchBreak_Natalie_VibratorNatalie >= 3) {
        OverridenIntroText = GetText("Remote3");
        // OverridenIntroImage = "NataliePlayerRemoteDrop.jpg";
        C007_LunchBreak_Natalie_VibratorPlayer++;
        C007_LunchBreak_Natalie_Remote = false;
        C007_LunchBreak_Natalie_NoRemote = true;
        C007_LunchBreak_Natalie_Intensify = true;
    }  
    if (CurrentTime >= 12.66667 * 60 * 60 * 1000) {
        OverridenIntroText = GetText("JennaReturns");
        C007_LunchBreak_Natalie_CurrentStage = 690;
    }
    C007_LunchBreak_Natalie_CalcParams();
}

// Chapter 7 - Natalie - Panic while hugging Natalie
function C007_LunchBreak_Natalie_Panic() {
    C007_LunchBreak_Natalie_VibratorPlayer--;
    C007_LunchBreak_Natalie_Intensify = false;
    C007_LunchBreak_Natalie_Knee = false;
    CurrentTime = CurrentTime + 60000;
    if (CurrentTime >= 12.66667 * 60 * 60 * 1000) {
        OverridenIntroText = GetText("JennaReturns");
        C007_LunchBreak_Natalie_CurrentStage = 690;
    }
    C007_LunchBreak_Natalie_CalcParams();
}

// Chapter 7 - Natalie - Natalie Intensifies Your Viberator
function C007_LunchBreak_Natalie_VibePlayer() {
    C007_LunchBreak_Natalie_VibratorPlayer++;
    C007_LunchBreak_Natalie_Intensify = true;
    C007_LunchBreak_Natalie_Knee = false;
    if (C007_LunchBreak_Natalie_VibratorPlayer >= 5) {
        OverridenIntroText = GetText("Orgasm");
        C007_LunchBreak_Natalie_OrgasmDone = true;
        C007_LunchBreak_Natalie_CurrentStage = 670;
    }
    CurrentTime = CurrentTime + 60000;
    if (CurrentTime >= 12.66667 * 60 * 60 * 1000) {
        OverridenIntroText = GetText("JennaReturns");
        C007_LunchBreak_Natalie_CurrentStage = 690;
    }
    C007_LunchBreak_Natalie_CalcParams();
}

// Chapter 7 - Natalie - Natalie Intensifies Your Viberator and uses her knee
function C007_LunchBreak_Natalie_KneePlayer() {
    C007_LunchBreak_Natalie_VibratorPlayer++;
    C007_LunchBreak_Natalie_Intensify = true;
    C007_LunchBreak_Natalie_Knee = true;
    if (C007_LunchBreak_Natalie_VibratorPlayer >= 5) {
        OverridenIntroText = GetText("Orgasm");
        ActorAddOrgasm();
        C007_LunchBreak_Natalie_OrgasmDone = true;
        C007_LunchBreak_Natalie_CurrentStage = 670;
    }
    CurrentTime = CurrentTime + 60000;
    if (CurrentTime >= 12.66667 * 60 * 60 * 1000) {
        OverridenIntroText = GetText("JennaReturns");
        C007_LunchBreak_Natalie_CurrentStage = 690;
    }
    C007_LunchBreak_Natalie_CalcParams();
}

// Chapter 7 - Hug Natalie tenderly
function C007_LunchBreak_Natalie_Hug() {
    CurrentTime = CurrentTime + 60000;
    C007_LunchBreak_Natalie_Knee = false;
    if (CurrentTime >= 12.66667 * 60 * 60 * 1000) {
        OverridenIntroText = GetText("JennaReturns");
        C007_LunchBreak_Natalie_CurrentStage = 690;
    }
    C007_LunchBreak_Natalie_CalcParams();
}
