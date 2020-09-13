"use strict";

const TightJacketCrotchArmsOptions = [
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

function InventoryItemArmsTightJacketCrotchLoad() {
	ExtendedItemLoad(TightJacketCrotchArmsOptions, "SelectJacketPrep");
}

function InventoryItemArmsTightJacketCrotchDraw() {
	ExtendedItemDraw(TightJacketCrotchArmsOptions, "JacketPrep");
}

function InventoryItemArmsTightJacketCrotchClick() {
	ExtendedItemClick(TightJacketCrotchArmsOptions);
}

function InventoryItemArmsTightJacketCrotchValidate(Option) {
	if (Option.Prerequisite != null && !InventoryAllow(C, Option.Prerequisite, true)) { DialogExtendedMessage = DialogText; return false; }

	if (InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		return false;
	}

	return true;
}

function InventoryItemArmsTightJacketCrotchPublishAction(C, Option) {
	var msg = "JacketPrepSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemArmsTightJacketCrotchNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "JacketPrep" + Option.Name, "ItemArms");
}