"use strict";
const vm = require("vm");
const fs = require("fs");
const typeCheck = require("type-check").typeCheck;

// Load the type definitions
const types = require("./AssetCheck_Types");

const BASE_PATH = "../../";
// Files needed to check the Female3DCG assets
const neededFiles = [
	"Scripts/Common.js",
	"Scripts/Dialog.js",
	"Scripts/ModularItem.js",
	"Scripts/TypedItem.js",
	"Assets/Female3DCG/Female3DCG.js",
	"Assets/Female3DCG/Female3DCGExtended.js"
];

let localError = false;
/**
 * Logs the error to console and sets erroneous exit code
 * @param {string} text The error
 */
function error(text) {
	console.log("ERROR", text);
	process.exitCode = 1;
	localError = true;
}

/**
 * Parse a CSV file content into an array
 * @param {string} str - Content of the CSV
 * @returns {string[][]} Array representing each line of the parsed content, each line itself is split by commands and stored within an array.
 */
function CommonParseCSV(str) {
	let arr = [];
	let quote = false; // true means we're inside a quoted field
	let c;
	let col;
	// We remove whitespace on start and end
	str = str.trim();

	// iterate over each character, keep track of current row and column (of the returned array)
	for (let row = (col = c = 0); c < str.length; c++) {
		var cc = str[c],
			nc = str[c + 1]; // current character, next character
		arr[row] = arr[row] || []; // create a new row if necessary
		arr[row][col] = arr[row][col] || ""; // create a new column (start with empty string) if necessary

		// If the current character is a quotation mark, and we're inside a
		// quoted field, and the next character is also a quotation mark,
		// add a quotation mark to the current column and skip the next character
		if (cc == '"' && quote && nc == '"') {
			arr[row][col] += cc;
			++c;
			continue;
		}

		// If it's just one quotation mark, begin/end quoted field
		if (cc == '"') {
			quote = !quote;
			continue;
		}

		// If it's a comma and we're not in a quoted field, move on to the next column
		if (cc == "," && !quote) {
			++col;
			continue;
		}

		// If it's a newline and we're not in a quoted field, move on to the next
		// row and move to column 0 of that new row
		if (cc == "\n" && !quote) {
			++row;
			col = 0;
			continue;
		}

		// Otherwise, append the current character to the current column
		arr[row][col] += cc;
	}
	return arr;
}

/**
 * Loads a CSV file and verifies correct column widths
 * @param {string} path Path to file, relative to BondageClub directory
 * @param {number} expectedWidth Expected number of columns
 */
function loadCSV(path, expectedWidth) {
	const data = CommonParseCSV(fs.readFileSync(BASE_PATH + path, { encoding: "utf-8" }));
	for (let line = 0; line < data.length; line++) {
		if (data[line].length !== expectedWidth) {
			error(`Bad width of line ${line + 1} (${data[line].length} vs ${expectedWidth}) in ${path}`);
		}
	}
	return data;
}

(function () {
	const context = vm.createContext({ OuterArray: Array, Object: Object });
	for (const file of neededFiles) {
		vm.runInContext(fs.readFileSync(BASE_PATH + file, { encoding: "utf-8" }), context, {
			filename: file,
			timeout: 1000
		});
	}

	// We need to strigify and parse the asset array to have correct Array and Object prototypes, because VM uses different ones
	// This unfortunately results in Functions being lost and replaced with undefined
	const AssetFemale3DCG = JSON.parse(JSON.stringify(context.AssetFemale3DCG));
	const AssetFemale3DCGExtended = JSON.parse(JSON.stringify(context.AssetFemale3DCGExtended));

	if (!Array.isArray(AssetFemale3DCG)) {
		error("AssetFemale3DCG not found");
		return;
	}

	const assetDescriptions = loadCSV("Assets/Female3DCG/Female3DCG.csv", 3);

	const GROUP_KEYS = Object.keys(types.AssetGroupType);
	const ASSET_KEYS = Object.keys(types.AssetType);
	const LAYER_KEYS = Object.keys(types.AssetLayerType);
	const EXTENDED_ARCHETYPE_KEYS = Object.keys(types.AssetExtendedArchetypeType);
	const EXTENDED_CONFIG_KEYS = Object.keys(types.AssetExtendedConfigType);

	// No further checks if initial data load failed
	if (localError) {
		return;
	}

	// Arrays of type-validated groups and assets
	const Groups = [];
	const Assets = {};

	// Check all groups
	for (const Group of AssetFemale3DCG) {
		localError = false;
		for (const k of GROUP_KEYS) {
			if (!typeCheck(types.AssetGroupType[k], Group[k])) {
				error(
					`Group ${Group.Group}: expected ${k} ` +
						`to be "${types.AssetGroupType[k]}" found ${typeof Group[k]}`
				);
			}
		}
		for (const k of Object.keys(Group)) {
			if (!GROUP_KEYS.includes(k)) {
				error(`Group ${Group.Group}: unexpected key ${k}`);
			}
		}

		// Don't validate group further, if it had bad data
		if (localError) {
			continue;
		}
		Groups.push(Group);
		const GroupAssets = (Assets[Group.Group] = []);

		// Check all assets in groups
		if (Array.isArray(Group.Asset)) {
			for (const Asset of Group.Asset) {
				if (typeof Asset === "string") {
					GroupAssets.push({
						Name: Asset
					});
					continue;
				}
				localError = false;
				for (const k of ASSET_KEYS) {
					if (k !== "Name" && Asset[k] === undefined) continue;
					if (!typeCheck(types.AssetType[k], Asset[k])) {
						error(
							`Asset ${Group.Group}:${Asset.Name}: expected ${k} ` +
								`to be "${types.AssetType[k]}" found ${typeof Asset[k]}`
						);
					}
				}
				for (const k of Object.keys(Asset)) {
					if (!ASSET_KEYS.includes(k)) {
						error(`Asset ${Group.Group}:${Asset.Name}: unexpected key ${k}`);
					}
				}

				// Check any extended item config
				if (Asset.Extended) {
					const groupConfig = AssetFemale3DCGExtended[Group.Group] || {};
					const assetConfig = groupConfig[Asset.Name];
					if (assetConfig) {
						for (const k of EXTENDED_ARCHETYPE_KEYS) {
							if (!typeCheck(types.AssetExtendedArchetypeType[k], assetConfig[k])) {
								error(
									`Extended asset archetype for ${Group.Group}:${Asset.Name}: expected ${k} ` +
									`to be "${types.AssetExtendedArchetypeType[k]}" found ${typeof assetConfig[k]}`
								);
							}
						}
						for (const k of Object.keys(assetConfig)) {
							if (!EXTENDED_ARCHETYPE_KEYS.includes(k)) {
								error(
									`Extended asset archetype ${Group.Group}:${Asset.Name}: unexpected key ${k}`
								);
							}
						}
						if (assetConfig.Config) {
							for (const k of EXTENDED_CONFIG_KEYS) {
								if (!typeCheck(types.AssetExtendedConfigType[k], assetConfig.Config[k])) {
									error(
										`Extended asset config for ${Group.Group}:${Asset.Name}: expected ${k} ` +
										`to be "${types.AssetExtendedConfigType[k]}" found ` +
										`${typeof assetConfig.Config[k]}`
									);
								}
							}
							for (const k of Object.keys(assetConfig.Config)) {
								if (!EXTENDED_CONFIG_KEYS.includes(k)) {
									error(`Extended asset config for ${Group}:${Asset.Name}: unexpected key ${k}`);
								}
							}
						}
					}
				}

				// Check all layers of assets
				if (Array.isArray(Asset.Layer)) {
					for (const Layer of Asset.Layer) {
						for (const k of LAYER_KEYS) {
							if (Layer[k] === undefined) continue;
							if (!typeCheck(types.AssetLayerType[k], Layer[k])) {
								error(
									`Layer ${Group.Group}:${Asset.Name}:${Layer.Name}: expected ${k} ` +
										`to be "${types.AssetLayerType[k]}" found ${typeof Layer[k]}`
								);
							}
						}
						for (const k of Object.keys(Layer)) {
							if (!LAYER_KEYS.includes(k)) {
								error(`Layer ${Group.Group}:${Asset.Name}:${Layer.Name}: unexpected key ${k}`);
							}
						}
					}
				}

				if (!localError) {
					GroupAssets.push(Asset);
				}
			}
		}
	}

	// Validate description order
	{
		let group = "";
		for (let line = 0; line < assetDescriptions.length; line++) {
			if (assetDescriptions[line][1] === "") {
				group = assetDescriptions[line][0];
			} else if (assetDescriptions[line][0] !== group) {
				error(
					`Asset descriptions line ${line + 1} not under it's matching group! ` +
						`(${assetDescriptions[line][0]}:${assetDescriptions[line][1]} is in ${group} group)`
				);
			}
		}
	}

	// Check all type-valid groups for specific data
	for (const Group of Groups) {
		// Description name
		const descriptionIndex = assetDescriptions.findIndex(d => d[0] === Group.Group && d[1] === "");
		if (descriptionIndex < 0) {
			error(`No description for group "${Group.Group}"`);
		} else {
			assetDescriptions.splice(descriptionIndex, 1);
		}

		// Check all type-valid assets for specific data
		for (const Asset of Assets[Group.Group]) {
			// Ignore SpankingToys, because it's a snowflake
			if (Asset.Name === "SpankingToys" && Group.Group !== "ItemHands") continue;


			// Description name
			const descriptionIndexAsset = assetDescriptions.findIndex(d => d[0] === Group.Group && d[1] === Asset.Name);
			if (descriptionIndexAsset < 0) {
				error(`No description for asset "${Group.Group}:${Asset.Name}"`);
			} else {
				assetDescriptions.splice(descriptionIndexAsset, 1);
			}
		}
	}

	// Check for extra descriptions
	for (const desc of assetDescriptions) {
		error(`Unused Asset/Group description: ${desc.join(",")}`);
	}
})();
