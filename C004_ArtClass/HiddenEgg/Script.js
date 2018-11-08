var C004_ArtClass_HiddenEgg_CurrentStage = 0;

// Chapter 4 - Hidden Egg Load
function C004_ArtClass_HiddenEgg_Load() {
	LeaveIcon = "Leave";
	LeaveScreen = "ArtRoom";
	LoadInteractions();		
}

// Chapter 4 - Hidden Egg Run
function C004_ArtClass_HiddenEgg_Run() {
	BuildInteraction(C004_ArtClass_HiddenEgg_CurrentStage);
}

// Chapter 4 - Bag Click
function C004_ArtClass_HiddenEgg_Click() {
	ClickInteraction(C004_ArtClass_HiddenEgg_CurrentStage);
}

// Chapter 4 - Bag Take Egg
function C004_ArtClass_HiddenEgg_TakeEgg() {	
	PlayerAddInventory("VibratingEgg", 1);
	AchievementUnlock("HappyEaster");
}