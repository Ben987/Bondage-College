"use strict";

// Loads the item extension properties
function InventoryItemNeckAccessoriesCollarNameTagLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
}

// Draw the item extension screen
function InventoryItemNeckAccessoriesCollarNameTagDraw() {
	
	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	// Draw the possible tags
	DrawText(DialogFind(Player, "SelectCollarNameTagType"), 1500, 500, "white", "gray");
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		if(DialogFocusItem.Property.Type != "Bitch") DrawButton(1165, 650, 200, 55, "Bitch", "White");
		if(DialogFocusItem.Property.Type != "Cookie") DrawButton(1375, 650, 200, 55, "Cookie", "White");
		if(DialogFocusItem.Property.Type != "Kitten") DrawButton(1585, 650, 200, 55, "Kitten", "White");
		if(DialogFocusItem.Property.Type != "Love") DrawButton(1165, 710, 200, 55, "Love", "White");
		if(DialogFocusItem.Property.Type != "Maid") DrawButton(1375, 710, 200, 55, "Maid", "White");
		if(DialogFocusItem.Property.Type != "Muffin") DrawButton(1585, 710, 200, 55, "Muffin", "White");
		if(DialogFocusItem.Property.Type != "Pet") DrawButton(1165, 770, 200, 55, "Pet", "White");
		if(DialogFocusItem.Property.Type != "Puppy") DrawButton(1375, 770, 200, 55, "Puppy", "White");
		if(DialogFocusItem.Property.Type != "Slave") DrawButton(1585, 770, 200, 55, "Slave", "White");
		if(DialogFocusItem.Property.Type != "Slut") DrawButton(1165, 830, 200, 55, "Slut", "White");
		if(DialogFocusItem.Property.Type != "Sub") DrawButton(1375, 830, 200, 55, "Sub", "White");
		if(DialogFocusItem.Property.Type != "Toy") DrawButton(1585, 830, 200, 55, "Toy", "White");
	}
}

// Catches the item extension clicks
function InventoryItemNeckAccessoriesCollarNameTagClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) { DialogFocusItem = null; return; }
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		if ((MouseX >= 1165) && (MouseX <= 1365) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Type != "Bitch")) InventoryItemNeckAccessoriesCollarNameTagSetType("Bitch");
		if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Type != "Cookie")) InventoryItemNeckAccessoriesCollarNameTagSetType("Cookie");
		if ((MouseX >= 1585) && (MouseX <= 1785) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Type != "Kitten")) InventoryItemNeckAccessoriesCollarNameTagSetType("Kitten");
		if ((MouseX >= 1165) && (MouseX <= 1365) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Type != "Love")) InventoryItemNeckAccessoriesCollarNameTagSetType("Love");
		if ((MouseX >= 1365) && (MouseX <= 1575) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Type != "Maid")) InventoryItemNeckAccessoriesCollarNameTagSetType("Maid");
		if ((MouseX >= 1565) && (MouseX <= 1785) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Type != "Muffin")) InventoryItemNeckAccessoriesCollarNameTagSetType("Muffin");
		if ((MouseX >= 1165) && (MouseX <= 1365) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.Type != "Pet")) InventoryItemNeckAccessoriesCollarNameTagSetType("Pet");
		if ((MouseX >= 1365) && (MouseX <= 1575) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.Type != "Puppy")) InventoryItemNeckAccessoriesCollarNameTagSetType("Puppy");
		if ((MouseX >= 1565) && (MouseX <= 1785) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.Type != "Slave")) InventoryItemNeckAccessoriesCollarNameTagSetType("Slave");
		if ((MouseX >= 1165) && (MouseX <= 1365) && (MouseY >= 830) && (MouseY <= 885) && (DialogFocusItem.Property.Type != "Slut")) InventoryItemNeckAccessoriesCollarNameTagSetType("Slut");
		if ((MouseX >= 1365) && (MouseX <= 1575) && (MouseY >= 830) && (MouseY <= 885) && (DialogFocusItem.Property.Type != "Sub")) InventoryItemNeckAccessoriesCollarNameTagSetType("Sub");
		if ((MouseX >= 1565) && (MouseX <= 1785) && (MouseY >= 830) && (MouseY <= 885) && (DialogFocusItem.Property.Type != "Toy")) InventoryItemNeckAccessoriesCollarNameTagSetType("Toy");
	}
}

// Sets the type of tag
function InventoryItemNeckAccessoriesCollarNameTagSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemNeckAccessoriesCollarNameTagLoad();
	}
	DialogFocusItem.Property.Type = NewType;
	if (NewType == null) DialogFocusItem.Property.Effect = [];
    else if (NewType == "Bitch") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Cookie") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Kitten") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Love") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Maid") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Muffin") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Pet") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Puppy") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Slave") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Slut") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Sub") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Toy") DialogFocusItem.Property.Effect = [];
	
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	var msg = DialogFind(Player, "CollarNameTagSet" + ((NewType) ? NewType : "Bitch"));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}
