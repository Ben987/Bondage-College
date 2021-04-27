"use strict";
var InventoryBunnyMask1Options = [
	{
		Name: "Ears",
		Property: {
			Type: null,
			OverridePriority: 53
		},
	},
	{
		Name: "Earless",
		Property: {
			Type: "Earless",
			OverridePriority: 51
		},
	},
];

// Loads the item extension properties
function InventoryMaskBunnyMask1Load() {
	ExtendedItemLoad(InventoryBunnyMask1Options, "SelectBunnyMaskStyle");
}

// Draw the item extension screen
function InventoryMaskBunnyMask1Draw(IsCloth) {
	ExtendedItemDraw(InventoryBunnyMask1Options, "BunnyMaskType", null, true, true);
}

// Catches the item extension clicks
function InventoryMaskBunnyMask1Click(IsCloth) {
	ExtendedItemClick(InventoryBunnyMask1Options, true);
}