"use strict";
var KinkyDungeonShrineBaseCosts = {
	"Charms": 10,
	"Leather": 15,
	"Metal": 20,
	"Will": 10,
}
var KinkyDungeonShrineCosts = {}
var KinkyDungeonShrineTypeRemove = ["Charms", "Leather", "Metal"] // These shrines will always remove restraints associated with their shrine

function KinkyDungeonShrineInit() {
	KinkyDungeonShrineCosts = {}
	
}

function KinkyDungeonShrineAvailable(type) {
	if (KinkyDungeonShrineTypeRemove.includes(type) && KinkyDungeonGetRestraintsWithShrine(type).length > 0) return true;
	else if (type == "Will" && (KinkyDungeonStatWillpower < KinkyDungeonStatWillpowerMax || KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax)) return true;
	
	return false
}


function KinkyDungeonShrineCost(type) {
	let mult = 1.0
	if (KinkyDungeonShrineCosts[type] > 0) mult = Math.pow(1.33, KinkyDungeonShrineCosts[type])
	
	return Math.round(KinkyDungeonShrineBaseCosts[type] * mult)
}

function KinkyDungeonPayShrine(type) {
	KinkyDungeonGold -= KinkyDungeonShrineCost(type)
	let ShrineMsg = ""
	
	// TODO shrine effects
	if (KinkyDungeonShrineTypeRemove.includes(type)) {
		KinkyDungeonRemoveRestraintsWithShrine(type);
		
		ShrineMsg = TextGet("KinkyDungeonPayShrineRemoveRestraints")
	} else if (type == "Will") {
		KinkyDungeonStatWillpower = KinkyDungeonStatWillpowerMax;
		KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
		
		ShrineMsg = TextGet("KinkyDungeonPayShrineHeal")	
	}
	
	if (ShrineMsg && 10 >= KinkyDungeonActionMessagePriority) {
		KinkyDungeonActionMessageTime = 1
		KinkyDungeonActionMessage = ShrineMsg
		KinkyDungeonActionMessagePriority = 10
		KinkyDungeonActionMessageColor = "lightblue"
	}
	
	if (KinkyDungeonShrineCosts[type] > 0) KinkyDungeonShrineCosts[type] = KinkyDungeonShrineCosts[type] + 1;
		else KinkyDungeonShrineCosts[type] = 1
}