"use strict";

var InventoryItemArmsFullLatexSuitMsg = null;

// Loads the item extension properties
function InventoryItemArmsFullLatexSuitLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	var addonItem = InventoryGet(C, "ItemAddon");
	if (addonItem != null) {
		DialogExtendItem(addonItem);
		return;
	}
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
	InventoryItemArmsFullLatexSuitMsg = null;
}

// Draw the item extension screen
function InventoryItemArmsFullLatexSuitDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;

	DrawRect(1387, 125, 225, 275, "white");
	DrawText(DialogFind(Player, "SelectSuitType"), 1500, 50, "white", "gray");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
	
// draw suits to wear	
	DrawButton(1150, 450, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Latex") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Latex.png", 1150, 449);
	DrawText(DialogFind(Player, "FullLatexSuitTypeZipped"), 1263, 425, "white", "gray");
	DrawButton(1600, 450, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "UnZip")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/UnZip.png", 1600, 449);
	DrawText(DialogFind(Player, "FullLatexSuitTypeUnZip"), 1713, 425, "white", "gray");
	DrawButton(1375, 750, 225, 225, "", (InventoryGet(C, "ItemAddon") == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Wand.png", 1375, 749);
	DrawText(DialogFind(Player, "FullLatexSuitTypeWand"), 1488, 750, "white", "gray");
	
	if (InventoryItemArmsFullLatexSuitMsg != null) DrawTextWrap(DialogFind(Player, InventoryItemArmsFullLatexSuitMsg), 1100, 850, 800, 160, "White");
}

// Catches the item extension clicks
function InventoryItemArmsFullLatexSuitClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1150) && (MouseX <= 1400) && (MouseY >= 450) && (MouseY <= 675) && (DialogFocusItem.Property.Type != null)) InventoryItemArmsFullLatexSuitSetType(null);
	if ((MouseX >= 1600) && (MouseX <= 1825) && (MouseY >= 450) && (MouseY <= 675) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "UnZip"))) InventoryItemArmsFullLatexSuitSetType("UnZip");
		var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CommonIsClickAt(1375, 750, 225, 225) && InventoryGet(C, "ItemAddon") == null) InventoryItemArmsFullLatexSuitSetType("Wand");
}

function InventoryItemArmsFullLatexSuitSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsFullLatexSuitLoad();
	}
	if(NewType == null || NewType == "UnZip")
		DialogFocusItem.Property.Type = NewType;
	
	if (NewType == null) {
		DialogFocusItem.Property.Block = ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"];
	}
	else if (NewType == "UnZip") {
		DialogFocusItem.Property.Block = [];
	}

	if(InventoryGet(C, "ItemAddon") != null){
		//InventoryItemArmsFullLatexSuitMsg = "ALREADY_OCCUPIED";
		return;
	}
	
	if (NewType == "Wand") {
		InventoryWear(C, "FullLatexSuitWand", "ItemAddon");

		// Switch to the wand item
		DialogFocusItem = InventoryGet(C, "ItemAddon");
	}
	
	CharacterRefresh(C);
	var msg = "FullLatexSuitSet" + ((NewType) ? NewType : "Zipped");
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}

