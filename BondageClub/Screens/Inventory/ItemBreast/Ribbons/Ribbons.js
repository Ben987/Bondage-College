"use strict";

var InventoryItemBreastRibbonsOptions = [
	{
		Name: "LightWrap",
		Property: { Type: null, Difficulty: 0 },
	},
	{
		Name: "LightWrapBow",
		Property: { Type: "LightWrapBow", Difficulty: 1 },
	},
	{
		Name: "Wrap",
		Property: { Type: "Wrap", Difficulty: 2 },
	},
];

// Loads the item extension properties
function InventoryItemBreastRibbonsLoad() {
	ExtendedItemLoad(InventoryItemBreastRibbonsOptions, "SelectRibbonType");
}

// Draw the item extension screen
function InventoryItemBreastRibbonsDraw() {
	ExtendedItemDraw(InventoryItemBreastRibbonsOptions, "RibbonsStyle");
}

// Catches the item extension clicks
function InventoryItemBreastRibbonsClick() {
	ExtendedItemClick(InventoryItemBreastRibbonsOptions);
}

function InventoryItemBreastRibbonsPublishAction(C, Option) {
	var msg = "RibbonsSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemBreastRibbonsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemBreastRibbons" + Option.Name, "ItemBreast");
}
