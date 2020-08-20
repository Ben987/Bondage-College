"use strict";

/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
function InventoryItemArmsBitchSuitLoad() {
	
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
	if (DialogFocusItem.Property.Block == null) {
		DialogFocusItem.Property.Block = DialogFocusItem.Property.Type ? [] : ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"];
		var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}
}

/**
 * Draw the item extension screen. As this function is called periodically, don't call expensive functionns from here
 * @returns {void} - Nothing
 */
function InventoryItemArmsBitchSuitDraw() {

	// Draw the item image and top controls
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DrawRect(1387, 125, 225, 275, "white");
	DrawText(DialogFind(Player, "SelectSuitType"), 1500, 50, "white", "gray");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the suits options
	DrawButton(1150, 440, 225, 225, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "Latex") ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Latex.png", 1150, 439);
	DrawText(DialogFind(Player, "BitchSuitTypeZipped"), 1263, 425, "white", "gray");
	DrawButton(1600, 440, 225, 225, "", ((DialogFocusItem.Property.Type != null) && (DialogFocusItem.Property.Type == "UnZip")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/UnZip.png", 1600, 439);
	DrawText(DialogFind(Player, "BitchSuitTypeUnZip"), 1713, 425, "white", "gray");

}

/**
 * Handles the click events. Is called from CommomnClick()
 * @returns {void} - Nothing
 */
function InventoryItemArmsBitchSuitClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1150) && (MouseX <= 1375) && (MouseY >= 440) && (MouseY <= 665) && (DialogFocusItem.Property.Type != null)) InventoryItemArmsBitchSuitSetType(null);
	if ((MouseX >= 1600) && (MouseX <= 1825) && (MouseY >= 440) && (MouseY <= 665) && ((DialogFocusItem.Property.Type == null) || (DialogFocusItem.Property.Type != "UnZip"))) InventoryItemArmsBitchSuitSetType("UnZip");
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
}

/**
 * Sets the suit properties when it's model changes
 * @param {string} NewType - The new property. Valid values are "Zipped" and "Unzip"
 * @returns {void} - Nothing
 */
function InventoryItemArmsBitchSuitSetType(NewType) {

	// Sets the type, blocking zones and wand
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemArmsBitchSuitLoad();
	}
	if (NewType == null || NewType == "UnZip") DialogFocusItem.Property.Type = NewType;
	if (NewType == null) DialogFocusItem.Property.Block = ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"];
	else if (NewType == "UnZip") DialogFocusItem.Property.Block = [];
	CharacterRefresh(C);

	// Pushes the change to the chatroom
	var msg = "BitchSuitSet" + ((NewType) ? NewType : "Zipped");
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}