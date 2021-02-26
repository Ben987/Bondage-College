// Arousal -- It lowers your stamina regen
var KinkyDungeonStatArousalMax = 100
var KinkyDungeonStatArousal = 0
var KinkyDungeonStatArousalRegen = -1
var KinkyDungeonStatArousalRegenStaminaRegenFactor = -0.9 // Stamina drain per time per 100 arousal
// Note that things which increase max arousal (aphrodiasic) also increase the max stamina drain. This can end up being very dangerous as being edged at extremely high arousal will drain all your energy completely, forcing you to wait until the torment is over or the drugs wear off

// Stamina -- your MP. Used to cast spells and also struggle
var KinkyDungeonStatStaminaMax = 100
var KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax
var KinkyDungeonStatStaminaRegen = 1 

// Willpower -- your HP. When it falls to 0, your character gives up and accepts her fate
var KinkyDungeonStatWillpowerMax = 100
var KinkyDungeonStatWillpower = KinkyDungeonStatWillpowerMax
var KinkyDungeonStatWillpowerRegen = 0.1

// Willpower loss
var KinkyDungeonWillpowerLossOnOrgasm = 5
var KinkyDungeonWillpowerDrainLowStamina = 1.1
var KinkyDungeonWillpowerDrainLowStaminaThreshold = 10 // Threshold at which willpower starts to drain

// Current Status
var KinkyDungeonStatBeltLevel = 0 // Chastity bra does not add belt level
var KinkyDungeonStatPlugLevel = 0 // Cumulative with front and rear plugs
var KinkyDungeonStatVibeLevel = 0 // Cumulative with diminishing returns for multiple items
var KinkyDungeonStatEdged = false // If all vibrating effects are edging, then this will be true

var KinkyDungeonStatArousalGainChaste = -0.25 // Cumulative w/ groin and bra

// Restraint stats

var KinkyDungeonSlowLevel = 0 // Adds to the number of move points you need before you move
var KinkyDungeonMovePoints = 0

var KinkyDungeonBlindLevel = 0 // Blind level 1: -33% vision, blind level 2: -67% vision, Blind level 3: Vision radius = 1
var KinkyDungeonDeaf = false // Deafness makes it impossible to see monsters in dim light, and reduces your vision radius to 0 if you are fully blind (blind level 3)

// Other stats
var KinkyDungeonGold = 0
var KinkyDungeonLockpicks = 0
// 3 types of keys, for 4 different types of padlocks. The last type of padlock requires all 3 types of keys to unlock
// The red keys are one-use only as the lock traps the key
// The green keys are multi-use, but jam often
// The blue keys open any type of lock, and become red or green keys on use. However, blue locks cannot be picked or cut.
// Monsters are not dextrous enough to steal keys from your satchel, although they may spill your satchel on a nearby tile
var KinkyDungeonRedKeys = 0
var KinkyDungeonGreenKeys = 0
var KinkyDungeonBlueKeys = 0
// Regular blades are used to cut soft restraints. Enchanted blades turn into regular blades after one use, and can cut magic items
// Some items are trapped with a curse, which will destroy the knife when cut, but otherwise still freeing you
var KinkyDungeonNormalBlades = 1
var KinkyDungeonEnchantedBlades = 0



function KinkyDungeonDefaultStats() {
	KinkyDungeonGold = 0
	KinkyDungeonLockpicks = 0
	KinkyDungeonRedKeys = 0
	KinkyDungeonGreenKeys = 0
	KinkyDungeonBlueKeys = 0
	KinkyDungeonNormalBlades = 1
	KinkyDungeonEnchantedBlades = 0
	
	KinkyDungeonStatArousalMax = 100
	KinkyDungeonStatStaminaMax = 100
	KinkyDungeonStatWillpowerMax = 100
	
	KinkyDungeonStatArousal = 0
	KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax
	KinkyDungeonStatWillpower = KinkyDungeonStatWillpowerMax
	
	KinkyDungeonMovePoints = 0
}

function KinkyDungeonGetVisionRadius() {
	return Math.max((KinkyDungeonDeaf) ? 0 : 1, Math.floor(KinkyDungeonMapBrightness*(1.0 - 0.33 * KinkyDungeonBlindLevel)))
}

function KinkyDungeonDealDamage(dmg) {
	KinkyDungeonStatWillpower -= dmg
}

function KinkyDungeonDrawStats(x, y, width, heightPerBar) {
	// Draw labels
	DrawText(TextGet("StatArousal"), x+width/2, y + 25, (KinkyDungeonStatArousal < 100) ? "white" : "pink", "silver");
	DrawText(TextGet("StatStamina"), x+width/2, y + 25 + heightPerBar, (KinkyDungeonStatStamina > KinkyDungeonWillpowerDrainLowStaminaThreshold) ? "white" : "pink", "silver");
	DrawText(TextGet("StatWillpower"), x+width/2, y + 25 + 2 * heightPerBar, (KinkyDungeonStatWillpower > 10) ? "white" : "pink", "silver");
	
	// Draw arousal
	DrawProgressBarColor(x, y + heightPerBar/2, width, heightPerBar/3, 100*KinkyDungeonStatArousal/KinkyDungeonStatArousalMax, "pink", "#111111")
	DrawProgressBarColor(x, y + heightPerBar + heightPerBar/2, width, heightPerBar/3, 100*KinkyDungeonStatStamina/KinkyDungeonStatStaminaMax, "#22AA22", "#111111")
	DrawProgressBarColor(x, y + 2*heightPerBar + heightPerBar/2, width, heightPerBar/3, 100*KinkyDungeonStatWillpower/KinkyDungeonStatWillpowerMax, "#DDCCCC", "#881111")
	
	var i = 3
	DrawText(TextGet("CurrentGold") + KinkyDungeonGold, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;
	DrawText(TextGet("CurrentLockpicks") + KinkyDungeonLockpicks, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;
	
	if (KinkyDungeonRedKeys > 0) {DrawText(TextGet("CurrentKeyRed") + KinkyDungeonRedKeys, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
	if (KinkyDungeonGreenKeys > 0) {DrawText(TextGet("CurrentKeyGreen") + KinkyDungeonGreenKeys, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
	if (KinkyDungeonBlueKeys > 0) {DrawText(TextGet("CurrentKeyBlue") + KinkyDungeonBlueKeys, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
	if (KinkyDungeonNormalBlades > 0) {DrawText(TextGet("CurrentKnife") + KinkyDungeonNormalBlades, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
	if (KinkyDungeonEnchantedBlades > 0) {DrawText(TextGet("CurrentKnifeMagic") + KinkyDungeonEnchantedBlades, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
}


function KinkyDungeonUpdateStats(delta) {
	// Initialize
	var arousalRate = KinkyDungeonStatArousalRegen
	var staminaRate = KinkyDungeonStatStaminaRegen
	var willpowerRate = KinkyDungeonStatWillpowerRegen
	
	// Arousal reduces staminal regen
	staminaRate += KinkyDungeonStatArousal / 100 * KinkyDungeonStatArousalRegenStaminaRegenFactor
	
	// If below a threshold, willpower starts to drain
	if (KinkyDungeonStatStamina <= KinkyDungeonWillpowerDrainLowStaminaThreshold) willpowerRate += KinkyDungeonWillpowerDrainLowStamina
	
	
	// Cap off the values between 0 and maximum
	KinkyDungeonStatArousal = Math.max(0, Math.min(KinkyDungeonStatArousal + arousalRate*delta, KinkyDungeonStatArousalMax))
	KinkyDungeonStatStamina = Math.max(0, Math.min(KinkyDungeonStatStamina + staminaRate*delta, KinkyDungeonStatStaminaMax))
	KinkyDungeonStatWillpower = Math.max(0, Math.min(KinkyDungeonStatWillpower + willpowerRate*delta, KinkyDungeonStatWillpowerMax))
}

// StimulationLevel - 0: Physical touching
// StimulationLevel - 1: Direct vibrator contact
// StimulationLevel - 2: Internal vibrator or magic, edging blocks
// StimulationLevel - 3: Bypass edging
function KinkyDungeonCanOrgasm(StimulationLevel) {
	if (KinkyDungeonStatArousal <= 100) return false; // Need to be at 100
	if (KinkyDungeonStatBeltLevel > StimulationLevel) return false // A leather belt won't stop heavy stimulation
	if (KinkyDungeonStatEdged && StimulationLevel < 3) return false
	return true;
}