"use strict";
var EmptyBackground = "MainHall";
var EmptyCharacter = [];
var EmptyCharacterOffset = 0;

// When used in struggle mode
function EmptyStruggleSuccess() { return (!Player.IsRestrained() && Player.CanTalk() && (CurrentTime < ManagementTimer)) }
function EmptyStruggleFail() { return (CurrentTime >= ManagementTimer) }
function EmptyStruggleProgress() { return ((Player.IsRestrained() || !Player.CanTalk()) && (CurrentTime < ManagementTimer)) }

// Loads the empty room screen
function EmptyLoad() {
}

// Run the empty room screen
function EmptyRun() {
	for (var C = 0; C < EmptyCharacter.length; C++)
		DrawCharacter(EmptyCharacter[C], 1000 - EmptyCharacter.length * 250 + C * 500 + EmptyCharacterOffset, 0, 1);
}

// When the user clicks in the empty room screen
function EmptyClick() {
	for (var C = 0; C < EmptyCharacter.length; C++)
		if ((MouseX >= 1000 - EmptyCharacter.length * 250 + C * 500 + EmptyCharacterOffset) && (MouseX < 1500 - EmptyCharacter.length * 250 + C * 500 + EmptyCharacterOffset) && (MouseY >= 0) && (MouseY < 1000)) 
			CharacterSetCurrent(EmptyCharacter[C]);
}

// Returns to the main hall
function EmptyManagementMainHall() {
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

// Locks the player in a cell for 5 minutes
function EmptyManagementCell() {
	DialogLeave();
	CharacterFullRandomRestrain(Player, "ALL");
	CellLock(5);
}

// Release the player from the item applied by the shop vendor
function EmptyShopRelease() {
	InventoryRemove(Player, ShopDemoItemGroup);
	DialogChangeReputation("Dominant", -1);
}

// Release the player from the item applied by the shop vendor
function EmptyShopEnd(Sold) {
	Sold = (Sold == "true");
	ShopVendor.Stage = (Sold) ? "33" : "34";
	if (Sold) CharacterChangeMoney(Player, ShopDemoItemPayment);
	DialogLeave();
	CommonSetScreen("Room", "Shop");
	CharacterSetCurrent(ShopVendor);
	ShopVendor.CurrentDialog = DialogFind(ShopVendor, (Sold) ? "ItemSold" : "ItemNotSold").replace("MoneyAmount", ShopDemoItemPayment.toString());
	CharacterAppearanceFullRandom(ShopCustomer, false);
	CharacterRandomName(ShopCustomer)
}