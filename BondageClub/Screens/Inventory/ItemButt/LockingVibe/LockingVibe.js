"use strict";

function InventoryItemButtLockingVibeLoad() {
	VibratorModeLoad([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function InventoryItemButtLockingVibeDraw() {
	VibratorModeDraw([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function InventoryItemButtLockingVibeClick() {
	VibratorModeClick([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function AssetsItemButtLockingVibeScriptDraw(data) {
	VibratorModeScriptDraw(data);
}
