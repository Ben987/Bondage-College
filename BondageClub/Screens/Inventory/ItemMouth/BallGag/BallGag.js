"use strict";

var InventoryItemMouthBallGagOptions = [
	{
		Name: "Normal",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Shiny",
		Property: {
			Type: "Shiny",
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
function InventoryItemMouthBallGagLoad() {
	ExtendedItemLoad(InventoryItemMouthBallGagOptions, "SelectGagType");
}

// Draw the item extension screen
function InventoryItemMouthBallGagDraw() {
	ExtendedItemDraw(InventoryItemMouthBallGagOptions, "BallGagMouthType");
}

// Catches the item extension clicks
function InventoryItemMouthBallGagClick() {
	ExtendedItemClick(InventoryItemMouthBallGagOptions);
}

function InventoryItemMouthBallGagPublishAction(C, Option) {
	var msg = "BallGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthBallGagGagNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthBallGag" + Option.Name, "ItemMouth");
}
