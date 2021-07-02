"use strict";
var InventoryItemDevicesCushionOptions = [
	{
		Name: "Hold",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Kneel",
		Prerequisite: ["NotSuspended", "CanKneel"],
		Property: {
			Type: "Kneel",
			OverrideHeight: { Height: -200, Priority: 21 },
			OverridePriority: 1,
			SetPose: ["Kneel"]
		},
	},
];
// Loads the item extension properties
function InventoryItemDevicesCushionLoad() {
	ExtendedItemLoad(InventoryItemDevicesCushionOptions, "SelectCushionStyle");
}

// Draw the item extension screen
function InventoryItemDevicesCushionDraw() {
	ExtendedItemDraw(InventoryItemDevicesCushionOptions, "CushionType");
}

// Catches the item extension clicks
function InventoryItemDevicesCushionClick() {
	ExtendedItemClick(InventoryItemDevicesCushionOptions);
}
