"use strict";
var InventoryItemAddonBondageBenchStrapsOptions = [
	{
		Name: "Light",
		Property: { Type: null, Difficulty: 0 },
	},
	{
		Name: "Normal",
		Property: { Type: "Normal", Difficulty: 3 },
	},
	{
		Name: "Heavy",
		Property: { Type: "Heavy", Difficulty: 6 },
	},
	{
		Name: "Full",
		Property: { Type: "Full", Difficulty: 9 },
	},
];

/**
 * Loads the item extension properties. Is called dynamically the first time a player enters this dialog
 * @returns {void} - Nothing
 */
function InventoryItemAddonBondageBenchStrapsLoad() {
	ExtendedItemLoad(InventoryItemAddonBondageBenchStrapsOptions, "BondageBenchStrapsSelectTightness");
}

/**
 * Draw the item extension screen. As this function is called periodically, don't call expensive functions from here
 * @returns {void} - Nothing
 */
function InventoryItemAddonBondageBenchStrapsDraw() {
	ExtendedItemDraw(InventoryItemAddonBondageBenchStrapsOptions, "BondageBenchStrapsPose");
}

/**
 * Handles click events for this extension. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function InventoryItemAddonBondageBenchStrapsClick() {
	ExtendedItemClick(InventoryItemAddonBondageBenchStrapsOptions);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemAddonBondageBenchStrapsPublishAction(C, Option) {
	var msg = "BondageBenchStrapsRestrain" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
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
function InventoryItemAddonBondageBenchStrapsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "BondageBenchStrapsRestrain" + Option.Name, "ItemDevices");
}

/**
 * Validation used when switching between types.
 * @returns {boolean} - Whether or not the change can occur.
 */
function InventoryItemAddonBondageBenchStrapsValidate() {
	var C = CharacterGetCurrent();
	var Allowed = true;
	if (InventoryGet(C, "Cloth") != null || InventoryGet(C, "ClothLower") != null) {
		DialogExtendedMessage = DialogFind(Player, "RemoveClothesForItem");
		Allowed = false;
	}
	return Allowed;
}