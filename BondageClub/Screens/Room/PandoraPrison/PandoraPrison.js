"use strict";
var PandoraPrisonBackground = "Cell";
var PandoraWillpowerTimer = 0;
var PandoraPrisonMaid = null;
var PandoraPrisonGuard = null;
var PandoraPrisonCharacter = null;
var PandoraPrisonCharacterTimer = 0;
var PandoraPrisonEscaped = false;
var PandoraPrisonBribeEnabled = true;

/**
 * Loads the Pandora's Box prison screen
 * @returns {void} - Nothing
 */
function PandoraPrisonLoad() {
	PandoraParty = [];
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
		PandoraPrisonBribeEnabled = true;
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
 * Handles clicks in the prison screen, the guard will pick a random activity to do on the player
 * @returns {void} - Nothing
 */
function PandoraPrisonClick() {
	if (MouseIn(1885, 25, 90, 90) && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null, true);
	if ((PandoraPrisonCharacter == null) && MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(Player);
	if ((PandoraPrisonCharacter != null) && MouseIn(1000, 0, 500, 1000)) {
		if (PandoraPrisonGuard.Stage == "RANDOM") {
			if ((Math.random() > 0.5) && (PandoraWillpower * 2 >= PandoraMaxWillpower)) PandoraPrisonGuard.Stage = "Beat";
			else if ((Math.random() > 0.5) && !CharacterIsNaked(Player)) PandoraPrisonGuard.Stage = "Strip";
			else if ((Math.random() > 0.5) && CharacterIsNaked(Player) && !Player.IsChaste()) PandoraPrisonGuard.Stage = "Chastity";
			else PandoraPrisonGuard.Stage = "ChangeBondage";
		}
		CharacterSetCurrent(PandoraPrisonCharacter);
		if (PandoraPrisonCharacter.TriggerIntro) PandoraPrisonCharacter.CurrentDialog = DialogFind(PandoraPrisonCharacter, "Intro" + (Player.CanInteract() ? "" : "Restrained") + PandoraPrisonCharacter.Stage);
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
	CharacterRelease(Player);
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
 * When the player gets stripped and restrained by an NPC, call the regular restrain function
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerStrip(Level) {
	CharacterNaked(Player);
	PandoraPrisonPlayerRestrain(Level);
}

/**
 * When the player gets locked in a chastity device by the guard
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerChastity(LockType) {
	if (InventoryGet(Player, "ItemPelvis") == null) {
		InventoryWear(Player, CommonRandomItemFromList("", ["MetalChastityBelt", "LeatherChastityBelt", "SleekLeatherChastityBelt", "StuddedChastityBelt", "PolishedChastityBelt", "SteelChastityPanties"]), "ItemPelvis");
		InventoryLock(Player, "ItemPelvis", LockType);
	}
	if (InventoryGet(Player, "ItemBreast") == null) {
		InventoryWear(Player, CommonRandomItemFromList("", ["MetalChastityBra", "PolishedChastityBra", "LeatherBreastBinder"]), "ItemBreast");
		InventoryLock(Player, "ItemBreast", LockType);
	}
}

/**
 * When the NPC leaves the prison
 * @returns {void} - Nothing
 */
function PandoraPrisonCharacterRemove() {
	InventoryRemove(CurrentCharacter, "ItemHands");
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
	return (!Player.IsRestrained() && (PandoraWillpower >= 1) && Player.CanTalk());
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

/**
 * When the player starts bribing the guard
 * @returns {void} - Nothing
 */
function PandoraPrisonBribeStart() {
	PandoraPrisonBribeEnabled = false;
}

/**
 * A guard can only bribed once on every round
 * @returns {boolean} - TRUE if bribing the guard is allowed
 */
function PandoraPrisonBribeAllowed() {
	return (PandoraPrisonBribeEnabled && (Player.Infiltration.Punishment.Timer > CurrentTime + 60000) && (Player.Money >= 10) && Player.CanTalk());
}

/**
 * Checks if the perk specified is currently selected
 * @param {string} Type - The perk type
 * @returns {boolean} - Returns TRUE if it's selected
 */
function PandoraPrisonHasPerk(Type) {
	return InfiltrationPerksActive(Type);
}

/**
 * When the player bribes the guard to lower her sentence
 * @param {string} Money - The amount of money spent
 * @param {string} Minutes - The number of minutes to remove from the sentence
 * @returns {void} - Nothing
 */
function PandoraPrisonBribeProcess(Money, Minutes) {
	Money = parseInt(Money);
	Minutes = parseInt(Minutes);
	if (Money != 0) CharacterChangeMoney(Player, Money * -1);
	if (Minutes != 0) {
		Player.Infiltration.Punishment.Timer = Player.Infiltration.Punishment.Timer - (Minutes * 60000);
		if (Player.Infiltration.Punishment.Timer < CurrentTime + 60000) Player.Infiltration.Punishment.Timer = CurrentTime + 60000;
		ServerSend("AccountUpdate", { Infiltration: Player.Infiltration });
	}
}

/**
 * When the current NPC picks a random weapon to beat up the player
 * @returns {void} - Nothing
 */
function PandoraPrisonPickWeapon() {
	InventoryWear(PandoraPrisonGuard, "SpankingToys", "ItemHands");
	InventoryGet(PandoraPrisonGuard, "ItemHands").Property = { Type: CommonRandomItemFromList("", ["Flogger", "Cane", "Paddle", "WhipPaddle", "Whip", "CattleProd", "Belt"]) };
	CharacterRefresh(PandoraPrisonGuard);
}

/**
 * When the guard beats up the player, she loses some strength for fights
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerBeat(Damage, Blush) {
	Damage = parseInt(Damage);
	Damage = Math.round(Damage * PandoraMaxWillpower / 100);
	PandoraWillpower = PandoraWillpower - Damage;
	if (PandoraWillpower < 0) PandoraWillpower = 0;
	PandoraWillpowerTimer = PandoraWillpowerTimer + ((InfiltrationPerksActive("Recovery")) ? 20000 : 30000);
	CharacterSetFacialExpression(Player, "Blush", Blush, 10);
	CharacterSetFacialExpression(Player, "Eyes", "Closed", 10);
	CharacterSetFacialExpression(Player, "Eyes2", "Closed", 10);
}
