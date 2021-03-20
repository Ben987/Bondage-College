"use strict";
var InventoryItemArmsMetalCuffsOptions = [
	{
		Name: "InFront",
		Property: {
			Type: "InFront",
			SetPose: ["BaseUpper"],
		}
	},
	{
		Name: "BehindBack",
		Property: {
			Type: null,
			SetPose: ["BackCuffs"],
		}
	}
];

// Loads the item extension properties
function InventoryItemArmsMetalCuffsLoad() {
	ExtendedItemLoad(InventoryItemArmsMetalCuffsOptions, "SelectBondagePosition");
}

// Draw the item extension screen
function InventoryItemArmsMetalCuffsDraw() {
	ExtendedItemDraw(InventoryItemArmsMetalCuffsOptions, "MetalCuffsPose");
}

// Catches the item extension clicks
function InventoryItemArmsMetalCuffsClick() {
	ExtendedItemClick(InventoryItemArmsMetalCuffsOptions);
}

// Publishes the extended action to the chat.
function InventoryItemArmsMetalCuffsPublishAction(C, Option) {
	var msg = "MetalCuffsRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber }
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemArmsMetalCuffsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsMetalCuffs" + Option.Name, "ItemArms");
}
