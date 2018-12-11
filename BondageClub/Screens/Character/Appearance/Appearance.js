var AppearanceBackground = "Dressing";
var CharacterAppearanceOffset = 0;
var CharacterAppearanceNumPerPage = 9;
var CharacterAppearanceHeaderText = "";
var CharacterAppearanceBackup = null;
var CharacterAppearanceAssets = [];
var CharacterAppearanceColorPicker = "";
var CharacterAppearanceColorPickerBackup = "";

// Builds all the assets that can be used to dress up the character
function CharacterAppearanceBuildAssets(C) {

	// Adds all items with 0 value and from the appearance category
	CharacterAppearanceAssets = [];
	for (var A = 0; A < Asset.length; A++)
		if ((Asset[A].Value == 0) && (Asset[A].Group.Family == C.AssetFamily) && (Asset[A].Group.Category == "Appearance"))
			CharacterAppearanceAssets.push(Asset[A]);
	for (var A = 0; A < C.Inventory.length; A++)
		if ((C.Inventory[A].Asset != null) && (C.Inventory[A].Asset.Group.Family == C.AssetFamily) && (C.Inventory[A].Asset.Group.Category == "Appearance"))
			CharacterAppearanceAssets.push(C.Inventory[A].Asset);

}

// Makes sure the character appearance is valid from inventory and cloth requirement
function CharacterAppearanceValidate(C) {
	
	// Remove any appearance item that's not in inventory
	var Refresh = false;
	for(var A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset.Value != 0) && (C.Appearance[A].Asset.Group.Category == "Appearance") && !InventoryAvailable(C, C.Appearance[A].Asset.Name, C.Appearance[A].Asset.Group.Name)) {
			C.Appearance.splice(A, 1);
			Refresh = true;
			A--;
		}

	// Dress back if there are missing appearance items
	for(var A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].IsDefault && (CharacterAppearanceGetCurrentValue(C, AssetGroup[A].Name, "Name") == "None"))
			for(var B = 0; B < Asset.length; B++)
				if (Asset[B].Group.Name == AssetGroup[A].Name) {
					C.Appearance.push({ Asset: Asset[B], Color: Asset[B].Group.ColorSchema[0] });
					Refresh = true;
					break;
				}
				
	// If we must refresh the character and push the appearance to the server
	if (Refresh) CharacterRefresh(C);

}

// Resets the character to it's default appearance
function CharacterAppearanceSetDefault(C) {

	// Resets the current appearance and prepares the assets
	C.Appearance = [];
	if (CharacterAppearanceAssets.length == 0) CharacterAppearanceBuildAssets(C);

	// For each items in the character appearance assets
	for (var I = 0; I < CharacterAppearanceAssets.length; I++)
		if (CharacterAppearanceAssets[I].Group.IsDefault) {

			// If there's no item in a slot, the first one becomes the default
			var MustWear = true;
			for (var A = 0; A < C.Appearance.length; A++)
				if (C.Appearance[A].Asset.Group.Name == CharacterAppearanceAssets[I].Group.Name)
					MustWear = false;

			// No item, we wear it with the default color
			if (MustWear) {
				var NA = {
					Asset: CharacterAppearanceAssets[I],
					Color: CharacterAppearanceAssets[I].Group.ColorSchema[0]
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
	for (var A = 0; A < C.Appearance.length; A++)
		if (C.Appearance[A].Asset.Group.Category == "Appearance") {
			C.Appearance.splice(A, 1);
			A--;
		}

	// For each item group (non default items only show at a 20% rate)
	for (var A = 0; A < AssetGroup.length; A++)
		if ((AssetGroup[A].Category == "Appearance") && (AssetGroup[A].IsDefault || (Math.random() < 0.2))) {
			
			// Get the parent size
			var ParentSize = "";
			if (AssetGroup[A].ParentSize != "") 
				ParentSize = CharacterAppearanceGetCurrentValue(C, AssetGroup[A].ParentSize, "Name");
		
			// Prepares an array of all possible items
			var R = [];
			for (var I = 0; I < CharacterAppearanceAssets.length; I++)
				if ((CharacterAppearanceAssets[I].Group.Name == AssetGroup[A].Name) && ((ParentSize == "") || (CharacterAppearanceAssets[I].Name == ParentSize)))
					R.push(CharacterAppearanceAssets[I]);

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
	for (var A = 0; A < C.Appearance.length; A++)
		if (C.Appearance[A].Asset.Group.AllowNone && !C.Appearance[A].Asset.Group.KeepNaked && (C.Appearance[A].Asset.Group.Category == "Appearance")) {
			C.Appearance.splice(A, 1);
			A--;
		}

	// Loads the new character canvas
	CharacterLoadCanvas(C);

}

// Returns the character appearance sorted by drawing priority
function CharacterAppearanceSort(AP) {
	var Arr = [];
	for(var P = 0; P < 50; P++)
		for(var A = 0; A < AP.length; A++)
			if (AP[A].Asset.DrawingPriority != null) {
				if (AP[A].Asset.DrawingPriority == P)
					Arr.push(AP[A]);				
			} else 
				if (AP[A].Asset.Group.DrawingPriority == P)
					Arr.push(AP[A]);
	return Arr;
}

function CharacterAppearanceVisibke(C, GroupName) {
	for (var A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset.Hide != null) && (C.Appearance[A].Asset.Hide.indexOf(GroupName) >= 0))
			return false;
	return true;
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
	
	// Sorts the list
	C.Appearance = CharacterAppearanceSort(C.Appearance);
	
	// Loops in all items worn by the character
	for (var A = 0; A < C.Appearance.length; A++) 
		if (CharacterAppearanceVisibke(C, C.Appearance[A].Asset.Group.Name)) {

			// If there's a father group, we must add it to find the correct image
			var CA = C.Appearance[A];
			var G = "";
			if (CA.Asset.Group.ParentGroupName != "")
				for (var FG = 0; FG < C.Appearance.length; FG++)
					if (CA.Asset.Group.ParentGroupName == C.Appearance[FG].Asset.Group.Name)
						G = "_" + C.Appearance[FG].Asset.Name;
			
			// If there's a pose style we must add
			var Pose = "";
			if ((CA.Asset.Group.AllowPose != null) && (CA.Asset.Group.AllowPose.length > 0) && (C.Pose != null) && (C.Pose.length > 0))
				for (var AP = 0; AP < CA.Asset.Group.AllowPose.length; AP++)
					for (var P = 0; P < C.Pose.length; P++)
						if (C.Pose[P] == CA.Asset.Group.AllowPose[AP])
							Pose = C.Pose[P] + "/";
			
			// Draw the item on the canvas (default or empty means no special color, # means apply a color, regular text means we apply that text)
			if (CA.Asset.Visible) {
				if ((CA.Color == "Default") || (CA.Color == "")) {
					DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + CA.Asset.Name + G + ".png", C.Canvas.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop);
					if (!CA.Asset.Group.DrawingBlink) DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + CA.Asset.Name + G + ".png", C.CanvasBlink.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop);
				}
				else {
					if (CA.Color.indexOf("#") != 0) {
						DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + CA.Asset.Name + G + "_" + CA.Color + ".png", C.Canvas.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop);
						if (!CA.Asset.Group.DrawingBlink) DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + CA.Asset.Name + G + "_" + CA.Color + ".png", C.CanvasBlink.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop);				
					}
					else {
						DrawImageCanvasColorize("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + CA.Asset.Name + G + ".png", C.Canvas.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop, 1, CA.Color, CA.Asset.Group.DrawingFullAlpha);
						if (!CA.Asset.Group.DrawingBlink) DrawImageCanvasColorize("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + CA.Asset.Name + G + ".png", C.CanvasBlink.getContext("2d"), CA.Asset.Group.DrawingLeft, CA.Asset.Group.DrawingTop, 1, CA.Color, CA.Asset.Group.DrawingFullAlpha);				
					}			
				}			
			}

		}

}

// Returns a value from the character current appearance
function CharacterAppearanceGetCurrentValue(C, Group, Type) {
	
	// Finds the value
	for (var A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset.Group.Family == C.AssetFamily) && (C.Appearance[A].Asset.Group.Name == Group)) {
			if (Type == "Name") return C.Appearance[A].Asset.Name;
			if (Type == "Description") return C.Appearance[A].Asset.Description;
			if (Type == "Color") return C.Appearance[A].Color;
			if (Type == "ID") return A;
			if (Type == "Effect") return C.Appearance[A].Asset.Effect;
			if (Type == "Asset") return C.Appearance[A].Asset;
			if (Type == "Full") return C.Appearance[A];
		}
	return "None";

}

// Loads the character appearance screen and keeps a backup of the previous appearance
function AppearanceLoad() {
	CharacterAppearanceBuildAssets(Player);
	CharacterAppearanceBackup = JSON.parse(JSON.stringify(Player.Appearance));
}

// Run the characther appearance selection screen 
function AppearanceRun() {
	
	// Draw the background and the character twice
	if (CharacterAppearanceHeaderText == "") CharacterAppearanceHeaderText = TextGet("SelectAppearance");
	DrawCharacter(Player, -550, -100, 4);
	DrawCharacter(Player, 800, 0, 1);
	DrawText(CharacterAppearanceHeaderText, 450, 40, "White", "Black");

	// Out of the color picker
	if (CharacterAppearanceColorPicker == "") {
	
		// Draw the top buttons with images
		DrawButton(1300, 25, 90, 90, "", "White", "Icons/Reset.png");
		DrawButton(1417, 25, 90, 90, "", "White", "Icons/Random.png");
		DrawButton(1534, 25, 90, 90, "", "White", "Icons/Naked.png");
		DrawButton(1651, 25, 90, 90, "", "White", "Icons/Next.png");
		
		// Creates buttons for all groups	
		for (var A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + CharacterAppearanceNumPerPage; A++)
			if ((AssetGroup[A].Family == Player.AssetFamily) && (AssetGroup[A].Category == "Appearance")) {
				DrawButton(1300, 145 + (A - CharacterAppearanceOffset) * 95, 400, 65, AssetGroup[A].Description + ": " + CharacterAppearanceGetCurrentValue(Player, AssetGroup[A].Name, "Description"), "White", "");
				var Color = CharacterAppearanceGetCurrentValue(Player, AssetGroup[A].Name, "Color", "");
				DrawButton(1725, 145 + (A - CharacterAppearanceOffset) * 95, 160, 65, Color, ((Color.indexOf("#") == 0) ? Color : "White"));
				DrawButton(1910, 145 + (A - CharacterAppearanceOffset) * 95, 65, 65, "", "White", AssetGroup[A].AllowColorize ? "Icons/Color.png" : "Icons/ColorBlocked.png");
			}

	} else {

		// Draws the color picker
		DrawText(CharacterAppearanceGetCurrentValue(Player, CharacterAppearanceColorPicker, "Color"), 1450, 75, "white", "black");
		DrawImage("Backgrounds/ColorPicker.png", 1300, 145);

	}

	// Draw the default buttons
	DrawButton(1768, 25, 90, 90, "", "White", "Icons/Cancel.png");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Accept.png");

}

// Sets an item in the character appearance
function CharacterAppearanceSetItem(C, Group, ItemAsset, NewColor) {
	
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
			Difficulty: ((ItemAsset == null) ? 0 : ItemAsset.Difficulty),
			Color: ((NewColor == null) ? ItemColor : NewColor)
		}
		C.Appearance.push(NA);
	}

	// Draw the character canvas and calculate the effects on the character
	CharacterRefresh(C);

}

// Cycle in the appearance assets to find the next item in a group and wear it
function CharacterAppearanceNextItem(C, Group) {
	
	// For each item, we first find the item and pick the next one
	var Current = CharacterAppearanceGetCurrentValue(C, Group, "Name");
	var Found = (Current == "None");
	for (var I = 0; I < CharacterAppearanceAssets.length; I++)
		if (CharacterAppearanceAssets[I].Group.Name == Group) {
			if (Found) {
				CharacterAppearanceSetItem(C, Group, CharacterAppearanceAssets[I]);
				return;				
			}
			else {
				if (CharacterAppearanceAssets[I].Name == Current)
					Found = true;
			}
		}
				
	// Since we didn't found any item, we pick "None" or the first item if we can't
	for (var A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == Group) {
			if (AssetGroup[A].AllowNone) {
				CharacterAppearanceSetItem(C, Group, null);
				return;				
			}
			else
				for (I = 0; I < CharacterAppearanceAssets.length; I++)
					if (CharacterAppearanceAssets[I].Group.Name == Group) {
						CharacterAppearanceSetItem(C, Group, CharacterAppearanceAssets[I]);
						return;						
					}			
		}

}

// Find the next color for the item
function CharacterAppearanceNextColor(C, Group) {
	
	// For each item, we first find the item and pick the next one
	var Color = CharacterAppearanceGetCurrentValue(C, Group, "Color");
	for (var A = 0; A < AssetGroup.length; A++)
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
	if (AssetGroup[CharacterAppearanceOffset].Category != "Appearance") CharacterAppearanceOffset = 0;
	if (CharacterAppearanceOffset < 0) CharacterAppearanceOffset = Math.floor(AssetGroup.length / CharacterAppearanceNumPerPage) * CharacterAppearanceNumPerPage;
}

// Sets the color for a specific group
function CharacterAppearanceSetColorForGroup(C, Color, Group) {
	for (var A = 0; A < C.Appearance.length; A++)
		if (C.Appearance[A].Asset.Group.Name == Group)
			C.Appearance[A].Color = Color;
	CharacterLoadCanvas(C);
}

// When the user clicks on the character appearance selection screen
function AppearanceClick() {

	// In regular mode
	if (CharacterAppearanceColorPicker == "") {

		// If we must switch to the next item in the assets
		if ((MouseX >= 1300) && (MouseX < 1700) && (MouseY >= 145) && (MouseY < 975))
			for (A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + CharacterAppearanceNumPerPage; A++)
				if ((AssetGroup[A].Family == Player.AssetFamily) && (AssetGroup[A].Category == "Appearance"))
					if ((MouseY >= 145 + (A - CharacterAppearanceOffset) * 95) && (MouseY <= 210 + (A - CharacterAppearanceOffset) * 95))
						CharacterAppearanceNextItem(Player, AssetGroup[A].Name);

		// If we must switch to the next item in the assets
		if ((MouseX >= 1725) && (MouseX < 1885) && (MouseY >= 145) && (MouseY < 975))
			for (A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + CharacterAppearanceNumPerPage; A++)
				if ((AssetGroup[A].Family == Player.AssetFamily) && (AssetGroup[A].Category == "Appearance"))
					if ((MouseY >= 145 + (A - CharacterAppearanceOffset) * 95) && (MouseY <= 210 + (A - CharacterAppearanceOffset) * 95))
						CharacterAppearanceNextColor(Player, AssetGroup[A].Name);

		// If we must switch to the next item in the assets
		if ((MouseX >= 1910) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 975))
			for (A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + CharacterAppearanceNumPerPage; A++)
				if ((AssetGroup[A].Family == Player.AssetFamily) && (AssetGroup[A].Category == "Appearance") && AssetGroup[A].AllowColorize)
					if ((MouseY >= 145 + (A - CharacterAppearanceOffset) * 95) && (MouseY <= 210 + (A - CharacterAppearanceOffset) * 95)) {
						CharacterAppearanceColorPicker = AssetGroup[A].Name;
						CharacterAppearanceColorPickerBackup = CharacterAppearanceGetCurrentValue(Player, CharacterAppearanceColorPicker, "Color");
					}

		// If we must set back the default outfit or set a random outfit
		if ((MouseX >= 1300) && (MouseX < 1390) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceSetDefault(Player);
		if ((MouseX >= 1417) && (MouseX < 1507) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceFullRandom(Player);
		if ((MouseX >= 1534) && (MouseX < 1624) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceNaked(Player);
		if ((MouseX >= 1651) && (MouseX < 1741) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceMoveOffset(CharacterAppearanceNumPerPage);
		if ((MouseX >= 1768) && (MouseX < 1858) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceExit(Player);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceReady(Player);

	} else {
		
		// In color picker mode, we can pick a color, cancel or accept the new color
		if ((MouseX >= 1300) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 975))
			CharacterAppearanceSetColorForGroup(Player, DrawRGBToHex(MainCanvas.getImageData(MouseX, MouseY, 1, 1).data), CharacterAppearanceColorPicker);
		if ((MouseX >= 1768) && (MouseX < 1858) && (MouseY >= 25) && (MouseY < 115)) {
			CharacterAppearanceSetColorForGroup(Player, CharacterAppearanceColorPickerBackup, CharacterAppearanceColorPicker);
			CharacterAppearanceColorPicker = "";			
		}
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) 
			CharacterAppearanceColorPicker = "";
		
	}

}

// When we cancel the character appearance edit, we restore the backup
function CharacterAppearanceExit(C) {
	C.Appearance = CharacterAppearanceBackup;
	CharacterLoadCanvas(C);
	if ((C.AccountName != "") && (C.AccountPassword != "")) CommonSetScreen("Room", "MainHall");
	else CommonSetScreen("Character", "Login");
}

// When the player is ready, we make sure she at least has an outfit
function CharacterAppearanceReady(C) {
	
	// Make sure the character has one item of each default type
	for (var A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].IsDefault) {

			// Check to find at least one item from the group
			var Found = false;
			for (var P = 0; P < C.Appearance.length; P++)
				if (C.Appearance[P].Asset.Group.Name == AssetGroup[A].Name)
					Found = true;

			// If we didn't found the group, we warn the user
			if (!Found) {
				CharacterAppearanceHeaderText = TextGet("MustPickItem") + " " + AssetGroup[A].Name;
				return;
			}

		}

	// If there's no error, we continue to the login or main hall if already logged
	if ((C.ID == 0) && (C.AccountName != "") && (C.AccountPassword != "")) {
		CharacterAppearanceSave(C);
		CommonSetScreen("Room", "MainHall");
	} else CommonSetScreen("Character", "Creation");

}

// Pushes the character appearance to the account service
function CharacterAppearanceSave(C) {
	
	// Creates a big parameter string of every appearance items 
	if ((C.ID == 0) && (C.AccountName != "") && (C.AccountPassword != "")) {
		var P = "&family=" + C.AssetFamily;
		for (A = 0; A < C.Appearance.length; A++)
			P = P + "&group" + A.toString() + "=" + C.Appearance[A].Asset.Group.Name + "&name" + A.toString() + "=" + C.Appearance[A].Asset.Name + "&color" + A.toString() + "=" + C.Appearance[A].Color;
		AccountRequest("appearance_update", P);
	}	

}

// Loads the character appearance from the JSON file
function CharacterAppearanceLoadFromAccount(C, Appearance) {
	
	// Make sure we have something to load
	if (Appearance != null) {
	
		// For each appearance item to load
		C.Appearance = [];
		for (var A = 0; A < Appearance.length; A++) {

			// Cycles in all the assets to find the correct item to add and colorize it
			var I;
			for (I = 0; I < Asset.length; I++)
				if ((Asset[I].Name == Appearance[A].Name) && (Asset[I].Group.Name == Appearance[A].Group) && (Asset[I].Group.Family == C.AssetFamily)) {
					var NA = {
						Asset: Asset[I],
						Color: Appearance[A].Color
					}
					C.Appearance.push(NA);
					break;
				}
				
		}

		// Draw the character canvas
		CharacterRefresh(C);

	}

}
