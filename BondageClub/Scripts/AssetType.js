

"use strict"

var AssetTypeOffset = 0;
var AssetTypeSelectBefore = false;

/** Button position and sizes */
var AssetTypeButtonPositions = [
    [],
    [{ X: 1500 }],
    [{ X: 1175 }, { X: 1600 }],
    [{ X: 1037 }, { X: 1387 }, { X: 1737 }],
    [{ X: 1000 }, { X: 1250 }, { X: 1500 }, { X: 1750 }],
    [{ X: 1000, Y: 300 }, { X: 1750, Y: 300 }, { X: 1037, Y: 650 }, { X: 1387, Y: 650 }, { X: 1737, Y: 650 }],
    [{ X: 1000, Y: 450 }, { X: 1375, Y: 450 }, { X: 1750, Y: 450 }, { X: 1000, Y: 750 }, { X: 1375, Y: 750 }, { X: 1750, Y: 750 }]
];


/** Sets nulls to defaults */
function AssetTypeButtonPositionExtend(Positions) {
    if (!Positions) return [];
    return Positions.map(P => {
        return {
            X: P.X,
            Y: (P.Y != null) ? P.Y : 600,
            W: (P.W != null) ? P.W : 225,
            H: (P.H != null) ? P.H : 225,
            TH: (P.TH != null) ? P.TH : 250,
        };
    });
}

/** Loads type information */
function AssetTypeLoad() {
    for (let A = 0; A < Asset.length; A++) {
        Asset[A].ExtendedOrTypeInfo = Asset[A].Extended;

        const Group = AssetTypeInfo[Asset[A].Group.Name];
        if (Group == null) continue;
        const Info = Group[Asset[A].Name];
        if (Info == null) continue;

        if (Info.ShowCount == null) Info.ShowCount = Info.Allow.length;
        if (Info.NoneTypeName == null) Info.NoneTypeName = "None";
        if (Info.Dialog == null) Info.Dialog = Asset[A].Group.Name + Asset[A].Name + "Type";
        if (Info.DialogSelect == null) Info.DialogSelect = Info.Dialog;
        if (Info.DynamicAllowType == null) Info.DynamicAllowType = function () { return Info.Allow; };
        if (Info.DynamicAllowSetType == null) Info.DynamicAllowSetType = function () { return true; };
        if (Info.DynamicSetDialog == null) Info.DynamicSetDialog = function () { return Item.Asset.Group.Name + Item.Asset.Name + "SetType" + (Type ? Type : Item.Asset.NoneTypeName); };
        if (Info.DynamicDictionary == null) Info.DynamicDictionary = function () { return []; };

        Info.Position = AssetTypeButtonPositionExtend(AssetTypeButtonPositions[Info.ShowCount]);

        if (Asset[A].Extended && Info.Unextend) Asset[A].Extended = false;

        Asset[A].TypeInfo = Info;
        Asset[A].ExtendedOrTypeInfo |= Asset[A].TypeInfo != null;

        Asset[A].AllowType = Info.Allow;
    }
}

/** Loads Item Propety */
function AssetTypeSetLoad(Item) {
    AssetTypeOffset = 0;
    if (Item == null) Item = DialogFocusItem;
    if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: DialogFocusItem.Asset.AllowType[0] };
    if (DialogFocusItem.Asset.Extended) {
        if (typeof window["Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Load"] === 'function') {
            window["Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Load"](Item);
        } else {
            console.log("Trying to launch invalid function: Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Load()");
        }
    }
}

/** Default typed item draw */
function AssetTypeSetDraw() {
    if (DialogFocusItem == null || DialogFocusItem.Asset.TypeInfo == null) return;

    const Info = DialogFocusItem.Asset.TypeInfo;
    const Types = Info.DynamicAllowType(DialogFocusItem);

    if (Info.ShowCount > 0 && Types.length > Info.ShowCount) DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");

    DrawRect(1387, 225, 225, 275, "white");
    DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
    DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
    DrawText(DialogFind(Player, "Select" + Info.DialogSelect), 1500, 550, "white", "gray");

    for (let I = AssetTypeOffset; (I < Types.length) && ((Info.ShowCount == 0) || (I < Info.ShowCount + AssetTypeOffset)); I++) {
        const P = Info.Position[I - AssetTypeOffset];
        const Type = ((Types[I] == null) ? Info.NoneTypeName : Types[I]).replace('_', '');
        DrawButton(P.X, P.Y, P.W, P.H, "", (!AssetTypeSelectBefore && InventoryItemIsType(DialogFocusItem, Types[I])) ? "#888888" : "White");
        DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + Type + ".png", P.X - 1, P.Y - 1);
        DrawText(DialogFind(Player, Info.Dialog + Type), P.X + P.W / 2, P.Y + P.TH, "white", "gray");
    }
}


/** Default typed item click */
function AssetTypeSetClick() {
    if (DialogFocusItem == null || DialogFocusItem.Asset.TypeInfo == null) return;

    if (CommonIsClickAt(1885, 25, 90, 90)) { DialogFocusItem = null; return; }

    const Info = DialogFocusItem.Asset.TypeInfo;
    const Types = Info.DynamicAllowType(DialogFocusItem);

    if (CommonIsClickAt(1775, 25, 90, 90) && Info.ShowCount > 0 && Types.length > Info.ShowCount) {
        AssetTypeOffset += Info.ShowCount;
        if (AssetTypeOffset >= Types.length) AssetTypeOffset = 0;
        return;
    }

    const C = CharacterGetCurrent();

    for (let I = AssetTypeOffset; (I < Types.length) && ((Info.ShowCount == 0) || (I < Info.ShowCount + AssetTypeOffset)); I++) {

        const P = Info.Position[I - AssetTypeOffset];

        if (CommonIsClickAt(P.X, P.Y, P.W, P.H) && (AssetTypeSelectBefore || !InventoryItemIsType(DialogFocusItem, Types[I]))) {
            if (Info.DynamicAllowSetType(C, DialogFocusItem, Types[I])) {
                if (AssetTypeSelectBefore) {
                    AssetTypeSelectBefore = false;
                    AssetTypePreSet(C, DialogFocusItem, Info, Types[I]);
                } else {
                    AssetTypeSet(C, DialogFocusItem, Types[I]);
                }
            }
            if (DialogInventory != null) {
                DialogFocusItem = null;
                DialogMenuButtonBuild(C);
            }
            return;
        }
    }
}

/** Set a new type for an item */
function AssetTypeSet(C, Item, NewType) {
    if (CurrentScreen == "ChatRoom") {
        Item = InventoryGet(C, Item ? Item.Asset.Group.Name : C.FocusGroup.Name);
        if (Item.Asset.Extended) CommonDynamicFunction("Inventory" + Item.Asset.Group.Name + Item.Asset.Name + "Load()");
    }

    const Info = Item.Asset.TypeInfo;

    if (Item.Property) Item.Property.Type = NewType;
    else Item.Property = { Type: NewType };

    AssetTypeSetMofifiers(Item, Info, NewType);

    if (Item.Asset.AllowLock && Item.Property.LockedBy && Item.Property.LockedBy != "") {
        if (Item.Property.Effect) Item.Property.Effect.push("Lock");
        else Item.Property.Effect = ["Lock"];
    }

    CharacterRefresh(C);
    ChatRoomCharacterUpdate(C);

    AssetTypePublish(C, Item);
}

/** Set a new type for a new item that just about to be equipped */
function AssetPreTypeSet(C, Item, Info, NewType) {
    AssetTypeSetLoad(Item);
    Item.Property.Type = NewType;
    AssetTypeSetMofifiers(Item, Info, NewType);
    DialogFocusItem = null;
    DialogProgressStart(C, InventoryGet(C, Item ? Item.Asset.Group.Name : C.FocusGroup.Name), Item);
}

/**  Publish ChatRoom action of a type change */
function AssetTypePublish(C, Item) {
    const Info = Item.Asset.TypeInfo;
    const Dictionary = [
        { Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
        { Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
        { Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber }];
    ChatRoomPublishCustomAction(Info.DynamicSetDialog(C, Item), true, Dictionary.concat(Info.DynamicDictionary(C, Item)));
}

/**  Sets type on an item that has yet to be equipped */
function AssetTypePreSet(C, Item, Info, NewType) {
    AssetTypeSetLoad(Item);
    Item.Property.Type = NewType;
    AssetTypeSetMofifiers(Item, Info, NewType);
    DialogFocusItem = null;
    DialogProgressStart(C, InventoryGet(C, Item ? Item.Asset.Group.Name : C.FocusGroup.Name), Item);
}

/**  Load modifiers from info to item*/
function AssetTypeSetMofifiers(Item, Info, NewType) {
    if (NewType == null) NewType = Info.NoneTypeName;
    if (Info.Mofifiers && Info.Mofifiers[NewType]) {
        ["Effect", "Block", "SetPose", "Difficulty", "SelfUnlock", "Hide"].forEach(P => {
            if (Info.Mofifiers[NewType][P] !== undefined) {
                Item.Property[P] = Info.Mofifiers[NewType][P];
            } else {
                delete Item.Property[P];
            }
        });
    }
}