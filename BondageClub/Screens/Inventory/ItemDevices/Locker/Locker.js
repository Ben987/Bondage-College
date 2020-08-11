"use strict";

const LockerDevicesOptions = [
	{
		Name: "Seethrough",
		Property: { Type: null}
	}, {
		Name: "Opaque",
		Property: { Type: "Opaque"}
    }
];

var LockerDevicesOptionOffset = 0;

// Loads the item extension properties
function InventoryItemDevicesLockerLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = JSON.parse(JSON.stringify(LockerDevicesOptions[0].Property));
	DialogExtendedMessage = DialogFind(Player, "SelectLockerState");
	LockerDevicesOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemDevicesLockerDraw() {

	// Draw the header and item
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 310, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");
	
	// Draw the possible positions and their requirements, 4 at a time in a 2x2 grid
	for (let I = LockerDevicesOptionOffset; (I < LockerDevicesOptions.length) && (I < LockerDevicesOptionOffset + 4); I++) {
		var offset = I - LockerDevicesOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (LockerDevicesOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < LockerDevicesOptions[I].RequiredBondageLevel);

		DrawText(DialogFind(Player, "LockerState" + LockerDevicesOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == LockerDevicesOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + LockerDevicesOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemDevicesLockerClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) LockerDevicesOptionOffset += 4;
	if (LockerDevicesOptionOffset >= LockerDevicesOptions.length) LockerDevicesOptionOffset = 0;

	// Item buttons
	for (let I = LockerDevicesOptionOffset; (I < LockerDevicesOptions.length) && (I < LockerDevicesOptionOffset + 4); I++) {
		var offset = I - LockerDevicesOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != LockerDevicesOptions[I].Property.Type))
			if (LockerDevicesOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < LockerDevicesOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", LockerDevicesOptions[I].RequiredBondageLevel);
			}
			else InventoryItemDevicesLockerSetPose(LockerDevicesOptions[I]);
	}
}

// Sets the locker state (Seethrough, Opaque)
function InventoryItemDevicesLockerSetPose(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemDevicesLockerLoad();
	}

	// Validates the selected option
	if (NewType.Prerequisite != null && !InventoryAllow(C, NewType.Prerequisite, true)) { DialogExtendedMessage = DialogText; return; }

	// Sets the new pose with its effects and the hidden items if we need to
	DialogFocusItem.Property.Type = NewType.Property.Type;
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "DevicesLockerSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "LockerState" + NewType.Name, "ItemDevices");
			C.FocusGroup = null;
		}
	}

}
