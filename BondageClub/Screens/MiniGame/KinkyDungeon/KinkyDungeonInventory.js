"use strict";

var KinkyDungeonDressesList = {};

var KinkyDungeonCheckClothesLoss = false;

function KinkyDungeonInitializeDresses() {
	KinkyDungeonCheckClothesLoss = true;
	KinkyDungeonDresses = {
		"Default" : [
		{Item: "WitchHat1", Group: "Hat", Color: "Default", Lost: false},
		{Item: "LeatherCorsetTop1", Group: "Cloth", Color: "Default", Lost: false},
		{Item: "LatexSkirt1", Group: "ClothLower", Color: "Default", Lost: false, Skirt: true},
		{Item: "Socks4", Group: "Socks", Color: "#444444", Lost: false},
		{Item: "Heels3", Group: "Shoes", Color: "#222222", Lost: false},
		{Item: "KittyPanties1", Group: "Panties", Color: "#222222", Lost: false},
		{Item: "FrameBra2", Group: "Bra", Color: "Default", Lost: false},
		{Item: "LatexElbowGloves", Group: "Gloves", Color: "Default", Lost: false},
		{Item: "Necklace4", Group: "Necklace", Color: "#222222", Lost: false},
		]
	};
}



function KinkyDungeonDressPlayer() {
	if (KinkyDungeonCheckClothesLoss) {
		CharacterNaked(KinkyDungeonPlayer);
		KinkyDungeonUndress = 0;
	}

	for (let C = 0; C < KinkyDungeonDresses[KinkyDungeonCurrentDress].length; C++) {
		let clothes = KinkyDungeonDresses[KinkyDungeonCurrentDress][C];
		let PreviouslyLost = clothes.Lost;

		if (!clothes.Lost && KinkyDungeonCheckClothesLoss) {
			if (clothes.Group == "Necklace" || clothes.Group == "Bra") {
				if (KinkyDungeonGetRestraintItem("ItemTorso") && KinkyDungeonGetRestraintItem("ItemTorso").restraint.harness) clothes.Lost = true;
				if (KinkyDungeonGetRestraintItem("ItemBreast")) clothes.Lost = true;
			}
			if (clothes.Group == "Panties") {
				if (KinkyDungeonGetRestraintItem("ItemPelvis")) clothes.Lost = true;
			}
			if (clothes.Group == "ClothLower" && clothes.Skirt) {
				if (KinkyDungeonGetRestraintItem("ItemTorso") && KinkyDungeonGetRestraintItem("ItemTorso").restraint.harness) clothes.Lost = true;
			}
			if (clothes.Group == "Shoes") {
				if (KinkyDungeonGetRestraintItem("ItemBoots")) clothes.Lost = true;
			}
		}

		if (clothes.Lost != PreviouslyLost) KinkyDungeonStatArousal += 100/KinkyDungeonDresses[KinkyDungeonCurrentDress].length;

		if (!clothes.Lost) {
			if (KinkyDungeonCheckClothesLoss) {
				InventoryWear(KinkyDungeonPlayer, clothes.Item, clothes.Group);
				CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, clothes.Color, clothes.Group);
			}
		} else KinkyDungeonUndress += 1/KinkyDungeonDresses[KinkyDungeonCurrentDress].length;
	}

	KinkyDungeonCheckClothesLoss = false;

	let BlushCounter = 0;
	let Blush = null;

	if (KinkyDungeonStatArousal > 0) BlushCounter += 1;
	if (KinkyDungeonStatArousal > 33) BlushCounter += 1;
	if (KinkyDungeonStatArousal > 66) BlushCounter += 1;

	if (KinkyDungeonUndress > 0.4) BlushCounter += 1;
	if (KinkyDungeonUndress > 0.8) BlushCounter += 1;

	if (BlushCounter == 1) Blush = "Low";
	else if (BlushCounter == 2) Blush = "Medium";
	else if (BlushCounter == 3) Blush = "High";
	else if (BlushCounter == 4) Blush = "VeryHigh";
	else if (BlushCounter == 5) Blush = "Extreme";

	for (let A = 0; A < KinkyDungeonPlayer.Appearance.length; A++) {
		if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Blush") KinkyDungeonPlayer.Appearance[A].Property = { Expression: Blush };
	}

}



function KinkyDungeonHandleInventory() {
	return false;
}

function KinkyDungeonDrawInventory() {

}