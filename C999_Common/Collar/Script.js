var C999_Common_Collar_CurrentStage = 0;
var C999_Common_Collar_HasLooseCollar = false;
var C999_Common_Collar_LockedOn = false; // If locked on, then collar can only be removed by the key holder.

// Chapter Common - Collar Load
function C999_Common_Collar_Load() {

	// Load the scene parameters
	LeaveIcon = "Leave";
	LoadInteractions();

	// Set the correct stage
	if (PlayerHasLockedInventory("Collar") == true) C999_Common_Collar_CurrentStage = 10;
	else C999_Common_Collar_CurrentStage = 0;

	// If the player has a loose collar
	C999_Common_Collar_HasLooseCollar = PlayerHasInventory("Collar");

}

// Chapter Common - Collar Run, we draw the regular player image if the item is on
function C999_Common_Collar_Run() {
	BuildInteraction(C999_Common_Collar_CurrentStage);
	if (PlayerHasLockedInventory("Collar") && (OverridenIntroImage == "")) DrawPlayerImage(150, 50);
}

// Chapter Common - Collar Click, allow regular interactions and clicking on another item
function C999_Common_Collar_Click() {
	OverridenIntroImage = "";
	ClickInteraction(C999_Common_Collar_CurrentStage);
	InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
}

// Chapter Common - Self Collar
function C999_Common_Collar_SelfCollar() {
	if ((Common_BondageAllowed) && (Common_SelfBondageAllowed)) {
		PlayerRemoveInventory("Collar", 1);
		PlayerLockInventory("Collar");
		C999_Common_Collar_HasLooseCollar = PlayerHasInventory("Collar");
	} else {
		OverridenIntroText = GetText("BadTiming");
		C999_Common_Collar_CurrentStage = 0;
	}
}

// Chapter Common - Self Uncollar
function C999_Common_Collar_SelfUncollar() {
	if ((C999_Common_Collar_LockedOn) || (Common_PlayerOwner != "")) {
		OverridenIntroText = GetText("LockedCollar");
		C999_Common_Collar_CurrentStage = 10;
	}
	else {
		PlayerUnlockInventory("Collar");
		PlayerAddInventory("Collar", 1);
	}
}

// Chapter Common - Show the item image
function C999_Common_Collar_ShowImage() {
	OverridenIntroImage = "Collar.jpg";
}