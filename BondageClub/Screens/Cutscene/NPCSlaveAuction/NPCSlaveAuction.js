"use strict";
var NPCSlaveAuctionBackground = "SlaveMarket";
var NPCSlaveAuctionVendor = null;
var NPCSlaveAuctionSlave = null;
var NPCSlaveAuctionMistress = null;
var NPCSlaveAuctionGirlLeft = null;
var NPCSlaveAuctionGirlRight = null;
var NPCSlaveAuctionAmount = 0;

// Loads the slave auction NPCs
function NPCSlaveAuctionLoad() {
	CutsceneStage = 0;
	NPCSlaveAuctionMistress = CharacterLoadNPC("NPC_Mistress");
	NPCSlaveAuctionGirlLeft = CharacterLoadNPC("NPC_GirlLeft");
	NPCSlaveAuctionGirlRight = CharacterLoadNPC("NPC_GirlRight");
}

// Runs the slave auction cutscene
function NPCSlaveAuctionRun() {
	DrawCharacter(NPCSlaveAuctionVendor, 400, 0, 1);
	if (CutsceneStage <= 6) DrawCharacter(NPCSlaveAuctionSlave, 800, 0, 1);
	DrawCharacter(NPCSlaveAuctionMistress, 1200, 0, 1);
	if ((CutsceneStage >= 2) && (CutsceneStage <= 6)) DrawCharacter(NPCSlaveAuctionGirlLeft, 0, 100, 1);
	if ((CutsceneStage >= 2) && (CutsceneStage <= 6)) DrawCharacter(NPCSlaveAuctionGirlRight, 1600, 100, 1);
	var Text = TextGet("NPCSlaveAuction" + CutsceneStage.toString());
	Text = Text.replace("AuctionAmount", NPCSlaveAuctionAmount.toString());
	Text = Text.replace("DoubleAmount", (NPCSlaveAuctionAmount * 2).toString());
	DrawText(Text, 1000, 980, "White", "Black");
}

// When the user clicks on the cutscene, we progress it
function NPCSlaveAuctionClick() {
	CutsceneStage++;
	if (CutsceneStage > 8) {
		ServerPrivateCharacterSync();
		CommonSetScreen("Room", "MainHall");
	}
}