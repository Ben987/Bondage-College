var AssetTypeInfo = {
    ItemArms: {
        DuctTape: {
            Allow: [null, "Bottom", "Top", "Full"],
            Mofifiers: {
                Bottom: { Difficulty: 2, SetPose: ["BackElbowTouch"], Hide: ["Cloth", "ClothLower"], Block: ["ItemVulva", "ItemButt", "ItemPelvis"] },
                Top: { Difficulty: 4, SetPose: ["BackElbowTouch"], Hide: ["Cloth", "ClothLower"], Block: ["ItemTorso", "ItemBreast", "ItemNipples"] },
                Full: { Difficulty: 6, SetPose: ["BackElbowTouch"], Hide: ["Cloth", "ClothLower"], Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples"] }
            },
            DynamicAllowSetType: (C, Item, Type) => (Type == null) || (InventoryGet(C, "ClothLower") == null)
        },
        LeatherCuff: {
            Allow: [null, "_Wrist", "_Elbow", "_Both"],
            Mofifiers: {
                _Wrist: { Difficulty: 2, SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], },
                _Elbow: { Difficulty: 4, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], SelfUnlock: false },
                _Both: { Difficulty: 5, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], SelfUnlock: false },
            }
        },
        StraitJacket: {
            Allow: [null, "_Normal", "_Snug", "_Tight"],
            Mofifiers: {
                _Normal: { Difficulty: 2 },
                _Snug: { Difficulty: 4 },
                _Both: { Difficulty: 5 },
            }
        }
    },
    ItemHands: {
        SpankingToys: {
            Allow:  ["Crop", "Flogger", "Cane", "HeartCrop", "Paddle", "WhipPaddle"],
            Mofifiers: {}
        }
    },
    ItemFeet: {
        DuctTape: {
            Allow: [null, "HalfFeet", "MostFeet", "CompleteFeet"],
            Mofifiers: {
                HalfFeet: { Difficulty: 2, SetPose: ["LegsClosed"], Hide: ["ClothLower", "Shoes"] },
                MostFeet: { Difficulty: 4, SetPose: ["LegsClosed"], Hide: ["ClothLower", "Shoes"] },
                CompleteFeet: { Difficulty: 6, SetPose: ["LegsClosed"], Hide: ["ClothLower", "Shoes"] }
            },
            DynamicAllowSetType: (C, Item, Type) => (Type == null) || (InventoryGet(C, "ClothLower") == null)
        },
        LeatherAnkleCuffs: {
            Allow: [null, "_Closed"],
            Mofifiers: {
                _Closed: { Difficulty: 6, SetPose: ["LegsClosed"], Effect: ["Prone", "Freeze"], }
            }
        }
    },
    ItemHead: {
        DuctTape: {
            Allow: [null, "Wrap", "Mummy"],
            Mofifiers: {
                Wrap: { Hide: ["HairFront"] },
                Mummy: { Hide: ["HairFront"], Block: ["ItemMouth", "ItemEars"], Effect =["GagNormal"] }
            }
        }
    },
    ItemLegs: {
        DuctTape: {
            Allow: [null, "HalfLegs", "MostLegs", "CompleteLegs"],
            Mofifiers: {
                HalfLegs: { Difficulty: 2, SetPose: ["LegsClosed"], Hide: ["ClothLower"] },
                MostLegs: { Difficulty: 4, SetPose: ["LegsClosed"], Hide: ["ClothLower"], },
                CompleteLegs: { Difficulty: 6, SetPose: ["LegsClosed"], Hide: ["ClothLower"], }
            },
            DynamicAllowSetType: (C, Item, Type) => (Type == null) || (InventoryGet(C, "ClothLower") == null)
        }
    },
    ItemMouth: {
        ClothGag: {
            Allow: [null, "Cleave", "OTM", "OTN"],
            Mofifiers: {
                OTM: { Effect: ["GagNormal"] },
                OTN: { Effect: ["GagNormal"] }
            }
        },
        DuctTape: {
            Allow: [null, "Crossed", "Full", "Double", "Cover"],
            Mofifiers: {
                Full: { Effect: ["GagNormal"] },
                Double: { Effect: ["GagNormal"] },
                Cover: { Effect: ["GagNormal"] }
            },
            DynamicAllowSetType: (C, Item, Type) => (Type == null) || (InventoryGet(C, "ClothLower") == null)
        },
        PlugGag: {
            Allow: [null, "Plug"],
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
            Allow: ["BadGirl", "BindMe", "Bitch", "Bunny", "Cookie", "Cupcake", "Dom", "Foxy", "Free", "FuckMe", "GagMe", "GoodGirl", "HoldMe", "Kitten", "Love", "Maid", "Meat", "Muffin", "Needy", "Owned", "Panda", "Pet", "PetMe", "Pixie", "Puppy", "Racoon", "Slave", "Slut", "Sub", "Sweetie", "Taken", "Toy", "Useless", "UseMe", "Whore"]
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
    }
};

var AssetTypeButtonPosition = [
    [],
    [1500],
    [1175, 1600],
    [1037, 1387, 1737],
    [1000, 1250, 1500, 2000]
];

function AssetTypeLoad() {
    for (var A = 0; A < Asset.length; A++) {
        if (!Asset[A].HasType) continue;
        var MetaGroup = AssetTypeInfo[Asset[A].Group.Name];
        if (MetaGroup == null) continue;
        var Meta = MetaGroup[Asset[A].Name];
        if (Group == null) continue;
        Asset[A].TypeMetaLoaded = true;
        Asset[A].AllowType = Meta.Allow;
        Asset[A].TypeMofifiers = Meta.Mofifiers;
        Asset[A].DynamicAllowSetType = (Meta.DynamicAllowSetType != null) ? Meta.DynamicAllowSetType : () => true;
        Asset[A].DynamicSetDialog = (Meta.DynamicAllowSetType != null) ? Meta.DynamicAllowSetType : 
            (Item, Type) => DialogFind(Player, Item.Asset.Group.Name + Item.Asset.Name + "SetType" + (Type ? Type : "None"));
    }
}

function AssetTypeGet(Item) {
    return AssetTypeInfo[Item.Asset.Group.Name] && AssetTypeInfo[Item.Asset.Group.Name][Item.Asset.Name]
}

function AssetTypeSetDraw() {
    if (DialogFocusItem.Asset.TypeMetaLoaded != true) return;
    var P = AssetTypeButtonPosition[DialogFocusItem.Asset.AllowType.length];
    for (var I = 0; I < DialogFocusItem.Asset.AllowType.length; I++) {
        var Type = (DialogFocusItem.Asset.AllowType[I] == null) ? "None" : DialogFocusItem.Asset.AllowType[I]
        DrawButton(P[I], 450, 225, 225, "", InventoryItemIsType(DialogFocusItem, DialogFocusItem.Asset.AllowType[I]) ? "#888888" : "White");
        DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + Type + ".png", P[I], 449);
	    DrawText(DialogFind(Player, DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + Type), P[I] + 113, 425, "white", "gray");
    }
}

function AssetTypeSetClick() {
    if (DialogFocusItem.Asset.TypeMetaLoaded != true) return;
    var P = AssetTypeButtonPosition[DialogFocusItem.Asset.AllowType.length];
    for (var I = 0; I < DialogFocusItem.Asset.AllowType.length; I++) {
        var Type = (DialogFocusItem.Asset.AllowType[I] == null) ? "None" : DialogFocusItem.Asset.AllowType[I]
        if ((MouseX >= P[I]) && (MouseX <= P[I] - 255) && (MouseY >= 450) && (MouseY <= 675) && !InventoryItemIsType(DialogFocusItem, DialogFocusItem.Asset.AllowType[I])) {
            if (DialogFocusItem.Asset.DynamicAllowSetType(C, DialogFocusItem, Type)) {
                AssetTypeSet(DialogFocusItem, Type);
            }
            if (DialogInventory != null) {
                DialogFocusItem = null;
                DialogMenuButtonBuild(C);
            }
            return;
        }
    }
}

function AssetTypeSet(Item, NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
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

// checks if an item is a specific type
function InventoryItemIsType(Item, Type) {
	return ((Item != null) && (Item.Property != null)) ? Item.Property.Type == Type : Type == null;
}