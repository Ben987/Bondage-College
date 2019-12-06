"use strict";


// Loads the item extension properties
function InventoryItemMiscMistressTimerPadlockLoad() {
    // todo add/change settings available to mistresses only
    // todo fix +15 not working properly...
    // todo change pictures (key + padlock)
    // removeitem not working ?
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property == null)) DialogFocusSourceItem.Property = {};
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.RemoveItem == null)) DialogFocusSourceItem.Property.RemoveItem = false;
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.ShowTimer == null)) DialogFocusSourceItem.Property.ShowTimer = true;
    if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.MaxTimer == null)) DialogFocusSourceItem.Property.MaxTimer = 0;
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
    if (Player.CanInteract() && LogQuery("ClubMistress", "Management")) DrawButton(1350, 700, 300, 65, DialogFind(Player, "AddTimerTime").replace("TimerTime", DialogFocusItem.Asset.RemoveTimer / 60), "White");
    if ((Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
        DrawButton(1100, 816, 64, 64, "", "White", (DialogFocusSourceItem.Property.RemoveItem) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player, "RemoveItemWithTimer"), 1550, 848, "white", "gray");
    } else DrawText(DialogFind(Player, (DialogFocusSourceItem.Property.RemoveItem) ? "WillRemoveItemWithTimer" : "WontRemoveItemWithTimer"), 1500, 868, "white", "gray");
    if (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) {
        //todo test positions
        DrawButton( 1100, 896, 64, 64, "", "White", (DialogFocusSourceItem.Property.ShowTimer) ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player,"ShowItemWithTimerRemaining"), 1550, 928, "white", "gray");
    }
}

// Catches the item extension clicks
function InventoryItemMiscMistressTimerPadlockClick() {
    if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemMiscMistressTimerPadlockExit();
    if ((MouseX >= 1350) && (MouseX <= 1650) && (MouseY >= 700) && (MouseY <= 765) && Player.CanInteract() && LogQuery("ClubMistress", "Management")) InventoryItemMiscMistressTimerPadlockAdd();
    if ((MouseX >= 1100) && (MouseX <= 1164) && (MouseY >= 816) && (MouseY <= 880) && (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
        DialogFocusSourceItem.Property.RemoveItem = !(DialogFocusSourceItem.Property.RemoveItem);
        if (CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(CurrentCharacter);
    }
    if ((MouseX>=1100) && (MouseX<= 1164) && (MouseY >= 896) && (MouseY <= 960) && (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
        //todo test positions too
        DialogFocusSourceItem.Property.ShowTimer = !(DialogFocusSourceItem.Property.ShowTimer);
        if (CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(CurrentCharacter);
    }
}

// When a value is added to the timer
function InventoryItemMiscMistressTimerPadlockAdd() {
    //todo test
    if (DialogFocusItem.Asset.RemoveTimer > 0) DialogFocusSourceItem.Property.RemoveTimer = Math.min(DialogFocusSourceItem.Property.RemoveTimer + (DialogFocusItem.Asset.RemoveTimer * 1000), CurrentTime + (DialogFocusItem.Asset.MaxTimer * 1000));
    if (CurrentScreen == "ChatRoom") {
        var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
        var msg = DialogFind(Player, "MistressTimerAddTime");
        msg = msg.replace("SourceCharacter", Player.Name);
        msg = msg.replace("TimerTime", DialogFocusItem.Asset.RemoveTimer / 60);
        msg = msg.replace("DestinationCharacter", C.Name);
        msg = msg.replace("BodyPart", C.FocusGroup.Description.toLowerCase());
        ChatRoomPublishCustomAction(msg, true);
    }
    InventoryItemMiscMistressTimerPadlockExit();
}

// Exits the extended menu
function InventoryItemMiscMistressTimerPadlockExit() {
    DialogFocusItem = null;
    if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}