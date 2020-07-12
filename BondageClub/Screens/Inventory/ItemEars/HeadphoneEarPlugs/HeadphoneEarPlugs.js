"use strict";
var InventoryItemEarsHeadphoneEarPlugsMessage = "";

// Loads the item extension properties
function InventoryItemEarsHeadphoneEarPlugsLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	DialogFocusItem.Property.SelfUnlock = false;
}

// Draw the item extension screen
function InventoryItemEarsHeadphoneEarPlugsDraw() {
	
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible poses
	DrawText(DialogFind(Player, "HeadphoneEarPlugsSelectTightness"), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property.Restrain == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Off.png", 1000, 550);
	DrawText(DialogFind(Player, "HeadphoneEarPlugsPoseOff"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Light")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Light.png", 1250, 550);
	DrawText(DialogFind(Player, "HeadphoneEarPlugsPoseLight"), 1375, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Heavy")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Heavy.png", 1500, 550);
	DrawText(DialogFind(Player, "HeadphoneEarPlugsPoseHeavy"), 1625, 800, "white", "gray");
//	DrawButton(1750, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "Four")) ? "#888888" : "White");
//	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Four.png", 1750, 550);
//	DrawText(DialogFind(Player, "HeadphoneEarPlugsPoseFour"), 1875, 800, "white", "gray");

	// Draw the message if present
	if (InventoryItemEarsHeadphoneEarPlugsMessage != null) DrawTextWrap(DialogFind(Player, InventoryItemEarsHeadphoneEarPlugsMessage), 1100, 850, 800, 160, "White");
}

// Catches the item extension clicks
function InventoryItemEarsHeadphoneEarPlugsClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Restrain != null)) InventoryItemEarsHeadphoneEarPlugsSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Light"))) InventoryItemEarsHeadphoneEarPlugsSetPose("Light");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Heavy"))) InventoryItemEarsHeadphoneEarPlugsSetPose("Heavy");
//	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "Four"))) InventoryItemEarsHeadphoneEarPlugsSetPose("Four");
}

// Sets the cuffs pose (wrist, elbow, both or none)
function InventoryItemEarsHeadphoneEarPlugsSetPose(NewPose) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemEarsHeadphoneEarPlugsLoad();

	// Sets the new pose with it's effects
		DialogFocusItem.Property.Restrain = NewPose;
		if (NewPose == null) {
			delete DialogFocusItem.Property.Effect;
			delete DialogFocusItem.Property.Type;
		} else {
			DialogFocusItem.Property.Effect = [""];
			DialogFocusItem.Property.Type = NewPose;
			if (NewPose == "Light") DialogFocusItem.Property.Effect = ["DeafLight"];
			if (NewPose == "Heavy") DialogFocusItem.Property.Effect = ["DeafHeavy"];
//			if (NewPose == "Four") DialogFocusItem.Property.Effect = 6;
		}
	} 
	

	// Adds the lock effect back if it was padlocked
//	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
//		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
//		DialogFocusItem.Property.Effect.push("Lock");
//	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = "HeadphoneEarPlugsRestrain" + ((NewPose == null) ? "None" : NewPose);
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	Dictionary.push({Tag: "AssetName", Text: DialogFocusItem.Asset.Description.toLowerCase()});
	ChatRoomPublishCustomAction(msg, true, Dictionary);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}