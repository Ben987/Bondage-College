"use strict";

// Loads the item extension properties
function InventoryItemNeckAccessoriesCollarShockUnitLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Intensity: 0, ShowText: true };
	if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = 0;
	if (DialogFocusItem.Property.ShowText == null) DialogFocusItem.Property.ShowText = true;
}

// Draw the item extension screen
function InventoryItemNeckAccessoriesCollarShockUnitDraw() {
	DrawAssetPreview(1387, 225, DialogFocusItem.Asset);
	DrawText(DialogFindPlayer("Intensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 600, "White", "Gray");
	if (DialogFocusItem.Property.Intensity > 0) DrawButton(1200, 650, 200, 55, DialogFindPlayer("Low"), "White");
	if (DialogFocusItem.Property.Intensity < 1 || DialogFocusItem.Property.Intensity > 1) DrawButton(1550, 650, 200, 55, DialogFindPlayer("Medium"), "White");
	if (DialogFocusItem.Property.Intensity < 2) DrawButton(1375, 710, 200, 55, DialogFindPlayer("High"), "White");
	if (CurrentScreen == "ChatRoom") DrawButton(1325, 800, 64, 64, "", "White", DialogFocusItem.Property.ShowText ? "Icons/Checked.png" : "");
	if (CurrentScreen == "ChatRoom") DrawText(DialogFindPlayer("ShockCollarShowChat"), 1570, 833, "White", "Gray");
	DrawButton(1375, 900, 200, 55, DialogFindPlayer("TriggerShock"), "White");
}

// Catches the item extension clicks
function InventoryItemNeckAccessoriesCollarShockUnitClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1325) && (MouseX <= 1389) && (MouseY >= 800) && (MouseY <= 864) && (CurrentScreen == "ChatRoom")) {
		DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
	}
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Intensity > 0)) InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(0 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Intensity < 1 || DialogFocusItem.Property.Intensity > 1)) InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Intensity < 2)) InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(2 - DialogFocusItem.Property.Intensity);
	if (Player.CanInteract() && (MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 900) && (MouseY <= 955)) InventoryItemNeckAccessoriesCollarShockUnitTrigger();
}

// Sets the shock collar intensity
function InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(Modifier) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemNeckAccessoriesCollarShockUnitLoad();
	}

	DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;
	if (DialogFocusItem.Property.ShowText) {
		var Dictionary = [];
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "AssetName", AssetName: DialogFocusItem.Asset.Name});
		ChatRoomPublishCustomAction("ShockCollarSet" + DialogFocusItem.Property.Intensity, true, Dictionary);
	}
	else
		DialogLeave();

}

// Trigger a shock from the dialog menu
function InventoryItemNeckAccessoriesCollarShockUnitTrigger() {
	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemNeckAccessoriesCollarShockUnitLoad();
	}

	var Dictionary = [];
	Dictionary.push({ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({Tag: "AssetName", AssetName: DialogFocusItem.Asset.Name});
	Dictionary.push({ Tag: "ActivityName", Text: "ShockItem" });
	Dictionary.push({ Tag: "ActivityGroup", Text: DialogFocusItem.Asset.Group.Name });
	Dictionary.push({ AssetName: DialogFocusItem.Asset.Name });
	Dictionary.push({ AssetGroupName: DialogFocusItem.Asset.Group.Name });

	ChatRoomPublishCustomAction("TriggerShock" + DialogFocusItem.Property.Intensity, false, Dictionary);

	if (C.ID == Player.ID) {
		// The Player shocks herself
		ActivityArousalItem(C, C, DialogFocusItem.Asset);
	}
	if (CurrentScreen == "ChatRoom") DialogLeave();

	InventoryShockExpression(C);
}

function AssetsItemNeckAccessoriesCollarShockUnitBeforeDraw(data) {
	return data.L === "_Light" ? { Color: "#2f0" } : null;
}

function AssetsItemNeckAccessoriesCollarShockUnitScriptDraw(data) {
	var persistentData = data.PersistentData();
	var property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.ChangeTime !== "number") persistentData.ChangeTime = CommonTime() + 4000;

	if (persistentData.ChangeTime < CommonTime()) {
		var wasBlinking = property.Type === "Blink";
		property.Type = wasBlinking ? null : "Blink";
		var timeToNextRefresh = wasBlinking ? 4000 : 1000;
		persistentData.ChangeTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}

/**
 * @returns {[string, number]}
 */
function InventoryItemNeckAccessoriesCollarShockUnitDynamicAudio(data) {
	var Modifier = parseInt(data.Content.substr(data.Content.length - 1));
	if (isNaN(Modifier)) Modifier = 0;
	return ["Shocks", Modifier * 3];
}
