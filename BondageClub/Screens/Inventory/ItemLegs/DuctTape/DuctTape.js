"use strict";

var InventoryItemLegsDuctTapeOptions = [
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

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemLegsDuctTapeLoad() {
	ExtendedItemLoad(InventoryItemLegsDuctTapeOptions, "SelectTapeWrapping");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemLegsDuctTapeDraw() {
	ExtendedItemDraw(InventoryItemLegsDuctTapeOptions, "DuctTapePose");
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemLegsDuctTapeClick() {
	ExtendedItemClick(InventoryItemLegsDuctTapeOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemLegsDuctTapePublishAction(C, Option) {
	var msg = "DuctTapeRestrain" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * The NPC dialog is for what the NPC says to you when you make a change to their restraints - the dialog lookup is on a
 * per-NPC basis. You basically put the "AssetName" + OptionName in there to allow individual NPCs to override their default
 * "GroupName" dialog if for example we ever wanted an NPC to react specifically to having the restraint put on them.
 * That could be done by adding an "AssetName" entry (or entries) to that NPC's dialog CSV
 * @param {Character} C - The NPC to whom the restraint is applied
 * @param {Option} Option - The chosen option for this extended item
 * @returns {void} - Nothing
 */
function InventoryItemLegsDuctTapeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "DuctTapePose" + Option.Name, "ItemLegs");
}

/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character to check the option for
 * @param {Option} Option - The next option to use on the character
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemLegsDuctTapeValidate(C, Option) {
	var Allowed = "";

	if (Option.Property.Type != null && InventoryGet(C, "ClothLower")) {
		Allowed = DialogFindPlayer("RemoveClothesForItem");
	}
	return Allowed;
}
