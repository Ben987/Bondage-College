"use strict";

const HempRopeLegsOptions = [
	{
		Name: "Basic",
		RequiredBondageLevel: null,
		Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 },
	}, {
		Name: "FullBinding",
		RequiredBondageLevel: 2,
		Property: { Type: "FullBinding", SetPose: ["LegsClosed"], Difficulty: 2 },
	}, {
		Name: "Link",
		RequiredBondageLevel: 2,
		Property: { Type: "Link", SetPose: ["LegsClosed"], Difficulty: 2 },
	}, {
		Name: "Frogtie",
		RequiredBondageLevel: 3,
		Property: { Type: "Frogtie", SetPose: ["Kneel"], Block: ["ItemFeet"], Effect: ["ForceKneel"], Difficulty: 3 },
		Prerequisite: ["NotSuspended", "CanKneel"],
	}, {
		Name: "Crossed",
		RequiredBondageLevel: 4,
		Property: { Type: "Crossed", SetPose: ["LegsClosed"], Difficulty: 4 },
	}, {
		Name: "Mermaid",
		RequiredBondageLevel: 4,
		Property: { Type: "Mermaid", SetPose: ["LegsClosed"], Difficulty: 4 },
	},
];

var HempRopeLegsOptionOffset = 0;

// Loads the item extension properties
function InventoryItemLegsHempRopeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = JSON.parse(JSON.stringify(HempRopeLegsOptions[0].Property));
	DialogExtendedMessage = DialogFind(Player, "SelectRopeBondage");
	HempRopeLegsOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemLegsHempRopeDraw() {

	// Draw the header and item
	DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 25, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 27, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 275, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 335, "white", "gray");
	
	// Draw the possible positions and their requirements
	for (let I = HempRopeLegsOptionOffset; (I < HempRopeLegsOptions.length) && (I < HempRopeLegsOptionOffset + 4); I++) {
		var offset = I - HempRopeLegsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 420 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (HempRopeLegsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < HempRopeLegsOptions[I].RequiredBondageLevel);
		var RequirementText = HempRopeLegsOptions[I].RequiredBondageLevel ? DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", HempRopeLegsOptions[I].RequiredBondageLevel) : DialogFind(Player, "NoRequirement");
			
		DrawText(DialogFind(Player, "RopeBondage" + HempRopeLegsOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawText(RequirementText, X + 113, Y + 245, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == HempRopeLegsOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + HempRopeLegsOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemLegsHempRopeClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	
	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) HempRopeLegsOptionOffset += 4;
	if (HempRopeLegsOptionOffset >= HempRopeLegsOptions.length) HempRopeLegsOptionOffset = 0;

	// Item buttons
	for (let I = HempRopeLegsOptionOffset; (I < HempRopeLegsOptions.length) && (I < HempRopeLegsOptionOffset + 4); I++) {
		var offset = I - HempRopeLegsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 420 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != HempRopeLegsOptions[I].Property.Type))
			if (HempRopeLegsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < HempRopeLegsOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", HempRopeLegsOptions[I].RequiredBondageLevel);
			}
			else if (!InventoryAllow(C, HempRopeLegsOptions[I].Prerequisite, true)) {
				DialogExtendedMessage = DialogText;
			} else { 
				InventoryItemLegsHempRopeSetPose(HempRopeLegsOptions[I]);
			}
	}
}

// Sets the rope bondage position (Basic, Mermaid, FullBinding)
function InventoryItemLegsHempRopeSetPose(NewType) {

	// Loads the character and item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemLegsHempRopeLoad();
	}

	// Sets the position & difficulty
	DialogFocusItem.Property = NewType.Property;
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "LegRopeSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "RopeBondage" + NewType.Name, "ItemLegs");
			C.FocusGroup = null;
		}
	}

}