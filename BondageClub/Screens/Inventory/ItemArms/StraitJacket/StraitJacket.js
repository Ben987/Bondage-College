"use strict";

// Loads the item extension properties
function InventoryItemArmsStraitJacketLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	DialogFocusItem.Property.SelfUnlock = false;
}

// Draw the item extension screen
function InventoryItemArmsStraitJacketDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible poses
	DrawText(DialogFind(Player, "StraitJacketSelectTightness"), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property.Type == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Loose.png", 1000, 550);
	DrawText(DialogFind(Player, "StraitJacketPoseLoose"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", (DialogFocusItem.Property.Type == "#Normal") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Normal.png", 1250, 550);
	DrawText(DialogFind(Player, "StraitJacketPoseNormal"), 1375, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", (DialogFocusItem.Property.Type == "#Snug") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Snug.png", 1500, 550);
	DrawText(DialogFind(Player, "StraitJacketPoseSnug"), 1625, 800, "white", "gray");
	DrawButton(1750, 550, 225, 225, "", (DialogFocusItem.Property.Type == "#Tight") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Tight.png", 1750, 550);
	DrawText(DialogFind(Player, "StraitJacketPoseTight"), 1875, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemArmsStraitJacketClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemArmsStraitJacketSetType(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != "#Normal")) InventoryItemArmsStraitJacketSetType("#Normal");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != "#Snug")) InventoryItemArmsStraitJacketSetType("#Snug");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != "#Tight")) InventoryItemArmsStraitJacketSetType("#Tight");
}

// Sets the cuffs pose (wrist, elbow, both or none)
function InventoryItemArmsStraitJacketSetType(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsStraitJacketLoad();
	}

	// Sets the new pose with it's effects
	DialogFocusItem.Property.Type = NewType;
	if (NewType == null) {
		delete DialogFocusItem.Property.Difficulty;
	} else {
		if (NewType == "#Normal") DialogFocusItem.Property.Difficulty = 3;
		if (NewType == "#Snug") DialogFocusItem.Property.Difficulty = 6;
		if (NewType == "#Tight") DialogFocusItem.Property.Difficulty = 9;
	}

	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = DialogFind(Player, "StraitJacketRestrain" + ((NewType == null) ? "None" : NewType.substring(1)));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}