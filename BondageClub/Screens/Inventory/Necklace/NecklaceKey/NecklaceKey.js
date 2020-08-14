"use strict";
var InventoryNecklaceNecklaceKeyOptions = [
	{
		Name: "Normal",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Tucked",
		Property: {
			Type: "Tucked",
		},
	},
];

// Loads the item extension properties
function InventoryNecklaceNecklaceKeyLoad() {
	ExtendedItemLoad(InventoryNecklaceNecklaceKeyOptions, "SelectPriorityType");
}

// Draw the item extension screen
function InventoryNecklaceNecklaceKeyDraw() {
	ExtendedItemDraw(InventoryNecklaceNecklaceKeyOptions, "ClothPriorityType");
}

// Catches the item extension clicks
function InventoryNecklaceNecklaceKeyClick() {
	ExtendedItemClick(InventoryNecklaceNecklaceKeyOptions);
}


function InventoryNecklaceNecklaceKeyPublishAction() {
	// No action message for clothes
}

function InventoryNecklaceNecklaceKeyNpcDialog() {
	// No dialog message for clothes
}