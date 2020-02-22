"use strict";

// Loads the item extension properties
function InventoryItemArmsChainsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: [] };
	DialogExtendedMessage = DialogFind(Player, "SelectChainBondage");
}

// Draw the item extension screen
function InventoryItemArmsChainsDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible positions and their requirements
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DrawText(DialogExtendedMessage, 1500, 475, "white", "gray");
		DrawButton(1050, 550, 225, 225, "", (DialogFocusItem.Property.Type == null) ? "#888888" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/BoxTie.png", 1050, 551);
		DrawText(DialogFind(Player, "ChainBondageBoxTie"), 1163, 800, "white", "gray");
		DrawText(DialogFind(Player, "NoRequirement"), 1163, 850, "white", "gray");
		DrawButton(1387, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Hogtied")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 4) ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Hogtied.png", 1387, 551);
		DrawText(DialogFind(Player, "ChainBondageHogtied"), 1500, 800, "white", "gray");
		DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "4"), 1500, 850, "white", "gray");
		DrawButton(1725, 550, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "SuspensionHogtied")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 8) ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/SuspensionHogtied.png", 1725, 551);
		DrawText(DialogFind(Player, "ChainBondageSuspensionHogtied"), 1838, 800, "white", "gray");
		DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "8"), 1838, 850, "white", "gray");
	}
	else DrawText(DialogFind(Player, "CantChangeWhileLocked"), 1500, 500, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemArmsChainsClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1050) && (MouseX <= 1275) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != null)) InventoryItemArmsChainsSetPose(null);
	if ((MouseX >= 1387) && (MouseX <= 1612) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Hogtied")) && (SkillGetLevelReal(Player, "Bondage") >= 4)) InventoryItemArmsChainsSetPose("Hogtied");
	if ((MouseX >= 1725) && (MouseX <= 1950) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "SuspensionHogtied")) && (SkillGetLevelReal(Player, "Bondage") >= 8)) InventoryItemArmsChainsSetPose("SuspensionHogtied");
}

// Sets the chain pose (hogtied, suspension, etc.)
function InventoryItemArmsChainsSetPose(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsChainsLoad();
	}

	// Validates a few parameters before hogtied
	if ((NewType != null) && !InventoryAllow(C, ["NotKneeling", "NotMounted", "NotChained", "NotSuspended"], true)) { DialogExtendedMessage = DialogText; return; }

	// Sets the new pose with it's effects
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
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
			InventoryWear(C, "SuspensionChains", "ItemHidden", DialogFocusItem.Color);
		}
	}
	else return;
	
	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}
	CharacterRefresh(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		ChatRoomCharacterUpdate(C);
		var msg = "ArmsChainSet" + ((NewType) ? NewType : "BoxTie");
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "ChainBondage" + ((NewType) ? NewType : "BoxTie"), "ItemArms");
			C.FocusGroup = null;
		}
	}

}