"use strict";
var InventoryItemFeetFuturisticAnkleCuffsOptions = [
	{
		Name: "None",
		Property: {
			Type: null, SetPose: null, Difficulty: null, Effect: null
		}
	},
	{
		Name: "Closed",
		Property: {
			Type: "Closed", Effect: ["Prone", "Freeze"], SetPose: ["LegsClosed"], Difficulty: 6
		}
	}
];

// Loads the item extension properties
function InventoryItemFeetFuturisticAnkleCuffsLoad() {
 	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else
		ExtendedItemLoad(InventoryItemFeetFuturisticAnkleCuffsOptions, "SelectBondagePosition");
}

// Draw the item extension screen
function InventoryItemFeetFuturisticAnkleCuffsDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else
		ExtendedItemDraw(InventoryItemFeetFuturisticAnkleCuffsOptions, "LeatherAnkleCuffsPose");
}

// Catches the item extension clicks
function InventoryItemFeetFuturisticAnkleCuffsClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else
		ExtendedItemClick(InventoryItemFeetFuturisticAnkleCuffsOptions);
}


function InventoryItemFeetFuturisticAnkleCuffsExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}

function InventoryItemFeetFuturisticAnkleCuffsValidate(C, Option) {
 	return InventoryItemMouthFuturisticPanelGagValidate(C, Option)
}

function InventoryItemFeetFuturisticAnkleCuffsPublishAction(C, Option) {
	var msg = "FuturisticAnkleCuffsRestrain" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemFeetFuturisticAnkleCuffsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "LeatherAnkleCuffs" + Option.Name, "ItemFeet");
}