var C011_LiteratureClass_Outro_Type = "NoType";

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

}

// Chapter 11 - Outro Run
function C011_LiteratureClass_Outro_Run() {

	// Paints the background
	DrawRect(0, 0, 800, 600, "black");
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Bell.jpg", 800, 0);

	// Shows the text
	DrawText(GetText("Outro1"), 400, 150, "White");
	if (TextPhase >= 1) DrawText(GetText(C011_LiteratureClass_Outro_Type), 400, 250, "White");
	if (TextPhase >= 2) DrawText(GetText("Outro2"), 400, 350, "White");
	if (TextPhase >= 3) DrawText(GetText("Outro3"), 400, 450, "White");

}

// Chapter 11 - Outro Click
function C011_LiteratureClass_Outro_Click() {

	// Jump to the next animation
	TextPhase++;
	if (TextPhase >= 4) SaveMenu("C101_KinbakuClub", "Intro");

}