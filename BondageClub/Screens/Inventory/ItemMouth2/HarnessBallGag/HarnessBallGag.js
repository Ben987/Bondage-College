"use strict";

// Loads the item extension properties
function InventoryItemMouth2HarnessBallGagLoad() {
	InventoryItemMouthBallGagLoad();
}

// Draw the item extension screen
function InventoryItemMouth2HarnessBallGagDraw() {
	InventoryItemMouthBallGagDraw();
}

// Catches the item extension clicks
function InventoryItemMouth2HarnessBallGagClick() {
	InventoryItemMouthBallGagClick();
}

function InventoryItemMouth2HarnessBallGagPublishAction(C, Option) {
	var msg = "BallGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouth2HarnessBallGagNpcDialog(C, Option) {
	InventoryItemMouthBallGagNpcDialog(C, Option);
}
