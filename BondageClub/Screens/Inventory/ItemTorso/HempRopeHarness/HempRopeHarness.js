"use strict";

const HempRopeTorsoOptions = [
	{
		Name: "Crotch",
		RequiredBondageLevel: null,
		Property: { Type: null, Difficulty: 1 },
	}, {
		Name: "Waist",
		RequiredBondageLevel: null,
		Property: { Type: "Waist" , Difficulty: 1 },
	}, {
		Name: "Harness",
		RequiredBondageLevel: 2,
		Property: { Type: "Harness" , Difficulty: 1 },
	}, {
		Name: "Star",
		RequiredBondageLevel: 3,
		Property: { Type: "Star" , Difficulty: 2 },
	}, {
		Name: "Diamond",
		RequiredBondageLevel: 4,
		Property: { Type: "Diamond" , Difficulty: 3 },
		
	}
];

var HempRopeTorsoOptionOffset = 0;

// Loads the item extension properties
function InventoryItemTorsoHempRopeHarnessLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = JSON.parse(JSON.stringify(HempRopeTorsoOptions[0].Property));
	DialogExtendedMessage = DialogFind(Player, "SelectRopeBondage");
	HempRopeTorsoOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemTorsoHempRopeHarnessDraw() {

	// Draw the header and item
	DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 310, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");
	
	// Draw the possible positions and their requirements, 4 at a time in a 2x2 grid
	for (let I = HempRopeTorsoOptionOffset; (I < HempRopeTorsoOptions.length) && (I < HempRopeTorsoOptionOffset + 4); I++) {
		var offset = I - HempRopeTorsoOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (HempRopeTorsoOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < HempRopeTorsoOptions[I].RequiredBondageLevel);

		DrawText(DialogFind(Player, "RopeBondage" + HempRopeTorsoOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == HempRopeTorsoOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + HempRopeTorsoOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemTorsoHempRopeHarnessClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) HempRopeTorsoOptionOffset += 4;
	if (HempRopeTorsoOptionOffset >= HempRopeTorsoOptions.length) HempRopeTorsoOptionOffset = 0;

	// Item buttons
	for (let I = HempRopeTorsoOptionOffset; (I < HempRopeTorsoOptions.length) && (I < HempRopeTorsoOptionOffset + 4); I++) {
		var offset = I - HempRopeTorsoOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != HempRopeTorsoOptions[I].Property.Type))
			if (HempRopeTorsoOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < HempRopeTorsoOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", HempRopeTorsoOptions[I].RequiredBondageLevel);
			}
			else InventoryItemTorsoHempRopeSetPose(HempRopeTorsoOptions[I]);
	}
}

// Sets the hemp rope pose (hogtied, suspension, etc.)
function InventoryItemTorsoHempRopeSetPose(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemTorsoHempRopeHarnessLoad();
	}

	// Validates a few parameters before hogtied
	// if ((NewType.TorsoOnly == false) && !InventoryAllow(C, ["NotKneeling", "NotMounted", "NotChained", "NotSuspended", "CannotBeHogtiedWithAlphaHood"], true)) { DialogExtendedMessage = DialogText; return; }

	// Sets the new pose with its effects
	DialogFocusItem.Property = NewType.Property;
	if (NewType.Expression != null)
		for (let E = 0; E < NewType.Expression.length; E++)
			CharacterSetFacialExpression(C, NewType.Expression[E].Group, NewType.Expression[E].Name, NewType.Expression[E].Timer);
	if (NewType.HiddenItem != null) InventoryWear(C, NewType.HiddenItem, "ItemHidden", DialogFocusItem.Color);
	else InventoryRemove(C, "ItemHidden");
	CharacterRefresh(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "RopeHarnessSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "RopeBondage" + NewType.Name, "ItemTorso");
			C.FocusGroup = null;
		}
	}

}
