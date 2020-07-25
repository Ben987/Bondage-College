"use strict";

// Loads the item extension properties
function InventoryItemNipplesLactationPumpLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { SuctionLevel: 0 };
	if (DialogFocusItem.Property.SuctionLevel == null) DialogFocusItem.Property.SuctionLevel = 0;
}

// Draw the item extension screen
function InventoryItemNipplesLactationPumpDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, "LactationPumpSuctionPower" + DialogFocusItem.Property.SuctionLevel.toString()), 1500, 600, "White", "Gray");
	if(DialogFocusItem.Property.SuctionLevel > 0) DrawButton(1200, 650, 200, 55, DialogFind(Player, "LactationPumpoff"), "White");
	if(DialogFocusItem.Property.SuctionLevel != 1) DrawButton(1550, 650, 200, 55, DialogFind(Player, "LactationPumpLowSuction"), "White");
	if(DialogFocusItem.Property.SuctionLevel != 2) DrawButton(1200, 710, 200, 55, DialogFind(Player, "LactationPumpMediumSuction"), "White");
	if(DialogFocusItem.Property.SuctionLevel != 3) DrawButton(1550, 710, 200, 55, DialogFind(Player, "LactationPumpHighSuction"), "White");
	if(DialogFocusItem.Property.SuctionLevel < 4) DrawButton(1375, 770, 200, 55, DialogFind(Player, "LactationPumpMaximumSuction"), "White");
}

// Catches the item extension clicks
function InventoryItemNipplesLactationPumpClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.SuctionLevel > 0)) InventoryItemNipplesLactationPumpIntensity(0 - DialogFocusItem.Property.SuctionLevel);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.SuctionLevel != 1)) InventoryItemNipplesLactationPumpIntensity(1 - DialogFocusItem.Property.SuctionLevel);
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.SuctionLevel != 2)) InventoryItemNipplesLactationPumpIntensity(2 - DialogFocusItem.Property.SuctionLevel);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.SuctionLevel != 3)) InventoryItemNipplesLactationPumpIntensity(3 - DialogFocusItem.Property.SuctionLevel);
	if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.SuctionLevel < 4)) InventoryItemNipplesLactationPumpIntensity(4 - DialogFocusItem.Property.SuctionLevel);
}

// Sets the Nipple Suction Cups Level
function InventoryItemNipplesLactationPumpIntensity(Modifier) {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	DialogFocusItem.Property.SuctionLevel = DialogFocusItem.Property.SuctionLevel + Modifier;
	if (DialogFocusItem.Property.SuctionLevel == 0);
	if (DialogFocusItem.Property.SuctionLevel == 1);
	if (DialogFocusItem.Property.SuctionLevel == 2);
	if (DialogFocusItem.Property.SuctionLevel == 3);
	if (DialogFocusItem.Property.SuctionLevel == 4);
	if (C.ID == 0) ServerPlayerAppearanceSync();
	var Dictionary = [];
	Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
    ChatRoomPublishCustomAction("NipPow" + ((Modifier > 0) ? "tightens" : "loosens") + "To" + DialogFocusItem.Property.SuctionLevel, true, Dictionary);
} 

