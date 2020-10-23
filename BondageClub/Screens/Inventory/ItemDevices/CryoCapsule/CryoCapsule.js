"use strict";

var InventoryItemDevicesCryoCapsuleOptions = [
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
function InventoryItemDevicesCryoCapsuleLoad() {
	ExtendedItemLoad(InventoryItemDevicesCryoCapsuleOptions, "SelectCryoCapsuleType");
}

// Draw the item extension screen
function InventoryItemDevicesCryoCapsuleDraw() {
	ExtendedItemDraw(InventoryItemDevicesCryoCapsuleOptions, "CryoCapsuleType");
}

// Catches the item extension clicks
function InventoryItemDevicesCryoCapsuleClick() {
	ExtendedItemClick(InventoryItemDevicesCryoCapsuleOptions);
}

function InventoryItemDevicesCryoCapsuleValidate() {
	var C = CharacterGetCurrent();
	var Allowed = true;

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		Allowed = false;
	}

	return Allowed;
}

function InventoryItemDevicesCryoCapsulePublishAction(C, Option) {
	var msg = "CryoCapsuleSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesCryoCapsuleNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemDevicesCryoCapsule" + Option.Name, "ItemDevices");
}
