"use strict";

var InventoryItemArmsSturdyLeatherBeltsOptions = [
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

var InventoryItemArmsSturdyLeatherBeltsMessage = "SelectItem";

// Loads the item extension properties
function InventoryItemArmsSturdyLeatherBeltsLoad() {
	ExtendedItemLoad(InventoryItemArmsSturdyLeatherBeltsOptions, "SturdyLeatherBeltsSelectTightness");
}

// Draw the item extension screen
function InventoryItemArmsSturdyLeatherBeltsDraw() {
	ExtendedItemDraw(InventoryItemArmsSturdyLeatherBeltsOptions, "SturdyLeatherBeltsPose");
}

// Catches the item extension clicks
function InventoryItemArmsSturdyLeatherBeltsClick() {
	ExtendedItemClick(InventoryItemArmsSturdyLeatherBeltsOptions);
}

function InventoryItemArmsSturdyLeatherBeltsValidate(C) {
	var Allowed = true;

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		Allowed = false;
	} else if (InventoryGet(C, "Cloth") != null) {
		DialogExtendedMessage = DialogFind(Player, "RemoveClothesForItem");
		Allowed = false;
	}

	return Allowed;
}

function InventoryItemArmsSturdyLeatherBeltsPublishAction(C, Option) {
	var msg = "SturdyLeatherBeltsRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemArmsSturdyLeatherBeltsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsSturdyLeatherBelts" + Option.Name, "ItemArms");
}
