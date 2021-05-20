"use strict";
var KinkyDungeonShrineBaseCosts = {
	"Charms": 10,
	"Leather": 25,
	"Metal": 30,
	"Gags": 30,
	"Blindfolds": 30,
	"Boots": 30,
	"Rope": 15,
	"Locks": 25,
	"Will": 10,
	"Elements": 50,
	"Conjure": 50,
	"Illusion": 50,
};

var KinkyDungeonShrineBaseCostGrowth = {
	"Elements": 2,
	"Conjure": 2,
	"Illusion": 2,
};

var KinkyDungeonShrineCosts = {};
var KinkyDungeonShrineTypeRemove = ["Charms", "Leather", "Metal", "Rope", "Gags", "Blindfolds", "Boots"]; // These shrines will always remove restraints associated with their shrine

function KinkyDungeonShrineInit() {
	KinkyDungeonShrineCosts = {};

}

function KinkyDungeonShrineAvailable(type) {
	if (KinkyDungeonShrineTypeRemove.includes(type) && KinkyDungeonGetRestraintsWithShrine(type).length > 0) return true;
	else if ((type == "Elements" || type == "Illusion" || type == "Conjure") && KinkyDungeonGetUnlearnedSpells(0, 5 + MiniGameKinkyDungeonCheckpoint, KinkyDungeonSpellList[type]).length > 0) return true;
	else if (type == "Will" && (KinkyDungeonStatWillpower < KinkyDungeonStatWillpowerMax || KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax)) return true;

	return false;
}


function KinkyDungeonShrineCost(type) {
	let mult = 1.0;
	let growth = 1.33;
	if (KinkyDungeonShrineBaseCostGrowth[type]) growth = KinkyDungeonShrineBaseCostGrowth[type];
	if (KinkyDungeonShrineCosts[type] > 0) mult = Math.pow(growth, KinkyDungeonShrineCosts[type]);

	return Math.round(KinkyDungeonShrineBaseCosts[type] * mult);
}

function KinkyDungeonPayShrine(type) {
	KinkyDungeonGold -= KinkyDungeonShrineCost(type);
	let ShrineMsg = "";

	// TODO shrine effects
	if (KinkyDungeonShrineTypeRemove.includes(type)) {
		KinkyDungeonRemoveRestraintsWithShrine(type);

		ShrineMsg = TextGet("KinkyDungeonPayShrineRemoveRestraints");
	} else if (type == "Elements" || type == "Illusion" || type == "Conjure") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList[type]);
		if (Math.random() < 0.1 || SpellsUnlearned.length == 0) SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5 + MiniGameKinkyDungeonCheckpoint, KinkyDungeonSpellList[type]);
		
		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		ShrineMsg = TextGet("KinkyDungeonPayShrineSpell").replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (type == "Will") {
		KinkyDungeonStatWillpower = KinkyDungeonStatWillpowerMax;
		KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;

		ShrineMsg = TextGet("KinkyDungeonPayShrineHeal");
	}

	if (ShrineMsg) KinkyDungeonSendActionMessage(10, ShrineMsg, "lightblue", 1);

	if (KinkyDungeonShrineCosts[type] > 0) KinkyDungeonShrineCosts[type] = KinkyDungeonShrineCosts[type] + 1;
		else KinkyDungeonShrineCosts[type] = 1;
}