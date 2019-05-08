"use strict";
var InventoryItemArmsPaddedMittensHarnessLockedMsg = null;

// Loads the item extension properties
function InventoryItemArmsPaddedMittensHarnessLockedLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	InventoryItemArmsPaddedMittensHarnessLockedMsg = null;
}

// Draw the item extension screen
function InventoryItemArmsPaddedMittensHarnessLockedDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	
	if (InventoryItemArmsPaddedMittensHarnessLockedMsg != null) DrawTextWrap(DialogFind(Player, InventoryItemArmsPaddedMittensHarnessLockedMsg), 1100, 550, 800, 160, "White");

	DrawButton(1100, 700, 375, 65, DialogFind(Player, "UnlockMittens"), "White");
	DrawButton(1525, 700, 375, 65, DialogFind(Player, "RemoveChain"), "White");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
}

// Catches the item extension clicks
function InventoryItemArmsPaddedMittensHarnessLockedClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1100) && (MouseX <= 1475) && (MouseY >= 700) && (MouseY <= 765)) InventoryItemArmsPaddedMittensHarnessLockedLock();
	if ((MouseX >= 1525) && (MouseX <= 1900) && (MouseY >= 700) && (MouseY <= 765)) InventoryItemArmsPaddedMittensHarnessLockedChain();
}

// Lock/unlock function
function InventoryItemArmsPaddedMittensHarnessLockedLock() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryAvailable(Player, "PadlockKey", "ItemArms")) {
		InventoryWear(C, "PaddedMittensHarness", "ItemArms");
		if (C.ID == 0) ServerPlayerAppearanceSync();
		ChatRoomPublishCustomAction(Player.Name + " " + DialogFind(Player, "unlocks") + " " + C.Name + " " + DialogFind(Player, "mittens") + ".", true);
	} else InventoryItemArmsPaddedMittensHarnessLockedMsg = "NeedPadlockKey";
}

// Chain/Unchain function
function InventoryItemArmsPaddedMittensHarnessLockedChain() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	InventoryWear(C, "PaddedMittensLocked", "ItemArms");
	if (C.ID == 0) ServerPlayerAppearanceSync();
	ChatRoomPublishCustomAction(Player.Name + " " + DialogFind(Player, "unchains") + " " + C.Name + " " + DialogFind(Player, "mittensfromharness") + ".", true);
}