"use strict";

var InventoryItemDevicesBondageBenchOptions = [
	{
		Name: "None",
		Property: {
			Type: null,
			Difficulty: 0,
			AllowLock: false,
			SetPose: ["LegsClosed"],
			Effect: ["Mounted"],
		},
	},
	{
		Name: "Light",
		SelfBondageLevel: 2,
		Prerequisite: ["NoOuterClothes"],
		Property: {
			Type: "Light",
			Difficulty: 2,
			SetPose: ["LegsClosed", "BaseUpper"],
			Effect: ["Block", "Prone", "Freeze", "Mounted"],
			Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
		},
	},
	{
		Name: "Normal",
		SelfBondageLevel: 3,
		Prerequisite: ["NoOuterClothes"],
		Property: {
			Type: "Normal",
			Difficulty: 3,
			SetPose: ["LegsClosed", "BaseUpper"],
			Effect: ["Block", "Prone", "Freeze", "Mounted"],
			Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
		},
	},
	{
		Name: "Heavy",
		SelfBondageLevel: 6,
		Prerequisite: ["NoOuterClothes"],
		Property: {
			Type: "Heavy",
			Difficulty: 6,
			SetPose: ["LegsClosed", "BaseUpper"],
			Effect: ["Block", "Prone", "Freeze", "Mounted"],
			Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
		},
	},
	{
		Name: "Full",
		SelfBondageLevel: 9,
		Prerequisite: ["NoOuterClothes"],
		Property: {
			Type: "Full",
			Difficulty: 9,
			SetPose: ["LegsClosed", "BaseUpper"],
			Effect: ["Block", "Prone", "Freeze", "Mounted"],
			Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemDevicesBondageBenchLoad() {
	ExtendedItemLoad(InventoryItemDevicesBondageBenchOptions, "BondageBenchStrapsSelectTightness");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemDevicesBondageBenchDraw() {
	ExtendedItemDraw(InventoryItemDevicesBondageBenchOptions, "BondageBenchStrapsPose");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemDevicesBondageBenchClick() {
	ExtendedItemClick(InventoryItemDevicesBondageBenchOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemDevicesBondageBenchPublishAction(C, Option, PreviousOption) {
	var msg = "BondageBenchStrapsRestrain" + ((!Option.Property.Type) ? "None" : Option.Property.Type);
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
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
function InventoryItemDevicesBondageBenchNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "InventoryItemDevicesBondageBenchNPCReaction" + Option.Name, "ItemDevices");
}
