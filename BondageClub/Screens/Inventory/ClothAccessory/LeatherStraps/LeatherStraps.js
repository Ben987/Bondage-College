"use strict";
var InventoryClothAccessoryLeatherStrapsOptions = [
	{
		Name: "WrapStrap",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Strap",
		Property: {
			Type: "Strap",
		},
	},
];
// Loads the item extension properties
function InventoryClothAccessoryLeatherStrapsLoad() {
	ExtendedItemLoad(InventoryClothAccessoryLeatherStrapsOptions, "SelectStrapType");
}

// Draw the item extension screen
function InventoryClothAccessoryLeatherStrapsDraw() {
	ExtendedItemDraw(InventoryClothAccessoryLeatherStrapsOptions, "LeatherArmbinderType", null, true);
}

// Catches the item extension clicks
function InventoryClothAccessoryLeatherStrapsClick() {
	ExtendedItemClick(InventoryClothAccessoryLeatherStrapsOptions);
}
