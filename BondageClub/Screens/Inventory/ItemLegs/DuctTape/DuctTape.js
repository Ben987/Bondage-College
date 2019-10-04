"use strict";
var InventoryItemLegsDuctTapeMessage = "SelectTapeWrapping";

// Loads the item extension properties
function InventoryItemLegsDuctTapeLoad() {
	InventoryItemLegsDuctTapeMessage = "SelectTapeWrapping";
}

// Draw the item extension screen
function InventoryItemLegsDuctTapeDraw() {
	
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible poses
	DrawText(DialogFind(Player, InventoryItemLegsDuctTapeMessage), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Legs.png", 1000, 550);
	DrawText(DialogFind(Player, "DuctTapePoseLegs"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Type == "HalfLegs")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/HalfLegs.png", 1250, 550);
	DrawText(DialogFind(Player, "DuctTapePoseHalfLegs"), 1375, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Type == "MostLegs")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/MostLegs.png", 1500, 550);
	DrawText(DialogFind(Player, "DuctTapePoseMostLegs"), 1625, 800, "white", "gray");
	DrawButton(1750, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Type == "CompleteLegs")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/CompleteLegs.png", 1750, 550);
	DrawText(DialogFind(Player, "DuctTapePoseCompleteLegs"), 1875, 800, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemLegsDuctTapeClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property != null)) InventoryItemLegsDuctTapeSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Type != "HalfLegs"))) InventoryItemLegsDuctTapeSetPose("HalfLegs");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Type != "MostLegs"))) InventoryItemLegsDuctTapeSetPose("MostLegs");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Type != "CompleteLegs"))) InventoryItemLegsDuctTapeSetPose("CompleteLegs");
}

// Sets the duct tape type (the wraps require no clothes)
function InventoryItemLegsDuctTapeSetPose(NewPose) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((NewPose == null) || (InventoryGet(C, "ClothLower") == null)) {
		if (CurrentScreen == "ChatRoom") {
			DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
			InventoryItemLegsDuctTapeLoad();
		}
		if (NewPose == null) delete DialogFocusItem.Property;
		else {
			DialogFocusItem.Property = {SetPose: ["LegsClosed"], Type: NewPose};
			if (NewPose == "HalfLegs") DialogFocusItem.Property.Hide = ["ClothLower"];
			if (NewPose == "MostLegs") DialogFocusItem.Property.Hide = ["ClothLower"];
			if (NewPose == "CompleteLegs") DialogFocusItem.Property.Hide = ["ClothLower"];
			if (NewPose == "HalfLegs") DialogFocusItem.Property.Difficulty = 2;
			if (NewPose == "MostLegs") DialogFocusItem.Property.Difficulty = 4;
			if (NewPose == "CompleteLegs") DialogFocusItem.Property.Difficulty = 6;
		}
		CharacterRefresh(C);
		var msg = DialogFind(Player, "DuctTapeRestrain" + ((NewPose == null) ? "Legs" : NewPose));
		msg = msg.replace("SourceCharacter", Player.Name);
		msg = msg.replace("DestinationCharacter", C.Name);
		ChatRoomPublishCustomAction(msg, true);
		if (DialogInventory != null) {
			DialogFocusItem = null;
			DialogMenuButtonBuild(C);
		}
	} else InventoryItemLegsDuctTapeMessage = "RemoveClothesForItem";
}