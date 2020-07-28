"use strict";

// Loads the item extension properties
function InventoryItemMouthCupholderGagLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = {};
}

// Draw the item extension screen
function InventoryItemMouthCupholderGagDraw() {

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
	
	DrawText(DialogFind(Player, "CupholderGagOptions"), 1500, 500, "white", "gray");
	DrawButton(1200, 650, 200, 55, DialogFind(Player, "CupholderGagTipOverCup"), DialogFocusItem.Property.Type == "Cup" ? "White" : "#888888");
	DrawButton(1550, 650, 200, 55, DialogFind(Player, "CupholderGagRemoveCup"), Player.CanInteract() && DialogFocusItem.Property.Type == "Cup" ? "White" : "#888888");
	DrawButton(1375, 710, 200, 55, DialogFind(Player, "CupholderGagPlaceCup"), Player.CanInteract() && !DialogFocusItem.Property.Type ? "White" : "#888888");

}

// Catches the item extension clicks
function InventoryItemMouthCupholderGagClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1325) && (MouseX <= 1389) && (MouseY >= 800) && (MouseY <= 864) && (CurrentScreen == "ChatRoom")) {
		DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
		DialogLeave();
	}
	
	// Click mode depending on who interacts
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Type == "Cup")) InventoryItemMouthCupholderGagSetType("Tip");
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (Player.CanInteract() && DialogFocusItem.Property.Type == "Cup")) InventoryItemMouthCupholderGagSetType("");
	if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 710) && (MouseY <= 765) && (Player.CanInteract() && !DialogFocusItem.Property.Type)) InventoryItemMouthCupholderGagSetType("Cup");

}

// Sets the gag type (small, cleave, otm, otn)
function InventoryItemMouthCupholderGagSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemMouthCupholderGagLoad();
	}
	
	DialogFocusItem.Property.Type = NewType != "Tip" ? NewType : "";

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = "CupholderGagSet" + ((NewType) ? NewType : "NoCup");
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}
