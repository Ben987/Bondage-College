"use strict";

const InventoryItemButtButtPlugLockOptions = [
	{
		Name: "Base",
		Property: { Type: null },
	},
	{
		Name: "ChainShort",
		Prerequisite: ["NotSuspended", "CanKneel", "NotMounted"],
		Property: {
			Type: "ChainShort",
			Effect: ["Freeze", "ForceKneel", "IsChained"],
			SetPose: ["Kneel"],
		},
	},
	{
		Name: "ChainLong",
		Prerequisite: ["NotSuspended"],
		Property: {
			Type: "ChainLong",
			Effect: ["Tethered", "IsChained"],
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemButtButtPlugLockLoad() {
	ExtendedItemLoad(InventoryItemButtButtPlugLockOptions, "SelectAttachmentState");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemButtButtPlugLockDraw() {
	ExtendedItemDraw(InventoryItemButtButtPlugLockOptions, "ButtPlugLockPose");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemButtButtPlugLockClick() {
	ExtendedItemClick(InventoryItemButtButtPlugLockOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemButtButtPlugLockPublishAction(C, Option) {
	const msg = "ButtPlugLockRestrain" + Option.Name;
	const Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * The NPC dialog is for what the NPC says to you when you make a change to their restraints - the dialog lookup is on
 * a per-NPC basis.
 * @param {Character} C - The NPC to whom the restraint is applied
 * @param {Option} Option - The chosen option for this extended item
 * @returns {void} - Nothing
 */
function InventoryItemButtButtPlugLockNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ButtPlugLockSet" + Option.Name, "ItemButt");
}
