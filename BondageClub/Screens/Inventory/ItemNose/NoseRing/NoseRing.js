"use strict";

var InventoryItemNoseNoseRingOptions = [
	{
		Name: "Base",
		Property: {
			Type: null,
			Effect: [],
			SetPose: [],
		},
	},
	{
		Name: "ChainShort",
		Property: {
			Type: "ChainShort",
			Effect: ["Freeze", "ForceKneel", "IsChained"],
			SetPose: ["Kneel"],
		},
	},
	{
		Name: "ChainLong",
		Property: {
			Type: "ChainLong",
			Effect: ["Tethered", "IsChained"],
			SetPose: [],
		},
	},
	{
		Name: "Leash",
		Property: {
			Type: "Leash",
			Effect: [],
			SetPose: [],
		}, 
	},
]

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemNoseNoseRingLoad() {
	ExtendedItemLoad(InventoryItemNoseNoseRingOptions, "SelectAttachmentState");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemNoseNoseRingDraw() {
	ExtendedItemDraw(InventoryItemNoseNoseRingOptions,"NoseRingPose");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemNoseNoseRingClick() {
	ExtendedItemClick(InventoryItemNoseNoseRingOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemNoseNoseRingPublishAction(C, Option, PreviousOption) {
	var msg = "NoseRingRestrain" + Option.Name;
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
function InventoryItemNoseNoseRingNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "InventoryItemNoseNoseRingNPCReaction" + Option.Name, "ItemNose");
}


/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Option} Option - The next option to use on the character
 * @returns {boolean} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemNoseNoseRingValidate(Option) {
	var ChainShortPrerequisites = true;
	let C = CharacterGetCurrent();
	switch (Option.Name) {
		case "Base":
			break;
		case "ChainShort":
			if (C.Pose.indexOf("Suspension") >= 0 || C.Pose.indexOf("SuspensionHogtied") >= 0) {
				DialogExtendedMessage = DialogFind(Player, "RemoveSuspensionForItem");
				ChainShortPrerequisites = false;
			} else if (C.Pose.indexOf("StraitDressOpen") >= 0) {
				DialogExtendedMessage = DialogFind(Player, "StraitDressOpen");
				ChainShortPrerequisites = false;
			} else if (C.Effect.indexOf("Mounted") >= 0) {
				DialogExtendedMessage = DialogFind(Player, "CannotBeUsedWhenMounted");
				ChainShortPrerequisites = false;
			} // if
			break;
		case "ChainLong":
			if (C.Pose.indexOf("Suspension") >= 0) {
				DialogExtendedMessage = DialogFind(Player, "RemoveSuspensionForItem");
				ChainShortPrerequisites = false;
			} else if (C.Pose.indexOf("StraitDressOpen") >= 0) {
				DialogExtendedMessage = DialogFind(Player, "StraitDressOpen");
				ChainShortPrerequisites = false;
			} // if
			break;
		case "Leash":
			if (C.Pose.indexOf("Suspension") >= 0) {
				DialogExtendedMessage = DialogFind(Player, "RemoveSuspensionForItem");
				ChainShortPrerequisites = false;
			} else if(C.Pose.indexOf("StraitDressOpen") >= 0) {
				DialogExtendedMessage = DialogFind(Player, "StraitDressOpen");
				ChainShortPrerequisites = false;
			} // if
			break;
	} // switch
	return ChainShortPrerequisites;
} // InventoryItemNoseNoseRingValidate
