"use strict";

const InventoryItemMouthCupholderGagOptions = [
	{
		Name: "NoCup",
		Property: { Type: null,
		},
	},
	{
		Name: "Tip",
		Property: { Type: null,
		},
	},
	{
		Name: "Cup",
		Property: { Type: "Cup",
		},
	},
];

/**
 * Loads the item extension properties. Does nothing but propagate the call to the extended items
 * @returns {void} - Nothing
 */
function InventoryItemMouthCupholderGagLoad() {
	ExtendedItemLoad(InventoryItemMouthCupholderGagOptions, "CupholderGagOptions");
}

/**
 * Draw the item extension screen. Does nothing but propagate the call to the extended items
 * @returns {void} - Nothing
 */
function InventoryItemMouthCupholderGagDraw() {
	ExtendedItemDraw(
		InventoryItemMouthCupholderGagOptions, "CupholderGagOptions", InventoryItemMouthCupholderGagOptions.length,
		false,
	);
}

/**
 * Catches the item extension clicks. Does nothing but propagate the call to the extended items
 * @returns {void} - Nothing
 */
function InventoryItemMouthCupholderGagClick() {
	ExtendedItemClick(InventoryItemMouthCupholderGagOptions, InventoryItemMouthCupholderGagOptions.length, false);
}

/**
 * Publishes the action to the chat room
 * @param {Character} C - The character who get restrained
 * @param {Option} Option - The extended item option
 * @param {string} Option.Name - The name of the option. Used for finding the right dialog entry
 * @returns {void} - Nothing
 */
function InventoryItemMouthCupholderGagPublishAction(C, Option) {
	var msg = "CupholderGagSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * The NPC dialog is for what the NPC says to you when you make a change to their restraints - the dialog lookup is on
 * a  per-NPC basis. You basically put the "AssetName" + OptionName in there to allow individual NPCs to override their
 * default "GroupName" dialog if for example we ever wanted an NPC to react specifically to having the restraint put on
 * them. That could be done by adding an "AssetName" entry (or entries) to that NPC's dialog CSV
 * @param {Character} C - The NPC to whom the restraint is applied
 * @param {Option} Option - The chosen option for this extended item
 * @returns {void} - Nothing
 */
function InventoryItemMouthCupholderGagNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "InventoryItemMouthCupholderGag" + Option.Name, "ItemMouth");
}
