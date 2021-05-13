"use strict";

var InventoryItemHeadRibbonsOptions = [
	{
		Name: "Basic",
		Property: {
			Type: null,
			Effect: ["BlindLight", "Prone"],
		},
	},
	{
		Name: "Wrap",
		Property: {
			Type: "Wrap",
			Effect: ["BlindNormal", "Prone"],
		},
	},
];

// Loads the item extension properties
function InventoryItemHeadRibbonsLoad() {
	ExtendedItemLoad(InventoryItemHeadRibbonsOptions, "SelectRibbonType");
}

// Draw the item extension screen
function InventoryItemHeadRibbonsDraw() {
	ExtendedItemDraw(InventoryItemHeadRibbonsOptions, "RibbonsHead");
}

// Catches the item extension clicks
function InventoryItemHeadRibbonsClick() {
	ExtendedItemClick(InventoryItemHeadRibbonsOptions);
}

function InventoryItemHeadRibbonsPublishAction(C, Option) {
	var Message = "HeadRibbonsSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(Message, true, Dictionary);
}

function InventoryItemHeadRibbonsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemHeadRibbons" + Option.Name, "ItemHead");
}