"use strict";
var InventoryItemButtButtPlugLockMessage = "SelectAttachmentState";

// Loads the item extension properties
function InventoryItemButtButtPlugLockLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Restrain: null };
	InventoryItemButtButtPlugLockMessage = "SelectAttachmentState";
}

// Draw the item extension screen
function InventoryItemButtButtPlugLockDraw() {
	
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible poses
	DrawText(DialogFind(Player, InventoryItemButtButtPlugLockMessage), 1500, 500, "white", "gray");
	DrawButton(1000, 550, 225, 225, "", (DialogFocusItem.Property == null) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/Base.png", 1000, 550);
	DrawText(DialogFind(Player, "ButtPlugLockPoseBase"), 1125, 800, "white", "gray");
	DrawButton(1250, 550, 225, 225, "", ((DialogFocusItem.Property != null) && (DialogFocusItem.Property.Type == "ChainShort")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/ChainShort.png", 1250, 550);
	DrawText(DialogFind(Player, "ButtPlugLockPoseChainShort"), 1375, 800, "white", "gray");
	DrawButton(1500, 550, 225, 225, "", ((DialogFocusItem.Property.Restrain != null) && (DialogFocusItem.Property.Restrain == "ChainLong")) ? "#888888" : "White");
	DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/ChainLong.png", 1500, 550);
	DrawText(DialogFind(Player, "ButtPlugLockPoseChainLong"), 1625, 800, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemButtButtPlugLockClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1000) && (MouseX <= 1225) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Restrain != null)) InventoryItemButtButtPlugLockSetPose(null);
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "ChainShort"))) InventoryItemButtButtPlugLockSetPose("ChainShort");
	if ((MouseX >= 1500) && (MouseX <= 1725) && (MouseY >= 550) && (MouseY <= 775) && ((DialogFocusItem.Property.Restrain == null) || (DialogFocusItem.Property.Restrain != "ChainLong"))) InventoryItemButtButtPlugLockSetPose("ChainLong");
}


// Sets the item pose (shorts chains, long chains or none)
function InventoryItemButtButtPlugLockSetPose(NewPose) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemButtButtPlugLockLoad();
	
	
//		if (InventoryGet(C, "Cloth") != null) {
//		InventoryItemButtButtPlugLockMessage = "RemoveClothesForItem";
//		return;
//		}

	// Sets the new pose with it's effects
		DialogFocusItem.Property.Restrain = NewPose;
		if (NewPose == null) {
			delete DialogFocusItem.Property.Effect;
			delete DialogFocusItem.Property.Type;
			delete DialogFocusItem.Property.SetPose;
			delete DialogFocusItem.Property.AllowPose;
		} else {
			DialogFocusItem.Property.Type = NewPose;
			if (NewPose == "ChainShort") DialogFocusItem.Property.Effect = ["Chaste", "Freeze", "ForceKneel"];
			if (NewPose == "ChainShort") DialogFocusItem.Property.SetPose = ["Kneel"];
//			if (NewPose == "ChainLong") delete DialogFocusItem.Property.Effect;
			if (NewPose == "ChainLong") DialogFocusItem.Property.SetPose = [""];
			if (NewPose == "ChainLong") DialogFocusItem.Property.Effect = ["Chaste", "Tethered"];
			if (NewPose == "ChainLong") DialogFocusItem.Property.AllowPose = ["Kneel", "Horse", "KneelingSpread"]
		}
		DialogFocusItem.Property.Restrain = NewPose;
	} 
	

	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = DialogFind(Player, "ButtPlugLockRestrain" + ((NewPose == null) ? "Base" : NewPose));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}