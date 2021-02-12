"use strict";

/**
 * Female3DCGExtended.js
 * ---------------------
 * This file contains definitions and configuration for extended items. Items which are marked as Extended in
 * `Female3DCG.js` and which have an extended item definition here will have their load/draw/click functions
 * _automatically_ created when assets are loaded, saving the need for an individual extended item script.
 *
 * Currently, only modular items are supported, but this will expand in the future.
 */

/**
 * An enum encapsulating the available extended item archetypes
 * MODULAR - Indicates that this item is modular, with several independently configurable modules
 * @enum {string}
 * @see {@link ModularItemConfig}
 */
const ExtendedArchetype = {
	MODULAR: "modular",
};

/**
 * An object containing all extended item configurations.
 * @const {ExtendedItemConfig}
 */
const AssetFemale3DCGExtended = {
	ItemArms: {
		HighSecurityStraitJacket: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Crotch", Key: "c",
						Options: [
							{}, // c0 - No crotch panel
							{ // c1 - Crotch panel
								Property: {
									Difficulty: 1,
									Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
									Hide: ["ItemVulva", "ItemVulvaPiercings"],
									HideItem: ["ItemButtAnalBeads2"],
								},
							},
						],
					},
					{
						Name: "Arms", Key: "a",
						Options: [
							{}, // a0 - Arms loose
							{ Property: { Difficulty: 2 }, SelfBondageLevel: 8 }, // a1 - Arms in front
							{ Property: { Difficulty: 3 }, SelfBondageLevel: 8 }, // a2 - Arms behind
						],
					},
					{
						Name: "Straps", Key: "s",
						Options: [
							{}, // s0 - No crotch straps
							{ // s1 - One crotch strap
								Property: {
									Difficulty: 1,
									Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
									Hide: ["ItemVulvaPiercings"],
									HideItem: ["ItemButtAnalBeads2"],
								},
							},
							{ Property: { Difficulty: 2, Block: ["ItemPelvis"] } }, // s2 - Two crotch straps
							{ // s3 - Three crotch straps
								Property: {
									Difficulty: 2,
									Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
									Hide: ["ItemVulvaPiercings"],
									HideItem: ["ItemButtAnalBeads2"],
								},
							},
						],
					},
				],
			},
		}, // HighSecurityStraitJacket
	}, // ItemArms
	ItemHood: {
		KirugumiMask: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules: [
					{
						Name: "Eyes", Key: "e",
						Options: [ // All options are merely cosmetic
							{},
							{},
							{}, 
							{},
						],
					},
					{
						Name: "Mouth", Key: "m",
						Options: [ // All options are merely cosmetic
							{},
							{},
							{}, 
							{},
						],
					},
					{
						Name: "Blush", Key: "b",
						Options: [ // All options are merely cosmetic
							{},
							{},
							{}, 
							{},
						],
					},
					{
						Name: "Brows", Key: "br",
						Options: [ // All options are merely cosmetic
							{},
							{},
							{}, 
							{},
						],
					},
				],
			},
		}, // KirugumiMask
	}, // ItemHood
};

/**
 *
 * An object containing the extended item definition for an asset.
 * @typedef ExtendedItemAssetConfig
 * @type {object}
 * @property {ExtendedArchetype} Archetype - The extended item archetype that this asset uses.
 * @property {ModularItemConfig} Config - The specific configuration for the item (type will vary based on the item's
 * archetype)
 *
 * An object containing extended item definitions for a group. Maps asset names within the group to their extended item
 * configuration
 * @typedef ExtendedItemGroupConfig
 * @type {object.<string, ExtendedItemAssetConfig>}
 * @see {@link ExtendedItemAssetConfig}
 *
 * An object containing extended item configurations keyed by group name.
 * @typedef ExtendedItemConfig
 * @type {object.<string, ExtendedItemGroupConfig>}
 * @see {@link ExtendedItemAssetConfig}
 */
