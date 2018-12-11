// Add a new item by group & name to character inventory
function InventoryAdd(C, NewItemName, NewItemGroup, Push) {

	// First, we check if the inventory already exists, exit if it's the case
	for (var I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Name == NewItemName) && (C.Inventory[I].Group == NewItemGroup))
			return;

	// Searches to find the item asset in the current character assets family
	var NewItemAsset;
	for (var A = 0; A < Asset.length; A++)
		if ((Asset[A].Name == NewItemName) && (Asset[A].Group.Name == NewItemGroup) && (Asset[A].Group.Family == C.AssetFamily)) {
			NewItemAsset = Asset[A];
			break;
		}
		
	// Creates the item and pushes it in the inventory queue
	var NewItem = {
		Name: NewItemName,
		Group: NewItemGroup,
		Asset: NewItemAsset
	}
	C.Inventory.push(NewItem);

	// Sends the new item to the server if it's for the current player
	if ((C.ID == 0) && ((Push == null) || Push))
		AccountRequest("inventory_add", "&name=" + NewItemName + "&group=" + NewItemGroup);

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

// Returns TRUE if we can equip a pelvis item (needs no clothes and no panties)
function InventoryAllowPelvisItem(C) {
	if ((InventoryGet(C, "Cloth") != null) || (InventoryGet(C, "Panties") != null)) {
		DialogSetText("RemoveClothesForItem");
		return false;
	}
	return true;
}

// Returns TRUE if we can equip a torso item (needs no clothes and no bra)
function InventoryAllowTorsoItem(C) {
	if (InventoryGet(C, "Cloth") != null) {
		DialogSetText("RemoveClothesForItem");
		return false;
	}
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
function InventoryWear(C, AssetName, AssetGroup, ItemColor) {
	for (var A = 0; A < Asset.length; A++)
		if ((Asset[A].Name == AssetName) && (Asset[A].Group.Name == AssetGroup))
			CharacterAppearanceSetItem(C, AssetGroup, Asset[A], ItemColor);
	CharacterRefresh(C);
}

// Sets the difficulty to remove an item
function InventorySetDifficulty(C, AssetGroup, Difficulty) {
	if ((Difficulty >= 0) && (Difficulty <= 100))
		for (var A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Name == AssetGroup))
				C.Appearance[A].Difficulty = Difficulty;
}

// Makes the character wear a random item from a group
function InventoryWearRandom(C, AssetGroup) {
	var List = [];
	for (var A = 0; A < Asset.length; A++)
		if ((Asset[A].Group.Name == AssetGroup) && Asset[A].Wear && Asset[A].Enable)
			List.push(Asset[A]);
	if (List.length == 0) return;
	CharacterAppearanceSetItem(C, AssetGroup, List[Math.floor(Math.random() * List.length)]);
	CharacterRefresh(C);
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