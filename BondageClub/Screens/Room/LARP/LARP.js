"use strict";
var LARPBackground = "WrestlingRing";
var LARPOrganiser = null;

/**
 * Loads the LARP introduction room NPC
 * @returns {void} - Nothing
 */
function LARPLoad() {
	if (LARPOrganiser == null) {
		LARPOrganiser = CharacterLoadNPC("NPC_LARP_Organiser");
		CharacterNaked(LARPOrganiser);
		InventoryWear(LARPOrganiser, "SteampunkCorsetTop1", "Cloth", "Default");
		InventoryWear(LARPOrganiser, "LatexSkirt2", "ClothLower", "#666666");
		InventoryWear(LARPOrganiser, "Sandals", "Shoes", "#666666");
		LARPOrganiser.AllowItem = false;
	}
}

/**
 * Runs and draws the LARP introduction screen. The screen can be used to search for daily jobs.
 * @returns {void} - Nothing
 */
function LARPRun() {
	if (!DailyJobSubSearchIsActive()) DrawCharacter(Player, 500, 0, 1);
	if (!DailyJobSubSearchIsActive()) DrawCharacter(LARPOrganiser, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Leave"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if ((ReputationGet("LARP") >= 1) && (Player.Game != null) && (Player.Game.LARP != null) && (Player.Game.LARP.Class != null))
		DrawButton(1885, 265, 90, 90, "", Player.CanChange() ? "White" : "Pink", "Icons/Battle.png", TextGet("Battle"));
	DailyJobSubSearchRun();
}

/**
 * Handles clicks in the LARP introduction screen. And adds the LARP Backgrounds to the list of seletable backgrounds.
 * @returns {void} - Nothing
 */
function LARPClick() {
	if (!DailyJobSubSearchIsActive() && MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (!DailyJobSubSearchIsActive() && MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(LARPOrganiser);
	if (MouseIn(1885, 25, 90, 90)) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1885, 265, 90, 90) && (ReputationGet("LARP") >= 1) && (Player.Game != null) && (Player.Game.LARP != null) && (Player.Game.LARP.Class != null) && Player.CanChange()) ChatRoomStart("", "LARP", "LARP", "WrestlingRing", BackgroundsTagList);
	DailyJobSubSearchClick();
}

/**
 * Sets the new LARP class selected by the player
 * @param {string} NewClass - Name of the newly selected class
 * @returns {void} - Nothing
 */
function LARPSelectClass(NewClass) {
	if (ReputationGet("LARP") <= 0) DialogSetReputation("LARP", 1);
	if (Player.Game == null) Player.Game = {};
	if (Player.Game.LARP == null) Player.Game.LARP = {};
	Player.Game.LARP.Class = NewClass;
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
}