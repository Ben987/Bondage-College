"use strict";

const LockerDevicesOptions = [
	{
		Name: "Seethrough",
		Property: { Type: null}
	}, {
		Name: "Opaque",
		Property: { Type: "Opaque"}
    }
];

function InventoryItemDevicesLockerLoad() {
	ExtendedItemLoad(LockerDevicesOptions, "SelectLockerState");
}

function InventoryItemDevicesLockerDraw() {
	ExtendedItemDraw(LockerDevicesOptions, "LockerState");
}

function InventoryItemDevicesLockerClick() {
	ExtendedItemClick(LockerDevicesOptions);
}

function InventoryItemDevicesLockerPublishAction(C, Option) {
	var msg = "DevicesLockerSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesLockerNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "LockerState" + Option.Name, "ItemDevices");
}
