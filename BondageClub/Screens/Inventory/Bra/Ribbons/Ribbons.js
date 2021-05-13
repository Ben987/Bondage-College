"use strict";
var InventoryBraRibbonsOptions = [
	{
		Name: "Basic",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Bow",
		Property: {
			Type: "Bow",
		},
	},
	{
		Name: "Wrap",
		Property: {
			Type: "Wrap",
		},
	},
];

// Loads the item extension properties
function InventoryBraRibbonsLoad() {
	ExtendedItemLoad(InventoryBraRibbonsOptions, "SelectRibbonStyle");
}

// Draw the item extension screen
function InventoryBraRibbonsDraw() {
	ExtendedItemDraw(InventoryBraRibbonsOptions, "RibbonBraType", null, true);
}

// Catches the item extension clicks
function InventoryBraRibbonsClick() {
	ExtendedItemClick(InventoryBraRibbonsOptions);
}
