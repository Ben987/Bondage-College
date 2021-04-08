"use strict";

var InventoryItemArmsWrappedBlanketOptions = [
	{
		Name: "NormalWrapped",
		Property: {
			Type: null,
		},
	},
	{
		Name: "ShouldersWrapped",
		Property: {
			Type: "ShouldersWrapped",
		},
	},
	{
		Name: "FeetWrapped",
		Property: {
			Type: "FeetWrapped",
		},
	},
	{
		Name: "FullWrapped",
		Property: {
			Type: "FullWrapped",
		},
	},
];

// Loads the item extension properties
function InventoryItemArmsWrappedBlanketLoad() {
	ExtendedItemLoad(InventoryItemArmsWrappedBlanketOptions, "SelectBlanketBondage");
}

// Draw the item extension screen
function InventoryItemArmsWrappedBlanketDraw() {
	ExtendedItemDraw(InventoryItemArmsWrappedBlanketOptions, "WrappedBlanketType");
}

// Catches the item extension clicks
function InventoryItemArmsWrappedBlanketClick() {
	ExtendedItemClick(InventoryItemArmsWrappedBlanketOptions);
}

function InventoryItemArmsWrappedBlanketPublishAction(C, Option) {
	var msg = "WrappedBlanketArmsSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemArmsWrappedBlanketNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsWrappedBlanket" + Option.Name, "ItemArms");
}