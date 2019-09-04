"use strict";

var InventoryItemPelvisLoveChastityBeltLastAction = "";

// Loads the item extension properties
function InventoryItemPelvisLoveChastityBeltLoad() {
  if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: "Open", Intensity: -1, ShowText: true, LockButt: false };
  if (DialogFocusItem.Property.Type == null) DialogFocusItem.Property.Type = "Open";
  if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = -1;
  if (DialogFocusItem.Property.ShowText == null) DialogFocusItem.Property.ShowText = true;
  if (DialogFocusItem.Property.LockButt == null) DialogFocusItem.Property.LockButt = false;
  InventoryItemPelvisLoveChastityBeltLoadType();
}

// Draw the item extension screen
function InventoryItemPelvisLoveChastityBeltDraw() {
  DrawRect(1387, 225, 225, 275, "white");
  DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
  DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
  DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");

  if ((DialogFocusItem.Property.Type == "Vibe") && (DialogFocusItem.Property.Intensity > -1)) DrawButton(1200, 600, 250, 65, DialogFind(Player, "TurnOff"), "White");
  if (DialogFocusItem.Property.Type == "Shock") {
    DrawButton(1200, 600, 250, 65, DialogFind(Player, "TriggerShock"), "White");
    if (CurrentScreen == "ChatRoom" || true) {
      DrawButton(1200, 500, 64, 64, "", "White", DialogFocusItem.Property.ShowText ? "Icons/Checked.png" : "");
      DrawText(DialogFind(Player, "ShockCollarShowChat"), 1445, 533, "White", "Gray");
    }
  }
  if (InventoryItemPelvisLoveChastityBeltIntensityCanDecrease()) DrawButton(1200, 700, 250, 65, DialogFind(Player, "Decrease"), "White");
  if (InventoryItemPelvisLoveChastityBeltIntensityCanIncrease()) DrawButton(1550, 700, 250, 65, DialogFind(Player, "Increase"), "White");

  DrawButton(1550, 800, 250, 65, DialogFind(Player, DialogFocusItem.Property.LockButt ? "LoveChastityBeltUnlockButt" : "LoveChastityBeltLockButt"), "White");

  // trigger shock

  if ((DialogFocusItem.Property.Type == "Closed") || (DialogFocusItem.Property.Type == "Vibe") || (DialogFocusItem.Property.Type == "Shock")) {
    DrawButton(1200, 800, 250, 65, DialogFind(Player, "LoveChastityBeltUnlock" + DialogFocusItem.Property.Type), "White");
  } else {
    DrawButton(1200, 800, 250, 65, DialogFind(Player, "LoveChastityBeltAddShield"), "White");
    if (InventoryGet(((Player.FocusGroup != null) ? Player : CurrentCharacter), "ItemVulva") == null) {
      DrawButton(1200, 900, 250, 65, DialogFind(Player, "LoveChastityBeltAddVibe"), "White");
      DrawButton(1550, 900, 250, 65, DialogFind(Player, "LoveChastityBeltAddShock"), "White");
    }
  }
}

// Catches the item extension clicks
function InventoryItemPelvisLoveChastityBeltClick() {
  if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;

  if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 600) && (MouseY <= 665) && (DialogFocusItem.Property.Type == "Vibe") && (DialogFocusItem.Property.Intensity > -1)) InventoryItemPelvisLoveChastityBeltSetIntensity(-1 - DialogFocusItem.Property.Intensity);


  if (DialogFocusItem.Property.Type == "Shock") {
    if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 600) && (MouseY <= 665)) InventoryItemPelvisLoveChastityBeltTriggerShock();
    if ((MouseX >= 1200) && (MouseX <= 1264) && (MouseY >= 500) && (MouseY <= 564) && (CurrentScreen == "ChatRoom")) {
      DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
    }
  }

  if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 700) && (MouseY <= 765) && InventoryItemPelvisLoveChastityBeltIntensityCanDecrease()) InventoryItemPelvisLoveChastityBeltSetIntensity(-1);
  if ((MouseX >= 1550) && (MouseX <= 1800) && (MouseY >= 700) && (MouseY <= 765) && InventoryItemPelvisLoveChastityBeltIntensityCanIncrease()) InventoryItemPelvisLoveChastityBeltSetIntensity(1);

  if ((MouseX >= 1550) && (MouseX <= 1800) && (MouseY >= 800) && (MouseY <= 865)) {
    DialogFocusItem.Property.LockButt = !DialogFocusItem.Property.LockButt;
    console.log("Butt " + DialogFocusItem.Property.LockButt.toString());
    InventoryItemPelvisLoveChastityBeltUpdate();
    CharacterRefresh((Player.FocusGroup != null) ? Player : CurrentCharacter);
  }


  if ((DialogFocusItem.Property.Type == "Closed") || (DialogFocusItem.Property.Type == "Vibe") || (DialogFocusItem.Property.Type == "Shock")) {
    if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 800) && (MouseY <= 865)) {
      DialogFocusItem.Property.Type = "Open";
      InventoryItemPelvisLoveChastityBeltLastAction = "Open";
      InventoryItemPelvisLoveChastityBeltUpdate();
      InventoryExpressionTrigger(CharacterGetCurrent(), DialogFocusItem);
      ChatRoomPublishCustomAction((DialogFindAutoReplace(Player, "LoveChastityBeltRemoveShieldMessage")));
    }
  } else {
    if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 800) && (MouseY <= 865)) {
      DialogFocusItem.Property.Type = "Closed";
      InventoryItemPelvisLoveChastityBeltLastAction = "Close";
      InventoryItemPelvisLoveChastityBeltUpdate();
      InventoryExpressionTrigger(CharacterGetCurrent(), DialogFocusItem);
      ChatRoomPublishCustomAction((DialogFindAutoReplace(Player, "LoveChastityBeltAddShieldMessage")));
    }
    if (InventoryGet(((Player.FocusGroup != null) ? Player : CurrentCharacter), "ItemVulva") == null) {
      if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 900) && (MouseY <= 965)) {
        InventoryItemPelvisLoveChastityBeltLastAction = "Vibe";
        DialogFocusItem.Property.Type = "Vibe";
        InventoryItemPelvisLoveChastityBeltUpdate();
        InventoryExpressionTrigger(CharacterGetCurrent(), DialogFocusItem);
        ChatRoomPublishCustomAction((DialogFindAutoReplace(Player, "LoveChastityBeltAddVibeMessage")));
      }
      if ((MouseX >= 1550) && (MouseX <= 1800) && (MouseY >= 900) && (MouseY <= 965)) {
        InventoryItemPelvisLoveChastityBeltLastAction = "Shock";
        DialogFocusItem.Property.Type = "Shock";
        InventoryItemPelvisLoveChastityBeltUpdate();
        InventoryExpressionTrigger(CharacterGetCurrent(), DialogFocusItem);
        ChatRoomPublishCustomAction((DialogFindAutoReplace(Player, "LoveChastityBeltAddShockMessage")));
      }
    }
  }
}

// updates the belt on character
function InventoryItemPelvisLoveChastityBeltUpdate() {
  InventoryItemPelvisLoveChastityBeltLoadType();
  CharacterRefresh(CharacterGetCurrent());
  if (CharacterGetCurrent().ID == 0) ServerPlayerAppearanceSync();
}

// checks if the intensity can be increased
function InventoryItemPelvisLoveChastityBeltIntensityCanIncrease() {
  if (DialogFocusItem.Property.Type == "Vibe") {
    return DialogFocusItem.Property.Intensity < 3;
  } else if (DialogFocusItem.Property.Type == "Shock") {
    return DialogFocusItem.Property.Intensity < 2;
  } else {
    return false;
  }
}

// checks if the intensity can be decreased
function InventoryItemPelvisLoveChastityBeltIntensityCanDecrease() {
  if (DialogFocusItem.Property.Type == "Vibe") {
    return DialogFocusItem.Property.Intensity > -1;
  } else if (DialogFocusItem.Property.Type == "Shock") {
    return DialogFocusItem.Property.Intensity > 0;
  } else {
    return false;
  }
}

// triggers the shock
function InventoryItemPelvisLoveChastityBeltTriggerShock() {
  InventoryItemPelvisLoveChastityBeltLastAction = "ShockTriggered";
  InventoryExpressionTrigger(CharacterGetCurrent(), DialogFocusItem);
  ChatRoomPublishCustomAction((DialogFindAutoReplace(Player, "LoveChastityBeltShockTrigger" + DialogFocusItem.Property.Intensity)), true);
}

// loads the belt into a correct state
function InventoryItemPelvisLoveChastityBeltLoadType() {
  if (DialogFocusItem.Property.Type == "Open") {
    DialogFocusItem.Property.Effect = null;
    DialogFocusItem.Property.Block = null;
    if (DialogFocusItem.Property.LockButt == true) DialogFocusItem.Property.Block = ["ItemButt"];
  } else {
    DialogFocusItem.Property.Block = ["ItemVulva"];
    if (DialogFocusItem.Property.LockButt) DialogFocusItem.Property.Block.push("ItemButt");
    DialogFocusItem.Property.Effect = ["Chaste"];
    if (DialogFocusItem.Property.Type == "Vibe") {
      if (DialogFocusItem.Property.Intensity < -1) DialogFocusItem.Property.Intensity = -1;
      if (DialogFocusItem.Property.Intensity > 3) DialogFocusItem.Property.Intensity = 3;
      DialogFocusItem.Property.Effect.push("Egged");
      if (DialogFocusItem.Property.Intensity >= 0) DialogFocusItem.Property.Effect.push("Vibrating");
    } else if (DialogFocusItem.Property.Type == "Shock") {
      if (DialogFocusItem.Property.Intensity < 0) DialogFocusItem.Property.Intensity = 0;
      if (DialogFocusItem.Property.Intensity > 2) DialogFocusItem.Property.Intensity = 2;
    }
  }
}

// set intensity for vibe or shock device
function InventoryItemPelvisLoveChastityBeltSetIntensity(Modifier) {
  var C = CharacterGetCurrent();
  DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;
  var Type = DialogFocusItem.Property.Type;
  if (DialogFocusItem.Property.Type == "Vibe") {
    if (DialogFocusItem.Property.Intensity == -1) DialogFocusItem.Property.Effect = ["Egged"];
    if (DialogFocusItem.Property.Intensity == 0) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
    if (DialogFocusItem.Property.Intensity == 1) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
    if (DialogFocusItem.Property.Intensity == 2) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
    if (DialogFocusItem.Property.Intensity == 3) DialogFocusItem.Property.Effect = ["Egged", "Vibrating"];
    CharacterLoadEffect(C);
    if (C.ID == 0) ServerPlayerAppearanceSync();
  }
  if (Type == "Vibe") {
    ChatRoomPublishCustomAction((DialogFindAutoReplace(Player, "LoveChastityBeltVibe" + ((Modifier > 0) ? "Increase" : "Decrease") + "To" + DialogFocusItem.Property.Intensity)));
  } else if (DialogFocusItem.Property.ShowText) {
    ChatRoomPublishCustomAction((DialogFindAutoReplace(Player, "LoveChastityBeltShockSet" + DialogFocusItem.Property.Intensity)));
  }
}