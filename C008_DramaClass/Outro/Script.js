// Chapter 8 - Outro Load
function C008_DramaClass_Outro_Load() {
	
	// Time is always 14:00:00 in the outro, unlock if needed
	StopTimer(14 * 60 * 60 * 1000);
	PlayerUnlockAllInventory();
	ActorSpecificClearInventory("Amanda", true);
	ActorSpecificClearInventory("Sarah", true);
	ActorSpecificClearInventory("Julia", true);
	PlayerClothes("Clothed");
	ActorSpecificSetCloth("Amanda", "Clothed");
	ActorSpecificSetCloth("Sarah", "Clothed");
	ActorSpecificSetCloth("Julia", "Clothed");
	ActorSpecificSetPose("Amanda", "");
	ActorSpecificSetPose("Sarah", "");
	ActorSpecificSetPose("Julia", "");

}

// Chapter 8 - Outro Run
function C008_DramaClass_Outro_Run() {
	
	// Paints the background
	var ctx = document.getElementById("MainCanvas").getContext("2d");
	DrawRect(ctx, 0, 0, 800, 600, "black");
	
	// If there was a crime that leads to chapter 10
	if ((Common_PlayerCrime == "AmandaStranded") || (Common_PlayerCrime == "SarahStranded") || (Common_PlayerCrime == "SidneyStranded") || (Common_PlayerCrime == "JenniferStranded")) {

		// Draw the outro text to lead to chapter 10
		DrawText(ctx, GetText("Outro1"), 400, 150, "White");
		if (TextPhase >= 1) DrawText(ctx, GetText("Outro2"), 400, 250, "White");
		if ((TextPhase >= 2) && ((Common_PlayerCrime == "AmandaStranded") || (Common_PlayerCrime == "SarahStranded"))) DrawText(ctx, GetText("AmandaSarah3"), 400, 350, "White");
		if ((TextPhase >= 3) && ((Common_PlayerCrime == "AmandaStranded") || (Common_PlayerCrime == "SarahStranded"))) DrawText(ctx, GetText("AmandaSarah4"), 400, 450, "White");
		if ((TextPhase >= 2) && ((Common_PlayerCrime == "SidneyStranded") || (Common_PlayerCrime == "JenniferStranded"))) DrawText(ctx, GetText("SidneyJennifer3"), 400, 350, "White");
		if ((TextPhase >= 3) && ((Common_PlayerCrime == "SidneyStranded") || (Common_PlayerCrime == "JenniferStranded"))) DrawText(ctx, GetText("SidneyJennifer4"), 400, 450, "White");

		// The image changes to show the girls
		if (TextPhase <= 1) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/Bell.jpg", 800, 0);
		if ((TextPhase >= 2) && ((Common_PlayerCrime == "AmandaStranded") || (Common_PlayerCrime == "SarahStranded"))) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/AmandaSarah.jpg", 800, 0);
		if ((TextPhase >= 2) && ((Common_PlayerCrime == "SidneyStranded") || (Common_PlayerCrime == "JenniferStranded"))) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/SidneyJennifer.jpg", 800, 0);
		
	} else {

		// Draw the outro text to lead to chapter 9
		DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/Bell.jpg", 800, 0);
		DrawText(ctx, GetText("Outro1"), 400, 150, "White");
		if (TextPhase >= 1) DrawText(ctx, GetText("Outro2"), 400, 300, "White");
		if (TextPhase >= 2) DrawText(ctx, GetText("Outro3"), 400, 450, "White");

	}

}

// Chapter 8 - Outro Click
function C008_DramaClass_Outro_Click() {

	// Jump to the next animation
	TextPhase++;
	if ((Common_PlayerCrime == "AmandaStranded") || (Common_PlayerCrime == "SarahStranded") || (Common_PlayerCrime == "SidneyStranded") || (Common_PlayerCrime == "JenniferStranded")) {
		if (TextPhase >= 4) SaveMenu("C010_Revenge", "Intro");
	} else {
		//if (TextPhase >= 3) SaveMenu("C009_Library", "Intro");
		if (TextPhase >= 3) SaveMenu("C101_KinbakuClub", "Intro");
	}

}
