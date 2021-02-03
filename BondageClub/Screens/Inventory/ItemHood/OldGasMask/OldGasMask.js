"use strict";

// Loads the item extension properties
function InventoryItemHoodOldGasMaskLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = {};
}

// Draw the item extension screen
function InventoryItemHoodOldGasMaskDraw() {
	DrawAssetPreview(1387, 225, DialogFocusItem.Asset);

	var C = CharacterGetCurrent();
	var tube1 = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskTube1");
	var tube2 = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskTube2");
	var rebreather = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskRebreather");
	var lenses = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskLenses");
	var lensesTube1 = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskLensesTube1");
	var lensesTube2 = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskLensesTube2");
	var lensesRebreather = InventoryItemCreate(C, "ItemHoodAddon", "OldGasMaskLensesRebreather");

	var itemBlocked = InventoryGet(C, "ItemHoodAddon") != null;
	var tube1IsBlocked = InventoryBlockedOrLimited(C, tube1);
	var tube2IsBlocked = InventoryBlockedOrLimited(C, tube2);
	var rebreatherIsBlocked = InventoryBlockedOrLimited(C, rebreather);
	var lensesIsBlocked = InventoryBlockedOrLimited(C, lenses);
	var lensesTube1IsBlocked = InventoryBlockedOrLimited(C, lensesTube1);
	var lensesTube2IsBlocked = InventoryBlockedOrLimited(C, lensesTube2);
	var lensesRebreatherIsBlocked = InventoryBlockedOrLimited(C, lensesRebreather);

	DrawButton(1250, 520, 200, 55, DialogFindPlayer("OldGasMaskLenses"), itemBlocked || lensesIsBlocked ? "#888" : "White");
	DrawButton(1550, 520, 200, 55, DialogFindPlayer("OldGasMaskTubeA"), itemBlocked || tube1IsBlocked ? "#888" : "White");
	DrawButton(1250, 600, 200, 55, DialogFindPlayer("OldGasMaskRebreather"), itemBlocked || rebreatherIsBlocked ? "#888" : "White");
	DrawButton(1550, 600, 200, 55, DialogFindPlayer("OldGasMaskTubeB"), itemBlocked || tube2IsBlocked ? "#888" : "White");
	DrawButton(1250, 680, 200, 55, DialogFindPlayer("OldGasMaskLensesTube1"), itemBlocked || lensesTube1IsBlocked ? "#888" : "White");
	DrawButton(1550, 680, 200, 55, DialogFindPlayer("OldGasMaskLensesTube2"), itemBlocked || lensesTube2IsBlocked ? "#888" : "White");
	DrawButton(1250, 760, 200, 55, DialogFindPlayer("OldGasMaskLensesRebreather"), itemBlocked || lensesRebreatherIsBlocked ? "#888" : "White");

	// Draw the message if the player is wearing an addon
	if (tube1IsBlocked || tube2IsBlocked || lensesIsBlocked || rebreatherIsBlocked || lensesTube1IsBlocked || lensesTube2IsBlocked || lensesRebreatherIsBlocked) { 
		DrawTextWrap(DialogFindPlayer("ItemAddonsSomeWrongPermissions"), 1100, 850, 800, 160, "White");
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
	if (InventoryBlockedOrLimited(C, item)) return;
	
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
