"use strict";

var InventoryItemDevicesPetBedOptions = [
	{
		Name: "NoBlanket",
		Property: { 
			Type: null 
		},
	},
	{
		Name: "Blanket",
		Property: { 
			Type: "Blanket", 
			SetPose: ["AllFours"],
			Hide: ["ItemArms", "ItemButt", "TailStraps", "Wings"],
			Block: [
				"ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemBoots",
				"ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", 
				"ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings"
			]
		},
	},
];

// Loads the item extension properties
function InventoryItemDevicesPetBedLoad() {
	ExtendedItemLoad(InventoryItemDevicesPetBedOptions, "SelectPetBedType");
}

// Draw the item extension screen
function InventoryItemDevicesPetBedDraw() {
	ExtendedItemDraw(InventoryItemDevicesPetBedOptions, "PetBedType");
}

// Catches the item extension clicks
function InventoryItemDevicesPetBedClick() {
	ExtendedItemClick(InventoryItemDevicesPetBedOptions);
}

function InventoryItemDevicesPetBedPublishAction(C, Option) {
	var msg = "PetBedSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesPetBedNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "PetBedSet" + Option.Name, "ItemDevices");
}
