"use strict";
var ArcadeBackground = "PartyBasement";
var ArcadeEmployee = null;
var ArcadePlayer = null;
var ArcadeAskedFor = null;
var ArcadePrice = 0;
//

/**
 * Determines whether or not the player is bound and can plead to have their own headset put on them
 * @returns {bool} - Whether or not the player can ask to have a headset put on
 */
function ArcadeCanAskForHeadsetHelpBound() {
	if (ArcadeCanPlayGames()) return false;
	return !Player.CanInteract() && DialogInventoryAvailable("InteractiveVRHeadset", "ItemHead")
}

/**
 * Determines whether or not the player is gagged and can plead to have their own headset put on them
 * @returns {bool} - Whether or not the player can ask to have a headset put on
 */
function ArcadeCanAskForHeadsetHelpGagged() {
	if (ArcadeCanPlayGames()) return false;
	return !Player.CanInteract() && !Player.CanTalk() && DialogInventoryAvailable("InteractiveVRHeadset", "ItemHead");
}

/**
 * Determines whether or not the player can play games
 * @returns {bool} - Whether or not the player has a headset
 */
function ArcadeCanPlayGames() {
	var head = InventoryGet(Player, "ItemHead");
	return head && head.Asset && (head.Asset.Name == "InteractiveVRHeadset" || head.Asset.Name == "InteractiveVisor");
}



/**
 * Places a headset on the player
 * @returns {void} - Nothing
 */
function ArcadePutOnHeadset() {
	InventoryWear(Player, "InteractiveVRHeadset","ItemHead");
}


/**
 * Places a headset on the player and charges them 10
 * @returns {void} - Nothing
 */
function ArcadeBuyHeadset() {
	InventoryWear(Player, "InteractiveVRHeadset","ItemHead");
	CharacterChangeMoney(Player, -10);
}


/**
 * Loads the Arcade room and initializes the NPCs. This function is called dynamically
 * @returns {void} - Nothing
 */
function ArcadeLoad() {
	ArcadeEmployee = CharacterLoadNPC("NPC_Arcade_Employee");
	ArcadePlayer = CharacterLoadNPC("NPC_Arcade_Player");
	InventoryWear(ArcadePlayer, "InteractiveVRHeadset","ItemHead");
}

/**
 * Run the Arcade room and draw characters. This function is called dynamically at short intervals. 
 * Don't use expensive loops or functions from here
 * @returns {void} - Nothing
 */
function ArcadeRun() {
	DrawCharacter(Player, 750, 0, 1);
	DrawCharacter(ArcadeEmployee, 250, 0, 1);
	DrawCharacter(ArcadePlayer, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (ArcadeCanPlayGames()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/KinkyDungeon.png");
		else DrawButton(1885, 265, 90, 90, "", "Pink", "Icons/KinkyDungeon.png");
}

/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function ArcadeClick() {
	if (MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(250, 0, 500, 1000)) {
		ArcadeEmployee.Stage = "0";
		CharacterSetCurrent(ArcadeEmployee);
	}
	if (MouseIn(1250, 0, 500, 1000)) {
		ArcadePlayer.Stage = "0";
		CharacterSetCurrent(ArcadePlayer);
	}
	
	if (ArcadeCanPlayGames()) {
		if (MouseIn(1885, 265, 90, 90)) ArcadeKinkyDungeonStart(ReputationGet("Gaming"))
	} 
	
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * Starts the kinky dungeon game
 * @param {number} PlayerLevel - The player's current level in the game
 * @returns {void} - Nothing
 */
function ArcadeKinkyDungeonStart(PlayerLevel) {
	
	KinkyDungeonPlayer = CharacterLoadNPC("NPC_Avatar");
	
	MiniGameStart("KinkyDungeon", PlayerLevel, "ArcadeKinkyDungeonEnd");
}

/**
 * Ends the therapy mini-game as a nurse, plays with reputation and money
 * @returns {void} - Nothing
 */
function ArcadeKinkyDungeonEnd() {
	CommonSetScreen("Room", "Arcade");

	if (MiniGameVictory) {
		ReputationChange("Gaming", Math.max(ReputationGet("Gaming"), MiniGameKinkyDungeonCheckpoint))
	}
}
