"use strict";
var InventoryClothAccessoryBunnyCollarCuffsOptions = [
	{
		Name: "Both",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Collar",
		Property: {
			Type: "Collar", 
		},
	},
	{
		Name: "Cuffs",
		Property: {
			Type: "Cuffs", 
		},
	},
];
// Loads the item extension properties
function InventoryClothAccessoryBunnyCollarCuffsLoad() {
	ExtendedItemLoad(InventoryClothAccessoryBunnyCollarCuffsOptions, "SelectBunnyCuffsStyle");
}

// Draw the item extension screen
function InventoryClothAccessoryBunnyCollarCuffsDraw() {
	ExtendedItemDraw(InventoryClothAccessoryBunnyCollarCuffsOptions, "BunnyCuffsType", null, true);
}

// Catches the item extension clicks
function InventoryClothAccessoryBunnyCollarCuffsClick() {
	ExtendedItemClick(InventoryClothAccessoryBunnyCollarCuffsOptions);
}
