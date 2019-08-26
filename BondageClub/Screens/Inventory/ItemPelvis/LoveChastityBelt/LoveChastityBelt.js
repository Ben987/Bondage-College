"use strict";

// Loads the item extension properties
function InventoryItemPelvisLoveChastityBeltLoad() {
  if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: "Open", Intensity: -1, ShowText: true, LockButt: false };
  if (DialogFocusItem.Property.Type == null) DialogFocusItem.Property.Type = "Open";
  if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = -1;
  if (DialogFocusItem.Property.ShowText == null) DialogFocusItem.Property.ShowText = true;
  if (DialogFocusItem.Property.LockButt == null) DialogFocusItem.Property.LockButt = true;
  InventoryItemPelvisLoveChastityBeltLoadType();
}

// Draw the item extension screen
function InventoryItemPelvisLoveChastityBeltDraw() {
  DrawRect(1387, 225, 225, 275, "white");
  DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
  DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
  DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");

  if ((DialogFocusItem.Property.Type == "Vibe") && (DialogFocusItem.Property.Intensity > -1)) DrawButton(950, 700, 250, 65, DialogFind(Player, "TurnOff"), "White");
  if (InventoryItemPelvisLoveChastityBeltIntensityCanDecrease()) DrawButton(1200, 700, 250, 65, DialogFind(Player, "Decrease"), "White");
  if (InventoryItemPelvisLoveChastityBeltIntensityCanIncrease()) DrawButton(1550, 700, 250, 65, DialogFind(Player, "Increase"), "White");

  // trigger shock

  if ((DialogFocusItem.Property.Type == "Closed") || (DialogFocusItem.Property.Type == "Vibe") || (DialogFocusItem.Property.Type == "Shock")) {
    // Butt lock/unlock
    // unlock
  } else {
    // lock
    if (InventoryGet(((Player.FocusGroup != null) ? Player : CurrentCharacter), "ItemVulva") == null) {
      // add vibe/shock
    }
  }
}

// Catches the item extension clicks
function InventoryItemPelvisLoveChastityBeltClick() {
  if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;

  if ((MouseX >= 850) && (MouseX <= 1100) && (MouseY >= 700) && (MouseY <= 765) && (DialogFocusItem.Property.Type == "Vibe") && (DialogFocusItem.Property.Intensity > -1)) InventoryItemPelvisLoveChastityBeltSetIntensity(-1 - DialogFocusItem.Property.Intensity);
  // if ((MouseX >= 850) && (MouseX <= 1100) && (MouseY >= 700) && (MouseY <= 765) && (DialogFocusItem.Property.Type == "Shock")
  if ((MouseX >= 1200) && (MouseX <= 1450) && (MouseY >= 700) && (MouseY <= 765) && InventoryItemPelvisLoveChastityBeltIntensityCanDecrease()) InventoryItemPelvisLoveChastityBeltSetIntensity(-1);
  if ((MouseX >= 1550) && (MouseX <= 1800) && (MouseY >= 700) && (MouseY <= 765) && InventoryItemPelvisLoveChastityBeltIntensityCanIncrease()) InventoryItemPelvisLoveChastityBeltSetIntensity(1);
  // InventoryItemPelvisLoveChastityBeltSetIntensity(-1 - DialogFocusItem.Property.Intensity);
}

function InventoryItemPelvisLoveChastityBeltIntensityCanIncrease() {
  if (DialogFocusItem.Property.Type == "Vibe") {
    return DialogFocusItem.Property.Intensity < 3;
  } else if (DialogFocusItem.Property.Type == "Shock") {
    return DialogFocusItem.Property.Intensity < 2;
  } else {
    return false;
  }
}

function InventoryItemPelvisLoveChastityBeltIntensityCanDecrease() {
  if (DialogFocusItem.Property.Type == "Vibe") {
    return DialogFocusItem.Property.Intensity > -1;
  } else if (DialogFocusItem.Property.Type == "Shock") {
    return DialogFocusItem.Property.Intensity > 0;
  } else {
    return false;
  }
}

function InventoryItemPelvisLoveChastityBeltCanInsert() {
  return (DialogFocusItem.Property.Type == "Open") && (InventoryGet(((Player.FocusGroup != null) ? Player : CurrentCharacter), "ItemVulva") == null);
}

function InventoryItemPelvisLoveChastityBeltLoadType() {
  if (DialogFocusItem.Property.Type == "Open") {
    DialogFocusItem.Property.Effect = null;
    DialogFocusItem.Property.Block = null;
  } else {
    DialogFocusItem.Property.Block = ["ItemVulva"];
    if (DialogFocusItem.Property.LockButt) DialogFocusItem.Property.Block.push("ItemButt");
    DialogFocusItem.Property.Effect = ["Chaste"];
    if (DialogFocusItem.Property.Type == "Vibe") {
      DialogFocusItem.Property.Effect.push("Egged");
      if (DialogFocusItem.Property.Intensity >= 0) DialogFocusItem.Property.Effect.push("Vibrating");
    } else if (DialogFocusItem.Property.Type == "Shock") {
      if (DialogFocusItem.Property.Intensity < 0) DialogFocusItem.Property.Intensity = 0;
    }
  }
}

function InventoryItemPelvisLoveChastityBeltSetIntensity(Modifier) {
  var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
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
  ChatRoomPublishCustomAction((DialogFind(Player, "LoveChastityBelt" + Type + ((Modifier > 0) ? "Increase" : "Decrease") + "To" + DialogFocusItem.Property.Intensity)).replace("DestinationCharacter", C.Name), true);
}