"use strict";
const InventoryItemDevicesVacBedDeluxeOpacityInputId = "InventoryItemDevicesVacBedDeluxeOpacity";
const InventoryItemDevicesVacBedDeluxeSelection = "ArmsDownLegsSpread"

const InventoryItemDevicesVacBedDeluxeSelectionOffsetX = 1000
const InventoryItemDevicesVacBedDeluxeSelectionOffsetY = 700
const InventoryItemDevicesVacBedDeluxeSelectionWidth = 256
const InventoryItemDevicesVacBedDeluxeSelectionSpacing = 0

let InventoryItemDevicesVacBedDeluxeOptions = [
	{
		Name: "ArmsDownLegsSpread",
		Property: {
			Type: null,
			SetPose: ["BaseLower"],
			Prequisite: ["LegsOpen"]
		}
	},
	{
		Name: "ArmsDownLegsTogether",
		Property: {
			Type: "ArmsDownLegsTogether",
			SetPose: ["LegsClosed"]
		}
	},
	{
		Name: "ArmsUpLegsSpread",
		Property: {
			Type: "ArmsUpLegsSpread",
			SetPose: ["Yoked", "BaseLower"]
		}
	},
	{
		Name: "ArmsUpLegsTogether",
		Property: {
			Type: "ArmsUpLegsTogether",
			SetPose: ["Yoked","LegsClosed"]
		}
	},
];

/**
 * Loads the vac bed's extended item properties
 * @returns {void} - Nothing
 */
function InventoryItemDevicesVacBedDeluxeLoad() {
	const character = CharacterGetCurrent();
	const item = DialogFocusItem;
	let refresh = false;

	const Property = item.Property = item.Property || { Selection: "ArmsDownLegsSpread", Opacity: 1 };
	if(typeof Property.Selection !== "string")
	{
		Property.Selection = InventoryItemDevicesVacBedDeluxeOptions[0].Name;
		refresh = true;
	}
	if (typeof Property.Opacity !== "number") {
		Property.Opacity = item.Asset.Opacity;
		InventoryItemDevicesVacBedDeluxeSetOpacity(Property, Property.Opacity);
		refresh = true;
	}

	if (refresh) {
		CharacterRefresh(character);
		ChatRoomCharacterItemUpdate(character, item.Asset.Group.Name);
	}

	const opacitySlider = ElementCreateRangeInput(InventoryItemDevicesVacBedDeluxeOpacityInputId, Property.Opacity, item.Asset.MinOpacity, item.Asset.MaxOpacity, 0.01, "blindfold", false);
	if (opacitySlider) {
		opacitySlider.addEventListener("input", (e) => InventoryItemDevicesVacBedDeluxeOpacityChange(character, item, e.target.value));
	}
}

/**
 * Draw handler for the vac bed's extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemDevicesVacBedDeluxeDraw() {
	const asset = DialogFocusItem.Asset;

	// Draw the header and item
	DrawAssetPreview(1387, 125, asset);

	MainCanvas.textAlign = "right";
	DrawTextFit(DialogFindPlayer("VacBedDeluxeOpacityLabel"), 1375, 500, 400, "#FFFFFF", "#000");
	ElementPosition(InventoryItemDevicesVacBedDeluxeOpacityInputId, 1625, 500, 400);
	DrawTextFit(Math.round(DialogFocusItem.Property.Opacity * 100).toString()+"%", 1925, 500, 400, "#FFFFFF", "#000");
	MainCanvas.textAlign = "center";

	DrawTextFit(DialogFindPlayer("VacBedDeluxeTypeLabel"), 1500, 660, 800, "#FFFFFF", "#000");

	InventoryItemDevicesVacBedDeluxeOptions.forEach((option, i) => {
		const x = InventoryItemDevicesVacBedDeluxeSelectionOffsetX +
				(i * 
					(InventoryItemDevicesVacBedDeluxeSelectionWidth + InventoryItemDevicesVacBedDeluxeSelectionSpacing)
				)
		const y = InventoryItemDevicesVacBedDeluxeSelectionOffsetY;
		const isSelected = DialogFocusItem.Property.Selection === option.Name;
		DrawPreviewBox(x, y, `${AssetGetInventoryPath(asset)}/${option.Name}.png`, "", {
			Border: true,
			Hover: true,
			Disabled: isSelected,
		});
	});
}

/**
 * Click handler for the vac bed's extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemDevicesVacBedDeluxeClick() {
	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		return InventoryItemDevicesVacBedDeluxeExit();
	}

	InventoryItemDevicesVacBedDeluxeOptions.some((option, i) => {
		const x = InventoryItemDevicesVacBedDeluxeSelectionOffsetX +
		(i * 
			(InventoryItemDevicesVacBedDeluxeSelectionWidth + InventoryItemDevicesVacBedDeluxeSelectionSpacing)
		)
		const y = InventoryItemDevicesVacBedDeluxeSelectionOffsetY;
		if (MouseIn(x, y, 225, 275)) {
			const character = CharacterGetCurrent();
			DialogFocusItem.Property.Type = option.Property.Type;
			DialogFocusItem.Property.SetPose = option.Property.SetPose;
			DialogFocusItem.Property.Selection = option.Name;
			CharacterRefresh(character, false);
			InventoryItemDevicesVacBedDeluxePublishAction(character, option);
		}
	});
}

/**
 * Exits the vac bed's extended item screen, sends a chatroom message if appropriate, and cleans up inputs and text
 * @returns {void} - Nothing
 */
function InventoryItemDevicesVacBedDeluxeExit() {
	const character = CharacterGetCurrent();
	const item = DialogFocusItem;

	let setOpacity = window[`Inventory${item.Asset.Group.Name}${item.Asset.Name}SetOpacity`] || InventoryItemDevicesVacBedDeluxeSetOpacity;
	setOpacity(item.Property, InventoryItemDevicesVacBedDeluxeGetInputOpacity());

	CharacterRefresh(character);
	ChatRoomCharacterItemUpdate(character, item.Asset.Group.Name);

	ElementRemove(InventoryItemDevicesVacBedDeluxeOpacityInputId);
	
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild(CharacterGetCurrent());
}

/**
 * Sets the opacity of the vac bed based, and applies effects based on its opacity value
 * @param {Property} property - The item's Property object
 * @param {number} opacity - The opacity to set on the item's Property
 * @returns {void} - Nothing
 */
function InventoryItemDevicesVacBedDeluxeSetOpacity(property, opacity) {
	if (opacity !== property.opacity) property.Opacity = opacity;

}

/**
 * Handles vac bed opacity changes. Refreshes the character locally
 * @returns {void} - Nothing
 */
const InventoryItemDevicesVacBedDeluxeOpacityChange = CommonLimitFunction((character, item, opacity) => {
	item = DialogFocusItem || item;
	item.Property.Opacity = Number(opacity);
	CharacterRefresh(character, false);
});

/**
 * Publishes an action if the vac bed's type changes
 * @returns {void} - Nothing
 */
function InventoryItemDevicesVacBedDeluxePublishAction(C, Option) {
	let dictionary = [];
	dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction("VacBedDeluxeChangeType", true, dictionary);
}

/**
 * Fetches the current opacity input value, parsed to a number
 * @returns {number} - The value of the vac bed's opacity input slider
 */
function InventoryItemDevicesVacBedDeluxeGetInputOpacity() {
	return Number(ElementValue(InventoryItemDevicesVacBedDeluxeOpacityInputId));
}
