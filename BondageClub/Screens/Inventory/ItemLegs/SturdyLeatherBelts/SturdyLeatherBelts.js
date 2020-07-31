"use strict";

var InventoryItemLegsSturdyLeatherBeltsOptions = [
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
];

// Loads the item extension properties
function InventoryItemLegsSturdyLeatherBeltsLoad() {
	ExtendedItemLoad(InventoryItemLegsSturdyLeatherBeltsOptions, "SturdyLeatherBeltsSelectTightness");
}

// Draw the item extension screen
function InventoryItemLegsSturdyLeatherBeltsDraw() {
	ExtendedItemDraw(InventoryItemLegsSturdyLeatherBeltsOptions, "SturdyLeatherBeltsPose");
}

// Catches the item extension clicks
function InventoryItemLegsSturdyLeatherBeltsClick() {
	ExtendedItemClick(InventoryItemLegsSturdyLeatherBeltsOptions);
}

function InventoryItemLegsSturdyLeatherBeltsValidate() {
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

function InventoryItemLegsSturdyLeatherBeltsPublishAction(C, Option) {
	var msg = "SturdyLeatherBeltsRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemLegsSturdyLeatherBeltsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemLegsSturdyLeatherBelts" + Option.Name, "ItemLegs");
}
