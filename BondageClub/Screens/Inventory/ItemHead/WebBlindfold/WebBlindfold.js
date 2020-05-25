const InventoryItemHeadWebBlindfoldOptions = [
	{
		Name: "Blindfold",
		Property: { Type: null, Difficulty: 0 },
	},
	{
		Name: "Cocoon",
		Property: {
			Type: "Cocoon",
			Difficulty: 30,
			Hide: ["HairFront", "HairBack", "Glasses", "Hat"],
			Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"],
			Effect: ["BlindHeavy", "Prone", "GagNormal"],
		},
	},
];

// Loads the item extension properties
function InventoryItemHeadWebBlindfoldLoad() {
	if (!DialogFocusItem.Property) {
		DialogFocusItem.Property = InventoryItemHeadWebBlindfoldOptions[0].Property;
	}
	DialogExtendedMessage = DialogFind(Player, "WebBondageSelect");
}

function InventoryItemHeadWebBlindfoldDraw() {
	var Asset = DialogFocusItem.Asset;

	// Draw the header and item
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + Asset.Group.Family + "/" + Asset.Group.Name + "/Preview/" +
					Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(Asset.Description, 1500, 375, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 475, "white", "gray");

	// Draw the possible variants and their requirements
	for (var I = 0; I < InventoryItemHeadWebBlindfoldOptions.length; I++) {
		var X = 1175 + I * 425;
		var Y = 550;
		var Option = InventoryItemHeadWebBlindfoldOptions[I];

		DrawButton(X, Y, 225, 225, "", ((DialogFocusItem.Property.Type == Option.Property.Type)) ? "#888888" : "White");
		DrawImage("Screens/Inventory/" + Asset.Group.Name + "/" + Asset.Name + "/" + InventoryItemHeadWebBlindfoldOptions[I].Name + ".png", X, Y);
		DrawText(DialogFind(Player, "WebBondage" + Option.Name), X + 113, Y + 250, "white", "gray");
	}
}

function InventoryItemHeadWebBlindfoldClick() {
	// Menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) {
		DialogFocusItem = null;
	}

	for (var I = 0; I < InventoryItemHeadWebBlindfoldOptions.length; I++) {
		var X = 1175 + I * 425;
		var Y = 550;
		var Option = InventoryItemHeadWebBlindfoldOptions[I];
		if (MouseX >= X && MouseX <= X + 225 && MouseY >= Y && MouseY <= Y + 225 && DialogFocusItem.Property.Type !== Option.Property.Type) {
			InventoryItemHeadWebBlindfoldSetType(Option);
		}
	}
}

function InventoryItemHeadWebBlindfoldSetType(NewType) {
	// Gets the current item and character
	var C = CharacterGetCurrent();
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemHeadWebBlindfoldLoad();
	}

	DialogFocusItem.Property = NewType.Property;
	CharacterRefresh(C);

	if (CurrentScreen == "ChatRoom") {
		var msg = "HeadWebSet" + NewType.Name;
		var Dictionary = [
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
			{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		];
		ChatRoomPublishCustomAction(msg, true, Dictionary);
	}

	if (DialogInventory) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}
