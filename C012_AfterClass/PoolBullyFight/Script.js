// Chapter 12 - Pool Bully Fight Load
function C012_AfterClass_PoolBullyFight_Load() {
	LoadFight("Pool", "Hard", Icons.Fight.Punch, PlayerGetSkillLevel("Fighting"));
}

// Chapter 12 - Pool Bully Fight Run
function C012_AfterClass_PoolBullyFight_Run() {
	RenderFight();
}

// Chapter 12 - Pool Bully Fight Click
function C012_AfterClass_PoolBullyFight_Click() {
	FightClick();
}

// Chapter 12 - Pool Bully Fight Key Down
function C012_AfterClass_PoolBullyFight_KeyDown() {
	FightKeyDown();
}

// Chapter 12 - Pool Bully Fight End
function C012_AfterClass_PoolBullyFight_FightEnd(Victory) {
	C012_AfterClass_Pool_CurrentActor = "Jennifer";
	if (Victory) {
		PlayerAddSkill("Fighting", 1);
		ActorSpecificSetPose("Jennifer", "Cheerful");
		C012_AfterClass_Pool_BullyPose = "BullyDefeat";
		GameLogSpecificAdd(CurrentChapter, "Jennifer", "PoolBullyVictory");
		C012_AfterClass_Pool_CurrentStage = 170;
	} else {
		GameLogSpecificAdd(CurrentChapter, "Jennifer", "PoolBullyDefeat");
		C012_AfterClass_Pool_CurrentStage = 160;
	}
}