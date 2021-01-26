const vm = require("vm");
const fs = require("fs");
const typeCheck = require("type-check").typeCheck;

// Load the type definitions
const types = require("./AssetCheck_Types");

// Files needed to check the Female3DCG assets
const neededFiles = ["../../Scripts/Dialog.js", "../../Assets/Female3DCG/Female3DCG.js"];

/**
 * Logs the error to console and sets erroneous exit code
 * @param {string} text The error
 */
function error(text) {
	console.log("ERROR", text);
	process.exitCode = 1;
}

(function () {
	const context = vm.createContext({ OuterArray: Array, Object: Object });
	for (const file of neededFiles) {
		vm.runInContext(fs.readFileSync(file, { encoding: "utf-8" }), context, { filename: file, timeout: 1000 });
	}

	// We need to strigify and parse the asset array to have correct Array and Object prototypes, because VM uses different ones
	// This unfortunately results in Functions being lost and replaced with undefined
	const AssetFemale3DCG = JSON.parse(JSON.stringify(context.AssetFemale3DCG));

	if (!Array.isArray(AssetFemale3DCG)) {
		error("AssetFemale3DCG not found");
		return;
	}

	const GROUP_KEYS = Object.keys(types.AssetGroupType);
	const ASSET_KEYS = Object.keys(types.AssetType);
	const LAYER_KEYS = Object.keys(types.AssetLayerType);

	// Check all groups
	for (const Group of AssetFemale3DCG) {
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

		// Check all assets in groups
		if (Array.isArray(Group.Asset)) {
			for (const Asset of Group.Asset) {
				if (typeof Asset === "string") continue;
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
			}
		}
	}
})();
