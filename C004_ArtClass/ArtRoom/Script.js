var C004_ArtClass_ArtRoom_Jennifer = "";
var C004_ArtClass_ArtRoom_Julia = "";
var C004_ArtClass_ArtRoom_Sarah = "";
var C004_ArtClass_ArtRoom_ExtraModel = "";
var C004_ArtClass_ArtRoom_ExtraModelImage = "";
var C004_ArtClass_ArtRoom_JuliaStage = 0;
var C004_ArtClass_ArtRoom_JenniferStage = 0;
var C004_ArtClass_ArtRoom_SarahStage = 0;

// Chapter 4 - ArtRoom Load
function C004_ArtClass_ArtRoom_Load() {
	
	// Get the image file for each girls
	LeaveIcon = "Wait";
	C004_ArtClass_ArtRoom_Jennifer = "Jennifer";
	C004_ArtClass_ArtRoom_Julia = "Julia_" + C004_ArtClass_ArtRoom_JuliaStage.toString();
	C004_ArtClass_ArtRoom_Sarah = "Sarah";

	// Define Julia picture
	if ((C004_ArtClass_ArtRoom_ExtraModel == "") && (C004_ArtClass_ArtRoom_JuliaStage <= 1)) C004_ArtClass_ArtRoom_Julia = "Julia_DoublePose";
	if ((C004_ArtClass_ArtRoom_ExtraModel == "") && (C004_ArtClass_ArtRoom_JuliaStage == 2)) C004_ArtClass_ArtRoom_Julia = "Julia_DoublePoseNoTop";
	if ((C004_ArtClass_ArtRoom_ExtraModel == "") && (C004_ArtClass_ArtRoom_JuliaStage >= 3)) C004_ArtClass_ArtRoom_Julia = "Julia_DoublePoseNaked";
	
	// Define the extra model picture
	if (C004_ArtClass_ArtRoom_ExtraModel == "Sarah") C004_ArtClass_ArtRoom_Sarah = "Sarah_Empty";
	if (C004_ArtClass_ArtRoom_ExtraModel == "Jennifer") C004_ArtClass_ArtRoom_Jennifer = "Jennifer_Empty";
	C004_ArtClass_ArtRoom_ExtraModelImage = C004_ArtClass_ArtRoom_ExtraModel;
	if ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && (Common_PlayerUnderwear)) C004_ArtClass_ArtRoom_ExtraModelImage = "Player_Underwear";
	if ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && (Common_PlayerNaked)) C004_ArtClass_ArtRoom_ExtraModelImage = "Player_Naked";
	if ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && (PlayerHasLockedInventory("Rope"))) C004_ArtClass_ArtRoom_ExtraModelImage = "Player_Rope";
	if ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && (PlayerHasLockedInventory("Rope")) && (PlayerHasLockedInventory("BallGag"))) C004_ArtClass_ArtRoom_ExtraModelImage = "Player_Rope_BallGag";
	if ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && (PlayerHasLockedInventory("Rope")) && (PlayerHasLockedInventory("TapeGag"))) C004_ArtClass_ArtRoom_ExtraModelImage = "Player_Rope_TapeGag";
	if (C004_ArtClass_ArtRoom_ExtraModel == "Jennifer") C004_ArtClass_ArtRoom_ExtraModelImage = C004_ArtClass_ArtRoom_ExtraModelImage + "_" + C004_ArtClass_ArtRoom_JenniferStage.toString();
	if (C004_ArtClass_ArtRoom_ExtraModel == "Sarah") C004_ArtClass_ArtRoom_ExtraModelImage = C004_ArtClass_ArtRoom_ExtraModelImage + "_" + C004_ArtClass_ArtRoom_SarahStage.toString();

}

// Chapter 4 - ArtRoom Run
function C004_ArtClass_ArtRoom_Run() {

	// Draw the background image and the wait button on the bottom right of the image
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/" + C004_ArtClass_ArtRoom_Jennifer + ".jpg", 0, 0);
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/" + C004_ArtClass_ArtRoom_Julia + ".jpg", 300, 0);
	if (C004_ArtClass_ArtRoom_ExtraModel != "") DrawImage(CurrentChapter + "/" + CurrentScreen + "/" + C004_ArtClass_ArtRoom_ExtraModelImage + "_Extra.jpg", 600, 0);
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/" + C004_ArtClass_ArtRoom_Sarah + ".jpg", 900, 0);
	
}

// Chapter 4 - ArtRoom Click
function C004_ArtClass_ArtRoom_Click() {

	// When the user clicks on any character (screen is divided in 4, 3rd can be the player)
	if ((MouseX >= 30) && (MouseX <= 270) && (MouseY >= 10) && (MouseY <= 590) && (C004_ArtClass_ArtRoom_ExtraModel != "Jennifer")) SetScene(CurrentChapter, "Jennifer");
	if ((MouseX >= 350) && (MouseX <= 850) && (MouseY >= 10) && (MouseY <= 590) && (C004_ArtClass_ArtRoom_ExtraModel == "")) SetScene(CurrentChapter, "Julia");
	if ((MouseX >= 330) && (MouseX <= 570) && (MouseY >= 10) && (MouseY <= 590) && (C004_ArtClass_ArtRoom_ExtraModel != "")) SetScene(CurrentChapter, "Julia");
	if ((MouseX >= 630) && (MouseX <= 850) && (MouseY >= 10) && (MouseY <= 590) && (C004_ArtClass_ArtRoom_ExtraModel == "Sarah")) SetScene(CurrentChapter, "Sarah");
	if ((MouseX >= 630) && (MouseX <= 850) && (MouseY >= 10) && (MouseY <= 590) && (C004_ArtClass_ArtRoom_ExtraModel == "Jennifer")) SetScene(CurrentChapter, "Jennifer");
	if ((MouseX >= 630) && (MouseX <= 850) && (MouseY >= 10) && (MouseY <= 590) && (C004_ArtClass_ArtRoom_ExtraModel == "Player")) InventoryClick("Player", CurrentChapter, "ArtRoom");
	if ((MouseX >= 930) && (MouseX <= 1170) && (MouseY >= 10) && (MouseY <= 590) && (C004_ArtClass_ArtRoom_ExtraModel != "Sarah")) SetScene(CurrentChapter, "Sarah");
	if ((MouseX >= 850) && (MouseX <= 930) && (MouseY >= 260) && (MouseY <= 360)) SetScene(CurrentChapter, "HiddenEgg");

	// Checks if the user clicks on any regular item, no inventory is allowed if the player is modeling
	InventoryClick(GetClickedInventory(), "C004_ArtClass", "ArtRoom");

}