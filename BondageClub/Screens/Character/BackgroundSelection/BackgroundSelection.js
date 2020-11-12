"use strict";

var BackgroundSelectionBackground = "Introduction"
var BackgroundSelectionList = [];
var BackgroundSelectionTagList = [];
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

/**
 * Change the current screen to the background selection screen
 * @param {string[]} List - The list of possible Background names
 * @param {number} Idx - The index of the current background
 * @param {function} Callback - The function to call when a new background has been selected
 * @param {boolean} [HideDropDown=false] - Optional parameter that makes the tag selection item appear (false) or hides it (true)
 * @returns {void} - Nothing
 */
function BackgroundSelectionMake(List, Idx, Callback, HideDropDown) {
	BackgroundSelectionList = List;
	BackgroundSelectionIndex = Idx < List.length ? Idx : 0;
	BackgroundSelectionCallback = Callback;
	BackgroundSelectionPreviousModule = CurrentModule;
	BackgroundSelectionPreviousScreen = CurrentScreen;
	CommonSetScreen("Character", "BackgroundSelection");
}

/**
 * Comapres two backgrounds by their description
 * @param {object} a - The first object to compare
 * @param {string} a.Description - The description of object a. Is used for comparision
 * @param {object} b - The second object to compar
 * @param {string} b.Description - The description of object b. Is used for comparision
 * @returns {number} - Returns -1 if the description of object a is less then that of b, 1 otherwise
 */
function BackGroundSelectionSort(a, b) {
	return (a.Description <= b.Description) ? -1: 1;	
}

/**
 * Initializes the Background selection screen. 
 * Function coiuld be called dynamically, so the body has to be there, even if it does nothing.
 * @returns {void} - Nothing
 */
function BackgroundSelectionLoad() {
	BackgroundSelectionSelect = BackgroundSelectionList[BackgroundSelectionIndex];
	BackgroundSelectionSelectName = DialogFind(Player, BackgroundSelectionSelect);
	BackgroundSelectionOffset = Math.floor(BackgroundSelectionIndex / BackgroundSelectionSize) * BackgroundSelectionSize;
	BackgroundSelectionBackground = BackgroundSelectionList[BackgroundSelectionIndex] || "Introduction";
	BackgroundSelectionView = BackgroundSelectionAll.slice(0).sort(BackGroundSelectionSort);
	ElementCreateInput("InputBackground", "text", "", "30");
	document.getElementById("InputBackground").oninput = BackgroundSelectionInputChanged;
	if (BackgroundSelectionTagList.length >= 2) ElementCreateDropdown("TagDropDown", BackgroundsTagList, function() { BackgroundSelectionTagChanged() });
}

/**
 * Handles input in the text box in the topmost row of the selection screen 
 * and changes the offset of the background selection appropriately
 * @returns {void} - Nothing
 */
function BackgroundSelectionInputChanged() {
	var Input = ElementValue("InputBackground") || "";
	Input = Input.trim().toLowerCase();
	if (Input == "") {
		BackgroundSelectionView = BackgroundSelectionAll.slice();
		BackgroundSelectionOffset = Math.floor(BackgroundSelectionIndex / BackgroundSelectionSize) * BackgroundSelectionSize;
	} else {
		BackgroundSelectionView = BackgroundSelectionAll.filter(B => B.Low.includes(Input));
		if (BackgroundSelectionOffset >= BackgroundSelectionView.length) BackgroundSelectionOffset = 0;
	}
	BackgroundSelectionView.sort(BackGroundSelectionSort);
}

/**
 * When a new value is selected in the tag selection drop-down, we refresh the displayed background
 * @returns {void} - Nothing
 */
function BackgroundSelectionTagChanged() {
	var DD = document.getElementById("TagDropDown-select");			
	if (DD == null) return;
	BackgroundSelectionList = BackgroundsGenerateList((DD.selectedIndex == 0) ? BackgroundSelectionTagList : [DD.options[DD.selectedIndex].text]);
	BackgroundSelectionView = BackgroundSelectionAll.slice().sort(BackGroundSelectionSort);
	BackgroundSelectionInputChanged();
	if (BackgroundSelectionOffset >= BackgroundSelectionView.length) BackgroundSelectionOffset = 0;
}

/**
 * Draws the Background selection screen:
 * - draws all the buttons and the text input field on the topmost rows
 * - paints the first (max) 12 possible backgrounds in the lower part of the screen
 * The function is called dynamically
 * @returns {void} - Nothing
 */
function BackgroundSelectionRun() {

	DrawText(TextGet("Selection").replace("SelectedBackground", BackgroundSelectionSelectName), 300, 65, "White", "Black");
	if (BackgroundSelectionTagList.length >= 2) ElementPositionFix("TagDropDown", 36, 550, 35, 300, 65);
	DrawText(TextGet("Filter").replace("Filtered", BackgroundSelectionView.length).replace("Total", BackgroundSelectionAll.length), 1000, 65, "White", "Black");

	DrawButton(1585, 25, 90, 90, "", "White", "Icons/Prev.png", TextGet("Prev"));
	DrawButton(1685, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
	DrawButton(1785, 25, 90, 90, "", "White", "Icons/Cancel.png", TextGet("Cancel"));
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Accept.png", TextGet("Accept"));

	if (!CommonIsMobile && (MouseIn(1585, 25, 90, 90) || MouseIn(1685, 25, 90, 90) || MouseIn(1785, 25, 90, 90) || MouseIn(1885, 25, 90, 90)))
		document.getElementById("InputBackground").style.display = "none";
	else
		ElementPosition("InputBackground", 1350, 60, 400);

	var X = 45;
	var Y = 150;
	for (let i = BackgroundSelectionOffset; i < BackgroundSelectionView.length && i - BackgroundSelectionOffset < BackgroundSelectionSize; ++i) {
		if (BackgroundSelectionView[i].Name == BackgroundSelectionSelect) DrawButton(X - 4, Y - 4, 450 + 8, 225 + 8, BackgroundSelectionView[i].Description, "Blue");
		else DrawButton(X, Y, 450, 225, BackgroundSelectionView[i].Description, "White");
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

/**
 * Handles clicks in the background selection screen:
 * - Exit: Exit the screen without changes
 * - Accept: Exit the screen with a new background
 * - Prev: Paints the previous 12 backgrounds
 * - Next: Paints the nextt 12 backgrounds
 * - Click on any background: Sets this background for selection
 * This function is called dynamically
 * 
 * @returns {void} - Nothing
 */
function BackgroundSelectionClick() {

	// Exit by selecting or cancelling
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) BackgroundSelectionExit(true);
	if ((MouseX >= 1785) && (MouseX < 1875) && (MouseY >= 25) && (MouseY < 115)) BackgroundSelectionExit(false);

	// Set next offset backward
	if ((MouseX >= 1585) && (MouseX < 1675) && (MouseY >= 25) && (MouseY < 115)) {
		BackgroundSelectionOffset -= BackgroundSelectionSize;
		if (BackgroundSelectionOffset < 0)
			BackgroundSelectionOffset = Math.ceil(BackgroundSelectionView.length / BackgroundSelectionSize - 1) * BackgroundSelectionSize;
	}

	// Set next offset forward
	if ((MouseX >= 1685) && (MouseX < 1775) && (MouseY >= 25) && (MouseY < 115)) {
		BackgroundSelectionOffset += BackgroundSelectionSize;
		if (BackgroundSelectionOffset >= BackgroundSelectionView.length) BackgroundSelectionOffset = 0;
	}

	var X = 45;
	var Y = 150;
	for (let i = BackgroundSelectionOffset; i < BackgroundSelectionView.length && i - BackgroundSelectionOffset < BackgroundSelectionSize; ++i) {
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

/**
 * Handles key events in the background selection screen:
 * - When the user presses "enter", we exit
 * @returns {void} - Nothing
 */
function BackgroundSelectionKeyDown() {
	if (KeyPress == 13) BackgroundSelectionExit(true);
}

/**
 * Handles the exit of the selection screen. Sets the new background, if necessary, and 
 * calls the previously defined callback function. Then exits the screen to the screen, the player was before
 * @param {boolean} SetBackground - Defines, wether the background must be changed (true) or not (false)
 * @returns {void} - Nothing
 */
function BackgroundSelectionExit(SetBackground) {
	ElementRemove("InputBackground");
	ElementRemove("TagDropDown");
	if (SetBackground && BackgroundSelectionCallback) BackgroundSelectionCallback(BackgroundSelectionSelect);
	BackgroundSelectionCallback = null;
	CommonSetScreen(BackgroundSelectionPreviousModule, BackgroundSelectionPreviousScreen);
}