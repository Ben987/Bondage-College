// Chapter 101 - Club Room 3 Load
function C101_KinbakuClub_ClubRoom3_Load() {
	if (PlayerHasLockedInventory("Blindfold")) SetScene(CurrentChapter, "BlindMansBuff");
	LeaveIcon = "Wait";
}

// Chapter  101 - Club Room 3 Run
function C101_KinbakuClub_ClubRoom3_Run() {

	// Draw the background image 
	var ctx = document.getElementById("MainCanvas").getContext("2d");
	DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/ClubRoom3Arrows.jpg", 0, 0);
	
	// Draw Chloe
	//if (C101_KinbakuClub_Chloe_CurrentStage == 0) {
		DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/ChloeBoard.png", 0, 0);
	//}	else DrawActor("Chloe", 220, 170, 0.3333);
	
	
	// Draw CardGamers
	DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/CardGamers1.jpg", 570, 130);
	
}

// Chapter 101 - Club Room 3 Click
function C101_KinbakuClub_ClubRoom3_Click() {

	// When the user clicks on any character (screen is divided in 4, 3rd can be the player)
	if ((MouseX >= 15) && (MouseX <= 115) && (MouseY >= 520) && (MouseY <= 580)) SetScene(CurrentChapter, "ClubRoom2");
	if ((MouseX >= 1085) && (MouseX <= 1185) && (MouseY >= 520) && (MouseY <= 580)) SetScene(CurrentChapter, "ClubRoom1");
	//if ((MouseX >= 80) && (MouseX <= 260) && (MouseY >= 110) && (MouseY <= 520)) SetScene(CurrentChapter, "Chloe");
	if ((MouseX >= 1040) && (MouseX <= 1200) && (MouseY >= 0) && (MouseY <= 480)) SetScene(CurrentChapter, "Door");

	// Checks if the user clicks on any regular item
	InventoryClick(GetClickedInventory(), "C101_KinbakuClub", "ClubRoom3");

}