var C999_Common_ClothGag_CurrentStage = 0;

// Chapter Common - ClothGag Load
function C999_Common_ClothGag_Load() {

	// Load the scene parameters
	LeaveIcon = "Leave";
	LoadInteractions();

	// Set the correct stage
    if (PlayerHasLockedInventory("ClothGag") == true) C999_Common_ClothGag_CurrentStage = 10;
    else C999_Common_ClothGag_CurrentStage = 0;

}

// Chapter Common - ClothGag Run, we draw the regular player image if the item is on
function C999_Common_ClothGag_Run() {
    BuildInteraction(C999_Common_ClothGag_CurrentStage);
    if (PlayerHasLockedInventory("ClothGag")) DrawPlayerImage(150, 0);
}

// Chapter Common - ClothGag Click, allow regular interactions and clicking on another item
function C999_Common_ClothGag_Click() {
    ClickInteraction(C999_Common_ClothGag_CurrentStage);
	InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
}

// Chapter Common - Self ClothGag
function C999_Common_ClothGag_SelfGag() {
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
        PlayerRemoveInventory("ClothGag", 1);
        PlayerLockInventory("ClothGag");
	} else {
		OverridenIntroText = GetText("BadTiming");
		C999_Common_ClothGag_CurrentStage = 0;
	}
}

// Chapter Common - Self Ung«g
function C999_Common_ClothGag_SelfUngag() {
    PlayerUnlockInventory("ClothGag");
    PlayerAddInventory("ClothGag", 1);
}