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
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize(
		"Assets/" + asset.Group.Family + "/" + asset.DynamicGroupName + "/Preview/" + asset.Name +
		".png", 1389, 57, 221, 221);
	DrawTextFit(asset.Description, 1500, 310, 221, "black");

	MainCanvas.textAlign = "right";
	DrawTextFit("Brightness", 1475, 430, 400, "#fff", "#000");
	ElementPosition(InventoryHairAccessory3HaloBrightnessInputId, 1725, 430, 400);
	MainCanvas.textAlign = "center";

	DrawTextFit(DialogFind(Player, "InventoryHairAccessory3HaloType"), 1500, 530, 800, "#fff", "#000");

	InventoryHairAccessory3HaloOptions.forEach((option, i) => {
		const x = ExtendedXY[InventoryHairAccessory3HaloOptions.length][i][0];
		const y = ExtendedXY[InventoryHairAccessory3HaloOptions.length][i][1] + 80;
		const isSelected = property.Type === option.Property.Type;

		DrawButton(x, y, 225, 275, "", isSelected ? "#888" : "#fff", null, null, isSelected);
		DrawImage("Screens/Inventory/" + asset.DynamicGroupName + "/" + asset.Name + "/" + option.Name + ".png", x + 2, y);
		DrawTextFit(DialogFind(Player, "InventoryHairAccessory3HaloType" + option.Name), x + 112, y + 250, 225, "#000");
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
