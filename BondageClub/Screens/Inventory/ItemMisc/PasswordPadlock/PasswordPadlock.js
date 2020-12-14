"use strict";

// Loads the item extension properties
function InventoryItemMiscPasswordPadlockLoad() {
	var C = CharacterGetCurrent();
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property == null)) DialogFocusSourceItem.Property = {};
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.Password == null)) DialogFocusSourceItem.Property.Password = "PASSWORD";
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.Hint == null)) DialogFocusSourceItem.Property.Hint = "Take a guess...";
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockSet == null)) DialogFocusSourceItem.Property.LockSet = false;

	// Only create the inputs if the zone isn't blocked
	if (!InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		if (DialogFocusSourceItem.Property && (DialogFocusSourceItem.Property.LockSet || 
		(DialogFocusSourceItem.Property.LockMemberNumber && DialogFocusSourceItem.Property.LockMemberNumber != Player.MemberNumber))) {
			// Normal lock interface
			ElementCreateInput("Password", "text", "", "8");
			// the current code is shown for owners, lovers and the member whose number is on the padlock
			if (DialogFocusSourceItem != null && ((Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber)
				|| C.IsOwnedByPlayer() || C.IsLoverOfPlayer())) document.getElementById("Password").placeholder = DialogFocusSourceItem.Property.Password;
		} else {
			// Set a password and hint
			ElementCreateInput("SetPassword", "text", "", "8");
			ElementCreateInput("SetHint", "text", "", "140");
			// the current code is shown for owners, lovers and the member whose number is on the padlock
			document.getElementById("SetPassword").placeholder = DialogFocusSourceItem.Property.Password;
			document.getElementById("SetHint").placeholder = DialogFocusSourceItem.Property.Hint;
		}
		
		
	}
}

// Draw the extension screen
function InventoryItemMiscPasswordPadlockDraw() {
	var C = CharacterGetCurrent();
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
		DrawText(DialogFind(Player, "LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 600, "white", "gray");

	if (InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		// If the zone is blocked, just display some text informing the player that they can't access the lock
		DrawText(DialogFind(Player, "LockZoneBlocked"), 1500, 800, "white", "gray");
	} else {
		if (DialogFocusSourceItem.Property && (DialogFocusSourceItem.Property.LockSet || 
		(DialogFocusSourceItem.Property.LockMemberNumber && DialogFocusSourceItem.Property.LockMemberNumber != Player.MemberNumber))) {
			// Normal lock interface
			if (DialogFocusSourceItem && DialogFocusSourceItem.Property && DialogFocusSourceItem.Property.Hint)
				DrawText("\"" + DialogFocusSourceItem.Property.Hint + "\"", 1500, 700, "white", "gray");
			MainCanvas.textAlign = "right";
			DrawText(DialogFind(Player, "PasswordPadlockOld"), 1490, 805, "white", "gray");
			ElementPosition("Password", 1640, 805, 250);
			MainCanvas.textAlign = "center";
			DrawButton(1370, 871, 250, 64, DialogFind(Player, "PasswordPadlockEnter"), "White", "");
			if (PreferenceMessage != "") DrawText(DialogFind(Player, PreferenceMessage), 1500, 963, "Red", "Black");
		} else {
			ElementPosition("SetHint", 1643, 700, 550);
			ElementPosition("SetPassword", 1491, 770, 250);
			MainCanvas.textAlign = "left";
			DrawText(DialogFind(Player, "PasswordPadlockSetHint"), 1100, 703, "white", "gray");
			DrawText(DialogFind(Player, "PasswordPadlockSetPassword"), 1100, 773, "white", "gray");
			MainCanvas.textAlign = "center";
			DrawButton(1360, 871, 250, 64, DialogFind(Player, "PasswordPadlockChangePassword"), "White", "");
			if (PreferenceMessage != "") DrawText(DialogFind(Player, PreferenceMessage), 1500, 963, "Red", "Black");
		}
	}
}

function InventoryItemMiscPasswordPadlockUnlock(C, Item) {
	delete Item.Property.Password;
	delete Item.Property.LockSet;
	delete Item.Property.Hint;
	for (let A = 0; A < C.Appearance.length; A++) {
		if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
			C.Appearance[A] = Item;
	}
	InventoryUnlock(C, C.FocusGroup.Name);
	ChatRoomPublishAction(C, Item, null, true, "ActionUnlock");
}

// Catches the item extension clicks
function InventoryItemMiscPasswordPadlockClick() {
	var C = CharacterGetCurrent();
	var Item = InventoryGet(C, C.FocusGroup.Name);

	if ((MouseX >= 1360) && (MouseX <= 1950) && !InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		
		
		if (DialogFocusSourceItem.Property && (DialogFocusSourceItem.Property.LockSet || 
		(DialogFocusSourceItem.Property.LockMemberNumber && DialogFocusSourceItem.Property.LockMemberNumber != Player.MemberNumber))) {
				
				// Opens the padlock
				if (MouseIn(1360, 871, 250, 64)) {
					if (ElementValue("Password").toUpperCase() == DialogFocusSourceItem.Property.Password) {
						InventoryItemMiscPasswordPadlockUnlock(C, DialogFocusSourceItem)
						InventoryItemMiscPasswordPadlockExit();
					}

					// Send fail message if online
					else if (CurrentScreen == "ChatRoom") {
						var Dictionary = [];
						Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
						Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
						Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
						Dictionary.push({Tag: "Password", Text: ElementValue("Password")});
						ChatRoomPublishCustomAction("PasswordFail", true, Dictionary);
						InventoryItemMiscPasswordPadlockExit();
					}
					else { PreferenceMessage = "PasswordPadlockError"; }
				}
			
		} else {
				if (MouseIn(1360, 871, 250, 64)) {
					var pw = ElementValue("SetPassword").toUpperCase()
					var hint =  ElementValue("SetHint")
					var E = /^[A-Z]+$/;
					// We only accept code made of letters
					if (pw == "" || pw.match(E)) {
						DialogFocusSourceItem.Property.LockSet = true;
						if (pw != "") {
							DialogFocusSourceItem.Property.Password = pw;
						}
						if (hint != "") {
							DialogFocusSourceItem.Property.Hint = hint;
						}
						for (let A = 0; A < C.Appearance.length; A++) {
							if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
								C.Appearance[A] = DialogFocusSourceItem;
						}
						if (CurrentScreen == "ChatRoom") {
							var Dictionary = [];
							Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
							Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
							Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
							ChatRoomPublishCustomAction("PasswordChangeSuccess", true, Dictionary);
							InventoryItemMiscPasswordPadlockExit();
						}
						else {
							CharacterRefresh(C);
							InventoryItemMiscPasswordPadlockExit();
						}
					}
					else { PreferenceMessage = "PasswordPadlockErrorInput"; }
					
				}
		}
	}

	// Exits the screen
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) {
		InventoryItemMiscPasswordPadlockExit();
	}
}

function InventoryItemMiscPasswordPadlockExit() {
	ElementRemove("Password");
	ElementRemove("SetPassword");
	ElementRemove("SetHint");
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}
