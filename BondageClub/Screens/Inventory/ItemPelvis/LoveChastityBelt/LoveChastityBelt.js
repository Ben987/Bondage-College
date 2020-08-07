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
  if ((DialogFocusItem.Property.Intensity >= 0) && (DialogFocusItem.Property.Type == "Vibe"))
    DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389 + Math.floor(Math.random() * 3) - 1, 227 + Math.floor(Math.random() * 3) - 1, 221, 221);
  else DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
  DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
  if ((DialogFocusItem.Property.Type == "Shock") || (DialogFocusItem.Property.Type == "Vibe"))
    DrawText(DialogFind(Player, "Intensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 550, "White", "Gray");


  DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");

  if (CharacterGetCurrent().IsOwnedByPlayer()) {

    if ((DialogFocusItem.Property.Type == "Vibe") && (DialogFocusItem.Property.Intensity > -1)) DrawButton(1200, 600, 250, 65, DialogFind(Player, "TurnOff"), "White");
    if (DialogFocusItem.Property.Type == "Shock") {
      DrawButton(1200, 600, 250, 65, DialogFind(Player, "TriggerShock"), "White");
      if (CurrentScreen == "ChatRoom" || true) {
        DrawButton(1200, 900, 64, 64, "", "White", DialogFocusItem.Property.ShowText ? "Icons/Checked.png" : "");
        DrawText(DialogFind(Player, "ShockCollarShowChat"), 1445, 933, "White", "Gray");
      }
    }
    if (InventoryItemPelvisLoveChastityBeltIntensityCanDecrease()) DrawButton(1200, 700, 250, 65, DialogFind(Player, "Decrease"), "White");
    if (InventoryItemPelvisLoveChastityBeltIntensityCanIncrease()) DrawButton(1550, 700, 250, 65, DialogFind(Player, "Increase"), "White");

    DrawButton(1550, 800, 250, 65, DialogFind(Player, DialogFocusItem.Property.LockButt ? "LoveChastityBeltUnlockButt" : "LoveChastityBeltLockButt"), "White");

    if ((DialogFocusItem.Property.Type == "Closed") || (DialogFocusItem.Property.Type == "Vibe") || (DialogFocusItem.Property.Type == "Shock")) {
      DrawButton(1200, 800, 250, 65, DialogFind(Player, "LoveChastityBeltUnlock" + DialogFocusItem.Property.Type), "White");
    } else {
      DrawButton(1200, 800, 250, 65, DialogFind(Player, "LoveChastityBeltAddShield"), "White");
      if (InventoryItemPelvisLoveChastityBeltCanInsert(CharacterGetCurrent())) {
        DrawButton(1200, 900, 250, 65, DialogFind(Player, "LoveChastityBeltAddVibe"), "White");
        DrawButton(1550, 900, 250, 65, DialogFind(Player, "LoveChastityBeltAddShock"), "White");
      }
    }
  }
}

// Catches the item extension clicks
function InventoryItemPelvisLoveChastityBeltClick() {
  if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) { DialogFocusItem = null; return; }

  var C = CharacterGetCurrent();
  if (CurrentScreen == "ChatRoom") {
    DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
    InventoryItemPelvisLoveChastityBeltLoad();
  }

  if (C && DialogFocusItem && C.IsOwnedByPlayer()) {
    if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 600) && (MouseY <= 665) && (DialogFocusItem.Property.Type == "Vibe") && (DialogFocusItem.Property.Intensity > -1)) InventoryItemPelvisLoveChastityBeltSetIntensity(-1 - DialogFocusItem.Property.Intensity);

    if (DialogFocusItem.Property.Type == "Shock") {
      if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 600) && (MouseY <= 665)) InventoryItemPelvisLoveChastityBeltTriggerShock();
      if ((MouseX >= 1200) && (MouseX <= 1264) && (MouseY >= 900) && (MouseY <= 964) && (CurrentScreen == "ChatRoom")) {
        DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
      }
    }

    if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 700) && (MouseY <= 765) && InventoryItemPelvisLoveChastityBeltIntensityCanDecrease()) InventoryItemPelvisLoveChastityBeltSetIntensity(-1);
    if ((MouseX >= 1550) && (MouseX <= 1800) && (MouseY >= 700) && (MouseY <= 765) && InventoryItemPelvisLoveChastityBeltIntensityCanIncrease()) InventoryItemPelvisLoveChastityBeltSetIntensity(1);

    if ((MouseX >= 1550) && (MouseX <= 1800) && (MouseY >= 800) && (MouseY <= 865)) {
      DialogFocusItem.Property.LockButt = !DialogFocusItem.Property.LockButt;
      InventoryItemPelvisLoveChastityBeltUpdate();
      CharacterRefresh(C);
      var Dictionary = [];
      Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
      Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
      ChatRoomPublishCustomAction("LoveChastityBeltAction" + (DialogFocusItem.Property.LockButt ? "LockButt" : "UnlockButt"), true, Dictionary);
    }

    if ((DialogFocusItem.Property.Type == "Closed") || (DialogFocusItem.Property.Type == "Vibe") || (DialogFocusItem.Property.Type == "Shock")) {
      if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 800) && (MouseY <= 865)) {
        DialogFocusItem.Property.Intensity = -1;
        InventoryItemPelvisLoveChastityBeltSetTypeTo("Open", "LoveChastityBeltRemoveShieldMessage");
      }
    } else {
      if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 800) && (MouseY <= 865)) {
        InventoryItemPelvisLoveChastityBeltSetTypeTo("Closed", "LoveChastityBeltAddShieldMessage");
      }
      if (InventoryItemPelvisLoveChastityBeltCanInsert(C)) {
        if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 900) && (MouseY <= 965)) {
          InventoryItemPelvisLoveChastityBeltSetTypeTo("Vibe", "LoveChastityBeltAddVibeMessage");
        }
        if ((MouseX >= 1550) && (MouseX <= 1800) && (MouseY >= 900) && (MouseY <= 965)) {
          InventoryItemPelvisLoveChastityBeltSetTypeTo("Shock", "LoveChastityBeltAddShockMessage");
        }
      }
    }
  }
}

// checks if "ItemVulva" is accessible
function InventoryItemPelvisLoveChastityBeltCanInsert(C) {
  for (let A = 0; A < C.Appearance.length; A++)
    if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Family == C.AssetFamily)) {
      if (C.Appearance[A].Asset.Group.Name == "ItemVulva")
        return false;
      if ((C.Appearance[A].Asset.Group.Name == "ItemVulvaPiercings") && (C.Appearance[A].Asset.Block != null) && C.Appearance[A].Asset.Block.includes("ItemVulva"))
        return false;
    }
  return true;
}

// set the type on the belt
function InventoryItemPelvisLoveChastityBeltSetTypeTo(Type, Message) {
  InventoryItemPelvisLoveChastityBeltLastAction = Type;
  DialogFocusItem.Property.Type = Type;
  InventoryItemPelvisLoveChastityBeltUpdate();
  InventoryExpressionTrigger(CharacterGetCurrent(), DialogFocusItem);
  var Dictionary = [];
  Dictionary.push({Tag: "DestinationCharacter", Text: CharacterGetCurrent().Name, MemberNumber: CharacterGetCurrent().MemberNumber});
  Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
  ChatRoomPublishCustomAction(Message, true, Dictionary);
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
  var Dictionary = [];
  Dictionary.push({Tag: "DestinationCharacterName", Text: CharacterGetCurrent().Name, MemberNumber: CharacterGetCurrent().MemberNumber});
  Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
  ChatRoomPublishCustomAction("LoveChastityBeltShockTrigger" + DialogFocusItem.Property.Intensity, true, Dictionary);
}

// loads the belt into a correct state
function InventoryItemPelvisLoveChastityBeltLoadType() {
  if (DialogFocusItem.Property.Type == "Open") {
    DialogFocusItem.Property.Effect = null;
    DialogFocusItem.Property.Block = null;
    if (DialogFocusItem.Property.LockButt == true) DialogFocusItem.Property.Block = ["ItemButt"];
  } else {
    DialogFocusItem.Property.Block = ["ItemVulva", "ItemVulvaPiercings"];
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
  CharacterRefresh(C);
  if (Type == "Vibe") {
    ChatRoomPublishCustomAction("LoveChastityBeltVibe" + ((Modifier > 0) ? "Increase" : "Decrease") + "To" + DialogFocusItem.Property.Intensity, true, [{Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber}]);
  } else if (DialogFocusItem.Property.ShowText) {
    var Dictionary = [];
    Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
    Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
    ChatRoomPublishCustomAction("LoveChastityBeltShockSet" + DialogFocusItem.Property.Intensity, true, Dictionary);
  }
}
