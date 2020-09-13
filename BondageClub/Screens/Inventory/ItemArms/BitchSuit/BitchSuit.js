"use strict";

var InventoryItemArmsBitchSuitOptions = [
	{
		Name: "Latex",
		Property: {
			Type: null,
			Block: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
		},
	},{
		Name: "UnZip",
		Property: {
			Type: "UnZip",
			Block: [],
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemArmsBitchSuitLoad() {
	ExtendedItemLoad(InventoryItemArmsBitchSuitOptions, "SelectBitchSuitType");
}

/**
 * Draw the item extension screen. As this function is called periodically, don't call expensive functions from here
 * @returns {void} - Nothing
 */
function InventoryItemArmsBitchSuitDraw() {
	ExtendedItemDraw(InventoryItemArmsBitchSuitOptions, "BitchSuitType");
}

/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function InventoryItemArmsBitchSuitClick() {
	ExtendedItemClick(InventoryItemArmsBitchSuitOptions);
}

/**
 * Publishes an action to the chatroom.
 * @param {Character} C - Character being changed.
 * @param {object} Option - The option used.
 * @returns {void} - Nothing
 */
function InventoryItemArmsBitchSuitPublishAction(C, Option) {
	var msg = "BitchSuitSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * Sets a character dialog.
 * @param {Character} C - Character being changed.
 * @param {object} Option - The option used.
 * @returns {void} - Nothing
 */
function InventoryItemArmsBitchSuitNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "BitchSuitType" + Option.Name, "ItemArms");
}
