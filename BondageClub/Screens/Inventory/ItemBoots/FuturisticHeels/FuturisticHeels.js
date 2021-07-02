"use strict";

var InventoryItemBootsFuturisticHeelsOptions = [
	{
		Name: "Shoes",
		Property: { Type: null, HeightModifier: 6 },
	},
	{
		Name: "Heel",
		Property: { Type: "Heel", HeightModifier: 16 },
	},
];

function InventoryItemBootsFuturisticHeelsLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	} else
		ExtendedItemLoad(InventoryItemBootsFuturisticHeelsOptions, "FuturisticHeelsType");
}

function InventoryItemBootsFuturisticHeelsDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else
		ExtendedItemDraw(InventoryItemBootsFuturisticHeelsOptions, "FuturisticHeelsType");

}

function InventoryItemBootsFuturisticHeelsClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else {
		ExtendedItemClick(InventoryItemBootsFuturisticHeelsOptions);
	}
}

function InventoryItemBootsFuturisticHeelsExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}

function InventoryItemBootsFuturisticHeelsPublishAction(C, Option) {
	var msg = "FuturisticHeelsSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemBootsFuturisticHeelsValidate(C, Item) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Item); // All futuristic items refer to the gag
}

