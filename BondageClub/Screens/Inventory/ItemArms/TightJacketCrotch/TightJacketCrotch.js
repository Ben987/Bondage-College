"use strict";

const TightJacketCrotchArmsOptions = [
	{
		Name: "Basic",
		Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 1 }
	},
	{
		Name: "PulledStraps",
		Property: { Type: "PulledStraps", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 1 }
	},
	{
		Name: "LiningStraps",
		Property: { Type: "LiningStraps", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 }
	},
	{
		Name: "ExtraPadding",
		Property: { Type: "ExtraPadding", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 }
	},
	{
		Name: "PulledLining",
		Property: { Type: "PulledLining", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 }
	},
	{
		Name: "PulledPadding",
		Property: { Type: "PulledPadding", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 }
	},
	{
		Name: "PaddedLining",
		Property: { Type: "PaddedLining", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 }
	},
	{
		Name: "FullJacket",
		Property: { Type: "FullJacket", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 4 }
	}
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemArmsTightJacketCrotchLoad() {
	ExtendedItemLoad(TightJacketCrotchArmsOptions, "SelectJacketPrep");
}

/**
* Draw the item extension screen
* @returns {void} - Nothing
*/
function InventoryItemArmsTightJacketCrotchDraw() {
	ExtendedItemDraw(TightJacketCrotchArmsOptions, "JacketPrep");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemArmsTightJacketCrotchClick() {
	ExtendedItemClick(TightJacketCrotchArmsOptions);
}

/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character wearing the item
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemArmsTightJacketCrotchValidate(C) {
	var Allowed = "";
	if (InventoryItemHasEffect(DialogFocusItem, "Lock", true) && !DialogCanUnlock(C, DialogFocusItem)) {
		Allowed = DialogFindPlayer("CantChangeWhileLocked");
	}
	return Allowed;
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemArmsTightJacketCrotchPublishAction(C, Option) {
	var msg = "JacketPrepSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * The NPC dialog is for what the NPC says to you when you make a change to their restraints - the dialog lookup is on a
 * per-NPC basis. You basically put the "AssetName" + OptionName in there to allow individual NPCs to override their default
 * "GroupName" dialog if for example we ever wanted an NPC to react specifically to having the restraint put on them.
 * That could be done by adding an "AssetName" entry (or entries) to that NPC's dialog CSV
 * @param {Character} C - The NPC to whom the restraint is applied
 * @param {Option} Option - The chosen option for this extended item
 * @returns {void} - Nothing
 */
function InventoryItemArmsTightJacketCrotchNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "JacketPrep" + Option.Name, "ItemArms");
}