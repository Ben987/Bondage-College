"use strict";

var InventoryItemArmsLeatherCuffsOptions = [
	{
		Name: "None",
		Property: {
			Type: null,
			Difficulty: 0,
			Effect: [],
			SetPose: null,
			SelfUnlock: true,
		},
	},
	{
		Name: "Wrist",
		Property: {
			Type: "Wrist",
			Difficulty: 2,
			Effect: ["Block", "Prone"],
			SetPose: ["BackBoxTie"],
			SelfUnlock: true,
		},
	},
	{
		Name: "Elbow",
		Property: {
			Type: "Elbow",
			Difficulty: 4,
			Effect: ["Block", "Prone"],
			SetPose: ["BackElbowTouch"],
			SelfUnlock: false,
		},
	},
	{
		Name: "Both",
		Property: {
			Type: "Both",
			Difficulty: 6,
			Effect: ["Block", "Prone"],
			SetPose: ["BackElbowTouch"],
			SelfUnlock: false,
		},
	}
]

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemArmsLeatherCuffsLoad() {
	ExtendedItemLoad(InventoryItemArmsLeatherCuffsOptions, "SelectBondagePosition");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemArmsLeatherCuffsDraw() {
	ExtendedItemDraw(InventoryItemArmsLeatherCuffsOptions, "LeatherCuffsPose");
}
	
/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemArmsLeatherCuffsClick() {
	ExtendedItemClick(InventoryItemArmsLeatherCuffsOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemArmsLeatherCuffsPublishAction(C, Option, PreviousOption) {
	var msg = "LeatherCuffsRestrain" + Option.Name;
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
function InventoryItemArmsLeatherCuffsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsLeatherCuffs" + Option.Name, "ItemArms");
}
