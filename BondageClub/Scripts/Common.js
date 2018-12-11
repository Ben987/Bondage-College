// Main variables
var Player;
var MouseX = 0;
var MouseY = 0;
var KeyPress = "";
var CurrentModule;
var CurrentScreen;
var CurrentCharacter = null;
var CommonIsMobile = false;
var CommonCurrentTimer = 0;
var CommonRunInterval = 20;
var CommonCSVCache = {};

// Returns TRUE if the variable is a number
function CommonIsNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Returns the current date and time in a yyyy-mm-dd hh:mm:ss format
function CommonGetFormatDate() {
	var d = new Date();
	var yyyy = d.getFullYear();
	var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); // getMonth() is zero-based
	var dd  = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
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
    var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile','mobile/'];
    for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

    // If nothing is found, we assume desktop
    return false;
}

// Parse a CSV file
function CommonParseCSV(str) {
		
    var arr = [];
    var quote = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // current character, next character
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
    var FullPath = Path + "/" + Screen + "/" + File + "_" + CommonGetWorkingLanguage() + ".csv";    
    if (CommonCSVCache[FullPath]) {
		window[Array] = CommonCSVCache[FullPath];
        return;
    }
    
    // Opens the file, parse it and returns the result in an Object
    CommonGet(FullPath, function() {
        if (this.status == 200) {
            CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
			window[Array] = CommonCSVCache[FullPath];
        }
    });
}

// Returns a working language if translation isn't fully ready
function CommonGetWorkingLanguage() {
	return "EN";
}

// AJAX utility
function CommonGet(Path, Callback) {
	var xhr = new XMLHttpRequest();
    xhr.open("GET", Path);
    xhr.onreadystatechange = function() { if (this.readyState == 4) Callback.bind(this)(); };
    xhr.send(null);
}

// Catches the clicks on the main screen and forwards it to the current screen or dialog screen
function CommonClick() {	
	if (CurrentCharacter == null)
		CommonDynamicFunction(CurrentScreen + "Click()");
	else 
		DialogClick();
}

// Calls a dynamic function (if it exists)
function CommonDynamicFunction(FunctionName) {
	if (typeof window[FunctionName.substr(0, FunctionName.indexOf("("))] == "function") {
		var Fct = new Function(FunctionName);
		Fct();
	} else console.log("Trying to launch invalid function: " + FunctionName);
}

// Sets the current screen and calls the loading script if needed, only allow the change screen if the player can walk
function CommonSetScreen(NewModule, NewScreen) {
	CurrentModule = NewModule;
	CurrentScreen = NewScreen;
	TextLoad();
	if (eval("typeof " + CurrentScreen + "Load") == "function")
		CommonDynamicFunction(CurrentScreen + "Load()");
}

// Return the current time
function CommonTime() {
	return new Date().getTime();
}