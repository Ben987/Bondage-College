"use strict";
/**
 * Utility file for handling extended items
 */

/**
 * @typedef {Object} ExtendedItemOption
 * @description Defines a single extended item option
 * @property {string} Name - The name of the type - used for the preview icon and the translation key in the CSV
 * @property {number} [BondageLevel] - The required bondage skill level for this type (optional)
 * @property {number} [SelfBondageLevel] - The required self-bondage skill level for this type when using it on
 * yourself (optional)
 * @property {Property} Property - The Property object to be applied when this option is used
 */

/**
 * A lookup for the current pagination offset for all extended item options. Offsets are only recorded if the extended
 * item requires pagination. Example format:
 * ```json
 * {
 *     "ItemArms/HempRope": 4,
 *     "ItemArms/Web": 0
 * }
 * ```
 * @type {Object.<string, number>}
 * @constant
 */
var ExtendedItemOffsets = {};

/** The X & Y co-ordinates of each option's button, based on the number to be displayed per page. */
const ExtendedXY = [
	[], //0 placeholder
	[[1385, 500]], //1 option per page
	[[1185, 500], [1590, 500]], //2 options per page
	[[1080, 500], [1385, 500], [1695, 500]], //3 options per page
	[[1185, 400], [1590, 400], [1185, 700], [1590, 700]], //4 options per page
	[[1080, 400], [1385, 400], [1695, 400], [1185, 700], [1590, 700]], //5 options per page
	[[1080, 400], [1385, 400], [1695, 400], [1080, 700], [1385, 700], [1695, 700]], //6 options per page
	[[1020, 400], [1265, 400], [1510, 400], [1755, 400], [1080, 700], [1385, 700], [1695, 700]], //7 options per page
	[[1020, 400], [1265, 400], [1510, 400], [1755, 400], [1020, 700], [1265, 700], [1510, 700], [1755, 700]], //8 options per page
];

/** The X & Y co-ordinates of each option's button, based on the number to be displayed per page. */
const ExtendedXYWithoutImages = [
	[], //0 placeholder
	[[1400, 450]], //1 option per page
	[[1175, 450], [1425, 450]], //2 options per page
	[[1175, 450], [1425, 450], [1675, 450]], //3 options per page
	[[1175, 450], [1425, 450], [1175, 525], [1425, 525]], //4 options per page
	[[1175, 450], [1425, 450], [1675, 450], [1175, 525], [1425, 525]], //5 options per page
	[[1175, 450], [1425, 450], [1675, 450], [1175, 525], [1425, 525], [1675, 525]], //6 options per page
	[[1050, 450], [1200, 450], [1450, 450], [1700, 450], [1050, 525], [1200, 525], [1425, 525]], //7 options per page
	[[1050, 450], [1200, 450], [1450, 450], [1700, 450], [1050, 525], [1200, 525], [1425, 525], [1675, 525]], //8 options per page
];

/** The X & Y co-ordinates of each option's button, based on the number to be displayed per page. */
const ExtendedXYClothes = [
	[], //0 placeholder
	[[1385, 450]], //1 option per page
	[[1220, 450], [1550, 450]], //2 options per page
	[[1140, 450], [1385, 450], [1630, 450]], //3 options per page
	[[1220, 400], [1550, 400], [1220, 700], [1550, 700]], //4 options per page
	[[1140, 400], [1385, 400], [1630, 400], [1220, 700], [1550, 700]], //5 options per page
	[[1140, 400], [1385, 400], [1630, 400], [1140, 700], [1385, 700], [1630, 700]], //6 options per page
];

/** Memoization of the requirements check
 * @type {function}
*/
const ExtendedItemRequirementCheckMessageMemo = CommonMemoize(ExtendedItemRequirementCheckMessage);

/**
 * The current display mode
 * @type {boolean}
 */
var ExtendedItemPermissionMode = false;

/**
 * Loads the item extension properties
 * @param {ExtendedItemOption[]} Options - An Array of type definitions for each allowed extended type. The first item
 *     in the array should be the default option.
 * @param {string} DialogKey - The dialog key for the message to display prompting the player to select an extended
 *     type
 * @returns {void} Nothing
 */
function ExtendedItemLoad(Options, DialogKey) {
	if (!DialogFocusItem.Property) {
		// Default to the first option if no property is set
		DialogFocusItem.Property = JSON.parse(JSON.stringify(Options[0].Property));
		// If the default type is not the null type, update the item to use this type
		if (Options[0].Property.Type != null) {
			var C = CharacterGetCurrent() || CharacterAppearanceSelection;
			// If the first option is blocked by the character, switch to the null type option
			if (InventoryBlockedOrLimited(C, DialogFocusItem, Options[0].Property.Type)) {
				let BaseOption = Options.find(O => O.Property.Type == null);
				if (BaseOption != null) DialogFocusItem.Property = JSON.parse(JSON.stringify(BaseOption));
			}
			CharacterRefresh(C);
			ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
		}
	}

	if (ExtendedItemOffsets[ExtendedItemOffsetKey()] == null) ExtendedItemSetOffset(0);

	DialogExtendedMessage = DialogFindPlayer(DialogKey);
}

/**
 * Draws the extended item type selection screen
 * @param {ExtendedItemOption[]} Options - An Array of type definitions for each allowed extended type. The first item
 *     in the array should be the default option.
 * @param {string} DialogPrefix - The prefix to the dialog keys for the display strings describing each extended type.
 *     The full dialog key will be <Prefix><Option.Name>
 * @param {number} OptionsPerPage - The number of options displayed on each page
 * @param {boolean} [ShowImages=true] - Denotes wether images should be shown for the specific item
 * @returns {void} Nothing
 */
function ExtendedItemDraw(Options, DialogPrefix, OptionsPerPage, ShowImages = true) {
	const C = CharacterGetCurrent() || CharacterAppearanceSelection;
	const IsSelfBondage = C.ID === 0;
	const Asset = DialogFocusItem.Asset;
	const ItemOptionsOffset = ExtendedItemGetOffset();
	const XYPositions = !Asset.Group.Clothing ? (ShowImages ? ExtendedXY : ExtendedXYWithoutImages) : ExtendedXYClothes;
	const ImageHeight = ShowImages ? 220 : 0;
	OptionsPerPage = OptionsPerPage || Math.min(Options.length, XYPositions.length - 1);

	// If we have to paginate, draw the back/next button
	if (Options.length > OptionsPerPage) {
		const currPage = Math.ceil(ExtendedItemGetOffset() / OptionsPerPage) + 1;
		const totalPages = Math.ceil(Options.length / OptionsPerPage);
		DrawBackNextButton(1675, 240, 300, 90, DialogFindPlayer("Page") + " " + currPage.toString() + " / " + totalPages.toString(), "White", "", () => "", () => "");
	}

	// Draw the header and item
	DrawAssetPreview(1387, 55, Asset);
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");

	// Draw the possible variants and their requirements, arranged based on the number per page
	for (let I = ItemOptionsOffset; I < Options.length && I < ItemOptionsOffset + OptionsPerPage; I++) {
		var PageOffset = I - ItemOptionsOffset;
		var X = XYPositions[OptionsPerPage][PageOffset][0];
		var Y = XYPositions[OptionsPerPage][PageOffset][1];

		var Option = Options[I];
		var Hover = MouseIn(X, Y, 225, 55 + ImageHeight) && !CommonIsMobile;
		var FailSkillCheck = !!ExtendedItemRequirementCheckMessageMemo(Option, IsSelfBondage);
		var IsSelected = DialogFocusItem.Property.Type == Option.Property.Type;
		var BlockedOrLimited = InventoryBlockedOrLimited(C, DialogFocusItem, Option.Property.Type);
		var PlayerBlocked = InventoryIsPermissionBlocked(Player, DialogFocusItem.Asset.DynamicName(Player), DialogFocusItem.Asset.DynamicGroupName, Option.Property.Type);
		var PlayerLimited = InventoryIsPermissionLimited(Player, DialogFocusItem.Asset.Name, DialogFocusItem.Asset.Group.Name, Option.Property.Type);
		var Color = ExtendedItemPermissionMode ? ((C.ID == 0 && IsSelected) || Option.Property.Type == null ? "#888888" : PlayerBlocked ? Hover ? "red" : "pink" : PlayerLimited ? Hover ? "orange" : "#fed8b1" : Hover ? "green" : "lime") : (IsSelected ? "#888888" : BlockedOrLimited ? "Red" : FailSkillCheck ? "Pink" : Hover ? "Cyan" : "White");

		DrawButton(X, Y, 225, 55 + ImageHeight, "", Color, null, null, IsSelected);
		if (ShowImages) DrawImage(`${AssetGetInventoryPath(Asset)}/${Option.Name}.png`, X + 2, Y);
		DrawTextFit(DialogFindPlayer(DialogPrefix + Option.Name), X + 112, Y + 30 + ImageHeight, 225, "black");
		if (ControllerActive == true) {
			setButton(X + 112, Y + 30 + ImageHeight);
		}
	}

	// Permission mode toggle is always available
	DrawButton(1775, 25, 90, 90, "", "White", ExtendedItemPermissionMode ? "Icons/DialogNormalMode.png" : "Icons/DialogPermissionMode.png", DialogFindPlayer(ExtendedItemPermissionMode ? "DialogNormalMode" : "DialogPermissionMode"));
}

/**
 * Handles clicks on the extended item type selection screen
 * @param {ExtendedItemOption[]} Options - An Array of type definitions for each allowed extended type. The first item
 *     in the array should be the default option.
 * @param {number} OptionsPerPage - The number of options displayed on each page
 * @param {boolean} [ShowImages=true] - Denotes wether images are shown for the specific item
 * @returns {void} Nothing
 */
function ExtendedItemClick(Options, OptionsPerPage, ShowImages = true) {
	const C = CharacterGetCurrent() || CharacterAppearanceSelection;
	const IsSelfBondage = C.ID === 0;
	const ItemOptionsOffset = ExtendedItemGetOffset();
	const IsCloth = DialogFocusItem.Asset.Group.Clothing;
	const XYPositions = !IsCloth ? ShowImages ? ExtendedXY : ExtendedXYWithoutImages : ExtendedXYClothes;
	const ImageHeight = ShowImages ? 220 : 0;
	OptionsPerPage = OptionsPerPage || Math.min(Options.length, XYPositions.length - 1);

	// Exit button
	if (MouseIn(1885, 25, 90, 90)) {
		DialogFocusItem = null;
		if (ExtendedItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
		ExtendedItemPermissionMode = false;
		ExtendedItemExit();
		return;
	}

	// Permission toggle button
	if (MouseIn(1775, 25, 90, 90)) {
		if (ExtendedItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
		ExtendedItemPermissionMode = !ExtendedItemPermissionMode;
	}

	// Pagination buttons
	if (MouseIn(1675, 240, 150, 90) && Options.length > OptionsPerPage) {
		if (ItemOptionsOffset - OptionsPerPage < 0) ExtendedItemSetOffset(OptionsPerPage * (Math.ceil(Options.length / OptionsPerPage) - 1));
		else ExtendedItemSetOffset(ItemOptionsOffset - OptionsPerPage);
	}
	else if (MouseIn(1825, 240, 150, 90) && Options.length > OptionsPerPage) {
		if (ItemOptionsOffset + OptionsPerPage >= Options.length) ExtendedItemSetOffset(0);
		else ExtendedItemSetOffset(ItemOptionsOffset + OptionsPerPage);
	}

	// Options
	for (let I = ItemOptionsOffset; I < Options.length && I < ItemOptionsOffset + OptionsPerPage; I++) {
		var PageOffset = I - ItemOptionsOffset;
		var X = XYPositions[OptionsPerPage][PageOffset][0];
		var Y = XYPositions[OptionsPerPage][PageOffset][1];
		var Option = Options[I];
		if (MouseIn(X, Y, 225, 55 + ImageHeight)) {
			ExtendedItemHandleOptionClick(C, Options, Option, IsSelfBondage);
		}
	}
}

/**
 * Exit function for the extended item dialog.
 * Mainly removes the cache from memory
 * @returns {void} - Nothing
 */
function ExtendedItemExit() {
	// invalidate the cache
	ExtendedItemRequirementCheckMessageMemo.clearCache();
}


/**
 * Handler function for setting the type of an extended item
 * @param {Character} C - The character wearing the item
 * @param {ExtendedItemOption[]} Options - An Array of type definitions for each allowed extended type. The first item
 *     in the array should be the default option.
 * @param {ExtendedItemOption} Option - The selected type definition
 * @returns {void} Nothing
 */
function ExtendedItemSetType(C, Options, Option) {
	DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
	var FunctionPrefix = ExtendedItemFunctionPrefix();

	if (CurrentScreen == "ChatRoom") {
		// Call the item's load function
		CommonCallFunctionByName(FunctionPrefix + "Load");
	}
	// Default the previous Property and Type to the first option if not found on the current item
	var PreviousProperty = DialogFocusItem.Property || Options[0].Property;
	var PreviousType = PreviousProperty.Type || Options[0].Property.Type;
	var PreviousOption = Options.find(O => O.Property.Type === PreviousType);

	// Create a new Property object based on the previous one
	var NewProperty = Object.assign({}, PreviousProperty);
	// Delete properties added by the previous option
	Object.keys(PreviousOption.Property).forEach(key => delete NewProperty[key]);
	// Clone the new properties and use them to extend the existing properties
	Object.assign(NewProperty, JSON.parse(JSON.stringify(Option.Property)));

	// If the item is locked, ensure it has the "Lock" effect
	if (NewProperty.LockedBy && !(NewProperty.Effect || []).includes("Lock")) {
		NewProperty.Effect = (NewProperty.Effect || []);
		NewProperty.Effect.push("Lock");
	}

	DialogFocusItem.Property = NewProperty;
	const IsCloth = DialogFocusItem.Asset.Group.Clothing;
	CharacterRefresh(C, !IsCloth); // Does not sync appearance while in the wardrobe

	// For a restraint, we might publish an action or change the dialog of a NPC
	if (!IsCloth) {
		ChatRoomCharacterUpdate(C);
		if (CurrentScreen === "ChatRoom") {
			// If we're in a chatroom, call the item's publish function to publish a message to the chatroom
			CommonCallFunctionByName(FunctionPrefix + "PublishAction", C, Option, PreviousOption);
		} else {
			CommonCallFunctionByName(FunctionPrefix + "Exit");
			DialogFocusItem = null;
			if (C.ID === 0) {
				// Player is using the item on herself
				DialogMenuButtonBuild(C);
			} else {
				// Otherwise, call the item's NPC dialog function, if one exists
				CommonCallFunctionByName(FunctionPrefix + "NpcDialog", C, Option, PreviousOption);
				C.FocusGroup = null;
			}
		}
	}
}

/**
 * Handler function called when an option on the type selection screen is clicked
 * @param {Character} C - The character wearing the item
 * @param {ExtendedItemOption[]} Options - An Array of type definitions for each allowed extended type. The first item
 *     in the array should be the default option.
 * @param {ExtendedItemOption} Option - The selected type definition
 * @param {boolean} IsSelfBondage - Whether or not the player is applying the item to themselves
 * @returns {void} Nothing
 */
function ExtendedItemHandleOptionClick(C, Options, Option, IsSelfBondage) {
	if (ExtendedItemPermissionMode) {
		if (Option.Property.Type == null || (C.ID == 0 && DialogFocusItem.Property.Type == Option.Property.Type)) return;
		InventoryTogglePermission(DialogFocusItem, Option.Property.Type);
	} else {
		var BlockedOrLimited = InventoryBlockedOrLimited(C, DialogFocusItem, Option.Property.Type);
		if (DialogFocusItem.Property.Type === Option.Property.Type || BlockedOrLimited) return;

		// use the unmemoized function to ensure we make a final check to the requirements
		var RequirementMessage = ExtendedItemRequirementCheckMessage(Option, IsSelfBondage);
		if (RequirementMessage) {
			DialogExtendedMessage = RequirementMessage;
		} else {
			ExtendedItemSetType(C, Options, Option);
			ExtendedItemExit();
		}
	}
}

/**
 * Checks whether the player meets the requirements for an extended type option. This will check against their Bondage
 * skill if applying the item to another character, or their Self Bondage skill if applying the item to themselves.
 * @param {ExtendedItemOption} Option - The selected type definition
 * @param {boolean} IsSelfBondage - Whether or not the player is applying the item to themselves
 * @returns {string|null} null if the player meets the option requirements. Otherwise a string message informing them
 * of the requirements they do not meet
 */
function ExtendedItemRequirementCheckMessage(Option, IsSelfBondage) {
	var C = CharacterGetCurrent() || CharacterAppearanceSelection;
	var FunctionPrefix = ExtendedItemFunctionPrefix();

	if (IsSelfBondage) {
		let RequiredLevel = Option.SelfBondageLevel || Math.max(DialogFocusItem.Asset.SelfBondage, Option.BondageLevel);
		if (SkillGetLevelReal(Player, "SelfBondage") < RequiredLevel) {
			return DialogFindPlayer("RequireSelfBondage" + RequiredLevel);
		}
	} else {
		let RequiredLevel = Option.BondageLevel;
		if (SkillGetLevelReal(Player, "Bondage") < RequiredLevel) {
			return DialogFindPlayer("RequireBondageLevel").replace("ReqLevel", RequiredLevel);
		}
	}

	// An extendable item may provide a validation function. Returning a non-empty string from the validation function will
	// drop out of this function, and the new type will not be applied.
	if (typeof window[FunctionPrefix + "Validate"] === "function") {
		let ValidateResult = CommonCallFunctionByName(FunctionPrefix + "Validate", C, Option);
		if (ValidateResult != "") {
			return ValidateResult;
		}
	} else if (Option.Prerequisite != null && Option.SelfBlockCheck && !ExtendedItemSelfProofRequirementCheck(C, Option.Prerequisite)) {
		return DialogText;
	} else if (Option.Prerequisite != null && !Option.SelfBlockCheck && !InventoryAllow(C, Option.Prerequisite, true)) {
		// Otherwise use the standard prerequisite check
		return DialogText;
	} else {
		const OldEffect= DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.Effect;
		if (OldEffect && OldEffect.includes("Lock") && Option.Property && Option.Property.AllowLock === false) {
			DialogExtendedMessage = DialogFindPlayer("ExtendedItemUnlockBeforeChange");
			return DialogExtendedMessage;
		}
	}

	return "";
}

/**
 * Removes the item temporarily before validation in case the current type fails the prerequisite check, since it will
 * be replaced
 * @param {Character} C - The character wearing the item
 * @param {(Array|String)} Prerequisite - An array of prerequisites or a string for a single prerequisite
 * @returns {boolean} - Whether the new option passes validation
 */
function ExtendedItemSelfProofRequirementCheck(C, Prerequisite) {
	let Allowed = true;

	// Remove the item temporarily for prerequisite-checking
	let CurrentItem = InventoryGet(C, C.FocusGroup.Name);
	InventoryRemove(C, C.FocusGroup.Name, false);
	CharacterRefresh(C, false, false);

	if (!InventoryAllow(C, Prerequisite, true)) {
		Allowed = false;
	}

	// Re-add the item
	let DifficultyFactor = CurrentItem.Difficulty - CurrentItem.Asset.Difficulty;
	CharacterAppearanceSetItem(C, C.FocusGroup.Name, CurrentItem.Asset, CurrentItem.Color, DifficultyFactor, null, false);
	InventoryGet(C, C.FocusGroup.Name).Property = CurrentItem.Property;
	CharacterRefresh(C, false, false);
	DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);

	return Allowed;
}

/**
 * Simple getter for the function prefix used for the currently focused extended item - used for calling standard
 * extended item functions (e.g. if the currently focused it is the hemp rope arm restraint, this will return
 * "InventoryItemArmsHempRope", allowing functions like InventoryItemArmsHempRopeLoad to be called)
 * @returns {string} The extended item function prefix for the currently focused item
 */
function ExtendedItemFunctionPrefix() {
	var Asset = DialogFocusItem.Asset;
	return "Inventory" + Asset.Group.Name + Asset.Name;
}

/**
 * Simple getter for the key of the currently focused extended item in the ExtendedItemOffsets lookup
 * @returns {string} The offset lookup key for the currently focused extended item
 */
function ExtendedItemOffsetKey() {
	var Asset = DialogFocusItem.Asset;
	return Asset.Group.Name + "/" + Asset.Name;
}

/**
 * Gets the pagination offset of the currently focused extended item
 * @returns {number} The pagination offset for the currently focused extended item
 */
function ExtendedItemGetOffset() {
	return ExtendedItemOffsets[ExtendedItemOffsetKey()];
}

/**
 * Sets the pagination offset for the currently focused extended item
 * @param {number} Offset - The new offset to set
 * @returns {void} Nothing
 */
function ExtendedItemSetOffset(Offset) {
	ExtendedItemOffsets[ExtendedItemOffsetKey()] = Offset;
}
