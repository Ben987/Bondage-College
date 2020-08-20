"use strict";

// Loads the item extension properties
function InventoryItemArmsLeatherArmbinderLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	var addonItem = InventoryGet(C, "ItemHidden");
	if (addonItem != null) {
		DialogExtendItem(addonItem);
		return;
	}
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
}

// Draw the item extension screen
function InventoryItemArmsLeatherArmbinderDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
	DrawText(DialogFind(Player, "SelectStrapType"), 1500, 500, "white", "gray");
	DrawButton(1175, 550, 225, 225, "", (InventoryGet(C, "ItemHidden") != null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Strap.png", 1175, 550);
	DrawText(DialogFind(Player, "LeatherArmbinderTypeStrap"), 1287, 800, "white", "gray");
	DrawButton(1600, 550, 225, 225, "", (InventoryGet(C, "ItemHidden") != null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/WrapStrap.png", 1600, 550);
	DrawText(DialogFind(Player, "LeatherArmbinderTypeWrapStrap"), 1712, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemArmsLeatherArmbinderClick() {
	if (MouseIn(1885, 25, 90, 90)) DialogFocusItem = null;
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (MouseIn(1175, 550, 225, 225) && InventoryGet(C, "ItemHidden") == null) InventoryItemArmsLeatherArmbinderSetType("Strap");
	if (MouseIn(1600, 550, 225, 225) && InventoryGet(C, "ItemHidden") == null) InventoryItemArmsLeatherArmbinderSetType("WrapStrap");
}

// Sets the strap properties
function InventoryItemArmsLeatherArmbinderSetType(NewType) {

	// Sets the type, blocking zones and wand
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsLeatherArmbinderLoad();
	}
	if (NewType == "Strap") {
		InventoryWear(C, "LeatherArmbinderStrap", "ItemHidden", DialogFocusItem.Color == DialogFocusItem.Asset.DefaultColor ? "Default" : DialogFocusItem.Color);
		DialogFocusItem = InventoryGet(C, "ItemHidden");
	}
	if (NewType == "WrapStrap") {
		InventoryWear(C, "LeatherArmbinderWrapStrap", "ItemHidden", DialogFocusItem.Color == DialogFocusItem.Asset.DefaultColor ? "Default" : DialogFocusItem.Color);
		DialogFocusItem = InventoryGet(C, "ItemHidden");
	}

	// Pushes the change to the chatroom
	CharacterRefresh(C);
	var msg = "LeatherArmbinderSet" + ((NewType == null) ? "Strap" : NewType);
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	ChatRoomCharacterItemUpdate(C, "ItemHidden");
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}
