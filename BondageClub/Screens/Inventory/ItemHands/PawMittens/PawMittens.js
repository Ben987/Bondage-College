"use strict";
var InventoryItemHandsPawMittensMsg = null;

// Loads the item extension properties
function InventoryItemHandsPawMittensLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	InventoryItemHandsPawMittensMsg = null;
}

// Draw the item extension screen
function InventoryItemHandsPawMittensDraw() {

////	DrawButton(1100, 700, 375, 65, DialogFind(Player, "LockMittens"), "White");
//	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
//	DrawButton(1525, 700, 375, 65, DialogFind(Player, "AttachChain"), "White");

	// Draw the possible options
	DrawText(DialogFind(Player, "SelectFeature"), 1500, 500, "white", "gray");
//	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property.Restrain == null) ? "#888888" : "White");
//	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/None.png", 1000, 550);
//	DrawText(DialogFind(Player, "LeatherCuffsPoseNone"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/AdultBabyHarness.png", 1250, 550);
	DrawText(DialogFind(Player, "mittenstoharness"), 1375, 800, "white", "gray");
//	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Elbow")) ? "#888888" : "White");
//	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Elbow.png", 1500, 550);
//	DrawText(DialogFind(Player, "LeatherCuffsPoseElbow"), 1625, 800, "white", "gray");
//	DrawButton(1750, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Both")) ? "#888888" : "White");
//	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Both.png", 1750, 550);
//	DrawText(DialogFind(Player, "LeatherCuffsPoseBoth"), 1875, 800, "white", "gray");
//	DrawText(DialogFind(Player, "CannotUnlockIfElbowBound"), 1500, 900, "white", "gray");

	// Draw the message if present
	if (InventoryItemHandsPawMittensMsg != null) DrawTextWrap(DialogFind(Player, InventoryItemHandsPawMittensMsg), 1100, 850, 800, 160, "White");
}

// Catches the item extension clicks
function InventoryItemHandsPawMittensClick() {
//	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Restrain != null)) InventoryItemArmsLeatherCuffsSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775)) InventoryItemHandsPawMittensChain();
//	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Elbow"))) InventoryItemArmsLeatherCuffsSetPose("Elbow");
//	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Both"))) InventoryItemArmsLeatherCuffsSetPose("Both");
//	if ((MouseX >= 1525) && (MouseX <= 1900) && (MouseY >= 700) && (MouseY <= 765)) InventoryItemHandsPawMittensChain();
}



// Chain/Unchain function
function InventoryItemHandsPawMittensChain() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryGet(C, "ItemArms") == null) {
		if (InventoryGet(C, "ItemTorso") != null) {
			if (InventoryGet(C, "ItemTorso").Asset.Name == "AdultBabyHarness") {
				InventoryWear(C, "MittenChain1", "ItemArms");
				if (C.ID == 0) ServerPlayerAppearanceSync();
				ChatRoomPublishCustomAction(Player.Name + " " + DialogFind(Player, "chains") + " " + C.Name + " " + DialogFind(Player, "mittenstoharness") + ".", true);
			} else InventoryItemHandsPawMittensMsg = "NeedHarness";
		} else InventoryItemHandsPawMittensMsg = "NeedHarness";
	} else InventoryItemHandsPawMittensMsg = "FreeArms";
}