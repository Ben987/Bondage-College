"use strict";
var InventoryItemTorsoLatexCorset1Options = [
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
function InventoryItemTorsoLatexCorset1Load() {
	ExtendedItemLoad(InventoryItemTorsoLatexCorset1Options, "SelectStyle");
}

// Draw the item extension screen
function InventoryItemTorsoLatexCorset1Draw() {
	ExtendedItemDraw(InventoryItemTorsoLatexCorset1Options, "StyleType", null, true, false);
}

// Catches the item extension clicks
function InventoryItemTorsoLatexCorset1Click() {
	ExtendedItemClick(InventoryItemTorsoLatexCorset1Options, true);
}