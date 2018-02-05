var C999_Common_Cuffs_CurrentStage = 0;
var C999_Common_Cuffs_HasLooseCuffs = false;
var C999_Common_Cuffs_HasKey = false;
var C999_Common_Cuffs_CanEscape = false;
var C999_Common_Cuffs_HasShim = false;
var C999_Common_Cuffs_KeyOutOfReach = false;

// Chapter Common - Cuffs Load
function C999_Common_Cuffs_Load() {

	// Load the scene parameters
	LeaveIcon = "Leave";
	C999_Common_Cuffs_HasKey = (PlayerHasInventory("CuffsKey"))
	LoadInteractions();
	
	// Set the correct starting stage
	if (PlayerHasLockedInventory("Cuffs") == true) C999_Common_Cuffs_CurrentStage = 10;
	else C999_Common_Cuffs_CurrentStage = 0;

	// If the key would be out of the players reach then it would be unavailable.
	if (C999_Common_Cuffs_KeyOutOfReach) C999_Common_Cuffs_HasKey = false;

	// If the player has a loose set of cuffs
	C999_Common_Cuffs_HasLooseCuffs = PlayerHasInventory("Cuffs");

}

// Chapter Common - Cuffs Run, we draw the regular player image if the item is on
function C999_Common_Cuffs_Run() {
	BuildInteraction(C999_Common_Cuffs_CurrentStage);
	if (PlayerHasLockedInventory("Cuffs") && (OverridenIntroImage == "")) DrawPlayerImage(150, 240);
}

// Chapter Common - Cuffs Click, allow regular interactions and clicking on another item
function C999_Common_Cuffs_Click() {
	OverridenIntroImage = "";
	ClickInteraction(C999_Common_Cuffs_CurrentStage);
	InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
}

// Chapter Common - Self cuffs
function C999_Common_Cuffs_SelfCuff() {
	if ((Common_BondageAllowed) && (Common_SelfBondageAllowed)) {
		PlayerRemoveInventory("Cuffs", 1);
		PlayerLockInventory("Cuffs");
		C999_Common_Cuffs_HasLooseCuffs = PlayerHasInventory("Cuffs");
	} else {
		OverridenIntroText = GetText("BadTiming");
		C999_Common_Cuffs_CurrentStage = 0;
	}
}

// Chapter Common - Unlock
function C999_Common_Cuffs_Unlock() {
	PlayerAddInventory("Cuffs", 1);
	PlayerUnlockInventory("Cuffs");
}

// Chapter Common - Escape the cuffs using a hair clip
function C999_Common_Cuffs_Escape() {
	if (C999_Common_Cuffs_HasShim) {
		PlayerAddInventory("Cuffs", 1);
		PlayerUnlockInventory("Cuffs");
	} else OverridenIntroText = GetText("NoShim");
}

// Chapter Common - Show the item image
function C999_Common_Cuffs_ShowImage() {
	OverridenIntroImage = "Cuffs.jpg";
}