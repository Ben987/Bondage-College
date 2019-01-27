var C999_Common_ButtPlug_CurrentStage = 0;
var C999_Common_ButtPlug_HasLoosePlug = false;
var C999_Common_ButtPlug_ConfirmInsert = false;

// Chapter Common - Plug Load
function C999_Common_ButtPlug_Load() {

	// Load the scene parameters
	LeaveIcon = "Leave";
	LoadInteractions();
	
	// Set the correct stage
	C999_Common_ButtPlug_ConfirmInsert = false;
	C999_Common_ButtPlug_CurrentStage = 0;
	if (PlayerHasLockedInventory("ButtPlug")) C999_Common_ButtPlug_CurrentStage = 10;
	if ((PlayerHasLockedInventory("ButtPlug")) && Common_PlayerRestrained) C999_Common_ButtPlug_CurrentStage = 20;

	// If the player has a loose Plug
	C999_Common_ButtPlug_HasLoosePlug = PlayerHasInventory("ButtPlug");

}

// Chapter Common - Plug Run, we draw the regular player image if the item is on
function C999_Common_ButtPlug_Run() {
	BuildInteraction(C999_Common_ButtPlug_CurrentStage);
	if (PlayerHasLockedInventory("ButtPlug") && (OverridenIntroImage == "")) DrawPlayerImage(0, 0);
}

// Chapter Common - Plug Click, allow regular interactions and clicking on another item
function C999_Common_ButtPlug_Click() {
	OverridenIntroImage = "";
	ClickInteraction(C999_Common_ButtPlug_CurrentStage);
	InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
}

// Chapter Common - Plug Insert, it doesn't work with a chastity belt and the player must confirm
function C999_Common_ButtPlug_Insert() {
	if (!Common_PlayerChaste) {
		if (!C999_Common_ButtPlug_ConfirmInsert) {
			C999_Common_ButtPlug_ConfirmInsert = true;
			OverridenIntroText = GetText("ConfirmInsert");
		} else {
			PlayerRemoveInventory("ButtPlug", 1);
			PlayerLockInventory("ButtPlug");
			C999_Common_ButtPlug_CurrentStage = 10;
			C999_Common_ButtPlug_HasLoosePlug = PlayerHasInventory("ButtPlug");
		}		
	} else {
		OverridenIntroText = GetText("ChastityBelt");
	}
}

// Chapter Common - Plug removed by hand
function C999_Common_ButtPlug_HandOut() {
	PlayerUnlockInventory("ButtPlug");
	PlayerAddInventory("ButtPlug", 1);
	C999_Common_ButtPlug_CurrentStage = 0;
	C999_Common_ButtPlug_HasLoosePlug = true;
}

// Chapter Common - Show the item image
function C999_Common_ButtPlug_ShowImage() {
	OverridenIntroImage = "Plug.jpg";
}