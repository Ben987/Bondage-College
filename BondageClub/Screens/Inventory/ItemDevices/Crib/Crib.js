"use strict";

var InventoryItemDevicesCribOptions = [
	{
		Name: "Open",
		Property: { Type: null, Difficulty: 0 },
	},
	{
		Name: "Closed",
		Property: { Type: "Closed", Difficulty: 20 },
	},
	{
		Name: "Stuffed",
		Property: { Type: "Stuffed", Difficulty: 24 },
	},	
];

// Loads the item extension properties
function InventoryItemDevicesCribLoad() {
	ExtendedItemLoad(InventoryItemDevicesCribOptions, "SelectCribState");
}

// Draw the item extension screen
function InventoryItemDevicesCribDraw() {
	ExtendedItemDraw(InventoryItemDevicesCribOptions, "Crib");
}

// Catches the item extension clicks
function InventoryItemDevicesCribClick() {
	ExtendedItemClick(InventoryItemDevicesCribOptions);
}

function InventoryItemDevicesCribPublishAction(C, Option) {
	var msg = "CribSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesCribNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "Crib" + Option.Name, "ItemDevices");
}
