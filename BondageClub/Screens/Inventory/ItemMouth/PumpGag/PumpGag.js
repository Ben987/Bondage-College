"use strict";

// Loads the item extension properties
function InventoryItemMouthPumpGagLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { PumpLevel: 0 };
	if (DialogFocusItem.Property.PumpLevel == null) DialogFocusItem.Property.PumpLevel = 0;
}

// Draw the item extension screen
function InventoryItemMouthPumpGagDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, "PumpLevel" + DialogFocusItem.Property.PumpLevel.toString()), 1500, 600, "White", "Gray");
	if (DialogFocusItem.Property.PumpLevel > 0) DrawButton(1200, 650, 200, 55, DialogFind(Player, "Empty"), "White");
    if (DialogFocusItem.Property.PumpLevel < 1) DrawButton(1550, 650, 200, 55, DialogFind(Player, "Light"), "White");
    if (DialogFocusItem.Property.PumpLevel > 1) DrawButton(1550, 650, 200, 55, DialogFind(Player, "Light"), "White");
    if (DialogFocusItem.Property.PumpLevel < 2) DrawButton(1200, 710, 200, 55, DialogFind(Player, "Inflated"), "White");
    if (DialogFocusItem.Property.PumpLevel > 2) DrawButton(1200, 710, 200, 55, DialogFind(Player, "Inflated"), "White");
    if (DialogFocusItem.Property.PumpLevel < 3) DrawButton(1550, 710, 200, 55, DialogFind(Player, "Bloated"), "White");
    if (DialogFocusItem.Property.PumpLevel > 3) DrawButton(1550, 710, 200, 55, DialogFind(Player, "Bloated"), "White");
    if (DialogFocusItem.Property.PumpLevel < 4) DrawButton(1375, 770, 200, 55, DialogFind(Player, "Maximum"), "White");
}

// Catches the item extension clicks
function InventoryItemMouthPumpGagClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.PumpLevel > 0)) InventoryItemMouthPumpGagSetPump(0 - DialogFocusItem.Property.PumpLevel);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.PumpLevel < 1)) InventoryItemMouthPumpGagSetPump(1 - DialogFocusItem.Property.PumpLevel);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.PumpLevel > 1)) InventoryItemMouthPumpGagSetPump(1 - DialogFocusItem.Property.PumpLevel);
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.PumpLevel < 2)) InventoryItemMouthPumpGagSetPump(2 - DialogFocusItem.Property.PumpLevel);
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.PumpLevel > 2)) InventoryItemMouthPumpGagSetPump(2 - DialogFocusItem.Property.PumpLevel);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.PumpLevel > 3)) InventoryItemMouthPumpGagSetPump(3 - DialogFocusItem.Property.PumpLevel);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.PumpLevel < 3)) InventoryItemMouthPumpGagSetPump(3 - DialogFocusItem.Property.PumpLevel);
	if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.PumpLevel < 4)) InventoryItemMouthPumpGagSetPump(4 - DialogFocusItem.Property.PumpLevel);
}

// Sets the pump gag level
function InventoryItemMouthPumpGagSetPump(Modifier) {

	// Loads the item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemMouthPumpGagLoad();
	}

	// Sets the pump & gag level
	DialogFocusItem.Property.PumpLevel = DialogFocusItem.Property.PumpLevel + Modifier;
	if (DialogFocusItem.Property.PumpLevel == 0) DialogFocusItem.Property.Effect = ["BlockMouth"];
	if (DialogFocusItem.Property.PumpLevel == 1) DialogFocusItem.Property.Effect = ["BlockMouth", "GagLight"];
	if (DialogFocusItem.Property.PumpLevel == 2) DialogFocusItem.Property.Effect = ["BlockMouth", "GagEasy"];
	if (DialogFocusItem.Property.PumpLevel == 3) DialogFocusItem.Property.Effect = ["BlockMouth", "GagMedium"];
	if (DialogFocusItem.Property.PumpLevel == 4) DialogFocusItem.Property.Effect = ["BlockMouth", "GagVeryHeavy"];

	// The more it's pumped, the harder it becomes to struggle out of it
	if (DialogFocusItem.Property.PumpLevel == 0) delete DialogFocusItem.Property.Difficulty;
	if (DialogFocusItem.Property.PumpLevel >= 1) DialogFocusItem.Property.Difficulty = DialogFocusItem.Property.PumpLevel * 2;

	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}

	// Reloads the character
	CharacterLoadEffect(C);
	if (C.ID == 0) ServerPlayerAppearanceSync();
	var Dictionary = [];
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	ChatRoomPublishCustomAction("PumpGag" + ((Modifier > 0) ? "pumps" : "deflates") + "To" + DialogFocusItem.Property.PumpLevel, true, Dictionary);
}
