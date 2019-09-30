"use strict";

// Loads the item extension properties
function InventoryItemMiscIntricatePadlockLoad() {
}

// Draw the extension screen
function InventoryItemMiscIntricatePadlockDraw() {
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null)) 
		DrawText(DialogFind(Player, "LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemMiscIntricatePadlockClick() {
}