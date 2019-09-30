"use strict"

var InventoryItemNeckSlaveColorMode = false;
var InventoryItemNeckSlaveColor = "Default";

var SlaveCollarTypes = [
    {
        Name: "",
        Image: "SlaveCollar",
        Property: null
    }, {
        Name: "SteelPosture",
        Image: "SteelPostureCollar",
        Property: { Type: "SteelPosture", Effect: [] }
    }, {
        Name: "LeatherPosture",
        Image: "PostureCollar",
        Property: { Type: "LeatherPosture", Effect: [] }
    },
];

// Loads the item extension properties
function InventoryItemNeckSlaveCollarLoad() {
    if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: [] };
}

// Draw the item extension screen
function InventoryItemNeckSlaveCollarDraw() {
    if (!InventoryItemNeckSlaveColorMode) DrawText(DialogFind(Player, "SlaveCollarSelectType"), 1500, 300, "white", "gray");
    var C = CharacterGetCurrent();
    if (C && C.IsOwnedByPlayer()) {
        var Color = DialogFocusItem.Color;
        var I = 1;
        if (InventoryItemNeckSlaveColorMode) {
            DrawButton(1775, 25, 90, 90, "", "White", "Icons/ColorCancel.png", DialogFind(Player, "ColorPick"));
            DrawButton(1665, 25, 90, 90, "", "White", "Icons/ColorSelect.png", DialogFind(Player, "ColorPick"));
            ElementPosition("InputColor", 1450, 65, 300);
            DrawImage("Backgrounds/ColorPicker.png", 1300, 145);
        } else {
            DrawButton(1775, 25, 90, 90, "", (Color != null && Color != "Default" && Color != "None") ? Color : "White", "Icons/ColorPick.png", DialogFind(Player, "ColorPick"));
        }
    }
    if (!InventoryItemNeckSlaveColorMode) {
        for (var I = 0; I < SlaveCollarTypes.length; I++) {
            var Type = DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.Type || "";
            if (C != null && C.IsOwnedByPlayer() || Type == SlaveCollarTypes[I].Name) {
                DrawButton(1037 + I * 350, 450, 225, 225, "", (Type == SlaveCollarTypes[I].Name) ? "#888888" : "White");
                DrawImage("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + SlaveCollarTypes[I].Image + ".png", 1037 + I * 350, 450);
                DrawText(AssetGet(DialogFocusItem.Asset.Group.Family, DialogFocusItem.Asset.Group.Name, SlaveCollarTypes[I].Image).Description, 1150 + I * 350, 720, "white", "gray");
            }
        }
    }
}

// Catches the item extension clicks
function InventoryItemNeckSlaveCollarClick() {
    if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) { DialogFocusItem = null; return; }
    var C = CharacterGetCurrent();
    if (C != null && C.IsOwnedByPlayer()) {
        if (InventoryItemNeckSlaveColorMode) {
            if ((MouseX >= 1665) && (MouseX <= 1755) && (MouseY >= 25) && (MouseY <= 110)) {
                var Color = ElementValue("InputColor");
                if (CommonIsColor(Color)) {
                    CharacterAppearanceSetColorForGroup(C, "ItemNeck", Color);
                    InventoryItemNeckSlaveColorMode = false;
                    ElementRemove("InputColor");
                    ChatRoomCharacterUpdate(C);
                    if (CurrentScreen != "ChatRoom") CharacterRefresh(C);
                    DialogFocusItem = null;
                }
            }
            if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) {
                InventoryItemNeckSlaveColorMode = false;
                CharacterAppearanceSetColorForGroup(C, "ItemNeck", InventoryItemNeckSlaveColor);
                ElementRemove("InputColor");
                CharacterLoadCanvas(C);
            }
            if ((MouseX >= 1300) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 975)) {
                var Color = DrawRGBToHex(MainCanvas.getImageData(MouseX, MouseY, 1, 1).data);
                CharacterAppearanceSetColorForGroup(C, "ItemNeck", Color);
                CharacterLoadCanvas(C);
                ElementValue("InputColor", Color);
            }
        } else {
            if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) {
                InventoryItemNeckSlaveColorMode = true;
                InventoryItemNeckSlaveColor = DialogFocusItem.Color;
                ElementCreateInput("InputColor", "text", (DialogColorSelect != null) ? DialogColorSelect.toString() : "");
            }
            for (var I = 0; I < SlaveCollarTypes.length; I++) {
                var Type = DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.Type || "";
                if ((MouseX >= 1037 + I * 350) && (MouseX <= 1262 + I * 350) && (MouseY >= 450) && (MouseY <= 675) && (Type != SlaveCollarTypes[I].Name))
                    InventoryItemNeckSlaveCollarSetType(SlaveCollarTypes[I].Name);
            }
        }
    }
}

// Sets the slave collar model
function InventoryItemNeckSlaveCollarSetType(NewType) {
    var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
    var Type = SlaveCollarTypes.find(Collar => Collar.Name == NewType) || SlaveCollarTypes[0];
    DialogFocusItem.Property = Type.Property;
    ChatRoomPublishCustomAction(DialogFind(Player, "SlaveCollarChangeType").replace("SourceCharacter", Player.Name).replace("DestinationCharacter", C.Name), true);
    if (CurrentScreen != "ChatRoom") CharacterRefresh(C);
}
