"use strict";

/**
 * TypedItem.js
 * ------------
 * This file contains utilities related to typed extended items (items that allow switching between a selection of
 * different states). It is generally not necessary to call functions in this file directly - these are called from
 * Asset.js when an item is first registered.
 *
 * All dialogue for typed items should be added to `Dialog_Player.csv`. To implement a typed item, you need the
 * following dialogue entries (these dialogue keys can also be configured through the item's configuration if custom
 * dialogue keys are needed):
 *  * "<GroupName><AssetName>Select" - This is the text that will be displayed at the top of the extended item screen
 *    (usually a prompt for the player to select a type)
 *  * For each type:
 *    * "<GroupName><AssetName><TypeName>" - This is the display name for the given type
 *  * If the item's chat setting is configured to `TO_ONLY`, you will need a chatroom message for each type, which will
 *    be sent when that type is selected. It should have the format "<GroupName><AssetName>Set<TypeName>" (e.g.
 *    "ItemArmsLatexBoxtieLeotardSetPolished" - "SourceCharacter polishes the latex of DestinationCharacter leotard
 *    until it's shiny")
 *  * If the item's chat setting is configured to `FROM_TO`, you will need a chatroom message for each possible type
 *    pairing, which will be sent when the item's type changes from the first type to the second type. It should have
 *    the format "<GroupName><AssetName>Set<Type1>To<Type2>".
 */

/**
 * A lookup for the typed item configurations for each registered typed item
 * @const
 * @type {Record<string, TypedItemData>}
 * @see {@link TypedItemData}
 */
const TypedItemDataLookup = {};

/**
 * An enum encapsulating the possible chatroom message settings for typed items
 * - TO_ONLY - The item has one chatroom message per type (indicating that the type has been selected)
 * - FROM_TO - The item has a chatroom message for from/to type pairing
 * @type {{TO_ONLY: string, FROM_TO: string}}
 * @enum {string}
 */
const TypedItemChatSetting = {
	TO_ONLY: "toOnly",
	FROM_TO: "fromTo",
};

/**
 * Registers a typed extended item. This automatically creates the item's load, draw and click functions. It will also
 * generate the asset's AllowType array.
 * @param {Asset} asset - The asset being registered
 * @param {TypedItemConfig} config - The item's typed item configuration
 * @returns {void} - Nothing
 */
function TypedItemRegister(asset, config) {
	const data = TypedItemCreateTypedItemData(asset, config);
	TypedItemCreateLoadFunction(data);
	TypedItemCreateDrawFunction(data);
	TypedItemCreateClickFunction(data);
	TypedItemCreateValidateFunction(data);
	TypedItemCreatePublishFunction(data);
	TypedItemCreateNpcDialogFunction(data);
	TypedItemGenerateAllowType(data);
	TypedItemGenerateAllowEffect(data);
	TypedItemGenerateAllowBlock(data);
}

/**
 * Generates an asset's typed item data
 * @param {Asset} asset - The asset to generate modular item data for
 * @param {TypedItemConfig} config - The item's extended item configuration
 * @returns {TypedItemData} - The generated typed item data for the asset
 */
function TypedItemCreateTypedItemData(asset,
	{ Options, Dialog, ChatTags, ChatSetting, DrawImages, ChangeWhenLocked, Validate }
) {
	Dialog = Dialog || {};
	const key = `${asset.Group.Name}${asset.Name}`;
	return TypedItemDataLookup[key] = {
		asset,
		options: Options,
		key,
		functionPrefix: `Inventory${key}`,
		dialog: {
			load: Dialog.Load || `${key}Select`,
			typePrefix: Dialog.TypePrefix || key,
			chatPrefix: Dialog.ChatPrefix || `${key}Set`,
			npcPrefix: Dialog.NpcPrefix || key,
		},
		chatTags: Array.isArray(ChatTags) ? ChatTags : [
			CommonChatTags.SOURCE_CHAR,
			CommonChatTags.DEST_CHAR,
		],
		chatSetting: ChatSetting || TypedItemChatSetting.TO_ONLY,
		drawImages: typeof DrawImages === "boolean" ? DrawImages : true,
		changeWhenLocked: typeof ChangeWhenLocked === "boolean" ? ChangeWhenLocked : true,
		validate: Validate,
	};
}

/**
 * Creates an asset's extended item load function
 * @param {TypedItemData} data - The typed item data for the asset
 * @returns {void} - Nothing
 */
function TypedItemCreateLoadFunction({ options, functionPrefix, dialog }) {
	const loadFunctionName = `${functionPrefix}Load`;
	window[loadFunctionName] = function () {
		ExtendedItemLoad(options, dialog.load);
	};
}

/**
 * Creates an asset's extended item draw function
 * @param {TypedItemData} data - The typed item data for the asset
 * @returns {void} - Nothing
 */
function TypedItemCreateDrawFunction({ options, functionPrefix, dialog, drawImages }) {
	const drawFunctionName = `${functionPrefix}Draw`;
	window[drawFunctionName] = function () {
		ExtendedItemDraw(options, dialog.typePrefix, null, drawImages);
	};
}

/**
 * Creates an asset's extended item click function
 * @param {TypedItemData} data - The typed item data for the asset
 * @returns {void} - Nothing
 */
function TypedItemCreateClickFunction({ options, functionPrefix, drawImages }) {
	const clickFunctionName = `${functionPrefix}Click`;
	window[clickFunctionName] = function () {
		ExtendedItemClick(options, null, drawImages);
	};
}

/**
 *
 * @param {TypedItemData} data - The typed item data for the asset
 */
function TypedItemCreateValidateFunction({ changeWhenLocked, options, functionPrefix, validate }) {
	const validateFunctionName = `${functionPrefix}Validate`;
	window[validateFunctionName] = function (C, item, option, currentOption) {
		let message = "";

		if (typeof validate === "function") {
			message = validate(C, item, option, currentOption);
		}

		const itemLocked = item && item.Property && item.Property.LockedBy;
		if (!message && !changeWhenLocked && itemLocked && !DialogCanUnlock(C, item)) {
			message = DialogFindPlayer("CantChangeWhileLocked");
		}

		return message;
	};
}

/**
 * Creates an asset's extended item chatroom message publishing function
 * @param {TypedItemData} data - The typed item data for the asset
 * @returns {void} - Nothing
 */
function TypedItemCreatePublishFunction(data) {
	const { options, functionPrefix, dialog, chatSetting } = data;
	const publishFunctionName = `${functionPrefix}PublishAction`;
	window[publishFunctionName] = function (C, newOption, previousOption) {
		let msg = dialog.chatPrefix;
		if (typeof msg === "function") {
			const previousIndex = options.indexOf(previousOption);
			const newIndex = options.indexOf(newOption);
			msg = msg({ C, previousOption, newOption, previousIndex, newIndex });
		}
		if (chatSetting === TypedItemChatSetting.FROM_TO) msg += `${previousOption.Name}To`;
		msg += newOption.Name;
		const dictionary = TypedItemBuildChatMessageDictionary(C, data);
		ChatRoomPublishCustomAction(msg, true, dictionary);
	};
}

/**
 * Creates an asset's extended item NPC dialog function
 * @param {TypedItemData} data - The typed item data for the asset
 * @returns {void} - Nothing
 */
function TypedItemCreateNpcDialogFunction({ asset, functionPrefix, dialog }) {
	const npcDialogFunctionName = `${functionPrefix}NpcDialog`;
	window[npcDialogFunctionName] = function (C, option) {
		C.CurrentDialog = DialogFind(C, `${dialog.npcPrefix}${option.Name}`, asset.Group.Name);
	};
}

/**
 * Generates an asset's AllowType property based on its typed item data.
 * @param {TypedItemData} data - The typed item's data
 * @returns {void} - Nothing
 */
function TypedItemGenerateAllowType({ asset, options }) {
	asset.AllowType = options
		.map((option) => option.Property.Type)
		.filter(Boolean);
}

/**
 * Generates an asset's AllowEffect property based on its typed item data.
 * @param {TypedItemData} data - The typed item's data
 * @returns {void} - Nothing
 */
function TypedItemGenerateAllowEffect({asset, options}) {
	asset.AllowEffect = Array.isArray(asset.Effect) ? asset.Effect.slice() : [];
	for (const option of options) {
		CommonArrayConcatDedupe(asset.AllowEffect, option.Property.Effect);
	}
}

/**
 * Generates an asset's AllowBlock property based on its typed item data.
 * @param {TypedItemData} data - The typed item's data
 * @returns {void} - Nothing
 */
function TypedItemGenerateAllowBlock({asset, options}) {
	asset.AllowBlock = Array.isArray(asset.Block) ? asset.Block.slice() : [];
	for (const option of options) {
		CommonArrayConcatDedupe(asset.AllowBlock, option.Property.Block);
	}
}

/**
 * Constructs the chat message dictionary for the typed item based on the items configuration data.
 * @param {Character} C - The target character
 * @param {TypedItemData} data - The typed item data for the asset
 * @returns {object[]} - The dictionary for the item based on its required chat tags
 */
function TypedItemBuildChatMessageDictionary(C, { asset, chatTags }) {
	return chatTags
		.map((tag) => TypedItemMapChatTagToDictionaryEntry(C, asset, tag))
		.filter(Boolean);
}

/**
 * Maps a chat tag to a dictionary entry for use in item chatroom messages.
 * @param {Character} C - The target character
 * @param {Asset} asset - The asset for the typed item
 * @param {CommonChatTags} tag - The tag to map to a dictionary entry
 * @returns {object} - The constructed dictionary entry for the tag
 */
function TypedItemMapChatTagToDictionaryEntry(C, asset, tag) {
	switch (tag) {
		case CommonChatTags.SOURCE_CHAR:
			return { Tag: tag, Text: Player.Name, MemberNumber: Player.MemberNumber };
		case CommonChatTags.DEST_CHAR:
		case CommonChatTags.DEST_CHAR_NAME:
		case CommonChatTags.TARGET_CHAR:
		case CommonChatTags.TARGET_CHAR_NAME:
			return { Tag: tag, Text: C.Name, MemberNumber: C.MemberNumber };
		case CommonChatTags.ASSET_NAME:
			return { Tag: tag, AssetName: asset.Name };
		default:
			return null;
	}
}

/**
 * Returns the options configuration array for a typed item
 * @param {string} groupName - The name of the asset group
 * @param {string} assetName - The name of the asset
 * @returns {ExtendedItemOption[]|null} - The options array for the item, or null if no typed item data was found
 */
function TypedItemGetOptions(groupName, assetName) {
	const data = TypedItemDataLookup[`${groupName}${assetName}`];
	return data ? data.options : null;
}

/**
 * Returns a list of typed item option names available for the given asset, or an empty array if the asset is not typed
 * @param {string} groupName - The name of the asset group
 * @param {string} assetName - The name of the asset
 * @returns {string[]} - The option names available for the asset, or an empty array if the asset is not typed or no
 * typed item data was found
 */
function TypedItemGetOptionNames(groupName, assetName) {
	const options = TypedItemGetOptions(groupName, assetName);
	return options ? options.map(option => option.Name) : [];
}

/**
 * Returns the named option configuration object for a typed item
 * @param {string} groupName - The name of the asset group
 * @param {string} assetName - The name of the asset
 * @param {string} optionName - The name of the option
 * @returns {ExtendedItemOption|null} - The named option configuration object, or null if none was found
 */
function TypedItemGetOption(groupName, assetName, optionName) {
	const options = TypedItemGetOptions(groupName, assetName);
	return options ? options.find(option => option.Name === optionName) : null;
}

/**
 * Validates a selected option. A typed item may provide a custom validation function. Returning a non-empty string from
 * the validation function indicates that the new option is not compatible with the character's current state (generally
 * due to prerequisites or other requirements).
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} item - The item whose options are being validated
 * @param {ExtendedItemOption|ModularItemOption} option - The new option
 * @param {ExtendedItemOption|ModularItemOption} previousOption - The previously applied option
 * @returns {string|undefined} - undefined or an empty string if the validation passes. Otherwise, returns a string
 * message informing the player of the requirements that are not met.
 */
function TypedItemValidateOption(C, item, option, previousOption) {
	if (InventoryBlockedOrLimited(C, item, option.Property.Type)) {
		return DialogFindPlayer("ExtendedItemNoItemPermission");
	}
	const validationFunctionName = `Inventory${item.Asset.Group.Name}${item.Asset.Name}Validate`;
	let validationMessage = CommonCallFunctionByName(validationFunctionName, C, item, option, previousOption);
	if (!validationMessage || typeof validationMessage !== "string") {
		validationMessage = ExtendedItemValidate(C, item, option, previousOption);
	}
	return validationMessage;
}

/**
 * Sets a typed item's type and properties to the option whose name matches the provided option name parameter.
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item|string} itemOrGroupName - The item whose type to set, or the group name for the item
 * @param {string} optionName - The name of the option to set
 * @param {boolean} [push] - Whether or not appearance updates should be persisted (only applies if the character is the
 * player) - defaults to false.
 * @returns {string|undefined} - undefined or an empty string if the type was set correctly. Otherwise, returns a string
 * informing the player of the requirements that are not met.
 */
function TypedItemSetOptionByName(C, itemOrGroupName, optionName, push = false) {
	const item = typeof itemOrGroupName === "string" ? InventoryGet(C, itemOrGroupName) : itemOrGroupName;

	if (!item) return;

	const assetName = item.Asset.Name;
	const groupName = item.Asset.Group.Name;
	const warningMessage = `Cannot set option for ${groupName}:${assetName} to ${optionName}`;

	if (item.Asset.Archetype !== ExtendedArchetype.TYPED) {
		const msg = `${warningMessage}: item does not use the typed archetype`;
		console.warn(msg);
		return msg;
	}

	const options = TypedItemGetOptions(groupName, assetName);
	const option = options.find(o => o.Name === optionName);

	if (!option) {
		const msg = `${warningMessage}: option "${optionName}" does not exist`;
		console.warn(msg);
		return msg;
	}

	return TypedItemSetOption(C, item, options, option);
}

/**
 * Sets a typed item's type and properties to the option provided.
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} item - The item whose type to set
 * @param {ExtendedItemOption[]} options - The typed item options for the item
 * @param {ExtendedItemOption} option - The option to set
 * @param {boolean} [push] - Whether or not appearance updates should be persisted (only applies if the character is the
 * player) - defaults to false.
 * @returns {string|undefined} - undefined or an empty string if the type was set correctly. Otherwise, returns a string
 * informing the player of the requirements that are not met.
 */
function TypedItemSetOption(C, item, options, option, push = false) {
	if (!item || !options || !option) return;

	const previousProperty = item.Property || options[0].Property;
	const previousOption = TypedItemFindPreviousOption(item, options);

	const requirementMessage = TypedItemValidateOption(C, item, option, previousOption);
	if (requirementMessage) {
		return requirementMessage;
	}

	// Create a new Property object based on the previous one
	const newProperty = Object.assign({}, previousProperty);
	// Delete properties added by the previous option
	for (const key of Object.keys(previousOption.Property)) {
		delete newProperty[key];
	}
	// Clone the new properties and use them to extend the existing properties
	Object.assign(newProperty, JSON.parse(JSON.stringify(option.Property)));

	// If the item is locked, ensure it has the "Lock" effect
	if (newProperty.LockedBy && !(newProperty.Effect || []).includes("Lock")) {
		newProperty.Effect = (newProperty.Effect || []);
		newProperty.Effect.push("Lock");
	}

	item.Property = newProperty;
	CharacterRefresh(C, push);
}

/**
 * Finds the currently set option on the given typed item
 * @param {Item} item - The equipped item
 * @param {ExtendedItemOption[]} options - The list of available options for the item
 * @returns {ExtendedItemOption} - The option which is currently applied to the item, or the first item in the options
 * array if no type is set.
 */
function TypedItemFindPreviousOption(item, options) {
	const previousProperty = item.Property || options[0].Property;
	const previousType = previousProperty.Type;
	return options.find(o => o.Property.Type === previousType) || options[0];
}

/**
 * Sets a typed item's type to a random option, respecting prerequisites and option validation.
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item|string} itemOrGroupName - The item whose type to set, or the group name for the item
 * @param {boolean} [push] - Whether or not appearance updates should be persisted (only applies if the character is the
 * player) - defaults to false.
 * @returns {string|undefined} - undefined or an empty string if the type was set correctly. Otherwise, returns a string
 * informing the player of the requirements that are not met.
 */
function TypedItemSetRandomOption(C, itemOrGroupName, push = false) {
	const item = typeof itemOrGroupName === "string" ? InventoryGet(C, itemOrGroupName) : itemOrGroupName;

	if (!item || item.Asset.Archetype !== ExtendedArchetype.TYPED) {
		console.warn("Cannot set random option: item does not exist or does not use the typed archetype");
		return;
	}

	/** @type {ExtendedItemOption[]} */
	const allOptions = TypedItemGetOptions(item.Asset.Group.Name, item.Asset.Name);
	// Avoid blocked & non-random options
	const availableOptions = allOptions
		.filter(option => option.Random !== false)
		.filter(option => !InventoryBlockedOrLimited(C, item, option.Property.Type));

	/** @type {ExtendedItemOption} */
	let option;
	if (availableOptions.length === 0) {
		// If no options are available, use the null type
		option = allOptions.find(O => O.Property.Type == null);
	} else {
		option = CommonRandomItemFromList(null, availableOptions);
	}
	return TypedItemSetOption(C, item, availableOptions, option, push);
}
