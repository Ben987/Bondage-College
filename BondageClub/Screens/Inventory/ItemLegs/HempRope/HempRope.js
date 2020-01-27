"use strict";

// Loads the item extension properties
function InventoryItemLegsHempRopeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: [] };
}

// Draw the item extension screen
function InventoryItemLegsHempRopeDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible rope bondage positions
	DrawText(DialogFind(Player, "SelectRopeBondage"), 1500, 475, "white", "gray");
	DrawButton(1175, 550, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Basic") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Basic.png", 1175, 551);
	DrawText(DialogFind(Player, "RopeBondageBasic"), 1288, 800, "white", "gray");
	DrawText(DialogFind(Player, "NoRequirement").replace("ReqLevel", "2"), 1288, 850, "white", "gray");
	DrawButton(1600, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Mermaid")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 2) ? "Pink" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Mermaid.png", 1600, 551);
	DrawText(DialogFind(Player, "RopeBondageMermaid"), 1713, 800, "white", "gray");
	DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "2"), 1713, 850, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemLegsHempRopeClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1175) && (MouseX <= 1400) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemLegsHempRopeSetType(null);
	if ((MouseX >= 1600) && (MouseX <= 1825) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Mermaid")) && (SkillGetLevelReal(Player, "Bondage") >= 2)) InventoryItemLegsHempRopeSetType("Mermaid");
}

// Sets the rope bondage position (Basic or Mermaid)
function InventoryItemLegsHempRopeSetType(NewType) {

	// Loads the character and item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemLegsHempRopeLoad();
	}

	// Sets the position & difficulty
	DialogFocusItem.Property.Type = NewType;
	DialogFocusItem.Property.Effect = [];
	if (NewType == null) DialogFocusItem.Property.Difficulty = 0;
	if (NewType == "Mermaid") DialogFocusItem.Property.Difficulty = 2;
	CharacterRefresh(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		ChatRoomCharacterUpdate(C);
		var msg = "LegRopeSet" + ((NewType) ? NewType : "Basic");
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "RopeBondage" + ((NewType) ? NewType : "Basic"), "ItemLegs");
			C.FocusGroup = null;
		}
	}

}