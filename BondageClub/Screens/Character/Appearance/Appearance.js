"use strict";
var AppearanceBackground = "Dressing";
var CharacterAppearanceOffset = 0;
var CharacterAppearanceNumPerPage = 9;
var CharacterAppearanceHeaderText = "";
var CharacterAppearanceHeaderTextTime = 0;
var CharacterAppearanceBackup = null;
var CharacterAppearanceAssets = [];
var CharacterAppearanceColorPickerGroupName = "";
var CharacterAppearanceColorPickerBackup = "";
var CharacterAppearanceColorPickerRefreshTimer = null;
var CharacterAppearanceSelection = null;
var CharacterAppearanceReturnRoom = "MainHall";
var CharacterAppearanceReturnModule = "Room";
var CharacterAppearanceWardrobeOffset = 0;
var CharacterAppearanceWardrobeText = "";
var CharacterAppearanceForceUpCharacter = 0;
var CharacterAppearancePreviousEmoticon = "";
var CharacterAppearanceMode = "";
var CharacterAppearanceCloth = null;

/**
 * Builds all the assets that can be used to dress up the character
 * @param {Character} C - The character whose appearance is modified
 * @returns {void} - Nothing
 */
function CharacterAppearanceBuildAssets(C) {

	// Adds all items with 0 value and from the appearance category
	CharacterAppearanceAssets = [];
	for (let A = 0; A < Asset.length; A++)
		if ((Asset[A].Value == 0) && (Asset[A].Group.Family == C.AssetFamily) && (Asset[A].Group.Category == "Appearance"))
			CharacterAppearanceAssets.push(Asset[A]);
	for (let A = 0; A < C.Inventory.length; A++)
		if ((C.Inventory[A].Asset != null) && (C.Inventory[A].Asset.Group.Family == C.AssetFamily) && (C.Inventory[A].Asset.Group.Category == "Appearance"))
			CharacterAppearanceAssets.push(C.Inventory[A].Asset);

}

// 
/**
 * Makes sure the character appearance is valid from inventory and asset requirement
 * @param {Character} C - The character whose appearance is checked
 * @returns {void} - Nothing
 */
function CharacterAppearanceValidate(C) {

	// Remove any appearance item that's not in inventory
	var Refresh = false;
	for (let A = C.Appearance.length - 1; A >= 0; A--)
		if ((C.Appearance[A].Asset.Value != 0) && (C.Appearance[A].Asset.Group.Category == "Appearance") && !InventoryAvailable(C, C.Appearance[A].Asset.Name, C.Appearance[A].Asset.Group.Name)) {
			C.Appearance.splice(A, 1);
			Refresh = true;
		}

	// Remove items flagged as "Remove At Login"
	if (!Player.GameplaySettings || !Player.GameplaySettings.DisableAutoRemoveLogin)
		for (let A = C.Appearance.length - 1; A >= 0; A--)
			if (C.Appearance[A].Asset.RemoveAtLogin) {
				C.Appearance.splice(A, 1);
				Refresh = true;
			}

	// Dress back if there are missing appearance items
	for (let A = 0; A < AssetGroup.length; A++)
		if (!AssetGroup[A].AllowNone && (CharacterAppearanceGetCurrentValue(C, AssetGroup[A].Name, "Name") == "None"))
			for (let B = 0; B < Asset.length; B++)
				if (Asset[B].Group.Name == AssetGroup[A].Name) {
					C.Appearance.push({ Asset: Asset[B], Color: Asset[B].Group.ColorSchema[0] });
					Refresh = true;
					break;
				}

	// If we must refresh the character and push the appearance to the server
	if (Refresh) CharacterRefresh(C);

}

/**
 * Resets the character to it's default appearance
 * @param {Character} C - The character to redress to its default appearance
 * @returns {void} - Nothing
 */
function CharacterAppearanceSetDefault(C) {

	// Resets the current appearance and prepares the assets
	C.Appearance = [];
	C.Pose = [];
	if (CharacterAppearanceAssets.length == 0) CharacterAppearanceBuildAssets(C);

	// For each items in the character appearance assets
	for (let I = 0; I < CharacterAppearanceAssets.length; I++)
		if (CharacterAppearanceAssets[I].Group.IsDefault) {

			// If there's no item in a slot, the first one becomes the default
			var MustWear = true;
			for (let A = 0; A < C.Appearance.length; A++)
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

// 
/**
 * Checks wether an item group is required for this asset
 * @param {Character} C - The character, whose assets are used for the check
 * @param {string} GroupName - The name of the group to check
 * @returns {boolean} - Returns TRUE if the item group is required from
 */
function CharacterAppearanceRequired(C, GroupName) {
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset.Require != null) && (C.Appearance[A].Asset.Require.indexOf(GroupName) >= 0))
			return true;
	return false;
}

/**
 * Checks, wether the item group must be hidden for a certain asset
 * @param {Character} C - The character, whose assets are used for the check
 * @param {string} GroupName - The name of the group to check
 * @returns {boolean} - Returns TRUE if the item group must be hidden and not chosen
 */
function CharacterAppearanceMustHide(C, GroupName) {
	for (let A = 0; A < C.Appearance.length; A++) {
		if ((C.Appearance[A].Asset.Hide != null) && (C.Appearance[A].Asset.Hide.indexOf(GroupName) >= 0)) return true;
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.Hide != null) && (C.Appearance[A].Property.Hide.indexOf(GroupName) >= 0)) return true;
	}
	return false;
}


/**
 * Sets a full random set of items for a character. Only items that do not have the "Random" property set to false will be used.
 * @param {Character} C - The character to dress
 * @param {boolean} ClothOnly - Defines, if only clothes should be used
 * @returns {void} - Nothing
 */
function CharacterAppearanceFullRandom(C, ClothOnly) {

	// Clear the current appearance
	for (let A = C.Appearance.length - 1; A >= 0; A--)
		if (C.Appearance[A].Asset.Group.Category == "Appearance")
			if (!ClothOnly || (C.Appearance[A].Asset.Group.AllowNone)) {
				C.Appearance.splice(A, 1);
			}

	// For each item group (non default items only show at a 20% rate, if it can occasionally happen)
	for (let A = 0; A < AssetGroup.length; A++)
		if ((AssetGroup[A].Category == "Appearance") && (AssetGroup[A].IsDefault || (AssetGroup[A].Random && Math.random() < 0.2) || CharacterAppearanceRequired(C, AssetGroup[A].Name)) && (!CharacterAppearanceMustHide(C, AssetGroup[A].Name) || !AssetGroup[A].AllowNone) && (CharacterAppearanceGetCurrentValue(C, AssetGroup[A].Name, "Name") == "None")) {
			
			// Get the parent size
			var ParentSize = "";
			if (AssetGroup[A].ParentSize != "")
				ParentSize = CharacterAppearanceGetCurrentValue(C, AssetGroup[A].ParentSize, "Name");

			// Check for a parent
			var R = [];
			for (let I = 0; I < CharacterAppearanceAssets.length; I++)
				if ((CharacterAppearanceAssets[I].Group.Name == AssetGroup[A].Name) && (CharacterAppearanceAssets[I].ParentItem != null) && ((ParentSize == "") || (CharacterAppearanceAssets[I].Name == ParentSize)))
					for (let P = 0; P < C.Appearance.length; P++)
						if (C.Appearance[P].Asset.Name == CharacterAppearanceAssets[I].ParentItem)
							R.push(CharacterAppearanceAssets[I]);

			// Since there was no parent, get all the possible items
			if (R.length == 0)
				for (let I = 0; I < CharacterAppearanceAssets.length; I++)
					if ((CharacterAppearanceAssets[I].Group.Name == AssetGroup[A].Name) && (CharacterAppearanceAssets[I].ParentItem == null) && ((ParentSize == "") || (CharacterAppearanceAssets[I].Name == ParentSize)))
						R.push(CharacterAppearanceAssets[I]);

			// Picks a random item and color and add it
			if (R.length > 0) {
				var SelectedAsset = InventoryGetRandom(C, AssetGroup[A].Name, R);
				var SelectedColor = SelectedAsset.Group.ColorSchema[Math.floor(Math.random() * SelectedAsset.Group.ColorSchema.length)];
				if ((SelectedAsset.Group.ColorSchema[0] == "Default") && (Math.random() < 0.5)) SelectedColor = "Default";
				if (SelectedAsset.Group.ParentColor != "")
					if (CharacterAppearanceGetCurrentValue(C, SelectedAsset.Group.ParentColor, "Color") != "None")
						SelectedColor = CharacterAppearanceGetCurrentValue(C, SelectedAsset.Group.ParentColor, "Color");
				// Rare chance of keeping eyes of a different color
				if (SelectedAsset.Group.Name == "Eyes2" && Math.random() < 0.995)
					for (let A = 0; A < C.Appearance.length; A++)
						if (C.Appearance[A].Asset.Group.Name == "Eyes")
							SelectedColor = C.Appearance[A].Color;
				if (SelectedColor == "Default" && SelectedAsset.DefaultColor != null) SelectedColor = SelectedAsset.DefaultColor;
				var NA = {
					Asset: SelectedAsset,
					Color: SelectedColor
				}
				C.Appearance.push(NA);
			}

		}

	// Refreshes the character
	CharacterRefresh(C, false);
}

/**
 * Removes all items that can be removed, making the character naked. Checks for a blocking of CosPlayItem removal. 
 * @param {Character} C - The character to undress
 * @returns {void} - Nothing
 */
function CharacterAppearanceNaked(C) {

	// For each item group (non default items only show at a 20% rate)
	for (let A = C.Appearance.length-1 ; A >= 0; A--) {
		if (C.Appearance[A].Asset.Group.AllowNone && (C.Appearance[A].Asset.Group.Category == "Appearance") &&
			( C.IsNpc() || !(C.OnlineSharedSettings.BlockBodyCosplay && C.Appearance[A].Asset.Group.BodyCosplay))) {
			C.Appearance.splice(A, 1);
		}
	}

	// Loads the new character canvas
	CharacterLoadCanvas(C);

}


/**
 * Removes one layer of clothing: outer clothes, then underwear, then body-cosplay clothes, then nothing
 * @param {Character} C - The character to undress
 * @returns {void} - Nothing
 */
function CharacterAppearanceStripLayer(C) {
	var HasClothes = false;
	var HasUnderwear = false;
	var HasBodyCosplay = false;

	// Find out what the top layer currently is
	for (let A = 0; A < C.Appearance.length; A++) {
		if (!WardrobeGroupAccessible(C, C.Appearance[A].Asset.Group)) continue;
		if (C.Appearance[A].Asset.Group.BodyCosplay || C.Appearance[A].Asset.BodyCosplay) HasBodyCosplay = true;
		else if (C.Appearance[A].Asset.Group.Underwear) HasUnderwear = true;
		else if (C.Appearance[A].Asset.Group.Clothing) { HasClothes = true; break; }
	}

	// Check if there's anything to remove
	if (!HasClothes && !HasUnderwear && !HasBodyCosplay) return;

	// Ensure only the top layer is 'true'
	HasBodyCosplay = HasBodyCosplay && !HasUnderwear && !HasClothes;
	HasUnderwear = HasUnderwear && !HasClothes;

	// Remove assets from the top layer only
	var RemoveAsset = false;
	for (let A = C.Appearance.length - 1; A >= 0; A--) {
		RemoveAsset = false;
		
		if (!WardrobeGroupAccessible(C, C.Appearance[A].Asset.Group)) continue;
		if (C.Appearance[A].Asset.Group.BodyCosplay || C.Appearance[A].Asset.BodyCosplay) {
			if (HasBodyCosplay) RemoveAsset = true;
		}
		else if (C.Appearance[A].Asset.Group.Underwear) {
			if (HasUnderwear) RemoveAsset = true;
		}
		else if (C.Appearance[A].Asset.Group.Clothing) {
			if (HasClothes) RemoveAsset = true;
		}

		if (RemoveAsset) {
			C.Appearance.splice(A, 1);
		}
	}

	// Loads the new character canvas
	CharacterLoadCanvas(C);
}

/**
 * Builds a filtered and sorted set of appearance layers, each representing a drawable layer of a character's current appearance. Layers
 * that will not be drawn (because their asset is not visible or they do not permit the current asset type) are filtered out at this stage.
 * @param {Character} C - The character to build the layers for
 * @return {Layer[]} - A sorted set of layers, sorted by layer drawing priority
 */
function CharacterAppearanceSortLayers(C) {
	var groupAlphas = {};
	var layers = C.Appearance.reduce((layersAcc, item) => {
		var asset = item.Asset;
		// Only include layers for visible assets
		if (asset.Visible && CharacterAppearanceVisible(C, asset.Name, asset.Group.Name)) {
			// Check if we need to draw a different variation (from type property)
			var type = (item.Property && item.Property.Type) || "";
			// Only include layers that permit the current type (if AllowTypes is not defined, also include the layer)
			var layersToDraw = asset.Layer
				.filter(layer => !layer.AllowTypes || layer.AllowTypes.includes(type))
				.filter(layer => !layer.HideAs || CharacterAppearanceVisible(C, layer.HideAs.Asset, layer.HideAs.Group))
				.map(layer => {
					var drawLayer = Object.assign({}, layer);
					// Store any group-level alpha mask definitions
					drawLayer.Alpha.forEach(alphaDef => {
						if (alphaDef.Group && alphaDef.Group.length) {
							alphaDef.Group.forEach(groupName => {
								groupAlphas[groupName] = groupAlphas[groupName] || [];
								groupAlphas[groupName].push({Pose: alphaDef.Pose, Masks: alphaDef.Masks});
							});
						}
					});
					// If the item has an OverridePriority property, it completely overrides the layer priority
					if (item.Property && typeof item.Property.OverridePriority === "number") drawLayer.Priority = item.Property.OverridePriority;
					return drawLayer;
				});
			Array.prototype.push.apply(layersAcc, layersToDraw);
		}
		return layersAcc;
	}, []);

	// Run back over the layers to apply the group-level alpha mask definitions to the appropriate layers
	layers.forEach(layer => {
		const groupName = layer.Asset.Group.Name;
		layer.GroupAlpha = [];
		if (groupAlphas[groupName]) {
			Array.prototype.push.apply(layer.GroupAlpha, groupAlphas[groupName]);
		}
	});

	return layers.sort((l1, l2) => {
		// If priorities are different, sort by priority
		if (l1.Priority !== l2.Priority) return l1.Priority - l2.Priority;
		// If the priorities are identical and the layers belong to the same Asset, ensure layer order is preserved
		if (l1.Asset === l2.Asset) return l1.Asset.Layer.indexOf(l1) - l1.Asset.Layer.indexOf(l2);
		// If priorities are identical, sort alphabetically to maintain consistency
		return (l1.Asset.Group.Name + l1.Asset.Name).localeCompare(l2.Asset.Group.Name + l2.Asset.Name);
	});
}

/**
 * Determines wether an item or a whole item group is visible or not
 * @param {Character} C - The character whose assets are checked
 * @param {string} AssetName - The name of the asset to check
 * @param {string} GroupName - The name of the item group to check
 * @returns {boolean} - Returns TRUE if we can show the item or the item group
 */
function CharacterAppearanceVisible(C, AssetName, GroupName) {
	if (CharacterAppearanceItemIsHidden(AssetName, GroupName)) {
		C.HasHiddenItems = true;
		return false;
	}

	for (let A = 0; A < C.Appearance.length; A++) {
		if (CharacterAppearanceItemIsHidden(C.Appearance[A].Asset.Name, C.Appearance[A].Asset.Group.Name)) continue;
		if ((C.Appearance[A].Asset.Hide != null) && (C.Appearance[A].Asset.Hide.indexOf(GroupName) >= 0)) return false;
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.Hide != null) && (C.Appearance[A].Property.Hide.indexOf(GroupName) >= 0)) return false;
		if ((C.Appearance[A].Asset.HideItem != null) && (C.Appearance[A].Asset.HideItem.indexOf(GroupName + AssetName) >= 0)) return false;
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.HideItem != null) && (C.Appearance[A].Property.HideItem.indexOf(GroupName + AssetName) >= 0)) return false;
	}

	if (C.Pose != null)
		for (let A = 0; A < C.Pose.length; A++)
			for (let P = 0; P < Pose.length; P++)
				if (Pose[P].Name == C.Pose[A])
					if ((Pose[P].Hide != null) && (Pose[P].Hide.indexOf(GroupName) >= 0))
						return false;
	return true;
}

/**
 * Determines whether the player has set this item to not appear on screen
 * @param {string} AssetName - The name of the asset to check
 * @param {string} GroupName - The name of the item group to check
 * @returns {boolean} - TRUE if the item is hidden
 */
function CharacterAppearanceItemIsHidden(AssetName, GroupName) {
	for (var H = 0; H < Player.HiddenItems.length; H++)
		if (Player.HiddenItems[H].Name == AssetName && Player.HiddenItems[H].Group == GroupName)
			return true;
	return false;
}

/**
 * Calculates and sets the height modifier which determines the character's vertical position on screen
 * @param {Character} C - The character whose height must be calculated
 * @returns {void} - Nothing
 */
function CharacterApperanceSetHeightModifier(C) {
	if (CharacterAppearanceForceUpCharacter == C.MemberNumber) {
		C.HeightModifier = 0;
	} else {
		var Height = 0;
		for (let A = 0; A < C.Appearance.length; A++)
			if (CharacterAppearanceVisible(C, C.Appearance[A].Asset.Name, C.Appearance[A].Asset.Group.Name))
				Height += C.Appearance[A].Asset.HeightModifier;
		if (C.Pose != null) 
			for (let A = 0; A < C.Pose.length; A++)
				for (let P = 0; P < Pose.length; P++)
					if (Pose[P].Name == C.Pose[A])
						if (Pose[P].OverrideHeight != null) {
							// Ignore kneel, if player is hogtied. Allows the use of a short chain on hogtied players
							// Ignore overthehead if kneeling
							if (!((Pose[P].Name == "Kneel") && (C.Pose.indexOf("Hogtied") >= 0)) && !((Pose[P].Name == "OverTheHead") && (C.Pose.indexOf("Kneel") >= 0)))
								Height = Pose[P].OverrideHeight;
						}
		C.HeightModifier = Height;
	}
}

/**
 * Draws the character canvas
 * @param {Character} C - The character to draw
 * @returns {void} - Nothing
 */
function CharacterAppearanceBuildCanvas(C) {
	CommonDrawCanvasPrepare(C);
	CommonDrawAppearanceBuild(C, {
		clearRect: (x, y, w, h) => C.Canvas.getContext("2d").clearRect(x, y, w, h),
		clearRectBlink: (x, y, w, h) => C.CanvasBlink.getContext("2d").clearRect(x, y, w, h),
		drawImage: (src, x, y, alphaMasks) => DrawImageCanvas(src, C.Canvas.getContext("2d"), x, y, alphaMasks),
		drawImageBlink: (src, x, y, alphaMasks) => DrawImageCanvas(src, C.CanvasBlink.getContext("2d"), x, y, alphaMasks),
		drawImageColorize: (src, x, y, color, fullAlpha, alphaMasks) => DrawImageCanvasColorize(src, C.Canvas.getContext("2d"), x, y, 1, color, fullAlpha, alphaMasks),
		drawImageColorizeBlink: (src, x, y, color, fullAlpha, alphaMasks) => DrawImageCanvasColorize(src, C.CanvasBlink.getContext("2d"), x, y, 1, color, fullAlpha, alphaMasks),
		drawCanvas: (Img, x, y, alphaMasks) => DrawCanvas(Img, C.Canvas.getContext("2d"), x, y, alphaMasks),
		drawCanvasBlink: (Img, x, y, alphaMasks) => DrawCanvas(Img, C.CanvasBlink.getContext("2d"), x, y, alphaMasks),
	});
}

/**
 * Returns a value from the character current appearance
 * @param {Character} C - The character to get values from
 * @param {string} Group - The name of the group, whose values we want to get
 * @param {string} Type - The name of the value, we want to get
 * @returns {*} - The return value
 */
function CharacterAppearanceGetCurrentValue(C, Group, Type) {

	// Finds the value
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset.Group.Family == C.AssetFamily) && (C.Appearance[A].Asset.Group.Name == Group)) {
			if (Type == "Name") return C.Appearance[A].Asset.Name;
			if (Type == "Description") return C.Appearance[A].Asset.Description;
			if (Type == "Color") return CommonColorsEqual(C.Appearance[A].Color, C.Appearance[A].Asset.DefaultColor) ? "Default" : C.Appearance[A].Color;
			if (Type == "ID") return A;
			if (Type == "Effect") return C.Appearance[A].Asset.Effect;
			if (Type == "Asset") return C.Appearance[A].Asset;
			if (Type == "Full") return C.Appearance[A];
			if (Type == "Zoom") return ((C.Appearance[A].Asset.ZoomModifier == null) || (C.Appearance[A].Asset.ZoomModifier > 1) || (C.Appearance[A].Asset.ZoomModifier < 0.9)) ? 1 : C.Appearance[A].Asset.ZoomModifier;
		}
	return "None";

}

/**
 * Loads the character appearance screen and keeps a backup of the previous appearance. The function name is created dynamically.
 * @returns {void} - Nothing
 */
function AppearanceLoad() {
	DialogFocusItem = null;
	CharacterAppearanceOffset = 0;
	if (!CharacterAppearanceSelection) CharacterAppearanceSelection = Player;
	var C = CharacterAppearanceSelection;
	CharacterAppearanceBuildAssets(Player);
	CharacterAppearanceBackup = CharacterAppearanceStringify(C);
	if ((Player.OnlineSettings != null) && Player.OnlineSettings.EnableWardrobeIcon && (CharacterAppearanceReturnRoom == "ChatRoom")) {
		CharacterAppearancePreviousEmoticon = WardrobeGetExpression(Player).Emoticon;
		ServerSend("ChatRoomCharacterExpressionUpdate", { Name: "Wardrobe", Group: "Emoticon", Appearance: ServerAppearanceBundle(Player.Appearance) });
	}
}

/**
 * Run the character appearance selection screen. The function name is created dynamically.
 * @returns {void} - Nothing
 */
function AppearanceRun() {

	// Draw the background and the character twice
	var C = CharacterAppearanceSelection;
	if (CharacterAppearanceHeaderTextTime < CommonTime() && CharacterAppearanceMode == "Cloth")
		CharacterAppearanceHeaderText = "";
	if (CharacterAppearanceHeaderText == "") {
		if (C.ID == 0) CharacterAppearanceHeaderText = TextGet("SelectYourAppearance");
		else CharacterAppearanceHeaderText = TextGet("SelectSomeoneAppearance").replace("TargetCharacterName", C.Name);
	}
	DrawCharacter(C, -600, (C.IsKneeling()) ? -1100 : -100, 4, false);
	DrawCharacter(C, 750, 0, 1);
	DrawText(CharacterAppearanceHeaderText, 400, 40, "White", "Black");

	
	// When there is an extended item
	if (DialogFocusItem != null) {
		CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Draw()");
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		return;
	}
	
	// In regular dress-up mode 
	if (CharacterAppearanceMode == "") {

		// Draw the top buttons with images
		if (C.ID == 0) {
			DrawButton(1183, 25, 90, 90, "", "White", "Icons/" + ((LogQuery("Wardrobe", "PrivateRoom")) ? "Wardrobe" : "Reset") + ".png", TextGet(LogQuery("Wardrobe", "PrivateRoom") ? "Wardrobe" : "ResetClothes"));
			if (!DialogItemPermissionMode) DrawButton(1300, 25, 90, 90, "", "White", "Icons/WearRandom.png", TextGet("WearRandom"));
			DrawButton(1417, 25, 90, 90, "", "White", "Icons/Random.png", TextGet("Random"));
		} else if (LogQuery("Wardrobe", "PrivateRoom")) DrawButton(1417, 25, 90, 90, "", "White", "Icons/Wardrobe.png", TextGet("Wardrobe"));
		DrawButton(1534, 25, 90, 90, "", "White", "Icons/Naked.png", TextGet("Naked"));
		DrawButton(1651, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));

		// Creates buttons for all groups
		for (let A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + CharacterAppearanceNumPerPage; A++)
			if ((AssetGroup[A].Family == C.AssetFamily) && (AssetGroup[A].Category == "Appearance") && AssetGroup[A].AllowCustomize) {
				const Item = InventoryGet(C, AssetGroup[A].Name);
				const ButtonColor = WardrobeGroupAccessible(C, AssetGroup[A]) ? "White" : "#888";
				if (AssetGroup[A].AllowNone && !AssetGroup[A].KeepNaked && (AssetGroup[A].Category == "Appearance") && (Item != null) && WardrobeGroupAccessible(C, AssetGroup[A]))
					DrawButton(1210, 145 + (A - CharacterAppearanceOffset) * 95, 65, 65, "", ButtonColor, "Icons/Small/Naked.png", TextGet("StripItem"));
				if (!AssetGroup[A].AllowNone)
					DrawBackNextButton(1300, 145 + (A - CharacterAppearanceOffset) * 95, 400, 65, AssetGroup[A].Description + ": " + CharacterAppearanceGetCurrentValue(C, AssetGroup[A].Name, "Description"), ButtonColor, "",
						() => WardrobeGroupAccessible(C, AssetGroup[A]) ? CharacterAppearanceNextItem(C, AssetGroup[A].Name, false, true) : "",
						() => WardrobeGroupAccessible(C, AssetGroup[A]) ? CharacterAppearanceNextItem(C, AssetGroup[A].Name, true, true) : "",
						!WardrobeGroupAccessible(C, AssetGroup[A]));
				else
					DrawButton(1300, 145 + (A - CharacterAppearanceOffset) * 95, 400, 65, AssetGroup[A].Description + ": " + CharacterAppearanceGetCurrentValue(C, AssetGroup[A].Name, "Description"), ButtonColor, null, null, !WardrobeGroupAccessible(C, AssetGroup[A]));
				var Color = CharacterAppearanceGetCurrentValue(C, AssetGroup[A].Name, "Color", "");
				const ColorButtonText = ItemColorGetColorButtonText(Color);
				const ColorButtonColor = ColorButtonText.startsWith("#") ? ColorButtonText : "#fff";
				const CanCycleColors = !!Item && WardrobeGroupAccessible(C, AssetGroup[A]);
				const CanPickColor = CanCycleColors && AssetGroup[A].AllowColorize;
				const ColorIsSimple = ItemColorIsSimple(Item);
				DrawButton(1725, 145 + (A - CharacterAppearanceOffset) * 95, 160, 65, ColorButtonText, CanCycleColors ? ColorButtonColor : "#aaa", null, null, !CanCycleColors);
				DrawButton(1910, 145 + (A - CharacterAppearanceOffset) * 95, 65, 65, "", CanPickColor ? "#fff" : "#aaa", CanPickColor ? ColorIsSimple ? "Icons/Color.png" : "Icons/MultiColor.png" : "Icons/ColorBlocked.png", null, !CanPickColor);
			}
	}
	
	// In wardrobe mode
	if (CharacterAppearanceMode == "Wardrobe") {

		// Draw the wardrobe top controls & buttons
		DrawButton(1417, 25, 90, 90, "", "White", "Icons/Dress.png", TextGet("DressManually"));
		DrawButton(1534, 25, 90, 90, "", "White", "Icons/Naked.png", TextGet("Naked"));
		DrawButton(1651, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
		DrawText(CharacterAppearanceWardrobeText, 1645, 220, "White", "Gray");
		ElementPosition("InputWardrobeName", 1645, 315, 690);

		// Draw 6 wardrobe options
		for (let W = CharacterAppearanceWardrobeOffset; W < Player.Wardrobe.length && W < CharacterAppearanceWardrobeOffset + 6; W++) {
			DrawButton(1300, 430 + (W - CharacterAppearanceWardrobeOffset) * 95, 500, 65, "", "White", "");
			DrawTextFit((W + 1).toString() + (W < 9 ? ":  " : ": ") + Player.WardrobeCharacterNames[W], 1550, 463 + (W - CharacterAppearanceWardrobeOffset) * 95, 496, "Black");
			DrawButton(1820, 430 + (W - CharacterAppearanceWardrobeOffset) * 95, 160, 65, "Save", "White", "");
		}

	}

	// In item coloring mode
	if (CharacterAppearanceMode == "Color") {
	    ItemColorDraw(CharacterAppearanceSelection, CharacterAppearanceColorPickerGroupName, 1300, 25, 675, 950);
	}

	// In cloth selection mode
	if (CharacterAppearanceMode == "Cloth") {

		// Draw the wardrobe top controls & buttons
		if (!DialogItemPermissionMode && InventoryGet(C, C.FocusGroup.Name) && InventoryGet(C, C.FocusGroup.Name).Asset.Extended) DrawButton(1183, 25, 90, 90, "", "White", "Icons/Use.png", DialogFind(Player, "Use"));
		if (C.ID == 0 && !DialogItemPermissionMode) DrawButton(1300, 25, 90, 90, "", "White", "Icons/WearRandom.png", TextGet("WearRandom"));
		if (C.ID == 0) DrawButton(1417, 25, 90, 90, "", "White", DialogItemPermissionMode ? "Icons/DialogNormalMode.png" : "Icons/DialogPermissionMode.png", DialogFind(Player, DialogItemPermissionMode ? "DialogNormalMode" : "DialogPermissionMode"));
		if (!DialogItemPermissionMode) DrawButton(1534, 25, 90, 90, "", "White", "Icons/Naked.png", TextGet("Naked"));
		if (DialogInventory.length > 9) DrawButton(1651, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
		
		// Prepares a 3x3 square of clothes to present all the possible options
		var X = 1250;
		var Y = 125;
		for (let I = DialogInventoryOffset; (I < DialogInventory.length) && (I < DialogInventoryOffset + 9); I++) {
			var Item = DialogInventory[I];
			var Hover = (MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275) && !CommonIsMobile;
			var Block = InventoryIsPermissionBlocked(C, Item.Asset.DynamicName(Player), Item.Asset.DynamicGroupName);
			var Limit = InventoryIsPermissionLimited(C, Item.Asset.Name, Item.Asset.Group.Name);
			var Unusable = DialogInventory[I].SortOrder.startsWith(DialogSortOrderUnusable.toString());
			var Blocked = DialogInventory[I].SortOrder.startsWith(DialogSortOrderBlocked.toString());
			DrawRect(X, Y, 225, 275, (DialogItemPermissionMode && C.ID == 0) ?
				(Item.Worn ? "gray" : Block ? Hover ? "red" : "pink" : Limit ? Hover ? "orange" : "#fed8b1" : Hover ? "green" : "lime") :
				((Hover && !Blocked) ? "cyan" : Item.Worn ? "pink" : Blocked ? "red" : Unusable ? "gray" : "white"));
			if (Item.Worn && InventoryItemHasEffect(InventoryGet(C, Item.Asset.Group.Name), "Vibrating", true)) DrawImageResize("Assets/" + Item.Asset.Group.Family + "/" + Item.Asset.Group.Name + "/Preview/" + Item.Asset.Name + ".png", X + Math.floor(Math.random() * 3) + 1, Y + Math.floor(Math.random() * 3) + 1, 221, 221);
			else DrawImageResize("Assets/" + Item.Asset.Group.Family + "/" + Item.Asset.DynamicGroupName + "/Preview/" + Item.Asset.Name + Item.Asset.DynamicPreviewIcon(CharacterGetCurrent()) + ".png", X + 2, Y + 2, 221, 221);
			DrawTextFit(Item.Asset.DynamicDescription(Player), X + 112, Y + 250, 221, "black");
			if (Item.Icon != "") DrawImage("Icons/" + Item.Icon + ".png", X + 2, Y + 110);
			X = X + 250;
			if (X > 1800) {
				X = 1250;
				Y = Y + 300;
			}
		}

	}

	// Draw the default buttons
	if (!DialogItemPermissionMode && CharacterAppearanceMode !== "Color") {
		DrawButton(1768, 25, 90, 90, "", "White", "Icons/Cancel.png", TextGet("Cancel"));
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Accept.png", TextGet("Accept"));
	}

}

/**
 * Sets an item in the character appearance
 * @param {Character} C - The character whose appearance should be changed
 * @param {string} Group - The name of the corresponding groupr for the item
 * @param {Asset} ItemAsset - The asset collection of the item to be changed
 * @param {string} NewColor - The new color (as "#xxyyzz" hex value) for that item
 * @param {number} DifficultyFactor - The difficulty factor of the ne item
 * @param {number} ItemMemberNumber - The member number of the player adding the item - defaults to -1
 * @param {boolean} Refresh - Determines, wether the character should be redrawn after the item change
 * @returns {void} - Nothing
 */
function CharacterAppearanceSetItem(C, Group, ItemAsset, NewColor, DifficultyFactor, ItemMemberNumber, Refresh) {

	// Sets the difficulty factor
	if (DifficultyFactor == null) DifficultyFactor = 0;

	// Removes the previous if we need to
	var ID = CharacterAppearanceGetCurrentValue(C, Group, "ID");
	var ItemColor;
	if (ID != "None") {
		if (CurrentScreen == "Appearance") {
			ItemColor = CharacterAppearanceGetCurrentValue(C, Group, "Color");
			if ((ItemColor == null || ItemColor == "Default" || ItemColor == "None") && ItemAsset != null && ItemAsset.DefaultColor != null) ItemColor = ItemAsset.DefaultColor;
		}
		C.Appearance.splice(ID, 1);
	} else if (ItemAsset != null) ItemColor = ItemAsset.DefaultColor ? ItemAsset.DefaultColor : ItemAsset.Group.ColorSchema[0];

	// Add the new item to the character appearance
	if (ItemAsset != null) {
		var NA = {
			Asset: ItemAsset,
			Difficulty: parseInt((ItemAsset.Difficulty == null) ? 0 : ItemAsset.Difficulty) + parseInt(DifficultyFactor),
			Color: ((NewColor == null) ? ItemColor : NewColor),
			Property: ItemAsset.CharacterRestricted ? {ItemMemberNumber: ItemMemberNumber == null ? -1 : ItemMemberNumber} : undefined
		}
		C.Appearance.push(NA);
	}

	// Draw the character canvas and calculate the effects on the character
	if (Refresh == null || Refresh) CharacterRefresh(C);

}

/**
 * Cycle in the appearance assets to find the next item in a group and wear it
 * @param {Character} C - The character whose assets are used
 * @param {string} Group - The name of the group to cycle
 * @param {boolean} Forward - Sets the direction of the cycling
 * @param {boolean} Description - Determines, wether the description of the item should be returned or not.
 * @returns {string} - The Description of the worn item
 */
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

/**
 * Find the next color for the item
 * @param {Character} C - The character whose items are cycled
 * @param {string} Group - The name of the group for which we are colour cycling
 * @returns {void} - Nothing
 */
function CharacterAppearanceNextColor(C, Group) {

	// For each item, we first find the item and pick the next one
	var Color = CharacterAppearanceGetCurrentValue(C, Group, "Color");
	for (let A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == Group) {

			// Finds the next color
			var Pos = AssetGroup[A].ColorSchema.indexOf(Color) + 1;
			if ((Pos < 0) || (Pos >= AssetGroup[A].ColorSchema.length)) Pos = 0;
			Color = AssetGroup[A].ColorSchema[Pos];

			// Sets the color
			for (Pos = 0; Pos < C.Appearance.length; Pos++)
				if ((C.Appearance[Pos].Asset.Group.Name == Group) && (C.Appearance[Pos].Asset.Group.Family == C.AssetFamily)) {
					if (Color == "Default" && C.Appearance[Pos].Asset.DefaultColor != null) Color = C.Appearance[Pos].Asset.DefaultColor;
					C.Appearance[Pos].Color = Color;
				}

			// Reloads the character canvas
			CharacterLoadCanvas(C);
			return;

		}

}

/**
 * Moves the offset to get new character appearance items
 * @param {Character} C - The character whose visible groups are used for calculation
 * @param {number} Move - The amount the next asset group should be moved before it is displayed
 * @returns {void} - Nothing
 */
function CharacterAppearanceMoveOffset(C, Move) {

	// Calculate the new offset
	CharacterAppearanceOffset = CharacterAppearanceOffset + Move;
	if (CharacterAppearanceOffset >= AssetGroup.length) CharacterAppearanceOffset = 0;
	if ((AssetGroup[CharacterAppearanceOffset].Category != "Appearance") || !AssetGroup[CharacterAppearanceOffset].AllowCustomize) CharacterAppearanceOffset = 0;
	if (CharacterAppearanceOffset < 0) CharacterAppearanceOffset = Math.floor(AssetGroup.length / CharacterAppearanceNumPerPage) * CharacterAppearanceNumPerPage;

}

/**
 * Sets the color for a specific group
 * @param {Character} C - The character whose item group should be coloured
 * @param {string} Color - The colour (in the format "#rrggbb") to be applied to the group
 * @param {string} Group - The name of the group, whose colour should be changed
 * @returns {void} - Nothing
 */
function CharacterAppearanceSetColorForGroup(C, Color, Group) {
	for (let A = 0; A < C.Appearance.length; A++)
		if (C.Appearance[A].Asset.Group.Name == Group)
			C.Appearance[A].Color = Color;
	CharacterLoadCanvas(C);
}

/**
 * Handle the clicks in the character appearance selection screen. The function name is created dynamically.
 * @returns {void} - Nothing
 */
function AppearanceClick() {
	var C = CharacterAppearanceSelection;

	// When there is an extended item
	if (DialogFocusItem != null) {
		CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Click()");
		return;
	}
	
	// In regular dress-up mode
	if (CharacterAppearanceMode == "") {

		// If we must remove/restore to default the item
		if ((MouseX >= 1210) && (MouseX < 1275) && (MouseY >= 145) && (MouseY < 975))
			for (let A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + CharacterAppearanceNumPerPage; A++)
				if ((AssetGroup[A].Family == C.AssetFamily) && (AssetGroup[A].Category == "Appearance") && WardrobeGroupAccessible(C, AssetGroup[A]) && AssetGroup[A].AllowNone && !AssetGroup[A].KeepNaked && (InventoryGet(C, AssetGroup[A].Name) != null))
					if ((MouseY >= 145 + (A - CharacterAppearanceOffset) * 95) && (MouseY <= 210 + (A - CharacterAppearanceOffset) * 95))
						InventoryRemove(C, AssetGroup[A].Name);

		// If we must enter the cloth selection mode
		if ((MouseX >= 1300) && (MouseX < 1700) && (MouseY >= 145) && (MouseY < 975)) {
			C.FocusGroup = null;
			for (let A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + CharacterAppearanceNumPerPage; A++)
				if ((AssetGroup[A].Family == C.AssetFamily) && (AssetGroup[A].Category == "Appearance") && WardrobeGroupAccessible(C, AssetGroup[A]))
					if ((MouseY >= 145 + (A - CharacterAppearanceOffset) * 95) && (MouseY <= 210 + (A - CharacterAppearanceOffset) * 95))
						if (AssetGroup[A].AllowNone) {
							C.FocusGroup = AssetGroup[A];
							DialogInventoryBuild(C);
							CharacterAppearanceCloth = InventoryGet(C, C.FocusGroup.Name);
							CharacterAppearanceMode = "Cloth";
						} else CharacterAppearanceNextItem(C, AssetGroup[A].Name, (MouseX > 1500));
		}

		// If we must switch to the next color in the assets
		if ((MouseX >= 1725) && (MouseX < 1885) && (MouseY >= 145) && (MouseY < 975))
			for (let A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + CharacterAppearanceNumPerPage; A++)
				if ((AssetGroup[A].Family == C.AssetFamily) && (AssetGroup[A].Category == "Appearance") && WardrobeGroupAccessible(C, AssetGroup[A]))
					if ((MouseY >= 145 + (A - CharacterAppearanceOffset) * 95) && (MouseY <= 210 + (A - CharacterAppearanceOffset) * 95))
						CharacterAppearanceNextColor(C, AssetGroup[A].Name);

		// If we must open the color panel
		if (MouseIn(1910, 145, 65, 830))
			for (let A = CharacterAppearanceOffset; A < AssetGroup.length && A < CharacterAppearanceOffset + CharacterAppearanceNumPerPage; A++)
				if ((AssetGroup[A].Family == C.AssetFamily) && (AssetGroup[A].Category == "Appearance") && WardrobeGroupAccessible(C, AssetGroup[A]) && AssetGroup[A].AllowColorize)
					if ((MouseY >= 145 + (A - CharacterAppearanceOffset) * 95) && (MouseY <= 210 + (A - CharacterAppearanceOffset) * 95)) {
					    const Item = InventoryGet(C, AssetGroup[A].Name);
					    if (Item) {
                            // Keeps the previous color in backup and creates a text box to enter the color
                            CharacterAppearanceMode = "Color";
                            CharacterAppearanceColorPickerGroupName = AssetGroup[A].Name;
                            CharacterAppearanceColorPickerBackup = CharacterAppearanceGetCurrentValue(C, CharacterAppearanceColorPickerGroupName, "Color");
                            ItemColorLoad(C, Item, 1300, 25, 675, 950);
                            ItemColorOnExit(() => CharacterAppearanceMode = "");
                        }
					}

		// If we must set back the default outfit or set a random outfit
		if ((MouseX >= 1183) && (MouseX < 1273) && (MouseY >= 25) && (MouseY < 115) && (C.ID == 0) && !LogQuery("Wardrobe", "PrivateRoom")) CharacterAppearanceSetDefault(C);
		if ((MouseX >= 1183) && (MouseX < 1273) && (MouseY >= 25) && (MouseY < 115) && (C.ID == 0) && LogQuery("Wardrobe", "PrivateRoom")) CharacterAppearanceWardrobeLoad(C);
		if ((MouseX >= 1300) && (MouseX < 1390) && (MouseY >= 25) && (MouseY < 115) && (C.ID == 0)) CharacterAppearanceFullRandom(C, true);
		if ((MouseX >= 1417) && (MouseX < 1507) && (MouseY >= 25) && (MouseY < 115) && (C.ID == 0)) CharacterAppearanceFullRandom(C);
		if ((MouseX >= 1417) && (MouseX < 1507) && (MouseY >= 25) && (MouseY < 115) && (C.ID != 0) && LogQuery("Wardrobe", "PrivateRoom")) CharacterAppearanceWardrobeLoad(C);
		if ((MouseX >= 1534) && (MouseX < 1624) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceStripLayer(C);
		if ((MouseX >= 1651) && (MouseX < 1741) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceMoveOffset(C, CharacterAppearanceNumPerPage);
		if ((MouseX >= 1768) && (MouseX < 1858) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceExit(C);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceReady(C);
		return;

	}

	// In wardrobe mode
	if (CharacterAppearanceMode == "Wardrobe") {

		// In warehouse mode, we draw the 12 possible warehouse slots for the character to save & load
		if ((MouseX >= 1651) && (MouseX < 1741) && (MouseY >= 25) && (MouseY < 115)) {
			CharacterAppearanceWardrobeOffset += 6;
			if (CharacterAppearanceWardrobeOffset >= Player.Wardrobe.length) CharacterAppearanceWardrobeOffset = 0;
		}
		if ((MouseX >= 1300) && (MouseX < 1800) && (MouseY >= 430) && (MouseY < 970))
			for (let W = CharacterAppearanceWardrobeOffset; W < Player.Wardrobe.length && W < CharacterAppearanceWardrobeOffset + 6; W++)
				if ((MouseY >= 430 + (W - CharacterAppearanceWardrobeOffset) * 95) && (MouseY <= 495 + (W - CharacterAppearanceWardrobeOffset) * 95))
					WardrobeFastLoad(C, W, false);
		if ((MouseX >= 1820) && (MouseX < 1975) && (MouseY >= 430) && (MouseY < 970))
			for (let W = CharacterAppearanceWardrobeOffset; W < Player.Wardrobe.length && W < CharacterAppearanceWardrobeOffset + 6; W++)
				if ((MouseY >= 430 + (W - CharacterAppearanceWardrobeOffset) * 95) && (MouseY <= 495 + (W - CharacterAppearanceWardrobeOffset) * 95)) {
					WardrobeFastSave(C, W);
					var LS = /^[a-zA-Z ]+$/;
					var Name = ElementValue("InputWardrobeName").trim();
					if (Name.match(LS) || Name.length == 0) {
						WardrobeSetCharacterName(W, Name);
						CharacterAppearanceWardrobeText = TextGet("WardrobeNameInfo");
					} else {
						CharacterAppearanceWardrobeText = TextGet("WardrobeNameError");
					}
				}
		if ((MouseX >= 1417) && (MouseX < 1507) && (MouseY >= 25) && (MouseY < 115)) { CharacterAppearanceMode = ""; ElementRemove("InputWardrobeName"); }
		if ((MouseX >= 1534) && (MouseX < 1624) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceStripLayer(C);
		if ((MouseX >= 1768) && (MouseX < 1858) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceExit(C);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) CharacterAppearanceReady(C);
		return;

	}

	// In item coloring mode
	if (CharacterAppearanceMode == "Color") {
		ItemColorClick(CharacterAppearanceSelection, CharacterAppearanceColorPickerGroupName, 1300, 25, 675, 950);
	}

	// In cloth selection mode
	if (CharacterAppearanceMode == "Cloth") {

		// Extends the current item
		if (MouseIn(1183, 25, 90, 90)) { 
			var Item = InventoryGet(C, C.FocusGroup.Name);
			if (Item && Item.Asset.Extended) DialogExtendItem(Item);
		}

		// Picks and colors a random item from the group
		if (C.ID == 0 && !DialogItemPermissionMode && MouseIn(1300, 25, 90, 90)) {
			InventoryWearRandom(C, C.FocusGroup.Name, null, true, true);
		}

		// Swaps between normal and permission mode
		if (C.ID == 0 && MouseIn(1417, 25, 90, 90)) { 
			DialogItemPermissionMode = !DialogItemPermissionMode;
			DialogInventoryBuild(C);
		}
		
		// Strips the current item
		if (!DialogItemPermissionMode && (MouseX >= 1534) && (MouseX < 1624) && (MouseY >= 25) && (MouseY < 115))
			CharacterAppearanceSetItem(C, C.FocusGroup.Name, null);

		// Jumps to the cloth page
		if ((MouseX >= 1651) && (MouseX < 1741) && (MouseY >= 25) && (MouseY < 115)) {
			DialogInventoryOffset = DialogInventoryOffset + 9;
			if (DialogInventoryOffset >= DialogInventory.length) DialogInventoryOffset = 0;
		}

		// Cancels the selected cloth and reverts it back
		if (!DialogItemPermissionMode && (MouseX >= 1768) && (MouseX < 1858) && (MouseY >= 25) && (MouseY < 115)) {
			CharacterAppearanceSetItem(C, C.FocusGroup.Name, ((CharacterAppearanceCloth != null) && (CharacterAppearanceCloth.Asset != null)) ? CharacterAppearanceCloth.Asset : null, ((CharacterAppearanceCloth != null) && (CharacterAppearanceCloth.Color != null)) ? CharacterAppearanceCloth.Color : null);
			if (CharacterAppearanceCloth != null && CharacterAppearanceCloth.Property != null) {
				InventoryGet(C, C.FocusGroup.Name).Property = CharacterAppearanceCloth.Property;
				CharacterRefresh(C, false);
			}
			C.FocusGroup = null;
			AppearanceExit();
		}

		// Accepts the new cloth selection
		if (!DialogItemPermissionMode && (MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) {
			C.FocusGroup = null;
			AppearanceExit();
		}
		
		// Prepares a 3x3 square of clothes to present all the possible options
		var X = 1250;
		var Y = 125;
		for (let I = DialogInventoryOffset; (I < DialogInventory.length) && (I < DialogInventoryOffset + 9); I++) {
			if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) {
				var Item = DialogInventory[I];
				var Block = InventoryIsPermissionBlocked(C, Item.Asset.DynamicName(Player), Item.Asset.DynamicGroupName);
				var CreatedItem = InventoryItemCreate(C, Item.Asset.Group.Name, Item.Asset.Name);
				var Limited = !InventoryCheckLimitedPermission(C, CreatedItem);
				// In permission mode, we toggle the settings for an item
				if (DialogItemPermissionMode) {
					
					var CurrentItem = InventoryGet(C, C.FocusGroup.Name);
					
					if (CurrentItem && (CurrentItem.Asset.Name == Item.Asset.Name)) return;
					if (InventoryIsPermissionBlocked(Player, Item.Asset.Name, Item.Asset.Group.Name)) {
						Player.BlockItems = Player.BlockItems.filter(B => B.Name != Item.Asset.Name || B.Group != Item.Asset.Group.Name);
						Player.LimitedItems.push({ Name: Item.Asset.Name, Group: Item.Asset.Group.Name });
					}
					else if (InventoryIsPermissionLimited(Player, Item.Asset.Name, Item.Asset.Group.Name))
						Player.LimitedItems = C.LimitedItems.filter(B => B.Name != Item.Asset.Name || B.Group != Item.Asset.Group.Name);
					else
						Player.BlockItems.push({ Name: Item.Asset.Name, Group: Item.Asset.Group.Name });
					ServerSend("AccountUpdate", { BlockItems: Player.BlockItems, LimitedItems: Player.LimitedItems });
					
				} else {
					if (Block || Limited) return;
					if (InventoryAllow(C, Item.Asset.Prerequisite)) {
						CharacterAppearanceSetItem(C, C.FocusGroup.Name, DialogInventory[I].Asset);
						// Update the inventory with the new worn item
						DialogInventory = DialogInventory.map(DI => { DI.Worn = false; return DI; });
						DialogInventory[I].Worn = true;
					} else {
						CharacterAppearanceHeaderTextTime = DialogTextDefaultTimer;
						CharacterAppearanceHeaderText = DialogText;
					}
				}
				return;
			}
			X = X + 250;
			if (X > 1800) {
				X = 1250;
				Y = Y + 300;
			}
		}
	}
}

/**
 * Handle the exiting of the appearance screen. The function name is created dynamically.
 * @returns {void} - Nothing
 */
function AppearanceExit() {
	// We quit the extended item menu instead, if applicable.
	if (CharacterAppearanceMode == "Cloth" && DialogFocusItem) {
		DialogLeaveFocusItem();		
		return;
	}

	if (CharacterAppearanceMode === "Color") {
		return ItemColorExit();
	}

	if (CharacterAppearanceMode != "") {
		CharacterAppearanceMode = "";
		CharacterAppearanceHeaderText = "";
		ElementRemove("InputWardrobeName");
	} else CharacterAppearanceExit(CharacterAppearanceSelection);
}

/**
 * Restore the characters appearance backup, if the exit button is clicked
 * @param {Character} C - The character, whose appearance backup should be used
 * @returns {void} - Nothing
 */
function CharacterAppearanceExit(C) {
	ElementRemove("InputWardrobeName");
	CharacterAppearanceMode = "";
	CharacterAppearanceRestore(C, CharacterAppearanceBackup);
	if ((Player.OnlineSettings != null) && Player.OnlineSettings.EnableWardrobeIcon && (CharacterAppearanceReturnRoom == "ChatRoom")) {
		CharacterSetFacialExpression(Player, "Emoticon", CharacterAppearancePreviousEmoticon);
		CharacterAppearancePreviousEmoticon = "";
	}
	CharacterLoadCanvas(C);
	if (C.AccountName != "") CommonSetScreen(CharacterAppearanceReturnModule, CharacterAppearanceReturnRoom);
	else CommonSetScreen("Character", "Login");
	CharacterAppearanceReturnRoom = "MainHall";
	CharacterAppearanceReturnModule = "Room";
	CharacterAppearanceHeaderText = "";
}

/**
 * Handle the confirmation click in the wardrobe screen. 
 * @param {Character} C - The character who has been changed
 * @returns {void} - Nothing
 */
function CharacterAppearanceReady(C) {

	// Make sure the character has one item of each default type (not used for now)
	if (CharacterAppearanceReturnRoom == "DO NOT USE")
		for (let A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].IsDefault) || CharacterAppearanceRequired(C, AssetGroup[A].Name)) {

				// Check to find at least one item from the group
				var Found = false;
				for (let P = 0; P < C.Appearance.length; P++)
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
	CharacterAppearanceMode = "";
	CharacterAppearanceHeaderText = "";

	// If there's no error, we continue to the login or main hall if already logged
	if (C.AccountName != "") {
		ServerPlayerAppearanceSync();
		if ((CharacterAppearanceReturnRoom == "ChatRoom") && (C.ID != 0)) {
			var Dictionary = [];
			Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
			Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
			ServerSend("ChatRoomChat", { Content: "ChangeClothes", Type: "Action", Dictionary: Dictionary });
			ChatRoomCharacterUpdate(C);
		}
		CommonSetScreen(CharacterAppearanceReturnModule, CharacterAppearanceReturnRoom);
		CharacterAppearanceReturnRoom = "MainHall";
		CharacterAppearanceReturnModule = "Room";
	} else CommonSetScreen("Character", "Creation");

}

/**
 * Copy the appearance from a character to another
 * @param {Character} FromC - The character to copy from
 * @param {Character} ToC - The character to copy to
 */
function CharacterAppearanceCopy(FromC, ToC) {

	// Removes any previous appearance asset
	for (let A = ToC.Appearance.length - 1; A >= 0; A--)
		if ((ToC.Appearance[A].Asset != null) && (ToC.Appearance[A].Asset.Group.Category == "Appearance")) {
			ToC.Appearance.splice(A, 1);
		}

	// Adds all appearance assets from the first character to the second
	for (let A = 0; A < FromC.Appearance.length; A++)
		if ((FromC.Appearance[A].Asset != null) && (FromC.Appearance[A].Asset.Group.Category == "Appearance"))
			ToC.Appearance.push(FromC.Appearance[A]);

	// Refreshes the second character and saves it if it's the player
	CharacterRefresh(ToC);
	if (ToC.ID == 0) ServerPlayerAppearanceSync();

}

/**
 * Loads the appearance editing screen for a character
 * @param {Character} C - The character for whom the appearance screen should be loaded
 * @returns {void} - nothing
 */
function CharacterAppearanceLoadCharacter(C) {
	CharacterAppearanceSelection = C;
	CharacterAppearanceReturnRoom = CurrentScreen;
	CharacterAppearanceReturnModule = CurrentModule;
	CommonSetScreen("Character", "Appearance");
}

/**
 * Load wardrobe menu in appearance selection screen
 * @param {Character} C - The character whose wardrobe should be loaded
 * @returns {void} - Nothing
 */
function CharacterAppearanceWardrobeLoad(C) {
	if ((Player.Wardrobe == null) || (Player.Wardrobe.length < 12))
		WardrobeLoadCharacters(true);
	else
		WardrobeLoadCharacterNames();
	ElementCreateInput("InputWardrobeName", "text", C.Name, "20");
	CharacterAppearanceMode = "Wardrobe";
	CharacterAppearanceWardrobeText = TextGet("WardrobeNameInfo");
}

/**
 * Serialises a character's appearance into an abbreviated string for backup purposes
 * @param {Character} C - The character whose appearance should be serialised
 * @returns {string} - A serialised version of the character's current appearance
 */
function CharacterAppearanceStringify(C) {
    return AppearanceItemStringify(C.Appearance);
}

function AppearanceItemStringify(Item) {
    return JSON.stringify(Item, (key, value) => {
        if (key === "Asset") {
            return value.Group.Family + "/" + value.Group.Name + "/" + value.Name;
        }
        return value;
    });
}

/**
 * Restores a character's appearance from a serialised string generated by CharacterAppearanceStringify
 * @param {Character} C - The character whose appearance should be restored
 * @param {string} backup - The serialised appearance to restore
 * @returns {void} - Nothing
 */
function CharacterAppearanceRestore(C, backup) {
    C.Appearance = AppearanceItemParse(backup);
}

function AppearanceItemParse(stringified) {
    return JSON.parse(stringified, (key, value) => {
        if (key === "Asset") {
            const FGA = value.split("/");
            return AssetGet(FGA[0], FGA[1], FGA[2]);
        }
        return value;
    });
}
