"use strict"

// Loads the item extension properties
function InventoryItemPelvisAdvancedChastityBeltLoad() {
  if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null }
}

// Draw the item extension screen
function InventoryItemPelvisAdvancedChastityBeltDraw() {
  // Draw the header and item
  DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
  DrawRect(1387, 125, 225, 275, "white");
  DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
  DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
}

// Catches the item extension clicks
function InventoryItemPelvisAdvancedChastityBeltClick() {
  if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
}