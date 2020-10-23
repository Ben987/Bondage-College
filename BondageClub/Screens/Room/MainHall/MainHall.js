"use strict";
var MainHallBackground = "MainHall";
var MainHallStartEventTimer = null;
var MainHallNextEventTimer = null;
var MainHallRandomEventOdds = 0; 
var MainHallMaid = null;
var MainHallIsMaid = false;
var MainHallIsHeadMaid = false;
var MainHallHasOwnerLock = false;
var MainHallHasLoverLock = false;
var MainHallHasSlaveCollar = false;
var MainHallTip = 0;
var MainHallMaidWasCalledManually = false;

var MainHallRemoveLockTypes = [
	"CombinationPadlock",
]

/**
 * Checks to see if the player needs help in any way
 * @returns {boolean} - True if player has any restraints or locks, False otherwise
 */
function MainHallPlayerNeedsHelpAndHasNoOwnerOrLoverItem() {
	var needsHelp = false
	
	for (let E = Player.Appearance.length - 1; E >= 0; E--) {
		if (Player.Appearance[E].Asset.IsRestraint) {
			needsHelp = true;
			break;
		}
		
		for (let L = 0; L < MainHallRemoveLockTypes.length; L++) {
			if (((Player.Appearance[E].Property != null) && (Player.Appearance[E].Property.LockedBy == MainHallRemoveLockTypes[L]))) {
				needsHelp = true
				break;
			}
		}
	}
	
	return needsHelp && !MainHallHasOwnerOrLoverItem()
}


// Returns TRUE if the player has maids disabled
/**
 * Checks if the player is helpless (maids disabled) or not.
 * @returns {boolean} - Returns true if the player still has time remaining after asking the maids to stop helping in the maid quarters
 */
function MainHallIsMaidsDisabled() {  var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime ; return (expire > 0)  }

/**
 * Checks for the dialog options to help the player know how much time is left before the maids can help them
 * @returns {boolean} - Returns TRUE if the remaining duration fits within the time range
 */
function MainHallMaidsDisabledMinutesLeft() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire > 0  && expire < 600000)}
function MainHallMaidsDisabledHourLeft() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire >= 600000 && expire < 3600000) }
function MainHallMaidsDisabledDaysLeft1() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire >= 3600000 && expire < 86400000) }
function MainHallMaidsDisabledDaysLeft2() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire >= 86400000 && expire < 172800000) }
function MainHallMaidsDisabledDaysLeft3() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire >= 172800000 && expire < 259200000) }
function MainHallMaidsDisabledDaysLeft4() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire >= 259200000 && expire < 345600000) }
function MainHallMaidsDisabledDaysLeft5() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire >= 345600000 && expire < 432000000) }
function MainHallMaidsDisabledDaysLeft6() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire >= 432000000 && expire < 518400000) }
function MainHallMaidsDisabledDaysLeft7() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire >= 518400000 && expire < 604800000) }
function MainHallMaidsDisabledDaysLeft8() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire >= 3600000) }//604800000) }

/**
 * Checks for the dialog options to help the maid determine which dialog options she can give the player to extend the duration
 
 * @returns {boolean} - Returns TRUE if the remaining duration fits within the time range
 */
function MainHallMaidsDisabledAtLeast30MinutesLeft() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire < 1800000) }
function MainHallMaidsDisabledAtLeast1HourLeft() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire < 3600000) }
function MainHallMaidsDisabledAtLeast12HourLeft() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire < 43200000) }
function MainHallMaidsDisabledAtLeastDaysLeft1() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire < 86400000) }
function MainHallMaidsDisabledAtLeastDaysLeft3() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire < 259200000) }
function MainHallMaidsDisabledAtLeastDaysLeft7() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime; return (expire < 604800000) }
/**
 * Checks if the dialog option to trick the maid is available
 * @returns {boolean} - Returns TRUE if the maid can be tricked
 */
function MainHallCanTrickMaid() { return (ManagementIsClubSlave() && SarahUnlockQuest) }

/**
 * Checks, if the player has an owner or lover lock on her
 * @returns {boolean} - Returns true, if the player has either a lover or owner item on herself, false otherwise
 */
function MainHallHasOwnerOrLoverItem() { return MainHallHasLoverLock || MainHallHasOwnerLock }
function MainHallHasOwnerOrLoverItemAndMaidsNotDisabled() { return MainHallHasOwnerOrLoverItem() && !MainHallIsMaidsDisabled() }
function MainHallHasNoOwnerOrLoverItemAndMaidsNotDisabled() { return !MainHallHasOwnerOrLoverItem() && !MainHallIsMaidsDisabled() }
function MainHallHasOwnerItemAndMaidsNotDisabled() { return MainHallHasOwnerLock && !MainHallIsMaidsDisabled() }
function MainHallHasLoverItemAndMaidsNotDisabled() { return MainHallHasLoverLock && !MainHallIsMaidsDisabled() }
function MainHallHasSlaveCollarAndMaidsNotDisabled() { return MainHallHasSlaveCollar && !MainHallIsMaidsDisabled() }
function MainHallPlayerNeedsHelpAndHasNoOwnerOrLoverItemAndMaidsNotDisabled() { return  MainHallPlayerNeedsHelpAndHasNoOwnerOrLoverItem() && !MainHallIsMaidsDisabled() }




/**
 * Loads the main hall by setting up the NPCs, CSVs and global variables required.
 * @returns {void} - Nothing
 */
function MainHallLoad() {
	
	// Loads the variables and dialog
	ChatSearchSafewordAppearance = null;
	CharacterSetActivePose(Player, null);
	if (ChatSearchPreviousActivePose != null) {
		ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
		ChatSearchPreviousActivePose = null;
	}
	MainHallBackground = "MainHall";
	MainHallStartEventTimer = null;
	MainHallNextEventTimer = null;
	MainHallMaid = CharacterLoadNPC("NPC_MainHall_Maid");
	MainHallIsMaid = LogQuery("JoinedSorority", "Maid");
	MainHallIsHeadMaid = LogQuery("LeadSorority", "Maid");
	MainHallHasOwnerLock = InventoryCharacterHasOwnerOnlyRestraint(Player);
	MainHallHasLoverLock = InventoryCharacterHasLoverOnlyRestraint(Player);
	for (let A = 0; A < Player.Appearance.length; A++)
		if (Player.Appearance[A].Asset.Name == "SlaveCollar")
			if (Player.Appearance[A].Property)
				MainHallHasSlaveCollar = true;
	MainHallTip = Math.floor(Math.random() * 20);
	CommonReadCSV("NoArravVar", "Room", "Management", "Dialog_NPC_Management_RandomGirl");
	CommonReadCSV("NoArravVar", "Room", "KidnapLeague", "Dialog_NPC_KidnapLeague_RandomKidnapper");
	CommonReadCSV("NoArravVar", "Room", "Private", "Dialog_NPC_Private_Custom");
	CommonReadCSV("NoArravVar", "Room", "AsylumEntrance", "Dialog_NPC_AsylumEntrance_KidnapNurse");
	CommonReadCSV("NoArravVar", "Room", "AsylumEntrance", "Dialog_NPC_AsylumEntrance_EscapedPatient");
	CommonReadCSV("NoArravVar", "Room", "Prison", "Dialog_NPC_Prison_Police");
	CommonReadCSV("NoArravVar", "Character", "Relog", "Text_Relog");

}

/**
 * Runs and draws the main hall screen
 * @returns {void} - Nothing
 */
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
	MainCanvas.font = "italic 30px Arial";	
	DrawTextWrap(TextGet("Tip" + MainHallTip), 100, 800, 500, 200, "White");
	MainCanvas.font = "36px Arial";	
	
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

		// Asylum, College & LARP battles
		if (!ManagementIsClubSlave()) DrawButton(1645, 625, 90, 90, "", "White", "Icons/Battle.png", TextGet("LARPBattle"));
		if (!ManagementIsClubSlave()) DrawButton(1765, 625, 90, 90, "", "White", "Icons/College.png", TextGet("College"));
		DrawButton(1885, 625, 90, 90, "", "White", "Icons/Asylum.png", TextGet("Asylum"));

		// Movie Studio (Must be able to change to enter it)
		if (Player.CanChange()) DrawButton(1885, 745, 90, 90, "", "White", "Icons/MovieStudio.png", TextGet("MovieStudio"));
		
		// Draws the custom content rooms - Gambling, Prison & Photographic
		DrawButton(265, 25, 90, 90, "", "White", "Icons/Camera.png", TextGet("Photographic"));
		DrawButton(145, 25, 90, 90, "", "White", "Icons/Cage.png", TextGet("Prison"));
		DrawButton(25, 25, 90, 90, "", "White", "Icons/Random.png", TextGet("Gambling"));

		// Stable, Magic-Theater & Nursery
		DrawButton(265, 145, 90, 90, "", "White", "Icons/Diaper.png", TextGet("Nursery"));
		DrawButton(145, 145, 90, 90, "", "White", "Icons/Magic.png", TextGet("Magic"));
		DrawButton(25, 145, 90, 90, "", "White", "Icons/Horse.png", TextGet("Stable"));

		// Cafe
		DrawButton(25, 265, 90, 90, "", "White", "Icons/Refreshsments.png", TextGet("Cafe"));
	}


	// If we must send a maid to rescue the player
	if ((MainHallNextEventTimer != null) && (CommonTime() >= MainHallNextEventTimer)) {
		MainHallMaid.Stage = "0";
		CharacterRelease(MainHallMaid);
		CharacterSetCurrent(MainHallMaid);
		MainHallStartEventTimer = null;
		MainHallNextEventTimer = null;
		MainHallMaidWasCalledManually = false
	}
	
	// If we must show a progress bar for the rescue maid.  If not, we show the number of online players or a button to request the maid
	if ((MainHallStartEventTimer == null) && (MainHallNextEventTimer == null)) {
		if ( (!Player.GameplaySettings || !Player.GameplaySettings.DisableAutoMaid) && ((!Player.CanInteract() || !Player.CanWalk() || !Player.CanTalk() || Player.IsShackled()))) {
			MainHallStartEventTimer = CommonTime();
			MainHallNextEventTimer = CommonTime() + 40000 + Math.floor(Math.random() * 40000);
		} else {
			DrawText(TextGet("OnlinePlayers") + " " + CurrentOnlinePlayers.toString(), 1650, 960, "White", "Black");
			DrawButton(1885, 900, 90, 90, "", "White", "Icons/ServiceBell.png", TextGet("RequestMaid"));
		}
		
		MainHallMaidWasCalledManually = false
	} else {
		if (!MainHallMaidWasCalledManually && !((!Player.CanInteract() || !Player.CanWalk() || !Player.CanTalk() || Player.IsShackled()))) {
			MainHallStartEventTimer = null
			MainHallNextEventTimer = null
		} else {
			DrawText(TextGet("RescueIsComing"), 1750, 925, "White", "Black");
			DrawProgressBar(1525, 955, 450, 35, (1 - ((MainHallNextEventTimer - CommonTime()) / (MainHallNextEventTimer - MainHallStartEventTimer))) * 100);
		}
	}

}

/**
 * Validates the player's move into a new room. Before entering the requested rooms, the player can be attacked by random kidnappers or intercepted by various NPC types
 * @param {string} RoomName - Name of the room the player is heading to 
 * @returns {void} - Nothing
 */
function MainHallWalk(RoomName) {

	// Each time the player travels from room to room, the odds raises for a random event
	if ((Math.random() * 100 < MainHallRandomEventOdds) || (RoomName == "Trouble")) {

		// Some circumstantial events have better odds of happening (player is club slave or escaped patient)
		MainHallRandomEventOdds = 0;
		var PlayerClubSlave = (ManagementIsClubSlave()) ? (Math.random() * 3) : 0;
		var PlayerEscapedAsylum = ((LogValue("Escaped", "Asylum") >= CurrentTime) && (CheatFactor("BlockRandomKidnap", 0) == 1)) ? (Math.random() * 3) : 0;
		var MeetEscapedPatient = ((ReputationGet("Asylum") > 0) && !Player.IsRestrained() && AsylumEntranceIsWearingNurseClothes()) ? (Math.random() * 2) : 0;
		var MeetKidnapper = ((ReputationGet("Kidnap") > 0) && (CheatFactor("BlockRandomKidnap", 0) == 1)) ? Math.random() : 0;
		var MeetClubSlave = Math.random();
		var MeetPolice = (LogQuery("Joined", "BadGirl")) ? (Math.random() * PrisonWantedPlayer()) : 0;

		// Starts the event with the highest value (picked at random)
		if ((MeetPolice > PlayerClubSlave) && (MeetPolice > PlayerEscapedAsylum) && (MeetPolice > MeetEscapedPatient) && (MeetPolice > MeetKidnapper) && (MeetPolice > MeetClubSlave)) PrisonMeetPoliceIntro("MainHall");
		else if ((PlayerClubSlave > PlayerEscapedAsylum) && (PlayerClubSlave > MeetEscapedPatient) && (PlayerClubSlave > MeetKidnapper) && (PlayerClubSlave > MeetClubSlave)) ManagementClubSlaveRandomIntro();
		else if ((PlayerEscapedAsylum > MeetEscapedPatient) && (PlayerEscapedAsylum > MeetKidnapper) && (PlayerEscapedAsylum > MeetClubSlave)) AsylumEntranceNurseCatchEscapedPlayer();
		else if ((MeetEscapedPatient > MeetKidnapper) && (MeetEscapedPatient > MeetClubSlave)) AsylumEntranceEscapedPatientMeet();
		else if (MeetKidnapper > MeetClubSlave) KidnapLeagueRandomIntro();
		else ManagementFindClubSlaveRandomIntro();

	} else {

		// Each time the player travels, the odds get better for a random event
		MainHallRandomEventOdds = MainHallRandomEventOdds + 2;
		if (ManagementIsClubSlave()) MainHallRandomEventOdds = MainHallRandomEventOdds + 4;
		if ((KidnapLeagueBountyLocation == RoomName) && (KidnapLeagueBounty != null) && (KidnapLeagueBountyVictory == null) && Player.CanInteract() && (ReputationGet("Kidnap") > 0)) KidnapLeagueBountyStart();
		else CommonSetScreen("Room", RoomName);

	}

}

/**
 * Handles clicks in the main hall screen
 * @returns {void} - Nothing
 */
function MainHallClick() {

	// Character, Dressing, Exit & Chat
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 25) && (MouseY < 115)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 25) && (MouseY < 115) && Player.CanChange()) CharacterAppearanceLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) window.location = window.location;
	if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 145) && (MouseY < 235)) ChatRoomStart("", "", "MainHall", "IntroductionDark", BackgroundsTagList);

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
		if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 505) && (MouseY < 595)) MainHallWalk("Trouble");
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 505) && (MouseY < 595)) MainHallWalk("SlaveMarket");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 505) && (MouseY < 595)) MainHallWalk("Cell");

		// Asylum & College
		if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 625) && (MouseY < 715) && !ManagementIsClubSlave()) MainHallWalk("LARP");
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 625) && (MouseY < 715) && !ManagementIsClubSlave()) MainHallWalk("CollegeEntrance");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 625) && (MouseY < 715)) MainHallWalk("AsylumEntrance");

		// Movie Studio (Must be able to change to enter it)
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 745) && (MouseY < 855) && Player.CanChange()) MainHallWalk("MovieStudio");
		
		// Custom content rooms - Gambling, Prison & Photographic
		if ((MouseX >=   25) && (MouseX <  115) && (MouseY >=  25) && (MouseY < 115)) MainHallWalk("Gambling");
		if ((MouseX >=  145) && (MouseX <  235) && (MouseY >=  25) && (MouseY < 115)) MainHallWalk("Prison");
		if ((MouseX >=  265) && (MouseX <  355) && (MouseY >=  25) && (MouseY < 115)) MainHallWalk("Photographic");

		// Stable, Magic-Theater & Nursery
		if ((MouseX >=   25) && (MouseX <  115) && (MouseY >= 145) && (MouseY < 235)) MainHallWalk("Stable");
		if ((MouseX >=  145) && (MouseX <  235) && (MouseY >= 145) && (MouseY < 235)) MainHallWalk("Magic");
		if ((MouseX >=  265) && (MouseX <  355) && (MouseY >= 145) && (MouseY < 235)) MainHallWalk("Nursery");

		// Cafe
		if ((MouseX >=   25) && (MouseX <  115) && (MouseY >= 265) && (MouseY < 355)) MainHallWalk("Cafe");
	}
	
	
	if ((MainHallStartEventTimer == null) && (MainHallNextEventTimer == null)) {
		
		if (MouseIn(1885, 900, 90, 90)) {
			if (MainHallNextEventTimer == null) {
				var vol = 1
				if (Player.AudioSettings && Player.AudioSettings.Volume) {
					vol = Player.AudioSettings.Volume
				}
				AudioPlayInstantSound("Audio/BellSmall.mp3", vol)
				MainHallStartEventTimer = CommonTime();
				MainHallNextEventTimer = CommonTime() + 40000 + Math.floor(Math.random() * 40000);
				MainHallMaidWasCalledManually = true;
			}
		}
	}

}

/**
 * Triggered when the player asks for release, the player is freed from restraints and any combo locks
 * @returns {void} - Nothing
 */
function MainHallMaidReleasePlayer() {
	if (MainHallMaid.CanInteract()) {
		for (let D = 0; D < MainHallMaid.Dialog.length; D++)
			if ((MainHallMaid.Dialog[D].Stage == "0") && (MainHallMaid.Dialog[D].Option == null))
				MainHallMaid.Dialog[D].Result = DialogFind(MainHallMaid, "AlreadyReleased");
		CharacterRelease(Player);
		for (let L = 0; L < MainHallRemoveLockTypes.length; L++) {
			CharacterReleaseFromLock(Player, MainHallRemoveLockTypes[L]);
		}
		// Added to remove maids being disabled
		if (LogQuery("MaidsDisabled", "Maid")) {
			
			LogDelete("MaidsDisabled", "Maid")
		}
		MainHallMaid.Stage = "10";
	} else MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "CannotRelease");
}

/**
 * Triggered when the maid is angry at the player, she might gag or tie her up if the player is not dominant or not a head maid
 * @returns {void} - Nothing
 */
function MainHallMaidAngry() {
	if ((ReputationGet("Dominant") < 30) && !MainHallIsHeadMaid) {
		for (let D = 0; D < MainHallMaid.Dialog.length; D++)
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

/**
 * Triggered when the maid is tricked into releasing Sarah
 * @returns {void} - Nothing
 */
function MainHallFreeSarah() {
	ReputationProgress("Dominant", -4);
	SarahUnlock();
	DialogLeave();
}

/**
 * Triggered when the maid unlocks the player from an owner
 * @returns {void} - Nothing
 */
function MainHallMaidShamePlayer() {
	CharacterRelease(Player);
	MainHallHasOwnerLock = false;
	MainHallMaidPunishmentPlayer();
}

/**
 * Triggered when the maid resets the slave collar to default. The player is punished after.
 * @returns {void} - Nothing
 */
function MainHallMaidChangeCollarPlayer() {
	for (let A = 0; A < Player.Appearance.length; A++)
		if (Player.Appearance[A].Asset.Name == "SlaveCollar") {
			Player.Appearance[A].Property = null;
			Player.Appearance[A].Color = "Default";
		}
	MainHallHasSlaveCollar = false;
	MainHallMaidPunishmentPlayer();
}

/**
 * Triggered when the maid punishes the player. The player is stripped and loses dominant/submissive reputation.
 * @returns {void} - Nothing
 */
function MainHallMaidPunishmentPlayer() {
	CharacterNaked(Player);
	LogAdd("BlockChange","Rule", CurrentTime + 3600000);
	if (ReputationGet("Dominant") > 10) ReputationProgress("Dominant", -10);
	if (ReputationGet("Dominant") < -10) ReputationProgress("Dominant", 10);
}

/**
 * Triggered when the maid catches the club slave player with clothes. The player is stripped and the timer is restarted.
 * @returns {void} - Nothing
 */
function MainHallResetClubSlave() {
	CharacterNaked(Player);
	LogAdd("ClubSlave", "Management", CurrentTime + 3600000);
	LogAdd("BlockChange", "Rule", CurrentTime + 3600000);
	TitleSet("ClubSlave");
}

/**
 * Triggered when the player needs to be brought to the club management room to be expelled
 * @returns {void} - Nothing
 */
function MainHallMistressExpulsion() {
	CommonSetScreen("Room", "Management");
	ManagementMistress.Stage = "500";
	ManagementMistress.CurrentDialog = DialogFind(MainHallMaid, "MistressExpulsion");
	CharacterSetCurrent(ManagementMistress);
}

/**
 * Sets the maid dialog stage to the introduction for new players
 * @returns {void} - Nothing
 */
function MainHallMaidIntroduction() {
	if (!LogQuery("IntroductionDone", "MainHall") && Player.CanTalk()) {
		MainHallMaid.Stage = "1000";
		MainHallMaid.CurrentDialog = DialogFind(Player, "IntroductionMaidGreetings");
		CharacterSetCurrent(MainHallMaid);
		MainHallMaid.AllowItem = false;
	}
}

/**
 * Flags the introduction as done
 * @returns {void} - Nothing
 */
function MainHallMaidIntroductionDone() {
	LogAdd("IntroductionDone", "MainHall");
}

/**
 * Handles key presses while in the main hall screen
 * @returns {void} - Nothing
 */
function MainHallKeyDown() {
	Draw3DKeyDown();
}


function MainHallSetMaidsDisabled(minutes) {
	var millis = minutes * 60000
	LogAdd("MaidsDisabled", "Maid", CurrentTime + millis);
}