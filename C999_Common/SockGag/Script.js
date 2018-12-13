var C999_Common_SockGag_CurrentStage = 0;
var C999_Common_SockGag_HasLooseSockGag = false;
var C999_Common_SockGag_HasOtherGag = false;

// Chapter Common - SockGag Load
function C999_Common_SockGag_Load() {

	// Load the scene parameters
	LeaveIcon = "Leave";
	LoadInteractions();

	// Set the correct stage
	if (PlayerHasLockedInventory("SockGag")) C999_Common_SockGag_CurrentStage = 10;
	else C999_Common_SockGag_CurrentStage = 0;

	// If the player has a loose SockGag
	C999_Common_SockGag_HasLooseSockGag = PlayerHasInventory("SockGag");

	// If the player has another gag
	C999_Common_SockGag_HasOtherGag = PlayerHasLockedInventory("BallGag") || PlayerHasLockedInventory("ClothGag") || PlayerHasLockedInventory("TapeGag");

}

// Chapter Common - SockGag Run, we draw the regular player image if the item is on
function C999_Common_SockGag_Run() {
	BuildInteraction(C999_Common_SockGag_CurrentStage);
	if (PlayerHasLockedInventory("SockGag") && (OverridenIntroImage == "")) DrawPlayerImage(150, 0);
}

// Chapter Common - SockGag Click, allow regular interactions and clicking on another item
function C999_Common_SockGag_Click() {
	OverridenIntroImage = "";
	ClickInteraction(C999_Common_SockGag_CurrentStage);
	InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
}

// Chapter Common - Self SockGag
function C999_Common_SockGag_SelfGag() {
	if ((Common_BondageAllowed) && (Common_SelfBondageAllowed)) {
		if (C999_Common_SockGag_HasOtherGag) {
			OverridenIntroText = GetText("OtherGag");
			C999_Common_SockGag_CurrentStage = 0;
		} else {
			PlayerUngag();
			PlayerRemoveInventory("SockGag", 1);
			PlayerLockInventory("SockGag");
			C999_Common_SockGag_HasLooseSockGag = PlayerHasInventory("SockGag");
		}
	} else {
		OverridenIntroText = GetText("BadTiming");
		C999_Common_SockGag_CurrentStage = 0;
	}
}

// Chapter Common - Self Ungag
function C999_Common_SockGag_SelfUngag() {
	PlayerUnlockInventory("SockGag");
	PlayerAddInventory("SockGag", 1);
}

// Chapter Common - Show the item image
function C999_Common_SockGag_ShowImage() {
	OverridenIntroImage = "SockGag.jpg";
}