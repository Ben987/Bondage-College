"use strict";
var IntroductionBackground = "Introduction";
var IntroductionMaid = null;
var IntroductionSub = null;
var IntroductionMaidOpinion = 0;
var IntroductionHasBasicItems = false;
var IntroductionSubRestrained = false;
var IntroductionIsMaid = false;
var IntroductionIsHeadMaid = false;
var IntroductionRescueScenario = "";
var IntroductionRescueScenarioList = ["LatexWoman", "Newcomer", "MaidFight", "SalesWoman"];

// Returns TRUE if the dialog situation is allowed
function IntroductionIsRescueScenario(ScenarioName) { return (IntroductionRescueScenario == ScenarioName) }
function IntroductionIsBothFree() { return (!IntroductionMaid.IsRestrained() && IntroductionMaid.CanTalk() && !IntroductionSub.IsRestrained() && IntroductionMaid.CanTalk()) }
function IntroductionIsMaidRestrained() { return (IntroductionMaid.IsRestrained() || !IntroductionMaid.CanTalk()) }
function IntroductionNoTitle() { return (!LogQuery("JoinedSorority", "Maid") && !LogQuery("ClubMistress", "Management")) }

// Loads the introduction room
function IntroductionLoad() {

	// Checks if the player already has the basic items
	IntroductionHasBasicItems = (InventoryAvailable(Player, "NylonRope", "ItemFeet") && InventoryAvailable(Player, "NylonRope", "ItemLegs") && InventoryAvailable(Player, "NylonRope", "ItemArms") && InventoryAvailable(Player, "ClothGag", "ItemMouth"));
	IntroductionIsMaid = LogQuery("JoinedSorority", "Maid");
	IntroductionIsHeadMaid = LogQuery("LeadSorority", "Maid");
	
	// Creates two characters to begin with
	IntroductionMaid = CharacterLoadNPC("NPC_Introduction_Maid");
	IntroductionSub = CharacterLoadNPC("NPC_Introduction_Sub");

	// Rescue mission load
	if ((MaidQuartersCurrentRescue == "IntroductionClass") && !MaidQuartersCurrentRescueStarted) {
		MaidQuartersCurrentRescueStarted = true;
		InventoryAdd(IntroductionMaid, "LeatherArmbinder", "ItemArms");
		InventoryAdd(IntroductionMaid, "LeatherBelt", "ItemLegs");
		InventoryAdd(IntroductionMaid, "LeatherBelt", "ItemFeet");
		InventoryWear(IntroductionMaid, "LeatherArmbinder", "ItemArms");
		InventoryWear(IntroductionMaid, "LeatherBelt", "ItemLegs");
		InventoryWear(IntroductionMaid, "LeatherBelt", "ItemFeet");
		InventoryWearRandom(IntroductionMaid, "ItemMouth");
		InventoryAdd(IntroductionSub, "LeatherArmbinder", "ItemArms");
		InventoryAdd(IntroductionSub, "LeatherBelt", "ItemLegs");
		InventoryAdd(IntroductionSub, "LeatherBelt", "ItemFeet");
		InventoryWear(IntroductionSub, "LeatherArmbinder", "ItemArms");
		InventoryWear(IntroductionSub, "LeatherBelt", "ItemLegs");
		InventoryWear(IntroductionSub, "LeatherBelt", "ItemFeet");
		InventoryWearRandom(IntroductionSub, "ItemMouth");
		IntroductionMaid.Stage = "MaidRescue";
		IntroductionMaid.AllowItem = true;
		IntroductionSub.Stage = "MaidRescue";
		IntroductionRescueScenario = CommonRandomItemFromList(IntroductionRescueScenario, IntroductionRescueScenarioList);
	}

}

// Run the main introduction room, draw all 3 characters
function IntroductionRun() {
	IntroductionSubRestrained = (!IntroductionSub.CanTalk() && !IntroductionSub.CanWalk() && !IntroductionSub.CanInteract());
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(IntroductionMaid, 750, 0, 1);
	DrawCharacter(IntroductionSub, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the introduction room
function IntroductionClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(IntroductionMaid);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(IntroductionSub);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// The maid opinion will affect the global player Domme/sub reputation at the end of the first training
function IntroductionChangeMaidOpinion(Bonus) {
	IntroductionMaidOpinion = IntroductionMaidOpinion + parseInt(Bonus);
}

// Gives focus on certain body parts with rectangles
function IntroductionSetZone(NewZone) {
	for (var A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == NewZone) {
			Player.FocusGroup = AssetGroup[A];
			CurrentCharacter.FocusGroup = AssetGroup[A];
			break;
		}
}

// Clears the body part focus rectangles
function IntroductionClearZone() {
	Player.FocusGroup = null;
	CurrentCharacter.FocusGroup = null;
}

// The maid can give basic items to the player
function IntroductionGetBasicItems() {
	InventoryAdd(Player, "NylonRope", "ItemFeet");
	InventoryAdd(Player, "NylonRope", "ItemLegs");
	InventoryAdd(Player, "NylonRope", "ItemArms");
	InventoryAdd(Player, "ClothGag", "ItemMouth");
	InventoryAdd(Player, "ClothGag", "ItemMouth2");
	InventoryAdd(Player, "ClothGag", "ItemMouth3");
	IntroductionHasBasicItems = true;
}

// Saves the maid opinion of the player to the server
function IntroductionSaveMaidOpinion() {
	if (!LogQuery("MaidOpinion", "Introduction")) {
		LogAdd("MaidOpinion", "Introduction");
		ReputationProgress("Dominant", IntroductionMaidOpinion);
	}
}

// Returns TRUE if the maid can restrain the player
function IntroductionAllowRestrainPlayer() {
	return (Player.CanInteract() && IntroductionMaid.CanInteract());
}

// Gags the player unless she's head maid
function IntroductionGagPlayer() {
	if (IntroductionIsHeadMaid) {
		CharacterRelease(Player);
		IntroductionMaid.CurrentDialog = DialogFind(IntroductionMaid, "ReleaseHeadMaid");
		IntroductionMaid.Stage = "370";
	} else DialogWearItem("ClothGag", "ItemMouth");
}

// When the player rescue both girls and completes the mission
function IntroductionCompleteRescue() {
	IntroductionMaid.AllowItem = LogQuery("LeadSorority", "Maid");
	CharacterRelease(IntroductionMaid);
	CharacterRelease(IntroductionSub);
	MaidQuartersCurrentRescueCompleted = true;
	IntroductionSub.Stage = "0";
}