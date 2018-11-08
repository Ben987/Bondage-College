var Character = [];

// Loads a character in the buffer
function CharacterReset(CharacterID, CharacterAssetFamily) {

	// Prepares the character sheet
	var NewCharacter = {
		ID: CharacterID,
		Name: "",
		AssetFamily: CharacterAssetFamily,
		AccountName: "",
		AccountPassword: "",
		Inventory: [],
		Appearance: [],
		Canvas: null,
		CanvasBlink: null,
		BlinkFactor: Math.round(Math.random() * 10) + 10
	}

	// If the character doesn't exist, we create it
	if (CharacterID >= Character.length)
		Character.push(NewCharacter);
	else
		Character[CharacterID] = NewCharacter;

	// Creates the inventory and default appearance
	InventoryLoad(NewCharacter, null, true);
	CharacterAppearanceSetDefault(NewCharacter);
		
	// Load the character image
	CharacterLoadCanvas(NewCharacter);

}

// Sorts the character appearance by priority and loads the canvas
function CharacterLoadCanvas(C) {
	
	// Sorts the full appearance arraw first
	var App = [];
	var I;
	for (I = 0; I < 101 && App.length < C.Appearance.length; I++) {
		var A;
		for (A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset.Group.DrawingPriority == I)
				App.push(C.Appearance[A]);
	}	
	C.Appearance = App;
	
	// Reload the canvas
	CharacterAppearanceBuildCanvas(C);

}

// Reload all characters canvas
function CharacterLoadCanvasAll() {	
	var C;
	for (C = 0; C < Character.length; C++)
		CharacterLoadCanvas(Character[C]);
}