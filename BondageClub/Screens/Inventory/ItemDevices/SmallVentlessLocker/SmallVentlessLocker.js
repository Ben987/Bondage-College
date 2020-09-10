"use strict";

const SmallVentlessLockerDevicesOptions = [
	{
		Name: "Seethrough",
		Property: { Type: null}
	}, {
		Name: "Opaque",
		Property: { Type: "Opaque"}
    }
];

function InventoryItemDevicesSmallVentlessLockerLoad() {
	ExtendedItemLoad(SmallVentlessLockerDevicesOptions, "SelectLockerState");
}

function InventoryItemDevicesSmallVentlessLockerDraw() {
	ExtendedItemDraw(SmallVentlessLockerDevicesOptions, "LockerState");
}

function InventoryItemDevicesSmallVentlessLockerClick() {
	ExtendedItemClick(SmallVentlessLockerDevicesOptions);
}

function InventoryItemDevicesSmallVentlessLockerPublishAction(C, Option) {
	var msg = "DevicesLockerSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesSmallVentlessLockerNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "LockerState" + Option.Name, "ItemDevices");
}
