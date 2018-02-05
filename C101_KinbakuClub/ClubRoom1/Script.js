// Chapter 101 - Club Room 1 Load
function C101_KinbakuClub_ClubRoom1_Load() {
	if (PlayerHasLockedInventory("Blindfold")) SetScene(CurrentChapter, "BlindMansBuff");
	LeaveIcon = "Wait";
}

// Chapter  101 - Club Room 1 Run
function C101_KinbakuClub_ClubRoom1_Run() {

	// Draw the background image 
	var ctx = document.getElementById("MainCanvas").getContext("2d");
	DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/ClubRoom1Arrows.jpg", 0, 0);
	
	// Draw Lauren
	if (!C101_KinbakuClub_Lauren_LaurenChairCuffed) {
		DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/LaurenStart.png", 230, 155);
		if (C101_KinbakuClub_Lauren_BlindfoldAvailable && C101_KinbakuClub_Lauren_CurrentStage <= 220) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/LaurenStartBlindfold.png", 420, 305);
		if (C101_KinbakuClub_Lauren_CurrentStage < 150) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/LaurenStartCuffs.png", 450, 325);
	}
	if (C101_KinbakuClub_Lauren_LaurenChairCuffed) {
		DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/LaurenChair.jpg", 230, 150);
		if (C101_KinbakuClub_Lauren_LaurenBallGagged) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/LaurenChairBallGag.jpg", 570, 190);
		if (C101_KinbakuClub_Lauren_LaurenTapeGagged) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/LaurenChairTapeGag.jpg", 570, 190);
		if (C101_KinbakuClub_Lauren_LaurenClothGagged) DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/LaurenChairClothGag.jpg", 570, 190);
	}

	//Draw Rope Discussion
	DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/RopeDiscussion1.jpg", 690, 100);
}

// Chapter 101 - Club Room 1 Click
function C101_KinbakuClub_ClubRoom1_Click() {

	// When the user clicks on any character (screen is divided in 4, 3rd can be the player)
	if ((MouseX >= 15) && (MouseX <= 115) && (MouseY >= 520) && (MouseY <= 580)) SetScene(CurrentChapter, "ClubRoom3");
	if ((MouseX >= 1085) && (MouseX <= 1185) && (MouseY >= 520) && (MouseY <= 580)) SetScene(CurrentChapter, "ClubRoom2");
	if ((MouseX >= 0) && (MouseX <= 215) && (MouseY >= 45) && (MouseY <= 350)) SetScene(CurrentChapter, "Door");
	if ((MouseX >= 235) && (MouseX <= 650) && (MouseY >= 140) && (MouseY <= 510)) SetScene(CurrentChapter, "Lauren");

	// Checks if the user clicks on any regular item
	InventoryClick(GetClickedInventory(), "C101_KinbakuClub", "ClubRoom1");

}