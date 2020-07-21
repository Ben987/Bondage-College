"use strict";

const TightJacketStrapsArmsOptions = [
	{
		Name: "BasicStraps",
		Property: { Type: null, Difficulty: 1 },
    },
    {
		Name: "DoubleStraps",
		Property: { Type: "DoubleStraps", Difficulty: 1 },
    },
    {
		Name: "BasicStrapCrotch",
		Property: { Type: "BasicStrapCrotch", Difficulty: 1 },
    },
    {
		Name: "DoubleStrapsCrotch",
		Property: { Type: "DoubleStrapsCrotch", Difficulty: 1 },
    },
    {
		Name: "ThinStraps",
		Property: { Type: "ThinStraps", Difficulty: 1 },
    },
    {
		Name: "ThinDoubleStraps",
		Property: { Type: "ThinDoubleStraps", Difficulty: 1 },
    },
    {
		Name: "FullBasicStraps",
		Property: { Type: "FullBasicStrap",  Difficulty: 3 },
    },
    {
		Name: "FullDoubleStraps",
		Property: { Type: "FullDoubleStraps", Difficulty: 3 },
    },
    
];

var TightJacketStrapsArmsOptionOffset = 0;

// Loads the item extension properties
function InventoryItemAddonTightJacketStrapsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = TightJacketStrapsArmsOptions[0].Property;
	DialogExtendedMessage = DialogFind(Player, "SelectJacketPrep");
	TightJacketStrapsArmsOptionOffset = 0;
}

// Draw the item extension screen
function InventoryItemAddonTightJacketStrapsDraw() {

	// Draw the header and item
	DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 310, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");
	
	// Draw the possible positions and their requirements, 4 at a time in a 2x2 grid
	for (var I = TightJacketStrapsArmsOptionOffset; (I < TightJacketStrapsArmsOptions.length) && (I < TightJacketStrapsArmsOptionOffset + 4); I++) {
		var offset = I - TightJacketStrapsArmsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);
		var FailSkillCheck = (TightJacketStrapsArmsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < TightJacketStrapsArmsOptions[I].RequiredBondageLevel);

		DrawText(DialogFind(Player, "JacketStrapPrep" + TightJacketStrapsArmsOptions[I].Name), X + 113, Y - 20, "white", "gray");
		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == TightJacketStrapsArmsOptions[I].Property.Type)) ? "#888888" : FailSkillCheck ? "Pink" : "White");
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + TightJacketStrapsArmsOptions[I].Name + ".png", X, Y + 1);
	}
}

// Catches the item extension clicks
function InventoryItemAddonTightJacketStrapsClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) TightJacketStrapsArmsOptionOffset += 4;
	if (TightJacketStrapsArmsOptionOffset >= TightJacketStrapsArmsOptions.length) TightJacketStrapsArmsOptionOffset = 0;

	// Item buttons
	for (var I = TightJacketStrapsArmsOptionOffset; (I < TightJacketStrapsArmsOptions.length) && (I < TightJacketStrapsArmsOptionOffset + 4); I++) {
		var offset = I - TightJacketStrapsArmsOptionOffset;
		var X = 1200 + (offset % 2 * 387);
		var Y = 450 + (Math.floor(offset / 2) * 300);

		if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 225) && (DialogFocusItem.Property.Type != TightJacketStrapsArmsOptions[I].Property.Type))
			if (TightJacketStrapsArmsOptions[I].RequiredBondageLevel != null && SkillGetLevelReal(Player, "Bondage") < TightJacketStrapsArmsOptions[I].RequiredBondageLevel) {
				DialogExtendedMessage = DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", TightJacketStrapsArmsOptions[I].RequiredBondageLevel);
			}
			else InventoryItemAddonTightJacketStrapsSetPose(TightJacketStrapsArmsOptions[I]);
	}
}

// Sets the hemp rope pose (hogtied, suspension, etc.)
function InventoryItemAddonTightJacketStrapsSetPose(NewType) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemAddonTightJacketStrapsLoad();
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

	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}

	// Refresh the character
	ChatRoomCharacterUpdate(C);
    CharacterRefresh(C);
    
	// Sets the chatroom or NPC message
	if (CurrentScreen == "ChatRoom") {
		var msg = "JacketStrapPrepSet" + NewType.Name;
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	} else {
		DialogFocusItem = null;
		if (C.ID == 0) DialogMenuButtonBuild(C);
		else {
			C.CurrentDialog = DialogFind(C, "JacketStrapPrep" + NewType.Name, "ItemAddon");
			C.FocusGroup = null;
		}
	}

}