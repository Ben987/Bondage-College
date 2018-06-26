var C101_KinbakuClub_Door_CurrentStage = 0;
var C101_KinbakuClub_Door_NotForce = true;
var C101_KinbakuClub_Door_NotKick = true;
var C101_KinbakuClub_Door_NotWho = true;
var C101_KinbakuClub_Door_NotRestroom = true;
var C101_KinbakuClub_Door_NotPlead = true;


// Chapter 101 - Door Load
function C101_KinbakuClub_Door_Load() {

	// Load the scene parameters
	LeaveScreen = "ClubRoom1";
	LeaveIcon = "Leave";
	LoadInteractions();
}

// Chapter 101 - Door Run
function C101_KinbakuClub_Door_Run() {
	BuildInteraction(C101_KinbakuClub_Door_CurrentStage);
}

// Chapter 101 - Door Click
function C101_KinbakuClub_Door_Click() {	

	// Regular and inventory interactions
	ClickInteraction(C101_KinbakuClub_Door_CurrentStage);

	// Checks if the user clicks on any regular item
	InventoryClick(GetClickedInventory(), "C101_KinbakuClub", "Door");
}

// Chapter 101 - Door - Leave the club
function C101_KinbakuClub_Door_LeaveClub() {
	CurrentTime = CurrentTime + 290000;
	SetScene("C012_AfterClass", "Dorm");
}