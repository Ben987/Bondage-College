var C101_KinbakuClub_Lauren_CurrentStage = 0;
var C101_KinbakuClub_Lauren_PreviousStage = 0;
var C101_KinbakuClub_Lauren_PlayerGagged = false;
var C101_KinbakuClub_Lauren_NodDone = false;
var C101_KinbakuClub_Lauren_BlindfoldAvailable = true;
var C101_KinbakuClub_Lauren_Random = 0; // for test to see if player escapes learing first time
var C101_KinbakuClub_Lauren_attempt = 0;
var C101_KinbakuClub_Lauren_HasClip = false;
var C101_KinbakuClub_Lauren_GotClip = false;
var C101_KinbakuClub_Lauren_ItsHard = false;
var C101_KinbakuClub_Lauren_BullyCount = 0; // increases when player does something to Lauren while helpless which she dislikes.
var C101_KinbakuClub_Lauren_LaurenChairCuffed = false;
var C101_KinbakuClub_Lauren_LaurenGagged = false;
var C101_KinbakuClub_Lauren_LaurenBallGagged = false;
var C101_KinbakuClub_Lauren_LaurenTapeGagged = false;
var C101_KinbakuClub_Lauren_LaurenClothGagged = false;
var C101_KinbakuClub_Lauren_MasturbateCount = 0;
var C101_KinbakuClub_Lauren_OrgasmDone = false;
var C101_KinbakuClub_Lauren_Waited = false;
var C101_KinbakuClub_Lauren_Return = 0;
var C101_KinbakuClub_Lauren_HasKey = false;
var C101_KinbakuClub_Lauren_LocateClip = false;
var C101_KinbakuClub_Lauren_SafeClips = false;
var C101_KinbakuClub_Lauren_RiskyClip = false;
var C101_KinbakuClub_Lauren_UsefulClip = false;
var C101_KinbakuClub_Lauren_PlayerLegCuffs = false;
var C101_KinbakuClub_Lauren_Intimacy = 0;
var C101_KinbakuClub_Lauren_StrappadoOrgasm = false;
var C101_KinbakuClub_Lauren_EscapeArtist = false;
var C101_KinbakuClub_Lauren_PlayerChairCuffed = false;
var C101_KinbakuClub_Lauren_PlayerStrappado = false;


// Calculates the scene parameters
function C101_KinbakuClub_Lauren_CalcParams() {
	C101_KinbakuClub_Lauren_PlayerGagged = Common_PlayerGagged;
	C101_KinbakuClub_Lauren_LaurenGagged = (ActorHasInventory("BallGag") || ActorHasInventory("ClothGag") || ActorHasInventory("TapeGag"))
	C101_KinbakuClub_Lauren_HasKey = PlayerHasInventory("CuffsKey");
	C101_KinbakuClub_Lauren_EscapeArtist = C999_Common_Cuffs_CanEscape;
	C101_KinbakuClub_Lauren_LaurenChairCuffed = ActorHasInventory("Cuffs")
	C101_KinbakuClub_Lauren_LaurenBallGagged = ActorHasInventory("BallGag");
	C101_KinbakuClub_Lauren_LaurenTapeGagged = ActorHasInventory("TapeGag");
	C101_KinbakuClub_Lauren_LaurenClothGagged = ActorHasInventory("ClothGag");
	
}


// Chapter 101 - Lauren Load
function C101_KinbakuClub_Lauren_Load() {

	// Load the scene parameters
	ActorLoad("Lauren", "ClubRoom1");
	LoadInteractions();
	C101_KinbakuClub_Lauren_CalcParams();


	// Different stage if player approaches Lauren while tied or cuffed
	if (C101_KinbakuClub_Lauren_CurrentStage <= 150){
		if (C101_KinbakuClub_Lauren_CurrentStage >= 30) C101_KinbakuClub_Lauren_PreviousStage = C101_KinbakuClub_Lauren_CurrentStage;
		if (PlayerHasLockedInventory("Rope")) C101_KinbakuClub_Lauren_CurrentStage = 10;
		if (!PlayerHasLockedInventory("Rope") && (C101_KinbakuClub_Lauren_CurrentStage == 10 || C101_KinbakuClub_Lauren_CurrentStage == 15)) C101_KinbakuClub_Lauren_CurrentStage = C101_KinbakuClub_Lauren_PreviousStage;
		if (C101_KinbakuClub_Lauren_CurrentStage < 50 && PlayerHasLockedInventory("Cuffs")) C101_KinbakuClub_Lauren_CurrentStage = 20;
		if (!Common_PlayerRestrained && ((C101_KinbakuClub_Lauren_CurrentStage > 0 && C101_KinbakuClub_Lauren_CurrentStage < 30) || (C101_KinbakuClub_Lauren_CurrentStage == 50 || C101_KinbakuClub_Lauren_CurrentStage == 55))) C101_KinbakuClub_Lauren_CurrentStage = 0;
		if (PlayerHasLockedInventory("Cuffs") && (C101_KinbakuClub_Lauren_CurrentStage == 140 || C101_KinbakuClub_Lauren_CurrentStage == 145)) {
			C101_KinbakuClub_Lauren_CurrentStage = 150
			LeaveIcon = "";
		}
	}
	
	// When player returns after capturing Lauren or Lauren captures player
	if (C101_KinbakuClub_Lauren_CurrentStage >= 300) LeaveIcon = "";
	if (C101_KinbakuClub_Lauren_CurrentStage == 450 || C101_KinbakuClub_Lauren_CurrentStage == 460 || C101_KinbakuClub_Lauren_CurrentStage == 470) LeaveIcon = "Leave";
	if (C101_KinbakuClub_Lauren_CurrentStage == 525) C101_KinbakuClub_Lauren_CurrentStage = 520;
	if (C101_KinbakuClub_Lauren_CurrentStage == 520) LeaveIcon = "Leave";
	if (C101_KinbakuClub_Lauren_CurrentStage == 600) C101_KinbakuClub_Lauren_PlayerStrappado = true;
	C101_KinbakuClub_Lauren_CalcParams();
}

// Chapter 101 - Lauren Run
function C101_KinbakuClub_Lauren_Run() {
	BuildInteraction(C101_KinbakuClub_Lauren_CurrentStage);

	// Image overlays
	// Blindfold and cuffs on table
	if (C101_KinbakuClub_Lauren_CurrentStage <= 220) {
		if  (C101_KinbakuClub_Lauren_BlindfoldAvailable) {
			DrawImage(CurrentChapter + "/" + CurrentScreen + "/Blindfold.jpg", 735, 395);
		}
		if (C101_KinbakuClub_Lauren_CurrentStage < 150) {
			DrawImage(CurrentChapter + "/" + CurrentScreen + "/Cuffs.jpg", 730, 450);
		}
	}

	// Lauren chair cuffed looking behind
	if (C101_KinbakuClub_Lauren_CurrentStage == 450) {
		if (ActorHasInventory("BallGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenRealizedBall.jpg", 925, 80);
		if (ActorHasInventory("TapeGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenRealizedTape.jpg", 925, 80);
		if (ActorHasInventory("ClothGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenRealizedCloth.jpg", 925, 80);
	}

	// Lauren chair cuffed looking forwards and up
	// facial expression
	if (C101_KinbakuClub_Lauren_CurrentStage == 460 || C101_KinbakuClub_Lauren_CurrentStage == 470) {
		if (ActorGetValue(ActorLove) >= 5 && (ActorGetValue(ActorLove) >= ActorGetValue(ActorSubmission))) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenLike.jpg", 870, 70);
		if (ActorGetValue(ActorSubmission) >= 5 && (ActorGetValue(ActorSubmission) > ActorGetValue(ActorLove))) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenSub.jpg", 870, 70);
		if (C101_KinbakuClub_Lauren_OrgasmDone) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenAshamed.jpg", 870, 70);
	}
	// gag
	if (C101_KinbakuClub_Lauren_CurrentStage == 460 || C101_KinbakuClub_Lauren_CurrentStage == 470 || C101_KinbakuClub_Lauren_CurrentStage == 900) {
		if (ActorHasInventory("BallGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenHelplessBall.png", 880, 80);
		if (ActorHasInventory("TapeGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenHelplessTape.png", 895, 160);
		if (ActorHasInventory("ClothGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenHelplessCloth.png", 875, 150);
	}
	if (C101_KinbakuClub_Lauren_CurrentStage == 490 || C101_KinbakuClub_Lauren_CurrentStage == 500) {
		if (PlayerHasLockedInventory("ClothGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/PlayerChairGagged.jpg", 850, 130);
	}

	// While Lauren gets intimate with the player
	if (C101_KinbakuClub_Lauren_CurrentStage == 740) {
		if (C101_KinbakuClub_Lauren_Intimacy >= 1) OverridenIntroImage = "LaurenIntimate1.jpg";
		if (C101_KinbakuClub_Lauren_Intimacy == 6) OverridenIntroImage = "LaurenIntimatePanties.jpg";
		if (C101_KinbakuClub_Lauren_Intimacy >= 7) OverridenIntroImage = "LaurenIntimate6.jpg";
		if (C101_KinbakuClub_Lauren_Intimacy == 10) OverridenIntroImage = "LaurenIntimateO.jpg";
		if (C101_KinbakuClub_Lauren_Intimacy == 11) OverridenIntroImage = "LaurenIntimateO2.jpg";
		if (C101_KinbakuClub_Lauren_Intimacy == 12) OverridenIntroImage = "LaurenContinue2.jpg";
		if (C101_KinbakuClub_Lauren_Intimacy == 13) OverridenIntroImage = "LaurenIntimateO.jpg";
		if (C101_KinbakuClub_Lauren_Intimacy >= 14) OverridenIntroImage = "LaurenIntimateO2.jpg";
	}
	if (C101_KinbakuClub_Lauren_CurrentStage > 740) OverridenIntroImage = "";
}

// Chapter 101 - Lauren Click
function C101_KinbakuClub_Lauren_Click() {	

	// Regular and inventory interactions
	ClickInteraction(C101_KinbakuClub_Lauren_CurrentStage);
	var ClickInv = GetClickedInventory();
	
	// Lauren can be tied up at stage 310
	if (((C101_KinbakuClub_Lauren_CurrentStage == 450) || (C101_KinbakuClub_Lauren_CurrentStage == 460) || (C101_KinbakuClub_Lauren_CurrentStage == 470)) && (ClickInv != "") && (ClickInv != "Player") && !Common_PlayerRestrained) {
		
		ActorApplyRestrain(ClickInv);
		
	}

	C101_KinbakuClub_Lauren_CalcParams()
}

// Chapter 101 - Lauren - Submissive nod when tied.
function C101_KinbakuClub_Lauren_TiedNod() {
	if (!C101_KinbakuClub_Lauren_NodDone) ActorChangeAttitude(0, -1);
	C101_KinbakuClub_Lauren_NodDone = true;
}

// Chapter 101 - Lauren - Recive a blindfold
function C101_KinbakuClub_Lauren_GetBlindfold() {
	C101_KinbakuClub_Lauren_BlindfoldAvailable = false;
	PlayerAddInventory("Blindfold", 1);
}

// Chapter 101 - Lauren - if player is already handcuffed
function C101_KinbakuClub_Lauren_AlreadyCuffed() {
	if (PlayerHasLockedInventory("Cuffs")) {
		OverridenIntroText = GetText("AlreadyCuffed");
		C101_KinbakuClub_Lauren_CurrentStage = 150;
		LeaveIcon = "";
	}
}

// Chapter 101 - Lauren - Player takes cuffs and cuffs themself.
function C101_KinbakuClub_Lauren_PlayerCuffed() {
	CurrentTime = CurrentTime + 30000;
	PlayerLockInventory("Cuffs");
	LeaveIcon = "";
	if (C101_KinbakuClub_Lauren_CurrentStage > 150) {
		C101_KinbakuClub_Lauren_PlayerChairCuffed = true;
		CurrentTime = CurrentTime + 90000;
	}
}

// Chapter 101 - Lauren - A subbie player gets the clip place somewhere kinkier.
function C101_KinbakuClub_Lauren_KinkyClip() {
	if (ActorGetValue(ActorSubmission) < 0) {
	OverridenIntroText = GetText("KinkyClip");
	C101_KinbakuClub_Lauren_CurrentStage = 165;
	}
}

// Chapter 101 - Lauren - Test to work out if player can open the handcuffs.
function C101_KinbakuClub_Lauren_ReleaseTest() {
	CurrentTime = CurrentTime + 60000;
	C101_KinbakuClub_Lauren_Random = Math.floor(Math.random() * 3);
	if (ActorGetValue(ActorSubmission) > 0) C101_KinbakuClub_Lauren_Random++
	if (C101_KinbakuClub_Lauren_Random <= 0) OverridenIntroText = GetText("Fail1");
	if (C101_KinbakuClub_Lauren_Random == 1) OverridenIntroText = GetText("Fail0");
	if (C101_KinbakuClub_Lauren_Random >= 2) {
		PlayerUnlockInventory("Cuffs");
		PlayerAddInventory("Cuffs", 1);
		C101_KinbakuClub_Lauren_CurrentStage = 210;
		if (C101_KinbakuClub_Lauren_attempt == 0) ActorChangeAttitude(1, 1);
	}
	C101_KinbakuClub_Lauren_attempt++;
}

// Chapter 101 - Lauren - Player learns how to escape handcuffs without a key.
function C101_KinbakuClub_Lauren_LearntEscape() {
	LeaveIcon = "Leave";
	C999_Common_Cuffs_CanEscape = true;
	C999_Common_Cuffs_HasShim = true;
	C101_KinbakuClub_Lauren_HasClip = true;
}

// Chapter 101 - Lauren - player finishes securing Lauren her own with handcuffs
function C101_KinbakuClub_Lauren_LaurenCuffed() {
	CurrentTime = CurrentTime + 60000;
	ActorAddInventory("Cuffs");
	C101_KinbakuClub_Lauren_LaurenChairCuffed = true;
}

// Chapter 101 - Lauren - Option to leave Lauren cuffed to chair.
function C101_KinbakuClub_Lauren_Leave() {
	LeaveIcon = "Leave";
}

// Chapter 101 - Lauren - player asks gagged lauren if she gives up
function C101_KinbakuClub_Lauren_GiveUpGagged() {
	if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("MuffledDetermination");
}

// Chapter 101 - Lauren - Player release Lauren form being cuffed to a chair.
function C101_KinbakuClub_Lauren_ReleaseLauren() {
	CurrentTime = CurrentTime + 60000;
	ActorUngag()
	ActorRemoveInventory("Cuffs");
	PlayerAddInventory("Cuffs", 4);
	C101_KinbakuClub_Lauren_CalcParams()
	C101_KinbakuClub_Lauren_LaurenChairCuffed = false;
}

// Chapter 101 - Lauren - No option to leave Lauren cuffed to chair.
function C101_KinbakuClub_Lauren_NoLeave() {
	LeaveIcon = "";
}

// Chapter 101 - Lauren - When player asks Lauren what to do
function C101_KinbakuClub_Lauren_Ask() {
	if (ActorGetValue(ActorLove) < 0) OverridenIntroText = GetText("AskLetGo");
	if (ActorGetValue(ActorLove) >= 5) OverridenIntroText = GetText("AskEnjoy");
	if (ActorGetValue(ActorSubmission) >= 5) OverridenIntroText = GetText("AskBeGentle");
	if (ActorGetValue(ActorSubmission) >= 8) OverridenIntroText = GetText("AskWhatever");
	if (C101_KinbakuClub_Lauren_OrgasmDone) OverridenIntroText = GetText("AskUnsure");
	if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("AskGag");
}

// Chapter 101 - Lauren - When player strokes Lauren's breasts
function C101_KinbakuClub_Lauren_StrokeBreasts() {
	CurrentTime = CurrentTime + 30000;
	if (ActorGetValue(ActorLove) < 10) ActorChangeAttitude(1, 0);
}

// Chapter 101 - Lauren - When player gropes Lauren's Breasts
function C101_KinbakuClub_Lauren_GropeBreasts() {
	CurrentTime = CurrentTime + 30000;
	if (ActorGetValue(ActorLove) >= 5) {
		if (ActorGetValue(ActorLove) < 10 && ActorGetValue(ActorSubmission) < 10) ActorChangeAttitude(1, 1);
		OverridenIntroText = GetText("LikeGrope");
	} else {
		C101_KinbakuClub_Lauren_BullyCount++;
		if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("GropeGag");
		C101_KinbakuClub_Lauren_BullyCheck();
	}
}

// Chapter 101 - Lauren - When player pinches Lauren's nipples
function C101_KinbakuClub_Lauren_PinchNipples() {
	CurrentTime = CurrentTime + 30000;
	if (ActorGetValue(ActorLove) >= 5) {
		if (ActorGetValue(ActorSubmission) < 10) ActorChangeAttitude(0, 1);
		OverridenIntroText = GetText("LikeNipples");
		if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("LikeNipplesGag");
	} else {
		C101_KinbakuClub_Lauren_BullyCount = C101_KinbakuClub_Lauren_BullyCount + 2;
		if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("NipplesGag");
		C101_KinbakuClub_Lauren_BullyCheck();
	}
}

// Chapter 101 - Lauren - When player kisses Lauren
function C101_KinbakuClub_Lauren_Kiss() {
	CurrentTime = CurrentTime + 30000;
	if (ActorGetValue(ActorLove) >= 5) OverridenIntroText = GetText("LikeKiss");
	if (C101_KinbakuClub_Lauren_LaurenGagged && ActorGetValue(ActorLove) < 5) OverridenIntroText = GetText("GagKiss");
	if (C101_KinbakuClub_Lauren_LaurenGagged && ActorGetValue(ActorLove) >= 5) OverridenIntroText = GetText("LikeGagKiss");
	if (C101_KinbakuClub_Lauren_LaurenGagged && ActorGetValue(ActorLove) >= 5 && ActorGetValue(ActorSubmission) >= 8) OverridenIntroText = GetText("LoveSubGagKiss");
	if (C101_KinbakuClub_Lauren_LaurenGagged && ActorGetValue(ActorLove) < 5 && ActorGetValue(ActorSubmission) >= 8) {
		OverridenIntroText = GetText("SubGagKiss");
		C101_KinbakuClub_Lauren_BullyCount++;
		C101_KinbakuClub_Lauren_BullyCheck();
	}
}

// Chapter 101 - Lauren - When player caresses Lauren's bum
function C101_KinbakuClub_Lauren_CaressBum() {
	CurrentTime = CurrentTime + 30000;
	if (ActorGetValue(ActorLove) < 10) ActorChangeAttitude(1, 0);
	if (ActorGetValue(ActorLove) >= 5) OverridenIntroText = GetText("LikeCaress");
}

// Chapter 101 - Lauren - When player slaps Lauren's bum
function C101_KinbakuClub_Lauren_SlapBum() {
	CurrentTime = CurrentTime + 30000;
	if (ActorGetValue(ActorLove) >= 5) {
		if (ActorGetValue(ActorSubmission) < 10) ActorChangeAttitude(0, 1);
		OverridenIntroText = GetText("LikeSlap");
		if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("LikeSlapGag");
	} else {
		ActorChangeAttitude(0, 1);
		C101_KinbakuClub_Lauren_BullyCount++;
		if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("SlapGag");
		C101_KinbakuClub_Lauren_BullyCheck();
	}
}

// Chapter 101 - Lauren -  When player rubs around Lauren's crotch
function C101_KinbakuClub_Lauren_RubCrotch() {
	CurrentTime = CurrentTime + 30000;
	if (ActorGetValue(ActorLove) >= 5 && ActorGetValue(ActorSubmission) >= 5) {
		if (ActorGetValue(ActorLove) < 10 && ActorGetValue(ActorSubmission) < 10) ActorChangeAttitude(1, 1);
		OverridenIntroText = GetText("LikeRub");
		if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("LikeRubGag");
	} else {
		C101_KinbakuClub_Lauren_BullyCount = C101_KinbakuClub_Lauren_BullyCount + 2;
		if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("RubGag");
		C101_KinbakuClub_Lauren_BullyCheck();
	}
}

// Chapter 101 - Lauren - When player masturbates Lauren
function C101_KinbakuClub_Lauren_Masturbate() {
	CurrentTime = CurrentTime + 60000;
	if (ActorGetValue(ActorLove) >= 8 && ActorGetValue(ActorSubmission) >= 8) {
		if (ActorGetValue(ActorLove) < 15 && ActorGetValue(ActorSubmission) < 15) ActorChangeAttitude(1, 1);
		OverridenIntroText = GetText("LikeMasturbate");
		if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("LikeMasturbateGag");
	} else {
		C101_KinbakuClub_Lauren_BullyCount = C101_KinbakuClub_Lauren_BullyCount + 4;
		if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("MasturbateGag");
		C101_KinbakuClub_Lauren_BullyCheck();
	}
	if (C101_KinbakuClub_Lauren_OrgasmDone) OverridenIntroText = GetText("LaurenOrgasmRep");
	if (C101_KinbakuClub_Lauren_MasturbateCount >= 2 && !C101_KinbakuClub_Lauren_OrgasmDone && C101_KinbakuClub_Lauren_BullyCount < 10) {
		OverridenIntroText = GetText("LaurenOrgasm");
		C101_KinbakuClub_Lauren_OrgasmDone = true;
		if (C101_KinbakuClub_Lauren_LaurenGagged) OverridenIntroText = GetText("LaurenOrgasmGag");
		ActorAddOrgasm();
		ActorChangeAttitude(0, 1);
	}
	C101_KinbakuClub_Lauren_MasturbateCount++
}

// Chapter 101 - Lauren - check to see whether Jenna and Cassidy intervene and reprimand the player
function C101_KinbakuClub_Lauren_BullyCheck() {
	if (C101_KinbakuClub_Lauren_BullyCount >= 10) {
		ActorChangeAttitude(-10, 5);
		OverridenIntroText = GetText("Bullied");
		C101_KinbakuClub_Lauren_CurrentStage = 900;
	}
}

// Chapter 101 - Lauren - player asks if Lauren has had enough
function C101_KinbakuClub_Lauren_Enough() {
	if (ActorGetValue(ActorLove) >= 5 || ActorGetValue(ActorSubmission) >= 5) OverridenIntroText = GetText("ShakesHead");
}

// Chapter 101 - Lauren - player removes laurens gag
function C101_KinbakuClub_Lauren_UngagLauren() {
	CurrentTime = CurrentTime + 30000;
	ActorUngag()
	C101_KinbakuClub_Lauren_CalcParams()
	C101_KinbakuClub_Lauren_LaurenGagged = false;
}

// Chapter 101 - Lauren - player reaches for a hair clip
function C101_KinbakuClub_Lauren_ReachedClip() {
	CurrentTime = CurrentTime + 30000;
	C101_KinbakuClub_Lauren_HasClip = false;
	C101_KinbakuClub_Lauren_GotClip = true;
}

// Chapter 101 - Lauren - player starts using the clip
function C101_KinbakuClub_Lauren_UseClip() {
	CurrentTime = CurrentTime + 30000;
	C101_KinbakuClub_Lauren_GotClip = false;
	C101_KinbakuClub_Lauren_ItsHard = true;
}

// Chapter 101 - Lauren - player continues using the clip
function C101_KinbakuClub_Lauren_DropClip() {
	CurrentTime = CurrentTime + 30000;
	C101_KinbakuClub_Lauren_ItsHard = false;
}

// Chapter 101 - Lauren - player is gagged by Nicole
function C101_KinbakuClub_Lauren_PlayerClothGagged() {
	CurrentTime = CurrentTime + 30000;
	PlayerLockInventory("ClothGag");
}

// Chapter 101 - Lauren - Player waits while chair cuffed with Lauren
function C101_KinbakuClub_Lauren_Wait() {
	if (C101_KinbakuClub_Lauren_Waited) {
		CurrentTime = (C101_KinbakuClub_JennaIntro_LeaveTime * 60 * 60 * 1000);
	}
	C101_KinbakuClub_Lauren_Waited = true;
	CurrentTime = CurrentTime +120000;
}

// Chapter 101 - Lauren - player asks Lauren if she enjoyed being chair cuffed
function C101_KinbakuClub_Lauren_Enjoyment() {
	if (ActorGetValue(ActorLove) > 5) OverridenIntroText = GetText("LoveIt");
	if (ActorGetValue(ActorSubmission) > 5 && ActorGetValue(ActorSubmission) > ActorGetValue(ActorLove)) OverridenIntroText = GetText("SubIt");
	if (C101_KinbakuClub_Lauren_OrgasmDone) OverridenIntroText = GetText("OrgasmIt");
	LeaveIcon = "Leave";
}

// Chapter 101 - Lauren - player asks Lauren if she would like to do it again
function C101_KinbakuClub_Lauren_Again() {
	if (ActorGetValue(ActorLove) > 5) OverridenIntroText = GetText("LoveAgain");
	if (ActorGetValue(ActorSubmission) > 5 && ActorGetValue(ActorSubmission) > ActorGetValue(ActorLove)) OverridenIntroText = GetText("SubAgain");
	if (C101_KinbakuClub_Lauren_OrgasmDone) OverridenIntroText = GetText("OrgasmAgain");
	LeaveIcon = "Leave";
}


// Chapter 101 - Lauren - Lauren removes the players blindfold
function C101_KinbakuClub_Lauren_RemoveBlindfold() {
	CurrentTime = CurrentTime + 20000;
	PlayerUnlockInventory("Blindfold");
}

// Chapter 101 - Lauren - Lauren comes back
function C101_KinbakuClub_Lauren_LaurenReturn() {
	CurrentTime = CurrentTime + 60000;
	if (C101_KinbakuClub_Lauren_Return >= 4) {
		C101_KinbakuClub_Lauren_CurrentStage = 700;
		OverridenIntroText = GetText("LuarenReturned");
	}
	C101_KinbakuClub_Lauren_Return++
}

// Chapter 101 - Lauren - tries reaching for a hair clip
function C101_KinbakuClub_Lauren_HandsTooHigh() {
	CurrentTime = CurrentTime + 20000;
	C101_KinbakuClub_Lauren_HasClip = false;
	C101_KinbakuClub_Lauren_LocateClip = true;
}

// Chapter 101 - Lauren - checks where hidden hair clips are
function C101_KinbakuClub_Lauren_ClipOptions() {
	C101_KinbakuClub_Lauren_LocateClip = false;
	C101_KinbakuClub_Lauren_SafeClips = true;
	C101_KinbakuClub_Lauren_RiskyClip = true;
}

// Chapter 101 - Lauren - player front flips to reach hair clips on panties
function C101_KinbakuClub_Lauren_ReachingPanties() {
	C101_KinbakuClub_Lauren_CurrentStage = 640;
	CurrentTime = CurrentTime + 10000;
	C101_KinbakuClub_Lauren_LaurenReturn()
}

// Chapter 101 - Lauren - Player unlocks the handcuffs with a hair clip
function C101_KinbakuClub_Lauren_Escape() {
	C101_KinbakuClub_Lauren_RiskyClip = false;
	C101_KinbakuClub_Lauren_PlayerStrappado = false;
	CurrentTime = CurrentTime + 30000;
	PlayerUnlockInventory("Cuffs");
	PlayerAddInventory("Cuffs", 1);
}

// Chapter 101 - Lauren - player hides their shame
function C101_KinbakuClub_Lauren_Embarrassed() {
	CurrentTime = CurrentTime + 30000;
	C101_KinbakuClub_Lauren_RiskyClip = false;
}

// Chapter 101 - Lauren - player gets the clip in their hands
function C101_KinbakuClub_Lauren_RetrieveClip() {
	CurrentTime = CurrentTime + 30000;
	C101_KinbakuClub_Lauren_SafeClips = false;
	C101_KinbakuClub_Lauren_RiskyClip = false;
	C101_KinbakuClub_Lauren_UsefulClip = true;
}

// Chapter 101 - Lauren - player gets legcuffs, collar and chain
function C101_KinbakuClub_Lauren_LegCuffs() {
	PlayerLockInventory("Collar");
	CurrentTime = CurrentTime + 60000;
	C101_KinbakuClub_Lauren_PlayerLegCuffs = true;
	if (C101_KinbakuClub_Lauren_CurrentStage == 740) OverridenIntroImage = "LaurenSafety.jpg";
}

// Chapter 101 - Lauren - revenge option if lauren was given and orgsm erlier
function C101_KinbakuClub_Lauren_NodRevenge() {
	if (ActorGetValue(ActorOrgasmCount) >= 1) OverridenIntroText = GetText("LaurenRevengeNod");
}

// Chapter 101 - Lauren - revenge option if lauren was given and orgsm erlier
function C101_KinbakuClub_Lauren_ShakeRevenge() {
	if (C101_KinbakuClub_Lauren_OrgasmDone) {
		OverridenIntroText = GetText("LaurenRevengeShake");
		C101_KinbakuClub_Lauren_CurrentStage = 730;
		ActorChangeAttitude(-1, 0);
	}
}

// Chapter 101 - Lauren - player is released from the strappado
function C101_KinbakuClub_Lauren_StrappadoRelease() {
	PlayerReleaseBondage()
	if (!C999_Common_Collar_LockedOn) PlayerUnlockInventory("Collar");
	C101_KinbakuClub_Lauren_PlayerStrappado = false;
}

// Chapter 101 - Lauren - player is released from the strappado
function C101_KinbakuClub_Lauren_CanLeave() {
	LeaveIcon = "Leave";
}

// Chapter 101 - Lauren - test whether player already has leg cuffs
function C101_KinbakuClub_Lauren_ExtraRestraint() {
	if (!C101_KinbakuClub_Lauren_PlayerLegCuffs) {
		C101_KinbakuClub_Lauren_CurrentStage = 735;
	}
}

// Chapter 101 - Lauren - test whether player already has leg cuffs
function C101_KinbakuClub_Lauren_LaurenIntimate() {
	CurrentTime = CurrentTime + 30000;
	if (C101_KinbakuClub_Lauren_Intimacy == 1) OverridenIntroText = GetText("Intimate1");
	if (C101_KinbakuClub_Lauren_Intimacy == 2) OverridenIntroText = GetText("Intimate2");
	if (C101_KinbakuClub_Lauren_Intimacy == 3) OverridenIntroText = GetText("Intimate3");
	if (C101_KinbakuClub_Lauren_Intimacy == 4) OverridenIntroText = GetText("Intimate4");
	if (C101_KinbakuClub_Lauren_Intimacy == 5) {
		OverridenIntroText = GetText("Intimate5");
		C101_KinbakuClub_Lauren_CurrentStage = 745;
	}
	if (C101_KinbakuClub_Lauren_Intimacy == 6) OverridenIntroText = GetText("Intimate6");
	if (C101_KinbakuClub_Lauren_Intimacy == 7) OverridenIntroText = GetText("Intimate7");
	if (C101_KinbakuClub_Lauren_Intimacy == 8) OverridenIntroText = GetText("Intimate8");
	if (C101_KinbakuClub_Lauren_Intimacy == 9) {
		if (ActorGetValue(ActorLove) < 5 && !C101_KinbakuClub_Lauren_OrgasmDone) {
			OverridenIntroText = GetText("IntimateDenial");
			C101_KinbakuClub_Lauren_CurrentStage = 750;
		} else {
			OverridenIntroText = GetText("IntimateOrgasm");
			ActorAddOrgasm();
		}
	}
	if (C101_KinbakuClub_Lauren_Intimacy == 10) {
		if (ActorGetValue(ActorLove) > 7 || ActorGetValue(ActorSubmission) < 0 || C101_KinbakuClub_Lauren_OrgasmDone) {
			OverridenIntroText = GetText("IntimateProlong");
			C101_KinbakuClub_Lauren_StrappadoOrgasm = true;
		} else {
			OverridenIntroText = GetText("IntimateSubside");
			C101_KinbakuClub_Lauren_CurrentStage = 746;
			C101_KinbakuClub_Lauren_Intimacy++
		}
	}
	if (C101_KinbakuClub_Lauren_Intimacy == 11) {
		OverridenIntroText = GetText("IntimateSubside");
			C101_KinbakuClub_Lauren_CurrentStage = 746;
	}
	if (C101_KinbakuClub_Lauren_Intimacy == 12) OverridenIntroText = GetText("Intimate12");
	if (C101_KinbakuClub_Lauren_Intimacy == 13) {
		OverridenIntroText = GetText("Intimate13");
		ActorAddOrgasm();
		C101_KinbakuClub_Lauren_StrappadoOrgasm = true;
	}
	if (C101_KinbakuClub_Lauren_Intimacy >= 14) {
		OverridenIntroText = GetText("Intimate14");
		C101_KinbakuClub_Lauren_CurrentStage = 750;
	}
	C101_KinbakuClub_Lauren_Intimacy++;
}

// Chapter 101 - Lauren - Player nods head when lauren asks during strappado
function C101_KinbakuClub_Lauren_Nod() {
	if (ActorGetValue(ActorLove) < 0) {
		OverridenIntroText = GetText("DislikeNod");
		C101_KinbakuClub_Lauren_CurrentStage = 750;
	}
	if (C101_KinbakuClub_Lauren_OrgasmDone) {
		OverridenIntroText = GetText("RevengeNod2");
		C101_KinbakuClub_Lauren_CurrentStage = 740;
	}
}

// Chapter 101 - Lauren - Player shakes head when lauren asks during strappado
function C101_KinbakuClub_Lauren_Shake() {
	if (ActorGetValue(ActorSubmission) < 0) {
		OverridenIntroText = GetText("SubShake");
		C101_KinbakuClub_Lauren_CurrentStage = 740;
	}
	if (ActorGetValue(ActorLove) > 5) {
		OverridenIntroText = GetText("LikeShake");
		C101_KinbakuClub_Lauren_CurrentStage = 740;
	}
	if (ActorGetValue(ActorOrgasmCount) >= 1) {
		OverridenIntroText = GetText("RevengeShake2");
		C101_KinbakuClub_Lauren_CurrentStage = 740;
	}
}

// Chapter 101 - Lauren - Player nods head lauren asks again during strappado
function C101_KinbakuClub_Lauren_Nod2() {
	if ((ActorGetValue(ActorLove) < 5 || ActorGetValue(ActorSubmission) > 0) && !C101_KinbakuClub_Lauren_OrgasmDone) {
		OverridenIntroText = GetText("AnalRefuse");
		C101_KinbakuClub_Lauren_CurrentStage = 750;
	}
}

// Chapter 101 - Lauren - test whether player already has leg cuffs
function C101_KinbakuClub_Lauren_PlayerFree() {
	PlayerUnlockAllInventory();
}

// Chapter 101 - Lauren - after orgasm player tries breaking cuffs
function C101_KinbakuClub_Lauren_PostOBreak() {
	if (C101_KinbakuClub_Lauren_StrappadoOrgasm) OverridenIntroText = GetText("OBreak");
}

// Chapter 101 - Lauren - after orgasm player tries using hair clip
function C101_KinbakuClub_Lauren_PostOClip() {
	if (C101_KinbakuClub_Lauren_StrappadoOrgasm) OverridenIntroText = GetText("OClip");
}

// Chapter 101 - Lauren - after orgasm player tries calling for help
function C101_KinbakuClub_Lauren_PostOCall() {
	if (C101_KinbakuClub_Lauren_StrappadoOrgasm) OverridenIntroText = GetText("OCall");
}

// Chapter 101 - Lauren - Jenna takes over
function C101_KinbakuClub_Lauren_JennaFurious() {
	ActorLoad("Jenna");
	ActorChangeAttitude(-20, 0);
}

// Chapter 101 - Lauren - Jenna takes over
function C101_KinbakuClub_Lauren_Jenna() {
	ActorLoad("Jenna");
	ActorChangeAttitude(-10, 0);
}

// Chapter 101 - Lauren - goes to discipline outro
function C101_KinbakuClub_Lauren_Discipline() {
	SetScene(CurrentChapter, "Discipline");
}