"use strict";

// Loads the item extension properties
function InventoryItemHiddenLeatherArmbinderWrapStrapLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
}

// Draw the item extension screen
function InventoryItemHiddenLeatherArmbinderWrapStrapDraw() {
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
	DrawText(DialogFind(Player, "SelectIfDontType"), 1500, 500, "white", "gray");
	DrawButton(1389, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/None.png", 1389, 550);
	DrawText(DialogFind(Player, "LeatherArmbinderStrapTypeNone"), 1500, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemHiddenLeatherArmbinderWrapStrapClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1389) && (MouseX <= 1614) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != ""))) InventoryItemHiddenLeatherArmbinderWrapStrapSetType("");
}

// Sets if like (Strap, )
function InventoryItemHiddenLeatherArmbinderWrapStrapSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemHiddenLeatherArmbinderWrapStrapLoad();
	}
	DialogFocusItem.Property.Type = NewType;
	if (NewType == null) DialogFocusItem.Property.Difficulty = 3;
	
	if (NewType == "") {
		DialogFocusItem.Property.Difficulty = 0;
		InventoryRemove(C, "ItemHidden");
	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	var msg = "LeatherArmbinderStrapSet" + ((NewType) ? NewType : "None");
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}

