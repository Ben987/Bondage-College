"use strict";
var InventoryItemDevicesInflatableBodyBagOptions = [
	{
		Name: "Light",
		Property: {
			Type: null,
			Difficulty: 0,
		},
	},
	{
		Name: "Inflated",
		Property: {
			Type: "Inflated",
			Difficulty: 3,
		},
    },
    {
		Name: "Bloated",
		Property: {
			Type: "Bloated",
			Difficulty: 6,
        },

    },
    {
        Name: "Max",
        Property: {
            Type: "Max",
			Difficulty: 9,
        },
    },
];

// Loads the item extension properties
function InventoryItemDevicesInflatableBodyBagLoad() {
	ExtendedItemLoad(InventoryItemDevicesInflatableBodyBagOptions, "InflatableBodyBagSelectTightness");
}

// Draw the item extension screen
function InventoryItemDevicesInflatableBodyBagDraw() {
	ExtendedItemDraw(InventoryItemDevicesInflatableBodyBagOptions, "InflatableBodyBagPose");
}

// Catches the item extension clicks
function InventoryItemDevicesInflatableBodyBagClick() {
	ExtendedItemClick(InventoryItemDevicesInflatableBodyBagOptions);
}

function InventoryItemDevicesInflatableBodyBagPublishAction(C, Option) {
	var msg = "InflatableBodyBagRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesInflatableBodyBagNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "InflatableBodyBagRestrain" + Option.Name, "ItemDevices");
}