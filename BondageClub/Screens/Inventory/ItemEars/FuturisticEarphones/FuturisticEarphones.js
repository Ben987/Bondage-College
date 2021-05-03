"use strict";

var InventoryItemEarsFuturisticEarphonesMessage = "";

var InventoryItemEarsFuturisticEarphonesOptions = [
	{
		Name: "Off",
		Property: {
			Type: null,
			Effect: [],
		},
	},
	{
		Name: "Light",
		Property: {
			Type: "Light",
			Effect: ["DeafLight"],
		},
	},
	{
		Name: "Heavy",
		Property: {
			Type: "Heavy",
			Effect: ["DeafHeavy"],
		},
	},
	{
		Name: "NoiseCancelling",
		Property: {
			Type: "NoiseCancelling",
			Effect: ["DeafTotal"],
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemEarsFuturisticEarphonesLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	} else
		ExtendedItemLoad(InventoryItemEarsFuturisticEarphonesOptions, "HeadphoneEarPlugsSelectLoudness");
}

/**
 *  Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemEarsFuturisticEarphonesDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else
		ExtendedItemDraw(InventoryItemEarsFuturisticEarphonesOptions, "HeadphoneEarPlugsPose");
}


/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemEarsFuturisticEarphonesClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else
		ExtendedItemClick(InventoryItemEarsFuturisticEarphonesOptions);
}


function InventoryItemEarsFuturisticEarphonesExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemEarsFuturisticEarphonesPublishAction(C, Option, PreviousOption) {
	var NewIndex = InventoryItemEarsFuturisticEarphonesOptions.indexOf(Option);
	var PreviousIndex = InventoryItemEarsFuturisticEarphonesOptions.indexOf(PreviousOption);
	var msg = "HeadphoneEarPlugsRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "AssetName", AssetName: DialogFocusItem.Asset.Name },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}
