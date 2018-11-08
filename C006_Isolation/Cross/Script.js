var C006_Isolation_Cross_CurrentStage = 0;

// Chapter 6 - Cross Load
function C006_Isolation_Cross_Load() {
	LeaveIcon = "Leave";
	LeaveScreen = "IsolationRoom";
	LoadInteractions();
}

// Chapter 6 - Cross Run
function C006_Isolation_Cross_Run() {
	BuildInteraction(C006_Isolation_Cross_CurrentStage);
}

// Chapter 6 - Cross Click
function C006_Isolation_Cross_Click() {	
	ClickInteraction(C006_Isolation_Cross_CurrentStage);
}

// Chapter 6 - Cross Trap - The player is stuck on that scene until 11:30
function C006_Isolation_Cross_Trap() {
	LeaveIcon = "Wait";
	C006_Isolation_Outro_StuckCross = true;
	AchievementUnlock("BeggarsChoosers");
}