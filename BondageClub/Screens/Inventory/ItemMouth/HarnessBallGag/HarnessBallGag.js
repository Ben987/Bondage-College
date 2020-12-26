"use strict";

// Loads the item extension properties
function InventoryItemMouthHarnessBallGagLoad() {
	InventoryItemMouthBallGagLoad();
}

// Draw the item extension screen
function InventoryItemMouthHarnessBallGagDraw() {
	InventoryItemMouthBallGagDraw();
}

// Catches the item extension clicks
function InventoryItemMouthHarnessBallGagClick() {
	InventoryItemMouthBallGagClick();
}

function InventoryItemMouthHarnessBallGagPublishAction(C, Option) {
	var msg = "BallGagMouthSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemMouthHarnessBallGagNpcDialog(C, Option) {
	InventoryItemMouthBallGagNpcDialog(C, Option);
}
