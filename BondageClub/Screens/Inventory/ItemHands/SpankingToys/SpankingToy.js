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
		Name: "TennisRacket",
		ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }]
	}
];

var SpankingCurrentType = "Crop";

// get the type of the SpankingToy that the Player holds
function InventorySpankingToysGetType() {
	var Toy = InventoryGet(Player, "ItemHands");
	if (Toy && Toy.Property && Toy.Property.Type) return Toy.Property.Type;
	return SpankingCurrentType;
} 