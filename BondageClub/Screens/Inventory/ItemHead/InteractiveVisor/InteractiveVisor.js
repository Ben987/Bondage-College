"use strict";

var InventoryItemHeadInteractiveVisorOptions = [
	{
		Name: "Transparent",
		Property: {
			Type: null,
			SelfUnlock: true,
			Effect: [],
		},
	},
	{
		Name: "LightTint",
		Property: {
			Type: "LightTint",
			Effect: ["BlindLight", "Prone"],
		},
	},
	{
		Name: "HeavyTint",
		Property: {
			Type: "HeavyTint",
			Effect: ["BlindNormal", "Prone"],
		},
	},
	{
		Name: "Blind",
		Property: {
			Type: "Blind",
			Effect: ["BlindHeavy", "Prone"],
		},
	},
];

function InventoryItemHeadInteractiveVisorLoad() {
	ExtendedItemLoad(InventoryItemHeadInteractiveVisorOptions, "SelectVisorType");
}

function InventoryItemHeadInteractiveVisorDraw() {
	ExtendedItemDraw(InventoryItemHeadInteractiveVisorOptions, "InteractiveVisorHeadType");
}

function InventoryItemHeadInteractiveVisorClick() {
	ExtendedItemClick(InventoryItemHeadInteractiveVisorOptions);
}

function InventoryItemHeadInteractiveVisorPublishAction(C, Option) {
	var Message = "InteractiveVisorHeadSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(Message, true, Dictionary);
}



function InventoryItemHeadInteractiveVisorValidate(C, Option) {
	var Allowed = true;

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLockedFuturisticVisor");
		Allowed = false;
	} 

	return Allowed;
}

function InventoryItemHeadInteractiveVisorNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemHeadInteractiveVisor" + Option.Name, "ItemHead");
}
