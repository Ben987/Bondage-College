"use strict";

var InventoryItemMiscHighSecurityPadlockPlayerCanUnlock = true
var HighSecurityPadlockConfigOwner = true
var HighSecurityPadlockConfigLover = true
var HighSecurityPadlockConfigWhitelist = false


// Loads the item extension properties
function InventoryItemMiscHighSecurityPadlockLoad() {
	var C = CharacterGetCurrent();
	InventoryItemMiscHighSecurityPadlockPlayerCanUnlock = true
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property == null)) DialogFocusSourceItem.Property = {};
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.MemberNumberList == null))
		DialogFocusSourceItem.Property.MemberNumberList = "" + (DialogFocusSourceItem.Property.LockMemberNumber) ? DialogFocusSourceItem.Property.LockMemberNumber : "";

	// Only create the inputs if the zone isn't blocked
	if (!InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		if (DialogFocusSourceItem != null && ((DialogFocusSourceItem.Property.MemberNumberList && CommonConvertStringToArray("" + DialogFocusSourceItem.Property.MemberNumberList).indexOf(Player.MemberNumber) >= 0))) {
			if (!(ElementValue("MemberNumberList") && "" + ElementValue("MemberNumberList").length > 1)) { // Only update if there isnt text already..
				ElementCreateTextArea("MemberNumberList");
				document.getElementById("MemberNumberList").setAttribute("maxLength", 250);
				document.getElementById("MemberNumberList").setAttribute("autocomplete", "off");
				ElementValue("MemberNumberList", DialogFocusSourceItem.Property.MemberNumberList);
			}
			
			if (!InventoryItemMiscHighSecurityPadlockPlayerHasKeys(C, DialogFocusItem)) {
				InventoryItemMiscHighSecurityPadlockPlayerCanUnlock = false
			}
		}
	}
}

function InventoryItemMiscHighSecurityPadlockPlayerHasKeys(C, Item) {
	if (LogQuery("KeyDeposit", "Cell")) return false;
	var UnlockName = "Unlock-" + Item.Asset.Name;
	if ((Item != null) && (Item.Property != null) && (Item.Property.LockedBy != null)) UnlockName = "Unlock-" + Item.Property.LockedBy;
	for (let I = 0; I < Player.Inventory.length; I++)
		if (InventoryItemHasEffect(Player.Inventory[I], UnlockName)) {
			var Lock = InventoryGetLock(Item);
			if (Lock != null) {
				if (Lock.Asset.LoverOnly && !C.IsLoverOfPlayer()) return false;
				if (Lock.Asset.OwnerOnly && !C.IsOwnedByPlayer()) return false;
				return true;
			} else return true;
		}
	return true
}

// Draw the extension screen
function InventoryItemMiscHighSecurityPadlockDraw() {
	
	var C = CharacterGetCurrent();
	
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null)) 
		DrawText(DialogFind(Player, "LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 650, "white", "gray");
	
	if (!InventoryGroupIsBlocked(C, C.FocusGroup.Name)&& (DialogFocusSourceItem != null && ((DialogFocusSourceItem.Property.MemberNumberList && CommonConvertStringToArray("" + DialogFocusSourceItem.Property.MemberNumberList).indexOf(Player.MemberNumber) >= 0)))) {
		DrawText(DialogFind(Player, "HighSecuritySaveIntro"), 1500, 600, "white", "gray");
		ElementPosition("MemberNumberList", 1260, 780, 300, 170);
		DrawButton(1135, 920, 230, 64, DialogFind(Player, "HighSecuritySave"), "White", "");
		
		MainCanvas.textAlign = "left";
		DrawCheckboxColor(1450, 700, 64, 64, DialogFind(Player, "HighSecurityAppendOwner"), HighSecurityPadlockConfigOwner, "White");
		DrawCheckboxColor(1450, 780, 64, 64, DialogFind(Player, "HighSecurityAppendLover"), HighSecurityPadlockConfigLover, "White");
		DrawCheckboxColor(1450, 860, 64, 64, DialogFind(Player, "HighSecurityAppendWhitelist"), HighSecurityPadlockConfigWhitelist, "White");
		MainCanvas.textAlign = "center";

		
		if (!InventoryItemMiscHighSecurityPadlockPlayerCanUnlock) {
			DrawText(DialogFind(Player, "HighSecurityWarning"), 1500, 550, "red", "gray");
		}
	} else {
		
		DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
	}
}

// Catches the item extension clicks
function InventoryItemMiscHighSecurityPadlockClick() {
	var C = CharacterGetCurrent();
	if (!InventoryGroupIsBlocked(C, C.FocusGroup.Name)&& (DialogFocusSourceItem != null && ((DialogFocusSourceItem.Property.MemberNumberList && CommonConvertStringToArray("" + DialogFocusSourceItem.Property.MemberNumberList).indexOf(Player.MemberNumber) >= 0)))) {
		if (MouseIn(1135, 920, 230, 64)) {
			if (DialogFocusSourceItem != null && DialogFocusSourceItem.Property != null) {
				var list = CommonConvertStringToArray("" + ElementValue("MemberNumberList").trim())
				if (!InventoryItemMiscHighSecurityPadlockPlayerCanUnlock && list.length > 1 && list.indexOf(Player.MemberNumber) >= 0 ) {
					list = list.filter(x => x !== Player.MemberNumber);
				}
				
				for (let A = 0; A < C.Appearance.length; A++) {
					if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
						C.Appearance[A] = DialogFocusSourceItem;
				}
				
				if (HighSecurityPadlockConfigOwner && Player.Owner && list.indexOf(Player.Owner) < 0) {
					list.push(Player.Owner)
				}
				if (HighSecurityPadlockConfigLover && Player.Lovership) {
					for (let L = 0; L < Player.Lovership.length; L++) {
						if (list.indexOf(Player.Lovership[L]) < 0)
							list.push(Player.Lovership[L].MemberNumber)
					}
				}
				if (HighSecurityPadlockConfigWhitelist && Player.WhiteList) {
					for (let L = 0; L < Player.WhiteList.length; L++) {
						if (list.indexOf(Player.WhiteList[L]) < 0)
							list.push(Player.WhiteList[L])
					}
				}
				
				DialogFocusSourceItem.Property.MemberNumberList = "" + 
					CommonConvertArrayToString(list) // Convert to array and back; can only save strings on server
				ElementValue("MemberNumberList", DialogFocusSourceItem.Property.MemberNumberList);
				
				if (CurrentScreen == "ChatRoom") {
					var Dictionary = [];
					Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
					Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
					Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
					ChatRoomPublishCustomAction("HighSecurityUpdate", true, Dictionary);
					InventoryItemMiscHighSecurityPadlockExit();
				}
				else {
					CharacterRefresh(C);
					InventoryItemMiscHighSecurityPadlockExit();
				}
			}
			
			
			return;
		}
		if (MouseIn(1450, 700, 64, 64)) {HighSecurityPadlockConfigOwner = !HighSecurityPadlockConfigOwner; return;}
		if (MouseIn(1450, 780, 64, 64)) {HighSecurityPadlockConfigLover = !HighSecurityPadlockConfigLover; return;}
		if (MouseIn(1450, 860, 64, 64)) {HighSecurityPadlockConfigWhitelist = !HighSecurityPadlockConfigWhitelist; return;}
	}
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemMiscHighSecurityPadlockExit()
	

	
	
}


function InventoryItemMiscHighSecurityPadlockExit() {
	ElementRemove("MemberNumberList");
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}
