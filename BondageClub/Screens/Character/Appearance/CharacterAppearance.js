"use strict";

var CharacterAppearanceOffset = 0;
var CharacterAppearanceNumPerPage = 9;
var CharacterAppearanceHeaderText = "";
var CharacterAppearanceBackup = null;
var CharacterAppearanceAssets = [];
var CharacterAppearanceColorPicker = "";
var CharacterAppearanceColorPickerBackup = "";
var CharacterAppearanceColorPickerRefreshTimer = null;
var CharacterAppearanceSelection = null;
var CharacterAppearanceReturnRoom = "MainHall";
var CharacterAppearanceReturnModule = "Room";
var CharacterAppearanceWardrobeOffset = 0;
var CharacterAppearanceWardrobeMode = false;
var CharacterAppearanceWardrobeText = "";

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

// Makes sure the character appearance is valid from inventory and asset requirement
function CharacterAppearanceValidate(C) {

	// Remove any appearance item that's not in inventory
	var Refresh = false;
	for (var A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset.Value != 0) && (C.Appearance[A].Asset.Group.Category == "Appearance") && !InventoryAvailable(C, C.Appearance[A].Asset.Name, C.Appearance[A].Asset.Group.Name)) {
			C.Appearance.splice(A, 1);
			Refresh = true;
			A--;
		}

	// Remove items flagged as "Remove At Login"
	if (!Player.GameplaySettings || !Player.GameplaySettings.DisableAutoRemoveLogin)
		for (var A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset.RemoveAtLogin) {
				C.Appearance.splice(A, 1);
				Refresh = true;
				A--;
			}

	// Dress back if there are missing appearance items
	for (var A = 0; A < AssetGroup.length; A++)
		if (!AssetGroup[A].AllowNone && (CharacterAppearanceGetCurrentValue(C, AssetGroup[A].Name, "Name") == "None"))
			for (var B = 0; B < Asset.length; B++)
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

// Returns TRUE if the item group is required from
function CharacterAppearanceRequired(C, GroupName) {
	for (var A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset.Require != null) && (C.Appearance[A].Asset.Require.indexOf(GroupName) >= 0))
			return true;
	return false;
}

// Returns TRUE if the item group must be hidden and not chosen
function CharacterAppearanceMustHide(C, GroupName) {
	for (var A = 0; A < C.Appearance.length; A++) {
		if ((C.Appearance[A].Asset.Hide != null) && (C.Appearance[A].Asset.Hide.indexOf(GroupName) >= 0)) return true;
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.Hide != null) && (C.Appearance[A].Property.Hide.indexOf(GroupName) >= 0)) return true;
	}
	return false;
}

// Sets a full random set of items for a character
function CharacterAppearanceFullRandom(C, ClothOnly) {

	// Clear the current appearance
	for (var A = 0; A < C.Appearance.length; A++)
		if (C.Appearance[A].Asset.Group.Category == "Appearance")
			if ((ClothOnly == null) || (C.Appearance[A].Asset.Group.AllowNone)) {
				C.Appearance.splice(A, 1);
				A--;
			}

	// For each item group (non default items only show at a 20% rate, if it can occasionally happen)
	for (var A = 0; A < AssetGroup.length; A++)
		if ((AssetGroup[A].Category == "Appearance") && (AssetGroup[A].IsDefault || (AssetGroup[A].Random && Math.random() < 0.2) || CharacterAppearanceRequired(C, AssetGroup[A].Name)) && (!CharacterAppearanceMustHide(C, AssetGroup[A].Name) || !AssetGroup[A].AllowNone) && (CharacterAppearanceGetCurrentValue(C, AssetGroup[A].Name, "Name") == "None")) {

			// Get the parent size
			var ParentSize = "";
			if (AssetGroup[A].ParentSize != "")
				ParentSize = CharacterAppearanceGetCurrentValue(C, AssetGroup[A].ParentSize, "Name");

			// Check for a parent
			var R = [];
			for (var I = 0; I < CharacterAppearanceAssets.length; I++)
				if ((CharacterAppearanceAssets[I].Group.Name == AssetGroup[A].Name) && (CharacterAppearanceAssets[I].ParentItem != null) && ((ParentSize == "") || (CharacterAppearanceAssets[I].Name == ParentSize)))
					for (var P = 0; P < C.Appearance.length; P++)
						if (C.Appearance[P].Asset.Name == CharacterAppearanceAssets[I].ParentItem)
							R.push(CharacterAppearanceAssets[I]);

			// Since there was no parent, get all the possible items
			if (R.length == 0)
				for (var I = 0; I < CharacterAppearanceAssets.length; I++)
					if ((CharacterAppearanceAssets[I].Group.Name == AssetGroup[A].Name) && (CharacterAppearanceAssets[I].ParentItem == null) && ((ParentSize == "") || (CharacterAppearanceAssets[I].Name == ParentSize)))
						R.push(CharacterAppearanceAssets[I]);

			// Picks a random item and color and add it
			if (R.length > 0) {
				var SelectedAsset = R[Math.round(Math.random() * (R.length - 1))];
				var SelectedColor = SelectedAsset.Group.ColorSchema[Math.round(Math.random() * (SelectedAsset.Group.ColorSchema.length - 1))];
				if ((SelectedAsset.Group.ColorSchema[0] == "Default") && (Math.random() < 0.5)) SelectedColor = "Default";
				if (SelectedAsset.Group.ParentColor != "")
					if (CharacterAppearanceGetCurrentValue(C, SelectedAsset.Group.ParentColor, "Color") != "None")
						SelectedColor = CharacterAppearanceGetCurrentValue(C, SelectedAsset.Group.ParentColor, "Color");
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
	for (var P = 0; P < 50; P++)
		for (var A = 0; A < AP.length; A++)
			if (AP[A].Asset.DrawingPriority != null) {
				if (AP[A].Asset.DrawingPriority == P)
					Arr.push(AP[A]);
			} else
				if (AP[A].Asset.Group.DrawingPriority == P)
					Arr.push(AP[A]);
	return Arr;
}

// Returns TRUE if we can show the item group
function CharacterAppearanceVisible(C, AssetName, GroupName) {
	for (var A = 0; A < C.Appearance.length; A++) {
		if ((C.Appearance[A].Asset.Hide != null) && (C.Appearance[A].Asset.Hide.indexOf(GroupName) >= 0)) return false;
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.Hide != null) && (C.Appearance[A].Property.Hide.indexOf(GroupName) >= 0)) return false;
		if ((C.Appearance[A].Asset.HideItem != null) && (C.Appearance[A].Asset.HideItem.indexOf(GroupName + AssetName) >= 0)) return false;
	}
	if (C.Pose != null)
		for (var A = 0; A < C.Pose.length; A++)
			for (var P = 0; P < Pose.length; P++)
				if (Pose[P].Name == C.Pose[A])
					if ((Pose[P].Hide != null) && (Pose[P].Hide.indexOf(GroupName) >= 0))
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

	C.MustDraw = true;

	// Loops in all visible items worn by the character
	for (var A = 0; A < C.Appearance.length; A++)
		if (C.Appearance[A].Asset.Visible && CharacterAppearanceVisible(C, C.Appearance[A].Asset.Name, C.Appearance[A].Asset.Group.Name)) {

			// If there's a father group, we must add it to find the correct image
			var CA = C.Appearance[A];
			var G = "";
			if (CA.Asset.Group.ParentGroupName != "" && !CA.Asset.IgnoreParentGroup)
				for (var FG = 0; FG < C.Appearance.length; FG++)
					if (CA.Asset.Group.ParentGroupName == C.Appearance[FG].Asset.Group.Name)
						G = "_" + C.Appearance[FG].Asset.Name;

			// If there's a pose style we must add (first by group then by item)
			var Pose = "";
			if ((CA.Asset.Group.AllowPose != null) && (CA.Asset.Group.AllowPose.length > 0) && (C.Pose != null) && (C.Pose.length > 0))
				for (var AP = 0; AP < CA.Asset.Group.AllowPose.length; AP++)
					for (var P = 0; P < C.Pose.length; P++)
						if (C.Pose[P] == CA.Asset.Group.AllowPose[AP])
							Pose = C.Pose[P] + "/";
			if ((CA.Asset.AllowPose != null) && (CA.Asset.AllowPose.length > 0) && (C.Pose != null) && (C.Pose.length > 0))
				for (var AP = 0; AP < CA.Asset.AllowPose.length; AP++)
					for (var P = 0; P < C.Pose.length; P++)
						if (C.Pose[P] == CA.Asset.AllowPose[AP])
							Pose = C.Pose[P] + "/";

			// If we must apply alpha masks to the current image as it is being drawn
			if (CA.Asset.Alpha != null)
				for (var AL = 0; AL < CA.Asset.Alpha.length; AL++) {
					C.Canvas.getContext("2d").clearRect(CA.Asset.Alpha[AL][0], CA.Asset.Alpha[AL][1], CA.Asset.Alpha[AL][2], CA.Asset.Alpha[AL][3]);
					C.CanvasBlink.getContext("2d").clearRect(CA.Asset.Alpha[AL][0], CA.Asset.Alpha[AL][1], CA.Asset.Alpha[AL][2], CA.Asset.Alpha[AL][3]);
				}

			// Check if we need to draw a different expression (for facial features)
			var Expression = "";
			if ((CA.Asset.Group.AllowExpression != null) && (CA.Asset.Group.AllowExpression.length > 0))
				if ((CA.Property && CA.Property.Expression && CA.Asset.Group.AllowExpression.indexOf(CA.Property.Expression) >= 0))
					Expression = CA.Property.Expression + "/";

			// Find the X and Y position to draw on
			var X = CA.Asset.Group.DrawingLeft;
			var Y = CA.Asset.Group.DrawingTop;
			if (CA.Asset.DrawingLeft != null) X = CA.Asset.DrawingLeft;
			if (CA.Asset.DrawingTop != null) Y = CA.Asset.DrawingTop;
			if (C.Pose != null)
				for (var CP = 0; CP < C.Pose.length; CP++)
					for (var P = 0; P < PoseFemale3DCG.length; P++)
						if ((C.Pose[CP] == PoseFemale3DCG[P].Name) && (PoseFemale3DCG[P].MovePosition != null))
							for (var M = 0; M < PoseFemale3DCG[P].MovePosition.length; M++)
								if (PoseFemale3DCG[P].MovePosition[M].Group == CA.Asset.Group.Name) {
									X = X + PoseFemale3DCG[P].MovePosition[M].X;
									Y = Y + PoseFemale3DCG[P].MovePosition[M].Y;
								}

			// Check if we need to draw a different variation (from type property)
			var Type = "";
			if ((CA.Property != null) && (CA.Property.Type != null)) Type = CA.Property.Type;

			// Cycle through all layers of the image
			var MaxLayer = (CA.Asset.Layer == null) ? 1 : CA.Asset.Layer.length;
			for (var L = 0; L < MaxLayer; L++) {
				var Layer = "";
				var LayerType = Type;
				if (CA.Asset.Layer != null) {
					Layer = "_" + CA.Asset.Layer[L].Name;
					if ((CA.Asset.Layer[L].AllowTypes != null) && (CA.Asset.Layer[L].AllowTypes.indexOf(Type) < 0)) continue;
					if (!CA.Asset.Layer[L].HasExpression) Expression = "";
					if (!CA.Asset.Layer[L].HasType) LayerType = "";
					if ((CA.Asset.Layer[L].NewParentGroupName != null) && (CA.Asset.Layer[L].NewParentGroupName != CA.Asset.Group.ParentGroupName)) {
						if (CA.Asset.Layer[L].NewParentGroupName == "") G = "";
						else
							for (var FG = 0; FG < C.Appearance.length; FG++)
								if (CA.Asset.Layer[L].NewParentGroupName == C.Appearance[FG].Asset.Group.Name)
									G = "_" + C.Appearance[FG].Asset.Name;
					}
					if (CA.Asset.Layer[L].OverrideAllowPose != null) {
						Pose = "";
						for (var AP = 0; AP < CA.Asset.Layer[L].OverrideAllowPose.length; AP++)
							for (var P = 0; P < C.Pose.length; P++)
								if (C.Pose[P] == CA.Asset.Layer[L].OverrideAllowPose[AP])
									Pose = C.Pose[P] + "/";
					}
				}

				// Draw the item on the canvas (default or empty means no special color, # means apply a color, regular text means we apply that text)
				if ((CA.Color != null) && (CA.Color.indexOf("#") == 0) && ((CA.Asset.Layer == null) || CA.Asset.Layer[L].AllowColorize)) {
					DrawImageCanvasColorize("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + Expression + CA.Asset.Name + G + LayerType + Layer + ".png", C.Canvas.getContext("2d"), X, Y, 1, CA.Color, CA.Asset.Group.DrawingFullAlpha);
					DrawImageCanvasColorize("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + (CA.Asset.Group.DrawingBlink ? "Closed/" : Expression) + CA.Asset.Name + G + LayerType + Layer + ".png", C.CanvasBlink.getContext("2d"), X, Y, 1, CA.Color, CA.Asset.Group.DrawingFullAlpha);
				} else {
					var Color = ((CA.Color == null) || (CA.Color == "Default") || (CA.Color == "") || (CA.Color.length == 1) || (CA.Color.indexOf("#") == 0)) ? "" : "_" + CA.Color;
					DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + Expression + CA.Asset.Name + G + LayerType + Color + Layer + ".png", C.Canvas.getContext("2d"), X, Y);
					DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + (CA.Asset.Group.DrawingBlink ? "Closed/" : Expression) + CA.Asset.Name + G + LayerType + Color + Layer + ".png", C.CanvasBlink.getContext("2d"), X, Y);
				}
			}

			// If we must draw the lock (never colorized)
			if ((CA.Property != null) && (CA.Property.LockedBy != null) && (CA.Property.LockedBy != "")) {
				DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + Expression + CA.Asset.Name + Type + "_Lock.png", C.Canvas.getContext("2d"), X, Y);
				DrawImageCanvas("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + (CA.Asset.Group.DrawingBlink ? "Closed/" : Expression) + CA.Asset.Name + Type + "_Lock.png", C.CanvasBlink.getContext("2d"), X, Y);
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
			if (Type == "Zoom") return ((C.Appearance[A].Asset.ZoomModifier == null) || (C.Appearance[A].Asset.ZoomModifier > 1) || (C.Appearance[A].Asset.ZoomModifier < 0.9)) ? 1 : C.Appearance[A].Asset.ZoomModifier;
		}
	return "None";

}

// Sets an item in the character appearance
function CharacterAppearanceSetItem(C, Group, ItemAsset, NewColor, DifficultyFactor, Refresh) {

	// Sets the difficulty factor
	if (DifficultyFactor == null) DifficultyFactor = 0;

	// Removes the previous if we need to
	var ID = CharacterAppearanceGetCurrentValue(C, Group, "ID");
	var ItemColor;
	if (ID != "None") {
		if (CurrentScreen == "Appearance") ItemColor = CharacterAppearanceGetCurrentValue(C, Group, "Color");
		C.Appearance.splice(ID, 1);
	} else if (ItemAsset != null) ItemColor = ItemAsset.Group.ColorSchema[0];

	// Add the new item to the character appearance
	if (ItemAsset != null) {
		var NA = {
			Asset: ItemAsset,
			Difficulty: parseInt((ItemAsset.Difficulty == null) ? 0 : ItemAsset.Difficulty) + parseInt(DifficultyFactor),
			Color: ((NewColor == null) ? ItemColor : NewColor)
		}
		C.Appearance.push(NA);
	}

	// Draw the character canvas and calculate the effects on the character
	if (Refresh == null || Refresh) CharacterRefresh(C);

}

// Cycle in the appearance assets to find the next item in a group and wear it
function CharacterAppearanceNextItem(C, Group, Forward, Description) {
	var Current = CharacterAppearanceGetCurrentValue(C, Group, "Name");
	var CAA = CharacterAppearanceAssets.filter(a => a.Group.Name == Group);
	if (Description == true && CAA.length == 0) return "None";
	if (Current != "None") {
		// If we found the item we move forward or backward if possible
		var I = CAA.findIndex(a => a.Name == Current);
		if (I >= 0) {
			if (Forward == null || Forward) {
				if (I + 1 < CAA.length) {
					if (Description == true) return CAA[I + 1].Description;
					CharacterAppearanceSetItem(C, Group, CAA[I + 1]);
					return;
				}
			} else {
				if (I - 1 >= 0) {
					if (Description == true) return CAA[I - 1].Description;
					CharacterAppearanceSetItem(C, Group, CAA[I - 1]);
					return;
				}
			}
		}
	}
	// Since we didn't found any item, we pick "None" if we had an item or the first or last item
	var AG = AssetGroup.find(g => g.Name == Group);
	if (Current != "None" && AG != null && AG.AllowNone) {
		if (Description == true) return "None";
		CharacterAppearanceSetItem(C, Group, null);
	} else if (Forward == null || Forward) {
		if (Description == true) return CAA[0].Description;
		CharacterAppearanceSetItem(C, Group, CAA[0]);
	} else {
		if (Description == true) return CAA[CAA.length - 1].Description;
		CharacterAppearanceSetItem(C, Group, CAA[CAA.length - 1]);
	}
	if (Description == true) return "None";
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
	if ((AssetGroup[CharacterAppearanceOffset].Category != "Appearance") || !AssetGroup[CharacterAppearanceOffset].AllowCustomize) CharacterAppearanceOffset = 0;
	if (CharacterAppearanceOffset < 0) CharacterAppearanceOffset = Math.floor(AssetGroup.length / CharacterAppearanceNumPerPage) * CharacterAppearanceNumPerPage;
}

// Sets the color for a specific group
function CharacterAppearanceSetColorForGroup(C, Color, Group) {
	for (var A = 0; A < C.Appearance.length; A++)
		if (C.Appearance[A].Asset.Group.Name == Group)
			C.Appearance[A].Color = Color;
	CharacterLoadCanvas(C);
}

// When we cancel the character appearance edit, we restore the backup
function CharacterAppearanceExit(C) {
	ElementRemove("InputWardrobeName");
	CharacterAppearanceWardrobeMode = false;
	C.Appearance = CharacterAppearanceBackup;
	CharacterLoadCanvas(C);
	if (C.AccountName != "") CommonSetScreen(CharacterAppearanceReturnModule, CharacterAppearanceReturnRoom);
	else CommonSetScreen("Character", "Login");
	CharacterAppearanceReturnRoom = "MainHall";
	CharacterAppearanceReturnModule = "Room";
}

// When the player is ready, we make sure she at least has an outfit
function CharacterAppearanceReady(C) {

	// Make sure the character has one item of each default type (not used for now)
	if (CharacterAppearanceReturnRoom == "DO NOT USE")
		for (var A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].IsDefault) || CharacterAppearanceRequired(C, AssetGroup[A].Name)) {

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

	// Exits wardrobe mode
	ElementRemove("InputWardrobeName");
	CharacterAppearanceWardrobeMode = false;

	// If there's no error, we continue to the login or main hall if already logged
	if (C.AccountName != "") {
		ServerPlayerAppearanceSync();
		if ((CharacterAppearanceReturnRoom == "ChatRoom") && (C.ID != 0)) {
			var Dictionary = [];
			Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
			Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
			ServerSend("ChatRoomChat", { Content: "ChangeClothes", Type: "Action" , Dictionary: Dictionary});
			ChatRoomCharacterUpdate(C);
		}
		CommonSetScreen(CharacterAppearanceReturnModule, CharacterAppearanceReturnRoom);
		CharacterAppearanceReturnRoom = "MainHall";
		CharacterAppearanceReturnModule = "Room";
	} else CommonSetScreen("Character", "Creation");

}

// Copy the appearance from a character to another
function CharacterAppearanceCopy(FromC, ToC) {

	// Removes any previous appearance asset
	for (var A = 0; A < ToC.Appearance.length; A++)
		if ((ToC.Appearance[A].Asset != null) && (ToC.Appearance[A].Asset.Group.Category == "Appearance")) {
			ToC.Appearance.splice(A, 1);
			A--;
		}

	// Adds all appearance assets from the first character to the second
	for (var A = 0; A < FromC.Appearance.length; A++)
		if ((FromC.Appearance[A].Asset != null) && (FromC.Appearance[A].Asset.Group.Category == "Appearance"))
			ToC.Appearance.push(FromC.Appearance[A]);

	// Refreshes the second character and saves it if it's the player
	CharacterRefresh(ToC);
	if (ToC.ID == 0) ServerPlayerAppearanceSync();

}

// Loads the appearance editing screen for a character
function CharacterAppearanceLoadCharacter(C) {
	CharacterAppearanceSelection = C;
	CharacterAppearanceReturnRoom = CurrentScreen;
	CharacterAppearanceReturnModule = CurrentModule;
	CommonSetScreen("Character", "Appearance");
}

// Load wardrobe menu in appearance selection
function CharacterAppearanceWardrobeLoad(C) {
	if ((Player.Wardrobe == null) || (Player.Wardrobe.length < WardrobeSize))
		WardrobeLoadCharacters(true);
	else
		WardrobeLoadCharacterNames();
	ElementCreateInput("InputWardrobeName", "text", C.Name, "20");
	AppearanceMode = "Wardrobe";
    AppearanceWardrobeShouldUndo = true;
	CharacterAppearanceWardrobeText = TextGet("WardrobeNameInfo");
}
