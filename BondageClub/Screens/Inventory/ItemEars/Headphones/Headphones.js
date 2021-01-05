"use strict";

var InventoryItemEarsHeadphonesMessage = "";

var InventoryItemEarsHeadphonesOptions = [
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
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemEarsHeadphonesLoad() {
	ExtendedItemLoad(InventoryItemEarsHeadphonesOptions, "HeadphonesSelectLoudness");
}

/**
 *  Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemEarsHeadphonesDraw() {
	ExtendedItemDraw(InventoryItemEarsHeadphonesOptions, "HeadphonesPose");
}


/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemEarsHeadphonesClick() {
	ExtendedItemClick(InventoryItemEarsHeadphonesOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemEarsHeadphonesPublishAction(C, Option, PreviousOption) {
	var NewIndex = InventoryItemEarsHeadphonesOptions.indexOf(Option);
	var PreviousIndex = InventoryItemEarsHeadphonesOptions.indexOf(PreviousOption);
	var msg = "HeadphonesRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "AssetName", AssetName: DialogFocusItem.Asset.Name },
	];
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
function InventoryItemEarsHeadphonesNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemEarsHeadphonePlugs" + Option.Name, "ItemEars");
}

