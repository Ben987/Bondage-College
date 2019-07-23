"use strict";

// Loads the item extension properties
function InventoryItemButtButtPumpLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { InflateLevel: 0 };
	if (DialogFocusItem.Property.InflateLevel == null) DialogFocusItem.Property.InflateLevel = 0;
}

// Draw the item extension screen
function InventoryItemButtButtPumpDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, "InflateLevel" + DialogFocusItem.Property.InflateLevel.toString()), 1500, 600, "White", "Gray");
	if (DialogFocusItem.Property.InflateLevel > 0) DrawButton(1200, 700, 250, 65, DialogFind(Player, "DeflateIt"), "White");
	if (DialogFocusItem.Property.InflateLevel < 4) DrawButton(1550, 700, 250, 65, DialogFind(Player, "PumpIt"), "White");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
}

// Catches the item extension clicks
function InventoryItemButtButtPumpClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 700) && (MouseY <= 765) && (DialogFocusItem.Property.InflateLevel > 0)) InventoryItemButtButtPump(-1);
	if ((MouseX >= 1550) && (MouseX <= 1800) && (MouseY >= 700) && (MouseY <= 765) && (DialogFocusItem.Property.InflateLevel < 4)) InventoryItemButtButtPump(1);
}

// Sets the Butt Pump Level
function InventoryItemItemButtButtPumpIntensity(Modifier) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DialogFocusItem.Property.InflateLevel = DialogFocusItem.Property.InflateLevel + Modifier;
	if (DialogFocusItem.Property.InflateLevel == 0) delete DialogFocusItem.Property.Effect;
	if (DialogFocusItem.Property.InflateLevel == 1) DialogFocusItem.Property.Effect = ["Egged"];
	if (DialogFocusItem.Property.InflateLevel == 2) DialogFocusItem.Property.Effect = ["Egged"];
	if (DialogFocusItem.Property.InflateLevel == 3) DialogFocusItem.Property.Effect = ["Egged"];
	if (DialogFocusItem.Property.InflateLevel == 4) DialogFocusItem.Property.Effect = ["Egged"];	
	CharacterLoadEffect(C);
	if (C.ID == 0) ServerPlayerAppearanceSync();
    ChatRoomPublishCustomAction(Player.Name + " " + DialogFind(Player, ((Modifier > 0) ? "pumps" : "deflates")) + " " + C.Name + DialogFind(Player, "'s") + " " + DialogFind(Player, "gag") + ".", true);
}