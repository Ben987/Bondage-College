var C101_KinbakuClub_Door_CurrentStage = 0;
var C101_KinbakuClub_Door_NotForce = true;
var C101_KinbakuClub_Door_NotKick = true;
var C101_KinbakuClub_Door_NotWho = true;
var C101_KinbakuClub_Door_NotRestroom = true;
var C101_KinbakuClub_Door_NotPlead = true;


// Chapter 101 - Door Load
function C101_KinbakuClub_Door_Load() {

	// Load the scene parameters
	ActorLoad("Cassi", "ClubRoom1");
	LeaveIcon = "Leave";
	LoadInteractions();

	// Different stage if gagged
	if (PlayerHasLockedInventory("BallGag") || PlayerHasLockedInventory("TapeGag") || PlayerHasLockedInventory("ClothGag")) {
		C101_KinbakuClub_Door_CurrentStage = 20;
	} else C101_KinbakuClub_Door_CurrentStage = 0;
}

// Chapter 101 - Door Run
function C101_KinbakuClub_Door_Run() {
	BuildInteraction(C101_KinbakuClub_Door_CurrentStage);
}

// Chapter 101 - Door Click
function C101_KinbakuClub_Door_Click() {	

	// Regular and inventory interactions
	ClickInteraction(C101_KinbakuClub_Door_CurrentStage);
}

// Chapter 101 - Door Force
function C101_KinbakuClub_Door_Force() {
	C101_KinbakuClub_Door_NotForce = false;
}

// Chapter 101 - Door Kick
function C101_KinbakuClub_Door_Kick() {
	C101_KinbakuClub_Door_NotKick = false;
}

// Chapter 101 - Door Force
function C101_KinbakuClub_Door_Who() {
	C101_KinbakuClub_Door_NotWho = false;
}

// Chapter 101 - Door Force
function C101_KinbakuClub_Door_NeedsRestroom() {
	C101_KinbakuClub_Door_NotRestroom = false;
}

// Chapter 101 - Door Force
function C101_KinbakuClub_Door_Plead() {
	C101_KinbakuClub_Door_NotPlead = false;
}