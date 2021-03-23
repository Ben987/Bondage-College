"use strict";

const InventoryItemLegsOrnateLegCuffsOptions = [
	{
		Name: "None",
		Property: { Type: null },
	},
	{
		Name: "Closed",
		Property: {
			Type: "Closed",
			SetPose: ["LegsClosed"],
			Effect: ["Prone", "KneelFreeze", "Slow"],
			FreezeActivePose: ["BodyLower"],
			Difficulty: 6,
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemLegsOrnateLegCuffsLoad() {
	ExtendedItemLoad(InventoryItemLegsOrnateLegCuffsOptions, "SelectBondagePosition");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemLegsOrnateLegCuffsDraw() {
	ExtendedItemDraw(InventoryItemLegsOrnateLegCuffsOptions, "OrnateLegCuffsPose");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemLegsOrnateLegCuffsClick() {
	ExtendedItemClick(InventoryItemLegsOrnateLegCuffsOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemLegsOrnateLegCuffsPublishAction(C, Option) {
	const msg = "OrnateLegCuffsRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * The NPC dialog is for what the NPC says to you when you make a change to their restraints - the dialog lookup is on
 * a per-NPC basis.
 * @param {Character} C - The NPC to whom the restraint is applied
 * @param {Option} Option - The chosen option for this extended item
 * @returns {void} - Nothing
 */
function InventoryItemLegsOrnateLegCuffsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemLegsOrnateLegCuffs" + Option.Name, "ItemLegs");
}
