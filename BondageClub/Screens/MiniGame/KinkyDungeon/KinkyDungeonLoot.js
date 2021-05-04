"use strict";
var KinkyDungeonLootTable = {
	"rubble": [
		{name: "nothing", minLevel: 0, weight:6, message:"LootRubbleFail", messageColor:"#aaaaaa", messageTime: 2, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "smallgold", minLevel: 0, weight:10, message:"LootRubbleSmallGold", messageColor:"yellow", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "knife", minLevel: 0, weight:6, message:"LootRubbleKnife", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "pick", minLevel: 0, weight:10, message:"LootRubbleLockpick", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "redkey", minLevel: 0, weight:3, message:"LootRubbleRedKey", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "greenkey", minLevel: 0, weight:2, message:"LootRubbleGreenKey", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "bluekey", minLevel: 0, weight:1, message:"LootRubbleBlueKey", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
	],
	"chest": [
		{name: "gold", minLevel: 0, weight:4, message:"LootChestGold", messageColor:"yellow", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "spell_illusion_low", minLevel: 0, weight:1, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["UnlearnedIllusion", "lowlevel"]}, // lowlevel is spell levels 1-7
		{name: "spell_conjuration_low", minLevel: 0, weight:1, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["UnlearnedConjure", "lowlevel"]}, // lowlevel is spell levels 1-7
		{name: "spell_elemental_low", minLevel: 0, weight:1, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["UnlearnedElements", "lowlevel"]}, // lowlevel is spell levels 1-7
		{name: "trap_armbinder", minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemArms"], power: 8},
		{name: "trap_cuffs", minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemArms"], power: 8},
		{name: "trap_harness", minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemTorso"], power: 8},
		{name: "trap_gag", minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemMouth2"], power: 8},
		{name: "trap_blindfold", minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemHead"], power: 8},
		{name: "trap_boots", minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemBoots"], power: 8},
		{name: "trap_legirons", minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemFeet"], power: 8},
	],


};

function KinkyDungeonLoot(Level, Index, Type) {
	var lootWeightTotal = 0;
	var lootWeights = [];

	var lootType = KinkyDungeonLootTable[Type];
	for (let L = 0; L < lootType.length; L++) {
		var loot = lootType[L];
		if (Level >= loot.minLevel && loot.floors.includes(Index)) {
			var prereqs = true;

			if (loot.prerequisites) {

				var maxlevel = 999;
				var minlevel = 0;
				var SpellList = null;
				if (loot.prerequisites.includes("lowlevel")) maxlevel = 5;
				if (loot.prerequisites.includes("UnlearnedElements")) SpellList = KinkyDungeonSpellList.Elements;
				if (loot.prerequisites.includes("UnlearnedConjure")) SpellList = KinkyDungeonSpellList.Conjure;
				if (loot.prerequisites.includes("UnlearnedIllusion")) SpellList = KinkyDungeonSpellList.Illusion;

				for (let P = 0; P < loot.prerequisites.length; P++) {
					if (loot.prerequisites[P].startsWith("Group_")) {
						var group = loot.prerequisites[P].substring(6);
						var item = KinkyDungeonGetRestraintItem(group);
						if (item && item.restraint && item.restraint.power <= loot.power) {
							prereqs = false;
							break;
						}
					}
				}



				if (SpellList != null && KinkyDungeonGetUnlearnedSpells(minlevel, maxlevel, SpellList).length == 0) {
					prereqs = false;
				}
			}

			if (prereqs) {
				lootWeights.push({loot: loot, weight: lootWeightTotal});
				lootWeightTotal += loot.weight;
			}
		}
	}

	var selection = Math.random() * lootWeightTotal;

	for (let L = lootWeights.length - 1; L >= 0; L--) {
		if (selection > lootWeights[L].weight) {
			var replace = false;

			replace = KinkyDungeonSendActionMessage(6, TextGet(lootWeights[L].loot.message), lootWeights[L].loot.messageColor, lootWeights[L].loot.messageTime);

			KinkyDungeonLootEvent(lootWeights[L].loot, Index, replace);

			break;
		}
	}

}

function KinkyDungeonGetUnlearnedSpells(minlevel, maxlevel, SpellList) {
	var SpellsUnlearned = [];

	for (let S = 0; S < SpellList.length; S++) {
		if (SpellList[S].level >= minlevel && SpellList[S].level <= maxlevel) {
			SpellsUnlearned.push(SpellList[S]);
		}
	}
	for (let SS = 0; SS < KinkyDungeonSpells.length; SS++) {
		for (let S = 0; S < SpellsUnlearned.length; S++) {
			if (KinkyDungeonSpells[SS].name == SpellsUnlearned[S].name) {
				SpellsUnlearned.splice(S, 1);
			}
		}
	}

	return SpellsUnlearned;
}

function KinkyDungeonLootEvent(Loot, Index, Replacemsg) {
	//
	let value = 0;
	if (Loot.name == "spell_illusion_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList.Illusion);
		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "spell_conjuration_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList.Conjure);
		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "spell_elemental_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList.Elements);
		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "gold") {
		value = Math.ceil((25 + 25 * Math.random()) * (1 + Index/2));
	} else if (Loot.name == "smallgold") {
		value = Math.ceil((1 + 4 * Math.random()) * (1 + Index));
	} else if (Loot.name == "knife") {
		KinkyDungeonNormalBlades += 1;
	} else if (Loot.name == "magicknife") {
		KinkyDungeonEnchantedBlades += 1;
	}  else if (Loot.name == "pick") {
		KinkyDungeonLockpicks += 1;
	}  else if (Loot.name == "redkey") {
		KinkyDungeonRedKeys += 1;
	}  else if (Loot.name == "greenkey") {
		KinkyDungeonGreenKeys += 1;
	}  else if (Loot.name == "bluekey") {
		KinkyDungeonBlueKeys += 1;
	} else if (Loot.name == "trap_armbinder") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapArmbinder"), MiniGameKinkyDungeonCheckpoint);
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapArmbinder"));
	} else if (Loot.name == "trap_cuffs") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapCuffs"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemArms"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapCuffs"));
	} else if (Loot.name == "trap_harness") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapHarness"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemTorso"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapHarness"));
	} else if (Loot.name == "trap_gag") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemMouth2"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapGag"));
	} else if (Loot.name == "trap_boots") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBoots"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemBoots"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapBoots"));
	} else if (Loot.name == "trap_legirons") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapLegirons"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemFeet"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapLegirons"));
	} else if (Loot.name == "trap_blindfold") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBlindfold"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemHead"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapBlindfold"));
	}

	if (value > 0) {
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("XXX", value);
		KinkyDungeonAddGold(value);
	}
}


function KinkyDungeonAddGold(value) {
	KinkyDungeonGold += value;
	if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable()) CharacterChangeMoney(Player, Math.round(value/10));
}