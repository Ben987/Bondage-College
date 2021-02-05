"use strict";

var InventoryItemArmsFuturisticStraitjacketOptions = [
	{
		Name: "HandsFront",
		Property: { Type: null,
				HideItem: ["ItemButtAnalBeads2",
					// Chastity belts
					"LeatherChastityBelt", "SleekLeatherChastityBelt", "StuddedChastityBelt", "MetalChastityBelt", "PolishedChastityBelt", "FuturisticChastityBelt", "FuturisticChastityBelt2", "OrnateChastityBelt", "SteelChastityPanties", "LoveChastityBelt",
					// Chastity bras
					"MetalChastityBra", "PolishedChastityBra", "FuturisticBra", "FuturisticBra2", "OrnateChastityBra"
				],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemBreast", "ItemHands"],
				},
	},
	{
		Name: "HandsBack",
		Property: { Type: "HandsBack",
				HideItem: ["ItemButtAnalBeads2",
					// Chastity belts
					"LeatherChastityBelt", "SleekLeatherChastityBelt", "StuddedChastityBelt", "MetalChastityBelt", "PolishedChastityBelt", "FuturisticChastityBelt", "FuturisticChastityBelt2", "OrnateChastityBelt", "SteelChastityPanties", "LoveChastityBelt",
					// Chastity bras
					"MetalChastityBra", "PolishedChastityBra", "FuturisticBra", "FuturisticBra2", "OrnateChastityBra"
				],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemBreast", "ItemHands"],
				},
	},
	{
		Name: "HandsFrontChastity",
		Property: { Type: "HandsFrontChastity",
				HideItem: ["ItemButtAnalBeads2"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemHands"],
				},
	},
	{
		Name: "HandsBackChastity",
		Property: { Type: "HandsBackChastity",
				HideItem: ["ItemButtAnalBeads2"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemHands"],
				},
	},
];

// Loads the item extension properties
function InventoryItemArmsFuturisticStraitjacketLoad() {
 	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else
	ExtendedItemLoad(InventoryItemArmsFuturisticStraitjacketOptions, "SelectFuturisticStraitjacketType");
}

// Draw the item extension screen
function InventoryItemArmsFuturisticStraitjacketDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else
		ExtendedItemDraw(InventoryItemArmsFuturisticStraitjacketOptions, "FuturisticStraitjacketType");
}

// Catches the item extension clicks
function InventoryItemArmsFuturisticStraitjacketClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else
		ExtendedItemClick(InventoryItemArmsFuturisticStraitjacketOptions);
}

function InventoryItemArmsFuturisticStraitjacketExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}
	
function InventoryItemArmsFuturisticStraitjacketValidate(C, Option) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Option)
}

function InventoryItemArmsFuturisticStraitjacketPublishAction(C, Option) {
	var msg = "FuturisticStraitjacketSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}
