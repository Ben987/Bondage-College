"use strict";

var InventoryItemHandsFuturisticMittensOptions = [
	{
		Name: "Mittens",
		Property: { Type: null, Difficulty: 8, Effect: ["Block", "Prone"], SelfUnlock: false},
	},
	{
		Name: "Gloves",
		Property: { Type: "Gloves", Difficulty: 0, Effect: [], SelfUnlock: true},
	},
];

// Loads the item extension properties
function InventoryItemHandsFuturisticMittensLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	} else
	ExtendedItemLoad(InventoryItemHandsFuturisticMittensOptions, "SelectFuturisticMittensType");
}

// Draw the item extension screen
function InventoryItemHandsFuturisticMittensDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else
		ExtendedItemDraw(InventoryItemHandsFuturisticMittensOptions, "FuturisticMittensType");
}

// Catches the item extension clicks
function InventoryItemHandsFuturisticMittensClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else
		ExtendedItemClick(InventoryItemHandsFuturisticMittensOptions);
}

function InventoryItemHandsFuturisticMittensExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}

function InventoryItemHandsFuturisticMittensValidate(C, Item) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Item);
}

function InventoryItemHandsFuturisticMittensPublishAction(C, Option) {
	var msg = "FuturisticMittensSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}
