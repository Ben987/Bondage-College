"use strict";

var OwnerTimerChooseList = [1, 2, 4, 8, 16, 24, 48, 72, 96, 120, 144, 168];
var OwnerTimerChooseIndex = 0;

// Loads the item extension properties
function InventoryItemMiscOwnerTimerPadlockLoad() {
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property == null)) DialogFocusSourceItem.Property = {};
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.RemoveItem == null)) DialogFocusSourceItem.Property.RemoveItem = false;
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.ShowTimer == null)) DialogFocusSourceItem.Property.ShowTimer = true;
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.AllowModifyTimer == null)) DialogFocusSourceItem.Property.AllowModifyTimer = false;
}

// Draw the extension screen
function InventoryItemMiscOwnerTimerPadlockDraw() {
    if ((DialogFocusItem == null) || (DialogFocusSourceItem.Property.RemoveTimer < CurrentTime)) { InventoryItemMiscOwnerTimerPadlockExit(); return; }
    if (DialogFocusSourceItem.Property.ShowTimer) {
        DrawText(DialogFind(Player, "TimerLeft") + " " + TimerToString(DialogFocusSourceItem.Property.RemoveTimer - CurrentTime), 1500, 150, "white", "gray");
    } else { DrawText(DialogFind(Player, "TimerUnknown"), 1500, 150, "white", "gray"); }
    DrawRect(1387, 225, 225, 275, "white");
    DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
    DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
    DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
    if ((Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
        MainCanvas.textAlign = "left";
        DrawButton(1100, 666, 64, 64, "", "White", (DialogFocusSourceItem.Property.RemoveItem) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player, "RemoveItemWithTimer"), 1200, 698, "white", "gray");
        DrawButton( 1100, 746, 64, 64, "", "White", (DialogFocusSourceItem.Property.ShowTimer) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player,"ShowItemWithTimerRemaining"), 1200, 778, "white", "gray");
        DrawButton(1100, 826, 64, 64, "", "White", (DialogFocusSourceItem.Property.AllowModifyTimer) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player, "AllowModifyTimer"), 1200, 858, "white", "gray");
        MainCanvas.textAlign = "center";
    } else {
        if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
            DrawText(DialogFind(Player, "LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
        DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Detail"), 1500, 800, "white", "gray");
        DrawText(DialogFind(Player, (DialogFocusSourceItem.Property.RemoveItem) ? "WillRemoveItemWithTimer" : "WontRemoveItemWithTimer"), 1500, 868, "white", "gray");
    }
    if (Player.CanInteract() && ((Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) || DialogFocusSourceItem.Property.AllowModifyTimer)) {
        DrawButton(1100, 910, 250, 70, DialogFind(Player, "AddTimerTime"), "White");
        DrawBackNextButton(1400, 910, 200, 70, OwnerTimerChooseList[OwnerTimerChooseIndex] + " " + DialogFind(Player, "Hours"), "White", "",
            () => OwnerTimerChooseList[(OwnerTimerChooseList.length + OwnerTimerChooseIndex - 1) % OwnerTimerChooseList.length] + " " + DialogFind(Player, "Hours"),
            () => OwnerTimerChooseList[(OwnerTimerChooseIndex + 1) % OwnerTimerChooseList.length] + " " + DialogFind(Player, "Hours"));
    }
}

// Catches the item extension clicks
function InventoryItemMiscOwnerTimerPadlockClick() {
    if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemMiscOwnerTimerPadlockExit();
    if ((MouseX >= 1100) && (MouseX <= 1164) && (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
        if ((MouseY >= 666) && (MouseY <= 730)) { DialogFocusSourceItem.Property.RemoveItem = !(DialogFocusSourceItem.Property.RemoveItem); }
        if ((MouseY >= 746) && (MouseY <= 810)) { DialogFocusSourceItem.Property.ShowTimer = !(DialogFocusSourceItem.Property.ShowTimer); }
        if ((MouseY >= 826) && (MouseY <= 890)) { DialogFocusSourceItem.Property.AllowModifyTimer = !(DialogFocusSourceItem.Property.AllowModifyTimer); }
        if (CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(CurrentCharacter);
    }
    if ((MouseY >= 910) && (MouseY <= 975) && Player.CanInteract() && ((Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) || DialogFocusSourceItem.Property.AllowModifyTimer)) {
        if ((MouseX >= 1100) && (MouseX < 1350)) InventoryItemMiscOwnerTimerPadlockAdd(OwnerTimerChooseList[OwnerTimerChooseIndex] * 60 * 60);
        if ((MouseX >= 1400) && (MouseX < 1600)) {
            if (MouseX <= 1500) OwnerTimerChooseIndex = (OwnerTimerChooseList.length + OwnerTimerChooseIndex - 1) % OwnerTimerChooseList.length;
            else OwnerTimerChooseIndex = (OwnerTimerChooseIndex + 1) % OwnerTimerChooseList.length;
        }
    }
}

// When a value is added to the timer
function InventoryItemMiscOwnerTimerPadlockAdd(TimeToAdd) {
    var TimerBefore = DialogFocusSourceItem.Property.RemoveTimer;
    if (DialogFocusItem.Asset.RemoveTimer > 0) DialogFocusSourceItem.Property.RemoveTimer = Math.min(DialogFocusSourceItem.Property.RemoveTimer + (TimeToAdd * 1000), CurrentTime + (DialogFocusItem.Asset.MaxTimer * 1000));
    if (CurrentScreen == "ChatRoom") {
        var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
        var msg = "TimerAddTime";
        var Dictionary = [];
        Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
        Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
        if (DialogFocusSourceItem.Property.ShowTimer) {
            Dictionary.push({Tag: "TimerTime", Text: Math.round((DialogFocusSourceItem.Property.RemoveTimer - TimerBefore) / (1000 * 60 * 60))});
            Dictionary.push({Tag: "TimerUnit", TextToLookUp: "Hours"});
        }
        else {
            Dictionary.push({Tag: "TimerTime", TextToLookUp: "TimerAddUnknownTime"});
            Dictionary.push({Tag: "TimerUnit", Text: ""});
        }
        Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
        ChatRoomPublishCustomAction(msg, true, Dictionary);
    }
    else { CharacterRefresh(CurrentCharacter); }
    InventoryItemMiscTimerPadlockExit();
}

// Exits the extended menu
function InventoryItemMiscOwnerTimerPadlockExit() {
    DialogFocusItem = null;
    if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}