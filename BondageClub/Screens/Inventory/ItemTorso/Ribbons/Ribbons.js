"use strict";

var InventoryItemTorsoRibbonsOptions = [
	{
		Name: "Basic",
		Property: { Type: null, Difficulty: 1 }
	}, {
		Name: "Harness1",
		BondageLevel: 2,
		Property: { Type: "Harness1" , Difficulty: 3 , Effect: ["CrotchRope"]}
	}, {
		Name: "Harness2",
		BondageLevel: 3,
		Property: { Type: "Harness2" , Difficulty: 4, Effect: ["CrotchRope"] }
	}
];

// Loads the item extension properties
function InventoryItemTorsoRibbonsLoad() {
	ExtendedItemLoad(InventoryItemTorsoRibbonsOptions, "SelectRibbonType");
}

// Draw the item extension screen
function InventoryItemTorsoRibbonsDraw() {
	ExtendedItemDraw(InventoryItemTorsoRibbonsOptions, "RibbonsTorso");
}

// Catches the item extension clicks
function InventoryItemTorsoRibbonsClick() {
	ExtendedItemClick(InventoryItemTorsoRibbonsOptions);
}

function InventoryItemTorsoRibbonsPublishAction(C, Option) {
	var msg = "TorsoRibbonsSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemTorsoRibbonsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemTorsoRibbons" + Option.Name, "ItemTorso");
}