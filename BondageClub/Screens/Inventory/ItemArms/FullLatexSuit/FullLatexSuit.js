"use strict";

// Loads the item extension properties
function InventoryItemArmsFullLatexSuitLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
	if (DialogFocusItem.Property.Block == null) DialogFocusItem.Property.Block = DialogFocusItem.Property.Type ? [] : ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"];
}

// Draw the item extension screen
function InventoryItemArmsFullLatexSuitDraw() {

	// Draw the item image and top controls
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DrawRect(1387, 125, 225, 275, "white");
	DrawText(DialogFind(Player, "SelectSuitType"), 1500, 50, "white", "gray");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the suits options
	DrawButton(1150, 440, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Latex") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Latex.png", 1150, 439);
	DrawText(DialogFind(Player, "FullLatexSuitTypeZipped"), 1263, 425, "white", "gray");
	DrawButton(1600, 440, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "UnZip")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/UnZip.png", 1600, 439);
	DrawText(DialogFind(Player, "FullLatexSuitTypeUnZip"), 1713, 425, "white", "gray");
	if (InventoryGet(C, "ItemVulvaPiercings") == null ||
		!InventoryGet(C, "ItemVulvaPiercings").Asset ||
		!InventoryGet(C, "ItemVulvaPiercings").Asset.Effect ||
		InventoryGet(C, "ItemVulvaPiercings").Asset.Effect.indexOf("Chaste") == -1)
		if (InventoryGet(((Player.FocusGroup != null) ? Player : CurrentCharacter), "ItemVulva") == null) {
			DrawButton(1375, 750, 225, 225, "", (InventoryGet(C, "ItemVulva") == null) ? "White" : "White");
			DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Wand.png", 1375, 749);
			DrawText(DialogFind(Player, "FullLatexSuitTypeWand"), 1488, 725, "white", "gray");
		} else
			DrawText(DialogFind(Player, "CheckVulvaForWand"), 1500, 690, "white", "gray");

}

// Catches the item extension clicks
function InventoryItemArmsFullLatexSuitClick() {
	if (MouseIn(1885, 25, 90, 90)) DialogFocusItem = null;
	if ((MouseX >= 1150) && (MouseX <= 1375) && (MouseY >= 440) && (MouseY <= 665) && (DialogFocusItem.Property.Type != null)) InventoryItemArmsFullLatexSuitSetType(null);
	if ((MouseX >= 1600) && (MouseX <= 1825) && (MouseY >= 440) && (MouseY <= 665) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "UnZip"))) InventoryItemArmsFullLatexSuitSetType("UnZip");
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (MouseIn(1375, 750, 225, 225) && InventoryGet(C, "ItemVulva") == null) InventoryItemArmsFullLatexSuitSetType("Wand");
}

// Sets the suit properties when it's model changes
function InventoryItemArmsFullLatexSuitSetType(NewType) {

	// Sets the type, blocking zones and wand
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsFullLatexSuitLoad();
	}
	if (NewType == null || NewType == "UnZip") DialogFocusItem.Property.Type = NewType;
	if (NewType == null) DialogFocusItem.Property.Block = ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"];
	else if (NewType == "UnZip") DialogFocusItem.Property.Block = [];
	if (NewType == "Wand") InventoryWear(C, "FullLatexSuitWand", "ItemVulva");
	CharacterRefresh(C);

	// Pushes the change to the chatroom
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