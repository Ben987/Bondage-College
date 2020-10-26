"use strict";

var InventoryItemDevicesCoffinOptions = [
	{
		Name: "Open",
		Property: {
			Type: null,
			Difficulty:-2,
			Effect: ["Freeze"],
			SelfUnlock: true
		}
	},
	{
		Name: "Closed",
		Property: {
			Type: "Closed",
			Difficulty:4,
			Effect: ["Freeze", "GagMedium", "Prone", "Enclose", "BlindLight"],
			SelfUnlock: false
		}
	}
];

// Loads the item extension properties
function InventoryItemDevicesCoffinLoad() {
	ExtendedItemLoad(InventoryItemDevicesCoffinOptions, "SelectCoffinType");
}

// Draw the item extension screen
function InventoryItemDevicesCoffinDraw() {
	ExtendedItemDraw(InventoryItemDevicesCoffinOptions, "CoffinType");
}

// Catches the item extension clicks
function InventoryItemDevicesCoffinClick() {
	ExtendedItemClick(InventoryItemDevicesCoffinOptions);
}

function InventoryItemDevicesCoffinValidate() {
	var C = CharacterGetCurrent();
	var Allowed = true;

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		Allowed = false;
	}

	return Allowed;
}

function InventoryItemDevicesCoffinPublishAction(C, Option) {
	var msg = "CoffinSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesCoffinNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemDevicesCoffin" + Option.Name, "ItemDevices");
}
