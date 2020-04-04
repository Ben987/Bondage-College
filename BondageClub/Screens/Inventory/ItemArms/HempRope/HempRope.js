"use strict";

const HempRopeOptions = [
	{
		Name: "BoxTie",
		RequiredBondageLevel: null,
		Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 0 },
		ArmsOnly: true
	}, {
		Name: "Hogtied",
		RequiredBondageLevel: 4,
		Property: { Type: "Hogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied"], Difficulty: 2 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		ArmsOnly: false
	}, {
		Name: "AllFours",
		RequiredBondageLevel: 4,
		Property: { Type: "AllFours", Effect: ["ForceKneel"], Block: ["ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["AllFours"], Difficulty: 6 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		ArmsOnly: false
	}, {
		Name: "SuspensionHogtied",
		RequiredBondageLevel: 8,
		Property: { Type: "SuspensionHogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied", "SuspensionHogtied"], Difficulty: 2 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		ArmsOnly: false,
		HiddenItem: "SuspensionHempRope"
	}, {
		Name: "WristTie",
		RequiredBondageLevel: 1,
		Property: { Type: "WristTie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }],
		ArmsOnly: true
	}, {
		Name: "WristElbowTie",
		RequiredBondageLevel: 3,
		Property: { Type: "WristElbowTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }],
		ArmsOnly: true
	}
];

var HempRopeOptionOffset = 0;

// Loads the item extension properties
function InventoryItemArmsHempRopeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = HempRopeOptions[0].Property;
	DialogExtendedMessage = DialogFind(Player, "SelectRopeBondage");
	HempRopeOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemArmsHempRopeDraw() {

	// Draw the header and item
	DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 310, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");
	
	// Draw the possible positions and their requirements, 4 at a time in a 2x2 grid
	for (var I = HempRopeOptionOffset; (I < HempRopeOptions.length) && (I < HempRopeOptionOffset + 4); I++) {
		var offset = I - HempRopeOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (HempRopeOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < HempRopeOptions[I].RequiredBondageLevel);

		DrawText(DialogFind(Player, "RopeBondage" + HempRopeOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == HempRopeOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + HempRopeOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemArmsHempRopeClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) HempRopeOptionOffset += 4;
	if (HempRopeOptionOffset > HempRopeOptions.length) HempRopeOptionOffset = 0;

	// Item buttons
	for (var I = HempRopeOptionOffset; (I < HempRopeOptions.length) && (I < HempRopeOptionOffset + 4); I++) {
		var offset = I - HempRopeOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != HempRopeOptions[I].Property.Type))
			if (HempRopeOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < HempRopeOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", HempRopeOptions[I].RequiredBondageLevel);
			}
			else InventoryItemArmsHempRopeSetPose(HempRopeOptions[I]);
	}
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
	if ((NewType.ArmsOnly == false) && !InventoryAllow(C, ["NotKneeling", "NotMounted", "NotChained", "NotSuspended", "CannotBeHogtiedWithAlphaHood"], true)) { DialogExtendedMessage = DialogText; return; }

	// Sets the new pose with its effects
	DialogFocusItem.Property = NewType.Property;
	if (NewType.Expression != null)
		for (var E = 0; E < NewType.Expression.length; E++)
			CharacterSetFacialExpression(C, NewType.Expression[E].Group, NewType.Expression[E].Name, NewType.Expression[E].Timer);

	if (NewType.HiddenItem != null) {
		InventoryWear(C, NewType.HiddenItem, "ItemHidden", DialogFocusItem.Color);
	}
	else InventoryRemove(C, "ItemHidden");

	CharacterRefresh(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		ChatRoomCharacterUpdate(C);
		var msg = "ArmsRopeSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "RopeBondage" + NewType.Name, "ItemArms");
			C.FocusGroup = null;
		}
	}

}