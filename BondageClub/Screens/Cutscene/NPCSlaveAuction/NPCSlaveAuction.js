"use strict";
var NPCSlaveAuctionBackground = "SlaveMarket";
var NPCSlaveAuctionVendor = null;
var NPCSlaveAuctionSlave = null;
var NPCSlaveAuctionMistress = null;
var NPCSlaveAuctionGirlLeft = null;
var NPCSlaveAuctionGirlRight = null;
var NPCSlaveAuctionAmount = 0;

/**
 * Loads the slave auction cutscene by creating the NPCs and setting the stage.
 * @returns {void} - Nothing
 */
function NPCSlaveAuctionLoad() {
	CutsceneStage = 0;
	NPCSlaveAuctionMistress = CharacterLoadNPC("NPC_Mistress");
	NPCSlaveAuctionGirlLeft = CharacterLoadNPC("NPC_GirlLeft");
	NPCSlaveAuctionGirlRight = CharacterLoadNPC("NPC_GirlRight");
}

/**
 * Runs and draws the slave auction cutscene
 * @returns {void} - Nothing
 */
function NPCSlaveAuctionRun() {
	DrawCharacter(NPCSlaveAuctionVendor, 400, 0, 1);
	if (CutsceneStage <= 6) DrawCharacter(NPCSlaveAuctionSlave, 800, 0, 1);
	DrawCharacter(NPCSlaveAuctionMistress, 1200, 0, 1);
	if ((CutsceneStage >= 2) && (CutsceneStage <= 6)) DrawCharacter(NPCSlaveAuctionGirlLeft, 0, 0, 1);
	if ((CutsceneStage >= 2) && (CutsceneStage <= 6)) DrawCharacter(NPCSlaveAuctionGirlRight, 1600, 0, 1);
	var Text = TextGet("NPCSlaveAuction" + CutsceneStage.toString());
	Text = Text.replace("AuctionAmount", NPCSlaveAuctionAmount.toString());
	Text = Text.replace("DoubleAmount", (NPCSlaveAuctionAmount * 2).toString());
	DrawText(Text, 1000, 980, "White", "Black");
}

/**
 * Handles clicks during the slave auction cutscene. Clicking anywhere on the screen advances the cutscene. At the end of the cutscene, the player is sent back to the main hall and private NPCs are saved.
 * @returns {void} - Nothing
 */
function NPCSlaveAuctionClick() {
	CutsceneStage++;
	if (CutsceneStage > 8) {
		ServerPrivateCharacterSync();
		CommonSetScreen("Room", "MainHall");
	}
}