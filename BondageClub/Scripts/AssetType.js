

"use strict"

var AssetTypeOffset = 0;
var AssetTypeSelectBefore = false;

var AssetTypeItemMouthDuctTape = {
    Allow: [null, "Crossed", "Full", "Double", "Cover"],
    NoneTypeName: "Small",
    SelectBeforeWear: true,
    Dialog: "DuctTapeMouthType",
    Mofifiers: {
        Small: { Effect: ["GagVeryLight"] },
        Crossed: { Effect: ["GagVeryLight"] },
        Full: { Effect: ["GagLight"] },
        Double: { Effect: ["GagEasy"] },
        Cover: { Effect: ["GagNormal"] }
    },
    DynamicSetDialog: function (C, Item) {
        return "DuctTapeMouthSet" + ((Item && Item.Property && Item.Property.Type) ? Item.Property.Type : this.NoneTypeName)
    }
}

/** Asset Type Informations */
var AssetTypeInfo = {
    ItemMouth: {
        DuctTape: AssetTypeItemMouthDuctTape,
    },
    ItemMouth2: {
        DuctTape: AssetTypeItemMouthDuctTape,
    },
    ItemMouth3: {
        DuctTape: AssetTypeItemMouthDuctTape,
    },
    ItemHands: {
        SpankingToys: {
            Allow: ["Crop", "Flogger", "Cane", "HeartCrop", "Paddle", "WhipPaddle", "Whip", "CattleProd", "TennisRacket"],
            ShowCount: 4,
            SelectBeforeWear: true,
            Dialog: "SpankingToysType",
            DynamicAllowType: function () {
                return this.Allow.filter(Type => Player.Inventory.findIndex(I => I.Name.includes("SpankingToys" + Type)) >= 0);
            },
            DynamicSetDialog: function (C, Item) {
                if (C.ID == 0) {
                    SpankingCurrentType = Item.Property.Type;
                    return "SpankingToysSetPlayer";
                } else {
                    return "SpankingToysSetOthers";
                }
            },
            DynamicDictionary: function (C, Item) {
                return [{ Tag: "ItemUsed", AssetName: "SpankingToys" + ((Item.Property.Type) ? Item.Property.Type : "Crop") }];
            }
        },
    },
}

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
        if (Info.DynamicAllowType == null) Info.DynamicAllowType = function () { return Info.Allow; };
        if (Info.DynamicAllowSetType == null) Info.DynamicAllowSetType = function () { return true; };
        if (Info.DynamicSetDialog == null) Info.DynamicSetDialog = function () { return Item.Asset.Group.Name + Item.Asset.Name + "SetType" + (Type ? Type : Item.Asset.NoneTypeName); };
        if (Info.DynamicDictionary == null) Info.DynamicDictionary = function () { return []; };

        Info.Position = AssetTypeButtonPositionExtend(AssetTypeButtonPositions[Info.ShowCount]);

        Asset[A].TypeInfo = Info;
        Asset[A].ExtendedOrTypeInfo |= Asset[A].TypeInfo != null;

        Asset[A].AllowType = Info.Allow;
    }
}


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
    DrawText(DialogFind(Player, "Select" + Info.Dialog), 1500, 550, "white", "gray");

    for (let I = AssetTypeOffset; (I < Types.length) && ((Info.ShowCount == 0) || (I < Info.ShowCount + AssetTypeOffset)); I++) {
        const P = Info.Position[I - AssetTypeOffset];
        const Type = (Types[I] == null) ? Info.NoneTypeName : Types[I];
        DrawButton(P.X, P.Y, P.W, P.H, "", InventoryItemIsType(DialogFocusItem, Types[I]) ? "#888888" : "White");
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

        if (CommonIsClickAt(P.X, P.Y, P.W, P.H) && !InventoryItemIsType(DialogFocusItem, Types[I])) {
            if (Info.DynamicAllowSetType(C, DialogFocusItem, Types[I])) {
                if (AssetTypeSelectBefore) {
                    AssetTypeSelectBefore = false;
                    AssetPreTypeSet(C, DialogFocusItem, Info, Types[I]);
                } else {
                    AssetTypeSet(C, DialogFocusItem, Info, Types[I]);
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

    CharacterRefresh(C);
    ChatRoomCharacterUpdate(C);

    const Dictionary = [
        { Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
        { Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber }];

    ChatRoomPublishCustomAction(Info.DynamicSetDialog(C, Item), true, Dictionary.concat(Info.DynamicDictionary(C, Item)));
}

/** Set a new type for a new item that just about to be equipped */
function AssetPreTypeSet(C, Item, Info, NewType) {
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
        if (Info.Mofifiers[NewType].Effect) {
            Item.Property.Effect = Info.Mofifiers[NewType].Effect;
        }
    }
}