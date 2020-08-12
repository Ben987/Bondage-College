"use strict";

const HempRopeFeetOptions = [
	{
		Name: "Basic",
		RequiredBondageLevel: null,
		Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 },
		FeetGround: true
	}, {
		Name: "FullBinding",
		RequiredBondageLevel: 2,
		Property: { Type: "FullBinding", SetPose: ["LegsClosed"], Difficulty: 2 },
		FeetGround: true
	}, {
		Name: "Link",
		RequiredBondageLevel: 2,
		Property: { Type: "Link", SetPose: ["LegsClosed"], Difficulty: 2 },
		FeetGround: true
	}, {
		Name: "Diamond",
		RequiredBondageLevel: 4,
		Property: { Type: "Diamond", SetPose: ["LegsClosed"], Difficulty: 4 },
		FeetGround: true
	}, {
		Name: "Mermaid",
		RequiredBondageLevel: 4,
		Property: { Type: "Mermaid", SetPose: ["LegsClosed"], Difficulty: 4 },
		FeetGround: true
	}, {
		Name: "Suspension",
		RequiredBondageLevel: 6,
		Property: { Type: "Suspension", SetPose: ["LegsClosed", "Suspension"], Difficulty: 6 },
		Expression: [{ Group: "Blush", Name: "High", Timer: 30 }],
		FeetGround: false,
		Suspension: false
	},
];

var HempRopeFeetOptionOffset = 0;

// Loads the item extension properties
function InventoryItemFeetHempRopeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = JSON.parse(JSON.stringify(HempRopeFeetOptions[0].Property));
	DialogExtendedMessage = DialogFind(Player, "SelectRopeBondage");
	HempRopeFeetOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemFeetHempRopeDraw() {

	// Draw the header and item
	DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 25, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 27, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 275, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 335, "white", "gray");
	
	// Draw the possible positions and their requirements
	for (let I = HempRopeFeetOptionOffset; (I < HempRopeFeetOptions.length) && (I < HempRopeFeetOptionOffset + 4); I++) {
		var offset = I - HempRopeFeetOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 420 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (HempRopeFeetOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < HempRopeFeetOptions[I].RequiredBondageLevel);
		var RequirementText = HempRopeFeetOptions[I].RequiredBondageLevel ? DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", HempRopeFeetOptions[I].RequiredBondageLevel) : DialogFind(Player, "NoRequirement");

		DrawText(DialogFind(Player, "RopeBondage" + HempRopeFeetOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawText(RequirementText, X + 113, Y + 245, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == HempRopeFeetOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + HempRopeFeetOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemFeetHempRopeClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) HempRopeFeetOptionOffset += 4;
	if (HempRopeFeetOptionOffset >= HempRopeFeetOptions.length) HempRopeFeetOptionOffset = 0;

	// Item buttons
	for (let I = HempRopeFeetOptionOffset; (I < HempRopeFeetOptions.length) && (I < HempRopeFeetOptionOffset + 4); I++) {
		var offset = I - HempRopeFeetOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 420 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != HempRopeFeetOptions[I].Property.Type))
			if (HempRopeFeetOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < HempRopeFeetOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", HempRopeFeetOptions[I].RequiredBondageLevel);
			}
			else InventoryItemFeetHempRopeSetPose(HempRopeFeetOptions[I]);
	}
}

// Sets the rope bondage position (Basic, Mermaid, Suspension, FullBinding)
function InventoryItemFeetHempRopeSetPose(NewType) {

	// Loads the character and item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemFeetHempRopeLoad();
	}
	
	// Validates a few parameters before suspending
	if ((NewType.FeetGround == false) && !InventoryAllow(C, ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"], true)) { DialogExtendedMessage = DialogText; return; }
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
			C.CurrentDialog = DialogFind(C, "RopeBondage" + NewType.Name, "ItemFeet");
			C.FocusGroup = null;
		}
	}

}