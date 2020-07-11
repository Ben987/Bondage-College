"use strict";

const ZiptiesFeetOptions = [
	{
		Name: "ZipFeetLight",
		Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 },
	}, {
		Name: "ZipFeetMedium",
		Property: { Type: "ZipFeetMedium", SetPose: ["LegsClosed"], Difficulty: 2 },
	}, {
		Name: "ZipFeetFull",
		Property: { Type: "ZipFeetFull", SetPose: ["LegsClosed"], Difficulty: 2 },
	}, 
];


var ZiptiesFeetOptionOffset = 0;

// Loads the item extension properties
function InventoryItemFeetZiptiesLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = ZiptiesFeetOptions[0].Property;
	DialogExtendedMessage = DialogFind(Player, "SelectZipTie");
	ZiptiesFeetOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemFeetZiptiesDraw() {

	// Draw the header and item
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 310, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");
	
	// Draw the possible positions and their requirements, 4 at a time in a 2x2 grid
	for (var I = ZiptiesFeetOptionOffset; (I < ZiptiesFeetOptions.length) && (I < ZiptiesFeetOptionOffset + 4); I++) {
		var offset = I - ZiptiesFeetOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (ZiptiesFeetOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < ZiptiesFeetOptions[I].RequiredBondageLevel);

		DrawText(DialogFind(Player, "ZipBondage" + ZiptiesFeetOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == ZiptiesFeetOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + ZiptiesFeetOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemFeetZiptiesClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) ZiptiesFeetOptionOffset += 4;
	if (ZiptiesFeetOptionOffset >= ZiptiesFeetOptions.length) ZiptiesFeetOptionOffset = 0;

	// Item buttons
	for (var I = ZiptiesFeetOptionOffset; (I < ZiptiesFeetOptions.length) && (I < ZiptiesFeetOptionOffset + 4); I++) {
		var offset = I - ZiptiesFeetOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != ZiptiesFeetOptions[I].Property.Type))
			if (ZiptiesFeetOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < ZiptiesFeetOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", ZiptiesFeetOptions[I].RequiredBondageLevel);
			}
			else InventoryItemFeetZiptiesSetPose(ZiptiesFeetOptions[I]);
	}
}

// Sets the hemp rope pose (hogtied, suspension, etc.)
function InventoryItemFeetZiptiesSetPose(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemFeetZiptiesLoad();
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
		var msg = "ZipFeetSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "Zip" + NewType.Name, "ItemFeet");
			C.FocusGroup = null;
		}
	}

}