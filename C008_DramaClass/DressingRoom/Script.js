// Chapter 8 - Dressing Room Load
function C008_DramaClass_DressingRoom_Load() {
	LeaveIcon = "Wait";
	Common_SelfBondageAllowed = true;
	Common_BondageAllowed = true;
	GameLogSpecificAdd(CurrentChapter, "", "Role" + C008_DramaClass_JuliaIntro_PlayerRole);
}

// Chapter 8 - Dressing Room Run
function C008_DramaClass_DressingRoom_Run() {

	// Draw the background image 
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	
	// Draw Sarah
	if (!GameLogQuery("C007_LunchBreak", "Sarah", "Stranded")) {
		if (C008_DramaClass_SarahIntro_CurrentStage == 0) DrawImage(CurrentChapter + "/" + CurrentScreen + "/SarahSearch.png", 0, 0);
		else DrawActor("Sarah", 130, 50, 0.575);
	}
	
	// Draw Amanda
	if (!GameLogQuery("C007_LunchBreak", "Amanda", "Stranded")) {
		if (C008_DramaClass_AmandaIntro_CurrentStage == 0) DrawImage(CurrentChapter + "/" + CurrentScreen + "/AmandaSearch.png", 800, 0);
		else DrawActor("Amanda", 800, 50, 0.575);
	} 

}

// Chapter 8 - Dressing Room Click
function C008_DramaClass_DressingRoom_Click() {

	// When the user clicks on any character (screen is divided in 4, 3rd can be the player)
	if ((MouseX >= 0) && (MouseX <= 200) && (MouseY >= 400) && (MouseY <= 600)) SetScene(CurrentChapter, "DressingHiddenItem");
	if ((MouseX >= 200) && (MouseX <= 400) && (MouseY >= 10) && (MouseY <= 590) && !GameLogQuery("C007_LunchBreak", "Sarah", "Stranded")) SetScene(CurrentChapter, "SarahIntro");
	if ((MouseX >= 400) && (MouseX <= 800) && (MouseY >= 10) && (MouseY <= 590)) SetScene(CurrentChapter, "Dressing");
	if ((MouseX >= 880) && (MouseX <= 1100) && (MouseY >= 10) && (MouseY <= 590) && !GameLogQuery("C007_LunchBreak", "Amanda", "Stranded")) SetScene(CurrentChapter, "AmandaIntro");

	// Checks if the user clicks on any regular item
	InventoryClick(GetClickedInventory(), "C008_DramaClass", "DressingRoom");

}