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

var AutoPunishKeywords = [
"moan",
"whimper",
"shout",
"scream",
"whine",
"growl",
"laugh",
"giggle",
];

var AutoPunishGagActionFlag = false;

// How to make your item futuristic!

// In the load function, add this before your load function, without changing functions from the
// futuristic panel gag functions. Just make sure your item loads after the panel gag and not before in index.html:
/*
 	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else
*/

// In the draw function, add:
/*
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else
*/

// In the click function, add:
/*
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
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


var AutoPunishUndoCD = 300000; // Five minutes of being gagged, resetting each time the user does a violation
var FuturisticAccessDeniedMessage = "";

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemMouthFuturisticPanelGagLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	} else {
		ExtendedItemLoad(InventoryItemMouthFuturisticPanelGagOptions, "SelectGagType");
		if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Option: InventoryItemMouthFuturisticPanelGagOptions[0],
			AutoPunish: 0, AutoPunishUndoTime: 300000 , OriginalSetting: "Padded", ChatMessage: true};
		if (DialogFocusItem.Property.AutoPunish == null) DialogFocusItem.Property.AutoPunish = 0;
		if (DialogFocusItem.Property.AutoPunishUndoTime == null) DialogFocusItem.Property.AutoPunishUndoTime = 0;
		if (DialogFocusItem.Property.AutoPunishUndoTimeSetting == null) DialogFocusItem.Property.AutoPunishUndoTimeSetting = 300000;
		if (DialogFocusItem.Property.OriginalSetting == null) DialogFocusItem.Property.OriginalSetting = null;
		if (DialogFocusItem.Property.ChatMessage == null) DialogFocusItem.Property.ChatMessage = true;
		if (DialogFocusItem.Property.BlinkState == null) DialogFocusItem.Property.BlinkState = true;
	}
}


// Load the futuristic item ACCESS DENIED screen
function InventoryItemMouthFuturisticPanelGagLoadAccessDenied() {
	ElementCreateInput("PasswordField", "text", "", "12");
	if (!FuturisticAccessDeniedMessage)
		FuturisticAccessDeniedMessage = "";
}

// Draw the futuristic item ACCESS DENIED screen
function InventoryItemMouthFuturisticPanelGagDrawAccessDenied() {
	DrawAssetPreview(1387, 225, DialogFocusItem.Asset);

	DrawText(DialogFindPlayer("FuturisticItemLoginScreen"), 1500, 600, "White", "Gray");

	ElementPosition("PasswordField", 1505, 750, 350);
	DrawText(DialogFindPlayer("FuturisticItemPassword"), 1500, 700, "White", "Gray");
	DrawButton(1400, 800, 200, 64, DialogFindPlayer("FuturisticItemLogIn"), "White", "");

	if (FuturisticAccessDeniedMessage && FuturisticAccessDeniedMessage != "") DrawText(FuturisticAccessDeniedMessage, 1500, 963, "Red", "Black");

}

// Click the futuristic item ACCESS DENIED screen
function InventoryItemMouthFuturisticPanelGagClickAccessDenied() {
	if (MouseIn(1885, 25, 90, 90)) InventoryItemMouthFuturisticPanelGagExit();

	if (MouseIn(1400, 800, 200, 64)) {
		var pw = ElementValue("PasswordField").toUpperCase();
		if (DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy == "PasswordPadlock" && pw == DialogFocusItem.Property.Password) {
			let C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
			CommonPadlockUnlock(C, DialogFocusItem);
			DialogFocusItem = null;
			Player.FocusGroup = null;
			InventoryItemMouthFuturisticPanelGagExit();
		} else if (DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy == "TimerPasswordPadlock" && pw == DialogFocusItem.Property.Password) {
			let C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
			CommonPadlockUnlock(C, DialogFocusItem);
			DialogFocusItem = null;
			Player.FocusGroup = null;
			InventoryItemMouthFuturisticPanelGagExit();
		} else if (DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy == "CombinationPadlock" && pw == DialogFocusItem.Property.CombinationNumber) {
			let C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
			InventoryItemMiscCombinationPadlockUnlock(C, DialogFocusItem);
			DialogFocusItem = null;
			Player.FocusGroup = null;
			InventoryItemMouthFuturisticPanelGagExit();
		} else {
			FuturisticAccessDeniedMessage = DialogFindPlayer("CantChangeWhileLockedFuturistic");
			AudioPlayInstantSound("Audio/AccessDenied.mp3");
			if (CurrentScreen == "ChatRoom") {
				InventoryItemMouthFuturisticPanelGagPublishAccessDenied((Player.FocusGroup != null) ? Player : CurrentCharacter);
			}
		}
	}
}

function InventoryItemMouthFuturisticPanelGagExitAccessDenied() {
	ElementRemove("PasswordField");
	FuturisticAccessDeniedMessage = "";
	DialogFocusItem = null;
}

function InventoryItemMouthFuturisticPanelGagExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}

/**
* Draw the item extension screen
* @returns {void} - Nothing
*/
function InventoryItemMouthFuturisticPanelGagDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else {
		DrawAssetPreview(1387, 75, DialogFocusItem.Asset);

		if (DialogFocusItem.Property.AutoPunishUndoTime - CurrentTime > 0)
			DrawText(DialogFindPlayer("FuturisticPanelGagMouthDeflationTime") + " " + TimerToString(DialogFocusItem.Property.AutoPunishUndoTime - CurrentTime), 1500, 415, "White", "Gray");

		var type = "FuturisticPanelGagMouthType" + ((DialogFocusItem.Property.Type != null) ? DialogFocusItem.Property.Type : "Padded");
		DrawText(DialogFindPlayer("FuturisticPanelGagMouthTypeDesc") + " " +
			DialogFindPlayer(type), 1350, 475, "White", "Gray");

		MainCanvas.textAlign = "left";
		DrawCheckbox(1100, 890, 64, 64, "", DialogFocusItem.Property.ChatMessage, "White");
		DrawText(DialogFindPlayer("FuturisticPanelGagMouthButtonChatMessage"), 1200, 923, "White", "Gray");
		MainCanvas.textAlign = "center";

		var autopunish = "Off";
		if (DialogFocusItem.Property.AutoPunish == 0) {autopunish = "Off";}
		else if (DialogFocusItem.Property.AutoPunish == 1) {autopunish = "Low";}
		else if (DialogFocusItem.Property.AutoPunish == 2) {autopunish = "Medium";}
		else {autopunish = "Maximum";}

		DrawText(DialogFindPlayer("FuturisticPanelGagMouthButtonAutoPunish") + " " + autopunish, 1350, 683, "White", "Gray");
		if (DialogFocusItem) {
			if (DialogFocusItem.Property.Type != null) DrawButton(1100, 500, 200, 64, DialogFindPlayer("FuturisticPanelGagMouthTypePadded"), "White", "");
			if (DialogFocusItem.Property.Type != "LightBall") DrawButton(1400, 500, 200, 64, DialogFindPlayer("FuturisticPanelGagMouthTypeLightBall"), "White", "");
			if (DialogFocusItem.Property.Type != "Ball") DrawButton(1100, 570, 200, 64, DialogFindPlayer("FuturisticPanelGagMouthTypeBall"), "White", "");
			if (DialogFocusItem.Property.Type != "Plug") DrawButton(1400, 570, 200, 64, DialogFindPlayer("FuturisticPanelGagMouthTypePlug"), "White", "");

			if (DialogFocusItem.Property.AutoPunish != 0) DrawButton(1100, 707, 200, 64, DialogFindPlayer("TurnOff"), "White", "");
			if (DialogFocusItem.Property.AutoPunish != 1) DrawButton(1400, 707, 200, 64, DialogFindPlayer("Low"), "White", "");
			if (DialogFocusItem.Property.AutoPunish != 2) DrawButton(1100, 777, 200, 64, DialogFindPlayer("Medium"), "White", "");
			if (DialogFocusItem.Property.AutoPunish != 3) DrawButton(1400, 777, 200, 64, DialogFindPlayer("Maximum"), "White", "");

			DrawText(DialogFindPlayer("FuturisticPanelGagMouthDeflationTimeSetting" + DialogFocusItem.Property.AutoPunishUndoTimeSetting), 1775, 475, "White", "Gray");
			if (DialogFocusItem.Property.AutoPunishUndoTimeSetting != 120000) DrawButton(1675, 500, 200, 64, DialogFindPlayer("FuturisticPanelGagMouthDeflationTimeButton120000"), "White", "");
			if (DialogFocusItem.Property.AutoPunishUndoTimeSetting != 300000) DrawButton(1675, 570, 200, 64, DialogFindPlayer("FuturisticPanelGagMouthDeflationTimeButton300000"), "White", "");
			if (DialogFocusItem.Property.AutoPunishUndoTimeSetting != 900000) DrawButton(1675, 640, 200, 64, DialogFindPlayer("FuturisticPanelGagMouthDeflationTimeButton900000"), "White", "");
			if (DialogFocusItem.Property.AutoPunishUndoTimeSetting != 3600000) DrawButton(1675, 710, 200, 64, DialogFindPlayer("FuturisticPanelGagMouthDeflationTimeButton3600000"), "White", "");
			if (DialogFocusItem.Property.AutoPunishUndoTimeSetting != 72000000) DrawButton(1675, 780, 200, 64, DialogFindPlayer("FuturisticPanelGagMouthDeflationTimeButton72000000"), "White", "");

			if (DialogFocusItem.Property.AutoPunishUndoTimeSetting) DrawButton(1675, 880, 200, 64, DialogFindPlayer("FuturisticPanelGagMouthDeflationTimeButtonPump"), "White", "");
		}

	}
}


/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
function InventoryItemMouthFuturisticPanelGagClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else {
		if (MouseIn(1885, 25, 90, 90)) InventoryItemMouthFuturisticPanelGagExit();

		else if (MouseIn(1100, 890, 64, 64)) DialogFocusItem.Property.ChatMessage = !DialogFocusItem.Property.ChatMessage;


		else if (DialogFocusItem.Property.Type != null && MouseIn(1100, 500, 200, 64)) {
			DialogFocusItem.Property.AutoPunishUndoTime = 0;
			DialogFocusItem.Property.OriginalSetting = null;
			ExtendedItemSetType(C, InventoryItemMouthFuturisticPanelGagOptions, InventoryItemMouthFuturisticPanelGagOptions[0]);}
		else if (DialogFocusItem.Property.Type != "LightBall" && MouseIn(1400, 500, 200, 64)) {
			DialogFocusItem.Property.AutoPunishUndoTime = 0;
			DialogFocusItem.Property.OriginalSetting = "LightBall";
			ExtendedItemSetType(C, InventoryItemMouthFuturisticPanelGagOptions, InventoryItemMouthFuturisticPanelGagOptions[1]);}
		else if (DialogFocusItem.Property.Type != "Ball" && MouseIn(1100, 570, 200, 64)) {
			DialogFocusItem.Property.AutoPunishUndoTime = 0;
			DialogFocusItem.Property.OriginalSetting = "Ball";
			ExtendedItemSetType(C, InventoryItemMouthFuturisticPanelGagOptions, InventoryItemMouthFuturisticPanelGagOptions[2]);}
		else if (DialogFocusItem.Property.Type != "Plug" && MouseIn(1400, 570, 200, 64)) {
			DialogFocusItem.Property.AutoPunishUndoTime = 0;
			DialogFocusItem.Property.OriginalSetting = "Plug";
		ExtendedItemSetType(C, InventoryItemMouthFuturisticPanelGagOptions, InventoryItemMouthFuturisticPanelGagOptions[3]);}

		else if (DialogFocusItem.Property.AutoPunish != 0 && MouseIn(1100, 707, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunish(C, DialogFocusItem, 0);
		else if (DialogFocusItem.Property.AutoPunish != 1 && MouseIn(1400, 707, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunish(C, DialogFocusItem, 1);
		else if (DialogFocusItem.Property.AutoPunish != 2 && MouseIn(1100, 777, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunish(C, DialogFocusItem, 2);
		else if (DialogFocusItem.Property.AutoPunish != 3 && MouseIn(1400, 777, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunish(C, DialogFocusItem, 3);


		else if (DialogFocusItem.Property.AutoPunishUndoTimeSetting != 120000 && MouseIn(1675, 500, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunishTime(C, DialogFocusItem, 120000);
		else if (DialogFocusItem.Property.AutoPunishUndoTimeSetting != 300000 && MouseIn(1675, 570, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunishTime(C, DialogFocusItem, 300000);
		else if (DialogFocusItem.Property.AutoPunishUndoTimeSetting != 900000 && MouseIn(1675, 640, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunishTime(C, DialogFocusItem, 900000);
		else if (DialogFocusItem.Property.AutoPunishUndoTimeSetting != 3600000 && MouseIn(1675, 710, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunishTime(C, DialogFocusItem, 3600000);
		else if (DialogFocusItem.Property.AutoPunishUndoTimeSetting != 72000000 && MouseIn(1675, 780, 200, 64)) InventoryItemMouthFuturisticPanelGagSetAutoPunishTime(C, DialogFocusItem, 72000000);

		else if (DialogFocusItem.Property.AutoPunishUndoTimeSetting && MouseIn(1675, 880, 200, 64)) {
			InventoryItemMouthFuturisticPanelGagTrigger(C, DialogFocusItem, false, InventoryItemMouthFuturisticPanelGagOptions);
			DialogFocusItem.Property.AutoPunishUndoTime = CurrentTime + DialogFocusItem.Property.AutoPunishUndoTimeSetting; // Reset the deflation time
			CharacterRefresh(C, true); // Does not sync appearance while in the wardrobe
			ChatRoomCharacterUpdate(C);
		}

	}
}

/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character to validate the option for
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemMouthFuturisticPanelGagValidate(C, Option) {
	var Allowed = "";

	if (DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		var collar = InventoryGet(C, "ItemNeck");
		if (!collar || (!collar.Property || collar.Property.OpenPermission != true)) {
			Allowed = DialogExtendedMessage = DialogFindPlayer("CantChangeWhileLockedFuturistic");
		}
	}

	return Allowed;
}

function InventoryItemMouthFuturisticPanelGagGetOption(Options, OptionType) {
	for (let I = 0; I < Options.length; I++) {
		if (Options[I].Property.Type == OptionType) return I;
	}
	return 0;
}

function InventoryItemMouthFuturisticPanelGagPublishActionTrigger(C, Item, Option, Deflate) {
	var msg = "FuturisticPanelGagMouthSetAuto" + ((Deflate) ? "Deflate" : "Inflate") + Option.Name;

	var Dictionary = [
		{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "AssetName", AssetName: Item.Asset.Name },
	];
	if (Item.Property.ItemMemberNumber) Dictionary.push({ Tag: "ItemMemberNumber", MemberNumber: Item.Property.ItemMemberNumber });
	if (CurrentScreen == "ChatRoom") {
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary });
		ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);
	}
}

function InventoryItemMouthFuturisticPanelGagSetAutoPunish(C, Item, Level) {
	Item.Property.AutoPunish = Level;
	var msg = "FuturisticPanelGagMouthSetAutoPunish" + Level;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthFuturisticPanelGagSetAutoPunishTime(C, Item, Time) {
	Item.Property.AutoPunishUndoTimeSetting = Time;
	var msg = "FuturisticPanelGagMouthSetAutoPunishTime" + Time;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
function InventoryItemMouthFuturisticPanelGagPublishAction(C, Option) {
	var msg = "FuturisticPanelGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthFuturisticPanelGagPublishAccessDenied(C) {
	var msg = "FuturisticItemLoginLoginAttempt";
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name}
	];

	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/**
 * The NPC dialog is for what the NPC says to you when you make a change to their restraints - the dialog lookup is on a
 * per-NPC basis. You basically put the "AssetName" + OptionName in there to allow individual NPCs to override their default
 * "GroupName" dialog if for example we ever wanted an NPC to react specifically to having the restraint put on them.
 * That could be done by adding an "AssetName" entry (or entries) to that NPC's dialog CSV
 * @param {Character} C - The NPC to whom the restraint is applied
 * @param {Option} Option - The chosen option for this extended item
 * @returns {void} - Nothing
 */
function InventoryItemMouthFuturisticPanelGagNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthPlugGag" + Option.Name, "ItemMouth");
}

function InventoryItemMouthFuturisticPanelGagTrigger(C, Item, Reset, Options) {
	var OptionLevel = (Reset) ? Math.max(InventoryItemMouthFuturisticPanelGagGetOption(Options, Item.Property.OriginalSetting), InventoryItemMouthFuturisticPanelGagGetOption(Options, Item.Property.Type) - 1)
		: Math.min(Options.length, InventoryItemMouthFuturisticPanelGagGetOption(Options, Item.Property.Type) + 1);

	if (Reset || Item.Property.Type != "Plug") {
		var OriginalItemSetting = Item.Property.OriginalSetting;
		InventoryItemMouthFuturisticPanelGagSetOption(C, Options, Options[OptionLevel], Item);
		if (CurrentScreen == "ChatRoom" && Item.Property.ChatMessage)
			InventoryItemMouthFuturisticPanelGagPublishActionTrigger(C, Item, Options[OptionLevel], Reset);
		Item.Property.OriginalSetting = OriginalItemSetting; // After automatically changing it, we put it back to original setting

		CharacterSetFacialExpression(C, "Eyebrows", "Soft", 10);
		CharacterSetFacialExpression(C, "Blush", "Extreme", 15);
		CharacterSetFacialExpression(C, "Eyes", "Lewd", 5);

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

function AssetsItemMouthFuturisticPanelGagScriptUpdatePlayer(data, Options) {
	var Item = data.Item;
	// Punish the player if they speak
	if (Item.Property.AutoPunish < 3)
		AutoPunishGagActionFlag = false;

	if (Item.Property.AutoPunish && Item.Property.AutoPunish > 0 && Item.Property.AutoPunishUndoTimeSetting) {

		var LastMessages = data.PersistentData().LastMessageLen;
		var GagTriggerPunish = false;
		var keywords = false;
		var gagaction = false;

		if (Item.Property.AutoPunish == 3) {
			if (AutoPunishGagActionFlag == true) {
				gagaction = true;
				AutoPunishGagActionFlag = false;
			} else for (let K = 0; K < AutoPunishKeywords.length; K++) {
				if (ChatRoomLastMessage[ChatRoomLastMessage.length-1].includes(AutoPunishKeywords[K])) {
					keywords = true;
					break;
				}
			}
		}

		if (Item.Property.AutoPunish == 3 && (gagaction || (ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
			&& !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("(") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("*") && ChatRoomLastMessage[ChatRoomLastMessage.length-1].replace(/[A-Za-zА-Яа-я]+/g, '') != ChatRoomLastMessage[ChatRoomLastMessage.length-1]
			&& (!ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("/")
			|| (keywords && (ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("/me") || ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("*")))))))
			GagTriggerPunish = true;
		if (Item.Property.AutoPunish == 2 && ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
			&& !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("(") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("*") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("/")
			&& (ChatRoomLastMessage[ChatRoomLastMessage.length-1].length > 25
				|| (ChatRoomLastMessage[ChatRoomLastMessage.length-1].replace(/[A-Za-zА-Яа-я]+/g, '') != ChatRoomLastMessage[ChatRoomLastMessage.length-1] && (ChatRoomLastMessage[ChatRoomLastMessage.length-1] == ChatRoomLastMessage[ChatRoomLastMessage.length-1].toUpperCase()
				|| (ChatRoomLastMessage[ChatRoomLastMessage.length-1].includes('!'))))))
			GagTriggerPunish = true;
		if (Item.Property.AutoPunish == 1 && ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
			&& !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("(") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("*") && !ChatRoomLastMessage[ChatRoomLastMessage.length-1].startsWith("/")
			&& (ChatRoomLastMessage[ChatRoomLastMessage.length-1].replace(/[A-Za-zА-Яа-я]+/g, '') != ChatRoomLastMessage[ChatRoomLastMessage.length-1] && (ChatRoomLastMessage[ChatRoomLastMessage.length-1] == ChatRoomLastMessage[ChatRoomLastMessage.length-1].toUpperCase()
				|| (ChatRoomLastMessage[ChatRoomLastMessage.length-1].includes('!')))))
			GagTriggerPunish = true;

		if (ChatRoomTargetMemberNumber != null) {
			GagTriggerPunish = false; // No trigger on whispers
		}

		if (GagTriggerPunish) {
			InventoryItemMouthFuturisticPanelGagTrigger(Player, Item, false, Options);
			Item.Property.AutoPunishUndoTime = CurrentTime + Item.Property.AutoPunishUndoTimeSetting; // Reset the deflation time
			CharacterRefresh(Player, true); // Does not sync appearance while in the wardrobe

			// For a restraint, we might publish an action or change the dialog of a NPC
			ChatRoomCharacterUpdate(Player);

		} else if (Item.Property.AutoPunishUndoTime - CurrentTime <= 0 && Item.Property.Type && Item.Property.Type != Item.Property.OriginalSetting) {
			// Deflate the gag back to the original setting after a while
			InventoryItemMouthFuturisticPanelGagTrigger(Player, Item, true, Options);
			if (Item.Property.OriginalSetting != Item.Property.Type)
				Item.Property.AutoPunishUndoTime = CurrentTime + Item.Property.AutoPunishUndoTimeSetting; // Reset the deflation time
			CharacterRefresh(Player, true); // Does not sync appearance while in the wardrobe

			// For a restraint, we might publish an action or change the dialog of a NPC
			ChatRoomCharacterUpdate(Player);
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

			AssetsItemMouthFuturisticPanelGagScriptUpdatePlayer(data, InventoryItemMouthFuturisticPanelGagOptions);

			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		property.BlinkState = (property.BlinkState + 1) % 2;

		var timeToNextRefresh = 3025;
		persistentData.UpdateTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}


// Drawing function for the blinking light
function AssetsItemMouthFuturisticPanelGagBeforeDraw(data) {
	if (data.L === "_Light" && data.Property && data.Property.AutoPunish > 0 && data.Property.BlinkState == 1) {

		if (data.Color && data.Color != "" && data.Color != "Default") {return {LayerType : "Blink"};}
		else if (data.Property.AutoPunish == 1) {return {LayerType : "Blink", Color : "#28ff28"};}
		else if (data.Property.AutoPunish == 2) {return {LayerType : "Blink", Color : "#ffff28"};}
		else if (data.Property.AutoPunish == 3) {return {LayerType : "Blink", Color : "#ff3838"};}

	}
	return data;
}
