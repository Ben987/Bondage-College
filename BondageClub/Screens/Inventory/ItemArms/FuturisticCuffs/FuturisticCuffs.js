"use strict";

var InventoryItemArmsFuturisticCuffsOptions = [
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
			Effect: ["Block", "Prone", "NotSelfPickable"],
			SetPose: ["BackElbowTouch"],
			SelfUnlock: false,
		},
	},
	{
		Name: "Both",
		Property: {
			Type: "Both",
			Difficulty: 6,
			Effect: ["Block", "Prone", "NotSelfPickable"],
			SetPose: ["BackElbowTouch"],
			SelfUnlock: false,
		},
	}
]

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemArmsFuturisticCuffsLoad() {
 	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else
		ExtendedItemLoad(InventoryItemArmsFuturisticCuffsOptions, "SelectBondagePosition");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemArmsFuturisticCuffsDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else
		ExtendedItemDraw(InventoryItemArmsFuturisticCuffsOptions, "LeatherCuffsPose");
}
	
/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemArmsFuturisticCuffsClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else
		ExtendedItemClick(InventoryItemArmsFuturisticCuffsOptions);
}



function InventoryItemArmsFuturisticCuffsExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}

function InventoryItemArmsFuturisticCuffsValidate(C, Option) {
 	return InventoryItemMouthFuturisticPanelGagValidate(C, Option)
}


/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemArmsFuturisticCuffsPublishAction(C, Option, PreviousOption) {
	var msg = "FuturisticCuffsRestrain" + Option.Name;
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
function InventoryItemArmsFuturisticCuffsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsLeatherCuffs" + Option.Name, "ItemArms");
}
