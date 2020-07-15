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
var ShopItemCount = 0;
var ShopDemoItemPayment = 0;
var ShopDemoItemGroup = "";
var ShopDemoItemGroupList = ["ItemHead", "ItemMouth", "ItemArms", "ItemLegs", "ItemFeet"];
var ShopSelectAsset = ShopAssetFocusGroup;

// Returns TRUE if a dialog is permitted
function ShopIsVendorRestrained() { return (ShopVendor.IsRestrained() || !ShopVendor.CanTalk()) }
function ShopIsRescueScenario(ScenarioName) { return (ShopRescueScenario == ScenarioName) }

// Loads the shop room
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

// Run the shop
function ShopRun() {
	
	// Draw both characters
	DrawCharacter(Player, 0, 0, 1);
	DrawCharacter(ShopVendor, 500, 0, 1);
	if (ShopStarted && (ShopItemCount > 12)) DrawButton(1770, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	if (!ShopStarted) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");

	// In shopping mode
	if (ShopStarted) {

		// For each items in the assets with a value
		var X = 1000;
		var Y = 125;
		ShopItemCount = 0;
		for (var A = 0; A < Asset.length; A++)
			if (ShopSelectAsset(Asset[A])) {
				if ((ShopItemCount >= ShopItemOffset) && (ShopItemCount < ShopItemOffset + 12)) {
					DrawRect(X, Y, 225, 275, ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275) && !CommonIsMobile) ? "cyan" : "white");
					DrawImageResize("Assets/" + Asset[A].Group.Family + "/" + Asset[A].Group.Name + "/Preview/" + Asset[A].Name + ".png", X + 2, Y + 2, 221, 221);
					DrawTextFit(Asset[A].Description + " " + Asset[A].Value.toString() + " $", X + 112, Y + 250, 221, (InventoryAvailable(Player, Asset[A].Name, Asset[A].Group.Name)) ? "green" : "red");
					X = X + 250;
					if (X > 1800) {
						X = 1000;
						Y = Y + 300;
					}
				}
				ShopItemCount++;
			}

		// Draw the header and empty text if we need too
		if (ShopText == "") ShopText = TextGet("SelectItemBuy");
		DrawText(ShopText + " (" + Player.Money.toString() + " $)", 1375, 50, "White", "Black");
		if ((X == 1000) && (Y == 125)) DrawText(TextGet("EmptyCategory"), 1500, 500, "White", "Black");

	}

}

// Select asset by vendor's focusgroup
function ShopAssetFocusGroup(Asset) {
	return (Asset != null) && (Asset.Group != null) && (Asset.Value > 0) && (Asset.Group.Name == ShopVendor.FocusGroup.Name);
}

// Select missing assets
function ShopAssetMissing(Asset) {
	return (Asset != null) && (Asset.Group != null) && (Asset.Value > 0) && !InventoryAvailable(Player, Asset.Name, Asset.Group.Name);
}

// When user wants to see the missing items
function ShopSelectAssetMissing() {
	ShopVendor.FocusGroup = null;
	ShopItemOffset = 0;
	CurrentCharacter = null;
	ShopStarted = true;
	ShopSelectAsset = ShopAssetMissing;
	ShopText = TextGet("SelectItemBuy");
}

// When the user clicks in the shop
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
				for (var A = 0; A < AssetGroup.length; A++)
					if ((AssetGroup[A].Category == "Item") && (AssetGroup[A].Zone != null))
						for (var Z = 0; Z < AssetGroup[A].Zone.length; Z++)
							if ((MouseX - 500 >= AssetGroup[A].Zone[Z][0]) && (MouseY >= AssetGroup[A].Zone[Z][1] - ShopVendor.HeightModifier) && (MouseX - 500 <= AssetGroup[A].Zone[Z][0] + AssetGroup[A].Zone[Z][2]) && (MouseY <= AssetGroup[A].Zone[Z][1] + AssetGroup[A].Zone[Z][3] - ShopVendor.HeightModifier)) {
								ShopItemOffset = 0;
								ShopVendor.FocusGroup = AssetGroup[A];
								ShopSelectAsset = ShopAssetFocusGroup;
							}

		// For each items in the assets with a value
		var X = 1000;
		var Y = 125;
		var ItemCount = 0;
		for (var A = 0; A < Asset.length; A++)
			if (ShopSelectAsset(Asset[A])) {
				if ((ItemCount >= ShopItemOffset) && (ItemCount < ShopItemOffset + 12)) {
					if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) {

						// If the item isn't already owned and the player has enough money, we buy it
						if (InventoryAvailable(Player, Asset[A].Name, Asset[A].Group.Name)) ShopText = TextGet("AlreadyOwned");
						else if (Asset[A].Value > Player.Money) ShopText = TextGet("NotEnoughMoney");
						else if (LogQuery("BlockKey", "OwnerRule") && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && ((Asset[A].Name == "MetalCuffsKey") || (Asset[A].Name == "MetalPadlockKey") || (Asset[A].Name == "IntricatePadlockKey"))) ShopText = TextGet("CannotSellKey");
						else if (LogQuery("BlockRemote", "OwnerRule") && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && (Asset[A].Name == "VibratorRemote")) ShopText = TextGet("CannotSellRemote");
						else {

							// Add the item and removes the money
							CharacterChangeMoney(Player, Asset[A].Value * -1);
							InventoryAdd(Player, Asset[A].Name, Asset[A].Group.Name);
							ShopText = TextGet("ThankYou");

							// Add any item that belongs in the same buy group
							if (Asset[A].BuyGroup != null)
								for (var B = 0; B < Asset.length; B++)
									if ((Asset[B] != null) && (Asset[B].BuyGroup != null) && (Asset[B].BuyGroup == Asset[A].BuyGroup))
										InventoryAdd(Player, Asset[B].Name, Asset[B].Group.Name);

							if (Asset[A].PrerequisiteBuyGroups)
								for (var B = 0; B < Asset.length; B++)
									for (var C = 0; C < Asset[A].PrerequisiteBuyGroups.length; C++)
										if ((Asset[B]) && (Asset[B].BuyGroup != null) && (Asset[B].BuyGroup == Asset[A].PrerequisiteBuyGroups[C]))
											InventoryAdd(Player, Asset[B].Name, Asset[B].Group.Name);

						}

					}
					X = X + 250;
					if (X > 1800) {
						X = 1000;
						Y = Y + 300;
					}
				}
				ItemCount++;
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
			if (ShopItemOffset >= ShopItemCount) ShopItemOffset = 0;
		}

	}
}

// When the user starts to shop
function ShopStart(ItemGroup) {

	// Finds the asset group to shop with
	for (var A = 0; A < AssetGroup.length; A++)
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
		ShopText = TextGet("SelectItemBuy");
	}

}

// When the player rescues the shop vendor
function ShopCompleteRescue() {
	ShopVendor.AllowItem = ShopVendorAllowItem;
	CharacterRelease(ShopVendor);
	MaidQuartersCurrentRescueCompleted = true;
}

// Checks if the player bought all items that can be bought, including appearance items
function ShopCheckBoughtEverything() {
	ShopBoughtEverything = false;
	for (var A = 0; A < Asset.length; A++)
		if ((Asset[A] != null) && (Asset[A].Group != null) && (Asset[A].Value > 0) && !InventoryAvailable(Player, Asset[A].Name, Asset[A].Group.Name))
			return;
	ShopBoughtEverything = true;
}

// The vendor can be restrained if the player bought everything
function ShopVendorBondage() {
	ShopVendorAllowItem = true;
	ShopVendor.AllowItem = true;
}

// Before the shop demo job starts, the player gets a random restrain on her
function ShopJobRestrain() {

	// First, we find a body part where we can use the item
	DialogChangeReputation("Dominant", -1);
	while (true) {
		ShopDemoItemGroup = CommonRandomItemFromList("", ShopDemoItemGroupList);
		if (InventoryGet(Player, ShopDemoItemGroup) == null) break;
	}

	// Add a random item on that body part and creates a customer
	InventoryWearRandom(Player, ShopDemoItemGroup, 3);
	ShopDemoItemPayment = Math.round(InventoryGet(Player, ShopDemoItemGroup).Asset.Value / 10);
	if ((ShopDemoItemPayment == null) || (ShopDemoItemPayment < 5)) ShopDemoItemPayment = 5;
	ShopCustomer = CharacterLoadNPC("NPC_Shop_Customer");
	ShopCustomer.AllowItem = false;
	ShopCustomer.Stage = ShopDemoItemGroup + "0";
	if (Math.random() >= 0.5) ShopCustomer.WillRelease = function () { return true };
	else ShopCustomer.WillRelease = function () { return false };

}

// When the shop demo job starts, the customer is sent in an empty room with a customer
function ShopJobStart() {
	DialogLeave();
	EmptyBackground = "Shop";
	EmptyCharacterOffset = -500;
	EmptyCharacter = [];
	EmptyCharacter.push(Player);
	EmptyCharacter.push(ShopCustomer);
	CommonSetScreen("Room", "Empty");
}