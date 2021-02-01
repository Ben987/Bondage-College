"use strict";

// Loads the item extension properties
function InventoryItemFeetSpreaderVibratingDildoBarLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Intensity: -1 };
	if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = -1;
}

// Draw the item extension screen
function InventoryItemFeetSpreaderVibratingDildoBarDraw() {
	const {Intensity} = DialogFocusItem.Property;
	DrawAssetPreview(1387, 225, DialogFocusItem.Asset, {Vibrating: Intensity >= 0});

	DrawText(DialogFindPlayer("Intensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 600, "White", "Gray");
	if (Intensity !== -1) DrawButton(1200, 650, 200, 55, DialogFindPlayer("TurnOff"), "White");
	if (Intensity !== 0) DrawButton(1550, 650, 200, 55, DialogFindPlayer("Low"), "White");
	if (Intensity !== 1) DrawButton(1200, 710, 200, 55, DialogFindPlayer("Medium"), "White");
	if (Intensity !== 2) DrawButton(1550, 710, 200, 55, DialogFindPlayer("High"), "White");
	if (Intensity !== 3) DrawButton(1375, 770, 200, 55, DialogFindPlayer("Maximum"), "White");
}

// Catches the item extension clicks
function InventoryItemFeetSpreaderVibratingDildoBarClick() {
	if (MouseIn(1885, 25, 90, 90)) DialogFocusItem = null;
	else if (MouseIn(1200, 650, 200, 55) && (DialogFocusItem.Property.Intensity !== -1)) InventoryItemFeetSpreaderVibratingDildoBarSetIntensity(-1 - DialogFocusItem.Property.Intensity);
	else if (MouseIn(1550, 650, 200, 55) && (DialogFocusItem.Property.Intensity !== 0)) InventoryItemFeetSpreaderVibratingDildoBarSetIntensity(0 - DialogFocusItem.Property.Intensity);
	else if (MouseIn(1200, 710, 200, 55) && (DialogFocusItem.Property.Intensity !== 1)) InventoryItemFeetSpreaderVibratingDildoBarSetIntensity(1 - DialogFocusItem.Property.Intensity);
	else if (MouseIn(1550, 710, 200, 55) && (DialogFocusItem.Property.Intensity !== 2)) InventoryItemFeetSpreaderVibratingDildoBarSetIntensity(2 - DialogFocusItem.Property.Intensity);
	else if (MouseIn(1375, 770, 200, 55) && (DialogFocusItem.Property.Intensity !== 3)) InventoryItemFeetSpreaderVibratingDildoBarSetIntensity(3 - DialogFocusItem.Property.Intensity);
}

// Sets the vibrating egg intensity
function InventoryItemFeetSpreaderVibratingDildoBarSetIntensity(Modifier) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;
	if (DialogFocusItem.Property.Intensity == -1) DialogFocusItem.Property.Effect = ["Egged"];
	if (DialogFocusItem.Property.Intensity >= 0) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	CharacterLoadEffect(C);
	if (C.ID == 0) ServerPlayerAppearanceSync();

	ChatRoomPublishCustomAction("SpreaderVibratingDildoBar" + ((Modifier > 0) ? "Increase" : "Decrease") + "To" + DialogFocusItem.Property.Intensity, true, [{Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber}]);
}
