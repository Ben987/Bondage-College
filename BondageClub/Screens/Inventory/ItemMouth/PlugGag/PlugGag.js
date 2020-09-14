"use strict";

var InventoryItemMouthPlugGagOptions = [
	{
		Name: "Open",
		Property: {
			Type: null,
			Effect: ["GagMedium", "OpenMouth"],
		},
	},
	{
		Name: "Plug",
		Property: {
			Type: "Plug",
			Effect: ["BlockMouth", "GagTotal"],
		},
	},
];

// Loads the item extension properties
function InventoryItemMouthPlugGagLoad() {
	ExtendedItemLoad(InventoryItemMouthPlugGagOptions, "SelectGagType");
}

// Draw the item extension screen
function InventoryItemMouthPlugGagDraw() {
	ExtendedItemDraw(InventoryItemMouthPlugGagOptions, "PlugGagMouthType");
}

// Catches the item extension clicks
function InventoryItemMouthPlugGagClick() {
	ExtendedItemClick(InventoryItemMouthPlugGagOptions);
}

function InventoryItemMouthPlugGagPublishAction(C, Option) {
	var msg = "PlugGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthPlugGagNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthPlugGag" + Option.Name, "ItemMouth");
}
