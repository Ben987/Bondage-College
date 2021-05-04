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
 * @const {object.<string, TypedItemData>}
 * @see {@link TypedItemData}
 */
const TypedItemDataLookup = {};

/**
 * An enum encapsulating the possible chatroom message settings for typed items
 * - TO_ONLY - The item has one chatroom message per type (indicating that the type has been selected)
 * - FROM_TO - The item has a chatroom message for from/to type pairing
 * @type {{TO_ONLY: string, FROM_TO: string}}
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
function TypedItemCreateTypedItemData(asset, { Options, Dialog, ChatTags, ChatSetting, DrawImages }) {
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
 * Creates an asset's extended item chatroom message publishing function
 * @param {TypedItemData} data - The typed item data for the asset
 * @returns {void} - Nothing
 */
function TypedItemCreatePublishFunction(data) {
	const { options, functionPrefix, dialog, chatSetting } = data;
	const publishFunctionName = `${functionPrefix}PublishAction`;
	window[publishFunctionName] = function (C, newOption, previousOption) {
		let msg = dialog.chatPrefix;
		if (typeof dialog.chatPrefix === "function") {
			const previousIndex = options.indexOf(previousOption);
			const newIndex = options.indexOf(newOption);
			msg = dialog.chatPrefix({ C, previousOption, newOption, previousIndex, newIndex });
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
 * An object defining all of the required configuration for registering a typed item
 * @typedef TypedItemConfig
 * @type {object}
 * @property {ExtendedItemOption[]} Options - The list of extended item options available for the item
 * @property {TypedItemDialogConfig} [Dialog] - The optional text configuration for the item. Custom text keys can be
 * configured within this object
 * @property {CommonChatTags} [ChatTags] - An optional array of chat tags that should be included in the dictionary of
 * the chatroom message when the item's type is changed. Defaults to {@link CommonChatTags.SOURCE_CHAR} and
 * {@link CommonChatTags.DEST_CHAR}
 * @property {TypedItemChatSetting} [ChatSetting] - The chat message setting for the item. This can be provided to allow
 * finer-grained chatroom message keys for the item. Defaults to {@link TypedItemChatSetting.TO_ONLY}
 * @property {boolean} [DrawImages] - A boolean indicating whether or not images should be drawn in this item's extended
 * item menu. Defaults to true
 */

/**
 * @typedef TypedItemDialogConfig
 * @type {object}
 * @property {string} [Load] - The key for the text that will be displayed at the top of the extended item screen
 * (usually a prompt for the player to select a type). Defaults to "<groupName><assetName>Select"
 * @property {string} [TypePrefix] - A prefix for text keys for the display names of the item's individual types. This
 * will be suffixed with the option name to get the final key (i.e. "<typePrefix><optionName>"). Defaults to
 * "<groupName><assetName>"
 * @property {string | TypedItemChatCallback} [ChatPrefix] - A prefix for text keys for chat messages triggered by the
 * item. Chat message keys
 * will include the name of the new option, and depending on the chat setting, the name of the previous option:
 * - For chat setting FROM_TO: <chatPrefix><oldOptionName>To<newOptionName>
 * - For chat setting TO_ONLY: <chatPrefix><newOptionName>
 * @property {string} [NpcPrefix] - A prefix for text keys for NPC dialog. This will be suffixed with the option name
 * to get the final NPC dialogue key (i.e. "<npcPrefix><optionName>". Defaults to "<groupName><assetName>"
 */

/**
 *
 * An object containing typed item configuration for an asset. Contains all of the necessary information for the item's
 * load, draw & click handlers.
 * @typedef TypedItemData
 * @type {object}
 * @property {Asset} asset - The asset reference
 * @property {ExtendedItemOption[]} options - The list of extended item options available for the item
 * @property {string} key - A key uniquely identifying the asset
 * @property {string} functionPrefix - The common prefix used for all extended item functions associated with the asset
 * @property {object.<string, string>} dialog - A record containing various dialog keys used by the extended item screen
 * @property {string} dialog.load - The dialog key for the item's load text (usually a prompt to select the type)
 * @property {string} dialog.typePrefix - The prefix used for dialog keys representing the display names of the item's
 * types
 * @property {string} dialog.chatPrefix - The prefix used for dialog keys representing the item's chatroom messages
 * when its type is changed
 * @property {string} dialog.npcPrefix - The prefix used for dialog keys representing an NPC's reactions to item type
 * changes
 * @property {CommonChatTags[]} chatTags - An array of the chat message tags that should be included in the item's
 * chatroom messages. Defaults to [{@link CommonChatTags.SOURCE_CHAR}, {@link CommonChatTags.DEST_CHAR}]
 * @property {boolean} [drawImages] - A boolean indicating whether or not images should be drawn in this item's extended
 * item menu. Defaults to true
 */

/**
 * @callback TypedItemChatCallback
 * @param {object} chatData - An object containing data about the type change that triggered the chat message
 * @param {Character} chatData.C - A reference to the character wearing the item
 * @param {ExtendedItemOption} chatData.previousOption - The previously selected type option
 * @param {ExtendedItemOption} chatData.newOption - The newly selected type option
 * @param {number} chatData.previousIndex - The index of the previously selected type option in the item's options
 * config
 * @param {number} chatData.newIndex - The index of the newly selected type option in the item's options config
 * @returns {string} - The chat prefix that should be used for this type change
 */
