// Main variables
"use strict";
var Player;
var KeyPress = "";
var CurrentModule;
var CurrentScreen;
var CurrentCharacter = null;
var CurrentOnlinePlayers = 0;
var CommonIsMobile = false;
var CommonCSVCache = {};
var CutsceneStage = 0;

/**
 * Checks if a variable is a number
 * @param {*} n - Variable to check for
 * @returns {boolean} - Returns TRUE if the variable is a finite number
 */
function CommonIsNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Gets the current time as a string
 * @returns {string} - Returns the current date and time in a yyyy-mm-dd hh:mm:ss format
 */
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

/**
 * Detects if the user is on a mobile browser
 * @returns {boolean} - Returns TRUE if the user is on a mobile browser
 */
function CommonDetectMobile() {

	// First check
	var mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone', 'iemobile', 'mobile/', 'webos', 'kindle'];
	for (let i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

	// IPad pro check
	if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform)) return true;

	// Second check
	if (sessionStorage.desktop) return false;
	else if (localStorage.mobile) return true;

	// If nothing is found, we assume desktop
	return false;

}

/**
 * Gets the current browser name and version
 * @returns {{Name: string, Version: string}} - Browser info
 */
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

/**
 * Parse a CSV file content into an array
 * @param {string} str - Content of the CSV
 * @returns {string[][]} Array representing each line of the parsed content, each line itself is split by commands and stored within an array.
 */
function CommonParseCSV(str) {

	var arr = [];
	var quote = false;  // true means we're inside a quoted field
	var c;
	var col;

	// iterate over each character, keep track of current row and column (of the returned array)
	for (let row = col = c = 0; c < str.length; c++) {
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

/**
 *  Read a CSV file from cache, or fetch it from the server
 * @param {string} Array - Name of where the cached text is stored
 * @param {string} Path - Path/Group in which the screen is located
 * @param {string} Screen - Screen for which the file is for
 * @param {string} File - Name of the file to get
 * @returns {void} - Nothing
 */
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

	// If a translation file is available, we open the txt file and keep it in cache
	var TranslationPath = FullPath.replace(".csv", "_" + TranslationLanguage + ".txt");
	if (TranslationAvailable(TranslationPath))
		CommonGet(TranslationPath, function () {
			if (this.status == 200) TranslationCache[TranslationPath] = TranslationParseTXT(this.responseText);
		});

}

/**
 * AJAX utility to get a file and return its content
 * @param {string} Path - Path of the resource to request
 * @param {function} Callback - Callback to execute once the resource is received
 * @returns {void} - Nothing
 */
function CommonGet(Path, Callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", Path);
	xhr.onreadystatechange = function () { if (this.readyState == 4) Callback.bind(this)(xhr); };
	xhr.send(null);
}

/**
 * Catches the clicks on the main screen and forwards it to the current screen click function if it exists, otherwise it sends it to the dialog click function
 * @returns {void} - Nothing
 */
function CommonClick() {
	if (CurrentCharacter == null)
		CommonDynamicFunction(CurrentScreen + "Click()");
	else
		DialogClick();
}

/**
 * Catches key presses on the main screen and forwards it to the current screen key down function if it exists, otherwise it sends it to the dialog key down function
 * @returns {void} - Nothing
 */
function CommonKeyDown() {
	if (CurrentCharacter == null) {
		if (typeof window[CurrentScreen + "KeyDown"] === "function")
			CommonDynamicFunction(CurrentScreen + "KeyDown()");
	}
	else
		DialogKeyDown();
}

/**
 * Calls a basic dynamic function if it exists, for complex functions, use: CommonDynamicFunctionParams
 * @param {string} FunctionName - Name of the function to call
 * @returns {void} - Nothing
 */
function CommonDynamicFunction(FunctionName) {
	if (typeof window[FunctionName.substr(0, FunctionName.indexOf("("))] === "function")
		window[FunctionName.replace("()", "")]();
	else
		console.log("Trying to launch invalid function: " + FunctionName);
}


/**
 * Calls a dynamic function with parameters (if it exists), also allow ! in front to reverse the result. The dynamic function is the provided function name in the dialog option object and it is prefixed by the current screen.
 * @param {string} FunctionName - Function name to call dynamically
 * @returns {*} - Returns what the dynamic function returns or FALSE if the function does not exist
 */
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
	for (let P = 0; P < Params.length; P++)
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


/**
 *  Calls a named global function with the passed in arguments, if the named function exists. Differs from
 *  CommonDynamicFunctionParams in that arguments are not parsed from the passed in FunctionName string, but
 *  passed directly into the function call, allowing for more complex JS objects to be passed in. This
 *  function will not log to console if the provided function name does not exist as a global function.
 * @param {string} FunctionName - The name of the global function to call
 * @param {...*} [args] - zero or more arguments to be passed to the function (optional)
 */
function CommonCallFunctionByName(FunctionName/*, ...args */) {
	var Function = window[FunctionName];
	if (typeof Function === "function") {
		var args = Array.prototype.slice.call(arguments, 1);
		return Function.apply(null, args);
	}
}

/**
 * Sets the current screen and calls the loading script if needed
 * @param {string} NewModule - Module of the screen to display
 * @param {string} NewScreen - Screen to display
 * @returns {void} - Nothing
 */
function CommonSetScreen(NewModule, NewScreen) {
	CurrentModule = NewModule;
	CurrentScreen = NewScreen;
	TextLoad();
	if (typeof window[CurrentScreen + "Load"] === "function")
		CommonDynamicFunction(CurrentScreen + "Load()");
}

/**
 * Gets the current time in ms
 * @returns {number} - Date in ms
 */
function CommonTime() {
	return Date.now();
}

/**
 * Checks if a given value is a valid HEX color code
 * @param {string} Value - Potential HEX color code
 * @returns {boolean} - Returns TRUE if the string is a valid HEX color
 */
function CommonIsColor(Value) {
	if ((Value == null) || (Value.length < 3)) return false;
	if (/^#[0-9A-F]{3}$/i.test(Value)) Value = "#" + Value[1] + Value[1] + Value[2] + Value[2] + Value[3] + Value[3];	//convert short hand hex color to standard format
	return /^#[0-9A-F]{6}$/i.test(Value);
}

/**
 * Checks whether an item's color has a valid value that can be interpreted by the drawing
 * functions. Valid values are null, undefined, strings, and an array containing any of the
 * aforementioned types.
 * @param {*} Color - The Color value to check
 * @returns {boolean} - Returns TRUE if the color is a valid item color
 */
function CommonColorIsValid(Color) {
	if (Color == null || typeof Color === "string") return true;
	if (Array.isArray(Color)) return Color.every(C => C == null || typeof C === "string");
	return false;
}

/**
 * Get a random item from a list while making sure not to pick the previous one.
 * @param {*} ItemPrevious - Previously selected item from the given list
 * @param {*} ItemList - List for which to pick a random item from
 * @returns {*} - The randomly selected item from the list
 */
function CommonRandomItemFromList(ItemPrevious, ItemList) {
	var NewItem = ItemPrevious;
	while (NewItem == ItemPrevious)
		NewItem = ItemList[Math.floor(Math.random() * ItemList.length)];
	return NewItem;
}

/**
 * Converts a string of numbers split by commas to an array, sanitizes the array by removing all NaN or undefined elements.
 * @param {string} s - String of numbers split by commas
 * @returns {number[]} - Array of valid numbers from the given string
 */
function CommonConvertStringToArray(s) {
	var arr = [];
	if (s != "") {
		arr = s.split(',').map(Number).reduce((list, curr) => {
			if (!((curr === false) || Number.isNaN(curr))) list.push(curr);
			return list;
		}, []);
	}
	return arr;
}

/**
 * Converts an array to a string separated by commas (equivalent of .join(","))
 * @param {Array} Arr - Array to convert to a joined string
 * @returns {string} - String of all the array items joined together
 */
function CommonConvertArrayToString(Arr) {
	var S = "";
	for (let P = 0; P < Arr.length; P++) {
		if (P != 0) S = S + ",";
		S = S + Arr[P].toString();
	}
	return S;
}

/**
 * Checks whether two item colors are equal. An item color may either be a string or an array of strings.
 * @param {string|string[]} C1 - The first color to check
 * @param {string|string[]} C2 - The second color to check
 * @returns {boolean} - TRUE if C1 and C2 represent the same item color, FALSE otherwise
 */
function CommonColorsEqual(C1, C2) {
	if (Array.isArray(C1) && Array.isArray(C2)) {
		return CommonArraysEqual(C1, C2);
	}
	return C1 === C2;
}

/**
 * Checks whether two arrays are equal. The arrays are considered equal if they have the same length and contain the same items in the same
 * order, as determined by === comparison
 * @param {*[]} a1 - The first array to compare
 * @param {*[]} a2 - The second array to compare
 * @returns {boolean} - TRUE if both arrays have the same length and contain the same items in the same order, FALSE otherwise
 */
function CommonArraysEqual(a1, a2) {
	return a1.length === a2.length && a1.every((item, i) => item === a2[i]);
}

/**
 * Creates a debounced wrapper for the provided function with the provided wait time. The wrapped function will not be called as long as
 * the debounced function continues to be called. If the debounced function is called, and then not called again within the wait time, the
 * wrapped function will be called.
 * @param {function} func - The function to debounce
 * @param {number} wait - The wait time in milliseconds that needs to pass after calling the debounced function before the wrapped function
 * is invoked
 * @returns {function} - A debounced version of the provided function
 */
function CommonDebounce(func, wait) {
	let timeout, args, context, timestamp, result;
	wait = typeof wait === "number" ? wait : 100;

	function later() {
		const last = CommonTime() - timestamp;
		if (last >= 0 && last < wait) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			result = func.apply(context, args);
			context = args = null;
		}
	}

	return function () {
		context = this;
		args = arguments;
		timestamp = CommonTime();
		if (!timeout) {
			timeout = setTimeout(later, wait);
		}
		return result;
	};
}
/**
 * Creates a simple memoizer. 
 * The memoized function does calculate its result exactly once and from that point on, uses
 * the result stored in a local cache to speed up things.
 * @param {function} func - The function to memoize
 * @returns {any} - The result of the memoized function
 */
function CommonMemoize(func) {
	var memo = {};
	var slice = Array.prototype.slice;

	var memoized = function () {
		var index = [];
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] === "object") {
				index.push(JSON.stringify(arguments[i]));
			} else {
				index.push(slice.call(arguments[i]));
			}
		} // for
		if (!(index in memo)) {
			memo[index] = func.apply(this, arguments);
		}
		return memo[index];
	}; // function

	// add a clear cache method
	memoized.clearCache = function () {
		memo = {};
	}
	return memoized;
} // CommonMemoize

// Get size + font
function CommonGetFont(size) {
  const font = (Player && Player.GraphicsSettings && Player.GraphicsSettings.Font) || "Arial";
  return `${size}px ${font}`;
}

// Get the name of the font only
function CommonGetFontName() {
  const font = (Player && Player.GraphicsSettings && Player.GraphicsSettings.Font) || "Arial";
  return `${font}`;
}
