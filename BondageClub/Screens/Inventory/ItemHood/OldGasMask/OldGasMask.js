"use strict";

// Loads the item extension properties
function InventoryItemHoodOldGasMaskLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = {};
}

// Draw the item extension screen
function InventoryItemHoodOldGasMaskDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");

	var C = CharacterGetCurrent();
	var tube1 = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskTube1");
	var tube2 = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskTube2");
	var rebreather = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskRebreather");
	var lenses = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskLenses");
	var lensesTube1 = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskLensesTube1");
	var lensesTube2 = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskLensesTube2");
	var lensesRebreather = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskLensesRebreather");

	var itemBlocked = InventoryGet(C, "ItemHoodAddon") != null;
	var tube1IsBlocked = InventoryIsPermissionBlocked(C, "OldGasMaskTube1", "ItemHoodAddon") || !InventoryCheckLimitedPermission(C, tube1);
	var tube2IsBlocked = InventoryIsPermissionBlocked(C, "OldGasMaskTube2", "ItemHoodAddon") || !InventoryCheckLimitedPermission(C, tube2);
	var rebreatherIsBlocked = InventoryIsPermissionBlocked(C, "OldGasMaskRebreather", "ItemHoodAddon") || !InventoryCheckLimitedPermission(C, rebreather);
	var lensesIsBlocked = InventoryIsPermissionBlocked(C, "OldGasMaskLenses", "ItemHoodAddon") || !InventoryCheckLimitedPermission(C, lenses);
	var lensesTube1IsBlocked = InventoryIsPermissionBlocked(C, "OldGasMaskLensesTube1", "ItemHoodAddon") || !InventoryCheckLimitedPermission(C, lensesTube1);
	var lensesTube2IsBlocked = InventoryIsPermissionBlocked(C, "OldGasMaskLensesTube2", "ItemHoodAddon") || !InventoryCheckLimitedPermission(C, lensesTube2);
	var lensesRebreatherIsBlocked = InventoryIsPermissionBlocked(C, "OldGasMaskLensesRebreather", "ItemHoodAddon") || !InventoryCheckLimitedPermission(C, lensesRebreather);

	DrawButton(1250, 520, 200, 55, DialogFind(Player, "OldGasMaskLenses"), itemBlocked || lensesIsBlocked ? "#888" : "White");
	DrawButton(1550, 520, 200, 55, DialogFind(Player, "OldGasMaskTubeA"), itemBlocked || tube1IsBlocked ? "#888" : "White");
	DrawButton(1250, 600, 200, 55, DialogFind(Player, "OldGasMaskRebreather"), itemBlocked || rebreatherIsBlocked ? "#888" : "White");
	DrawButton(1550, 600, 200, 55, DialogFind(Player, "OldGasMaskTubeB"), itemBlocked || tube2IsBlocked ? "#888" : "White");
	DrawButton(1250, 680, 200, 55, DialogFind(Player, "OldGasMaskLensesTube1"), itemBlocked || lensesTube1IsBlocked ? "#888" : "White");
	DrawButton(1550, 680, 200, 55, DialogFind(Player, "OldGasMaskLensesTube2"), itemBlocked || lensesTube2IsBlocked ? "#888" : "White");
	DrawButton(1250, 760, 200, 55, DialogFind(Player, "OldGasMaskLensesRebreather"), itemBlocked || lensesRebreatherIsBlocked ? "#888" : "White");

	// Draw the message if the player is wearing an addon
	if (tube1IsBlocked || tube2IsBlocked || lensesIsBlocked || rebreatherIsBlocked || lensesTube1IsBlocked || lensesTube2IsBlocked || lensesRebreatherIsBlocked) { 
		DrawTextWrap(DialogFind(Player, "ItemAddonsSomeWrongPermissions"), 1100, 850, 800, 160, "White");
	}
}

// Catches the item extension clicks
function InventoryItemHoodOldGasMaskClick() {
	var C = CharacterGetCurrent();
	var itemBlocked = InventoryGet(C, "ItemHoodAddon") != null;
	
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	
	if (MouseIn(1250, 520, 200, 55) && !itemBlocked) InventoryItemHoodOldGasMaskSetItem("OldGasMaskLenses");
	if (MouseIn(1550, 520, 200, 55) && !itemBlocked) InventoryItemHoodOldGasMaskSetItem("OldGasMaskTube1");
	if (MouseIn(1250, 600, 200, 55) && !itemBlocked) InventoryItemHoodOldGasMaskSetItem("OldGasMaskRebreather");
	if (MouseIn(1550, 600, 200, 55) && !itemBlocked) InventoryItemHoodOldGasMaskSetItem("OldGasMaskTube2");
	if (MouseIn(1250, 680, 200, 55) && !itemBlocked) InventoryItemHoodOldGasMaskSetItem("OldGasMaskLensesTube1");
	if (MouseIn(1550, 680, 200, 55) && !itemBlocked) InventoryItemHoodOldGasMaskSetItem("OldGasMaskLensesTube2");
	if (MouseIn(1250, 760, 200, 55) && !itemBlocked) InventoryItemHoodOldGasMaskSetItem("OldGasMaskLensesRebreather");
	
}

// Sets the lenses
function InventoryItemHoodOldGasMaskSetItem(itemName) {

	// Loads the item
	var C = CharacterGetCurrent();
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemHoodOldGasMaskLoad();
	}

	var item = InventoryItemCreate(C, "ItemHoodAddon", itemName);
	// Do not continue if the item is blocked by permissions
	if (InventoryIsPermissionBlocked(C, itemName, "ItemHoodAddon") || !InventoryCheckLimitedPermission(C, item)) return;
	
	// Wear the item
	InventoryWear(C, itemName, "ItemHoodAddon", DialogColorSelect);
	DialogFocusItem = InventoryGet(C, "ItemHoodAddon");
	
	// Refreshes the character and chatroom
	CharacterRefresh(C);
	CharacterLoadEffect(C);
	var msg = "OldGasMaskUse" + itemName;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	ChatRoomCharacterItemUpdate(C, "ItemHoodAddon");

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}
