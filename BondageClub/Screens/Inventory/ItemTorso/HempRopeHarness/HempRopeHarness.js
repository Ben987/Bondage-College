"use strict";

// Loads the item extension properties
function InventoryItemTorsoHempRopeHarnessLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
}

// Draw the item extension screen
function InventoryItemTorsoHempRopeHarnessDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the rope harness types
	DrawText(DialogFind(Player, "SelectRopeBondage"), 1500, 475, "white", "gray");
	DrawButton(1050, 550, 225, 225, "", (DialogFocusItem.Property.Type == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Crotch.png", 1050, 551);
	DrawText(DialogFind(Player, "RopeBondageCrotch"), 1163, 800, "white", "gray");
	DrawText(DialogFind(Player, "NoRequirement"), 1163, 850, "white", "gray");
	DrawButton(1387, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Harness")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 2) ? "Pink" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Harness.png", 1387, 551);
	DrawText(DialogFind(Player, "RopeBondageHarness"), 1500, 800, "white", "gray");
	DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "2"), 1500, 850, "white", "gray");
	DrawButton(1725, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Diamond")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 4) ? "Pink" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Diamond.png", 1725, 551);
	DrawText(DialogFind(Player, "RopeBondageDiamond"), 1838, 800, "white", "gray");
	DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "4"), 1838, 850, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemTorsoHempRopeHarnessClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1050) && (MouseX <= 1275) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemTorsoHempRopeHarnessSetType(null);
	if ((MouseX >= 1387) && (MouseX <= 1612) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Harness")) && (SkillGetLevelReal(Player, "Bondage") >= 2)) InventoryItemTorsoHempRopeHarnessSetType("Harness");
	if ((MouseX >= 1725) && (MouseX <= 1950) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Diamond")) && (SkillGetLevelReal(Player, "Bondage") >= 4)) InventoryItemTorsoHempRopeHarnessSetType("Diamond");
}

// Sets the harness type (Crotch, Regular, Diamond)
function InventoryItemTorsoHempRopeHarnessSetType(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemTorsoHempRopeHarnessLoad();
	}

	// Sets the harness type & difficulty
	DialogFocusItem.Property.Type = NewType;
	DialogFocusItem.Property.Effect = [];
	if (NewType == null) DialogFocusItem.Property.Difficulty = 0;
	if (NewType == "Harness") DialogFocusItem.Property.Difficulty = 1;
	if (NewType == "Diamond") DialogFocusItem.Property.Difficulty = 2;
	CharacterRefresh(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		ChatRoomCharacterUpdate(C);
		var msg = "RopeHarnessSet" + ((NewType) ? NewType : "Crotch");
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "RopeBondage" + ((NewType) ? NewType : "Crotch"), "ItemTorso");
			C.FocusGroup = null;
		}
	}

}