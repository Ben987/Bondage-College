var Asset = [];
var AssetGroup = [];
var AssetCurrentGroup;

// Adds a new asset group to the main list
function AssetGroupAdd(NewAssetFamily, NewAsset) {
	var A = {
		Family: NewAssetFamily,
		Name: NewAsset.Group,
		Description: NewAsset.Group,
		ParentGroupName: (NewAsset.ParentGroup == null) ? "" : NewAsset.ParentGroup,
		Category: (NewAsset.Category == null) ? "Appearance" : NewAsset.Category,
		IsDefault: (NewAsset.Default == null) ? true : NewAsset.Default,
		AllowNone: (NewAsset.AllowNone == null) ? true : NewAsset.AllowNone,
		AllowColorize: (NewAsset.AllowColorize == null) ? true : NewAsset.AllowColorize,
		KeepNaked : (NewAsset.KeepNaked == null) ? false : NewAsset.KeepNaked,
		ColorSchema: (NewAsset.Color == null) ? ["Default"] : NewAsset.Color,
		ParentSize: (NewAsset.ParentSize == null) ? "" : NewAsset.ParentSize,
		ParentColor: (NewAsset.ParentColor == null) ? "" : NewAsset.ParentColor,
		Zone: NewAsset.Zone,
		SetPose: NewAsset.SetPose,
		AllowPose: NewAsset.AllowPose,
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
		Enable: (NewAsset.Enable == null) ? true : NewAsset.Enable,
		Visible: (NewAsset.Visible == null) ? true : NewAsset.Visible,
		Wear: (NewAsset.Wear == null) ? true : NewAsset.Wear,
		Effect: NewAsset.Effect,
		Block: NewAsset.Block,
		Hide: NewAsset.Hide,
		SetPose: NewAsset.SetPose,
		Value: (NewAsset.Value == null) ? 0 : NewAsset.Value,
		SelfBondage: (NewAsset.SelfBondage == null) ? true : NewAsset.SelfBondage,
		WearTime: (NewAsset.Time == null) ? 0 : NewAsset.Time,
		RemoveTime: (NewAsset.RemoveTime == null) ? ((NewAsset.Time == null) ? 0 : NewAsset.Time) : NewAsset.RemoveTime,
		DrawingPriority: NewAsset.Priority,
		HeightModifier: (NewAsset.Height == null) ? 0 : NewAsset.Height,
		Prerequisite: NewAsset.Prerequisite
	}
	Asset.push(A);
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

}

// Loads the description of the assets in a specific language
function AssetLoadDescription(Family) {

    // Finds the full path of the CSV file to use cache
    var FullPath = "Assets/" + Family + "/" + Family + "_" + CommonGetWorkingLanguage() + ".csv";    
    if (CommonCSVCache[FullPath]) {
		AssetBuildDescription(Family, CommonCSVCache[FullPath]);
        return;
    }
    
    // Opens the file, parse it and returns the result it to build the dialog
    CommonGet(FullPath, function() {
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
}