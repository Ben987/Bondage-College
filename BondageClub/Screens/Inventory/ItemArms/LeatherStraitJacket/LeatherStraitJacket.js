"use strict";

// Loads the item extension properties
function InventoryItemArmsLeatherStraitJacketLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
}

// Draw the item extension screen
function InventoryItemArmsLeatherStraitJacketDraw() {
	
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible poses
	DrawText(DialogFind(Player, "LeatherStraitJacketSelectTightness"), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property.Restrain == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Loose.png", 1000, 550);
	DrawText(DialogFind(Player, "LeatherStraitJacketPoseLoose"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Normal")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Normal.png", 1250, 550);
	DrawText(DialogFind(Player, "LeatherStraitJacketPoseNormal"), 1375, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Snug")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Snug.png", 1500, 550);
	DrawText(DialogFind(Player, "LeatherStraitJacketPoseSnug"), 1625, 800, "white", "gray");
	DrawButton(1750, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Tight")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Tight.png", 1750, 550);
	DrawText(DialogFind(Player, "LeatherStraitJacketPoseTight"), 1875, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemArmsLeatherStraitJacketClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Restrain != null)) InventoryItemArmsLeatherStraitJacketSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Normal"))) InventoryItemArmsLeatherStraitJacketSetPose("Normal");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Snug"))) InventoryItemArmsLeatherStraitJacketSetPose("Snug");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Tight"))) InventoryItemArmsLeatherStraitJacketSetPose("Tight");
}

// Sets the cuffs pose (wrist, elbow, both or none)
function InventoryItemArmsLeatherStraitJacketSetPose(NewPose) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsLeatherStraitJacketLoad();
	}

	// Sets the new pose with it's effects
	if (NewPose == null) {
		delete DialogFocusItem.Property.Difficulty;
		delete DialogFocusItem.Property.Type;
	} else {
		DialogFocusItem.Property.SetPose = ["BackElbowTouch"]; DialogFocusItem.Property.Type = NewPose;
		if (NewPose == "Normal") DialogFocusItem.Property.Difficulty = 3;
		if (NewPose == "Snug") DialogFocusItem.Property.Difficulty = 6;
		if (NewPose == "Tight") DialogFocusItem.Property.Difficulty = 9;
	}
	DialogFocusItem.Property.Restrain = NewPose;

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = "LeatherStraitJacketRestrain" + ((NewPose == null) ? "None" : NewPose);
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	ChatRoomPublishCustomAction(msg, true, Dictionary);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}