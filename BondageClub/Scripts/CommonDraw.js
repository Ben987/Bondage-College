"use strict";
/**
 * A callback function used for clearing a rectangular area of a canvas
 * @callback clearRect
 * @param {number} x - The x coordinate of the left of the rectangle to clear
 * @param {number} y - The y coordinate of the top of the rectangle to clear
 * @param {number} w - The width of the rectangle to clear
 * @param {number} h - The height of the rectangle to clear
 */

/**
 * A callback function used to draw an image to a canvas
 * @callback drawImage
 * @param {string} src - The URL of the image to draw
 * @param {number} x - The x coordinate to draw the image at
 * @param {number} y - The y coordinate to draw the image at
 * @param {number[][]} alphaMasks - A list of alpha masks to apply to the image when drawing
 * @param {number} opacity - The opacity to draw the image with
 */

/**
 * A callback function used to draw a canvas on a canvas
 * @callback drawCanvas
 * @param {string} Img - The canvas to draw
 * @param {number} x - The x coordinate to draw the canvas at
 * @param {number} y - The y coordinate to draw the canvas at
 */

/**
 * A callback function used to draw a colorized image to a canvas
 * @callback drawImageColorize
 * @param {string} src - The URL of the image to draw
 * @param {number} x - The x coordinate to draw the image at
 * @param {number} y - The y coordinate to draw the image at
 * @param {string} color - The color to apply to the image
 * @param {boolean} fullAlpha - Whether or not to apply colour to the entire image
 * @param {number[][]} alphaMasks - A list of alpha masks to apply to the image when drawing
 * @param {number} opacity - The opacity to draw the image with
 */

/**
 * Prepares the character's drawing canvases before drawing the character's appearance.
 * @param {Character} C - The character to prepare
 * @returns {void} - Nothing
 */
function CommonDrawCanvasPrepare(C) {
	if (C.Canvas == null) {
		C.Canvas = document.createElement("canvas");
		C.Canvas.width = 500;
		C.Canvas.height = CanvasDrawHeight;
	} else C.Canvas.getContext("2d").clearRect(0, 0, 500, CanvasDrawHeight);
	if (C.CanvasBlink == null) {
		C.CanvasBlink = document.createElement("canvas");
		C.CanvasBlink.width = 500;
		C.CanvasBlink.height = CanvasDrawHeight;
	} else C.CanvasBlink.getContext("2d").clearRect(0, 0, 500, CanvasDrawHeight);

	C.MustDraw = true;
}

/**
 * Draws the given character's appearance using the provided drawing callbacks
 * @param {Character} C - The character whose appearance to draw
 * @param {clearRect} clearRect - A callback to clear an area of the main character canvas
 * @param {clearRect} clearRectBlink - A callback to clear an area of the blink character canvas
 * @param {drawCanvas} drawCanvas - Function used to draw a canvas on top of the normal canvas
 * @param {drawCanvas} drawCanvasBlink - Function used to draw a canvas on top of the blink canvas
 * @param {drawImage} drawImage - A callback to draw an image to the main character canvas
 * @param {drawImage} drawImageBlink - A callback to draw an image to the blink character canvas
 * @param {drawImageColorize} drawImageColorize - A callback to draw a colorized image to the main character canvas
 * @param {drawImageColorize} drawImageColorizeBlink - A callback to draw a colorized image to the blink character canvas
 */
function CommonDrawAppearanceBuild(C, {
	clearRect,
	clearRectBlink,
	drawCanvas,
	drawCanvasBlink,
	drawImage,
	drawImageBlink,
	drawImageColorize,
	drawImageColorizeBlink,
}) {
	var LayerCounts = {};

	// Loop through all layers in the character appearance
	C.AppearanceLayers.forEach((Layer) => {
		const A = Layer.Asset;
		const AG = A.Group;
		const CountKey = AG.Name + "/" + A.Name;
		let CA = C.Appearance.find(item => item.Asset === A);
		let Property = CA.Property;

		// Count how many layers we've drawn for this asset
		LayerCounts[CountKey] = (LayerCounts[CountKey] || 0) + 1;

		// If there's a parent group (parent group of the layer overrides that of the asset, which overrides that of the group)
		var ParentGroupName = Layer.ParentGroupName;
		if (typeof ParentGroupName === "undefined") ParentGroupName = A.ParentGroupName;
		if (typeof ParentGroupName === "undefined") ParentGroupName = AG.ParentGroupName;
		var G = "";
		if (ParentGroupName) {
			var ParentItem = C.Appearance.find(Item => Item.Asset.Group.Name === ParentGroupName);
			if (ParentItem) G = "_" + ParentItem.Asset.Name;
		}

		// If there's a pose style we must add (items take priority over groups, layers may override completely)
		let Pose = CommonDrawResolveAssetPose(C, A, Layer);
		if (Pose) Pose += "/";

		// Check if we need to draw a different expression (for facial features)
		let Expression = "";
		let CurrentExpression = InventoryGetItemProperty(CA, "Expression");
		if (!CurrentExpression && Layer.MirrorExpression) {
			const MirroredItem = InventoryGet(C, Layer.MirrorExpression);
			CurrentExpression = InventoryGetItemProperty(MirroredItem, "Expression");
		}
		if (CurrentExpression) {
			const AllowExpression = InventoryGetItemProperty(CA, "AllowExpression", true);
			if (CurrentExpression && AllowExpression && AllowExpression.includes(CurrentExpression)) {
				Expression = CurrentExpression + "/";
			}
		}

		let GroupName = A.DynamicGroupName;

		// Find the X and Y position to draw on
		var X = Layer.DrawingLeft != null ? Layer.DrawingLeft : (A.DrawingLeft != null ? A.DrawingLeft : AG.DrawingLeft);
		var Y = Layer.DrawingTop != null ? Layer.DrawingTop : (A.DrawingTop != null ? A.DrawingTop : AG.DrawingTop);
		if (C.DrawPose && C.DrawPose.length) {
			C.DrawPose.forEach(CP => {
				var PoseDef = PoseFemale3DCG.find(P => P.Name === CP && P.MovePosition);
				if (PoseDef) {
					var MovePosition = PoseDef.MovePosition.find(MP => MP.Group === GroupName);
					if (MovePosition) {
						X += MovePosition.X;
						Y += MovePosition.Y;
					}
				}
			});
		}

		// Offset Y to counteract height modifiers for fixed-position assets
		let YFixedOffset = 0;
		if (A.FixedPosition) {
			if (C.IsInverted()) {
				YFixedOffset = -Y + 1000 - (Y + CharacterAppearanceYOffset(C, C.HeightRatio) / C.HeightRatio);
			} else {
				YFixedOffset = C.HeightModifier + 1000 * (1 - C.HeightRatio) * (1 - C.HeightRatioProportion) / C.HeightRatio;
			}
		}
		Y += YFixedOffset;

		// If we must apply alpha masks to the current image as it is being drawn
		Layer.Alpha.forEach(AlphaDef => {
			// If no groups are defined and the character's pose matches one of the allowed poses (or no poses are defined)
			if ((!AlphaDef.Group || !AlphaDef.Group.length) &&
				(!AlphaDef.Pose || !Array.isArray(AlphaDef.Pose) || !!CommonDrawFindPose(C, AlphaDef.Pose))) {
				AlphaDef.Masks.forEach(rect => {
					clearRect(rect[0], rect[1] + CanvasUpperOverflow + YFixedOffset, rect[2], rect[3]);
					clearRectBlink(rect[0], rect[1] + CanvasUpperOverflow + YFixedOffset, rect[2], rect[3]);
				});
			}
		});

		// Check if we need to draw a different variation (from type property)
		var Type = (Property && Property.Type) || "";

		var L = "";
		var LayerType = Type;
		if (Layer.Name) L = "_" + Layer.Name;
		if (!Layer.HasType) LayerType = "";
		var Opacity = (Property && typeof Property.Opacity === "number") ? Property.Opacity : Layer.Opacity;
		Opacity = Math.min(Layer.MaxOpacity, Math.max(Layer.MinOpacity, Opacity));
		var BlinkExpression = (A.OverrideBlinking ? !AG.DrawingBlink : AG.DrawingBlink) ? "Closed/" : Expression;
		var AlphaMasks = Layer.GroupAlpha
			.filter(({ Pose }) => !Pose || !Array.isArray(Pose) || !!CommonDrawFindPose(C, Pose))
			.reduce((Acc, { Masks }) => {
				Array.prototype.push.apply(Acc, Masks);
				return Acc;
			}, []);

		var Color = CA.Color;
		if (Array.isArray(Color)) {
			Color = Color[Layer.ColorIndex] || AG.ColorSchema[0];
		}

		// Fix to legacy appearance data when Hands could be different to BodyUpper
		if (GroupName === "Hands") Color = "Default";

		// Check if we need to copy the color of another asset
		let InheritColor = (Color == "Default" ? (Layer.InheritColor || A.InheritColor || AG.InheritColor) : null);
		let ColorInherited = false;
		if (InheritColor != null) {
			var ParentAsset = InventoryGet(C, InheritColor);
			if (ParentAsset != null) {
				let ParentColor = Array.isArray(ParentAsset.Color) ? ParentAsset.Color[0] : ParentAsset.Color;
				Color = CommonDrawColorValid(ParentColor, ParentAsset.Asset.Group) ? ParentColor : "Default";
				ColorInherited = true;
			}
		}


		// Before drawing hook, receives all processed data. Any of them can be overriden if returned inside an object.
		// CAREFUL! The dynamic function should not contain heavy computations, and should not have any side effects.
		// Watch out for object references.
		if (A.DynamicBeforeDraw && (!Player.GhostList || Player.GhostList.indexOf(C.MemberNumber) == -1)) {
			const DrawingData = {
				C, X, Y, CA, GroupName, Color, Opacity, Property, A, G, AG, L, Pose, LayerType, BlinkExpression, drawCanvas, drawCanvasBlink, AlphaMasks, PersistentData: () => AnimationPersistentDataGet(
					C, A),
			};
			const OverriddenData = CommonCallFunctionByNameWarn(`Assets${A.Group.Name}${A.Name}BeforeDraw`, DrawingData);
			if (typeof OverriddenData == "object") {
				for (const key in OverriddenData) {
					switch (key) {
						case "Property": {
							Property = OverriddenData[key];
							break;
						}
						case "CA": {
							CA = OverriddenData[key];
							break;
						}
						case "GroupName": {
							GroupName = OverriddenData[key];
							break;
						}
						case "Color": {
							Color = OverriddenData[key];
							break;
						}
						case "Opacity": {
							Opacity = OverriddenData[key];
							break;
						}
						case "X": {
							X = OverriddenData[key];
							break;
						}
						case "Y": {
							Y = OverriddenData[key];
							break;
						}
						case "LayerType": {
							LayerType = OverriddenData[key];
							break;
						}
						case "L": {
							L = OverriddenData[key];
							break;
						}
						case "AlphaMasks": {
							AlphaMasks = OverriddenData[key];
							break;
						}
					}
				}
			}
		}

		// Make any required changes to the colour
		if (Color === "Default" && A.DefaultColor) {
			Color = Array.isArray(A.DefaultColor) ? A.DefaultColor[Layer.ColorIndex] : A.DefaultColor;
		}
		if (!ColorInherited && !CommonDrawColorValid(Color, AG)) {
			Color = "Default";
		}

		// Adjust for the increased canvas size
		Y += CanvasUpperOverflow;
		AlphaMasks = AlphaMasks.map(([x, y, w, h]) => [x, y + CanvasUpperOverflow + YFixedOffset, w, h]);

		const Rotate = A.FixedPosition && C.IsInverted();

		// const HideForPose = !!Pose && (A.HideForPose.find(P => Pose === P + "/") || Layer.HideForPose.find(P => Pose === P + "/"));
		const ItemLocked = !!(Property && Property.LockedBy);

		// if (!HideForPose) {
			if (Layer.HasImage && (!Layer.LockLayer || ItemLocked)) {
				// Draw the item on the canvas (default or empty means no special color, # means apply a color, regular text means we apply
				// that text)
				if ((Color != null) && (Color.indexOf("#") == 0) && Layer.AllowColorize) {
					drawImageColorize(
						"Assets/" + AG.Family + "/" + GroupName + "/" + Pose + Expression + A.Name + G + LayerType + L + ".png", X, Y,
						Color,
						AG.DrawingFullAlpha, AlphaMasks, Opacity, Rotate
					);
					drawImageColorizeBlink(
						"Assets/" + AG.Family + "/" + GroupName + "/" + Pose + BlinkExpression + A.Name + G + LayerType + L + ".png", X, Y,
						Color, AG.DrawingFullAlpha, AlphaMasks, Opacity, Rotate
					);
				} else {
					var ColorName = ((Color == null) || (Color == "Default") || (Color == "") || (Color.length == 1) ||
						(Color.indexOf("#") == 0)) ? "" : "_" + Color;
					drawImage(
						"Assets/" + AG.Family + "/" + GroupName + "/" + Pose + Expression + A.Name + G + LayerType + ColorName + L + ".png",
						X, Y,
						AlphaMasks, Opacity, Rotate
					);
					drawImageBlink(
						"Assets/" + AG.Family + "/" + GroupName + "/" + Pose + BlinkExpression + A.Name + G + LayerType + ColorName + L +
						".png",
						X, Y, AlphaMasks, Opacity, Rotate
					);
				}
			}

			// If the item has been locked
			if (ItemLocked && A.DrawLocks) {
				// How many layers should be drawn for the asset
				const DrawableLayerCount = C.AppearanceLayers.filter(AL => AL.Asset === A).length;

				// If we just drew the last drawable layer for this asset, draw the lock too (never colorized)
				if (DrawableLayerCount === LayerCounts[CountKey]) {
					drawImage(
						"Assets/" + AG.Family + "/" + GroupName + "/" + Pose + Expression + A.Name + (A.HasType ? Type : "") +
						"_Lock.png",
						X, Y, AlphaMasks
					);
					drawImageBlink(
						"Assets/" + AG.Family + "/" + GroupName + "/" + Pose + BlinkExpression + A.Name + (A.HasType ? Type : "") +
						"_Lock.png", X, Y, AlphaMasks);
				}
			}
		// }

		// After drawing hook, receives all processed data.
		// CAREFUL! The dynamic function should not contain heavy computations, and should not have any side effects.
		// Watch out for object references.
		if (A.DynamicAfterDraw && (!Player.GhostList || Player.GhostList.indexOf(C.MemberNumber) == -1)) {
			const DrawingData = {
				C, X, Y, CA, Property, Color, Opacity, A, G, AG, L, Pose, LayerType, BlinkExpression, drawCanvas, drawCanvasBlink, AlphaMasks,
				PersistentData: () => AnimationPersistentDataGet(C, A),
			};
			CommonCallFunctionByNameWarn(`Assets${A.Group.Name}${A.Name}AfterDraw`, DrawingData);
		}
	});
}

/**
 * Determines whether the provided color is valid
 * @param {any} Color - The color
 * @param {AssetGroup} AssetGroup - The asset group the color is being used fo
 * @returns {boolean} - Whether the color is valid
 */
function CommonDrawColorValid(Color, AssetGroup) {
	if (Color != null && typeof Color !== "string") {
		return false;
	}
	if (Color != null && Color.indexOf("#") != 0 && AssetGroup.ColorSchema.indexOf(Color) < 0) {
		return false;
	}
	return true;
}

/**
 * Finds the correct pose to draw for drawable layer for the provided character from the provided list of allowed poses
 * @param {Character} C - The character to check for poses against
 * @param {string[]} AllowedPoses - The list of permitted poses for the current layer
 * @return {string} - The name of the pose to draw for the layer, or an empty string if no pose should be drawn
 */
function CommonDrawFindPose(C, AllowedPoses) {
	var Pose = "";
	if (AllowedPoses && AllowedPoses.length) {
		AllowedPoses.forEach(AllowedPose => {
			if (C.DrawPose.includes(AllowedPose)) Pose = AllowedPose;
		});
	}
	return Pose;
}

/**
 * Finds the pose that should be used when a given asset (and optionally layer) is drawn.
 * @param {Character} C - The character whose poses to check
 * @param {Asset} A - The asset to check
 * @param {AssetLayer} [Layer] - The layer to check (optional)
 * @returns {string} - The pose to use when drawing the given asset (or layer)
 */
function CommonDrawResolveAssetPose(C, A, Layer) {
	let Pose = "";
	if (C.DrawPose && C.DrawPose.length) {
		let AllowPose = Layer && Layer.AllowPose;
		if (!Array.isArray(AllowPose)) AllowPose = A.AllowPose;
		if (!Array.isArray(AllowPose)) AllowPose = A.Group.AllowPose;
		Pose = CommonDrawFindPose(C, AllowPose);
	}
	return Pose;
}
