"use strict";

const ZiptiesArmsOptions = [
	{
		Name: "ZipLight",
		Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 1 }
	}, {
		Name: "ZipMedium",
		Property: { Type: "ZipMedium", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
	}, {
		Name: "ZipFull",
		Property: { Type: "ZipFull", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
	}, {
		Name: "ZipElbowWrist",
		Property: { Type: "ZipElbowWrist", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 1 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "ZipWristLight",
		Property: { Type: "ZipWristLight", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
    }, {
		Name: "ZipWristMedium",
		Property: { Type: "ZipWristMedium", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
    }, {
		Name: "ZipWristFull",
		Property: { Type: "ZipWristFull", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
    }, {
		Name: "ZipWrist",
		Property: { Type: "ZipWrist", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
	}, {
		Name: "ZipKneelingHogtie",
		Prerequisite: ["NotMounted", "NotSuspended"],
		Property: { Type: "ZipKneelingHogtie", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], SetPose: ["Kneel", "BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}, {
		Name: "ZipHogtie",
		Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "ZipHogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], SetPose: ["Hogtied"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}, {
		Name: "ZipAllFours",
		Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
		Property: { Type: "ZipAllFours", Effect: ["ForceKneel"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], SetPose: ["AllFours"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }]
	}
];

var ZiptiesArmsOptionOffset = 0;

// Loads the item extension properties
function InventoryItemArmsZiptiesLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = ZiptiesArmsOptions[0].Property;
	DialogExtendedMessage = DialogFind(Player, "SelectZipTie");
	ZiptiesArmsOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemArmsZiptiesDraw() {

	// Draw the header and item
	DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 310, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");
	
	// Draw the possible positions and their requirements, 4 at a time in a 2x2 grid
	for (var I = ZiptiesArmsOptionOffset; (I < ZiptiesArmsOptions.length) && (I < ZiptiesArmsOptionOffset + 4); I++) {
		var offset = I - ZiptiesArmsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (ZiptiesArmsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < ZiptiesArmsOptions[I].RequiredBondageLevel);

		DrawText(DialogFind(Player, "ZipBondage" + ZiptiesArmsOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawButton(X, Y, 225, 227, "", ((DialogFocusItem.Property.Type == ZiptiesArmsOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + ZiptiesArmsOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemArmsZiptiesClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) ZiptiesArmsOptionOffset += 4;
	if (ZiptiesArmsOptionOffset >= ZiptiesArmsOptions.length) ZiptiesArmsOptionOffset = 0;

	// Item buttons
	for (var I = ZiptiesArmsOptionOffset; (I < ZiptiesArmsOptions.length) && (I < ZiptiesArmsOptionOffset + 4); I++) {
		var offset = I - ZiptiesArmsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 227) && (DialogFocusItem.Property.Type != ZiptiesArmsOptions[I].Property.Type))
			if (ZiptiesArmsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < ZiptiesArmsOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", ZiptiesArmsOptions[I].RequiredBondageLevel);
			}
			else InventoryItemArmsZiptiesSetPose(ZiptiesArmsOptions[I]);
	}
}

// Sets the hemp rope pose (hogtied, suspension, etc.)
function InventoryItemArmsZiptiesSetPose(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsZiptiesLoad();
	}

	// Validates the selected option
	if (NewType.Prerequisite != null && !InventoryAllow(C, NewType.Prerequisite, true)) { DialogExtendedMessage = DialogText; return; }

	// Sets the new pose with its effects and the hidden items if we need to
	DialogFocusItem.Property = NewType.Property;
	if (NewType.HiddenItem != null) InventoryWear(C, NewType.HiddenItem, "ItemHidden", DialogFocusItem.Color);
	else InventoryRemove(C, "ItemHidden");
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "ZipArmsSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "Zip" + NewType.Name, "ItemArms");
			C.FocusGroup = null;
		}
	}

}