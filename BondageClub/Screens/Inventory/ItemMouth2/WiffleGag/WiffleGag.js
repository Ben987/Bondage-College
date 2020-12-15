"use strict";

// Loads the item extension properties
function InventoryItemMouth2WiffleGagLoad() {
	InventoryItemMouthWiffleGagLoad();
}

// Draw the item extension screen
function InventoryItemMouth2WiffleGagDraw() {
	InventoryItemMouthWiffleGagDraw();
}

// Catches the item extension clicks
function InventoryItemMouth2WiffleGagClick() {
	InventoryItemMouthWiffleGagClick();
}
function InventoryItemMouth2WiffleGagPublishAction(C, Option) {
	var msg = "BallGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouth2WiffleGagNpcDialog(C, Option) {
	InventoryItemMouthWiffleGagNpcDialog(C, Option);
}
