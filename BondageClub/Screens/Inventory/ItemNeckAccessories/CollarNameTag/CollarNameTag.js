"use strict";

// Loads the item extension properties
function InventoryItemNeckAccessoriesCollarNameTagLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null };
}

// Draw the item extension screen
function InventoryItemNeckAccessoriesCollarNameTagDraw() {
	
	// Draw the possible tags
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		DrawText(DialogFind(Player, "SelectCollarNameTagType"), 1500, 500, "white", "gray");
		var List = DialogFocusItem.Asset.AllowType;
		var X = 955;
		var Y = 530;
		for (var T = 0; T < List.length; T++) {
			if ((DialogFocusItem.Property.Type != List[T])) DrawButton(X, Y, 200, 55, DialogFind(Player, "CollarNameTagType" + List[T]), "White");
			X = X + 210;
			if (T % 5 == 4) { 
				X = 955; 
				Y = Y + 60;
			}		
		}
	}
	else {
		DrawText(DialogFind(Player, "SelectCollarNameTagTypeLocked"), 1500, 500, "white", "gray");
	}
}

// Catches the item extension clicks
function InventoryItemNeckAccessoriesCollarNameTagClick() {
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		var List = DialogFocusItem.Asset.AllowType;
		var X = 955;
		var Y = 530;
		for (var T = 0; T < List.length; T++) {
			if ((MouseX >= X) && (MouseX <= X + 200) && (MouseY >= Y) && (MouseY <= Y + 55) && (DialogFocusItem.Property.Type != List[T]))
				InventoryItemNeckAccessoriesCollarNameTagSetType(List[T]);
			X = X + 210;
			if (T % 5 == 4) { 
				X = 955; 
				Y = Y + 60;
			}		
		}
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
	DialogFocusItem.Property.Effect = [];
	
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	var msg = DialogFind(Player, "CollarNameTagSet")
		.replace("SourceCharacter", Player.Name)
		.replace("DestinationCharacter", C.Name)
		.replace("NameTagType", DialogFind(Player, "CollarNameTagType" + ((NewType) ? NewType : "")).toLowerCase());
	ChatRoomPublishCustomAction(msg, true);
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}
