"use strict";
var InventoryItemLegsSturdyLeatherBeltsMessage = "";

// Loads the item extension properties
function InventoryItemLegsSturdyLeatherBeltsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	DialogFocusItem.Property.SelfUnlock = false;
}

// Draw the item extension screen
function InventoryItemLegsSturdyLeatherBeltsDraw() {
	
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible poses
	DrawText(DialogFind(Player, "SturdyLeatherBeltsSelectTightness"), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property.Restrain == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/One.png", 1000, 550);
	DrawText(DialogFind(Player, "SturdyLeatherBeltsPoseOne"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Two")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Two.png", 1250, 550);
	DrawText(DialogFind(Player, "SturdyLeatherBeltsPoseTwo"), 1375, 800, "white", "gray");
//	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Three")) ? "#888888" : "White");
//	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Three.png", 1500, 550);
//	DrawText(DialogFind(Player, "SturdyLeatherBeltsPoseThree"), 1625, 800, "white", "gray");
//	DrawButton(1750, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Four")) ? "#888888" : "White");
//	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Four.png", 1750, 550);
//	DrawText(DialogFind(Player, "SturdyLeatherBeltsPoseFour"), 1875, 800, "white", "gray");

	// Draw the message if present
	if (InventoryItemLegsSturdyLeatherBeltsMessage != null) DrawTextWrap(DialogFind(Player, InventoryItemLegsSturdyLeatherBeltsMessage), 1100, 850, 800, 160, "White");
}

// Catches the item extension clicks
function InventoryItemLegsSturdyLeatherBeltsClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Restrain != null)) InventoryItemLegsSturdyLeatherBeltsSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Two"))) InventoryItemLegsSturdyLeatherBeltsSetPose("Two");
//	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Three"))) InventoryItemLegsSturdyLeatherBeltsSetPose("Three");
//	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Four"))) InventoryItemLegsSturdyLeatherBeltsSetPose("Four");
}

// Sets the cuffs pose (wrist, elbow, both or none)
function InventoryItemLegsSturdyLeatherBeltsSetPose(NewPose) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemLegsSturdyLeatherBeltsLoad();
	
	
		if (InventoryGet(C, "ClothLower") != null) {
		InventoryItemLegsSturdyLeatherBeltsMessage = "RemoveClothesForItem";
		return;
		}

	// Sets the new pose with it's effects
		DialogFocusItem.Property.Restrain = NewPose;
		if (NewPose == null) {
			delete DialogFocusItem.Property.Difficulty;
			delete DialogFocusItem.Property.Type;
		} else {
			DialogFocusItem.Property.SetPose = ["LegsClosed"]; DialogFocusItem.Property.Type = NewPose;
			if (NewPose == "Two") DialogFocusItem.Property.Difficulty = 2;
//			if (NewPose == "Three") DialogFocusItem.Property.Difficulty = 4;
//			if (NewPose == "Four") DialogFocusItem.Property.Difficulty = 6;
		}
		DialogFocusItem.Property.Restrain = NewPose;
	} 
	

	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = DialogFind(Player, "SturdyLeatherBeltsRestrain" + ((NewPose == null) ? "None" : NewPose));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}