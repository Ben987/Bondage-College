"use strict";

// Loads the item extension properties
function InventoryItemMouth3WiffleGagLoad() {
	InventoryItemMouthWiffleGagLoad();
}

// Draw the item extension screen
function InventoryItemMouth3WiffleGagDraw() {
	InventoryItemMouthWiffleGagDraw();
}

// Catches the item extension clicks
function InventoryItemMouth3WiffleGagClick() {
	InventoryItemMouthWiffleGagClick();
}
function InventoryItemMouth3WiffleGagPublishAction(C, Option) {
	var msg = "BallGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouth3WiffleGagNpcDialog(C, Option) {
	InventoryItemMouthWiffleGagNpcDialog(C, Option);
}
