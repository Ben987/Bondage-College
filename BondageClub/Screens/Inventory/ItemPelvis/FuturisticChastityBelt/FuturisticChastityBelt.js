"use strict";
function InventoryItemPelvisFuturisticChastityBeltLoad() {
	InventoryItemPelvisMetalChastityBeltLoad();
	FuturisticChastityLoad();
}

function InventoryItemPelvisFuturisticChastityBeltDraw() {
	
    if (AccessValidation()) {
        
        DrawRect(1387, 125, 225, 275, "white");
        if ((DialogFocusItem.Property.Intensity >= 0))
            DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389 + Math.floor(Math.random() * 3) - 1, 127 + Math.floor(Math.random() * 3) - 1, 221, 221);
        else DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
        DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
        DrawText(DialogFind(Player, "VibeIntensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 450, "White", "Gray");

        DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
        
        DrawButton(1175, 580, 200, 55, DialogFind(Player, "VibeOff"), (DialogFocusItem.Property.Intensity == -1) ? "#888888" : "White");
        DrawButton(1400, 580, 200, 55, DialogFind(Player, "VibeLow"), (DialogFocusItem.Property.Intensity == 0) ? "#888888" : "White");
        DrawButton(1625, 580, 200, 55, DialogFind(Player, "VibeMedium"), (DialogFocusItem.Property.Intensity == 1) ? "#888888" : "White");
        DrawButton(1175, 650, 200, 55, DialogFind(Player, "VibeHigh"), (DialogFocusItem.Property.Intensity == 2) ? "#888888" : "White");
		DrawButton(1400, 650, 200, 55, DialogFind(Player, "VibeMaximum"), (DialogFocusItem.Property.Intensity == 3) ? "#888888" : "White");
		
        DrawButton(1200, 930, 200, 55, "Lock Orgasm", (DialogFocusItem.Property.Effect.includes("OrgasmLock")) ? "#888888" : "White");
        DrawButton(1550, 930, 200, 55, "Unlock Orgasm", (!DialogFocusItem.Property.Effect.includes("OrgasmLock")) ? "#888888" : "White");
        
        DrawText(DialogFind(Player, "ShockIntensity" + DialogFocusItem.Property.ShockLevel.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 750, "White", "Gray");
        DrawButton(1175, 780, 200, 55, DialogFind(Player, "ShockLow"), (DialogFocusItem.Property.ShockLevel == 0) ? "#888888" : "White");
        DrawButton(1400, 780, 200, 55, DialogFind(Player, "ShockMedium"), (DialogFocusItem.Property.ShockLevel == 1) ? "#888888" : "White");
        DrawButton(1625, 780, 200, 55, DialogFind(Player, "ShockHigh"), (DialogFocusItem.Property.ShockLevel == 2) ? "#888888" : "White");
        if (CurrentScreen == "ChatRoom") DrawButton(1175, 850, 64, 64, "", "White", DialogFocusItem.Property.ShowText ? "Icons/Checked.png" : "");
        if (CurrentScreen == "ChatRoom") DrawText(DialogFind(Player, "ShockCollarShowChat"), 1420, 880, "White", "Gray");
        DrawButton(1625, 850, 200, 55, DialogFind(Player, "TriggerShock"), (!Player.CanInteract()) ? "#888888" : "White");

        DrawButton(1550, 480, 250, 65, DialogFind(Player, "ChastityClosedBack"), (DialogFocusItem.Property.Type != null) ? "#888888" : "White");
        
        DrawButton(1200, 480, 250, 65, DialogFind(Player, "ChastityOpenBack"), (DialogFocusItem.Property.Type == null) ? "#888888" : "White");
    }
    else {
        DrawButton(1200, 200, 600, 600, "ACCESS DENIED", "#ff0000");
    }
}

function InventoryItemPelvisFuturisticChastityBeltClick() {
	
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
			InventoryItemPelvisFuturisticChastityBeltLoad();
		}
		
		if (MouseIn(1885, 25, 90, 85)) DialogFocusItem = null;
		if (MouseIn(1175, 580, 200, 55) && (DialogFocusItem.Property.Intensity != -1)) FuturisticChastitySetIntensity(-1 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1400, 580, 200, 55) && (DialogFocusItem.Property.Intensity != 0)) FuturisticChastitySetIntensity(0 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1625, 580, 200, 55) && (DialogFocusItem.Property.Intensity != 1)) FuturisticChastitySetIntensity(1 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1175, 650, 200, 55) && (DialogFocusItem.Property.Intensity != 2)) FuturisticChastitySetIntensity(2 - DialogFocusItem.Property.Intensity);
		if (MouseIn(1400, 650, 200, 55) && (DialogFocusItem.Property.Intensity != 3)) FuturisticChastitySetIntensity(3 - DialogFocusItem.Property.Intensity);

		if (MouseIn(1200, 930, 200, 55) && (!DialogFocusItem.Property.Effect.includes("OrgasmLock"))) FuturisticChastityLockOrgasm(true);
		if (MouseIn(1550, 930, 200, 55) && (DialogFocusItem.Property.Effect.includes("OrgasmLock"))) FuturisticChastityLockOrgasm(false);
	
		if (MouseIn(1175, 850, 64, 64) && (CurrentScreen == "ChatRoom")) {
			DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
		}
		if (MouseIn(1175, 780, 200, 55) && (DialogFocusItem.Property.ShockLevel != 0)) FuturisticChastitySetShockLevel(0 - DialogFocusItem.Property.ShockLevel);
		if (MouseIn(1400, 780, 200, 55) && (DialogFocusItem.Property.ShockLevel != 1)) FuturisticChastitySetShockLevel(1 - DialogFocusItem.Property.ShockLevel);
		if (MouseIn(1625, 780, 200, 55) && (DialogFocusItem.Property.ShockLevel != 2)) FuturisticChastitySetShockLevel(2 - DialogFocusItem.Property.ShockLevel);
		if (Player.CanInteract() && MouseIn(1625, 850, 200, 55)) FuturisticChastityShockTrigger();

		if (MouseIn(1550, 480, 250, 65) && (DialogFocusItem.Property.Type == null)) {
			var msg = "ChastityBeltBackShield" + "ClosedBack";
			var Dictionary = [
				{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
				{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
			];
			ChatRoomPublishCustomAction(msg, true, Dictionary);
			DialogFocusItem.Property.Type = "ClosedBack";
			DialogFocusItem.Property.Block = ["ItemButt"];
			ChatRoomCharacterUpdate(C)
		}
		if (MouseIn(1200, 480, 250, 65) && (DialogFocusItem.Property.Type != null)) {
			var msg = "ChastityBeltBackShield" + "OpenBack";
			var Dictionary = [
				{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
				{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
			];
			ChatRoomPublishCustomAction(msg, true, Dictionary);
			DialogFocusItem.Property.Type = null;
			DialogFocusItem.Property.Block = null;
			ChatRoomCharacterUpdate(C)
		}
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

function InventoryItemPelvisFuturisticChastityBeltPublishAction(C, Option) { InventoryItemPelvisMetalChastityBeltPublishAction(C, Option); }
function InventoryItemPelvisFuturisticChastityBeltValidate(C) {  return InventoryItemPelvisMetalChastityBeltValidate(C); }
function InventoryItemPelvisFuturisticChastityBeltNpcDialog(C, Option) { InventoryItemPelvisMetalChastityBeltNpcDialog(C, Option); }

function FuturisticChastityLoad() {
    if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Intensity: -1, ShockLevel: 0, ShowText: true, Effect: ["OrgasmLock", "Egged"] };
    if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = -1;
    if (DialogFocusItem.Property.ShockLevel == null) DialogFocusItem.Property.ShockLevel = 0;
    if (DialogFocusItem.Property.ShowText == null) DialogFocusItem.Property.ShowText = true;
    if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = ["OrgasmLock", "Egged"];
}

function FuturisticChastityLockOrgasm(OrgasmLock) {
	var C = CharacterGetCurrent() || CharacterAppearanceSelection;
	
    if (OrgasmLock == true && !DialogFocusItem.Property.Effect.includes("OrgasmLock")) DialogFocusItem.Property.Effect.push("OrgasmLock");
    else if (OrgasmLock == false && DialogFocusItem.Property.Effect.includes("OrgasmLock")) {
        for (let E = 0; E < DialogFocusItem.Property.Effect.length; E++) {
            var Effect = DialogFocusItem.Property.Effect[E];
            if (Effect == "OrgasmLock") {
                DialogFocusItem.Property.Effect.splice(E, 1);
                E--;
            }
        }
	}
	 
	CharacterLoadEffect(C);
    if (C.ID == 0) ServerPlayerAppearanceSync();

    ChatRoomPublishCustomAction(DialogFocusItem.Asset.Name + ((OrgasmLock == true) ? "OrgasmLockOn" : "OrgasmLockOff"), true, [{Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber}]);
}

function FuturisticChastitySetIntensity(Modifier) {
	var C = CharacterGetCurrent() || CharacterAppearanceSelection;

	DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;

	if (DialogFocusItem.Property.Intensity == -1) {
        for (let E = 0; E < DialogFocusItem.Property.Effect.length; E++) {
            var Effect = DialogFocusItem.Property.Effect[E];
            if (Effect == "Vibrating") {
                DialogFocusItem.Property.Effect.splice(E, 1);
                E--;
            }
        }
	}
	if (DialogFocusItem.Property.Intensity > -1 && !DialogFocusItem.Property.Effect.includes("Vibrating")) DialogFocusItem.Property.Effect.push("Vibrating");

	CharacterLoadEffect(C);
	if (C.ID == 0) ServerPlayerAppearanceSync();
	
	ChatRoomPublishCustomAction(DialogFocusItem.Asset.Name + ((Modifier > 0) ? "Increase" : "Decrease") + "To" + DialogFocusItem.Property.Intensity, true, [{Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber}]);
}

function FuturisticChastitySetShockLevel(Modifier) {
	
	// Gets the current item and character
	var C = CharacterGetCurrent() || CharacterAppearanceSelection;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		FuturisticChastityLoad();
	}

	DialogFocusItem.Property.ShockLevel = DialogFocusItem.Property.ShockLevel + Modifier;
	if (DialogFocusItem.Property.ShowText && CurrentScreen == "ChatRoom") {
		var Dictionary = [];
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "AssetName", AssetName: DialogFocusItem.Asset.Name});
		ChatRoomPublishCustomAction(DialogFocusItem.Asset.Name + "ShockSet" + DialogFocusItem.Property.ShockLevel, true, Dictionary);
	}
	else if (CurrentScreen == "ChatRoom")
        DialogFocusItem = null;
		
}

function FuturisticChastityShockTrigger() {
	// Gets the current item and character
	var C = CharacterGetCurrent() || CharacterAppearanceSelection;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		FuturisticChastityLoad();
	}	
	
	if (C.ID == Player.ID) {
		// The Player shocks herself
		ActivityArousalItem(C, C, DialogFocusItem.Asset);
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
		
    ChatRoomPublishCustomAction(DialogFocusItem.Asset.Name + "ShockTrigger" + DialogFocusItem.Property.ShockLevel, true, Dictionary);
    
    CharacterSetFacialExpression(C, "Eyebrows", "Soft", 10);
    CharacterSetFacialExpression(C, "Blush", "ShockLow", 15);
    CharacterSetFacialExpression(C, "Eyes", "Closed", 5);
}

function AccessValidation() {
	var AlShockLowed = true;

	var C = CharacterGetCurrent() || CharacterAppearanceSelection;

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLockedFuturisticVisor");
		AlShockLowed = false;
	} 

	return AlShockLowed;
}