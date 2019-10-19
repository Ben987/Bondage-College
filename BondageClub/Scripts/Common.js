// Main variables
"use strict";

/** @type {ICharacter} */
var Player;
/** @type {number} */
var MouseX = 0;
/** @type {number} */
var MouseY = 0;
/** @type {string} */
var KeyPress = "";
/** @type {string} */
var CurrentModule;
/** @type {string} */
var CurrentScreen;
/** @type {ICharacter} */
var CurrentCharacter = null;
var CurrentOnlinePlayers = 0;
var CommonIsMobile = false;
var CommonCSVCache = {};
var CutsceneStage = 0;

// Returns TRUE if the variable is a number
function CommonIsNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Returns the current date and time in a yyyy-mm-dd hh:mm:ss format
function CommonGetFormatDate() {
	var d = new Date();
	var yyyy = d.getFullYear();
	var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); // getMonth() is zero-based
	var dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
	var hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
	var min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
	var ss = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
	return "".concat(yyyy).concat("-").concat(mm).concat("-").concat(dd).concat(" ").concat(hh).concat(":").concat(min).concat(":").concat(ss);
}

// Used to detect whether the users browser is an mobile browser
function CommonDetectMobile() {

	// First check
	if (sessionStorage.desktop) return false;
	else if (localStorage.mobile) return true;

	// Alternative check
	var mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone', 'iemobile', 'mobile/'];
	for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

	// If nothing is found, we assume desktop
	return false;
}

// Gets the current browser name and version
function CommonGetBrowser() {
	var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return { Name: "IE", Version: (tem[1] || "N/A") };
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\bOPR|Edge\/(\d+)/);
		if (tem != null) return { Name: "Opera", Version: tem[1] || "N/A" };
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
	return { Name: M[0] || "N/A", Version: M[1] || "N/A" };
}

// Parse a CSV file
function CommonParseCSV(str) {

	var arr = [];
	var quote = false;  // true means we're inside a quoted field
	var c;
	var col;

	// iterate over each character, keep track of current row and column (of the returned array)
	for (var row = col = c = 0; c < str.length; c++) {
		var cc = str[c], nc = str[c + 1];        // current character, next character
		arr[row] = arr[row] || [];             // create a new row if necessary
		arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

		// If the current character is a quotation mark, and we're inside a
		// quoted field, and the next character is also a quotation mark,
		// add a quotation mark to the current column and skip the next character
		if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

		// If it's just one quotation mark, begin/end quoted field
		if (cc == '"') { quote = !quote; continue; }

		// If it's a comma and we're not in a quoted field, move on to the next column
		if (cc == ',' && !quote) { ++col; continue; }

		// If it's a newline and we're not in a quoted field, move on to the next
		// row and move to column 0 of that new row
		if (cc == '\n' && !quote) { ++row; col = 0; continue; }

		// Otherwise, append the current character to the current column
		arr[row][col] += cc;
	}
	return arr;
}

// Read a CSV file from the web site
function CommonReadCSV(Array, Path, Screen, File) {

	// Changed from a single path to various arguments and internally concatenate them
	// This ternary operator is used to keep backward compatibility
	var FullPath = "Screens/" + Path + "/" + Screen + "/" + File + ".csv";
	if (CommonCSVCache[FullPath]) {
		window[Array] = CommonCSVCache[FullPath];
		return;
	}

	// Opens the file, parse it and returns the result in an Object
	CommonGet(FullPath, function () {
		if (this.status == 200) {
			CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
			window[Array] = CommonCSVCache[FullPath];
		}
	});
}

// AJAX utility to get a file and return it's content
function CommonGet(Path, Callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", Path);
	xhr.onreadystatechange = function () { if (this.readyState == 4) Callback.bind(this)(); };
	xhr.send(null);
}

// Catches the clicks on the main screen and forwards it to the current screen or dialog screen
function CommonClick() {
	if (CurrentCharacter == null)
		CommonDynamicFunction(CurrentScreen + "Click()");
	else
		DialogClick();
}

// Catches the clicks on the main screen and forwards it to the current screen or dialog screen
function CommonKeyDown() {
	if (CurrentCharacter == null) {
		if (typeof window[CurrentScreen + "KeyDown"] === "function")
			CommonDynamicFunction(CurrentScreen + "KeyDown()");
	}
	else
		DialogKeyDown();
}

// Calls a basic dynamic function (if it exists), for complex functions, use: CommonDynamicFunctionParams
function CommonDynamicFunction(FunctionName) {
	if (typeof window[FunctionName.substr(0, FunctionName.indexOf("("))] === "function")
		window[FunctionName.replace("()", "")]();
	else
		console.log("Trying to launch invalid function: " + FunctionName);
}

// Calls a dynamic function with parameters (if it exists), also allow ! in front to reverse the result
function CommonDynamicFunctionParams(FunctionName) {

	// Gets the reverse (!) sign
	var Reverse = false;
	if (FunctionName.substring(0, 1) == "!") Reverse = true;
	FunctionName = FunctionName.replace("!", "");

	// Gets the real function name and parameters
	var ParamCount = 1;
	if (FunctionName.indexOf("()") >= 0) ParamCount = 0;
	else ParamCount = FunctionName.split(",").length;
	var openParenthesisIndex = FunctionName.indexOf("(");
	var closedParenthesisIndex = FunctionName.indexOf(")", openParenthesisIndex);
	var Params = FunctionName.substring(openParenthesisIndex + 1, closedParenthesisIndex).split(",");
	for (var P = 0; P < Params.length; P++)
		Params[P] = Params[P].trim().replace('"', '').replace('"', '')
	FunctionName = FunctionName.substring(0, openParenthesisIndex);
	if ((FunctionName.indexOf("Dialog") != 0) && (FunctionName.indexOf("Inventory") != 0) && (FunctionName.indexOf(CurrentScreen) != 0)) FunctionName = CurrentScreen + FunctionName;

	// If it's really a function, we continue
	if (typeof window[FunctionName] === "function") {

		// Launches the function with the params and returns the result
		var Result = true;
		if (ParamCount == 0) Result = window[FunctionName]();
		if (ParamCount == 1) Result = window[FunctionName](Params[0]);
		if (ParamCount == 2) Result = window[FunctionName](Params[0], Params[1]);
		if (ParamCount == 3) Result = window[FunctionName](Params[0], Params[1], Params[2]);
		if (Reverse) return !Result;
		else return Result;

	} else {

		// Log the error in the console
		console.log("Trying to launch invalid function: " + FunctionName);
		return false;

	}

}

// Sets the current screen and calls the loading script if needed, only allow the change screen if the player can walk
function CommonSetScreen(NewModule, NewScreen) {
	CurrentModule = NewModule;
	CurrentScreen = NewScreen;
	TextLoad();
	if (typeof window[CurrentScreen + "Load"] === "function")
		CommonDynamicFunction(CurrentScreen + "Load()");
}

// Return the current time
function CommonTime() {
	return new Date().getTime();
}

// Returns TRUE if the string is a HEX color
function CommonIsColor(Value) {
	if ((Value == null) || (Value.length < 3)) return false;
	if (/^#[0-9A-F]{3}$/i.test(Value)) Value = "#" + Value[1] + Value[1] + Value[2] + Value[2] + Value[3] + Value[3];	//convert short hand hex color to standard format
	return /^#[0-9A-F]{6}$/i.test(Value);
}

// Returns a random item from a list but make sure we don't pick the previous item again
function CommonRandomItemFromList(ItemPrevious, ItemList) {
	var NewItem = ItemPrevious;
	while (NewItem == ItemPrevious)
		NewItem = ItemList[Math.floor(Math.random() * ItemList.length)];
	return NewItem;
}