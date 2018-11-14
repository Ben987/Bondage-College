// Chapter 101 - Club Room 1 Load
function C101_KinbakuClub_ClubRoom1_Load() {
	if (PlayerHasLockedInventory("Blindfold")) SetScene(CurrentChapter, "BlindMansBuff");
	LeaveIcon = "Wait";
}

// Chapter  101 - Club Room 1 Run
function C101_KinbakuClub_ClubRoom1_Run() {

	// Draw the background image 
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/ClubRoom1Arrows.jpg", 0, 0);
	
	// Draw Lauren
	if (!C101_KinbakuClub_Lauren_LaurenChairCuffed) {
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenStart.png", 230, 155);
		if (C101_KinbakuClub_Lauren_BlindfoldAvailable && C101_KinbakuClub_Lauren_CurrentStage <= 220) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenStartBlindfold.png", 420, 305);
		if (C101_KinbakuClub_Lauren_CurrentStage < 150) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenStartCuffs.png", 450, 325);
	}
	if (C101_KinbakuClub_Lauren_LaurenChairCuffed) {
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenChair.jpg", 230, 150);
		if (C101_KinbakuClub_Lauren_LaurenBallGagged) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenChairBallGag.jpg", 570, 190);
		if (C101_KinbakuClub_Lauren_LaurenTapeGagged) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenChairTapeGag.jpg", 570, 190);
		if (C101_KinbakuClub_Lauren_LaurenClothGagged) DrawImage(CurrentChapter + "/" + CurrentScreen + "/LaurenChairClothGag.jpg", 570, 190);
	}

	// Draw Rope Group
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Amelia.png", 690, 120);
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Charlotte.png", 883, 103);
	if (C101_KinbakuClub_RopeGroup_LeftTwinStatus == "StartTied")  DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinLeftStart.png", 945, 160);
	if (C101_KinbakuClub_RopeGroup_LeftTwinStatus == "Released" || C101_KinbakuClub_RopeGroup_RightTwinStatus == "Released") DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinReleased.png", 925, 68);
	if (C101_KinbakuClub_RopeGroup_RightTwinStatus == "StartTied") DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinRightStart.png", 800, 155);

	// Draw Save function
	if ((MouseX >= 550) && (MouseX < 650) && (MouseY >= 500) && (MouseY <= 600)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/Save_Active.png", 550, 500);
	else DrawImage(CurrentChapter + "/" + CurrentScreen + "/Save_Inactive.png", 550, 500);

}

// Chapter 101 - Club Room 1 Click
function C101_KinbakuClub_ClubRoom1_Click() {

	// When the user clicks on any character (screen is divided in 4, 3rd can be the player)
	if ((MouseX >= 15) && (MouseX <= 115) && (MouseY >= 520) && (MouseY <= 580)) SetScene(CurrentChapter, "ClubRoom3");
	if ((MouseX >= 1085) && (MouseX <= 1185) && (MouseY >= 520) && (MouseY <= 580)) SetScene(CurrentChapter, "ClubRoom2");
	if ((MouseX >= 0) && (MouseX <= 215) && (MouseY >= 45) && (MouseY <= 350)) SetScene(CurrentChapter, "Door");
	if ((MouseX >= 235) && (MouseX <= 650) && (MouseY >= 140) && (MouseY <= 499)) SetScene(CurrentChapter, "Lauren");
	if ((MouseX >= 690) && (MouseX <= 1190) && (MouseY >= 100) && (MouseY <= 520)) SetScene(CurrentChapter, "RopeGroup");
	if ((MouseX >= 550) && (MouseX < 650) && (MouseY >= 500) && (MouseY <= 600)) SaveMenu(CurrentChapter, "ClubRoom1");

	// Checks if the user clicks on any regular item
	InventoryClick(GetClickedInventory(), "C101_KinbakuClub", "ClubRoom1");

}
