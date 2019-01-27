var C999_Common_PantieGag_CurrentStage = 0;
var C999_Common_PantieGag_HasLoosePantieGag = false;
var C999_Common_PantieGag_HasOtherGag = false;

// Chapter Common - PantieGag Load
function C999_Common_PantieGag_Load() {

	// Load the scene parameters
	LeaveIcon = "Leave";
	LoadInteractions();

	// Set the correct stage
	if (PlayerHasLockedInventory("PantieGag")) C999_Common_PantieGag_CurrentStage = 10;
	else C999_Common_PantieGag_CurrentStage = 0;

	// If the player has a loose PantieGag
	C999_Common_PantieGag_HasLoosePantieGag = PlayerHasInventory("PantieGag");

	// If the player has another gag
	C999_Common_PantieGag_HasOtherGag = PlayerHasLockedInventory("BallGag") || PlayerHasLockedInventory("ClothGag") || PlayerHasLockedInventory("TapeGag");

}

// Chapter Common - PantieGag Run, we draw the regular player image if the item is on
function C999_Common_PantieGag_Run() {
	BuildInteraction(C999_Common_PantieGag_CurrentStage);
	if (PlayerHasLockedInventory("PantieGag") && (OverridenIntroImage == "")) DrawPlayerImage(150, 0);
}

// Chapter Common - PantieGag Click, allow regular interactions and clicking on another item
function C999_Common_PantieGag_Click() {
	OverridenIntroImage = "";
	ClickInteraction(C999_Common_PantieGag_CurrentStage);
	InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
}

// Chapter Common - Self PantieGag
function C999_Common_PantieGag_SelfGag() {
	if ((Common_BondageAllowed) && (Common_SelfBondageAllowed)) {
		if (C999_Common_PantieGag_HasOtherGag) {
			OverridenIntroText = GetText("OtherGag");
			C999_Common_PantieGag_CurrentStage = 0;
		} else {
			PlayerUngag();
			PlayerRemoveInventory("PantieGag", 1);
			PlayerLockInventory("PantieGag");
			C999_Common_PantieGag_HasLoosePantieGag = PlayerHasInventory("PantieGag");
		}
	} else {
		OverridenIntroText = GetText("BadTiming");
		C999_Common_PantieGag_CurrentStage = 0;
	}
}

// Chapter Common - Self Ungag
function C999_Common_PantieGag_SelfUngag() {
	PlayerUnlockInventory("PantieGag");
	PlayerAddInventory("PantieGag", 1);
}

// Chapter Common - Show the item image
function C999_Common_PantieGag_ShowImage() {
	OverridenIntroImage = "PantieGag.jpg";
}