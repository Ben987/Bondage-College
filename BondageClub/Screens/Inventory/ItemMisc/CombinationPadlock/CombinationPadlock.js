"use strict";

// Loads the item extension properties
function InventoryItemMiscCombinationPadlockLoad() {
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property == null)) DialogFocusSourceItem.Property = {};
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.CombinationNumber == null)) DialogFocusSourceItem.Property.CombinationNumber = "0000";
	ElementCreateInput("CombinationNumber", "text", "", "4");
	ElementCreateInput("NewCombinationNumber", "text", "", "4");
	if (DialogFocusSourceItem != null && Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) document.getElementById("CombinationNumber").placeholder = DialogFocusSourceItem.Property.CombinationNumber;
}

// Draw the extension screen
function InventoryItemMiscCombinationPadlockDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
		DrawText(DialogFind(Player, "LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
	MainCanvas.textAlign = "right";
	DrawText(DialogFind(Player,"CombinationOld"), 1400, 803, "white", "gray");
	DrawText(DialogFind(Player,"CombinationNew"), 1400, 903, "white", "gray");
	MainCanvas.textAlign = "center";
	ElementPosition("CombinationNumber", 1500, 800, 128);
	ElementPosition("NewCombinationNumber", 1500, 900, 128);
	DrawButton(1600, 771, 350, 64, DialogFind(Player,"CombinationEnter"), "White", "");
	DrawButton(1600, 871, 350, 64, DialogFind(Player, "CombinationChange"), "White", "");
}

// Catches the item extension clicks
function InventoryItemMiscCombinationPadlockClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	var Item = InventoryGet(C, C.FocusGroup.Name);

	if ((MouseX >= 1600) && (MouseX <= 1950)){
		// Opens the padlock
		if ((MouseY >= 771) && (MouseY <= 835)){
			if (ElementValue("CombinationNumber") == DialogFocusSourceItem.Property.CombinationNumber){
				InventoryUnlock(C, C.FocusGroup.Name);
				ChatRoomPublishAction(C, Item, null, true, "ActionUnlock");
			}

			// Send fail message if online
			else if (CurrentScreen == "ChatRoom") {
				var Dictionary = [];
				Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
				Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
				Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
				Dictionary.push({Tag: "CombinationNumber", Text: ElementValue("CombinationNumber")});
				ChatRoomPublishCustomAction("CombinationFail", true, Dictionary);
			}
			else { CharacterRefresh(C); }
			InventoryItemMiscCombinationPadlockExit();
		}

		// Changes the code
		if ((MouseY >= 871) && (MouseY <= 935)) {
			// Succeeds to change
			if (ElementValue("CombinationNumber") == DialogFocusSourceItem.Property.CombinationNumber) {
				var E = /^[0-9]+$/;
				var NewCode = ElementValue("NewCombinationNumber");
				if (NewCode.match(E)) {
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
						ChatRoomCharacterUpdate(C);
					}
					else { CharacterRefresh(C); }
				}
			}
			// Fails to change
			else if (CurrentScreen == "ChatRoom") {
				var Dictionary = [];
				Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
				Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
				Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
				ChatRoomPublishCustomAction("CombinationChangeFail", true, Dictionary);
			}
			else { CharacterRefresh(C); }
			InventoryItemMiscCombinationPadlockExit();
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
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}