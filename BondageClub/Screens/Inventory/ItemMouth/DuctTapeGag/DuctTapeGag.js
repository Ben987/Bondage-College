"use strict";

// Loads the item extension properties
function InventoryItemMouthDuctTapeGagLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: ["GagLight"] };
}

// Draw the item extension screen
function InventoryItemMouthDuctTapeGagDraw() {
	
	// Draw the header and item
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible gag types
	DrawText(DialogFind(Player, "SelectGagType"), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Small") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Small.png", 1000, 550);
	DrawText(DialogFind(Player, "DuctTapeGagTypeSmall"), 1115, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Crossed")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Crossed.png", 1250, 550);
	DrawText(DialogFind(Player, "DuctTapeGagTypeCrossed"), 1365, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Full")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Full.png", 1500, 550);
	DrawText(DialogFind(Player, "DuctTapeGagTypeFull"), 1615, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemMouthDuctTapeGagClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemMouthDuctTapeGagSetType(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Crossed"))) InventoryItemMouthDuctTapeGagSetType("Crossed");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Full"))) InventoryItemMouthDuctTapeGagSetType("Full");
}

// Sets the gag type (small, cleave, otm, otn)
function InventoryItemMouthDuctTapeGagSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemMouthDuctTapeGagLoad();
	}
	DialogFocusItem.Property.Type = NewType;
	if (NewType == null) DialogFocusItem.Property.Effect = ["GagLight"];
	else if (NewType == "Crossed") DialogFocusItem.Property.Effect = ["GagLight"];
	else if (NewType == "Full") DialogFocusItem.Property.Effect = ["GagLight"];

	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	var msg = DialogFind(Player, "DuctTapeGagSet" + ((NewType) ? NewType : "Small"));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);
	if (DialogInventory != null) DialogFocusItem = null;
}
