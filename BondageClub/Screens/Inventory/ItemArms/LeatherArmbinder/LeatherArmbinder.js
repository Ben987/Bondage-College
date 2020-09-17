"use strict";

var InventoryItemArmsLeatherArmbinderOptions = [
	{
		Name: "None",
		Property: { Type: null, Difficulty: 0 },
	},
	{
		Name: "Strap",
		Property: { Type: "Strap", Difficulty: 3 },
	},
	{
		Name: "WrapStrap",
		Property: { Type: "WrapStrap", Difficulty: 3 },
	},	
];

// Loads the item extension properties
function InventoryItemArmsLeatherArmbinderLoad() {
	ExtendedItemLoad(InventoryItemArmsLeatherArmbinderOptions, "SelectStrapType");
}

// Draw the item extension screen
function InventoryItemArmsLeatherArmbinderDraw() {
	ExtendedItemDraw(InventoryItemArmsLeatherArmbinderOptions, "LeatherArmbinderType");
}

// Catches the item extension clicks
function InventoryItemArmsLeatherArmbinderClick() {
	ExtendedItemClick(InventoryItemArmsLeatherArmbinderOptions);
}

function InventoryItemArmsLeatherArmbinderPublishAction(C, Option) {
	var msg = "LeatherArmbinderSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemArmsLeatherArmbinderNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "LeatherArmbinderSet" + Option.Name, "ItemArms");
}
