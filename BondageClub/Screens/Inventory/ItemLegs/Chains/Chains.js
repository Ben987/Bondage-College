"use strict";

var InventoryItemLegsChainsOptions = [
	{
		Name: "Basic",
		BondageLevel: 0,
		Property: { Type: null, Difficulty: 0 }
	}, {
		Name: "Strict",
		BondageLevel: 2,
		Property: { Type: "Strict", Difficulty: 2 }
	}
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemLegsChainsLoad() {
	ExtendedItemLoad(InventoryItemLegsChainsOptions, "SelectChainBondage");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemLegsChainsDraw() {
	ExtendedItemDraw(InventoryItemLegsChainsOptions, "ChainBondage");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemLegsChainsClick() {
	ExtendedItemClick(InventoryItemLegsChainsOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemLegsChainsPublishAction(C, Option) {
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
function InventoryItemLegsChainsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ChainBondage" + Option.Name, "ItemLegs");
}

/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character to check this option for
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemLegsChainsValidate(C) {
	var Allowed = "";
	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		Allowed = DialogFindPlayer("CantChangeWhileLocked");
	}
	return Allowed;
}
