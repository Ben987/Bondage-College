"use strict";

// Loads the item extension properties
function InventoryItemNipplesVibeNippleClampLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Intensity: -1 };
}

// Draw the item extension screen
function InventoryItemNipplesVibeNippleClampDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	if (DialogFocusItem.Property.Intensity > 0)
		DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389 + Math.floor(Math.random() * 3) - 1, 227 + Math.floor(Math.random() * 3) - 1, 221, 221);
	else DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, "Intensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 600, "White", "Gray");
	if(DialogFocusItem.Property.Intensity > -1) DrawButton(1200, 700, 250, 65, DialogFind(Player, "Decrease"), "White");
	if(DialogFocusItem.Property.Intensity < 3) DrawButton(1550, 700, 250, 65, DialogFind(Player, "Increase"), "White");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
}

// Catches the item extension clicks
function InventoryItemNipplesVibeNippleClampClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 700) && (MouseY <= 765) && (DialogFocusItem.Property.Intensity > -1)) InventoryItemNipplesVibeNippleClampSetIntensity(-1);
	if ((MouseX >= 1550) && (MouseX <= 1800) && (MouseY >= 700) && (MouseY <= 765) && (DialogFocusItem.Property.Intensity < 3)) InventoryItemNipplesVibeNippleClampSetIntensity(1);
}

// Sets the vibrating clamps intensity
function InventoryItemNipplesVibeNippleClampSetIntensity(Modifier) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;
	if (DialogFocusItem.Property.Intensity == -1) DialogFocusItem.Property.Effect = ["Egged"];
	if (DialogFocusItem.Property.Intensity == 0) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 1) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 2) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 3) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];	
	CharacterLoadEffect(C);
	if (C.ID == 0) ServerPlayerAppearanceSync();

	ChatRoomPublishCustomAction((DialogFind(Player, "Nipple" + ((Modifier > 0) ? "Increase" : "Decrease") + "To" + DialogFocusItem.Property.Intensity)).replace("DestinationCharacter",C.Name), true);
}
