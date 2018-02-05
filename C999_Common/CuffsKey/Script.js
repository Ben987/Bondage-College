var C999_Common_CuffsKey_CurrentStage = 0;
var C999_Common_CuffsKey_IsCuffed = false;

// Chapter Common - CuffsKey Load
function C999_Common_CuffsKey_Load() {
	LeaveIcon = "Leave";
	C999_Common_CuffsKey_IsCuffed = (PlayerHasLockedInventory("Cuffs"))
	LoadInteractions();

	// if the key would be out of the players reach
	if (C999_Common_Cuffs_KeyOutOfReach) C999_Common_CuffsKey_IsCuffed = false;
}

// Chapter Common - CuffsKey Run
function C999_Common_CuffsKey_Run() {
	BuildInteraction(C999_Common_CuffsKey_CurrentStage);
}

// Chapter Common - CuffsKey Click, allow regular interactions and clicking on another item
function C999_Common_CuffsKey_Click() {
	ClickInteraction(C999_Common_CuffsKey_CurrentStage);
	InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
}

// Chapter Common - CuffsKey Unlock
function C999_Common_CuffsKey_Unlock() {
	PlayerAddInventory("Cuffs", 1);
	PlayerUnlockInventory("Cuffs");
	C999_Common_CuffsKey_IsCuffed = false;
}