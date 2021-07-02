"use strict";

var InventoryItemBootsFuturisticHeels2Options = [
	{
		Name: "Shiny",
		Property: { Type: null},
	},
	{
		Name: "Matte",
		Property: { Type: "Matte"},
	},
];

function InventoryItemBootsFuturisticHeels2Load() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	} else
		ExtendedItemLoad(InventoryItemBootsFuturisticHeels2Options, "FuturisticHeels2Type");
}

function InventoryItemBootsFuturisticHeels2Draw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else
		ExtendedItemDraw(InventoryItemBootsFuturisticHeels2Options, "FuturisticHeels2Type");

}

function InventoryItemBootsFuturisticHeels2Click() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else {
		ExtendedItemClick(InventoryItemBootsFuturisticHeels2Options);
	}
}

function InventoryItemBootsFuturisticHeels2Exit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}

function InventoryItemBootsFuturisticHeels2PublishAction(C, Option) {
	var msg = "FuturisticHeels2Set" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemBootsFuturisticHeels2Validate(C, Item) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Item); // All futuristic items refer to the gag
}

