"use strict";

var InventoryItemTorsoHeavyLatexCorsetOptions = [
	{
		Name: "Normal",
		Property: { Type: null },
	},
	{
		Name: "Straps",
		Property: { Type: "Straps" },
	},
];

// Loads the item extension properties
function InventoryItemTorsoHeavyLatexCorsetLoad() {
	ExtendedItemLoad(InventoryItemTorsoHeavyLatexCorsetOptions, "SelectHeavyLatexCorsetType");
}

// Draw the item extension screen
function InventoryItemTorsoHeavyLatexCorsetDraw() {
	ExtendedItemDraw(InventoryItemTorsoHeavyLatexCorsetOptions, "HeavyLatexCorsetType");
}

// Catches the item extension clicks
function InventoryItemTorsoHeavyLatexCorsetClick() {
	ExtendedItemClick(InventoryItemTorsoHeavyLatexCorsetOptions);
}

function InventoryItemTorsoHeavyLatexCorsetPublishAction(C, Option) {
	var msg = "HeavyLatexCorsetSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemTorsoHeavyLatexCorsetNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "HeavyLatexCorset" + Option.Name, "ItemTorso");
}