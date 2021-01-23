const InventoryItemHoodCanvasHoodAllowedChars = /^(?:\w|[ ~!$#%*+])*$/;
const InventoryItemHoodCanvasHoodMaxLength = 12;
const InventoryItemHoodCanvasHoodInputId = "InventoryItemHoodCanvasHoodText";

/**
 * Loads the canvas hood's extended item properties
 * @returns {void} - Nothing
 */
function InventoryItemHoodCanvasHoodLoad() {
	const C = CharacterGetCurrent();
	let MustRefresh = false;

	const Property = DialogFocusItem.Property = DialogFocusItem.Property || {};
	if (typeof Property.Text !== "string") {
		Property.Text = "";
		MustRefresh = true;
	}

	if (MustRefresh) {
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}

	ElementCreateInput(InventoryItemHoodCanvasHoodInputId, "text", Property.Text, InventoryItemHoodCanvasHoodMaxLength);
}

/**
 * Draw handler for the canvas hood's extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemHoodCanvasHoodDraw() {
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize(
		"Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name +
		".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	const updateAllowed = InventoryItemHoodCanvasHoodAllowedChars.test(InventoryItemHoodCanvasHoodGetText());
	DrawTextFit(DialogFind(Player, "CanvasHoodLabel"), 1505, 620, 350, "#fff", "#000");
	ElementPosition(InventoryItemHoodCanvasHoodInputId, 1505, 680, 350);
	DrawButton(1330, 731, 340, 64, DialogFind(Player, "SaveText"), updateAllowed ? "White" : "#888", "");
}

/**
 * Click handler for the canvas hood's extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemHoodCanvasHoodClick() {
	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		return InventoryItemHoodCanvasHoodExit();
	}

	const text = InventoryItemHoodCanvasHoodGetText();
	if (MouseIn(1330, 731, 340, 64) && InventoryItemHoodCanvasHoodAllowedChars.test(text)) {
		DialogFocusItem.Property.Text = text;
		InventoryItemHoodCanvasHoodChange(text);
	}
}

/**
 * Exits the canvas hood's extended item screen and cleans up inputs and text
 * @returns {void} - Nothing
 */
function InventoryItemHoodCanvasHoodExit() {
	ElementRemove(InventoryItemHoodCanvasHoodInputId);
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild(CharacterGetCurrent());
}

/**
 * Handles canvas hood text changes. Refreshes the character and sends an
 * appropriate chatroom message
 * @returns {void} - Nothing
 */
function InventoryItemHoodCanvasHoodChange(text) {
	var C = CharacterGetCurrent();
	CharacterRefresh(C);
	if (CurrentScreen == "ChatRoom") {
		var Dictionary = [
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
			{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
			{ Tag: "NewText", Text: text }
		];
		ChatRoomPublishCustomAction("CanvasHoodChange", true, Dictionary);
		InventoryItemHoodCanvasHoodExit();
	}
}

/**
 * Fetches the current input text, trimmed appropriately
 * @returns {string} - The text in the canvas hood's input element
 */
function InventoryItemHoodCanvasHoodGetText() {
	return ElementValue(InventoryItemHoodCanvasHoodInputId).substring(0, InventoryItemHoodCanvasHoodMaxLength);
}

/**
 * Post-render drawing function. Draws custom text in a slight arc to mimic the
 * curvature of the character's head.
 * @returns {void} - Nothing
 */
function AssetsItemHoodCanvasHoodAfterDraw({ C, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color }) {
	if (L === "_Text") {
		// Fetch the text property and assert that it matches the character
		// and length requirements
		let text = Property && Property.Text || "";
		if (!InventoryItemHoodCanvasHoodAllowedChars.test(text)) text = "";
		text = text.substring(0, InventoryItemHoodCanvasHoodMaxLength);

		// Prepare a temporary canvas to draw the text to
		const height = 60;
		const width = 130;
		const tempCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const context = tempCanvas.getContext("2d");

		// Each character is assigned a small angle - the angle assigned to
		// spaces is proportionately less
		const angle = Math.min(text.length * 0.021, 0.08) * Math.PI;
		const spaceWeight = 0.4;
		let weight = 0;
		for (let i = 0; i < text.length; i++) {
			if (text[i] === " ") weight += spaceWeight;
			else weight += 1;
		}
		const characterAngle = angle / weight;
		const spaceAngle = spaceWeight * angle / weight;
		const radius = 450;
		const fontSize = Math.min(36, 256 / Math.pow(text.length, 1.1));

		// Prepare the canvas context with the appropriate styling
		context.textAlign = "center";
		context.font = `${fontSize}px 'Saira Stencil One', 'Arial', sans-serif`;
		context.fillStyle = Color;

		// Dummy text fill to force the browser to load the font (otherwise it
		// won't get loaded until after the first time the text has been
		// populated, causing the first draw to fallback)
		context.fillText("", 0, 0);

		// Prepare the canvas by translating off the center position and
		// rotating to where the arc of text should start
		context.save();
		context.translate(65, 500);
		context.rotate(-1 * angle / 2);
		context.rotate(-1 * (angle / weight) / 2);

		// Draw each character in turn, rotating the canvas between characters
		for (var n = 0; n < text.length; n++) {
			var char = text[n];
			context.rotate(char === " " ? spaceAngle : characterAngle);
			context.save();
			context.translate(0, -1 * radius);
			context.fillText(char, 0, 0);
			context.restore();
		}

		// Restore the canvas back to its original position
		context.restore();

		// Draw the temporary canvas onto the main canvas
		drawCanvas(tempCanvas, X + 35, Y + 55, AlphaMasks);
		drawCanvasBlink(tempCanvas, X + 35, Y + 55, AlphaMasks);
	}
}
