var C012_AfterClass_Outro_Type = "";

// Chapter 12 - After Class Outro Load
function C012_AfterClass_Outro_Load() {
	
	// Time is always 16:30:00 in the outro, reset the poses if needed
	if (Common_PlayerRestrained && (C012_AfterClass_Dorm_Guest.length == 0)) C012_AfterClass_Outro_Type = "Bondage";
	if (GameLogQuery(CurrentChapter, "", "EventSleepBoundAndGagged")) C012_AfterClass_Outro_Type = "SleepBoundAndGagged";
	if (C012_AfterClass_Isolation_SarahRestrained && C012_AfterClass_Isolation_PlayerRestrained) C012_AfterClass_Outro_Type = "Isolation";
	StopTimer(24 * 60 * 60 * 1000);
	C000_Intro_ChapterSelect_CreditTextColor = "white";

}

// Chapter 12 - After Class Outro Run
function C012_AfterClass_Outro_Run() {

	// Special outro if the player got the "Sleep bound and gagged" punishment
	if (C012_AfterClass_Outro_Type == "SleepBoundAndGagged") {

		// Prepares the background image
		Common_PlayerRestrained = true;
		var ImageName = "C012_AfterClass/Outro/SleepBoundAndGagged";
		if (Common_PlayerChaste) ImageName = ImageName + "Belt";
		ImageName = ImageName + (Math.floor(TextPhase / 2) + 1).toString() + ".jpg";
		DrawImage(ImageName, 0, 0);

		// Shows the text in the bottom
		DrawText(GetText("SleepBoundAndGagged" + TextPhase.toString()), 599, 549, "White");
		DrawText(GetText("SleepBoundAndGagged" + TextPhase.toString()), 600, 550, "Black");
		
	} else {

		// Paints the background
		DrawRect(0, 0, 1200, 600, "black");
		var x = 600;

		// Shows the end credit
		if (TextPhase >= 5) {
			x = 300;
			C000_Intro_ChapterSelect_DrawCredits();
			C000_Intro_ChapterSelect_CreditPosition++;
		}

		// Shows the text
		DrawText(GetText("Outro1" + C012_AfterClass_Outro_Type), x, 100, "White");
		if (TextPhase >= 1) DrawText(GetText("Outro2"), x, 200, "White");
		if (TextPhase >= 2) DrawText(GetText("Outro3"), x, 300, "White");
		if (TextPhase >= 3) DrawText(GetText("Outro4"), x, 400, "White");
		if (TextPhase >= 4) DrawText(GetText("Outro5"), x, 500, "White");

	}

}

// Chapter 12 - After Class Outro Click
function C012_AfterClass_Outro_Click() {

	// Jump to the next animation
	TextPhase++;
	if ((TextPhase >= 8) && (C012_AfterClass_Outro_Type == "SleepBoundAndGagged")) {
		C012_AfterClass_Outro_Type = "Bondage";
		TextPhase = 0;
	}

}