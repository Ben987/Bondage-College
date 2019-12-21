"use strict";


// Loads the item extension properties
function InventoryItemMiscMistressTimerPadlockLoad() {
    // todo add more precise way to add time
    // todo add more settings for time (max time and min time, then force exit menu) --> scrolling wheel ?
    // todo add id list to check when adding time (setting)
    // todo change picture padlock
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property == null)) DialogFocusSourceItem.Property = {};
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.RemoveItem == null)) DialogFocusSourceItem.Property.RemoveItem = false;
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.ShowTimer == null)) DialogFocusSourceItem.Property.ShowTimer = true;
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.AllowModifyTimer == null)) DialogFocusSourceItem.Property.AllowModifyTimer = false;
}

// Draw the extension screen
function InventoryItemMiscMistressTimerPadlockDraw() {
    if ((DialogFocusItem == null) || (DialogFocusSourceItem.Property.RemoveTimer < CurrentTime)) { InventoryItemMiscMistressTimerPadlockExit(); return; }
    if (DialogFocusSourceItem.Property.ShowTimer) {
        DrawText(DialogFind(Player, "TimerLeft") + " " + TimerToString(DialogFocusSourceItem.Property.RemoveTimer - CurrentTime), 1500, 150, "white", "gray");
    } else { DrawText(DialogFind(Player, "TimerUnknown"), 1500, 150, "white", "gray"); }
    DrawRect(1387, 225, 225, 275, "white");
    DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
    DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
    DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
    if ((Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
        DrawButton(1100, 666, 64, 64, "", "White", (DialogFocusSourceItem.Property.RemoveItem) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player, "RemoveItemWithTimer"), 1550, 698, "white", "gray");
        DrawButton( 1100, 746, 64, 64, "", "White", (DialogFocusSourceItem.Property.ShowTimer) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player,"ShowItemWithTimerRemaining"), 1550, 778, "white", "gray");
        DrawButton(1100, 826, 64, 64, "", "White", (DialogFocusSourceItem.Property.AllowModifyTimer) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player, "AllowModifyTimer"), 1550, 858, "white", "gray");
    } else {
        if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
            DrawText(DialogFind(Player, "LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
        DrawText(DialogFind(Player, (DialogFocusSourceItem.Property.RemoveItem) ? "WillRemoveItemWithTimer" : "WontRemoveItemWithTimer"), 1500, 868, "white", "gray");
    }
    if (Player.CanInteract() && (LogQuery("ClubMistress", "Management") || DialogFocusSourceItem.Property.AllowModifyTimer)) {
        DrawButton(1150, 910, 300, 65, DialogFind(Player, "AddTimerTimeMinutes").replace("TimerTime", DialogFocusItem.Asset.RemoveTimer / 60), "White");
        DrawButton(1550, 910, 300, 65, DialogFind(Player, "AddTimerTimeMinutes").replace("TimerTime", DialogFocusItem.Asset.RemoveTimer * 4 / 60), "White");
    }
}

// Catches the item extension clicks
function InventoryItemMiscMistressTimerPadlockClick() {
    if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemMiscMistressTimerPadlockExit();
    if ((MouseX >= 1100) && (MouseX <= 1164) && (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
        if ((MouseY >= 666) && (MouseY <= 730)) { DialogFocusSourceItem.Property.RemoveItem = !(DialogFocusSourceItem.Property.RemoveItem); }
        if ((MouseY >= 746) && (MouseY <= 810)) { DialogFocusSourceItem.Property.ShowTimer = !(DialogFocusSourceItem.Property.ShowTimer); }
        if ((MouseY >= 826) && (MouseY <= 890)) { DialogFocusSourceItem.Property.AllowModifyTimer = !(DialogFocusSourceItem.Property.AllowModifyTimer); }
        if (CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(CurrentCharacter);
    }
    if ((MouseY >= 910) && (MouseY <= 975) && Player.CanInteract() && (LogQuery("ClubMistress", "Management") || DialogFocusSourceItem.Property.AllowModifyTimer)) {
        if ((MouseX >= 1150) && (MouseX <= 1450)) InventoryItemMiscMistressTimerPadlockAdd(DialogFocusItem.Asset.RemoveTimer);
        if ((MouseX >= 1550) && (MouseX <= 1850)) InventoryItemMiscMistressTimerPadlockAdd(DialogFocusItem.Asset.RemoveTimer * 4);
    }
}

// When a value is added to the timer
function InventoryItemMiscMistressTimerPadlockAdd(TimeToAdd) {
    var TimerBefore = DialogFocusSourceItem.Property.RemoveTimer;
    if (DialogFocusItem.Asset.RemoveTimer > 0) DialogFocusSourceItem.Property.RemoveTimer = Math.min(DialogFocusSourceItem.Property.RemoveTimer + (TimeToAdd * 1000), CurrentTime + (DialogFocusItem.Asset.MaxTimer * 1000));
    if (CurrentScreen == "ChatRoom") {
        var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
        var msg = DialogFind(Player, "MistressTimerAddTime");
        msg = msg.replace("SourceCharacter", Player.Name);
        msg = msg.replace("TimerTime", Math.round((DialogFocusSourceItem.Property.RemoveTimer - TimerBefore) / (1000 * 60)));
        msg = msg.replace("DestinationCharacter", C.Name);
        msg = msg.replace("BodyPart", C.FocusGroup.Description.toLowerCase());
        ChatRoomPublishCustomAction(msg, false);
    }
    else { CharacterRefresh(CurrentCharacter); }
}

// Exits the extended menu
function InventoryItemMiscMistressTimerPadlockExit() {
    DialogFocusItem = null;
    if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}