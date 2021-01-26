"use strict";

const VacbedDevicesOptions = [
	{
		Name: "Normal",
		Property: { Type: null}
	}, {
		Name: "Nohair",
		Property: {
			Type: "Nohair",
			Hide: ["HairFront", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Hat"],
    },
}
];

function InventoryItemDevicesVacbedLoad() {
	ExtendedItemLoad(VacbedDevicesOptions, "SelectVacbedState");
}

function InventoryItemDevicesVacbedDraw() {
	ExtendedItemDraw(VacbedDevicesOptions, "VacbedState");
}

function InventoryItemDevicesVacbedClick() {
	ExtendedItemClick(VacbedDevicesOptions);
}

function InventoryItemDevicesVacbedPublishAction(C, Option) {
	var msg = "DevicesVacbedSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesVacbedNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "VacbedState" + Option.Name, "ItemDevices");
}
