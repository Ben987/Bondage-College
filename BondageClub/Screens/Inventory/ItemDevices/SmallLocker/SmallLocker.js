"use strict";

const SmallLockerDevicesOptions = [
	{
		Name: "Seethrough",
		Property: { Type: null}
	}, {
		Name: "Opaque",
		Property: { Type: "Opaque"}
    }
];

function InventoryItemDevicesSmallLockerLoad() {
	ExtendedItemLoad(SmallLockerDevicesOptions, "SelectLockerState");
}

function InventoryItemDevicesSmallLockerDraw() {
	ExtendedItemDraw(SmallLockerDevicesOptions, "LockerState");
}

function InventoryItemDevicesSmallLockerClick() {
	ExtendedItemClick(SmallLockerDevicesOptions);
}

function InventoryItemDevicesSmallLockerPublishAction(C, Option) {
	var msg = "DevicesLockerSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesSmallLockerNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "LockerState" + Option.Name, "ItemDevices");
}
