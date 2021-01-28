"use strict";
var InventoryItemArmsWristShacklesOptions = [
	{
		Name: "InFront",
		Property: {
			Type: null
		}
	},
	{
		Name: "Behind",
		Property: {
			Type: "Behind",
			SetPose: ["BackCuffs"],
			Effect: ["Block", "Prone"],
			Difficulty: 3
		}
	},
	{
		Name: "Overhead",
		Property: {
			Type: "Overhead",
			SetPose: ["OverTheHead"],
			Effect: ["Block", "Prone"],
			Difficulty: 3
		}
	}
];

// Loads the item extension properties
function InventoryItemArmsWristShacklesLoad() {
	ExtendedItemLoad(InventoryItemArmsWristShacklesOptions, "SelectBondagePosition");
}

// Draw the item extension screen
function InventoryItemArmsWristShacklesDraw() {
	ExtendedItemDraw(InventoryItemArmsWristShacklesOptions, "WristShacklesPose");
}

// Catches the item extension clicks
function InventoryItemArmsWristShacklesClick() {
	ExtendedItemClick(InventoryItemArmsWristShacklesOptions);
}

// Publishes the extended action to the chat.
function InventoryItemArmsWristShacklesPublishAction(C, Option) {
	var msg = "WristShacklesRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber }
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemArmsWristShacklesNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsWristShackles" + Option.Name, "ItemArms");
}
