// Add a new item by group & name to character inventory
function InventoryAdd(C, NewItemName, NewItemGroup) {

	// First, we check if the inventory already exists, exit if it's the case
	var I;
	for (I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Name == NewItemName) && (C.Inventory[I].Group == NewItemGroup))
			return;

	// Searches to find the item asset in the current character assets family
	var NewItemAsset;
	for (A = 0; A < Asset.length; A++)
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

	// Sends the new item to the server
	if ((C.AccountName != "") && (NewItemAsset.Value != 0))
		CharacterAccountRequest("inventory_add", "&name=" + NewItemAsset.Name + "&group=" + NewItemAsset.Group.Name);
}

// Loads the inventory from the account
function InventoryLoad(C, Inventory) {
	
	// Make sure we have something to load
	if (Inventory != null) {

		// Add each items one by one
		var I;
		for (I = 0; I < Inventory.length; I++)
			InventoryAdd(C, Inventory[I].Name, Inventory[I].Group);

	}

}

// Creates the player starting inventory (CharacterID zero is always the player)
function InventoryCreate(C) {
	
	// Flush the current inventory
	C.Inventory = [];
	
	// If we come from the Bondage College, we add the Bondage College items
	if ((localStorage.getItem("BondageClubImportSource") != null) && (localStorage.getItem("BondageClubImportSource") == "BondageCollege")) {
		InventoryAdd(C, "Cloth", "CollegeOutfit1");
		if ((localStorage.getItem("BondageCollegeExportBallGag") != null) && (localStorage.getItem("BondageCollegeExportBallGag") == "true")) InventoryAddByName(C, "Gag", "BallGag");
		if ((localStorage.getItem("BondageCollegeExportClothGag") != null) && (localStorage.getItem("BondageCollegeExportClothGag") == "true")) InventoryAddByName(C, "Gag", "ClothGag");
		if ((localStorage.getItem("BondageCollegeExportTapeGag") != null) && (localStorage.getItem("BondageCollegeExportTapeGag") == "true")) InventoryAddByName(C, "Gag", "TapeGag");
	}

	// Adds all items with 0 value, these come by default for any character
	var A;
	for (A = 0; A < Asset.length; A++)
		if (Asset[A].Value == 0)
			InventoryAdd(C, Asset[A].Name, Asset[A].Group.Name);

}