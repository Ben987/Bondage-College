"use strict";

var InventoryItemFeetSturdyLeatherBeltsOptions = [
	{
		Name: "One",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Two",
		Property: {
			Type: "Two",
			Difficulty: 2,
		},
	},
	{
		Name: "Three",
		Property: {
			Type: "Three",
			Difficulty: 4,
		},
	},
];

// Loads the item extension properties
function InventoryItemFeetSturdyLeatherBeltsLoad() {
	ExtendedItemLoad(InventoryItemFeetSturdyLeatherBeltsOptions, "SturdyLeatherBeltsSelectTightness");
}

// Draw the item extension screen
function InventoryItemFeetSturdyLeatherBeltsDraw() {
	ExtendedItemDraw(InventoryItemFeetSturdyLeatherBeltsOptions, "SturdyLeatherBeltsPose");
}

// Catches the item extension clicks
function InventoryItemFeetSturdyLeatherBeltsClick() {
	ExtendedItemClick(InventoryItemFeetSturdyLeatherBeltsOptions);
}

function InventoryItemFeetSturdyLeatherBeltsValidate() {
	var C = CharacterGetCurrent();
	var Allowed = true;

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		Allowed = false;
	} else if (InventoryGet(C, "ClothLower") != null) {
		DialogExtendedMessage = DialogFind(Player, "RemoveClothesForItem");
		Allowed = false;
	}

	return Allowed;
}

function InventoryItemFeetSturdyLeatherBeltsPublishAction(C, Option) {
	var msg = "SturdyLeatherBeltsRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemFeetSturdyLeatherBeltsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemFeetSturdyLeatherBelts" + Option.Name, "ItemFeet");
}
