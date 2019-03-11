"use strict";

// Add a new item by group & name to character inventory
function InventoryAdd(C, NewItemName, NewItemGroup, Push) {

	// First, we check if the inventory already exists, exit if it's the case
	for (var I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Name == NewItemName) && (C.Inventory[I].Group == NewItemGroup))
			return;

	// Searches to find the item asset in the current character assets family
	var NewItemAsset = null;
	for (var A = 0; A < Asset.length; A++)
		if ((Asset[A].Name == NewItemName) && (Asset[A].Group.Name == NewItemGroup) && (Asset[A].Group.Family == C.AssetFamily)) {
			NewItemAsset = Asset[A];
			break;
		}

	// Only add the item if we found the asset
	if (NewItemAsset != null) {
		
		// Creates the item and pushes it in the inventory queue
		var NewItem = {
			Name: NewItemName,
			Group: NewItemGroup,
			Asset: NewItemAsset
		}
		C.Inventory.push(NewItem);

		// Sends the new item to the server if it's for the current player
		if ((C.ID == 0) && ((Push == null) || Push))
			ServerPlayerInventorySync();

	}

}

// Deletes an item from the character inventory
function InventoryDelete(C, DelItemName, DelItemGroup, Push) {

	// First, we remove the item from the player inventory
	for (var I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Name == DelItemName) && (C.Inventory[I].Group == DelItemGroup)) {
			C.Inventory.splice(I, 1);
			break;
		}

	// Next, we call the player account service to remove the item
	if ((C.ID == 0) && ((Push == null) || Push))
		ServerPlayerInventorySync();

}

// Loads the inventory from the account
function InventoryLoad(C, Inventory, Import) {
	
	// Flush the current inventory and import items from the Bondage College
	C.Inventory = [];

	// Make sure we have something to load
	if (Inventory != null) {

		// Add each items one by one
		for (var I = 0; I < Inventory.length; I++)
			InventoryAdd(C, Inventory[I].Name, Inventory[I].Group, false);

	}

}

// Checks if the character has the inventory available
function InventoryAvailable(C, InventoryName, InventoryGroup) {
	for (var I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Name == InventoryName) && (C.Inventory[I].Group == InventoryGroup))
			return true;
	return false;
}

// Returns TRUE if we can equip the item
function InventoryAllow(C, Prerequisite) {
	if ((Prerequisite == "AccessTorso") && (InventoryGet(C, "Cloth") != null)) { DialogSetText("RemoveClothesForItem"); return false; }
	if ((Prerequisite == "AccessBreast") && ((InventoryGet(C, "Cloth") != null) || (InventoryGet(C, "Bra") != null))) { DialogSetText("RemoveClothesForItem"); return false; }
	if ((Prerequisite == "AccessVulva") && ((InventoryGet(C, "Cloth") != null) || (InventoryGet(C, "ClothLower") != null) || (InventoryGet(C, "Panties") != null))) { DialogSetText("RemoveClothesForItem"); return false; }
	return true;
}

// Gets the current item worn a specific spot
function InventoryGet(C, AssetGroup) {
	for (var A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Family == C.AssetFamily) && (C.Appearance[A].Asset.Group.Name == AssetGroup))
			return C.Appearance[A];
	return null;
}

// Makes the character wear an item, color can be undefined
function InventoryWear(C, AssetName, AssetGroup, ItemColor, Difficulty) {
	for (var A = 0; A < Asset.length; A++)
		if ((Asset[A].Name == AssetName) && (Asset[A].Group.Name == AssetGroup))
			CharacterAppearanceSetItem(C, AssetGroup, Asset[A], ItemColor, Difficulty);
}

// Sets the difficulty to remove an item
function InventorySetDifficulty(C, AssetGroup, Difficulty) {
	if ((Difficulty >= 0) && (Difficulty <= 100))
		for (var A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Name == AssetGroup))
				C.Appearance[A].Difficulty = Difficulty;
	if ((CurrentModule != "Character") && (C.ID == 0)) ServerPlayerAppearanceSync();
}

// Returns TRUE if there's already a locked item at a given position
function InventoryLocked(C, AssetGroup) {
	var I = InventoryGet(C, AssetGroup);
	return ((I != null) && (I.Asset.Effect != null) && (I.Asset.Effect.indexOf("Lock") >= 0));
}

// Makes the character wear a random item from a group
function InventoryWearRandom(C, AssetGroup, Difficulty) {
	if (!InventoryLocked(C, AssetGroup)) {
		var List = [];
		for (var A = 0; A < Asset.length; A++)
			if ((Asset[A].Group.Name == AssetGroup) && Asset[A].Wear && Asset[A].Enable && Asset[A].Random)
				List.push(Asset[A]);
		if (List.length == 0) return;
		CharacterAppearanceSetItem(C, AssetGroup, List[Math.floor(Math.random() * List.length)], null, Difficulty);
		CharacterRefresh(C);
	}
}

// Removes a specific item from the player appearance
function InventoryRemove(C, AssetGroup) {
	for(var E = 0; E < C.Appearance.length; E++)
		if (C.Appearance[E].Asset.Group.Name == AssetGroup) {
			C.Appearance.splice(E, 1);
			E--;
		}
	CharacterRefresh(C);
}

// Returns TRUE if the currently worn item is blocked by another item (hoods blocks gags, belts blocks eggs, etc.)
function InventoryGroupIsBlocked(C) {
	for(var E = 0; E < C.Appearance.length; E++)
		if ((C.Appearance[E].Asset.Block != null) && (C.Appearance[E].Asset.Block.indexOf(C.FocusGroup.Name) >= 0))
			return true;
	return false;
}