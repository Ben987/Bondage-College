"use strict";

var InventoryItemMouthFuturisticPanelGagOptions = [
	{
		Name: "Padded",
		Property: {
			Type: null,
			Effect: ["BlockMouth", "GagLight"],
		},
	},
	{
		Name: "Ball",
		Property: {
			Type: "Ball",
			Effect: ["BlockMouth", "GagMedium"],
		},
	},
	{
		Name: "Plug",
		Property: {
			Type: "Plug",
			Effect: ["BlockMouth", "GagTotal"],
		},
	},
];

// Loads the item extension properties
function InventoryItemMouthFuturisticPanelGagLoad() {
	ExtendedItemLoad(InventoryItemMouthFuturisticPanelGagOptions, "SelectGagType");
}

// Draw the item extension screen
function InventoryItemMouthFuturisticPanelGagDraw() {
	ExtendedItemDraw(InventoryItemMouthFuturisticPanelGagOptions, "FuturisticPanelGagMouthType");
}

// Catches the item extension clicks
function InventoryItemMouthFuturisticPanelGagClick() {
	ExtendedItemClick(InventoryItemMouthFuturisticPanelGagOptions);
}



function InventoryItemMouthFuturisticPanelGagValidate(C, Option) {
	var Allowed = true;

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLockedFuturistic");
		Allowed = false;
	} 

	return Allowed;
}


function InventoryItemMouthFuturisticPanelGagPublishAction(C, Option) {
	var msg = "FuturisticPanelGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthFuturisticPanelNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthPlugGag" + Option.Name, "ItemMouth");
}


