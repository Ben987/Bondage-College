"use strict";

const ZiptiesArmsOptions = [
	{
		Name: "ZipLight",
		Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 1 }
	}, {
		Name: "ZipMedium",
		Property: { Type: "ZipMedium", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
	}, {
		Name: "ZipFull",
		Property: { Type: "ZipFull", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
	}, {
		Name: "ZipElbowWrist",
		Property: { Type: "ZipElbowWrist", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 1 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "ZipWristLight",
		Property: { Type: "ZipWristLight", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
    }, {
		Name: "ZipWristMedium",
		Property: { Type: "ZipWristMedium", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
    }, {
		Name: "ZipWristFull",
		Property: { Type: "ZipWristFull", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
    }, {
		Name: "ZipWrist",
		Property: { Type: "ZipWrist", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "ZipKneelingHogtie",
		Prerequisite: ["NotMounted", "NotSuspended"],
		Property: { Type: "ZipKneelingHogtie", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], SetPose: ["Kneel", "BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}, {
		Name: "ZipHogtie",
		Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "ZipHogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], SetPose: ["Hogtied"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}, {
		Name: "ZipAllFours",
		Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "ZipAllFours", Effect: ["ForceKneel"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], SetPose: ["AllFours"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}
];


function InventoryItemArmsZiptiesLoad() {
	ExtendedItemLoad(ZiptiesArmsOptions, "SelectZipTie");
}

function InventoryItemArmsZiptiesDraw() {
	ExtendedItemDraw(ZiptiesArmsOptions, "ZipBondage");
}

function InventoryItemArmsZiptiesClick() {
	ExtendedItemClick(ZiptiesArmsOptions);
}

function InventoryItemArmsZiptiesPublishAction(C, Option) {
	var msg = "ZipArmsSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemArmsZiptiesNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "Zip" + Option.Name, "ItemArms");
}
