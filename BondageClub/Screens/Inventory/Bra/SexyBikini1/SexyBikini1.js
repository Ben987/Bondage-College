"use strict";
var InventoryBraSexyBikini1Options = [
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
function InventoryBraSexyBikini1Load() {
	ExtendedItemLoad(InventoryBraSexyBikini1Options, "SelectBikiniType");
}

// Draw the item extension screen
function InventoryBraSexyBikini1Draw() {
	ExtendedItemDraw(InventoryBraSexyBikini1Options, "BikiniType");
	
}

// Catches the item extension clicks
function InventoryBraSexyBikini1Click() {
	ExtendedItemClick(InventoryBraSexyBikini1Options);
}
