"use strict";

const VentlessLockerDevicesOptions = [
	{
		Name: "Seethrough",
		Property: { Type: null}
	}, {
		Name: "Opaque",
		Property: { Type: "Opaque"}
    }
];

function InventoryItemDevicesVentlessLockerLoad() {
	ExtendedItemLoad(VentlessLockerDevicesOptions, "SelectLockerState");
}

function InventoryItemDevicesVentlessLockerDraw() {
	ExtendedItemDraw(VentlessLockerDevicesOptions, "LockerState");
}

function InventoryItemDevicesVentlessLockerClick() {
	ExtendedItemClick(VentlessLockerDevicesOptions);
}

function InventoryItemDevicesVentlessLockerPublishAction(C, Option) {
	var msg = "DevicesLockerSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesVentlessLockerNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "LockerState" + Option.Name, "ItemDevices");
}
