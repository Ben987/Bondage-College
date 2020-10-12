"use strict";
function InventoryItemBreastFuturisticBraLoad() { FuturisticChastityLoad(); }

function InventoryItemBreastFuturisticBraDraw() {
	
	if (AccessValidation()) {
		
		DrawRect(1387, 125, 225, 275, "white");
		if ((DialogFocusItem.Property.Intensity >= 0))
			DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389 + Math.floor(Math.random() * 3) - 1, 127 + Math.floor(Math.random() * 3) - 1, 221, 221);
		else DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
		DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
		DrawText(DialogFind(Player, "VibeIntensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 450, "White", "Gray");

		DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
		
		DrawButton(1175, 480, 200, 55, DialogFind(Player, "VibeOff"), (DialogFocusItem.Property.Intensity == -1) ? "#888888" : "White");
        DrawButton(1400, 480, 200, 55, DialogFind(Player, "VibeLow"), (DialogFocusItem.Property.Intensity == 0) ? "#888888" : "White");
        DrawButton(1625, 480, 200, 55, DialogFind(Player, "VibeMedium"), (DialogFocusItem.Property.Intensity == 1) ? "#888888" : "White");
        DrawButton(1175, 550, 200, 55, DialogFind(Player, "VibeHigh"), (DialogFocusItem.Property.Intensity == 2) ? "#888888" : "White");
		DrawButton(1400, 550, 200, 55, DialogFind(Player, "VibeMaximum"), (DialogFocusItem.Property.Intensity == 3) ? "#888888" : "White");
		
        DrawButton(1200, 870, 200, 55, "Lock Orgasm", (DialogFocusItem.Property.Effect.includes("OrgasmLock")) ? "#888888" : "White");
        DrawButton(1550, 870, 200, 55, "Unlock Orgasm", (!DialogFocusItem.Property.Effect.includes("OrgasmLock")) ? "#888888" : "White");
		
		DrawText(DialogFind(Player, "ShockIntensity" + DialogFocusItem.Property.ShockLevel.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 670, "White", "Gray");
		DrawButton(1175, 700, 200, 55, DialogFind(Player, "ShockLow"), (DialogFocusItem.Property.ShockLevel == 0) ? "#888888" : "White");
		DrawButton(1400, 700, 200, 55, DialogFind(Player, "ShockMedium"), (DialogFocusItem.Property.ShockLevel == 1) ? "#888888" : "White");
		DrawButton(1625, 700, 200, 55, DialogFind(Player, "ShockHigh"), (DialogFocusItem.Property.ShockLevel == 2) ? "#888888" : "White");
		if (CurrentScreen == "ChatRoom") DrawButton(1175, 770, 64, 64, "", "White", DialogFocusItem.Property.ShowText ? "Icons/Checked.png" : "");
		if (CurrentScreen == "ChatRoom") DrawText(DialogFind(Player, "ShockCollarShowChat"), 1420, 800, "White", "Gray");
		DrawButton(1625, 770, 200, 55, DialogFind(Player, "TriggerShock"), (!Player.CanInteract()) ? "#888888" : "White");

	}
	else {
		DrawButton(1200, 200, 600, 600, DialogFind(Player, "AccessDenied"), "#ff0000");
	}		
}

function InventoryItemBreastFuturisticBraClick() {
	
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
			InventoryItemBreastFuturisticBraLoad();
		}
		
		if (MouseIn(1885, 25, 90, 85)) DialogFocusItem = null;
		if (MouseIn(1175, 480, 200, 55) && (DialogFocusItem.Property.Intensity != -1)) FuturisticChastitySetIntensity(-1 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1400, 480, 200, 55) && (DialogFocusItem.Property.Intensity != 0)) FuturisticChastitySetIntensity(0 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1625, 480, 200, 55) && (DialogFocusItem.Property.Intensity != 1)) FuturisticChastitySetIntensity(1 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1175, 550, 200, 55) && (DialogFocusItem.Property.Intensity != 2)) FuturisticChastitySetIntensity(2 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1400, 550, 200, 55) && (DialogFocusItem.Property.Intensity != 3)) FuturisticChastitySetIntensity(3 - DialogFocusItem.Property.Intensity);

		if (MouseIn(1200, 870, 200, 55) && (!DialogFocusItem.Property.Effect.includes("OrgasmLock"))) FuturisticChastityLockOrgasm(true);
		if (MouseIn(1550, 870, 200, 55) && (DialogFocusItem.Property.Effect.includes("OrgasmLock"))) FuturisticChastityLockOrgasm(false);
	
		if (MouseIn(1175, 770, 64, 64) && (CurrentScreen == "ChatRoom")) {
			DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
		}
		if (MouseIn(1175, 700, 200, 55) && (DialogFocusItem.Property.ShockLevel != 0)) FuturisticChastitySetShockLevel(0 - DialogFocusItem.Property.ShockLevel);
		if (MouseIn(1400, 700, 200, 55) && (DialogFocusItem.Property.ShockLevel != 1)) FuturisticChastitySetShockLevel(1 - DialogFocusItem.Property.ShockLevel);
		if (MouseIn(1625, 700, 200, 55) && (DialogFocusItem.Property.ShockLevel != 2)) FuturisticChastitySetShockLevel(2 - DialogFocusItem.Property.ShockLevel);
		if (Player.CanInteract() && MouseIn(1625, 770, 200, 55)) FuturisticChastityShockTrigger();
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