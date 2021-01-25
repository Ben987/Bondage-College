"use strict";

const CeilingRopeAddonOptions = [
	{
		Name: "Lowered",
		Property: { Type: null, Difficulty: 6}
	}, {
		Name: "Suspended",
        Property: { Type: "Suspended", Difficulty: 7,
    OverrideHeight: { Height: 30, Priority: 51, HeightRatioProportion: 0 } },
	}, 
	
];


function InventoryItemAddonCeilingRopeLoad() {
	ExtendedItemLoad(CeilingRopeAddonOptions, "SelectCeilingRopeState");
}

function InventoryItemAddonCeilingRopeDraw() {
	ExtendedItemDraw(CeilingRopeAddonOptions, "CeilingRopeBondage");
}

function InventoryItemAddonCeilingRopeClick() {
	ExtendedItemClick(CeilingRopeAddonOptions);
}

function InventoryItemAddonCeilingRopePublishAction(C, Option) {
	var msg = "CeilingRopeSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemAddonCeilingRopeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "CeilingRope" + Option.Name, "ItemAddon");
}
