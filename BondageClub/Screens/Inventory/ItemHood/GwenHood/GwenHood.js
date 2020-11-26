"use strict";

var InventoryItemHoodGwenHoodOptions = [
    {
        Name: "HairOutAccOut",
        Property: {
            Type: null,
            Hide: []
        },
    },
    {
        Name: "HairInAccOut",
        Property: {
            Type: "HairInAccOut",
            Hide: ["HairBack"]
        },
    },
    {
        Name: "HairOutAccIn",
        Property: {
            Type: "HairOutAccIn",
            Hide: ["HairAccessory1", "HairAccessory2", "HairAccessory3"]
        },
    },
    {
        Name: "HairInAccIn",
        Property: {
            Type: "HairInAccIn",
            Hide: ["HairAccessory1", "HairAccessory2", "HairAccessory3", "HairBack"]
        },
    },
];

function InventoryItemHoodGwenHoodLoad() {
    ExtendedItemLoad(InventoryItemHoodGwenHoodOptions, "GwenHoodSelectStyle");
}

function InventoryItemHoodGwenHoodDraw() {
    ExtendedItemDraw(InventoryItemHoodGwenHoodOptions, "GwenHoodStyle", InventoryItemHoodGwenHoodOptions.length, false);
}

function InventoryItemHoodGwenHoodClick() {
    ExtendedItemClick(InventoryItemHoodGwenHoodOptions, false, InventoryItemHoodGwenHoodOptions.length, false);
}

function InventoryItemHoodGwenHoodPublishAction(C, Option, PreviousOption) {
    var msg = "GwenHoodChangeStyle";
    var Dictionary = [
        { Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
        { Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
    ];
    ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemHoodGwenHoodNpcDialog(C, Option) {
    C.CurrentDialog = DialogFind(C, "ItemHoodGwenHoodNPCReaction" + Option.Name, "ItemHood");
}

