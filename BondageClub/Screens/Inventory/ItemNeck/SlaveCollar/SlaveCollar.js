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
    },{
        Name: "PetCollar",
        Image: "PetCollar",
        Property: { Type: "PetCollar", Effect: [] }
	},{
        Name: "HighCollar",
        Image: "HighCollar",
        Property: { Type: "HighCollar", Effect: [] }
	},{
        Name: "LeatherCollarBell",
        Image: "LeatherCollarBell",
        Property: { Type: "LeatherCollarBell", Effect: [] }
	},{
        Name: "LeatherCollarBow",
        Image: "LeatherCollarBow",
        Property: { Type: "LeatherCollarBow", Effect: [] }
	},{
        Name: "MaidCollar",
        Image: "MaidCollar",
        Property: { Type: "MaidCollar", Effect: [] }
	},{
        Name: "BatCollar",
        Image: "BatCollar",
        Property: { Type: "BatCollar", Effect: [] }
	},{
        Name: "HighSecurityCollar",
        Image: "HighSecurityCollar",
        Property: { Type: "HighSecurityCollar", Effect: [] }
	},{
        Name: "SpikeCollar",
        Image: "SpikeCollar",
        Property: { Type: "SpikeCollar", Effect: [] }
	},{
        Name: "BordelleCollar",
        Image: "BordelleCollar",
        Property: { Type: "BordelleCollar", Effect: [] }
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
            DrawButton(1775, 25, 90, 90, "", "White", "Icons/ColorCancel.png");
            DrawButton(1665, 25, 90, 90, "", "White", "Icons/ColorSelect.png");
            ElementPosition("InputColor", 1450, 65, 300);
            DrawImage("Backgrounds/ColorPicker.png", 1300, 145);
        } else {
            DrawButton(1775, 25, 90, 90, "", (Color != null && Color != "Default" && Color != "None") ? Color : "White", "Icons/ColorPick.png");
        }
    }
    if (!InventoryItemNeckSlaveColorMode) {
        for (var I = 0; I < SlaveCollarTypes.length; I++) {
            var Type = DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.Type || "";
            if (C != null && C.IsOwnedByPlayer() || Type == SlaveCollarTypes[I].Name) {
                DrawButton(937 + I * 125, 450, 125, 150, "", (Type == SlaveCollarTypes[I].Name) ? "#888888" : "White");
                DrawImage("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/PreviewSlaveCollar/" + SlaveCollarTypes[I].Image + ".png", 937 + I * 125, 450);
                DrawTextFit(AssetGet(DialogFocusItem.Asset.Group.Family, DialogFocusItem.Asset.Group.Name, SlaveCollarTypes[I].Image).Description, 999 + I * 125, 585, 125, 125, "white", "gray");
				DrawButton(1262, 800, 125, 125, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "HighSecurityCollar") ? "#888888" : "White");
	            DrawImage("Assets/Female3DCG/" + DialogFocusItem.Asset.Group.Name + "/PreviewSlaveCollar/" + DialogFocusItem.Asset.Name + "HighSecurityCollar.png", 1267, 809);
				DrawButton(1387, 800, 125, 125, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "SpikeCollar") ? "#888888" : "White");
	            DrawImage("Assets/Female3DCG/" + DialogFocusItem.Asset.Group.Name + "/PreviewSlaveCollar/" + DialogFocusItem.Asset.Name + "SpikeCollar.png", 1392, 809);
				DrawButton(1512, 800, 125, 125, "", (DialogFocusItem.Property.Type == null || DialogFocusItem.Property.Type == "BordelleCollar") ? "#888888" : "White");
	            DrawImage("Assets/Female3DCG/" + DialogFocusItem.Asset.Group.Name + "/PreviewSlaveCollar/" + DialogFocusItem.Asset.Name + "BordelleCollar.png", 1517, 809);
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
                    CharacterAppearanceSetColorForGroup(C, Color, "ItemNeck");
                    InventoryItemNeckSlaveColorMode = false;
                    ElementRemove("InputColor");
                    ChatRoomCharacterUpdate(C);
                    if (CurrentScreen != "ChatRoom") CharacterRefresh(C);
                    DialogFocusItem = null;
                }
            }
            if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110)) {
                InventoryItemNeckSlaveColorMode = false;
                CharacterAppearanceSetColorForGroup(C, InventoryItemNeckSlaveColor, "ItemNeck");
                ElementRemove("InputColor");
                CharacterLoadCanvas(C);
            }
            if ((MouseX >= 1300) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 975)) {
                var Color = DrawRGBToHex(MainCanvas.getImageData(MouseX, MouseY, 1, 1).data);
                CharacterAppearanceSetColorForGroup(C, Color, "ItemNeck");
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
                if ((MouseX >= 937 + I * 125) && (MouseX <= 1062 + I * 125) && (MouseY >= 450) && (MouseY <= 600) && (Type != SlaveCollarTypes[I].Name))
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
