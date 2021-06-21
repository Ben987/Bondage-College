"use strict";
var InventoryNecklaceNecklaceKeyOptions = [
	{
		Name: "Normal",
		Property: {
			Type: null,
			OverridePriority: 31
		},
	},
	{
		Name: "Tucked",
		Property: {
			Type: "Tucked",
			OverridePriority: 29
		},
	},
];

// Loads the item extension properties
function InventoryNecklaceNecklaceKeyLoad() {
	ExtendedItemLoad(InventoryNecklaceNecklaceKeyOptions, "SelectPriorityType");
}

// Draw the item extension screen
function InventoryNecklaceNecklaceKeyDraw() {
	ExtendedItemDraw(InventoryNecklaceNecklaceKeyOptions, "ClothPriorityType", null, true);
}

// Catches the item extension clicks
function InventoryNecklaceNecklaceKeyClick() {
	ExtendedItemClick(InventoryNecklaceNecklaceKeyOptions);
}
