"use strict";

var InventoryItemButtButtPumpOptions = [
	{
		Name: "Empty",
		Property: {
			Type: null,
			InflateLevel: "0",
		},
	},
	{
		Name: "Light",
		Property: {
			Type: "Light",
			InflateLevel: "1",
		},
	},
	{
		Name: "Inflated",
		Property: {
			Type: "Inflated",
			InflateLevel: "2",
		},
	},
	{
		Name: "Bloated",
		Property: {
			Type: "Bloated",
			InflateLevel: "3",
		},
	},
	{
		Name: "Maximum",
		Property: {
			Type: "Maximum",
			InflateLevel: "4",
		},
	},
]

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemButtButtPumpLoad() {
	ExtendedItemLoad(InventoryItemButtButtPumpOptions, "SelectInflateLevel");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemButtButtPumpDraw() {
	ExtendedItemDraw(InventoryItemButtButtPumpOptions, "InflateLevel", InventoryItemButtButtPumpOptions.length, false);
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemButtButtPumpClick() {
	ExtendedItemClick(InventoryItemButtButtPumpOptions, false, InventoryItemButtButtPumpOptions.length, false);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemButtButtPumpPublishAction(C, Option, PreviousOption) {
	var NewIndex = InventoryItemButtButtPumpOptions.indexOf(Option);
	var PreviousIndex = InventoryItemButtButtPumpOptions.indexOf(PreviousOption);
	var msg = "BPumps" + ((NewIndex > PreviousIndex) ? "pumps" : "deflates") + "To" + Option.Property.InflateLevel;
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
function InventoryItemButtButtPumpNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "InventoryItemButtButtPumpNPCReaction" + Option.Name, "ItemButt");
}

