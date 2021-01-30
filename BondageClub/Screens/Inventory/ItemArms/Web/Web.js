"use strict";

var InventoryItemArmsWebOptions = [
	{
		Name: "Tangled",
		Property: { Type: null, Difficulty: 0 },
	},
	{
		Name: "Wrapped",
		BondageLevel: 0,
		SelfBondageLevel: 4,
		Prerequisite: ["NoFeetSpreader"],
		Property: {
			Type: "Wrapped",
			Difficulty: 2,
			Prerequisite: ["NoFeetSpreader"],
			AllowPose: ["Kneel"],
			SetPose: ["LegsClosed", "BackElbowTouch"],
			Effect: ["Block", "Freeze", "Prone"],
			Block: ["ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
		},
	},
	{
		Name: "Cocooned",
		BondageLevel: 1,
		SelfBondageLevel: 5,
		Prerequisite: ["NoFeetSpreader"],
		Property: {
			Type: "Cocooned",
			Difficulty: 4,
			Prerequisite: ["NoFeetSpreader"],
			AllowPose: ["Kneel"],
			SetPose: ["LegsClosed", "BackElbowTouch"],
			Effect: ["Block", "Freeze", "Prone"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
		},
	},
	{
		Name: "Hogtied",
		BondageLevel: 3,
		SelfBondageLevel: 6,
		Prerequisite: ["NotSuspended", "NoFeetSpreader", "CannotBeHogtiedWithAlphaHood"],
		Property: {
			Type: "Hogtied",
			Difficulty: 4,
			SetPose: ["Hogtied"],
			Effect: ["Block", "Freeze", "Prone"],
			Hide: ["Cloth", "ClothLower", "ClothAccessory", "Necklace", "Shoes", "Socks"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemDevices"],
		},
		SelfBlockCheck: true,
	},
	{
		Name: "Suspended",
		BondageLevel: 4,
		SelfBondageLevel: 8,
		Prerequisite: ["NoFeetSpreader", "NotChained"],
		Property: {
			Type: "Suspended",
			Difficulty: 6,
			SetPose: ["LegsClosed", "BackElbowTouch", "Suspension"],
			Effect: ["Block", "Freeze", "Prone"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
		},
	},
	{
		Name: "KneelingSuspended",
		BondageLevel: 5,
		SelfBondageLevel: 8,
		Prerequisite: ["NoFeetSpreader", "NotChained"],
		Property: {
			Type: "KneelingSuspended",
			Difficulty: 8,
			SetPose: ["LegsClosed", "BackElbowTouch", "Suspension"],
			Effect: ["Block", "Freeze", "Prone"],
			Hide: ["BodyLower", "Cloth", "ClothLower", "Shoes", "SuitLower", "Panties", "Socks", "Pussy", "ItemFeet", "ItemLegs", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemBoots", "ItemHands", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
		},
	},
	{
		Name: "SuspensionHogtied",
		BondageLevel: 5,
		SelfBondageLevel: 9,
		Prerequisite: ["NotSuspended", "NoFeetSpreader", "NotChained", "CannotBeHogtiedWithAlphaHood"],
		Property: {
			Type: "SuspensionHogtied",
			Difficulty: 11,
			SetPose: ["Hogtied", "SuspensionHogtied"],
			Effect: ["Block", "Freeze", "Prone"],
			Hide: ["Cloth", "ClothLower", "ClothAccessory", "Necklace", "Shoes", "Socks"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemDevices"],
			OverrideHeight: { Height: 0, Priority: 51, HeightRatioProportion: 0 },
		},
		SelfBlockCheck: true,
	},
];


/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemArmsWebLoad() {
	ExtendedItemLoad(InventoryItemArmsWebOptions, "WebBondageSelect");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemArmsWebDraw() {
	ExtendedItemDraw(InventoryItemArmsWebOptions, "WebBondage");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemArmsWebClick() {
	ExtendedItemClick(InventoryItemArmsWebOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemArmsWebPublishAction(C, Option, PreviousOption) {
	var NewIndex = InventoryItemArmsWebOptions.indexOf(Option);
	var PreviousIndex = InventoryItemArmsWebOptions.indexOf(PreviousOption);
	var msg = "ArmsWebSet" + Option.Name;
	var ActionDialog = DialogFindPlayer(NewIndex > PreviousIndex ? "tightens" : "loosens");
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "Action", Text: ActionDialog },
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
function InventoryItemArmsWebNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsWeb" + Option.Name, "ItemArms");
}
