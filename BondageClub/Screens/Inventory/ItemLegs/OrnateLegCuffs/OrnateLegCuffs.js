"use strict";

// Loads the item extension properties
function InventoryItemLegsOrnateLegCuffsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
}

// Draw the item extension screen
function InventoryItemLegsOrnateLegCuffsDraw() {
	const A = DialogFocusItem.Asset;
	const Property = DialogFocusItem.Property;
	const InventoryPath = AssetGetInventoryPath(A);

	// Draw the header and item
	DrawAssetPreview(1387, 125, A);

	// Draw the possible poses
	DrawText(DialogFindPlayer("SelectBondagePosition"), 1500, 500, "white", "gray");
	DrawPreviewBox(1250, 550, `${InventoryPath}/None.png`, "", {Hover: true, Disabled: Property.Restrain == null});
	DrawText(DialogFindPlayer("OrnateLegCuffsPoseNone"), 1365, 800, "white", "gray");
	DrawPreviewBox(1500, 550, `${InventoryPath}/Closed.png`, "", {Hover: true, Disabled: Property.Restrain === "Closed"});
	DrawText(DialogFindPlayer("OrnateLegCuffsPoseClosed"), 1610, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemLegsOrnateLegCuffsClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Restrain != null)) InventoryItemLegsOrnateLegCuffsSetPose(null);
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Closed"))) InventoryItemLegsOrnateLegCuffsSetPose("Closed");
}

// Sets the cuffs pose (wrist, elbow, both or none)
function InventoryItemLegsOrnateLegCuffsSetPose(NewPose) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemLegsOrnateLegCuffsLoad();
	}

	// Sets the new pose with it's effects
	DialogFocusItem.Property.Restrain = NewPose;
	if (NewPose == null) {
		delete DialogFocusItem.Property.SetPose;
		delete DialogFocusItem.Property.Effect;
		delete DialogFocusItem.Property.Difficulty;
		delete DialogFocusItem.Property.FreezeActivePose;
	} else if (NewPose == "Closed") {
		DialogFocusItem.Property.SetPose = ["LegsClosed"];
		DialogFocusItem.Property.Effect = ["Prone", "KneelFreeze"];
		DialogFocusItem.Property.Difficulty = 6;
		DialogFocusItem.Property.FreezeActivePose = ["BodyLower"]
	}

	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = "OrnateLegCuffsRestrain" + ((NewPose == null) ? "None" : NewPose);
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	ChatRoomPublishCustomAction(msg, true, Dictionary);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}
