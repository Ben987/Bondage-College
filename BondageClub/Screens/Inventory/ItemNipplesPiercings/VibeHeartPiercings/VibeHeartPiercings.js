"use strict";

// Loads the item extension properties
function InventoryItemNipplesPiercingsVibeHeartPiercingsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Intensity: -1 };
	if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = -1;
}

// Draw the item extension screen
function InventoryItemNipplesPiercingsVibeHeartPiercingsDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	if (DialogFocusItem.Property.Intensity >= 0)
		DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389 + Math.floor(Math.random() * 3) - 1, 227 + Math.floor(Math.random() * 3) - 1, 221, 221);
	else DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, "Intensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 600, "White", "Gray");
	if (DialogFocusItem.Property.Intensity > -1) DrawButton(1200, 650, 200, 55, DialogFind(Player, "TurnOff"), "White");
	if (DialogFocusItem.Property.Intensity < 0) DrawButton(1550, 650, 200, 55, DialogFind(Player, "Low"), "White");
	if (DialogFocusItem.Property.Intensity > 0) DrawButton(1550, 650, 200, 55, DialogFind(Player, "Low"), "White");
	if (DialogFocusItem.Property.Intensity < 1) DrawButton(1200, 710, 200, 55, DialogFind(Player, "Medium"), "White");
	if (DialogFocusItem.Property.Intensity > 1) DrawButton(1200, 710, 200, 55, DialogFind(Player, "Medium"), "White");
	if (DialogFocusItem.Property.Intensity < 2) DrawButton(1550, 710, 200, 55, DialogFind(Player, "High"), "White");
	if (DialogFocusItem.Property.Intensity > 2) DrawButton(1550, 710, 200, 55, DialogFind(Player, "High"), "White");
	if (DialogFocusItem.Property.Intensity < 3) DrawButton(1375, 770, 200, 55, DialogFind(Player, "Maximum"), "White");
}

// Catches the item extension clicks
function InventoryItemNipplesPiercingsVibeHeartPiercingsClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Intensity > -1)) InventoryItemNipplesPiercingsVibeHeartPiercingsSetIntensity(-1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Intensity < 0)) InventoryItemNipplesPiercingsVibeHeartPiercingsSetIntensity(0 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Intensity > 0)) InventoryItemNipplesPiercingsVibeHeartPiercingsSetIntensity(0 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Intensity < 1)) InventoryItemNipplesPiercingsVibeHeartPiercingsSetIntensity(1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Intensity > 1)) InventoryItemNipplesPiercingsVibeHeartPiercingsSetIntensity(1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Intensity > 2)) InventoryItemNipplesPiercingsVibeHeartPiercingsSetIntensity(2 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Intensity < 2)) InventoryItemNipplesPiercingsVibeHeartPiercingsSetIntensity(2 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.Intensity < 3)) InventoryItemNipplesPiercingsVibeHeartPiercingsSetIntensity(3 - DialogFocusItem.Property.Intensity);
}

// Sets the vibrating hearts intensity
function InventoryItemNipplesPiercingsVibeHeartPiercingsSetIntensity(Modifier) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;
	if (DialogFocusItem.Property.Intensity == -1) DialogFocusItem.Property.Effect = ["Egged"];
	if (DialogFocusItem.Property.Intensity == 0) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 1) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 2) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 3) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];	
	CharacterLoadEffect(C);
	if (C.ID == 0) ServerPlayerAppearanceSync();
	
	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}
	
	ChatRoomPublishCustomAction("NippleHeart" + ((Modifier > 0) ? "Increase" : "Decrease") + "To" + DialogFocusItem.Property.Intensity, true, [{Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber}]);
}