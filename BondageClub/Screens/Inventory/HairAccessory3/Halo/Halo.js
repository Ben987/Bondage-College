const InventoryHairAccessory3HaloBrightnessInputId = "InventoryHairAccessory3HaloBrightness";

const InventoryHairAccessory3HaloOptions = [
	{
		Name: "Default",
		Property: { Type: null },
	},
	{
		Name: "Broken",
		Property: { Type: "Broken" },
	},
];

/**
 * Loads the extended item's properties
 * @returns {void} - Nothing
 */
function InventoryHairAccessory3HaloLoad() {
	const C = CharacterAppearanceSelection;
	const item = DialogFocusItem;
	const property = item.Property = item.Property || {};
	let refresh = false;
	if (typeof property.Opacity !== "number") {
		property.Opacity = 0;
		refresh = true;
	}

	if (!InventoryHairAccessory3HaloOptions.find(option => option.Property.Type === property.Type)) {
		property.Type = InventoryHairAccessory3HaloOptions[0].Property.Type;
		refresh = true;
	}

	if (refresh) CharacterRefresh(C, false);

	const brightnessInput = ElementCreateRangeInput(
		InventoryHairAccessory3HaloBrightnessInputId, property.Opacity, item.Asset.MinOpacity, item.Asset.MaxOpacity, 0.01, "lightbulb");
	if (brightnessInput) {
		brightnessInput.addEventListener(
			"input",
			(e) => InventoryHairAccessory3HaloBrightnessChange(C, item, Number(e.target.value)),
		);
	}
}

/**
 * Handles drawing the Halo's extended item screen
 * @returns {void} - Nothing
 */
function InventoryHairAccessory3HaloDraw() {
	const asset = DialogFocusItem.Asset;
	const property = DialogFocusItem.Property;

	// Draw the header and item
	DrawAssetPreview(1387, 55, asset);

	MainCanvas.textAlign = "left";
	DrawTextFit(DialogFindPlayer("InventoryHairAccessory3HaloBrightness"), 1185, 430, 200, "#fff", "#000");
	ElementPosition(InventoryHairAccessory3HaloBrightnessInputId, 1630, 430, 400);
	MainCanvas.textAlign = "center";

	DrawTextFit(DialogFindPlayer("InventoryHairAccessory3HaloType"), 1500, 530, 800, "#fff", "#000");

	InventoryHairAccessory3HaloOptions.forEach((option, i) => {
		const x = ExtendedXY[InventoryHairAccessory3HaloOptions.length][i][0];
		const y = ExtendedXY[InventoryHairAccessory3HaloOptions.length][i][1] + 80;
		const isSelected = property.Type === option.Property.Type;
		const description = DialogFindPlayer(`InventoryHairAccessory3HaloType${option.Name}`);

		DrawPreviewBox(
			x, y, `${AssetGetInventoryPath(asset)}/${option.Name}.png`, description,
			{ Border: true, Hover: true, Disabled: isSelected },
		);
	});
}

/**
 * Handles clicks on the Halo's extended item screen
 * @returns {void} - Nothing
 */
function InventoryHairAccessory3HaloClick() {
	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		return InventoryHairAccessory3HaloExit();
	}

	const C = CharacterGetCurrent() || CharacterAppearanceSelection;

	InventoryHairAccessory3HaloOptions.forEach((option, i) => {
		const x = ExtendedXY[InventoryHairAccessory3HaloOptions.length][i][0];
		const y = ExtendedXY[InventoryHairAccessory3HaloOptions.length][i][1] + 80;

		if (MouseIn(x, y, 225, 275)) {
			ExtendedItemHandleOptionClick(C, InventoryHairAccessory3HaloOptions, option, false, true);
		}
	});
}

/**
 * Debounced callback for opacity slider changes
 * @param {Character} C - The character being modified
 * @param {Item} item - The halo item being modified
 * @param {number} brightness - The new brightness to set on the halo
 * @returns {void} - Nothing
 */
const InventoryHairAccessory3HaloBrightnessChange = CommonDebounce((C, item, brightness) => {
	item.Property.Opacity = brightness;
	CharacterRefresh(C, false);
}, 100);

/**
 * Exit handler for the Halo's extended item screen. Updates the character and removes UI components.
 * @returns {void} - Nothing
 */
function InventoryHairAccessory3HaloExit() {
	const C = CharacterAppearanceSelection;
	const item = DialogFocusItem;

	item.Property.Opacity = Number(ElementValue(InventoryHairAccessory3HaloBrightnessInputId));
	ChatRoomCharacterItemUpdate(C, item.Asset.Group.Name);

	ElementRemove(InventoryHairAccessory3HaloBrightnessInputId);
	PreferenceMessage = "";
	DialogFocusItem = null;
}
