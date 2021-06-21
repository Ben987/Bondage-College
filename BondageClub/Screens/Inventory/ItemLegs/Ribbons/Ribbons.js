"use strict";

var InventoryItemLegsRibbonsOptions = [
	{
		Name: "Messystyle",
		Property: { Type: null, Difficulty: 3 },
	},
	{
		Name: "MessyWrap",
		Property: { Type: "MessyWrap", Difficulty: 4 },
	},
	{
		Name: "Cross",
		Property: { Type: "Cross", Difficulty: 5 },
	},
];

// Loads the item extension properties
function InventoryItemLegsRibbonsLoad() {
	ExtendedItemLoad(InventoryItemLegsRibbonsOptions, "SelectRibbonType");
}

// Draw the item extension screen
function InventoryItemLegsRibbonsDraw() {
	ExtendedItemDraw(InventoryItemLegsRibbonsOptions, "RibbonsLegs");
}

// Catches the item extension clicks
function InventoryItemLegsRibbonsClick() {
	ExtendedItemClick(InventoryItemLegsRibbonsOptions);
}

function InventoryItemLegsRibbonsPublishAction(C, Option) {
	var msg = "LegsRibbonsSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemLegsRibbonsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemLegsRibbons" + Option.Name, "ItemLegs");
}
