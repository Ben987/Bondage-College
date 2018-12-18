// Chapter 101 - Kinbaku Club Load
function C101_KinbakuClub_Transition_Load() {
	
	// Time is always 18:00:00 in the outro
	if (CurrentTime >= 18 * 60 * 60 * 1000) CurrentTime = 18 * 60 * 60 * 1000;
	StopTimer(CurrentTime);
}

// Chapter 101 - Kinbaku Club Run
function C101_KinbakuClub_Transition_Run() {

	// Paints the background	
	DrawRect(0, 0, 800, 600, "black");
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Jenna.jpg", 800, 0);

	// Dialog depending on the outro situation
	if (TextPhase >= 0) DrawText(GetText("PlayerFree1"), 400, 100, "White");
	if (TextPhase >= 1) DrawText(GetText("PlayerFree2"), 400, 200, "White");
	if (TextPhase >= 2) DrawText(GetText("PlayerFree3"), 400, 300, "White");
	if (TextPhase >= 3) DrawText(GetText("PlayerFree4"), 400, 400, "White");
	if (TextPhase >= 4) DrawText(GetText("PlayerFree5"), 400, 500, "White");

	if (C101_KinbakuClub_Erica_PlayerIsSlave) {
		DrawRect(0, 0, 800, 600, "black");
		if (TextPhase >= 0) DrawText(GetText("Enslaved1"), 400, 100, "White");
		if (TextPhase >= 1) DrawText(GetText("Enslaved2"), 400, 200, "White");
		if (TextPhase >= 2) {
			DrawText(GetText("Enslaved3"), 400, 300, "White");
			PlayerUnlockInventory("Collar")
		}
		if (TextPhase >= 3) DrawText(GetText("Enslaved4"), 400, 400, "White");
		if (TextPhase >= 4) DrawText(GetText("Enslaved5"), 400, 500, "White");
	}
	
	if (C101_KinbakuClub_Lauren_PlayerChairCuffed || C101_KinbakuClub_Lauren_PlayerStrappado) {
		DrawRect(0, 0, 800, 600, "black");
		if (TextPhase >= 0) DrawText(GetText("ChairCuffed1"), 400, 100, "White");
		if (TextPhase >= 1) DrawText(GetText("ChairCuffed2"), 400, 200, "White");
		if (TextPhase >= 2) {
			if (C101_KinbakuClub_Lauren_PlayerChairCuffed) DrawText(GetText("ChairCuffed3"), 400, 300, "White");
			if (C101_KinbakuClub_Lauren_PlayerStrappado) {
				if (!C101_KinbakuClub_Lauren_PlayerLegCuffs) DrawText(GetText("LaurenCuffedStrppado"), 400, 300, "White");
				if (C101_KinbakuClub_Lauren_PlayerLegCuffs) {
					DrawText(GetText("LaurenCuffedStrppadoLegs"), 400, 300, "White");
					PlayerUnlockInventory("Collar");
				}
			}
		}
		if (TextPhase >= 3) DrawText(GetText("ChairCuffed4"), 400, 400, "White");
		if (TextPhase >= 4) DrawText(GetText("ChairCuffed5"), 400, 500, "White");
	}

	if (PlayerHasLockedInventory("Manacles")) {
		DrawRect(0, 0, 800, 600, "black");
		if (TextPhase >= 0) DrawText(GetText("Manacles1"), 400, 100, "White");
		if (TextPhase >= 1) DrawText(GetText("Manacles2"), 400, 200, "White");
		if (TextPhase >= 2) DrawText(GetText("Manacles3"), 400, 300, "White");
		if (TextPhase >= 3) DrawText(GetText("Manacles4"), 400, 400, "White");
		if (TextPhase >= 4) DrawText(GetText("Manacles5"), 400, 500, "White");
	}

	//if (C101_KinbakuClub_Chloe_PlayingWithPlayer) {
	//	DrawRect(0, 0, 800, 600, "black");
	//	if (TextPhase >= 0) DrawText(GetText("ChloeSub1"), 400, 120, "White");
	//	if (TextPhase >= 1) DrawText(GetText("ChloeSub2"), 400, 240, "White");
	//	if (TextPhase >= 2) DrawText(GetText("ChloeSub3"), 400, 360, "White");
	//	if (TextPhase >= 3) DrawText(GetText("ChloeSub4"), 400, 480, "White");
	//}
	
	//if (C101_KinbakuClub_Chloe_PlayerLeftChairTied) {
	//	DrawRect(0, 0, 800, 600, "black");
	//	if (TextPhase >= 0) DrawText(GetText("LeftChair1"), 400, 120, "White");
	//	if (TextPhase >= 1) DrawText(GetText("LeftChair2"), 400, 240, "White");
	//	if (TextPhase >= 2) DrawText(GetText("LeftChair3"), 400, 360, "White");
	//	if (TextPhase >= 3) DrawText(GetText("LeftChair4"), 400, 480, "White");
	//}
}

// Chapter 101 - Kinbaku Club  Click
function C101_KinbakuClub_Transition_Click() {

	// Jump to the next animation
	TextPhase++;
	if (TextPhase >= 5) {
		//SetScene(CurrentChapter, "TheBox");
		SetScene("C012_AfterClass", "Dorm");
	}
}
