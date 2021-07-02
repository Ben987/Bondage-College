"use strict";
var InventoryItemFeetSpreaderMetalOptions = [
	{
		Name: "Narrow",
		Property: {
			Type: null, Effect: ["Prone", "Freeze"], SetPose: ["LegsOpen"],
		}
	},
	{
		Name: "Wide",
		Property: {
			Type: "Wide", Effect: ["Prone", "Freeze"], SetPose: ["Spread"],
		}
	}
];

// Loads the item extension properties
function InventoryItemFeetSpreaderMetalLoad() {
	ExtendedItemLoad(InventoryItemFeetSpreaderMetalOptions, "SelectSpreaderType");
}

// Draw the item extension screen
function InventoryItemFeetSpreaderMetalDraw() {
	ExtendedItemDraw(InventoryItemFeetSpreaderMetalOptions, "SpreaderMetalPose");
}

// Catches the item extension clicks
function InventoryItemFeetSpreaderMetalClick() {
	ExtendedItemClick(InventoryItemFeetSpreaderMetalOptions);
}