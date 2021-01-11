"use strict";

// Loads the item extension properties
function InventoryItemMouth2BallGagLoad() {
	InventoryItemMouthBallGagLoad();
}

// Draw the item extension screen
function InventoryItemMouth2BallGagDraw() {
	InventoryItemMouthBallGagDraw();
}

// Catches the item extension clicks
function InventoryItemMouth2BallGagClick() {
	InventoryItemMouthBallGagClick();
}

function InventoryItemMouth2BallGagPublishAction(C, Option) {
	var msg = "BallGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}


function InventoryItemMouth2BallGagNpcDialog(C, Option) {
	InventoryItemMouthBallGagNpcDialog(C, Option);
}
