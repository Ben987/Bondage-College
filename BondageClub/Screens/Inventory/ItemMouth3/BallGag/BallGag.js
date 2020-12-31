"use strict";

// Loads the item extension properties
function InventoryItemMouth3BallGagLoad() {
	InventoryItemMouthBallGagLoad();
}

// Draw the item extension screen
function InventoryItemMouth3BallGagDraw() {
	InventoryItemMouthBallGagDraw();
}

// Catches the item extension clicks
function InventoryItemMouth3BallGagClick() {
	InventoryItemMouthBallGagClick();
}

function InventoryItemMouth3BallGagPublishAction(C, Option) {
	var msg = "BallGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouth3BallGagNpcDialog(C, Option) {
	InventoryItemMouthBallGagNpcDialog(C, Option);
}
