"use strict";
var InventoryItemArmsPaddedMittensMsg = null;

// Loads the item extension properties
function InventoryItemArmsPaddedMittensLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	InventoryItemArmsPaddedMittensMsg = null;
}

// Draw the item extension screen
function InventoryItemArmsPaddedMittensDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	
	if (InventoryItemArmsPaddedMittensMsg != null) DrawTextWrap(DialogFind(Player, InventoryItemArmsPaddedMittensMsg), 1100, 550, 800, 160, "White");

	DrawButton(1100, 700, 375, 65, DialogFind(Player, "LockMittens"), "White");
	DrawButton(1525, 700, 375, 65, DialogFind(Player, "AttachChain"), "White");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
}

// Catches the item extension clicks
function InventoryItemArmsPaddedMittensClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1100) && (MouseX <= 1475) && (MouseY >= 700) && (MouseY <= 765)) InventoryItemArmsPaddedMittensLock();
	if ((MouseX >= 1525) && (MouseX <= 1900) && (MouseY >= 700) && (MouseY <= 765)) InventoryItemArmsPaddedMittensChain();
}

// Lock/unlock function
function InventoryItemArmsPaddedMittensLock() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryAvailable(Player, "Padlock", "ItemArms")) {
		InventoryWear(C, "PaddedMittensLocked", "ItemArms");
		if (C.ID == 0) ServerPlayerAppearanceSync();
		ChatRoomPublishCustomAction(Player.Name + " " + DialogFind(Player, "padlocks") + " " + C.Name + " " + DialogFind(Player, "mittens") + ".", true);
	} else InventoryItemArmsPaddedMittensMsg = "NeedPadlock";
}

// Chain/Unchain function
function InventoryItemArmsPaddedMittensChain() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryGet(C, "ItemTorso").Asset.Name == "AdultBabyHarness") {
		InventoryWear(C, "PaddedMittensHarness", "ItemArms");
		if (C.ID == 0) ServerPlayerAppearanceSync();
		ChatRoomPublishCustomAction(Player.Name + " " + DialogFind(Player, "chains") + " " + C.Name + " " + DialogFind(Player, "mittenstoharness") + ".", true);
	} else InventoryItemArmsPaddedMittensMsg = "NeedHarness";
}