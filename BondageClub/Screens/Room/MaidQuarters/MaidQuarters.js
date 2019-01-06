"use strict";
var MaidQuartersBackground = "MaidQuarters";
var MaidQuartersMaid = null;
var MaidQuartersMaidInitiation = null;
var MaidQuartersPreviousCloth = null;
var MaidQuartersPreviousHat = null;
var MaidQuartersMaidReleasedPlayer = false;
var MaidQuartersCanBecomeMaid = false;
var MaidQuartersCannotBecomeMaidYet = false
var MaidQuartersCanBecomeHeadMaid = false;
var MaidQuartersCannotBecomeHeadMaidYet = false
var MaidQuartersIsMaid = false;
var MaidQuartersIsHeadMaid = false
var MaidQuartersDominantRep = 0;
var MaidQuartersCurrentRescue = "";
var MaidQuartersRescueList = ["IntroductionClass", "ShibariDojo", "Shop", "Gambling"];
var MaidQuartersRescueStage = ["310", "320", "330", "340"];
var MaidQuartersCurrentRescueStarted = false;
var MaidQuartersCurrentRescueCompleted = false;

// Returns TRUE if the player is dressed in a maid uniform or can take a specific chore
function MaidQuartersPlayerInMaidUniform() { return ((CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name") == "MaidOutfit1") && (CharacterAppearanceGetCurrentValue(Player, "Hat", "Name") == "MaidHairband1")) }
function MaidQuartersAllowMaidDrinks() { return (!Player.IsRestrained() && !MaidQuartersMaid.IsRestrained()); }
function MaidQuartersAllowMaidCleaning() { return (!Player.IsRestrained() && !MaidQuartersMaid.IsRestrained()); }
function MaidQuartersAllowRescue() { return (!Player.IsRestrained()); }
function MaidQuartersAllowCancelRescue() { return (MaidQuartersCurrentRescueStarted && !MaidQuartersCurrentRescueCompleted); }

// Loads the maid quarters room
function MaidQuartersLoad() {

	// Creates the maid that gives work and the initiation maids
	MaidQuartersMaid = CharacterLoadNPC("NPC_MaidQuarters_Maid");
	MaidQuartersMaidInitiation = CharacterLoadNPC("NPC_MaidQuarters_InitiationMaids");
	InventoryWear(MaidQuartersMaidInitiation, "WoodenPaddle", "ItemMisc");

}

// Run the maid quarters, draw both characters
function MaidQuartersRun() {
	MaidQuartersCanBecomeMaid = (!LogQuery("JoinedSorority", "Maid") && (ReputationGet("Maid") >= 50));
	MaidQuartersCannotBecomeMaidYet = ((ReputationGet("Maid") > 0) && (ReputationGet("Maid") < 50) && !LogQuery("JoinedSorority", "Maid"));
	MaidQuartersCanBecomeHeadMaid = ((ReputationGet("Maid") >= 100) && (ReputationGet("Dominant") >= 50) && LogQuery("JoinedSorority", "Maid") && !LogQuery("LeadSorority", "Maid"));
	MaidQuartersCannotBecomeHeadMaidYet = (((ReputationGet("Maid") < 100) || (ReputationGet("Dominant") < 50)) && LogQuery("JoinedSorority", "Maid") && !LogQuery("LeadSorority", "Maid"));
	MaidQuartersIsMaid = LogQuery("JoinedSorority", "Maid");
	MaidQuartersIsHeadMaid = LogQuery("LeadSorority", "Maid");
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(MaidQuartersMaid, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the maid quarters
function MaidQuartersClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(MaidQuartersMaid);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// The maid can ungag the player
function MaidQuartersMaidUngagPlayer() {
	if (MaidQuartersMaid.CanInteract()) {
		if (!MaidQuartersMaidReleasedPlayer) {
			ReputationProgress("Dominant", -1);
			MaidQuartersMaidReleasedPlayer = true;
		}
		InventoryRemove(Player, "ItemMouth");
		InventoryRemove(Player, "ItemHead");
	} else MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "CantReleasePlayer");
}

// When the player dresses as a maid
function MaidQuartersWearMaidUniform() {
	MaidQuartersPreviousCloth = InventoryGet(Player, "Cloth");
	MaidQuartersPreviousHat = InventoryGet(Player, "Hat");
	InventoryWear(Player, "MaidOutfit1", "Cloth", "Default");
	InventoryWear(Player, "MaidHairband1", "Hat", "Default");
}

// When the player removes the maid uniform and dresses back
function MaidQuartersRemoveMaidUniform() {
	CharacterRelease(Player);
	if (MaidQuartersPreviousCloth != null) InventoryWear(Player, MaidQuartersPreviousCloth.Asset.Name, "Cloth", MaidQuartersPreviousCloth.Color);
	else InventoryRemove(Player, "Cloth");
	if (MaidQuartersPreviousHat != null) InventoryWear(Player, MaidQuartersPreviousHat.Asset.Name, "Hat", MaidQuartersPreviousHat.Color);
	else InventoryRemove(Player, "Hat");
	InventoryRemove(Player, "ItemMisc");
}

// When the mini game / maid chore starts
function MaidQuartersMiniGameStart(GameType, Difficulty) {
	MiniGameStart(GameType, Difficulty, "MaidQuartersMiniGameEnd");
}

// When the mini game ends, we go back to the maid
function MaidQuartersMiniGameEnd() {
	CommonSetScreen("Room", "MaidQuarters");
	CharacterSetCurrent(MaidQuartersMaid);
	if (MiniGameVictory && (MiniGameType == "MaidDrinks")) MaidQuartersMaid.Stage = "281";
	if (!MiniGameVictory && (MiniGameType == "MaidDrinks")) MaidQuartersMaid.Stage = "282";
	if (MiniGameVictory && (MiniGameType == "MaidCleaning")) MaidQuartersMaid.Stage = "481";
	if (!MiniGameVictory && (MiniGameType == "MaidCleaning")) MaidQuartersMaid.Stage = "482";
	MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, MiniGameType + (MiniGameVictory ? "Victory" : "Defeat"));
}

// When the mini game / maid chore is successful, the player gets paid
function MaidQuartersMiniGamePay() {
	ReputationProgress("Maid", 4);
	var M = 8;
	if (MiniGameDifficulty == "Normal") M = M * 1.5;
	if (MiniGameDifficulty == "Hard") M = M * 2;
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", M.toString());
	CharacterChangeMoney(Player, M);
}

// When the rescue is successful, the player gets paid
function MaidQuartersRescuePay() {
	MaidQuartersRemoveMaidUniform();
	ReputationProgress("Maid", 4);
	var M = 8 + Math.floor(Math.random() * 9);
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", M.toString());
	CharacterChangeMoney(Player, M);
}

// When the maid releases the player
function MaidQuartersMaidReleasePlayer() {
	if (MaidQuartersMaid.CanInteract()) {
		if (!MaidQuartersMaidReleasedPlayer) {
			ReputationProgress("Dominant", -1);
			MaidQuartersMaidReleasedPlayer = true;
		}
		CharacterRelease(Player);
	} else MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "CantReleasePlayer");
}

// Prepares a counter that will affect the dominant reputation of the player
function MaidQuartersDominantRepChange(Value) {
	MaidQuartersDominantRep = MaidQuartersDominantRep + Value;
}

// When we switch from one maid to another in the initiation
function MaidQuartersInitiationTransition(MaidType) {
	var C = ((MaidType == "MainMaid") ? MaidQuartersMaid : MaidQuartersMaidInitiation);
	CharacterSetCurrent(C);
	C.CurrentDialog = DialogFind(C, "MaidInitiationTransition");
}

// Change the initiation maid appearance on the spot to simulate a new character
function MaidQuartersChangeInitiationMaid() {
	CharacterRandomName(MaidQuartersMaidInitiation);
	CharacterAppearanceFullRandom(MaidQuartersMaidInitiation);
	CharacterAppearanceSetItem(MaidQuartersMaidInitiation, "Cloth", MaidQuartersMaidInitiation.Inventory[MaidQuartersMaidInitiation.Inventory.length - 2].Asset);
	CharacterAppearanceSetItem(MaidQuartersMaidInitiation, "Hat", MaidQuartersMaidInitiation.Inventory[MaidQuartersMaidInitiation.Inventory.length - 1].Asset);
	CharacterAppearanceSetColorForGroup(MaidQuartersMaidInitiation, "Default", "Cloth");
	CharacterAppearanceSetColorForGroup(MaidQuartersMaidInitiation, "Default", "Hat");
	InventoryWear(MaidQuartersMaidInitiation, "WoodenPaddle", "ItemMisc");
}

// When the player becomes a maid
function MaidQuartersBecomMaid() {
	InventoryAdd(Player, "MaidOutfit1", "Cloth");
	InventoryAdd(Player, "MaidHairband1", "Hat");
	InventoryWear(Player, "MaidOutfit1", "Cloth", "Default");
	InventoryWear(Player, "MaidHairband1", "Hat", "Default");
	CharacterAppearanceValidate(Player);
	LogAdd("JoinedSorority", "Maid");
	ReputationProgress("Dominant", MaidQuartersDominantRep);
	MaidQuartersCanBecomeMaid = false;
	MaidQuartersIsMaid = true;
}

// When the player becomes head maid
function MaidQuartersBecomHeadMaid() {
	MaidQuartersIsHeadMaid = true;
	LogAdd("LeadSorority", "Maid");
}

// Starts a maid rescue mission in a random room
function MaidQuartersStartRescue() {
	
	// Make sure we don't select the same room twice and prepares the rescue scenario
	MaidQuartersCurrentRescue = CommonRandomItemFromList(MaidQuartersCurrentRescue, MaidQuartersRescueList);
	MaidQuartersMaid.Stage = MaidQuartersRescueStage[MaidQuartersRescueList.indexOf(MaidQuartersCurrentRescue)];
	MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "Rescue" + MaidQuartersCurrentRescue);
	MaidQuartersCurrentRescueStarted = false;
	MaidQuartersCurrentRescueCompleted = false;
	MaidQuartersPreviousCloth = InventoryGet(Player, "Cloth");
	MaidQuartersPreviousHat = InventoryGet(Player, "Hat");

}

// Cancels the current rescue mission
function MaidQuartersCancelRescue() {
	MaidQuartersRemoveMaidUniform();
	if (MaidQuartersCurrentRescue == "IntroductionClass") { IntroductionCompleteRescue(); IntroductionMaid.Stage = "0"; }
	if (MaidQuartersCurrentRescue == "ShibariDojo") { ShibariCompleteRescue(); ShibariTeacher.Stage = "0"; }
	if (MaidQuartersCurrentRescue == "Shop") { ShopCompleteRescue(); ShopVendor.Stage = "0"; }
	if (MaidQuartersCurrentRescue == "Gambling") { GamblingCompleteRescue(); GamblingFirstSub.Stage = "0"; }
}