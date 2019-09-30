"use strict";

// Loads the item extension properties
function InventoryItemMouthClothGagLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: ["GagLight"] };
}

// Draw the item extension screen
function InventoryItemMouthClothGagDraw() {
	
	// Draw the possible gag types
	DrawText(DialogFind(Player, "SelectGagType"), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Small") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Small.png", 1000, 550);
	DrawText(DialogFind(Player, "ClothGagTypeSmall"), 1115, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Cleave")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Cleave.png", 1250, 550);
	DrawText(DialogFind(Player, "ClothGagTypeCleave"), 1365, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "OTM")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/OTM.png", 1500, 550);
	DrawText(DialogFind(Player, "ClothGagTypeOTM"), 1615, 800, "white", "gray");
	DrawButton(1750, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "OTN")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/OTN.png", 1750, 550);
	DrawText(DialogFind(Player, "ClothGagTypeOTN"), 1865, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemMouthClothGagClick() {
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemMouthClothGagSetType(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Cleave"))) InventoryItemMouthClothGagSetType("Cleave");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "OTM"))) InventoryItemMouthClothGagSetType("OTM");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "OTN"))) InventoryItemMouthClothGagSetType("OTN");
}

// Sets the gag type (small, cleave, otm, otn)
function InventoryItemMouthClothGagSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemMouthClothGagLoad();
	}
	DialogFocusItem.Property.Type = NewType;
	if (NewType == null) DialogFocusItem.Property.Effect = ["GagLight"];
	else if (NewType == "Cleave") DialogFocusItem.Property.Effect = ["GagLight"];
	else if (NewType == "OTM") delete DialogFocusItem.Property.Effect;
	else if (NewType == "OTN") delete DialogFocusItem.Property.Effect;

	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	var msg = DialogFind(Player, "ClothGagSet" + ((NewType) ? NewType : "Small"));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}
