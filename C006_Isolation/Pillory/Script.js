var C006_Isolation_Pillory_CurrentStage = 0;

// Chapter 6 - Pillory Load
function C006_Isolation_Pillory_Load() {
	LeaveIcon = "Leave";
	LeaveScreen = "IsolationRoom";
	LoadInteractions();
}

// Chapter 6 - Pillory Run
function C006_Isolation_Pillory_Run() {
	BuildInteraction(C006_Isolation_Pillory_CurrentStage);
}

// Chapter 6 - Pillory Click
function C006_Isolation_Pillory_Click() {	
	ClickInteraction(C006_Isolation_Pillory_CurrentStage);
}

// Chapter 6 - Pillory Trap - The player is stuck on that scene until 11:30
function C006_Isolation_Pillory_Trap() {
	LeaveIcon = "Wait";
	C006_Isolation_Outro_StuckPillory = true;
	AchievementUnlock("BeggarsChoosers");
}