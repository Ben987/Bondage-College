// Chapter 101 - Kinbaku Club Load
function C101_KinbakuClub_Transition_Load() {
	
	// Time is always 18:00:00 in the outro
	if (CurrentTime >= 18 * 60 * 60 * 1000) CurrentTime = 18 * 60 * 60 * 1000;
	StopTimer(CurrentTime);
}

// Chapter 101 - Kinbaku Club Run
function C101_KinbakuClub_Transition_Run() {

	// Paints the background	
	var ctx = document.getElementById("MainCanvas").getContext("2d");
	DrawRect(ctx, 0, 0, 800, 600, "black");
	DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/Jenna.jpg", 800, 0);

	// Dialog depending on the outro situation
	if (TextPhase >= 0) DrawText(ctx, GetText("PlayerFree1"), 400, 100, "White");
	if (TextPhase >= 1) DrawText(ctx, GetText("PlayerFree2"), 400, 200, "White");
	if (TextPhase >= 2) DrawText(ctx, GetText("PlayerFree3"), 400, 300, "White");
	if (TextPhase >= 3) DrawText(ctx, GetText("PlayerFree4"), 400, 400, "White");
	if (TextPhase >= 4) DrawText(ctx, GetText("PlayerFree5"), 400, 500, "White");

	if (C101_KinbakuClub_Erica_PlayerIsSlave) {
		DrawRect(ctx, 0, 0, 800, 600, "black");
		if (TextPhase >= 0) DrawText(ctx, GetText("Enslaved1"), 400, 100, "White");
		if (TextPhase >= 1) DrawText(ctx, GetText("Enslaved2"), 400, 200, "White");
		if (TextPhase >= 2) {
			DrawText(ctx, GetText("Enslaved3"), 400, 300, "White");
			PlayerUnlockInventory("Collar")
		}
		if (TextPhase >= 3) DrawText(ctx, GetText("Enslaved4"), 400, 400, "White");
		if (TextPhase >= 4) DrawText(ctx, GetText("Enslaved5"), 400, 500, "White");
	}
	
	if (C101_KinbakuClub_Lauren_PlayerChairCuffed || C101_KinbakuClub_Lauren_PlayerStrappado) {
		DrawRect(ctx, 0, 0, 800, 600, "black");
		if (TextPhase >= 0) DrawText(ctx, GetText("ChairCuffed1"), 400, 100, "White");
		if (TextPhase >= 1) DrawText(ctx, GetText("ChairCuffed2"), 400, 200, "White");
		if (TextPhase >= 2 && C101_KinbakuClub_Lauren_PlayerChairCuffed) DrawText(ctx, GetText("ChairCuffed3"), 400, 300, "White");
		if (TextPhase >= 2 && C101_KinbakuClub_Lauren_PlayerStrappado && !C101_KinbakuClub_Lauren_PlayerLegCuffs) DrawText(ctx, GetText("LaurenCuffedStrppado"), 400, 300, "White");
		if (TextPhase >= 2 && C101_KinbakuClub_Lauren_PlayerLegCuffs) DrawText(ctx, GetText("LaurenCuffedStrppadoLegs"), 400, 300, "White");
		if (TextPhase >= 3) DrawText(ctx, GetText("ChairCuffed4"), 400, 400, "White");
		if (TextPhase >= 4) DrawText(ctx, GetText("ChairCuffed5"), 400, 500, "White");
	}

	if (C101_KinbakuClub_Chloe_PlayingWithPlayer) {
		DrawRect(ctx, 0, 0, 800, 600, "black");
		if (TextPhase >= 0) DrawText(ctx, GetText("ChloeSub1"), 400, 120, "White");
		if (TextPhase >= 1) DrawText(ctx, GetText("ChloeSub2"), 400, 240, "White");
		if (TextPhase >= 2) DrawText(ctx, GetText("ChloeSub3"), 400, 360, "White");
		if (TextPhase >= 3) DrawText(ctx, GetText("ChloeSub4"), 400, 480, "White");
	}
	
	if (C101_KinbakuClub_Chloe_PlayerLeftChairTied) {
		DrawRect(ctx, 0, 0, 800, 600, "black");
		if (TextPhase >= 0) DrawText(ctx, GetText("LeftChair1"), 400, 120, "White");
		if (TextPhase >= 1) DrawText(ctx, GetText("LeftChair2"), 400, 240, "White");
		if (TextPhase >= 2) DrawText(ctx, GetText("LeftChair3"), 400, 360, "White");
		if (TextPhase >= 3) DrawText(ctx, GetText("LeftChair4"), 400, 480, "White");
	}
}

// Chapter 101 - Kinbaku Club  Click
function C101_KinbakuClub_Transition_Click() {

	// Jump to the next animation
	TextPhase++;
	//if (TextPhase >= 4) SetScene(CurrentChapter, "TheBox");
}
