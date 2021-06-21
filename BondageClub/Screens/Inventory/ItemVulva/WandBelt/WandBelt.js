"use strict";

function InventoryItemVulvaWandBeltLoad() {
	VibratorModeLoad([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function InventoryItemVulvaWandBeltDraw() {
	VibratorModeDraw([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function InventoryItemVulvaWandBeltClick() {
	VibratorModeClick([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function AssetsItemVulvaWandBeltScriptDraw(data) {
	VibratorModeScriptDraw(data);
}
