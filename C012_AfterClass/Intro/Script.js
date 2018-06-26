// Chapter 12 - After Class Load
function C012_AfterClass_Intro_Load() {

	// Time is always 16:45 on the intro, no timer
	CurrentTime = 16.75 * 60 * 60 * 1000;
	StopTimer(CurrentTime);

}

// Chapter 12 - After Class Run
function C012_AfterClass_Intro_Run() {

	// Paints the background
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	DrawPlayerTransition();

	// Write the chapter introduction
	DrawText(GetText("Intro1"), 450, 150, "White");
	if (TextPhase >= 1) DrawText(GetText("Intro2"), 450, 250, "White");
	if (TextPhase >= 2) DrawText(GetText("Intro3"), 450, 350, "White");
	if (TextPhase >= 3) DrawText(GetText("Intro4"), 450, 450, "White");

}

// Chapter 12 - After Class Click
function C012_AfterClass_Intro_Click() {
	TextPhase++;
	if (TextPhase >= 4) SetScene(CurrentChapter, "Dorm");
}