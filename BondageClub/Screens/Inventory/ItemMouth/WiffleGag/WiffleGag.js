"use strict";

var InventoryItemMouthWiffleGagOptions = [
	{
		Name: "Normal",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Tight",
		Property: {
			Type: "Tight",
		},
	},
];

// Loads the item extension properties
function InventoryItemMouthWiffleGagLoad() {
	ExtendedItemLoad(InventoryItemMouthWiffleGagOptions, "SelectGagType");
}

// Draw the item extension screen
function InventoryItemMouthWiffleGagDraw() {
	ExtendedItemDraw(InventoryItemMouthWiffleGagOptions, "BallGagMouthType");
}

// Catches the item extension clicks
function InventoryItemMouthWiffleGagClick() {
	ExtendedItemClick(InventoryItemMouthWiffleGagOptions);
}

function InventoryItemMouthWiffleGagPublishAction(C, Option) {
	var msg = "BallGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthWiffleGagNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthWiffleGag" + Option.Name, "ItemMouth");
}
