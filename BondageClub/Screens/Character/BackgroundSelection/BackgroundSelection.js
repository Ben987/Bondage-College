"use strict";

var BackgroundSelectionBackground = "Introduction"
var BackgroundSelectionList = [];
var BackgroundSelectionIndex = 0;
var BackgroundSelectionSelect = "";
var BackgroundSelectionSize = 12;
var BackgroundSelectionOffset = 0;
var BackgroundSelectionCallback = 0;
var BackgroundSelectionPreviousModule = "";
var BackgroundSelectionPreviousScreen = "";

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
	BackgroundSelectionOffset = Math.floor(BackgroundSelectionIndex / BackgroundSelectionSize) * BackgroundSelectionSize;
	BackgroundSelectionBackground = BackgroundSelectionList[BackgroundSelectionIndex] || "Introduction";
}

// When the background selection screens runs
function BackgroundSelectionRun() {
	DrawButton(1685, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
	DrawButton(1785, 25, 90, 90, "", "White", "Icons/Remove.png", TextGet("Cancel"));
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	var X = 45;
	var Y = 150;
	for (var i = BackgroundSelectionOffset; i < BackgroundSelectionList.length && i - BackgroundSelectionOffset < BackgroundSelectionSize; ++i) {
		if (i == BackgroundSelectionIndex) {
			DrawButton(X - 4, Y - 4, 450 + 8, 225 + 8, BackgroundSelectionList[i], "Blue");
		} else {
			DrawButton(X, Y, 450, 225, BackgroundSelectionList[i], "White");
		}
		DrawImageResize("Backgrounds/" + BackgroundSelectionList[i] + ".jpg", X + 2, Y + 2, 446, 221);
		DrawTextFit(DialogFind(Player, BackgroundSelectionList[i]), X + 225, Y + 250, 450, "Yellow");
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
		if (BackgroundSelectionOffset >= BackgroundSelectionList.length) BackgroundSelectionOffset = 0;
	}

	var X = 45;
	var Y = 150;
	for (var i = BackgroundSelectionOffset; i < BackgroundSelectionList.length && i - BackgroundSelectionOffset < BackgroundSelectionSize; ++i) {
		if ((MouseX >= X) && (MouseX < X + 450) && (MouseY >= Y) && (MouseY < Y + 225)) {
			BackgroundSelectionIndex = i;
			if (BackgroundSelectionIndex >= BackgroundSelectionList.length) BackgroundSelectionIndex = 0;
			if (BackgroundSelectionIndex < 0) BackgroundSelectionIndex = BackgroundSelectionList.length - 1;
			BackgroundSelectionSelect = BackgroundSelectionList[BackgroundSelectionIndex];
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
	if (SetBackground && BackgroundSelectionCallback) BackgroundSelectionCallback(BackgroundSelectionSelect);
	BackgroundSelectionCallback = null;
	CommonSetScreen(BackgroundSelectionPreviousModule, BackgroundSelectionPreviousScreen);
}