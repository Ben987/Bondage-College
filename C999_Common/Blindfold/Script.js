var C999_Common_Blindfold_CurrentStage = 0;

// Chapter Common - Blindfold Load
function C999_Common_Blindfold_Load() {

	// Load the scene parameters
	LeaveIcon = "Leave";
	LoadInteractions();

	// Set the correct stage
    if (PlayerHasLockedInventory("Blindfold") == true) C999_Common_Blindfold_CurrentStage = 10;
    else C999_Common_Blindfold_CurrentStage = 0;

}

// Chapter Common - Blindfold Run, we draw the regular player image if the item is on
function C999_Common_Blindfold_Run() {
    BuildInteraction(C999_Common_Blindfold_CurrentStage);
    if (PlayerHasLockedInventory("Blindfold")) DrawPlayerImage(150, 0);
}

// Chapter Common - Blindfold Click, allow regular interactions and clicking on another item
function C999_Common_Blindfold_Click() {
    ClickInteraction(C999_Common_Blindfold_CurrentStage);
	InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
}

// Chapter Common - Self Blindfold
function C999_Common_Blindfold_SelfBlind() {
	if ((Common_BondageAllowed) && (Common_SelfBondageAllowed) && ((LeaveChapter == "C101_KinbakuClub") || (LeaveScreen == "Natalie"))) {
        PlayerRemoveInventory("Blindfold", 1);
        PlayerLockInventory("Blindfold");
	} else {
		OverridenIntroText = GetText("BadTiming");
		C999_Common_Blindfold_CurrentStage = 0;
	}
}

// Chapter Common - Self UnBlindfold
function C999_Common_Blindfold_SelfUnBlind() {
    PlayerUnlockInventory("Blindfold");
    PlayerAddInventory("Blindfold", 1);
}