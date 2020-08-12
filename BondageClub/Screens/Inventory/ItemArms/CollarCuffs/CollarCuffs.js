"use strict";

// Loads the item extension properties
function InventoryItemArmsCollarCuffsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
}

// Draw the item extension screen
function InventoryItemArmsCollarCuffsDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible poses
	DrawText(DialogFind(Player, "CollarCuffsSelectTightness"), 1500, 500, "white", "gray");
	
	DrawButton(1000, 550, 225, 65, DialogFind(Player, "CollarCuffsPoseLoose"), (DialogFocusItem.Property.Restrain == null) ? "#888888" : "White");
	
	DrawButton(1250, 550, 225, 65, DialogFind(Player, "CollarCuffsPoseNormal"), ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Normal")) ? "#888888" : "White");
	
	DrawButton(1500, 550, 225, 65, DialogFind(Player, "CollarCuffsPoseSnug"), ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Snug")) ? "#888888" : "White");
	
	DrawButton(1750, 550, 225, 65, DialogFind(Player, "CollarCuffsPoseTight"), ((DialogFocusItem.Property.Restrain != null) && 
	(DialogFocusItem.Property.Restrain == "Tight")) ? "#888888" : "White");
}

// Catches the item extension clicks
function InventoryItemArmsCollarCuffsClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Restrain != null)) InventoryItemArmsCollarCuffsSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Normal"))) InventoryItemArmsCollarCuffsSetPose("Normal");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Snug"))) InventoryItemArmsCollarCuffsSetPose("Snug");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Tight"))) InventoryItemArmsCollarCuffsSetPose("Tight");
}

// Sets the cuffs pose (wrist, elbow, both or none)
function InventoryItemArmsCollarCuffsSetPose(NewPose) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsCollarCuffsLoad();
	}

	// Sets the new pose with it's effects
	DialogFocusItem.Property.Restrain = NewPose;
	if (NewPose == null) {
		delete DialogFocusItem.Property.Difficulty;
	} else {
		if (NewPose == "Normal") DialogFocusItem.Property.Difficulty = 9;
		if (NewPose == "Snug") DialogFocusItem.Property.Difficulty = 11;
		if (NewPose == "Tight") DialogFocusItem.Property.Difficulty = 14;
	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = "CollarCuffsRestrain" + ((NewPose == null) ? "None" : NewPose);
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}