var C012_AfterClass_Outro_Bondage = false;

// Chapter 12 - After Class Outro Load
function C012_AfterClass_Outro_Load() {
	
	// Time is always 16:30:00 in the outro, reset the poses if needed
	C012_AfterClass_Outro_Bondage = Common_PlayerRestrained;
	StopTimer(24 * 60 * 60 * 1000);
	PlayerReleaseBondage();
	PlayerClothes("Clothed");
	Common_PlayerPose = "";
	C000_Intro_ChapterSelect_CreditTextColor = "white";

}

// Chapter 12 - After Class Outro Run
function C012_AfterClass_Outro_Run() {

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
	if (C012_AfterClass_Outro_Bondage) DrawText(GetText("Outro1Bondage"), x, 100, "White");
	else DrawText(GetText("Outro1"), x, 100, "White");
	if (TextPhase >= 1) DrawText(GetText("Outro2"), x, 200, "White");
	if (TextPhase >= 2) DrawText(GetText("Outro3"), x, 300, "White");
	if (TextPhase >= 3) DrawText(GetText("Outro4"), x, 400, "White");
	if (TextPhase >= 4) DrawText(GetText("Outro5"), x, 500, "White");

}

// Chapter 12 - After Class Outro Click
function C012_AfterClass_Outro_Click() {

	// Jump to the next animation
	TextPhase++;
	//if (TextPhase >= 3) SaveMenu("C012_AfterClass", "Intro");

}