"use strict";

// Loads the item extension properties
function InventoryItemDevicesTeddyBearLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: [] };
}

// Draw the item extension screen
function InventoryItemDevicesTeddyBearDraw() {
	
	// Draw the header and item
	DrawRect(1387, 100, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 102, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 350, 221, "black");

	// Draw the possible bear types
	DrawText(DialogFind(Player, "SelectTeddyBearType"), 1500, 50, "white", "gray");
	DrawButton(1000, 450, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Bear") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Bear.png", 1005, 459);
	DrawText(DialogFind(Player, "TeddyBearTypeBear"), 1113, 425, "white", "gray");
	DrawButton(1375, 450, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Fox")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Fox.png", 1380, 459);
	DrawText(DialogFind(Player, "TeddyBearTypeFox"), 1488, 425, "white", "gray");
	DrawButton(1750, 450, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Kitty")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Kitty.png", 1755, 459);
	DrawText(DialogFind(Player, "TeddyBearTypeKitty"), 1863, 425, "white", "gray");
	DrawButton(1000, 750, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Pup")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Pup.png", 1005, 759);
	DrawText(DialogFind(Player, "TeddyBearTypePup"), 1113, 725, "white", "gray");
	DrawButton(1375, 750, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Bunny")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Bunny.png", 1380, 759);
	DrawText(DialogFind(Player, "TeddyBearTypeBunny"), 1488, 725, "white", "gray");
	DrawButton(1750, 750, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Pony")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Pony.png", 1755, 759);
	DrawText(DialogFind(Player, "TeddyBearTypePony"), 1863, 725, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemDevicesTeddyBearClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 450) && (MouseY <= 675) && (DialogFocusItem.Property.Type != null)) InventoryItemDevicesTeddyBearSetType(null);
	if ((MouseX >= 1375) && (MouseX <= 1600) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Fox"))) InventoryItemDevicesTeddyBearSetType("Fox");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Kitty"))) InventoryItemDevicesTeddyBearSetType("Kitty");
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Pup"))) InventoryItemDevicesTeddyBearSetType("Pup");
	if ((MouseX >= 1375) && (MouseX <= 1600) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Bunny"))) InventoryItemDevicesTeddyBearSetType("Bunny");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Pony"))) InventoryItemDevicesTeddyBearSetType("Pony");
}

// Sets the teddy type (bear, fox, kitty and pup)
function InventoryItemDevicesTeddyBearSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemDevicesTeddyBearLoad();
	}
	DialogFocusItem.Property.Type = NewType;
	if (NewType == null) DialogFocusItem.Property.Effect = [];
	else if (NewType == "Fox") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Kitty") delete DialogFocusItem.Property.Effect;
	else if (NewType == "Pup") delete DialogFocusItem.Property.Effect;

	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	var msg = DialogFind(Player, "TeddyBearSet" + ((NewType) ? NewType : "Bear"));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}