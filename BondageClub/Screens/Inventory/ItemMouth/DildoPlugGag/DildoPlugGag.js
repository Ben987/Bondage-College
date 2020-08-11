"use strict";

var InventoryItemMouthDildoPlugGagOptions = [
	{
		Name: "Open",
		Property: {
			Type: null,
			Effect: ["GagEasy"],
		},
	},
	{
		Name: "Plug",
		Property: {
			Type: "Plug",
			Effect: ["BlockMouth", "GagTotal2"],
		},
	},
];

// Loads the item extension properties
function InventoryItemMouthDildoPlugGagLoad() {
	ExtendedItemLoad(InventoryItemMouthDildoPlugGagOptions, "SelectGagType");
}

// Draw the item extension screen
function InventoryItemMouthDildoPlugGagDraw() {
	ExtendedItemDraw(InventoryItemMouthDildoPlugGagOptions, "PlugGagMouthType");
}

// Catches the item extension clicks
function InventoryItemMouthDildoPlugGagClick() {
	ExtendedItemClick(InventoryItemMouthDildoPlugGagOptions);
}

function InventoryItemMouthDildoPlugGagPublishAction(C, Option) {
	var msg = "DildoPlugGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthDildoPlugGagNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthDildoPlugGag" + Option.Name, "ItemMouth");
}
