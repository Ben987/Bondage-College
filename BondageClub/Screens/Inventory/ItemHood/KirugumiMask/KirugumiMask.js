"use strict";

/**
 * Key to type codes:
 *
 * e - eyes
 * m - mouth
 * b - blush
 * br - brows
 */

var InventoryItemHoodKirugumiMaskEyesOptions = [
	{
		Name: "e0",
		Difficulty: 0,
	},
	{
		Name: "e1",
		Difficulty: 0,
	},
	{
		Name: "e2",
		Difficulty: 0,
	},
	{
		Name: "e3",
		Difficulty: 0,
	},
];

var InventoryItemHoodKirugumiMaskMouthOptions = [
	{
		Name: "m0",
		Difficulty: 0,
	},
	{
		Name: "m1",
		Difficulty: 0,
	},
	{
		Name: "m2",
		Difficulty: 0,
	},
	{
		Name: "m3",
		Difficulty: 0,
	},
];

var InventoryItemHoodKirugumiMaskBlushOptions = [
	{
		Name: "b0",
		Difficulty: 0,
	},
	{
		Name: "b1",
		Difficulty: 0,
	},
	{
		Name: "b2",
		Difficulty: 0,
	},
	{
		Name: "b3",
		Difficulty: 0,
	},
];

var InventoryItemHoodKirugumiMaskBrowsOptions = [
	{
		Name: "br0",
		Difficulty: 0,
	},
	{
		Name: "br1",
		Difficulty: 0,
	},
	{
		Name: "br2",
		Difficulty: 0,
	},
	{
		Name: "br3",
		Difficulty: 0,
	},
];


var InventoryItemHoodKirugumiMaskPage = "Base";

var InventoryItemHoodKirugumiMaskDrawFunctions = {
	Base: InventoryItemHoodKirugumiMaskDrawBase,
	Eyes: InventoryItemHoodKirugumiMaskDrawEyes,
	Mouth: InventoryItemHoodKirugumiMaskDrawMouth,
	Blush: InventoryItemHoodKirugumiMaskDrawBlush,
	Brows: InventoryItemHoodKirugumiMaskDrawBrows,
};

var InventoryItemHoodKirugumiMaskClickFunctions = {
	Base: InventoryItemHoodKirugumiMaskClickBase,
	Eyes: InventoryItemHoodKirugumiMaskClickEyes,
	Mouth: InventoryItemHoodKirugumiMaskClickMouth,
	Blush: InventoryItemHoodKirugumiMaskClickBlush,
	Brows: InventoryItemHoodKirugumiMaskClickBrows,
};

function InventoryItemHoodKirugumiMaskLoad() {
	if (!DialogFocusItem.Property) {
		// Default to the base configuration if no property is set
		var C = CharacterGetCurrent();
		var currentConfig = InventoryItemHoodKirugumiMaskParseCurrent();
		DialogFocusItem.Property =
			InventoryItemHoodKirugumiMaskMergeOptions(currentConfig[0], currentConfig[1], currentConfig[2], currentConfig[3]);
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}
	DialogExtendedMessage = DialogFindPlayer("ItemHoodKirugumiMaskSelectBase");
}

function InventoryItemHoodKirugumiMaskCall(functionMap) {
	var func = functionMap[InventoryItemHoodKirugumiMaskPage] || functionMap.Base;
	return func();
}

function InventoryItemHoodKirugumiMaskDraw() {
	InventoryItemHoodKirugumiMaskCall(InventoryItemHoodKirugumiMaskDrawFunctions);
}

function InventoryItemHoodKirugumiMaskClick() {
	InventoryItemHoodKirugumiMaskCall(InventoryItemHoodKirugumiMaskClickFunctions);
}

function InventoryItemHoodKirugumiMaskPageTransition(newPage) {
	InventoryItemHoodKirugumiMaskPage = newPage;
	DialogExtendedMessage = DialogFindPlayer("ItemHoodKirugumiMaskSelect" + newPage);
}

function InventoryItemHoodKirugumiMaskDrawCommon(buttonDefinitions) {
	var A = DialogFocusItem.Asset;
	// Click the header and item
	DrawAssetPreview(1387, 55, A);
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "#808080");

	buttonDefinitions.forEach((buttonDefinition, i) => {
		var x = 1200 + (i % 2 * 387);
		var y = 450 + (Math.floor(i / 2) * 300);
		DrawPreviewBox(x, y, buttonDefinition[0], "", { Background: buttonDefinition[2], Hover: true })
		DrawText(DialogFindPlayer(buttonDefinition[1]), x + 113, y - 20, "#fff", "#808080");
	});
}

function InventoryItemHoodKirugumiMaskMapButtonDefinition(option) {
	var C = CharacterGetCurrent();
	var A = DialogFocusItem.Asset;
	var failLockCheck = DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem);
	var failSkillCheck = option.SelfBondage && C.ID === 0 && SkillGetLevelReal(C, "SelfBondage") < option.SelfBondage;
	return [
		"Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/" + option.Name + ".png",
		"ItemHoodKirugumiMaskType" + option.Name,
		(failLockCheck || failSkillCheck) ? "#ffc0cb" : "#fff",
	];
}

function InventoryItemHoodKirugumiMaskDrawBase() {
	var A = DialogFocusItem.Asset;
	var DialogPrefix = "ItemHoodKirugumiMaskConfigure";
	var currentConfig = InventoryItemHoodKirugumiMaskParseCurrent();
	InventoryItemHoodKirugumiMaskDrawCommon([
		["Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/e" + currentConfig[0] + ".png", DialogPrefix + "Eyes"],
		["Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/m" + currentConfig[1] + ".png", DialogPrefix + "Mouth"],
		["Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/b" + currentConfig[2] + ".png", DialogPrefix + "Blush"],
		["Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/br" + currentConfig[3] + ".png", DialogPrefix + "Brows"],
	]);
}

function InventoryItemHoodKirugumiMaskDrawEyes() {
	InventoryItemHoodKirugumiMaskDrawCommon(
		InventoryItemHoodKirugumiMaskEyesOptions.map(InventoryItemHoodKirugumiMaskMapButtonDefinition),
	);
}

function InventoryItemHoodKirugumiMaskDrawMouth() {
	InventoryItemHoodKirugumiMaskDrawCommon(
		InventoryItemHoodKirugumiMaskMouthOptions.map(InventoryItemHoodKirugumiMaskMapButtonDefinition),
	);
}

function InventoryItemHoodKirugumiMaskDrawBlush() {
	InventoryItemHoodKirugumiMaskDrawCommon(
		InventoryItemHoodKirugumiMaskBlushOptions.map(InventoryItemHoodKirugumiMaskMapButtonDefinition),
	);
}

function InventoryItemHoodKirugumiMaskDrawBrows() {
	InventoryItemHoodKirugumiMaskDrawCommon(
		InventoryItemHoodKirugumiMaskBrowsOptions.map(InventoryItemHoodKirugumiMaskMapButtonDefinition),
	);
}

function InventoryItemHoodKirugumiMaskClickCommon(exitCallback, itemCallback) {
	// Exit button
	if (MouseIn(1885, 25, 90, 85)) {
		return exitCallback();
	}

	for (var i = 0; i < 4; i++) {
		var x = 1200 + (i % 2 * 387);
		var y = 450 + (Math.floor(i / 2) * 300);
		if (MouseIn(x, y, 225, 225)) {
			itemCallback(i);
		}
	}
}

function InventoryItemHoodKirugumiMaskClickComponent(options) {
	InventoryItemHoodKirugumiMaskClickCommon(
		() => InventoryItemHoodKirugumiMaskPageTransition("Base"),
		i => {
			const selected = options[i];
			if (selected) InventoryItemHoodKirugumiMaskSetType(selected);
		},
	);
}

function InventoryItemHoodKirugumiMaskClickBase() {
	var configPages = ["Eyes", "Mouth", "Blush", "Brows"];
	InventoryItemHoodKirugumiMaskClickCommon(
		() => DialogFocusItem = null,
		i => {
			const newPage = configPages[i];
			if (newPage) InventoryItemHoodKirugumiMaskPageTransition(newPage);
		},
	);
}

function InventoryItemHoodKirugumiMaskClickEyes() {
	InventoryItemHoodKirugumiMaskClickComponent(InventoryItemHoodKirugumiMaskEyesOptions);
}

function InventoryItemHoodKirugumiMaskClickMouth() {
	InventoryItemHoodKirugumiMaskClickComponent(InventoryItemHoodKirugumiMaskMouthOptions);
}

function InventoryItemHoodKirugumiMaskClickBlush() {
	InventoryItemHoodKirugumiMaskClickComponent(InventoryItemHoodKirugumiMaskBlushOptions);
}

function InventoryItemHoodKirugumiMaskClickBrows() {
	InventoryItemHoodKirugumiMaskClickComponent(InventoryItemHoodKirugumiMaskBrowsOptions);
}

function InventoryItemHoodKirugumiMaskParseCurrent() {
	var type = (DialogFocusItem.Property && DialogFocusItem.Property.Type) || "e0m0b0br0";
	var match = type.match(/^e(\d)m(\d)b(\d)br(\d)$/);
	return [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
}

function InventoryItemHoodKirugumiMaskSetType(option) {
	var C = CharacterGetCurrent();
	DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);

	// Lock check - cannot change type if you can't unlock the item
	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFindPlayer("CantChangeWhileLocked");
		return;
	}

	// Self bondage requirement check
	if (option.SelfBondage && C.ID === 0 && SkillGetLevelReal(C, "SelfBondage") < option.SelfBondage) {
		DialogExtendedMessage = DialogFindPlayer("RequireSelfBondage" + option.SelfBondage);
		return;
	}

	var currentConfig = InventoryItemHoodKirugumiMaskParseCurrent();
	var e = currentConfig[0];
	var m = currentConfig[1];
	var b = currentConfig[2];
	var br = currentConfig[3];
	var componentType = option.Name.substring(0,option.Name.length-1);
	var componentIndex = Number(option.Name[option.Name.length-1]);
	var hasChanged = false;
	switch (componentType) {
		case "e":
			if (e !== componentIndex) hasChanged = true;
			e = componentIndex;
			break;
		case "m":
			if (m !== componentIndex) hasChanged = true;
			m = componentIndex;
			break;
		case "b":
			if (b !== componentIndex) hasChanged = true;
			b = componentIndex;
			break;
		case "br":
			if (br !== componentIndex) hasChanged = true;
			br = componentIndex;
			break;
	}

	if (hasChanged) {
		Object.assign(DialogFocusItem.Property, InventoryItemHoodKirugumiMaskMergeOptions(e, m, b, br));
		CharacterRefresh(C);
		ChatRoomCharacterUpdate(C);

		if (CurrentScreen === "ChatRoom") {
			InventoryItemHoodKirugumiMaskChatRoomMessage(option.Name);
		} else if (C.ID === 0) {
			// Player is using the item on herself
			DialogMenuButtonBuild(C);
		} else {
			// Otherwise, set the NPC's dialog
			C.CurrentDialog = DialogFind(C, "temHoodKirugumiMask" + DialogFocusItem.Property.Type, "ItemHood");
		}
	}

	InventoryItemHoodKirugumiMaskPageTransition("Base");
}

function InventoryItemHoodKirugumiMaskMergeOptions(e, m, b, br) {
	var eyes = InventoryItemHoodKirugumiMaskEyesOptions[e];
	var mouth = InventoryItemHoodKirugumiMaskMouthOptions[m];
	var blush = InventoryItemHoodKirugumiMaskBlushOptions[b];
	var brows = InventoryItemHoodKirugumiMaskBrowsOptions[br];
	return [eyes, mouth, blush, brows].reduce((prop, componentProp) => {
		prop.Difficulty += (componentProp.Difficulty || 0);
		if (componentProp.Block) InventoryItemHoodKirugumiMaskAddToArray(prop.Block, componentProp.Block);
		if (componentProp.Hide) InventoryItemHoodKirugumiMaskAddToArray(prop.Hide, componentProp.Hide);
		if (componentProp.HideItem) InventoryItemHoodKirugumiMaskAddToArray(prop.HideItem, componentProp.HideItem);
		return prop;
	}, {
		Type: `e${e}m${m}b${b}br${br}`,
		Difficulty: 15,
		Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose", "ItemEars"],
		Hide: ["Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Mask"],
		HideItem: ["ItemHeadSnorkel"],
	});
}

function InventoryItemHoodKirugumiMaskAddToArray(dest, src) {
	src.forEach(item => {
		if (!dest.includes(item)) dest.push(item);
	});
}

function InventoryItemHoodKirugumiMaskChatRoomMessage(componentName) {
	var C = CharacterGetCurrent();
	var msg = "ItemHoodKirugumiMask" + componentName;
	var dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, false, dictionary);
}
