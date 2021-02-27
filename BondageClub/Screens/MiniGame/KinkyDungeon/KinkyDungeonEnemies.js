var KinkyDungeonEnemies = [
	{name: "BlindZombie", tags: ["zombie", "melee", "simpleRestraints"], AI: "wander", visionRadius: 1, maxhp: 2, minLevel:0, weight:4, movePoints: 3, attackPoints: 3, attack: "MeleeBindWill", power: 1, fullBoundBonus: 9, terrainTags: {}, floors:[0], },
	{name: "Rat", tags: ["beast", "melee"], AI: "guard", visionRadius: 4, visionradius: 1, maxhp: 1, minLevel:0, weight:1, movePoints: 1.5, attackPoints: 2, attack: "MeleeWill", power: 1, terrainTags: {"rubble":20}, floors:[0, 1, 2, 3]},

]


function KinkyDungeonGetEnemy(tags, Level, Index) {
	var enemyWeightTotal = 0
	var enemyWeights = []
	
	for (let L = 0; L < KinkyDungeonEnemies.length; L++) {
		var enemy = KinkyDungeonEnemies[L]
		if (Level >= enemy.minLevel && enemy.floors.includes(Index)) {
			enemyWeights.push({enemy: enemy, weight: enemyWeightTotal})
			enemyWeightTotal += enemy.weight
			for (let T = 0; T < tags.length; T++)
				if (enemy.terrainTags[tags[T]]) enemyWeightTotal += enemy.terrainTags[tags[T]]
		}
	}
	
	var selection = Math.random() * enemyWeightTotal
	
	for (let L = enemyWeights.length - 1; L >= 0; L--) {
		if (selection > enemyWeights[L].weight) {
			return enemyWeights[L].enemy
		}
	}
}

function KinkyDungeonDrawEnemies(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E]
		var sprite = enemy.Enemy.name
		if (KinkyDungeonEntities[E].x >= CamX && KinkyDungeonEntities[E].y >= CamY && KinkyDungeonEntities[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonEntities[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			DrawImageZoomCanvas("Screens/Minigame/KinkyDungeon/Enemies/" + sprite + ".png",
				KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
				(KinkyDungeonEntities[E].x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonEntities[E].y - CamY)*KinkyDungeonGridSizeDisplay,
				KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false)
				
				
		}
		

	}
}


function KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E]
			if (enemy.warningTiles) {
			for (let T=0; T<enemy.warningTiles.length; T++) {
				var tx = enemy.x + enemy.warningTiles[T].x
				var ty = enemy.y + enemy.warningTiles[T].y
				if (tx >= CamX && ty >= CamY && tx < CamX + KinkyDungeonGridWidthDisplay && ty < CamY + KinkyDungeonGridHeightDisplay && KinkyDungeonNoEnemy(tx, ty) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(tx, ty))) {
					DrawImageZoomCanvas("Screens/Minigame/KinkyDungeon/Warning.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false)
						
						
				}
			}
		}
	}
}


function KinkyDungeonUpdateEnemies(delta) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E]
		var AI = enemy.Enemy.AI
		var idle = true
		if (!enemy.warningTiles) enemy.warningTiles = []
		var playerDist = Math.sqrt((enemy.x - KinkyDungeonPlayerEntity.x)*(enemy.x - KinkyDungeonPlayerEntity.x) + (enemy.y - KinkyDungeonPlayerEntity.y)*(enemy.y - KinkyDungeonPlayerEntity.y))
		
		if (AI == "wander") {
			idle = true
			if (playerDist > 1.99)
				for (let T = 0; T < 8; T++) { // try 8 times
					var dir = KinkyDungeonGetDirection(10*(Math.random()-0.5), 10*(Math.random()-0.5))
					if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
						KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)
						idle = false
						break;
					}
				}
		} else if (AI == "guard") {
			if (!enemy.gx) enemy.gx = enemy.x
			if (!enemy.gy) enemy.gy = enemy.y
			
			
			
			idle = true
			// try 8 times to find a moveable time, with some random variance
			if (playerDist <= enemy.Enemy.visionRadius)
				for (let T = 0; T < 8; T++) {
					var dir = KinkyDungeonGetDirectionRandom(KinkyDungeonPlayerEntity.x - enemy.x, KinkyDungeonPlayerEntity.y - enemy.y)
					if (T > 5) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10)
					if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
						KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)
						idle = false
						break;
					}
				}
			else if (Math.abs(enemy.x - enemy.gx) > 0 || Math.abs(enemy.y - enemy.gy) > 0)
				for (let T = 0; T < 8; T++) {
					var dir = KinkyDungeonGetDirectionRandom(enemy.gx - enemy.x, enemy.gy - enemy.y)
					if (T > 5) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10)
					if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
						KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)
						idle = false
						break;
					}
				}
		}
		playerDist = Math.sqrt((enemy.x - KinkyDungeonPlayerEntity.x)*(enemy.x - KinkyDungeonPlayerEntity.x) + (enemy.y - KinkyDungeonPlayerEntity.y)*(enemy.y - KinkyDungeonPlayerEntity.y))
		
		if (enemy.Enemy.attack.includes("Melee") && playerDist < 1.99) {//Player is adjacent
			idle = false;
		
			var dir = KinkyDungeonGetDirection(KinkyDungeonPlayerEntity.x - enemy.x, KinkyDungeonPlayerEntity.y - enemy.y)
			
			
			if (!KinkyDungeonEnemyTryAttack(enemy, [dir], delta, enemy.x + dir.x, enemy.y + dir.y)) {
				enemy.warningTiles = KinkyDungeonGetWarningTilesAdj()
			} else { // Attack lands!
				var replace = []
				var restraintAdd = null
				var willpowerDamage = 0
				var msgColor = "yellow"

				if (enemy.Enemy.attack.includes("Bind")) {
					// Note that higher power enemies get a bonus to the floor restraints appear on
					restraintAdd = KinkyDungeonGetRestraint(enemy.Enemy, MiniGameKinkyDungeonLevel + enemy.Enemy.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint])
					if (restraintAdd)
					    replace.push({keyword:"RestraintAdded", value: TextGet("Restraint" + restraintAdd.name)})
					else if (enemy.Enemy.fullBoundBonus)
						willpowerDamage += enemy.Enemy.fullBoundBonus // Some enemies deal bonus damage if they cannot put a binding on you
				}
				if (enemy.Enemy.attack.includes("Will")) {
					willpowerDamage += enemy.Enemy.power
					replace.push({keyword:"DamageTaken", value: willpowerDamage})
					msgColor = "#ff8888"
				}
				var happened = 0
				var bound = 0
				happened += KinkyDungeonDealDamage(willpowerDamage)
				bound += KinkyDungeonAddRestraint(restraintAdd) * 10
				happened += bound

				if (happened > 0 && happened > KinkyDungeonTextMessagePriority) {
					KinkyDungeonTextMessageTime = 1
					
					KinkyDungeonTextMessage = TextGet("Attack"+enemy.Enemy.name + ((bound > 0) ? "Bind" : ""))
					KinkyDungeonTextMessagePriority = happened
					
					if (replace)
						for (let R = 0; R < replace.length; R++)
							KinkyDungeonTextMessage = KinkyDungeonTextMessage.replace(replace[R].keyword, replace[R].value)
					KinkyDungeonTextMessageColor = msgColor
				}
			}
		} else {
			enemy.warningTiles = []
			enemy.attackPoints = 0
		}
		
		if (idle) {
			enemy.movePoints = 0
			enemy.attackPoints = 0
			enemy.warningTiles = []
		}
		
	}
}

function KinkyDungeonNoEnemy(x, y, Player) {
	
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		if (KinkyDungeonEntities[E].x == x && KinkyDungeonEntities[E].y == y)
			return false;
	}
	if (Player && (KinkyDungeonPlayerEntity.x == x && KinkyDungeonPlayerEntity.y == y)) return false
	return true
}

function KinkyDungeonEnemyTryMove(enemy, Direction, delta, x, y) {

	enemy.movePoints += delta
		
	if (enemy.movePoints >= enemy.Enemy.movePoints) {
		enemy.movePoints = 0
		enemy.x += Direction.x
		enemy.y += Direction.y
		
		if (KinkyDungeonMapGet(x, y) == 'D') {
			KinkyDungeonMapSet(x, y, 'd')
		}
		
		return true
	}
	return false
}

function KinkyDungeonEnemyTryAttack(enemy, Tiles, delta, x, y, replace, msgColor) {

	enemy.attackPoints += delta
		
	if (enemy.attackPoints >= enemy.Enemy.attackPoints) {
		enemy.attackPoints = 0
		
		for (let T = 0; T < Tiles.length; T++) {
			var ax = enemy.x + Tiles[T].x
			var ay = enemy.y + Tiles[T].y
			
			if (KinkyDungeonPlayerEntity.x == ax && KinkyDungeonPlayerEntity.y == ay) {
				return true
			}
		}
	}
	return false
}

function KinkyDungeonGetWarningTilesAdj() {
	var arr = []
	
	arr.push({x:1, y:1})
	arr.push({x:0, y:1})
	arr.push({x:1, y:0})
	arr.push({x:-1, y:-1})
	arr.push({x:-1, y:1})
	arr.push({x:1, y:-1})
	arr.push({x:-1, y:0})
	arr.push({x:0, y:-1})
	
	return arr
}