"use strict";

var InventoryItemPelvisMetalChastityBeltOptions = [	
	{
		Name: "OpenBack",
		Property: {
			Type: null,
			Block: null,
		},
	},
	{
		Name: "ClosedBack",
		Property: {
			Type: "ClosedBack",
			Block: ["ItemButt"],
		},
	},
];

// Loads the item extension properties
function InventoryItemPelvisMetalChastityBeltLoad() {
	ExtendedItemLoad(InventoryItemPelvisMetalChastityBeltOptions, "SelectBackShield");
}

// Draw the item extension screen
function InventoryItemPelvisMetalChastityBeltDraw() {
	ExtendedItemDraw(InventoryItemPelvisMetalChastityBeltOptions, "Chastity");
}

// Catches the item extension clicks
function InventoryItemPelvisMetalChastityBeltClick() {
	ExtendedItemClick(InventoryItemPelvisMetalChastityBeltOptions);
}

// Publishes the action
function InventoryItemPelvisMetalChastityBeltPublishAction(C, Option) {
	var msg = "ChastityBeltBackShield" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemPelvisMetalChastityBeltValidate(C) {
	var Allowed = true;

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		Allowed = false;
	} 

	return Allowed;
}

function InventoryItemPelvisMetalChastityBeltNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "Chastity" + Option.Name, "ItemPelvis");
}
