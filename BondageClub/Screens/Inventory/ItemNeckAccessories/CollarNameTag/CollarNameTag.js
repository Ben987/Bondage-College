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
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DrawText(DialogFind(Player, "SelectCollarNameTagType"), 1500, 500, "white", "gray");
		if(DialogFocusItem.Property.Type != "BadGirl") DrawButton(955, 530, 200, 55, "Bad Girl", "White");
		if(DialogFocusItem.Property.Type != "BindMe") DrawButton(1165, 530, 200, 55, "Bind Me", "White");
		if(DialogFocusItem.Property.Type != "Bitch") DrawButton(1375, 530, 200, 55, "Bitch", "White");
		if(DialogFocusItem.Property.Type != "Bunny") DrawButton(1585, 530, 200, 55, "Bunny", "White");
		if(DialogFocusItem.Property.Type != "Cookie") DrawButton(1795, 530, 200, 55, "Cookie", "White");
		if(DialogFocusItem.Property.Type != "Cupcake") DrawButton(955, 590, 200, 55, "Cupcake", "White");
		if(DialogFocusItem.Property.Type != "Dom") DrawButton(1165, 590, 200, 55, "Dom", "White");
		if(DialogFocusItem.Property.Type != "Foxy") DrawButton(1375, 590, 200, 55, "Foxy", "White");
		if(DialogFocusItem.Property.Type != "Free") DrawButton(1585, 590, 200, 55, "Free", "White");
		if(DialogFocusItem.Property.Type != "FuckMe") DrawButton(1795, 590, 200, 55, "Fuck Me", "White");
		if(DialogFocusItem.Property.Type != "GagMe") DrawButton(955, 650, 200, 55, "Gag Me", "White");
		if(DialogFocusItem.Property.Type != "GoodGirl") DrawButton(1165, 650, 200, 55, "Good Girl", "White");
		if(DialogFocusItem.Property.Type != "HoldMe") DrawButton(1375, 650, 200, 55, "Hold Me", "White");
		if(DialogFocusItem.Property.Type != "Kitten") DrawButton(1585, 650, 200, 55, "Kitten", "White");
		if(DialogFocusItem.Property.Type != "Love") DrawButton(1795, 650, 200, 55, "Love", "White");
		if(DialogFocusItem.Property.Type != "Maid") DrawButton(955, 710, 200, 55, "Maid", "White");
		if(DialogFocusItem.Property.Type != "Meat") DrawButton(1165, 710, 200, 55, "Meat", "White");
		if(DialogFocusItem.Property.Type != "Muffin") DrawButton(1375, 710, 200, 55, "Muffin", "White");
		if(DialogFocusItem.Property.Type != "Needy") DrawButton(1585, 710, 200, 55, "Needy", "White");
		if(DialogFocusItem.Property.Type != "Owned") DrawButton(1795, 710, 200, 55, "Owned", "White");
		if(DialogFocusItem.Property.Type != "Panda") DrawButton(955, 770, 200, 55, "Panda", "White");
		if(DialogFocusItem.Property.Type != "Pet") DrawButton(1165, 770, 200, 55, "Pet", "White");
		if(DialogFocusItem.Property.Type != "PetMe") DrawButton(1375, 770, 200, 55, "Pet Me", "White");
		if(DialogFocusItem.Property.Type != "Pixie") DrawButton(1585, 770, 200, 55, "Pixie", "White");
		if(DialogFocusItem.Property.Type != "Puppy") DrawButton(1795, 770, 200, 55, "Puppy", "White");
		if(DialogFocusItem.Property.Type != "Racoon") DrawButton(955, 830, 200, 55, "Racoon", "White");
		if(DialogFocusItem.Property.Type != "Slave") DrawButton(1165, 830, 200, 55, "Slave", "White");
		if(DialogFocusItem.Property.Type != "Slut") DrawButton(1375, 830, 200, 55, "Slut", "White");
		if(DialogFocusItem.Property.Type != "Sub") DrawButton(1585, 830, 200, 55, "Sub", "White");
		if(DialogFocusItem.Property.Type != "Sweetie") DrawButton(1795, 830, 200, 55, "Sweetie", "White");
		if(DialogFocusItem.Property.Type != "Taken") DrawButton(955, 890, 200, 55, "Taken", "White");
		if(DialogFocusItem.Property.Type != "Toy") DrawButton(1165, 890, 200, 55, "Toy", "White");
		if(DialogFocusItem.Property.Type != "Useless") DrawButton(1375, 890, 200, 55, "Useless", "White");
		if(DialogFocusItem.Property.Type != "UseMe") DrawButton(1585, 890, 200, 55, "Use Me", "White");
		if(DialogFocusItem.Property.Type != "Whore") DrawButton(1795, 890, 200, 55, "Whore", "White");
	}
	else {
		DrawText(DialogFind(Player, "SelectCollarNameTagTypeLocked"), 1500, 500, "white", "gray");
	}
}

// Catches the item extension clicks
function InventoryItemNeckAccessoriesCollarNameTagClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) { DialogFocusItem = null; return; }
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		if ((MouseX >= 955) && (MouseX <= 1155) && (MouseY >= 530) && (MouseY <= 585) && (DialogFocusItem.Property.Type != "BadGirl")) InventoryItemNeckAccessoriesCollarNameTagSetType("BadGirl");
		if ((MouseX >= 1165) && (MouseX <= 1365) && (MouseY >= 530) && (MouseY <= 585) && (DialogFocusItem.Property.Type != "BindMe")) InventoryItemNeckAccessoriesCollarNameTagSetType("BindMe");
		if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 530) && (MouseY <= 585) && (DialogFocusItem.Property.Type != "Bitch")) InventoryItemNeckAccessoriesCollarNameTagSetType("Bitch");
		if ((MouseX >= 1585) && (MouseX <= 1785) && (MouseY >= 530) && (MouseY <= 585) && (DialogFocusItem.Property.Type != "Bunny")) InventoryItemNeckAccessoriesCollarNameTagSetType("Bunny");
		if ((MouseX >= 1795) && (MouseX <= 1995) && (MouseY >= 530) && (MouseY <= 585) && (DialogFocusItem.Property.Type != "Cookie")) InventoryItemNeckAccessoriesCollarNameTagSetType("Cookie");
		if ((MouseX >= 955) && (MouseX <= 1155) && (MouseY >= 590) && (MouseY <= 645) && (DialogFocusItem.Property.Type != "Cupcake")) InventoryItemNeckAccessoriesCollarNameTagSetType("Cupcake");
		if ((MouseX >= 1165) && (MouseX <= 1365) && (MouseY >= 590) && (MouseY <= 645) && (DialogFocusItem.Property.Type != "Dom")) InventoryItemNeckAccessoriesCollarNameTagSetType("Dom");
		if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 590) && (MouseY <= 645) && (DialogFocusItem.Property.Type != "Foxy")) InventoryItemNeckAccessoriesCollarNameTagSetType("Foxy");
		if ((MouseX >= 1585) && (MouseX <= 1785) && (MouseY >= 590) && (MouseY <= 645) && (DialogFocusItem.Property.Type != "Free")) InventoryItemNeckAccessoriesCollarNameTagSetType("Free");
		if ((MouseX >= 1795) && (MouseX <= 1995) && (MouseY >= 590) && (MouseY <= 645) && (DialogFocusItem.Property.Type != "FuckMe")) InventoryItemNeckAccessoriesCollarNameTagSetType("FuckMe");
		if ((MouseX >= 955) && (MouseX <= 1155) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Type != "GagMe")) InventoryItemNeckAccessoriesCollarNameTagSetType("GagMe");
		if ((MouseX >= 1165) && (MouseX <= 1365) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Type != "GoodGirl")) InventoryItemNeckAccessoriesCollarNameTagSetType("GoodGirl");
		if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Type != "HoldMe")) InventoryItemNeckAccessoriesCollarNameTagSetType("HoldMe");
		if ((MouseX >= 1585) && (MouseX <= 1785) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Type != "Kitten")) InventoryItemNeckAccessoriesCollarNameTagSetType("Kitten");
		if ((MouseX >= 1795) && (MouseX <= 1995) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Type != "Love")) InventoryItemNeckAccessoriesCollarNameTagSetType("Love");
		if ((MouseX >= 955) && (MouseX <= 1155) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Type != "Maid")) InventoryItemNeckAccessoriesCollarNameTagSetType("Maid");
		if ((MouseX >= 1165) && (MouseX <= 1365) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Type != "Meat")) InventoryItemNeckAccessoriesCollarNameTagSetType("Meat");
		if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Type != "Muffin")) InventoryItemNeckAccessoriesCollarNameTagSetType("Muffin");
		if ((MouseX >= 1585) && (MouseX <= 1785) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Type != "Needy")) InventoryItemNeckAccessoriesCollarNameTagSetType("Needy");
		if ((MouseX >= 1795) && (MouseX <= 1995) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Type != "Owned")) InventoryItemNeckAccessoriesCollarNameTagSetType("Owned");
		if ((MouseX >= 955) && (MouseX <= 1155) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.Type != "Panda")) InventoryItemNeckAccessoriesCollarNameTagSetType("Panda");
		if ((MouseX >= 1165) && (MouseX <= 1365) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.Type != "Pet")) InventoryItemNeckAccessoriesCollarNameTagSetType("Pet");
		if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.Type != "PetMe")) InventoryItemNeckAccessoriesCollarNameTagSetType("PetMe");
		if ((MouseX >= 1585) && (MouseX <= 1785) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.Type != "Pixie")) InventoryItemNeckAccessoriesCollarNameTagSetType("Pixie");
		if ((MouseX >= 1795) && (MouseX <= 1995) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.Type != "Puppy")) InventoryItemNeckAccessoriesCollarNameTagSetType("Puppy");
		if ((MouseX >= 955) && (MouseX <= 1155) && (MouseY >= 830) && (MouseY <= 885) && (DialogFocusItem.Property.Type != "Racoon")) InventoryItemNeckAccessoriesCollarNameTagSetType("Racoon");
		if ((MouseX >= 1165) && (MouseX <= 1365) && (MouseY >= 830) && (MouseY <= 885) && (DialogFocusItem.Property.Type != "Slave")) InventoryItemNeckAccessoriesCollarNameTagSetType("Slave");
		if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 830) && (MouseY <= 885) && (DialogFocusItem.Property.Type != "Slut")) InventoryItemNeckAccessoriesCollarNameTagSetType("Slut");
		if ((MouseX >= 1585) && (MouseX <= 1785) && (MouseY >= 830) && (MouseY <= 885) && (DialogFocusItem.Property.Type != "Sub")) InventoryItemNeckAccessoriesCollarNameTagSetType("Sub");
		if ((MouseX >= 1795) && (MouseX <= 1995) && (MouseY >= 830) && (MouseY <= 885) && (DialogFocusItem.Property.Type != "Sweetie")) InventoryItemNeckAccessoriesCollarNameTagSetType("Sweetie");
		if ((MouseX >= 955) && (MouseX <= 1155) && (MouseY >= 890) && (MouseY <= 945) && (DialogFocusItem.Property.Type != "Taken")) InventoryItemNeckAccessoriesCollarNameTagSetType("Taken");
		if ((MouseX >= 1165) && (MouseX <= 1365) && (MouseY >= 890) && (MouseY <= 945) && (DialogFocusItem.Property.Type != "Toy")) InventoryItemNeckAccessoriesCollarNameTagSetType("Toy");
		if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 890) && (MouseY <= 945) && (DialogFocusItem.Property.Type != "Useless")) InventoryItemNeckAccessoriesCollarNameTagSetType("Useless");
		if ((MouseX >= 1585) && (MouseX <= 1785) && (MouseY >= 890) && (MouseY <= 945) && (DialogFocusItem.Property.Type != "UseMe")) InventoryItemNeckAccessoriesCollarNameTagSetType("UseMe");
		if ((MouseX >= 1795) && (MouseX <= 1995) && (MouseY >= 890) && (MouseY <= 945) && (DialogFocusItem.Property.Type != "Whore")) InventoryItemNeckAccessoriesCollarNameTagSetType("Whore");
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
    else if (NewType == "BadGirl") DialogFocusItem.Property.Effect = [];
	else if (NewType == "BindMe") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Bitch") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Bunny") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Cookie") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Cupcake") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Dom") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Foxy") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Free") DialogFocusItem.Property.Effect = [];
	else if (NewType == "FuckMe") DialogFocusItem.Property.Effect = [];
	else if (NewType == "GagMe") DialogFocusItem.Property.Effect = [];
	else if (NewType == "GoodGirl") DialogFocusItem.Property.Effect = [];
	else if (NewType == "HoldMe") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Kitten") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Love") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Maid") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Meat") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Muffin") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Needy") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Owned") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Panda") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Pet") DialogFocusItem.Property.Effect = [];
	else if (NewType == "PetMe") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Pixie") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Puppy") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Racoon") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Slave") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Slut") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Sub") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Sweetie") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Taken") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Toy") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Useless") DialogFocusItem.Property.Effect = [];
	else if (NewType == "UseMe") DialogFocusItem.Property.Effect = [];
	else if (NewType == "Whore") DialogFocusItem.Property.Effect = [];
	
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	var msg = DialogFind(Player, "CollarNameTagSet" + ((NewType) ? NewType : ""));
	msg = msg.replace("SourceCharacter", Player.Name);
	msg = msg.replace("DestinationCharacter", C.Name);
	ChatRoomPublishCustomAction(msg, true);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}
