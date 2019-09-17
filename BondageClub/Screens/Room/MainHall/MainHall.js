"use strict";
var MainHallBackground = "MainHall";
var MainHallStartEventTimer = null;
var MainHallNextEventTimer = null;
var MainHallMaid = null;
var MainHallIsMaid = false;
var MainHallIsHeadMaid = false;
var MainHallHasOwnerLock = false;

// Returns TRUE if a dialog option is available
function MainHallCanTrickMaid() { return (ManagementIsClubSlave() && SarahUnlockQuest) }

// Main hall loading
function MainHallLoad() {
	
	// Loads the variables and dialog
	CharacterSetActivePose(Player, null);
	MainHallBackground = "MainHall";
	MainHallStartEventTimer = null;
	MainHallNextEventTimer = null;
	MainHallMaid = CharacterLoadNPC("NPC_MainHall_Maid");
	MainHallIsMaid = LogQuery("JoinedSorority", "Maid");
	MainHallIsHeadMaid = LogQuery("LeadSorority", "Maid");
	MainHallHasOwnerLock = InventoryCharacterHasOwnerOnlyRestraint(Player);
	CommonReadCSV("NoArravVar", "Room", "Management", "Dialog_NPC_Management_RandomGirl");
	CommonReadCSV("NoArravVar", "Room", "KidnapLeague", "Dialog_NPC_KidnapLeague_RandomKidnapper");
	CommonReadCSV("NoArravVar", "Room", "Private", "Dialog_NPC_Private_Custom");

}

// Run the main hall screen
function MainHallRun() {

	// If the player is dressed up while being a club slave, the maid intercepts her
	if ((CurrentCharacter == null) && ManagementIsClubSlave() && LogQuery("BlockChange", "Rule") && !Player.IsNaked() && (MainHallMaid.Dialog != null) && (MainHallMaid.Dialog.length > 0)) {
		MainHallMaid.Stage = "50";
		MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "ClubSlaveMustBeNaked");
		CharacterRelease(MainHallMaid);
		CharacterSetCurrent(MainHallMaid);
		MainHallStartEventTimer = null;
		MainHallNextEventTimer = null;
		return;
	}

	// If the player is a Mistress but her Dominant reputation has fallen
	if ((CurrentCharacter == null) && LogQuery("ClubMistress", "Management") && (ReputationGet("Dominant") < 50) && Player.CanTalk() && (MainHallMaid.Dialog != null) && (MainHallMaid.Dialog.length > 0)) {
		CommonSetScreen("Room", "Management");
		CharacterSetCurrent(MainHallMaid);
		CurrentScreen = "MainHall";
		MainHallMaid.Stage = "60";
		MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "MistressExpulsionIntro");
		return;
	}

	// Draws the character and main hall buttons
	DrawCharacter(Player, 750, 0, 1);
	
	// Char, Dressing, Exit & Chat
	DrawButton(1645, 25, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if (Player.CanChange()) DrawButton(1765, 25, 90, 90, "", "White", "Icons/Dress.png", TextGet("Appearance"));
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1645, 145, 90, 90, "", "White", "Icons/Chat.png", TextGet("ChatRooms"));

	// The options below are only available if the player can move
	if (Player.CanWalk()) {

		// Shop & Private Room
		DrawButton(1765, 145, 90, 90, "", "White", "Icons/Shop.png", TextGet("Shop"));
		if (!LogQuery("LockOutOfPrivateRoom", "Rule")) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Private.png", TextGet("PrivateRoom"));

		// Introduction, Maid & Management
		DrawButton(1645, 265, 90, 90, "", "White", "Icons/Introduction.png", TextGet("IntroductionClass"));
		DrawButton(1765, 265, 90, 90, "", "White", "Icons/Maid.png", TextGet("MaidQuarters"));
		DrawButton(1885, 265, 90, 90, "", "White", "Icons/Management.png", TextGet("ClubManagement"));

		// Kidnap League, Dojo, Explore/Sarah
		DrawButton(1645, 385, 90, 90, "", "White", "Icons/Kidnap.png", TextGet("KidnapLeague"));
		DrawButton(1765, 385, 90, 90, "", "White", "Icons/Dojo.png", TextGet("ShibariDojo"));
		if (SarahRoomAvailable) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Explore.png", TextGet(SarahRoomLabel()));

		// Cell, Slave Market & Look for trouble
		DrawButton(1645, 505, 90, 90, "", "White", "Icons/Question.png", TextGet("LookForTrouble"));
		DrawButton(1765, 505, 90, 90, "", "White", "Icons/Gavel.png", TextGet("SlaveMarket"));
		DrawButton(1885, 505, 90, 90, "", "White", "Icons/Cell.png", TextGet("Cell"));

		// Asylum
		DrawButton(1885, 625, 90, 90, "", "White", "Icons/Asylum.png", TextGet("Asylum"));

		// Draws the custom content rooms - Gambling, Prison & Photographic
		DrawButton(265, 25, 90, 90, "", "White", "Icons/Camera.png", TextGet("Photographic"));
		DrawButton(145, 25, 90, 90, "", "White", "Icons/Cage.png", TextGet("Prison"));
		DrawButton(25, 25, 90, 90, "", "White", "Icons/Random.png", TextGet("Gambling"));

		// Stable, Magic-Theater & Nursery
		DrawButton(265, 145, 90, 90, "", "White", "Icons/Diaper.png", TextGet("Nursery"));
		DrawButton(145, 145, 90, 90, "", "White", "Icons/Magic.png", TextGet("Magic"));
		DrawButton(25, 145, 90, 90, "", "White", "Icons/Horse.png", TextGet("Stable"));

	}

	// Check if there's a new maid rescue event to trigger
	if ((!Player.CanInteract() || !Player.CanWalk() || !Player.CanTalk())) {
		if (MainHallNextEventTimer == null) {
			MainHallStartEventTimer = CommonTime();
			MainHallNextEventTimer = CommonTime() + 40000 + Math.floor(Math.random() * 40000);
		}
	} else {
		MainHallStartEventTimer = null;
		MainHallNextEventTimer = null;
	}
	
	// If we must send a maid to rescue the player
	if ((MainHallNextEventTimer != null) && (CommonTime() >= MainHallNextEventTimer)) {
		MainHallMaid.Stage = "0";
		CharacterRelease(MainHallMaid);
		CharacterSetCurrent(MainHallMaid);
		MainHallStartEventTimer = null;
		MainHallNextEventTimer = null;
	}
	
	// If we must show a progress bar for the rescue maid.  If not, we show the number of online players
	if ((!Player.CanInteract() || !Player.CanWalk() || !Player.CanTalk()) && (MainHallStartEventTimer != null) && (MainHallNextEventTimer != null)) {
		DrawText(TextGet("RescueIsComing"), 1750, 925, "White", "Black");
		DrawProgressBar(1525, 955, 450, 35, (1 - ((MainHallNextEventTimer - CommonTime()) / (MainHallNextEventTimer - MainHallStartEventTimer))) * 100);
	} else DrawText(TextGet("OnlinePlayers") + " " + CurrentOnlinePlayers.toString(), 1750, 960, "White", "Black");

}

// When the player walks to another room, she can be attacked by a random kidnapper
function MainHallWalk(RoomName) {
	if ((Math.random() > 0.85) && ManagementIsClubSlave()) ManagementClubSlaveRandomIntro();
	else if ((Math.random() > 0.96) && (KidnapLeagueRandomKidnapperTimer < CommonTime()) && (ReputationGet("Kidnap") > 0) && (CheatFactor("BlockRandomKidnap", 0) == 1)) KidnapLeagueRandomIntro();
	else if ((KidnapLeagueBountyLocation == RoomName) && (KidnapLeagueBounty != null) && (KidnapLeagueBountyVictory == null) && Player.CanInteract() && (ReputationGet("Kidnap") > 0)) KidnapLeagueBountyStart();
	else if (Math.random() > 0.96) ManagementFindClubSlaveRandomIntro();
	else CommonSetScreen("Room", RoomName);
}

// When the user clicks in the main hall screen
function MainHallClick() {

	// Character, Dressing, Exit & Chat
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 25) && (MouseY < 115)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 25) && (MouseY < 115) && Player.CanChange()) CharacterAppearanceLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) window.location = window.location;
	if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 145) && (MouseY < 235)) {
		ChatRoomSpace = "";
		ChatSearchBackground = "IntroductionDark";
		ChatSearchLeaveRoom = "MainHall";
		ChatCreateBackgroundList = ["Introduction", "KidnapLeague", "MaidQuarters", "MainHall", "Management", "Private", "Shibari", "Bedroom", "HorseStable", "Nursery", "PrisonHall", "BDSMRoomBlue", "BDSMRoomPurple", "BDSMRoomRed", "Gardens", "IndoorPool", "OutdoorPool", "MaidCafe", "PublicBath", "ParkDay", "ParkNight", "ChillRoom", "Boudoir", "BondageBedChamber"];
		CommonSetScreen("Online", "ChatSearch");
	}

	// The options below are only available if the player can move
	if (Player.CanWalk()) {

		// Chat, Shop & Private Room
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 145) && (MouseY < 235)) MainHallWalk("Shop");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235) && !LogQuery("LockOutOfPrivateRoom", "Rule")) MainHallWalk("Private");

		// Introduction, Maid & Management
		if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 265) && (MouseY < 355)) MainHallWalk("Introduction");
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 265) && (MouseY < 355)) MainHallWalk("MaidQuarters");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355)) MainHallWalk("Management");

		// Kidnap League, Dojo & Explore/Sarah
		if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 385) && (MouseY < 475)) MainHallWalk("KidnapLeague");
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 385) && (MouseY < 475)) MainHallWalk("Shibari");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && SarahRoomAvailable) MainHallWalk("Sarah");

		// Cell, Slave Market & Look for trouble
		if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 505) && (MouseY < 595)) {
			if (ManagementIsClubSlave() && (Math.random() >= 0.1)) ManagementClubSlaveRandomIntro();
			else if ((ReputationGet("Kidnap") > 0) && (Math.random() >= 0.5) && !ManagementIsClubSlave()) KidnapLeagueRandomIntro();
			else ManagementFindClubSlaveRandomIntro();
		}
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 505) && (MouseY < 595)) MainHallWalk("SlaveMarket");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 505) && (MouseY < 595)) MainHallWalk("Cell");

		// Asylum
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 625) && (MouseY < 715)) MainHallWalk("AsylumEntrance");
		
		// Custom content rooms - Gambling, Prison & Photographic
		if ((MouseX >=   25) && (MouseX <  115) && (MouseY >=  25) && (MouseY < 115)) MainHallWalk("Gambling");
		if ((MouseX >=  145) && (MouseX <  235) && (MouseY >=  25) && (MouseY < 115)) MainHallWalk("Prison");
		if ((MouseX >=  265) && (MouseX <  355) && (MouseY >=  25) && (MouseY < 115)) MainHallWalk("Photographic");

		// Stable, Magic-Theater & Nursery
		if ((MouseX >=   25) && (MouseX <  115) && (MouseY >= 145) && (MouseY < 235)) MainHallWalk("Stable");
		if ((MouseX >=  145) && (MouseX <  235) && (MouseY >= 145) && (MouseY < 235)) MainHallWalk("Magic");
		if ((MouseX >=  265) && (MouseX <  355) && (MouseY >= 145) && (MouseY < 235)) MainHallWalk("Nursery");

	}

}

// The maid can release the player
function MainHallMaidReleasePlayer() {
	if (MainHallMaid.CanInteract()) {
		for(var D = 0; D < MainHallMaid.Dialog.length; D++)
			if ((MainHallMaid.Dialog[D].Stage == "0") && (MainHallMaid.Dialog[D].Option == null))
				MainHallMaid.Dialog[D].Result = DialogFind(MainHallMaid, "AlreadyReleased");
		CharacterRelease(Player);
		MainHallMaid.Stage = "10";
	} else MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "CannotRelease");
}

// If the maid is angry, she might gag or tie up the player
function MainHallMaidAngry() {
	if ((ReputationGet("Dominant") < 30) && !MainHallIsHeadMaid) {
		for(var D = 0; D < MainHallMaid.Dialog.length; D++)
			if ((MainHallMaid.Dialog[D].Stage == "PlayerGagged") && (MainHallMaid.Dialog[D].Option == null))
				MainHallMaid.Dialog[D].Result = DialogFind(MainHallMaid, "LearnedLesson");
		ReputationProgress("Dominant", 1);
		InventoryWearRandom(Player, "ItemMouth");
		if (Player.CanInteract()) {
			InventoryWear(Player, "LeatherArmbinder", "ItemArms");
			MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "TeachLesson");
		}		
	} else MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "Cower");
}

// The maid can be tricked to release Sarah
function MainHallFreeSarah() {
	ReputationProgress("Dominant", -4);
	SarahUnlock();
	DialogLeave();
}

// When the maid unlocks the player from an owner, she get forced naked for an hour and loses reputation
function MainHallMaidShamePlayer() {
	CharacterRelease(Player);
	CharacterNaked(Player);
	MainHallHasOwnerLock = false;
	LogAdd("BlockChange", "Rule", CurrentTime + 3600000);
	if (ReputationGet("Dominant") > 10) ReputationProgress("Dominant", -10);
	if (ReputationGet("Dominant") < -10) ReputationProgress("Dominant", 10);
}

// When the maid catches the club slave player with clothes, she strips her and starts the timer back
function MainHallResetClubSlave() {
	CharacterNaked(Player);
	LogAdd("ClubSlave", "Management", CurrentTime + 3600000);
	LogAdd("BlockChange", "Rule", CurrentTime + 3600000);
}

// The maid can lead the player to the club management to be expelled
function MainHallMistressExpulsion() {
	CommonSetScreen("Room", "Management");
	ManagementMistress.Stage = "500";
	ManagementMistress.CurrentDialog = DialogFind(MainHallMaid, "MistressExpulsion");
	CharacterSetCurrent(ManagementMistress);
}

// The maid can introduce the game to the player
function MainHallMaidIntroduction() {
	if (!LogQuery("IntroductionDone", "MainHall") && Player.CanTalk()) {
		MainHallMaid.Stage = "1000";
		MainHallMaid.CurrentDialog = DialogFind(Player, "IntroductionMaidGreetings");
		CharacterSetCurrent(MainHallMaid);
		MainHallMaid.AllowItem = false;
	}
}

// Flag the introduction as done
function MainHallMaidIntroductionDone() {
	LogAdd("IntroductionDone", "MainHall");
}