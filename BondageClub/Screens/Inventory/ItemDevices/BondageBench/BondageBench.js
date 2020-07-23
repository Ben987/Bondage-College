"use strict";

// Loads the item extension properties
function InventoryItemDevicesBondageBenchLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	var addonItem = InventoryGet(C, "ItemAddon");
	if (addonItem != null && addonItem.Name == ("BondageBenchStraps")) {
		DialogExtendItem(addonItem);
		return;
	}

	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	DialogFocusItem.Property.SelfUnlock = false;
}

// Draw the item extension screen
function InventoryItemDevicesBondageBenchDraw() {

	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	var strapsBlocked = InventoryGet(C, "Cloth") != null || InventoryGet(C, "ClothLower") != null;
	var itemBlocked = InventoryGet(C, "ItemAddon") != null;
	var BondageBenchStraps = InventoryItemCreate(C, "ItemAddon", "BondageBenchStraps");
	var itemPermissionBlocked = InventoryIsPermissionBlocked(C, "BondageBenchStraps", "ItemAddon") || !InventoryCheckLimitedPermission(C, BondageBenchStraps);

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	DrawText(DialogFind(Player, "BondageBenchSelectType"), 1500, 500, "white", "gray");
	DrawButton(1389, 550, 225, 225, "", (InventoryGet(C, "ItemAddon") != null || strapsBlocked) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/StrapUp.png", 1389, 550);
	DrawText(DialogFind(Player, "BondageBenchPoseStrapUp"), 1500, 800, "white", "gray");

	// Draw the message if the player is wearing clothes
	if (strapsBlocked) {
		DrawTextWrap(DialogFind(Player, "RemoveClothesForItem"), 1100, 850, 800, 160, "White");
	} else if (itemBlocked) { 
		DrawTextWrap(DialogFind(Player, "ItemAddonRemoveAddon"), 1100, 850, 800, 160, "White");
	} else if (itemPermissionBlocked) { 
		DrawTextWrap(DialogFind(Player, "ItemAddonUsedWithWrongPermissions"), 1100, 850, 800, 160, "White");
	}
}

// Catches the item extension clicks
function InventoryItemDevicesBondageBenchClick() {
	if (MouseIn(1885, 25, 90, 90)) DialogFocusItem = null;
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (MouseIn(1389, 550, 225, 225) && InventoryGet(C, "ItemAddon") == null) InventoryItemDevicesBondageBenchSetPose("StrapUp");
}

// Sets the cuffs pose (wrist, elbow, both or none)
function InventoryItemDevicesBondageBenchSetPose(NewPose) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemDevicesBondageBenchLoad();
	}

	var BondageBenchStraps = InventoryItemCreate(C, "ItemAddon", "BondageBenchStraps");

	// Do not continue if the item is blocked
	if (InventoryIsPermissionBlocked(C, "BondageBenchStraps", "ItemAddon") || !InventoryCheckLimitedPermission(C, BondageBenchStraps)) return;

	// Cannot be used with clothes or other addons
	if ((InventoryGet(C, "Cloth") != null) || (InventoryGet(C, "ClothLower") != null)) return;
	if (InventoryGet(C, "ItemAddon") != null) return;

	// Adds the strap and focus on it
	if (NewPose == "StrapUp") {
		InventoryWear(C, "BondageBenchStraps", "ItemAddon", DialogColorSelect);
		DialogFocusItem = InventoryGet(C, "ItemAddon");
	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = "BondageBenchRestrain" + ((NewPose == null) ? "None" : NewPose);
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	ChatRoomCharacterItemUpdate(C, "ItemAddon");

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}
