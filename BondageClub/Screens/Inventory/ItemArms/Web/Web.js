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
	},
	{
		Name: "Suspended",
		BondageLevel: 4,
		SelfBondageLevel: 8,
		Prerequisite: ["NoFeetSpreader", "NotChained", "CannotBeHogtiedWithAlphaHood"],
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
		Prerequisite: ["NoFeetSpreader", "NotChained", "CannotBeHogtiedWithAlphaHood"],
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

function InventoryItemArmsWebValidate(C, Option) {
	// Validates some prerequisites before allowing more advanced poses
	if (Option.Prerequisite) {
		var Allowed = true;

		// Remove the web temporarily for prerequisite-checking - we should still be able to change type if the web is the only thing that
		// fails the prerequisite check
		var Web = InventoryGet(C, "ItemArms");
		InventoryRemove(C, "ItemArms");

		if (!InventoryAllow(C, Option.Prerequisite, true)) {
			DialogExtendedMessage = DialogText;
			Allowed = false;
		}

		// Re-add the web
		var DifficultyFactor = Web.Difficulty - Web.Asset.Difficulty;
		CharacterAppearanceSetItem(C, "ItemArms", Web.Asset, Web.Color, DifficultyFactor, null, false);
		InventoryGet(C, "ItemArms").Property = Web.Property;
		CharacterRefresh(C);
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);

		return Allowed;
	}
}

function InventoryItemArmsWebPublishAction(C, Option, PreviousOption) {
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

function InventoryItemArmsWebNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsWeb" + Option.Name, "ItemArms");
}
