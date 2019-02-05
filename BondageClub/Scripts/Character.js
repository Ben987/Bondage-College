"use strict";
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
		Owner: "",
		Lover: "",
		Money: 0,
		Inventory: [],		
		Appearance: [],
		Stage: "0",
		CurrentDialog: "",
		Dialog: [],
		Reputation: [],
		Skill: [],
		Pose: [],
		Effect: [],
		FocusGroup: null,
		Canvas: null,
		CanvasBlink: null,
		BlinkFactor: Math.round(Math.random() * 10) + 10,
		AllowItem: true,
		HeightModifier: 0,
		CanTalk : function() { return ((this.Effect.indexOf("GagLight") < 0) && (this.Effect.indexOf("GagNormal") < 0) && (this.Effect.indexOf("GagHeavy") < 0) && (this.Effect.indexOf("GagTotal") < 0)) },
		CanWalk : function() { return ((this.Effect.indexOf("Freeze") < 0) && ((this.Pose == null) || (this.Pose.indexOf("Kneel") < 0))) },
		CanKneel : function() { return ((this.Effect.indexOf("Freeze") < 0) && ((this.Pose == null) || (this.Pose.indexOf("LegsClosed") < 0))) },
		CanInteract : function() { return (this.Effect.indexOf("Block") < 0) },
		IsProne : function() { return (this.Effect.indexOf("Prone") >= 0) },
		IsRestrained : function() { return ((this.Effect.indexOf("Freeze") >= 0) || (this.Effect.indexOf("Block") >= 0) || (this.Effect.indexOf("Prone") >= 0)) },
		IsBlind : function() { return ((Player.Effect.indexOf("BlindLight") >= 0) || (Player.Effect.indexOf("BlindNormal") >= 0) || (Player.Effect.indexOf("BlindHeavy") >= 0)) },
		IsChaste : function() { return ((this.Effect.indexOf("Chaste") >= 0) || (this.Effect.indexOf("BreastChaste") >= 0)) },
		IsVulvaChaste : function() { return (this.Effect.indexOf("Chaste") >= 0) },
		IsBreastChaste : function() { return (this.Effect.indexOf("BreastChaste") >= 0) },
		IsOwned : function() { return ((this.Owner != null) && (this.Owner.trim() != "")) }
	}

	// If the character doesn't exist, we create it
	if (CharacterID >= Character.length)
		Character.push(NewCharacter);
	else
		Character[CharacterID] = NewCharacter;

	// Creates the inventory and default appearance
	if (CharacterID == 0) {
		Player = NewCharacter;
		CharacterAppearanceSetDefault(NewCharacter);
	}
		
	// Load the character image
	CharacterLoadCanvas(NewCharacter);

}

// Creates a random name for the character
function CharacterRandomName(C) {

	// Generates a name from the name bank 
	var NewName = CharacterName[Math.floor(Math.random() * CharacterName.length)];
	C.Name = NewName;
	
	// If the name is already taken, we generate a new one
	for (var CN = 0; CN < Character.length; CN++)
		if ((Character[CN].Name == NewName) && (Character[CN].ID != C.ID)) {
			CharacterRandomName(C)
			return;
		}

}

// Builds the dialog objects from the CSV files
function CharacterBuildDialog(C, CSV) {

	// For each lines in the file
	C.Dialog = [];
	for (var L = 0; L < CSV.length; L++)
		if ((CSV[L][0] != null) && (CSV[L][0] != "")) {

			// Creates a dialog object
			var D = {};
			D.Stage = CSV[L][0];
			if ((CSV[L][1] != null) && (CSV[L][1].trim() != "")) D.NextStage = CSV[L][1];
			if ((CSV[L][2] != null) && (CSV[L][2].trim() != "")) D.Option = CSV[L][2].replace("DialogCharacterName", C.Name).replace("DialogPlayerName", Player.Name);
			if ((CSV[L][3] != null) && (CSV[L][3].trim() != "")) D.Result = CSV[L][3].replace("DialogCharacterName", C.Name).replace("DialogPlayerName", Player.Name);
			if ((CSV[L][4] != null) && (CSV[L][4].trim() != "")) D.Function = ((CSV[L][4].trim().substring(0, 6) == "Dialog") ? "" : CurrentScreen) + CSV[L][4];
			if ((CSV[L][5] != null) && (CSV[L][5].trim() != "")) D.Prerequisite = CSV[L][5];
			if ((CSV[L][6] != null) && (CSV[L][6].trim() != "")) D.Group = CSV[L][6];
			if ((CSV[L][7] != null) && (CSV[L][7].trim() != "")) D.Trait = CSV[L][7];
			C.Dialog.push(D);

		}

}

// Loads a CSV file to build the character dialog
function CharacterLoadCSVDialog(C) {

    // Finds the full path of the CSV file to use cache
    var FullPath = ((C.ID == 0) ? "Screens/Character/Player/Dialog_Player" : "Screens/" + CurrentModule + "/" + CurrentScreen + "/Dialog_" + C.AccountName) + "_" + CommonGetWorkingLanguage() + ".csv";    
    if (CommonCSVCache[FullPath]) {
		CharacterBuildDialog(C, CommonCSVCache[FullPath]);
        return;
    }
    
    // Opens the file, parse it and returns the result it to build the dialog
    CommonGet(FullPath, function() {
        if (this.status == 200) {
            CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
			CharacterBuildDialog(C, CommonCSVCache[FullPath]);
        }
    });
	
}

// Loads a wardrobe character from storage
function CharacterLoadFromStorage(StorageName) {

	// Checks if the NPC already exists and returns it if it's the case
	for (var C = 0; C < Character.length; C++)
		if (Character[C].AccountName == "Template-" + StorageName)
			return Character[C];
		
	// Gets the character from storage
	CharacterReset(Character.length, "Female3DCG");
	C = Character[Character.length - 1];
	C.AccountName = "Template-" + StorageName;
	CharacterAppearanceBuildAssets(C);
	
	// If there's a saved version, we take it, if not we randomize the slot
	var App = JSON.parse(localStorage.getItem(StorageName));
	if (App != null) {
		C.Appearance = [];
		for(var A = 0; A < App.length; A++)
			if ((App[A].Asset != null) && (App[A].Asset.Group.Category == "Appearance"))
				if ((App[A].Asset.Value == 0) || InventoryAvailable(Player, App[A].Asset.Name, App[A].Asset.Group.Name))
					C.Appearance.push(App[A]);
	}
	else
		CharacterAppearanceFullRandom(C);
	return C;

}

// Loads in the NPC character in the buffer
function CharacterLoadNPC(NPCType) {

	// Checks if the NPC already exists and returns it if it's the case
	for (var C = 0; C < Character.length; C++)
		if (Character[C].AccountName == NPCType)
			return Character[C];

	// Randomize the new character
	CharacterReset(Character.length, "Female3DCG");
	C = Character[Character.length - 1];
	C.AccountName = NPCType;
	CharacterLoadCSVDialog(C);
	CharacterRandomName(C);
	CharacterAppearanceBuildAssets(C);
	CharacterAppearanceFullRandom(C);
	
	// Maid archetype
	if (NPCType.indexOf("Maid") >= 0) {
		InventoryAdd(C, "MaidOutfit1", "Cloth");
		CharacterAppearanceSetItem(C, "Cloth", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, "Default", "Cloth");
		InventoryAdd(C, "MaidHairband1", "Hat");
		CharacterAppearanceSetItem(C, "Hat", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, "Default", "Hat");
		C.AllowItem = (LogQuery("LeadSorority", "Maid"));
	}

	// Mistress archetype
	if (NPCType.indexOf("Mistress") >= 0) {
		var ColorList = ["#333333", "#AA4444", "#AAAAAA"];
		var Color = CommonRandomItemFromList("", ColorList);
		CharacterAppearanceSetItem(C, "Hat", null);
		InventoryAdd(C, "MistressGloves", "Gloves");
		CharacterAppearanceSetItem(C, "Gloves", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, Color, "Gloves");
		InventoryAdd(C, "MistressBoots", "Shoes");
		CharacterAppearanceSetItem(C, "Shoes", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, Color, "Shoes");
		InventoryAdd(C, "MistressTop", "Cloth");
		CharacterAppearanceSetItem(C, "Cloth", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, Color, "Cloth");
		InventoryAdd(C, "MistressBottom", "ClothLower");
		CharacterAppearanceSetItem(C, "ClothLower", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, Color, "ClothLower");
	}
	
	// Returns the new character
	return C;
	
}

// Deletes an NPC from the buffer
function CharacterDelete(NPCType) {
	for (var C = 0; C < Character.length; C++)
		if (Character[C].AccountName == NPCType) {
			Character.splice(C, 1);
			return;
		}
}

// Adds new effects on a character if it's not already there
function CharacterAddPose(C, NewPose) {
	for (var E = 0; E < NewPose.length; E++)
		if (C.Pose.indexOf(NewPose[E]) < 0)
			C.Pose.push(NewPose[E]);
}

// Resets the current pose list on a character
function CharacterLoadPose(C) {	
	C.Pose = [];
	if (C.ActivePose != null) C.Pose.push(C.ActivePose);
	for (var A = 0; A < C.Appearance.length; A++) {
		if (C.Appearance[A].Asset.SetPose != null)
			CharacterAddPose(C, C.Appearance[A].Asset.SetPose);
		else
			if (C.Appearance[A].Asset.Group.SetPose != null)
				CharacterAddPose(C, C.Appearance[A].Asset.Group.SetPose);
	}	
}

// Adds new effects on a character if it's not already there
function CharacterAddEffect(C, NewEffect) {
	for (var E = 0; E < NewEffect.length; E++)
		if (C.Effect.indexOf(NewEffect[E]) < 0)
			C.Effect.push(NewEffect[E]);
}

// Resets the current effect list on a character
function CharacterLoadEffect(C) {	
	C.Effect = [];
	for (var A = 0; A < C.Appearance.length; A++) {
		if (C.Appearance[A].Asset.Effect != null)
			CharacterAddEffect(C, C.Appearance[A].Asset.Effect);
		else
			if (C.Appearance[A].Asset.Group.Effect != null)
				CharacterAddEffect(C, C.Appearance[A].Asset.Group.Effect);
	}	
}

// Sorts the character appearance by priority and loads the canvas
function CharacterLoadCanvas(C) {
		
	// Sorts the full appearance arraw first
	var App = [];
	for (var I = 0; I < 101 && App.length < C.Appearance.length; I++)
		for (var A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset.Group.DrawingPriority == I)
				App.push(C.Appearance[A]);
	C.Appearance = App;
	
	// Sets the total height modifier for that character
	C.HeightModifier = 0;
	for (var A = 0; A < C.Appearance.length; A++)
		C.HeightModifier = C.HeightModifier + C.Appearance[A].Asset.HeightModifier;	
	if (C.Pose != null)
		for (var A = 0; A < C.Pose.length; A++)
			for (var P = 0; P < Pose.length; P++)
				if (Pose[P].Name == C.Pose[A])
					if (Pose[P].OverrideHeight != null)
						C.HeightModifier = Pose[P].OverrideHeight;

	// Reload the canvas
	CharacterAppearanceBuildCanvas(C);

}

// Reload all characters canvas
function CharacterLoadCanvasAll() {
	for (var C = 0; C < Character.length; C++)
		CharacterLoadCanvas(Character[C]);
}

// Sets the current character for conversation with introduction
function CharacterSetCurrent(C) {
	CurrentCharacter = C;
	var NewDialog = DialogIntro();
	if (!Player.CanTalk()) NewDialog = DialogFind(CurrentCharacter, "PlayerGagged", "");
	if (NewDialog != "") C.CurrentDialog = NewDialog;
}

// Changes the character money and sync with the account server
function CharacterChangeMoney(C, Value) {
	C.Money = parseInt(C.Money) + parseInt(Value) * ((Value > 0) ? CheatFactor("DoubleMoney", 2) : 1);
	AccountSync();
}

// Refreshes the character parameters
function CharacterRefresh(C) {	
	CharacterLoadEffect(C);
	CharacterLoadPose(C);	
	CharacterLoadCanvas(C);
	if (CurrentModule != "Character") CharacterAppearanceSave(C);
}

// Removes all appearance items from the character
function CharacterNaked(C) {
	CharacterAppearanceNaked(C);
	AssetReload(C);
	C.Appearance = CharacterAppearanceSort(C.Appearance);
	CharacterRefresh(C);
}

// Removes all appearance items from the character
function CharacterIsNaked(C) {
	for(var A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Category == "Appearance") && C.Appearance[A].Asset.Group.AllowNone && !C.Appearance[A].Asset.Group.KeepNaked) 
			return false;
	return true;
}

// Removes all appearance items from the character expect underwear
function CharacterUnderwear(C, Appearance) {
	CharacterAppearanceNaked(C);
	for(var A = 0; A < Appearance.length; A++)
		if ((Appearance[A].Asset != null) && Appearance[A].Asset.Group.Underwear && (Appearance[A].Asset.Group.Category == "Appearance"))
			C.Appearance.push(Appearance[A]);
	AssetReload(C);
	C.Appearance = CharacterAppearanceSort(C.Appearance);
	CharacterRefresh(C);
}

// Redress the character based on a specific appearance object
function CharacterDress(C, Appearance) {
	for(var A = 0; A < Appearance.length; A++)
		if ((Appearance[A].Asset != null) && (Appearance[A].Asset.Group.Category == "Appearance"))
			if (InventoryGet(C, Appearance[A].Asset.Group.Name) == null)
				C.Appearance.push(Appearance[A]);
	AssetReload(C);
	C.Appearance = CharacterAppearanceSort(C.Appearance);
	CharacterRefresh(C);
}

// Removes any binding item from the character
function CharacterRelease(C) {
	for(var E = 0; E < C.Appearance.length; E++)
		if ((C.Appearance[E].Asset.Group.Name == "ItemMouth") || (C.Appearance[E].Asset.Group.Name == "ItemArms") || (C.Appearance[E].Asset.Group.Name == "ItemFeet") || (C.Appearance[E].Asset.Group.Name == "ItemLegs") || (C.Appearance[E].Asset.Group.Name == "ItemHead") || (C.Appearance[E].Asset.Group.Name == "ItemMisc")) {
			C.Appearance.splice(E, 1);
			E--;
		}
	CharacterRefresh(C);
}

// Returns the best bonus factor available
function CharacterGetBonus(C, BonusType) {
	var Bonus = 0;
	for(var I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Asset != null) && (C.Inventory[I].Asset.Bonus != null))
			for(var B = 0; B < C.Inventory[I].Asset.Bonus.length; B++)
				if ((C.Inventory[I].Asset.Bonus[B].Type == BonusType) && (C.Inventory[I].Asset.Bonus[B].Factor > Bonus))
					Bonus = C.Inventory[I].Asset.Bonus[B].Factor;
	return Bonus;
}

// Fully restrain a character with random items
function CharacterFullRandomRestrain(C, Ratio) {
	
	// Sets the ratio depending on the parameter
	var RatioRare = 0.75;
	var RatioNormal = 0.25;	
	if (Ratio != null) {
		if (Ratio.trim().toUpperCase() == "FEW") { RatioRare = 1; RatioNormal = 0.5; }
		if (Ratio.trim().toUpperCase() == "LOT") { RatioRare = 0.5; RatioNormal = 0; }
		if (Ratio.trim().toUpperCase() == "ALL") { RatioRare = 0; RatioNormal = 0; }
	}
	
	// Apply each item if needed
	if (InventoryGet(C, "ItemArms") == null) InventoryWearRandom(C, "ItemArms");
	if ((Math.random() >= RatioRare) && (InventoryGet(C, "ItemHead") == null)) InventoryWearRandom(C, "ItemHead");
	if ((Math.random() >= RatioNormal) && (InventoryGet(C, "ItemMouth") == null)) InventoryWearRandom(C, "ItemMouth");
	if ((Math.random() >= RatioRare) && (InventoryGet(C, "ItemNeck") == null)) InventoryWearRandom(C, "ItemNeck");
	if ((Math.random() >= RatioNormal) && (InventoryGet(C, "ItemLegs") == null)) InventoryWearRandom(C, "ItemLegs");
	if ((Math.random() >= RatioNormal) && (InventoryGet(C, "ItemFeet") == null)) InventoryWearRandom(C, "ItemFeet");

}

// Sets a new pose for the character
function CharacterSetActivePose(C, NewPose) {
	C.ActivePose = NewPose;
	CharacterRefresh(C);
}
