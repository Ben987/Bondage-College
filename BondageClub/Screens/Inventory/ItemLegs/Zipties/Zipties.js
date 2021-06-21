"use strict";

const ZiptiesLegsOptions = [
	{
		Name: "ZipLegLight",
		Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 }
	}, {
		Name: "ZipLegMedium",
		Property: { Type: "ZipLegMedium", SetPose: ["LegsClosed"], Difficulty: 2 }
	}, {
		Name: "ZipLegFull",
		Property: { Type: "ZipLegFull", SetPose: ["LegsClosed"], Difficulty: 2 }
	}, {
		Name: "ZipFrogtie",
		Property: { Type: "ZipFrogtie", SetPose: ["Kneel"], Block: ["ItemFeet"], Effect: ["ForceKneel"], Difficulty: 3 },
		Prerequisite: ["NotSuspended", "CanKneel"]
	}
];

function InventoryItemLegsZiptiesLoad() {
	ExtendedItemLoad(ZiptiesLegsOptions, "SelectZipTie");
}

function InventoryItemLegsZiptiesDraw() {
	ExtendedItemDraw(ZiptiesLegsOptions, "ZipBondage");
}

function InventoryItemLegsZiptiesClick() {
	ExtendedItemClick(ZiptiesLegsOptions);
}

function InventoryItemLegsZiptiesPublishAction(C, Option) {
	var msg = "ZipLegsSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemLegsZiptiesNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "Zip" + Option.Name, "ItemLegs");
}
