// Main variables
var CurrentIntro;
var CurrentStage;
var CurrentText;
var CurrentChapter;
var CurrentScreen;
var CurrentLanguageTag = "EN";
var OverridenIntroText;
var OverridenIntroImage;
var LeaveChapter = "";
var LeaveScreen = "";
var LeaveIcon = "";
var MouseX = 0;
var MouseY = 0;
var KeyPress = "";
var IsMobile = false;
var TextPhase = 0;
var CSVCache = {};
var MaxFightSequence = 500;
var MaxRaceSequence = 1000;
var AllowCheats = false;

// Array variables
var IntroStage = 0;
var IntroLoveReq = 1;
var IntroSubReq = 2;
var IntroVarReq = 3;
var IntroText = 4;
var	IntroImage = 5;
var StageNumber = 0;
var StageLoveReq = 1;
var StageSubReq = 2;
var StageVarReq = 3;
var StageInteractionText = 4;
var StageInteractionResult = 5;
var StageNextStage = 6;
var StageLoveMod = 7;
var StageSubMod = 8;
var StageFunction = 9;
var TextTag = 0;
var TextContent = 1;
var FightMoveType = 0;
var FightMoveTime = 1;
var RaceMoveType = 0;
var RaceMoveTime = 1;

// Common variables
var Common_BondageAllowed = true;
var Common_SelfBondageAllowed = true;
var Common_PlayerName = "";
var Common_PlayerOwner = "";
var Common_PlayerLover = "";
var Common_PlayerRestrained = false;
var Common_PlayerGagged = false;
var Common_PlayerBlinded = false;
var Common_PlayerChaste = false;
var Common_PlayerNotRestrained = true;
var Common_PlayerNotGagged = true;
var Common_PlayerNotBlinded = true;
var Common_PlayerClothed = true;
var Common_PlayerUnderwear = false;
var Common_PlayerNaked = false;
var Common_PlayerCloth = "";
var Common_PlayerCostume = "";
var Common_PlayerPose = "";
var Common_ActorIsLover = false;
var Common_ActorIsOwner = false;
var Common_ActorIsOwned = false;
var Common_Number = "";

// Returns TRUE if the variable is a number
function IsNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Returns the current date and time in a yyyy-mm-dd hh:mm:ss format
function GetFormatDate() {
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
function DetectMobile() {

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
function ParseCSV(str) {
		
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
function ReadCSV(Array, ChapterOrPath, Screen, Type, Language) {
    // Changed from a single path to various arguments and internally concatenate them
    // This ternary operator is used to keep backward compatibility
    var Path = (Screen && Type)
                 ? ChapterOrPath + "/" + Screen + "/" + Type + (Language ? "_" : "") + (Language || "") + ".csv"
                 : ChapterOrPath;
    
    if (CSVCache[Path]) {
        window[Array] = CSVCache[Path];
        return;
    }
    
    // Opens the file, parse it and returns the result in an array
    Get(Path, function() {
        if (this.status == 200) {
            CSVCache[Path] = ParseCSV(this.responseText);
            window[Array] = CSVCache[Path];
        } else if (this.status == 404 && Language && Language != "EN") { // If language isn't EN and the file doesn't exist, then fallback to EN
            ReadCSV(Array, ChapterOrPath, Screen, Type, "EN");
        }
    });
}

// AJAX utility
function Get(Path, Callback) {
	var xhr = new XMLHttpRequest();
    xhr.open("GET", Path);
    xhr.onreadystatechange = function() { if (this.readyState == 4) Callback.bind(this)(); };
    xhr.send(null);
}

// Shuffles all array elements at random
function ArrayShuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// Returns a working language if translation isn't fully ready
function GetWorkingLanguage() {
	if ((CurrentLanguageTag == "FR") && ((CurrentChapter == "C000_Intro") || (CurrentChapter == "C001_BeforeClass") || (CurrentChapter == "C002_FirstClass") || (CurrentChapter == "C003_MorningDetention") || (CurrentChapter == "C004_ArtClass") || (CurrentChapter == "C005_GymClass") || (CurrentChapter == "C006_Isolation") || (CurrentChapter == "C007_LunchBreak") || (CurrentChapter == "C008_DramaClass") || (CurrentChapter == "C009_Library") || (CurrentChapter == "C999_Common"))) return "FR";
	if ((CurrentLanguageTag == "DE") && ((CurrentChapter == "C000_Intro") || (CurrentChapter == "C001_BeforeClass") || (CurrentChapter == "C002_FirstClass") || (CurrentChapter == "C003_MorningDetention") || (CurrentChapter == "C004_ArtClass") || (CurrentChapter == "C005_GymClass") || (CurrentChapter == "C006_Isolation") || (CurrentChapter == "C007_LunchBreak") || (CurrentChapter == "C008_DramaClass") || (CurrentChapter == "C009_Library") || (CurrentChapter == "C010_Revenge") || (CurrentChapter == "C011_LiteratureClass") || (CurrentChapter == "C012_AfterClass") || (CurrentChapter == "C013_BondageClub") || (CurrentChapter == "C999_Common"))) return "DE";
	if ((CurrentLanguageTag == "PL") && ((CurrentChapter == "C000_Intro"))) return "PL";
	if ((CurrentLanguageTag == "ES") && ((CurrentChapter == "C000_Intro") || (CurrentChapter == "C001_BeforeClass") || (CurrentChapter == "C002_FirstClass") || (CurrentChapter == "C003_MorningDetention"))) return "ES";
	if ((CurrentLanguageTag == "CN") && ((CurrentChapter == "C000_Intro") || (CurrentChapter == "C001_BeforeClass") || (CurrentChapter == "C002_FirstClass") || (CurrentChapter == "C003_MorningDetention") || (CurrentChapter == "C005_GymClass") || (CurrentChapter == "C999_Common"))) return "CN";
	if ((CurrentLanguageTag == "RU") && ((CurrentChapter == "C000_Intro") || (CurrentChapter == "C001_BeforeClass"))) return "RU";
	return "EN";
    //return CurrentLanguageTag;
}

// Load the interactions from a scene and keep it in common variable
function LoadInteractions() {	
	ReadCSV("CurrentIntro", CurrentChapter, CurrentScreen, "Intro", GetWorkingLanguage());
	ReadCSV("CurrentStage", CurrentChapter, CurrentScreen, "Stage", GetWorkingLanguage());
	LoadText();
}

// Load the custom texts from a scene and keep it in common variable
function LoadText() {
	ReadCSV("CurrentText", CurrentChapter, CurrentScreen, "Text", GetWorkingLanguage());
}

// Calls a dynamic function (if it exists)
function DynamicFunction(FunctionName) {
	if (typeof window[FunctionName.substr(0, FunctionName.indexOf("("))] == "function") {
		var Fct = new Function(FunctionName);
		Fct();
	} else console.log("Trying to launch invalid function: " + FunctionName);
}

// Set the current scene (chapter and screen)
function SetScene(Chapter, Screen) {
	
	// Keep the chapter and screen
	CurrentStage = null;
	CurrentIntro = null;
	CurrentText = null;
	CurrentActor = "";
	CurrentChapter = Chapter;
	CurrentScreen = Screen;
	OverridenIntroText = "";
	OverridenIntroImage = "";
	LeaveIcon = "";
	LeaveScreen = "";
	LeaveChapter = Chapter;
	Common_ActorIsLover = false;
	Common_ActorIsOwner = false;
	Common_ActorIsOwned = false;

	// Load the screen code
	DynamicFunction(CurrentChapter + "_" + CurrentScreen + "_Load()");
	
}

// Validates if any interaction was clicked
function ClickInteraction(CurrentStagePosition) {
	
	// Make sure the current stage is loaded
	if (CurrentStage != null) {
	
		// If a regular option was clicked, we process it
		var Pos = 0;
		for (var L = 0; L < CurrentStage.length; L++)
			if (CurrentStage[L][StageNumber] == CurrentStagePosition)
				if (ActorInteractionAvailable(CurrentStage[L][StageLoveReq], CurrentStage[L][StageSubReq], CurrentStage[L][StageVarReq], CurrentStage[L][StageInteractionText], false)) {
					if ((MouseX >= (Pos % 2) * 300) && (MouseX <= ((Pos % 2) * 300) + 299) && (MouseY >= 151 + (Math.round((Pos - 1) / 2) * 90)) && (MouseY <= 240 + (Math.round((Pos - 1) / 2) * 90))) {
						window[CurrentChapter + "_" + CurrentScreen + "_CurrentStage"] = CurrentStage[L][StageNextStage];
						OverridenIntroText = CurrentStage[L][StageInteractionResult];
						ActorChangeAttitude(CurrentStage[L][StageLoveMod], CurrentStage[L][StageSubMod]);
						// Check if the interaction has a time tag
						var MinuteString = "ADD_MINUTES:";
						var MinuteStringIndex = CurrentStage[L][StageInteractionText].indexOf(MinuteString);
						if (MinuteStringIndex >= 0) {
							var MinuteCount = parseInt(CurrentStage[L][StageInteractionText].substring(MinuteStringIndex + MinuteString.length));
							// If the text after the tag isn't a valid number, output a log message and assume the default time
							if (isNaN(MinuteCount)) {
								console.log("Invalid minute expression in interaction: " + CurrentStage[L][StageInteractionText]);
								CurrentTime = CurrentTime + 10000;
							}
							else CurrentTime = CurrentTime + MinuteCount * 60000;
						}
						else CurrentTime = CurrentTime + 10000;
						if (CurrentStage[L][StageFunction].trim() != "") DynamicFunction(CurrentChapter + "_" + CurrentScreen + "_" + CurrentStage[L][StageFunction].trim());
						return;
					}
					Pos = Pos + 1;
				}

	}

}

// Returns the text for the current scene associated with the tag
function GetText(Tag) {

	// Make sure the text CSV file is loaded
	if (CurrentText != null) {
		
		// Cycle the text to find a matching tag and returns the text content
		Tag = Tag.trim().toUpperCase();
		for (var T = 0; T < CurrentText.length; T++)
			if (CurrentText[T][TextTag].trim().toUpperCase() == Tag)
				return CurrentText[T][TextContent].trim();
		
		// Returns an error message
		return "MISSING TEXT FOR TAG: " + Tag.trim();

	} else return "";

}

// Returns the text for a specific CSV associated with the tag
function GetCSVText(CSVText, Tag) {

	// Make sure the text CSV file is loaded
	if (CSVText != null) {
		
		// Cycle the text to find a matching tag and returns the text content
		Tag = Tag.trim().toUpperCase();
		for (var T = 0; T < CSVText.length; T++)
			if (CSVText[T][TextTag].trim().toUpperCase() == Tag)
				return CSVText[T][TextContent].trim();
		
		// Returns an error message
		return "MISSING TEXT FOR TAG: " + Tag.trim();

	} else return "";

}

// Triggers the leave or wait button if needed
function LeaveButtonClick() {
	
	// If the wait option was clicked, we skip 2 minutes
	if (LeaveIcon == "Wait")
		if ((MouseX >= 1125) && (MouseX <= 1200) && (MouseY >= 600) && (MouseY <= 675)) 
			CurrentTime = CurrentTime + 120000;

	// If the leave option was clicked, we return to the previous screen
	if ((LeaveIcon == "Leave") && (LeaveScreen != ""))
		if ((MouseX >= 1125) && (MouseX <= 1200) && (MouseY >= 600) && (MouseY <= 675)) 
			SetScene(LeaveChapter, LeaveScreen);

}

// Creates a path from the supplied paths parts
function GetPath(paths) {
    var path = arguments[0];
    for (var index = 1; index < arguments.length; index++) {
        path += "/" + arguments[index];
    }
    return path;
}