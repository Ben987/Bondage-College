"use strict";

var InventoryItemMouthFuturisticHarnessPanelGagOptions = [
	{
		Name: "Padded",
		Property: {
			Type: null,
			Effect: ["GagLight"],
		},
	},
	{
		Name: "Ball",
		Property: {
			Type: "Plug",
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
function InventoryItemMouthFuturisticHarnessPanelGagLoad() {
	ExtendedItemLoad(InventoryItemMouthFuturisticHarnessPanelGagOptions, "SelectGagType");
}

// Draw the item extension screen
function InventoryItemMouthFuturisticHarnessPanelGagDraw() {
	ExtendedItemDraw(InventoryItemMouthFuturisticHarnessPanelGagOptions, "FuturisticPanelGagMouthType");
}

// Catches the item extension clicks
function InventoryItemMouthFuturisticHarnessPanelGagClick() {
	ExtendedItemClick(InventoryItemMouthFuturisticHarnessPanelGagOptions);
}



function InventoryItemMouthFuturisticHarnessPanelGagValidate(C, Option) {
	var Allowed = true;

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLockedFuturistic");
		Allowed = false;
	} 

	return Allowed;
}


function InventoryItemMouthFuturisticHarnessPanelGagPublishAction(C, Option) {
	var msg = "FuturisticPanelGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthFuturisticHarnessPanelNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthPlugGag" + Option.Name, "ItemMouth");
}


