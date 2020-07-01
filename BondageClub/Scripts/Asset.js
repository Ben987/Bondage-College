"use strict";
var Asset = [];
var AssetGroup = [];
var AssetCurrentGroup;
var Pose = [];

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
		KeepNaked: (NewAsset.KeepNaked == null) ? false : NewAsset.KeepNaked,
		ColorSchema: (NewAsset.Color == null) ? ["Default"] : NewAsset.Color,
		ParentSize: (NewAsset.ParentSize == null) ? "" : NewAsset.ParentSize,
		ParentColor: (NewAsset.ParentColor == null) ? "" : NewAsset.ParentColor,
		Clothing: (NewAsset.Clothing == null) ? false : NewAsset.Clothing,
		Underwear: (NewAsset.Underwear == null) ? false : NewAsset.Underwear,
		BodyCosplay: (NewAsset.BodyCosplay == null) ? false : NewAsset.BodyCosplay,
		Activity: NewAsset.Activity,
		Zone: NewAsset.Zone,
		SetPose: NewAsset.SetPose,
		AllowPose: NewAsset.AllowPose,
		AllowExpression: NewAsset.AllowExpression,
		Effect: NewAsset.Effect,
		DrawingPriority: (NewAsset.Priority == null) ? AssetGroup.length : NewAsset.Priority,
		DrawingLeft: (NewAsset.Left == null) ? 0 : NewAsset.Left,
		DrawingTop: (NewAsset.Top == null) ? 0 : NewAsset.Top,
		DrawingFullAlpha: (NewAsset.FullAlpha == null) ? true : NewAsset.FullAlpha,
		DrawingBlink: (NewAsset.Blink == null) ? false : NewAsset.Blink
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
		Enable: (NewAsset.Enable == null) ? true : NewAsset.Enable,
		Visible: (NewAsset.Visible == null) ? true : NewAsset.Visible,
		Wear: (NewAsset.Wear == null) ? true : NewAsset.Wear,
		Activity: NewAsset.Activity,
		BuyGroup: NewAsset.BuyGroup,
		PrerequisiteBuyGroups: NewAsset.PrerequisiteBuyGroups,
		Effect: NewAsset.Effect,
		Bonus: NewAsset.Bonus,
		Block: NewAsset.Block,
		Expose: (NewAsset.Expose == null) ? [] : NewAsset.Expose,
		Hide: NewAsset.Hide,
		HideItem: NewAsset.HideItem,
		Require: NewAsset.Require,
		SetPose: NewAsset.SetPose,
		AllowPose: NewAsset.AllowPose,
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
		AllowLock: (NewAsset.AllowLock == null) ? false : NewAsset.AllowLock,
		IsLock: (NewAsset.IsLock == null) ? false : NewAsset.IsLock,
		OwnerOnly: (NewAsset.OwnerOnly == null) ? false : NewAsset.OwnerOnly,
		LoverOnly: (NewAsset.LoverOnly == null) ? false : NewAsset.LoverOnly,
		ExpressionTrigger: NewAsset.ExpressionTrigger,
		Layer: AssetBuildLayer(NewAsset.Layer),
		RemoveItemOnRemove : (NewAsset.RemoveItemOnRemove == null) ? [] : NewAsset.RemoveItemOnRemove,
		AllowEffect: NewAsset.AllowEffect,
		AllowBlock: NewAsset.AllowBlock,
		AllowType: NewAsset.AllowType,
		DefaultColor: NewAsset.DefaultColor,
		Audio: NewAsset.Audio,
		ArousalZone: (NewAsset.ArousalZone == null) ? AssetCurrentGroup.Name : NewAsset.ArousalZone, 
		IgnoreParentGroup: (NewAsset.IgnoreParentGroup == null) ? false : NewAsset.IgnoreParentGroup,
		IsRestraint: (NewAsset.IsRestraint == null) ? ((AssetCurrentGroup.IsRestraint == null) ? false : AssetCurrentGroup.IsRestraint) : NewAsset.IsRestraint,
		BodyCosplay: NewAsset.BodyCosplay == null ? false : NewAsset.BodyCosplay,
		DynamicDescription: (typeof NewAsset.DynamicDescription === 'function') ? NewAsset.DynamicDescription : function () { return this.Description },
		DynamicPreviewIcon: (typeof NewAsset.DynamicPreviewIcon === 'function') ? NewAsset.DynamicPreviewIcon : function () { return "" },
		DynamicAllowInventoryAdd: (typeof NewAsset.DynamicAllowInventoryAdd === 'function') ? NewAsset.DynamicAllowInventoryAdd : function () { return true },
		DynamicExpressionTrigger: (typeof NewAsset.DynamicExpressionTrigger === 'function') ? NewAsset.DynamicExpressionTrigger : function () { return this.ExpressionTrigger }, 
		DynamicName: (typeof NewAsset.DynamicName === 'function') ? NewAsset.DynamicName : function () { return this.Name },
		DynamicGroupName: (NewAsset.DynamicGroupName || AssetCurrentGroup.Name),
		DynamicActivity: (typeof NewAsset.DynamicActivity === 'function') ? NewAsset.DynamicActivity : function () { return NewAsset.Activity }
	}
	// Unwearable assets are not visible but can be overwritten
	if (!A.Wear && NewAsset.Visible != true) A.Visible = false;
	Asset.push(A);
}

// Builds layers for an asset
function AssetBuildLayer(NewLayers) {
	if (NewLayers == null || !Array.isArray(NewLayers)) return null;
	var Layers = [];
	for (var L = 0; L < NewLayers.length; L++) {
		var Layer = NewLayers[L];
		Layers.push({
			Name: Layer.Name,
			AllowColorize: (Layer.AllowColorize == null) ? true : Layer.AllowColorize,
			AllowTypes: (Layer.AllowTypes == null || !Array.isArray(Layer.AllowTypes)) ? [""] : Layer.AllowTypes,
			HasExpression: (Layer.HasExpression == null) ? true : Layer.HasExpression,
			HasType: (Layer.HasType == null) ? true : Layer.HasType,
			NewParentGroupName: Layer.NewParentGroupName,
			OverrideAllowPose: (Layer.OverrideAllowPose == null || !Array.isArray(Layer.OverrideAllowPose)) ? null : Layer.OverrideAllowPose
		});
	}
	return Layers;
}

// Builds the asset description from the CSV file
function AssetBuildDescription(Family, CSV) {

	// For each assets in the family
	var L = 0;
	for (var A = 0; A < Asset.length; A++)
		if (Asset[A].Group.Family == Family) {

			// Checks if the group matches
			if ((CSV[L][0] != null) && (CSV[L][0].trim() != "") && (Asset[A].Group.Name == CSV[L][0].trim())) {

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
	for (var A = 0; A < Asset.length; A++)
		if ((Asset[A].Name == Name) && (Asset[A].Group.Name == Group) && (Asset[A].Group.Family == Family))
			return Asset[A];
	return null;
}

// Gets an activity asset by family and name
function AssetGetActivity(Family, Name) {
	if (Family == "Female3DCG")
		for (var A = 0; A < ActivityFemale3DCG.length; A++)
			if (ActivityFemale3DCG[A].Name == Name)
				return ActivityFemale3DCG[A];
	return null;
}