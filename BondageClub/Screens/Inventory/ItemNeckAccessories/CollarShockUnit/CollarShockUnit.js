"use strict";

// Loads the item extension properties
function InventoryItemNeckAccessoriesCollarShockUnitLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Intensity: 0, ShowText: true };
	if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = 0;
	if (DialogFocusItem.Property.ShowText == null) DialogFocusItem.Property.ShowText = true;
}

// Draw the item extension screen
function InventoryItemNeckAccessoriesCollarShockUnitDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, "Intensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 600, "White", "Gray");
	if(DialogFocusItem.Property.Intensity > 0) DrawButton(1200, 650, 200, 55, DialogFind(Player, "Low"), "White");
	if(DialogFocusItem.Property.Intensity < 1) DrawButton(1550, 650, 200, 55, DialogFind(Player, "Medium"), "White");
	if(DialogFocusItem.Property.Intensity > 1) DrawButton(1550, 650, 200, 55, DialogFind(Player, "Medium"), "White");
	if(DialogFocusItem.Property.Intensity < 2) DrawButton(1375, 710, 200, 55, DialogFind(Player, "High"), "White");
	if( CurrentScreen == "ChatRoom") DrawButton(1325, 800, 64, 64, "", "White", DialogFocusItem.Property.ShowText ? "Icons/Checked.png" : "");
	if( CurrentScreen == "ChatRoom") DrawText(DialogFind(Player, "ShockCollarShowChat"), 1570, 833, "White", "Gray");
}

// Catches the item extension clicks
function InventoryItemNeckAccessoriesCollarShockUnitClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1325) && (MouseX <= 1389) && (MouseY >= 800) && (MouseY <= 864) && (CurrentScreen == "ChatRoom")) {
		DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
		DialogLeave();
	}
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Intensity > 0)) InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(0 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Intensity < 1)) InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Intensity > 1)) InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Intensity < 2)) InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(2 - DialogFocusItem.Property.Intensity);
}

// Sets the shock collar intensity
function InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(Modifier) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;
	if (DialogFocusItem.Property.ShowText)
		ChatRoomPublishCustomAction((DialogFind(Player, "ShockCollarSet" + DialogFocusItem.Property.Intensity)).replace("SourceCharacter",Player.Name).replace("DestinationCharacter",C.Name), true);
	else
		DialogLeave();
}
