"use strict";
// Escape chances
// Struggle : How difficult it is to struggle out of the item. Shouldn't be below 0.1 as that would be too tedious. Negative values help protect against spells.
// Cut : How difficult it is to cut with a knife. Metal items should have 0, rope and leather should be low but possible, and stuff like tape should be high
// Remove : How difficult it is to get it off by unbuckling. Most items should have a high chance if they have buckles, medium chance if they have knots, and low chance if they have a difficult mechanism.
// Pick : How hard it is to pick the lock on the item. Higher level items have more powerful locks. The general formula is 0.33 for easy items, 0.1 for medium items, 0.05 for hard items, and 0.01 for super punishing items
// Unlock : How hard it is to reach the lock. Should be higher than the pick chance, and based on accessibility. Items like the

// Note that there is a complex formula for how the chances are manipulated based on whether your arms are bound. Items that bind the arms are generally unaffected, and items that bind the hands are unaffected, but they do affect each other

// Power is a scale of how powerful the restraint is supposed to be. It should roughly match the difficulty of the item, but can be higher for special items. Power 10 or higher might be totally impossible to struggle out of.

// These are groups that the game is not allowed to remove because they were tied at the beginning
var KinkyDungeonRestraintsLocked = [];

var KinkyDungeonRestraints = [
	{name: "DuctTapeArms", Asset: "DuctTape", Color: "#AA2222", Group: "ItemArms", magic: false, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5}, enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemArmsFull":8}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Charms"]},
	{name: "DuctTapeFeet", Asset: "DuctTape", Color: "#AA2222", Group: "ItemFeet", magic: false, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5}, enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemLegsFull":8}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Charms"]},
	{name: "DuctTapeBoots", Asset: "ToeTape", Type: "Full", Color: "#AA2222", Group: "ItemBoots", magic: false, slowboots: true, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5}, enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Charms"]},
	{name: "DuctTapeLegs", Asset: "DuctTape", Color: "#AA2222", Group: "ItemLegs", magic: false, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5}, enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Charms"]},
	{name: "DuctTapeHead", Asset: "DuctTape", Color: "#AA2222", Group: "ItemHead", magic: false, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5}, enemyTags: {"ribbonRestraints":5}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Charms"]},
	{name: "DuctTapeMouth", Asset: "DuctTape", Color: "#AA2222", Group: "ItemMouth2", magic: false, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5}, enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemMouth1Full":8}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Charms"]},
	{name: "DuctTapeHeadMummy", Type: "Mummy", Asset: "DuctTape", Color: "#AA2222", Group: "ItemHead", magic: false, power: 2, weight: 0,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0.4},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemMouth1Full":2, "ItemMouth2Full":1}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Charms"]},
	{name: "DuctTapeArmsMummy", Type: "Complete", Asset: "DuctTape", Color: "#AA2222", Group: "ItemArms", magic: false, power: 2, weight: 0,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0.4},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemArmsFull":3}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Charms"]},
	{name: "DuctTapeLegsMummy", Type: "CompleteLegs", Asset: "DuctTape", Color: "#AA2222", Group: "ItemLegs", magic: false, power: 2, weight: 0,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0.4},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemLegsFull":3}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Charms"]},
	{name: "DuctTapeLegsMummy", Type: "CompleteLegs", Asset: "DuctTape", Color: "#AA2222", Group: "ItemLegs", magic: false, power: 2, weight: 0,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0.4},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemLegsFull":3}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Charms"]},
	{name: "DuctTapeFeetMummy", Type: "CompleteFeet", Asset: "DuctTape", Color: "#AA2222", Group: "ItemFeet", magic: false, power: 2, weight: 0,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0.4},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemFeetFull":3}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Charms"]},


	{name: "Stuffing", Asset: "ClothStuffing", Group: "ItemMouth", power: -20, weight: 0, escapeChance: {"Struggle": 10, "Cut": 10, "Remove": 10}, enemyTags: {"ribbonRestraints":6}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7]},

	{name: "WeakMagicRopeArms", Asset: "HempRope", Color: "#ff88AA", Group: "ItemArms", magic: false, power: 5, weight: 1, escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, enemyTags: {"ropeMagicWeak":2}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Rope"]},
	{name: "WeakMagicRopeLegs", Asset: "HempRope", Type: "FullBinding", Color: "#ff88AA", Group: "ItemLegs", magic: false, power: 3, weight: 1, escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, enemyTags: {"ropeMagicWeak":2}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Rope"]},

	{name: "StickySlime", Asset: "Web", Type: "Wrapped", Color: "#ff77ff", Group: "ItemArms", magic: false, power: 0, weight: 1, freeze: true, escapeChance: {"Struggle": 10.0, "Cut": 10.0, "Remove": 10.0}, enemyTags: {"slime":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Slime"]},

	{name: "TrapArmbinder", Asset: "LeatherArmbinder", Type: "WrapStrap", Group: "ItemArms", magic: false, power: 8, weight: 2, escapeChance: {"Struggle": 0.1, "Cut": 0.33, "Remove": 0.2, "Pick": 0.0}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather", "Armbinders"]},
	{name: "TrapCuffs", Asset: "MetalCuffs", Group: "ItemArms", magic: false, power: 4, weight: 2, escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 100.0, "Pick": 2.5}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Metal", "Cuffs"]},
	{name: "TrapHarness", Asset: "LeatherStrapHarness", Color: "#222222", Group: "ItemTorso", magic: false, power: 3, weight: 2, harness: true, escapeChance: {"Struggle": 0.0, "Cut": 0.5, "Remove": 0.8, "Pick": 1.0}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather"]},
	{name: "TrapGag", Asset: "BallGag", Type: "Tight", Color: ["Default", "Default"], Group: "ItemMouth2", magic: false, power: 4, weight: 2, escapeChance: {"Struggle": 0.15, "Cut": 0.4, "Remove": 0.65, "Pick": 0.5}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather", "Gags"]},
	{name: "TrapBlindfold", Asset: "LeatherBlindfold", Color: "Default", Group: "ItemHead", magic: false, power: 3, weight: 2, escapeChance: {"Struggle": 0.3, "Cut": 0.4, "Remove": 0.65, "Pick": 0.5}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather", "Blindfolds"]},
	{name: "TrapBoots", Asset: "BalletHeels", Color: "Default", Group: "ItemBoots", magic: false, slowboots: true, power: 3, weight: 2, escapeChance: {"Struggle": 0.15, "Cut": 0.4, "Remove": 0.4, "Pick": 0.9}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather", "Boots"]},
	{name: "TrapLegirons", Asset: "Irish8Cuffs", Color: "Default", Group: "ItemFeet", magic: false, power: 4, weight: 2, escapeChance: {"Struggle": 0.0, "Cut": -0.3, "Remove": 100.0, "Pick": 1.0}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Metal", "Cuffs"]},
	{name: "TrapBelt", Asset: "PolishedChastityBelt", OverridePriority: 20, Color: "Default", Group: "ItemPelvis", magic: false, chastity: true, power: 4, weight: 2, escapeChance: {"Struggle": 0.0, "Cut": 0.0, "Remove": 100.0, "Pick": 1.0}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Metal", "Chastity"]},
	{name: "TrapVibe", Asset: "TapedClitEgg", Color: "Default", Group: "ItemVulvaPiercings", magic: false, intensity: 1, orgasm: false, power: 1, battery: 0, maxbattery: 30, weight: 2, escapeChance: {"Struggle": 0.1, "Cut": 0.0, "Remove": 100.0}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Vibes"]},

  {name: "RopeSnakeArms", Asset: "HempRope", Color: "Default", Group: "ItemArms", magic: false, power: 1, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, enemyTags: {"ropeRestraints":2}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Rope"]},
	{name: "RopeSnakeArmsWrist", Asset: "HempRope", Type: "WristElbowHarnessTie", Color: "Default", Group: "ItemArms", magic: false, power: 1, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, enemyTags: {"ropeRestraints":2}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Rope"]},
	{name: "RopeSnakeFeet", Asset: "HempRope", Color: "Default", Group: "ItemFeet", magic: false, power: 1, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, enemyTags: {"ropeRestraints":2}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Rope"]},
	{name: "RopeSnakeLegs", Asset: "HempRope", Type: "FullBinding", Color: "Default", Group: "ItemLegs", magic: false, power: 1, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, enemyTags: {"ropeRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: [0, 1, 2, 3], shrine: ["Rope"]},

	{name: "ChainArms", Asset: "Chains", Type: "WristElbowHarnessTie", Color: "Default", Group: "ItemArms", magic: false, power: 5, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.5, "Pick": 1.5}, enemyTags: {"chainRestraints":2}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], shrine: ["Chains", "Metal"]},
	{name: "ChainLegs", Asset: "Chains", Type: "Strict", Color: "Default", Group: "ItemLegs", magic: false, power: 5, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.5, "Pick": 1.5}, enemyTags: {"chainRestraints":2}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], shrine: ["Chains", "Metal"]},
	{name: "ChainFeet", Asset: "Chains", Color: "Default", Group: "ItemFeet", magic: false, power: 5, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.5, "Pick": 1.5}, enemyTags: {"chainRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], shrine: ["Chains", "Metal"]},
	{name: "ChainCrotch", Asset: "CrotchChain", OverridePriority: 25, Color: "Default", Group: "ItemTorso", magic: false, power: 5, weight: 0, harness: true, escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.5, "Pick": 1.5}, enemyTags: {"chainRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], shrine: ["Chains", "Metal"]},
];

function KinkyDungeonLock(item, lock) {
	item.lock = lock;
	if (item.restraint && InventoryGet(KinkyDungeonPlayer, item.restraint.Group) && lock != "") {
		InventoryLock(KinkyDungeonPlayer, InventoryGet(KinkyDungeonPlayer, item.restraint.Group), "IntricatePadlock", Player.MemberNumber, true)
		if (!KinkyDungeonRestraintsLocked.includes(item.restraint.Group))
			InventoryLock(Player, InventoryGet(Player, item.restraint.Group), "IntricatePadlock", null, true)
	} else {
		InventoryUnlock(KinkyDungeonPlayer, item.restraint.Group);
		if (!KinkyDungeonRestraintsLocked.includes(item.restraint.Group))
			InventoryUnlock(Player, item.restraint.Group);
	}
		
}

function KinkyDungeonGetRestraintsWithShrine(shrine) {
	let ret = [];

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.shrine && item.restraint.shrine.includes(shrine)) {
			ret.push(item);
		}
	}

	return ret;
}

function KinkyDungeonRemoveRestraintsWithShrine(shrine) {
	let count = 0;

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.shrine && item.restraint.shrine.includes(shrine)) {
			KinkyDungeonRemoveRestraint(item.restraint.Group);
			I = 0;
			count++;
		}
	}

	return count;
}

function KinkyDungeonUnlockRestraintsWithShrine(shrine) {
	let count = 0;

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && item.lock && item.restraint.shrine && item.restraint.shrine.includes(shrine)) {
			
			KinkyDungeonLock(item, "");
			count++;
		}
	}

	return count;
}

function KinkyDungeonPlayerGetLockableRestraints() {
	let ret = [];

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (!item.lock && item.restraint && item.restraint.escapeChance && item.restraint.escapeChance.Pick != null) {
			ret.push(item);
		}
	}

	return ret;
}


function KinkyDungeonRemoveKeys(lock) {
	if (lock.includes("Red")) KinkyDungeonRedKeys -= 1;
	if (lock.includes("Yellow")) {KinkyDungeonRedKeys -= 1; KinkyDungeonGreenKeys -= 1; }
	if (lock.includes("Blue")) KinkyDungeonBlueKeys -= 1;
}


function KinkyDungeonGetPickBaseChance() {
	return 0.2 / (1.0 + 0.005 * MiniGameKinkyDungeonLevel);
}

function KinkyDungeonPickAttempt() {
	let Pass = "Fail";
	let escapeChance = KinkyDungeonGetPickBaseChance();
	var cost = KinkyDungeonStatStaminaCostTool;
	let lock = KinkyDungeonTargetTile.Lock;


	if (!KinkyDungeonPlayer.CanInteract()) escapeChance /= 2;
	if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemArms"), "Block", true)) escapeChance = Math.max(0.0, escapeChance - 0.25);
	if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true)) escapeChance = Math.max(0, escapeChance - 0.5);

	escapeChance /= 1.0 + KinkyDungeonStatArousal/KinkyDungeonStatArousalMax*KinkyDungeonArousalUnlockSuccessMod;

	if (KinkyDungeonStatStamina + KinkyDungeonStaminaRate < -cost) {
		KinkyDungeonWaitMessage();
	} else if (Math.random() < escapeChance)
	{


		KinkyDungeonStatStamina += cost;
		Pass = "Success";
	} else if (Math.random() < KinkyDungeonKeyPickBreakChance || lock.includes("Blue")) { // Blue locks cannot be picked or cut!
		Pass = "Break";
		KinkyDungeonLockpicks -= 1;
	}
	KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonAttemptPick" + Pass).replace("TargetRestraint", TextGet("KinkyDungeonObject")), (Pass == "Success") ? "lightgreen" : "red", 1);
	return Pass == "Success";
}

function KinkyDungeonUnlockAttempt(lock) {
	let Pass = "Fail";
	let escapeChance = 1.0;

	if (!KinkyDungeonPlayer.CanInteract()) escapeChance /= 2;
	if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemArms"), "Block", true)) escapeChance = Math.max(0.1, escapeChance - 0.25);
	if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true)) escapeChance = Math.max(0, escapeChance - 0.5);

	if (Math.random() < escapeChance)
		Pass = "Success";
	KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonStruggleUnlock" + Pass).replace("TargetRestraint", TextGet("KinkyDungeonObject")), (Pass == "Success") ? "lightgreen" : "red", 1);
	if (Pass == "Success") {
		KinkyDungeonRemoveKeys(lock);
		return true;
	}
	return false;
}


// Lockpick = use tool or cut
// Otherwise, just a normal struggle
function KinkyDungeonStruggle(struggleGroup, StruggleType) {
	var restraint = KinkyDungeonGetRestraintItem(struggleGroup.group);
	var cost = (StruggleType == "Pick" || StruggleType == "Cut") ? KinkyDungeonStatStaminaCostTool : KinkyDungeonStatStaminaCostStruggle;
	if (StruggleType == "Unlock") cost = 0;
	let Pass = "Fail";
	let escapeChance = (restraint.restraint.escapeChance[StruggleType] != null) ? restraint.restraint.escapeChance[StruggleType] : 1.0;


	if (!KinkyDungeonPlayer.CanInteract()) escapeChance /= 2;
	if (struggleGroup.group != "ItemArms" && InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemArms"), "Block", true)) escapeChance = Math.max(0.1 - Math.max(0, 0.01*restraint.restraint.power), escapeChance - 0.25);
	if (struggleGroup.group != "ItemHands" && InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true))
		escapeChance = StruggleType == "Pick" ? Math.max(0, escapeChance - 0.5) : Math.max(0.1 - Math.max(0, 0.01*restraint.restraint.power), escapeChance - 0.25);

	if (StruggleType == "Pick" || StruggleType == "Unlock") escapeChance /= 1.0 + KinkyDungeonStatArousal/KinkyDungeonStatArousalMax*KinkyDungeonArousalUnlockSuccessMod;

	if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, struggleGroup.group)) escapeChance = 0;

	if (escapeChance > 0) {
		for (let T = 0; T < restraint.tightness; T++) {
			escapeChance *= 0.8; // Tougher for each tightness, however struggling will reduce the tightness
		}
	}
		
	if (StruggleType == "Pick") escapeChance *= KinkyDungeonGetPickBaseChance();
	
	let belt = null;
	let bra = null;
	
	if (struggleGroup.group != "ItemVulva" || struggleGroup.group != "ItemVulvaPiercings" || struggleGroup.group != "ItemButt") belt = KinkyDungeonGetRestraintItem("ItemPelvis");
	if (belt && belt.chastity) escapeChance = 0.0
	
	if (struggleGroup.group != "ItemNipples" || struggleGroup.group != "ItemNipplesPiercings") bra = KinkyDungeonGetRestraintItem("ItemBreast");
	if (bra && bra.chastity) escapeChance = 0.0
	
	if (StruggleType == "Unlock" && !((restraint.lock == "Red" && KinkyDungeonRedKeys > 0) || (restraint.lock == "Green" && KinkyDungeonGreenKeys > 0) || (restraint.lock == "Yellow" && KinkyDungeonRedKeys > 0 && KinkyDungeonGreenKeys > 0) || (restraint.lock == "Blue" && KinkyDungeonBlueKeys > 0))) {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleUnlockNo" + ((KinkyDungeonPlayer.IsBlind() > 0) ? "Unknown" : restraint.lock) + "Key"), "orange", 2);
	} else {

		if (KinkyDungeonStatStamina + KinkyDungeonStaminaRate < -cost) {
			KinkyDungeonWaitMessage();
		} else {
			if (Math.random() < escapeChance && !(restraint.lock == "Blue" && (StruggleType == "Pick"  || StruggleType == "Cut" ))) {
				Pass = "Success";
				if (StruggleType == "Pick" || StruggleType == "Unlock") {
					if (StruggleType == "Unlock") {
						if ((restraint.lock == "Red" && KinkyDungeonRedKeys > 0) || (restraint.lock == "Green" && KinkyDungeonGreenKeys > 0) || (restraint.lock == "Yellow" && KinkyDungeonRedKeys > 0 && KinkyDungeonGreenKeys > 0) || (restraint.lock == "Blue" && KinkyDungeonBlueKeys > 0)) {
							if (restraint.lock != "Green" || (Math.random() < KinkyDungeonKeyJamChance)) {
								KinkyDungeonRemoveKeys(restraint.lock);
								KinkyDungeonLock(restraint, "");
							} else {
								Pass = "Jammed";
								restraint.lock = "Jammed";
								KinkyDungeonGreenKeys -= 1;
							}
						}
					} else {
						KinkyDungeonLock(restraint, "");
					}
				} else {
					KinkyDungeonRemoveRestraint(restraint.restraint.Group);
				}
			} else {
				if (StruggleType == "Cut") {
					if (restraint.restraint.magic && KinkyDungeonEnchantedBlades == 0) Pass = "Fail";
					if (Math.random() < KinkyDungeonKnifeBreakChance || restraint.lock == "Blue") { // Blue locks cannot be picked or cut!
						Pass = "Break";
						if (restraint.restraint.magic && KinkyDungeonEnchantedBlades > 0) KinkyDungeonEnchantedBlades -= 1;
						else {
							if (KinkyDungeonNormalBlades > 0)
								KinkyDungeonNormalBlades -= 1;
							else if (KinkyDungeonEnchantedBlades > 0) {
								KinkyDungeonEnchantedBlades -= 1;
							}
						}
					}
				} else {
					if (StruggleType == "Pick") {
						if (Math.random() < KinkyDungeonKeyPickBreakChance || restraint.lock == "Blue") { // Blue locks cannot be picked or cut!
							Pass = "Break";
							KinkyDungeonLockpicks -= 1;
						}
					}
				}
			}
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggle" + StruggleType + Pass).replace("TargetRestraint", TextGet("Restraint" + restraint.restraint.name)), (Pass == "Success") ? "lightgreen" : "red", 2);

			KinkyDungeonStatStamina += cost;

			if (Pass != "Success") {
				KinkyDungeonStatWillpower += KinkyDungeonStatWillpowerCostStruggleFail;

				// reduces the tightness of the restraint slightly
				if (StruggleType == "Struggle") {
					var tightness_reduction = 1;

					for (let I = 0; I < KinkyDungeonInventory.length; I++) {
						if (KinkyDungeonInventory[I].restraint) {
							tightness_reduction *= 0.8; // Reduced tightness reduction for each restraint
						}
					}

					restraint.tightness = Math.max(0, restraint.tightness - tightness_reduction);
				}
			}
		}


		KinkyDungeonAdvanceTime(1);
	}
}

function KinkyDungeonGetRestraintItem(group) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.Group == group) {
			return item;
		}
	}
	return null;
}


function KinkyDungeonGetRestraintByName(Name) {
	for (let L = 0; L < KinkyDungeonRestraints.length; L++) {
		var restraint = KinkyDungeonRestraints[L];
		if (restraint.name == Name) return restraint;
	}
	return null;
}

function KinkyDungeonGetRestraint(enemy, Level, Index, Bypass, Lock) {
	var restraintWeightTotal = 0;
	var restraintWeights = [];

	for (let L = 0; L < KinkyDungeonRestraints.length; L++) {
		var restraint = KinkyDungeonRestraints[L];
		var currentRestraint = KinkyDungeonGetRestraintItem(restraint.Group);
		if (Level >= restraint.minLevel && restraint.floors.includes(Index) && (!currentRestraint || !currentRestraint.restraint ||
			(currentRestraint.lock ? currentRestraint.restraint.power * 2 : currentRestraint.restraint.power) <
			(Lock ? restraint.power * 2 : restraint.power))
			&& (!InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, restraint.Group) || Bypass)) {
			restraintWeights.push({restraint: restraint, weight: restraintWeightTotal});
			restraintWeightTotal += restraint.weight;
			for (let T = 0; T < enemy.tags.length; T++)
				if (restraint.enemyTags[enemy.tags[T]]) restraintWeightTotal += restraint.enemyTags[enemy.tags[T]];
		}
	}

	var selection = Math.random() * restraintWeightTotal;

	for (let L = restraintWeights.length - 1; L >= 0; L--) {
		if (selection > restraintWeights[L].weight) {
			return restraintWeights[L].restraint;
		}
	}

}

function KinkyDungeonUpdateRestraints(delta) {
	var playerTags = [];
	for (let G = 0; G < KinkyDungeonPlayer.Appearance; G++) {
		if (KinkyDungeonPlayer.Appearance[G].Asset) {
			var group = KinkyDungeonPlayer.Appearance[G].Asset.Group;
			if (group) {
				if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, group.Name)) playerTags.push(group.Name + "Blocked");
				if (InventoryGet(KinkyDungeonPlayer, group.Name)) playerTags.push(group.Name + "Full");
			}
		}

	}
	return playerTags;
}


function KinkyDungeonAddRestraintIfWeaker(restraint, Tightness, Bypass, Lock) {
	let r = KinkyDungeonGetRestraintItem(restraint.Group);
	if (!r || (r.restraint && (r.lock ? r.restraint.power * 2 : r.restraint.power) < (Lock ? restraint.power * 2 : restraint.power))) {
		return KinkyDungeonAddRestraint(restraint, Tightness, Bypass);
	}
	return 0;
}

function KinkyDungeonAddRestraint(restraint, Tightness, Bypass) {
	var tight = (Tightness) ? Tightness : 0;
	if (restraint) {
		if (!InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, restraint.Group) || Bypass) {
			KinkyDungeonRemoveRestraint(restraint.Group);
			InventoryWear(KinkyDungeonPlayer, restraint.Asset, restraint.Group, restraint.power);
			if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && !KinkyDungeonRestraintsLocked.includes(restraint.Group) && restraint.Group != "ItemHead" &&
				(!InventoryGetLock(InventoryGet(Player, restraint.Group))
				|| (InventoryGetLock(InventoryGet(Player, restraint.Group)).Asset.OwnerOnly == false && InventoryGetLock(InventoryGet(Player, restraint.Group)).Asset.LoverOnly == false)))
					InventoryWear(Player, restraint.Asset, restraint.Group, restraint.power);
			if (restraint.Type) {
				KinkyDungeonPlayer.FocusGroup = AssetGroupGet("Female3DCG", restraint.Group);
				var options = window["Inventory" + ((restraint.Group.includes("ItemMouth")) ? "ItemMouth" : restraint.Group) + restraint.Asset + "Options"];
				if (!options) options = TypedItemDataLookup[`${restraint.Group}${restraint.Asset}`].options; // Try again
				const option = options.find(o => o.Name === restraint.Type);
				ExtendedItemSetType(KinkyDungeonPlayer, options, option);
				if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && !KinkyDungeonRestraintsLocked.includes(restraint.Group) &&
					(!InventoryGetLock(InventoryGet(Player, restraint.Group)) || (InventoryGetLock(InventoryGet(Player, restraint.Group)).Asset.OwnerOnly == false && InventoryGetLock(InventoryGet(Player, restraint.Group)).Asset.LoverOnly == false))
					&& restraint.Group != "ItemHead") {
					Player.FocusGroup = AssetGroupGet("Female3DCG", restraint.Group);
					ExtendedItemSetType(Player, options, option);
					Player.FocusGroup = null;
				}
				KinkyDungeonPlayer.FocusGroup = null;
			}
			if (restraint.OverridePriority) {
				if (!InventoryGet(KinkyDungeonPlayer, restraint.Group).Property) InventoryGet(KinkyDungeonPlayer, restraint.Group).Property = {OverridePriority: restraint.OverridePriority}
			}
			if (restraint.Color) {
				CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, restraint.Color, restraint.Group);
				if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && !KinkyDungeonRestraintsLocked.includes(restraint.Group) &&
					(!InventoryGetLock(InventoryGet(Player, restraint.Group)) || (InventoryGetLock(InventoryGet(Player, restraint.Group)).Asset.OwnerOnly == false && InventoryGetLock(InventoryGet(Player, restraint.Group)).Asset.LoverOnly == false))
					&& restraint.Group != "ItemHead")
					CharacterAppearanceSetColorForGroup(Player, restraint.Color, restraint.Group);
			}
			KinkyDungeonInventory.push({restraint: restraint, tightness: tight, lock: ""});
		}

		KinkyDungeonUpdateRestraints(0); // We update the restraints but no time drain on batteries, etc
		KinkyDungeonCheckClothesLoss = true; // We signal it is OK to check whether the player should get undressed due to restraints
		return Math.max(1, restraint.power);
	}
	return 0;
}

function KinkyDungeonRemoveRestraint(Group) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
			var item = KinkyDungeonInventory[I];
			if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && !KinkyDungeonRestraintsLocked.includes(Group) && InventoryGet(Player, Group) &&
					(!InventoryGetLock(InventoryGet(Player, Group)) || (InventoryGetLock(InventoryGet(Player, Group)).Asset.OwnerOnly == false && InventoryGetLock(InventoryGet(Player, Group)).Asset.LoverOnly == false))
					&& Group != "ItemHead") {
				InventoryRemove(Player, Group);
				if (Group == "ItemNeck") {
					InventoryRemove(Player, "ItemNeckAccessories");
					InventoryRemove(Player, "ItemNeckRestraints");
				}
			}
			if ((item.restraint && item.restraint.Group == Group)) {
				KinkyDungeonInventory.splice(I, 1);
				InventoryRemove(KinkyDungeonPlayer, Group);

				KinkyDungeonCalculateSlowLevel();

				return true;
			}
		}
	return false;
}
