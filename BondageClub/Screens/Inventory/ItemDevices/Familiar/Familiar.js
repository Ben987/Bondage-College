"use strict";

var InventoryItemDevicesFamiliarOptions = [
	{
		Name: "Bat",
		Property: { Type: null },
	},
	{
		Name: "Cat",
		Property: { Type: "Cat" },
	},
	{
		Name: "Skeleton",
		Property: { Type: "Skeleton" },
	},
	{
		Name: "Parrot",
		Property: { Type: "Parrot" },
	},
];

// Loads the item extension properties
function InventoryItemDevicesFamiliarLoad() {
	ExtendedItemLoad(InventoryItemDevicesFamiliarOptions, "SelectFamiliarType");
}

// Draw the item extension screen
function InventoryItemDevicesFamiliarDraw() {
	ExtendedItemDraw(InventoryItemDevicesFamiliarOptions, "FamiliarType");
}

// Catches the item extension clicks
function InventoryItemDevicesFamiliarClick() {
	ExtendedItemClick(InventoryItemDevicesFamiliarOptions);
}

function InventoryItemDevicesFamiliarPublishAction(C, Option) {
	var msg = "FamiliarSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesFamiliarNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "FamiliarSet" + Option.Name, "ItemDevices");
}