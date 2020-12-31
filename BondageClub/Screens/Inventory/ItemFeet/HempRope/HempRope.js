"use strict";

const HempRopeFeetOptions = [
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
		Name: "Diamond",
		BondageLevel: 4,
		Property: { Type: "Diamond", SetPose: ["LegsClosed"], Difficulty: 4 }
	}, {
		Name: "Mermaid",
		BondageLevel: 4,
		Property: { Type: "Mermaid", SetPose: ["LegsClosed"], Difficulty: 4 }
	}, {
		Name: "Suspension",
		BondageLevel: 6,
		Property: { Type: "Suspension", SetPose: ["LegsClosed", "Suspension"], Difficulty: 6 },
		Expression: [{ Group: "Blush", Name: "High", Timer: 30 }],
		Prerequisite: ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"]
	}, {
		Name: "BedSpreadEagle",
		BondageLevel: 1,
		Property: { Type: "BedSpreadEagle", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemLegs", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemLegs", "ItemBoots"], SetPose: ["Spread"], Difficulty: 5 },
		Prerequisite: ["OnBed", "NoItemLegs"]
	}
];

function AssetsItemFeetHempRopeBeforeDraw(data) {
    if (data.LayerType === "BedSpreadEagle") {
        return {
            X: data.X -125,
            Y: data.Y -170,
        };
    }
    return null;
}

function InventoryItemFeetHempRopeLoad() {
	ExtendedItemLoad(HempRopeFeetOptions, "SelectRopeBondage");
}

function InventoryItemFeetHempRopeDraw() {
	ExtendedItemDraw(HempRopeFeetOptions, "RopeBondage");
}

function InventoryItemFeetHempRopeClick() {
	ExtendedItemClick(HempRopeFeetOptions);
}

function InventoryItemFeetHempRopePublishAction(C, Option) {
	var msg = "LegRopeSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemFeetHempRopeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "RopeBondage" + Option.Name, "ItemFeet");
}
