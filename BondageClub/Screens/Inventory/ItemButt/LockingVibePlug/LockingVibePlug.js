"use strict";

function InventoryItemButtLockingVibePlugLoad() {
	VibratorModeLoad([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function InventoryItemButtLockingVibePlugDraw() {
	VibratorModeDraw([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function InventoryItemButtLockingVibePlugClick() {
	VibratorModeClick([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function AssetsItemButtLockingVibePlugScriptDraw(data) {
	VibratorModeScriptDraw(data);
}
