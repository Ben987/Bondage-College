"use strict";

const InventoryItemArmsHempRopeOptions = [
	{
		Name: "BoxTie",
		BondageLevel: null,
		Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 }
	}, {
		Name: "WristTie",
		BondageLevel: null,
		Property: { Type: "WristTie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
	}, {
		Name: "CrossedBoxtie",
		BondageLevel: null,
		Property: { Type: "CrossedBoxtie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
	}, {
		Name: "RopeCuffs",
		BondageLevel: null,
		Property: { Type: "RopeCuffs", Effect: ["Block", "Prone"], SetPose: ["BackCuffs"], Difficulty: 1, OverridePriority: 29 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
	}, {
		Name: "WristElbowTie",
		BondageLevel: 2,
		Property: { Type: "WristElbowTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "SimpleHogtie",
		BondageLevel: 2,
		Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "SimpleHogtie", Effect: ["Block", "Prone"], SetPose: ["Hogtied"], Difficulty: 2 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "TightBoxtie",
		BondageLevel: 3,
		Property: { Type: "TightBoxtie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "WristElbowHarnessTie",
		BondageLevel: 3,
		Property: { Type: "WristElbowHarnessTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "KneelingHogtie",
		BondageLevel: 4,
		Prerequisite: ["NotMounted", "NotSuspended"],
		Property: { Type: "KneelingHogtie", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Kneel", "BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}, {
		Name: "Hogtied",
		BondageLevel: 4,
		Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "Hogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}, {
		Name: "AllFours",
		BondageLevel: 6,
		Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "AllFours", Effect: ["ForceKneel"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["AllFours"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}, {
		Name: "SuspensionHogtied",
		BondageLevel: 8,
		Prerequisite: ["NotMounted", "NotChained", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "SuspensionHogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied", "SuspensionHogtied"], Difficulty: 6 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
	}, {
		Name: "BedSpreadEagle",
		BondageLevel: 1,
		Prerequisite: ["OnBed"],
		Property: { Type: "BedSpreadEagle", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemDevices"], SetPose: ["Yoked"], Difficulty: 5 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}
];

function AssetsItemArmsHempRopeBeforeDraw(data) {
    if (data.LayerType === "BedSpreadEagle") {
        return {
            X: data.X -50,
            Y: data.Y -150,
        };
    }
    return null;
}

function InventoryItemArmsHempRopeLoad() {
	ExtendedItemLoad(InventoryItemArmsHempRopeOptions, "SelectRopeBondage");
}

function InventoryItemArmsHempRopeDraw() {
	ExtendedItemDraw(InventoryItemArmsHempRopeOptions, "RopeBondage");
}

function InventoryItemArmsHempRopeClick() {
	ExtendedItemClick(InventoryItemArmsHempRopeOptions);
}

function InventoryItemArmsHempRopePublishAction(C, Option) {
	var msg = "ArmsRopeSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemArmsHempRopeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "RopeBondage" + Option.Name, "ItemArms");
}
