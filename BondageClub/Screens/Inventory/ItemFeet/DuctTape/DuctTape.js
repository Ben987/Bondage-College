"use strict";
var InventoryItemFeetDuctTapeMessage = "SelectTapeWrapping";

// Loads the item extension properties
function InventoryItemFeetDuctTapeLoad() {
	InventoryItemFeetDuctTapeMessage = "SelectTapeWrapping";
}

// Draw the item extension screen
function InventoryItemFeetDuctTapeDraw() {

	// Draw the possible poses
	DrawText(DialogFind(Player, InventoryItemFeetDuctTapeMessage), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Feet.png", 1000, 550);
	DrawText(DialogFind(Player, "DuctTapePoseFeet"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Type == "HalfFeet")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/HalfFeet.png", 1250, 550);
	DrawText(DialogFind(Player, "DuctTapePoseHalfFeet"), 1375, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Type == "MostFeet")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/MostFeet.png", 1500, 550);
	DrawText(DialogFind(Player, "DuctTapePoseMostFeet"), 1625, 800, "white", "gray");
	DrawButton(1750, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Type == "CompleteFeet")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/CompleteFeet.png", 1750, 550);
	DrawText(DialogFind(Player, "DuctTapePoseCompleteFeet"), 1875, 800, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemFeetDuctTapeClick() {
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property != null)) InventoryItemFeetDuctTapeSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Type != "HalfFeet"))) InventoryItemFeetDuctTapeSetPose("HalfFeet");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Type != "MostFeet"))) InventoryItemFeetDuctTapeSetPose("MostFeet");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Type != "CompleteFeet"))) InventoryItemFeetDuctTapeSetPose("CompleteFeet");
}

// Sets the duct tape type (the wraps require no clothes)
function InventoryItemFeetDuctTapeSetPose(NewPose) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((NewPose == null) || (InventoryGet(C, "ClothLower") == null)) {
		if (CurrentScreen == "ChatRoom") {
			DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
			InventoryItemFeetDuctTapeLoad();
		}
		if (NewPose == null) delete DialogFocusItem.Property;
		else {
			DialogFocusItem.Property = {SetPose: ["LegsClosed"], Type: NewPose};
			if (NewPose == "HalfFeet") DialogFocusItem.Property.Hide = ["ClothLower", "Shoes"];
			if (NewPose == "MostFeet") DialogFocusItem.Property.Hide = ["ClothLower", "Shoes"];
			if (NewPose == "CompleteFeet") DialogFocusItem.Property.Hide = ["ClothLower", "Shoes"];
			if (NewPose == "HalfFeet") DialogFocusItem.Property.Difficulty = 2;
			if (NewPose == "MostFeet") DialogFocusItem.Property.Difficulty = 4;
			if (NewPose == "CompleteFeet") DialogFocusItem.Property.Difficulty = 6;
		}
		CharacterRefresh(C);
		var msg = DialogFind(Player, "DuctTapeRestrain" + ((NewPose == null) ? "Feet" : NewPose));
		msg = msg.replace("SourceCharacter", Player.Name);
		msg = msg.replace("DestinationCharacter", C.Name);
		ChatRoomPublishCustomAction(msg, true);
		if (DialogInventory != null) {
			DialogFocusItem = null;
			DialogMenuButtonBuild(C);
		}
	} else InventoryItemFeetDuctTapeMessage = "RemoveClothesForItem";
}