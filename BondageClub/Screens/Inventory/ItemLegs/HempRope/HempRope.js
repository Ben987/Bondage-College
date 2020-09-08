"use strict";

const HempRopeLegsOptions = [
	{
		Name: "Basic",
		Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 }
	}, {
		Name: "FullBinding",
		BondageLevel: 2,
		Property: { Type: "FullBinding", SetPose: ["LegsClosed"], Difficulty: 2 }
	}, {
		Name: "Link",
		BondageLevel: 2,
		Property: { Type: "Link", SetPose: ["LegsClosed"], Difficulty: 2 }
	}, {
		Name: "Frogtie",
		BondageLevel: 3,
		Property: { Type: "Frogtie", SetPose: ["Kneel"], Block: ["ItemFeet"], Effect: ["ForceKneel"], Difficulty: 3 },
		Prerequisite: ["NotSuspended", "CanKneel"]
	}, {
		Name: "Crossed",
		BondageLevel: 4,
		Property: { Type: "Crossed", SetPose: ["LegsClosed"], Difficulty: 4 }
	}, {
		Name: "Mermaid",
		BondageLevel: 4,
		Property: { Type: "Mermaid", SetPose: ["LegsClosed"], Difficulty: 4 }
	}
];

function InventoryItemLegsHempRopeLoad() {
	ExtendedItemLoad(HempRopeLegsOptions, "SelectRopeBondage");
}

function InventoryItemLegsHempRopeDraw() {
	ExtendedItemDraw(HempRopeLegsOptions, "RopeBondage");
}

function InventoryItemLegsHempRopeClick() {
	ExtendedItemClick(HempRopeLegsOptions);
}

function InventoryItemLegsHempRopePublishAction(C, Option) {
	var msg = "LegRopeSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemLegsHempRopeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "RopeBondage" + Option.Name, "ItemLegs");
}
