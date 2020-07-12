"use strict";

// Loads the item extension properties
function InventoryItemMouthMilkBottleLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: [] };
	DialogExtendedMessage = DialogFind(Player, "SelectMilkBottleState");
}

// Draw the item extension screen
function InventoryItemMouthMilkBottleDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible positions and their requirements
	DrawText(DialogExtendedMessage, 1500, 475, "white", "gray");
	DrawButton(1050, 550, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Rest") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Rest.png", 1050, 551);
	DrawText(DialogFind(Player, "MilkBottleRest"), 1163, 800, "white", "gray");
	DrawButton(1387, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Raised")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Raised.png", 1387, 551);
	DrawText(DialogFind(Player, "MilkBottleRaised"), 1500, 800, "white", "gray");
	DrawButton(1725, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Chug")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Chug.png", 1725, 551);
	DrawText(DialogFind(Player, "MilkBottleChug"), 1838, 800, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemMouthMilkBottleClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1050) && (MouseX <= 1275) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemMouthMilkBottleSetType(null);
	if ((MouseX >= 1387) && (MouseX <= 1612) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Raised"))) InventoryItemMouthMilkBottleSetType("Raised");
	if ((MouseX >= 1725) && (MouseX <= 1950) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Chug"))) InventoryItemMouthMilkBottleSetType("Chug");
}

// Sets the Mouth bondage position (Rest, Raised, Chug)
function InventoryItemMouthMilkBottleSetType(NewType) {
	
	// Loads the character and item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemMouthMilkBottleLoad();
	}

	// Sets the position, difficulty and blush effect
	DialogFocusItem.Property.Type = NewType;
	DialogFocusItem.Property.Effect = [];
	if (NewType == null) {
		DialogFocusItem.Property.SetPose = null;
		DialogFocusItem.Property.Difficulty = 0;
	}
	if (NewType == "Raised") {
        DialogFocusItem.Property.SetPose = null;
        DialogFocusItem.Property.AllowLock = true;
		DialogFocusItem.Property.Difficulty = 0;
	}
	if (NewType == "Chug") {
		DialogFocusItem.Property.SetPose = null;
		DialogFocusItem.Property.Difficulty = 0;
	}
	CharacterRefresh(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "MilkBottleSet" + ((NewType) ? NewType : "Rest");
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "MilkBottle" + ((NewType) ? NewType : "Rest"), "ItemMouth");
			C.FocusGroup = null;
		}
	}

}