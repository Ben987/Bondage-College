"use strict";

const CeilingChainAddonOptions = [
	{
		Name: "Lowered",
		Property: { Type: null, Difficulty: 6, Effect: []}
	}, {
		Name: "Suspended",
        Property: { Type: "Suspended", Difficulty: 7,
    OverrideHeight: { Height: 30, Priority: 51, HeightRatioProportion: 0 } },
	}, 
	
];


function InventoryItemAddonCeilingChainLoad() {
	ExtendedItemLoad(CeilingChainAddonOptions, "SelectCeilingChainState");
}

function InventoryItemAddonCeilingChainDraw() {
	ExtendedItemDraw(CeilingChainAddonOptions, "CeilingChainBondage");
}

function InventoryItemAddonCeilingChainClick() {
	ExtendedItemClick(CeilingChainAddonOptions);
}

function InventoryItemAddonCeilingChainPublishAction(C, Option) {
	var msg = "CeilingChainSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemAddonCeilingChainNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "CeilingChain" + Option.Name, "ItemAddon");
}
