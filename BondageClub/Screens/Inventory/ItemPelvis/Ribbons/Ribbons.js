"use strict";

var InventoryItemPelvisRibbonsOptions = [
	{
		Name: "BowWrap",
		Property: { Type: null, Difficulty: 3, OverridePriority: 21 },
	},
	{
		Name: "CrotchWrapping",
		Property: { Type: "CrotchWrapping", Difficulty: 4 },
	},
];

// Loads the item extension properties
function InventoryItemPelvisRibbonsLoad() {
	ExtendedItemLoad(InventoryItemPelvisRibbonsOptions, "SelectRibbonType");
}

// Draw the item extension screen
function InventoryItemPelvisRibbonsDraw() {
	ExtendedItemDraw(InventoryItemPelvisRibbonsOptions, "RibbonsBelt");
}

// Catches the item extension clicks
function InventoryItemPelvisRibbonsClick() {
	ExtendedItemClick(InventoryItemPelvisRibbonsOptions);
}

function InventoryItemPelvisRibbonsPublishAction(C, Option) {
	var msg = "PelvisRibbonsSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemPelvisRibbonsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemPelvisRibbons" + Option.Name, "ItemPelvis");
}
