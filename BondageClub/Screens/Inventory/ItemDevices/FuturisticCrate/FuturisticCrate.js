"use strict";

var InventoryItemDevicesFuturisticCrateOptions = [
		{
			Name: "Open",
			Property: { Type: null, Effect: [] },
		},
		{
			Name: "SmallWindow",
			Property: { Type: "SmallWindow", Effect: ["BlindLight", "GagLight", "Prone", "Freeze", "Enclose"]},
		},
		{
			Name: "Window",
			Property: { Type: "Window" , Effect: ["BlindMedium", "GagLight", "Prone", "Freeze", "Enclose"]},
		},
		{
			Name: "Closed",
			Property: { Type: "Closed", Effect: ["BlindHeavy", "GagLight", "Prone", "Freeze", "Enclose"] },
		},
];

function InventoryItemDevicesFuturisticCrateLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	} else
		ExtendedItemLoad(InventoryItemDevicesFuturisticCrateOptions, "FuturisticCrateType");
}

function InventoryItemDevicesFuturisticCrateDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else
		ExtendedItemDraw(InventoryItemDevicesFuturisticCrateOptions, "FuturisticCrateType");

}

function InventoryItemDevicesFuturisticCrateClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else {
		ExtendedItemClick(InventoryItemDevicesFuturisticCrateOptions);
	}
}

function InventoryItemDevicesFuturisticCrateExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}

function InventoryItemDevicesFuturisticCratePublishAction(C, Option) {
	var msg = "FuturisticCrateSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesFuturisticCrateValidate(C) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Option); // All futuristic items refer to the gag
}

