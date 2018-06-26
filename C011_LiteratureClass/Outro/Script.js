var C011_LiteratureClass_Outro_Type = "NoType";
var C011_LiteratureClass_Outro_MaxTextPhase = 3;

// Chapter 11 - Outro Load
function C011_LiteratureClass_Outro_Load() {
	
	// Time is always 16:30:00 in the outro, reset the poses if needed
	StopTimer(16.5 * 60 * 60 * 1000);
	PlayerUnlockInventory("Cuffs");
	PlayerUnlockInventory("BallGag");
	PlayerReleaseBondage();
	PlayerClothes("Clothed");
	ActorSpecificClearInventory("Sidney", true);
	ActorSpecificClearInventory("Mildred", true);
	ActorSpecificSetPose("Sidney", "");
	ActorSpecificSetPose("Mildred", "");
	Common_PlayerPose = "";

	// Sets the outro type
	if (GameLogQuery(CurrentChapter, "", "LostVersusSidney")) C011_LiteratureClass_Outro_Type = "LostVersusSidney";
	if (GameLogQuery(CurrentChapter, "", "WonVersusSidney")) C011_LiteratureClass_Outro_Type = "WonVersusSidney";
	if (GameLogQuery(CurrentChapter, "", "LostVersusMildred")) C011_LiteratureClass_Outro_Type = "LostVersusMildred";
	if (GameLogQuery(CurrentChapter, "", "WonVersusMildred")) C011_LiteratureClass_Outro_Type = "WonVersusMildred";
	if (GameLogQuery(CurrentChapter, "", "StrictLeader")) C011_LiteratureClass_Outro_Type = "StrictLeader";
	if (GameLogQuery(CurrentChapter, "", "FairLeader")) C011_LiteratureClass_Outro_Type = "FairLeader";
	if (GameLogQuery(CurrentChapter, "", "EasyLeader")) C011_LiteratureClass_Outro_Type = "EasyLeader";
	
	// A special outro type can occur where the player gets invited to the bondage club if at least 10 girls were tied up during the day
	if (ActorGetTotalBondageCount() >= 10) {
		C011_LiteratureClass_Outro_Type = "BondageClub";
		GameLogSpecificAdd(CurrentChapter, "", "BondageClubInvitation");
		C011_LiteratureClass_Outro_MaxTextPhase = 5;
	}

}

// Chapter 11 - Outro Run
function C011_LiteratureClass_Outro_Run() {

	// Paints the background
	DrawRect(0, 0, 800, 600, "black");

	// Outro is different depending if the player was invited or not
	if (C011_LiteratureClass_Outro_Type == "BondageClub") {

		// Draws the bondage club image
		if (TextPhase == 0) DrawImage(CurrentChapter + "/" + CurrentScreen + "/Bell.jpg", 800, 0);
		if ((TextPhase == 1) || (TextPhase == 2)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/InvitationClose.jpg", 800, 0);
		if ((TextPhase == 3) || (TextPhase == 4)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/InvitationOpen.jpg", 800, 0);

		// Shows the bondage club outro text
		DrawText(GetText("OutroClub1"), 400, 100, "White");
		if (TextPhase >= 1) DrawText(GetText("OutroClub2"), 400, 200, "White");
		if (TextPhase >= 2) DrawText(GetText("OutroClub3"), 400, 300, "White");
		if (TextPhase >= 3) DrawText(GetText("OutroClub4"), 400, 400, "White");
		if (TextPhase >= 4) DrawText(GetText("OutroClub5"), 400, 500, "White");
	
	} else {

		// Shows the regular outro text
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/Bell.jpg", 800, 0);
		DrawText(GetText("Outro1"), 400, 150, "White");
		if (TextPhase >= 1) DrawText(GetText(C011_LiteratureClass_Outro_Type), 400, 300, "White");
		if (TextPhase >= 2) DrawText(GetText("Outro2"), 400, 450, "White");
	
	}
	

}

// Chapter 11 - Outro Click
function C011_LiteratureClass_Outro_Click() {

	// Jump to the next animation
	TextPhase++;
	if (TextPhase >= C011_LiteratureClass_Outro_MaxTextPhase) SaveMenu("C012_AfterClass", "Intro");

}