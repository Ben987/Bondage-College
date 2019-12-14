"use strict";


// Loads the item extension properties
function InventoryItemMiscMistressTimerPadlockLoad() {
    // todo add more precise way to add time
    // todo keep changes to lock if offline through online
    // todo find/change pictures (key + padlock)
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
    if (Player.CanInteract() && (LogQuery("ClubMistress", "Management") || DialogFocusSourceItem.Property.AllowModifyTimer)) {
        DrawButton(1150, 650, 300, 65, DialogFind(Player, "AddTimerTime").replace("TimerTime", DialogFocusItem.Asset.RemoveTimer / 60), "White");
        DrawButton(1550, 650, 300, 65, DialogFind(Player, "AddTimerTime").replace("TimerTime", DialogFocusItem.Asset.RemoveTimer * 4 / 60), "White");
    }
    if ((Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
        DrawButton(1100, 766, 64, 64, "", "White", (DialogFocusSourceItem.Property.RemoveItem) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player, "RemoveItemWithTimer"), 1550, 798, "white", "gray");
        DrawButton( 1100, 846, 64, 64, "", "White", (DialogFocusSourceItem.Property.ShowTimer) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player,"ShowItemWithTimerRemaining"), 1550, 878, "white", "gray");
        DrawButton(1100, 926, 64, 64, "", "White", (DialogFocusSourceItem.Property.AllowModifyTimer) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player, "AllowModifyTimer"), 1550, 958, "white", "gray");
    } else DrawText(DialogFind(Player, (DialogFocusSourceItem.Property.RemoveItem) ? "WillRemoveItemWithTimer" : "WontRemoveItemWithTimer"), 1500, 868, "white", "gray");
}

// Catches the item extension clicks
function InventoryItemMiscMistressTimerPadlockClick() {
    if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemMiscMistressTimerPadlockExit();
    if ((MouseY >= 650) && (MouseY <= 715) && Player.CanInteract() && (LogQuery("ClubMistress", "Management") || DialogFocusSourceItem.Property.AllowModifyTimer)) {
        if ((MouseX >= 1150) && (MouseX <= 1450)) InventoryItemMiscMistressTimerPadlockAdd(DialogFocusItem.Asset.RemoveTimer);
        if ((MouseX >= 1550) && (MouseX <= 1850)) InventoryItemMiscMistressTimerPadlockAdd(DialogFocusItem.Asset.RemoveTimer * 4);
    }
    if ((MouseX >= 1100) && (MouseX <= 1164) && (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
        if ((MouseY >= 766) && (MouseY <= 830)) { DialogFocusSourceItem.Property.RemoveItem = !(DialogFocusSourceItem.Property.RemoveItem); }
        if ((MouseY >= 846) && (MouseY <= 910)) { DialogFocusSourceItem.Property.ShowTimer = !(DialogFocusSourceItem.Property.ShowTimer); }
        if ((MouseY >= 926) && (MouseY <= 990)) { DialogFocusSourceItem.Property.AllowModifyTimer = !(DialogFocusSourceItem.Property.AllowModifyTimer); }
        if (CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(CurrentCharacter);
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