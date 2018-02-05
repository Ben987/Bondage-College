// Chapter 101 - Kinbaku Club Load
function C101_KinbakuClub_Outro_Load() {
	
	// Time is always 18:25:00 in the outro
	StopTimer(18.25 * 60 * 60 * 1000, CurrentChapter, "Outro");
}

// Chapter 7 - Kinbaku Club Run
function C101_KinbakuClub_Outro_Run() {

	// Paints the background	
	var ctx = document.getElementById("MainCanvas").getContext("2d");
	DrawRect(ctx, 0, 0, 800, 600, "black");	
	DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/Bell.jpg", 800, 0);

	// Dialog depending on the outro situation
	if (TextPhase >= 0) DrawText(ctx, GetText("Outro1"), 400, 100, "White");
    if (TextPhase >= 1) DrawText(ctx, GetText("Outro2"), 400, 200, "White");
	if (TextPhase >= 2) DrawText(ctx, GetText("Outro3"), 400, 300, "White");
	if (TextPhase >= 3) DrawText(ctx, GetText("Outro4"), 400, 400, "White");
    if (TextPhase >= 4) DrawText(ctx, GetText("Outro5"), 400, 500, "White");
}

// Chapter 101 - Kinbaku Club  Click
function C101_KinbakuClub_Outro_Click() {

	// Jump to the next animation
	TextPhase++;
			
	// Jump to lunch on phase 3
	//if (TextPhase >= 5) {
	//	SaveMenu("C103_KinbakuCompetition", "Intro");
	//}

}
