"use strict";

// Loads the item extension properties
function InventoryItemVulvaClitAndDildoVibratorbeltLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Intensity: -1 };
	if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = -1;
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Intensity: -1 };
	if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = -1;
}

// Draw the item extension screen
function InventoryItemVulvaClitAndDildoVibratorbeltDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	if (DialogFocusItem.Property.Intensity >= 0)
		DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389 + Math.floor(Math.random() * 3) - 1, 227 + Math.floor(Math.random() * 3) - 1, 221, 221);
	else DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	if (DialogFocusItem.Property.Intensity >= 0)
		DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389 + Math.floor(Math.random() * 3) - 1, 227 + Math.floor(Math.random() * 3) - 1, 221, 221);
	else DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, "DildoIntensity" + DialogFocusItem.Property.Intensity.toString()), 1500, 750, "White", "Gray");
	if (DialogFocusItem.Property.Intensity > -1) DrawButton(1200, 775, 200, 55, DialogFind(Player, "TurnOff"), "White");
	if (DialogFocusItem.Property.Intensity < 0) DrawButton(1550, 775, 200, 55, DialogFind(Player, "Low"), "White");
	if (DialogFocusItem.Property.Intensity > 0) DrawButton(1550, 775, 200, 55, DialogFind(Player, "Low"), "White");
	if (DialogFocusItem.Property.Intensity < 1) DrawButton(1200, 835, 200, 55, DialogFind(Player, "Medium"), "White");
	if (DialogFocusItem.Property.Intensity > 1) DrawButton(1200, 835, 200, 55, DialogFind(Player, "Medium"), "White");
	if (DialogFocusItem.Property.Intensity < 2) DrawButton(1550, 835, 200, 55, DialogFind(Player, "High"), "White");
	if (DialogFocusItem.Property.Intensity > 2) DrawButton(1550, 835, 200, 55, DialogFind(Player, "High"), "White");
	if (DialogFocusItem.Property.Intensity < 3) DrawButton(1375, 895, 200, 55, DialogFind(Player, "Maximum"), "White");
	DrawText(DialogFind(Player, "EggIntensity" + DialogFocusItem.Property.Intensity.toString()), 1500, 525, "White", "Gray");
	if (DialogFocusItem.Property.Intensity > -1) DrawButton(1200, 550, 200, 55, DialogFind(Player, "TurnOff"), "White");
	if (DialogFocusItem.Property.Intensity < 0) DrawButton(1550, 550, 200, 55, DialogFind(Player, "Low"), "White");
	if (DialogFocusItem.Property.Intensity > 0) DrawButton(1550, 550, 200, 55, DialogFind(Player, "Low"), "White");
	if (DialogFocusItem.Property.Intensity < 1) DrawButton(1200, 610, 200, 55, DialogFind(Player, "Medium"), "White");
	if (DialogFocusItem.Property.Intensity > 1) DrawButton(1200, 610, 200, 55, DialogFind(Player, "Medium"), "White");
	if (DialogFocusItem.Property.Intensity < 2) DrawButton(1550, 610, 200, 55, DialogFind(Player, "High"), "White");
	if (DialogFocusItem.Property.Intensity > 2) DrawButton(1550, 610, 200, 55, DialogFind(Player, "High"), "White");
	if (DialogFocusItem.Property.Intensity < 3) DrawButton(1375, 670, 200, 55, DialogFind(Player, "Maximum"), "White");
}

// Catches the item extension clicks
function InventoryItemVulvaClitAndDildoVibratorbeltClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 225) && (MouseY <= 310)) DialogFocusItem = null;
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 775) && (MouseY <= 830) && (DialogFocusItem.Property.Intensity > -1)) InventoryItemVulvaClitAndDildoVibratorbeltIntensity(-1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 775) && (MouseY <= 830) && (DialogFocusItem.Property.Intensity < 0)) InventoryItemVulvaClitAndDildoVibratorbeltIntensity(0 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 775) && (MouseY <= 830) && (DialogFocusItem.Property.Intensity > 0)) InventoryItemVulvaClitAndDildoVibratorbeltIntensity(0 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 835) && (MouseY <= 890) && (DialogFocusItem.Property.Intensity < 1)) InventoryItemVulvaClitAndDildoVibratorbeltIntensity(1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 835) && (MouseY <= 890) && (DialogFocusItem.Property.Intensity > 1)) InventoryItemVulvaClitAndDildoVibratorbeltIntensity(1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 835) && (MouseY <= 890) && (DialogFocusItem.Property.Intensity > 2)) InventoryItemVulvaClitAndDildoVibratorbeltIntensity(2 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 835) && (MouseY <= 890) && (DialogFocusItem.Property.Intensity < 2)) InventoryItemVulvaClitAndDildoVibratorbeltIntensity(2 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 895) && (MouseY <= 950) && (DialogFocusItem.Property.Intensity < 3)) InventoryItemVulvaClitAndDildoVibratorbeltIntensity(3 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 550) && (MouseY <= 605) && (DialogFocusItem.Property.Intensity > -1)) InventoryItemVulvaClitAndDildoVibratorbeltSetIntensity(-1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 550) && (MouseY <= 605) && (DialogFocusItem.Property.Intensity < 0)) InventoryItemVulvaClitAndDildoVibratorbeltSetIntensity(0 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 550) && (MouseY <= 605) && (DialogFocusItem.Property.Intensity > 0)) InventoryItemVulvaClitAndDildoVibratorbeltSetIntensity(0 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 610) && (MouseY <= 665) && (DialogFocusItem.Property.Intensity < 1)) InventoryItemVulvaClitAndDildoVibratorbeltSetIntensity(1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 610) && (MouseY <= 665) && (DialogFocusItem.Property.Intensity > 1)) InventoryItemVulvaClitAndDildoVibratorbeltSetIntensity(1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 610) && (MouseY <= 665) && (DialogFocusItem.Property.Intensity > 2)) InventoryItemVulvaClitAndDildoVibratorbeltSetIntensity(2 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 610) && (MouseY <= 665) && (DialogFocusItem.Property.Intensity < 2)) InventoryItemVulvaClitAndDildoVibratorbeltSetIntensity(2 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 670) && (MouseY <= 725) && (DialogFocusItem.Property.Intensity < 3)) InventoryItemVulvaClitAndDildoVibratorbeltSetIntensity(3 - DialogFocusItem.Property.Intensity);
}

// Sets the vibration Level on the dildo
function InventoryItemVulvaClitAndDildoVibratorbeltIntensity(Modifier) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;
	if (DialogFocusItem.Property.Intensity == -1) DialogFocusItem.Property.Effect = ["Egged"];
	if (DialogFocusItem.Property.Intensity == 0) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 1) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 2) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 3) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];	
	CharacterLoadEffect(C);
	if (C.ID == 0) ServerPlayerAppearanceSync();
	var Dictionary = [];
	Dictionary.push({Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber});
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
    ChatRoomPublishCustomAction("Dildo" + ((Modifier > 0) ? "Increase" : "Decrease") + "To" + DialogFocusItem.Property.Intensity, true, Dictionary);
	
	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}

}

// Sets the of the vibe egg
function InventoryItemVulvaClitAndDildoVibratorbeltSetIntensity(Modifier) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;
	if (DialogFocusItem.Property.Intensity == -1) DialogFocusItem.Property.Effect = ["Egged"];
	if (DialogFocusItem.Property.Intensity == 0) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 1) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 2) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
	if (DialogFocusItem.Property.Intensity == 3) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];

	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}
	
	CharacterLoadEffect(C);
	if (C.ID == 0) ServerPlayerAppearanceSync();

	ChatRoomPublishCustomAction("Egg" + ((Modifier > 0) ? "Increase" : "Decrease") + "To" + DialogFocusItem.Property.Intensity, true, [{Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber}]);
}