"use strict";
function InventoryItemBreastScifiBraLoad() { ScifiChastityLoad(); }

function InventoryItemBreastScifiBraDraw() {
	
	if (AccessValidation()) {
		
		DrawRect(1387, 125, 225, 275, "white");
		if ((DialogFocusItem.Property.Intensity >= 0))
			DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389 + Math.floor(Math.random() * 3) - 1, 127 + Math.floor(Math.random() * 3) - 1, 221, 221);
		else DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
		DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
		DrawText(DialogFind(Player, "Intensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 450, "White", "Gray");

		DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
		
		DrawButton(1175, 480, 200, 55, DialogFind(Player, "TurnOff"), (DialogFocusItem.Property.Intensity == -1) ? "#888888" : "White");
        DrawButton(1400, 480, 200, 55, DialogFind(Player, "Low"), (DialogFocusItem.Property.Intensity == 0) ? "#888888" : "White");
        DrawButton(1625, 480, 200, 55, DialogFind(Player, "Medium"), (DialogFocusItem.Property.Intensity == 1) ? "#888888" : "White");
        DrawButton(1175, 550, 200, 55, DialogFind(Player, "High"), (DialogFocusItem.Property.Intensity == 2) ? "#888888" : "White");
		DrawButton(1400, 550, 200, 55, DialogFind(Player, "Maximum"), (DialogFocusItem.Property.Intensity == 3) ? "#888888" : "White");
		
		DrawText(DialogFind(Player, "Intensity" + DialogFocusItem.Property.ShockLevel.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 670, "White", "Gray");
		DrawButton(1175, 700, 200, 55, DialogFind(Player, "Low"), (DialogFocusItem.Property.ShockLevel == 0) ? "#888888" : "White");
		DrawButton(1400, 700, 200, 55, DialogFind(Player, "Medium"), (DialogFocusItem.Property.ShockLevel == 1) ? "#888888" : "White");
		DrawButton(1625, 700, 200, 55, DialogFind(Player, "High"), (DialogFocusItem.Property.ShockLevel == 2) ? "#888888" : "White");
		if (CurrentScreen == "ChatRoom") DrawButton(1175, 770, 64, 64, "", "White", DialogFocusItem.Property.ShowText ? "Icons/Checked.png" : "");
		if (CurrentScreen == "ChatRoom") DrawText(DialogFind(Player, "ShockCollarShowChat"), 1420, 800, "White", "Gray");
		DrawButton(1625, 770, 200, 55, DialogFind(Player, "TriggerShock"), (!Player.CanInteract()) ? "#888888" : "White");

	}
	else {
		DrawButton(1200, 200, 600, 600, DialogFind(Player, "AccessDenied"), "#ff0000");
	}		
}

function InventoryItemBreastScifiBraClick() {
	
	if (MouseIn(1885, 25, 90, 85)) {
		DialogFocusItem = null;
		if (ExtendedItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
		ExtendedItemPermissionMode = false;
		return;
	}
	
	if (AccessValidation()) {

		var C = CharacterGetCurrent() || CharacterAppearanceSelection;
		if (CurrentScreen == "ChatRoom") {
			DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
			InventoryItemBreastScifiBraLoad();
		}
		
		if (MouseIn(1885, 25, 90, 85)) DialogFocusItem = null;
		if (MouseIn(1175, 480, 200, 55) && (DialogFocusItem.Property.Intensity != -1)) ScifiChastitySetIntensity(-1 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1400, 480, 200, 55) && (DialogFocusItem.Property.Intensity != 0)) ScifiChastitySetIntensity(0 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1625, 480, 200, 55) && (DialogFocusItem.Property.Intensity != 1)) ScifiChastitySetIntensity(1 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1175, 550, 200, 55) && (DialogFocusItem.Property.Intensity != 2)) ScifiChastitySetIntensity(2 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1400, 550, 200, 55) && (DialogFocusItem.Property.Intensity != 3)) ScifiChastitySetIntensity(3 - DialogFocusItem.Property.Intensity);
	
		if (MouseIn(1175, 770, 64, 64) && (CurrentScreen == "ChatRoom")) {
			DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
		}
		if (MouseIn(1175, 700, 200, 55) && (DialogFocusItem.Property.ShockLevel != 0)) ScifiChastitySetShockLevel(0 - DialogFocusItem.Property.ShockLevel);
		if (MouseIn(1400, 700, 200, 55) && (DialogFocusItem.Property.ShockLevel != 1)) ScifiChastitySetShockLevel(1 - DialogFocusItem.Property.ShockLevel);
		if (MouseIn(1625, 700, 200, 55) && (DialogFocusItem.Property.ShockLevel != 2)) ScifiChastitySetShockLevel(2 - DialogFocusItem.Property.ShockLevel);
		if (Player.CanInteract() && MouseIn(1625, 770, 200, 55)) ScifiChastityShockTrigger();
	}
	else {
		if (MouseIn(1200, 200, 600, 600)) {
			DialogFocusItem = null;
			if (ExtendedItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
			ExtendedItemPermissionMode = false;
			return;
		}
	}
}