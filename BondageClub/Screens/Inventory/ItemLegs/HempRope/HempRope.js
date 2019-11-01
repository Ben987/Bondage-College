"use strict";

// Loads the item extension properties
function InventoryItemLegsHempRopeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
}

// Draw the item extension screen
function InventoryItemLegsHempRopeDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible Harness types
	DrawText(DialogFind(Player, "SelectTieStyle"), 1500, 500, "white", "gray");
	DrawButton(1175, 550, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Basic") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Basic.png", 1175, 549);
	DrawText(DialogFind(Player, "RopeStyleBasic"), 1288, 800, "white", "gray");
	DrawButton(1600, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Mermaid")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Mermaid.png", 1600, 549);
	DrawText(DialogFind(Player, "RopeStyleMermaid"), 1713, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemLegsHempRopeClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1175) && (MouseX <= 1400) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemLegsHempRopeSetType(null);
	if ((MouseX >= 1600) && (MouseX <= 1825) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Mermaid"))) InventoryItemLegsHempRopeSetType("Mermaid");
}

// Sets the Harnass type (Mermaid, Basic)
function InventoryItemLegsHempRopeSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemLegsHempRopeLoad();
	}
	DialogFocusItem.Property.Type = NewType;
	if (NewType == null) DialogFocusItem.Property.Effect = [];
	else if (NewType == "Mermaid") DialogFocusItem.Property.Effect = [];

	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	var msg = DialogFind(Player, "LegRopeSet" + ((NewType) ? NewType : "Basic"));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}