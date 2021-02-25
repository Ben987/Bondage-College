var KinkyDungeonLootTable = {
	"rubble": [
		{name: "nothing", minLevel: 0, weight:1, message:"LootRubbleFail", messageColor:"#CCCCCC", messageTime: 5, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "smallgold", minLevel: 0, weight:2, message:"LootRubbleSmallGold", messageColor:"#CCCCCC", messageTime: 6, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
	],
	"chest": [
		{name: "gold", minLevel: 0, weight:1, message:"LootChestGold", messageColor:"#CCCCCC", messageTime: 7, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
	],
	
	
}

function KinkyDungeonLoot(Level, Index, Type) {
	var lootAvailable = []
	var lootWeightTotal = 0
	var lootWeights = []
	
	var lootType = KinkyDungeonLootTable[Type]
	for (let L = 0; L < lootType.length; L++) {
		var loot = lootType[L]
		if (Level >= loot.minLevel && loot.floors.includes(Index)) {
			lootAvailable.push(loot)
			lootWeights.push({loot: loot, weight: lootWeightTotal})
			lootWeightTotal += loot.weight
		}
	}
	
	var selection = Math.random() * lootWeightTotal
	
	for (let L = lootType.length - 1; L >= 0; L--) {
		if (selection > lootWeights[L].weight) {
			
			KinkyDungeonTextMessageTime = lootWeights[L].loot.messageTime
			KinkyDungeonTextMessage = TextGet(lootWeights[L].loot.message)
			KinkyDungeonTextMessageColor = lootWeights[L].loot.messageColor

			KinkyDungeonLootEvent(lootWeights[L].loot, Index)
			
			break;
		}
	}
	
}

function KinkyDungeonLootEvent(Loot, Index) {
	if (Loot.name == "gold") {
		var value = Math.ceil((30 + 70 * Math.random()) * (1 + Index/2))
		KinkyDungeonTextMessage = KinkyDungeonTextMessage.replace("XXX", value)
		KinkyDungeonAddGold(value)
	} else if (Loot.name == "smallgold") {
		var value = Math.ceil((1 + 9 * Math.random()) * (1 + Index/2))
		KinkyDungeonTextMessage = KinkyDungeonTextMessage.replace("XXX", value)
		KinkyDungeonAddGold(value)
	}
}


function KinkyDungeonAddGold(value) {
	KinkyDungeonGold += value
}