"use strict";

// Loads the item extension properties
function InventoryItemTorsoFuturisticHarnessLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} 
}

// Draw the item extension screen
function InventoryItemTorsoFuturisticHarnessDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else {
		
		DrawAssetPreview(1387, 75, DialogFocusItem.Asset);
		
		var FuturisticCollarItems = InventoryItemNeckFuturisticCollarGetItems(C)
		
		if (FuturisticCollarItems.length > 0) {
			DrawButton(1400, 910, 200, 55, DialogFindPlayer("FuturisticCollarColor"), "White");
		}
	}
}

// Catches the item extension clicks
function InventoryItemTorsoFuturisticHarnessClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else {
		
		if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemTorsoFuturisticHarnessExit();
		
		var FuturisticCollarItems = InventoryItemNeckFuturisticCollarGetItems(C)
		if (MouseIn(1400, 910, 200, 55) && FuturisticCollarItems.length > 0 && DialogFocusItem) { InventoryItemNeckFuturisticCollarColor(C, DialogFocusItem); InventoryItemTorsoFuturisticHarnessExit();}
	}
}

function InventoryItemTorsoFuturisticHarnessExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}