"use strict";

var InventoryItemArmsChainsOptions = [
	{
		Name: "WristTie",
		BondageLevel: null,
		Property: { Type: "WristTie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
	}, {
		Name: "BoxTie",
		BondageLevel: null,
		Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 }
	}, {
		Name: "ChainCuffs",
		BondageLevel: null,
		Property: { Type: "ChainCuffs", Effect: ["Block", "Prone"], SetPose: ["BackCuffs"], Difficulty: 1, OverridePriority: 29 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
	}, {
		Name: "WristElbowTie",
		BondageLevel: 2,
		Property: { Type: "WristElbowTie", Effect: ["Block", "Prone", "NotSelfPickable"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "WristElbowHarnessTie",
		BondageLevel: 3,
		Property: { Type: "WristElbowHarnessTie", Effect: ["Block", "Prone", "NotSelfPickable"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "KneelingHogtie",
		BondageLevel: 4,
		Prerequisite: ["NotMounted", "NotSuspended"],
		Property: { Type: "KneelingHogtie", Effect: ["Block", "Freeze", "Prone", "NotSelfPickable"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Kneel", "BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		SelfBlockCheck: true,
	}, {
		Name: "Hogtied",
		BondageLevel: 4,
		Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "Hogtied", Effect: ["Block", "Freeze", "Prone", "NotSelfPickable"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		SelfBlockCheck: true,
	}, {
		Name: "AllFours",
		BondageLevel: 6,
		Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "AllFours", Effect: ["ForceKneel", "NotSelfPickable"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],  AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["AllFours"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		SelfBlockCheck: true,
	}, {
		Name: "SuspensionHogtied",
		BondageLevel: 8,
		Prerequisite: ["NotMounted", "NotChained", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "SuspensionHogtied", Effect: ["Block", "Freeze", "Prone", "NotSelfPickable"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied", "SuspensionHogtied"], Difficulty: 6,
			OverrideHeight: { Height: 0, Priority: 51, HeightRatioProportion: 0 } },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
	}
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemArmsChainsLoad() {
	ExtendedItemLoad(InventoryItemArmsChainsOptions, "SelectChainBondage");
}

/**
* Draw the item extension screen
* @returns {void} - Nothing
*/
function InventoryItemArmsChainsDraw() {
	ExtendedItemDraw(InventoryItemArmsChainsOptions, "ChainBondage");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemArmsChainsClick() {
	ExtendedItemClick(InventoryItemArmsChainsOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemArmsChainsPublishAction(C, Option) {
	var msg = "ArmsChainSet" + Option.Name;
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
function InventoryItemArmsChainsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ChainBondage" + Option.Name, "ItemArms");
}

/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character to validate the option for
 * @param {ExtendedItemOption} Option - The selected option
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemArmsChainsValidate(C, Option) {
	var Allowed = "";

	if (InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		Allowed = DialogFindPlayer("CantChangeWhileLocked");
	} else if (Option.Prerequisite) {
		if (!ExtendedItemSelfProofRequirementCheck(C, Option.Prerequisite)) {
			Allowed = DialogText;
		}
	}

	return Allowed;
}
