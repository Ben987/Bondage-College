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
	const Vibrating = DialogFocusItem.Property.Intensity >= 0 && DialogFocusItem.Property.Type === "Vibe";
	DrawAssetPreview(1387, 225, DialogFocusItem.Asset, {Vibrating});
  if ((DialogFocusItem.Property.Type == "Shock") || (DialogFocusItem.Property.Type == "Vibe"))
    DrawText(DialogFindPlayer("Intensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 550, "White", "Gray");

  if (CharacterGetCurrent().IsOwnedByPlayer()) {

    if ((DialogFocusItem.Property.Type == "Vibe") && (DialogFocusItem.Property.Intensity > -1)) DrawButton(1200, 600, 250, 65, DialogFindPlayer("TurnOff"), "White");
    if (DialogFocusItem.Property.Type == "Shock") {
      DrawButton(1200, 600, 250, 65, DialogFindPlayer("TriggerShock"), "White");
      if (CurrentScreen == "ChatRoom" || true) {
        DrawButton(1200, 900, 64, 64, "", "White", DialogFocusItem.Property.ShowText ? "Icons/Checked.png" : "");
        DrawText(DialogFindPlayer("ShockCollarShowChat"), 1445, 933, "White", "Gray");
      }
    }
    if (InventoryItemPelvisLoveChastityBeltIntensityCanDecrease()) DrawButton(1200, 700, 250, 65, DialogFindPlayer("Decrease"), "White");
    if (InventoryItemPelvisLoveChastityBeltIntensityCanIncrease()) DrawButton(1550, 700, 250, 65, DialogFindPlayer("Increase"), "White");

    DrawButton(1550, 800, 250, 65, DialogFindPlayer(DialogFocusItem.Property.LockButt ? "LoveChastityBeltUnlockButt" : "LoveChastityBeltLockButt"), "White");

    if ((DialogFocusItem.Property.Type == "Closed") || (DialogFocusItem.Property.Type == "Vibe") || (DialogFocusItem.Property.Type == "Shock")) {
      DrawButton(1200, 800, 250, 65, DialogFindPlayer("LoveChastityBeltUnlock" + DialogFocusItem.Property.Type), "White");
    } else {
      DrawButton(1200, 800, 250, 65, DialogFindPlayer("LoveChastityBeltAddShield"), "White");
      if (InventoryItemPelvisLoveChastityBeltCanInsert(CharacterGetCurrent())) {
        DrawButton(1200, 900, 250, 65, DialogFindPlayer("LoveChastityBeltAddVibe"), "White");
        DrawButton(1550, 900, 250, 65, DialogFindPlayer("LoveChastityBeltAddShock"), "White");
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
