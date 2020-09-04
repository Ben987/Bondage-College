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
	DrawText(DialogFind(Player, InventoryItemArmsDuctTapeMessage), 1500, 50, "white", "gray");
	DrawButton(1000, 450, 225, 225, "", (DialogFocusItem.Property == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Arms.png", 1000, 449);
	DrawText(DialogFind(Player, "DuctTapePoseArms"), 1113, 425, "white", "gray");
	DrawButton(1375, 450, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Restrain == "Bottom")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Bottom.png", 1375, 449);
	DrawText(DialogFind(Player, "DuctTapePoseBottom"), 1488, 425, "white", "gray");
	DrawButton(1750, 450, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Restrain == "Top")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Top.png", 1750, 449);
	DrawText(DialogFind(Player, "DuctTapePoseTop"), 1863, 425, "white", "gray");
	DrawButton(1150, 750, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Restrain == "Full")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Full.png", 1150, 749);
	DrawText(DialogFind(Player, "DuctTapePoseFull"), 1263, 725, "white", "gray");
	DrawButton(1600, 750, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Restrain == "Complete")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Complete.png", 1600, 749);
	DrawText(DialogFind(Player, "DuctTapePoseComplete"), 1713, 725, "white", "gray");
	
}

// Catches the item extension clicks
function InventoryItemArmsDuctTapeClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 450) && (MouseY <= 675) && (DialogFocusItem.Property != null)) InventoryItemArmsDuctTapeSetPose(null);
	if ((MouseX >= 1375) && (MouseX <= 1600) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Restrain != "Bottom"))) InventoryItemArmsDuctTapeSetPose("Bottom");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Restrain != "Top"))) InventoryItemArmsDuctTapeSetPose("Top");
	if ((MouseX >= 1150) && (MouseX <= 1375) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Restrain != "Full"))) InventoryItemArmsDuctTapeSetPose("Full");
	if ((MouseX >= 1600) && (MouseX <= 1825) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Restrain != "Complete"))) InventoryItemArmsDuctTapeSetPose("Complete");
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
			if (NewPose == "Complete") DialogFocusItem.Property.Block = ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples"];
			if (NewPose == "Bottom") DialogFocusItem.Property.Difficulty = 2;
			if (NewPose == "Top") DialogFocusItem.Property.Difficulty = 4;
			if (NewPose == "Full") DialogFocusItem.Property.Difficulty = 6;
			if (NewPose == "Complete") DialogFocusItem.Property.Difficulty = 7;
		}
		CharacterRefresh(C);
		var msg = "DuctTapeRestrain" + ((NewPose == null) ? "Hands" : NewPose);
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
		if (DialogInventory != null) {
			DialogFocusItem = null;
			DialogMenuButtonBuild(C);
		}
	} else InventoryItemArmsDuctTapeMessage = "RemoveClothesForItem";
}