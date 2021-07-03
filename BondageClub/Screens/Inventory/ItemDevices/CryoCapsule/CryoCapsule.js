"use strict";

var InventoryItemDevicesCryoCapsuleOptions = [
	{
		Name: "Open",
		Property: {
			Type: null,
			Difficulty: 0,
			Effect: ["Freeze"],
			SelfUnlock: true
		}
	},
	{
		Name: "Closed",
		Property: {
			Type: "Closed",
			Difficulty: 50,
			Effect: ["Freeze", "GagMedium", "Prone", "Enclose", "BlindLight"],
			SelfUnlock: false
		}
	}
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemDevicesCryoCapsuleLoad() {
	ExtendedItemLoad(InventoryItemDevicesCryoCapsuleOptions, "SelectCryoCapsuleType");
}

/**
* Draw the item extension screen
* @returns {void} - Nothing
*/
function InventoryItemDevicesCryoCapsuleDraw() {
	ExtendedItemDraw(InventoryItemDevicesCryoCapsuleOptions, "CryoCapsuleType");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemDevicesCryoCapsuleClick() {
	ExtendedItemClick(InventoryItemDevicesCryoCapsuleOptions);
}

/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character to validate the option for
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemDevicesCryoCapsuleValidate(C, Item) {
	var Allowed = "";

	if (Item.Property.LockedBy && !DialogCanUnlock(C, Item)) {
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
function InventoryItemDevicesCryoCapsulePublishAction(C, Option) {
	var msg = "CryoCapsuleSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
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
function InventoryItemDevicesCryoCapsuleNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemDevicesCryoCapsule" + Option.Name, "ItemDevices");
}
