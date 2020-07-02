"use strict";
var MaidQuartersBackground = "MaidQuarters";
var MaidQuartersMaid = null;
var MaidQuartersMaidInitiation = null;
var MaidQuartersItemClothPrev = {Cloth:null, Hat:null, ItemArms:null, ItemLegs:null, ItemFeet:null};
var MaidQuartersMaidReleasedPlayer = false;
var MaidQuartersCanBecomeMaid = false;
var MaidQuartersCannotBecomeMaidYet = false;
var MaidQuartersCanBecomeHeadMaid = false;
var MaidQuartersCannotBecomeHeadMaidYet = false;
var MaidQuartersIsMaid = false;
var MaidQuartersIsHeadMaid = false;
var MaidQuartersDominantRep = 0;
var MaidQuartersCurrentRescue = "";
var MaidQuartersRescueList = ["IntroductionClass", "ShibariDojo", "Shop", "Gambling"]; // "Prison" should be re-added when git4nick code is ready
var MaidQuartersRescueStage = ["310", "320", "330", "340", "350"];
var MaidQuartersCurrentRescueStarted = false;
var MaidQuartersCurrentRescueCompleted = false;
var MaidQuartersOnlineDrinkCount = 0;
var MaidQuartersOnlineDrinkValue = 0;
var MaidQuartersOnlineDrinkCustomer = [];
var MaidQuartersOnlineDrinkFromOwner = false;

// Returns TRUE if the player is dressed in a maid uniform or can take a specific chore
function MaidQuartersPlayerInMaidUniform() { return ((CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name") == "MaidOutfit1") && (CharacterAppearanceGetCurrentValue(Player, "Hat", "Name") == "MaidHairband1")) }
function MaidQuartersAllowMaidDrinks() { return (!Player.IsRestrained() && !MaidQuartersMaid.IsRestrained() && !LogQuery("ClubMistress", "Management")) }
function MaidQuartersAllowMaidCleaning() { return (!Player.IsRestrained() && !MaidQuartersMaid.IsRestrained() && !LogQuery("ClubMistress", "Management")) }
function MaidQuartersAllowMaidPlayMusic() { return (!Player.IsRestrained()) }
function MaidQuartersAllowRescue() { return (!Player.IsRestrained()) }
function MaidQuartersAllowCancelRescue() { return (MaidQuartersCurrentRescueStarted && !MaidQuartersCurrentRescueCompleted) }
function MaidQuartersCanFreeSarah() { return (SarahUnlockQuest && LogQuery("LeadSorority", "Maid")) }
function MaidQuartersCanReleasePlayer() { return (Player.IsRestrained() && !InventoryCharacterHasOwnerOnlyRestraint(Player) && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract()) }
function MaidQuartersCannotReleasePlayer() { return (Player.IsRestrained() && (InventoryCharacterHasOwnerOnlyRestraint(Player) || !CurrentCharacter.CanTalk() || !CurrentCharacter.CanInteract())) }
function MaidQuartersCanGetDusterGag() { return (!SarahUnlockQuest && LogQuery("JoinedSorority", "Maid") && Player.CanTalk() && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract() && (!InventoryAvailable(Player, "DusterGag", "ItemMouth") || !InventoryAvailable(Player, "DusterGag", "ItemMouth2") || !InventoryAvailable(Player, "DusterGag", "ItemMouth3"))) }
function MaidQuartersOnlineDrinkCompleted() { return (MaidQuartersOnlineDrinkCount >= 5) }
function MaidQuartersCanUngag() { return (!Player.CanTalk() && !InventoryCharacterHasOwnerOnlyRestraint(Player)) }
function MaidQuartersCannotUngag() { return (!Player.CanTalk() && InventoryCharacterHasOwnerOnlyRestraint(Player)) }

// Loads the maid quarters room
function MaidQuartersLoad() {

	// Creates the maid that gives work and the initiation maids
	MaidQuartersMaid = CharacterLoadNPC("NPC_MaidQuarters_Maid");
	MaidQuartersMaidInitiation = CharacterLoadNPC("NPC_MaidQuarters_InitiationMaids");
	InventoryWear(MaidQuartersMaidInitiation, "WoodenPaddle", "ItemMisc");

}

// Run the maid quarters, draw both characters (The screen can be used for the search daily job)
function MaidQuartersRun() {
	MaidQuartersCanBecomeMaid = (!LogQuery("JoinedSorority", "Maid") && (ReputationGet("Maid") >= 50));
	MaidQuartersCannotBecomeMaidYet = ((ReputationGet("Maid") > 0) && (ReputationGet("Maid") < 50) && !LogQuery("JoinedSorority", "Maid"));
	MaidQuartersCanBecomeHeadMaid = ((ReputationGet("Maid") >= 100) && (ReputationGet("Dominant") >= 50) && LogQuery("JoinedSorority", "Maid") && !LogQuery("LeadSorority", "Maid"));
	MaidQuartersCannotBecomeHeadMaidYet = (((ReputationGet("Maid") < 100) || (ReputationGet("Dominant") < 50)) && LogQuery("JoinedSorority", "Maid") && !LogQuery("LeadSorority", "Maid"));
	MaidQuartersIsMaid = LogQuery("JoinedSorority", "Maid");
	MaidQuartersIsHeadMaid = LogQuery("LeadSorority", "Maid");
	if (!DailyJobSubSearchIsActive()) DrawCharacter(Player, 500, 0, 1);
	if (!DailyJobSubSearchIsActive()) DrawCharacter(MaidQuartersMaid, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	DailyJobSubSearchRun();
}

// When the user clicks in the maid quarters
function MaidQuartersClick() {
	if (!DailyJobSubSearchIsActive() && (MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if (!DailyJobSubSearchIsActive() && (MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) {
		ManagementClubSlaveDialog(MaidQuartersMaid);
		CharacterSetCurrent(MaidQuartersMaid);
		if (MaidQuartersMaid.Stage == "285") MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, (MaidQuartersOnlineDrinkCompleted()) ? "MaidDrinkOnlineComplete" : "MaidDrinkOnlineIncomplete");
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	DailyJobSubSearchClick();
}

// The maid can ungag the player
function MaidQuartersMaidUngagPlayer() {
	if (MaidQuartersMaid.CanInteract()) {
		if (!MaidQuartersMaidReleasedPlayer) {
			ReputationProgress("Dominant", -1);
			MaidQuartersMaidReleasedPlayer = true;
		}
		InventoryRemove(Player, "ItemMouth");
		InventoryRemove(Player, "ItemMouth2");
		InventoryRemove(Player, "ItemMouth3");
		InventoryRemove(Player, "ItemHead");
	} else MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "CantReleasePlayer");
}

// When the player dresses as a maid
function MaidQuartersWearMaidUniform() {
	for (var ItemAssetGroupName in MaidQuartersItemClothPrev) {
		MaidQuartersItemClothPrev[ItemAssetGroupName] = InventoryGet(Player, ItemAssetGroupName);
		InventoryRemove(Player, ItemAssetGroupName);
	}
	InventoryWear(Player, "MaidOutfit1", "Cloth", "Default");
	InventoryWear(Player, "MaidHairband1", "Hat", "Default");
}

// When the player removes the maid uniform and dresses back
function MaidQuartersRemoveMaidUniform() {
	CharacterReleaseNoLock(Player);
	for (var ItemAssetGroupName in MaidQuartersItemClothPrev) {
		var PreviousItem = MaidQuartersItemClothPrev[ItemAssetGroupName];
		InventoryRemove(Player, ItemAssetGroupName);
		if (PreviousItem) InventoryWear(Player, PreviousItem.Asset.Name, ItemAssetGroupName, PreviousItem.Color);
		if (PreviousItem && PreviousItem.Property) InventoryGet(Player, ItemAssetGroupName).Property = PreviousItem.Property;
		MaidQuartersItemClothPrev[ItemAssetGroupName] = null;
	}
	InventoryRemove(Player, "ItemMisc");
	CharacterRefresh(Player);
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
	if (MiniGameVictory && (MiniGameType == "RhythmGame")) MaidQuartersMaid.Stage = "590";
	if (!MiniGameVictory && (MiniGameType == "RhythmGame")) MaidQuartersMaid.Stage = "591";
	MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, MiniGameType + (MiniGameVictory ? "Victory" : "Defeat"));
}

// When the mini game / maid chore is successful, the player gets paid
function MaidQuartersMiniGamePay() {
	ReputationProgress("Maid", 4);
	var M = 10;
	if (MiniGameDifficulty == "Normal") M = M * 1.5;
	if (MiniGameDifficulty == "Hard") M = M * 2;
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", M.toString());
	CharacterChangeMoney(Player, M);
	IntroductionJobProgress("SubMaid");
}

// When the music mini game is successful, the player gets paid
function MaidQuartersMiniGamePayAdvanced() {
	ReputationProgress("Maid", 4);
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", MiniGameAdvancedPayment.toString());
	CharacterChangeMoney(Player, MiniGameAdvancedPayment);
	IntroductionJobProgress("SubMaid");
}

// When the rescue is successful, the player gets paid
function MaidQuartersRescuePay() {
	MaidQuartersRemoveMaidUniform();
	ReputationProgress("Maid", 4);
	var M = 10 + Math.floor(Math.random() * 11);
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", M.toString());
	CharacterChangeMoney(Player, M);
	IntroductionJobProgress("SubMaid");
}

// When the maid releases the player
function MaidQuartersMaidReleasePlayer() {
	if (MaidQuartersMaid.CanInteract()) {
		if (!MaidQuartersMaidReleasedPlayer) {
			ReputationProgress("Dominant", -1);
			MaidQuartersMaidReleasedPlayer = true;
		}
		CharacterReleaseNoLock(Player);
	} else MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "CantReleasePlayer");
}

// Prepares a counter that will affect the dominant reputation of the player
function MaidQuartersDominantRepChange(Value) {
	MaidQuartersDominantRep = MaidQuartersDominantRep + parseInt(Value);
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
	InventoryAdd(Player, "MaidOutfit2", "Cloth");
	InventoryAdd(Player, "MaidApron1", "Cloth");
	InventoryAdd(Player, "MaidApron2", "Cloth");
	InventoryAdd(Player, "MaidHairband1", "Hat");
	InventoryWear(Player, "MaidOutfit1", "Cloth", "Default");
	InventoryWear(Player, "MaidHairband1", "Hat", "Default");
	LogAdd("JoinedSorority", "Maid");
	ReputationProgress("Dominant", MaidQuartersDominantRep);
	MaidQuartersCanBecomeMaid = false;
	MaidQuartersIsMaid = true;
}

// When the player becomes head maid
function MaidQuartersBecomHeadMaid() {
	MaidQuartersIsHeadMaid = true;
	MaidQuartersMaid.AllowItem = true;
	LogAdd("LeadSorority", "Maid");
}

// Starts a maid rescue mission in a random room
function MaidQuartersStartRescue() {
	
	// Make sure we don't select the same room twice or sent rescue to the introduction room when doing the daily quest
	MaidQuartersCurrentRescue = CommonRandomItemFromList(MaidQuartersCurrentRescue, MaidQuartersRescueList);
	if ((MaidQuartersCurrentRescue == "IntroductionClass") && (IntroductionJobCurrent == "SubMaid")) MaidQuartersCurrentRescue = CommonRandomItemFromList(MaidQuartersCurrentRescue, ["ShibariDojo", "Shop", "Gambling"]);
	MaidQuartersMaid.Stage = MaidQuartersRescueStage[MaidQuartersRescueList.indexOf(MaidQuartersCurrentRescue)];
	MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "Rescue" + MaidQuartersCurrentRescue);
	MaidQuartersCurrentRescueStarted = false;
	MaidQuartersCurrentRescueCompleted = false;
	
	MaidQuartersItemClothPrev.Cloth = InventoryGet(Player, "Cloth");
	MaidQuartersItemClothPrev.Hat = InventoryGet(Player, "Hat");

}

// Cancels the current rescue mission
function MaidQuartersCancelRescue() {
	MaidQuartersRemoveMaidUniform();
	if (MaidQuartersCurrentRescue == "IntroductionClass") { IntroductionCompleteRescue(); IntroductionMaid.Stage = "0"; }
	if (MaidQuartersCurrentRescue == "ShibariDojo") { ShibariCompleteRescue(); ShibariTeacher.Stage = "0"; }
	if (MaidQuartersCurrentRescue == "Shop") { ShopCompleteRescue(); ShopVendor.Stage = "0"; }
	if (MaidQuartersCurrentRescue == "Gambling") { GamblingCompleteRescue(); GamblingFirstSub.Stage = "0"; }
}

// The player as head maid can trick the maids into freeing Sarah
function MaidQuartersFreeSarah() {
	SarahUnlock();
}

// The maid can give a duster gag to the player if she's in the sorority
function MaidQuartersGetDusterGag() {
	InventoryAdd(Player, "DusterGag", "ItemMouth");
	InventoryAdd(Player, "DusterGag", "ItemMouth2");
	InventoryAdd(Player, "DusterGag", "ItemMouth3");
}

// When the online drink mini game starts
function MaidQuartersOnlineDrinkStart() {
	InventoryWear(Player, "WoodenMaidTrayFull", "ItemMisc");
	MaidQuartersOnlineDrinkCount = 0;
	MaidQuartersOnlineDrinkValue = 0;
	ChatRoomMoneyForOwner = 0;
	MaidQuartersOnlineDrinkCustomer = [];
}

// If an online player picked a drink from the maid tray, the same player/customer cannot pick twice
function MaidQuartersOnlineDrinkPick(MemberNumber, DrinkValue) {
	if ((MaidQuartersOnlineDrinkCount < 5) && (MaidQuartersOnlineDrinkCustomer.indexOf(MemberNumber) < 0)) {
		MaidQuartersOnlineDrinkCount++;
		MaidQuartersOnlineDrinkValue = MaidQuartersOnlineDrinkValue + DrinkValue;
		MaidQuartersOnlineDrinkCustomer.push(MemberNumber);
		if (MaidQuartersOnlineDrinkCount >= 5) {
			InventoryWear(Player, "WoodenMaidTray", "ItemMisc");
			CharacterRefresh(Player);
			ChatRoomCharacterUpdate(Player);
		}
	}
}

// When the maid tray is empty, the player can get paid (40% of drink value + 10$)
function MaidQuartersOnlineDrinkPay() {
	var M = 10 + Math.floor(MaidQuartersOnlineDrinkValue * 0.4);
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", M.toString());
	if (!MaidQuartersOnlineDrinkFromOwner) CharacterChangeMoney(Player, M);
	else ChatRoomMoneyForOwner = M;
	ReputationProgress("Maid", 4);
	IntroductionJobProgress("SubMaid");
}

// Flags the maid drink as not from the player owner
function MaidQuartersNotFromOwner() {
	MaidQuartersOnlineDrinkFromOwner = false;
}