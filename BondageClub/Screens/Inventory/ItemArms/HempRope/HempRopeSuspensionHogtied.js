"use strict";
const HempRopeSuspensionHogtiedSliderId = "SuspensionHempRopeSlider";
const HempRopeSuspensionHogtiedNumberId = "SuspensionHempRopeNumber";

let HempRopeSuspensionHogtiedMaxHeight = 0;
let HempRopeSuspensionHogtiedMinHeight = 0;
let HempRopeSuspensionHogtiedPrevProperty;

/**
 * Loads the extended item's properties and initialises the page
 * @returns {void} - Nothing
 */
function InventoryItemArmsHempRopeSuspensionHogtiedLoad(C, Option) {
	if (!HempRopeSuspensionHogtiedPrevProperty) {
		// Initialise variables
		const item = DialogFocusItem;
		const property = item.Property && item.Property.Type == Option.Property.Type ? item.Property : JSON.parse(JSON.stringify(Option.Property));

		// Store the previously set properties, reverting to it by default upon exiting the screen
		HempRopeSuspensionHogtiedPrevProperty = JSON.parse(JSON.stringify(item.Property));
		HempRopeSuspensionHogtiedPrevProperty.revert = true;

		// Define the upper/lower bounds
		HempRopeSuspensionHogtiedMaxHeight = 0;
		HempRopeSuspensionHogtiedMinHeight = Pose.find(p => p.Name == "Hogtied").OverrideHeight.Height;

		// Validate the height settings
		if (typeof property.OverrideHeight !== "object") property.OverrideHeight = Option.Property;
		if (typeof property.OverrideHeight.Height !== "number") property.OverrideHeight.Height = HempRopeSuspensionHogtiedMinHeight;
		if (typeof property.OverrideHeight.HeightRatioProportion !== "number") property.OverrideHeight.HeightRatioProportion = 1;
		DialogFocusItem.Property = property;
		CharacterRefresh(C, false, false);

		// Create the controls
		const currHeight = 1 - property.OverrideHeight.HeightRatioProportion;
		const heightSlider = ElementCreateRangeInput(HempRopeSuspensionHogtiedSliderId, currHeight, 0, 1, 0.01, "player", true);
		if (heightSlider) {
			heightSlider.addEventListener("input", (e) => InventoryItemArmsHempRopeSuspensionHogtiedHeightChange(C, item, Number(e.target.value), heightSlider.id));
		}
		const heightNumber = ElementCreateInput(HempRopeSuspensionHogtiedNumberId, "number", Math.round(currHeight * 100), "");
		if (heightNumber) {
			heightNumber.setAttribute("min", "0");
			heightNumber.setAttribute("max", "100");
			heightNumber.addEventListener("change", (e) => InventoryItemArmsHempRopeSuspensionHogtiedHeightChange(C, item, Number(e.target.value) / 100, heightNumber.id));
		}
	}
}

/**
 * Update the character's vertical position on changing the slider or number input, throttling to limit the refreshes
 * @param {Character} C - The character being modified
 * @param {Item} item - The item being modified
 * @param {number} height - The new height to set for the character
 * @param {string} fromElementId - The control that triggered the change
 * @returns {void} - Nothing
 */
const InventoryItemArmsHempRopeSuspensionHogtiedHeightChange = CommonLimitFunction((C, item, height, fromElementId) => {
	// Validate the value
	if (isNaN(height) || height < 0 || height > 1) return;

	// Round to the nearest 0.01
	height = Math.round(height * 100) / 100;

	// Update other control values
	if (fromElementId !== HempRopeSuspensionHogtiedSliderId) {
		ElementValue(HempRopeSuspensionHogtiedSliderId, height);
	}
	if (fromElementId !== HempRopeSuspensionHogtiedNumberId) {
		ElementValue(HempRopeSuspensionHogtiedNumberId, Math.round(height * 100));
	}

	// Update the item properties
	item.Property.OverrideHeight.HeightRatioProportion = 1 - height;
	item.Property.OverrideHeight.Height = Math.round(HempRopeSuspensionHogtiedMaxHeight - (1 - height) * (HempRopeSuspensionHogtiedMaxHeight - HempRopeSuspensionHogtiedMinHeight));

	// Reload to see the change
	CharacterLoadCanvas(C);
});

/**
 * Handles drawing the extended item's screen
 * @returns {void} - Nothing
 */
function InventoryItemArmsHempRopeSuspensionHogtiedDraw() {
	// Draw controls
	DrawAssetPreview(1387, 55, DialogFocusItem.Asset);
	DrawText(DialogFindPlayer("ItemArmsSuspensionHempRopeSelect"), 1500, 375, "white", "gray");

	ElementPosition(HempRopeSuspensionHogtiedSliderId, 1140, 500, 100, 800);

	DrawTextFit(DialogFindPlayer("ItemArmsSuspensionHempRopePercent"), 1405, 555, 250, "white", "gray");
	ElementPosition(HempRopeSuspensionHogtiedNumberId, 1640, 550, 125);

	DrawButton(1350, 700, 300, 64, DialogFind(Player, "ItemArmsSuspensionHempRopeConfirm"), "White", "");
}

/**
 * Handles clicks on the extended item's screen
 * @param {Character} C - The character wearing the item
 * @param {ExtendedItemOption[]} Options - An Array of type definitions for each allowed extended type
 * @returns {void} - Nothing
 */
function InventoryItemArmsHempRopeSuspensionHogtiedClick(C, Options) {
	// Exit the screen
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemArmsHempRopeSuspensionHogtiedExit();
	}

	// Confirm button
	if (MouseIn(1350, 700, 300, 64)) {
		HempRopeSuspensionHogtiedPrevProperty.revert = false;
		let Option = Object.assign({}, Options.find(o => o.Property.Type == DialogFocusItem.Property.Type));
		Option.Property = DialogFocusItem.Property;
		ExtendedItemSetType(C, Options, Option);
	}
}

/**
 * Exit handler for the item's extended item screen. Updates the character and removes UI components.
 * @returns {void} - Nothing
 */
function InventoryItemArmsHempRopeSuspensionHogtiedExit() {
	// Revert the changes
	if (HempRopeSuspensionHogtiedPrevProperty && HempRopeSuspensionHogtiedPrevProperty.revert) {
		const C = CharacterGetCurrent();
		DialogFocusItem.Property = HempRopeSuspensionHogtiedPrevProperty;
		CharacterRefresh(C, false, false);
	}

	// Cleanup
	HempRopeSuspensionHogtiedPrevProperty = null;
	ElementRemove(HempRopeSuspensionHogtiedSliderId);
	ElementRemove(HempRopeSuspensionHogtiedNumberId);
	ExtendedItemSubscreen = null;
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemArmsHempRopeSuspensionHogtiedPublishAction(C, Option) {
	const newHeight = Option.Property.OverrideHeight.Height;
	const prevHeight = HempRopeSuspensionHogtiedPrevProperty
		&& HempRopeSuspensionHogtiedPrevProperty.Type == Option.Property.Type
		? HempRopeSuspensionHogtiedPrevProperty.OverrideHeight.Height : null;
	const msgType = prevHeight !== null ? prevHeight < newHeight ? "Raise" : "Lower" : "";

	const msg = "ItemArmsSuspensionHempRopeChange" + msgType;
	const Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * The NPC dialog is for what the NPC says to you when you make a change to their restraints
 * @param {Character} C - The NPC to whom the restraint is applied
 * @param {Option} Option - The chosen option for this extended item
 * @returns {void} - Nothing
 */
function InventoryItemArmsHempRopeSuspensionHogtiedNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "RopeBondage" + Option.Name, "ItemArms");
}
