"use strict";

var InventoryItemHeadWebBlindfoldOptions = [
	{
		Name: "Blindfold",
		Block: ["ItemNose"],
		Property: { Type: null, Difficulty: 0 },
	},
	{
		Name: "Cocoon",
		Property: {
			Type: "Cocoon",
			Difficulty: 30,
			Hide: ["HairFront", "HairBack", "Glasses", "Hat", "ItemMouth", "ItemMouth2", "ItemMouth3"],
			Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemHood", "ItemNose"],
			Effect: ["BlindHeavy", "Prone", "GagNormal", "BlockMouth"],
		},
	},
];

// Loads the item extension properties
function InventoryItemHeadWebBlindfoldLoad() {
	ExtendedItemLoad(InventoryItemHeadWebBlindfoldOptions, "WebBondageSelect");
}

function InventoryItemHeadWebBlindfoldDraw() {
	ExtendedItemDraw(InventoryItemHeadWebBlindfoldOptions, "WebBondage");
}

function InventoryItemHeadWebBlindfoldClick() {
	ExtendedItemClick(InventoryItemHeadWebBlindfoldOptions);
}

function InventoryItemHeadWebBlindfoldPublishAction(C, Option) {
	var msg = "HeadWebSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemHeadWebBlindfoldNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemHeadWebBlindfold" + Option.Name, "ItemHead");
}
