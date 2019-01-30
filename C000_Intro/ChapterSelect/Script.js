var C000_Intro_ChapterSelect_CurrentStage = 0;
var C000_Intro_ChapterSelect_CreditMode = false;
var C000_Intro_ChapterSelect_CreditPosition = 0;
var C000_Intro_ChapterSelect_Credits = [];
var C000_Intro_ChapterSelect_CreditActors = ["Player", "Amanda", "Sarah", "Sidney", "Jennifer", "Julia", "Yuki"];
var C000_Intro_ChapterSelect_ThankYouCount = 999999;
var C000_Intro_ChapterSelect_ThankYouList = ["Alvin", "Bryce", "Christian", "Designated", "Dick", "EugeneTooms", "Gopanka", "Jdmsouls22", "Jyeoh", "Karel", "Laioken", "Michal", "Mindtie", "Nick", "Overlord", "Paradox", "Rashiash", "Ryner", "Shadow", "Setsu95", "Shaun", "Simeon", "Simon", "Sky", "Terry", "William", "Winterisbest", "Xepherio", "Zack"];
var C000_Intro_ChapterSelect_ThankYouCurrent = -1;
var C000_Intro_ChapterSelect_CreditTextColor = "black";

// Chapter Select Load
function C000_Intro_ChapterSelect_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	LoadInteractions();
	ReadCSV("C000_Intro_ChapterSelect_Credits", CurrentChapter, CurrentScreen, "GameCredits");
	StopTimer(7.6666667 * 60 * 60 * 1000);
}

// Draw the credits 
function C000_Intro_ChapterSelect_DrawCredits() {

	// For each credits in the list
	var C;
	for(C = 0; C < C000_Intro_ChapterSelect_Credits.length; C++) {

		// Sets the Y position (it scrolls from bottom to top)
		var Y = 585 - C000_Intro_ChapterSelect_CreditPosition + (C * 40);

		// Draw the text if it's in drawing range
		if ((Y > 15) && (Y <= 585)) {

			// The "CreditTypeRepeat" starts scrolling again, other credit types are translated
			var Cred = C000_Intro_ChapterSelect_Credits[C][0];
			if (Cred == "CreditTypeRepeat") {
				C000_Intro_ChapterSelect_CreditPosition = 0;
				return;
			} else {
				if (Cred.substr(0, 10) == "CreditType") DrawText(GetText(Cred), 800, Y, C000_Intro_ChapterSelect_CreditTextColor);
				else {
					if (Cred.indexOf("|") == -1) DrawText(Cred, 800, Y, C000_Intro_ChapterSelect_CreditTextColor);
					else {
						DrawText(Cred.substring(0, Cred.indexOf("|")), 700, Y, C000_Intro_ChapterSelect_CreditTextColor);
						DrawText(Cred.substring(Cred.indexOf("|") + 1, 1000), 900, Y, C000_Intro_ChapterSelect_CreditTextColor);
					}
				}
			}

			// Draw one of the main actors in the credit rolls
			DrawImageZoom("Actors/" + C000_Intro_ChapterSelect_CreditActors[Math.floor(C000_Intro_ChapterSelect_CreditPosition / 200) % C000_Intro_ChapterSelect_CreditActors.length] + "/Clothed_NoBondage_NoGag.png", 0, 0, 600, 900, 900, 0, 600 * 0.65, 900 * 0.65);

		}

	}

}

// Draw the thank you image
function C000_Intro_ChapterSelect_DrawThankYou() {
	
	// If the image must swap
	if (C000_Intro_ChapterSelect_ThankYouCount >= 200) {
		var NewThankYou = C000_Intro_ChapterSelect_ThankYouCurrent;
		while (NewThankYou == C000_Intro_ChapterSelect_ThankYouCurrent)
			NewThankYou = Math.floor(Math.random() * C000_Intro_ChapterSelect_ThankYouList.length);
		C000_Intro_ChapterSelect_ThankYouCurrent = NewThankYou;
		C000_Intro_ChapterSelect_ThankYouCount = 0;
	}

	// Draw the selected thank you image
	DrawImage("C000_Intro/ChapterSelect/ThankYou/" + C000_Intro_ChapterSelect_ThankYouList[C000_Intro_ChapterSelect_ThankYouCurrent] + ".jpg", 600, 0);

}

// Chapter Select Run
function C000_Intro_ChapterSelect_Run() {
	BuildInteraction(C000_Intro_ChapterSelect_CurrentStage);
	if (C000_Intro_ChapterSelect_CreditMode) {
		DrawRect(600, 0, 1200, 600, "white");
		if (C000_Intro_ChapterSelect_Credits.length > 1) C000_Intro_ChapterSelect_DrawCredits();
		C000_Intro_ChapterSelect_CreditPosition++;
	} else {
		C000_Intro_ChapterSelect_DrawThankYou();
		C000_Intro_ChapterSelect_ThankYouCount++;
	}
}

// Chapter Select Click (Clicking on the image will swap it)
function C000_Intro_ChapterSelect_Click() {	
	ClickInteraction(C000_Intro_ChapterSelect_CurrentStage);
	if (!C000_Intro_ChapterSelect_CreditMode && (MouseX >= 600) && (MouseX <= 1200) && (MouseY >= 0) && (MouseY <= 599)) C000_Intro_ChapterSelect_ThankYouCount = 999999;
	StopTimer(7.6666667 * 60 * 60 * 1000);
}

// When the user selects a chapter, we load the intro for it
function C000_Intro_ChapterSelect_LoadChapter(ChapterToLoad) {
	C000_Intro_CreatePlayer_ChapterToLoad = ChapterToLoad;
	SetScene(CurrentChapter, "CreatePlayer");
}

// When the user selects a new language, we keep it and save it
function C000_Intro_ChapterSelect_SetLanguage(NewLanguageTag) {
	CurrentLanguageTag = NewLanguageTag;
	localStorage.setItem("CurrentLanguageTag", CurrentLanguageTag);
	LoadInteractions();
}

// When the user wants to load, we call the load screen
function C000_Intro_ChapterSelect_LoadScreen() {
	SetScene("C999_Common", "GameLoad");
}

// Go to achievement screen
function C000_Intro_ChapterSelect_Achievements() {
	SetScene("C999_Common", "Achievements");
}

// When the game credit should roll or stop
function C000_Intro_ChapterSelect_RollCredits() {
	C000_Intro_ChapterSelect_CreditMode = !C000_Intro_ChapterSelect_CreditMode;
	C000_Intro_ChapterSelect_CreditPosition = 0;
	C000_Intro_ChapterSelect_ThankYouCount = 0;
}