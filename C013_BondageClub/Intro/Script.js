// Chapter 13 - Bondage Club Load
function C013_BondageClub_Intro_Load() {

	// No timer in the Bondage Club
	StopTimer(CurrentTime);

}

// Chapter 13 - Bondage Club Run
function C013_BondageClub_Intro_Run() {

	// Paints the background
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	DrawPlayerTransition();

	// Write the chapter introduction
	DrawText(GetText("Intro1"), 450, 150, "White");
	if (TextPhase >= 1) {
		if (!GameLogQuery("", "", "VisitBondageClubWithSarah")) DrawText(GetText("Intro2"), 450, 250, "White");
		else DrawText(GetText("IntroSarah2"), 450, 250, "White");
	}
	if (TextPhase >= 2) DrawText(GetText("Intro3"), 450, 350, "White");
	if (TextPhase >= 3) DrawText(GetText("Intro4"), 450, 450, "White");

}

// Chapter 13 - Bondage Club Click
function C013_BondageClub_Intro_Click() {
	TextPhase++;
	if (TextPhase >= 4) SetScene(CurrentChapter, "Entrance");
}