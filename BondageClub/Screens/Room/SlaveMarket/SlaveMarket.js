"use strict";
var SlaveMarketBackground = "SlaveMarket";
var SlaveMarketMistress = null;
var SlaveMarketSlave = null;

function SlaveMarketCanStartAuction() { return ((ReputationGet("Dominant") >= -50) && ManagementCanTransferToRoom()) }
function SlaveMarketCannotStartAuctionSubmissive() { return (ReputationGet("Dominant") < -50) }
function SlaveMarketCannotStartAuctionRoom() { return ((ReputationGet("Dominant") >= -50) && !ManagementCanTransferToRoom()) }

// Loads the Slave Market room, generates the Mistress and slave
function SlaveMarketLoad() {
	if (SlaveMarketMistress == null) {
		SlaveMarketMistress = CharacterLoadNPC("NPC_SlaveMarket_Mistress");
		SlaveMarketMistress.AllowItem = false;
	}
	if (SlaveMarketSlave == null) SlaveMarketNewSlave();
}

// Run the Slave Market
function SlaveMarketRun() {
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(SlaveMarketMistress, 750, 0, 1);
	DrawCharacter(SlaveMarketSlave, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the Slave Market
function SlaveMarketClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(SlaveMarketMistress);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(SlaveMarketSlave);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// When the auction starts, launch the mini-game
function SlaveMarketAuctionStart() {
	InventoryWear(SlaveMarketSlave, "CollarChainShort", "ItemNeckAccessories");
	SlaveAuctionVendor = SlaveMarketMistress;
	SlaveAuctionSlave = SlaveMarketSlave;
	MiniGameStart("SlaveAuction", "", "SlaveMarketAuctionEnd");
}

// When the auction ends, if the player was the last bidder, she buys the slave and talks with her.  If not, she goes back to the Mistress.
function SlaveMarketAuctionEnd() {
	if (SlaveAuctionBidCurrent == "Player") {
		CharacterChangeMoney(Player, SlaveAuctionBidAmount * -1);
		CommonSetScreen("Room", "Private");
		PrivateAddCharacter(SlaveMarketSlave, "Submissive");
		CommonSetScreen("Room", "SlaveMarket");
		CharacterSetCurrent(SlaveMarketSlave);
		SlaveMarketSlave.Stage = "10";
		SlaveMarketSlave.CurrentDialog = DialogFind(SlaveMarketSlave, "AuctionBuy");
		SlaveMarketMistress.Stage = "22";
	} else {
		CommonSetScreen("Room", "SlaveMarket");
		CharacterSetCurrent(SlaveMarketMistress);
		SlaveMarketMistress.CurrentDialog = DialogFind(SlaveMarketMistress, "AuctionFail");
		SlaveMarketMistress.Stage = "23";
	}
}

// When a new slave is generated
function SlaveMarketNewSlave() {
	SlaveMarketSlave = CharacterLoadNPC("NPC_SlaveMarket_Slave");
	SlaveMarketSlave.AllowItem = false;
	CharacterAppearanceFullRandom(SlaveMarketSlave);
	CharacterNaked(SlaveMarketSlave);
	CharacterRandomName(SlaveMarketSlave);
	InventoryWear(SlaveMarketSlave, "LeatherCollar", "ItemNeck");
	InventoryWear(SlaveMarketSlave, "CollarChainLong", "ItemNeckAccessories");
	if (CurrentCharacter != null) DialogLeave();
}

// When the player brings the slave to her room
function SlaveMarketVisitRoom() {
	DialogLeave();
	SlaveMarketNewSlave();
	CommonSetScreen("Room", "Private");
}

// When the training starts, launch the custom dialog
function SlaveMarketTrainingStart() {
}