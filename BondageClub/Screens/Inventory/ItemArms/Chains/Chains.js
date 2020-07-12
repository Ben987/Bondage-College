"use strict";

const ChainsArmsOptions = [
	{
		Name: "BoxTie",
		RequiredBondageLevel: null,
		Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 }
	}, {
		Name: "WristTie",
		RequiredBondageLevel: null,
		Property: { Type: "WristTie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
	}, {
		Name: "ChainCuffs",
		RequiredBondageLevel: null,
		Property: { Type: "ChainCuffs", Effect: ["Block", "Prone"], SetPose: ["BackCuffs"], Difficulty: 1, OverridePriority: 30 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
	}, {
		Name: "WristElbowTie",
		RequiredBondageLevel: 2,
		Property: { Type: "WristElbowTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "WristElbowHarnessTie",
		RequiredBondageLevel: 3,
		Property: { Type: "WristElbowHarnessTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "KneelingHogtie",
		RequiredBondageLevel: 4,
		Prerequisite: ["NotMounted", "NotSuspended"],
		Property: { Type: "KneelingHogtie", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], SetPose: ["Kneel", "BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}, {
		Name: "Hogtied",
		RequiredBondageLevel: 4,
		Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "Hogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], SetPose: ["Hogtied"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}, {
		Name: "AllFours",
		RequiredBondageLevel: 6,
		Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "AllFours", Effect: ["ForceKneel"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], SetPose: ["AllFours"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}, {
		Name: "SuspensionHogtied",
		RequiredBondageLevel: 8,
		Prerequisite: ["NotMounted", "NotChained", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "SuspensionHogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied", "SuspensionHogtied"], Difficulty: 6 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		HiddenItem: "SuspensionChains"
	}
];

var ChainsArmsOptionOffset = 0;

// Loads the item extension properties
function InventoryItemArmsChainsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = ChainsArmsOptions[0].Property;
	DialogExtendedMessage = DialogFind(Player, "SelectChainBondage");
	ChainsArmsOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemArmsChainsDraw() {

	// Draw the header and item
	DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 310, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");

	// Draw the possible positions and their requirements, 4 at a time in a 2x2 grid
	for (var I = ChainsArmsOptionOffset; (I < ChainsArmsOptions.length) && (I < ChainsArmsOptionOffset + 4); I++) {
		var offset = I - ChainsArmsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (ChainsArmsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < ChainsArmsOptions[I].RequiredBondageLevel);

		DrawText(DialogFind(Player, "ChainBondage" + ChainsArmsOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == ChainsArmsOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + ChainsArmsOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemArmsChainsClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) ChainsArmsOptionOffset += 4;
	if (ChainsArmsOptionOffset >= ChainsArmsOptions.length) ChainsArmsOptionOffset = 0;

	// Item buttons
	for (var I = ChainsArmsOptionOffset; (I < ChainsArmsOptions.length) && (I < ChainsArmsOptionOffset + 4); I++) {
		var offset = I - ChainsArmsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != ChainsArmsOptions[I].Property.Type))
			if (ChainsArmsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < ChainsArmsOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", ChainsArmsOptions[I].RequiredBondageLevel);
			}
			else InventoryItemArmsChainsSetPose(ChainsArmsOptions[I]);
	}
}

// Sets the chain pose (hogtied, suspension, etc.)
function InventoryItemArmsChainsSetPose(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsChainsLoad();
	}

	// Validates the selected option
	if (NewType.Prerequisite != null && !InventoryAllow(C, NewType.Prerequisite, true)) { DialogExtendedMessage = DialogText; return; }

	// Sets the new pose with its effects only if the chains are not locked
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DialogFocusItem.Property = NewType.Property;
		if (NewType.HiddenItem != null) InventoryWear(C, NewType.HiddenItem, "ItemHidden", DialogFocusItem.Color);
		else InventoryRemove(C, "ItemHidden");
	} else {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked"); 
		return;
	}

	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}

	// Refresh the character
	ChatRoomCharacterUpdate(C);
	CharacterRefresh(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "ArmsChainSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "ChainBondage" + NewType.Name, "ItemArms");
			C.FocusGroup = null;
		}
	}

}