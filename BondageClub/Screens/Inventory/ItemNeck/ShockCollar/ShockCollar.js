"use strict";

// Loads the item extension properties
function InventoryItemNeckShockCollarLoad() {
	InventoryItemNeckAccessoriesCollarShockUnitLoad();
}

// Draw the item extension screen
function InventoryItemNeckShockCollarDraw() {
	InventoryItemNeckAccessoriesCollarShockUnitDraw();
}

// Catches the item extension clicks
function InventoryItemNeckShockCollarClick() {
	InventoryItemNeckAccessoriesCollarShockUnitClick();
}

function AssetsItemNeckShockCollarBeforeDraw(data) {
	return AssetsItemNeckAccessoriesCollarShockUnitBeforeDraw(data);
}

function AssetsItemNeckShockCollarScriptDraw(data) {
	AssetsItemNeckAccessoriesCollarShockUnitScriptDraw(data);
}
