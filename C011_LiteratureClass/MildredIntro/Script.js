var C011_LiteratureClass_MildredIntro_MildredStatus = "";

// Chapter 11 - Mildred Intro Load
function C011_LiteratureClass_MildredIntro_Load() {

	// If no desk is picked, we pick one at random
	if (!C011_LiteratureClass_SelectDesk_FrontDesk && !C011_LiteratureClass_SelectDesk_BackDesk) {
		if (Math.floor(Math.random() * 2) == 1) C011_LiteratureClass_SelectDesk_SelectFront();
		else C011_LiteratureClass_SelectDesk_SelectBack();
	}

	// Stop the time and show the intro, Mildred will have a defiant intro if the player was isolated
	StopTimer(15.666667 * 60 * 60 * 1000);
	if (GameLogQuery("C002_FirstClass", "Mildred", "Subdue") && GameLogQuery("C006_Isolation", "", "Isolation")) C011_LiteratureClass_MildredIntro_MildredStatus = "Defiant";

}

// Chapter 11 - Mildred Intro Run
function C011_LiteratureClass_MildredIntro_Run() {

	// Paints the background
	if (C011_LiteratureClass_SelectDesk_FrontDesk) DrawImage(CurrentChapter + "/" + CurrentScreen + "/BackgroundFront.jpg", 0, 0);
	else DrawImage(CurrentChapter + "/" + CurrentScreen + "/BackgroundBack.jpg", 0, 0);

	// Write the chapter introduction
	DrawText(GetText("Intro" + C011_LiteratureClass_MildredIntro_MildredStatus + "1"), 600, 100, "White");
	if (TextPhase >= 1) DrawText(GetText("Intro" + C011_LiteratureClass_MildredIntro_MildredStatus + "2"), 600, 200, "White");
	if (TextPhase >= 2) DrawText(GetText("Intro" + C011_LiteratureClass_MildredIntro_MildredStatus + "3"), 600, 300, "White");
	if (TextPhase >= 3) DrawText(GetText("Intro" + C011_LiteratureClass_MildredIntro_MildredStatus + "4"), 600, 400, "White");
	if (TextPhase >= 4) DrawText(GetText("Intro" + C011_LiteratureClass_MildredIntro_MildredStatus + "5"), 600, 500, "White");

}

// Chapter 11 - Mildred Intro Click
function C011_LiteratureClass_MildredIntro_Click() {
	TextPhase++;
	if (TextPhase >= 5) SetScene(CurrentChapter, "Mildred");
}