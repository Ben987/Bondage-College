"use strict";

var InventoryItemMouthFuturisticPanelGagOptions = [
	{
		Name: "Padded",
		Property: {
			Type: null,
			Effect: ["BlockMouth"],
		},
	},
	{
		Name: "LightBall",
		Property: {
			Type: "LightBall",
			Effect: ["BlockMouth", "GagVeryLight"],
		},
	},
	{
		Name: "Ball",
		Property: {
			Type: "Ball",
			Effect: ["BlockMouth", "GagMedium"],
		},
	},
	{
		Name: "Plug",
		Property: {
			Type: "Plug",
			Effect: ["BlockMouth", "GagTotal"],
		},
	},
];

// How to make your item futuristic!

// In the load function, add this before your load function, without changing functions from the futuristic panel gag functions. Just make sure your item loads after the panel gag and not before in index.html:
/*
 	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else
*/



// In the draw function, add:
/*
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else
*/


// In the click function, add:
/*
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else
*/


// In the exit function, add:
/*
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
*/


// In the validate function, add:
/*
 	return InventoryItemMouthFuturisticPanelGagValidate(C, Option)
*/


var AutoPunishUndoCD = 300000 // Five minutes of being gagged, resetting each time the user does a violation
var FuturisticAccessDeniedMessage = ""

// Loads the item extension properties
function InventoryItemMouthFuturisticPanelGagLoad() {
 	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else {
		ExtendedItemLoad(InventoryItemMouthFuturisticPanelGagOptions, "SelectGagType");
		if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Option: InventoryItemMouthFuturisticPanelGagOptions[0],
			AutoPunish: 0, AutoPunishUndoTime: 0 , OriginalSetting: "Padded", ChatMessage: true};
		if (DialogFocusItem.Property.AutoPunish == null) DialogFocusItem.Property.AutoPunish = 0;
		if (DialogFocusItem.Property.AutoPunishUndoTime == null) DialogFocusItem.Property.AutoPunishUndoTime = 0;
		if (DialogFocusItem.Property.OriginalSetting == null) DialogFocusItem.Property.OriginalSetting = null;
		if (DialogFocusItem.Property.ChatMessage == null) DialogFocusItem.Property.ChatMessage = true;
		if (DialogFocusItem.Property.BlinkState == null) DialogFocusItem.Property.BlinkState = true;
		

	}
}


// Load the futuristic item ACCESS DENIED screen
function InventoryItemMouthFuturisticPanelGagLoadAccessDenied() {
	ElementCreateInput("PasswordField", "text", "", "12");
	if (!FuturisticAccessDeniedMessage)
		FuturisticAccessDeniedMessage = ""
}

// Draw the futuristic item ACCESS DENIED screen
function InventoryItemMouthFuturisticPanelGagDrawAccessDenied() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	
	
	DrawText(DialogFind(Player, "FuturisticItemLoginScreen"), 1500, 600, "White", "Gray");
	
	
	ElementPosition("PasswordField", 1505, 750, 350);
	DrawText(DialogFind(Player, "FuturisticItemPassword"), 1500, 700, "White", "Gray");
	DrawButton(1400, 800, 200, 64, DialogFind(Player, "FuturisticItemLogIn"), "White", "");
	
	if (FuturisticAccessDeniedMessage && FuturisticAccessDeniedMessage != "") DrawText(FuturisticAccessDeniedMessage, 1500, 963, "Red", "Black");
	
	
	
	
}

// Click the futuristic item ACCESS DENIED screen
function InventoryItemMouthFuturisticPanelGagClickAccessDenied() {
	if (MouseIn(1885, 25, 90, 90)) InventoryItemMouthFuturisticPanelGagExit()
		
	if (MouseIn(1400, 800, 200, 64)) {
		FuturisticAccessDeniedMessage = DialogFind(Player, "CantChangeWhileLockedFuturistic");
		var vol = 1
		if (Player.AudioSettings && Player.AudioSettings.Volume) {
			vol = Player.AudioSettings.Volume
		}
		AudioPlayInstantSound("Audio/AccessDenied.mp3", vol)
		if (CurrentScreen == "ChatRoom") {
			InventoryItemMouthFuturisticPanelGagPublishAccessDenied((Player.FocusGroup != null) ? Player : CurrentCharacter)
		}
	}
}



function InventoryItemMouthFuturisticPanelGagExitAccessDenied() {
	ElementRemove("PasswordField");
	FuturisticAccessDeniedMessage = ""
	DialogFocusItem = null;
}

	
function InventoryItemMouthFuturisticPanelGagExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}

// Draw the item extension screen
function InventoryItemMouthFuturisticPanelGagDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else {
		DrawRect(1387, 75, 225, 275, "white");
		DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 77, 221, 221);
		DrawTextFit(DialogFocusItem.Asset.Description, 1500, 325, 221, "black");
		
		if (DialogFocusItem.Property.AutoPunishUndoTime - CurrentTime > 0)
			DrawText(DialogFind(Player, "FuturisticPanelGagMouthDeflationTime") + " " + TimerToString(DialogFocusItem.Property.AutoPunishUndoTime - CurrentTime), 1500, 415, "White", "Gray");		
		
		var type = "FuturisticPanelGagMouthType" + ((DialogFocusItem.Property.Type != null) ? DialogFocusItem.Property.Type : "Padded")
		DrawText(DialogFind(Player, "FuturisticPanelGagMouthTypeDesc") + " " +
			DialogFind(Player, type), 1500, 475, "White", "Gray");	
				
		MainCanvas.textAlign = "left";
		DrawCheckbox(1100, 650, 64, 64, "", DialogFocusItem.Property.ChatMessage, "White");
		DrawText(DialogFind(Player, "FuturisticPanelGagMouthButtonChatMessage"), 1200, 683, "White", "Gray");	
		MainCanvas.textAlign = "center";
		
		var autopunish = "Off" 
		if (DialogFocusItem.Property.AutoPunish == 0) {}
		else if (DialogFocusItem.Property.AutoPunish == 1) {autopunish = "Low"}
		else if (DialogFocusItem.Property.AutoPunish == 2) {autopunish = "High"}
		else {autopunish = "Maximum"}
		
		DrawText(DialogFind(Player, "FuturisticPanelGagMouthButtonAutoPunish") + " " + autopunish, 1500, 770, "White", "Gray");
		if (DialogFocusItem) {
			if (DialogFocusItem.Property.Type != null) DrawButton(1250, 500, 200, 64, DialogFind(Player, "FuturisticPanelGagMouthTypePadded"), "White", "");
			if (DialogFocusItem.Property.Type != "LightBall") DrawButton(1550, 500, 200, 64, DialogFind(Player, "FuturisticPanelGagMouthTypeLightBall"), "White", "");
			if (DialogFocusItem.Property.Type != "Ball") DrawButton(1250, 570, 200, 64, DialogFind(Player, "FuturisticPanelGagMouthTypeBall"), "White", "");
			if (DialogFocusItem.Property.Type != "Plug") DrawButton(1550, 570, 200, 64, DialogFind(Player, "FuturisticPanelGagMouthTypePlug"), "White", "");
			
			if (DialogFocusItem.Property.AutoPunish != 0) DrawButton(1250, 800, 200, 64, DialogFind(Player, "TurnOff"), "White", "");
			if (DialogFocusItem.Property.AutoPunish != 1) DrawButton(1550, 800, 200, 64, DialogFind(Player, "Low"), "White", "");
			if (DialogFocusItem.Property.AutoPunish != 2) DrawButton(1250, 870, 200, 64, DialogFind(Player, "Medium"), "White", "");
			if (DialogFocusItem.Property.AutoPunish != 3) DrawButton(1550, 870, 200, 64, DialogFind(Player, "Maximum"), "White", "");
		}
		
	}
}



// Catches the item extension clicks
function InventoryItemMouthFuturisticPanelGagClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else {		
		if (MouseIn(1885, 25, 90, 90)) InventoryItemPelvisFuturisticChastityBeltExit()
			
		else if (MouseIn(1100, 650, 64, 64)) DialogFocusItem.Property.ChatMessage = !DialogFocusItem.Property.ChatMessage
		
		
		else if (DialogFocusItem.Property.Type != null && MouseIn(1250, 500, 200, 64)) {
			DialogFocusItem.Property.AutoPunishUndoTime = 0; 
			DialogFocusItem.Property.OriginalSetting = null; 
			ExtendedItemSetType(C, InventoryItemMouthFuturisticPanelGagOptions, InventoryItemMouthFuturisticPanelGagOptions[0], false)}
		else if (DialogFocusItem.Property.Type != "LightBall" && MouseIn(1550, 500, 200, 64)) {
			DialogFocusItem.Property.AutoPunishUndoTime = 0;
			DialogFocusItem.Property.OriginalSetting = "LightBall";
			ExtendedItemSetType(C, InventoryItemMouthFuturisticPanelGagOptions, InventoryItemMouthFuturisticPanelGagOptions[1], false)}
		else if (DialogFocusItem.Property.Type != "Ball" && MouseIn(1250, 570, 200, 64)) {
			DialogFocusItem.Property.AutoPunishUndoTime = 0;
			DialogFocusItem.Property.OriginalSetting = "Ball";
			ExtendedItemSetType(C, InventoryItemMouthFuturisticPanelGagOptions, InventoryItemMouthFuturisticPanelGagOptions[2], false)}
		else if (DialogFocusItem.Property.Type != "Plug" && MouseIn(1550, 570, 200, 64)) {
			DialogFocusItem.Property.AutoPunishUndoTime = 0;
			DialogFocusItem.Property.OriginalSetting = "Plug";
		ExtendedItemSetType(C, InventoryItemMouthFuturisticPanelGagOptions, InventoryItemMouthFuturisticPanelGagOptions[3], false)}
		
		else if (DialogFocusItem.Property.AutoPunish != 0 && MouseIn(1250, 800, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunish(C, DialogFocusItem, 0)
		else if (DialogFocusItem.Property.AutoPunish != 1 && MouseIn(1550, 800, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunish(C, DialogFocusItem, 1)
		else if (DialogFocusItem.Property.AutoPunish != 2 && MouseIn(1250, 870, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunish(C, DialogFocusItem, 2)
		else if (DialogFocusItem.Property.AutoPunish != 3 && MouseIn(1550, 870, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunish(C, DialogFocusItem, 3)
		
	}
}



function InventoryItemMouthFuturisticPanelGagValidate(C, Option) {
	var Allowed = true;

	if (DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLockedFuturistic");
		Allowed = false;
	}

	return Allowed;
}




function InventoryItemMouthFuturisticPanelGagGetOption(Options, OptionType) {
	for (let I = 0; I < Options.length; I++) {
		if (Options[I].Property.Type == OptionType) return I
	}
	return 0
}



function InventoryItemMouthFuturisticPanelGagPublishActionTrigger(C, Item, Option, Deflate) {
	var msg = "FuturisticPanelGagMouthSetAuto" + ((Deflate) ? "Deflate" : "Inflate") + Option.Name;
	
	var Dictionary = [
		{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "AssetName", AssetName: Item.Asset.Name },
		{ Automatic: true },
	];
	if (Item.Property.ItemMemberNumber) Dictionary.push({ Tag: "ItemMemberNumber", MemberNumber: Item.Property.ItemMemberNumber });
	if (CurrentScreen == "ChatRoom") {
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary });
		ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);
	}
}


function InventoryItemMouthFuturisticPanelGagSetAutoPunish(C, Item, Level) {
	Item.Property.AutoPunish = Level
	var msg = "FuturisticPanelGagMouthSetAutoPunish" + Level;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthFuturisticPanelGagPublishAction(C, Option) {
	
	
	var msg = "FuturisticPanelGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthFuturisticPanelGagPublishAccessDenied(C) {
	var msg = "FuturisticItemLoginLoginAttempt"
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name}
	];
	
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthFuturisticPanelGagNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthPlugGag" + Option.Name, "ItemMouth");
}

function InventoryItemMouthFuturisticPanelGagTrigger(C, Item, Reset) {
	var OptionLevel = (Reset) ? InventoryItemMouthFuturisticPanelGagGetOption(InventoryItemMouthFuturisticPanelGagOptions, Item.Property.OriginalSetting)
		: Math.min(InventoryItemMouthFuturisticPanelGagOptions.length, InventoryItemMouthFuturisticPanelGagGetOption(InventoryItemMouthFuturisticPanelGagOptions, Item.Property.Type) + 1);
	
	if (Reset || Item.Property.Type != "Plug") {
		var OriginalItemSetting = Item.Property.OriginalSetting
		InventoryItemMouthFuturisticPanelGagSetOption(C, InventoryItemMouthFuturisticPanelGagOptions, InventoryItemMouthFuturisticPanelGagOptions[OptionLevel], Item)
		if (CurrentScreen == "ChatRoom" && Item.Property.ChatMessage)
			InventoryItemMouthFuturisticPanelGagPublishActionTrigger(C, Item, InventoryItemMouthFuturisticPanelGagOptions[OptionLevel], Reset)
		Item.Property.OriginalSetting = OriginalItemSetting // After automatically changing it, we put it back to original setting
		
		/*var vol = 1
		if (Player.AudioSettings && Player.AudioSettings.Volume) {
			vol = Player.AudioSettings.Volume
		}
		if (Reset)
			AudioPlayInstantSound("Audio/Deflation.mp3", vol)
		else
			AudioPlayInstantSound("Audio/Inflation.mp3", vol)
		*/
	}
}
	

// Copied from extended item
function InventoryItemMouthFuturisticPanelGagSetOption(C, Options, Option, Item, NoRefresh) {

	// Default the previous Property and Type to the first option if not found on the current item
	var PreviousProperty = Item.Property || Options[0].Property;
	var PreviousType = PreviousProperty.Type || Options[0].Property.Type;
	var PreviousOption = Options.find(O => O.Property.Type === PreviousType);

	// Create a new Property object based on the previous one
	var NewProperty = Object.assign({}, PreviousProperty);
	// Delete properties overridden by by the new option
	Object.keys(PreviousOption.Property).forEach(key => delete NewProperty[key]);
	// Clone the new properties and use them to extend the existing properties
	Object.assign(NewProperty, JSON.parse(JSON.stringify(Option.Property)));

	// If the item is locked, ensure it has the "Lock" effect
	if (NewProperty.LockedBy && !(NewProperty.Effect || []).includes("Lock")) {
		NewProperty.Effect = (NewProperty.Effect || []);
		NewProperty.Effect.push("Lock");
	}

	Item.Property = NewProperty;
	
	if (!NoRefresh) {
		CharacterRefresh(C, true); 		
		// For a restraint, we might publish an action or change the dialog of a NPC
		ChatRoomCharacterUpdate(C);	
	}
}



function AssetsItemMouthFuturisticPanelGagScriptUpdatePlayer(data) {
	var Item = data.Item
	// Punish the player if they speak
	if (Item.Property.AutoPunish && Item.Property.AutoPunish > 0) {
		
		var LastMessages = data.PersistentData().LastMessageLen
		var GagTriggerPunish = false
		
		if (Item.Property.AutoPunish == 3 && ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
			&& !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("(") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("*") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("/"))
			GagTriggerPunish = true
		if (Item.Property.AutoPunish == 2 && ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
			&& !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("(") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("*") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("/")
			&& (ChatRoomLastMessage[ChatRoomLastMessage.length-1].length > 25 || ChatRoomLastMessage[ChatRoomLastMessage.length-1] == ChatRoomLastMessage[ChatRoomLastMessage.length-1].toUpperCase()))
			GagTriggerPunish = true
		if (Item.Property.AutoPunish == 1 && ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
			&& !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("(") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("*") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("/")
			&& ChatRoomLastMessage[ChatRoomLastMessage.length-1] == ChatRoomLastMessage[ChatRoomLastMessage.length-1].toUpperCase())
			GagTriggerPunish = true
		
		if (GagTriggerPunish) {
			InventoryItemMouthFuturisticPanelGagTrigger(Player, Item, false)
			Item.Property.AutoPunishUndoTime = CurrentTime + AutoPunishUndoCD // Reset the deflation time
			CharacterRefresh(Player, true); // Does not sync appearance while in the wardrobe
			
			// For a restraint, we might publish an action or change the dialog of a NPC
			ChatRoomCharacterUpdate(Player);	

		} else if (Item.Property.AutoPunishUndoTime - CurrentTime <= 0 && Item.Property.Type && Item.Property.Type != Item.Property.OriginalSetting) {
			// Deflate the gag back to the original setting after a while
			InventoryItemMouthFuturisticPanelGagTrigger(Player, Item, true)
		}
	}
	
}





// Update data
function AssetsItemMouthFuturisticPanelGagScriptDraw(data) {
	var persistentData = data.PersistentData();
	var property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.UpdateTime !== "number") persistentData.UpdateTime = CommonTime() + 4000;
	if (typeof persistentData.LastMessageLen !== "number") persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
	if (typeof property.BlinkState !== "number") property.BlinkState = 0;

	if (persistentData.UpdateTime < CommonTime() && data.C == Player) {
		if (CurrentScreen == "ChatRoom") {
		
			AssetsItemMouthFuturisticPanelGagScriptUpdatePlayer(data)
			
			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		property.BlinkState = (property.BlinkState + 1) % 2
		
		var timeToNextRefresh = 3025;
		persistentData.UpdateTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}


// Drawing function for the blinking light
function AssetsItemMouthFuturisticPanelGagBeforeDraw(data) { 
	if (data.L === "_Light" && data.Property && data.Property.AutoPunish > 0 && data.Property.BlinkState == 1) {
		
		if (data.Color && data.Color != "" && data.Color != "Default") {return {LayerType : "Blink"}}
		else if (data.Property.AutoPunish == 1) {return {LayerType : "Blink", Color : "#28ff28"}}
		else if (data.Property.AutoPunish == 2) {return {LayerType : "Blink", Color : "#ffff28"}}
		else if (data.Property.AutoPunish == 3) {return {LayerType : "Blink", Color : "#ff3838"}}
		
	}
	return data
}