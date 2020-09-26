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

function InventoryItemFeetChainsValidate(Option) {
	var C = CharacterGetCurrent();
	if (Option.Prerequisite != null && !InventoryAllow(C, Option.Prerequisite, true)) {
		DialogExtendedMessage = DialogText;
		return false;
	}

	if (InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		return false;
	}

	return true;
}
