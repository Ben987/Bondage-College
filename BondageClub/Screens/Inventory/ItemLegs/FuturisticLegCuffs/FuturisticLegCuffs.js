"use strict";

const InventoryItemLegsFuturisticLegCuffsOptions = [
	{
		Name: "None",
		Property: { Type: null },
	},
	{
		Name: "Closed",
		Property: {
			Type: "Closed",
			SetPose: ["LegsClosed"],
			Effect: ["Prone", "KneelFreeze", "Slow"],
			FreezeActivePose: ["BodyLower"],
			Difficulty: 6,
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemLegsFuturisticLegCuffsLoad() {
	ExtendedItemLoad(InventoryItemLegsFuturisticLegCuffsOptions, "SelectBondagePosition");
	const C = CharacterGetCurrent();
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	}
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemLegsFuturisticLegCuffsDraw() {
	const C = CharacterGetCurrent();
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else {
		ExtendedItemDraw(InventoryItemLegsFuturisticLegCuffsOptions, "LeatherLegCuffsPose");
	}
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemLegsFuturisticLegCuffsClick() {
	const C = CharacterGetCurrent();
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else {
		ExtendedItemClick(InventoryItemLegsFuturisticLegCuffsOptions);
	}
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemLegsFuturisticLegCuffsPublishAction(C, Option) {
	const msg = "FuturisticLegCuffsRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * The NPC dialog is for what the NPC says to you when you make a change to their restraints - the dialog lookup is on
 * a per-NPC basis.
 * @param {Character} C - The NPC to whom the restraint is applied
 * @param {Option} Option - The chosen option for this extended item
 * @returns {void} - Nothing
 */
function InventoryItemLegsFuturisticLegCuffsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemLegsFuturisticLegCuffs" + Option.Name, "ItemLegs");
}

/**
 * Called when the item's extended item screen is left
 * @returns {void} - Nothing
 */
function InventoryItemLegsFuturisticLegCuffsExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}

/**
 * Validates whether or not the player has access to the item's extended item screen
 * @param {Character} C - The character on whom the restraint is applied
 * @param {Item} Item - The equipped item
 * @returns {string} - Returns a validation message if validation fails, or an empty string otherwise
 */
function InventoryItemLegsFuturisticLegCuffsValidate(C, Item) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Item);
}
