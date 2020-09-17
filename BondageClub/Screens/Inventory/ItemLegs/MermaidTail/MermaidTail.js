"use strict";

function InventoryItemLegsMermaidTailLoad() {
	VibratorModeLoad([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function InventoryItemLegsMermaidTailDraw() {
	VibratorModeDraw([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function InventoryItemLegsMermaidTailClick() {
	VibratorModeClick([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function AssetsItemLegsMermaidTailScriptDraw(data) {
	VibratorModeScriptDraw(data);
}