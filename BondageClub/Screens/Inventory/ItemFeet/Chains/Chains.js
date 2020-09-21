"use strict";
var InventoryItemFeetChainsOptions = [
	{
		Name: "Basic",
		BondageLevel: 0,
		Property: { Type: null, Difficulty: 0, SetPose: null },
	},
	{
		Name: "Strict",
		BondageLevel: 2,
		Property: { Type: "Strict", Difficulty: 2, SetPose: null },
	},
	{
		Name: "Suspension",
		BondageLevel: 6,
		Prerequisite: ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"],
		Property: {
			Type: "Suspension",
			Difficulty: 4,
			SetPose: ["Suspension", "LegsClosed"],
		},
	},
];

// Loads the item extension properties
function InventoryItemFeetChainsLoad() {
	ExtendedItemLoad(InventoryItemFeetChainsOptions, "SelectChainBondage");
}

// Draw the item extension screen
function InventoryItemFeetChainsDraw() {
	ExtendedItemDraw(InventoryItemFeetChainsOptions, "ChainBondage");
}

// Catches the item extension clicks
function InventoryItemFeetChainsClick() {
	ExtendedItemClick(InventoryItemFeetChainsOptions);
}

function InventoryItemFeetChainsPublishAction(C, Option) {
	var msg = "LegChainSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemFeetChainsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ChainBondage" + Option.Name, "ItemFeet");
}

function InventoryItemFeetChainsValidate() {
	var C = CharacterGetCurrent();
	var Allowed = true;
	if (InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		return false;
	}
	
	// Validates some prerequisites before allowing more advanced types
	if (Option.Prerequisite) {
		var Chain = InventoryGet(C, "ItemFeet");
		InventoryRemove(C, "ItemFeet");

		if (!InventoryAllow(C, Option.Prerequisite, true)) {
			DialogExtendedMessage = DialogText;
			Allowed = false;
		}

		// Re-add the web
		var DifficultyFactor = Chain.Difficulty - Chain.Asset.Difficulty;
		CharacterAppearanceSetItem(C, "ItemArms", Chain.Asset, Chain.Color, DifficultyFactor, null, false);
		InventoryGet(C, "ItemFeet").Property = Chain.Property;
		CharacterRefresh(C);
	}
	
	return Allowed;
}