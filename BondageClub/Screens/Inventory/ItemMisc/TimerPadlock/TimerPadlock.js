"use strict";

// Loads the item extension properties
function InventoryItemMiscTimerPadlockLoad() {
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property == null)) DialogFocusSourceItem.Property = {};
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.RemoveItem == null)) DialogFocusSourceItem.Property.RemoveItem = false;
}

// Draw the extension screen
function InventoryItemMiscTimerPadlockDraw() {
	if ((DialogFocusItem == null) || (DialogFocusSourceItem.Property.RemoveTimer < CurrentTime)) { InventoryItemMiscTimerPadlockExit(); return; }
	DrawText(DialogFind(Player, "TimerLeft") + " " + TimerToString(DialogFocusSourceItem.Property.RemoveTimer - CurrentTime), 1500, 150, "white", "gray");
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
		DrawText(DialogFind(Player, "LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
	if ((Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
		MainCanvas.textAlign = "left";
		DrawButton(1100, 836, 64, 64, "", "White", (DialogFocusSourceItem.Property.RemoveItem) ? "Icons/Checked.png" : "");	
		DrawText(DialogFind(Player, "RemoveItemWithTimer"), 1200, 868, "white", "gray");
		MainCanvas.textAlign = "center";
	} else DrawText(DialogFind(Player, (DialogFocusSourceItem.Property.RemoveItem) ? "WillRemoveItemWithTimer" : "WontRemoveItemWithTimer"), 1500, 868, "white", "gray");
	if (Player.CanInteract()) DrawButton(1350, 910, 300, 65, DialogFind(Player, "RestartTimer"), "White");
}

// Catches the item extension clicks
function InventoryItemMiscTimerPadlockClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemMiscTimerPadlockExit();
	if ((MouseX >= 1100) && (MouseX <= 1164) && (MouseY >= 836) && (MouseY <= 900) && (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
		DialogFocusSourceItem.Property.RemoveItem = !(DialogFocusSourceItem.Property.RemoveItem);
		if (CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(CurrentCharacter);
	}
	if ((MouseX >= 1350) && (MouseX <= 1650) && (MouseY >= 910) && (MouseY <= 975) && Player.CanInteract()) InventoryItemMiscTimerPadlockReset();
}

// When the timer resets
function InventoryItemMiscTimerPadlockReset() {
	if (DialogFocusItem.Asset.RemoveTimer > 0) DialogFocusSourceItem.Property.RemoveTimer = CurrentTime + (DialogFocusItem.Asset.RemoveTimer * 1000);
	if (CurrentScreen == "ChatRoom") {
		var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
		var msg = "TimerRestart";
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	}
	InventoryItemMiscTimerPadlockExit();
}

// Exits the extended menu
function InventoryItemMiscTimerPadlockExit() {
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}