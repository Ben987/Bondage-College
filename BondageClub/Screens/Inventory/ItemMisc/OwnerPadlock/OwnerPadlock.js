"use strict";

// Loads the item extension properties
function InventoryItemMiscOwnerPadlockLoad() {
}

// Draw the extension screen
function InventoryItemMiscOwnerPadlockDraw() {
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null)) 
		DrawText(DialogFind(Player, "LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
	DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Detail"), 1500, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemMiscOwnerPadlockClick() {
}