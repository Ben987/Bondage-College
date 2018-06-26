// Chapter 11 - Literature Class Load
function C011_LiteratureClass_Intro_Load() {

	// Time is always 15:30 on the intro, no timer
	CurrentTime = 15.5 * 60 * 60 * 1000;
	StopTimer(CurrentTime);

}

// Chapter 11 - Literature Class Run
function C011_LiteratureClass_Intro_Run() {

	// Paints the background
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	DrawPlayerTransition();

	// Write the chapter introduction
	DrawText(GetText("Intro1"), 450, 150, "White");
	if (TextPhase >= 1) DrawText(GetText("Intro2"), 450, 250, "White");
	if (TextPhase >= 2) DrawText(GetText("Intro3"), 450, 350, "White");
	if (TextPhase >= 3) DrawText(GetText("Intro4"), 450, 450, "White");

}

// Chapter 11 - Literature Class Click
function C011_LiteratureClass_Intro_Click() {
	TextPhase++;
	if (TextPhase >= 4) SetScene(CurrentChapter, "SelectDesk");
}