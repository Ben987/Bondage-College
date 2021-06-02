"use strict";

var InventoryItemArmsRibbonsOptions = [
	{
		Name: "Cross",
		Property: { Type: null, Difficulty: 1 },
	}, {
		Name: "Heavy",
		SelfBondageLevel: 4,
		Property: { Type: "Heavy", Difficulty: 2 }
	},
];

// Loads the item extension properties
function InventoryItemArmsRibbonsLoad() {
	ExtendedItemLoad(InventoryItemArmsRibbonsOptions, "SelectRibbonType");
}

// Draw the item extension screen
function InventoryItemArmsRibbonsDraw() {
	ExtendedItemDraw(InventoryItemArmsRibbonsOptions, "RibbonsArms");
}

function InventoryItemArmsRibbonsClick() {
	ExtendedItemClick(InventoryItemArmsRibbonsOptions);
}

function InventoryItemArmsRibbonsPublishAction(C, Option) {
	var msg = "ArmsRibbonsSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemArmsRibbonsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsRibbons" + Option.Name, "ItemArms");
}
