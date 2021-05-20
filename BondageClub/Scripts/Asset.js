"use strict";

/** @type {Asset[]} */
var Asset = [];
/** @type {AssetGroup[]} */
var AssetGroup = [];
/** @type {AssetGroup} */
var AssetCurrentGroup;
/** @type {Pose[]} */
var Pose = [];

// Adds a new asset group to the main list
function AssetGroupAdd(NewAssetFamily, NewAsset) {
	/** @type {AssetGroup} */
	var A = {
		Family: NewAssetFamily,
		Name: NewAsset.Group,
		Description: NewAsset.Group,
		ParentGroupName: (NewAsset.ParentGroup == null) ? "" : NewAsset.ParentGroup,
		Category: (NewAsset.Category == null) ? "Appearance" : NewAsset.Category,
		IsDefault: (NewAsset.Default == null) ? true : NewAsset.Default,
		IsRestraint: (NewAsset.IsRestraint == null) ? false : NewAsset.IsRestraint,
		AllowNone: (NewAsset.AllowNone == null) ? true : NewAsset.AllowNone,
		AllowColorize: (NewAsset.AllowColorize == null) ? true : NewAsset.AllowColorize,
		AllowCustomize: (NewAsset.AllowCustomize == null) ? true : NewAsset.AllowCustomize,
		ColorSchema: (NewAsset.Color == null) ? ["Default"] : NewAsset.Color,
		ParentSize: (NewAsset.ParentSize == null) ? "" : NewAsset.ParentSize,
		ParentColor: (NewAsset.ParentColor == null) ? "" : NewAsset.ParentColor,
		Clothing: (NewAsset.Clothing == null) ? false : NewAsset.Clothing,
		Underwear: (NewAsset.Underwear == null) ? false : NewAsset.Underwear,
		BodyCosplay: (NewAsset.BodyCosplay == null) ? false : NewAsset.BodyCosplay,
		Activity: NewAsset.Activity,
		AllowActivityOn: NewAsset.AllowActivityOn,
		Hide: NewAsset.Hide,
		Block: NewAsset.Block,
		Zone: NewAsset.Zone,
		SetPose: NewAsset.SetPose,
		AllowPose: Array.isArray(NewAsset.AllowPose) ? NewAsset.AllowPose : [],
		AllowExpression: NewAsset.AllowExpression,
		Effect: NewAsset.Effect,
		MirrorGroup: (NewAsset.MirrorGroup == null) ? "" : NewAsset.MirrorGroup,
		RemoveItemOnRemove: (NewAsset.RemoveItemOnRemove == null) ? [] : NewAsset.RemoveItemOnRemove,
		DrawingPriority: (NewAsset.Priority == null) ? AssetGroup.length : NewAsset.Priority,
		DrawingLeft: (NewAsset.Left == null) ? 0 : NewAsset.Left,
		DrawingTop: (NewAsset.Top == null) ? 0 : NewAsset.Top,
		DrawingFullAlpha: (NewAsset.FullAlpha == null) ? true : NewAsset.FullAlpha,
		DrawingBlink: (NewAsset.Blink == null) ? false : NewAsset.Blink,
		InheritColor: NewAsset.InheritColor,
		FreezeActivePose: Array.isArray(NewAsset.FreezeActivePose) ? NewAsset.FreezeActivePose : [],
		PreviewZone: NewAsset.PreviewZone,
		DynamicGroupName: NewAsset.DynamicGroupName || NewAsset.Group,
	};
	AssetGroup.push(A);
	AssetCurrentGroup = A;
}

// Adds a new asset to the main list
function AssetAdd(NewAsset, ExtendedConfig) {
	/** @type {Asset} */
	var A = Object.assign({
		Name: NewAsset.Name,
		Description: NewAsset.Name,
		Group: AssetCurrentGroup,
		ParentItem: NewAsset.ParentItem,
		ParentGroupName: NewAsset.ParentGroup,
		Enable: (NewAsset.Enable == null) ? true : NewAsset.Enable,
		Visible: (NewAsset.Visible == null) ? true : NewAsset.Visible,
		Wear: (NewAsset.Wear == null) ? true : NewAsset.Wear,
		Activity: (NewAsset.Activity == null) ? AssetCurrentGroup.Activity : NewAsset.Activity,
		AllowActivity: NewAsset.AllowActivity,
		AllowActivityOn: (NewAsset.AllowActivityOn == null) ? AssetCurrentGroup.AllowActivityOn : NewAsset.AllowActivityOn,
		BuyGroup: NewAsset.BuyGroup,
		PrerequisiteBuyGroups: NewAsset.PrerequisiteBuyGroups,
		Effect: (NewAsset.Effect == null) ? AssetCurrentGroup.Effect : NewAsset.Effect,
		Bonus: NewAsset.Bonus,
		Block: (NewAsset.Block == null) ? AssetCurrentGroup.Block : NewAsset.Block,
		Expose: (NewAsset.Expose == null) ? [] : NewAsset.Expose,
		Hide: (NewAsset.Hide == null) ? AssetCurrentGroup.Hide : NewAsset.Hide,
		HideItem: NewAsset.HideItem,
		HideItemExclude: NewAsset.HideItemExclude || [],
		Require: NewAsset.Require,
		SetPose: (NewAsset.SetPose == null) ? AssetCurrentGroup.SetPose : NewAsset.SetPose,
		AllowActivePose: (NewAsset.AllowActivePose == null) ? AssetCurrentGroup.AllowActivePose : NewAsset.AllowActivePose,
		WhitelistActivePose: (NewAsset.WhitelistActivePose == null) ? AssetCurrentGroup.WhitelistActivePose : NewAsset.WhitelistActivePose,
		Value: (NewAsset.Value == null) ? 0 : NewAsset.Value,
		Difficulty: (NewAsset.Difficulty == null) ? 0 : NewAsset.Difficulty,
		SelfBondage: (NewAsset.SelfBondage == null) ? 0 : NewAsset.SelfBondage,
		SelfUnlock: (NewAsset.SelfUnlock == null) ? true : NewAsset.SelfUnlock,
		ExclusiveUnlock: (NewAsset.ExclusiveUnlock == null) ? false : NewAsset.ExclusiveUnlock,
		Random: (NewAsset.Random == null) ? true : NewAsset.Random,
		RemoveAtLogin: (NewAsset.RemoveAtLogin == null) ? false : NewAsset.RemoveAtLogin,
		WearTime: (NewAsset.Time == null) ? 0 : NewAsset.Time,
		RemoveTime: (NewAsset.RemoveTime == null) ? ((NewAsset.Time == null) ? 0 : NewAsset.Time) : NewAsset.RemoveTime,
		RemoveTimer: (NewAsset.RemoveTimer == null) ? 0 : NewAsset.RemoveTimer,
		MaxTimer: (NewAsset.MaxTimer == null) ? 0 : NewAsset.MaxTimer,
		DrawingPriority: NewAsset.Priority,
		DrawingLeft: NewAsset.Left,
		DrawingTop: NewAsset.Top,
		HeightModifier: (NewAsset.Height == null) ? 0 : NewAsset.Height,
		ZoomModifier: (NewAsset.Zoom == null) ? 1 : NewAsset.Zoom,
		Alpha: NewAsset.Alpha,
		Prerequisite: NewAsset.Prerequisite,
		Extended: (NewAsset.Extended == null) ? false : NewAsset.Extended,
		AlwaysExtend: (NewAsset.AlwaysExtend == null) ? false : NewAsset.AlwaysExtend,
		AlwaysInteract: (NewAsset.AlwaysInteract == null) ? false : NewAsset.AlwaysInteract,
		AllowLock: (NewAsset.AllowLock == null) ? false : NewAsset.AllowLock,
		IsLock: (NewAsset.IsLock == null) ? false : NewAsset.IsLock,
		PickDifficulty: (NewAsset.PickDifficulty == null) ? 0 : NewAsset.PickDifficulty,
		OwnerOnly: (NewAsset.OwnerOnly == null) ? false : NewAsset.OwnerOnly,
		LoverOnly: (NewAsset.LoverOnly == null) ? false : NewAsset.LoverOnly,
		ExpressionTrigger: NewAsset.ExpressionTrigger,
		RemoveItemOnRemove: (NewAsset.RemoveItemOnRemove == null) ? AssetCurrentGroup.RemoveItemOnRemove : AssetCurrentGroup.RemoveItemOnRemove.concat(NewAsset.RemoveItemOnRemove),
		AllowEffect: NewAsset.AllowEffect,
		AllowBlock: NewAsset.AllowBlock,
		AllowType: NewAsset.AllowType,
		DefaultColor: NewAsset.DefaultColor,
		Opacity: AssetParseOpacity(NewAsset.Opacity),
		MinOpacity: typeof NewAsset.MinOpacity === "number" ? AssetParseOpacity(NewAsset.MinOpacity) : 1,
		MaxOpacity: typeof NewAsset.MaxOpacity === "number" ? AssetParseOpacity(NewAsset.MaxOpacity) : 1,
		Audio: NewAsset.Audio,
		Category: NewAsset.Category,
		Fetish: NewAsset.Fetish,
		CustomBlindBackground: NewAsset.CustomBlindBackground,
		ArousalZone: (NewAsset.ArousalZone == null) ? AssetCurrentGroup.Name : NewAsset.ArousalZone,
		IsRestraint: (NewAsset.IsRestraint == null) ? ((AssetCurrentGroup.IsRestraint == null) ? false : AssetCurrentGroup.IsRestraint) : NewAsset.IsRestraint,
		BodyCosplay: (NewAsset.BodyCosplay == null) ? AssetCurrentGroup.BodyCosplay : NewAsset.BodyCosplay,
		OverrideBlinking: (NewAsset.OverrideBlinking == null) ? false : NewAsset.OverrideBlinking,
		DialogSortOverride: NewAsset.DialogSortOverride,
		DynamicDescription: (typeof NewAsset.DynamicDescription === 'function') ? NewAsset.DynamicDescription : function () { return this.Description; },
		DynamicPreviewIcon: (typeof NewAsset.DynamicPreviewIcon === 'function') ? NewAsset.DynamicPreviewIcon : function () { return ""; },
		DynamicAllowInventoryAdd: (typeof NewAsset.DynamicAllowInventoryAdd === 'function') ? NewAsset.DynamicAllowInventoryAdd : function () { return true; },
		DynamicExpressionTrigger: (typeof NewAsset.DynamicExpressionTrigger === 'function') ? NewAsset.DynamicExpressionTrigger : function () { return this.ExpressionTrigger; },
		DynamicName: (typeof NewAsset.DynamicName === 'function') ? NewAsset.DynamicName : function () { return this.Name; },
		DynamicGroupName: (NewAsset.DynamicGroupName || AssetCurrentGroup.DynamicGroupName),
		DynamicActivity: (typeof NewAsset.DynamicActivity === 'function') ? NewAsset.DynamicActivity : function () { return NewAsset.Activity; },
		DynamicAudio: (typeof NewAsset.DynamicAudio === 'function') ? NewAsset.DynamicAudio : null,
		CharacterRestricted: typeof NewAsset.CharacterRestricted === 'boolean' ? NewAsset.CharacterRestricted : false,
		AllowRemoveExclusive: typeof NewAsset.AllowRemoveExclusive === 'boolean' ? NewAsset.AllowRemoveExclusive : false,
		InheritColor: NewAsset.InheritColor,
		DynamicBeforeDraw: (typeof NewAsset.DynamicBeforeDraw === 'boolean') ? NewAsset.DynamicBeforeDraw : false,
		DynamicAfterDraw: (typeof NewAsset.DynamicAfterDraw === 'boolean') ? NewAsset.DynamicAfterDraw : false,
		DynamicScriptDraw: (typeof NewAsset.DynamicScriptDraw === 'boolean') ? NewAsset.DynamicScriptDraw : false,
		HasType: (typeof NewAsset.HasType === 'boolean') ? NewAsset.HasType : true,
		AllowLockType: NewAsset.AllowLockType,
		AllowColorizeAll: typeof NewAsset.AllowColorizeAll === "boolean" ? NewAsset.AllowColorizeAll : true,
		AvailableLocations: NewAsset.AvailableLocations || [],
		OverrideHeight: NewAsset.OverrideHeight,
		FreezeActivePose: Array.isArray(NewAsset.FreezeActivePose) ? NewAsset.FreezeActivePose :
			Array.isArray(AssetCurrentGroup.FreezeActivePose) ? AssetCurrentGroup.FreezeActivePose : [],
		DrawLocks: typeof NewAsset.DrawLocks === "boolean" ? NewAsset.DrawLocks : true,
		AllowExpression: NewAsset.AllowExpression,
		MirrorExpression: NewAsset.MirrorExpression,
		FixedPosition: typeof NewAsset.FixedPosition === "boolean" ? NewAsset.FixedPosition : false,
		Layer: [],
		ColorableLayerCount: 0,
		FuturisticRecolor: typeof NewAsset.FuturisticRecolor === 'boolean' ? NewAsset.FuturisticRecolor : false,
		FuturisticRecolorDisplay: typeof NewAsset.FuturisticRecolorDisplay === 'boolean' ? NewAsset.FuturisticRecolorDisplay : false,
	}, AssetParsePoseProperties(NewAsset, [...AssetCurrentGroup.AllowPose]));

	// Ensure opacity value is valid
	if (A.MinOpacity > A.Opacity) A.MinOpacity = A.Opacity;
	if (A.MaxOpacity < A.Opacity) A.MaxOpacity = A.Opacity;

	A.Layer = AssetBuildLayer(NewAsset, A);
	AssetAssignColorIndices(A);
	// Unwearable assets are not visible but can be overwritten
	if (!A.Wear && NewAsset.Visible != true) A.Visible = false;
	Asset.push(A);
	if (A.Extended && ExtendedConfig) AssetBuildExtended(A, ExtendedConfig);
}

/**
 * Constructs extended item functions for an asset, if extended item configuration exists for the asset.
 * @param {Asset} A - The asset to configure
 * @param {ExtendedItemConfig} ExtendedConfig - The extended item configuration object for the asset's family
 * @returns {void} - Nothing
 */
function AssetBuildExtended(A, ExtendedConfig) {
	let AssetConfig = AssetFindExtendedConfig(ExtendedConfig, AssetCurrentGroup.Name, A.Name);
	if (AssetConfig && AssetConfig.CopyConfig) {
		const Overrides = AssetConfig.Config;
		const { GroupName, AssetName } = AssetConfig.CopyConfig;
		AssetConfig = AssetFindExtendedConfig(ExtendedConfig, GroupName || AssetCurrentGroup.Name, AssetName);
		if (AssetConfig && Overrides) {
			const MergedConfig = Object.assign({}, AssetConfig.Config, Overrides);
			AssetConfig = Object.assign({}, AssetConfig, {Config: MergedConfig});
		}
	}
	if (AssetConfig) {
		switch (AssetConfig.Archetype) {
			case ExtendedArchetype.MODULAR:
				ModularItemRegister(A, AssetConfig.Config);
				break;
			case ExtendedArchetype.TYPED:
				TypedItemRegister(A, AssetConfig.Config);
				break;
		}
		A.Archetype = AssetConfig.Archetype;
	}
}

/**
 * Finds the extended item configuration for the provided group and asset name, if any exists
 * @param {ExtendedItemConfig} ExtendedConfig - The full extended item configuration object
 * @param {string} GroupName - The name of the asset group to find extended configuration for
 * @param {string} AssetName - The name of the asset to find extended configuration fo
 * @returns {ExtendedItemAssetConfig | undefined} - The extended asset configuration object for the specified asset, if
 * any exists, or undefined otherwise
 */
function AssetFindExtendedConfig(ExtendedConfig, GroupName, AssetName) {
	const GroupConfig = ExtendedConfig[GroupName] || {};
	return GroupConfig[AssetName];
}

/**
 * Builds the layer array for an asset based on the asset definition. One layer is created for each drawable part of
 * the asset (excluding the lock). If the asset definition contains no layer definitions, a default layer definition
 * will be created.
 * @param {Object} AssetDefinition - The raw asset definition
 * @param {Asset} A - The built asset
 * @return {AssetLayer[]} - An array of layer objects representing the drawable layers of the asset
 */
function AssetBuildLayer(AssetDefinition, A) {
	var Layers = Array.isArray(AssetDefinition.Layer) ? AssetDefinition.Layer : [{}];
	return Layers.map((Layer, I) => AssetMapLayer(Layer, AssetDefinition, A, I));
}

/**
 * Maps a layer definition to a drawable layer object
 * @param {Object} Layer - The raw layer definition
 * @param {Object} AssetDefinition - The raw asset definition
 * @param {Asset} A - The built asset
 * @param {number} I - The index of the layer within the asset
 * @return {AssetLayer} - A Layer object representing the drawable properties of the given layer
 */
function AssetMapLayer(Layer, AssetDefinition, A, I) {
	/** @type {AssetLayer} */
	const L = Object.assign({
		Name: Layer.Name || null,
		AllowColorize: AssetLayerAllowColorize(Layer, AssetDefinition),
		CopyLayerColor: Layer.CopyLayerColor || null,
		ColorGroup: Layer.ColorGroup,
		HideColoring: typeof Layer.HideColoring === "boolean" ? Layer.HideColoring : false,
		AllowTypes: Array.isArray(Layer.AllowTypes) ? Layer.AllowTypes : null,
		HasType: typeof Layer.HasType === "boolean" ? Layer.HasType : A.HasType,
		ParentGroupName: Layer.ParentGroup,
		Priority: Layer.Priority || AssetDefinition.Priority || AssetCurrentGroup.DrawingPriority,
		InheritColor: Layer.InheritColor,
		Alpha: AssetLayerAlpha(Layer, AssetDefinition, I),
		Asset: A,
		DrawingLeft: Layer.Left,
		DrawingTop: Layer.Top,
		HideAs: Layer.HideAs,
		HasImage: typeof Layer.HasImage === "boolean" ? Layer.HasImage : true,
		Opacity: typeof Layer.Opacity === "number" ? AssetParseOpacity(Layer.Opacity) : 1,
		MinOpacity: typeof Layer.MinOpacity === "number" ? AssetParseOpacity(Layer.Opacity) : A.MinOpacity,
		MaxOpacity: typeof Layer.MaxOpacity === "number" ? AssetParseOpacity(Layer.Opacity) : A.MaxOpacity,
		LockLayer: typeof Layer.LockLayer === "boolean" ? Layer.LockLayer : false,
		MirrorExpression: Layer.MirrorExpression,
		AllowModuleTypes: Layer.AllowModuleTypes,
		ColorIndex: 0
	}, AssetParsePoseProperties(
		Layer,
		Array.isArray(AssetDefinition.AllowPose) ? [...AssetDefinition.AllowPose] : null)
	);
	if (L.MinOpacity > L.Opacity) L.MinOpacity = L.Opacity;
	if (L.MaxOpacity < L.Opacity) L.MaxOpacity = L.Opacity;
	return L;
}

/**
 * Resolves the AllowPose and HideForPose properties on a layer or an asset
 * @param {Asset | AssetLayer} obj - The asset or layer object
 * @param {string[] | null} defaultAllowPose - A fallback value for the AllowPose property if it's not defined on the
 * object
 * @return {{AllowPose?: string[], HideForPose: string[]}} - A partial object containing AllowPose and HideForPose
 * properties
 */
function AssetParsePoseProperties(obj, defaultAllowPose = null) {
	const HideForPose = Array.isArray(obj.HideForPose) ? obj.HideForPose : [];
	let AllowPose = Array.isArray(obj.AllowPose) ? obj.AllowPose : defaultAllowPose;
	if (HideForPose.length > 0) {
		// Automatically add any entries from HideForPose into AllowPose
		AllowPose = AllowPose || [];
		CommonArrayConcatDedupe(AllowPose, HideForPose);
	}
	return {AllowPose, HideForPose};
}

function AssetParseOpacity(opacity) {
	if (typeof opacity === "number" && !isNaN(opacity)) {
		return Math.max(0, Math.min(1, opacity));
	}
	return 1;
}

/**
 * Determines whether a layer can be colorized, based on the layer definition and its parent asset/group definitions
 * @param {Object} Layer - The raw layer definition
 * @param {Object} NewAsset - The raw asset definition
 * @return {boolean} - Whether or not the layer should be permit colors
 */
function AssetLayerAllowColorize(Layer, NewAsset) {
	return typeof Layer.AllowColorize === "boolean" ? Layer.AllowColorize :
		typeof NewAsset.AllowColorize === "boolean" ? NewAsset.AllowColorize :
			typeof AssetCurrentGroup.AllowColorize === "boolean" ? AssetCurrentGroup.AllowColorize : true;
}

/**
 * Builds the alpha mask definitions for a layer, based on the
 * @param {Object} Layer - The raw layer definition
 * @param {Object} NewAsset - The raw asset definition
 * @param {number} I - The index of the layer within its asset
 * @return {AlphaDefinition[]} - a list of alpha mask definitions for the layer
 */
function AssetLayerAlpha(Layer, NewAsset, I) {
	var Alpha = Layer.Alpha || [];
	// If the layer is the first layer for an asset, add the asset's alpha masks
	if (I === 0 && NewAsset.Alpha && NewAsset.Alpha.length) {
		Array.prototype.push.apply(Alpha, NewAsset.Alpha);
	}
	return Alpha;
}

/**
 * Assigns colour indices to the layers of an asset. These determine which colours get applied to the layer. Also adds
 * a count of colorable layers to the asset definition.
 * @param {Asset} A - The built asset
 * @returns {void} - Nothing
 */
function AssetAssignColorIndices(A) {
	var colorIndex = 0;
	var colorMap = {};
	A.Layer.forEach(Layer => {
		// If the layer can't be coloured, we don't need to set a color index
		if (!Layer.AllowColorize) return;

		var LayerKey = Layer.CopyLayerColor || Layer.Name;
		if (typeof colorMap[LayerKey] === "number") {
			Layer.ColorIndex = colorMap[LayerKey];
		} else {
			Layer.ColorIndex = colorMap[LayerKey] = colorIndex;
			colorIndex++;
		}
	});
	A.ColorableLayerCount = colorIndex;
}

// Builds the asset description from the CSV file
function AssetBuildDescription(Family, CSV) {

	const map = new Map();

	for (const line of CSV) {
		if (Array.isArray(line) && line.length === 3) {
			if (map.has(`${line[0]}:${line[1]}`)) {
				console.warn("Duplicate Asset Description: ", line);
			}
			map.set(`${line[0]}:${line[1]}`, line[2].trim());
		} else {
			console.warn("Bad Asset Description line: ", line);
		}
	}

	// For each asset group in family
	for (const G of AssetGroup) {
		if (G.Family !== Family)
			continue;

		const res = map.get(`${G.Name}:`);
		if (res === undefined) {
			G.Description = `MISSING ASSETGROUP DESCRIPTION: ${G.Name}`;
		} else {
			G.Description = res;
		}
	}

	// For each asset in the family
	for (const A of Asset) {
		if (A.Group.Family !== Family)
			continue;

		const res = map.get(`${A.Group.Name}:${A.Name}`);
		if (res === undefined) {
			A.Description = `MISSING ASSET DESCRIPTION: ${A.Group.Name}:${A.Name}`;
		} else {
			A.Description = res;
		}
	}

	// Translates the descriptions to a foreign language
	TranslationAsset(Family);

}

// Loads the description of the assets in a specific language
function AssetLoadDescription(Family) {

	// Finds the full path of the CSV file to use cache
	var FullPath = "Assets/" + Family + "/" + Family + ".csv";
	if (CommonCSVCache[FullPath]) {
		AssetBuildDescription(Family, CommonCSVCache[FullPath]);
		return;
	}

	// Opens the file, parse it and returns the result it to build the dialog
	CommonGet(FullPath, function () {
		if (this.status == 200) {
			CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
			AssetBuildDescription(Family, CommonCSVCache[FullPath]);
		}
	});

}

// Loads a specific asset file
function AssetLoad(A, Family, ExtendedConfig) {

	// For each group in the asset file
	var G;
	for (G = 0; G < A.length; G++) {

		// Creates the asset group
		AssetGroupAdd(Family, A[G]);

		// Add each assets in the group 1 by 1
		var I;
		for (I = 0; I < A[G].Asset.length; I++) {
			if (A[G].Asset[I].Name == null)
				AssetAdd({ Name: A[G].Asset[I] }, ExtendedConfig);
			else
				AssetAdd(A[G].Asset[I], ExtendedConfig);
		}

	}

	// Loads the description of the assets in a specific language
	AssetLoadDescription(Family);

}

// Reset and load all the assets
function AssetLoadAll() {
	Asset = [];
	AssetGroup = [];
	AssetLoad(AssetFemale3DCG, "Female3DCG", AssetFemale3DCGExtended);
	Pose = PoseFemale3DCG;
}

// Gets a specific asset by family/group/name
function AssetGet(Family, Group, Name) {
	for (let A = 0; A < Asset.length; A++)
		if ((Asset[A].Name == Name) && (Asset[A].Group.Name == Group) && (Asset[A].Group.Family == Family))
			return Asset[A];
	return null;
}

// Gets an activity asset by family and name
function AssetGetActivity(Family, Name) {
	if (Family == "Female3DCG")
		for (let A = 0; A < ActivityFemale3DCG.length; A++)
			if (ActivityFemale3DCG[A].Name == Name)
				return ActivityFemale3DCG[A];
	return null;
}

/**
 * Cleans the given array of assets of any items that no longer exists
 * @param {Array.<{Name: string, Group: string}>} AssetArray - The arrays of items to clean
 * @returns {Array.<{Name: string, Group: string}>} - The cleaned up array
 */
function AssetCleanArray(AssetArray) {
	var CleanArray = [];
	// Only save the existing items
	for (let A = 0; A < Asset.length; A++)
		for (let AA = 0; AA < AssetArray.length; AA++)
			if (AssetArray[AA].Name == Asset[A].Name && AssetArray[AA].Group == Asset[A].Group.Name) {
				CleanArray.push(AssetArray[AA]);
				break;
			}
	return CleanArray;
}

/**
 * Gets an asset group by the asset family name and group name
 * @param {string} Family - The asset family that the group belongs to
 * @param {string} Group - The name of the asset group to find
 * @returns {*} - The asset group matching the provided family and group name
 */
function AssetGroupGet(Family, Group) {
	return AssetGroup.find(g => g.Family === Family && g.Name === Group);
}

/**
 * Utility function for retrieving the preview image directory path for an asset
 * @param {Asset} A - The asset whose preview path to retrieve
 * @returns {string} - The path to the asset's preview image directory
 */
function AssetGetPreviewPath(A) {
	return `Assets/${A.Group.Family}/${A.DynamicGroupName}/Preview`;
}

/**
 * Utility function for retrieving the base path of an asset's inventory directory, where extended item scripts are
 * held
 * @param {Asset} A - The asset whose inventory path to retrieve
 * @returns {string} - The path to the asset's inventory directory
 */
function AssetGetInventoryPath(A) {
	return `Screens/Inventory/${A.DynamicGroupName}/${A.Name}`;
}
