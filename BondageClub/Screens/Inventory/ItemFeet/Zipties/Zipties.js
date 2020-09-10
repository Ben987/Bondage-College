"use strict";

const ZiptiesFeetOptions = [
	{
		Name: "ZipFeetLight",
		Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 },
	}, {
		Name: "ZipFeetMedium",
		Property: { Type: "ZipFeetMedium", SetPose: ["LegsClosed"], Difficulty: 2 }
	}, {
		Name: "ZipFeetFull",
		Property: { Type: "ZipFeetFull", SetPose: ["LegsClosed"], Difficulty: 2 }
	}
];

function InventoryItemFeetZiptiesLoad() {
	ExtendedItemLoad(ZiptiesFeetOptions, "SelectZipTie");
}

function InventoryItemFeetZiptiesDraw() {
	ExtendedItemDraw(ZiptiesFeetOptions, "ZipBondage");
}

function InventoryItemFeetZiptiesClick() {
	ExtendedItemClick(ZiptiesFeetOptions);
}

function InventoryItemFeetZiptiesPublishAction(C, Option) {
	var msg = "ZipFeetSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemFeetZiptiesNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "Zip" + Option.Name, "ItemFeet");
}
