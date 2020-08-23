"use strict";

const HempRopePelvisOptions = [
	{
		Name: "Crotch",
		Property: { Type: null, Difficulty: 1 }
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

function InventoryItemFeetHempRopeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "RopeBondage" + Option.Name, "ItemPelvis");
}