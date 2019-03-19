"use strict";
var MainHallBackground = "MainHall";
var MainHallStartEventTimer = null;
var MainHallNextEventTimer = null;
var MainHallMaid = null;
var MainHallIsMaid = false;
var MainHallIsHeadMaid = false;

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
	DrawButton(1525, 25, 90, 90, "", "White", "Icons/Character.png");
	if (!LogQuery("BlockChange", "Rule")) DrawButton(1645, 25, 90, 90, "", "White", "Icons/Dress.png");
	if (Player.CanWalk()) DrawButton(1765, 25, 90, 90, "", "White", "Icons/Shop.png");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	if (Player.CanWalk()) DrawButton(1525, 145, 450, 65, TextGet("IntroductionClass"), "White");
	if (Player.CanWalk()) DrawButton(1525, 240, 450, 65, TextGet("MaidQuarters"), "White");
	if (Player.CanWalk()) DrawButton(1525, 335, 450, 65, TextGet("ShibariDojo"), "White");
	if (Player.CanWalk()) DrawButton(1525, 430, 450, 65, TextGet("KidnapLeague"), "White");
	if (Player.CanWalk()) DrawButton(1525, 525, 450, 65, TextGet("PrivateRoom"), "White");
	if (Player.CanWalk()) DrawButton(1525, 620, 450, 65, TextGet("ClubManagement"), "White");
	if (Player.CanWalk()) DrawButton(1525, 715, 450, 65, TextGet((SarahStatus == "") ? "ExploreClub" : "SearchSarah"), "White");

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
		
	// Character and main buttons
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1525) && (MouseX < 1615) && (MouseY >= 25) && (MouseY < 115)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 25) && (MouseY < 115) && !LogQuery("BlockChange", "Rule")) CommonSetScreen("Character", "Appearance");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) window.location = window.location;

	// Main game rooms
	if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) MainHallWalk("Shop");
	if ((MouseX >= 1525) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 210) && Player.CanWalk()) MainHallWalk("Introduction"); 
	if ((MouseX >= 1525) && (MouseX < 1975) && (MouseY >= 240) && (MouseY < 305) && Player.CanWalk()) MainHallWalk("MaidQuarters");
	if ((MouseX >= 1525) && (MouseX < 1975) && (MouseY >= 335) && (MouseY < 400) && Player.CanWalk()) MainHallWalk("Shibari");
	if ((MouseX >= 1525) && (MouseX < 1975) && (MouseY >= 430) && (MouseY < 495) && Player.CanWalk()) MainHallWalk("KidnapLeague");
	if ((MouseX >= 1525) && (MouseX < 1975) && (MouseY >= 525) && (MouseY < 590) && Player.CanWalk()) MainHallWalk("Private");
	if ((MouseX >= 1525) && (MouseX < 1975) && (MouseY >= 620) && (MouseY < 685) && Player.CanWalk()) MainHallWalk("Management");
	if ((MouseX >= 1525) && (MouseX < 1975) && (MouseY >= 715) && (MouseY < 780) && Player.CanWalk()) MainHallWalk("Sarah");

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