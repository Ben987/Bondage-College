"use strict";

// Loads the item extension properties
function InventoryItemNeckShockCollarLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Intensity: 0, ShowText: true };
	if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = 0;
	if (DialogFocusItem.Property.ShowText == null) DialogFocusItem.Property.ShowText = true;
}

// Draw the item extension screen
function InventoryItemNeckShockCollarDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, "Intensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 600, "White", "Gray");
	if( DialogFocusItem.Property.Intensity > 0) DrawButton(1200, 700, 250, 65, DialogFind(Player, "Decrease"), "White");
	if( DialogFocusItem.Property.Intensity < 2) DrawButton(1550, 700, 250, 65, DialogFind(Player, "Increase"), "White");
	if( CurrentScreen == "ChatRoom") DrawButton(1325, 800, 64, 64, "", "White", DialogFocusItem.Property.ShowText ? "Icons/Checked.png" : "");
	if( CurrentScreen == "ChatRoom") DrawText(DialogFind(Player, "ShockCollarShowChat"), 1570, 833, "White", "Gray");
}

// Catches the item extension clicks
function InventoryItemNeckShockCollarClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1325) && (MouseX <= 1389) && (MouseY >= 800) && (MouseY <= 864) && (CurrentScreen == "ChatRoom")) {
		DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
		DialogLeave();
	}
	if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 700) && (MouseY <= 765) && (DialogFocusItem.Property.Intensity > 0)) InventoryItemNeckShockCollarSetIntensity(-1);
	if ((MouseX >= 1550) && (MouseX <= 1800) && (MouseY >= 700) && (MouseY <= 765) && (DialogFocusItem.Property.Intensity < 2)) InventoryItemNeckShockCollarSetIntensity(1);
}

// Sets the shock collar intensity
function InventoryItemNeckShockCollarSetIntensity(Modifier) {
	var C = InventoryExtendedItemGetCurrentCharacter();
	DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;
	if (DialogFocusItem.Property.ShowText)
		ChatRoomPublishCustomAction((DialogFind(Player, "ShockCollarSet" + DialogFocusItem.Property.Intensity)).replace("SourceCharacter",Player.Name).replace("DestinationCharacter",C.Name), true);
	else
		DialogLeave();
}
