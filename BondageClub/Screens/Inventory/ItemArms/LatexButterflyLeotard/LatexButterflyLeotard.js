"use strict";

var InventoryItemArmsLatexButterflyLeotardOptions = [
	{
		Name: "Unpolished",
		Property: { Type: null },
	},
	{
		Name: "Polished",
		Property: { Type: "Polished" },
	},
];

function InventoryItemArmsLatexButterflyLeotardLoad() {
	ExtendedItemLoad(InventoryItemArmsLatexButterflyLeotardOptions, "ItemArmsLatexLeotardSelect");
}

function InventoryItemArmsLatexButterflyLeotardDraw() {
	ExtendedItemDraw(InventoryItemArmsLatexButterflyLeotardOptions, "ItemArmsLatexLeotard");
}

function InventoryItemArmsLatexButterflyLeotardClick() {
	ExtendedItemClick(InventoryItemArmsLatexButterflyLeotardOptions);
}

function InventoryItemArmsLatexButterflyLeotardPublishAction(C, Option) {
	var msg = "ItemArmsLatexLeotardSet" + Option.Name;
	var dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, dictionary);
}

function InventoryItemArmsLatexButterflyLeotardNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsLatexButterflyLeotard" + Option.Name, "ItemArms");
}
