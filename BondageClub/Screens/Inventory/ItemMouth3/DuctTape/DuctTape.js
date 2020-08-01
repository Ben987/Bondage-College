"use strict";

// Loads the item extension properties
function InventoryItemMouth3DuctTapeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: ["GagVeryLight"] };
}

// Draw the item extension screen
function InventoryItemMouth3DuctTapeDraw() {
	
	// Draw the header and item
	DrawRect(1387, 100, 225, 275, "white");
	DrawText(DialogFind(Player, "SelectGagType"), 1500, 50, "white", "gray");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 102, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 350, 221, "black");

	// Draw the possible gag types
	DrawButton(1000, 450, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Small") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Small.png", 1000, 449);
	DrawText(DialogFind(Player, "DuctTapeMouthTypeSmall"), 1113, 425, "white", "gray");
	DrawButton(1375, 450, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Crossed")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Crossed.png", 1375, 449);
	DrawText(DialogFind(Player, "DuctTapeMouthTypeCrossed"), 1488, 425, "white", "gray");
	DrawButton(1750, 450, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Full")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Full.png", 1750, 449);
	DrawText(DialogFind(Player, "DuctTapeMouthTypeFull"), 1863, 425, "white", "gray");
	DrawButton(1150, 750, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Double")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Double.png", 1150, 749);
	DrawText(DialogFind(Player, "DuctTapeMouthTypeDouble"), 1263, 725, "white", "gray");
	DrawButton(1600, 750, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Cover")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Cover.png", 1600, 749);
	DrawText(DialogFind(Player, "DuctTapeMouthTypeCover"), 1713, 725, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemMouth3DuctTapeClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 450) && (MouseY <= 675) && (DialogFocusItem.Property.Type != null)) InventoryItemMouth3DuctTapeSetType(null);
	if ((MouseX >= 1375) && (MouseX <= 1600) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Crossed"))) InventoryItemMouth3DuctTapeSetType("Crossed");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Full"))) InventoryItemMouth3DuctTapeSetType("Full");
	if ((MouseX >= 1150) && (MouseX <= 1375) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Double"))) InventoryItemMouth3DuctTapeSetType("Double");
	if ((MouseX >= 1600) && (MouseX <= 1825) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Cover"))) InventoryItemMouth3DuctTapeSetType("Cover");
}

// Sets the gag type (small, cleave, otm, otn)
function InventoryItemMouth3DuctTapeSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemMouth3DuctTapeLoad();
	}
	DialogFocusItem.Property.Type = NewType;
	if (NewType == null) DialogFocusItem.Property.Effect = ["BlockMouth", "GagVeryLight"];
	else if (NewType == "Crossed") DialogFocusItem.Property.Effect = ["BlockMouth", "GagLight"];
	else if (NewType == "Full") DialogFocusItem.Property.Effect = ["BlockMouth", "GagEasy"];
	else if (NewType == "Double") DialogFocusItem.Property.Effect = ["BlockMouth", "GagNormal"];
	else if (NewType == "Cover") DialogFocusItem.Property.Effect = ["BlockMouth", "GagMedium"];
	CharacterRefresh(C);
	var msg = "DuctTapeMouthSet" + ((NewType) ? NewType : "Small");
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}
