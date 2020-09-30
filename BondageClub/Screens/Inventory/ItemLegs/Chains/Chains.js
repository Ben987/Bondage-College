"use strict";

const InventoryItemLegsChainsOptions = [
	{
		Name: "Basic",
		BondageLevel: 0,
		Property: { Type: null, Difficulty: 0 }
	}, {
		Name: "Strict",
		BondageLevel: 2,
		Property: { Type: "Strict", Difficulty: 2 }
	}
];

function InventoryItemLegsChainsLoad() {
	ExtendedItemLoad(InventoryItemLegsChainsOptions, "SelectChainBondage");
}

function InventoryItemLegsChainsDraw() {
	ExtendedItemDraw(InventoryItemLegsChainsOptions, "ChainBondage");
}

function InventoryItemLegsChainsClick() {
	ExtendedItemClick(InventoryItemLegsChainsOptions);
}

function InventoryItemLegsChainsPublishAction(C, Option) {
	var msg = "LegChainSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemLegsChainsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ChainBondage" + Option.Name, "ItemLegs");
}

function InventoryItemLegsChainsValidate() {
	var Allowed = true;
	if (InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		Allowed = false;
	}
	return Allowed;
}
