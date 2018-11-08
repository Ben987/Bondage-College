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

	// Sends the new item to the server if the character is logged in
	if (C.AccountName != "")
		CharacterAccountRequest("inventory_add", "&name=" + NewItemName + "&group=" + NewItemGroup);

}

// Loads the inventory from the account
function InventoryLoad(C, Inventory, Import) {
	
	// Flush the current inventory
	C.Inventory = [];

	// If we come from the Bondage College, we add the Bondage College items
	if (Import && (localStorage.getItem("BondageClubImportSource") != null) && (localStorage.getItem("BondageClubImportSource") == "BondageCollege")) {
		InventoryAdd(C, "CollegeOutfit1", "Cloth");
		if ((localStorage.getItem("BondageCollegeExportBallGag") != null) && (localStorage.getItem("BondageCollegeExportBallGag") == "true")) InventoryAdd(C, "HarnessBallGag", "Gag");
		if ((localStorage.getItem("BondageCollegeExportClothGag") != null) && (localStorage.getItem("BondageCollegeExportClothGag") == "true")) InventoryAdd(C, "ClothOTMGag", "Gag");
		if ((localStorage.getItem("BondageCollegeExportTapeGag") != null) && (localStorage.getItem("BondageCollegeExportTapeGag") == "true")) InventoryAdd(C, "DuctTapeGag", "Gag");
		if ((localStorage.getItem("BondageCollegeExportTapeGag") != null) && (localStorage.getItem("BondageCollegeExportTapeGag") == "true")) InventoryAdd(C, "DuctTapeArm", "ArmRestraints");
		if ((localStorage.getItem("BondageCollegeExportTapeGag") != null) && (localStorage.getItem("BondageCollegeExportTapeGag") == "true")) InventoryAdd(C, "DuctTapeLeg", "LegRestraints");
		if ((localStorage.getItem("BondageCollegeExportRope") != null) && (localStorage.getItem("BondageCollegeExportRope") == "true")) InventoryAdd(C, "RopeArm", "ArmRestraints");
		if ((localStorage.getItem("BondageCollegeExportRope") != null) && (localStorage.getItem("BondageCollegeExportRope") == "true")) InventoryAdd(C, "RopeLeg", "LegRestraints");
		if ((localStorage.getItem("BondageCollegeExportCuffs") != null) && (localStorage.getItem("BondageCollegeExportCuffs") == "true")) InventoryAdd(C, "Cuffs", "ArmRestraints");
		if ((localStorage.getItem("BondageCollegeExportArmbinder") != null) && (localStorage.getItem("BondageCollegeExportArmbinder") == "true")) InventoryAdd(C, "Armbinder", "ArmRestraints");
		if ((localStorage.getItem("BondageCollegeExportChastityBelt") != null) && (localStorage.getItem("BondageCollegeExportChastityBelt") == "true")) InventoryAdd(C, "MetalChastityBelt", "Chastity");
		if ((localStorage.getItem("BondageCollegeExportCollar") != null) && (localStorage.getItem("BondageCollegeExportCollar") == "true")) InventoryAdd(C, "LeatherCollar", "Collar");
		if ((localStorage.getItem("BondageCollegeExportCrop") != null) && (localStorage.getItem("BondageCollegeExportCrop") == "true")) InventoryAdd(C, "Crop", "Weapon");
		if ((localStorage.getItem("BondageCollegeExportCuffsKey") != null) && (localStorage.getItem("BondageCollegeExportCuffsKey") == "true")) InventoryAdd(C, "CuffsKey", "Key");
		if ((localStorage.getItem("BondageCollegeExportSleepingPill") != null) && (localStorage.getItem("BondageCollegeExportSleepingPill") == "true")) InventoryAdd(C, "SleepingPill", "Drug");
		if ((localStorage.getItem("BondageCollegeExportVibratingEgg") != null) && (localStorage.getItem("BondageCollegeExportVibratingEgg") == "true")) InventoryAdd(C, "PinkEgg", "Egg");
	}
	
	// Make sure we have something to load
	if (Inventory != null) {

		// Add each items one by one
		var I;
		for (I = 0; I < Inventory.length; I++)
			InventoryAdd(C, Inventory[I].Name, Inventory[I].Group);

	}

}