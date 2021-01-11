"use strict";

var InventoryItemMouthFunnelGagOptions = [
	{
		Name: "None",
		Property: {
			Type: null,
			Effect: ["GagMedium", "OpenMouth"],
		},
	},
	{
		Name: "Funnel",
		Property: {
			Type: "Funnel",
			Effect: ["BlockMouth", "GagMedium"],
		},
	},
];

// Loads the item extension properties
function InventoryItemMouthFunnelGagLoad() {
	ExtendedItemLoad(InventoryItemMouthFunnelGagOptions, "SelectGagType");
}

// Draw the item extension screen
function InventoryItemMouthFunnelGagDraw() {
	ExtendedItemDraw(InventoryItemMouthFunnelGagOptions, "FunnelGagMouthType");
}

// Catches the item extension clicks
function InventoryItemMouthFunnelGagClick() {
	ExtendedItemClick(InventoryItemMouthFunnelGagOptions);
}

function InventoryItemMouthFunnelGagPublishAction(C, Option) {
	var msg = "FunnelGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthFunnelGagNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthFunnelGag" + Option.Name, "ItemMouth");
}
