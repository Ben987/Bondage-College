"use strict";
var InventoryItemArmsDuctTapeMessage = "SelectTapeWrapping";

// Loads the item extension properties
function InventoryItemArmsDuctTapeLoad() {
	InventoryItemArmsDuctTapeMessage = "SelectTapeWrapping";
}

// Draw the item extension screen
function InventoryItemArmsDuctTapeDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible poses
	DrawText(DialogFind(Player, InventoryItemArmsDuctTapeMessage), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", InventoryItemIsType(DialogFocusItem, null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Arms.png", 1000, 550);
	DrawText(DialogFind(Player, "DuctTapePoseArms"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", InventoryItemIsType(DialogFocusItem, "Bottom") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Bottom.png", 1250, 550);
	DrawText(DialogFind(Player, "DuctTapePoseBottom"), 1375, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", InventoryItemIsType(DialogFocusItem, "Top") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Top.png", 1500, 550);
	DrawText(DialogFind(Player, "DuctTapePoseTop"), 1625, 800, "white", "gray");
	DrawButton(1750, 550, 225, 225, "", InventoryItemIsType(DialogFocusItem, "Full") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Full.png", 1750, 550);
	DrawText(DialogFind(Player, "DuctTapePoseFull"), 1875, 800, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemArmsDuctTapeClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && !InventoryItemIsType(DialogFocusItem, null)) InventoryItemArmsDuctTapeSetType(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && !InventoryItemIsType(DialogFocusItem, "Bottom")) InventoryItemArmsDuctTapeSetType("Bottom");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && !InventoryItemIsType(DialogFocusItem, "Top")) InventoryItemArmsDuctTapeSetType("Top");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 550) && (MouseY <= 775) && !InventoryItemIsType(DialogFocusItem, "Full")) InventoryItemArmsDuctTapeSetType("Full");
}

// Sets the duct tape type (the wraps require no clothes)
function InventoryItemArmsDuctTapeSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((NewType == null) || ((InventoryGet(C, "Cloth") == null) && (InventoryGet(C, "ClothLower") == null))) {
		if (CurrentScreen == "ChatRoom") {
			DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
			InventoryItemArmsDuctTapeLoad();
		}
		if (NewType == null) delete DialogFocusItem.Property;
		else {
			DialogFocusItem.Property = { SetPose: ["BackElbowTouch"], Type: NewType, Hide: ["Cloth", "ClothLower"] };
			if (NewType == "Bottom") DialogFocusItem.Property.Block = ["ItemVulva", "ItemButt", "ItemPelvis"];
			if (NewType == "Top") DialogFocusItem.Property.Block = ["ItemTorso", "ItemBreast", "ItemNipples"];
			if (NewType == "Full") DialogFocusItem.Property.Block = ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples"];
			if (NewType == "Bottom") DialogFocusItem.Property.Difficulty = 2;
			if (NewType == "Top") DialogFocusItem.Property.Difficulty = 4;
			if (NewType == "Full") DialogFocusItem.Property.Difficulty = 6;
		}
		CharacterRefresh(C);
		var msg = DialogFind(Player, "DuctTapeRestrain" + ((NewType == null) ? "Hands" : NewType));
		msg = msg.replace("SourceCharacter", Player.Name);
		msg = msg.replace("DestinationCharacter", C.Name);
		ChatRoomPublishCustomAction(msg, true);
		if (DialogInventory != null) {
			DialogFocusItem = null;
			DialogMenuButtonBuild(C);
		}
	} else InventoryItemArmsDuctTapeMessage = "RemoveClothesForItem";
}