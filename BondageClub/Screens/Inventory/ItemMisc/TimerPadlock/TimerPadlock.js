"use strict";
var InventoryItemMiscTimerPadlockItem = null;

// Loads the item extension properties
function InventoryItemMiscTimerPadlockLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	InventoryItemMiscTimerPadlockItem = InventoryGet(C, C.FocusGroup.Name);
}

// Draw the extension screen
function InventoryItemMiscTimerPadlockDraw() {
	if ((DialogFocusItem == null) || (InventoryItemMiscTimerPadlockItem.Property.RemoveTimer < CurrentTime)) { InventoryItemMiscTimerPadlockExit(); return; }
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawText(DialogFind(Player, "TimerLeft") + " " + TimerToString(InventoryItemMiscTimerPadlockItem.Property.RemoveTimer - CurrentTime), 1500, 150, "white", "gray");
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name), 1500, 600, "white", "gray");
	if (Player.CanInteract()) DrawButton(1350, 700, 300, 65, "Restart Timer", "White");
}

// Catches the item extension clicks
function InventoryItemMiscTimerPadlockClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemMiscTimerPadlockExit();
	if ((MouseX >= 1350) && (MouseX <= 1650) && (MouseY >= 700) && (MouseY <= 765) && Player.CanInteract()) InventoryItemMiscTimerPadlockReset();
}

// When the timer resets
function InventoryItemMiscTimerPadlockReset() {
	if (DialogFocusItem.Asset.RemoveTimer > 0) InventoryItemMiscTimerPadlockItem.Property.RemoveTimer = CurrentTime + (DialogFocusItem.Asset.RemoveTimer * 1000);
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