"use strict";

var BackgroundSelectionBackground = "Introduction"
var BackgroundSelectionList = [];
var BackgroundSelectionIndex = 0;
var BackgroundSelectionSelect = "";
var BackgroundSelectionSelectName = "";
var BackgroundSelectionSize = 12;
var BackgroundSelectionOffset = 0;
var BackgroundSelectionCallback = 0;
var BackgroundSelectionPreviousModule = "";
var BackgroundSelectionPreviousScreen = "";
var BackgroundSelectionAll = [];
var BackgroundSelectionView = [];


// Change the current screen to the background selection screens
function BackgroundSelectionMake(List, Idx, Callback) {
	BackgroundSelectionList = List;
	BackgroundSelectionIndex = Idx < List.length ? Idx : 0;
	BackgroundSelectionCallback = Callback;
	BackgroundSelectionPreviousModule = CurrentModule;
	BackgroundSelectionPreviousScreen = CurrentScreen;
	CommonSetScreen("Character", "BackgroundSelection");
}

// When the background selection screens loads
function BackgroundSelectionLoad() {
	BackgroundSelectionSelect = BackgroundSelectionList[BackgroundSelectionIndex];
	BackgroundSelectionSelectName = DialogFind(Player, BackgroundSelectionSelect);
	BackgroundSelectionOffset = Math.floor(BackgroundSelectionIndex / BackgroundSelectionSize) * BackgroundSelectionSize;
	BackgroundSelectionBackground = BackgroundSelectionList[BackgroundSelectionIndex] || "Introduction";

	BackgroundSelectionAll = BackgroundSelectionList.map(B => { var D = DialogFind(Player, B); return { Name: B, Description: D, Low: D.toLowerCase() }; });
	BackgroundSelectionView = [...BackgroundSelectionAll];

	ElementCreateInput("InputBackground", "text", "", "30");
	document.getElementById("InputBackground").oninput = BackgroundSelectionInputChanged;
}

function BackgroundSelectionInputChanged() {
	var Input = ElementValue("InputBackground") || "";
	Input = Input.trim().toLowerCase();
	if (Input == "") {
		BackgroundSelectionView = [...BackgroundSelectionAll];
		BackgroundSelectionOffset = Math.floor(BackgroundSelectionIndex / BackgroundSelectionSize) * BackgroundSelectionSize;
	} else {
		BackgroundSelectionView = BackgroundSelectionAll.filter(B => B.Low.includes(Input));
		if (BackgroundSelectionOffset > BackgroundSelectionView.length) BackgroundSelectionView = 0;
	}
}

// When the background selection screens runs
function BackgroundSelectionRun() {
	DrawText(TextGet("Selection").replace("SelectedBackground", BackgroundSelectionSelectName), 400, 65, "White", "Black");
	DrawText(TextGet("Filter").replace("Filtered", BackgroundSelectionView.length).replace("Total", BackgroundSelectionAll.length), 1100, 65, "White", "Black");

	DrawButton(1685, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
	DrawButton(1785, 25, 90, 90, "", "White", "Icons/Cancel.png", TextGet("Cancel"));
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Accept.png", TextGet("Accept"));

	if (!CommonIsMobile && (CommonIsClickAt(1685, 25, 90, 90) || CommonIsClickAt(1785, 25, 90, 90) || CommonIsClickAt(1885, 25, 90, 90))) {
		document.getElementById("InputBackground").style.display = "none";
	} else {
		ElementPosition("InputBackground", 1450, 60, 400);
	}

	var X = 45;
	var Y = 150;
	for (var i = BackgroundSelectionOffset; i < BackgroundSelectionView.length && i - BackgroundSelectionOffset < BackgroundSelectionSize; ++i) {
		if (BackgroundSelectionView[i].Name == BackgroundSelectionSelect) {
			DrawButton(X - 4, Y - 4, 450 + 8, 225 + 8, BackgroundSelectionView[i], "Blue");
		} else {
			DrawButton(X, Y, 450, 225, BackgroundSelectionView[i].Name, "White");
		}
		DrawImageResize("Backgrounds/" + BackgroundSelectionView[i].Name + ".jpg", X + 2, Y + 2, 446, 221);
		DrawTextFit(BackgroundSelectionView[i].Description, X + 227, Y + 252, 450, "Black");
		DrawTextFit(BackgroundSelectionView[i].Description, X + 225, Y + 250, 450, "White");
		X += 450 + 35;
		if (i % 4 == 3) {
			X = 45;
			Y += 225 + 55;
		}
	}
}

// When he player clicks in background selection screens
function BackgroundSelectionClick() {
	// set and exit
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) {
		BackgroundSelectionExit(true);
	}

	// cancel and exit
	if ((MouseX >= 1785) && (MouseX < 1875) && (MouseY >= 25) && (MouseY < 115)) {
		BackgroundSelectionExit();
	}

	// Set next offset
	if ((MouseX >= 1685) && (MouseX < 1775) && (MouseY >= 25) && (MouseY < 115)) {
		BackgroundSelectionOffset += BackgroundSelectionSize;
		if (BackgroundSelectionOffset >= BackgroundSelectionView.length) BackgroundSelectionOffset = 0;
	}

	var X = 45;
	var Y = 150;
	for (var i = BackgroundSelectionOffset; i < BackgroundSelectionView.length && i - BackgroundSelectionOffset < BackgroundSelectionSize; ++i) {
		if ((MouseX >= X) && (MouseX < X + 450) && (MouseY >= Y) && (MouseY < Y + 225)) {
			BackgroundSelectionIndex = i;
			if (BackgroundSelectionIndex >= BackgroundSelectionView.length) BackgroundSelectionIndex = 0;
			if (BackgroundSelectionIndex < 0) BackgroundSelectionIndex = BackgroundSelectionView.length - 1;
			BackgroundSelectionSelect = BackgroundSelectionView[BackgroundSelectionIndex].Name;
			BackgroundSelectionSelectName = DialogFind(Player, BackgroundSelectionSelect);
			BackgroundSelectionBackground = BackgroundSelectionSelect;
		}
		X += 450 + 35;
		if (i % 4 == 3) {
			X = 45;
			Y += 225 + 55;
		}
	}
}

// When the user press "enter", we exit
function BackgroundSelectionKeyDown() {
	if (KeyPress == 13) BackgroundSelectionExit(true);
}

// When the user exit from this screen
function BackgroundSelectionExit(SetBackground) {
	ElementRemove("InputBackground");
	if (SetBackground && BackgroundSelectionCallback) BackgroundSelectionCallback(BackgroundSelectionSelect);
	BackgroundSelectionCallback = null;
	CommonSetScreen(BackgroundSelectionPreviousModule, BackgroundSelectionPreviousScreen);
}