// Chapter 101 - Kinbaku Club Load
function C101_KinbakuClub_EricaBadEnd_Load() {
	
	// Time is always 18:25:00 in the outro, unlock if needed
	// StopTimer(18 * 60 * 60 * 1000, CurrentChapter, "Outro");
	StopTimer(CurrentTime, CurrentChapter, "EricaBadEnd");

}

// Chapter 101 - Kinbaku Club Bad End Run
function C101_KinbakuClub_EricaBadEnd_Run() {

	// Paints the background	
	DrawRect(0, 0, 700, 600, "black");

	// Dialog depending on the outro situation
	if (TextPhase >= 0) {
		DrawText(GetText("BadEnd1"), 350, 50, "White");
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/EricaPinsPlayer.jpg", 700, 0);
	}
    if (TextPhase >= 1) {
		DrawText(GetText("BadEnd2"), 350, 100, "White");
		//CurrentTime = CurrentTime + 10000;
		//TextPhase++;
	}
	if (TextPhase >= 2) {
		DrawText(GetText("BadEnd3"), 350, 150, "White")
		//CurrentTime = CurrentTime + 10000;
		//TextPhase++;
	}
	if (TextPhase >= 3) {
		DrawText(GetText("BadEnd4"), 350, 200, "White");
		//CurrentTime = CurrentTime + 180000;
		//TextPhase++;
		PlayerLockInventory("Rope");
		PlayerLockInventory("BallGag");
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/EricaBindsPlayer.jpg", 700, 0);
	}
	if (TextPhase >= 4) {
		DrawText(GetText("BadEnd5"), 350, 250, "White");
		//StopTimer(CurrentTime + 30 * 1000);
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/EricaHoldingHood.jpg", 700, 0);
	}
	if (TextPhase >= 5) {
		DrawText(GetText("BadEnd6"), 350, 300, "White");
		//StopTimer(CurrentTime + 60 * 1000);
		DrawRect(700, 0, 1200, 600, "black");
		PlayerLockInventory("Collar");
	}
	if (TextPhase >= 6) {
		DrawText(GetText("BadEnd7"), 350, 350, "White");
		//StopTimer(CurrentTime + 10 * 1000);
	}
    if (TextPhase >= 7) {
		DrawText(GetText("BadEnd8"), 350, 400, "White");
		//StopTimer(CurrentTime + 300 * 1000);
	}
	if (TextPhase >= 8) {
		DrawText(GetText("BadEnd9"), 350, 450, "White");
		//StopTimer(CurrentTime + 180 * 1000);
	}
	if (TextPhase >= 9) {
		DrawText(GetText("BadEnd10"), 350, 500, "White");
		//StopTimer(CurrentTime + 10 * 1000);
	}
	if (TextPhase >= 10) {
		DrawText(GetText("BadEnd11"), 350, 550, "White");
		//StopTimer(CurrentTime + 10 * 1000);
	}
}

// Chapter 101 - Kinbaku Club  Click
function C101_KinbakuClub_EricaBadEnd_Click() {

	// Jump to the next animation
	TextPhase++;

}
