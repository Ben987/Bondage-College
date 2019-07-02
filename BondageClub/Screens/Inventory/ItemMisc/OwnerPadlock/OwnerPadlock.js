"use strict";

// Loads the item extension properties
function InventoryItemMiscOwnerPadlockLoad() {
}

// Draw the extension screen
function InventoryItemMiscOwnerPadlockDraw() {
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null)) 
		DrawText(DialogFind(Player, "LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
	DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Detail"), 1500, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemMiscOwnerPadlockClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
}