"use strict";
var InventoryItemArmsDuctTapeMessage = "SelectTapeWrapping";

const InventoryItemArmsDuctTapeOptions = [
	{
		Name: "Arms",
		Property: {Type: null, Difficulty: 1},
	},
	{
		Name: "Bottom",
		SelfBondageLevel: 4,
		Property: {
			Type: "Bottom",
			SetPose: ["BackElbowTouch"],
			Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemVulvaPiercings"],
			Difficulty: 2,
		},
	},
	{
		Name: "Top",
		Property: {
			Type: "Top",
			SetPose: ["BackElbowTouch"],
			Block: ["ItemTorso", "ItemBreast", "ItemNipples", "ItemNipplesPiercings"],
			Difficulty: 4,
		},
	},
	{
		Name: "Full",
		Property: {
			Type: "Full",
			SetPose: ["BackElbowTouch"],
			Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples", "ItemVulvaPiercings", "ItemNipplesPiercings"],
			Difficulty: 6,
		}
	},
	{
		Name: "Complete",
		Property: {
			Type: "Complete",
			SetPose: ["BackElbowTouch"],
			Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples", "ItemVulvaPiercings", "ItemNipplesPiercings"],
			Difficulty: 7,
		}
	},

];

/**
 * Loads the item extension properties. Does nothing but propagate the call to the extended items
 * @returns {void} - Nothing
 */
function InventoryItemArmsDuctTapeLoad() {
	ExtendedItemLoad(InventoryItemArmsDuctTapeOptions, InventoryItemArmsDuctTapeMessage);
}

/**
 * Draw the item extension screen. Does nothing but propagate the call to the extended items
 * @returns {void} - Nothing
 */
function InventoryItemArmsDuctTapeDraw() {
	ExtendedItemDraw(InventoryItemArmsDuctTapeOptions, "DuctTapePose");
}

/**
 * Catches the item extension clicks. Does nothing but propagate the call to the extended items
 * @returns {void} - Nothing
 */
function InventoryItemArmsDuctTapeClick() {
	ExtendedItemClick(InventoryItemArmsDuctTapeOptions);
}

/**
 * Publishes the action to the chat room
 * @param {Character} C - The character who get restrained
 * @param {Option} Option - The extended item option
 * @param {string} Option.Name - The name of the option. Used for finding the right dialog entry
 * @param {Option} PreviousOption - The extended item option that was previously used. Not used in this item
 * @returns {void} - Nothing
 */
function InventoryItemArmsDuctTapePublishAction(C, Option, PreviousOption) {
	var msg = "DuctTapeRestrain" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
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
function InventoryItemArmsDuctTapeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsDuctTape" + Option.Name, "ItemArms");
}

/**
 * Validate function that checks, if the restrained character wears outer clothes. If so, the duct tape cannot be applied
 * @param {Character} C - The character wearing the item
 * @param {Option} Option - The option to be applied on the character. Not used in this item
 * @returns {boolean} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemArmsDuctTapeValidate(C, Option) {
	var Allowed = true;

	if (InventoryGet(C, "Cloth") || InventoryGet(C, "ClothLower")) {
		DialogExtendedMessage = DialogFind(Player, "RemoveClothesForItem", "ItemArms");
		Allowed = false;
	}
	return Allowed;
}