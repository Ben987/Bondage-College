"use strict";
var ShopBackground = "Shop";
var ShopVendor = null;
var ShopCustomer = null;
var ShopVendorAllowItem = false;
var ShopBoughtEverything = false;
var ShopStarted = false;
var ShopText = "";
var ShopRescueScenario = "";
var ShopRescueScenarioList = ["BoughtEverything", "CatBurglar", "BoredVendor", "SleepingAtWork"];
var ShopItemOffset = 0;
var ShopDemoItemPayment = 0;
var ShopDemoItemGroup = "";
var ShopDemoItemGroupList = ["ItemHead", "ItemMouth", "ItemArms", "ItemLegs", "ItemFeet"];
var ShopSelectAsset = ShopAssetFocusGroup;
var ShopCart = [];
var ShopBuyMode = true;
// Prevent selling of items that can be earned for free
var ShopSellExceptions = [
	//CollegeTheaterInviteToPrivateRoom()
	{ Name: "WitchHat1", Group: "Hat" },
	{ Name: "BondageDress2", Group: "Cloth" },
	{ Name: "BondageBustier2", Group: "Cloth" },
	{ Name: "BatWings", Group: "Wings" },
	{ Name: "Dress2", Group: "Cloth" },
	//IntroductionGetBasicItems()
	{ Name: "NylonRope", Group: "ItemFeet" },
	{ Name: "NylonRope", Group: "ItemLegs" },
	{ Name: "NylonRope", Group: "ItemArms" },
	{ Name: "NylonRopeHarness", Group: "ItemTorso" },
	{ Name: "ClothGag", Group: "ItemMouth" },
	{ Name: "ClothGag", Group: "ItemMouth2" },
	{ Name: "ClothGag", Group: "ItemMouth3" },
	//SarahTransferSophieToRoom()
	{ Name: "LeatherCuffs", Group: "ItemArms" },
];

/**
 * Checks if the vendor is restrained
 * @returns {boolean} - Returns TRUE if the vendor is restrained or gagged
 */
function ShopIsVendorRestrained() { return (ShopVendor.IsRestrained() || !ShopVendor.CanTalk()); }
/**
 * Checks if the current rescue scenario corresponds to the given one
 * @param {string} ScenarioName - Name of the rescue scenario to check for
 * @returns {boolean} - Returns TRUE if the current rescue scenario is the given one
 */
function ShopIsRescueScenario(ScenarioName) { return (ShopRescueScenario == ScenarioName); }
/**
 * Activates the mode which allows the player to buy the items that appear in the inventory screen
 * @returns {void} - Nothing
 */
function ShopSetBuyMode() {
	ShopBuyMode = true;
}
/**
 * Activates the mode which allows the player to sell the items that appear in the inventory screen
 * @returns {void} - Nothing
 */
function ShopSetSellMode() {
	ShopBuyMode = false;
}

/**
 * Loads the shop room and its NPC
 * @returns {void} - Nothing
 */
function ShopLoad() {

	// Creates the shop vendor always at full height to be able to click on her zones correctly
	ShopVendor = CharacterLoadNPC("NPC_Shop_Vendor");
	InventoryWear(ShopVendor, "H1000", "Height", "Default");
	ShopVendor.AllowItem = ShopVendorAllowItem;
	ShopStarted = false;
	ShopText = TextGet("SelectItemBuy");

	// Rescue mission load
	if ((MaidQuartersCurrentRescue == "Shop") && !MaidQuartersCurrentRescueCompleted) ShopVendor.AllowItem = true;
	if ((MaidQuartersCurrentRescue == "Shop") && !MaidQuartersCurrentRescueStarted) {
		MaidQuartersCurrentRescueStarted = true;
		InventoryWearRandom(ShopVendor, "ItemFeet");
		InventoryWearRandom(ShopVendor, "ItemLegs");
		InventoryWearRandom(ShopVendor, "ItemArms");
		InventoryWearRandom(ShopVendor, "ItemNeck");
		InventoryWearRandom(ShopVendor, "ItemMouth");
		InventoryWearRandom(ShopVendor, "ItemHead");
		ShopVendor.Stage = "MaidRescue";
		ShopRescueScenario = CommonRandomItemFromList(ShopRescueScenario, ShopRescueScenarioList);
	}

}

/**
 * Runs and draws the shop screen.
 * @returns {void} - Nothing
 */
function ShopRun() {

	// Draw both characters
	DrawCharacter(Player, 0, 0, 1);
	DrawCharacter(ShopVendor, 500, 0, 1);
	if (ShopStarted && (ShopCart.length > 12)) DrawButton(1770, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	if (!ShopStarted) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");

	// In shopping mode
	if (ShopStarted) {
		// For each items in the assets with a value
		var X = 1000;
		var Y = 125;
		for (let A = ShopItemOffset; (A < ShopCart.length && A < ShopItemOffset + 12); A++) {
			const Hidden = CharacterAppearanceItemIsHidden(ShopCart[A].Name, ShopCart[A].Group.Name);
			const Description = ShopCart[A].Description + " " + (Math.ceil(ShopCart[A].Value * (ShopBuyMode ? 1 : 0.5))).toString()  + " $";
			const Background = MouseIn(X, Y, 225, 275) && !CommonIsMobile ? "cyan" : "#fff";
			const Foreground = InventoryAvailable(Player, ShopCart[A].Name, ShopCart[A].Group.Name) ? "green" : "red";
			if (Hidden) DrawPreviewBox(X, Y, "Icons/HiddenItem.png", Description, { Background, Foreground });
			else DrawAssetPreview(X, Y, ShopCart[A], { Description, Background, Foreground });
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}
		}

		// Draw the header and empty text if we need too
		if (ShopText == "") ShopText = TextGet("SelectItemBuy");
		DrawText(ShopText + " (" + Player.Money.toString() + " $)", 1375, 50, "White", "Black");
		if ((X == 1000) && (Y == 125)) DrawText(TextGet("EmptyCategory"), 1500, 500, "White", "Black");

	}

}

/**
 * Checks if an asset is from the focus group and if it can be bought/sold. An asset can be bought/sold if it has a value greater than
 * 0. (0 is a default item, -1 is a non-purchasable item)
 * @param {Asset} Asset - The asset to check for availability
 * @returns {boolean} - Returns TRUE if the item is purchasable and part of the focus group.
 */
function ShopAssetFocusGroup(Asset) {
	return (Asset != null) && (Asset.Group != null) && (Asset.Value > 0) && (Asset.Group.Name == ShopVendor.FocusGroup.Name)
		&& (ShopBuyMode || ShopCanSell(Asset));
}

/**
 * Checks if an asset can be bought. An asset is considered missing if it is not owned and has a value greater than 0. (0 is a default
 * item, -1 is a non-purchasable item)
 * @param {Asset} Asset - The asset to check for availability
 * @returns {boolean} - Returns TRUE if the item is purchasable and unowned.
 */
function ShopAssetMissing(Asset) {
	return (Asset != null) && (Asset.Group != null) && (Asset.Value > 0) && !InventoryAvailable(Player, Asset.Name, Asset.Group.Name);
}

/**
 * Used to display all the items the player does not own
 * @returns {void} - Nothing
 */
function ShopSelectAssetMissing() {
	ShopVendor.FocusGroup = null;
	ShopItemOffset = 0;
	CurrentCharacter = null;
	ShopStarted = true;
	ShopSelectAsset = ShopAssetMissing;
	ShopText = TextGet("SelectItemBuy");
	ShopBuyMode = true;
	ShopCartBuild();
}

/**
 * Click handler for the shop screen
 * @returns {void} - Nothing
 */
function ShopClick() {

	// Out of shopping mode, the player can click on herself, the vendor or exit
	if (!ShopStarted) {
		if ((MouseX >= 0) && (MouseX < 500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(ShopVendor);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) CommonSetScreen("Room", "MainHall");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	} else {

		// The user can select a different body by clicking on the vendor
		if ((ShopVendor.FocusGroup != null) && (ShopVendor.FocusGroup.Category == "Item"))
			if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000))
				for (let A = 0; A < AssetGroup.length; A++)
					if ((AssetGroup[A].Category == "Item") && (AssetGroup[A].Zone != null))
						for (let Z = 0; Z < AssetGroup[A].Zone.length; Z++) {
							if (DialogClickedInZone(ShopVendor, AssetGroup[A].Zone[Z], 1, 500, 0, 1)) {
								ShopItemOffset = 0;
								ShopVendor.FocusGroup = AssetGroup[A];
								ShopSelectAsset = ShopAssetFocusGroup;
								ShopCartBuild();
							}
						}

		// For each items in the assets with a value
		var X = 1000;
		var Y = 125;
		for (let A = ShopItemOffset; (A < ShopCart.length && A < ShopItemOffset + 12); A++) {
			if (MouseIn(X, Y, 225, 275)) {
				if (ShopBuyMode) {
					ShopBuyItem(ShopCart[A]);
				} else {
					ShopSellItem(ShopCart[A]);
				}
			}
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}
		}

		// Exit shopping mode
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) {
			ShopStarted = false;
			ShopVendor.Stage = "0";
			ShopVendor.FocusGroup = null;
			CharacterSetCurrent(ShopVendor);
			ShopVendor.CurrentDialog = TextGet("MoreShopping");
		}

		// If the user wants to get the next 12 items
		if ((MouseX >= 1770) && (MouseX <= 1860) && (MouseY >= 25) && (MouseY < 115)) {
			ShopItemOffset = ShopItemOffset + 12;
			if (ShopItemOffset >= ShopCart.length) ShopItemOffset = 0;
		}

	}
}

/**
 * Add the item and any other items linked by the buy-group to the player's inventory if able
 * @param {Asset} asset - The item being bought
 */
function ShopBuyItem(asset) {
	// If the item isn't already owned and the player has enough money, we buy it
	if (InventoryAvailable(Player, asset.Name, asset.Group.Name)) ShopText = TextGet("AlreadyOwned");
	else if (asset.Value > Player.Money) ShopText = TextGet("NotEnoughMoney");
	else if (LogQuery("BlockKey", "OwnerRule") && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && ((asset.Name == "Lockpicks") || (asset.Name == "MetalCuffsKey") || (asset.Name == "MetalPadlockKey") || (asset.Name == "IntricatePadlockKey") || (asset.Name == "HighSecurityPadlockKey"))) ShopText = TextGet("CannotSellKey");
	else if (LogQuery("BlockRemote", "OwnerRule") && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && (asset.Name == "VibratorRemote" || asset.Name == "LoversVibratorRemote" || asset.Name === "SpankingToysVibeRemote")) ShopText = TextGet("CannotSellRemote");
	else {

		// Add the item and removes the money
		CharacterChangeMoney(Player, asset.Value * -1);
		InventoryAdd(Player, asset.Name, asset.Group.Name, false);
		ShopText = TextGet("ThankYou");

		// Add any item that belongs in the same buy group
		if (asset.BuyGroup != null)
			for (let B = 0; B < Asset.length; B++)
				if ((Asset[B] != null) && (Asset[B].BuyGroup != null) && (Asset[B].BuyGroup == asset.BuyGroup))
					InventoryAdd(Player, Asset[B].Name, Asset[B].Group.Name, false);

		if (asset.PrerequisiteBuyGroups)
			for (let B = 0; B < Asset.length; B++)
				for (let C = 0; C < asset.PrerequisiteBuyGroups.length; C++)
					if ((Asset[B]) && (Asset[B].BuyGroup != null) && (Asset[B].BuyGroup == asset.PrerequisiteBuyGroups[C]))
						InventoryAdd(Player, Asset[B].Name, Asset[B].Group.Name, false);

		// Sync and rebuild the shop menu to be up-to-date
		ServerPlayerInventorySync();
		ShopCartBuild();
	}
}

/**
 * Remove the item and any other items linked by the buy-group from the player's inventory
 * @param {Asset} asset - The item being sold
 */
function ShopSellItem(asset) {
	// Confirm the item can be sold
	if (ShopCanSell(asset)) {

		// Remove the item and give money
		InventoryDelete(Player, asset.Name, asset.Group.Name, false);
		CharacterChangeMoney(Player, Math.ceil(asset.Value * 0.5));
		ShopText = TextGet("ThankYou");

		// Remove all items in the same buy-group
		if (asset.BuyGroup) {
			Asset.filter(A => A.BuyGroup === asset.BuyGroup).forEach(A => InventoryDelete(Player, A.Name, A.Group.Name, false));
		}

		// Remove items with buy-group in the prerequisite buy-group if there no other owned items in that prerequisite buy-group left
		if (asset.PrerequisiteBuyGroups) {
			Player.Inventory
				.filter(i => asset.PrerequisiteBuyGroups.includes(i.Asset.BuyGroup))
				.filter(i => !Player.Inventory.some(i2 => i2.Asset.PrerequisiteBuyGroups && i2.Asset.PrerequisiteBuyGroups.includes(i.Asset.BuyGroup)))
				.forEach(i => InventoryDelete(Player, i.Asset.Name, i.Asset.Group.Name, false));
		}

		// Sync and rebuild the shop menu to be up-to-date
		ServerPlayerInventorySync();
		ShopCartBuild();
	}
}

/**
 * Builds the array of items the player can buy in the current category.
 * @returns {void} - Nothing
 */
function ShopCartBuild() {
	ShopCart = [];
	for (let A = 0; A < Asset.length; A++)
		if (ShopSelectAsset(Asset[A]))
			ShopCart.push(Asset[A]);
}

/**
 * If selling items, checks whether the player owns any items in the specified groups that can be sold
 * @param {string} groupList - The list of groups to check, with separator "|"
 * @returns {boolean} - If TRUE the player is either buying items or owns at least one item in one of the groups
 */
function ShopCanShow(groupList) {
	if (ShopBuyMode) {
		return true;
	} else {
		const hasItemsInGroup = Player.Inventory.some(I => groupList.split("|").includes(I.Asset.Group.Name) && ShopCanSell(I.Asset));
		return hasItemsInGroup;
	}
}

/**
 * Returns whether the player is able to sell the item back to the shop
 * @param {Asset} asset - The item to check
 * @returns {boolean} - If TRUE the item can be sold
 */
function ShopCanSell(asset) {
	const canSell = asset.Value > 0
		&& !ShopSellExceptions.some(E => E.Name === asset.Name && E.Group === asset.Group.Name)
		&& InventoryAvailable(Player, asset.Name, asset.Group.Name);
	return canSell;
}

/**
 * Sets the current asset group the player is shopping for
 * @param {string} ItemGroup - Name of the asset group to look for
 * @returns {void} - Nothing
 */
function ShopStart(ItemGroup) {

	// Finds the asset group to shop with
	for (let A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == ItemGroup) {
			ShopVendor.FocusGroup = AssetGroup[A];
			break;
		}

	// If we have a group, we start the shop
	if (ShopVendor.FocusGroup != null) {
		ShopItemOffset = 0;
		CurrentCharacter = null;
		ShopStarted = true;
		ShopSelectAsset = ShopAssetFocusGroup;
		ShopText = TextGet(ShopBuyMode ? "SelectItemBuy" : "SelectItemSell");
		ShopCartBuild();
	}

}

/**
 * Triggered when the player rescues the shop vendor
 * @returns {void} - Nothing
 */
function ShopCompleteRescue() {
	ShopVendor.AllowItem = ShopVendorAllowItem;
	CharacterRelease(ShopVendor);
	MaidQuartersCurrentRescueCompleted = true;
}

/**
 * Checks if the player bought all items that can be bought, including appearance items
 * @returns {void} - Nothing
 */
function ShopCheckBoughtEverything() {
	ShopBoughtEverything = false;
	for (let A = 0; A < Asset.length; A++)
		if ((Asset[A] != null) && (Asset[A].Group != null) && (Asset[A].Value > 0) && !InventoryAvailable(Player, Asset[A].Name, Asset[A].Group.Name))
			return;
	ShopBoughtEverything = true;
}

/**
 * Allows the player to tie the shop vendor if the player has bought everything
 * @returns {void} - Nothing
 */
function ShopVendorBondage() {
	ShopVendorAllowItem = true;
	ShopVendor.AllowItem = true;
}

/**
 * Restrains the player with a random shop item before the shop demo job starts. The customer will have a 50/50 chance of being willing to
 * release the player
 * @returns {void} - Nothing
 */
function ShopJobRestrain() {

	// First, we find a body part where we can use the item
	DialogChangeReputation("Dominant", -1);
	const availableGroups = ShopJobFilterAvailableGroups();
	if (availableGroups.length > 0) {
		ShopDemoItemGroup = CommonRandomItemFromList("", availableGroups);
	} else {
		ShopVendor.Stage = 30;
		return;
	}

	// Add a random item on that body part and creates a customer
	InventoryWearRandom(Player, ShopDemoItemGroup, 3);
	ShopDemoItemPayment = Math.round(InventoryGet(Player, ShopDemoItemGroup).Asset.Value / 10);
	if ((ShopDemoItemPayment == null) || (ShopDemoItemPayment < 5)) ShopDemoItemPayment = 5;
	ShopCustomer = CharacterLoadNPC("NPC_Shop_Customer");
	ShopCustomer.AllowItem = false;
	ShopCustomer.Stage = ShopDemoItemGroup + "0";
	if (Math.random() >= 0.5) ShopCustomer.WillRelease = function () { return true; };
	else ShopCustomer.WillRelease = function () { return false; };

}

/**
 * Handles starting the shop demo job, the player is sent in an empty room with a customer
 * @returns {void} - Nothing
 */
function ShopJobStart() {
	DialogLeave();
	EmptyBackground = "Shop";
	EmptyCharacterOffset = -500;
	EmptyCharacter = [];
	EmptyCharacter.push(Player);
	EmptyCharacter.push(ShopCustomer);
	CommonSetScreen("Room", "Empty");
}

/**
 * Filters the list of shop demo items down to the groups that are currently available on the player
 * @returns {string[]} - The filtered list demo item groups that are both empty and unblocked
 */
function ShopJobFilterAvailableGroups() {
	return ShopDemoItemGroupList.filter((group) => {
		return !InventoryGet(Player, group) && !InventoryGroupIsBlocked(Player, group);
	});
}

/**
 * Checks whether or not the player is able to retry the shop job after completing one
 * @returns {boolean} - Returns true if the player is able to continue running shop jobs (are able to interact, not all
 * demo item groups are occupied/blocked)
 */
function ShopJobCanGoAgain() {
	return Player.CanInteract() && ShopJobFilterAvailableGroups().length > 0;
}
