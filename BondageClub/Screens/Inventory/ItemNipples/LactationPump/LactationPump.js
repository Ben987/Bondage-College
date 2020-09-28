"use strict";

var InventoryItemNipplesLactationPumpOptions = [
	{
		Name: "Off",
		Property: {
			Type: null,
			SuctionLevel: "0",
		},
	},
	{
		Name: "LowSuction",
		Property: {
			Type: "LowSuction",
			SuctionLevel: "1",
		},
	},
	{
		Name: "MediumSuction",
		Property: {
			Type: "MediumSuction",
			SuctionLevel: "2",
		},
	},
	{
		Name: "HighSuction",
		Property: {
			Type: "HighSuction",
			SuctionLevel: "3",
		},
	},
	{
		Name: "MaximumSuction",
		Property: {
			Type: "MaximumSuction",
			SuctionLevel: "4",
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemNipplesLactationPumpLoad() {
	ExtendedItemLoad(InventoryItemNipplesLactationPumpOptions, "LactationPumpSelectSetting");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemNipplesLactationPumpDraw() {
	ExtendedItemDraw(InventoryItemNipplesLactationPumpOptions, "LactationPump", InventoryItemNipplesLactationPumpOptions.length, false);
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemNipplesLactationPumpClick() {
	ExtendedItemClick(InventoryItemNipplesLactationPumpOptions, false, InventoryItemNipplesLactationPumpOptions.length, false);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemNipplesLactationPumpPublishAction(C, Option, PreviousOption) {
	var NewIndex = InventoryItemNipplesLactationPumpOptions.indexOf(Option);
	var PreviousIndex = InventoryItemNipplesLactationPumpOptions.indexOf(PreviousOption);
	var msg = "LactationPumpPower" + ((NewIndex > PreviousIndex) ? "tightens" : "loosens") + "To" + Option.Property.SuctionLevel;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
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
function InventoryItemNipplesLactationPumpNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "InventoryItemNipplesLactationPumpNPCReaction" + Option.Name, "ItemNipples");
}

