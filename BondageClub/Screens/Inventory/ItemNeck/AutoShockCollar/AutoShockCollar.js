"use strict";

// Loads the item extension properties
function InventoryItemNeckAutoShockCollarLoad() {
	InventoryItemNeckAccessoriesCollarAutoShockUnitLoad();
}

// Draw the item extension screen
function InventoryItemNeckAutoShockCollarDraw() {
	InventoryItemNeckAccessoriesCollarAutoShockUnitDraw();
}

// Catches the item extension clicks
function InventoryItemNeckAutoShockCollarClick() {
	InventoryItemNeckAccessoriesCollarAutoShockUnitClick();
}

function AssetsItemNeckAutoShockCollarBeforeDraw(data) {
	return AssetsItemNeckAccessoriesCollarAutoShockUnitBeforeDraw(data);
}

function AssetsItemNeckAutoShockCollarScriptDraw(data) {
	AssetsItemNeckAccessoriesCollarAutoShockUnitScriptDraw(data);
}
