"use strict";
var InventoryItemTorsoLatexCorset1Options = [
	{
		Name: "Garter",
		Property: {
			Type: "Garter",
		},
	},
	{
		Name: "NoGarter",
		Property: {
			Type: "Garterless",
		},
	},
];

// Loads the item extension properties
function InventoryItemTorsoLatexCorset1Load() {
	GartersByDefault()
	ExtendedItemLoad(InventoryItemTorsoLatexCorset1Options, "SelectStyle");
}

// Draw the item extension screen
function InventoryItemTorsoLatexCorset1Draw(IsCloth) {
	if(IsCloth == null) IsCloth = false;
	ExtendedItemDraw(InventoryItemTorsoLatexCorset1Options, "StyleType", null, true, IsCloth);
}

// Catches the item extension clicks
function InventoryItemTorsoLatexCorset1Click(IsCloth) {
	if(IsCloth == null) IsCloth = false;
	ExtendedItemClick(InventoryItemTorsoLatexCorset1Options, IsCloth);
}

function GartersByDefault() {
	if (DialogFocusItem.Property == null) {
		DialogFocusItem.Property = { Type: "Garter" };
		const C = CharacterGetCurrent();
		CharacterRefresh(C);
		if (CurrentScreen == "ChatRoom") {
			ChatRoomCharacterUpdate(C)
		}
	}
	if (DialogFocusItem.Property.Type == null) {
		DialogFocusItem.Property.Type = "Garter";
		const C = CharacterGetCurrent();
		CharacterRefresh(C);
		if (CurrentScreen == "ChatRoom") {
			ChatRoomCharacterUpdate(C)
		}
	}
}