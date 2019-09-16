"use strict";
var InventoryItemArmsPaddedMittensHarnessMsg = null;

// Loads the item extension properties
function InventoryItemArmsPaddedMittensHarnessLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	InventoryItemArmsPaddedMittensHarnessMsg = null;
}

// Draw the item extension screen
function InventoryItemArmsPaddedMittensHarnessDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	
	if (InventoryItemArmsPaddedMittensHarnessMsg != null) DrawTextWrap(DialogFind(Player, InventoryItemArmsPaddedMittensHarnessMsg), 1100, 550, 800, 160, "White");

	DrawButton(1100, 700, 375, 65, DialogFind(Player, "LockMittens"), "White");
	DrawButton(1525, 700, 375, 65, DialogFind(Player, "RemoveChain"), "White");
}

// Catches the item extension clicks
function InventoryItemArmsPaddedMittensHarnessClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1100) && (MouseX <= 1475) && (MouseY >= 700) && (MouseY <= 765)) InventoryItemArmsPaddedMittensHarnessLock();
	if ((MouseX >= 1525) && (MouseX <= 1900) && (MouseY >= 700) && (MouseY <= 765)) InventoryItemArmsPaddedMittensHarnessChain();
}

// Lock/unlock function
function InventoryItemArmsPaddedMittensHarnessLock() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryAvailable(Player, "Padlock", "ItemArms")) {
		InventoryWear(C, "PaddedMittensHarnessLocked", "ItemArms");
		if (C.ID == 0) ServerPlayerAppearanceSync();
		ChatRoomPublishCustomAction(Player.Name + " " + DialogFind(Player, "padlocks") + " " + C.Name + " " + DialogFind(Player, "mittens") + ".", true);
	} else InventoryItemArmsPaddedMittensHarnessMsg = "NeedPadlock";
}

// Chain/Unchain function
function InventoryItemArmsPaddedMittensHarnessChain() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	InventoryWear(C, "PaddedMittens", "ItemArms");
	if (C.ID == 0) ServerPlayerAppearanceSync();
	ChatRoomPublishCustomAction(Player.Name + " " + DialogFind(Player, "unchains") + " " + C.Name + " " + DialogFind(Player, "mittensfromharness") + ".", true);
}