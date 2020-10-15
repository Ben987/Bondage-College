"use strict";

function InventoryItemPelvisFuturisticChastityBeltLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else
		InventoryItemPelvisMetalChastityBeltLoad();
}

function InventoryItemPelvisFuturisticChastityBeltDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else
		InventoryItemPelvisMetalChastityBeltDraw();
	
}

function InventoryItemPelvisFuturisticChastityBeltClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else
		InventoryItemPelvisMetalChastityBeltClick();
}

function InventoryItemPelvisFuturisticChastityBeltExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}

function InventoryItemPelvisFuturisticChastityBeltPublishAction(C, Option) { InventoryItemPelvisMetalChastityBeltPublishAction(C, Option); }

function InventoryItemPelvisFuturisticChastityBeltValidate(C) { 
	return InventoryItemMouthFuturisticPanelGagValidate(C, Option); // All futuristic items refer to the gag
}




function InventoryItemPelvisFuturisticChastityBeltNpcDialog(C, Option) { InventoryItemPelvisMetalChastityBeltNpcDialog(C, Option); }
