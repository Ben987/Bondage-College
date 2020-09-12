"use strict";

var InventoryItemDevicesTeddyBearOptions = [
	{
		Name: "Bear",
		Property: { Type: null },
	},
	{
		Name: "Fox",
		Property: { Type: "Fox" },
	},
	{
		Name: "Pup",
		Property: { Type: "Pup" },
	},
	{
		Name: "Pony",
		Property: { Type: "Pony" },
	},
	{
		Name: "Kitty",
		Property: { Type: "Kitty" },
	},
	{
		Name: "Bunny",
		Property: { Type: "Bunny" },
	},
];

// Loads the item extension properties
function InventoryItemDevicesTeddyBearLoad() {
	ExtendedItemLoad(InventoryItemDevicesTeddyBearOptions, "SelectTeddyBearType");
}

// Draw the item extension screen
function InventoryItemDevicesTeddyBearDraw() {
	ExtendedItemDraw(InventoryItemDevicesTeddyBearOptions, "TeddyBearType");
}

// Catches the item extension clicks
function InventoryItemDevicesTeddyBearClick() {
	ExtendedItemClick(InventoryItemDevicesTeddyBearOptions);
}

function InventoryItemDevicesTeddyBearPublishAction(C, Option) {
	var msg = "TeddyBearSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesTeddyBearNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "TeddyBearSet" + Option.Name, "ItemDevices");
}