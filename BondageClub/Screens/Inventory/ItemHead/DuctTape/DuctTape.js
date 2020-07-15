"use strict";

var InventoryItemHeadDuctTapeOptions = [
	{
		Name: "Double",
		Property: {
			Type: null,
			Block: ["ItemNose"],
			Effect: ["BlindNormal", "Prone"],
		},
	},
	{
		Name: "Wrap",
		Property: {
			Type: "Wrap",
			Block: ["ItemNose"],
			Effect: ["BlindNormal", "Prone"],
		},
	},
	{
		Name: "Mummy",
		Property: {
			Type: "Mummy",
			Hide: ["ItemMouth", "ItemMouth2", "ItemMouth3", "HairFront", "HairBack"],
			Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemHood", "ItemNose"],
			Effect: ["GagNormal", "BlindNormal", "Prone", "BlockMouth"],
		},
	},
];

function InventoryItemHeadDuctTapeLoad() {
	ExtendedItemLoad(InventoryItemHeadDuctTapeOptions, "SelectBlindType");
}

function InventoryItemHeadDuctTapeDraw() {
	ExtendedItemDraw(InventoryItemHeadDuctTapeOptions, "DuctTapeHeadType");
}

function InventoryItemHeadDuctTapeClick() {
	ExtendedItemClick(InventoryItemHeadDuctTapeOptions);
}

function InventoryItemHeadDuctTapePublishAction(C, Option) {
	var Message = "DuctTapeHeadSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(Message, true, Dictionary);
}

function InventoryItemHeadDuctTapeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemHeadDuctTape" + Option.Name, "ItemHead");
}
