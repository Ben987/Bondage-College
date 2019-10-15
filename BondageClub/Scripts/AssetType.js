"use strict"

// type information
var AssetTypeInfo = {
    ItemArms: {
        DuctTape: {
            Allow: [null, "Bottom", "Top", "Full"],
            NoneTypeName: "Hands",
            Mofifiers: {
                Bottom: { Difficulty: 2, Hide: ["Cloth", "ClothLower"], Block: ["ItemVulva", "ItemButt", "ItemPelvis"] },
                Top: { Difficulty: 4, Hide: ["Cloth", "ClothLower"], Block: ["ItemTorso", "ItemBreast", "ItemNipples"] },
                Full: { Difficulty: 6, Hide: ["Cloth", "ClothLower"], Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples"] }
            },
            DynamicAllowSetType: (C, Item, Type) => (Type == null) || (InventoryGet(C, "ClothLower") == null)
        },
        LeatherCuffs: {
            Allow: [null, "_Wrist", "_Elbow", "_Both"],
            Mofifiers: {
                _Wrist: { Difficulty: 2, SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], },
                _Elbow: { Difficulty: 4, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], SelfUnlock: false },
                _Both: { Difficulty: 5, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], SelfUnlock: false },
            }
        },
        StraitJacket: {
            Allow: [null, "_Normal", "_Snug", "_Tight"],
            NoneTypeName: "_Loose",
            Mofifiers: {
                _Normal: { Difficulty: 2 },
                _Snug: { Difficulty: 4 },
                _Both: { Difficulty: 5 },
            }
        }
    },
    ItemHands: {
        SpankingToys: {
            Allow: ["Crop", "Flogger", "Cane", "HeartCrop", "Paddle", "WhipPaddle", "Whip"],
        }
    },
    ItemFeet: {
        DuctTape: {
            Allow: [null, "HalfFeet", "MostFeet", "CompleteFeet"],
            NoneTypeName: "Feet",
            Mofifiers: {
                HalfFeet: { Difficulty: 2, Hide: ["ClothLower", "Shoes"] },
                MostFeet: { Difficulty: 4, Hide: ["ClothLower", "Shoes"] },
                CompleteFeet: { Difficulty: 6, Hide: ["ClothLower", "Shoes"] }
            },
            DynamicAllowSetType: (C, Item, Type) => (Type == null) || (InventoryGet(C, "ClothLower") == null)
        },
        LeatherAnkleCuffs: {
            Allow: [null, "_Closed"],
            Mofifiers: {
                _Closed: { Difficulty: 6, Effect: ["Prone", "Freeze"], SetPose: ["LegsClosed"] }
            }
        }
    },
    ItemHead: {
        DuctTape: {
            Allow: [null, "Wrap", "Mummy"],
            NoneTypeName: "Double",
            Mofifiers: {
                Wrap: { Hide: ["HairFront"] },
                Mummy: { Hide: ["HairFront"], Block: ["ItemMouth", "ItemEars"], Effect: ["GagNormal"] }
            }
        }
    },
    ItemLegs: {
        DuctTape: {
            Allow: [null, "HalfLegs", "MostLegs", "CompleteLegs"],
            NoneTypeName: "Legs",
            Mofifiers: {
                HalfLegs: { Difficulty: 2, Hide: ["ClothLower"] },
                MostLegs: { Difficulty: 4, Hide: ["ClothLower"], },
                CompleteLegs: { Difficulty: 6, Hide: ["ClothLower"], }
            },
            DynamicAllowSetType: (C, Item, Type) => (Type == null) || (InventoryGet(C, "ClothLower") == null)
        },
        LeatherLegCuffs: {
            Allow: [null, "_Closed"],
            Mofifiers: {
                _Closed: { Difficulty: 6, Effect: ["Prone", "KneelFreeze"], SetPose: ["LegsClosed"] }
            }
        }
    },
    ItemTorso: {
        HempRopeHarness: {
            Allow: [null, "Diamond"],
            NoneTypeName: "Basic"
        }
    },
    ItemMouth: {
        ClothGag: {
            Allow: [null, "Cleave", "OTM", "OTN"],
            NoneTypeName: "Small",
            Mofifiers: {
                OTM: { Effect: ["GagNormal"] },
                OTN: { Effect: ["GagNormal"] }
            }
        },
        DuctTape: {
            Allow: [null, "Crossed", "Full", "Double", "Cover"],
            NoneTypeName: "Small",
            Mofifiers: {
                Full: { Effect: ["GagNormal"] },
                Double: { Effect: ["GagNormal"] },
                Cover: { Effect: ["GagNormal"] }
            },
            DynamicAllowSetType: (C, Item, Type) => (Type == null) || (InventoryGet(C, "ClothLower") == null)
        },
        PlugGag: {
            Allow: [null, "Plug"],
            NoneTypeName: "Open",
            Mofifiers: {
                Plug: { Effect: ["GagTotal"] }
            }
        },
    },
    ItemNeck: {
        SlaveCollar: {
            Allow: [null, "SteelPosture", "LeatherPosture"],
            Mofifiers: {},
            DynamicAllowSetType: (C, Item, Type) => C.IsOwnedByPlayer()
        }
    },
    ItemNeckAccessories: {
        CollarNameTag: {
            Allow: ["BadGirl", "BindMe", "Bitch", "Bunny", "Cookie", "Cupcake", "Dom", "Foxy", "Free", "FuckMe", "GagMe", "GoodGirl", "HoldMe", "Kitten", "Love", "Maid", "Meat", "Muffin", "Needy", "Owned", "Panda", "Pet", "PetMe", "Pixie", "Puppy", "Racoon", "Slave", "Slut", "Sub", "Sweetie", "Taken", "Toy", "Useless", "UseMe", "Whore"],
            DynamicSetDialog: (Item, Type) =>
                DialogFind(Player, "CollarNameTagSet")
                    .replace("NameTagType", DialogFind(Player, "CollarNameTagType" + ((Type) ? Type : "")).toLowerCase())
        }
    },
    ItemPelvis: {
        LoveChastityBelt: {
            Allow: ["Open", "Closed", "Vibe", "Shock"],
            Mofifiers: {
                Closed: { Block: ["ItemVulva"], Effect: ["Chaste"] },
                Vibe: { Block: ["ItemVulva"], Effect: ["Chaste", "Egged"] },
                Shock: { Block: ["ItemVulva"], Effect: ["Chaste", "ReceiveShock"] }
            },
            DynamicAllowSetType: (C, Item, Type) => C.IsOwnedByPlayer() && (Type == "Open")
        }
    },
    ItemDevices: {
        TeddyBear: {
            Allow: [null, "Fox", "Kitty", "Pup", "Bunny", "Pony"],
            NoneTypeName: "Bear",
            Mofifiers: {                
                Fox: { Effect:[] }
            }
        }
    }
};

// button X cordinets for type selection
var AssetTypeButtonPosition = [
    [],
    [{ X: 1500 }],
    [{ X: 1175 }, { X: 1600 }],
    [{ X: 1037 }, { X: 1387 }, { X: 1737 }],
    [{ X: 1000 }, { X: 1250 }, { X: 1500 }, { X: 1750 }],
    [{ X: 1000, Y: 300 }, { X: 1750, Y: 300 }, { X: 1037, Y: 650 }, { X: 1387, Y: 650 }, { X: 1737, Y: 650 }],
    [{ X: 1000, Y: 300 }, { X: 1750, Y: 300 }, { X: 1000, Y: 650 }, { X: 1250, Y: 650 }, { X: 1500, Y: 650 }, { X: 1750, Y: 650 }]
];


function AssetTypeButtonPositionExtend(Positions) {
    return Positions.map(P => {
        return {
            X: P.X,
            Y: (P.Y != null) ? P.Y : 600,
            W: (P.W != null) ? P.W : 225,
            H: (P.H != null) ? P.H : 225,
        };
    });
}

// loads type information
function AssetTypeLoad() {
    for (var A = 0; A < Asset.length; A++) {
        if (!Asset[A].HasType) continue;
        var MetaGroup = AssetTypeInfo[Asset[A].Group.Name];
        if (MetaGroup == null) continue;
        var Meta = MetaGroup[Asset[A].Name];
        if (Meta == null) continue;
        Asset[A].TypeMetaLoaded = true;
        Asset[A].AllowType = Meta.Allow;
        Asset[A].TypeMofifiers = Meta.Mofifiers;
        Asset[A].NoneTypeName = (Meta.NoneTypeName != null) ? Meta.NoneTypeName : "None",
            Asset[A].DynamicAllowSetType = (Meta.DynamicAllowSetType != null) ? Meta.DynamicAllowSetType : () => true;
        Asset[A].DynamicSetDialog = (Meta.DynamicSetDialog != null) ? Meta.DynamicSetDialog :
            (Item, Type) => DialogFind(Player, Item.Asset.Group.Name + Item.Asset.Name + "SetType" + (Type ? Type : Item.Asset.NoneTypeName));
        Asset[A].TypePosition = AssetTypeButtonPositionExtend((Meta.Allow.length > 6) ? [] : AssetTypeButtonPosition[Meta.Allow.length])
    }
}

// default typed item draw
function AssetTypeSetDraw() {
    if (DialogFocusItem.Asset.TypeMetaLoaded != true) return;

    DrawRect(1387, 225, 225, 275, "white");
    DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
    DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
    DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Select"), 1500, 550, "white", "gray");

    for (var I = 0; I < DialogFocusItem.Asset.AllowType.length; I++) {
        var P = DialogFocusItem.Asset.TypePosition[I];
        var Type = (DialogFocusItem.Asset.AllowType[I] == null) ? DialogFocusItem.Asset.NoneTypeName : DialogFocusItem.Asset.AllowType[I]
        DrawButton(P.X, P.Y, P.W, P.H, "", InventoryItemIsType(DialogFocusItem, DialogFocusItem.Asset.AllowType[I]) ? "#888888" : "White");
        DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + Type + ".png", P.X - 1, P.Y - 1);
        DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + Type), P.X + 113, P.Y + 250, "white", "gray");
    }
}

// default typed item click
function AssetTypeSetClick() {
    if (DialogFocusItem.Asset.TypeMetaLoaded != true) return;

    if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) { DialogFocusItem = null; return; }

    var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;

    for (var I = 0; I < DialogFocusItem.Asset.AllowType.length; I++) {
        var P = DialogFocusItem.Asset.TypePosition[I];
        if ((MouseX >= P.X) && (MouseX <= P.X + P.W) && (MouseY >= P.Y) && (MouseY <= P.Y + P.H) && !InventoryItemIsType(DialogFocusItem, DialogFocusItem.Asset.AllowType[I])) {
            if (DialogFocusItem.Asset.DynamicAllowSetType(C, DialogFocusItem, DialogFocusItem.Asset.AllowType[I])) {
                AssetTypeSet(C, DialogFocusItem, DialogFocusItem.Asset.AllowType[I]);
            }
            if (DialogInventory != null) {
                DialogFocusItem = null;
                DialogMenuButtonBuild(C);
            }
            return;
        }
    }
}

// set a new type for an item
function AssetTypeSet(C, Item, NewType) {
    if (CurrentScreen == "ChatRoom") {
        Item = InventoryGet(C, C.FocusGroup.Name);
    }

    if (Item.Property) Item.Property.Type = NewType;
    else Item.Property = { Type: NewType };

    CharacterRefresh(C);
    ChatRoomCharacterUpdate(C);

    var msg = Item.Asset.DynamicSetDialog(Item, NewType);
    msg = msg.replace("SourceCharacter", Player.Name);
    msg = msg.replace("DestinationCharacter", C.Name);
    ChatRoomPublishCustomAction(msg, true);
}

// loads type modifiers of an appearance item
function AssetTypeGetMofifiers(Item) {
    return (Item && Item.Property && Item.Property.Type && Item.Asset.TypeMofifiers) ? Item.Asset.TypeMofifiers[Item.Property.Type] : null;
}
