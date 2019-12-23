"use strict";
var InventoryItemButtAnalHookMessage = "SelectAttachmentState";

// Loads the item extension properties
function InventoryItemButtAnalHookLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	InventoryItemButtAnalHookMessage = "SelectAttachmentState";
}

// Draw the item extension screen
function InventoryItemButtAnalHookDraw() {
	
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible poses
	DrawText(DialogFind(Player, InventoryItemButtAnalHookMessage), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Base.png", 1000, 550);
	DrawText(DialogFind(Player, "AnalHookPoseBase"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Type == "Chain")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Chain.png", 1250, 550);
	DrawText(DialogFind(Player, "AnalHookPoseChain"), 1375, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Hair")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Hair.png", 1500, 550);
	DrawText(DialogFind(Player, "AnalHookPoseHair"), 1625, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemButtAnalHookClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Restrain != null)) InventoryItemButtAnalHookSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Chain"))) InventoryItemButtAnalHookSetPose("Chain");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Hair"))) InventoryItemButtAnalHookSetPose("Hair");
}


// Sets the item pose (chains, hair or none)
function InventoryItemButtAnalHookSetPose(NewPose) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemButtAnalHookLoad();
	
	
//		if (InventoryGet(C, "Cloth") != null) {
//		InventoryItemButtAnalHookMessage = "RemoveClothesForItem";
//		return;
//		}

	// Sets the new pose with it's effects
		DialogFocusItem.Property.Restrain = NewPose;
		if (NewPose == null) {
			delete DialogFocusItem.Property.Effect;
			delete DialogFocusItem.Property.Type;
			delete DialogFocusItem.Property.Difficulty;
			delete DialogFocusItem.Property.Intensity;
		} else {
			DialogFocusItem.Property.Type = NewPose;
			if (NewPose == "Chain") DialogFocusItem.Property.Intensity = 1;
			if (NewPose == "Chain") DialogFocusItem.Property.Effect = ["Freeze", "Egged"];
			if (NewPose == "Chain") DialogFocusItem.Property.Difficulty = 20;
			if (NewPose == "Hair") DialogFocusItem.Property.Effect = ["Egged"];
			if (NewPose == "Hair") DialogFocusItem.Property.Intensity = 1;
			if (NewPose == "Hair") DialogFocusItem.Property.Difficulty = 10;
		}
		DialogFocusItem.Property.Restrain = NewPose;
	} 
	

//	// Adds the lock effect back if it was padlocked
//	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
//		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
//		DialogFocusItem.Property.Effect.push("Lock");
//	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = DialogFind(Player, "AnalHookRestrain" + ((NewPose == null) ? "Base" : NewPose));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}