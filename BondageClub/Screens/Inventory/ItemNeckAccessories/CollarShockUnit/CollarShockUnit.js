"use strict";


// Loads the item extension properties
function InventoryItemNeckAccessoriesCollarShockUnitLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Intensity: 0, Sensitivity: 0, ShowText: true };
	if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = 0;
	if (DialogFocusItem.Property.Sensitivity == null) DialogFocusItem.Property.Sensitivity = 0;
	if (DialogFocusItem.Property.ShowText == null) DialogFocusItem.Property.ShowText = true;
}

// Draw the item extension screen
function InventoryItemNeckAccessoriesCollarShockUnitDraw() {
	DrawRect(1387, 205, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 207, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 455, 221, "black");
	DrawText(DialogFind(Player, "Intensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 520, "White", "Gray");
	if (DialogFocusItem.Property.Intensity > 0) DrawButton(1100, 550, 200, 55, DialogFind(Player, "Low"), "White");
	if (DialogFocusItem.Property.Intensity < 1 || DialogFocusItem.Property.Intensity > 1) DrawButton(1375, 550, 200, 55, DialogFind(Player, "Medium"), "White");
	if (DialogFocusItem.Property.Intensity < 2) DrawButton(1650, 550, 200, 55, DialogFind(Player, "High"), "White");
	
	DrawText(DialogFind(Player, "Sensitivity" + DialogFocusItem.Property.Sensitivity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 660, "White", "Gray");
	
	if (DialogFocusItem.Property.Sensitivity != 0) DrawButton(1100, 700, 150, 55, DialogFind(Player, "TurnOff"), "White");
	if (DialogFocusItem.Property.Sensitivity != 1) DrawButton(1300, 700, 150, 55, DialogFind(Player, "Low"), "White");
	if (DialogFocusItem.Property.Sensitivity != 2) DrawButton(1500, 700, 150, 55, DialogFind(Player, "Medium"), "White");
	if (DialogFocusItem.Property.Sensitivity != 3) DrawButton(1700, 700, 150, 55, DialogFind(Player, "Maximum"), "White");
	
	if (CurrentScreen == "ChatRoom") DrawButton(1125, 780, 64, 64, "", "White", DialogFocusItem.Property.ShowText ? "Icons/Checked.png" : "");
	if (CurrentScreen == "ChatRoom") DrawText(DialogFind(Player, "ShockCollarShowChat"), 1370, 813, "White", "Gray");
	DrawButton(1600, 790, 200, 55, DialogFind(Player, "TriggerShock"), "White");
}

// Catches the item extension clicks
function InventoryItemNeckAccessoriesCollarShockUnitClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1325) && (MouseX <= 1389) && (MouseY >= 700) && (MouseY <= 764) && (CurrentScreen == "ChatRoom")) {
		DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
	}
	if ((MouseX >= 1100) && (MouseX <= 1300) && (MouseY >= 550) && (MouseY <= 605) && (DialogFocusItem.Property.Intensity > 0)) InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(0 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 550) && (MouseY <= 605) && (DialogFocusItem.Property.Intensity < 1 || DialogFocusItem.Property.Intensity > 1)) InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1650) && (MouseX <= 1850) && (MouseY >= 550) && (MouseY <= 605) && (DialogFocusItem.Property.Intensity < 2)) InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(2 - DialogFocusItem.Property.Intensity);
	
	
	if ((MouseIn(1100, 700, 150, 55)) && (DialogFocusItem.Property.Sensitivity != 0)) InventoryItemNeckAccessoriesCollarShockUnitSetSensitivity(0 - DialogFocusItem.Property.Sensitivity);
	if ((MouseIn(1300, 700, 150, 55)) && (DialogFocusItem.Property.Sensitivity != 1)) InventoryItemNeckAccessoriesCollarShockUnitSetSensitivity(1 - DialogFocusItem.Property.Sensitivity);
	if ((MouseIn(1500, 700, 150, 55)) && (DialogFocusItem.Property.Sensitivity != 2)) InventoryItemNeckAccessoriesCollarShockUnitSetSensitivity(2 - DialogFocusItem.Property.Sensitivity);
	if ((MouseIn(1700, 700, 150, 55)) && (DialogFocusItem.Property.Sensitivity != 3)) InventoryItemNeckAccessoriesCollarShockUnitSetSensitivity(3 - DialogFocusItem.Property.Sensitivity);
	
	if (Player.CanInteract() && (MouseX >= 1600) && (MouseX <= 1800) && (MouseY >= 790) && (MouseY <= 845)) InventoryItemNeckAccessoriesCollarShockUnitTrigger();
}

// Sets the shock collar intensity
function InventoryItemNeckAccessoriesCollarShockUnitSetIntensity(Modifier) {
	
	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemNeckAccessoriesCollarShockUnitLoad();
	}

	DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;
	if (DialogFocusItem.Property.ShowText) {
		var Dictionary = [];
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "AssetName", AssetName: DialogFocusItem.Asset.Name});
		ChatRoomPublishCustomAction("ShockCollarSet" + DialogFocusItem.Property.Intensity, true, Dictionary);
	}
	else
		DialogLeave();
		
}

// Sets the shock collar sensitivity
function InventoryItemNeckAccessoriesCollarShockUnitSetSensitivity(Modifier) {
	
	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemNeckAccessoriesCollarShockUnitLoad();
	}

	DialogFocusItem.Property.Sensitivity = DialogFocusItem.Property.Sensitivity + Modifier;
	if (DialogFocusItem.Property.ShowText) {
		var Dictionary = [];
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "AssetName", AssetName: DialogFocusItem.Asset.Name});
		ChatRoomPublishCustomAction("ShockCollarSetSensitivity" + DialogFocusItem.Property.Sensitivity, true, Dictionary);
	}
	else
		DialogLeave();
		
}


function InventoryItemNeckAccessoriesCollarShockUnitUpdate(Property) {
	var Item = data.Item
	// Punish the player if they speak
	if (Item.Property.Sensitivity && Item.Property.Sensitivity > 0) {
		
		var LastMessages = data.PersistentData().LastMessageLen
		var ShockTriggerPunish = false
		
		if (Item.Property.Sensitivity == 3 && ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
			&& !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("(") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("*"))
			ShockTriggerPunish = true
		if (Item.Property.Sensitivity == 2 && ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
			&& !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("(") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("*")
			&& (ChatRoomLastMessage[ChatRoomLastMessage.length-1].length > 25 || ChatRoomLastMessage[ChatRoomLastMessage.length-1] == ChatRoomLastMessage[ChatRoomLastMessage.length-1].toUpperCase()))
			ShockTriggerPunish = true
		if (Item.Property.Sensitivity == 1 && ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
			&& !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("(") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("*")
			&& ChatRoomLastMessage[ChatRoomLastMessage.length-1] == ChatRoomLastMessage[ChatRoomLastMessage.length-1].toUpperCase())
			ShockTriggerPunish = true
		
		if (ShockTriggerPunish) {
			InventoryItemNeckAccessoriesCollarShockUnitTriggerAutomatic(data)
			ChatRoomCharacterUpdate(Player);
		} 
	}
	
	
}

// Trigger a shock outside of the dialog menu
function InventoryItemNeckAccessoriesCollarShockUnitTriggerAutomatic(data) { 
	var msg = "TriggerShock" + data.Item.Property.Intensity;
	var C = data.C
	
	var Dictionary = [
		{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "AssetName", AssetName: data.Item.Asset.Name },
		{ Automatic: true },
	];
	if (CurrentScreen == "ChatRoom") {
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary });
		ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);
	}
		
    CharacterSetFacialExpression(C, "Eyebrows", "Soft", 10);
    CharacterSetFacialExpression(C, "Blush", "Soft", 15);
    CharacterSetFacialExpression(C, "Eyes", "Closed", 5);
}

// Trigger a shock from the dialog menu
function InventoryItemNeckAccessoriesCollarShockUnitTrigger(data) { 
	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemNeckAccessoriesCollarShockUnitLoad();
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
		
	ChatRoomPublishCustomAction("TriggerShock" + DialogFocusItem.Property.Intensity, true, Dictionary);
		
	if (C.ID == Player.ID) {
		// The Player shocks herself
		ActivityArousalItem(C, C, DialogFocusItem.Asset);
	}
	
    CharacterSetFacialExpression(C, "Eyebrows", "Soft", 10);
    CharacterSetFacialExpression(C, "Blush", "Soft", 15);
    CharacterSetFacialExpression(C, "Eyes", "Closed", 5);
}

function AssetsItemNeckAccessoriesCollarShockUnitBeforeDraw(data) {
	return data.L === "_Light" ? { Color: "#2f0" } : null;
}

function AssetsItemNeckAccessoriesCollarShockUnitScriptDraw(data) {
	var persistentData = data.PersistentData();
	var property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.ChangeTime !== "number") persistentData.ChangeTime = CommonTime() + 4000;
	if (typeof persistentData.LastMessageLen !== "number") persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;

	if (persistentData.ChangeTime < CommonTime()) {
		var wasBlinking = property.Type === "Blink";
		property.Type = wasBlinking ? null : "Blink";
		var timeToNextRefresh = wasBlinking ? 4000 : 1000;
		
		if (CurrentScreen == "ChatRoom" && data.C == Player) {
		
			InventoryItemNeckAccessoriesCollarShockUnitUpdate(data)
			
			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		
		
		persistentData.ChangeTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}

function InventoryItemNeckAccessoriesCollarShockUnitDynamicAudio(data) { 
	var Modifier = parseInt(data.Content.substr(data.Content.length - 1));
	if (isNaN(Modifier)) Modifier = 0;
	return ["Shocks", Modifier * 3];
}
