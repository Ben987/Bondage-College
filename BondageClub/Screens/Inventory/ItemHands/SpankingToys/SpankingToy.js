"use strict";
const SpankingInventory = [
	{
		Name: "Crop",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }]
	}, {
		Name: "Flogger",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }]
	}, {
		Name: "Cane",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Wink", Timer: 5 }]
	}, {
		Name: "HeartCrop",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }]
	}, {
		Name: "Paddle",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "High", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Closed", Timer: 5 }]
	}, {
		Name: "WhipPaddle",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Wink", Timer: 5 }]
	}, {
		Name: "Whip",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Wink", Timer: 5 }]
	}, {
		Name: "CattleProd",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }],
		ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Wink", Timer: 5 }]
	}, {
		Name: "TennisRacket",
		ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }]
	}
];

var SpankingCurrentType = "Crop";
var SpankingInventoryOffset = 0;
var SpankingNextButton = false;
var SpankingPlayerInventory;

// Loads the item extension properties
function InventoryItemHandsSpankingToysLoad() {
	SpankingPlayerInventory = SpankingInventory.filter(x => Player.Inventory.map(i => i.Name).includes("SpankingToys" + x.Name));
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: SpankingCurrentType };
	if (SpankingPlayerInventory.length > 4) SpankingNextButton = true;
}


// get the type of the SpankingToy that the character holds
function InventorySpankingToysGetType(C) {
	var Toy = InventoryGet(C, "ItemHands");
	if (Toy && Toy.Property && Toy.Property.Type) return Toy.Property.Type;
	return SpankingCurrentType;
}

// get the description of the SpankingToy that the character holds
function InventorySpankingToysGetDescription(C) {
	var Type = InventorySpankingToysGetType(C);
	var A = AssetGet(C.AssetFamily, "ItemHands", "SpankingToys" + Type);
	return A && A.Description || "MISSING DESCRIPTION";
}