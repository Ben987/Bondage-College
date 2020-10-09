"use strict";

var InventoryItemDevicesLittleMonsterOptions = [
	{
		Name: "Black",
		Property: { Type: null },
	},
	{
		Name: "Red",
		Property: { Type: "Red" },
	},
	{
		Name: "Green",
		Property: { Type: "Green" },
	},
	{
		Name: "Blue",
		Property: { Type: "Blue" },
	},
];

// Loads the item extension properties
function InventoryItemDevicesLittleMonsterLoad() {
	ExtendedItemLoad(InventoryItemDevicesLittleMonsterOptions, "SelectLittleMonsterType");
}

// Draw the item extension screen
function InventoryItemDevicesLittleMonsterDraw() {
	ExtendedItemDraw(InventoryItemDevicesLittleMonsterOptions, "LittleMonsterType");
}

// Catches the item extension clicks
function InventoryItemDevicesLittleMonsterClick() {
	ExtendedItemClick(InventoryItemDevicesLittleMonsterOptions);
}

function InventoryItemDevicesLittleMonsterPublishAction(C, Option) {
	var msg = "LittleMonsterSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesLittleMonsterNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "LittleMonsterSet" + Option.Name, "ItemDevices");
}