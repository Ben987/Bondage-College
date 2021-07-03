"use strict";

const InventoryItemDevicesKennelOptions = [
	{
		Name: "OpenNoPadding",
        ItemValue: { Door: false, Padding: false},
		Property: { Type: null }
	}, {
		Name: "OpenPadding",
        ItemValue: { Door: false, Padding: true},
		Property: { Type: "OpenPadding" }
    }, {
		Name: "ClosedNoPadding",
        ItemValue: { Door: true, Padding: false},
		Property: { 
			Type: "Closed",
			Effect: ["OneWayEnclose"],
		}
    }, {
		Name: "ClosedPadding",
        ItemValue: { Door: true, Padding: true},
		Property: { 
			Type: "ClosedPadding",
			Effect: ["OneWayEnclose"],
		}
    }
];

function InventoryItemDevicesKennelLoad() {
	ExtendedItemLoad(InventoryItemDevicesKennelOptions, "SelectKennelType");
}

function InventoryItemDevicesKennelDraw() {
	ExtendedItemDraw(InventoryItemDevicesKennelOptions, "KennelType");
}

function InventoryItemDevicesKennelClick() {
	ExtendedItemClick(InventoryItemDevicesKennelOptions);
}

function InventoryItemDevicesKennelPublishAction(C, Option, PreviousOption) {
	var msg = "KennelSet";
    if (Option.ItemValue.Padding != PreviousOption.ItemValue.Padding) {
        msg += Option.ItemValue.Padding ? "PA" : "PR"
    }
    if (Option.ItemValue.Door != PreviousOption.ItemValue.Door) {
        msg += Option.ItemValue.Door ? "DC" : "DO"
    }
    
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemDevicesKennelNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "Kennel" + Option.Name, "ItemDevices");
}

function InventoryItemDevicesKennelValidate(C, Item, Option) {
	var Allowed = "";
    if (InventoryItemHasEffect(Item, "Lock", true)) {
        Allowed = DialogFind(Player, "CantChangeWhileLocked");
	}
	return Allowed;
}