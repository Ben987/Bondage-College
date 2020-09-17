"use strict";

var InventoryItemMouthDuctTapeOptions = [
	{
		Name: "Small",
		Property: {
			Type: null,
			Effect: ["BlockMouth", "GagVeryLight"],
		},
	},
	{
		Name: "Crossed",
		Property: {
			Type: "Crossed",
			Effect: ["BlockMouth", "GagLight"],
		},
	},
	{
		Name: "Full",
		Property: {
			Type: "Full",
			Effect: ["BlockMouth", "GagEasy"],
		},
	},
	{
		Name: "Double",
		Property: {
			Type: "Double",
			Effect: ["BlockMouth", "GagNormal"],
		},
	},
	{
		Name: "Cover",
		Property: {
			Type: "Cover",
			Effect: ["BlockMouth", "GagMedium"],
		},
	},
];

// Loads the item extension properties
function InventoryItemMouthDuctTapeLoad() {
	ExtendedItemLoad(InventoryItemMouthDuctTapeOptions, "SelectGagType");
}

// Draw the item extension screen
function InventoryItemMouthDuctTapeDraw() {
	ExtendedItemDraw(InventoryItemMouthDuctTapeOptions, "DuctTapeMouthType");
}

// Catches the item extension clicks
function InventoryItemMouthDuctTapeClick() {
	ExtendedItemClick(InventoryItemMouthDuctTapeOptions);
}

function InventoryItemMouthDuctTapePublishAction(C, Option) {
	var msg = "DuctTapeMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthDuctTapeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthDuctTape" + Option.Name, "ItemMouth");
}