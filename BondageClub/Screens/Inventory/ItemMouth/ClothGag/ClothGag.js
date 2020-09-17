"use strict";
var InventoryItemMouthClothGagOptions = [
	{
		Name: "Small",
		Property: {
			Type: null,
			Effect: ["BlockMouth", "GagVeryLight"],
		},
	},
	{
		Name: "Cleave",
		Property: {
			Type: "Cleave",
			Effect: ["BlockMouth", "GagLight"],
		},
	},
	{
		Name: "OTM",
		Property: {
			Type: "OTM",
			Effect: ["BlockMouth", "GagEasy"],
		},
	},
	{
		Name: "OTN",
		Property: {
			Type: "OTN",
			Effect: ["BlockMouth", "GagEasy"],
		},
	},
];

// Loads the item extension properties
function InventoryItemMouthClothGagLoad() {
	ExtendedItemLoad(InventoryItemMouthClothGagOptions, "SelectGagType");
}

// Draw the item extension screen
function InventoryItemMouthClothGagDraw() {
	ExtendedItemDraw(InventoryItemMouthClothGagOptions, "ClothGagType");
}

// Catches the item extension clicks
function InventoryItemMouthClothGagClick() {
	ExtendedItemClick(InventoryItemMouthClothGagOptions);
}

function InventoryItemMouthClothGagPublishAction(C, Option) {
	var msg = "ClothGagSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthClothGagNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ClothGag" + Option.Name, "ItemMouth");
}