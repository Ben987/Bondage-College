"use strict";

/**
 * Key to type codes:
 *
 * c0 - No crotch panel
 * c1 - Crotch panel
 *
 * a0 - Arms loose
 * a1 - Arms in front
 * a2 - Arms behind
 *
 * s0 - No crotch strap
 * s1 - One crotch strap
 * s2 - Two crotch straps
 * s3 - Three crotch straps
 */

var InventoryItemArmsHighSecurityStraitJacketCrotchOptions = [
	{
		Name: "c0",
		Difficulty: 0,
	},
	{
		Name: "c1",
		Difficulty: 1,
		Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
		Hide: ["ItemVulva", "ItemVulvaPiercings"],
		HideItem: ["ItemButtAnalBeads2"],
	},
];

var InventoryItemArmsHighSecurityStraitJacketArmsOptions = [
	{
		Name: "a0",
		Difficulty: 0,
	},
	{
		Name: "a1",
		Difficulty: 2,
		SelfBondage: 8,
	},
	{
		Name: "a2",
		Difficulty: 3,
		SelfBondage: 8,
	},
];

var InventoryItemArmsHighSecurityStraitJacketStrapsOptions = [
	{
		Name: "s0",
		Difficulty: 0,
	},
	{
		Name: "s1",
		Difficulty: 1,
		Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
		Hide: ["ItemVulvaPiercings"],
		HideItem: ["ItemButtAnalBeads2"],
	},
	{
		Name: "s2",
		Difficulty: 2,
		Block: ["ItemPelvis"],
	},
	{
		Name: "s3",
		Difficulty: 2,
		Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
		Hide: ["ItemVulvaPiercings"],
		HideItem: ["ItemButtAnalBeads2"],
	},
];

var InventoryItemArmsHighSecurityStraitJacketPage = "Base";

var InventoryItemArmsHighSecurityStraitJacketDrawFunctions = {
	Base: InventoryItemArmsHighSecurityStraitJacketDrawBase,
	Crotch: InventoryItemArmsHighSecurityStraitJacketDrawCrotch,
	Arms: InventoryItemArmsHighSecurityStraitJacketDrawArms,
	Straps: InventoryItemArmsHighSecurityStraitJacketDrawStraps,
};

var InventoryItemArmsHighSecurityStraitJacketClickFunctions = {
	Base: InventoryItemArmsHighSecurityStraitJacketClickBase,
	Crotch: InventoryItemArmsHighSecurityStraitJacketClickCrotch,
	Arms: InventoryItemArmsHighSecurityStraitJacketClickArms,
	Straps: InventoryItemArmsHighSecurityStraitJacketClickStraps,
};

function InventoryItemArmsHighSecurityStraitJacketLoad() {
	if (!DialogFocusItem.Property) {
		// Default to the base configuration if no property is set
		var C = CharacterGetCurrent();
		var currentConfig = InventoryItemArmsHighSecurityStraitJacketParseCurrent();
		DialogFocusItem.Property =
			InventoryItemArmsHighSecurityStraitJacketMergeOptions(currentConfig[0], currentConfig[1], currentConfig[2]);
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}
	DialogExtendedMessage = DialogFind(Player, "ItemArmsHighSecurityStraitJacketSelectBase");
}

function InventoryItemArmsHighSecurityStraitJacketCall(functionMap) {
	var func = functionMap[InventoryItemArmsHighSecurityStraitJacketPage] || functionMap.Base;
	return func();
}

function InventoryItemArmsHighSecurityStraitJacketDraw() {
	InventoryItemArmsHighSecurityStraitJacketCall(InventoryItemArmsHighSecurityStraitJacketDrawFunctions);
}

function InventoryItemArmsHighSecurityStraitJacketClick() {
	InventoryItemArmsHighSecurityStraitJacketCall(InventoryItemArmsHighSecurityStraitJacketClickFunctions);
}

function InventoryItemArmsHighSecurityStraitJacketPageTransition(newPage) {
	InventoryItemArmsHighSecurityStraitJacketPage = newPage;
	DialogExtendedMessage = DialogFind(Player, "ItemArmsHighSecurityStraitJacketSelect" + newPage);
}

function InventoryItemArmsHighSecurityStraitJacketDrawCommon(buttonDefinitions) {
	var A = DialogFocusItem.Asset;
	// Draw the header and item
	DrawRect(1387, 55, 225, 275, "#fff");
	DrawImageResize("Assets/" + A.Group.Family + "/" + A.Group.Name + "/Preview/" + A.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(A.Description, 1500, 310, 221, "#000");
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "#808080");

	buttonDefinitions.forEach((buttonDefinition, i) => {
		var x = 1200 + (i % 2 * 387);
		var y = 450 + (Math.floor(i / 2) * 300);
		DrawButton(x, y, 225, 225, "", buttonDefinition[2] || "#fff");
		DrawImage(buttonDefinition[0], x, y);
		DrawText(DialogFind(Player, buttonDefinition[1]), x + 113, y - 20, "#fff", "#808080");
	});
}

function InventoryItemArmsHighSecurityStraitJacketMapButtonDefinition(option) {
	var C = CharacterGetCurrent();
	var A = DialogFocusItem.Asset;
	var failLockCheck = DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem);
	var failSkillCheck = option.SelfBondage && C.ID === 0 && SkillGetLevelReal(C, "SelfBondage") < option.SelfBondage;
	return [
		"Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/" + option.Name + ".png",
		"ItemArmsHighSecurityStraitJacketType" + option.Name,
		(failLockCheck || failSkillCheck) ? "#ffc0cb" : "#fff",
	];
}

function InventoryItemArmsHighSecurityStraitJacketDrawBase() {
	var A = DialogFocusItem.Asset;
	var DialogPrefix = "ItemArmsHighSecurityStraitJacketConfigure";
	var currentConfig = InventoryItemArmsHighSecurityStraitJacketParseCurrent();
	InventoryItemArmsHighSecurityStraitJacketDrawCommon([
		["Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/c" + currentConfig[0] + ".png", DialogPrefix + "Crotch"],
		["Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/a" + currentConfig[1] + ".png", DialogPrefix + "Arms"],
		["Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/s" + currentConfig[2] + ".png", DialogPrefix + "Straps"],
	]);
}

function InventoryItemArmsHighSecurityStraitJacketDrawCrotch() {
	InventoryItemArmsHighSecurityStraitJacketDrawCommon(
		InventoryItemArmsHighSecurityStraitJacketCrotchOptions.map(InventoryItemArmsHighSecurityStraitJacketMapButtonDefinition),
	);
}

function InventoryItemArmsHighSecurityStraitJacketDrawArms() {
	InventoryItemArmsHighSecurityStraitJacketDrawCommon(
		InventoryItemArmsHighSecurityStraitJacketArmsOptions.map(InventoryItemArmsHighSecurityStraitJacketMapButtonDefinition),
	);
}

function InventoryItemArmsHighSecurityStraitJacketDrawStraps() {
	InventoryItemArmsHighSecurityStraitJacketDrawCommon(
		InventoryItemArmsHighSecurityStraitJacketStrapsOptions.map(InventoryItemArmsHighSecurityStraitJacketMapButtonDefinition),
	);
}

function InventoryItemArmsHighSecurityStraitJacketClickCommon(exitCallback, itemCallback) {
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

function InventoryItemArmsHighSecurityStraitJacketClickComponent(options) {
	InventoryItemArmsHighSecurityStraitJacketClickCommon(
		() => InventoryItemArmsHighSecurityStraitJacketPageTransition("Base"),
		i => {
			const selected = options[i];
			if (selected) InventoryItemArmsHighSecurityStraitJacketSetType(selected);
		},
	);
}

function InventoryItemArmsHighSecurityStraitJacketClickBase() {
	var configPages = ["Crotch", "Arms", "Straps"];
	InventoryItemArmsHighSecurityStraitJacketClickCommon(
		() => DialogFocusItem = null,
		i => {
			const newPage = configPages[i];
			if (newPage) InventoryItemArmsHighSecurityStraitJacketPageTransition(newPage);
		},
	);
}

function InventoryItemArmsHighSecurityStraitJacketClickCrotch() {
	InventoryItemArmsHighSecurityStraitJacketClickComponent(InventoryItemArmsHighSecurityStraitJacketCrotchOptions);
}

function InventoryItemArmsHighSecurityStraitJacketClickArms() {
	InventoryItemArmsHighSecurityStraitJacketClickComponent(InventoryItemArmsHighSecurityStraitJacketArmsOptions);
}

function InventoryItemArmsHighSecurityStraitJacketClickStraps() {
	InventoryItemArmsHighSecurityStraitJacketClickComponent(InventoryItemArmsHighSecurityStraitJacketStrapsOptions);
}

function InventoryItemArmsHighSecurityStraitJacketParseCurrent() {
	var type = (DialogFocusItem.Property && DialogFocusItem.Property.Type) || "c0a0s0";
	var match = type.match(/^c(\d)a(\d)s(\d)$/);
	return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function InventoryItemArmsHighSecurityStraitJacketSetType(option) {
	var C = CharacterGetCurrent();
	DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);

	// Lock check - cannot change type if you can't unlock the item
	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		return;
	}

	// Self bondage requirement check
	if (option.SelfBondage && C.ID === 0 && SkillGetLevelReal(C, "SelfBondage") < option.SelfBondage) {
		DialogExtendedMessage = DialogFind(Player, "RequireSelfBondage" + option.SelfBondage);
		return;
	}

	var currentConfig = InventoryItemArmsHighSecurityStraitJacketParseCurrent();
	var c = currentConfig[0];
	var a = currentConfig[1];
	var s = currentConfig[2];
	var componentType = option.Name[0];
	var componentIndex = Number(option.Name[1]);
	var hasChanged = false;
	switch (componentType) {
		case "c":
			if (c !== componentIndex) hasChanged = true;
			c = componentIndex;
			break;
		case "a":
			if (a !== componentIndex) hasChanged = true;
			a = componentIndex;
			break;
		case "s":
			if (s !== componentIndex) hasChanged = true;
			s = componentIndex;
			break;
	}

	if (hasChanged) {
		Object.assign(DialogFocusItem.Property, InventoryItemArmsHighSecurityStraitJacketMergeOptions(c, a, s));
		CharacterRefresh(C);
		ChatRoomCharacterUpdate(C);

		if (CurrentScreen === "ChatRoom") {
			InventoryItemArmsHighSecurityStraitJacketChatRoomMessage(option.Name);
		} else if (C.ID === 0) {
			// Player is using the item on herself
			DialogMenuButtonBuild(C);
		} else {
			// Otherwise, set the NPC's dialog
			C.CurrentDialog = DialogFind(C, "ItemArmsHighSecurityStraitJacket" + DialogFocusItem.Property.Type, "ItemArms");
		}
	}

	InventoryItemArmsHighSecurityStraitJacketPageTransition("Base");
}

function InventoryItemArmsHighSecurityStraitJacketMergeOptions(c, a, s) {
	var crotch = InventoryItemArmsHighSecurityStraitJacketCrotchOptions[c];
	var arms = InventoryItemArmsHighSecurityStraitJacketArmsOptions[a];
	var straps = InventoryItemArmsHighSecurityStraitJacketStrapsOptions[s];
	return [crotch, arms, straps].reduce((prop, componentProp) => {
		prop.Difficulty += (componentProp.Difficulty || 0);
		if (componentProp.Block) InventoryItemArmsHighSecurityStraitJacketAddToArray(prop.Block, componentProp.Block);
		if (componentProp.Hide) InventoryItemArmsHighSecurityStraitJacketAddToArray(prop.Hide, componentProp.Hide);
		if (componentProp.HideItem) InventoryItemArmsHighSecurityStraitJacketAddToArray(prop.HideItem, componentProp.HideItem);
		return prop;
	}, {
		Type: `c${c}a${a}s${s}`,
		Difficulty: 0,
		Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands"],
		Hide: ["Cloth", "ItemNipplesPiercings"],
		HideItem: [],
	});
}

function InventoryItemArmsHighSecurityStraitJacketAddToArray(dest, src) {
	src.forEach(item => {
		if (!dest.includes(item)) dest.push(item);
	});
}

function InventoryItemArmsHighSecurityStraitJacketChatRoomMessage(componentName) {
	var C = CharacterGetCurrent();
	var msg = "ItemArmsHighSecurityStraitJacketSet" + componentName;
	var dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, false, dictionary);
}
