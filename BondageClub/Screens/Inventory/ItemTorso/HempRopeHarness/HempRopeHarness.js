"use strict";

// Loads the item extension properties
function InventoryItemTorsoHempRopeHarnessLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
}

// Draw the item extension screen
function InventoryItemTorsoHempRopeHarnessDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible Harness types
	DrawText(DialogFind(Player, "SelectTieStyle"), 1500, 500, "white", "gray");
	DrawButton(1100, 550, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Basic") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Basic.png", 1100, 549);
	DrawText(DialogFind(Player, "RopeStyleBasic"), 1213, 800, "white", "gray");
	DrawButton(1400, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "CrotchRope")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/CrotchRope.png", 1400, 549);
	DrawText(DialogFind(Player, "RopeStyleCrotchRope"), 1513, 800, "white", "gray");
	DrawButton(1700, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Diamond")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Diamond.png", 1700, 549);
	DrawText(DialogFind(Player, "RopeStyleDiamond"), 1813, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemTorsoHempRopeHarnessClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1100) && (MouseX <= 1325) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemTorsoHempRopeHarnessSetType(null);
	if ((MouseX >= 1400) && (MouseX <= 1625) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "CrotchRope"))) InventoryItemTorsoHempRopeHarnessSetType("CrotchRope");
	if ((MouseX >= 1700) && (MouseX <= 1925) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Diamond"))) InventoryItemTorsoHempRopeHarnessSetType("Diamond");
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
	else if (NewType == "Diamond" || "CrotchRope") DialogFocusItem.Property.Effect = [];

	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	var msg = "RopeHarnessSet" + ((NewType) ? NewType : "Basic");
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}