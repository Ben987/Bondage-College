"use strict";

const HempRopeTorsoOptions = [
	{
		Name: "Crotch",
		Property: { Type: null, Difficulty: 1 }
	}, {
		Name: "Waist",
		Property: { Type: "Waist" , Difficulty: 1 }
	}, {
		Name: "Harness",
		BondageLevel: 2,
		Property: { Type: "Harness" , Difficulty: 1 }
	}, {
		Name: "Star",
		BondageLevel: 3,
		Property: { Type: "Star" , Difficulty: 2 }
	}, {
		Name: "Diamond",
		BondageLevel: 4,
		Property: { Type: "Diamond" , Difficulty: 3 }
	}
];

function InventoryItemTorsoHempRopeHarnessLoad() {
	ExtendedItemLoad(HempRopeTorsoOptions, "SelectRopeBondage");
}

function InventoryItemTorsoHempRopeHarnessDraw() {
	ExtendedItemDraw(HempRopeTorsoOptions, "RopeBondage");
}

function InventoryItemTorsoHempRopeHarnessClick() {
	ExtendedItemClick(HempRopeTorsoOptions);
}

function InventoryItemTorsoHempRopeHarnessPublishAction(C, Option) {
	var msg = "RopeHarnessSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemTorsoHempRopeHarnessNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "RopeBondage" + Option.Name, "ItemTorso");
}
