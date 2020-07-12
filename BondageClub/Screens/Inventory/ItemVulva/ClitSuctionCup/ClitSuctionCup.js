"use strict";

// Loads the item extension properties
function InventoryItemVulvaClitSuctionCupLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { SuctionLevel: 0 };
	if (DialogFocusItem.Property.SuctionLevel == null) DialogFocusItem.Property.SuctionLevel = 0;
}

// Draw the item extension screen
function InventoryItemVulvaClitSuctionCupDraw() {
	DrawRect(1387, 225, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 227, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	DrawText(DialogFind(Player, "SuctionLevel" + DialogFocusItem.Property.SuctionLevel.toString()), 1500, 600, "White", "Gray");
	if (DialogFocusItem.Property.SuctionLevel > 0) DrawButton(1200, 650, 200, 55, DialogFind(Player, "Loose"), "White");
	if (DialogFocusItem.Property.SuctionLevel < 1) DrawButton(1550, 650, 200, 55, DialogFind(Player, "LightSuction"), "White");
	if (DialogFocusItem.Property.SuctionLevel > 1) DrawButton(1550, 650, 200, 55, DialogFind(Player, "LightSuction"), "White");
	if (DialogFocusItem.Property.SuctionLevel < 2) DrawButton(1200, 710, 200, 55, DialogFind(Player, "MediumSuction"), "White");
	if (DialogFocusItem.Property.SuctionLevel > 2) DrawButton(1200, 710, 200, 55, DialogFind(Player, "MediumSuction"), "White");
	if (DialogFocusItem.Property.SuctionLevel < 3) DrawButton(1550, 710, 200, 55, DialogFind(Player, "HeavySuction"), "White");
	if (DialogFocusItem.Property.SuctionLevel > 3) DrawButton(1550, 710, 200, 55, DialogFind(Player, "HeavySuction"), "White");
	if (DialogFocusItem.Property.SuctionLevel < 4) DrawButton(1375, 770, 200, 55, DialogFind(Player, "MaximumSuction"), "White");
}

// Catches the item extension clicks
function InventoryItemVulvaClitSuctionCupClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.SuctionLevel > 0)) InventoryItemVulvaClitSuctionCupIntensity(0 - DialogFocusItem.Property.SuctionLevel);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.SuctionLevel < 1)) InventoryItemVulvaClitSuctionCupIntensity(1 - DialogFocusItem.Property.SuctionLevel);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.SuctionLevel > 1)) InventoryItemVulvaClitSuctionCupIntensity(1 - DialogFocusItem.Property.SuctionLevel);
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.SuctionLevel < 2)) InventoryItemVulvaClitSuctionCupIntensity(2 - DialogFocusItem.Property.SuctionLevel);
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.SuctionLevel > 2)) InventoryItemVulvaClitSuctionCupIntensity(2 - DialogFocusItem.Property.SuctionLevel);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.SuctionLevel > 3)) InventoryItemVulvaClitSuctionCupIntensity(3 - DialogFocusItem.Property.SuctionLevel);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.SuctionLevel < 3)) InventoryItemVulvaClitSuctionCupIntensity(3 - DialogFocusItem.Property.SuctionLevel);
	if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 770) && (MouseY <= 825) && (DialogFocusItem.Property.SuctionLevel < 4)) InventoryItemVulvaClitSuctionCupIntensity(4 - DialogFocusItem.Property.SuctionLevel);
}

// Sets the Clit Suction Cup Level
function InventoryItemVulvaClitSuctionCupIntensity(Modifier) {
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
    ChatRoomPublishCustomAction("ClitSuc" + ((Modifier > 0) ? "tightens" : "loosens") + "To" + DialogFocusItem.Property.SuctionLevel, true, Dictionary);
} 

