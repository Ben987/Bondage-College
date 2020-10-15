"use strict";

var InventoryItemMouthFuturisticPanelGagOptions = [
	{
		Name: "Padded",
		Property: {
			Type: null,
			Effect: ["BlockMouth", "GagLight"],
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

// Loads the item extension properties
function InventoryItemMouthFuturisticPanelGagLoad() {
 	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else
		ExtendedItemLoad(InventoryItemMouthFuturisticPanelGagOptions, "SelectGagType");
}


// Load the futuristic item ACCESS DENIED screen
function InventoryItemMouthFuturisticPanelGagLoadAccessDenied() {
	ElementCreateInput("PasswordField", "text", "", "12");
	PreferenceMessage = ""
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
	
	if (PreferenceMessage != "") DrawText(PreferenceMessage, 1500, 963, "Red", "Black");
	
}

// Click the futuristic item ACCESS DENIED screen
function InventoryItemMouthFuturisticPanelGagClickAccessDenied() {
	if (MouseIn(1885, 25, 90, 90)) InventoryItemMouthFuturisticPanelGagExit()
	if (MouseIn(1400, 800, 200, 64)) {
		PreferenceMessage = DialogFind(Player, "CantChangeWhileLockedFuturistic");
		var vol = 1
		if (Player.AudioSettings && Player.AudioSettings.Volume) {
			vol = Player.AudioSettings.Volume
		}
		AudioPlayInstantSound("Audio/AccessDenied.mp3", vol)
	}
}



	
function InventoryItemMouthFuturisticPanelGagExit() {
	ElementRemove("PasswordField");
	
	DialogFocusItem = null;
}

// Draw the item extension screen
function InventoryItemMouthFuturisticPanelGagDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else
		ExtendedItemDraw(InventoryItemMouthFuturisticPanelGagOptions, "FuturisticPanelGagMouthType");
}



// Catches the item extension clicks
function InventoryItemMouthFuturisticPanelGagClick() {
		var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else
		ExtendedItemClick(InventoryItemMouthFuturisticPanelGagOptions);
}



function InventoryItemMouthFuturisticPanelGagValidate(C, Option) {
	var Allowed = true;

	if (DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLockedFuturistic");
		Allowed = false;
	} 

	return Allowed;
}


function InventoryItemMouthFuturisticPanelGagPublishAction(C, Option) {
	var msg = "FuturisticPanelGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthFuturisticPanelNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemMouthPlugGag" + Option.Name, "ItemMouth");
}


