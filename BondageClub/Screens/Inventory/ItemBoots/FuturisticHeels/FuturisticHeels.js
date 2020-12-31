"use strict";

var InventoryItemBootsFuturisticHeelsOptions = [
	{
		Name: "Shoes",
		Property: {Type: null, Height: 6},
	},
	{
		Name: "Heel",
		Property: { Type: "Heel", Height: 16 },
	},
]

function InventoryItemBootsFuturisticHeelsLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else
		ExtendedItemLoad(InventoryItemBootsFuturisticHeelsOptions, "FuturisticHeelsType");
}

function InventoryItemBootsFuturisticHeelsDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else
		ExtendedItemDraw(InventoryItemBootsFuturisticHeelsOptions, "FuturisticHeelsType");
	
}

function InventoryItemBootsFuturisticHeelsClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else {
		var DialogFocusItem_Temp = DialogFocusItem
		var origHeight = 6
		if (DialogFocusItem_Temp && DialogFocusItem_Temp.Property && DialogFocusItem_Temp.Asset) {
			origHeight = DialogFocusItem_Temp.Property.Height
		}
		ExtendedItemClick(InventoryItemBootsFuturisticHeelsOptions);
		// Set height because height isnt a property
		if (DialogFocusItem_Temp && DialogFocusItem_Temp.Property && DialogFocusItem_Temp.Asset) {
			if (origHeight != DialogFocusItem_Temp.Property.Height) {
				DialogFocusItem_Temp.Height = DialogFocusItem_Temp.Property.Height
				DialogFocusItem_Temp.Asset.HeightModifier = DialogFocusItem_Temp.Property.Height
				
				
				CharacterRefresh(C, true); // Does not sync appearance while in the wardrobe
				ChatRoomCharacterUpdate(C);
			}
			
		}
	}
}

function InventoryItemBootsFuturisticHeelsExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}

function InventoryItemBootsFuturisticHeelsPublishAction(C, Option) {
	var msg = "FuturisticHeelsSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemBootsFuturisticHeelsValidate(C) { 
	return InventoryItemMouthFuturisticPanelGagValidate(C, Option); // All futuristic items refer to the gag
}

