"use strict";

// Loads the item extension properties
function InventoryItemArmsChainsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: [] };
	DialogExtendedMessage = DialogFind(Player, "SelectChainBondage");
}

// Draw the item extension screen
function InventoryItemArmsChainsDraw() {

	// Draw the header and item
	DrawRect(1387, 85, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 87, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 340, 221, "black");

	// Draw the possible positions and their requirements
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DrawText(DialogExtendedMessage, 1500, 55, "white", "gray");
		DrawButton(1200, 450, 225, 225, "", (DialogFocusItem.Property.Type == null) ? "#888888" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/BoxTie.png", 1200, 451);
		DrawText(DialogFind(Player, "ChainBondageBoxTie"), 1313, 400, "white", "gray");
		DrawText(DialogFind(Player, "NoRequirement"), 1313, 430, "white", "gray");
		DrawButton(1587, 450, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Hogtied")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 4) ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Hogtied.png", 1587, 451);
		DrawText(DialogFind(Player, "ChainBondageHogtied"), 1700, 400, "white", "gray");
		DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "4"), 1700, 430, "white", "gray");
		DrawButton(1200, 750, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "AllFours")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 4) ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/AllFours.png", 1200, 751);
		DrawText(DialogFind(Player, "ChainBondageAllFours"), 1313, 705, "white", "gray");
		DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "4"), 1313, 735, "white", "gray");
		DrawButton(1587, 750, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "SuspensionHogtied")) ? "#888888" : (SkillGetLevelReal(Player, "Bondage") < 8) ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/SuspensionHogtied.png", 1587, 751);
		DrawText(DialogFind(Player, "ChainBondageSuspensionHogtied"), 1700, 705, "white", "gray");
		DrawText(DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", "8"), 1700, 735, "white", "gray");
	}
	else DrawText(DialogFind(Player, "CantChangeWhileLocked"), 1500, 500, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemArmsChainsClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1200) && (MouseX <= 1425) && (MouseY >= 450) && (MouseY <= 675) && (DialogFocusItem.Property.Type != null)) InventoryItemArmsChainsSetPose(null);
	if ((MouseX >= 1587) && (MouseX <= 1812) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Hogtied")) && (SkillGetLevelReal(Player, "Bondage") >= 4)) InventoryItemArmsChainsSetPose("Hogtied");
	if ((MouseX >= 1200) && (MouseX <= 1425) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "AllFours")) && (SkillGetLevelReal(Player, "Bondage") >= 4)) InventoryItemArmsChainsSetPose("AllFours");
	if ((MouseX >= 1587) && (MouseX <= 1812) && (MouseY >= 750) && (MouseY <= 975) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "SuspensionHogtied")) && (SkillGetLevelReal(Player, "Bondage") >= 8)) InventoryItemArmsChainsSetPose("SuspensionHogtied");
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
	if ((NewType != null) && !InventoryAllow(C, ["NotKneeling", "NotMounted", "NotChained", "NotSuspended", "CannotBeHogtiedWithAlphaHood"], true)) { DialogExtendedMessage = DialogText; return; }

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
		if (NewType == "AllFours") {
			DialogFocusItem.Property.SetPose = ["AllFours"];
			DialogFocusItem.Property.Difficulty = 2;
			CharacterSetFacialExpression(C, "Blush", "Medium", 10);
			DialogFocusItem.Property.Block = ["ItemLegs", "ItemFeet", "ItemBoots"];
			DialogFocusItem.Property.Effect = ["ForceKneel"];
			InventoryRemove(C, "ItemHidden");
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
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
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