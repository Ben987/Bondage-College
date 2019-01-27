var C101_KinbakuClub_Outro_Freed = true;

// Chapter 101 - Kinbaku Club Load
function C101_KinbakuClub_Outro_Load() {
	if (Common_PlayerRestrained) C101_KinbakuClub_Outro_Freed = true;
	
	// Time is always 18:25:00 in the outro
	StopTimer(18.25 * 60 * 60 * 1000, CurrentChapter, "Outro");
}

// Chapter 7 - Kinbaku Club Run
function C101_KinbakuClub_Outro_Run() {

	// Paints the background	
	DrawRect(0, 0, 800, 600, "black");	
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Jenna.jpg", 800, 0);

	// Dialog depending on the outro situation
	if (TextPhase >= 0) DrawText(GetText("Outro1"), 400, 86, "White");
    if (TextPhase >= 1) DrawText(GetText("Outro2"), 400, 171, "White");
	if (TextPhase >= 2) DrawText(GetText("Outro3"), 400, 257, "White");
	if (TextPhase >= 3) {
		if (!C101_KinbakuClub_Outro_Freed) DrawText(GetText("Outro4"), 400, 343, "White");
		if (C101_KinbakuClub_Outro_Freed) DrawText(GetText("Outro4Free"), 400, 343, "White");
		PlayerReleaseBondage()
	}
	if (TextPhase >= 4) DrawText(GetText("Outro5"), 400, 429, "White");
	if (TextPhase >= 5) DrawText(GetText("Outro6"), 400, 514, "White");
}

// Chapter 101 - Kinbaku Club  Click
function C101_KinbakuClub_Outro_Click() {

	// Jump to the next animation
	TextPhase++;
			
	// Jump to lunch on phase 3
	if (TextPhase >= 6) {
		SetScene("C012_AfterClass", "Dorm");
		//SaveMenu("C103_KinbakuCompetition", "Intro");
	}

}
