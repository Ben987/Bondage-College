"use strict"

var AssetTypeOffset = 0;

/** Asset Type Informations */
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
            Allow: ["Crop", "Flogger", "Cane", "HeartCrop", "Paddle", "WhipPaddle", "Whip", "TennisRacket"],
            ShowCount: 4,
            DynamicSetDialog: (C, Item, Type) => {
                if (C.ID = 0) {
                    SpankingCurrentType = NewType;
                    return DialogFind(Player, "ItemHandsSpankingToysSetPlayer").replace("Item", (Type) ? Type.toLowerCase() : "crop");
                } else {
                    return DialogFind(Player, "ItemHandsSpankingToysSetOthers").replace("Item", (Type) ? Type.toLowerCase() : "crop");
                }
            },
            DynamicAllowType: (Item) => {
                return Item.Asset.AllowType.filter(Type => Player.Inventory.findIndex(I => I.Name.includes("SpankingToys" + Type)));
            }
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
            DynamicSetDialog: (C, Item, Type) =>
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
                Bear: { Effect:[] }, 
                Fox: { Effect:[] }
            }
        }
    }
};


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
        if (!Asset[A].HasType) continue;
        const MetaGroup = AssetTypeInfo[Asset[A].Group.Name];
        if (MetaGroup == null) continue;
        const Meta = MetaGroup[Asset[A].Name];
        if (Meta == null) continue;
        Asset[A].TypeMetaLoaded = true;
        Asset[A].AllowType = Meta.Allow;
        Asset[A].TypeShowCount = Meta.ShowCount ? Meta.ShowCount : 0;
        Asset[A].TypeMofifiers = Meta.Mofifiers;
        Asset[A].NoneTypeName = (Meta.NoneTypeName != null) ? Meta.NoneTypeName : "None",
            Asset[A].DynamicAllowSetType = (Meta.DynamicAllowSetType != null) ? Meta.DynamicAllowSetType : () => true;
        Asset[A].DynamicSetDialog = (Meta.DynamicSetDialog != null) ? Meta.DynamicSetDialog :
            (C, Item, Type) => DialogFind(Player, Item.Asset.Group.Name + Item.Asset.Name + "SetType" + (Type ? Type : Item.Asset.NoneTypeName));
        Asset[A].DynamicAllowType = Meta.DynamicAllowType ? Meta.DynamicAllowType : () => Meta.Allow;
        Asset[A].TypePosition = AssetTypeButtonPositionExtend((Meta.Allow.length > 6) ? AssetTypeButtonPositions[Meta.ShowCount] : AssetTypeButtonPositions[Meta.Allow.length])
    }
}

function AssetTypeSetLoad() {
    AssetTypeOffset = 0;
    if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: DialogFocusItem.Asset.AllowType[0] };
    if (DialogFocusItem.Asset.Extended) CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Load()");
}

/** Default typed item draw */
function AssetTypeSetDraw() {
    if (DialogFocusItem.Asset.TypeMetaLoaded != true) return;

    const Types = DialogFocusItem.Asset.DynamicAllowType(DialogFocusItem);

    if (DialogFocusItem.Asset.TypeShowCount > 0 && Types.length > DialogFocusItem.Asset.TypeShowCount) DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");

    DrawRect(1387, 225, 225, 275, "white");
    DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
    DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
    DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Select"), 1500, 550, "white", "gray");

    for (let I = AssetTypeOffset; I < Types.length && ((DialogFocusItem.Asset.TypeShowCount == 0) || (I < DialogFocusItem.Asset.TypeShowCount + AssetTypeOffset)); I++) {
        const P = DialogFocusItem.Asset.TypePosition[I - AssetTypeOffset];
        const Type = (Types[I] == null) ? DialogFocusItem.Asset.NoneTypeName : Types[I]
        DrawButton(P.X, P.Y, P.W, P.H, "", InventoryItemIsType(DialogFocusItem, Types[I]) ? "#888888" : "White");
        DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + Type + ".png", P.X - 1, P.Y - 1);
        DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + Type), P.X + P.W / 2, P.Y + P.TH, "white", "gray");
    }
}

/** Default typed item click */
function AssetTypeSetClick() {
    if (DialogFocusItem.Asset.TypeMetaLoaded != true) return;

    if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) { DialogFocusItem = null; return; }
    
    const Types =  DialogFocusItem.Asset.DynamicAllowType(DialogFocusItem);

    if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110) && (DialogFocusItem.Asset.TypeShowCount > 0) && (Types.length > DialogFocusItem.Asset.TypeShowCount)) { 
        AssetTypeOffset += DialogFocusItem.Asset.TypeShowCount;
        if (AssetTypeOffset >= Types.length) AssetTypeOffset = 0;
        return;
    }

    const C = CharacterGetCurrent();

    for (let I = AssetTypeOffset; I < Types.length && ((DialogFocusItem.Asset.TypeShowCount == 0) || (I < DialogFocusItem.Asset.TypeShowCount + AssetTypeOffset)); I++) {
        const P = DialogFocusItem.Asset.TypePosition[I - AssetTypeOffset];
        if ((MouseX >= P.X) && (MouseX <= P.X + P.W) && (MouseY >= P.Y) && (MouseY <= P.Y + P.H) && !InventoryItemIsType(DialogFocusItem, Types[I])) {
            if (DialogFocusItem.Asset.DynamicAllowSetType(C, DialogFocusItem, Types[I])) {
                AssetTypeSet(C, DialogFocusItem, Types[I]);
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

    if (Item.Property) Item.Property.Type = NewType;
    else Item.Property = { Type: NewType };

    CharacterRefresh(C);
    ChatRoomCharacterUpdate(C);

    let msg = Item.Asset.DynamicSetDialog(C, Item, NewType);
    msg = msg.replace("SourceCharacter", Player.Name);
    msg = msg.replace("DestinationCharacter", C.Name);
    ChatRoomPublishCustomAction(msg, true);
}

/** Loads type modifiers of an appearance item */
function AssetTypeGetMofifiers(Item) {
    return (Item && Item.Property && Item.Asset.TypeMofifiers) ? Item.Asset.TypeMofifiers[Item.Property.Type || Item.Asset.NoneTypeName] : null;
}
