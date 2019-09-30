"use strict";

// Loads the item extension properties
function InventoryItemMiscMetalPadlockLoad() {
}

// Draw the extension screen
function InventoryItemMiscMetalPadlockDraw() {
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null)) 
		DrawText(DialogFind(Player, "LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemMiscMetalPadlockClick() {
}