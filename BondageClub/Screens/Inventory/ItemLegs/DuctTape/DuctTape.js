"use strict";

const InventoryItemLegsDuctTapeOptions = [
	{
		Name: "Legs",
		Property: { Type: null, Difficulty: 0 }
	}, {
		Name: "HalfLegs",
		Property: { Type: "HalfLegs", Hide: ["ClothLower"], Difficulty: 2 }
	}, {
		Name: "MostLegs",
		Property: { Type: "MostLegs", Hide: ["ClothLower"], Difficulty: 4 }
	}, {
		Name: "CompleteLegs",
		Property: { Type: "CompleteLegs", Hide: ["ClothLower"], Difficulty: 6 }
	}
];

function InventoryItemLegsDuctTapeLoad() {
	ExtendedItemLoad(InventoryItemLegsDuctTapeOptions, "SelectTapeWrapping");
}

function InventoryItemLegsDuctTapeDraw() {
	ExtendedItemDraw(InventoryItemLegsDuctTapeOptions, "DuctTapePose");
}

function InventoryItemLegsDuctTapeClick() {
	ExtendedItemClick(InventoryItemLegsDuctTapeOptions);
}

function InventoryItemLegsDuctTapePublishAction(C, Option) {
	var msg = "DuctTapeRestrain" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemLegsDuctTapeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "DuctTapePose" + Option.Name, "ItemLegs");
}

function InventoryItemLegsDuctTapeValidate(C, Option) {
	var Allowed = true;

	if (Option.Property.Type != null && InventoryGet(C, "ClothLower")) {
		DialogExtendedMessage = DialogFind(Player, "RemoveClothesForItem", "ItemLegs");
		Allowed = false;
	}
	return Allowed;
}
