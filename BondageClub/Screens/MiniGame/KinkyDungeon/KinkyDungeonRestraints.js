var KinkyDungeonRestraints = [
	{name: "DuctTapeArms", Asset: "DuctTape", Group: "ItemArms", power: -2, weight: 1, escapeChanceStr: 0.5, escapeChanceAgi: 0.1, escapeChanceDex: 0.9, enemyTags: {"simpleRestraints":2}, playerTags: {"ItemArmsFull":8}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeFeet", Asset: "DuctTape", Group: "ItemFeet", power: -2, weight: 1, escapeChanceStr: 0.5, escapeChanceAgi: 0.1, escapeChanceDex: 0.9, enemyTags: {"simpleRestraints":2}, playerTags: {"ItemLegsFull":8}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeBoots", Asset: "ToeTape", Group: "ItemBoots", power: -2, weight: 1, escapeChanceStr: 0.5, escapeChanceAgi: 0.1, escapeChanceDex: 0.9, enemyTags: {"simpleRestraints":2}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeLegs", Asset: "DuctTape", Group: "ItemLegs", power: -2, weight: 1, escapeChanceStr: 0.5, escapeChanceAgi: 0.1, escapeChanceDex: 0.9, enemyTags: {"simpleRestraints":2}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeHead", Asset: "DuctTape", Group: "ItemHead", power: -2, weight: 1, escapeChanceStr: 0.5, escapeChanceAgi: 0.1, escapeChanceDex: 0.9, enemyTags: {"simpleRestraints":2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeMouth", Asset: "DuctTape", Group: "ItemMouth2", power: -2, weight: 1, escapeChanceStr: 0.5, escapeChanceAgi: 0.1, escapeChanceDex: 0.9, enemyTags: {"simpleRestraints":2}, playerTags: {"ItemMouth1Full":8}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeHeadMummy", options: InventoryItemHeadDuctTapeOptions, option:InventoryItemHeadDuctTapeOptions.find(o => o.Name === "Mummy"),
		Asset: "DuctTape", Group: "ItemHead", power: 1, weight: 0.5, escapeChanceStr: 0.3, escapeChanceAgi: 0.1, escapeChanceDex: 0.7, enemyTags: {"simpleRestraints":1}, playerTags: {"ItemMouth2Full":1, "ItemMouth2Full":1}, minLevel: 0, floors: [0, 1, 2, 3]},
	
	
	{name: "Stuffing", Asset: "ClothStuffing", Group: "ItemMouth", power: -20, weight: 1, escapeChanceStr: 1.0, escapeChanceAgi: 1.0, escapeChanceDex: 1.0, enemyTags: {"simpleRestraints":8}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7]},
]

function KinkyDungeonGetRestraint(enemy, Level, Index) {
	var restraintWeightTotal = 0
	var restraintWeights = []
	
	for (let L = 0; L < KinkyDungeonRestraints.length; L++) {
		var restraint = KinkyDungeonRestraints[L]
		var asset = InventoryGet(KinkyDungeonPlayer, restraint.Group)
		if (Level >= restraint.minLevel && restraint.floors.includes(Index) && (!asset || asset.power < restraint.power) && !InventoryGroupIsBlocked(KinkyDungeonPlayer, restraint.Group)) {
			restraintWeights.push({restraint: restraint, weight: restraintWeightTotal})
			restraintWeightTotal += restraint.weight
			for (let T = 0; T < enemy.tags.length; T++)
				if (restraint.enemyTags[enemy.tags[T]]) restraintWeightTotal += restraint.enemyTags[enemy.tags[T]]
		}
	}
	
	var selection = Math.random() * restraintWeightTotal
	
	for (let L = restraintWeights.length - 1; L >= 0; L--) {
		if (selection > restraintWeights[L].weight) {
			return restraintWeights[L].restraint
		}
	}
	
}

function KinkyDungeonUpdateRestraints(delta) {
	var playerTags = []
	for (let G = 0; G < KinkyDungeonPlayer.Appearance; G++) {
		if (KinkyDungeonPlayer.Appearance[G].Asset) {
			var group = KinkyDungeonPlayer.Appearance[G].Asset.Group
			if (group) {
				if (InventoryGroupIsBlocked(KinkyDungeonPlayer, group.Name)) playerTags.push(group.Name + "Blocked")
				if (InventoryGet(KinkyDungeonPlayer, group.Name)) playerTags.push(group.Name + "Full")
			}
		}
		
	}
	return playerTags;
}

function KinkyDungeonAddRestraint(restraint) {
	if (restraint) {
		if (!InventoryGroupIsBlocked(KinkyDungeonPlayer, restraint.Group)) {
			InventoryWear(KinkyDungeonPlayer, restraint.Asset, restraint.Group)
			if (restraint.option && restraint.options) {
				KinkyDungeonPlayer.FocusGroup = AssetGroupGet("Female3DCG", restraint.Group)
				const option = InventoryItemArmsDuctTapeOptions.find(o => o.Name === "Complete");
				ExtendedItemSetType(KinkyDungeonPlayer, restraint.options, restraint.option);
				KinkyDungeonPlayer.FocusGroup = null
			}
		}
		KinkyDungeonUpdateRestraints(0) // We update the restraints but no time drain on batteries, etc
		return Math.max(1, restraint.power)
	}
	return 0
}
