var KinkyDungeonLootTable = {
	"rubble": [
		{name: "nothing", minLevel: 0, weight:5, message:"LootRubbleFail", messageColor:"#aaaaaa", messageTime: 5, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "smallgold", minLevel: 0, weight:10, message:"LootRubbleSmallGold", messageColor:"yellow", messageTime: 6, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "knife", minLevel: 0, weight:3, message:"LootRubbleKnife", messageColor:"lightgreen", messageTime: 6, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
	],
	"chest": [
		{name: "gold", minLevel: 0, weight:1, message:"LootChestGold", messageColor:"yellow", messageTime: 7, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
	],
	
	
}

function KinkyDungeonLoot(Level, Index, Type) {
	var lootWeightTotal = 0
	var lootWeights = []
	
	var lootType = KinkyDungeonLootTable[Type]
	for (let L = 0; L < lootType.length; L++) {
		var loot = lootType[L]
		if (Level >= loot.minLevel && loot.floors.includes(Index)) {
			lootWeights.push({loot: loot, weight: lootWeightTotal})
			lootWeightTotal += loot.weight
		}
	}
	
	var selection = Math.random() * lootWeightTotal
	
	for (let L = lootWeights.length - 1; L >= 0; L--) {
		if (selection > lootWeights[L].weight) {
			var replace = false
			
			if (1 > KinkyDungeonActionMessagePriority) {
				KinkyDungeonActionMessageTime = lootWeights[L].loot.messageTime
				KinkyDungeonActionMessage = TextGet(lootWeights[L].loot.message)
				KinkyDungeonActionMessageColor = lootWeights[L].loot.messageColor
				KinkyDungeonActionMessagePriority = 1
				replace = true
			}

			KinkyDungeonLootEvent(lootWeights[L].loot, Index, replace)
			
			break;
		}
	}
	
}

function KinkyDungeonLootEvent(Loot, Index, Replacemsg) {
	if (Loot.name == "gold") {
		var value = Math.ceil((30 + 70 * Math.random()) * (1 + Index/2))
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("XXX", value)
		KinkyDungeonAddGold(value)
	} else if (Loot.name == "smallgold") {
		var value = Math.ceil((1 + 9 * Math.random()) * (1 + Index/2))
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("XXX", value)
		KinkyDungeonAddGold(value)
	} else if (Loot.name == "knife") {
		KinkyDungeonNormalBlades += 1
	}
}


function KinkyDungeonAddGold(value) {
	KinkyDungeonGold += value
	if (ArcadeDeviousChallenge) CharacterChangeMoney(Player, Math.ceil(value/10))
}