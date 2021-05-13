"use strict";
var PandoraPrisonBackground = "Cell";
var PandoraWillpowerTimer = 0;
var PandoraPrisonMaid = null;
var PandoraPrisonGuard = null;
var PandoraPrisonCharacter = null;
var PandoraPrisonCharacterTimer = 0;
var PandoraPrisonEscaped = false;

/**
 * Loads the Pandora's Box prison screen
 * @returns {void} - Nothing
 */
function PandoraPrisonLoad() {
	if (!PandoraPrisonEscaped) PandoraPrisonCharacter = null;
	if (PandoraPrisonMaid == null) {
		PandoraPrisonMaid = CharacterLoadNPC("NPC_PandoraPrison_Maid");
		PandoraPrisonMaid.AllowItem = false;
		PandoraPrisonMaid.TriggerIntro = false;
		PandoraDress(PandoraPrisonMaid, "Maid");
	}
	if (PandoraPrisonGuard == null) {
		PandoraPrisonGuard = CharacterLoadNPC("NPC_PandoraPrison_Guard");
		PandoraPrisonGuard.AllowItem = false;
		PandoraPrisonGuard.TriggerIntro = true;
		PandoraDress(PandoraPrisonGuard, "Guard");
	}
	if (PandoraWillpowerTimer == 0) PandoraWillpowerTimer = CommonTime() + ((InfiltrationPerksActive("Recovery")) ? 20000 : 30000);
	PandoraMaxWillpower = 20 + (SkillGetLevel(Player, "Willpower") * 2) + (InfiltrationPerksActive("Resilience") ? 5 : 0) + (InfiltrationPerksActive("Endurance") ? 5 : 0);
	PandoraPrisonBackground = Player.Infiltration.Punishment.Background;
	PandoraPrisonCharacterTimer = CommonTime() + 30000 + Math.floor(Math.random() * 30000);
	CharacterSetActivePose(Player, null);
}

/**
 * Runs and draws the prison screen
 * @returns {void} - Nothing
 */
function PandoraPrisonRun() {

	// When time is up, a maid comes to escort the player out, validates that prison time cannot go over 1 hour
	if (Player.Infiltration.Punishment.Timer > CurrentTime + 3600000) Player.Infiltration.Punishment.Timer = CurrentTime + 3600000;
	if ((Player.Infiltration.Punishment.Timer < CurrentTime) && (CurrentCharacter == null) && !PandoraPrisonEscaped)
		PandoraPrisonCharacter = PandoraPrisonMaid;

	// When the willpower timer ticks, we raise willpower by 1
	if (PandoraWillpowerTimer < CommonTime()) {
		if (PandoraWillpower < PandoraMaxWillpower) PandoraWillpower++;
		PandoraWillpowerTimer = PandoraWillpowerTimer + ((InfiltrationPerksActive("Recovery")) ? 20000 : 30000);
	}
	
	// When the character timer ticks, the guard can come in or leave
	if ((Player.Infiltration.Punishment.Timer >= CurrentTime) && (PandoraPrisonCharacterTimer < CommonTime()) && (CurrentCharacter == null) && !PandoraPrisonEscaped) {
		PandoraPrisonCharacter = (PandoraPrisonCharacter == null) ? PandoraPrisonGuard : null;
		PandoraPrisonCharacterTimer = CommonTime() + 30000 + Math.floor(Math.random() * 30000);
	}

	// Draws the character and it's sentence
	if (PandoraPrisonCharacter != null) {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(PandoraPrisonCharacter, 1000, 0, 1);
	} else DrawCharacter(Player, 750, 0, 1);
	if (Player.CanKneel()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Kneel.png", TextGet("Kneel"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if (Player.Infiltration.Punishment.Timer > CurrentTime) {
		DrawText(TextGet("Sentence") + " " + Player.Infiltration.Punishment.Minutes.toString() + " " + TextGet("Minutes"), 1800, 870, "White", "Black");
		DrawText(TextGet("EndsIn") + " " + TimerToString(Player.Infiltration.Punishment.Timer - CurrentTime), 1800, 920, "White", "Black");
	}

	// Draw the willpower / max
	DrawProgressBar(1610, 954, 380, 36, Math.round(PandoraWillpower / PandoraMaxWillpower * 100));
	DrawText(PandoraWillpower.toString(), 1800, 973, "black", "white");

}

/**
 * Handles clicks in the prison screen
 * @returns {void} - Nothing
 */
function PandoraPrisonClick() {
	if (MouseIn(1885, 25, 90, 90) && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null, true);
	if ((PandoraPrisonCharacter == null) && MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(Player);
	if ((PandoraPrisonCharacter != null) && MouseIn(1000, 0, 500, 1000)) {
		if (PandoraPrisonGuard.Stage == "RANDOM") PandoraPrisonGuard.Stage = "ChangeBondage";  // TO-DO: must pick a random activity
		if (PandoraPrisonCharacter.TriggerIntro) PandoraPrisonCharacter.CurrentDialog = DialogFind(PandoraPrisonCharacter, "Intro" + (Player.CanInteract() ? "" : "Restrained") + PandoraPrisonCharacter.Stage);
		CharacterSetCurrent(PandoraPrisonCharacter);
	}
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * When the player gets fully released by a maid
 * @returns {void} - Nothing
 */
function PandoraPrisonReleasePlayer() {
	CharacterRelease(Player);
	CharacterSetActivePose(Player, null);
	PandoraPrisonBackground = "MainHall";
}

/**
 * When the player exits the prison
 * @returns {void} - Nothing
 */
function PandoraPrisonExitPrison() {
	CharacterRelease(PandoraPrisonGuard);
	PandoraDress(PandoraPrisonGuard, "Guard");	
	PandoraPrisonGuard.AllowItem = false;
	PandoraPrisonEscaped = false;
	CharacterSetActivePose(Player, null);
	delete Player.Infiltration.Punishment;
	ServerSend("AccountUpdate", { Infiltration: Player.Infiltration });
	DialogLeave();
	if (InfiltrationSupervisor == null) CommonSetScreen("Room", "MainHall");
	else CommonSetScreen("Room", "Infiltration");
}

/**
 * When the player gets ungagged by an NPC, we remove everything on the head
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerUngag() { 
	InventoryRemove(Player, "ItemHead");
	InventoryRemove(Player, "ItemHood");
	InventoryRemove(Player, "ItemNose");
	InventoryRemove(Player, "ItemMouth");
	InventoryRemove(Player, "ItemMouth2");
	InventoryRemove(Player, "ItemMouth3");	
}

/**
 * When the player gets restrained by an NPC, the arms bondage get tighter with difficulty and if a fight occured
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerRestrain(Level) {
	CharacterSetActivePose(Player, null);
	CharacterRelease(Player);
	CharacterFullRandomRestrain(Player, Level);
	let Item = InventoryGet(Player, "ItemArms");
	if (Item != null) {
		if (Item.Difficulty == null) Item.Difficulty = 0;		
		Item.Difficulty = parseInt(Item.Difficulty) + parseInt(InfiltrationDifficulty) + 1;
		if ((Player.Infiltration.Punishment.FightDone != null) && Player.Infiltration.Punishment.FightDone) Item.Difficulty = Item.Difficulty + 5;
	}
}

/**
 * When the NPC leaves the prison
 * @returns {void} - Nothing
 */
function PandoraPrisonCharacterRemove() {
	PandoraPrisonCharacter = null;
	PandoraPrisonCharacterTimer = CommonTime() + 30000 + Math.floor(Math.random() * 30000);
	PandoraPrisonGuard.Stage = "RANDOM";
	DialogLeave();
}

/**
 * Returns TRUE if the player can start a fight
 * @returns {boolean} - TRUE if the player can start a fight
 */
function PandoraPrisonCanStartFight() {
	return (!Player.IsRestrained() && (PandoraWillpower >= 1));
}

/**
 * Starts the fight with the NPC guard
 * @returns {void} - Nothing
 */
function PandoraPrisonStartFight() {
	CharacterSetActivePose(Player, null);
	let Difficulty = (InfiltrationDifficulty * 2) + 2;
	KidnapStart(CurrentCharacter, PandoraPrisonBackground, Difficulty, "PandoraPrisonFightEnd()");
}

/**
 * When the fight with the NPC ends
 * @returns {void} - Nothing
 */
function PandoraPrisonFightEnd() {
	CharacterSetCurrent(PandoraPrisonGuard);
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (CurrentCharacter.KidnapMaxWillpower - CurrentCharacter.KidnapWillpower)));
	PandoraWillpower = Player.KidnapWillpower;
	CurrentCharacter.Stage = (KidnapVictory) ? "100" : "200";
	CharacterRelease(KidnapVictory ? Player : CurrentCharacter);
	CurrentCharacter.AllowItem = KidnapVictory;
	PandoraPrisonEscaped = KidnapVictory;
	CommonSetScreen("Room", "PandoraPrison");
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, (KidnapVictory) ? "FightVictory" : "FightDefeat");
	if (!KidnapVictory) {
		Player.Infiltration.Punishment.FightDone = true;
		ServerSend("AccountUpdate", { Infiltration: Player.Infiltration });
		PandoraDress(PandoraPrisonGuard, "Guard");
	}
}

/**
 * When the player must strips the current character
 * @returns {void} - Nothing
 */
function PandoraPrisonCharacterNaked() {
	CharacterNaked(CurrentCharacter);
}

/**
 * When the player changes in the clothes of someone else (type)
 * @param {string} Type - The type of character to dress as (ex: Guard)
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerClothes(Type) {
	PandoraDress(Player, Type);
}

/**
 * When the player escapes from the prison, she gains some infiltration skills
 * @returns {void} - Nothing
 */
function PandoraPrisonEscape() {
	CharacterSetActivePose(Player, null);
	PandoraInfiltrationChange(75);
	PandoraPrisonExitPrison();
}