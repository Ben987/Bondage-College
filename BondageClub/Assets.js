var Asset = [];
var AssetGroup = [];
var AssetCurrentGroup;

// Adds a new asset group to the main list
function AssetGroupAdd(NewAssetFamily, NewAssetGroupName, NewAssetParentGroupName, NewAssetCategory, NewAssetIsDefault, NewAssetGroupAllowNone, NewAssetGroupKeepNaked, NewAssetColorSchema, NewAssetParentColor, NewAssetDrawingPriority, NewAssetDrawingLeft, NewAssetDrawingTop, NewAssetDrawingFullAlpha, NewAssetDrawingBlink) {
	var A = {
		Family: NewAssetFamily,
		Name: NewAssetGroupName,
		ParentGroupName: (NewAssetParentGroupName == null) ? "" : NewAssetParentGroupName,
		Category: (NewAssetCategory == null) ? "Appearance" : NewAssetCategory,
		IsDefault: (NewAssetIsDefault == null) ? true : NewAssetIsDefault,
		AllowNone: (NewAssetGroupAllowNone == null) ? true : NewAssetGroupAllowNone,
		KeepNaked : (NewAssetGroupKeepNaked == null) ? false : NewAssetGroupKeepNaked,
		ColorSchema: (NewAssetColorSchema == null) ? ["Default"] : NewAssetColorSchema,
		ParentColor: (NewAssetParentColor == null) ? "" : NewAssetParentColor,
		DrawingPriority: (NewAssetDrawingPriority == null) ? 0 : NewAssetDrawingPriority,
		DrawingLeft: (NewAssetDrawingLeft == null) ? 0 : NewAssetDrawingLeft,
		DrawingTop: (NewAssetDrawingTop == null) ? 0 : NewAssetDrawingTop,
		DrawingFullAlpha: (NewAssetDrawingFullAlpha == null) ? true : NewAssetDrawingFullAlpha,
		DrawingBlink: (NewAssetDrawingBlink == null) ? false : NewAssetDrawingBlink
	}
	AssetGroup.push(A);
	AssetCurrentGroup = A;
}

// Adds a new asset to the main list
function AssetAdd(NewAssetName, NewAssetValue, NewAssetHeightModifier) {
	var A = {
		Group: AssetCurrentGroup,
		Name: NewAssetName,
		Value: (NewAssetValue == null) ? 0 : NewAssetValue,
		HeightModifier: (NewAssetHeightModifier == null) ? 0 : NewAssetHeightModifier
	}
	Asset.push(A);
}

// Loads a specific asset file
function AssetLoad(A, Family) {
	
	// For each group in the asset file
	var G;
	for (G = 0; G < A.length; G++) {
		
		// Creates the asset group
		AssetGroupAdd(Family, A[G].Group, A[G].ParentGroup, A[G].Category, A[G].Default, A[G].AllowNone, A[G].KeepNaked, A[G].Color, A[G].ParentColor, G, A[G].Left, A[G].Top, A[G].FullAlpha, A[G].Blink);

		// Add each assets in the group 1 by 1
		var I;
		for (I = 0; I < A[G].Asset.length; I++)
			if (A[G].Asset[I].Name == null)
				AssetAdd(A[G].Asset[I], 0, 0)
			else
				AssetAdd(A[G].Asset[I].Name, A[G].Asset[I].Value, A[G].Asset[I].Height);

	}
	
}

// Reset and load all the assets
function AssetLoadAll() {
	Asset = [];
	AssetGroup = [];
	AssetLoad(AssetFemale3DCG, "Female3DCG");
}