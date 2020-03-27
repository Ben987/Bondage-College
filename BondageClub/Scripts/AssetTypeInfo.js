"use strict"

var AssetTypeItemMouthDuctTape = {
    Allow: [null, "Crossed", "Full", "Double", "Cover"],
    NoneTypeName: "Small",
    SelectBeforeWear: true,
    ExtraPublish: true,
    Dialog: "DuctTapeMouthType",
    DialogSelect: "GagType",
    Unextend: true,
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

const AssetTypeItemMouthClothGag = {
    Allow: [null, "Cleave", "OTM", "OTN"],
    NoneTypeName: "Small",
    SelectBeforeWear: true,
    ExtraPublish: true,
    Dialog: "ClothGagType",
    DialogSelect: "GagType",
    Unextend: true,
    Mofifiers: {
        Small: { Effect: ["GagVeryLight"] },
        Cleave: { Effect: ["GagLight"] },
        OTM: { Effect: ["GagEasy"] },
        OTN: { Effect: ["GagEasy"] },
    },
    DynamicSetDialog: function (C, Item) {
        return "ClothGagSet" + ((Item && Item.Property && Item.Property.Type) ? Item.Property.Type : this.NoneTypeName)
    }
};

/** Asset Type Informations */
var AssetTypeInfo = {
    ItemMouth: {
        DuctTape: AssetTypeItemMouthDuctTape,
        ClothGag: AssetTypeItemMouthClothGag,
    },
    ItemMouth2: {
        DuctTape: AssetTypeItemMouthDuctTape,
        ClothGag: AssetTypeItemMouthClothGag,
    },
    ItemMouth3: {
        DuctTape: AssetTypeItemMouthDuctTape,
        ClothGag: AssetTypeItemMouthClothGag,
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