"use strict";

var InventoryItemFeetSturdyLeatherBeltsOptions = [
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
	{
		Name: "Three",
		Property: {
			Type: "Three",
			Difficulty: 4,
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemFeetSturdyLeatherBeltsLoad() {
	ExtendedItemLoad(InventoryItemFeetSturdyLeatherBeltsOptions, "SturdyLeatherBeltsSelectTightness");
}

/**
* Draw the item extension screen
* @returns {void} - Nothing
*/
function InventoryItemFeetSturdyLeatherBeltsDraw() {
	ExtendedItemDraw(InventoryItemFeetSturdyLeatherBeltsOptions, "SturdyLeatherBeltsPose");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemFeetSturdyLeatherBeltsClick() {
	ExtendedItemClick(InventoryItemFeetSturdyLeatherBeltsOptions);
}

/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character to validate the option for
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemFeetSturdyLeatherBeltsValidate(C) {
	var Allowed = "";

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		Allowed = DialogFind(Player, "CantChangeWhileLocked");
	} else if (InventoryGet(C, "ClothLower") != null) {
		Allowed = DialogFind(Player, "RemoveClothesForItem");
	}

	return Allowed;
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemFeetSturdyLeatherBeltsPublishAction(C, Option) {
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
function InventoryItemFeetSturdyLeatherBeltsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemFeetSturdyLeatherBelts" + Option.Name, "ItemFeet");
}
