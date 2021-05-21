"use strict";

// Loads the item extension properties
function InventoryItemMiscSafewordPadlockLoad() {
	var C = CharacterGetCurrent();
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property == null)) DialogFocusSourceItem.Property = {};
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.Password == null)) DialogFocusSourceItem.Property.Password = "PLEASE";
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.Hint == null)) DialogFocusSourceItem.Property.Hint = "Say the magic word...";
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockSet == null)) DialogFocusSourceItem.Property.LockSet = false;

	if (DialogFocusSourceItem.Property && (DialogFocusSourceItem.Property.LockSet ||
	(DialogFocusSourceItem.Property.LockMemberNumber && DialogFocusSourceItem.Property.LockMemberNumber != Player.MemberNumber))) {
		// Normal lock interface
		ElementCreateInput("Password", "text", "", "8");
		// the current code is shown for owners, lovers and the member whose number is on the padlock
		// It is also shown for the person who is bound by it
		if (DialogFocusSourceItem != null && (C.ID == 0 || (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber)
			|| C.IsOwnedByPlayer() || C.IsLoverOfPlayer())) document.getElementById("Password").placeholder = DialogFocusSourceItem.Property.Password;
	} else {
		// Set a password and hint
		ElementCreateInput("SetHint", "text", "", "140");
		ElementCreateInput("SetPassword", "text", "", "8");
		// the current code is shown for owners, lovers and the member whose number is on the padlock
		document.getElementById("SetPassword").placeholder = DialogFocusSourceItem.Property.Password;
		document.getElementById("SetHint").placeholder = DialogFocusSourceItem.Property.Hint;
	}

}

// Draw the extension screen
function InventoryItemMiscSafewordPadlockDraw() {
	var C = CharacterGetCurrent();
	DrawAssetPreview(1387, 225, DialogFocusItem.Asset);

	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
		DrawText(DialogFindPlayer("LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 600, "white", "gray");


	if (DialogFocusSourceItem.Property && (DialogFocusSourceItem.Property.LockSet ||
	(DialogFocusSourceItem.Property.LockMemberNumber && DialogFocusSourceItem.Property.LockMemberNumber != Player.MemberNumber))) {
		// Normal lock interface
		if (DialogFocusSourceItem && DialogFocusSourceItem.Property && DialogFocusSourceItem.Property.Hint)
			DrawTextWrap("\"" + DialogFocusSourceItem.Property.Hint + "\"", 1000, 640, 1000, 120, null, null, 2);
		MainCanvas.textAlign = "right";
		DrawText(DialogFindPlayer("PasswordPadlockOld"), 1490, 805, "white", "gray");
		ElementPosition("Password", 1640, 805, 350);
		MainCanvas.textAlign = "center";
		DrawButton(1370, 871, 250, 64, DialogFindPlayer("PasswordPadlockEnter"), "White", "");
		if (PreferenceMessage != "") DrawText(DialogFindPlayer(PreferenceMessage), 1500, 963, "Red", "Black");
	} else {
		ElementPosition("SetHint", 1643, 700, 550);
		ElementPosition("SetPassword", 1491, 770, 350);
		MainCanvas.textAlign = "left";
		DrawText(DialogFindPlayer("PasswordPadlockSetHint"), 1100, 703, "white", "gray");
		DrawText(DialogFindPlayer("PasswordPadlockSetPassword"), 1100, 773, "white", "gray");
		MainCanvas.textAlign = "center";
		DrawButton(1360, 871, 250, 64, DialogFindPlayer("PasswordPadlockChangePassword"), "White", "");
		if (PreferenceMessage != "") DrawText(DialogFindPlayer(PreferenceMessage), 1500, 963, "Red", "Black");
	}
}

function InventoryItemMiscSafewordPadlockUnlock(C, Item) {
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
function InventoryItemMiscSafewordPadlockClick() {
	var C = CharacterGetCurrent();
	var Item = InventoryGet(C, C.FocusGroup.Name);

	if ((MouseX >= 1360) && (MouseX <= 1950)) {


		if (DialogFocusSourceItem.Property && (DialogFocusSourceItem.Property.LockSet ||
		(DialogFocusSourceItem.Property.LockMemberNumber && DialogFocusSourceItem.Property.LockMemberNumber != Player.MemberNumber))) {

				// Opens the padlock
				if (MouseIn(1360, 871, 250, 64)) {
					if (ElementValue("Password").toUpperCase() == DialogFocusSourceItem.Property.Password) {
						InventoryItemMiscSafewordPadlockUnlock(C, DialogFocusSourceItem);
						InventoryItemMiscSafewordPadlockExit();
					}

					// Send fail message if online
					else if (CurrentScreen == "ChatRoom") {
						let Dictionary = [];
						Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
						Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
						Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
						Dictionary.push({Tag: "Password", Text: ElementValue("Password")});
						ChatRoomPublishCustomAction("PasswordFail", true, Dictionary);
						InventoryItemMiscSafewordPadlockExit();
					}
					else { PreferenceMessage = "SafewordPadlockError"; }
				}

		} else {
				if (MouseIn(1360, 871, 250, 64)) {
					var pw = ElementValue("SetPassword").toUpperCase();
					var hint =  ElementValue("SetHint");
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
							let Dictionary = [];
							Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
							Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
							Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
							ChatRoomPublishCustomAction("PasswordChangeSuccess", true, Dictionary);
							InventoryItemMiscSafewordPadlockExit();
						}
						else {
							CharacterRefresh(C);
							InventoryItemMiscSafewordPadlockExit();
						}
					}
					else { PreferenceMessage = "SafewordPadlockErrorInput"; }

				}
		}
	}

	// Exits the screen
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) {
		InventoryItemMiscSafewordPadlockExit();
	}
}

function InventoryItemMiscSafewordPadlockExit() {
	ElementRemove("Password");
	ElementRemove("SetPassword");
	ElementRemove("SetHint");
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}
