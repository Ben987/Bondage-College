var PlayerSkill = [];
var PlayerSkillName = 0;
var PlayerSkillLevel = 1;
var PlayerSkillShowLevelUp = 0;

// Add a new skill or raise the skill level if the skill is already known
function PlayerAddSkill(SkillToAdd, LevelToAdd) {

	// Shows the new skill warning for 15 seconds
	PlayerSkillShowLevelUp = Math.round(15 * 1000 / RunInterval);

	// If the skill is already known, we raise the level
	for (var I = 0; I < PlayerSkill.length; I++)
		if (SkillToAdd == PlayerSkill[I][PlayerSkillName]) {
			PlayerSkill[I][PlayerSkillLevel] = PlayerSkill[I][PlayerSkillLevel] + LevelToAdd;
			if (PlayerSkill[I][PlayerSkillLevel] > 10) PlayerSkill[I][PlayerSkillLevel] = 10;
			return;
		}
		
	// If the skill isn't known, we add it to the player skill list
	if (LevelToAdd > 10) LevelToAdd = 10;
	PlayerSkill[PlayerSkill.length] = [SkillToAdd, LevelToAdd];

}

// Returns the current level of a specific skill (0 if the skill isn't known)
function PlayerGetSkillLevel(SkillToQuery) {
	for (var I = 0; I < PlayerSkill.length; I++)
		if (SkillToQuery == PlayerSkill[I][PlayerSkillName])
			return PlayerSkill[I][PlayerSkillLevel];
	return 0;
}