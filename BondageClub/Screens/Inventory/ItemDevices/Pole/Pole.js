"use strict";

var InventoryItemDevicesPoleOptions = [
	{
		Name: "Untied",
		Property: {
			Type: null,
		}
	},
	{
		Name: "Tied",
		SelfBondageLevel: 2,
		Property: {
			Type: "Tied",
			Difficulty: 8,
			SetPose: ["BackBoxTie"],
			Effect: ["Block", "Freeze", "Prone"],
		}
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemDevicesPoleLoad() {
	ExtendedItemLoad(InventoryItemDevicesPoleOptions, "SelectPoleType");
}

/**
* Draw the item extension screen
* @returns {void} - Nothing
*/
function InventoryItemDevicesPoleDraw() {
	ExtendedItemDraw(InventoryItemDevicesPoleOptions, "PoleType");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemDevicesPoleClick() {
	ExtendedItemClick(InventoryItemDevicesPoleOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemDevicesPolePublishAction(C, Option) {
	var msg = "DevicesPoleSet" + Option.Name;
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
function InventoryItemDevicesPoleNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemDevicesPole" + Option.Name, "ItemDevices");
}
