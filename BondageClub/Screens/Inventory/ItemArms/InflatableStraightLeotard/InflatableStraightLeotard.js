"use strict";

var InventoryItemArmsInflatableStraightLeotardOptions = [
	{
		Name: "Light",
		Property: {
			Type: null,
			Effect: null,
		},
	},
	{
		Name: "Inflated",
		Property: {
			Type: "Inflated",
			Effect: null,
		},
    },
    {
		Name: "Bloated",
		Property: {
			Type: "Bloated",
			Effect: null,
        },
        
    },
    {
        Name: "Max",
        Property: {
            Type: "Max",
            Effect: null,
        },
    },
];

// Loads the item extension properties
function InventoryItemArmsInflatableStraightLeotardLoad() {
	ExtendedItemLoad(InventoryItemArmsInflatableStraightLeotardOptions, "SelectInflationLevel");
}

// Draw the item extension screen
function InventoryItemArmsInflatableStraightLeotardDraw() {
	ExtendedItemDraw(InventoryItemArmsInflatableStraightLeotardOptions, "InflationAmount");
}

// Catches the item extension clicks
function InventoryItemArmsInflatableStraightLeotardClick() {
	ExtendedItemClick(InventoryItemArmsInflatableStraightLeotardOptions);
}

function InventoryItemArmsInflatableStraightLeotardPublishAction(C, Option) {
	var msg = "InflationAmountSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemArmsInflatableStraightLeotardNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsInflatableStraightLeotard" + Option.Name, "ItemArms");
}
