"use strict";

var InventoryItemLegsSturdyLeatherBeltsOptions = [
	{
		Name: "One",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Two",
		Property: {
			Type: "Two",
			Difficulty: 2,
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemLegsSturdyLeatherBeltsLoad() {
	ExtendedItemLoad(InventoryItemLegsSturdyLeatherBeltsOptions, "SturdyLeatherBeltsSelectTightness");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemLegsSturdyLeatherBeltsDraw() {
	ExtendedItemDraw(InventoryItemLegsSturdyLeatherBeltsOptions, "SturdyLeatherBeltsPose");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemLegsSturdyLeatherBeltsClick() {
	ExtendedItemClick(InventoryItemLegsSturdyLeatherBeltsOptions);
}

/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character to check the option for
 * @param {Option} Option - The next option to use on the character
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemLegsSturdyLeatherBeltsValidate(C) {
	var Allowed = "";

	if (InventoryItemHasEffect(DialogFocusItem, "Lock", true) && !DialogCanUnlock(C, DialogFocusItem)) {
		Allowed = DialogFindPlayer("CantChangeWhileLocked");
	} else if (InventoryGet(C, "ClothLower") != null) {
		Allowed = DialogFindPlayer("RemoveClothesForItem");
	}

	return Allowed;
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemLegsSturdyLeatherBeltsPublishAction(C, Option) {
	var msg = "SturdyLeatherBeltsRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
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
function InventoryItemLegsSturdyLeatherBeltsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemLegsSturdyLeatherBelts" + Option.Name, "ItemLegs");
}
