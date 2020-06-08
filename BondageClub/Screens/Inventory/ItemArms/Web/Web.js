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
		RequiresPrerequisites: true,
		Property: {
			Type: "Hogtied",
			Difficulty: 4,
			Prerequisite: ["NoFeetSpreader"],
			SetPose: ["Hogtied"],
			Effect: ["Block", "Freeze", "Prone"],
			Hide: ["Cloth", "ClothLower", "ClothAccessory", "Necklace"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
		},
	},
	{
		Name: "Suspended",
		BondageLevel: 4,
		SelfBondageLevel: 8,
		RequiresPrerequisites: true,
		Property: {
			Type: "Suspended",
			Difficulty: 6,
			Prerequisite: ["NoFeetSpreader"],
			SetPose: ["LegsClosed", "BackElbowTouch", "Suspension"],
			Effect: ["Block", "Freeze", "Prone"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
		},
	},
	{
		Name: "SuspensionHogtied",
		BondageLevel: 5,
		SelfBondageLevel: 9,
		RequiresPrerequisites: true,
		Property: {
			Type: "SuspensionHogtied",
			Difficulty: 11,
			Prerequisite: ["NoFeetSpreader"],
			SetPose: ["Hogtied", "SuspensionHogtied"],
			Effect: ["Block", "Freeze", "Prone"],
			Hide: ["Cloth", "ClothLower", "ClothAccessory", "Necklace"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
		},
	},
];


function InventoryItemArmsWebLoad() {
	ExtendedItemLoad(InventoryItemArmsWebOptions, "WebBondageSelect");
}

function InventoryItemArmsWebDraw() {
	ExtendedItemDraw(InventoryItemArmsWebOptions, "WebBondage");
}

function InventoryItemArmsWebClick() {
	ExtendedItemClick(InventoryItemArmsWebOptions);
}

function InventoryItemArmsWebValidate(Option) {
	var C = CharacterGetCurrent();
	// Validates some prerequisites before allowing more advanced poses
	if (Option.RequiresPrerequisites && !InventoryAllow(C, ["NotKneeling", "NotChained", "CannotBeHogtiedWithAlphaHood"], true)) {
		DialogExtendedMessage = DialogText;
		return false;
	}
}

function InventoryItemArmsWebPublishAction(Option, PreviousOption) {
	var C = CharacterGetCurrent();
	var NewIndex = InventoryItemArmsWebOptions.indexOf(Option);
	var PreviousIndex = InventoryItemArmsWebOptions.indexOf(PreviousOption);
	var msg = "ArmsWebSet" + Option.Name;
	var ActionDialog = DialogFind(Player, NewIndex > PreviousIndex ? "tightens" : "loosens", "ItemArms");
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "Action", Text: ActionDialog },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}
