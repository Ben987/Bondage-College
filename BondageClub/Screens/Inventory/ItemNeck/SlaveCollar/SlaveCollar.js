"use strict"

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
    DrawText(DialogFind(Player, "SlaveCollarSelectType"), 1500, 300, "white", "gray");
    var C = CharacterGetCurrent();
    for (var I = 0; I < SlaveCollarTypes.length; I++) {
        var Type = DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.Type || "";
        if (C != null && C.IsOwnedByPlayer() || Type == SlaveCollarTypes[I].Name) {
            DrawButton(1037 + I * 350, 450, 225, 225, "", (Type == SlaveCollarTypes[I].Name) ? "#888888" : "White");
            DrawImage("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + SlaveCollarTypes[I].Image + ".png", 1037 + I * 350, 450);
            DrawText(AssetGet(DialogFocusItem.Asset.Group.Family, DialogFocusItem.Asset.Group.Name, SlaveCollarTypes[I].Image).Description, 1150 + I * 350, 720, "white", "gray");
        }
    };
}

// Catches the item extension clicks
function InventoryItemNeckSlaveCollarClick() {
    var C = CharacterGetCurrent();
    if (C != null && C.IsOwnedByPlayer()) {
        for (var I = 0; I < SlaveCollarTypes.length; I++) {
            var Type = DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.Type || "";
            if ((MouseX >= 1037 + I * 350) && (MouseX <= 1262 + I * 350) && (MouseY >= 450) && (MouseY <= 675) && (Type != SlaveCollarTypes[I].Name))
                InventoryItemNeckSlaveCollarSetType(SlaveCollarTypes[I].Name);
        }
    }
}

// Sets the slave collar model
function InventoryItemNeckSlaveCollarSetType(NewType) {
    var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
    var Type = SlaveCollarTypes.find(Collar => Collar.Name == NewType) || SlaveCollarTypes[0];
    DialogFocusItem.Property = Type.Property;
    ChatRoomPublishCustomAction(DialogFind(Player, "SlaveCollarChangeType").replace("SourceCharacter", Player.Name).replace("DestinationCharacter", C.Name), true);
	if (CurrentScreen != "ChatRoom") CharacterRefresh(CurrentCharacter);
}
