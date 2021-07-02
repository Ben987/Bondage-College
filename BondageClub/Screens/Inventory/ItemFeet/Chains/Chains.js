"use strict";
var InventoryItemFeetChainsOptions = [
	{
		Name: "Basic",
		BondageLevel: 0,
		Property: { Type: null, Difficulty: 0, SetPose: ["LegsClosed"] },
	},
	{
		Name: "Strict",
		BondageLevel: 2,
		Property: { Type: "Strict", Difficulty: 2, SetPose: ["LegsClosed"] },
	},
	{
		Name: "Suspension",
		BondageLevel: 6,
		Prerequisite: ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"],
		Property: {
			Type: "Suspension",
			Difficulty: 4,
			SetPose: ["Suspension", "LegsClosed"],
			AllowActivePose: [],
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemFeetChainsLoad() {
	ExtendedItemLoad(InventoryItemFeetChainsOptions, "SelectChainBondage");
}

/**
* Draw the item extension screen
* @returns {void} - Nothing
*/
function InventoryItemFeetChainsDraw() {
	ExtendedItemDraw(InventoryItemFeetChainsOptions, "ChainBondage");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemFeetChainsClick() {
	ExtendedItemClick(InventoryItemFeetChainsOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemFeetChainsPublishAction(C, Option) {
	var msg = "LegChainSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
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
function InventoryItemFeetChainsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ChainBondage" + Option.Name, "ItemFeet");
}

/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character to validate the option for
 * @param {Item} Item - The equipped item
 * @param {ExtendedItemOption} Option - The chosen option for this extended item
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemFeetChainsValidate(C, Item, Option) {
	var Allowed = "";

	if (Option.Prerequisite != null && !InventoryAllow(C, Option.Prerequisite, true)) {
		Allowed = DialogText;
	} else if (InventoryItemHasEffect(Item, "Lock", true)) {
		Allowed = DialogFindPlayer("CantChangeWhileLocked");
	}

	return Allowed;
}
