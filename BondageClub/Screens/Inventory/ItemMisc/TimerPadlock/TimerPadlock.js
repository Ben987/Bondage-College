"use strict";

// Loads the item extension properties
function InventoryItemMiscTimerPadlockLoad() {
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property == null)) DialogFocusSourceItem.Property = {};
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.RemoveItem == null)) DialogFocusSourceItem.Property.RemoveItem = false;
}

// Draw the extension screen
function InventoryItemMiscTimerPadlockDraw() {
	DrawText(DialogFind(Player, "TimerLeft") + " " + TimerToString(DialogFocusSourceItem.Property.RemoveTimer - CurrentTime), 1500, 150, "white", "gray");
	DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
	if (Player.CanInteract()) DrawButton(1350, 700, 300, 65, DialogFind(Player, "RestartTimer"), "White");
	if ((Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
		DrawButton(1100, 836, 64, 64, "", "White", (DialogFocusSourceItem.Property.RemoveItem) ? "Icons/Checked.png" : "");	
		DrawText(DialogFind(Player, "RemoveItemWithTimer"), 1550, 868, "white", "gray");
	} else DrawText(DialogFind(Player, (DialogFocusSourceItem.Property.RemoveItem) ? "WillRemoveItemWithTimer" : "WontRemoveItemWithTimer"), 1500, 868, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemMiscTimerPadlockClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemMiscTimerPadlockExit();
	if ((MouseX >= 1350) && (MouseX <= 1650) && (MouseY >= 700) && (MouseY <= 765) && Player.CanInteract()) InventoryItemMiscTimerPadlockReset();
	if ((MouseX >= 1100) && (MouseX <= 1164) && (MouseY >= 836) && (MouseY <= 900) && (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
		DialogFocusSourceItem.Property.RemoveItem = !(DialogFocusSourceItem.Property.RemoveItem);
		if (CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(CurrentCharacter);
	}
}

// When the timer resets
function InventoryItemMiscTimerPadlockReset() {
	if (DialogFocusItem.Asset.RemoveTimer > 0) DialogFocusSourceItem.Property.RemoveTimer = CurrentTime + (DialogFocusItem.Asset.RemoveTimer * 1000);
	if (CurrentScreen == "ChatRoom") {
		var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
		var msg = DialogFind(Player, "TimerRestart");
		msg = msg.replace("SourceCharacter", Player.Name);
		msg = msg.replace("DestinationCharacter", C.Name);
		msg = msg.replace("BodyPart", C.FocusGroup.Description.toLowerCase());
		ChatRoomPublishCustomAction(msg, true);
	}
	InventoryItemMiscTimerPadlockExit();
}

// Exits the extended menu
function InventoryItemMiscTimerPadlockExit() {
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}