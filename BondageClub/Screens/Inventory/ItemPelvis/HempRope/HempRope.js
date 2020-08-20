"use strict";

const HempRopePelvisOptions = [
	{
		Name: "Crotch",
		RequiredBondageLevel: null,
		Property: { Type: null, Difficulty: 1 },
	}, {
		Name: "SwissSeat",
		RequiredBondageLevel: 4,
		Property: { Type: "SwissSeat", Difficulty: 4 },
	}, {
		Name: "KikkouHip",
		RequiredBondageLevel: 5,
		Property: { Type: "KikkouHip", Difficulty: 5 },

	},
];

var HempRopePelvisOptionOffset = 0;

// Loads the item extension properties
function InventoryItemPelvisHempRopeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = JSON.parse(JSON.stringify(HempRopePelvisOptions[0].Property));
	DialogExtendedMessage = DialogFind(Player, "SelectRopeBondage");
	HempRopePelvisOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemPelvisHempRopeDraw() {

	// Draw the header and item
	DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 475, "white", "gray");
	
	// Draw the possible positions and their requirements
	for (let I = HempRopePelvisOptionOffset; (I < HempRopePelvisOptions.length) && (I < HempRopePelvisOptionOffset + 2); I++) {
		var offset = I - HempRopePelvisOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 550 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (HempRopePelvisOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < HempRopePelvisOptions[I].RequiredBondageLevel);
		var RequirementText = HempRopePelvisOptions[I].RequiredBondageLevel ? DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", HempRopePelvisOptions[I].RequiredBondageLevel) : DialogFind(Player, "NoRequirement");
			
		DrawText(DialogFind(Player, "RopeBondage" + HempRopePelvisOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawText(RequirementText, X + 113, Y + 250, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == HempRopePelvisOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + HempRopePelvisOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemPelvisHempRopeClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) HempRopePelvisOptionOffset += 2;
	if (HempRopePelvisOptionOffset >= HempRopePelvisOptions.length) HempRopePelvisOptionOffset = 0;

	// Item buttons
	for (let I = HempRopePelvisOptionOffset; (I < HempRopePelvisOptions.length) && (I < HempRopePelvisOptionOffset + 2); I++) {
		var offset = I - HempRopePelvisOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 550 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != HempRopePelvisOptions[I].Property.Type))
			if (HempRopePelvisOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < HempRopePelvisOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", HempRopePelvisOptions[I].RequiredBondageLevel);
			}
			else InventoryItemPelvisHempRopeSetPose(HempRopePelvisOptions[I]);
	}
}

// Sets the rope bondage position (Basic, Mermaid, FullBinding)
function InventoryItemPelvisHempRopeSetPose(NewType) {

	// Loads the character and item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemPelvisHempRopeLoad();
	}

	// Sets the position & difficulty
	DialogFocusItem.Property = NewType.Property;
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "PelvisRopeSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "RopeBondage" + NewType.Name, "ItemPelvis");
			C.FocusGroup = null;
		}
	}

}