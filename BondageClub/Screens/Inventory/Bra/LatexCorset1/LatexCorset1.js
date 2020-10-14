"use strict";
var InventoryBraLatexCorset1Options = [
	{
		Name: "NoGarter",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Garter",
		Property: {
			Type: "Garter",
		},
	},
];

// Loads the item extension properties
function InventoryBraLatexCorset1Load() {
	ExtendedItemLoad(InventoryBraLatexCorset1Options, "SelectStyle");
}

// Draw the item extension screen
function InventoryBraLatexCorset1Draw() {
	ExtendedItemDraw(InventoryBraLatexCorset1Options, "StyleType", null, true, true);
}

// Catches the item extension clicks
function InventoryBraLatexCorset1Click() {
	ExtendedItemClick(InventoryBraLatexCorset1Options, true);
}