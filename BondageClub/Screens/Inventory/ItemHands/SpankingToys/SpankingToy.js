"use strict";
const SpankingInventory = [
	{
		Name: "Crop",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }]
	},{
		Name: "Flogger",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }]
	},{
		Name: "Cane",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 },{ Group: "Eyes", Name: "Wink", Timer: 5 }]
	},{
		Name: "HeartCrop",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }]
	},{
		Name: "Paddle",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "High", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Closed", Timer: 5 }]
	},{
		Name: "WhipPaddle",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Wink", Timer: 5 }]
	}
];

var SpankingCurrentType = null;
var SpankingInventoryOffset = 0;
var SpankingNextButton = false;
var SpankingPlayerInventory;

// Loads the item extension properties
function InventoryItemHandsSpankingToysLoad() {
	SpankingPlayerInventory = SpankingInventory.filter(x => Player.Inventory.map(i => i.Name).includes("SpankingToys" + x.Name));
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = {Type: SpankingCurrentType};
	if (SpankingPlayerInventory.length > 4) SpankingNextButton = true;
}

// Item groups that called the function (just forwarding it to SpankingToysDraw()) *brute force, might be a better way to do this
function InventoryItemHandsSpankingToysDraw() {

	// Draw the header and item
	if (SpankingNextButton) DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the buttons, 4 at a time
	DrawText(DialogFind(Player, "SelectSpankingToysType"), 1500, 500, "white", "gray");
	for (var I = SpankingInventoryOffset; (I < SpankingPlayerInventory.length) && (I < SpankingInventoryOffset +4); I++) {
		var offset = I - SpankingInventoryOffset;
		DrawButton(1000 + offset * 250, 550, 225, 225, "", ((DialogFocusItem.Property.Type == SpankingPlayerInventory[I].Name) ? "#888888" : "White"));
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + SpankingPlayerInventory[I].Name + ".png", 1000 + offset * 250, 550);
		DrawText(DialogFind(Player, "SpankingToysType" + SpankingPlayerInventory[I].Name), 1115 + offset * 250, 800, "white", "gray");
	};

}

// Catches the item extension clicks
function InventoryItemHandsSpankingToysClick() {

	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110) && (SpankingNextButton)) SpankingInventoryOffset += 4;
	if (SpankingInventoryOffset > SpankingPlayerInventory.length) SpankingInventoryOffset = 0;

	// Item buttons
	for (var I = SpankingInventoryOffset; (I < SpankingPlayerInventory.length) && (I < SpankingInventoryOffset +4); I++) {
		var nextItem = SpankingPlayerInventory[I].Name;
		var offset = I - SpankingInventoryOffset;
		if ((MouseX >= 1000 + offset * 250) && (MouseX <= 1225 + offset * 250) && (MouseY >= 550) && (MouseY <= 775) && (DialogFocusItem.Property.Type != nextItem))
			InventorySpankingToySetType(nextItem);
	}

}

// Uses spanking toy type (cane, crop, flogger, etc.)
function InventorySpankingToySetType(NewType) {

	// Sets the type
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemHandsSpankingToysLoad();
	}
	DialogFocusItem.Property.Type = NewType;
	if (C.ID == 0) SpankingCurrentType = NewType;

	// Update the character
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	// Prepares the chat message to be published
	var msg = "";
	if (C.ID == 0) {

		// Put on player text
		msg = DialogFind(Player, "SpankingToysSetPlayer");
		msg = msg.replace("SourceCharacter", Player.Name);
		msg = msg.replace("Item", (NewType) ? NewType.toLowerCase() : "crop");

	} else {

		// Put on other character text
		msg = DialogFind(Player, "SpankingToysSetOthers");
		msg = msg.replace("SourceCharacter", Player.Name);
		msg = msg.replace("DestinationCharacter", C.Name);
		msg = msg.replace("Item", (NewType) ? NewType.toLowerCase() : "crop");

	}
	ChatRoomPublishCustomAction(msg, true);

	// Exit from item when done
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}