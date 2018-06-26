// Chapter 101 - Kinbaku Club Load
function C101_KinbakuClub_Intro_Load() {

	// Time is always 16:45 on the intro, no timer
	if (CurrentTime < (16.75 * 60 * 60 * 1000))	StopTimer(16.75 * 60 * 60 * 1000);
	else StopTimer(CurrentTime);
	
	GameLogAdd("KinbakuClubInfo");
}

// Chapter 101 - Drama Class Run
function C101_KinbakuClub_Intro_Run() {
	
	// Paints the background
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);

	// Write the chapter introduction
	DrawText(GetText("Intro1"), 600, 150, "White");
	if (GameLogQuery("C007_LunchBreak", "Natalie", "Lunch") || GameLogQuery("", "", "KinbakuClubInfo")) {
		if (TextPhase >= 1) DrawText(GetText("Intro2"), 600, 250, "White");
		if (TextPhase >= 2) DrawText(GetText("Intro3"), 600, 350, "White");
		if (TextPhase >= 3 && GameLogQuery("C007_LunchBreak", "Natalie", "Lunch")) DrawText(GetText("Intro4"), 600, 450, "White");
		if (TextPhase >= 3 && !GameLogQuery("C007_LunchBreak", "Natalie", "Lunch")) DrawText(GetText("Intro4New"), 600, 450, "White");
	} else {
		if (TextPhase >= 1) DrawText(GetText("Intro2New"), 600, 250, "White");
		if (TextPhase >= 2) DrawText(GetText("Intro3New"), 600, 350, "White");
		if (TextPhase >= 3) DrawText(GetText("Intro4New"), 600, 450, "White");
	}
}

// Chapter 101 - Drama Class Click
function C101_KinbakuClub_Intro_Click() {
	TextPhase++;
	if (TextPhase >= 4) SetScene(CurrentChapter, "JennaIntro");
}
