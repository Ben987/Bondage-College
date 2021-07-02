"use strict";
var InventoryBraCuteBikini1Options = [
	{
		Name: "Open",
		Property: {
			Type: null, 
		},
	},
	{
		Name: "Closed",
		Property: {
		Type: "Closed"
		},
	},
];
// Loads the item extension properties
function InventoryBraCuteBikini1Load() {
	ExtendedItemLoad(InventoryBraCuteBikini1Options, "SelectBikiniType");
}

// Draw the item extension screen
function InventoryBraCuteBikini1Draw() {
	ExtendedItemDraw(InventoryBraCuteBikini1Options, "BikiniType");
}

// Catches the item extension clicks
function InventoryBraCuteBikini1Click() {
	ExtendedItemClick(InventoryBraCuteBikini1Options);
}
