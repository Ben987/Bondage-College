"use strict";

// Loads the item extension properties
function InventoryItemNeckFuturisticCollarLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	} else {
		if (DialogFocusItem.Property == null) DialogFocusItem.Property = { OpenPermission: false };
		if (DialogFocusItem.Property.OpenPermission == null) DialogFocusItem.Property.OpenPermission = false;
		if (DialogFocusItem.Property.BlockRemotes == null) DialogFocusItem.Property.BlockRemotes = false;
	}
}




// Draw the item extension screen
function InventoryItemNeckFuturisticCollarDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else {
		DrawAssetPreview(1387, 65, DialogFocusItem.Asset);

		if ((DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem))) {
			DrawText(DialogFindPlayer("FuturisticCollarOptionsLockout"), 1500, 375, "White", "Gray");
		}

		DrawButton(1125, 395, 64, 64, "", "White", DialogFocusItem.Property.OpenPermission ? "Icons/Checked.png" : "");
		DrawText(DialogFindPlayer("FuturisticCollarOpenPermission"), 1550, 425, "White", "Gray");
		DrawButton(1125, 465, 64, 64, "", "White", DialogFocusItem.Property.BlockRemotes ? "Icons/Checked.png" : "");
		DrawText(DialogFindPlayer("FuturisticCollarBlockRemotes"), 1450, 495, "White", "Gray");

		var FuturisticCollarStatus = "NoItems";
		var FuturisticCollarItems = InventoryItemNeckFuturisticCollarGetItems(C);
		var FuturisticCollarItemsUnlockable = InventoryItemNeckFuturisticCollarGetItems(C, true);
		var lockedItems = 0;
		for (let I = 0; I < FuturisticCollarItems.length; I++) {
			if (InventoryGetLock(FuturisticCollarItems[I])) {
				lockedItems += 1;
			}
		}
		if (FuturisticCollarItems.length > 0) {
			if (lockedItems == 0) FuturisticCollarStatus = "NoLocks";
			else if (lockedItems < FuturisticCollarItems.length) FuturisticCollarStatus = "PartialLocks";
			else if (lockedItems == FuturisticCollarItems.length) FuturisticCollarStatus = "FullyLocked";
		}

		DrawText(DialogFindPlayer("FuturisticCollarOptions" + FuturisticCollarStatus), 1500, 560, "White", "Gray");

		if (FuturisticCollarItems.length > 0 && lockedItems < FuturisticCollarItems.length) {
			if (InventoryItemNeckFuturisticCollarCanLock(C, "MetalPadlock", "ItemMisc")) DrawButton(1250, 590, 200, 55, DialogFindPlayer("FuturisticCollarLockMetal"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "ExclusivePadlock", "ItemMisc")) DrawButton(1550, 590, 200, 55, DialogFindPlayer("FuturisticCollarLockExclusive"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "IntricatePadlock", "ItemMisc")) DrawButton(1250, 650, 200, 55, DialogFindPlayer("FuturisticCollarLockIntricate"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "HighSecurityPadlock", "ItemMisc")) DrawButton(1550, 650, 200, 55, DialogFindPlayer("FuturisticCollarLockHighSec"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "TimerPadlock", "ItemMisc")) DrawButton(1250, 710, 200, 55, DialogFindPlayer("FuturisticCollarLockTimer"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "MistressPadlock", "ItemMisc")) DrawButton(1550, 710, 200, 55, DialogFindPlayer("FuturisticCollarLockMistress"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "LoversPadlock", "ItemMisc")) DrawButton(1250, 770, 200, 55, DialogFindPlayer("FuturisticCollarLockLover"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "OwnerPadlock", "ItemMisc")) DrawButton(1550, 770, 200, 55, DialogFindPlayer("FuturisticCollarLockOwner"), "White");
		}

		if (FuturisticCollarItemsUnlockable.length > 0) {
			DrawButton(1400, 850, 200, 55, DialogFindPlayer("FuturisticCollarUnlock"), "White");
		}
		if (FuturisticCollarItems.length > 0) {
			DrawButton(1400, 910, 200, 55, DialogFindPlayer("FuturisticCollarColor"), "White");
		}


	}
}

function InventoryItemNeckFuturisticCollarExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}


// Catches the item extension clicks
function InventoryItemNeckFuturisticCollarClick() {

	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else {

		if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemNeckFuturisticCollarExit();
		else if (MouseIn(1125, 395, 64, 64) && !(DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem))) InventoryItemNeckFuturisticCollarTogglePermission(C, DialogFocusItem);
		else if (MouseIn(1125, 465, 64, 64) && !(DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem))) InventoryItemNeckFuturisticCollarToggleRemotes(C, DialogFocusItem);
		else {

			var FuturisticCollarItems = InventoryItemNeckFuturisticCollarGetItems(C);
			var FuturisticCollarItemsUnlockable = InventoryItemNeckFuturisticCollarGetItems(C, true);
			var lockedItems = 0;
			for (let I = 0; I < FuturisticCollarItems.length; I++) {
				if (InventoryGetLock(FuturisticCollarItems[I])) {
					lockedItems += 1;
				}
			}

			var CollarAction = 0; // 0 - nothing, 1 - Lock, 2 - Unlock, 3 - Color
			if (FuturisticCollarItems.length > 0 ) {

				if (lockedItems < FuturisticCollarItems.length) {
					if (MouseIn(1250, 590, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "MetalPadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "MetalPadlock"); CollarAction = 1;}
					else if (MouseIn(1550, 590, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "ExclusivePadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "ExclusivePadlock"); CollarAction = 1;}
					if (MouseIn(1250, 650, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "IntricatePadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "IntricatePadlock"); CollarAction = 1;}
					else if (MouseIn(1550, 650, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "HighSecurityPadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "HighSecurityPadlock"); CollarAction = 1;}
					else if (MouseIn(1250, 710, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "TimerPadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "TimerPadlock"); CollarAction = 1;}
					else if (MouseIn(1550, 710, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "MistressPadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "MistressPadlock"); CollarAction = 1;}
					else if (MouseIn(1250, 770, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "LoversPadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "LoversPadlock"); CollarAction = 1;}
					else if (MouseIn(1550, 770, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "OwnerPadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "OwnerPadlock"); CollarAction = 1;}
				}
			}
			if (MouseIn(1400, 850, 200, 55) && FuturisticCollarItemsUnlockable.length > 0) { InventoryItemNeckFuturisticCollarUnlock(C); CollarAction = 2;}
			if (MouseIn(1400, 910, 200, 55) && FuturisticCollarItems.length > 0 && DialogFocusItem) { InventoryItemNeckFuturisticCollarColor(C, DialogFocusItem); CollarAction = 3;}

			if (CollarAction > 0) {
				InventoryItemNeckFuturisticCollarExit();

				/*var vol = 1
				if (Player.AudioSettings && Player.AudioSettings.Volume) {
					vol = Player.AudioSettings.Volume
				}
				if (CollarAction == 1)
					AudioPlayInstantSound("Audio/HydraulicLock.mp3", vol)
				else
					AudioPlayInstantSound("Audio/HydraulicUnlock.mp3", vol)*/

			}
		}
	}
}




function InventoryItemNeckFuturisticCollarCanLock(C, LockType) {
	InventoryAvailable(Player, LockType, "ItemMisc");
	var LockItem = null;
	// First, we check if the inventory already exists, exit if it's the case
	for (let I = 0; I < Player.Inventory.length; I++)
		if ((Player.Inventory[I].Name == LockType) && (Player.Inventory[I].Group == "ItemMisc")) {
			LockItem = Player.Inventory[I];
			break;
		}
	// Next we check if the target player has it, but not for the mistress, owner, or lover locks
	if (LockItem == null && LockType != "MistressPadlock" && LockType != "LoversPadlock" && LockType != "OwnerPadlock")
	for (let I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Name == LockType) && (C.Inventory[I].Group == "ItemMisc")) {
			LockItem = C.Inventory[I];
			break;
		}



	if (LockItem && !(InventoryBlockedOrLimited(C, LockItem))) {



		// Make sure we do not add owner/lover only items for invalid characters, owner/lover locks can be applied on the player by the player for self-bondage
		if (LockItem.Asset.OwnerOnly && !C.IsOwnedByPlayer())
			if ((C.ID != 0) || ((C.Owner == "") && (C.Ownership == null)) || ((C.ID == 0) && LogQuery("BlockOwnerLockSelf", "OwnerRule")))
				return false;
		if (LockItem.Asset.LoverOnly && !C.IsLoverOfPlayer())
			if ((C.ID != 0) || (C.Lovership.length == 0) || ((C.ID == 0) && C.GetLoversNumbers(true).length == 0))
				return false;
		return true;
	}
	return false;
}

function InventoryItemNeckFuturisticCollarGetItems(C, OnlyUnlockable) {
	var ItemList = [];

	for (let E = C.Appearance.length - 1; E >= 0; E--)
		if (((C.Appearance[E].Asset.Name.indexOf("Futuristic") >= 0 || C.Appearance[E].Asset.Name.indexOf("Interactive") >= 0 || C.Appearance[E].Asset.Name.indexOf("Electronic") >= 0) && (!OnlyUnlockable || C.Appearance[E].Asset.Group.Name != "ItemNeck")) &&
			(C.Appearance[E].Asset.AllowLock)
			&& (!OnlyUnlockable || (InventoryGetLock(C.Appearance[E]) != null && InventoryItemHasEffect(C.Appearance[E], "Lock", true) && DialogCanUnlock(C, C.Appearance[E])))) {
				ItemList.push(C.Appearance[E]);
		}

	return ItemList;
}

function InventoryItemNeckFuturisticCollarValidate(C, Option) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Option);
}


function InventoryItemNeckFuturisticCollarLockdown(C, LockType) {
	for (let E = C.Appearance.length - 1; E >= 0; E--)
		if (((C.Appearance[E].Asset.Name.indexOf("Futuristic") >= 0 || C.Appearance[E].Asset.Name.indexOf("Interactive") >= 0 || C.Appearance[E].Asset.Name.indexOf("Electronic") >= 0) &&
			(C.Appearance[E].Asset.AllowLock && InventoryGetLock(C.Appearance[E]) == null))) {
				InventoryLock(C, C.Appearance[E], LockType, Player.MemberNumber);
				var Lock = InventoryGetLock(C.Appearance[E]);
		}

	ChatRoomCharacterUpdate(C);
	CharacterRefresh(C, true);



	if (CurrentScreen == "ChatRoom")	{
		var Message;
		var Dictionary = [
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
			{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
		];

		Message = "FuturisticCollarTriggerLockdown";

		ServerSend("ChatRoomChat", { Content: Message, Type: "Action", Dictionary });
	}
		//ServerSend("ChatRoomChat", { Content: " feels her bindings tightening around her body with a hiss as they lock themselves automatically.", Type: "Emote" });
}

function InventoryItemNeckFuturisticCollarUnlock(C) {
	for (let E = C.Appearance.length - 1; E >= 0; E--)
		if (((C.Appearance[E].Asset.Name.indexOf("Futuristic") >= 0 || C.Appearance[E].Asset.Name.indexOf("Interactive") >= 0 || C.Appearance[E].Asset.Name.indexOf("Electronic") >= 0) && C.Appearance[E].Asset.Group.Name != "ItemNeck") &&
			(InventoryGetLock(C.Appearance[E]) != null && InventoryItemHasEffect(C.Appearance[E], "Lock", true) && DialogCanUnlock(C, C.Appearance[E]))) {
				InventoryUnlock(C, C.Appearance[E]);
		}

	ChatRoomCharacterUpdate(C);
	CharacterRefresh(C, true);

	if (CurrentScreen == "ChatRoom")	{
		var Message;
		var Dictionary = [
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
			{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
		];

		Message = "FuturisticCollarTriggerUnlock";

		ServerSend("ChatRoomChat", { Content: Message, Type: "Action", Dictionary });
	}

	//if (CurrentScreen == "ChatRoom")
	// ServerSend("ChatRoomChat", { Content: " 's bindings unlock with a hiss.", Type: "Emote" });
}

function InventoryItemNeckFuturisticCollarColor(C, Item) {
	for (let E = C.Appearance.length - 1; E >= 0; E--)
		if (C.Appearance[E].Asset.Name.indexOf("Futuristic") >= 0 && C.Appearance[E].Asset.Group.Name != "ItemNeck" || C.Appearance[E].Asset.Name.indexOf("Electronic") >= 0) {

			for (let L = C.Appearance[E].Asset.Layer.length - 1; L >= 0; L--) {

				if (C.Appearance[E].Asset.Layer[L].Name != "Light" && C.Appearance[E].Asset.Layer[L].Name != "Shine") {
					if (C.Appearance[E].Asset.Layer[L].Name == "Lock") {
						if (Item.Color[3] != "Default")
							C.Appearance[E].Color[L] = Item.Color[3];
						//C.Appearance[E].Asset.Layer[L].ColorIndex = Item.Asset.Layer[2].ColorIndex
					} else if (C.Appearance[E].Asset.Layer[L].Name == "Display" || C.Appearance[E].Asset.Layer[L].Name == "Screen" || C.Appearance[E].Asset.Layer[L].Name == "Ball") {
						if (Item.Color[0] != "Default")
							C.Appearance[E].Color[L] = Item.Color[0];
						//C.Appearance[E].Asset.Layer[L].ColorIndex = Item.Asset.Layer[0].ColorIndex
					} else if (C.Appearance[E].Asset.Layer[L].Name != "Mesh" && C.Appearance[E].Asset.Layer[L].Name != "Text") {
						if (Item.Color[1] != "Default")
							C.Appearance[E].Color[L] = Item.Color[1];
						//C.Appearance[E].Asset.Layer[L].ColorIndex = Item.Asset.Layer[1].ColorIndex
					} else if (C.Appearance[E].Asset.Layer[L].Name != "Text") {
						if (Item.Color[2] != "Default")
							C.Appearance[E].Color[L] = Item.Color[2];
						//C.Appearance[E].Asset.Layer[L].ColorIndex = Item.Asset.Layer[2].ColorIndex
					}
				}
			}
		}

	ChatRoomCharacterUpdate(C);
	CharacterRefresh(C, true);

	if (CurrentScreen == "ChatRoom")	{
		var Message;
		var Dictionary = [
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
			{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
		];

		Message = "FuturisticCollarTriggerColor";

		ServerSend("ChatRoomChat", { Content: Message, Type: "Action", Dictionary });
	}

	//if (CurrentScreen == "ChatRoom")
	// ServerSend("ChatRoomChat", { Content: " 's bindings unlock with a hiss.", Type: "Emote" });
}

function InventoryItemNeckFuturisticCollarTogglePermission(C, Item) {
	if (Item.Property && Item.Property.OpenPermission != null) {
		Item.Property.OpenPermission = !Item.Property.OpenPermission;

		ChatRoomCharacterUpdate(C);
		CharacterRefresh(C, true);

		if (CurrentScreen == "ChatRoom")	{
			var Message;
			var Dictionary = [
				{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
				{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
			];

			Message = "FuturisticCollarSetOpenPermission";
			if (Item.Property.OpenPermission) Message = Message + "On";
			else Message = Message + "Off";

			ServerSend("ChatRoomChat", { Content: Message, Type: "Action", Dictionary });
		}
	}
}


function InventoryItemNeckFuturisticCollarToggleRemotes(C, Item) {
	if (Item.Property && Item.Property.BlockRemotes != null) {
		Item.Property.BlockRemotes = !Item.Property.BlockRemotes;

		// Default the previous Property and Type to the first option if not found on the current item
		var PreviousProperty = DialogFocusItem.Property;

		// Create a new Property object based on the previous one
		var NewProperty = Object.assign({}, PreviousProperty);


		NewProperty.Effect = [];

		// If the item is locked, ensure it has the "Lock" effect
		if (NewProperty.LockedBy && !(NewProperty.Effect || []).includes("Lock")) {
			NewProperty.Effect = (NewProperty.Effect || []);
			NewProperty.Effect.push("Lock");
		}

		// If the item is locked, ensure it has the "Lock" effect
		if (Item.Property.BlockRemotes) {
			NewProperty.Effect = (NewProperty.Effect || []);
			NewProperty.Effect.push("BlockRemotes");
		}

		DialogFocusItem.Property = NewProperty;


		ChatRoomCharacterUpdate(C);
		CharacterRefresh(C, true);

		if (CurrentScreen == "ChatRoom")	{
			var Message;
			var Dictionary = [
				{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
				{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
			];

			Message = "FuturisticCollarSetBlockRemotes";
			if (Item.Property.BlockRemotes) Message = Message + "On";
			else Message = Message + "Off";

			ServerSend("ChatRoomChat", { Content: Message, Type: "Action", Dictionary });
		}
	}
}
