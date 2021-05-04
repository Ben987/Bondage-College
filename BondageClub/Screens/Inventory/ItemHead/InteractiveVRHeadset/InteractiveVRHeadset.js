"use strict";

var InventoryItemHeadInteractiveVRHeadsetOptions = [
	{
		Name: "AR",
		Property: {
			Type: "AR",
			Effect: [],
		},
	},
	{
		Name: "Virtual",
		Property: {
			Type: null,
			Effect: ["BlindHeavy", "Prone", "VRAvatars"],
		},
	},
	{
		Name: "FreeVR",
		Property: {
			Type: "FreeVR",
			Effect: ["BlindHeavy", "VRAvatars", "HideRestraints"],
		},
	},
	{
		Name: "Gaming",
		Property: {
			Type: "Gaming",
			Effect: ["BlindHeavy", "VRAvatars", "KinkyDungeonParty"],
		},
	},
	{
		Name: "Off",
		Property: {
			Type: "Off",
			Effect: ["BlindHeavy", "Prone"],
		},
	},
];

function InventoryItemHeadInteractiveVRHeadsetLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	} else
		ExtendedItemLoad(InventoryItemHeadInteractiveVRHeadsetOptions, "SelectHeadsetType");
}

function InventoryItemHeadInteractiveVRHeadsetDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else
		ExtendedItemDraw(InventoryItemHeadInteractiveVRHeadsetOptions, "InteractiveVRHeadsetHeadType");
}

function InventoryItemHeadInteractiveVRHeadsetClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else
		ExtendedItemClick(InventoryItemHeadInteractiveVRHeadsetOptions);
}

function InventoryItemHeadInteractiveVRHeadsetPublishAction(C, Option) {
	var Message = "InteractiveVRHeadsetHeadSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(Message, true, Dictionary);
}


function InventoryItemHeadInteractiveVRHeadsetExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}

function InventoryItemHeadInteractiveVRHeadsetValidate(C, Option) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Option); // All futuristic items refer to the gag
}

function InventoryItemHeadInteractiveVRHeadsetNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemHeadInteractiveVRHeadset" + Option.Name, "ItemHead");
}
