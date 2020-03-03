"use strict";

// Loads the item extension properties
function InventoryItemArmsHempRopeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: [] };
	DialogExtendedMessage = DialogFind(Player, "SelectRopeBondage");
}

// Draw the item extension screen
function InventoryItemArmsHempRopeDraw() {

	// Draw the header and item
	DrawRect(1387, 115, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 117, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible positions and their requirements
	DrawText(DialogExtendedMessage, 1500, 75, "white", "gray");
	DrawButton(1050, 450, 225, 225, "", (DialogFocusItem.Property.Type == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/BoxTie.png", 1050, 451);
	DrawText(DialogFind(Player, "RopeBondageBoxTie"), 1163, 425, "white", "gray");
	DrawText(DialogFind(Player, "NoRequirement"), 1163, 700, "white", "gray");
	DrawButton(1387, 450, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Hogtied")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 4) ? "Pink" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Hogtied.png", 1387, 451);
	DrawText(DialogFind(Player, "RopeBondageHogtied"), 1500, 425, "white", "gray");
	DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "4"), 1500, 700, "white", "gray");
	DrawButton(1725, 450, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "SuspensionHogtied")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 8) ? "Pink" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/SuspensionHogtied.png", 1725, 451);
	DrawText(DialogFind(Player, "RopeBondageSuspensionHogtied"), 1838, 425, "white", "gray");
	DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "8"), 1838, 700, "white", "gray");
	DrawButton(1387, 750, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "AllFours")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 4) ? "Pink" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/AllFours.png", 1387, 751);
	DrawText(DialogFind(Player, "RopeBondageAllFours"), 1500, 735, "white", "gray");
	DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "4"), 1500, 985, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemArmsHempRopeClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1050) && (MouseX <= 1275) && (MouseY >= 450) && (MouseY <= 675) && (DialogFocusItem.Property.Type != null)) InventoryItemArmsHempRopeSetPose(null);
	if ((MouseX >= 1387) && (MouseX <= 1612) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Hogtied")) && (SkillGetLevelReal(Player, "Bondage") >= 4)) InventoryItemArmsHempRopeSetPose("Hogtied");
	if ((MouseX >= 1725) && (MouseX <= 1950) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "SuspensionHogtied")) && (SkillGetLevelReal(Player, "Bondage") >= 8)) InventoryItemArmsHempRopeSetPose("SuspensionHogtied");
	if ((MouseX >= 1387) && (MouseX <= 1612) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "AllFours")) && (SkillGetLevelReal(Player, "Bondage") >= 4)) InventoryItemArmsHempRopeSetPose("AllFours");
}

// Sets the hemp rope pose (hogtied, suspension, etc.)
function InventoryItemArmsHempRopeSetPose(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsHempRopeLoad();
	}

	// Validates a few parameters before hogtied
	if ((NewType != null) && !InventoryAllow(C, ["NotKneeling", "NotMounted", "NotChained", "NotSuspended", "CannotBeHogtiedWithAlphaHood"], true)) { DialogExtendedMessage = DialogText; return; }

	// Sets the new pose with it's effects
	DialogFocusItem.Property.Type = NewType;
	DialogFocusItem.Property.Effect = (NewType == null) ? ["Block", "Prone"] : ["Block", "Freeze", "Prone"];
	DialogFocusItem.Property.Block = (NewType == null) ? null : ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"];
	if (NewType == null) {
		DialogFocusItem.Property.SetPose = ["BackBoxTie"];
		DialogFocusItem.Property.Difficulty = 0;
		InventoryRemove(C, "ItemHidden");
	}
	if (NewType == "Hogtied") {
		DialogFocusItem.Property.SetPose = ["Hogtied"];
		DialogFocusItem.Property.Difficulty = 2;
		CharacterSetFacialExpression(C, "Blush", "Medium", 10);
		InventoryRemove(C, "ItemHidden");
	}
	if (NewType == "SuspensionHogtied") {
		DialogFocusItem.Property.SetPose = ["Hogtied", "SuspensionHogtied"];
		DialogFocusItem.Property.Difficulty = 6;
		CharacterSetFacialExpression(C, "Blush", "Medium", 20);
		InventoryWear(C, "SuspensionHempRope", "ItemHidden", DialogFocusItem.Color);
	}
	if (NewType == "AllFours") {
		DialogFocusItem.Property.SetPose = ["AllFours"];
		DialogFocusItem.Property.Difficulty = 2;
		CharacterSetFacialExpression(C, "Blush", "Medium", 10);
		InventoryRemove(C, "ItemHidden");
	}
	CharacterRefresh(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		ChatRoomCharacterUpdate(C);
		var msg = "ArmsRopeSet" + ((NewType) ? NewType : "BoxTie");
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "RopeBondage" + ((NewType) ? NewType : "BoxTie"), "ItemArms");
			C.FocusGroup = null;
		}
	}

}