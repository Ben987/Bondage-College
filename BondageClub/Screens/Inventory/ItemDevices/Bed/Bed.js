"use strict";

// Loads the item extension properties
function InventoryItemDevicesBedLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = {};
}

// Draw the item extension screen
function InventoryItemDevicesBedDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
}

// Catches the item extension clicks
function InventoryItemDevicesBedClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	var itemBlocked = InventoryGet(C, "ItemAddon") != null;
	DrawButton(1250, 750, 200, 55, DialogFind(Player, "Covers"), "#888", "White");
    DrawButton(1550, 750, 200, 55, DialogFind(Player, "Ropes"), "#888", "White");
	if ((MouseX >= 1250) && (MouseX <= 1450) && (MouseY >= 650) && (MouseY <= 705) && !itemBlocked) InventoryItemDevicesBedSetItem("Covers");
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && !itemBlocked) InventoryItemDevicesBedSetItem("Ropes");

}

// Sets the lenses
function InventoryItemDevicesBedSetItem(Item) {

	// Loads the item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemDevicesBedLoad();
	}
	
	// Do not continue if the item is blocked by permissions
	if (InventoryIsPermissionBlocked(C, Item, "ItemAddon") || InventoryIsPermissionLimited(C, Item, "ItemAddon")) return;
	
	// Wear the item
	InventoryWear(C, Item, "ItemAddon", DialogColorSelect);
	DialogFocusItem = InventoryGet(C, "ItemAddon");
	
	// Refreshes the character and chatroom
	CharacterRefresh(C);
	CharacterLoadEffect(C);
	var msg = "BedUse" + Item;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	ChatRoomCharacterItemUpdate(C, "ItemAddon");

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}

