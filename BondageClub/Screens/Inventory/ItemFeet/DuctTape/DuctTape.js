"use strict";
var InventoryItemFeetDuctTapeOptions = [
	{
		Name: "Feet",
		Property: {
			Type: null,
			Difficulty: 0,
			Hide: null,
			SetPose: ["LegsClosed"],
		},
	},
	{
		Name: "HalfFeet",
		Property: {
			Type: "HalfFeet",
			Difficulty: 2,
			Hide: ["ClothLower", "Shoes"],
			SetPose: ["LegsClosed"],
		},
	},
	{
		Name: "MostFeet",
		Property: {
			Type: "MostFeet",
			Difficulty: 4,
			Hide: ["ClothLower", "Shoes"],
			SetPose: ["LegsClosed"],
		},
	},
	{
		Name: "CompleteFeet",
		Property: {
			Type: "CompleteFeet",
			Difficulty: 6,
			Hide: ["ClothLower", "Shoes"],
			SetPose: ["LegsClosed"],
		},
	},
];

// Loads the item extension properties
function InventoryItemFeetDuctTapeLoad() {
	ExtendedItemLoad(InventoryItemFeetDuctTapeOptions, "SelectTapeWrapping");
}

// Draw the item extension screen
function InventoryItemFeetDuctTapeDraw() {
	ExtendedItemDraw(InventoryItemFeetDuctTapeOptions, "DuctTapePose");
}

// Catches the item extension clicks
function InventoryItemFeetDuctTapeClick() {
	ExtendedItemClick(InventoryItemFeetDuctTapeOptions);
}

function InventoryItemFeetDuctTapePublishAction(C, Option) {
	var msg = "DuctTapeRestrain" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemFeetDuctTapeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "DuctTapeRestrain" + Option.Name, "ItemFeet");
}