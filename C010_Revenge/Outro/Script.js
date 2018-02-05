var C010_Revenge_Outro_GoodEnding = false;

// Chapter 10 - Outro Load
function C010_Revenge_Outro_Load() {
	
	// Time is always 15:15:00 in the outro, reset the poses if needed
	StopTimer(15.25 * 60 * 60 * 1000);
	if (C010_Revenge_AmandaSarah_ItemStolen) PlayerRestoreAllInventory();
	PlayerReleaseBondage();
	PlayerClothes("Clothed");
	ActorSpecificClearInventory("Amanda", true);
	ActorSpecificClearInventory("Sarah", true);
	ActorSpecificClearInventory("Sidney", true);
	ActorSpecificClearInventory("Jennifer", true);
	ActorSpecificSetPose("Amanda", "");
	ActorSpecificSetPose("Sarah", "");
	ActorSpecificSetPose("Sidney", "");
	ActorSpecificSetPose("Jennifer", "");
	Common_PlayerPose = "";
	Common_PlayerCrime = "";

}

// Chapter 10 - Outro Run
function C010_Revenge_Outro_Run() {
	
	// Paints the background
	var ctx = document.getElementById("MainCanvas").getContext("2d");
	DrawRect(ctx, 0, 0, 800, 600, "black");
	
	// Sets the correct text to fetch
	var OutroText = "";
	if ((Common_PlayerCrime == "AmandaStranded") || (Common_PlayerCrime == "SarahStranded")) OutroText = "AmandaSarah";
	if ((Common_PlayerCrime == "SidneyStranded") || (Common_PlayerCrime == "JenniferStranded")) OutroText = "SidneyJennifer";

	// Draw the background image
	if (TextPhase >= 2) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/Bell.jpg", 800, 0);
    if (TextPhase < 2) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/" + OutroText + ".jpg", 800, 0);
	
	// Shows the text
	if (C010_Revenge_Outro_GoodEnding) OutroText = OutroText + "Good";
	DrawText(ctx, GetText(OutroText + "1"), 400, 150, "White");
	if (TextPhase >= 1) DrawText(ctx, GetText(OutroText + "2"), 400, 250, "White");
	if (TextPhase >= 2) DrawText(ctx, GetText(OutroText + "3"), 400, 350, "White");
	if (TextPhase >= 3) DrawText(ctx, GetText(OutroText + "4"), 400, 450, "White");

}

// Chapter 10 - Outro Click
function C010_Revenge_Outro_Click() {

	// Jump to the next animation
	TextPhase++;
	if (TextPhase >= 3) {
		//Common_PlayerCrime = "";
		//SaveMenu("C011", "Intro");
		SaveMenu("C101_KinbakuClub", "Intro");
	}

}
