"use strict";

// Loads the item extension properties
function InventoryItemMouthDuctTapeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: ["GagLight"] };
}

// Draw the item extension screen
function InventoryItemMouthDuctTapeDraw() {
	
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
function InventoryItemMouthDuctTapeClick() {
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 450) && (MouseY <= 675) && (DialogFocusItem.Property.Type != null)) InventoryItemMouthDuctTapeSetType(null);
	if ((MouseX >= 1375) && (MouseX <= 1600) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Crossed"))) InventoryItemMouthDuctTapeSetType("Crossed");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Full"))) InventoryItemMouthDuctTapeSetType("Full");
	if ((MouseX >= 1150) && (MouseX <= 1375) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Double"))) InventoryItemMouthDuctTapeSetType("Double");
	if ((MouseX >= 1600) && (MouseX <= 1825) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Cover"))) InventoryItemMouthDuctTapeSetType("Cover");
}

// Sets the gag type (small, cleave, otm, otn)
function InventoryItemMouthDuctTapeSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemMouthDuctTapeLoad();
	}
	DialogFocusItem.Property.Type = NewType;
	if (NewType == null) DialogFocusItem.Property.Effect = ["GagLight"];
	else if (NewType == "Crossed") DialogFocusItem.Property.Effect = ["GagLight"];
	else if (NewType == "Full") DialogFocusItem.Property.Effect = ["GagNormal"];
	else if (NewType == "Double") DialogFocusItem.Property.Effect = ["GagNormal"];
	else if (NewType == "Cover") DialogFocusItem.Property.Effect = ["GagNormal"];
	CharacterRefresh(C);
	var msg = DialogFind(Player, "DuctTapeMouthSet" + ((NewType) ? NewType : "Small"));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}
