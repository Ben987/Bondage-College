// Escape chances
// Struggle : How difficult it is to struggle out of the item. Handcuffs and such can have a nonzero, but low value
// Cut : How difficult it is to cut with a knife. Metal items should have 0, rope and leather should be low but possible, and stuff like tape should be high
// Remove : How difficult it is to get it off by unbuckling. Most items should have a high chance if they have buckles, medium chance if they have knots, and low chance if they have a difficult mechanism.
// Pick : How hard it is to pick the lock on the item. Higher level items have more powerful locks. The general formula is 0.33 for easy items, 0.1 for medium items, 0.05 for hard items, and 0.01 for super punishing items
// Unlock : How hard it is to reach the lock. Should be higher than the pick chance, and based on accessibility. Items like the 

// Note that there is a complex formula for how the chances are manipulated based on whether your arms are bound. Items that bind the arms are generally unaffected, and items that bind the hands are unaffected, but they do affect each other

var KinkyDungeonRestraints = [
	{name: "DuctTapeArms", Asset: "DuctTape", Color: "#AA2222", Group: "ItemArms", magic: false, power: -2, weight: 1, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5}, enemyTags: {"ribbonRestraints":2}, playerTags: {"ItemArmsFull":8}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeFeet", Asset: "DuctTape", Color: "#AA2222", Group: "ItemFeet", magic: false, power: -2, weight: 1, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5}, enemyTags: {"ribbonRestraints":2}, playerTags: {"ItemLegsFull":8}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeBoots", Asset: "ToeTape", Color: "#AA2222", Group: "ItemBoots", magic: false, power: -2, weight: 1, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5}, enemyTags: {"ribbonRestraints":2}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeLegs", Asset: "DuctTape", Color: "#AA2222", Group: "ItemLegs", magic: false, power: -2, weight: 1, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5}, enemyTags: {"ribbonRestraints":2}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeHead", Asset: "DuctTape", Color: "#AA2222", Group: "ItemHead", magic: false, power: -2, weight: 1, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5}, enemyTags: {"ribbonRestraints":2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeMouth", Asset: "DuctTape", Color: "#AA2222", Group: "ItemMouth2", magic: false, power: -2, weight: 1, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0.5},
		enemyTags: {"ribbonRestraints":2}, playerTags: {"ItemMouth1Full":8}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeHeadMummy", Type: "Mummy", Asset: "DuctTape", Color: "#AA2222", Group: "ItemHead", magic: false, power: 1, weight: 0.5,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0.4},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemMouth1Full":2, "ItemMouth2Full":1}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeArmsMummy", Type: "Complete", Asset: "DuctTape", Color: "#AA2222", Group: "ItemArms", magic: false, power: 6, weight: 0.5,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0.4},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemArmsFull":3}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeLegsMummy", Type: "CompleteLegs", Asset: "DuctTape", Color: "#AA2222", Group: "ItemLegs", magic: false, power: 1, weight: 0.5,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0.4},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemLegsFull":3}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeLegsMummy", Type: "CompleteLegs", Asset: "DuctTape", Color: "#AA2222", Group: "ItemLegs", magic: false, power: 1, weight: 0.5,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0.4},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemLegsFull":3}, minLevel: 0, floors: [0, 1, 2, 3]},
	{name: "DuctTapeFeetMummy", Type: "CompleteFeet", Asset: "DuctTape", Color: "#AA2222", Group: "ItemFeet", magic: false, power: 1, weight: 0.5,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0.4},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemFeetFull":3}, minLevel: 0, floors: [0, 1, 2, 3]},
	
	
	{name: "Stuffing", Asset: "ClothStuffing", Group: "ItemMouth", power: -20, weight: 1, escapeChance: {"Struggle": 1, "Cut": 1, "Remove": 1}, enemyTags: {"ribbonRestraints":8}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7]},
]


// Lockpick = use tool or cut
// Otherwise, just a normal struggle
function KinkyDungeonStruggle(struggleGroup, StruggleType) {
	var restraint = KinkyDungeonGetRestraintItem(struggleGroup.group)
	var cost = (StruggleType == "Pick" || StruggleType == "Cut") ? KinkyDungeonStatStaminaCostTool : KinkyDungeonStatStaminaCostStruggle
	if (StruggleType == "Unlock") cost = 0
	var Pass = "Fail"
	var escapeChance = (restraint.restraint.escapeChance[StruggleType]) ? restraint.restraint.escapeChance[StruggleType] : 1.0
		
	
	if (!KinkyDungeonPlayer.CanInteract) escapeChance /= 2
	if (struggleGroup.group != "ItemArms" && InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemArms"), "Block", true)) escapeChance = Math.max(0.1 - Math.max(0, 0.005*restraint.restraint.power), escapeChance - 0.25)
	if (struggleGroup.group != "ItemHands" && InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true)) escapeChance = Math.max(0.1 - Math.max(0, 0.005*restraint.restraint.power), escapeChance - 0.25)
	
	if (InventoryGroupIsBlocked(KinkyDungeonPlayer, struggleGroup.group)) escapeChance = 0
	
	if (escapeChance > 0) {
		for (let T = 0; T < restraint.tightness; T++) {
			escapeChance *= 0.9 // Tougher for each tightness, however struggling will reduce the tightness
		}
	}
		
	if (StruggleType == "Unlock" && !((restraint.lock == "Red" && KinkyDungeonRedKeys > 0) || (restraint.lock == "Green" && KinkyDungeonGreenKeys > 0) || (restraint.lock == "Yellow" && KinkyDungeonRedKeys > 0 && KinkyDungeonGreenKeys > 0) || (restraint.lock == "Blue" && KinkyDungeonBlueKeys > 0))) {
		
		if (10 >= KinkyDungeonActionMessagePriority) {
			KinkyDungeonActionMessageTime = 2
			KinkyDungeonActionMessage = TextGet("KinkyDungeonStruggleUnlockNo" + (KinkyDungeonPlayer.IsBlind() > 0) ? "Unknown" : restraint.lock + "Key")
			KinkyDungeonActionMessageColor = "orange"
			KinkyDungeonActionMessagePriority = 10
		}
	} else {
		
		if (KinkyDungeonStatStamina + KinkyDungeonStaminaRate < -cost) {
			if ( 1 > KinkyDungeonTextMessagePriority) {
				KinkyDungeonActionMessageTime = 2
				KinkyDungeonActionMessage = TextGet("Wait")
				KinkyDungeonActionMessageColor = "#AAAAAA"
				KinkyDungeonActionMessagePriority = 0
			}
		} else {
			if (Math.random() < escapeChance) {
				Pass = "Success"
				if (StruggleType == "Pick" || StruggleType == "Unlock") {
					if (StruggleType == "Unlock") {
						if ((restraint.lock == "Red" && KinkyDungeonRedKeys > 0) || (restraint.lock == "Green" && KinkyDungeonGreenKeys > 0) || (restraint.lock == "Yellow" && KinkyDungeonRedKeys > 0 && KinkyDungeonGreenKeys > 0) || (restraint.lock == "Blue" && KinkyDungeonBlueKeys > 0)) {
							if (restraint.lock != "Green" || (Math.random() < KinkyDungeonKeyJamChance)) {
								restraint.lock = ""
								if (restraint.lock == "Red") KinkyDungeonRedKeys -= 1
								if (restraint.lock == "Yellow") {KinkyDungeonRedKeys -= 1; KinkyDungeonGreenKeys -= 1; }
								if (restraint.lock == "Blue") KinkyDungeonBlueKeys -= 1
							} else {
								Pass = "Jammed"
								restraint.lock = "Jammed"
								KinkyDungeonGreenKeys -= 1
							}
						}
					} else {
						restraint.lock = ""
					}
				} else {
					KinkyDungeonRemoveRestraint(restraint.restraint.Group)
				}
			} else {
				if (StruggleType == "Cut") {
					if (restraint.restraint.magic && KinkyDungeonEnchantedBlades == 0) Pass = "Fail"
					if (Math.random() < KinkyDungeonKnifeBreakChance) {
						Pass = "Break"
						if (restraint.restraint.magic && KinkyDungeonEnchantedBlades > 0) KinkyDungeonEnchantedBlades -= 1
						else {
							if (KinkyDungeonNormalBlades > 0)
								KinkyDungeonNormalBlades -= 1
							else if (KinkyDungeonEnchantedBlades > 0) {
								KinkyDungeonEnchantedBlades -= 1
							}
						}
					}
				} else {
					if (StruggleType == "Pick") {
						if (Math.random() < KinkyDungeonKeyPickBreakChance) {
							Pass = "Break"
							KinkyDungeonLockpicks -= 1
						}
					}
				}
			}
			
			if (10 >= KinkyDungeonActionMessagePriority) {
				KinkyDungeonActionMessageTime = 2
				KinkyDungeonActionMessage = TextGet("KinkyDungeonStruggle" + StruggleType + Pass).replace("TargetRestraint", TextGet("Restraint" + restraint.restraint.name))
				KinkyDungeonActionMessageColor = (Pass == "Success") ? "lightgreen" : "red"
				KinkyDungeonActionMessagePriority = 10
			}
			
			
			KinkyDungeonStatStamina += cost
			
			if (Pass != "Success") {
				KinkyDungeonStatWillpower += KinkyDungeonStatWillpowerCostStruggleFail
				
				if (StruggleType == "Struggle") {
					var tightness_reduction = 1
					
					for (let I = 0; I < KinkyDungeonInventory.length; I++) {
						if (KinkyDungeonInventory[I].restraint) {
							tightness_reduction *= 0.8 // Reduced tightness reduction for each restraint
						}
					}
					
					restraint.tightness = Math.max(0, restraint.tightness - tightness_reduction)
				}
			}
		}
		
		
		KinkyDungeonAdvanceTime(1)
	}
}

function KinkyDungeonGetRestraintItem(group) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I]
		if (item.restraint && item.restraint.Group == group) {
			return item
		}
	}
	return null;
}

function KinkyDungeonGetRestraint(enemy, Level, Index, Bypass) {
	var restraintWeightTotal = 0
	var restraintWeights = []
	
	for (let L = 0; L < KinkyDungeonRestraints.length; L++) {
		var restraint = KinkyDungeonRestraints[L]
		var asset = InventoryGet(KinkyDungeonPlayer, restraint.Group)
		if (Level >= restraint.minLevel && restraint.floors.includes(Index) && (!asset || (asset.Difficulty < restraint.power && (!asset.Property || asset.Property.Difficulty < restraint.power))) && (!InventoryGroupIsBlocked(KinkyDungeonPlayer, restraint.Group) || Bypass)) {
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

function KinkyDungeonAddRestraint(restraint, Tightness, Bypass) {
	var tight = (Tightness) ? Tightness : 0
	if (restraint) {
		if (!InventoryGroupIsBlocked(KinkyDungeonPlayer, restraint.Group) || Bypass) {
			KinkyDungeonRemoveRestraint(restraint.Group)
			InventoryWear(KinkyDungeonPlayer, restraint.Asset, restraint.Group)
			if (restraint.Type) {
				KinkyDungeonPlayer.FocusGroup = AssetGroupGet("Female3DCG", restraint.Group)
				const options = window["Inventory" + restraint.Group + restraint.Asset + "Options"]
				const option = options.find(o => o.Name === restraint.Type);
				ExtendedItemSetType(KinkyDungeonPlayer, options, option);
				KinkyDungeonPlayer.FocusGroup = null
			}
			if (restraint.Color) {
				CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, restraint.Color, restraint.Group);
			}
			KinkyDungeonInventory.push({restraint: restraint, tightness: tight, lock: ""})
		}
		
		KinkyDungeonUpdateRestraints(0) // We update the restraints but no time drain on batteries, etc
		return Math.max(1, restraint.power)
	}
	return 0
}

function KinkyDungeonRemoveRestraint(Group) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
			var item = KinkyDungeonInventory[I]
			if (item.restraint && item.restraint.Group == Group) {
				KinkyDungeonInventory.splice(I, 1);
				InventoryRemove(KinkyDungeonPlayer, Group)
				return true;
			}
		}
	return false
}