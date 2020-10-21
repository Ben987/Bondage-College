"use strict";
var SlaveMarketBackground = "SlaveMarket";
var SlaveMarketMistress = null;
var SlaveMarketSlave = null;
var SlaveMarketSlaveToTrain = null;
var SlaveMarketTrainingBackgroundList = ["BDSMRoomBlue", "BDSMRoomPurple", "BDSMRoomRed"];
var SlaveMarketBuyer = null;

/**
 * Checks if an auction can be started.
 * @returns {boolean} - Returns TRUE if the player has room in her private room and is dominant enough to participate in an auction
 */
function SlaveMarketCanStartAuction() { return ((ReputationGet("Dominant") >= -50) && ManagementCanTransferToRoom()) }
/**
 * Checks if an auction cannot be started due to being too submissive.
 * @returns {boolean} - Returns TRUE if the player is not dominant enough to participate in an auction
 */
function SlaveMarketCannotStartAuctionSubmissive() { return (ReputationGet("Dominant") < -50) }
/**
 * Checks if an auction cannot be started due to lack of space in the player's private room
 * @returns {boolean} - Returns TRUE if the player is dominant enough to participate in an auction, but does not have space in her private room
 */
function SlaveMarketCannotStartAuctionRoom() { return ((ReputationGet("Dominant") >= -50) && !ManagementCanTransferToRoom()) }
/**
 * Checks if the player can be auctioned.  Must not be owned, must be submissive, must not be restrained, must have space in room and must not have been auctioned in the last seven days
 * @returns {boolean} - Returns TRUE if the player can be auctioned
 */
function SlaveMarketCanBeAuctioned() { return (!Player.IsOwned() && !PrivateOwnerInRoom() && !Player.IsRestrained() && !Player.IsChaste() && (ReputationGet("Dominant") < 0) && !LogQuery("Auctioned", "SlaveMarket") && ManagementCanTransferToRoom()) }

/**
 * Loads the Slave Market room, generates the Mistress and slave
 * @returns {void} - Nothing
 */
function SlaveMarketLoad() {
	if (SlaveMarketMistress == null) {
		SlaveMarketMistress = CharacterLoadNPC("NPC_SlaveMarket_Mistress");
		SlaveMarketMistress.AllowItem = false;
		SlaveMarketBuyer = CharacterLoadNPC("NPC_SlaveMarket_Buyer");
	}
	if (SlaveMarketSlave == null) SlaveMarketNewSlave();
}

/**
 * Runs and draws the slave market, the screen can be used to search for a daily job.
 * @returns {void} - Nothing
 */
function SlaveMarketRun() {
	if (!DailyJobSubSearchIsActive()) DrawCharacter(Player, 250, 0, 1);
	if (!DailyJobSubSearchIsActive()) DrawCharacter(SlaveMarketMistress, 750, 0, 1);
	if (!DailyJobSubSearchIsActive()) DrawCharacter(SlaveMarketSlave, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	DailyJobSubSearchRun();
}

/**
 * Handles clicks in the slave market.
 * @returns {void} - Nothing
 */
function SlaveMarketClick() {
	if (!DailyJobSubSearchIsActive() && MouseIn(250, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (!DailyJobSubSearchIsActive() && MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(SlaveMarketMistress);
	if (!DailyJobSubSearchIsActive() && MouseIn(1250, 0, 500, 1000)) CharacterSetCurrent(SlaveMarketSlave);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	DailyJobSubSearchClick();
}

/**
 * Triggered when the auction starts, the mini game is launched
 * @returns {void} - Nothing
 */
function SlaveMarketAuctionStart() {
	InventoryWear(SlaveMarketSlave, "CollarChainShort", "ItemNeckRestraints");
	SlaveAuctionVendor = SlaveMarketMistress;
	SlaveAuctionSlave = SlaveMarketSlave;
	MiniGameStart("SlaveAuction", "", "SlaveMarketAuctionEnd");
}

/**
 * Triggered when the auction ends. If the player was the last bidder, she buys the slave and gets in a dialog with her, otherwise she returns to the main area of the slave market
 * @returns {void} - Nothing
 */
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

/**
 * Generates a new slave for the slave market
 * @returns {void} - Nothing
 */
function SlaveMarketNewSlave() {
	SlaveMarketSlave = CharacterLoadNPC("NPC_SlaveMarket_Slave");
	SlaveMarketSlave.AllowItem = false;
	CharacterAppearanceFullRandom(SlaveMarketSlave);
	CharacterNaked(SlaveMarketSlave);
	CharacterRandomName(SlaveMarketSlave);
	InventoryWear(SlaveMarketSlave, "LeatherCollar", "ItemNeck");
	InventoryWear(SlaveMarketSlave, "CollarChainLong", "ItemNeckRestraints");
	if (CurrentCharacter != null) DialogLeave();
}

/**
 * Triggered when the player brings the slave to her room, the player is sent to her private room with the NPC.
 * @returns {void} - Nothing
 */
function SlaveMarketVisitRoom() {
	DialogLeave();
	SlaveMarketNewSlave();
	CommonSetScreen("Room", "Private");
}

/**
 * Triggered when the slave training start. Sets the NPC and dialog before sending the player to an empty room with the trainee.
 * @returns {void} - Nothing
 */
function SlaveMarketTrainingStart() {
	var Intro = Math.floor(Math.random() * 6);
	SlaveMarketSlaveToTrain = CharacterLoadNPC("NPC_SlaveMarket_SlaveToTrain");
	SlaveMarketSlaveToTrain.Stage = (Intro * 100).toString();
	SlaveMarketSlaveToTrain.ExpectedTraining = Intro % 3;
	SlaveMarketSlaveToTrain.CurrentTraining = -1;
	SlaveMarketSlaveToTrain.TrainingIntensity = 0;
	SlaveMarketSlaveToTrain.TrainingCount = 0;
	SlaveMarketSlaveToTrain.TrainingCountLow = 0;
	SlaveMarketSlaveToTrain.TrainingCountPerfect = 0;
	SlaveMarketSlaveToTrain.TrainingCountHigh = 0;
	if (Intro >= 3) InventoryWear(SlaveMarketSlaveToTrain, "SlaveCollar", "ItemNeck");
	CharacterNaked(SlaveMarketSlaveToTrain);
	DialogLeave();
	EmptyBackground = CommonRandomItemFromList("", SlaveMarketTrainingBackgroundList);
	EmptyCharacterOffset = 0;
	EmptyCharacter = [];
	EmptyCharacter.push(Player);
	EmptyCharacter.push(SlaveMarketSlaveToTrain);
	CommonSetScreen("Room", "Empty");
}

/**
 * Triggered when the auctioned player gets stripped and chained
 * @returns {void} - Nothing
 */
function SlaveMarketAuctionPlayerStrip() {
	CharacterRelease(Player);
	CharacterNaked(Player);
	InventoryRemove(Player, "ItemNeck", false);
	InventoryWear(Player, "LeatherCollar", "ItemNeck", "Default", 10, false);
	InventoryWear(Player, "CollarChainLong", "ItemNeckRestraints", "Default", 10, false);
	CharacterRefresh(Player);
}

/**
 * Triggered when the player auction starts
 * @returns {void} - Nothing
 */
function SlaveMarketAuctionPlayerStart() {
	DialogLeave();
	MiniGameStart("PlayerAuction", "", "SlaveMarketPlayerAuctionEnd");
}

/**
 * Triggered when the player auction ends, we create the buyer and activate her
 * @returns {void} - Nothing
 */
function SlaveMarketPlayerAuctionEnd() {
	CharacterRelease(Player);
	LogAdd("Auctioned", "SlaveMarket", CurrentTime + 604800000);
	CharacterChangeMoney(Player, PlayerAuctionBidAmount / 2);
	CommonSetScreen("Room", "SlaveMarket");
	SlaveMarketBuyer.AllowItem = false;	
	SlaveMarketBuyer.Appearance = PlayerAuctionCustomer[PlayerAuctionBidCurrent].Appearance.slice(0);
	SlaveMarketBuyer.Archetype = PlayerAuctionCustomer[PlayerAuctionBidCurrent].Archetype;
	CharacterRefresh(SlaveMarketBuyer);
	SlaveMarketBuyer.CurrentDialog = DialogFind(SlaveMarketBuyer, "Intro" + Math.floor(Math.random() * 3).toString());
	CharacterSetCurrent(SlaveMarketBuyer);
}

/**
 * Triggered when the player auction has ended and both characters are transferred to the player room
 * @returns {void} - Nothing
 */
function SlaveMarketPlayerAuctionTransfer() {
	DialogLeave();
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(SlaveMarketBuyer, SlaveMarketBuyer.Archetype);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	NPCTraitSet(C, "Dominant", 50 + Math.floor(Math.random() * 51));
	C.Love = 30;
	NPCEventAdd(C, "EndSubTrial", CurrentTime + NPCLongEventDelay(C));
	ServerPrivateCharacterSync();
}