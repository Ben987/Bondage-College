"use strict";

const TightJacketCrotchArmsOptions = [
	{
		Name: "Basic",
		Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 1 },
    },
    {
		Name: "PulledStraps",
		Property: { Type: "PulledStraps", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 1 },
    },
    {
		Name: "LiningStraps",
		Property: { Type: "LiningStraps", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
    },
    {
		Name: "ExtraPadding",
		Property: { Type: "ExtraPadding", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
    },
    {
		Name: "PulledLining",
		Property: { Type: "PulledLining", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
    },
    {
		Name: "PulledPadding",
		Property: { Type: "PulledPadding", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
    },
    {
		Name: "PaddedLining",
		Property: { Type: "PaddedLining", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
    },
    {
		Name: "FullJacket",
		Property: { Type: "FullJacket", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 4 },
    },
    
];

var TightJacketCrotchArmsOptionOffset = 0;

// Loads the item extension properties
function InventoryItemArmsTightJacketCrotchLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = JSON.parse(JSON.stringify(TightJacketCrotchArmsOptions[0].Property));
	DialogExtendedMessage = DialogFind(Player, "SelectJacketPrep");
	TightJacketCrotchArmsOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemArmsTightJacketCrotchDraw() {

	// Draw the header and item
	DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 310, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");
	
	// Draw the possible positions and their requirements, 4 at a time in a 2x2 grid
	for (let I = TightJacketCrotchArmsOptionOffset; (I < TightJacketCrotchArmsOptions.length) && (I < TightJacketCrotchArmsOptionOffset + 4); I++) {
		var offset = I - TightJacketCrotchArmsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (TightJacketCrotchArmsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < TightJacketCrotchArmsOptions[I].RequiredBondageLevel);

		DrawText(DialogFind(Player, "JacketPrep" + TightJacketCrotchArmsOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == TightJacketCrotchArmsOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + TightJacketCrotchArmsOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemArmsTightJacketCrotchClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) TightJacketCrotchArmsOptionOffset += 4;
	if (TightJacketCrotchArmsOptionOffset >= TightJacketCrotchArmsOptions.length) TightJacketCrotchArmsOptionOffset = 0;

	// Item buttons
	for (let I = TightJacketCrotchArmsOptionOffset; (I < TightJacketCrotchArmsOptions.length) && (I < TightJacketCrotchArmsOptionOffset + 4); I++) {
		var offset = I - TightJacketCrotchArmsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != TightJacketCrotchArmsOptions[I].Property.Type))
			if (TightJacketCrotchArmsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < TightJacketCrotchArmsOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", TightJacketCrotchArmsOptions[I].RequiredBondageLevel);
			}
			else InventoryItemArmsTightJacketCrotchSetPose(TightJacketCrotchArmsOptions[I]);
	}
}

// Sets the hemp rope pose (hogtied, suspension, etc.)
function InventoryItemArmsTightJacketCrotchSetPose(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsTightJacketCrotchLoad();
	}

	// Validates the selected option
	if (NewType.Prerequisite != null && !InventoryAllow(C, NewType.Prerequisite, true)) { DialogExtendedMessage = DialogText; return; }

	// Sets the new pose with its effects only if the chains are not locked
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DialogFocusItem.Property = NewType.Property;
		if (NewType.HiddenItem != null) InventoryWear(C, NewType.HiddenItem, "ItemHidden", DialogFocusItem.Color);
		else InventoryRemove(C, "ItemHidden");
	} else {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked"); 
		return;
	}

	// Refresh the character
	ChatRoomCharacterUpdate(C);
    CharacterRefresh(C);
    
	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "JacketPrepSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "JacketPrep" + NewType.Name, "ItemArms");
			C.FocusGroup = null;
		}
	}

}