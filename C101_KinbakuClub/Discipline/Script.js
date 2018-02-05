// Chapter 101 - Kinbaku Club Load
function C101_KinbakuClub_Discipline_Load() {
	
	// Time is always 17:25:00 in the outro, unlock if needed
	StopTimer(17.25 * 60 * 60 * 1000, CurrentChapter, "Discipline");
}

// Chapter 7 - Kinbaku Club Run
function C101_KinbakuClub_Discipline_Run() {

	// Paints the background	
	var ctx = document.getElementById("MainCanvas").getContext("2d");
	DrawRect(ctx, 0, 0, 800, 600, "black");	
	if (TextPhase >= 0) {
		if (C101_KinbakuClub_Lauren_BullyCount >= 10) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/JennaGrab.jpg", 800, 0); // needs jenna grabbing player jpg
		else DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/JennaBlocking.jpg", 800, 0); // needs jenna blocking doorway jpg
	}
	if (TextPhase >= 1) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/BagBlack.jpg", 800, 0);

	// Dialog depending on the outro situation
	if (TextPhase >= 0) {
		if (C101_KinbakuClub_Lauren_BullyCount >= 10) DrawText(ctx, GetText("Bully1"), 400, 120, "White");
		else DrawText(ctx, GetText("Discipline1"), 400, 120, "White");
	}
    if (TextPhase >= 1) DrawText(ctx, GetText("Discipline2"), 400, 240, "White");
	if (TextPhase >= 2) DrawText(ctx, GetText("Discipline3"), 400, 360, "White");
	if (TextPhase >= 3) {
		DrawText(ctx, GetText("Discipline4"), 400, 480, "White");
		PlayerLockInventory("Rope");
	}
}

// Chapter 101 - Kinbaku Club  Click
function C101_KinbakuClub_Discipline_Click() {

	// Jump to the next animation
	TextPhase++;
			
	// Jump to lunch on phase 3
	//if (TextPhase >= 4) SaveMenu("C102_KinbakuDiscipline", "Intro");

}
