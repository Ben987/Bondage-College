"use strict";

const HempRopePelvisOptions = [
	{
		Name: "Crotch",
		Property: { Type: null, Difficulty: 1, Effect: ["CrotchRope"] }
	}, {
		Name: "OverPanties",
		Property: { Type: "OverPanties", Difficulty: 1, OverridePriority: 21, Effect: ["CrotchRope"]}
	}, {
		Name: "SwissSeat",
		BondageLevel: 4,
		Property: { Type: "SwissSeat", Difficulty: 4 }
	}, {
		Name: "KikkouHip",
		BondageLevel: 5,
		Property: { Type: "KikkouHip", Difficulty: 5 }
	}
];

function InventoryItemPelvisHempRopeLoad() {
	ExtendedItemLoad(HempRopePelvisOptions, "SelectRopeBondage");
}

function InventoryItemPelvisHempRopeDraw() {
	ExtendedItemDraw(HempRopePelvisOptions, "RopeBondage");
}

function InventoryItemPelvisHempRopeClick() {
	ExtendedItemClick(HempRopePelvisOptions);
}

function InventoryItemPelvisHempRopePublishAction(C, Option) {
	var msg = "PelvisRopeSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemPelvisHempRopeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "RopeBondage" + Option.Name, "ItemPelvis");
}
