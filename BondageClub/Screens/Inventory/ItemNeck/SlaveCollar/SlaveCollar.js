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
        Name: "PosturePosture",
        Image: "PostureCollar",
        Property: { Type: "PosturePosture", Effect: [] }
    },
];

// Loads the item extension properties
function InventoryItemNeckSlaveCollarLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Effect: []  };
}

// Draw the item extension screen
function InventoryItemNeckSlaveCollarDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/"  + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
    
    for (var I = 0; I < SlaveCollarTypes.length; I++) {
        var Type = DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.Type || "";
		DrawButton(1000 + I * 350, 550, 225, 225, "", (Type == SlaveCollarTypes[I].Name) ? "#888888" : "White");
		DrawImage("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + SlaveCollarTypes[I].Image + ".png", 1000 + I * 350, 550);
		DrawText(AssetGet(DialogFocusItem.Asset.Group.Family, DialogFocusItem.Asset.Group.Name, SlaveCollarTypes[I].Image).Description, 1115 + I * 350, 800, "white", "gray");
	};
}

// Catches the item extension clicks
function InventoryItemNeckSlaveCollarClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) { DialogFocusItem = null; return; }
    
    // Item buttons
	for (var I = 0; I < SlaveCollarTypes.length; I++) {
        var Type = DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.Type || "";
		if ((MouseX >= 1000 + I * 350) && (MouseX <= 1225 + I * 350) && (MouseY >= 550) && (MouseY <= 775) && (Type != SlaveCollarTypes[I].Image))
			InventorySpankingToySetType(SlaveCollarTypes[I].Name);
	}
}

// Sets the shock collar intensity
function InventoryItemNeckSlaveCollarSetType(NewType) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DialogFocusItem.Property = SlaveCollarTypes.find(Collar => Collar.Name == NewType).Property || SlaveCollarTypes[0].Property;
    ChatRoomPublishCustomAction((DialogFind(Player, "SlaveCollarSetType" + NewType)).replace("SourceCharacter",Player.Name).replace("DestinationCharacter", C.Name), true);
}
