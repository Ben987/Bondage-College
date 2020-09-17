"use strict";

var InventoryItemMouthMilkBottleOptions = [
	{
		Name: "Rest",
		Property: { Type: null },
	},
	{
		Name: "Raised",
		Property: { Type: "Raised" },
	},
	{
		Name: "Chug",
		Property: { Type: "Chug" },
	},	
];

// Loads the item extension properties
function InventoryItemMouthMilkBottleLoad() {
	ExtendedItemLoad(InventoryItemMouthMilkBottleOptions, "SelectMilkBottleState");
}

// Draw the item extension screen
function InventoryItemMouthMilkBottleDraw() {
	ExtendedItemDraw(InventoryItemMouthMilkBottleOptions, "MilkBottle");
}

// Catches the item extension clicks
function InventoryItemMouthMilkBottleClick() {
	ExtendedItemClick(InventoryItemMouthMilkBottleOptions);
}

function InventoryItemMouthMilkBottlePublishAction(C, Option) {
	var msg = "MilkBottleSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthMilkBottleNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "MilkBottle" + Option.Name, "ItemMouth");
}
