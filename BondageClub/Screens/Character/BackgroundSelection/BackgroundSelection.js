"use strict";

var BackgroundSelectionBackground = "Introduction"
var BackgroundSelectionList = [];
var BackgroundSelectionIndex = 0;
var BackgroundSelectionSelect = "";
var BackgroundSelectionOffset = 0;
var BackgroundSelectionCallback = 0;
var BackgroundSelectionPreviousModule = "";
var BackgroundSelectionPreviousScreen = "";

// Change the current screen to the background selection screens
function BackgroundSelectionMake(List, Callback) {
	BackgroundSelectionList = List;
	BackgroundSelectionCallback = Callback;
	BackgroundSelectionPreviousModule = CurrentModule;
	BackgroundSelectionPreviousScreen = CurrentScreen;
	CommonSetScreen("Character", "BackgroundSelection");
}

// When the background selection screens loads
function BackgroundSelectionLoad() {
	BackgroundSelectionIndex = 0;
	BackgroundSelectionBackground = BackgroundSelectionList[0] || "Introduction";
}

// When the background selection screens runs
function BackgroundSelectionRun() {
	DrawButton(1785, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	var X = 45;
	var Y = 170;
	for (var i = BackgroundSelectionOffset; i < BackgroundSelectionList.length && i - BackgroundSelectionOffset < 12; ++i) {
		DrawButton(X, Y, 450, 225, BackgroundSelectionList[i], "White");
		DrawImageResize("Backgrounds/" + BackgroundSelectionList[i] + ".jpg", X + 2, Y + 2, 446, 221);
		X += 450 + 35;
		if (i % 4 == 3) {
			X = 45;
			Y += 225 + 35;
		}
	}
}

// When he player clicks in background selection screens
function BackgroundSelectionClick() {
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) {
		BackgroundSelectionExit();
	}

	// Set next offset
	if ((MouseX >= 1785) && (MouseX < 1875) && (MouseY >= 25) && (MouseY < 115)) {
		BackgroundSelectionOffset += 12;
		if (BackgroundSelectionOffset >= BackgroundSelectionList.length) BackgroundSelectionOffset = 0;
	}

	var X = 45;
	var Y = 170;
	for (var i = BackgroundSelectionOffset; i < BackgroundSelectionList.length && i - BackgroundSelectionOffset < 12; ++i) {
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
			Y += 225 + 35;
		}
	}
}

// When the user press "enter", we exit
function BackgroundSelectionKeyDown() { 
	if (KeyPress == 13) BackgroundSelectionExit();
}

// When the user exit from this screen
function BackgroundSelectionExit() {
	if (BackgroundSelectionCallback) BackgroundSelectionCallback(BackgroundSelectionSelect);
	BackgroundSelectionCallback = null;
	CommonSetScreen(BackgroundSelectionPreviousModule, BackgroundSelectionPreviousScreen);
}