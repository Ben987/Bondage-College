"use strict";
var InventoryItemMiscWoodenSignAllowedChars = /^[a-zA-Z0-9 ~\!\$#%\*\+]*$/gm;

// Loads the item extension properties
function InventoryItemMiscWoodenSignLoad() {
    var C = CharacterGetCurrent();
	var MustRefresh = false;
	
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = {};
	if (DialogFocusItem.Property.Text == null && DialogFocusItem.Property.Text2 == null) {
		DialogFocusItem.Property.Text = "";
		DialogFocusItem.Property.Text2 = "";
		MustRefresh = true;
	}
	if (MustRefresh) {
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}
	
    ElementCreateInput("WoodenSignText1", "text", DialogFocusItem.Property.Text, "12");
    ElementCreateInput("WoodenSignText2", "text", DialogFocusItem.Property.Text2, "12");
}

// Draw the extension screen
function InventoryItemMiscWoodenSignDraw() {
    // Draw the header and item
    DrawRect(1387, 125, 225, 275, "white");
    DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
    DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

    ElementPosition("WoodenSignText1", 1505, 600, 350);
    ElementPosition("WoodenSignText2", 1505, 680, 350);
    DrawButton(1330, 731, 340, 64, DialogFind(Player, "SaveText"), (ElementValue("WoodenSignText1") + ElementValue("WoodenSignText2")).match(InventoryItemMiscWoodenSignAllowedChars) ? "White" : "#888", "");
}

// Catches the item extension clicks
function InventoryItemMiscWoodenSignClick() {
	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemMiscWoodenSignExit();
    }
    
    if (MouseIn(1330, 731, 340, 64) && (ElementValue("WoodenSignText1") + ElementValue("WoodenSignText2")).match(InventoryItemMiscWoodenSignAllowedChars)) {
        DialogFocusItem.Property.Text = ElementValue("WoodenSignText1");
        DialogFocusItem.Property.Text2 = ElementValue("WoodenSignText2");
        InventoryItemMiscWoodenSignChange();
    }
}

// Leaves the extended screen
function InventoryItemMiscWoodenSignExit() {
	ElementRemove("WoodenSignText1");
	ElementRemove("WoodenSignText2");
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild(CharacterGetCurrent());
}

// When the text is changed
function InventoryItemMiscWoodenSignChange() { 
    var C = CharacterGetCurrent();
    CharacterRefresh(C);
    if (CurrentScreen == "ChatRoom") {
        var Dictionary = [];
        Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
        Dictionary.push({ Tag: "TargetCharacterName", Text: C.Name, MemberNumber: C.MemberNumber });
        ChatRoomPublishCustomAction("WoodenSignChange", true, Dictionary);
		InventoryItemMiscWoodenSignExit();
    }
}
 
// Drawing function for the after-render
function AssetsItemMiscWoodenSignAfterDraw({
    C, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color
}) {
    if (L === "_Text") { 
        // We set up a canvas
        const Height = 200;
        const Width = 155;
        const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);
        
        // One line of text will be centered
        const isAlone = Property && (Property.Text == "" || Property.Text2 == "");
        const Text1 = (Property && Property.Text.match(InventoryItemMiscWoodenSignAllowedChars) ? Property.Text : "♠");
        const Text2 = (Property && Property.Text2.match(InventoryItemMiscWoodenSignAllowedChars) ? Property.Text2 : "♠");
        
        // We draw the desired info on that canvas twice to have a burnt look
        let context = TempCanvas.getContext('2d');
        context.textAlign = "center";
        context.font = "30px Calligraffitti";
        
        
        context.fillStyle = "#000"; // Initial burnt look
        context.fillText(Text1, (Width / 2) - 0.5, Height / (isAlone ? 2 : 2.25) - 0.5, Width);
        context.fillText(Text2, (Width / 2) - 0.5, Height / (isAlone ? 2 : 1.75) - 0.5, Width);
        
        context.fillStyle = Color; // Takes the layer color
        context.fillText(Text1, (Width / 2) + 0.5, Height / (isAlone ? 2 : 2.25) + 0.5, Width);
        context.fillText(Text2, (Width / 2) + 0.5, Height / (isAlone ? 2 : 1.75) + 0.5, Width);
        
        // We print the canvas on the character based on the asset position
        drawCanvas(TempCanvas, X + 170, Y + 200, AlphaMasks);
        drawCanvasBlink(TempCanvas, X + 170, Y + 200, AlphaMasks);
    }
}
