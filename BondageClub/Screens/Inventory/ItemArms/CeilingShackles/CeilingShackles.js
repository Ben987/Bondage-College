"use strict";

const InventoryItemArmsCeilingShacklesOptions = [
	{
		Name: "HeadLevel",
		Property: {
			Type: null,
			SetPose: ["Yoked"]
		}
	},
	{
		Name: "Overhead",
		Property: {
			Type: "Overhead",
			SetPose: ["OverTheHead"]
		}
	}
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemArmsCeilingShacklesLoad() {
	ExtendedItemLoad(InventoryItemArmsCeilingShacklesOptions, "SelectBondagePosition");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemArmsCeilingShacklesDraw() {
	ExtendedItemDraw(InventoryItemArmsCeilingShacklesOptions, "CeilingShacklesPose");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemArmsCeilingShacklesClick() {
	ExtendedItemClick(InventoryItemArmsCeilingShacklesOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemArmsCeilingShacklesPublishAction(C, Option, PreviousOption) {
	var msg = "CeilingShacklesRestrain" + (C.Pose.includes("Suspension") ? "Suspension" : "") + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber }
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
function InventoryItemArmsCeilingShacklesNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsCeilingShackles" + Option.Name, "ItemArms");
}
