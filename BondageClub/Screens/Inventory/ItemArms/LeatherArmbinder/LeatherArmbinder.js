"use strict";

// Loads the item extension properties
function InventoryItemArmsLeatherArmbinderLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
}

// Draw the item extension screen
function InventoryItemArmsLeatherArmbinderDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + (DialogFocusItem.Property.Type || "") + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
	if (!DialogFocusItem.Property.Type) {
		DrawText(DialogFind(Player, "SelectStrapType"), 1500, 500, "white", "gray");
		DrawButton(1175, 550, 225, 225, "", "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Strap.png", 1175, 550);
		DrawText(DialogFind(Player, "LeatherArmbinderTypeStrap"), 1287, 800, "white", "gray");
		DrawButton(1600, 550, 225, 225, "", "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/WrapStrap.png", 1600, 550);
		DrawText(DialogFind(Player, "LeatherArmbinderTypeWrapStrap"), 1712, 800, "white", "gray");
	} else {
		DrawText(DialogFind(Player, "SelectIfDontType"), 1500, 500, "white", "gray");
		DrawButton(1389, 550, 225, 225, "", "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/None.png", 1389, 550);
		DrawText(DialogFind(Player, "LeatherArmbinderStrapTypeNone"), 1500, 800, "white", "gray");
	}
}

// Catches the item extension clicks
function InventoryItemArmsLeatherArmbinderClick() {
	if (MouseIn(1885, 25, 90, 90)) DialogFocusItem = null;
	// var C = CharacterGetCurrent();
	if (!DialogFocusItem.Property.Type) {
		if (MouseIn(1175, 550, 225, 225)) InventoryItemArmsLeatherArmbinderSetType("Strap");
		if (MouseIn(1600, 550, 225, 225)) InventoryItemArmsLeatherArmbinderSetType("WrapStrap");
	} else {
		if (MouseIn(1389, 550, 225, 225)) InventoryItemArmsLeatherArmbinderSetType("");
	}
}

// Sets the strap properties
function InventoryItemArmsLeatherArmbinderSetType(NewType) {

	// Sets the type, blocking zones and wand
	var C = CharacterGetCurrent();
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsLeatherArmbinderLoad();
	}

	DialogFocusItem.Property.Type = NewType;
	if (NewType == "") {
		delete DialogFocusItem.Property.Difficulty;
	} else {
		DialogFocusItem.Property.Difficulty = 3;
	}

	// Pushes the change to the chatroom
	CharacterRefresh(C);
	var msg = "LeatherArmbinderSet" + ((NewType == null) ? "Strap" : NewType);
	if (NewType != "") msg = "LeatherArmbinderStrapSetNone";
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}
