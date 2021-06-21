"use strict";

var InventoryItemNipplesNippleSuctionCupsOptions = [
	{
		Name: "Loose",
		Property: {
			Type: null,
			SuctionLevel: 0,
		},
	},
	{
		Name: "Light",
		Property: {
			Type: "Light",
			SuctionLevel: 1,
		},
	},
	{
		Name: "Medium",
		Property: {
			Type: "Medium",
			SuctionLevel: 2,
		},
	},
	{
		Name: "Heavy",
		Property: {
			Type: "Heavy",
			SuctionLevel: 3,
		},
	},
	{
		Name: "Maximum",
		Property: {
			Type: "Maximum",
			SuctionLevel: 4,
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemNipplesNippleSuctionCupsLoad() {
	ExtendedItemLoad(InventoryItemNipplesNippleSuctionCupsOptions, "SelectSuctionLevel");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemNipplesNippleSuctionCupsDraw() {
	ExtendedItemDraw(
		InventoryItemNipplesNippleSuctionCupsOptions, "SuctionLevel",
		InventoryItemNipplesNippleSuctionCupsOptions.length, false,
	);
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemNipplesNippleSuctionCupsClick() {
	ExtendedItemClick(
		InventoryItemNipplesNippleSuctionCupsOptions, InventoryItemNipplesNippleSuctionCupsOptions.length, false);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemNipplesNippleSuctionCupsPublishAction(C, Option, PreviousOption) {
	var NewIndex = InventoryItemNipplesNippleSuctionCupsOptions.indexOf(Option);
	var PreviousIndex = InventoryItemNipplesNippleSuctionCupsOptions.indexOf(PreviousOption);
	var msg = "NipSuc" + ((NewIndex > PreviousIndex) ? "tightens" : "loosens") + "To" + Option.Property.SuctionLevel.toString();
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * The NPC dialog is for what the NPC says to you when you make a change to their restraints - the dialog lookup is on
 * a per-NPC basis. You basically put the "AssetName" + OptionName in there to allow individual NPCs to override their
 * default "GroupName" dialog if for example we ever wanted an NPC to react specifically to having the restraint put on
 * them. That could be done by adding an "AssetName" entry (or entries) to that NPC's dialog CSV
 * @param {Character} C - The NPC to whom the restraint is applied
 * @param {Option} Option - The chosen option for this extended item
 * @returns {void} - Nothing
 */
function InventoryItemNipplesNippleSuctionCupsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "InventoryItemNipplesNippleSuctionCupsNPCReaction" + Option.Name, "ItemNipples");
}
