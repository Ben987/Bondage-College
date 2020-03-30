"use strict"

var AppearanceBackground = "Dressing";

let AppearanceAssets = [];
let AppearanceAssetsAll = [];
let AppearanceUndo = [];
let AppearanceWardrobeOffset = 0;
let AppearanceMode = "";
let AppearanceHeight = 65;
let AppearanceSpace = 30;
let AppearanceOffset = 0;
let AppearanceNumPerPage = 0;
let AppearanceItem = null;
let AppearanceColorUndo = true;
let AppearanceItemUndo = true;
let AppearanceItemsOffset = 0;
let AppearanceTempWardrobe = [];
let AppearanceWardrobeShouldUndo = true;
let AppearanceShade = 5;
let AppearanceColorPaste = "#FFFFFF";
let AppearanceBlockMode = false;
let AppearanceSelectedCategory = "Appearance";
let AppearanceHideColorPicker = true;
let AppearanceShadeMode = "LIG";


/** Loads the character appearance screen and keeps a backup of the previous appearance */
function AppearanceLoad() {
    if (!CharacterAppearanceSelection) CharacterAppearanceSelection = Player;

    const C = CharacterAppearanceSelection;
    AppearanceUndo = [];
    AppearanceTempWardrobe = [];
    AppearanceBlockMode = false;
    AppearanceSelectedCategory = "Appearance";

    AppearanceBuildAssets(C);
    AppearanceMode = "";
    CharacterAppearanceBackup = C.Appearance.map(Item => Object.assign({}, Item));
}

/** Run the character appearance selection screen */
function AppearanceRun() {
    const C = CharacterAppearanceSelection;

    AppearanceHideColorPicker = true;

    if (CharacterAppearanceHeaderText == "" || CharacterAppearanceHeaderText.indexOf("Selected Group:") == 0) {
        if (C.ID == 0) CharacterAppearanceHeaderText = TextGet("SelectYourAppearance");
        else CharacterAppearanceHeaderText = TextGet("SelectSomeoneAppearance").replace("TargetCharacterName", C.Name);
    }
    if (C.FocusGroup && C.FocusGroup.Description) {
        CharacterAppearanceHeaderText = "Selected Group: " + C.FocusGroup.Description;
    }

    DrawCharacter(C, -600, (C.IsKneeling()) ? -1100 : -100, 4, false);
    DrawCharacter(C, 750, 0, 1);
    DrawText(CharacterAppearanceHeaderText, 400, 40, "White", "Black");

    if (AppearanceMode == "") {
        AppearanceNormalRun();
    } else if (AppearanceMode == "Wardrobe") {
        AppearanceWardrobeRun();
    } else if (AppearanceMode == "Color") {
        AppearanceColorRun();
    } else if (AppearanceMode == "Items") {
        AppearanceItemsRun();
    }

    if (AppearanceHideColorPicker) ColorPickerHide();

    if (!AppearanceBlockMode) DrawButton(1768, 25, 90, 90, "", "White", "Icons/Cancel.png", TextGet("Cancel"));
    if (C.AllowItem) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Accept.png", TextGet("Accept"));
}

/** When the user clicks on the character appearance selection screen */
function AppearanceClick() {
    if (AppearanceMode == "") {
        AppearanceNormalClick();
    } else if (AppearanceMode == "Wardrobe") {
        AppearanceWardrobeClick();
    } else if (AppearanceMode == "Color") {
        AppearanceColorClick();
    } else if (AppearanceMode == "Items") {
        AppearanceItemsClick();
    }
}

/** When the user press escape */
function AppearanceExit() {
    if (AppearanceMode == "") CharacterAppearanceExit(CharacterAppearanceSelection);
    else if (AppearanceMode == "Wardrobe") { AppearanceMode == ""; ElementRemove("InputWardrobeName"); AppearanceAssets.forEach(A => A.ReloadItem()); }
    else if (AppearanceMode == "Color") { AppearanceMode == ""; ElementRemove("InputColor"); if (AppearanceColorUndo) AppearanceRunUndo(); AppearanceItem = null; }
    else if (AppearanceMode == "Items") { if (AppearanceItemUndo) AppearanceRunUndo(); AppearanceItem = null; }
}

class AppearanceAssetGroup {
    constructor(C, Group) {
        const m = new Map();

        const AddAsset = A => {
            m.set(A.Name, A);
        };

        Asset
            .filter(A => A.Value == 0)
            .filter(A => A.Group.Name == Group.Name)
            .forEach(AddAsset);

        Player.Inventory
            .map(I => I.Asset)
            .filter(A => A)
            .filter(A => A.Group.Name == Group.Name)
            .forEach(AddAsset);

        C.Inventory
            .map(I => I.Asset)
            .filter(A => A)
            .filter(A => A.Group.Name == Group.Name)
            .forEach(AddAsset);

        this.C = C;
        this.Group = Group;
        this.Assets = [];
        this.AllowedAssets = [];
        this.Item = this.C.Appearance.find(I => I.Asset.Group.Name == this.Group.Name);
        this.Color = (this.Item && this.Item.Color) || "None";

        this.CanChange = this.C.AllowItem && (this.C.ID == 0 || this.Group.Clothing);

        m.forEach(A => {
            if (!A.OwnerOnly || !this.C.IsOwnedByPlayer() || A.Name == CharacterAppearanceGetCurrentValue(this.C, this.Group.Name, "Name")) {
                this.Assets.push(A);
            }
        });
        this.AllowedAssets = this.Assets.filter(A => !this.C.BlockItems.some(I => I.Name == A.Name && I.Group == A.Group.Name));
        if (!this.Group.AllowNone && this.AllowedAssets.length == 0) this.AllowedAssets.push(this.Assets[0]);

        this.AssetsSave = [...this.Assets];

        this.Draw = this.Group.Category == "Appearance" ? this.AppearanceDraw : this.ItemDraw;
        this.Click = this.Group.Category == "Appearance" ? this.AppearanceClick : this.ItemClick;
    }

    NextColor() {
        if (this.Item) {
            let I = this.Group.ColorSchema.indexOf(this.Color) + 1;
            if (I < 0 || I >= this.Group.ColorSchema.length) I = 0;
            this.SetColor(this.Group.ColorSchema[I], true);
        }
    }
    SetColor(Color, Undo) {
        if (this.Item) {
            if (Undo) {
                const G = this;
                const OldColor = this.Color;
                AppearanceUndo.push(() => G.SetColor(OldColor));
            }
            this.Item.Color = Color;
            this.Color = Color;
            CharacterLoadCanvas(this.C);
            this.ReloadItem();
        }
    }
    SetItem(AssetName, Undo) {
        if (Undo) {
            const G = this;
            const AssetName = this.Item && this.Item.Asset.Name;
            AppearanceUndo.push(() => G.SetItem(AssetName));
        }
        if (AssetName) InventoryWear(this.C, AssetName, this.Group.Name, this.Color == "None" ? null : this.Color);
        else InventoryRemove(this.C, this.Group.Name);
        AppearanceAssets.forEach(A => A.ReloadItem());
    }
    GetNextItem() {
        if (this.Item) {
            const I = this.AllowedAssets.findIndex(A => A.Group.Name == this.Group.Name && A.Name == this.Item.Asset.Name) + 1;
            if (I >= this.AllowedAssets.length) {
                return this.Group.AllowNone ? null : this.AllowedAssets[0];
            } else {
                return this.AllowedAssets[I];
            }
        } else {
            return this.AllowedAssets[0];
        }
    }
    GetPrevItem() {
        if (this.Item) {
            const I = this.AllowedAssets.findIndex(A => A.Group.Name == this.Group.Name && A.Name == this.Item.Asset.Name) - 1;
            if (I < 0) {
                return this.Group.AllowNone ? null : this.AllowedAssets[this.AllowedAssets.length - 1];
            } else {
                return this.AllowedAssets[I];
            }
        } else {
            return this.AllowedAssets[this.AllowedAssets.length - 1];
        }
    }
    SetNextPrevItem(Prev) {
        let Item;
        if (Prev) {
            Item = this.GetPrevItem();
        } else {
            Item = this.GetNextItem();
        }
        this.SetItem(Item && Item.Name, true);
    }
    Strip(Undo) {
        if (this.CanStrip()) {
            this.SetItem(null, Undo == null || Undo);
        }
    }
    CanStrip() {
        return this.CanChange && this.Item && this.Group.AllowNone; // && !this.Group.KeepNaked
    }
    ReloadItem() {
        this.Item = this.C.Appearance.find(I => I.Asset.Group.Name == this.Group.Name);
        this.Color = (this.Item && this.Item.Color) || this.Color || "None";
    }
    IsBlocked(asset) {
        return this.C.BlockItems.some(Item => Item.Name == asset.Name && Item.Group == this.Group.Name);
    }
    Block(asset) {
        if (this.C.ID == 0) {
            if (this.IsBlocked(asset)) {
                Player.BlockItems = Player.BlockItems.filter(Item => Item.Name != asset.Name || Item.Group != this.Group.Name)
            } else if (this.Group.Category == "Item" || this.Group.AllowCustomize) {
                Player.BlockItems.push({ Name: asset.Name, Group: this.Group.Name });
            } else {
                return;
            }
            ServerSend("AccountUpdate", { BlockItems: Player.BlockItems });
        }
    }
    ChangeBlockMode() {
        if (AppearanceBlockMode) {
            this.Assets = [...this.AssetsSave];
            AppearanceBlockMode = false;
        } else {
            this.Assets = Asset.filter(A => A.Group.Name == this.Group.Name); /// #742 this.Group.Assets;
            AppearanceBlockMode = true;
        }
    }
    AppearanceDraw(Pos) {
        if (this.CanStrip()) {
            DrawButton(1365 - AppearanceHeight, 145 + Pos * AppearanceOffset, AppearanceHeight, AppearanceHeight, "", "White", "Icons/Small/Naked.png", TextGet("StripItem"));
        }
        if (this.CanChange)
            DrawBackNextButton(1390, 145 + Pos * AppearanceOffset, 400, AppearanceHeight, this.Group.Description + ": " + CharacterAppearanceGetCurrentValue(this.C, this.Group.Name, "Description"), "White", null,
                () => { const Item = this.GetPrevItem(); return Item ? Item.Description : "None" },
                () => { const Item = this.GetNextItem(); return Item ? Item.Description : "None" },
                () => "Show All Items In Group"
            );
        else DrawButton(1390, 145 + Pos * AppearanceOffset, 400, AppearanceHeight, this.Group.Description + ": " + CharacterAppearanceGetCurrentValue(this.C, this.Group.Name, "Description"), "#AAAAAA");
        DrawButton(1815, 145 + Pos * AppearanceOffset, 160, AppearanceHeight, this.Color, ((this.Color.indexOf("#") == 0) ? this.Color : "White"), null, (!this.CanChange && this.Group.AllowColorize) ? "Copy Color" : null);
    }
    async AppearanceClick() {
        if ((MouseX >= 1365 - AppearanceHeight) && (MouseX < 1365)) {
            if (this.CanStrip()) {
                this.Strip();
            }
        } else if ((MouseX >= 1390) && (MouseX < 1790)) {
            if (this.CanChange) {
                if (!CommonIsMobile && MouseX < 1390 + (400 / 3)) {
                    this.SetNextPrevItem(true);
                } else if (!CommonIsMobile && MouseX >= 1390 + (400 / 3) * 2) {
                    this.SetNextPrevItem(false);
                } else {
                    AppearanceItem = this;
                    this.C.FocusGroup = this.Group;
                    AppearanceItem.SetItem(AppearanceItem.Item && AppearanceItem.Item.Asset.Name, true);
                    AppearanceItemsOffset = 0;
                    AppearanceItemUndo = true;
                    AppearanceMode = "Items";
                }
            }
        } else if ((MouseX >= 1815) && (MouseX < 1975)) {
            if (this.CanChange) {
                if (this.Group.AllowColorize) {
                    AppearanceItem = this;
                    AppearanceItem.SetColor(this.Color == "None" ? "Default" : this.Color, true);
                    ElementCreateInput("InputColor", "text", ((this.Color == "Default") || (this.Color == "None")) ? "#" : this.Color, "7");
                    AppearanceColorUndo = true;
                    AppearanceMode = "Color";
                } else {
                    this.NextColor(this.C, this.Name);
                }
            } else if (this.Group.AllowColorize) {
                AppearanceColorPaste = this.Color;
                if (navigator.clipboard) await navigator.clipboard.writeText(AppearanceColorPaste);
            }
        }
    }
    ItemDraw(Posn) {
        /// remove

        /// iterract
        DrawButton(1390, 145 + Pos * AppearanceOffset, 400, AppearanceHeight, this.Group.Description + ": " + CharacterAppearanceGetCurrentValue(this.C, this.Group.Name, "Description"), "#AAAAAA");
        /// color
        DrawButton(1815, 145 + Pos * AppearanceOffset, 160, AppearanceHeight, this.Color, ((this.Color.indexOf("#") == 0) ? this.Color : "White"));
    }
    ItemClick() {

    }
}

class RGBRotate {
    constructor() {
        this.matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
    Clamp(v) {
        if (v < 0) return 0;
        if (v > 255) return 255;
        return parseInt(v + 0.5);
    }
    SetRotation(degrees) {
        const cosA = Math.cos(degrees);
        const sinA = Math.sin(degrees);
        const s = Math.sqrt(1. / 3.);
        this.matrix[0][0] = cosA + (1.0 - cosA) / 3.0;
        this.matrix[0][1] = 1. / 3. * (1.0 - cosA) - s * sinA;
        this.matrix[0][2] = 1. / 3. * (1.0 - cosA) + s * sinA;
        this.matrix[1][0] = 1. / 3. * (1.0 - cosA) + s * sinA;
        this.matrix[1][1] = cosA + 1. / 3. * (1.0 - cosA);
        this.matrix[1][2] = 1. / 3. * (1.0 - cosA) - s * sinA;
        this.matrix[2][0] = 1. / 3. * (1.0 - cosA) - s * sinA;
        this.matrix[2][1] = 1. / 3. * (1.0 - cosA) + s * sinA;
        this.matrix[2][2] = cosA + 1. / 3. * (1.0 - cosA);
    }
    Apply(r, g, b) {
        const rx = r * this.matrix[0][0] + g * this.matrix[0][1] + b * this.matrix[0][2];
        const gx = r * this.matrix[1][0] + g * this.matrix[1][1] + b * this.matrix[1][2];
        const bx = r * this.matrix[2][0] + g * this.matrix[2][1] + b * this.matrix[2][2];
        return [this.Clamp(rx), this.Clamp(gx), this.Clamp(bx)];
    }
}

const AppearanceHUERot = new RGBRotate();

const AppearanceZones = [
    {
        Name: "Head",
        Description: "Head",
        Category: "Appearance",
        Groups: new Set([
            "Hat", "HairAccessory1", "HairAccessory2", "Glasses", "HairBack", "HairFront", "Eyes", "Eyebrows", "Mouth"
        ]),
        Zone: [[100, 0, 300, 250]]

    },
    {
        Name: "UpperBody",
        Description: "Upper Body",
        Category: "Appearance",
        Groups: new Set([
            "Cloth", "Bra", "Gloves", "TailStraps", "Wings", "Height", "BodyUpper", "Hands", "ClothAccessory", "Suit"
        ]),
        Zone: [[100, 250, 300, 200]]
    },
    {
        Name: "LowerBody",
        Description: "Lower Body",
        Category: "Appearance",
        Groups: new Set([
            "ClothLower", "Panties", "Socks", "Shoes", "BodyLower", "Nipples", "Pussy", "SuitLower"
        ]),
        Zone: [[100, 450, 300, 550]]
    },
];

function AppearanceSetZone(Name) {
    const C = CharacterAppearanceSelection;
    if (C.FocusGroup && C.FocusGroup.Name == Name) {
        C.FocusGroup = null;
    } else {
        C.FocusGroup = Name && AppearanceZones.find(Z => Z.Category == AppearanceSelectedCategory && Z.Name == Name);
    }
    AppearanceAssets = AppearanceAssetsAll
        .filter(G => G.Group.Category == AppearanceSelectedCategory)
        .filter(G => C.FocusGroup == null || C.FocusGroup.Groups.has(G.Group.Name));
}

function AppearanceBuildAssets(C) {
    AppearanceAssets = [];
    AppearanceAssetsAll = [];

    AssetGroup
        .filter(G => G.Family == C.AssetFamily)
        .filter(G => G.Category == "Item" || G.AllowCustomize)
        .forEach(G => AppearanceAssetsAll.push(new AppearanceAssetGroup(C, G)));
    AppearanceSetZone();
}

function AppearanceRunUndo(NoPop) {
    if (AppearanceUndo.length > 0) {
        if (NoPop) AppearanceUndo[AppearanceUndo.length - 1]();
        else AppearanceUndo.pop()();
    }
}

function AppearanceNormalRun() {
    const C = CharacterAppearanceSelection;

    AppearanceOffset = AppearanceHeight + AppearanceSpace;
    AppearanceNumPerPage = parseInt(900 / AppearanceOffset);

    // Draw the top buttons with images
    if (AppearanceUndo.length > 0) DrawButton(1183, 25, 90, 90, "", "White", "Icons/Magic.png", "Undo");
    if (C.ID == 0) {
        DrawButton(1300, 25, 90, 90, "", "White", "Icons/" + ((LogQuery("Wardrobe", "PrivateRoom")) ? "Wardrobe" : "Reset") + ".png", TextGet(LogQuery("Wardrobe", "PrivateRoom") ? "Wardrobe" : "ResetClothes"));
        DrawButton(1417, 25, 90, 90, "", "White", "Icons/Random.png", TextGet("Random"));
    } else if (C.AllowItem && LogQuery("Wardrobe", "PrivateRoom")) DrawButton(1417, 25, 90, 90, "", "White", "Icons/Wardrobe.png", TextGet("Wardrobe"));
    if (C.AllowItem) DrawButton(1534, 25, 90, 90, "", "White", "Icons/Naked.png", TextGet("Naked"));
    if (AppearanceAssets.length > AppearanceNumPerPage) DrawButton(1651, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));

    if (CharacterAppearanceOffset >= AppearanceAssets.length) CharacterAppearanceOffset = 0;
    for (let A = CharacterAppearanceOffset; A < AppearanceAssets.length && A < CharacterAppearanceOffset + AppearanceNumPerPage; A++) {
        AppearanceAssets[A].Draw(A - CharacterAppearanceOffset);
    }
}

function AppearanceNormalClick() {
    const C = CharacterAppearanceSelection;

    if ((MouseX >= 1365 - AppearanceHeight) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 975)) {
        for (let A = CharacterAppearanceOffset; A < AppearanceAssets.length && A < CharacterAppearanceOffset + AppearanceNumPerPage; A++) {
            if ((MouseY >= 145 + (A - CharacterAppearanceOffset) * AppearanceOffset) && (MouseY <= 145 + AppearanceHeight + (A - CharacterAppearanceOffset) * AppearanceOffset)) {
                AppearanceAssets[A].Click();
            }
        }
    }

    let HeightRatio = CharacterAppearanceGetCurrentValue(C, "Height", "Zoom");
    if ((Player != null) && (Player.VisualSettings != null) && (Player.VisualSettings.ForceFullHeight != null) && Player.VisualSettings.ForceFullHeight) HeightRatio = 1.0;
    const X = 750;
    const Xoffset = 500 * (1 - HeightRatio) / 2;
    const YOffset = 1000 * (1 - HeightRatio);
    let broke = false;
    for (let A = 0; A < AppearanceZones.length && !broke; A++)
        for (let Z = 0; Z < AppearanceZones[A].Zone.length; Z++) {
            if (((C.Pose.indexOf("Suspension") < 0) && (MouseX - X >= ((AppearanceZones[A].Zone[Z][0] * HeightRatio) + Xoffset)) && (MouseY >= (((AppearanceZones[A].Zone[Z][1] - C.HeightModifier) * HeightRatio) + YOffset)) && (MouseX - X <= (((AppearanceZones[A].Zone[Z][0] + AppearanceZones[A].Zone[Z][2]) * HeightRatio) + Xoffset)) && (MouseY <= (((AppearanceZones[A].Zone[Z][1] + AppearanceZones[A].Zone[Z][3] - C.HeightModifier) * HeightRatio) + YOffset)))
                || ((C.Pose.indexOf("Suspension") >= 0) && (MouseX - X >= ((AppearanceZones[A].Zone[Z][0] * HeightRatio) + Xoffset)) && (MouseY >= HeightRatio * ((1000 - (AppearanceZones[A].Zone[Z][1] + AppearanceZones[A].Zone[Z][3])) - C.HeightModifier)) && (MouseX - X <= (((AppearanceZones[A].Zone[Z][0] + AppearanceZones[A].Zone[Z][2]) * HeightRatio) + Xoffset)) && (MouseY <= HeightRatio * (1000 - ((AppearanceZones[A].Zone[Z][1])) - C.HeightModifier)))) {
                if (AppearanceZones[A].Category == AppearanceSelectedCategory) {
                    CharacterAppearanceOffset = 0;
                    AppearanceSetZone(AppearanceZones[A].Name);
                    broke = true;
                }
                break;
            }
        }

    if ((MouseX >= 1183) && (MouseX < 1273) && (MouseY >= 25) && (MouseY < 115)) AppearanceRunUndo();
    if ((MouseX >= 1300) && (MouseX < 1390) && (MouseY >= 25) && (MouseY < 115) && (C.ID == 0) && C.AllowItem && !LogQuery("Wardrobe", "PrivateRoom")) CharacterAppearanceSetDefault(C);
    if ((MouseX >= 1300) && (MouseX < 1390) && (MouseY >= 25) && (MouseY < 115) && (C.ID == 0) && C.AllowItem && LogQuery("Wardrobe", "PrivateRoom")) { CharacterAppearanceWardrobeLoad(C); }
    if ((MouseX >= 1417) && (MouseX < 1507) && (MouseY >= 25) && (MouseY < 115) && (C.ID == 0) && C.AllowItem) {
        const Undo = AppearanceTempWardrobe[AppearanceTempWardrobe.length] = WardrobeSaveData(C);
        AppearanceUndo.push(() => { WardrobeLoadData(C, Undo, false); AppearanceTempWardrobe.pop(); });
        CharacterAppearanceFullRandom(C);
    }
    if ((MouseX >= 1417) && (MouseX < 1507) && (MouseY >= 25) && (MouseY < 115) && (C.ID != 0) && C.AllowItem && LogQuery("Wardrobe", "PrivateRoom")) CharacterAppearanceWardrobeLoad(C);
    if ((MouseX >= 1534) && (MouseX < 1624) && (MouseY >= 25) && (MouseY < 115) && C.AllowItem) { AppearanceAssets.filter(A => A.CanStrip() && !A.Group.KeepNaked).forEach(A => A.Strip()); }
    if ((MouseX >= 1651) && (MouseX < 1741) && (MouseY >= 25) && (MouseY < 115)) {
        CharacterAppearanceOffset += AppearanceNumPerPage;
        if (CharacterAppearanceOffset >= AppearanceAssets.length) CharacterAppearanceOffset = 0;
    }
    if ((MouseX >= 1768) && (MouseX < 1858) && (MouseY >= 25) && (MouseY < 115)) { C.FocusGroup = null; CharacterAppearanceExit(C); }
    if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && C.AllowItem) { C.FocusGroup = null; CharacterAppearanceReady(C); }
}

function AppearanceItemsRun() {
    const C = CharacterAppearanceSelection;

    if (AppearanceItem == null) {
        AppearanceMode = "";
        return;
    }

    AppearanceOffset = AppearanceHeight + AppearanceSpace;
    AppearanceNumPerPage = parseInt(900 / AppearanceOffset) * 2;

    if (C.ID == 0 && AppearanceItem.Group.AllowCustomize && !AppearanceBlockMode) DrawButton(1417, 25, 90, 90, "", "White", "Icons/DialogPermissionMode.png", DialogFind(Player, "DialogPermissionMode"));
    if (AppearanceItem.Assets.length > AppearanceNumPerPage) DrawButton(1534, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
    if (AppearanceItem.CanStrip()) DrawButton(1651, 25, 90, 90, "", "White", "Icons/Naked.png", TextGet("StripItem"));

    // Creates buttons for all groups
    const ItemName = AppearanceItem.Item && AppearanceItem.Item.Asset && AppearanceItem.Item.Asset.Name;
    const Draw = (Left, Top, Width, Height, Item) => {
        const Hover = !CommonIsMobile && (MouseX >= Left) && (MouseX < Left + Width) && (MouseY >= Top) && (MouseY < Top + Height);
        const Block = AppearanceItem.IsBlocked(Item);
        const Worn = ItemName == Item.Name;
        DrawRect(Left, Top, Width, Height, (AppearanceBlockMode && C.ID == 0) ?
            (Worn ? "Gray" : Block ? Hover ? "Red" : "Pink" : Hover ? "Green" : "Lime") :
            ((Hover && !Block) ? "Cyan" : Worn ? "Pink" : Block ? "Gray" : "White"));
        DrawTextFit(Item.Description, Left + Width / 2, Top + (Height / 2) + 1, Width - 4, "black");
    }
    for (let A = AppearanceItemsOffset; A * 2 < AppearanceItem.Assets.length && A * 2 < AppearanceItemsOffset * 2 + AppearanceNumPerPage; A++) {
        Draw(1250, 145 + (A - AppearanceItemsOffset) * AppearanceOffset, 350, AppearanceHeight, AppearanceItem.Assets[A * 2]);
        if (A * 2 + 1 >= AppearanceItem.Assets.length || A * 2 + 1 >= AppearanceItemsOffset * 2 + AppearanceNumPerPage) break;
        Draw(1630, 145 + (A - AppearanceItemsOffset) * AppearanceOffset, 350, AppearanceHeight, AppearanceItem.Assets[A * 2 + 1]);
    }
}

function AppearanceItemsClick() {
    const C = CharacterAppearanceSelection;

    const Click = Item => {
        if (!AppearanceItem.IsBlocked(Item)) {
            if (AppearanceBlockMode) {
                AppearanceItem.Block(Item);
            } else {
                AppearanceItem.SetItem(Item.Name);
            }
        } else if (AppearanceBlockMode) {
            AppearanceItem.Block(Item);
        }
    }

    if ((MouseX >= 1250) && (MouseX < 1600) && (MouseY >= 145) && (MouseY < 975))
        for (let A = AppearanceItemsOffset; A * 2 < AppearanceItem.Assets.length && A * 2 < AppearanceItemsOffset * 2 + AppearanceNumPerPage; A++)
            if ((MouseY >= 145 + (A - AppearanceItemsOffset) * AppearanceOffset) && (MouseY <= 145 + AppearanceHeight + (A - AppearanceItemsOffset) * AppearanceOffset)) {
                Click(AppearanceItem.Assets[A * 2]);
                break;
            }

    if ((MouseX >= 1630) && (MouseX < 1980) && (MouseY >= 145) && (MouseY < 975))
        for (let A = AppearanceItemsOffset; A * 2 + 1 < AppearanceItem.Assets.length && A * 2 + 1 < AppearanceItemsOffset * 2 + AppearanceNumPerPage; A++)
            if ((MouseY >= 145 + (A - AppearanceItemsOffset) * AppearanceOffset) && (MouseY <= 145 + AppearanceHeight + (A - AppearanceItemsOffset) * AppearanceOffset)) {
                Click(AppearanceItem.Assets[A * 2 + 1]);
                break;
            }

    if ((MouseX >= 1417) && (MouseX < 1507) && (MouseY >= 25) && (MouseY < 115) && C.ID == 0 && !AppearanceBlockMode) AppearanceItem.ChangeBlockMode();;

    if ((MouseX >= 1651) && (MouseX < 1741) && (MouseY >= 25) && (MouseY < 115) && AppearanceItem.CanStrip()) AppearanceItem.Strip(false);

    if ((MouseX >= 1534) && (MouseX < 1624) && (MouseY >= 25) && (MouseY < 115) && AppearanceItem.Assets.length > AppearanceNumPerPage) {
        AppearanceItemsOffset += AppearanceNumPerPage / 2;
        if (AppearanceItemsOffset * 2 + 1 >= AppearanceItem.Assets.length) AppearanceItemsOffset = 0;
    }

    if ((MouseX >= 1768) && (MouseX < 1858) && (MouseY >= 25) && (MouseY < 115) && !AppearanceBlockMode) {
        AppearanceSetZone();
        AppearanceExit();
    }

    if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) {
        if (AppearanceBlockMode) {
            AppearanceItem.ChangeBlockMode();
            return;
        }
        AppearanceItemUndo = false;
        AppearanceSetZone();
        AppearanceExit();
    }
}

function AppearanceColorRun() {
    if (AppearanceItem && document.getElementById("InputColor")) {
        if (!CommonIsMobile && CommonIsClickAt(1768, 25, 90, 90) || CommonIsClickAt(1885, 25, 90, 90)) {
            document.getElementById("InputColor").style.display = "none";
        } else {
            ElementPosition("InputColor", 1450, 65, 300);
        }
    }
    else { AppearanceMode = ""; return; }
    DrawButton(1610, 37, 65, 65, "", "White", "Icons/Color.png");

    let Color = AppearanceItem && AppearanceItem.Color || "#FFFFFF";

    DrawButton(1285, 880, 90, 90, "", "White", "Icons/Reset.png", "Default");

    let B = AppearanceItem && Color || "#FFFFFF";
    let F = CommonColorToBW(Color);
    if (B[0] == '#') {
        DrawButton(1385, 880, 90, 90, "", Color, null, "Copy", null, () => { B = "Cyan"; });
        {
            MainCanvas.beginPath();
            MainCanvas.lineWidth = "5";
            MainCanvas.fillStyle = F;
            MainCanvas.strokeStyle = MainCanvas.fillStyle;
            MainCanvas.moveTo(1385 + 20, 880 + 20);
            MainCanvas.lineTo(1385 + 70, 880 + 70);
            MainCanvas.moveTo(1385 + 20, 880 + 70);
            MainCanvas.lineTo(1385 + 70, 880 + 20);
            MainCanvas.stroke();
            MainCanvas.closePath();

            MainCanvas.beginPath();
            MainCanvas.lineWidth = "5";
            MainCanvas.fillStyle = F;
            MainCanvas.strokeStyle = MainCanvas.fillStyle;
            MainCanvas.strokeRect(1385 + 20, 880 + 20, 50, 50)
            MainCanvas.stroke();
            MainCanvas.closePath();

            MainCanvas.beginPath();
            MainCanvas.lineWidth = "15";
            MainCanvas.fillStyle = B;
            MainCanvas.strokeStyle = MainCanvas.fillStyle;
            MainCanvas.moveTo(1385 + 15, 880 + 45);
            MainCanvas.lineTo(1385 + 75, 880 + 45);
            MainCanvas.moveTo(1385 + 45, 880 + 15);
            MainCanvas.lineTo(1385 + 45, 880 + 75);
            MainCanvas.stroke();
            MainCanvas.closePath();
        }
    }

    B = AppearanceColorPaste;
    DrawButton(1485, 880, 90, 90, "", AppearanceColorPaste, null, "Paste", null, () => { B = "Cyan"; });
    F = CommonColorToBW(AppearanceColorPaste);
    {
        MainCanvas.beginPath();
        MainCanvas.lineWidth = "5";
        MainCanvas.fillStyle = F;
        MainCanvas.strokeStyle = MainCanvas.fillStyle;
        MainCanvas.moveTo(1485 + 20, 880 + 20);
        MainCanvas.lineTo(1485 + 70, 880 + 70);
        MainCanvas.moveTo(1485 + 20, 880 + 70);
        MainCanvas.lineTo(1485 + 70, 880 + 20);
        MainCanvas.stroke();
        MainCanvas.closePath();

        MainCanvas.beginPath();
        MainCanvas.lineWidth = "2";
        MainCanvas.fillStyle = F;
        MainCanvas.strokeStyle = MainCanvas.fillStyle;
        MainCanvas.lineWidth = "13";
        MainCanvas.moveTo(1485 + 25, 880 + 45);
        MainCanvas.lineTo(1485 + 65, 880 + 45);
        MainCanvas.moveTo(1485 + 45, 880 + 25);
        MainCanvas.lineTo(1485 + 45, 880 + 65);
        MainCanvas.stroke();
        MainCanvas.closePath();

        MainCanvas.beginPath();
        MainCanvas.lineWidth = "4";
        MainCanvas.fillStyle = B;
        MainCanvas.strokeStyle = MainCanvas.fillStyle;
        MainCanvas.moveTo(1485 + 25, 880 + 45);
        MainCanvas.lineTo(1485 + 65, 880 + 45);
        MainCanvas.moveTo(1485 + 45, 880 + 25);
        MainCanvas.lineTo(1485 + 45, 880 + 65);
        MainCanvas.stroke();
        MainCanvas.closePath();
    }

    DrawButton(1585, 880, 90, 90, AppearanceShadeMode, "White", null, AppearanceShadeMode == "LIG" ? "Lightness" : null);

    DrawButton(1685, 880, 90, 90, AppearanceShade.toString() + "%", "White", null, "Shade Percent");

    const Lighter = CommonShadeColor(Color, AppearanceShade);
    DrawButton(1785, 880, 90, 90, "", Lighter, null, "Lighten");
    {
        MainCanvas.beginPath();
        MainCanvas.lineWidth = "5";
        MainCanvas.fillStyle = CommonColorToBW(Lighter);
        MainCanvas.strokeStyle = MainCanvas.fillStyle;
        MainCanvas.moveTo(1785 + 20, 880 + 45);
        MainCanvas.lineTo(1785 + 70, 880 + 45);
        MainCanvas.moveTo(1785 + 45, 880 + 20);
        MainCanvas.lineTo(1785 + 45, 880 + 70);
        MainCanvas.stroke();
        MainCanvas.closePath();
    }

    const Darker = CommonShadeColor(Color, 0 - AppearanceShade);
    DrawButton(1885, 880, 90, 90, "", Darker, null, "Darken");
    {
        MainCanvas.beginPath();
        MainCanvas.lineWidth = "5";
        MainCanvas.fillStyle = CommonColorToBW(Darker);
        MainCanvas.strokeStyle = MainCanvas.fillStyle;
        MainCanvas.moveTo(1885 + 20, 880 + 45);
        MainCanvas.lineTo(1885 + 70, 880 + 45);
        MainCanvas.stroke();
        MainCanvas.closePath();
    }

    AppearanceHideColorPicker = false;
    ColorPickerDraw(1300, 145, 675, 830, ElementValue("InputColor"), function (Color) {
        AppearanceItem.SetColor(Color);
        ElementValue("InputColor", Color);
    });
}

async function AppearanceColorClick() {
    if (AppearanceItem == null) {
        AppearanceMode = "";
        return;
    }
    // Can set a color manually from the text field
    if ((MouseX >= 1610) && (MouseX < 1675) && (MouseY >= 37) && (MouseY < 102))
        if (CommonIsColor(ElementValue("InputColor") || ElementValue("InputColor") == AppearanceItem.Group.ColorSchema[0]))
            AppearanceItem.SetColor(ElementValue("InputColor"));

    if (CommonIsClickAt(1285, 880, 90, 90)) {
        AppearanceItem.SetColor(AppearanceItem.Group.ColorSchema[0]);
        ElementValue("InputColor", AppearanceItem.Group.ColorSchema[0]);
    }

    if (CommonIsClickAt(1385, 880, 90, 90)) {
        AppearanceColorPaste = AppearanceItem.Color;
        if (navigator.clipboard) await navigator.clipboard.writeText(AppearanceColorPaste);
    }

    if (CommonIsClickAt(1485, 880, 90, 90)) {
        AppearanceItem.SetColor(AppearanceColorPaste);
        ElementValue("InputColor", AppearanceItem.Color);
    }

    if (CommonIsClickAt(1555, 880, 90, 90)) {
        if (AppearanceShadeMode == "LIG") AppearanceShadeMode = "HUE";
        else AppearanceShadeMode = "LIG";
    }

    if (CommonIsClickAt(1685, 880, 90, 90)) {
        if (AppearanceShade == 5) AppearanceShade = 10;
        else if (AppearanceShade == 10) AppearanceShade = 20;
        else if (AppearanceShade == 20) AppearanceShade = 1;
        else AppearanceShade = 5;
    }

    if (CommonIsClickAt(1785, 880, 90, 90)) {
        if (AppearanceShadeMode == "LIG") {
            AppearanceItem.SetColor(CommonShadeColor(AppearanceItem.Color, AppearanceShade));
        } else if (AppearanceShadeMode == "HUE") {
            AppearanceItem.SetColor(CommonRotateColor(AppearanceItem.Color, AppearanceShade));
        }
        ElementValue("InputColor", AppearanceItem.Color);
        ColorPickerInitialHSV = null;
    }

    if (CommonIsClickAt(1885, 880, 90, 90)) {
        if (AppearanceShadeMode == "LIG") {
            AppearanceItem.SetColor(CommonShadeColor(AppearanceItem.Color, 0 - AppearanceShade));
        } else if (AppearanceShadeMode == "HUE") {
            AppearanceItem.SetColor(CommonRotateColor(AppearanceItem.Color, 0 - AppearanceShade));
        }
        ElementValue("InputColor", AppearanceItem.Color);
        ColorPickerInitialHSV = null;
    }

    if ((MouseX >= 1768) && (MouseX < 1858) && (MouseY >= 25) && (MouseY < 115)) {
        AppearanceExit();
    }

    if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) {
        AppearanceColorUndo = false;
        AppearanceExit();
    }

    if (AppearanceMode != "Color") ElementRemove("InputColor");
}

function AppearanceWardrobeRun() {
    const C = CharacterAppearanceSelection;
    // Draw the wardrobe top controls & buttons
    if (!AppearanceWardrobeShouldUndo) DrawButton(1300, 25, 90, 90, "", "White", "Icons/Magic.png", TextGet("Undo"));
    DrawButton(1417, 25, 90, 90, "", "White", "Icons/Dress.png", TextGet("DressManually"));
    DrawButton(1534, 25, 90, 90, "", "White", "Icons/Naked.png", TextGet("Naked"));
    DrawButton(1651, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
    DrawText(CharacterAppearanceWardrobeText, 1645, 155, "White", "Gray");
    if (document.getElementById("InputWardrobeName")) ElementPosition("InputWardrobeName", 1645, 230, 690);
    else AppearanceMode = "";

    if (navigator.clipboard) {
        DrawButton(1400, 320, 180, 65, "Import", "White");
        DrawButton(1700, 320, 180, 65, "Export", "White");
    }

    // Draw 6 wardrobe options
    for (let W = AppearanceWardrobeOffset; W < WardrobeSize && W < AppearanceWardrobeOffset + 6; W++) {
        DrawButton(1300, 430 + (W - AppearanceWardrobeOffset) * 95, 500, 65, "", "White", "");
        DrawTextFit((W + 1).toString() + (W < 9 ? ":  " : ": ") + Player.WardrobeCharacterNames[W], 1550, 463 + (W - AppearanceWardrobeOffset) * 95, 496, "Black");
        DrawButton(1820, 430 + (W - AppearanceWardrobeOffset) * 95, 160, 65, "Save", "White", "");
    }
}

async function AppearanceWardrobeClick() {
    const C = CharacterAppearanceSelection;
    if ((MouseX >= 1651) && (MouseX < 1741) && (MouseY >= 25) && (MouseY < 115)) {
        AppearanceWardrobeOffset += 6;
        if (AppearanceWardrobeOffset >= WardrobeSize) AppearanceWardrobeOffset = 0;
    }
    if ((MouseX >= 1300) && (MouseX < 1800) && (MouseY >= 430) && (MouseY < 970))
        for (let W = AppearanceWardrobeOffset; W < WardrobeSize && W < AppearanceWardrobeOffset + 6; W++)
            if ((MouseY >= 430 + (W - AppearanceWardrobeOffset) * 95) && (MouseY <= 495 + (W - AppearanceWardrobeOffset) * 95)) {
                if (AppearanceWardrobeShouldUndo) {
                    const Undo = AppearanceTempWardrobe[AppearanceTempWardrobe.length] = WardrobeSaveData(C);
                    AppearanceUndo.push(() => { WardrobeLoadData(C, Undo, false); AppearanceTempWardrobe.pop(); });
                    AppearanceWardrobeShouldUndo = false;
                }
                WardrobeFastLoad(C, W, false);
            }

    if (navigator.clipboard) {
        if (CommonIsClickAt(1400, 320, 180, 65)) {
            const obj = JSON.parse(CommonLZWDecode(await navigator.clipboard.readText()));
            if (Array.isArray(obj) &&
                obj.every(Boolean) &&
                obj.every(B =>
                    (Array.isArray(B) && (B.every(P => typeof P === 'string'))) ||
                    (B.Name && B.Group)))
                WardrobeLoadData(CharacterAppearanceSelection, obj, false);
        }
        if (CommonIsClickAt(1700, 320, 180, 65)) {
            await navigator.clipboard.writeText(CommonLZWEncode(JSON.stringify(WardrobeSaveData(CharacterAppearanceSelection))));
        }
    }

    if ((MouseX >= 1820) && (MouseX < 1975) && (MouseY >= 430) && (MouseY < 970))
        for (let W = AppearanceWardrobeOffset; W < WardrobeSize && W < AppearanceWardrobeOffset + 6; W++)
            if ((MouseY >= 430 + (W - AppearanceWardrobeOffset) * 95) && (MouseY <= 495 + (W - AppearanceWardrobeOffset) * 95)) {
                WardrobeFastSave(C, W);
                const LS = /^[a-zA-Z ]+$/;
                const Name = ElementValue("InputWardrobeName").trim();
                if (Name.match(LS) || Name.length == 0) {
                    WardrobeSetCharacterName(W, Name);
                    CharacterAppearanceWardrobeText = TextGet("WardrobeNameInfo");
                } else {
                    CharacterAppearanceWardrobeText = TextGet("WardrobeNameError");
                }
            }

    if ((MouseX >= 1300) && (MouseX < 1390) && (MouseY >= 25) && (MouseY < 115) && !AppearanceWardrobeShouldUndo) { AppearanceRunUndo(); AppearanceWardrobeShouldUndo = true; }
    if ((MouseX >= 1417) && (MouseX < 1507) && (MouseY >= 25) && (MouseY < 115)) { AppearanceMode = ""; ElementRemove("InputWardrobeName"); }
    if ((MouseX >= 1534) && (MouseX < 1624) && (MouseY >= 25) && (MouseY < 115)) { AppearanceAssets.filter(A => A.CanStrip() && !A.Group.KeepNaked).forEach(A => A.Strip()); }
    if ((MouseX >= 1768) && (MouseX < 1858) && (MouseY >= 25) && (MouseY < 115)) { C.FocusGroup = null; CharacterAppearanceExit(C); }
    if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) { C.FocusGroup = null; CharacterAppearanceReady(C); }
}
