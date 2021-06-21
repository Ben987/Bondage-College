"use strict";
var InventoryItemFeetLeatherAnkleCuffsOptions = [
	{
		Name: "None",
		Property: {
			Type: null, SetPose: null, Difficulty: null, Effect: null, FreezeActivePose: [],
		}
	},
	{
		Name: "Closed",
		Property: {
			Type: "Closed", Effect: ["Prone", "Freeze"], SetPose: ["LegsClosed"], Difficulty: 6, FreezeActivePose: ["BodyLower"],
		}
	}
];

// Loads the item extension properties
function InventoryItemFeetLeatherAnkleCuffsLoad() {
	ExtendedItemLoad(InventoryItemFeetLeatherAnkleCuffsOptions, "SelectBondagePosition");
}

// Draw the item extension screen
function InventoryItemFeetLeatherAnkleCuffsDraw() {
	ExtendedItemDraw(InventoryItemFeetLeatherAnkleCuffsOptions, "LeatherAnkleCuffsPose");
}

// Catches the item extension clicks
function InventoryItemFeetLeatherAnkleCuffsClick() {
	ExtendedItemClick(InventoryItemFeetLeatherAnkleCuffsOptions);
}

function InventoryItemFeetLeatherAnkleCuffsPublishAction(C, Option) {
	var msg = "LeatherAnkleCuffsRestrain" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemFeetLeatherAnkleCuffsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "LeatherAnkleCuffs" + Option.Name, "ItemFeet");
}
