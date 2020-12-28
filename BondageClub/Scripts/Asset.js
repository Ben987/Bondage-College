"use strict";
var Asset = [];
var AssetGroup = [];
var AssetCurrentGroup;
var Pose = [];

/**
 * An object defining a drawable layer of an asset
 * @typedef {Object} Layer
 * @property {string | null} Name - the name of the layer - may be null if the asset only contains a single default layer
 * @property {boolean} AllowColorize - whether or not this layer can be colored
 * @property {string | null} CopyLayerColor - if not null, specifies that this layer should always copy the color of the named layer
 * @property {string} [ColorGroup] - specifies the name of a color group that this layer belongs to. Any layers within the same color group
 * can be colored together via the item color UI
 * @property {boolean} HideColoring - whether or not this layer can be coloured in the colouring UI
 * @property {string[] | null} AllowTypes - A list of allowed extended item types that this layer permits - the layer will only be drawn if
 * the item type matches one of these types. If null, the layer is considered to permit all extended types.
 * @property {boolean} HasType - whether or not the layer has separate assets per type. If not, the extended type will not be included in
 * the URL when fetching the layer's image
 * @property {string | null} [ParentGroupName] - The name of the parent group for this layer. If null, the layer has no parent group. If
 * undefined, the layer inherits its parent group from it's asset/group.
 * @property {string[] | null} OverrideAllowPose - An array of poses that this layer permits. If set, it will override the poses permitted
 * by the parent asset/group.
 * @property {number} Priority - The drawing priority of this layer. Inherited from the parent asset/group if not specified in the layer
 * definition.
 * @property {Asset} Asset - The asset that this layer belongs to
 * @property {number} ColorIndex - The coloring index for this layer
 */

/**
 * An object defining a group of alpha masks to be applied when drawing an asset layer
 * @typedef AlphaDefinition
 * @property {string[]} [Group] - A list of the group names that the given alpha masks should be applied to. If empty or not present, the
 * alpha masks will be applied to every layer underneath the present one.
 * @property {string[]} [Pose] - A list of the poses that the given alpha masks should be applied to. If empty or not present, the alpha
 * masks will be applied regardless of character pose.
 * @property {number[][]} Masks - A list of alpha mask definitions. A definition is a 4-tuple of numbers defining the top left coordinate of
 * a rectangle and the rectangle's width and height - e.g. [left, top, width, height]
 */

// Adds a new asset group to the main list
function AssetGroupAdd(NewAssetFamily, NewAsset) {
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
		Hide: NewAsset.Hide,
		Block: NewAsset.Block,
		Zone: NewAsset.Zone,
		SetPose: NewAsset.SetPose,
		AllowPose: NewAsset.AllowPose,
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
	}
	AssetGroup.push(A);
	AssetCurrentGroup = A;
}

// Adds a new asset to the main list
function AssetAdd(NewAsset) {
	var A = {
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
		AllowPose: (NewAsset.AllowPose == null) ? AssetCurrentGroup.AllowPose : NewAsset.AllowPose,
		AllowActivePose: (NewAsset.AllowActivePose == null) ? AssetCurrentGroup.AllowActivePose : NewAsset.AllowActivePose,
		WhitelistActivePose: (NewAsset.WhitelistActivePose == null) ? AssetCurrentGroup.WhitelistActivePose : NewAsset.WhitelistActivePose,
		Value: (NewAsset.Value == null) ? 0 : NewAsset.Value,
		Difficulty: (NewAsset.Difficulty == null) ? 0 : NewAsset.Difficulty,
		SelfBondage: (NewAsset.SelfBondage == null) ? 0 : NewAsset.SelfBondage,
		SelfUnlock: (NewAsset.SelfUnlock == null) ? true : NewAsset.SelfUnlock,
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
		OwnerOnly: (NewAsset.OwnerOnly == null) ? false : NewAsset.OwnerOnly,
		LoverOnly: (NewAsset.LoverOnly == null) ? false : NewAsset.LoverOnly,
		ExpressionTrigger: NewAsset.ExpressionTrigger,
		RemoveItemOnRemove: (NewAsset.RemoveItemOnRemove == null) ? AssetCurrentGroup.RemoveItemOnRemove : AssetCurrentGroup.RemoveItemOnRemove.concat(NewAsset.RemoveItemOnRemove),
		AllowEffect: NewAsset.AllowEffect,
		AllowBlock: NewAsset.AllowBlock,
		AllowType: NewAsset.AllowType,
		DefaultColor: NewAsset.DefaultColor,
		Audio: NewAsset.Audio,
		Category: NewAsset.Category,
		Fetish: NewAsset.Fetish,
		ArousalZone: (NewAsset.ArousalZone == null) ? AssetCurrentGroup.Name : NewAsset.ArousalZone,
		IsRestraint: (NewAsset.IsRestraint == null) ? ((AssetCurrentGroup.IsRestraint == null) ? false : AssetCurrentGroup.IsRestraint) : NewAsset.IsRestraint,
		BodyCosplay: (NewAsset.BodyCosplay == null) ? ((AssetCurrentGroup.BodyCosplay == null) ? false : AssetCurrentGroup.BodyCosplay) : NewAsset.BodyCosplay,
		OverrideBlinking: (NewAsset.OverrideBlinking == null) ? false : NewAsset.OverrideBlinking,
		DialogSortOverride: NewAsset.DialogSortOverride,
		DynamicDescription: (typeof NewAsset.DynamicDescription === 'function') ? NewAsset.DynamicDescription : function () { return this.Description },
		DynamicPreviewIcon: (typeof NewAsset.DynamicPreviewIcon === 'function') ? NewAsset.DynamicPreviewIcon : function () { return "" },
		DynamicAllowInventoryAdd: (typeof NewAsset.DynamicAllowInventoryAdd === 'function') ? NewAsset.DynamicAllowInventoryAdd : function () { return true },
		DynamicExpressionTrigger: (typeof NewAsset.DynamicExpressionTrigger === 'function') ? NewAsset.DynamicExpressionTrigger : function () { return this.ExpressionTrigger },
		DynamicName: (typeof NewAsset.DynamicName === 'function') ? NewAsset.DynamicName : function () { return this.Name },
		DynamicGroupName: (NewAsset.DynamicGroupName || AssetCurrentGroup.Name),
		DynamicActivity: (typeof NewAsset.DynamicActivity === 'function') ? NewAsset.DynamicActivity : function () { return NewAsset.Activity },
		DynamicAudio: (typeof NewAsset.DynamicAudio === 'function') ? NewAsset.DynamicAudio : null,
		CharacterRestricted: typeof NewAsset.CharacterRestricted === 'boolean' ? NewAsset.CharacterRestricted : false,
		AllowRemoveExclusive: typeof NewAsset.AllowRemoveExclusive === 'boolean' ? NewAsset.CharacterRestricted : false,
		InheritColor: NewAsset.InheritColor,
		DynamicBeforeDraw: (typeof NewAsset.DynamicBeforeDraw === 'boolean') ? NewAsset.DynamicBeforeDraw : false,
		DynamicAfterDraw: (typeof NewAsset.DynamicAfterDraw === 'boolean') ? NewAsset.DynamicAfterDraw : false,
		DynamicScriptDraw: (typeof NewAsset.DynamicScriptDraw === 'boolean') ? NewAsset.DynamicScriptDraw : false,
		HasType: (typeof NewAsset.HasType === 'boolean') ? NewAsset.HasType : true,
		AllowLockType: NewAsset.AllowLockType,
		AllowColorizeAll: typeof NewAsset.AllowColorizeAll === 'boolean' ? NewAsset.AllowColorizeAll : true,
		AvailableLocations: NewAsset.AvailableLocations || [],
	}
	A.Layer = AssetBuildLayer(NewAsset, A);
	AssetAssignColorIndices(A);
	// Unwearable assets are not visible but can be overwritten
	if (!A.Wear && NewAsset.Visible != true) A.Visible = false;
	Asset.push(A);
}

/**
 * Builds the layer array for an asset based on the asset definition. One layer is created for each drawable part of the asset (excluding
 * the lock). If the asset definition contains no layer definitions, a default layer definition will be created.
 * @param {Object} AssetDefinition - The raw asset definition
 * @param {Asset} A - The built asset
 * @return {Layer[]} - An array of layer objects representing the drawable layers of the asset
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
 * @return {Layer} - A Layer object representing the drawable properties of the given layer
 */
function AssetMapLayer(Layer, AssetDefinition, A, I) {
	return {
		Name: Layer.Name || null,
		AllowColorize: AssetLayerAllowColorize(Layer, AssetDefinition),
		CopyLayerColor: Layer.CopyLayerColor || null,
		ColorGroup: Layer.ColorGroup,
		HideColoring: typeof Layer.HideColoring === "boolean" ? Layer.HideColoring : false,
		AllowTypes: Array.isArray(Layer.AllowTypes) ? Layer.AllowTypes : null,
		HasType: typeof Layer.HasType === "boolean" ? Layer.HasType : A.HasType,
		ParentGroupName: Layer.ParentGroup,
		OverrideAllowPose: Array.isArray(Layer.OverrideAllowPose) ? Layer.OverrideAllowPose : null,
		Priority: Layer.Priority || AssetDefinition.Priority || AssetCurrentGroup.DrawingPriority,
		InheritColor: Layer.InheritColor,
		Alpha: AssetLayerAlpha(Layer, AssetDefinition, I),
		Asset: A,
		DrawingLeft: Layer.Left,
		DrawingTop: Layer.Top,
		HideAs: Layer.HideAs,
	};
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
 * Assigns colour indices to the layers of an asset. These determine which colours get applied to the layer. Also adds a count of colorable
 * layers to the asset definition.
 * @param {Object} A - The built asset
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

	// For each assets in the family
	var L = 0;
	for (let A = 0; A < Asset.length; A++)
		if (Asset[A].Group.Family == Family) {

			// Checks if the group matches
			if ((CSV[L] != null) && (CSV[L][0] != null) && (CSV[L][0].trim() != "") && (Asset[A].Group.Name == CSV[L][0].trim())) {

				// If we must put the group description
				if (((CSV[L][1] == null) || (CSV[L][1].trim() == "")) && ((CSV[L][2] != null) && (CSV[L][2].trim() != ""))) {
					Asset[A].Group.Description = CSV[L][2].trim();
					L++;
				}

				// If we must put the asset description
				if ((CSV[L][1] != null) && (CSV[L][1].trim() != "") && (CSV[L][2] != null) && (CSV[L][2].trim() != "")) {
					Asset[A].Description = CSV[L][2].trim();
					L++;
				}

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
function AssetLoad(A, Family) {

	// For each group in the asset file
	var G;
	for (G = 0; G < A.length; G++) {

		// Creates the asset group
		AssetGroupAdd(Family, A[G]);

		// Add each assets in the group 1 by 1
		var I;
		for (I = 0; I < A[G].Asset.length; I++)
			if (A[G].Asset[I].Name == null)
				AssetAdd({ Name: A[G].Asset[I] });
			else
				AssetAdd(A[G].Asset[I]);

	}

	// Loads the description of the assets in a specific language
	AssetLoadDescription(Family);

}

// Reset and load all the assets
function AssetLoadAll() {
	Asset = [];
	AssetGroup = [];
	AssetLoad(AssetFemale3DCG, "Female3DCG");
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
