"use strict";

const ZiptiesLegsOptions = [
	{
		Name: "ZipLegLight",
		Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 },
	}, {
		Name: "ZipLegMedium",
		Property: { Type: "ZipLegMedium", SetPose: ["LegsClosed"], Difficulty: 2 },
	}, {
		Name: "ZipLegFull",
		Property: { Type: "ZipLegFull", SetPose: ["LegsClosed"], Difficulty: 2 },
	}, {
		Name: "ZipFrogtie",
		Property: { Type: "ZipFrogtie", SetPose: ["Kneel"], Block: ["ItemFeet"], Effect: ["ForceKneel"], Difficulty: 3 },
		Prerequisite: ["NotSuspended", "CanKneel"],
	},
];

var ZiptiesLegsOptionOffset = 0;

// Loads the item extension properties
function InventoryItemLegsZiptiesLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = ZiptiesLegsOptions[0].Property;
	DialogExtendedMessage = DialogFind(Player, "SelectZipTie");
	ZiptiesLegsOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemLegsZiptiesDraw() {

	// Draw the header and item
	DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 25, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 27, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 275, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 335, "white", "gray");
	
	// Draw the possible positions and their requirements
	for (var I = ZiptiesLegsOptionOffset; (I < ZiptiesLegsOptions.length) && (I < ZiptiesLegsOptionOffset + 4); I++) {
		var offset = I - ZiptiesLegsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 420 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (ZiptiesLegsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < ZiptiesLegsOptions[I].RequiredBondageLevel);
		var RequirementText = ZiptiesLegsOptions[I].RequiredBondageLevel ? DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", ZiptiesLegsOptions[I].RequiredBondageLevel) : DialogFind(Player, "NoRequirement");
			
		DrawText(DialogFind(Player, "ZipBondage" + ZiptiesLegsOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawText(RequirementText, X + 113, Y + 245, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == ZiptiesLegsOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + ZiptiesLegsOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemLegsZiptiesClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	
	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) ZiptiesLegsOptionOffset += 4;
	if (ZiptiesLegsOptionOffset >= ZiptiesLegsOptions.length) ZiptiesLegsOptionOffset = 0;

	// Item buttons
	for (var I = ZiptiesLegsOptionOffset; (I < ZiptiesLegsOptions.length) && (I < ZiptiesLegsOptionOffset + 4); I++) {
		var offset = I - ZiptiesLegsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 420 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != ZiptiesLegsOptions[I].Property.Type))
			if (ZiptiesLegsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < ZiptiesLegsOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", ZiptiesLegsOptions[I].RequiredBondageLevel);
			}
			else if (!InventoryAllow(C, ZiptiesLegsOptions[I].Prerequisite, true)) {
				DialogExtendedMessage = DialogText;
			} else { 
				InventoryItemLegsZiptiesSetPose(ZiptiesLegsOptions[I]);
			}
	}
}

// Sets the rope bondage position (Basic, Mermaid, FullBinding)
function InventoryItemLegsZiptiesSetPose(NewType) {

	// Loads the character and item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemLegsZiptiesLoad();
	}

	// Sets the position & difficulty
	DialogFocusItem.Property = NewType.Property;
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "ZipLegRopeSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "ZipBondage" + NewType.Name, "ItemLegs");
			C.FocusGroup = null;
		}
	}

}