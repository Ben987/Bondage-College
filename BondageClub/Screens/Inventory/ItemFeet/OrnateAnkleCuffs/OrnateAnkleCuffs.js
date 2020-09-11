"use strict";
var InventoryItemFeetOrnateAnkleCuffsOptions = [
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
function InventoryItemFeetOrnateAnkleCuffsLoad() {
	ExtendedItemLoad(InventoryItemFeetOrnateAnkleCuffsOptions, "SelectBondagePosition");
}

// Draw the item extension screen
function InventoryItemFeetOrnateAnkleCuffsDraw() {
	ExtendedItemDraw(InventoryItemFeetOrnateAnkleCuffsOptions, "OrnateAnkleCuffsPose");
}

// Catches the item extension clicks
function InventoryItemFeetOrnateAnkleCuffsClick() {
	ExtendedItemClick(InventoryItemFeetOrnateAnkleCuffsOptions);
}

function InventoryItemFeetOrnateAnkleCuffsPublishAction(C, Option) {
	var msg = "OrnateAnkleCuffsRestrain" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemFeetOrnateAnkleCuffsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "OrnateAnkleCuffsNpcReaction" + Option.Name, "ItemFeet");
}