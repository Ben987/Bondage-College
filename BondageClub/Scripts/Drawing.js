// The main game canvas where everything will be drawn
/**
 * An item is a pair of asset and its dynamic properties that define a worn asset.
 * @typedef {{Asset: object, Color: string, Difficulty: number, Property: object | undefined}} Item
 */
"use strict";
var MainCanvas;
var ColorCanvas;
var DialogLeaveDueToItem = false

// A bank of all the chached images
var DrawCacheImage = {};
var DrawCacheLoadedImages = 0;
var DrawCacheTotalImages = 0;
var DrawScreenWidth = -1;
var DrawScreenHeight = -1;

/**
 * Converts a hex color string to a RGB color
 * @param {string} color - Hex color to conver
 * @returns {string} - RGB color
 */
function DrawHexToRGB(color) {
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	color = color.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : {
			r: 0,
			g: 0,
			b: 0
		};
}

/**
 * Converts a RGB color to a hex color string
 * @param {string} color - RGB color to conver
 * @returns {string} - Hex color string
 */
function DrawRGBToHex(rgb) {
	var rgb = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);
	return '#' + (0x1000000 + rgb).toString(16).slice(1);
};

/**
 * Loads the canvas to draw on with its style and event listeners.
 * @returns {void} - Nothing
 */
function DrawLoad() {

	// Creates the objects used in the game
	MainCanvas = document.getElementById("MainCanvas").getContext("2d");
	ColorCanvas = document.createElement("canvas");
	document.getElementById("MainCanvas").addEventListener("keypress", KeyDown);
	document.getElementById("MainCanvas").tabIndex = 1000;
	document.addEventListener("keydown", DocumentKeyDown);

	// Font is fixed for now, color can be set
	MainCanvas.font = CommonGetFont(36);
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";

	// Loads the 3D engine as well
	Draw3DLoad();

}

/**
 * Returns the image file from cache or build it from the source
 * @param {string} Source - URL of the image
 * @returns {HTMLImageElement} - Image file
 */
function DrawGetImage(Source) {
	// Search in the cache to find the image and make sure this image is valid
	var Img = DrawCacheImage[Source];
	if (!Img) {
		Img = new Image;
		DrawCacheImage[Source] = Img;
		// Keep track of image load state
		var IsAsset = (Source.indexOf("Assets") >= 0);
		if (IsAsset) {
			++DrawCacheTotalImages;
			Img.addEventListener("load", function () {
				DrawGetImageOnLoad(Img);
			});
		}

		Img.addEventListener("error", function () {
			DrawGetImageOnError(Img, IsAsset);
		});

		// Start loading
		Img.src = Source;
	}

	// returns the final image
	return Img;
}

/**
 * Reloads all character canvas once all images are loaded
 * @returns {void} - Nothing
 */
function DrawGetImageOnLoad() {
	++DrawCacheLoadedImages;
	if (DrawCacheLoadedImages == DrawCacheTotalImages) CharacterLoadCanvasAll();
}

/**
 * Attempts to redownload an image if it previously failed to load
 * @param {HTMLImageElement} Img - Image tag that failed to load
 * @param {boolean} IsAsset - Whether or not the image is part of an asset
 * @returns {void} - Nothing
 */
function DrawGetImageOnError(Img, IsAsset) {
	if (Img.errorcount == null) Img.errorcount = 0;
	Img.errorcount += 1;
	if (Img.errorcount < 3) {
		Img.src = Img.src;
	} else {
		// Load failed. Display the error in the console and mark it as done.
		console.log("Error loading image " + Img.src);
		if (IsAsset) DrawGetImageOnLoad(Img);
	}
}

/**
 * Draws the glow under the arousal meter under the screen
 * @param {number} X - Position of the meter on the X axis
 * @param {number} Y - Position of the meter on the Y axis
 * @param {number} Zoom - Zoom factor
 * @param {number} Level - Current vibration level on a scale of 0 to 4. Must be INTEGER
 * @param {boolean} Animated - Whether or not animations should be played
 * @param {boolean} Orgasm - Whether or not the meter is in recover from orgasm mode
 * @returns {void} - Nothing
 */
function DrawArousalGlow(X, Y, Zoom, Level, Animated, AnimFactor, Orgasm) {
	if (!Orgasm) {
		var Rx = 0
		var Ry = 0

		if (Level > 0 && Animated) {
			Rx = -(1 + AnimFactor * Level/2) + (2 + AnimFactor * Level) * Math.random()
			Ry = -(1 + AnimFactor * Level/2) + (2 + AnimFactor * Level) * Math.random()
		}
		if (!Animated || (Level > 0 || CommonTime() % 1000 > 500))
			DrawImageZoomCanvas("Screens/Character/Player/ArousalMeter_Glow_" + Math.max(0, Math.min(Math.floor(Level), 4)) + ".png", MainCanvas, 0, 0, 300, 700, X-100*Zoom+Rx, Y-100*Zoom+Ry, 300 * Zoom, 700 * Zoom);
	}
}


/**
 * Draws the arousal meter on screen
 * @param {number} X - Position of the meter on the X axis
 * @param {number} Y - Position of the meter on the Y axis
 * @param {number} Zoom - Zoom factor
 * @param {number} Progress - Current progress of the arousal meter
 * @param {boolean} Automatic - Wheter or not the arousal is in automatic mode
 * @param {boolean} Orgasm - Whether or not the meter is in recover from orgasm mode
 * @returns {void} - Nothing
 */
function DrawArousalThermometer(X, Y, Zoom, Progress, Automatic, Orgasm) {
	DrawImageZoomCanvas("Screens/Character/Player/ArousalMeter" + (Orgasm ? "Orgasm" : "") + (Automatic ? "Automatic" : "") + ".png", MainCanvas, 0, 0, 100, 500, X, Y, 100 * Zoom, 500 * Zoom);
	if ((Progress > 0) && !Orgasm) DrawRect(X + (30 * Zoom), Y + (15 * Zoom) + (Math.round((100 - Progress) * 4 * Zoom)), (40 * Zoom), (Math.round(Progress * 4 * Zoom)), "#FF0000");
}

/**
 * Draw the arousal meter next to the player if it is allowed by the character and visible for the player
 * @param {Character} C - Character for which to potentially draw the arousal meter
 * @param {number} X - Position of the meter on the X axis
 * @param {number} Y - Position of the meter on the Y axis
 * @param {number} Zoom - Zoom factor
 * @returns {void} - Nothing
 */
function DrawArousalMeter(C, X, Y, Zoom) {
	if (ActivityAllowed() && (C.ArousalSettings != null) && (C.ArousalSettings.Active != null) && ((C.ArousalSettings.Active == "Manual") || (C.ArousalSettings.Active == "Hybrid") || (C.ArousalSettings.Active == "Automatic")))
		if ((C.ID == 0) || ((C.ArousalSettings.Visible != null) && (C.ArousalSettings.Visible == "Access") && C.AllowItem) || ((C.ArousalSettings.Visible != null) && (C.ArousalSettings.Visible == "All")))
			if ((C.ID == 0) || (Player.ArousalSettings.ShowOtherMeter == null) || Player.ArousalSettings.ShowOtherMeter) {
				ActivitySetArousal(C, C.ArousalSettings.Progress);



				if (C.ArousalSettings != null && Player.ArousalSettings.VFX != "VFXInactive" && C.ArousalSettings.Progress > 0 && ((C.ArousalSettings.Active == "Automatic") || (C.ArousalSettings.Active == "Hybrid"))) {
					var Progress = 0
					if (!((C.ArousalSettings.VibratorLevel == null) || (typeof C.ArousalSettings.VibratorLevel !== "number") || isNaN(C.ArousalSettings.VibratorLevel))) {
						Progress = C.ArousalSettings.VibratorLevel
					}

					if (Progress > 0) // -1 is disabled
						var max_time = 5000 // 5 seconds
						DrawArousalGlow(X + ((C.ArousalZoom ? 50 : 90) * Zoom), Y + ((C.ArousalZoom ? 200 : 400) * Zoom), C.ArousalZoom ? Zoom : Zoom * 0.2, Progress, Player.ArousalSettings.VFX == "VFXAnimated" || (Player.ArousalSettings.VFX == "VFXAnimatedTemp" && C.ArousalSettings.ChangeTime != null && CommonTime() - C.ArousalSettings.ChangeTime < max_time), Math.max(0, (max_time + C.ArousalSettings.ChangeTime - CommonTime())/ max_time), ((C.ArousalSettings.OrgasmTimer != null) && (typeof C.ArousalSettings.OrgasmTimer === "number") && !isNaN(C.ArousalSettings.OrgasmTimer) && (C.ArousalSettings.OrgasmTimer > 0)));
				}

				DrawArousalThermometer(X + ((C.ArousalZoom ? 50 : 90) * Zoom), Y + ((C.ArousalZoom ? 200 : 400) * Zoom), C.ArousalZoom ? Zoom : Zoom * 0.2, C.ArousalSettings.Progress, (C.ArousalSettings.Active == "Automatic"), ((C.ArousalSettings.OrgasmTimer != null) && (typeof C.ArousalSettings.OrgasmTimer === "number") && !isNaN(C.ArousalSettings.OrgasmTimer) && (C.ArousalSettings.OrgasmTimer > 0)));


				if (C.ArousalZoom && (typeof C.ArousalSettings.OrgasmCount === "number") && (C.ArousalSettings.OrgasmCount >= 0) && (C.ArousalSettings.OrgasmCount <= 9999)) {
					MainCanvas.font = CommonGetFont(Math.round(36 * Zoom).toString());
					DrawText(((C.ArousalSettings.OrgasmCount != null) ? C.ArousalSettings.OrgasmCount : 0).toString(), X + 100 * Zoom, Y + 655 * Zoom, "Black", "Gray");
					MainCanvas.font = CommonGetFont(36);
				}
			}
}

/**
 * Refreshes the character if not all images are loaded and draw the character canvas on the main game screen
 * @param {Character} C - Character to draw
 * @param {number} X - Position of the character on the X axis
 * @param {number} Y - Position of the character on the Y axis
 * @param {number} Zoom - Zoom factor
 * @param {boolean} IsHeightResizeAllowed - Whether or not the settings allow for the height modifier to be applied
 * @returns {void} - Nothing
 */
function DrawCharacter(C, X, Y, Zoom, IsHeightResizeAllowed) {
	if ((C != null) && ((C.ID == 0) || (Player.GetBlindLevel() < 3) || (CurrentScreen == "InformationSheet"))) {

		if (ControllerActive == true) {
			setButton(X + 100, Y + 200)
		}

		// If there's a fixed image to draw instead of the character
		if (C.FixedImage != null) {
			DrawImageZoomCanvas(C.FixedImage, MainCanvas, 0, 0, 500, 1000, X, Y, 500 * Zoom, 1000 * Zoom);
			return;
		}

		// Shortcuts drawing the character to 3D if needed
		if (Draw3DEnabled) {
			Draw3DCharacter(C, X, Y, Zoom, IsHeightResizeAllowed);
			return;
		}

		// Run any existing asset scripts
		if (C.RunScripts && C.HasScriptedAssets) {
			var DynamicAssets = C.Appearance.filter(CA => CA.Asset.DynamicScriptDraw);
			DynamicAssets.forEach(Item =>
				CommonCallFunctionByNameWarn(`Assets${Item.Asset.Group.Name}${Item.Asset.Name}ScriptDraw`, {
					C, Item, PersistentData: () => AnimationPersistentDataGet(C, Item.Asset)
				})
			);

			// If we must rebuild the canvas due to an animation
			const refreshTimeKey = AnimationGetDynamicDataName(C, AnimationDataTypes.RefreshTime);
			const refreshRateKey = AnimationGetDynamicDataName(C, AnimationDataTypes.RefreshRate);
			const buildKey = AnimationGetDynamicDataName(C, AnimationDataTypes.Rebuild);
			const lastRefresh = AnimationPersistentStorage[refreshTimeKey] || 0;
			const refreshRate = AnimationPersistentStorage[refreshRateKey] == null ? 60000 : AnimationPersistentStorage[refreshRateKey];
			if (refreshRate + lastRefresh < CommonTime() && AnimationPersistentStorage[buildKey]) {
				CharacterRefresh(C, false);
				AnimationPersistentStorage[buildKey] = false;
				AnimationPersistentStorage[refreshTimeKey] = CommonTime();
			}
		}

		// There's 2 different canvas, one blinking and one that doesn't
		var seconds = new Date().getTime();
		var Canvas = (Math.round(seconds / 400) % C.BlinkFactor == 0) ? C.CanvasBlink : C.Canvas;

		// If we must dark the Canvas characters
		if ((C.ID != 0) && Player.IsBlind() && (CurrentScreen != "InformationSheet")) {
			var CanvasH = document.createElement("canvas");
			CanvasH.width = Canvas.width;
			CanvasH.height = Canvas.height;
			var DarkFactor = (Player.Effect.indexOf("BlindNormal") >= 0) ? 0.3 : 0.6;
			var ctx = CanvasH.getContext('2d');
			ctx.drawImage(Canvas, 0, 0);
			// Overlay black rectangle.
			ctx.fillStyle = "rgba(0,0,0," + (1.0 - DarkFactor) + ")";
			ctx.fillRect(0, 0, CanvasH.width, CanvasH.height);
			// Re-apply character alpha channel
			ctx.globalCompositeOperation = 'destination-in';
			ctx.drawImage(Canvas, 0, 0);
			Canvas = CanvasH;
		}

		// If we must flip the canvas vertically
		let IsInverted = CharacterAppearsInverted(C);
		if (IsInverted) {
			var CanvasH = document.createElement("canvas");
			CanvasH.width = Canvas.width;
			CanvasH.height = Canvas.height;
			CanvasH.getContext("2d").rotate(Math.PI);
			CanvasH.getContext("2d").translate(-Canvas.width, -Canvas.height);
			// Render to the flipped canvas, and crop off the height modifier to prevent vertical overflow
			CanvasH.getContext("2d").drawImage(Canvas, 0, 0, Canvas.width, Canvas.height, 0, 0, Canvas.width, Canvas.height);
			Canvas = CanvasH;
		}

		// Get the height ratio and X & Y offsets based on it
		let HeightRatio = (IsHeightResizeAllowed == null || IsHeightResizeAllowed == true) ? C.HeightRatio : 1;
		let XOffset = CharacterAppearanceXOffset(C, HeightRatio);
		let YOffset = CharacterAppearanceYOffset(C, HeightRatio);
		
		// Calculate the vertical parameters. In certain cases, cut off anything above the Y value.
		let YCutOff = YOffset >= 0 || CurrentScreen == "ChatRoom";
		let YStart = CanvasUpperOverflow + (YCutOff ? -YOffset / HeightRatio : 0);
		let SourceHeight = 1000 / HeightRatio + (YCutOff ? 0 : -YOffset / HeightRatio);
		let SourceY = IsInverted ? Canvas.height - (YStart + SourceHeight) : YStart;
		let DestY = (IsInverted || YCutOff) ? 0 : YOffset;

		// Draw the character
		MainCanvas.drawImage(Canvas, 0, SourceY, Canvas.width, SourceHeight, X + XOffset * Zoom, Y + DestY * Zoom, 500 * HeightRatio * Zoom, (1000 - DestY) * Zoom);

		// Draw the arousal meter & game images on certain conditions
		if (CurrentScreen != "ChatRoom" || ChatRoomHideIconState <= 1) {
			DrawArousalMeter(C, X, Y, Zoom);
			OnlineGameDrawCharacter(C, X, Y, Zoom);
			if (C.HasHiddenItems) DrawImageZoomCanvas("Screens/Character/Player/HiddenItem.png", MainCanvas, 0, 0, 86, 86, X + 54 * Zoom, Y + 880 * Zoom, 70 * Zoom, 70 * Zoom);
		}
		
		// Draws the character focus zones if we need too
		if ((C.FocusGroup != null) && (C.FocusGroup.Zone != null) && (CurrentScreen != "Preference") && (DialogColor == null)) {

			// Draw all the possible zones in transparent colors (gray if free, yellow if occupied, red if blocker)
			for (let A = 0; A < AssetGroup.length; A++)
				if (AssetGroup[A].Zone != null && AssetGroup[A].Name != C.FocusGroup.Name) {
					var Color = "#80808040";
					if (InventoryGroupIsBlocked(C, AssetGroup[A].Name)) Color = "#88000580";
					else if (InventoryGet(C, AssetGroup[A].Name) != null) Color = "#D5A30080";
					DrawAssetGroupZone(C, AssetGroup[A].Zone, Zoom, X, Y, HeightRatio, Color, 5);
				}

			// Draw the focused zone in cyan
			DrawAssetGroupZone(C, C.FocusGroup.Zone, Zoom, X, Y, HeightRatio, "cyan");
		}

		// Draw the character name below herself
		if ((C.Name != "") && ((CurrentModule == "Room") || (CurrentModule == "Online" && !(CurrentScreen == "ChatRoom" && ChatRoomHideIconState >= 3)) || ((CurrentScreen == "Wardrobe") && (C.ID != 0))) && (CurrentScreen != "Private"))
			if (!Player.IsBlind() || (Player.GameplaySettings && Player.GameplaySettings.SensDepChatLog == "SensDepLight")) {
				MainCanvas.font = CommonGetFont(30);
				let NameOffset = CurrentScreen == "ChatRoom" && ChatRoomCharacter.length > 5 && CurrentCharacter == null ? -4 : 0;
				DrawText(C.Name, X + 255 * Zoom, Y + 980 * Zoom + NameOffset, (CommonIsColor(C.LabelColor)) ? C.LabelColor : "White", "Black");
				MainCanvas.font = CommonGetFont(36);
			}

	}
}

/**
 * Draws an asset group zone outline over the character
 * @param {Character} C - Character for which to draw the zone
 * @param {number[][]} Zone - Zone to be drawn
 * @param {number} Zoom - Height ratio of the character
 * @param {number} X - Position of the character on the X axis
 * @param {number} Y - Position of the character on the Y axis
 * @param {number} HeightRatio - The displayed height ratio of the character
 * @param {string} Color - Color of the zone outline
 * @param {number} [Thickness=3] - Thickness of the outline
 * @param {string} FillColor - If non-empty, the color to fill the rectangle with
 * @returns {void} - Nothing
 */
function DrawAssetGroupZone(C, Zone, Zoom, X, Y, HeightRatio, Color, Thickness = 3, FillColor) {
	for (let Z = 0; Z < Zone.length; Z++) {
		let CZ = DialogGetCharacterZone(C, Zone[Z], X, Y, Zoom, HeightRatio);

		if (FillColor != null) DrawRect(CZ[0], CZ[1], CZ[2], CZ[3], FillColor);
		DrawEmptyRect(CZ[0], CZ[1], CZ[2], CZ[3], Color, Thickness);

		if (ControllerActive == true) {
			setButton(Math.round(CZ[0]), Math.round(CZ[1]));
		}
	}
}

/**
 * Draws a zoomed image from a source to a specific canvas
 * @param {string} Source - URL of the image
 * @param {HTMLCanvasElement} Canvas - Canvas on which to draw the image
 * @param {number} SX - The X coordinate where to start clipping
 * @param {number} SY - The Y coordinate where to start clipping
 * @param {number} SWidth - The width of the clipped image
 * @param {number} SHeight - The height of the clipped image
 * @param {number} X - Position of the image on the X axis
 * @param {number} Y - Position of the image on the Y axis
 * @param {number} Width - Width of the image
 * @param {number} Height - Height of the image
 * @param {boolean} Invert - Flips the image vertically
 * @returns {boolean} - whether the image was complete or not
 */
function DrawImageZoomCanvas(Source, Canvas, SX, SY, SWidth, SHeight, X, Y, Width, Height, Invert) {
	var Img = DrawGetImage(Source);
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;
	if (Invert) Img = DrawInvertImage(Img);
	Canvas.drawImage(Img, SX, SY, Math.round(SWidth), Math.round(SHeight), X, Y, Width, Height);
	return true;
}

/**
 * Draws a resized image from a source to the main canvas
 * @param {string} Source - URL of the image
 * @param {number} X - Position of the image on the X axis
 * @param {number} Y - Position of the image on the Y axis
 * @param {number} Width - Width of the image after being resized
 * @param {number} Height - Height of the image after being resized
 * @returns {boolean} - whether the image was complete or not
 */
function DrawImageResize(Source, X, Y, Width, Height) {
	var Img = DrawGetImage(Source);
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;
	MainCanvas.drawImage(Img, 0, 0, Img.width, Img.height, X, Y, Width, Height);
	return true;
}

/**
 * Draws a zoomed image from a source to a specific canvas
 * @param {string} Source - URL of the image
 * @param {HTMLCanvasElement} Canvas - Canvas on which to draw the image
 * @param {number} X - Position of the image on the X axis
 * @param {number} Y - Position of the image on the Y axis
 * @param {number[][]} AlphaMasks - A list of alpha masks to apply to the asset
 * @param {number} Opacity - The opacity at which to draw the image
 * @returns {boolean} - whether the image was complete or not
 */
function DrawImageCanvas(Source, Canvas, X, Y, AlphaMasks, Opacity) {
	var Img = DrawGetImage(Source);
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;
	let SourceImage = Img;
	if (AlphaMasks && AlphaMasks.length) {
		SourceImage = document.createElement("canvas");
		tmpCanvas.width = Img.width;
		tmpCanvas.height = Img.height;
		var ctx = tmpCanvas.getContext('2d');
		ctx.drawImage(Img, 0, 0);
		AlphaMasks.forEach(([x, y, w, h]) => ctx.clearRect(x - X, y - Y, w, h));
		Canvas.drawImage(tmpCanvas, X, Y);
	}
	Opacity = typeof Opacity === "number" ? Opacity : 1;
	Canvas.save();
	Canvas.globalAlpha = Opacity;
	Canvas.drawImage(SourceImage, X, Y);
	Canvas.restore();
	return true;
}


/**
 * Draws a canvas to a specific canvas
 * @param {HTMLCanvasElement} Img - Canvas to draw
 * @param {HTMLCanvasElement} Canvas - Canvas on which to draw the image
 * @param {number} X - Position of the image on the X axis
 * @param {number} Y - Position of the image on the Y axis
 * @param {number[][]} AlphaMasks - A list of alpha masks to apply to the asset
 * @returns {boolean} - whether the image was complete or not
 */
function DrawCanvas(Img, Canvas, X, Y, AlphaMasks) {
	if (AlphaMasks && AlphaMasks.length) {
		var tmpCanvas = document.createElement("canvas");
		tmpCanvas.width = Img.width;
		tmpCanvas.height = Img.height;
		var ctx = tmpCanvas.getContext('2d');
		ctx.drawImage(Img, 0, 0);
		AlphaMasks.forEach(([x, y, w, h]) => ctx.clearRect(x - X, y - Y, w, h));
		Canvas.drawImage(tmpCanvas, X, Y);
	} else {
		Canvas.drawImage(Img, X, Y);
	}
	return true;
}

/**
 * Draws a specific canvas with a zoom on the main canvas
 * @param {HTMLCanvasElement} Canvas - Canvas to draw on the main canvas
 * @param {number} X - Position of the canvas on the X axis
 * @param {number} Y - Position of the canvas on the Y axis
 * @param {number} Zoom - Zoom factor
 * @returns {void} - Nothing
 */
function DrawCanvasZoom(Canvas, X, Y, Zoom) {
	MainCanvas.drawImage(Canvas, 0, 0, Canvas.width, Canvas.height, X, Y, Canvas.width * Zoom, Canvas.height * Zoom);
}

/**
 * Draws a zoomed image from a source to the canvas and mirrors it from left to right
 * @param {string} Source - URL of the image
 * @param {number} X - Position of the image on the X axis
 * @param {number} Y - Position of the image on the Y axis
 * @param {number} Width - Width of the image
 * @param {number} Height - Height of the image
 * @returns {boolean} - whether the image was complete or not
 */
function DrawImageZoomMirror(Source, X, Y, Width, Height) {
	var Img = DrawGetImage(Source);
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;
	MainCanvas.save();
	MainCanvas.scale(-1, 1);
	MainCanvas.drawImage(Img, X * -1, Y, Width * -1, Height);
	MainCanvas.restore();
	return true;
}

/**
 * Draws an image from a source on the main canvas
 * @param {string} Source - URL of the image
 * @param {number} X - Position of the image on the X axis
 * @param {number} Y - Position of the image on the Y axis
 * @param {boolean} Invert - Flips the image vertically
 * @returns {boolean} - whether the image was complete or not
 */
function DrawImage(Source, X, Y, Invert) {
	var Img = DrawGetImage(Source);
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;
	if (Invert) Img = DrawInvertImage(Img);
	MainCanvas.drawImage(Img, X, Y);
	return true;
}

/**
 * Draws an image from a source to the specified canvas
 * @param {string} Source - URL of the image
 * @param {HTMLCanvasElement} Canvas - Canvas on which to draw the image
 * @param {number} X - Position of the rectangle on the X axis
 * @param {number} Y - Position of the rectangle on the Y axis
 * @param {number} Zoom - Zoom factor
 * @param {string} HexColor - Color of the image to draw
 * @param {boolean} FullAlpha - Whether or not it is drawn in full alpha mode
 * @param {number[][]} AlphaMasks - A list of alpha masks to apply to the asset
 * @param {number} Opacity - The opacity at which to draw the image
 * @returns {boolean} - whether the image was complete or not
 */
function DrawImageCanvasColorize(Source, Canvas, X, Y, Zoom, HexColor, FullAlpha, AlphaMasks, Opacity) {

	// Make sure that the starting image is loaded
	var Img = DrawGetImage(Source);
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;

	// Prepares a canvas to draw the colorized image
	ColorCanvas.width = Img.width;
	ColorCanvas.height = Img.height;
	var ctx = ColorCanvas.getContext("2d");
	ctx.drawImage(Img, 0, 0);
	var imageData = ctx.getImageData(0, 0, ColorCanvas.width, ColorCanvas.height);
	var data = imageData.data;

	// Get the RGB color used to transform
	var rgbColor = DrawHexToRGB(HexColor);
	var trans;

	// We transform each non transparent pixel based on the RGG value
	if (FullAlpha) {
		for (let p = 0, len = data.length; p < len; p += 4) {
			if (data[p + 3] == 0)
				continue;
			trans = ((data[p] + data[p + 1] + data[p + 2]) / 383);
			data[p + 0] = rgbColor.r * trans;
			data[p + 1] = rgbColor.g * trans;
			data[p + 2] = rgbColor.b * trans;
		}
	} else {
		for (let p = 0, len = data.length; p < len; p += 4) {
			trans = ((data[p] + data[p + 1] + data[p + 2]) / 383);
			if ((data[p + 3] == 0) || (trans < 0.8) || (trans > 1.2))
				continue;
			data[p + 0] = rgbColor.r * trans;
			data[p + 1] = rgbColor.g * trans;
			data[p + 2] = rgbColor.b * trans;
		}
	}

	// Replace the source image with the modified canvas
	ctx.putImageData(imageData, 0, 0);
	if (AlphaMasks && AlphaMasks.length) {
		AlphaMasks.forEach(([x, y, w, h]) => ctx.clearRect(x - X, y - Y, w, h));
	}
	Opacity = typeof Opacity === "number" ? Opacity : 1;
	Canvas.save();
	Canvas.globalAlpha = Opacity;
	Canvas.drawImage(ctx.canvas, 0, 0, Img.width, Img.height, X, Y, Img.width * Zoom, Img.height * Zoom);
	Canvas.restore();

	return true;
}

/**
 * Draws the mirrored version of an image from a source on the canvas
 * @param {string} Source - URL of the image
 * @param {number} X - Position of the image on the X axis
 * @param {number} Y - Position of the image on the Y axis
 * @returns {boolean} - whether the image was complete or not
 */
function DrawImageMirror(Source, X, Y) {
	var Img = DrawGetImage(Source)
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;
	MainCanvas.save();
	MainCanvas.scale(-1, 1);
	MainCanvas.drawImage(Img, X * -1, Y);
	MainCanvas.restore();
	return true;
}

/**
 * Flips an image vertically
 * @param {HTMLImageElement} Img - The image to be inverted
 * @returns {HTMLCanvasElement} - Canvas with the inverted image
 */
function DrawInvertImage(Img) {
	let ImgCanvas = document.createElement("canvas");
	ImgCanvas.width = Img.width;
	ImgCanvas.height = Img.height;
	ImgCanvas.getContext("2d").scale(1, -1);
	ImgCanvas.getContext("2d").translate(0, -ImgCanvas.height);
	ImgCanvas.getContext("2d").drawImage(Img, 0, 0);
	return ImgCanvas;
}

/**
 * Reduces the font size progressively until the text fits the wrap size
 * @param {string} Text - Text that will be drawn
 * @param {number} Width - Width in which the text must fit
 * @param {number} MaxLine - Maximum of lines the word can wrap for
 * @returns {void} - Nothing
 */
function GetWrapTextSize(Text, Width, MaxLine) {

	// Don't bother if it fits on one line
	if (MainCanvas.measureText(Text).width > Width) {
		var words = Text.split(' ');
		var line = '';

		// Find the number of lines
		var LineCount = 1;
		for (let n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			if (MainCanvas.measureText(testLine).width > Width && n > 0) {
				line = words[n] + ' ';
				LineCount++;
			} else line = testLine;
		}

		// If there's too many lines, we launch the function again with size minus 2
		if (LineCount > MaxLine) {
			MainCanvas.font = (parseInt(MainCanvas.font.substring(0, 2)) - 2).toString() + "px arial";
			return GetWrapTextSize(Text, Width, MaxLine);
		} else return;

	} return;
}

/**
 * Draws a word wrapped text in a rectangle
 * @param {string} Text - Text to draw
 * @param {number} X - Position of the rectangle on the X axis
 * @param {number} Y - Position of the rectangle on the Y axis
 * @param {number} Width - Width of the rectangle
 * @param {number} Height - Height of the rectangle
 * @param {string} ForeColor - Foreground color
 * @param {string} BackColor - Background color
 * @param {number} MaxLine - Maximum of lines the word can wrap for
 * @returns {void} - Nothing
 */
function DrawTextWrap(Text, X, Y, Width, Height, ForeColor, BackColor, MaxLine) {
	if (ControllerActive == true) {
		setButton(X, Y);
	}
	// Draw the rectangle if we need too
	if (BackColor != null) {
		MainCanvas.beginPath();
		MainCanvas.rect(X, Y, Width, Height);
		MainCanvas.fillStyle = BackColor;
		MainCanvas.fillRect(X, Y, Width, Height);
		MainCanvas.fill();
		MainCanvas.lineWidth = '2';
		MainCanvas.strokeStyle = ForeColor;
		MainCanvas.stroke();
		MainCanvas.closePath();
	}

	// Sets the text size if there's a maximum number of lines
	var TextSize;
	if (MaxLine != null) {
		TextSize = MainCanvas.font
		GetWrapTextSize(Text, Width, MaxLine);
	}

	// Split the text if it wouldn't fit in the rectangle
	MainCanvas.fillStyle = ForeColor;
	if (MainCanvas.measureText(Text).width > Width) {
		var words = Text.split(' ');
		var line = '';

		// Find the number of lines
		var LineCount = 1;
		for (let n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			if (MainCanvas.measureText(testLine).width > Width && n > 0) {
				line = words[n] + ' ';
				LineCount++;
			} else line = testLine;
		}

		// Splits the words and draw the text
		words = Text.split(' ');
		line = '';
		Y = Y - ((LineCount - 1) * 23) + (Height / 2);
		for (let n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			if (MainCanvas.measureText(testLine).width > Width && n > 0) {
				MainCanvas.fillText(line, X + Width / 2, Y);
				line = words[n] + ' ';
				Y += 46;
			}
			else {
				line = testLine;
			}
		}
		MainCanvas.fillText(line, X + Width / 2, Y);

	} else MainCanvas.fillText(Text, X + Width / 2, Y + Height / 2);

	// Resets the font text size
	if ((MaxLine != null) && (TextSize != null))
		MainCanvas.font = TextSize;

}

/**
 * Draws a text element on the canvas that will fit on the specified width
 * @param {string} Text - Text to draw
 * @param {number} X - Position of the text on the X axis
 * @param {number} Y - Position of the text on the Y axis
 * @param {number} Width - Width in which the text has to fit
 * @param {string} Color - Color of the text
 * @param {string} BackColor - Color of the background
 * @returns {void} - Nothing
 */
function DrawTextFit(Text, X, Y, Width, Color, BackColor) {

	for (let S = 36; S >= 10; S = S - 2) {
		MainCanvas.font = CommonGetFont(S.toString());
		var metrics = MainCanvas.measureText(Text);
		if (metrics.width <= Width)
			break;
	}
	
	// Draw a back color relief text if needed
	if ((BackColor != null) && (BackColor != "")) {
		MainCanvas.fillStyle = BackColor;
		MainCanvas.fillText(Text, X + 1, Y + 1);
	}
	
	MainCanvas.fillStyle = Color;
	MainCanvas.fillText(Text, X, Y);
	MainCanvas.font = CommonGetFont(36);
}

/**
 * Draws a text element on the canvas
 * @param {string} Text - Text to draw
 * @param {number} X - Position of the text on the X axis
 * @param {number} Y - Position of the text on the Y axis
 * @param {string} Color - Color of the text
 * @param {string} BackColor - Color of the background
 * @returns {void} - Nothing
 */
function DrawText(Text, X, Y, Color, BackColor) {

	// Draw a back color relief text if needed
	if ((BackColor != null) && (BackColor != "")) {
		MainCanvas.fillStyle = BackColor;
		MainCanvas.fillText(Text, X + 1, Y + 1);
	}

	// Split the text on two lines if there's a |
	MainCanvas.fillStyle = Color;
	MainCanvas.fillText(Text, X, Y);

}

/**
 * Draws a button component
 * @param {number} Left - Position of the component from the left of the canvas
 * @param {number} Top - Position of the component from the top of the canvas
 * @param {number} Width - Width of the component
 * @param {number} Height - Height of the component
 * @param {string} Label - Text to display in the button
 * @param {string} Color - Color of the component
 * @param {string} [Image] - URL of the image to draw inside the button, if applicable
 * @param {string} [HoveringText] - Text of the tooltip, if applicable
 * @param {boolean} [Disabled] - Disables the hovering options if set to true
 * @returns {void} - Nothing
 */
function DrawButton(Left, Top, Width, Height, Label, Color, Image, HoveringText, Disabled) {

	if (ControllerActive == true) {
		setButton(Left, Top);
	}

	// Draw the button rectangle (makes the background color cyan if the mouse is over it)
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
	MainCanvas.fillStyle = ((MouseX >= Left) && (MouseX <= Left + Width) && (MouseY >= Top) && (MouseY <= Top + Height) && !CommonIsMobile && !Disabled) ? "Cyan" : Color;
	MainCanvas.fillRect(Left, Top, Width, Height);
	MainCanvas.fill();
	MainCanvas.lineWidth = '2';
	MainCanvas.strokeStyle = 'black';
	MainCanvas.stroke();
	MainCanvas.closePath();

	// Draw the text or image
	DrawTextFit(Label, Left + Width / 2, Top + (Height / 2) + 1, Width - 4, "black");
	if ((Image != null) && (Image != "")) DrawImage(Image, Left + 2, Top + 2);

	// Draw the hovering text
	if ((HoveringText != null) && (MouseX >= Left) && (MouseX <= Left + Width) && (MouseY >= Top) && (MouseY <= Top + Height) && !CommonIsMobile) {
		DrawButtonHover(Left, Top, Width, Height, HoveringText);
	}
}

/**
 * Draws a checkbox component
 * @param {number} Left - Position of the component from the left of the canvas
 * @param {number} Top - Position of the component from the top of the canvas
 * @param {number} Width - Width of the component
 * @param {number} Height - Height of the component
 * @param {string} Text - Label associated with the checkbox
 * @param {boolean} IsChecked - Whether or not the checkbox is checked
 * @returns {void} - Nothing
 */
function DrawCheckbox(Left, Top, Width, Height, Text, IsChecked) {
	DrawText(Text, Left + 100, Top + 33, "Black", "Gray");
	DrawButton(Left, Top, Width, Height, "", "White", IsChecked ? "Icons/Checked.png" : "");
}

/**
 * Draws a checkbox component
 * @param {number} Left - Position of the component from the left of the canvas
 * @param {number} Top - Position of the component from the top of the canvas
 * @param {number} Width - Width of the component
 * @param {number} Height - Height of the component
 * @param {string} Text - Label associated with the checkbox
 * @param {boolean} IsChecked - Whether or not the checkbox is checked
 * @param {string} Color - Color of the text
 * @returns {void} - Nothing
 */
function DrawCheckboxColor(Left, Top, Width, Height, Text, IsChecked, Color) {
	DrawText(Text, Left + 100, Top + 33, Color, "Gray");
	DrawButton(Left, Top, Width, Height, "", "White", IsChecked ? "Icons/Checked.png" : "");
}

/**
 * Draw a back & next button component
 * @param {number} Left - Position of the component from the left of the canvas
 * @param {number} Top - Position of the component from the top of the canvas
 * @param {number} Width - Width of the component
 * @param {number} Height - Height of the component
 * @param {string} Label - Text inside the component
 * @param {string} Color - Color of the component
 * @param {string} [Image] - Image URL to draw in the component
 * @param {string} BackText - Text for the back button tooltip
 * @param {string} NextText - Text for the next button tooltip
 * @param {boolean} [Disabled] - Disables the hovering options if set to true
 * @param {number} ArrowWidth - How much of the button the previous/next sections cover. By default, half each.
 * @returns {void} - Nothing
 */
function DrawBackNextButton(Left, Top, Width, Height, Label, Color, Image, BackText, NextText, Disabled, ArrowWidth) {
	// Set the widths of the previous/next sections to be colored cyan when hovering over them
	// By default each covers half the width, together covering the whole button
	if (ArrowWidth == null || ArrowWidth > Width / 2) ArrowWidth = Width / 2;
	const LeftSplit = Left + ArrowWidth;
	const RightSplit = Left + Width - ArrowWidth;

	// Draw the button rectangle
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
	MainCanvas.fillStyle = Color;
	MainCanvas.fillRect(Left, Top, Width, Height);
	if (MouseIn(Left, Top, Width, Height) && !CommonIsMobile && !Disabled) {
		MainCanvas.fillStyle = "Cyan";
		if (MouseX > RightSplit) {
			MainCanvas.fillRect(RightSplit, Top, ArrowWidth, Height);
		}
		else if (MouseX <= LeftSplit) {
			MainCanvas.fillRect(Left, Top, ArrowWidth, Height);
		} else {
			MainCanvas.fillRect(Left + ArrowWidth, Top, Width - ArrowWidth * 2, Height);
		}
	}
	else if (CommonIsMobile && ArrowWidth < Width / 2) {
		// Fill in the arrow regions on mobile
		MainCanvas.fillStyle = "lightgrey";
		MainCanvas.fillRect(Left, Top, ArrowWidth, Height);
		MainCanvas.fillRect(RightSplit, Top, ArrowWidth, Height);
	}
	MainCanvas.lineWidth = '2';
	MainCanvas.strokeStyle = 'black';
	MainCanvas.stroke();
	MainCanvas.closePath();

	// Draw the text or image
	DrawTextFit(Label, Left + Width / 2, Top + (Height / 2) + 1, (CommonIsMobile) ? Width - 6 : Width - 36, "Black");
	if ((Image != null) && (Image != "")) DrawImage(Image, Left + 2, Top + 2);

	// Draw the back arrow
	MainCanvas.beginPath();
	MainCanvas.fillStyle = "black";
	MainCanvas.moveTo(Left + 15, Top + Height / 5);
	MainCanvas.lineTo(Left + 5, Top + Height / 2);
	MainCanvas.lineTo(Left + 15, Top + Height - Height / 5);
	MainCanvas.stroke();
	MainCanvas.closePath();

	// Draw the next arrow
	MainCanvas.beginPath();
	MainCanvas.fillStyle = "black";
	MainCanvas.moveTo(Left + Width - 15, Top + Height / 5);
	MainCanvas.lineTo(Left + Width - 5, Top + Height / 2);
	MainCanvas.lineTo(Left + Width - 15, Top + Height - Height / 5);
	MainCanvas.stroke();
	MainCanvas.closePath();

	// Draw the hovering text on the PC
	if (CommonIsMobile) return;
	if (BackText == null) BackText = () => "MISSING VALUE FOR: BACK TEXT";
	if (NextText == null) NextText = () => "MISSING VALUE FOR: NEXT TEXT";
	if ((MouseX >= Left) && (MouseX <= Left + Width) && (MouseY >= Top) && (MouseY <= Top + Height) && !Disabled)
		DrawButtonHover(Left, Top, Width, Height, MouseX < LeftSplit ? NextText() : MouseX >= RightSplit ? BackText() : "");

}

/**
 * Draw the hovering text tooltip
 * @param {number} Left - Position of the tooltip from the left of the canvas
 * @param {number} Top - Position of the tooltip from the top of the canvas
 * @param {number} Width - Width of the tooltip
 * @param {number} Height - Height of the tooltip
 * @param {string} HoveringText - Text to display in the tooltip
 * @returns {void} - Nothing
 */
function DrawButtonHover(Left, Top, Width, Height, HoveringText) {
	if ((HoveringText != null) && (HoveringText != "")) {
		Left = (MouseX > 1000) ? Left - 475 : Left + Width + 25;
		Top = Top + (Height - 65) / 2;
		MainCanvas.beginPath();
		MainCanvas.rect(Left, Top, 450, 65);
		MainCanvas.fillStyle = "#FFFF88";
		MainCanvas.fillRect(Left, Top, 450, 65);
		MainCanvas.fill();
		MainCanvas.lineWidth = '2';
		MainCanvas.strokeStyle = 'black';
		MainCanvas.stroke();
		MainCanvas.closePath();
		DrawTextFit(HoveringText, Left + 225, Top + 33, 444, "black");
	}
}

/**
 * Draws a basic empty rectangle with a colored outline
 * @param {number} Left - Position of the rectangle from the left of the canvas
 * @param {number} Top - Position of the rectangle from the top of the canvas
 * @param {number} Width - Width of the rectangle
 * @param {number} Height - Height of the rectangle
 * @param {string} Color - Color of the rectangle outline
 * @param {number} [Thickness=3] - Thickness of the rectangle line
 * @returns {void} - Nothing
 */
function DrawEmptyRect(Left, Top, Width, Height, Color, Thickness = 3) {
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
	MainCanvas.lineWidth = Thickness.toString();
	MainCanvas.strokeStyle = Color;
	MainCanvas.stroke();
}

/**
 * Draws a basic rectangle filled with a given color
 * @param {number} Left - Position of the rectangle from the left of the canvas
 * @param {number} Top - Position of the rectangle from the top of the canvas
 * @param {number} Width - Width of the rectangle
 * @param {number} Height - Height of the rectangle
 * @param {string} Color - Color of the rectangle
 * @returns {void} - Nothing
 */
function DrawRect(Left, Top, Width, Height, Color) {
	MainCanvas.beginPath();
	MainCanvas.fillStyle = Color;
	MainCanvas.fillRect(Left, Top, Width, Height);
	MainCanvas.fill();
}

/**
 * Draws a basic circle
 * @param {number} CenterX - Position of the center of the circle on the X axis
 * @param {number} CenterY - Position of the center of the circle on the Y axis
 * @param {number} Radius - Radius of the circle to draw
 * @param {number} LineWidth - Width of the line
 * @param {string} LineColor - Color of the circle's line
 * @returns {void} - Nothing
 */
function DrawCircle(CenterX, CenterY, Radius, LineWidth, LineColor) {
	MainCanvas.beginPath();
	MainCanvas.arc(CenterX, CenterY, Radius, 0, 2 * Math.PI, false);
	MainCanvas.lineWidth = LineWidth;
	MainCanvas.strokeStyle = LineColor;
	MainCanvas.stroke();
}

/**
 * Draws a progress bar
 * @param {number} X - Position of the bar on the X axis
 * @param {number} Y - Position of the bar on the Y axis
 * @param {number} W - Width of the bar
 * @param {number} H - Height of the bar
 * @param {number} Progress - Current progress to display on the bar
 * @returns {void} - Nothing
 */
function DrawProgressBar(X, Y, W, H, Progress) {
	DrawRect(X, Y, W, H, "white");
	DrawRect(X + 2, Y + 2, Math.floor((W - 4) * Progress / 100), H - 4, "#66FF66");
	DrawRect(Math.floor(X + 2 + (W - 4) * Progress / 100), Y + 2, Math.floor((W - 4) * (100 - Progress) / 100), H - 4, "red");
}

/**
 * Constantly looping draw process. Draws beeps, handles the screen size, handles the current blindfold state and draws the current screen.
 * @returns {void} - Nothing
 */
function DrawProcess() {

	// Gets the Width and Height differently on mobile and regular browsers
	var W = (CommonIsMobile) ? document.documentElement.clientWidth : window.innerWidth;
	var H = (CommonIsMobile) ? document.documentElement.clientHeight : window.innerHeight;

	// If we need to resize, we keep the 2x1 ratio
	if ((DrawScreenWidth != W) || (DrawScreenHeight != H)) {
		DrawScreenWidth = W;
		DrawScreenHeight = H;
		if (W <= H * 2) {
			MainCanvas.width = W;
			MainCanvas.height = MainCanvas.width / 2;
			MainCanvas.canvas.style.width = "100%";
			MainCanvas.canvas.style.height = "";
		} else {
			MainCanvas.height = H;
			MainCanvas.width = MainCanvas.height * 2;
			MainCanvas.canvas.style.width = "";
			MainCanvas.canvas.style.height = "100%";
		}
	}

	// Gets the current screen background and draw it, it becomes darker in dialog mode or if the character is blindfolded
	var B = window[CurrentScreen + "Background"];
	if ((B != null) && (B != "")) {
		var DarkFactor = 1.0;
		if ((CurrentModule != "Character") && (B != "Sheet")) {
			const blindLevel = Player.GetBlindLevel();
			if (blindLevel >= 3) DarkFactor = 0.0;
			else if (blindLevel == 2) DarkFactor = 0.15;
			else if (blindLevel == 1) DarkFactor = 0.3;
			else if (CurrentCharacter != null || ShopStarted) DarkFactor = 0.5;
		}
		if (DarkFactor > 0.0) {
			let Invert = Player.GraphicsSettings && Player.GraphicsSettings.InvertRoom && Player.IsInverted();
			DrawImage("Backgrounds/" + B + ".jpg", 0, 0, Invert);
		}
		if (DarkFactor < 1.0) DrawRect(0, 0, 2000, 1000, "rgba(0,0,0," + (1.0 - DarkFactor) + ")");
	}

	// Draws the dialog screen or current screen if there's no loaded character
	if (CurrentCharacter != null) DialogDraw();
	else CommonDynamicFunction(CurrentScreen + "Run()");

	// Draws beep from online player sent by the server
	ServerDrawBeep();

	// Draws the 3D objects
	Draw3DProcess();

	// Leave dialogs AFTER drawing everything
	// If needed
	// Used to support items that remove you from the dialog during the draw phase
	if (DialogLeaveDueToItem) {
		DialogLeaveDueToItem = false
		DialogLeave()
	}

}

/**
 * Draws an asset's preview box
 * @param {number} X - Position of the preview box on the X axis
 * @param {number} Y - Position of the preview box on the Y axis
 * @param {Asset} A - The asset to draw the preview for
 * @Param {object} [Options] - Additional optional drawing options
 * @param {Character} Options.[C] - The character using the item (used to calculate dynamic item descriptions/previews)
 * @param {string} [Options.Description] - The preview box description
 * @param {string} [Options.Background] - The background color to draw the preview box in - defaults to white
 * @param {string} [Options.Foreground] - The foreground (text) color to draw the description in - defaults to black
 * @param {boolean} [Options.Vibrating] - Whether or not to add vibration effects to the item - defaults to false
 * @param {boolean} [Options.Border] - Whether or not to draw a border around the preview box
 * @param {boolean} [Options.Hover] - Whether or not the button should enable hover behaviour (background color change)
 * @param {string} [Options.HoverBackground] - The background color that should be used on mouse hover, if any
 * @param {boolean} [Options.Disabled] - Whether or not the element is disabled (prevents hover functionality)
 * @returns {void} - Nothing
 */
function DrawAssetPreview(X, Y, A, Options) {
	let {C, Description, Background, Foreground, Vibrating, Border, Hover, HoverBackground, Disabled} = (Options || {});
	const DynamicPreviewIcon = C ? A.DynamicPreviewIcon(C) : "";
	const Path = `${AssetGetPreviewPath(A)}/${A.Name}${DynamicPreviewIcon}.png`;
	if (Description == null) Description = C ? A.DynamicDescription(C) : A.Description;
	DrawPreviewBox(X, Y, Path, Description, { Background, Foreground, Vibrating, Border, Hover, HoverBackground, Disabled });
}

/**
 * Draws an item preview box for the provided image path
 * @param {number} X - Position of the preview box on the X axis
 * @param {number} Y - Position of the preview box on the Y axis
 * @param {string} Path - The path of the image to draw
 * @param {string} Description - The preview box description
 * @param {object} [Options] - Additional optional drawing options
 * @param {string} [Options.Background] - The background color to draw the preview box in - defaults to white
 * @param {string} [Options.Foreground] - The foreground (text) color to draw the description in - defaults to black
 * @param {boolean} [Options.Vibrating] - Whether or not to add vibration effects to the item - defaults to false
 * @param {boolean} [Options.Border] - Whether or not to draw a border around the preview box
 * @param {boolean} [Options.Hover] - Whether or not the button should enable hover behaviour (background color change)
 * @param {string} [Options.HoverBackground] - The background color that should be used on mouse hover, if any
 * @param {boolean} [Options.Disabled] - Whether or not the element is disabled (prevents hover functionality)
 * @returns {void} - Nothing
 */
function DrawPreviewBox(X, Y, Path, Description, Options) {
	let {Background, Foreground, Vibrating, Border, Hover, HoverBackground, Disabled} = (Options || {});
	const Height = Description ? 275 : 225;
	Background = Background || "#fff";
	Foreground = Foreground || "#000";
	if (Disabled === true) Background = "#888";
	else if (Hover && MouseHovering(X, Y, 225, Height)) Background = (HoverBackground || "cyan");
	DrawRect(X, Y, 225, Height, Background);
	setButton(X, Y);
	if (Border) DrawEmptyRect(X, Y, 225, Height, Foreground);
	const ImageX = Vibrating ? X + 1 + Math.floor(Math.random() * 3) : X + 2;
	const ImageY = Vibrating ? Y + 1 + Math.floor(Math.random() * 3) : Y + 2;
	DrawImageResize(Path, ImageX, ImageY, 221, 221);
	if (Description) DrawTextFit(Description, X + 110, Y + 250, 221, Foreground);
}
