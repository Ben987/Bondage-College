"use strict";

// Loads the item extension properties
function InventoryItemBootsToeTapeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: [] };
}

// Draw the item extension screen
function InventoryItemBootsToeTapeDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible rope bondage positions
	DrawText(DialogFind(Player, "SelectTapeWrapping"), 1500, 475, "white", "gray");
	DrawButton(1175, 550, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Toes") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Toes.png", 1175, 551);
	DrawText(DialogFind(Player, "ToeTapePoseToes"), 1288, 800, "white", "gray");
	DrawButton(1600, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Full")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < null) ? "Pink" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Full.png", 1600, 551);
	DrawText(DialogFind(Player, "ToeTapePoseFull"), 1713, 800, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemBootsToeTapeClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1175) && (MouseX <= 1400) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemBootsToeTapeSetType(null);
	if ((MouseX >= 1600) && (MouseX <= 1825) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Full")) && (SkillGetLevelReal(Player, "Bondage") >= null)) InventoryItemBootsToeTapeSetType("Full");
}

// Sets the rope bondage position (Toes or Full)
function InventoryItemBootsToeTapeSetType(NewType) {

	// Loads the character and item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemBootsToeTapeLoad();
	}

	// Sets the position & difficulty
	DialogFocusItem.Property.Type = NewType;
	DialogFocusItem.Property.Effect = [];
	if (NewType == null) DialogFocusItem.Property.Difficulty = 0;
	if (NewType == "Full") DialogFocusItem.Property.Difficulty = 2;
	CharacterRefresh(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "ToeTapeSet" + ((NewType) ? NewType : "Toes");
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "ToeTapeSet" + ((NewType) ? NewType : "Toes"), "ItemBoots");
			C.FocusGroup = null;
		}
	}

}