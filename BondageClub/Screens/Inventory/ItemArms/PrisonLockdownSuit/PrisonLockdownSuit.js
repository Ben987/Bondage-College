"use strict";

var InventoryItemArmsPrisonLockdownSuitOptions = [
	{
		Name: "Free",
		Property: { Type: null, Difficulty: 0 },
		SetPose: ["BackElbowTouch"],
		Effect: ["Block", "Prone"],
	},
	{
		Name: "Ankles",
		Property: {
			Type: "Ankles",
			Difficulty: 2,
			Effect: ["Block", "Prone", "Freeze"],
		},
	},
	{
		Name: "Thighs",
		Property: {
			Type: "Thighs",
			Difficulty: 1,
			Effect: ["Block", "Prone"],
		},
	},
	{
		Name: "Full",
		Property: {
			Type: "Full",
			Difficulty: 3,
			Effect: ["Block", "Prone", "Freeze"],
		},
	},
];

var InventoryItemArmsPrisonLockdownSuitPage = "Base";

function InventoryItemArmsPrisonLockdownSuitLoad() {
	ExtendedItemLoad(InventoryItemArmsPrisonLockdownSuitOptions, "ItemArmsPrisonLockdownSuitSelect");
	InventoryItemNeckAccessoriesCollarShockUnitLoad();
	InventoryItemArmsPrisonLockdownSuitSetPage("Base");
}

function InventoryItemArmsPrisonLockdownSuitSetPage(Page) {
	InventoryItemArmsPrisonLockdownSuitPage = Page;
	DialogExtendedMessage = DialogFind(Player, "ItemArmsPrisonLockdownSuitSelect" + Page);
}

function InventoryItemArmsPrisonLockdownSuitDraw() {
	CommonCallFunctionByName("InventoryItemArmsPrisonLockdownSuitDraw" + InventoryItemArmsPrisonLockdownSuitPage);
}

function InventoryItemArmsPrisonLockdownSuitDrawBase() {
	var A = DialogFocusItem.Asset;

	// Draw the header and item
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize("Assets/" + A.Group.Family + "/" + A.Group.Name + "/Preview/" + A.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(A.Description, 1500, 310, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");

	DrawButton(1175, 550, 225, 225, "", "white");
	DrawImage("Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/" + (DialogFocusItem.Property.Type || "Free") + ".png", 1175, 550);
	DrawText(DialogFind(Player, "ItemArmsPrisonLockdownSuitStraps"), 1288, 800, "white", "gray");

	DrawButton(1600, 550, 225, 225, "", "white");
	DrawImage("Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/Shock.png", 1600, 550);
	DrawText(DialogFind(Player, "ItemArmsPrisonLockdownSuitShock"), 1713, 800, "white", "gray");
}

function InventoryItemArmsPrisonLockdownSuitDrawStraps() {
	ExtendedItemDraw(InventoryItemArmsPrisonLockdownSuitOptions, "ItemArmsPrisonLockdownSuit");
}

function InventoryItemArmsPrisonLockdownSuitDrawShock() {
	InventoryItemNeckAccessoriesCollarShockUnitDraw();
}

function InventoryItemArmsPrisonLockdownSuitClick() {
	CommonCallFunctionByName("InventoryItemArmsPrisonLockdownSuitClick" + InventoryItemArmsPrisonLockdownSuitPage);
}

function InventoryItemArmsPrisonLockdownSuitClickBase() {
	// Exit button
	if (MouseIn(1885, 25, 90, 85)) {
		DialogFocusItem = null;
		return;
	}

	if (MouseIn(1175, 550, 225, 225)) InventoryItemArmsPrisonLockdownSuitSetPage("Straps");
	else if (MouseIn(1600, 550, 225, 225)) InventoryItemArmsPrisonLockdownSuitSetPage("Shock");
}

function InventoryItemArmsPrisonLockdownSuitClickStraps() {
	// Exit button
	if (MouseIn(1885, 25, 90, 85)) {
		InventoryItemArmsPrisonLockdownSuitSetPage("Base");
		return;
	}

	ExtendedItemClick(InventoryItemArmsPrisonLockdownSuitOptions);
}

function InventoryItemArmsPrisonLockdownSuitClickShock() {
	// Exit button
	if (MouseIn(1885, 25, 90, 85)) {
		InventoryItemArmsPrisonLockdownSuitSetPage("Base");
		return;
	}

	InventoryItemNeckAccessoriesCollarShockUnitClick();
}

function InventoryItemArmsPrisonLockdownSuitPublishAction(C, Option, PreviousOption) {
	var msg = "ItemArmsPrisonLockdownSuitSet" + Option.Name;
	if (["Ankles", "Thighs"].includes(Option.Name) && ["Free", "Full"].includes(PreviousOption.Name)) {
		msg = "ItemArmsPrisonLockdownSuitSet" + PreviousOption.Name + "To" + Option.Name;
	}
	var dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, dictionary);
}

function InventoryItemArmsPrisonLockdownSuitNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsPrisonLockdownSuit" + Option.Name, "ItemArms");
}
