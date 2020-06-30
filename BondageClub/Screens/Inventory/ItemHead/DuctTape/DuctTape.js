"use strict";

// Loads the item extension properties
function InventoryItemHeadDuctTapeLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: ["BlindNormal", "Prone"] };
}

// Draw the item extension screen
function InventoryItemHeadDuctTapeDraw() {
	
	// Draw the header and item
	DrawRect(1387, 100, 225, 275, "white");
	DrawText(DialogFind(Player, "SelectBlindType"), 1500, 50, "white", "gray");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 102, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 350, 221, "black");

	// Draw the possible Blindfold types
	DrawButton(1000, 450, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Double") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Double.png", 1000, 449);
	DrawText(DialogFind(Player, "DuctTapeHeadTypeDouble"), 1113, 425, "white", "gray");
	DrawButton(1375, 450, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Wrap")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Wrap.png", 1375, 449);
	DrawText(DialogFind(Player, "DuctTapeHeadTypeWrap"), 1488, 425, "white", "gray");
	DrawButton(1750, 450, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "Mummy")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Mummy.png", 1750, 449);
	DrawText(DialogFind(Player, "DuctTapeHeadTypeMummy"), 1863, 425, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemHeadDuctTapeClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 450) && (MouseY <= 675) && (DialogFocusItem.Property.Type != null)) InventoryItemHeadDuctTapeSetType(null);
	if ((MouseX >= 1375) && (MouseX <= 1600) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Wrap"))) InventoryItemHeadDuctTapeSetType("Wrap");
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "Mummy"))) InventoryItemHeadDuctTapeSetType("Mummy");
}

// Sets the Blindfold type (Double, wrap, Mummy)
function InventoryItemHeadDuctTapeSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemHeadDuctTapeLoad();
	}
	DialogFocusItem.Property.Type = NewType;
	if (NewType == null) {
        DialogFocusItem.Property.Hide = [];
	    DialogFocusItem.Property.Effect = ["BlindNormal", "Prone"];
		DialogFocusItem.Property.Block = [];
	}
	else if (NewType == "Wrap") {
        DialogFocusItem.Property.Hide = [];
	    DialogFocusItem.Property.Effect = ["BlindNormal", "Prone"];
		DialogFocusItem.Property.Block = [];
	}
	else if (NewType == "Mummy") {
        DialogFocusItem.Property.Hide = ["HairFront", "HairBack"];
	    DialogFocusItem.Property.Effect = ["GagNormal", "BlindNormal", "Prone", "BlockMouth"];
		DialogFocusItem.Property.Block = ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"];
	}

	// Update the character and chatroom
	CharacterRefresh(C);
	var msg = "DuctTapeHeadSet" + ((NewType) ? NewType : "Double");
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}
