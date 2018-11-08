var CharacterAppearanceOffset = 0;
var CharacterAppearanceHeaderText = "Select your appearance";
var CharacterAppearanceBackup = null;

// Resets the character to it's default appearance
function CharacterAppearanceSetDefault(C) {

	// Resets the current appearance
	C.Appearance = [];

	// For each items in the character inventory
	var I;
	for (I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Asset.Group.Family == C.AssetFamily) && C.Inventory[I].Asset.Group.IsDefault) {

			// If there's no item in a slot, the first one becomes the default
			var MustWear = true;
			var A;
			for (A = 0; A < C.Appearance.length; A++)
				if (C.Appearance[A].Asset.Group.Name == C.Inventory[I].Asset.Group.Name)
					MustWear = false;

			// No item, we wear it with the default color
			if (MustWear) {
				var NA = {
					Asset: C.Inventory[I].Asset,
					Color: C.Inventory[I].Asset.Group.ColorSchema[0]
				}
				C.Appearance.push(NA);				
			}
			
		}
		
	// Loads the new character canvas
	CharacterLoadCanvas(C);
	
}

// Sets a full random set of items for a character
function CharacterAppearanceFullRandom(C) {

	// Clear the current appearance
	C.Appearance = [];

	// For each item group (non default items only show at a 20% rate)
	var A;
	for (A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].IsDefault || (Math.random() < 0.2)) {
		
			// Prepares an array of all possible items
			var R = [];
			var I;
			for (I = 0; I < C.Inventory.length; I++)
				if (C.Inventory[I].Asset.Group.Name == AssetGroup[A].Name)
					R.push(C.Inventory[I].Asset);
			
			// Picks a random item and color and add it
			if (R.length > 0) {
				var SelectedAsset = R[Math.round(Math.random() * (R.length - 1))];			
				var SelectedColor = SelectedAsset.Group.ColorSchema[Math.round(Math.random() * (SelectedAsset.Group.ColorSchema.length - 1))];
				if ((SelectedAsset.Group.ColorSchema[0] == "Default") && (Math.random() < 0.5)) SelectedColor = "Default";
				if (SelectedAsset.Group.ParentColor != "") SelectedColor = CharacterAppearanceGetCurrentValue(C, SelectedAsset.Group.ParentColor, "Color");
				var NA = {
					Asset: SelectedAsset,
					Color: SelectedColor
				}
				C.Appearance.push(NA);				
			}
			
		}

	// Loads the new character canvas
	CharacterLoadCanvas(C);
	
}

// Removes all items that can be removed, making the character naked
function CharacterAppearanceNaked(C) {

	// For each item group (non default items only show at a 20% rate)
	var A;
	for (A = 0; A < C.Appearance.length; A++)
		if (C.Appearance[A].Asset.Group.AllowNone && !C.Appearance[A].Asset.Group.KeepNaked) {
			C.Appearance.splice(A, 1);
			A--;
		}

	// Loads the new character canvas
	CharacterLoadCanvas(C);

}

// Gets the character 
function CharacterAppearanceBuildCanvas(C) {

	// Prepares both canvas (500x1000 for characters)
	if (C.Canvas == null) {
		C.Canvas = document.createElement("canvas");
		C.Canvas.width = 500;
		C.Canvas.height = 1000;
	} else C.Canvas.getContext("2d").clearRect(0, 0, 500, 1000);
	if (C.CanvasBlink == null) {
		C.CanvasBlink = document.createElement("canvas");
		C.CanvasBlink.width = 500;
		C.CanvasBlink.height = 1000;		
	} else C.CanvasBlink.getContext("2d").clearRect(0, 0, 500, 1000);
	
	// Loops in all items worn by the character
	var A;
	for (A = 0; A < C.Appearance.length; A++) {

		// If there's a father group, we must add it to find the correct image
		var CA = C.Appearance[A];
		var G = "";
		if (CA.Asset.Group.ParentGroupName != "") {
			var FG;
			for (FG = 0; FG < C.Appearance.length; FG++)
				if (CA.Asset.Group.ParentGroupName == C.Appearance[FG].Asset.Group.Name)
					G = "_" + C.Appearance[FG].Asset.Name;
		}
	
		// Draw the item on the canvas (default or empty means no special color, # means apply a color, regular text means we apply that text)
		if ((CA.Color == "Default") || (CA.Color == "")) {
			DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + CA.Asset.Name + G + ".png", C.Canvas.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop);
			if (!CA.Asset.Group.DrawingBlink) DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + CA.Asset.Name + G + ".png", C.CanvasBlink.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop);
		}
	    else {
			if (CA.Color.indexOf("#") != 0) {
				DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + CA.Asset.Name + G + "_" + CA.Color + ".png", C.Canvas.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop);
				if (!CA.Asset.Group.DrawingBlink) DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + CA.Asset.Name + G + "_" + CA.Color + ".png", C.CanvasBlink.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop);				
			}
			else {
				DrawImageCanvasColorize("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + CA.Asset.Name + G + ".png", C.Canvas.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop, 1, CA.Color, CA.Asset.Group.DrawingFullAlpha);
				if (!CA.Asset.Group.DrawingBlink) DrawImageCanvasColorize("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + CA.Asset.Name + G + ".png", C.CanvasBlink.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop, 1, CA.Color, CA.Asset.Group.DrawingFullAlpha);				
			}			
		}

	}

}

// Returns a value from the character current appearance
function CharacterAppearanceGetCurrentValue(C, Group, Type) {
	
	// Finds the value
	var A;
	for (A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset.Group.Family == C.AssetFamily) && (C.Appearance[A].Asset.Group.Name == Group)) {
			if (Type == "Name") return C.Appearance[A].Asset.Name;
			if (Type == "Color") return C.Appearance[A].Color;
			if (Type == "ID") return A;
		}
	return "None";

}

// Loads the character appearance screen
function CharacterAppearance_Load() {
	CharacterAppearanceBackup = JSON.parse(JSON.stringify(Character[0].Appearance));
}

// Run the characther appearance selection screen 
function CharacterAppearance_Run() {
	
	// Draw the background and the character twice
	DrawImage("Backgrounds/DressingRoom.jpg", 0, 0);
	DrawCharacter(Character[0], -500, -100, 4);
	DrawCharacter(Character[0], 900, 0, 1);
	DrawText(CharacterAppearanceHeaderText, 500, 40, "White", "Black");
	
	// Draw the top buttons with images
	DrawButton(1450, 25, 65, 65, "", "White", "Icons/Reset.png");
	DrawButton(1542, 25, 65, 65, "", "White", "Icons/Random.png");
	DrawButton(1634, 25, 65, 65, "", "White", "Icons/Naked.png");
	DrawButton(1726, 25, 65, 65, "", "White", "Icons/Next.png");
	DrawButton(1818, 25, 65, 65, "", "White", "Icons/Cancel.png");
	DrawButton(1910, 25, 65, 65, "", "White", "Icons/Ready.png");
	
	// Creates buttons for all groups
	var A;
	for (A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + 10; A++)
		if ((AssetGroup[A].Family == Character[0].AssetFamily) && (AssetGroup[A].Category == "Appearance")) {
			DrawButton(1450, 120 + (A - CharacterAppearanceOffset) * 85, 325, 60, AssetGroup[A].Name + ": " + CharacterAppearanceGetCurrentValue(Character[0], AssetGroup[A].Name, "Name"), "White", "");
			var Color = CharacterAppearanceGetCurrentValue(Character[0], AssetGroup[A].Name, "Color", "");
			if (Color.indexOf("#") == 0) DrawButton(1800, 120 + (A - CharacterAppearanceOffset) * 85, 175, 60, Color, Color);
			else DrawButton(1800, 120 + (A - CharacterAppearanceOffset) * 85, 175, 60, Color, "White", "");
		}

}

// Sets an item in the character appearance
function CharacterAppearanceSetItem(C, Group, ItemAsset) {
	
	// Removes the previous if we need to
	var ID = CharacterAppearanceGetCurrentValue(C, Group, "ID");
	var ItemColor;
	if (ID != "None") {
		ItemColor = CharacterAppearanceGetCurrentValue(C, Group, "Color");
		C.Appearance.splice(ID, 1);
	} else if (ItemAsset != null) ItemColor = ItemAsset.Group.ColorSchema[0];

	// Add the new item to the character appearance
	if (ItemAsset != null) {
		var NA = {
			Asset: ItemAsset,
			Color: ItemColor
		}
		C.Appearance.push(NA);
	}

	// Draw the character canvas
	CharacterLoadCanvas(C);
	
}

// Cycle in the player inventory to find the next item in a group and wear it
function CharacterAppearanceNextItem(C, Group) {
	
	// For each item, we first find the item and pick the next one
	var I;
	var Current = CharacterAppearanceGetCurrentValue(C, Group, "Name");
	var Found = (Current == "None");
	for (I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Asset.Group.Name == Group) && (C.Inventory[I].Asset.Group.Family == C.AssetFamily)) {
			if (Found) {
				CharacterAppearanceSetItem(C, Group, C.Inventory[I].Asset);
				return;				
			}
			else {
				if (C.Inventory[I].Asset.Name == Current)
					Found = true;
			}
		}
				
	// Since we didn't found any item, we pick "None" or the first item if we can't
	var A;
	for (A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == Group) {
			if (AssetGroup[A].AllowNone) {
				CharacterAppearanceSetItem(C, Group, null);
				return;				
			}
			else
				for (I = 0; I < C.Inventory.length; I++)
					if ((C.Inventory[I].Asset.Group.Name == Group) && (C.Inventory[I].Asset.Group.Family == C.AssetFamily)) {
						CharacterAppearanceSetItem(C, Group, C.Inventory[I].Asset);
						return;						
					}			
		}

}

// Find the next color for the item
function CharacterAppearanceNextColor(C, Group) {
	
	// For each item, we first find the item and pick the next one
	var Color = CharacterAppearanceGetCurrentValue(C, Group, "Color");
	var A;
	for (A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == Group) {
			
			// Finds the next color
			var Pos = AssetGroup[A].ColorSchema.indexOf(Color) + 1;
			if ((Pos < 0) || (Pos >= AssetGroup[A].ColorSchema.length)) Pos = 0;
			Color = AssetGroup[A].ColorSchema[Pos];

			// Sets the color
			for (Pos = 0; Pos < C.Appearance.length; Pos++)
				if ((C.Appearance[Pos].Asset.Group.Name == Group) && (C.Appearance[Pos].Asset.Group.Family == C.AssetFamily))
					C.Appearance[Pos].Color = Color;

			// Reloads the character canvas
			CharacterLoadCanvas(C);
			return;

		}

}

// Moves the offset to get new character appearance items
function CharacterAppearanceMoveOffset(Move) {
	CharacterAppearanceOffset = CharacterAppearanceOffset + Move;
	if (CharacterAppearanceOffset > AssetGroup.length) CharacterAppearanceOffset = 0;
	if (CharacterAppearanceOffset < 0) CharacterAppearanceOffset = Math.floor(AssetGroup.length / 10) * 10;
}

// When the user clicks on the character appearance selection screen
function CharacterAppearance_Click() {

	// If we must switch to the next item in the player inventory
	if ((MouseX >= 1450) && (MouseX < 1775) && (MouseY >= 120) && (MouseY < 950))
		for (A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + 10; A++)
			if ((AssetGroup[A].Family == Character[0].AssetFamily) && (AssetGroup[A].Category == "Appearance"))
				if ((MouseY >= 120 + (A - CharacterAppearanceOffset) * 85) && (MouseY <= 180 + (A - CharacterAppearanceOffset) * 85))
					CharacterAppearanceNextItem(Character[0], AssetGroup[A].Name);

	// If we must switch to the next item in the player inventory
	if ((MouseX >= 1800) && (MouseX < 1975) && (MouseY >= 120) && (MouseY < 950))
		for (A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + 10; A++)
			if ((AssetGroup[A].Family == Character[0].AssetFamily) && (AssetGroup[A].Category == "Appearance"))
				if ((MouseY >= 120 + (A - CharacterAppearanceOffset) * 85) && (MouseY <= 180 + (A - CharacterAppearanceOffset) * 85))
					CharacterAppearanceNextColor(Character[0], AssetGroup[A].Name);

	// If we must set back the default outfit or set a random outfit
	if ((MouseX >= 1450) && (MouseX < 1515) && (MouseY >= 25) && (MouseY < 90)) CharacterAppearanceSetDefault(Character[0]);
	if ((MouseX >= 1542) && (MouseX < 1607) && (MouseY >= 25) && (MouseY < 90)) CharacterAppearanceFullRandom(Character[0]);
	if ((MouseX >= 1634) && (MouseX < 1699) && (MouseY >= 25) && (MouseY < 90)) CharacterAppearanceNaked(Character[0]);
	if ((MouseX >= 1726) && (MouseX < 1791) && (MouseY >= 25) && (MouseY < 90)) CharacterAppearanceMoveOffset(10);
	if ((MouseX >= 1818) && (MouseX < 1883) && (MouseY >= 25) && (MouseY < 90)) CharacterAppearanceExit(Character[0]);
	if ((MouseX >= 1910) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 90)) CharacterAppearanceReady(Character[0]);

}

// When we exit the character appearance screen
function CharacterAppearanceExit(C) {
	
	// If we cancel, we restore the backup version
	if ((C.AccountName != "") && (C.AccountPassword != "")) {
		C.Appearance = CharacterAppearanceBackup;
		CharacterLoadCanvas(C);
		SetScreen("MainHall");
	} else SetScreen("CharacterLogin");

}

// When the player is ready, we make sure she at least has an outfit
function CharacterAppearanceReady(C) {
	
	// Make sure the character has one item of each default type
	var A;
	for (A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].IsDefault) {

			// Check to find at least one item from the group
			var Found = false;
			var P;
			for (P = 0; P < C.Appearance.length; P++)
				if (C.Appearance[P].Asset.Group.Name == AssetGroup[A].Name)
					Found = true;
			
			// If we didn't found the group, we warn the user
			if (!Found) {
				CharacterAppearanceHeaderText = "You must pick an item of type: " + AssetGroup[A].Name;
				return;				
			}
			
		}

	// If there's no error, we continue to the login or main hall if already logged
	if ((C.AccountName != "") && (C.AccountPassword != "")) {
		CharacterAppearanceSave(C);
		SetScreen("MainHall");
	} else SetScreen("CharacterCreation");

}

// Pushes the character appearance to the account service
function CharacterAppearanceSave(C) {
	
	// Creates a big parameter string of every appearance items 
	if (C.AccountName != "") {
		var P = "";
		for (A = 0; A < C.Appearance.length; A++)
			P = P + "&family" + A.toString() + "=" + C.Appearance[A].Asset.Group.Family + "&group" + A.toString() + "=" + C.Appearance[A].Asset.Group.Name + "&name" + A.toString() + "=" + C.Appearance[A].Asset.Name + "&color" + A.toString() + "=" + C.Appearance[A].Color;
		CharacterAccountRequest("appearance_update", P);
	}	

}

// Loads the character appearance from the JSON file
function CharacterAppearanceLoad(C, Appearance) {
	
	// Make sure we have something to load
	if (Appearance != null) {
	
		// For each appearance item to load
		var A;
		C.Appearance = [];
		for (A = 0; A < Appearance.length; A++) {

			// Cycles in all the assets to find the correct item to add and colorize it
			var I;
			for (I = 0; I < Asset.length; I++)
				if ((Asset[I].Name == Appearance[A].Name) && (Asset[I].Group.Name == Appearance[A].Group) && (Asset[I].Group.Family == Appearance[A].Family)) {
					var NA = {
						Asset: Asset[I],
						Color: Appearance[A].Color
					}
					C.Appearance.push(NA);
					break;
				}
				
		}

		// Draw the character canvas
		CharacterLoadCanvas(C);
		
	}

}

function CharacterAppearance_KeyDown() {
}
