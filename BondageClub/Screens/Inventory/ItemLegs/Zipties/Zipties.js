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
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = JSON.parse(JSON.stringify(ZiptiesLegsOptions[0].Property));
	DialogExtendedMessage = DialogFind(Player, "SelectZipTie");
	ZiptiesLegsOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemLegsZiptiesDraw() {

	// Draw the header and item
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 310, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");
	
	// Draw the possible positions and their requirements, 4 at a time in a 2x2 grid
	for (let I = ZiptiesLegsOptionOffset; (I < ZiptiesLegsOptions.length) && (I < ZiptiesLegsOptionOffset + 4); I++) {
		var offset = I - ZiptiesLegsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (ZiptiesLegsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < ZiptiesLegsOptions[I].RequiredBondageLevel);

		DrawText(DialogFind(Player, "ZipBondage" + ZiptiesLegsOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == ZiptiesLegsOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + ZiptiesLegsOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemLegsZiptiesClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) ZiptiesLegsOptionOffset += 4;
	if (ZiptiesLegsOptionOffset >= ZiptiesLegsOptions.length) ZiptiesLegsOptionOffset = 0;

	// Item buttons
	for (let I = ZiptiesLegsOptionOffset; (I < ZiptiesLegsOptions.length) && (I < ZiptiesLegsOptionOffset + 4); I++) {
		var offset = I - ZiptiesLegsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != ZiptiesLegsOptions[I].Property.Type))
			if (ZiptiesLegsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < ZiptiesLegsOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", ZiptiesLegsOptions[I].RequiredBondageLevel);
			}
			else InventoryItemLegsZiptiesSetPose(ZiptiesLegsOptions[I]);
	}
}

// Sets the hemp rope pose (hogtied, suspension, etc.)
function InventoryItemLegsZiptiesSetPose(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemLegsZiptiesLoad();
	}

	// Validates a few parameters before hogtied
	if ((NewType.Name == "AllFours") && !InventoryAllow(C, ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"], true)) { DialogExtendedMessage = DialogText; return; }
	if ((NewType.Name == "Hogtied") && !InventoryAllow(C, ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"], true)) { DialogExtendedMessage = DialogText; return; }
	if ((NewType.Name == "SuspensionHogtied") && !InventoryAllow(C, ["NotMounted", "NotChained", "NotSuspended", "CannotBeHogtiedWithAlphaHood"], true)) { DialogExtendedMessage = DialogText; return; }

	// Sets the new pose with its effects and the hidden items if we need to
	DialogFocusItem.Property = NewType.Property;
	if (NewType.HiddenItem != null) InventoryWear(C, NewType.HiddenItem, "ItemHidden", DialogFocusItem.Color);
	else InventoryRemove(C, "ItemHidden");
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "ZipLegsSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "Zip" + NewType.Name, "ItemLegs");
			C.FocusGroup = null;
		}
	}

}