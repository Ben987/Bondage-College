"use strict";

// Loads the item extension properties
function InventoryItemFeetChainsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: [] };
	DialogExtendedMessage = DialogFind(Player, "SelectChainBondage");
}

// Draw the item extension screen
function InventoryItemFeetChainsDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible positions and their requirements
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DrawText(DialogExtendedMessage, 1500, 475, "white", "gray");
		DrawButton(1050, 550, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Basic") ? "#888888" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Basic.png", 1050, 551);
		DrawText(DialogFind(Player, "ChainBondageBasic"), 1163, 800, "white", "gray");
		DrawText(DialogFind(Player, "NoRequirement").replace("ReqLevel", "2"), 1163, 850, "white", "gray");
		DrawButton(1387, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Strict")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 2) ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Strict.png", 1387, 551);
		DrawText(DialogFind(Player, "ChainBondageStrict"), 1500, 800, "white", "gray");
		DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "2"), 1500, 850, "white", "gray");
		DrawButton(1725, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Suspension")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 6) ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Suspension.png", 1725, 551);
		DrawText(DialogFind(Player, "ChainBondageSuspension"), 1838, 800, "white", "gray");
		DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "6"), 1838, 850, "white", "gray");
	}
	else DrawText(DialogFind(Player, "CantChangeWhileLocked"), 1500, 500, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemFeetChainsClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1050) && (MouseX <= 1275) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemFeetChainsSetType(null);
	if ((MouseX >= 1387) && (MouseX <= 1612) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Strict")) && (SkillGetLevelReal(Player, "Bondage") >= 2)) InventoryItemFeetChainsSetType("Strict");
	if ((MouseX >= 1725) && (MouseX <= 1950) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Suspension")) && (SkillGetLevelReal(Player, "Bondage") >= 6)) InventoryItemFeetChainsSetType("Suspension");
}

// Sets the feet bondage position (Basic, Strict, Suspension)
function InventoryItemFeetChainsSetType(NewType) {

	// Loads the character and item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemFeetChainsLoad();
	}

	// Validates a few parameters before suspending
	if ((NewType == "Suspension") && !InventoryAllow(C, ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"], true)) { DialogExtendedMessage = DialogText; return; }
	// Sets the position, difficulty and blush effect
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DialogFocusItem.Property.Type = NewType;
		DialogFocusItem.Property.Effect = [];
		if (NewType == null) {
			DialogFocusItem.Property.SetPose = null;
			DialogFocusItem.Property.Difficulty = 0;
		}
		if (NewType == "Strict") {
			DialogFocusItem.Property.SetPose = null;
			DialogFocusItem.Property.Difficulty = 2;
		}
		if (NewType == "Suspension") {
			DialogFocusItem.Property.SetPose = ["Suspension", "LegsClosed"];
			DialogFocusItem.Property.Difficulty = 4;
			CharacterSetFacialExpression(C, "Blush", "High", 30);
		}
	}
	else return;

	CharacterRefresh(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "LegChainSet" + ((NewType) ? NewType : "Basic");
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "ChainBondage" + ((NewType) ? NewType : "Basic"), "ItemFeet");
			C.FocusGroup = null;
		}
	}

}