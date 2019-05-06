"use strict";
var InventoryItemArmsPaddedMittensLockedMsg = null;

// Loads the item extension properties
function InventoryItemArmsPaddedMittensLockedLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	InventoryItemArmsPaddedMittensLockedMsg = null;
}

// Draw the item extension screen
function InventoryItemArmsPaddedMittensLockedDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	
	if (InventoryItemArmsPaddedMittensLockedMsg != null) DrawTextWrap(DialogFind(Player, InventoryItemArmsPaddedMittensLockedMsg), 1100, 600, 800, 160, "White");

	DrawButton(1100, 700, 375, 65, DialogFind(Player, "UnlockMittens"), "White");
	DrawButton(1525, 700, 375, 65, DialogFind(Player, "AttachChain"), "White");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
}

// Catches the item extension clicks
function InventoryItemArmsPaddedMittensLockedClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1100) && (MouseX <= 1475) && (MouseY >= 700) && (MouseY <= 765)) InventoryItemArmsPaddedMittensLockedLock();
	if ((MouseX >= 1525) && (MouseX <= 1900) && (MouseY >= 700) && (MouseY <= 765)) InventoryItemArmsPaddedMittensLockedChain();
}

// Lock/unlock function
function InventoryItemArmsPaddedMittensHarnessLockedLock() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryAvailable(Player, "PadLockKey", "ItemArms")) {
		delete DialogFocusItem.Property.Effect;
		InventoryWear(C, "PaddedMittens", "ItemArms");
		//CharacterLoadEffect(C);
		if (C.ID == 0) ServerPlayerAppearanceSync();
		ChatRoomPublishCustomAction(Player.Name + " " + DialogFind(Player, "unlocks") + " " + C.Name + " " + DialogFind(Player, "mittens") + ".", true);
	} else InventoryItemArmsPaddedMittensHarnessLockedMsg = "NeedPadlockKey";
}

// Chain/Unchain function
function InventoryItemArmsPaddedMittensLockedChain() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryGet(C, "ItemTorso") == "AdultBabyHarness") {
		InventoryWear(C, "PaddedMittensLockedHarness", "ItemArms");
		CharacterLoadEffect(C);
		if (C.ID == 0) ServerPlayerAppearanceSync();
		ChatRoomPublishCustomAction(Player.Name + " " + DialogFind(Player, "chains") + " " + C.Name + " " + DialogFind(Player, "mittenstoharness") + ".", true);
	} else InventoryItemArmsPaddedMittensLockedMsg = "NeedHarness";
}