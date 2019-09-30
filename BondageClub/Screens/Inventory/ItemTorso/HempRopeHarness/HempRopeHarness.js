"use strict";

// Loads the item extension properties
function InventoryItemTorsoHempRopeHarnessLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
}

// Draw the item extension screen
function InventoryItemTorsoHempRopeHarnessDraw() {

	// Draw the possible Harness types
	DrawText(DialogFind(Player, "SelectHarnessType"), 1500, 500, "white", "gray");
	DrawButton(1175, 550, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Basic") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Basic.png", 1175, 549);
	DrawText(DialogFind(Player, "HempRopeHarnessTypeBasic"), 1288, 800, "white", "gray");
	DrawButton(1600, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Diamond")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Diamond.png", 1600, 549);
	DrawText(DialogFind(Player, "HempRopeHarnessTypeDiamond"), 1713, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemTorsoHempRopeHarnessClick() {
	if ((MouseX >= 1175) && (MouseX <= 1400) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemTorsoHempRopeHarnessSetType(null);
	if ((MouseX >= 1600) && (MouseX <= 1825) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Diamond"))) InventoryItemTorsoHempRopeHarnessSetType("Diamond");
}

// Sets the Harnass type (Diamond, Basic)
function InventoryItemTorsoHempRopeHarnessSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemTorsoHempRopeHarnessLoad();
	}
	DialogFocusItem.Property.Type = NewType;
	if (NewType == null) DialogFocusItem.Property.Effect = [];
	else if (NewType == "Diamond") DialogFocusItem.Property.Effect = [];

	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	var msg = DialogFind(Player, "HempRopeHarnessSet" + ((NewType) ? NewType : "Basic"));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}