"use strict";

// Loads the item extension properties
function InventoryItemMiscCombinationPadlockLoad() {
	var C = CharacterGetCurrent();
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property == null)) DialogFocusSourceItem.Property = {};
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.CombinationNumber == null)) DialogFocusSourceItem.Property.CombinationNumber = "0000";

	// Only create the inputs if the zone isn't blocked
	if (!InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		ElementCreateInput("CombinationNumber", "text", "", "4");
		ElementCreateInput("NewCombinationNumber", "text", "", "4");
		// the current code is shown for owners, lovers and the member whose number is on the padlock
		if (DialogFocusSourceItem != null && ((Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber)
			|| C.IsOwnedByPlayer() || C.IsLoverOfPlayer())) document.getElementById("CombinationNumber").placeholder = DialogFocusSourceItem.Property.CombinationNumber;
	}
}

// Draw the extension screen
function InventoryItemMiscCombinationPadlockDraw() {
	var C = CharacterGetCurrent();
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
		DrawText(DialogFind(Player, "LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");

	if (InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		// If the zone is blocked, just display some text informing the player that they can't access the lock
		DrawText(DialogFind(Player, "LockZoneBlocked"), 1500, 800, "white", "gray");
	} else {
		// Otherwise, draw the combination inputs
		MainCanvas.textAlign = "right";
		DrawText(DialogFind(Player, "CombinationOld"), 1400, 803, "white", "gray");
		DrawText(DialogFind(Player, "CombinationNew"), 1400, 883, "white", "gray");
		MainCanvas.textAlign = "center";
		ElementPosition("CombinationNumber", 1500, 800, 125);
		ElementPosition("NewCombinationNumber", 1500, 880, 125);
		DrawButton(1600, 771, 350, 64, DialogFind(Player, "CombinationEnter"), "White", "");
		DrawButton(1600, 851, 350, 64, DialogFind(Player, "CombinationChange"), "White", "");
		if (PreferenceMessage != "") DrawText(DialogFind(Player, PreferenceMessage), 1500, 963, "Red", "Black");
	}
}

// Catches the item extension clicks
function InventoryItemMiscCombinationPadlockClick() {
	var C = CharacterGetCurrent();
	var Item = InventoryGet(C, C.FocusGroup.Name);

	if ((MouseX >= 1600) && (MouseX <= 1950) && !InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		// Opens the padlock
		if ((MouseY >= 771) && (MouseY <= 835)) {
			if (ElementValue("CombinationNumber") == DialogFocusSourceItem.Property.CombinationNumber) {
				delete DialogFocusSourceItem.Property.CombinationNumber;
				for (var A = 0; A < C.Appearance.length; A++) {
					if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
						C.Appearance[A] = DialogFocusSourceItem;
				}
				InventoryUnlock(C, C.FocusGroup.Name);
				ChatRoomPublishAction(C, Item, null, true, "ActionUnlock");
				InventoryItemMiscCombinationPadlockExit();
			}

			// Send fail message if online
			else if (CurrentScreen == "ChatRoom") {
				var Dictionary = [];
				Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
				Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
				Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
				Dictionary.push({Tag: "CombinationNumber", Text: ElementValue("CombinationNumber")});
				ChatRoomPublishCustomAction("CombinationFail", true, Dictionary);
				InventoryItemMiscCombinationPadlockExit();
			}
			else { PreferenceMessage = "CombinationError"; }
		}

		// Changes the code
		if ((MouseY >= 871) && (MouseY <= 935)) {
			// Succeeds to change
			if (ElementValue("CombinationNumber") == DialogFocusSourceItem.Property.CombinationNumber) {
				var E = /^[0-9]+$/;
				var NewCode = ElementValue("NewCombinationNumber");
				// We only accept code made of digits and of 4 numbers
				if (NewCode.match(E) && (NewCode.length == 4)) {
					DialogFocusSourceItem.Property.CombinationNumber = NewCode;
					for (var A = 0; A < C.Appearance.length; A++) {
						if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
							C.Appearance[A] = DialogFocusSourceItem;
					}
					if (CurrentScreen == "ChatRoom") {
						var Dictionary = [];
						Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
						Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
						Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
						ChatRoomPublishCustomAction("CombinationChangeSuccess", true, Dictionary);
						InventoryItemMiscCombinationPadlockExit();
					}
					else {
						CharacterRefresh(C);
						InventoryItemMiscCombinationPadlockExit();
					}
				}
				else { PreferenceMessage = "CombinationErrorInput"; }
			}
			// Fails to change
			else if (CurrentScreen == "ChatRoom") {
				var Dictionary = [];
				Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
				Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
				Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
				ChatRoomPublishCustomAction("CombinationChangeFail", true, Dictionary);
				InventoryItemMiscCombinationPadlockExit();
			}
			else { PreferenceMessage = "CombinationError"; }
		}
	}

	// Exits the screen
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) {
		InventoryItemMiscCombinationPadlockExit();
	}
}

function InventoryItemMiscCombinationPadlockExit() {
	ElementRemove("CombinationNumber");
	ElementRemove("NewCombinationNumber");
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}
