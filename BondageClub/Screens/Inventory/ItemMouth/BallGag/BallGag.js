"use strict";

var InventoryItemMouthBallGagOptions = [
	{
		Name: "Normal",
		Property: {
			Type: null,
			Effect: ["BlockMouth", "GagMedium"],
		},
	},
	{
		Name: "Shiny",
		Property: {
			Type: "Shiny",
			Effect: ["BlockMouth", "GagMedium"],
		},
	},
	{
		Name: "Tight",
		Property: {
			Type: "Tight",
			Effect: ["BlockMouth", "GagMedium"],
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

function InventoryItemMouthBallGagNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthBallGag" + Option.Name, "ItemMouth");
}
