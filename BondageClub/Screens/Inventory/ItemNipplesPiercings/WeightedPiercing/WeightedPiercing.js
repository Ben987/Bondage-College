"use strict";
var InventoryItemNipplesPiercingsWeightedPiercingMessage = "SelectPiercingState";

// Loads the item extension properties
function InventoryItemNipplesPiercingsWeightedPiercingLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	InventoryItemNipplesPiercingsWeightedPiercingMessage = "SelectPiercingState";
}

// Draw the item extension screen
function InventoryItemNipplesPiercingsWeightedPiercingDraw() {
	
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible poses
	DrawText(DialogFind(Player, InventoryItemNipplesPiercingsWeightedPiercingMessage), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Base.png", 1000, 550);
	DrawText(DialogFind(Player, "WeightedPiercingPoseBase"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Type == "Chain")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Chain.png", 1250, 550);
	DrawText(DialogFind(Player, "WeightedPiercingPoseChain"), 1375, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemNipplesPiercingsWeightedPiercingClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property != null)) InventoryItemNipplesPiercingsWeightedPiercingSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property == null) || (DialogFocusItem.Property.Type != "Chain"))) InventoryItemNipplesPiercingsWeightedPiercingSetPose("Chain");
}

// Sets the piercing type (chain requires a collar)
function InventoryItemNipplesPiercingsWeightedPiercingSetPose(NewPose) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((NewPose == null) || (InventoryGet(C, "ItemNeck") != null) && (InventoryGet(C, "Cloth") == null)) {
		if (CurrentScreen == "ChatRoom") {
			DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
			InventoryItemNipplesPiercingsWeightedPiercingLoad();
		}
		if (NewPose == null) delete DialogFocusItem.Property;
		else {
			DialogFocusItem.Property.Restrain = NewPose;
			DialogFocusItem.Property.Type = NewPose;
			if (NewPose == "Chain") DialogFocusItem.Property.Hide = [""];
		}
		CharacterRefresh(C);
		var msg = "WeightedPiercingRestrain" + ((NewPose == null) ? "Base" : NewPose);
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		ChatRoomPublishCustomAction(msg, true, Dictionary);
		if (DialogInventory != null) {
			DialogFocusItem = null;
			DialogMenuButtonBuild(C);
		}
	} else InventoryItemNipplesPiercingsWeightedPiercingMessage = "NoClothAndCollared";
}