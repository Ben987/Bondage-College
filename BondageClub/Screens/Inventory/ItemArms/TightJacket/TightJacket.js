"use strict";

const TightJacketArmsOptions = [
	{
		Name: "Basic",
		Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 1 }
	},
	{
		Name: "PulledStraps",
		Property: { Type: "PulledStraps", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 1 }
	},
	{
		Name: "LiningStraps",
		Property: { Type: "LiningStraps", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 }
	},
	{
		Name: "ExtraPadding",
		Property: { Type: "ExtraPadding", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 }
	},
	{
		Name: "PulledLining",
		Property: { Type: "PulledLining", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 }
	},
	{
		Name: "PulledPadding",
		Property: { Type: "PulledPadding", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 }
	},
	{
		Name: "PaddedLining",
		Property: { Type: "PaddedLining", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 }
	},
	{
		Name: "FullJacket",
		Property: { Type: "FullJacket", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 4 }
	}
];

function InventoryItemArmsTightJacketLoad() {
	ExtendedItemLoad(TightJacketArmsOptions, "SelectJacketPrep");
}

function InventoryItemArmsTightJacketDraw() {
	ExtendedItemDraw(TightJacketArmsOptions, "JacketPrep");
}

function InventoryItemArmsTightJacketClick() {
	ExtendedItemClick(TightJacketArmsOptions);
}

function InventoryItemArmsTightJacketValidate() {
	if (InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		return false;
	}
	return true;
}

function InventoryItemArmsTightJacketPublishAction(C, Option) {
	var msg = "JacketPrepSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemArmsTightJacketNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "JacketPrep" + Option.Name, "ItemArms");
}
