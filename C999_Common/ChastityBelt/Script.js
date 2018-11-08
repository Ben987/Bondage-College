var C999_Common_ChastityBelt_CurrentStage = 0;
var C999_Common_ChastityBelt_HasLooseBelt = false;
var C999_Common_ChastityBelt_ConfirmLock = false;

// Chapter Common - Chastity Belt Load
function C999_Common_ChastityBelt_Load() {

	// Load the scene parameters
	LeaveIcon = "Leave";
	LoadInteractions();
	
	// Set the correct stage
	C999_Common_ChastityBelt_ConfirmLock = false;
	C999_Common_ChastityBelt_CurrentStage = 0;
	if (PlayerHasLockedInventory("ChastityBelt")) C999_Common_ChastityBelt_CurrentStage = 10;

	// If the player has a loose belt
	C999_Common_ChastityBelt_HasLooseBelt = PlayerHasInventory("ChastityBelt");
	
}

// Chapter Common - Chastity Belt Run, we draw the regular player image if the item is on
function C999_Common_ChastityBelt_Run() {
	BuildInteraction(C999_Common_ChastityBelt_CurrentStage);
	if (PlayerHasLockedInventory("ChastityBelt") && (OverridenIntroImage == "")) DrawPlayerImage(0, 0);
}

// Chapter Common - Chastity Belt Click, allow regular interactions and clicking on another item
function C999_Common_ChastityBelt_Click() {
	OverridenIntroImage = "";
	ClickInteraction(C999_Common_ChastityBelt_CurrentStage);
	InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
}

// Chapter Common - Chastity Belt Lock (the user needs to confirm he wants to lock)
function C999_Common_ChastityBelt_LockSelf() {
	if ((Common_BondageAllowed) && (Common_SelfBondageAllowed)) {
		if (!C999_Common_ChastityBelt_ConfirmLock) {
			C999_Common_ChastityBelt_ConfirmLock = true;
			OverridenIntroText = GetText("ConfirmLock");
		} else {
			PlayerRemoveInventory("ChastityBelt", 1);
			PlayerLockInventory("ChastityBelt");
			if ((Common_PlayerCostume == "WhiteLingerie") || (Common_PlayerCostume == "RedBikini")) PlayerClothes("Naked");
			C999_Common_ChastityBelt_HasLooseBelt = PlayerHasInventory("ChastityBelt");
			C999_Common_ChastityBelt_CurrentStage = 10;
		}
	} else {
		OverridenIntroText = GetText("BadTiming");
		C999_Common_ChastityBelt_CurrentStage = 0;
	}
}

// Chapter Common - Show the item image
function C999_Common_ChastityBelt_ShowImage() {
	OverridenIntroImage = "Belt.jpg";
}