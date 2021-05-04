"use strict";
var KinkyDungeonEnemies = [
	{name: "BlindZombie", tags: ["zombie", "melee", "ribbonRestraints"], followRange: 1, AI: "wander", visionRadius: 1, maxhp: 8, minLevel:0, weight:14, movePoints: 3, attackPoints: 3, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 10, terrainTags: {}, floors:[0], dropTable: [{name: "Gold", amountMin: 20, amountMax: 40, weight: 2}, {name: "Gold", amountMin: 13, amountMax: 23, weight: 5}]},
	{name: "FastZombie", tags: ["zombie", "melee", "ribbonRestraints"], followRange: 1, AI: "guard", visionRadius: 6, maxhp: 10, minLevel:4, weight:6, movePoints: 3, attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 10, terrainTags: {"secondhalf":10, "lastthird":14}, floors:[0], dropTable: [{name: "Gold", amountMin: 50, amountMax: 80, weight: 2}, {name: "Gold", amountMin: 15, amountMax: 29, weight: 5}]},
	{name: "RopeSnake", tags: ["construct", "melee", "ropeRestraints", "minor", "fireweakness", "slashweakness"], followRange: 1, AI: "wander", attackWhileMoving: true, visionRadius: 3, maxhp: 4, minLevel:1, weight:8, movePoints: 1, attackPoints: 2, attack: "MeleeBindSuicide", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 10, terrainTags: {"secondhalf":4, "lastthird":2}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8]},
	{name: "Rat", tags: ["beast", "melee", "minor"], followRange: 1, AI: "guard", visionRadius: 4, maxhp: 4, minLevel:0, weight:3, movePoints: 1.5, attackPoints: 2, attack: "MeleeWill", attackWidth: 1, attackRange: 1, power: 4, dmgType: "pain", terrainTags: {"rubble":20}, floors:[0, 1, 2, 3]},
	{name: "WitchShock", tags: ["witch", "ranged", "elite", "miniboss", "unflinching", "electricimmune", "meleeresist"], followRange: 2, castWhileMoving: true, spells: ["Electrify"], spellCooldownMult: 1, spellCooldownMod: 0, hp: 14, AI: "hunt", visionRadius: 6, maxhp: 14, minLevel:2, weight:10, movePoints: 2, attackPoints: 2, attack: "Spell", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", terrainTags: {"secondhalf":2, "lastthird":1, "miniboss": -5}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], dropTable: [{name: "RedKey", weight: 3}, {name: "GreenKey", weight: 2}, {name: "BlueKey", weight: 1}]},
	{name: "WitchChain", tags: ["witch", "ranged", "elite", "miniboss", "unflinching", "electricweakness", "fireresist"], followRange: 1, spells: ["ChainBolt"], spellCooldownMult: 2, spellCooldownMod: 1, hp: 14, AI: "hunt", visionRadius: 6, maxhp: 14, minLevel:3, weight:8, movePoints: 3, attackPoints: 3, attack: "MeleeLockAllWillSpell", attackWidth: 1, attackRange: 1, power: 5, dmgType: "grope", terrainTags: {"secondhalf":3, "lastthird":3, "miniboss": -5}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], dropTable: [{name: "RedKey", weight: 3}, {name: "GreenKey", weight: 2}, {name: "BlueKey", weight: 1}]},

];


function KinkyDungeonNearestPlayer(enemy) {
	return KinkyDungeonPlayerEntity
}

function KinkyDungeonGetEnemy(tags, Level, Index) {
	var enemyWeightTotal = 0;
	var enemyWeights = [];

	for (let L = 0; L < KinkyDungeonEnemies.length; L++) {
		var enemy = KinkyDungeonEnemies[L];
		if (Level >= enemy.minLevel && enemy.floors.includes(Index)) {
			enemyWeights.push({enemy: enemy, weight: enemyWeightTotal});
			enemyWeightTotal += enemy.weight;
			for (let T = 0; T < tags.length; T++)
				if (enemy.terrainTags[tags[T]]) enemyWeightTotal += enemy.terrainTags[tags[T]];
		}
	}

	var selection = Math.random() * enemyWeightTotal;

	for (let L = enemyWeights.length - 1; L >= 0; L--) {
		if (selection > enemyWeights[L].weight) {
			return enemyWeights[L].enemy;
		}
	}
}

function KinkyDungeonDrawEnemies(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E];
		var sprite = enemy.Enemy.name;
		if (KinkyDungeonEntities[E].x >= CamX && KinkyDungeonEntities[E].y >= CamY && KinkyDungeonEntities[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonEntities[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Enemies/" + sprite + ".png",
				KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
				(KinkyDungeonEntities[E].x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonEntities[E].y - CamY)*KinkyDungeonGridSizeDisplay,
				KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);

			if (enemy.stun > 0) {
				DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Stun.png",
					KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
					(KinkyDungeonEntities[E].x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonEntities[E].y - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);

			}

		}


	}
}


function KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E];
			if (enemy.warningTiles) {
			for (let T=0; T<enemy.warningTiles.length; T++) {
				var tx = enemy.x + enemy.warningTiles[T].x;
				var ty = enemy.y + enemy.warningTiles[T].y;
				if (tx >= CamX && ty >= CamY && tx < CamX + KinkyDungeonGridWidthDisplay && ty < CamY + KinkyDungeonGridHeightDisplay && KinkyDungeonNoEnemy(tx, ty) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(tx, ty))) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Warning.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);


				}
			}
		}
	}
}

function KinkyDungeonEnemyCheckHP(enemy, E) {
	if (enemy.hp <= 0) {
		KinkyDungeonEntities.splice(E, 1);
		if (enemy == KinkyDungeonKilledEnemy && enemy.Enemy.maxhp > KinkyDungeonActionMessagePriority-1) {

			KinkyDungeonActionMessageTime = 1;
			KinkyDungeonActionMessage = TextGet("Kill"+enemy.Enemy.name);
			KinkyDungeonActionMessageColor = "orange";
			KinkyDungeonActionMessagePriority = 1;

			KinkyDungeonKilledEnemy = null;
		}

		KinkyDungeonItemDrop(enemy.x, enemy.y, enemy.Enemy.dropTable);
		return true;
	}
	return false;
}

function KinkyDungeonCheckLOS(enemy, player, distance, maxdistance) {
	return distance <= maxdistance+0.1 && KinkyDungeonCheckPath(enemy.x, enemy.y, player.x, player.y);
}

function KinkyDungeonUpdateEnemies(delta) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E];
		let player = KinkyDungeonNearestPlayer(enemy)

		// Delete the enemy
		if (KinkyDungeonEnemyCheckHP(enemy, E)) { E -= 1; continue;}
		

		if (!enemy.castCooldown) enemy.castCooldown = 0;
		if (enemy.castCooldown > 0) enemy.castCooldown = Math.max(0, enemy.castCooldown-delta);

		var idle = true;
		var moved = false;

		if (enemy.stun > 0) {
			enemy.stun -= delta;
		} else {

			var AI = enemy.Enemy.AI;
			if (!enemy.warningTiles) enemy.warningTiles = [];
			var playerDist = Math.sqrt((enemy.x - player.x)*(enemy.x - player.x) + (enemy.y - player.y)*(enemy.y - player.y));

			if (AI == "wander") {
				idle = true;
				if (!KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.followRange))
					for (let T = 0; T < 8; T++) { // try 8 times
						let dir = KinkyDungeonGetDirection(10*(Math.random()-0.5), 10*(Math.random()-0.5));
						if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
							idle = false;
							break;
						}
					}
			} else if (AI == "guard" && (enemy.Enemy.attackWhileMoving || !KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.followRange))) {
				if (!enemy.gx) enemy.gx = enemy.x;
				if (!enemy.gy) enemy.gy = enemy.y;



				idle = true;
				// try 12 times to find a moveable tile, with some random variance
				if (playerDist <= enemy.Enemy.visionRadius)
					for (let T = 0; T < 12; T++) {
						let dir = KinkyDungeonGetDirectionRandom(player.x - enemy.x, player.y - enemy.y);
						if (T > 2 && T < 8) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10); // Fan out a bit
						if (T >= 8) dir = KinkyDungeonGetDirectionRandom(0, 0); // Give up and choose random
						if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
							idle = false;
							break;
						}
					}
				else if (Math.abs(enemy.x - enemy.gx) > 0 || Math.abs(enemy.y - enemy.gy) > 0)
					for (let T = 0; T < 8; T++) {
						let dir = KinkyDungeonGetDirectionRandom(enemy.gx - enemy.x, enemy.gy - enemy.y);
						if (T > 2 && T < 8) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10); // Fan out a bit
						if (T >= 8) dir = KinkyDungeonGetDirectionRandom(0, 0); // Give up and choose random
						if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
							idle = false;
							break;
						}
					}
			} else if (AI == "hunt" && (enemy.Enemy.attackWhileMoving || !KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.followRange))) {

				idle = true;
				// try 12 times to find a moveable tile, with some random variance
				if (playerDist <= enemy.Enemy.visionRadius)
					for (let T = 0; T < 12; T++) {
						let dir = KinkyDungeonGetDirectionRandom(player.x - enemy.x, player.y - enemy.y);
						if (T > 2 && T < 8) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10); // Fan out a bit
						if (T >= 8) dir = KinkyDungeonGetDirectionRandom(0, 0); // Give up and choose random
						if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
							idle = false;
							break;
						}
					}
				else
					for (let T = 0; T < 8; T++) { // try 8 times
						let dir = KinkyDungeonGetDirection(10*(Math.random()-0.5), 10*(Math.random()-0.5));
						if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
							idle = false;
							break;
						}
					}
			}
			playerDist = Math.sqrt((enemy.x - player.x)*(enemy.x - player.x) + (enemy.y - player.y)*(enemy.y - player.y));

			if ((!moved || enemy.Enemy.attackWhileMoving) && enemy.Enemy.attack.includes("Melee") && KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.attackRange + 0.5)) {//Player is adjacent
				idle = false;

				let dir = KinkyDungeonGetDirection(player.x - enemy.x, player.y - enemy.y);


				if (!KinkyDungeonEnemyTryAttack(enemy, player, [dir], delta, enemy.x + dir.x, enemy.y + dir.y)) {
					if (enemy.warningTiles.length == 0)
						enemy.warningTiles = KinkyDungeonGetWarningTiles(player.x - enemy.x, player.y - enemy.y, enemy.Enemy.attackRange, enemy.Enemy.attackWidth);

					if (enemy.Enemy.attack.includes("Bind")) {
						let caught = false;
						for (let W = 0; W < enemy.warningTiles.length; W++) {
							let tile = enemy.warningTiles[W];
							if (enemy.x + tile.x == KinkyDungeonPlayerEntity.x && enemy.y + tile.y == KinkyDungeonPlayerEntity.y) {
								caught = true;
								break;
							}
						}
						if (caught && KinkyDungeonGetRestraintItem("ItemTorso") && KinkyDungeonGetRestraintItem("ItemTorso").restraint && KinkyDungeonGetRestraintItem("ItemTorso").restraint.harness) {
							let roll = Math.random();
							for (let T = 0; T < KinkyDungeonSlowLevel/2; T++) {
								roll = Math.max(roll, Math.random());
							}
							if (roll > KinkyDungeonTorsoGrabChance) {
								KinkyDungeonMovePoints = -1;

								KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonTorsoGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1);

							}
						}
					}
				} else { // Attack lands!
					let hit = false;
					for (let W = 0; W < enemy.warningTiles.length; W++) {
						let tile = enemy.warningTiles[W];
						if (enemy.x + tile.x == KinkyDungeonPlayerEntity.x && enemy.y + tile.y == KinkyDungeonPlayerEntity.y) {
							hit = true;
							break;
						}
					}
					if (hit) {
						var replace = [];
						var restraintAdd = null;
						var willpowerDamage = 0;
						var msgColor = "yellow";
						let Locked = false;
						let priorityBonus = 0;
						
						if (enemy.Enemy.attack.includes("Lock") && KinkyDungeonPlayerGetLockableRestraints().length > 0) {
							let Lockable = KinkyDungeonPlayerGetLockableRestraints();
							let Lstart = 0;
							let Lmax = Lockable.length-1;
							if (!enemy.Enemy.attack.includes("LockAll")) {
								Lstart = Math.floor(Lmax*Math.random()); // Lock one at random
							}
							for (let L = Lstart; L <= Lmax; L++) {
								KinkyDungeonLock(Lockable[L], KinkyDungeonGenerateLock(true)); // Lock it!
								priorityBonus += Lockable[L].restraint.power
							}
							Locked = true;
						} else if (enemy.Enemy.attack.includes("Bind")) {
							// Note that higher power enemies get a bonus to the floor restraints appear on
							restraintAdd = KinkyDungeonGetRestraint(enemy.Enemy, MiniGameKinkyDungeonCheckpoint + enemy.Enemy.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
							if (restraintAdd)
								replace.push({keyword:"RestraintAdded", value: TextGet("Restraint" + restraintAdd.name)});
							else if (enemy.Enemy.fullBoundBonus)
								willpowerDamage += enemy.Enemy.fullBoundBonus; // Some enemies deal bonus damage if they cannot put a binding on you
						}

						if (enemy.Enemy.attack.includes("Suicide")) {
							enemy.hp = 0;
						}
						if (enemy.Enemy.attack.includes("Will") || willpowerDamage > 0) {
							if (willpowerDamage == 0)
								willpowerDamage += enemy.Enemy.power;
							replace.push({keyword:"DamageTaken", value: willpowerDamage});
							msgColor = "#ff8888";
						}
						var happened = 0;
						var bound = 0;
						happened += KinkyDungeonDealDamage({damage: willpowerDamage, type: enemy.Enemy.dmgType});
						bound += KinkyDungeonAddRestraint(restraintAdd, enemy.Enemy.power) * 10;
						happened += bound;

						if (happened > 0) {
							let suffix = "";
							if (Locked) suffix = "Lock";
							else if (bound > 0) suffix = "Bind";
							
							KinkyDungeonSendTextMessage(happened+priorityBonus, TextGet("Attack"+enemy.Enemy.name + suffix), msgColor, 1);
							if (replace)
								for (let R = 0; R < replace.length; R++)
									KinkyDungeonTextMessage = KinkyDungeonTextMessage.replace(replace[R].keyword, replace[R].value);
						}
					}

					enemy.warningTiles = [];
				}
			} else {
				enemy.warningTiles = [];
				enemy.attackPoints = 0;
			}
			
			
			if ((!moved || enemy.Enemy.castWhileMoving) && enemy.Enemy.attack.includes("Spell") && KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius) && enemy.castCooldown <= 0) {
				idle = false;
				let spellchoice = enemy.Enemy.spells[Math.floor(Math.random()*enemy.Enemy.spells.length)];
				let spell = KinkyDungeonFindSpell(spellchoice);

				if (spell) {
					enemy.castCooldown = spell.level*enemy.Enemy.spellCooldownMult + enemy.Enemy.spellCooldownMod + 1;
					KinkyDungeonCastSpell(player.x, player.y, spell, enemy, player);

					console.log("casted "+ spell.name);
				}
			}
		}


		if (idle) {
			enemy.movePoints = 0;
			enemy.attackPoints = 0;
			enemy.warningTiles = [];
		}
		
		
		// Delete the enemy
		if (KinkyDungeonEnemyCheckHP(enemy, E)) { E -= 1;}
	}
}

function KinkyDungeonNoEnemy(x, y, Player) {

	if (KinkyDungeonEnemyAt(x, y)) return false;
	if (Player) 
		for (let P = 0; P < KinkyDungeonPlayers.length; P++)
			if ((KinkyDungeonPlayers[P].x == x && KinkyDungeonPlayers[P].y == y)) return false;
	return true;
}

function KinkyDungeonEnemyAt(x, y) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		if (KinkyDungeonEntities[E].x == x && KinkyDungeonEntities[E].y == y)
			return KinkyDungeonEntities[E];
	}
	return null;
}

function KinkyDungeonEnemyTryMove(enemy, Direction, delta, x, y) {

	enemy.movePoints += delta;

	if (enemy.movePoints >= enemy.Enemy.movePoints) {
		enemy.movePoints = 0;
		enemy.x += Direction.x;
		enemy.y += Direction.y;

		if (KinkyDungeonMapGet(x, y) == 'D') {
			KinkyDungeonMapSet(x, y, 'd');
		}

		return true;
	}
	return false;
}

function KinkyDungeonEnemyTryAttack(enemy, player, Tiles, delta, x, y, replace, msgColor) {

	enemy.attackPoints += delta;

	if (enemy.attackPoints >= enemy.Enemy.attackPoints) {
		enemy.attackPoints = 0;

		for (let T = 0; T < Tiles.length; T++) {
			var ax = enemy.x + Tiles[T].x;
			var ay = enemy.y + Tiles[T].y;

			if (player.x == ax && player.y == ay) {
				return true;
			}
		}
	}
	return false;
}

function KinkyDungeonGetWarningTilesAdj() {
	var arr = [];

	arr.push({x:1, y:1});
	arr.push({x:0, y:1});
	arr.push({x:1, y:0});
	arr.push({x:-1, y:-1});
	arr.push({x:-1, y:1});
	arr.push({x:1, y:-1});
	arr.push({x:-1, y:0});
	arr.push({x:0, y:-1});

	return arr;
}


function KinkyDungeonGetWarningTiles(dx, dy, range, width) {
	if (range == 1 && width == 8) return KinkyDungeonGetWarningTilesAdj();

	var arr = [];
	var cone = 0.78539816 * (width-0.9)/2;
	var angle_player = Math.atan2(dx, dy) + ((width % 2 == 0) ? ((Math.random() > 0.5) ? -0.39269908 : 39269908) : 0);
	if (angle_player > Math.PI) angle_player -= Math.PI;
	if (angle_player < -Math.PI) angle_player += Math.PI;

	for (let X = -range; X <= range; X++)
		for (let Y = -range; Y <= range; Y++) {
			var angle = Math.atan2(X, Y);

			var angleDiff = angle - angle_player;
			angleDiff += (angleDiff>Math.PI) ? -2*Math.PI : (angleDiff<-Math.PI) ? 2*Math.PI : 0;

			if (Math.abs(angleDiff) < cone + 0.1 && Math.sqrt(X*X + Y*Y) < range + 0.5) arr.push({x:X, y:Y});

		}


	return arr;
}
