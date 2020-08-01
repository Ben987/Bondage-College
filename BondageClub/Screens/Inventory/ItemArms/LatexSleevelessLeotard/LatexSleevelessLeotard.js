"use strict";

function InventoryItemArmsLatexSleevelessLeotardLoad() {
	InventoryItemArmsLatexButterflyLeotardLoad();
}

function InventoryItemArmsLatexSleevelessLeotardDraw() {
	InventoryItemArmsLatexButterflyLeotardDraw();
}

function InventoryItemArmsLatexSleevelessLeotardClick() {
	InventoryItemArmsLatexButterflyLeotardClick();
}

function InventoryItemArmsLatexSleevelessLeotardPublishAction(C, Option) {
	InventoryItemArmsLatexButterflyLeotardPublishAction(C, Option);
}

function InventoryItemArmsLatexSleevelessLeotardNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemArmsLatexSleevelessLeotard" + Option.Name, "ItemArms");
}
