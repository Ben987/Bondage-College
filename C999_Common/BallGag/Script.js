var C999_Common_BallGag_CurrentStage = 0;
var C999_Common_BallGag_HasLooseBallGag = false;

// Chapter Common - BallGag Load
function C999_Common_BallGag_Load() {

	// Load the scene parameters
	LeaveIcon = "Leave";
	LoadInteractions();

	// Set the correct stage
	if (PlayerHasLockedInventory("BallGag")) C999_Common_BallGag_CurrentStage = 10;
	else C999_Common_BallGag_CurrentStage = 0;

	// If the player has a loose BallGag
	C999_Common_BallGag_HasLooseBallGag = PlayerHasInventory("BallGag");

}

// Chapter Common - BallGag Run, we draw the regular player image if the item is on
function C999_Common_BallGag_Run() {
	BuildInteraction(C999_Common_BallGag_CurrentStage);
	if (PlayerHasLockedInventory("BallGag") && (OverridenIntroImage == "")) DrawPlayerImage(150, 0);
}

// Chapter Common - BallGag Click, allow regular interactions and clicking on another item
function C999_Common_BallGag_Click() {
	OverridenIntroImage = "";
	ClickInteraction(C999_Common_BallGag_CurrentStage);
	InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
}

// Chapter Common - Self BallGag
function C999_Common_BallGag_SelfGag() {
	if ((Common_BondageAllowed) && (Common_SelfBondageAllowed)) {
		if (PlayerHasLockedInventory("PantieGag") || PlayerHasLockedInventory("SockGag")) {
			if (PlayerHasLockedInventory("PantieGag")) {
				PlayerUngag();
				PlayerLockInventory("PantieGag");
				PlayerRemoveInventory("PantieGag", 1);
			}
			if (PlayerHasLockedInventory("SockGag")) {
				PlayerUngag();
				PlayerLockInventory("SockGag");
				PlayerRemoveInventory("SockGag", 1);
			}
		} else PlayerUngag();
		PlayerRemoveInventory("BallGag", 1);
		PlayerLockInventory("BallGag");
		C999_Common_BallGag_HasLooseBallGag = PlayerHasInventory("BallGag");
	} else {
		OverridenIntroText = GetText("BadTiming");
		C999_Common_BallGag_CurrentStage = 0;
	}
}

// Chapter Common - Self Ungag
function C999_Common_BallGag_SelfUngag() {
	PlayerUnlockInventory("BallGag");
	PlayerAddInventory("BallGag", 1);
}

// Chapter Common - Show the item image
function C999_Common_BallGag_ShowImage() {
	OverridenIntroImage = "BallGag.jpg";
}