"use strict";

var InventoryItemVulvaPiercingsClitRingOptions = [
	{
		Name: "Base",
		Property: {
			Type: null,
			Effect: [],
			SetPose: [],
		},
	},
	{
		Name: "Leash",
		Property: {
			Type: "Leash",
			Effect: ["Leash"],
			SetPose: [],
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemVulvaPiercingsClitRingLoad() {
	ExtendedItemLoad(InventoryItemVulvaPiercingsClitRingOptions, "SelectAttachmentState");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemVulvaPiercingsClitRingDraw() {
	ExtendedItemDraw(InventoryItemVulvaPiercingsClitRingOptions,"ClitRingPose");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemVulvaPiercingsClitRingClick() {
	ExtendedItemClick(InventoryItemVulvaPiercingsClitRingOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemVulvaPiercingsClitRingPublishAction(C, Option, PreviousOption) {
	var msg = "ClitRingRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character wearing the item
 * @param {Item} Item - The equipped item
 * @param {ExtendedItemOption} Option - The next option to use on the character
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemVulvaPiercingsClitRingValidate(C, Item, Option) {
	var ChainShortPrerequisites = "";
	switch (Option.Name) {
		case "Base":
			break;
		case "Leash":
			if (C.Pose.indexOf("Suspension") >= 0) {
				ChainShortPrerequisites = DialogFindPlayer("RemoveSuspensionForItem");
			} // if
			break;
	} // switch
	return ChainShortPrerequisites;
} // InventoryItemVulvaPiercingsClitRingValidate
