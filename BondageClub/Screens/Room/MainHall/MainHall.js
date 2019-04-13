"use strict";
var MainHallBackground = "MainHall";
var MainHallStartEventTimer = null;
var MainHallNextEventTimer = null;
var MainHallMaid = null;
var MainHallIsMaid = false;
var MainHallIsHeadMaid = false;

// Returns TRUE if a dialog option is available
function MainHallCanTrickMaid() { return (ManagementIsClubSlave() && SarahUnlockQuest) }

// Main hall loading
function MainHallLoad() {
	MainHallBackground = "MainHall";
	MainHallStartEventTimer = null;
	MainHallNextEventTimer = null;
	MainHallMaid = CharacterLoadNPC("NPC_MainHall_Maid");
	MainHallIsMaid = LogQuery("JoinedSorority", "Maid");
	MainHallIsHeadMaid = LogQuery("LeadSorority", "Maid");
	CommonReadCSV("NoArravVar", "Room", "Management", "Dialog_NPC_Management_RandomGirl");
	CommonReadCSV("NoArravVar", "Room", "KidnapLeague", "Dialog_NPC_KidnapLeague_RandomKidnapper");
	CommonReadCSV("NoArravVar", "Room", "Private", "Dialog_NPC_Private_Custom");
}

// Run the main hall screen
function MainHallRun() {

	// Draws the character and main hall buttons
	DrawCharacter(Player, 750, 0, 1);
	
	// Char, Dressing & Exit
	DrawButton(1645, 25, 90, 90, "", "White", "Icons/Character.png");
	if (!LogQuery("BlockChange", "Rule")) DrawButton(1765, 25, 90, 90, "", "White", "Icons/Dress.png");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");

	// The options below are only available if the player can move
	if (Player.CanWalk()) {

		// Chat, Shop & Private Room
		DrawButton(1645, 145, 90, 90, "", "White", "Icons/Chat.png");
		DrawButton(1765, 145, 90, 90, "", "White", "Icons/Shop.png");
		DrawButton(1885, 145, 90, 90, "", "White", "Icons/Private.png");

		// Introduction, Maid & Management
		DrawButton(1645, 265, 90, 90, "", "White", "Icons/Introduction.png");
		DrawButton(1765, 265, 90, 90, "", "White", "Icons/Maid.png");
		DrawButton(1885, 265, 90, 90, "", "White", "Icons/Management.png");

		// Kidnap League, Dojo, Explore/Sarah
		DrawButton(1645, 385, 90, 90, "", "White", "Icons/Kidnap.png");
		DrawButton(1765, 385, 90, 90, "", "White", "Icons/Dojo.png");
		DrawButton(1885, 385, 90, 90, "", "White", "Icons/Explore.png");

	}

	// Draws the custom content rooms
	if (Player.CanWalk()) DrawButton(25, 25, 450, 65, TextGet("Gambling"), "White");
	if (Player.CanWalk()) DrawButton(25, 115, 450, 65, TextGet("Prison"), "White");
	if (Player.CanWalk()) DrawButton(25, 205, 450, 65, TextGet("Photographic"), "White");
	if (Player.CanWalk()) DrawButton(25, 295, 450, 65, TextGet("Stable"), "White");
	if (Player.CanWalk()) DrawButton(25, 385, 450, 65, TextGet("Nursery"), "White");
	if (Player.CanWalk()) DrawButton(25, 475, 450, 65, TextGet("SlaveMarket"), "White");
	if (Player.CanWalk() && ((ReputationGet("Kidnap") > 0) || ManagementIsClubSlave())) DrawButton(25, 565, 450, 65, TextGet("RandomKidnap"), "White");

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
	if ((Math.random() > 0.8) && ManagementIsClubSlave()) ManagementClubSlaveRandomIntro();
	else if ((Math.random() > 0.95) && (KidnapLeagueRandomKidnapperTimer < CommonTime()) && (ReputationGet("Kidnap") > 0) && (CheatFactor("BlockRandomKidnap", 0) == 1)) KidnapLeagueRandomIntro();
	else if ((KidnapLeagueBountyLocation == RoomName) && (KidnapLeagueBounty != null) && (KidnapLeagueBountyVictory == null) && Player.CanInteract() && (ReputationGet("Kidnap") > 0)) KidnapLeagueBountyStart();
	else CommonSetScreen("Room", RoomName);
}

// When the user clicks in the main hall screen
function MainHallClick() {

	// Character, Dressing & Exit
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 25) && (MouseY < 115)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 25) && (MouseY < 115) && !LogQuery("BlockChange", "Rule")) CommonSetScreen("Character", "Appearance");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) window.location = window.location;

	// The options below are only available if the player can move
	if (Player.CanWalk()) {

		// Chat, Shop & Private Room
		if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 145) && (MouseY < 235)) CommonSetScreen("Online", "ChatSearch");
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 145) && (MouseY < 235)) MainHallWalk("Shop");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) MainHallWalk("Private");

		// Introduction, Maid & Management
		if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 265) && (MouseY < 355)) MainHallWalk("Introduction");
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 265) && (MouseY < 355)) MainHallWalk("MaidQuarters");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355)) MainHallWalk("Management");

		// Kidnap League, Dojo, Explore/Sarah
		if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 385) && (MouseY < 475)) MainHallWalk("KidnapLeague");
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 385) && (MouseY < 475)) MainHallWalk("Shibari");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475)) MainHallWalk("Sarah");

	}

	// Custom content rooms
	if ((MouseX >= 25) && (MouseX < 475) && (MouseY >= 25) && (MouseY < 90) && Player.CanWalk()) MainHallWalk("Gambling");
	if ((MouseX >= 25) && (MouseX < 475) && (MouseY >= 115) && (MouseY < 180) && Player.CanWalk()) MainHallWalk("Prison");
	if ((MouseX >= 25) && (MouseX < 475) && (MouseY >= 205) && (MouseY < 270) && Player.CanWalk()) MainHallWalk("Photographic");
	if ((MouseX >= 25) && (MouseX < 475) && (MouseY >= 295) && (MouseY < 360) && Player.CanWalk()) MainHallWalk("Stable");
	if ((MouseX >= 25) && (MouseX < 475) && (MouseY >= 385) && (MouseY < 450) && Player.CanWalk()) MainHallWalk("Nursery");
	if ((MouseX >= 25) && (MouseX < 475) && (MouseY >= 475) && (MouseY < 540) && Player.CanWalk()) MainHallWalk("SlaveMarket");
	if ((MouseX >= 25) && (MouseX < 475) && (MouseY >= 565) && (MouseY < 630) && Player.CanWalk() && ((ReputationGet("Kidnap") > 0) || ManagementIsClubSlave())) { if (ManagementIsClubSlave()) ManagementClubSlaveRandomIntro(); else KidnapLeagueRandomIntro(); }

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