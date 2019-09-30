"use strict";
var InventoryItemArmsDuctTapeMessage = "SelectTapeWrapping";

// Loads the item extension properties
function InventoryItemArmsDuctTapeLoad() {
	InventoryItemArmsDuctTapeMessage = "SelectTapeWrapping";
}

// Draw the item extension screen
function InventoryItemArmsDuctTapeDraw() {
	// Draw the possible poses
	DrawText(DialogFind(Player, InventoryItemArmsDuctTapeMessage), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Arms.png", 1000, 550);
	DrawText(DialogFind(Player, "DuctTapePoseArms"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Restrain == "Bottom")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Bottom.png", 1250, 550);
	DrawText(DialogFind(Player, "DuctTapePoseBottom"), 1375, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Restrain == "Top")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Top.png", 1500, 550);
	DrawText(DialogFind(Player, "DuctTapePoseTop"), 1625, 800, "white", "gray");
	DrawButton(1750, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Restrain == "Full")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Full.png", 1750, 550);
	DrawText(DialogFind(Player, "DuctTapePoseFull"), 1875, 800, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemArmsDuctTapeClick() {
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property != null)) InventoryItemArmsDuctTapeSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Restrain != "Bottom"))) InventoryItemArmsDuctTapeSetPose("Bottom");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Restrain != "Top"))) InventoryItemArmsDuctTapeSetPose("Top");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Restrain != "Full"))) InventoryItemArmsDuctTapeSetPose("Full");
}

// Sets the duct tape type (the wraps require no clothes)
function InventoryItemArmsDuctTapeSetPose(NewPose) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((NewPose == null) || ((InventoryGet(C, "Cloth") == null) && (InventoryGet(C, "ClothLower") == null))) {
		if (CurrentScreen == "ChatRoom") {
			DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
			InventoryItemArmsDuctTapeLoad();
		}
		if (NewPose == null) delete DialogFocusItem.Property;
		else {
			DialogFocusItem.Property = {SetPose: ["BackElbowTouch"], Type: NewPose, Hide: ["Cloth", "ClothLower"]};
			if (NewPose == "Bottom") DialogFocusItem.Property.Block = ["ItemVulva", "ItemButt", "ItemPelvis"];
			if (NewPose == "Top") DialogFocusItem.Property.Block = ["ItemTorso", "ItemBreast", "ItemNipples"];
			if (NewPose == "Full") DialogFocusItem.Property.Block = ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples"];
			if (NewPose == "Bottom") DialogFocusItem.Property.Difficulty = 2;
			if (NewPose == "Top") DialogFocusItem.Property.Difficulty = 4;
			if (NewPose == "Full") DialogFocusItem.Property.Difficulty = 6;
		}
		CharacterRefresh(C);
		var msg = DialogFind(Player, "DuctTapeRestrain" + ((NewPose == null) ? "Hands" : NewPose));
		msg = msg.replace("SourceCharacter", Player.Name);
		msg = msg.replace("DestinationCharacter", C.Name);
		ChatRoomPublishCustomAction(msg, true);
		if (DialogInventory != null) {
			DialogFocusItem = null;
			DialogMenuButtonBuild(C);
		}
	} else InventoryItemArmsDuctTapeMessage = "RemoveClothesForItem";
}