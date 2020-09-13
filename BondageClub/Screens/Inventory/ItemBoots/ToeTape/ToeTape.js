"use strict";

var InventoryItemBootsToeTapeOptions = [
	{
		Name: "Toes",
		Property: {Type: null, Difficulty: 0},
	},
	{
		Name: "Full",
		Property: { Type: "Full", Difficulty: 2 },
	},
]

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemBootsToeTapeLoad() {
	ExtendedItemLoad(InventoryItemBootsToeTapeOptions, "SelectTapeWrapping");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemBootsToeTapeDraw() {
	ExtendedItemDraw(InventoryItemBootsToeTapeOptions, "ToeTapePose");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemBootsToeTapeClick() {
	ExtendedItemClick(InventoryItemBootsToeTapeOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemBootsToeTapePublishAction(C, Option, PreviousOption) {
	var msg = "ToeTapeSet" + Option.Name;
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
function InventoryItemBootsToeTapeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemBootsToeTapeNPCReaction" + Option.Name, "ItemBoots");
}
