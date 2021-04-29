"use strict";


var PasswordTimerChooseList = [5, 10, 15, 30, 60, 120, 180, 240, -180, -120, -60, -30, -15];
var PasswordTimerChooseIndex = 0;


// Loads the item extension properties
function InventoryItemMiscTimerPasswordPadlockLoad() {
	var C = CharacterGetCurrent();
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property == null)) DialogFocusSourceItem.Property = {};
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.Password == null)) DialogFocusSourceItem.Property.Password = "PASSWORD";
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.Hint == null)) DialogFocusSourceItem.Property.Hint = "Take a guess...";
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockSet == null)) DialogFocusSourceItem.Property.LockSet = false;
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.RemoveItem == null)) DialogFocusSourceItem.Property.RemoveItem = false;
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.ShowTimer == null)) DialogFocusSourceItem.Property.ShowTimer = true;
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.EnableRandomInput == null)) DialogFocusSourceItem.Property.EnableRandomInput = false;
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.MemberNumberList == null)) DialogFocusSourceItem.Property.MemberNumberList = [];

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
			ElementCreateInput("SetHint", "text", "", "140");
			ElementCreateInput("SetPassword", "text", "", "8");
			// the current code is shown for owners, lovers and the member whose number is on the padlock
			document.getElementById("SetPassword").placeholder = DialogFocusSourceItem.Property.Password;
			document.getElementById("SetHint").placeholder = DialogFocusSourceItem.Property.Hint;
		}
		
		
	}
}

// Draw the extension screen
function InventoryItemMiscTimerPasswordPadlockDraw() {
    if ((DialogFocusItem == null) || (DialogFocusSourceItem.Property.RemoveTimer < CurrentTime)) { InventoryItemMiscTimerPasswordPadlockExit(); return; }
    if (DialogFocusSourceItem.Property.ShowTimer) {
        DrawText(DialogFindPlayer("TimerLeft") + " " + TimerToString(DialogFocusSourceItem.Property.RemoveTimer - CurrentTime), 1500, 100, "white", "gray");
    } else { DrawText(DialogFindPlayer("TimerUnknown"), 1500, 150, "white", "gray"); }
	var C = CharacterGetCurrent();
	DrawAssetPreview(1387, 175, DialogFocusItem.Asset);
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
	DrawText(DialogFindPlayer("LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 500, "white", "gray");

	if (InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		// If the zone is blocked, just display some text informing the player that they can't access the lock
		DrawText(DialogFindPlayer("LockZoneBlocked"), 1500, 550, "white", "gray");
	} else {
		if (DialogFocusSourceItem.Property && (DialogFocusSourceItem.Property.LockSet || 
		(DialogFocusSourceItem.Property.LockMemberNumber && DialogFocusSourceItem.Property.LockMemberNumber != Player.MemberNumber))) {
			// Normal lock interface
			if (DialogFocusSourceItem && DialogFocusSourceItem.Property && DialogFocusSourceItem.Property.Hint)
				DrawText("\"" + DialogFocusSourceItem.Property.Hint + "\"", 1500, 550, "white", "gray");
			MainCanvas.textAlign = "right";
			DrawText(DialogFindPlayer("PasswordPadlockOld"), 1390, 605, "white", "gray");
			ElementPosition("Password", 1540, 605, 250);
			MainCanvas.textAlign = "center";
			DrawButton(1670, 580, 250, 64, DialogFindPlayer("PasswordPadlockEnter"), "White", "");
			if (PreferenceMessage != "") DrawText(DialogFindPlayer(PreferenceMessage), 1500, 200, "Red", "Black");
		} else {
			ElementPosition("SetHint", 1643, 550, 550);
			ElementPosition("SetPassword", 1491, 620, 250);
			MainCanvas.textAlign = "left";
			DrawText(DialogFindPlayer("PasswordPadlockSetHint"), 1100, 553, "white", "gray");
			DrawText(DialogFindPlayer("PasswordPadlockSetPassword"), 1100, 623, "white", "gray");
			MainCanvas.textAlign = "center";
			DrawButton(1653, 593, 250, 64, DialogFindPlayer("PasswordPadlockChangePassword"), "White", "");
			if (PreferenceMessage != "") DrawText(DialogFindPlayer(PreferenceMessage), 1500, 200, "Red", "Black");
		}
	}
	
	// Copied from mistress timer padlock and modified
	
	// Draw the settings
    if (Player.CanInteract() && (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber)) {
        MainCanvas.textAlign = "left";
        DrawButton(1100, 666, 64, 64, "", "White", (DialogFocusSourceItem.Property.RemoveItem) ? "Icons/Checked.png" : "");
        DrawText(DialogFindPlayer("RemoveItemWithTimer"), 1200, 698, "white", "gray");
        DrawButton( 1100, 746, 64, 64, "", "White", (DialogFocusSourceItem.Property.ShowTimer) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player,"ShowItemWithTimerRemaining"), 1200, 778, "white", "gray");
        DrawButton(1100, 828, 64, 64, "", "White", (DialogFocusSourceItem.Property.EnableRandomInput) ? "Icons/Checked.png" : "");
        DrawText(DialogFindPlayer("EnableRandomInput"), 1200, 858, "white", "gray");
        MainCanvas.textAlign = "center";
    } else {
        if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
            DrawText(DialogFindPlayer("LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
        DrawText(DialogFindPlayer((DialogFocusSourceItem.Property.RemoveItem) ? "WillRemoveItemWithTimer" : "WontRemoveItemWithTimer"), 1500, 868, "white", "gray");
    }

    // Draw buttons to add/remove time if available
    if (Player.CanInteract() && (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber)) {
        DrawButton(1100, 910, 250, 70, DialogFindPlayer("AddTimerTime"), "White");
        DrawBackNextButton(1400, 910, 250, 70, PasswordTimerChooseList[PasswordTimerChooseIndex] + " " + DialogFindPlayer("Minutes"), "White", "",
            () => PasswordTimerChooseList[(PasswordTimerChooseList.length + PasswordTimerChooseIndex - 1) % PasswordTimerChooseList.length] + " " + DialogFindPlayer("Minutes"),
            () => PasswordTimerChooseList[(PasswordTimerChooseIndex + 1) % PasswordTimerChooseList.length] + " " + DialogFindPlayer("Minutes"));
    }
    else if (Player.CanInteract() && DialogFocusSourceItem.Property.EnableRandomInput) {
        for (let I = 0; I < DialogFocusSourceItem.Property.MemberNumberList.length; I++) {
            if (DialogFocusSourceItem.Property.MemberNumberList[I] == Player.MemberNumber) return;
        }
        DrawButton(1100, 910, 250, 70, "- " + DialogFocusItem.Asset.RemoveTimer * 3 / 60 + " " + DialogFindPlayer("Minutes"), "White");
        DrawButton(1400, 910, 250, 70, DialogFindPlayer("Random"), "White");
        DrawButton(1700, 910, 250, 70, "+ " + DialogFocusItem.Asset.RemoveTimer * 3 / 60 + " " + DialogFindPlayer("Minutes"), "White");
    }
}

function InventoryItemMiscTimerPasswordPadlockUnlock(C, Item) {
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
function InventoryItemMiscTimerPasswordPadlockClick() {
	var C = CharacterGetCurrent();
	var Item = InventoryGet(C, C.FocusGroup.Name);
	
	// Exits the screen
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) {
		InventoryItemMiscTimerPasswordPadlockExit();
	}

	if ((MouseX >= 1360) && (MouseX <= 1950) && !InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		
		
		if (DialogFocusSourceItem.Property && (DialogFocusSourceItem.Property.LockSet || 
		(DialogFocusSourceItem.Property.LockMemberNumber && DialogFocusSourceItem.Property.LockMemberNumber != Player.MemberNumber))) {
				
				// Opens the padlock
				if (MouseIn(1670, 580, 250, 64)) {
					if (ElementValue("Password").toUpperCase() == DialogFocusSourceItem.Property.Password) {
						InventoryItemMiscTimerPasswordPadlockUnlock(C, DialogFocusSourceItem)
						InventoryItemMiscTimerPasswordPadlockExit();
					}

					// Send fail message if online
					else if (CurrentScreen == "ChatRoom") {
						let Dictionary = [];
						Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
						Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
						Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
						Dictionary.push({Tag: "Password", Text: ElementValue("Password")});
						ChatRoomPublishCustomAction("PasswordFail", true, Dictionary);
						InventoryItemMiscTimerPasswordPadlockExit();
					}
					else { PreferenceMessage = "PasswordPadlockError"; }
				}
			
		} else {
				if (MouseIn(1653, 593, 250, 64)) {
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
							let Dictionary = [];
							Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
							Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
							Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
							ChatRoomPublishCustomAction("PasswordChangeSuccess", true, Dictionary);
							InventoryItemMiscTimerPasswordPadlockExit();
						}
						else {
							CharacterRefresh(C);
							InventoryItemMiscTimerPasswordPadlockExit();
						}
					}
					else { PreferenceMessage = "PasswordPadlockErrorInput"; }
					
				}
		}
	}
	
	// Copied from mistress timer padlock
		
		if (!Player.CanInteract()) return;
		
		if (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) {
			if ((MouseX >= 1100) && (MouseX <= 1164)) {
				if ((MouseY >= 666) && (MouseY <= 730)) { DialogFocusSourceItem.Property.RemoveItem = !(DialogFocusSourceItem.Property.RemoveItem); }
				if ((MouseY >= 746) && (MouseY <= 810)) { DialogFocusSourceItem.Property.ShowTimer = !(DialogFocusSourceItem.Property.ShowTimer); }
				if ((MouseY >= 826) && (MouseY <= 890)) { DialogFocusSourceItem.Property.EnableRandomInput = !(DialogFocusSourceItem.Property.EnableRandomInput); }
				if (CurrentScreen == "ChatRoom") ChatRoomCharacterItemUpdate(CharacterGetCurrent());
			}
		}

		if ((MouseY >= 910) && (MouseY <= 980)) {
			if (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) {
				if ((MouseX >= 1100) && (MouseX < 1350)) InventoryItemMiscTimerPasswordPadlockAdd(PasswordTimerChooseList[PasswordTimerChooseIndex] * 60, false);
				if ((MouseX >= 1400) && (MouseX < 1650)) {
					if (MouseX <= 1525) PasswordTimerChooseIndex = (PasswordTimerChooseList.length + PasswordTimerChooseIndex - 1) % PasswordTimerChooseList.length;
					else PasswordTimerChooseIndex = (PasswordTimerChooseIndex + 1) % PasswordTimerChooseList.length;
				}
			}
			else if (DialogFocusSourceItem.Property.EnableRandomInput) {
				for (let I = 0; I < DialogFocusSourceItem.Property.MemberNumberList.length; I++) {
					if (DialogFocusSourceItem.Property.MemberNumberList[I] == Player.MemberNumber) return;
				}
				if ((MouseX >= 1100) && (MouseX < 1350)) { InventoryItemMiscTimerPasswordPadlockAdd(-DialogFocusItem.Asset.RemoveTimer * 2, true); }
				if ((MouseX >= 1400) && (MouseX < 1650)) { InventoryItemMiscTimerPasswordPadlockAdd(DialogFocusItem.Asset.RemoveTimer * 4 * ((Math.random() >= 0.5) ? 1 : -1), true); }
				if ((MouseX >= 1700) && (MouseX < 1950)) { InventoryItemMiscTimerPasswordPadlockAdd(DialogFocusItem.Asset.RemoveTimer * 2, true); }
			}
		}


}

// When a value is added to the timer, can be a negative one
function InventoryItemMiscTimerPasswordPadlockAdd(TimeToAdd, PlayerMemberNumberToList) {
    if (PlayerMemberNumberToList) DialogFocusSourceItem.Property.MemberNumberList.push(Player.MemberNumber);
    var TimerBefore = DialogFocusSourceItem.Property.RemoveTimer;
    if (DialogFocusItem.Asset.RemoveTimer > 0) DialogFocusSourceItem.Property.RemoveTimer = Math.round(Math.min(DialogFocusSourceItem.Property.RemoveTimer + (TimeToAdd * 1000), CurrentTime + (DialogFocusItem.Asset.MaxTimer * 1000)));
    var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
    if (CurrentScreen == "ChatRoom") {
        var timeAdded = (DialogFocusSourceItem.Property.RemoveTimer - TimerBefore) / (1000 * 60);
        var msg = ((timeAdded < 0) && DialogFocusSourceItem.Property.ShowTimer ? "TimerRemoveTime" : "TimerAddTime");
        var Dictionary = [];
        Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
        Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
        if (DialogFocusSourceItem.Property.ShowTimer) {
            Dictionary.push({Tag: "TimerTime", Text: Math.round(Math.abs(timeAdded))});
            Dictionary.push({Tag: "TimerUnit", TextToLookUp: "Minutes"});
        } else {
            Dictionary.push({Tag: "TimerTime", TextToLookUp: "TimerAddRemoveUnknownTime"});
            Dictionary.push({Tag: "TimerUnit", Text: ""});
        }
        Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});

        for (let A = 0; A < C.Appearance.length; A++) {
            if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
                C.Appearance[A] = DialogFocusSourceItem;
        }
        ChatRoomPublishCustomAction(msg, true, Dictionary);
    } else { CharacterRefresh(C); }
    InventoryItemMiscTimerPasswordPadlockExit();
}

function InventoryItemMiscTimerPasswordPadlockExit() {
	ElementRemove("Password");
	ElementRemove("SetPassword");
	ElementRemove("SetHint");
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}
