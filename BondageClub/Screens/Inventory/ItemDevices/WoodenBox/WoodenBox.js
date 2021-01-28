const InventoryItemDevicesWoodenBoxAllowedChars = /^(?:\w|[ ~!$#%*+])*$/;
const InventoryItemDevicesWoodenBoxInputPattern = "(?:\\w|[ ~!$#%*+])*";
const InventoryItemDevicesWoodenBoxMaxLength = 20;
const InventoryItemDevicesWoodenBoxTextInputId = "InventoryItemDevicesWoodenBoxText";
const InventoryItemDevicesWoodenBoxOpacityInputId = "InventoryItemDevicesWoodenBoxOpacity";

let InventoryItemDevicesWoodenBoxOriginalText = null;

/**
 * Loads the wooden box's extended item properties
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxLoad() {
	const C = CharacterGetCurrent();
	const item = DialogFocusItem;
	let mustRefresh = false;

	const Property = item.Property = item.Property || {};
	if (typeof Property.Text !== "string") {
		Property.Text = "";
		mustRefresh = true;
	}
	if (typeof Property.Opacity !== "number") {
		Property.Opacity = 0;
		InventoryItemDevicesWoodenBoxSetOpacity(Property, Property.Opacity);
		mustRefresh = true;
	}


	if (mustRefresh) {
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, item.Asset.Group.Name);
	}

	if (InventoryItemDevicesWoodenBoxOriginalText == null) {
		InventoryItemDevicesWoodenBoxOriginalText = Property.Text;
	}

	const textInput = ElementCreateInput(
		InventoryItemDevicesWoodenBoxTextInputId, "text", Property.Text, InventoryItemDevicesWoodenBoxMaxLength);
	if (textInput) {
		textInput.pattern = InventoryItemDevicesWoodenBoxInputPattern;
		textInput.addEventListener("input", (e) => InventoryItemDevicesWoodenBoxTextChange(C, item, e.target.value));
	}

	const opacitySlider = ElementCreateRangeInput(InventoryItemDevicesWoodenBoxOpacityInputId, Property.Opacity, item.Asset.MinOpacity, item.Asset.MaxOpacity, 0.01, "blindfold");
	if (opacitySlider) {
		opacitySlider.addEventListener("input", (e) => InventoryItemDevicesWoodenBoxOpacityChange(C, item, e.target.value));
	}
}

/**
 * Draw handler for the wooden box's extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxDraw() {
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize(
		"Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name +
		".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	MainCanvas.textAlign = "right";
	DrawTextFit(DialogFind(Player, "WoodenBoxOpacityLabel"), 1475, 500, 400, "#fff", "#000");
	ElementPosition(InventoryItemDevicesWoodenBoxOpacityInputId, 1725, 500, 400);

	DrawTextFit(DialogFind(Player, "WoodenBoxTextLabel"), 1475, 580, 400, "#fff", "#000");
	ElementPosition(InventoryItemDevicesWoodenBoxTextInputId, 1725, 580, 400);
	MainCanvas.textAlign = "center";
}

/**
 * Click handler for the wooden box's extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxClick() {
	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		return InventoryItemDevicesWoodenBoxExit();
	}
}

/**
 * Exits the wooden box's extended item screen, sends a chatroom message if appropriate, and cleans up inputs and text
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxExit() {
	const C = CharacterGetCurrent();
	const item = DialogFocusItem;

	InventoryItemDevicesWoodenBoxSetOpacity(item.Property, InventoryItemDevicesWoodenBoxGetInputOpacity());
	const text = InventoryItemDevicesWoodenBoxGetText();
	if (InventoryItemDevicesWoodenBoxAllowedChars.test(text)) item.Property.Text = text;

	if (CurrentScreen === "ChatRoom" && text !== InventoryItemDevicesWoodenBoxOriginalText) {
		const dictionary = [
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
			{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
			{ Tag: "NewText", Text: text },
			{ Tag: "AssetName", AssetName: item.Asset.Name },
		];
		const msg = text === "" ? "WoodenBoxTextRemove" : "WoodenBoxTextChange";
		ChatRoomPublishCustomAction(msg, false, dictionary);
	}

	CharacterRefresh(C);
	ChatRoomCharacterItemUpdate(C, item.Asset.Group.Name);

	ElementRemove(InventoryItemDevicesWoodenBoxTextInputId);
	ElementRemove(InventoryItemDevicesWoodenBoxOpacityInputId);
	InventoryItemDevicesWoodenBoxOriginalText = null;
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild(CharacterGetCurrent());
}

/**
 * Sets the opacity of the wooden box based, and applies effects based on its opacity value
 * @param {Property} property - The item's Property object
 * @param {number} opacity - The opacity to set on the item's Property
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxSetOpacity(property, opacity) {
	if (opacity !== property.opacity) property.Opacity = opacity;
	if (!Array.isArray(property.Effect)) property.Effect = [];
	const transparent = property.Opacity < 0.15;
	const effectsToApply = transparent ? ["Prone", "Enclose", "Freeze"] : ["Prone", "Enclose", "BlindNormal", "GagLight", "Freeze"];
	const effectsToRemoves = transparent ? ["BlindNormal", "GagLight"] : [];
	property.Effect = property.Effect.filter(e => !effectsToRemoves.includes(e));
	effectsToApply.forEach(e => {
		if (!property.Effect.includes(e)) property.Effect.push(e);
	});
}

/**
 * Handles wooden box opacity changes. Refreshes the character locally
 * @returns {void} - Nothing
 */
const InventoryItemDevicesWoodenBoxOpacityChange = CommonDebounce((C, item, opacity) => {
	item.Property.Opacity = Number(opacity);
	CharacterRefresh(C, false);
}, 100);

/**
 * Handles wooden box text changes. Refreshes the character locally
 * @returns {void} - Nothing
 */
const InventoryItemDevicesWoodenBoxTextChange = CommonDebounce((C, item, text) => {
	if (InventoryItemDevicesWoodenBoxAllowedChars.test(text)) {
		item.Property.Text = text.substring(0, InventoryItemDevicesWoodenBoxMaxLength);
		CharacterRefresh(C, false);
	}
}, 200);

/**
 * Fetches the current input text, trimmed appropriately
 * @returns {string} - The text in the wooden box's input element
 */
function InventoryItemDevicesWoodenBoxGetText() {
	return ElementValue(InventoryItemDevicesWoodenBoxTextInputId).substring(0, InventoryItemDevicesWoodenBoxMaxLength);
}

function InventoryItemDevicesWoodenBoxGetInputOpacity() {
	return Number(ElementValue(InventoryItemDevicesWoodenBoxOpacityInputId));
}

function AssetsItemDevicesWoodenBoxAfterDraw({ C, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color, Opacity }) {
	if (L === "_Text") {
		// We set up a canvas
		const height = 900;
		const width = 310;
		const TempCanvas = AnimationGenerateTempCanvas(C, A, width, height);

		let text = Property && Property.Text || "";
		if (!InventoryItemDevicesWoodenBoxAllowedChars.test(text)) text = "";
		text = text.substring(0, InventoryItemDevicesWoodenBoxMaxLength);

		let fontHeight = 96;

		const angle = Math.atan(height / width);
		const hypotenuse = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));
		const textWidth = hypotenuse - 2 * (height / width) * (fontHeight / 2);

		let context = TempCanvas.getContext("2d");

		context.textAlign = "center";
		context.font = `${fontHeight}px 'Saira Stencil One', 'Arial', sans-serif`;
		context.fillStyle = Color;
		context.textBaseline = "middle";

		// Dummy text fill to force the browser to load the font (otherwise it
		// won't get loaded until after the first time the text has been
		// populated, causing the first draw to fallback)
		context.fillText("", 0, 0);

		const rgb = DrawHexToRGB(Color);

		context.save();
		context.translate(width / 2, height / 2);
		context.rotate(-angle);
		context.translate(-width / 2, -height / 2);
		context.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.7 * Opacity})`;
		context.fillText(text, width / 2, height / 2, textWidth);
		context.restore();

		// We print the canvas on the character based on the asset position
		drawCanvas(TempCanvas, X + 90, Y + 300, AlphaMasks);
		drawCanvasBlink(TempCanvas, X + 90, Y + 300, AlphaMasks);
	}
}

