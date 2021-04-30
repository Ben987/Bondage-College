"use strict";
var KinkyDungeonEnemies = [
	{name: "BlindZombie", tags: ["zombie", "melee", "ribbonRestraints"], hp: 10, AI: "wander", visionRadius: 1, maxhp: 8, minLevel:0, weight:14, movePoints: 3, attackPoints: 3, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 10, terrainTags: {}, floors:[0], dropTable: [{name: "Gold", amountMin: 20, amountMax: 30, weight: 2}, {name: "Gold", amountMin: 3, amountMax: 9, weight: 5}]},
	{name: "FastZombie", tags: ["zombie", "melee", "ribbonRestraints"], hp: 10, AI: "guard", visionRadius: 6, maxhp: 10, minLevel:3, weight:6, movePoints: 3, attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 10, terrainTags: {"secondhalf":10, "lastthird":14}, floors:[0], dropTable: [{name: "Gold", amountMin: 50, amountMax: 80, weight: 2}, {name: "Gold", amountMin: 15, amountMax: 29, weight: 5}]},
	{name: "Rat", tags: ["beast", "melee", "minor"], hp: 4, AI: "guard", visionRadius: 4, visionradius: 1, maxhp: 4, minLevel:0, weight:3, movePoints: 1.5, attackPoints: 2, attack: "MeleeWill", attackWidth: 1, attackRange: 1, power: 4, dmgType: "pain", terrainTags: {"rubble":20}, floors:[0, 1, 2, 3]},

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
			DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Enemies/" + sprite + ".png",
				KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
				(KinkyDungeonEntities[E].x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonEntities[E].y - CamY)*KinkyDungeonGridSizeDisplay,
				KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false)
				
			if (enemy.stun > 0) {
				DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Stun.png",
					KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
					(KinkyDungeonEntities[E].x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonEntities[E].y - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false)
					
			}
				
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
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Warning.png",
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
		
		// Delete the enemy
		if (enemy.hp <= 0) {
			KinkyDungeonEntities.splice(E, 1)
			E -= 1
			if (enemy == KinkyDungeonKilledEnemy && enemy.Enemy.maxhp > KinkyDungeonActionMessagePriority-1) {
				
				KinkyDungeonActionMessageTime = 1
				KinkyDungeonActionMessage = TextGet("Kill"+enemy.Enemy.name)
				KinkyDungeonActionMessageColor = "orange"
				KinkyDungeonActionMessagePriority = 1
				
				KinkyDungeonKilledEnemy = null
			}
			
			KinkyDungeonItemDrop(enemy.x, enemy.y, enemy.Enemy.dropTable)
			continue;
		}
		
		var idle = true
		var moved = false
		
		if (enemy.stun > 0) {
			enemy.stun -= delta
		} else {
			
			var AI = enemy.Enemy.AI
			if (!enemy.warningTiles) enemy.warningTiles = []
			var playerDist = Math.sqrt((enemy.x - KinkyDungeonPlayerEntity.x)*(enemy.x - KinkyDungeonPlayerEntity.x) + (enemy.y - KinkyDungeonPlayerEntity.y)*(enemy.y - KinkyDungeonPlayerEntity.y))
			
			if (AI == "wander") {
				idle = true
				if (playerDist > enemy.Enemy.attackRange + 0.5)
					for (let T = 0; T < 8; T++) { // try 8 times
						let dir = KinkyDungeonGetDirection(10*(Math.random()-0.5), 10*(Math.random()-0.5))
						if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true
							idle = false
							break;
						}
					}
			} else if (AI == "guard" && (enemy.Enemy.attackWhileMoving || playerDist > enemy.Enemy.attackRange + 0.5)) {
				if (!enemy.gx) enemy.gx = enemy.x
				if (!enemy.gy) enemy.gy = enemy.y
				
				
				
				idle = true
				// try 8 times to find a moveable time, with some random variance
				if (playerDist <= enemy.Enemy.visionRadius)
					for (let T = 0; T < 8; T++) {
						let dir = KinkyDungeonGetDirectionRandom(KinkyDungeonPlayerEntity.x - enemy.x, KinkyDungeonPlayerEntity.y - enemy.y)
						if (T > 5) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10)
						if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true
							idle = false
							break;
						}
					}
				else if (Math.abs(enemy.x - enemy.gx) > 0 || Math.abs(enemy.y - enemy.gy) > 0)
					for (let T = 0; T < 8; T++) {
						let dir = KinkyDungeonGetDirectionRandom(enemy.gx - enemy.x, enemy.gy - enemy.y)
						if (T > 5) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10)
						if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true
							idle = false
							break;
						}
					}
			}
			playerDist = Math.sqrt((enemy.x - KinkyDungeonPlayerEntity.x)*(enemy.x - KinkyDungeonPlayerEntity.x) + (enemy.y - KinkyDungeonPlayerEntity.y)*(enemy.y - KinkyDungeonPlayerEntity.y))
			
			if ((!moved || enemy.Enemy.attackWhileMoving) && enemy.Enemy.attack.includes("Melee") && playerDist < enemy.Enemy.attackRange + 0.5) {//Player is adjacent
				idle = false;
			
				let dir = KinkyDungeonGetDirection(KinkyDungeonPlayerEntity.x - enemy.x, KinkyDungeonPlayerEntity.y - enemy.y)
				
				
				if (!KinkyDungeonEnemyTryAttack(enemy, [dir], delta, enemy.x + dir.x, enemy.y + dir.y)) {
					if (enemy.warningTiles.length == 0)
						enemy.warningTiles = KinkyDungeonGetWarningTiles(KinkyDungeonPlayerEntity.x - enemy.x, KinkyDungeonPlayerEntity.y - enemy.y, enemy.Enemy.attackRange, enemy.Enemy.attackWidth)
					
					if (enemy.Enemy.attack.includes("Bind")) {
						let caught = false
						for (let W = 0; W < enemy.warningTiles.length; W++) {
							let tile = enemy.warningTiles[W]
							if (enemy.x + tile.x == KinkyDungeonPlayerEntity.x && enemy.y + tile.y == KinkyDungeonPlayerEntity.y) {
								caught = true;
								break;
							}
						}
						if (caught && KinkyDungeonGetRestraintItem("ItemTorso") && KinkyDungeonGetRestraintItem("ItemTorso").restraint && KinkyDungeonGetRestraintItem("ItemTorso").restraint.harness) {
							let roll = Math.random()
							for (let T = 0; T < KinkyDungeonSlowLevel/2; T++) {
								roll = Math.max(roll, Math.random())
							}
							if (roll > KinkyDungeonTorsoGrabChance) {
								KinkyDungeonMovePoints = -1
								
								if (2 > KinkyDungeonTextMessagePriority) {
									KinkyDungeonTextMessageTime = 1
									
									KinkyDungeonTextMessage = TextGet("KinkyDungeonTorsoGrab")
									KinkyDungeonTextMessagePriority = 2
									
									KinkyDungeonTextMessage = KinkyDungeonTextMessage.replace("EnemyName", TextGet("Name" + enemy.Enemy.name))
									KinkyDungeonTextMessageColor = "yellow"
								}
							}
						}
					}
				} else { // Attack lands!
					let hit = false
					for (let W = 0; W < enemy.warningTiles.length; W++) {
						let tile = enemy.warningTiles[W]
						if (enemy.x + tile.x == KinkyDungeonPlayerEntity.x && enemy.y + tile.y == KinkyDungeonPlayerEntity.y) {
							hit = true;
							break;
						}
					}
					if (hit) {
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
						if (enemy.Enemy.attack.includes("Will") || willpowerDamage > 0) {
							if (willpowerDamage == 0)
								willpowerDamage += enemy.Enemy.power
							replace.push({keyword:"DamageTaken", value: willpowerDamage})
							msgColor = "#ff8888"
						}
						var happened = 0
						var bound = 0
						happened += KinkyDungeonDealDamage({damage: willpowerDamage, type: enemy.Enemy.dmgType})
						bound += KinkyDungeonAddRestraint(restraintAdd, enemy.Enemy.power) * 10
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
					
					enemy.warningTiles = []
				}
			} else {
				enemy.warningTiles = []
				enemy.attackPoints = 0
			}
		}
		
		if (idle) {
			enemy.movePoints = 0
			enemy.attackPoints = 0
			enemy.warningTiles = []
		}
		
	}
}

function KinkyDungeonNoEnemy(x, y, Player) {
	
	if (KinkyDungeonEnemyAt(x, y)) return false
	if (Player && (KinkyDungeonPlayerEntity.x == x && KinkyDungeonPlayerEntity.y == y)) return false
	return true
}

function KinkyDungeonEnemyAt(x, y) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		if (KinkyDungeonEntities[E].x == x && KinkyDungeonEntities[E].y == y)
			return KinkyDungeonEntities[E];
	}
	return null
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


function KinkyDungeonGetWarningTiles(dx, dy, range, width) {
	if (range == 1 && width == 8) return KinkyDungeonGetWarningTilesAdj()
	
	var arr = []
	var cone = 0.78539816 * (width-0.9)/2
	var angle_player = Math.atan2(dx, dy) + ((width % 2 == 0) ? ((Math.random() > 0.5) ? -0.39269908 : 39269908) : 0)
	if (angle_player > Math.PI) angle_player -= Math.PI;
	if (angle_player < -Math.PI) angle_player += Math.PI;
	
	for (let X = -range; X <= range; X++)
		for (let Y = -range; Y <= range; Y++) {
			var angle = Math.atan2(X, Y);
			
			var angleDiff = angle - angle_player
			angleDiff += (angleDiff>Math.PI) ? -2*Math.PI : (angleDiff<-Math.PI) ? 2*Math.PI : 0
			
			if (Math.abs(angleDiff) < cone + 0.1 && Math.sqrt(X*X + Y*Y) < range + 0.5) arr.push({x:X, y:Y})
			
		}
	
	
	return arr
}
