"use strict";
var InventoryCorsetLatexCorset1Options = [
	{
		Name: "Garter",
		Property: {
			Type: null,
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
function InventoryCorsetLatexCorset1Load() {
	ExtendedItemLoad(InventoryCorsetLatexCorset1Options, "SelectStyle");
}

// Draw the item extension screen
function InventoryCorsetLatexCorset1Draw(IsCloth) {
	if (IsCloth == null) IsCloth = true;
	ExtendedItemDraw(InventoryCorsetLatexCorset1Options, "StyleType", null, true, IsCloth);
}

// Catches the item extension clicks
function InventoryCorsetLatexCorset1Click(IsCloth) {
	if (IsCloth == null) IsCloth = true;
	ExtendedItemClick(InventoryCorsetLatexCorset1Options, IsCloth);
}
