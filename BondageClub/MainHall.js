// Loads the character login screen
function MainHall_Load() {


}

// Run the main hall screen
function MainHall_Run() {

	// Draw the background and character
	DrawImage("Backgrounds/MainHall.jpg", 0, 0);
	DrawCharacter(Character[0], 750, 0, 1);
	
	// Draws the buttons
	DrawButton(1820, 25, 65, 65, "", "White", "Icons/Dress.png");
	DrawButton(1910, 25, 65, 65, "", "White", "Icons/Exit.png");
	
}

// When the user clicks in the main hall screen
function MainHall_Click() {

	if ((MouseX >= 1820) && (MouseX < 1885) && (MouseY >= 25) && (MouseY < 90)) SetScreen("CharacterAppearance");
	if ((MouseX >= 1910) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 90)) GameInit();

}

function MainHall_KeyDown() {
	
}
