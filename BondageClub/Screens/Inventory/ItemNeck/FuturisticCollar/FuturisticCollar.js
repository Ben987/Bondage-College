"use strict";

// Loads the item extension properties
function InventoryItemNeckFuturisticCollarLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} 
}



		
// Draw the item extension screen
function InventoryItemNeckFuturisticCollarDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else {
		DrawRect(1387, 225, 225, 275, "white");
		DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
		DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
		
		
		var FuturisticCollarStatus = "NoItems"
		var FuturisticCollarItems = InventoryItemNeckFuturisticCollarGetItems(C)
		var FuturisticCollarItemsUnlockable = InventoryItemNeckFuturisticCollarGetItems(C, true)
		var lockedItems = 0
		for (let I = 0; I < FuturisticCollarItems.length; I++) {
			if (InventoryGetLock(FuturisticCollarItems[I])) {
				lockedItems += 1
			}
		}
		if (FuturisticCollarItems.length > 0) {
			if (lockedItems == 0) FuturisticCollarStatus = "NoLocks"
			else if (lockedItems < FuturisticCollarItems.length) FuturisticCollarStatus = "PartialLocks"
			else if (lockedItems == FuturisticCollarItems.length) FuturisticCollarStatus = "FullyLocked"
		}
		
		DrawText(DialogFind(Player, "FuturisticCollarOptions" + FuturisticCollarStatus), 1500, 600, "White", "Gray");
		
		if (FuturisticCollarItems.length > 0 && lockedItems < FuturisticCollarItems.length) {
			if (InventoryItemNeckFuturisticCollarCanLock(C, "MetalPadlock", "ItemMisc")) DrawButton(1250, 650, 200, 55, DialogFind(Player, "FuturisticCollarLockMetal"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "ExclusivePadlock", "ItemMisc")) DrawButton(1550, 650, 200, 55, DialogFind(Player, "FuturisticCollarLockExclusive"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "TimerPadlock", "ItemMisc")) DrawButton(1250, 710, 200, 55, DialogFind(Player, "FuturisticCollarLockTimer"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "MistressPadlock", "ItemMisc")) DrawButton(1550, 710, 200, 55, DialogFind(Player, "FuturisticCollarLockMistress"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "LoversPadlock", "ItemMisc")) DrawButton(1250, 770, 200, 55, DialogFind(Player, "FuturisticCollarLockLover"), "White");
			if (InventoryItemNeckFuturisticCollarCanLock(C, "OwnerPadlock", "ItemMisc")) DrawButton(1550, 770, 200, 55, DialogFind(Player, "FuturisticCollarLockOwner"), "White");
		}
		
		if (FuturisticCollarItemsUnlockable.length > 0) {
			DrawButton(1400, 880, 200, 55, DialogFind(Player, "FuturisticCollarUnlock"), "White");
		}
	}
}

function InventoryItemNeckFuturisticCollarExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}


// Catches the item extension clicks
function InventoryItemNeckFuturisticCollarClick() {
	
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else {
		
		if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemNeckFuturisticCollarExit();
		else {
		
			var FuturisticCollarItems = InventoryItemNeckFuturisticCollarGetItems(C)
			var FuturisticCollarItemsUnlockable = InventoryItemNeckFuturisticCollarGetItems(C, true)
			var lockedItems = 0
			for (let I = 0; I < FuturisticCollarItems.length; I++) {
				if (InventoryGetLock(FuturisticCollarItems[I])) {
					lockedItems += 1
				}
			}
			
			var CollarAction = 0 // 0 - nothing, 1 - Lock, 2 - Unlock
			if (FuturisticCollarItems.length > 0 ) {
				
				if (lockedItems < FuturisticCollarItems.length) {
					if (MouseIn(1250, 650, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "MetalPadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "MetalPadlock"); CollarAction = 1}
					else if (MouseIn(1550, 650, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "ExclusivePadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "ExclusivePadlock"); CollarAction = 1}
					else if (MouseIn(1250, 710, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "TimerPadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "TimerPadlock"); CollarAction = 1}
					else if (MouseIn(1550, 710, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "MistressPadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "MistressPadlock"); CollarAction = 1}
					else if (MouseIn(1250, 770, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "LoversPadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "LoversPadlock"); CollarAction = 1}
					else if (MouseIn(1550, 770, 200, 55) && InventoryItemNeckFuturisticCollarCanLock(C, "OwnerPadlock", "ItemMisc")) { InventoryItemNeckFuturisticCollarLockdown(C, "OwnerPadlock"); CollarAction = 1}
				}
			}
			if (MouseIn(1400, 880, 200, 55) && FuturisticCollarItemsUnlockable.length > 0) { InventoryItemNeckFuturisticCollarUnlock(C); CollarAction = 2}
			
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
	InventoryAvailable(Player, LockType, "ItemMisc")
	var LockItem = null	
	// First, we check if the inventory already exists, exit if it's the case
	for (let I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Name == LockType) && (C.Inventory[I].Group == "ItemMisc")) {
			LockItem = C.Inventory[I]
			break;
		}
		

		
	if (LockItem && !(InventoryIsPermissionBlocked(C, LockType, "ItemMisc") || !InventoryCheckLimitedPermission(C, LockItem))) {
	


		// Make sure we do not add owner/lover only items for invalid characters, owner/lover locks can be applied on the player by the player for self-bondage
		if (LockItem.Asset.OwnerOnly && !C.IsOwnedByPlayer())
			if ((C.ID != 0) || ((C.Owner == "") && (C.Ownership == null)) || ((C.ID == 0) && LogQuery("BlockOwnerLockSelf", "OwnerRule")))
				return false;
		if (LockItem.Asset.LoverOnly && !C.IsLoverOfPlayer())
			if ((C.ID != 0) || (C.Lovership.length == 0) || ((C.ID == 0) && C.GetLoversNumbers(true).length == 0))
				return false;
		return true
	} 
	return false
}

function InventoryItemNeckFuturisticCollarGetItems(C, OnlyUnlockable) {
	var ItemList = []
	
	for (let E = C.Appearance.length - 1; E >= 0; E--)
		if (((C.Appearance[E].Asset.Name.indexOf("Futuristic") >= 0 || C.Appearance[E].Asset.Name.indexOf("Interactive") >= 0) && C.Appearance[E].Asset.Group.Name != "ItemNeck") &&
			(C.Appearance[E].Asset.AllowLock)
			&& (!OnlyUnlockable || (InventoryGetLock(C.Appearance[E]) != null && InventoryItemHasEffect(C.Appearance[E], "Lock", true) && DialogCanUnlock(C, C.Appearance[E])))) {
				ItemList.push(C.Appearance[E])
		}
	
	return ItemList
}

function InventoryItemNeckFuturisticCollarValidate(C, Option) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Option)
}


function InventoryItemNeckFuturisticCollarLockdown(C, LockType) {
	for (let E = C.Appearance.length - 1; E >= 0; E--)
		if (((C.Appearance[E].Asset.Name.indexOf("Futuristic") >= 0 || C.Appearance[E].Asset.Name.indexOf("Interactive") >= 0) && C.Appearance[E].Asset.Group.Name != "ItemNeck") &&
			(C.Appearance[E].Asset.AllowLock && InventoryGetLock(C.Appearance[E]) == null)) {
				InventoryLock(C, C.Appearance[E], LockType, Player.MemberNumber);
				var Lock = InventoryGetLock(C.Appearance[E])
		}
		
	ChatRoomCharacterUpdate(C);
	CharacterRefresh(C, true);
	

	
	if (CurrentScreen == "ChatRoom")	{
		var Message;
		var Dictionary = [
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
			{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		];

		Message = "FuturisticCollarTriggerLockdown";

		ServerSend("ChatRoomChat", { Content: Message, Type: "Action", Dictionary });
	}
		//ServerSend("ChatRoomChat", { Content: " feels her bindings tightening around her body with a hiss as they lock themselves automatically.", Type: "Emote" });
}

function InventoryItemNeckFuturisticCollarUnlock(C) {
	for (let E = C.Appearance.length - 1; E >= 0; E--)
		if (((C.Appearance[E].Asset.Name.indexOf("Futuristic") >= 0 || C.Appearance[E].Asset.Name.indexOf("Interactive") >= 0) && C.Appearance[E].Asset.Group.Name != "ItemNeck") &&
			(InventoryGetLock(C.Appearance[E]) != null && InventoryItemHasEffect(C.Appearance[E], "Lock", true) && DialogCanUnlock(C, C.Appearance[E]))) {
				InventoryUnlock(C, C.Appearance[E])
		}
	
	ChatRoomCharacterUpdate(C);
	CharacterRefresh(C, true);
	
	if (CurrentScreen == "ChatRoom")	{
		var Message;
		var Dictionary = [
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
			{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		];

		Message = "FuturisticCollarTriggerUnlock";
		
		ServerSend("ChatRoomChat", { Content: Message, Type: "Action", Dictionary });
	}
	
	//if (CurrentScreen == "ChatRoom")	
	// ServerSend("ChatRoomChat", { Content: " 's bindings unlock with a hiss.", Type: "Emote" });
}