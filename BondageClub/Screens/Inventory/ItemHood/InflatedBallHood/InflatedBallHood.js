"use strict";

var InventoryItemHoodInflatedBallHoodOptions = [
	{
		Name: "Empty",
		Property: {
			Type: null,
			Difficulty: 0,
			InflateLevel: 0,
			Effect: [],
		},
	},
	{
		Name: "Light",
		Property: {
			Type: "Light",
			Difficulty: 2,
			InflateLevel: 1,
			Effect: ["GagLight", "BlockMouth"],
		},
	},
	{
		Name: "Inflated",
		Property: {
			Type: "Inflated",
			Difficulty: 4,
			InflateLevel: 2,
			Effect: ["GagEasy", "BlockMouth"],
		},
	},
	{
		Name: "Bloated",
		Property: {
			Type: "Bloated",
			Difficulty: 6,
			InflateLevel: 3,
			Effect: ["GagMedium", "BlockMouth"],
		},
	},
	{
		Name: "Maximum",
		Property: {
			Type: "Maximum",
			Difficulty: 8,
			InflateLevel: 4,
			Effect: ["GagVeryHeavy", "BlockMouth"],
		},
	},
];

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemHoodInflatedBallHoodLoad() {
	ExtendedItemLoad(InventoryItemHoodInflatedBallHoodOptions, "SelectInflateLevel");
}

/**
 * Draw the item extension screen
 * @returns {void} - Nothing
 */
function InventoryItemHoodInflatedBallHoodDraw() {
	ExtendedItemDraw(
		InventoryItemHoodInflatedBallHoodOptions, "InflateLevel", InventoryItemHoodInflatedBallHoodOptions.length,
		false,
	);
}

/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemHoodInflatedBallHoodClick() {
	ExtendedItemClick(InventoryItemHoodInflatedBallHoodOptions, InventoryItemHoodInflatedBallHoodOptions.length, false);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @param {Option} PreviousOption - The previously selected Option
 * @returns {void} - Nothing
 */
function InventoryItemHoodInflatedBallHoodPublishAction(C, Option, PreviousOption) {
	var NewIndex = InventoryItemHoodInflatedBallHoodOptions.indexOf(Option);
	var PreviousIndex = InventoryItemHoodInflatedBallHoodOptions.indexOf(PreviousOption);
	var msg = "InflatedHood" + ((NewIndex > PreviousIndex) ? "pumps" : "deflates") + "To" + Option.Property.InflateLevel.toString();
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * The NPC dialog is for what the NPC says to you when you make a change to their restraints - the dialog lookup is on
 * a  per-NPC basis. You basically put the "AssetName" + OptionName in there to allow individual NPCs to override their
 * default "GroupName" dialog if for example we ever wanted an NPC to react specifically to having the restraint put on
 * them. That could be done by adding an "AssetName" entry (or entries) to that NPC's dialog CSV
 * @param {Character} C - The NPC to whom the restraint is applied
 * @param {Option} Option - The chosen option for this extended item
 * @returns {void} - Nothing
 */
function InventoryItemHoodInflatedBallHoodNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "InventoryItemHoodInflatedBallHoodNPCReaction" + Option.Name, "ItemHood");
}
