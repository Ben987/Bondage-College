"use strict";
var InventoryGlassesEyePatch1Options = [
	{
		Name: "Left",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Right",
		Property: {
			Type: "Right",
		},
	},
];
// Loads the item extension properties
function InventoryGlassesEyePatch1Load() {
	ExtendedItemLoad(InventoryGlassesEyePatch1Options, "SelectEyePatchType");
}

// Draw the item extension screen
function InventoryGlassesEyePatch1Draw() {
	ExtendedItemDraw(InventoryGlassesEyePatch1Options, "EyePatchType", null, true);
}

// Catches the item extension clicks
function InventoryGlassesEyePatch1Click() {
	ExtendedItemClick(InventoryGlassesEyePatch1Options);
}
