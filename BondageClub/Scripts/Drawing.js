// The main game canvas where everything will be drawn
"use strict";
var MainCanvas;
var TempCanvas;
var ColorCanvas;

// A bank of all the chached images
var DrawCacheImage = {};
var DrawCacheLoadedImages = 0;
var DrawCacheTotalImages = 0;
var DrawScreenWidth = -1;
var DrawScreenHeight = -1;

// Convert a hex color string to a RGB color
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

// Returns the hex value of a RGB data
function DrawRGBToHex(rgb) {
	var rgb = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);
	return '#' + (0x1000000 + rgb).toString(16).slice(1);
};

// Loads the drawing objects
function DrawLoad() {

	// Creates the objects used in the game
	MainCanvas = document.getElementById("MainCanvas").getContext("2d");
	TempCanvas = document.createElement("canvas").getContext("2d");
	ColorCanvas = document.createElement("canvas");
	document.getElementById("MainCanvas").addEventListener("keypress", KeyDown);
	document.getElementById("MainCanvas").tabIndex = 1000;
	document.addEventListener("keydown", DocumentKeyDown);

	// Font is fixed for now, color can be set
	MainCanvas.font = "36px Arial";
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";

}

// Returns the image file or build it from the source
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

// Reloads all character canvas once everything is loaded
function DrawGetImageOnLoad(Img) {
	++DrawCacheLoadedImages;
	if (DrawCacheLoadedImages == DrawCacheTotalImages) CharacterLoadCanvasAll();
}

// Attempt to redownload an image if it fails to load
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

// Refreshes the character if not all images are loaded and draw the character canvas on the main game screen
function DrawCharacter(C, X, Y, Zoom, IsHeightResizeAllowed) {
	if ((C != null) && ((C.ID == 0) || (Player.Effect.indexOf("BlindHeavy") < 0) || (CurrentScreen == "InformationSheet"))) {

		// There's 2 different canvas, one blinking and one that doesn't
		var seconds = new Date().getTime();
		var Canvas = (Math.round(seconds / 400) % C.BlinkFactor == 0) ? C.CanvasBlink : C.Canvas;
		
		// Applies an offset to X and Y based on the HeightRatio.  If the player prefers full height, we always use 1.0
		var HeightRatio = 1.0;
		if ((IsHeightResizeAllowed == undefined) || IsHeightResizeAllowed) HeightRatio = CharacterAppearanceGetCurrentValue(C, "Height", "Zoom");
		if ((Player != null) && (Player.VisualSettings != null) && (Player.VisualSettings.ForceFullHeight != null) && Player.VisualSettings.ForceFullHeight) HeightRatio = 1.0;
		if (Zoom == null) Zoom = 1;
		X += Zoom * Canvas.width * (1 - HeightRatio) / 2;
		if (C.Pose.indexOf("Suspension") < 0) Y += Zoom * Canvas.height * (1 - HeightRatio);

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
		if (C.Pose.indexOf("Suspension") >= 0) {
			var CanvasH = document.createElement("canvas");
			CanvasH.width = Canvas.width;
			CanvasH.height = Canvas.height;
			CanvasH.getContext("2d").scale(1, -1);
			CanvasH.getContext("2d").translate(0, -Canvas.height);
			CanvasH.getContext("2d").drawImage(Canvas, 0, 0);
			Canvas = CanvasH;
		}

		// Draw the character and applies the zoom ratio, the canvas to draw can be shrunk based on the height modifier
		Zoom *= HeightRatio;
		var H = Canvas.height + (((C.HeightModifier != null) && (C.HeightModifier < 0)) ? C.HeightModifier : 0);
		MainCanvas.drawImage(Canvas, 0, 0, Canvas.width, H, X, Y - (C.HeightModifier * Zoom), Canvas.width * Zoom, H * Zoom);

		// Applies a Y offset if the character is suspended
		if (C.Pose.indexOf("Suspension") >= 0) Y += (Zoom * Canvas.height * (1 - HeightRatio) / HeightRatio);

		// Draws the character focus zones if we need too
		if ((C.FocusGroup != null) && (C.FocusGroup.Zone != null))
			for (var Z = 0; Z < C.FocusGroup.Zone.length; Z++)
				if (C.Pose.indexOf("Suspension") >= 0)
					DrawEmptyRect((HeightRatio * C.FocusGroup.Zone[Z][0]) + X, (1000 - (HeightRatio * (C.FocusGroup.Zone[Z][1] + Y + C.FocusGroup.Zone[Z][3]))) - C.HeightModifier, (HeightRatio * C.FocusGroup.Zone[Z][2]), (HeightRatio * C.FocusGroup.Zone[Z][3]), "cyan");
				else
					DrawEmptyRect((HeightRatio * C.FocusGroup.Zone[Z][0]) + X, (HeightRatio * C.FocusGroup.Zone[Z][1]) + Y - C.HeightModifier - (C.IsKneeling() ? (250 * (1 - HeightRatio)) : 0), (HeightRatio * C.FocusGroup.Zone[Z][2]), (HeightRatio * C.FocusGroup.Zone[Z][3]), "cyan");

		// Draw the character name below herself
		if ((C.Name != "") && ((CurrentModule == "Room") || (CurrentModule == "Online") || ((CurrentScreen == "Wardrobe") && (C.ID != 0))) && (CurrentScreen != "Private"))
			if (!Player.IsBlind()) {
				MainCanvas.font = "30px Arial";
				DrawText(C.Name, X + 255 * Zoom, Y + 980 * Zoom, (CommonIsColor(C.LabelColor)) ? C.LabelColor : "White", "Black");
				MainCanvas.font = "36px Arial";
			}

	}
}

// Draw a zoomed image from a source to a specific canvas
function DrawImageZoomCanvas(Source, Canvas, SX, SY, SWidth, SHeight, X, Y, Width, Height, Dark) {
	var Img = DrawGetImage(Source);
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;

	var prevFilter = Canvas.filter;
	if(Dark) Canvas.filter = "brightness(25%)";
	Canvas.drawImage(Img, SX, SY, Math.round(SWidth), Math.round(SHeight), X, Y, Width, Height);
	Canvas.filter = prevFilter;  

	return true;
}

function DrawImageResize(Source, X, Y, Width, Height) {
	var Img = DrawGetImage(Source);
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;
	MainCanvas.drawImage(Img, 0, 0, Img.width, Img.height, X, Y, Width, Height);
	return true;
}

// Draw a zoomed image from a source to a specific canvas
function DrawImageCanvas(Source, Canvas, X, Y) {
	var Img = DrawGetImage(Source);
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;
	Canvas.drawImage(Img, X, Y);
	return true;
}

// Draw a specific canvas on the main canvas
function DrawCanvas(Canvas, X, Y) {
	MainCanvas.drawImage(Canvas, X, Y);
}

// Draw a specific canvas with a zoom on the main canvas
function DrawCanvasZoom(Canvas, X, Y, Zoom) {
	MainCanvas.drawImage(Canvas, 0, 0, Canvas.width, Canvas.height, X, Y, Canvas.width * Zoom, Canvas.height * Zoom);
}

// Draw a zoomed image from a source to the canvas and mirrors it from left to right
function DrawImageZoomMirror(Source, SX, SY, SWidth, SHeight, X, Y, Width, Height) {
	var Img = DrawGetImage(Source);
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;
	MainCanvas.save();
	MainCanvas.scale(-1, 1);
	MainCanvas.drawImage(Img, X * -1, Y, Width * -1, Height);
	MainCanvas.restore();
	return true;
}

// Draw an image from a source to the canvas
function DrawImage(Source, X, Y) {
	var Img = DrawGetImage(Source);
	if (!Img.complete) return false;
	if (!Img.naturalWidth) return true;
	MainCanvas.drawImage(Img, X, Y);
	return true;
}

// Draw an image from a source to the canvas
function DrawImageCanvasColorize(Source, Canvas, X, Y, Zoom, HexColor, FullAlpha) {

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
		for (var p = 0, len = data.length; p < len; p += 4) {
			if (data[p + 3] == 0)
				continue;
			trans = ((data[p] + data[p + 1] + data[p + 2]) / 383);
			data[p + 0] = rgbColor.r * trans;
			data[p + 1] = rgbColor.g * trans;
			data[p + 2] = rgbColor.b * trans;
		}
	} else {
		for (var p = 0, len = data.length; p < len; p += 4) {
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
	Canvas.drawImage(ctx.canvas, 0, 0, Img.width, Img.height, X, Y, Img.width * Zoom, Img.height * Zoom);

	return true;
}

// Draw an image from a source to the canvas
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

// Reduces the font size progressively until it fits the wrap size
function GetWrapTextSize(Text, Width, MaxLine) {

	// Don't bother if it fits on one line
	if (MainCanvas.measureText(Text).width > Width) {
		var words = Text.split(' ');
		var line = '';

		// Find the number of lines
		var LineCount = 1;
		for (var n = 0; n < words.length; n++) {
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

// Draw a word wrapped text in a rectangle
function DrawTextWrap(Text, X, Y, Width, Height, ForeColor, BackColor, MaxLine) {

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
		for (var n = 0; n < words.length; n++) {
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
		for (var n = 0; n < words.length; n++) {
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

// Draw a text that will fit on the specified width
function DrawTextFit(Text, X, Y, Width, Color) {

	for (var S = 36; S >= 10; S = S - 2) {
		MainCanvas.font = S.toString() + "px Arial";
		var metrics = MainCanvas.measureText(Text);
		if (metrics.width <= Width)
			break;
	}
	MainCanvas.fillStyle = Color;
	MainCanvas.fillText(Text, X, Y);
	MainCanvas.font = "36px Arial";
}

// Draw a text in the canvas
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

// Draw a button
function DrawButton(Left, Top, Width, Height, Label, Color, Image, HoveringText) {

	// Draw the button rectangle (makes the background color cyan if the mouse is over it)
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
	MainCanvas.fillStyle = ((MouseX >= Left) && (MouseX <= Left + Width) && (MouseY >= Top) && (MouseY <= Top + Height) && !CommonIsMobile) ? "Cyan" : Color;
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

// Draw a back & next button
function DrawBackNextButton(Left, Top, Width, Height, Label, Color, Image, BackText, NextText) {

	// Draw the button rectangle (makes half of the background cyan colored if the mouse is over it)
	var Split = Left + Width / 2;
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
	MainCanvas.fillStyle = Color;
	MainCanvas.fillRect(Left, Top, Width, Height);
	if ((MouseX >= Left) && (MouseX <= Left + Width) && (MouseY >= Top) && (MouseY <= Top + Height) && !CommonIsMobile) {
		MainCanvas.fillStyle = "Cyan";
		if (MouseX > Split) {
			MainCanvas.fillRect(Split, Top, Width / 2, Height);
		} else {
			MainCanvas.fillRect(Left, Top, Width / 2, Height);
		}
	}
	MainCanvas.lineWidth = '2';
	MainCanvas.strokeStyle = 'black';
	MainCanvas.stroke();
	MainCanvas.closePath();

	// Draw the text or image
	DrawTextFit(Label, Left + Width / 2, Top + (Height / 2) + 1, (CommonIsMobile) ? Width - 6 : Width - 36, "Black");
	if ((Image != null) && (Image != "")) DrawImage(Image, Left + 2, Top + 2);

	// PC only section
	if (CommonIsMobile) return;

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

	// Draw the hovering text
	if (BackText == null) BackText = () => "MISSING VALUE FOR: BACK TEXT";
	if (NextText == null) NextText = () => "MISSING VALUE FOR: NEXT TEXT";
	if ((MouseX >= Left) && (MouseX <= Left + Width) && (MouseY >= Top) && (MouseY <= Top + Height))
		DrawButtonHover(Left, Top, Width, Height, (MouseX > Split) ? NextText() : BackText());

}

// Draw the hovering text
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

// Draw a basic empty rectangle
function DrawEmptyRect(Left, Top, Width, Height, Color) {
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
	MainCanvas.lineWidth = '3';
	MainCanvas.strokeStyle = Color;
	MainCanvas.stroke();
}

// Draw a basic rectangle
function DrawRect(Left, Top, Width, Height, Color) {
	MainCanvas.beginPath();
	MainCanvas.fillStyle = Color;
	MainCanvas.fillRect(Left, Top, Width, Height);
	MainCanvas.fill();
}

// Draw a basic circle
function DrawCircle(CenterX, CenterY, Radius, LineWidth, LineColor) {
	MainCanvas.beginPath();
	MainCanvas.arc(CenterX, CenterY, Radius, 0, 2 * Math.PI, false);
	MainCanvas.lineWidth = LineWidth;
	MainCanvas.strokeStyle = LineColor;
	MainCanvas.stroke();
}

// Draw a progress bar
function DrawProgressBar(X, Y, W, H, Progress) {
	DrawRect(X, Y, W, H, "white");
	DrawRect(X + 2, Y + 2, Math.floor((W - 4) * Progress / 100), H - 4, "#66FF66");
	DrawRect(Math.floor(X + 2 + (W - 4) * Progress / 100), Y + 2, Math.floor((W - 4) * (100 - Progress) / 100), H - 4, "red");
}

// Makes sure the screen is at the proper size
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

	// Gets the current screen background and draw it, a darker version in character dialog mode
	var B = window[CurrentScreen + "Background"];
	if ((B != null) && (B != ""))
		if (((Player.Effect.indexOf("BlindNormal") >= 0) || (Player.Effect.indexOf("BlindHeavy") >= 0)) && (CurrentModule != "Character"))
			DrawRect(0, 0, 2000, 1000, "Black");
		else
			DrawImage("Backgrounds/" + B + ((((CurrentCharacter != null) || ShopStarted || (Player.Effect.indexOf("BlindLight") >= 0)) && (CurrentModule != "Character") && (B.indexOf("Dark") <= 0)) ? "Dark" : "") + ".jpg", 0, 0);

	// Draws the dialog screen or current screen if there's no loaded character
	if (CurrentCharacter != null) DialogDraw();
	else CommonDynamicFunction(CurrentScreen + "Run()");

	// Draws beep from online player sent by the server
	ServerDrawBeep();

}

// Draw the item preview box
function DrawItemPreview(X, Y, Item) {
	DrawRect(X, Y, 225, 275, "white");
	DrawImageResize("Assets/" + Item.Asset.Group.Family + "/" + Item.Asset.Group.Name + "/Preview/" + Item.Asset.Name + Item.Asset.DynamicPreviewIcon() + ".png", X + 2, Y + 2, 221, 221);
	DrawTextFit(Item.Asset.Description, X + 110, Y + 250, 221, "black");
}
