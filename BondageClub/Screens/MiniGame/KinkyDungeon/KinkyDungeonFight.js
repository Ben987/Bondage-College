"use strict";
var KinkyDungeonKilledEnemy = null

var KinkyDungeonMissChancePerBlind = 0.3 // Max 3
var KinkyDungeonBullets = [] // Bullets on the game board
var KinkyDungeonBulletsID = {} // Bullets on the game board

var KinkyDungeonOpenObjects = KinkyDungeonTransparentObjects // Objects bullets can pass thru

function KinkyDungeonEvasion(Enemy) {
	var hitChance = 1.0
	
	hitChance -= Math.min(3, KinkyDungeonPlayer.GetBlindLevel()) * KinkyDungeonMissChancePerBlind
	if (KinkyDungeonPlayer.IsDeaf()) hitChance *= 0.67
	
	if (Math.random() < hitChance) return true
	
	return false;
}

function KinkyDungeonDamageEnemy(Enemy, Damage, Ranged, NoMsg, Spell) {
	var dmg = (Damage) ? Damage.damage : 0
	if (!dmg) dmg = 0
	var type = (Damage) ? Damage.type : ""
	var effect = false

	if (Damage) {
		if (Damage.type != "inert")
			Enemy.hp -= dmg
		if (Damage.type == "stun") {
			effect = true
			if (!Enemy.stun) Enemy.stun = 0
			Enemy.stun = Math.max(Enemy.stun, Damage.time)
		}
	}
	
	var atkname = (Spell) ? TextGet("KinkyDungeonSpell" + Spell.name) : TextGet("KinkyDungeonBasicAttack")
		
	if (Enemy.hp <= 0) {
		KinkyDungeonKilledEnemy = Enemy
	}
	
	if (!NoMsg && 3 >= KinkyDungeonActionMessagePriority) {
		KinkyDungeonActionMessageTime = 2
		KinkyDungeonActionMessage = (Damage) ? TextGet((Ranged) ? "PlayerRanged" : "PlayerAttack").replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)).replace("AttackName", atkname).replace("DamageDealt", dmg) : TextGet("PlayerMiss").replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name))
		KinkyDungeonActionMessageColor = (Damage && (dmg > 0 || effect)) ? "orange" : "red"
		KinkyDungeonActionMessagePriority = 3
	}
	
	return dmg
}

function KinkyDungeonAttackEnemy(Enemy, Damage) {
	var hit = false;
	
	
	if (KinkyDungeonEvasion(Enemy)) {
		hit = true
		
	}
	
	
	KinkyDungeonDamageEnemy(Enemy, (hit) ? Damage : null)
}

function KinkyDungeonUpdateBullets(delta) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var b = KinkyDungeonBullets[E]
		var d = delta
		if (b.born >= 0) b.born -= 1
		
		while (d > 0) {
			var dt = d - Math.max(0, d - 1)
			if (b.born < 0) {
				b.xx += b.vx * dt
				b.yy += b.vy * dt
				b.time -= delta
			}
			
			b.x = Math.round(b.xx)
			b.y = Math.round(b.yy)
			
			d -= 1
			
			
			if (!KinkyDungeonBulletsCheckCollision(b) || (b.bullet.lifetime > 0 && b.time <= 0)) {
				d = 0
				KinkyDungeonBullets.splice(E, 1)
				KinkyDungeonBulletsID[b.spriteID] = null
				E -= 1
				KinkyDungeonBulletHit(b, 1)
			}
		}
	}
}

function KinkyDungeonUpdateBulletsCollisions(delta) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var b = KinkyDungeonBullets[E]
		
		if (!KinkyDungeonBulletsCheckCollision(b, b.time >= 0)) {
			KinkyDungeonBullets.splice(E, 1)
			KinkyDungeonBulletsID[b.spriteID] = null
			E -= 1
			KinkyDungeonBulletHit(b, 1)
		}
	}
}

function KinkyDungeonBulletHit(b, born) {
	if (b.bullet.hit == "") {
		KinkyDungeonBullets.push({born: born, time:1, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(), bullet:{lifetime: 1, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}})
	} else if (b.bullet.hit == "aoe") {
		KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(),
			bullet:{spell:b.bullet.spell, damage: {damage:b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}})
	} else if (b.bullet.hit == "lingering") {
		var rad = (b.bullet.spell.aoe) ? b.bullet.spell.aoe : 0
		for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
			for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
				if (Math.sqrt(X*X+Y*Y) <= rad) {
					KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime, x:b.x+X, y:b.y+Y, vx:0, vy:0, xx:b.x+X, yy:b.y+Y, spriteID:b.bullet.name+"Hit" + CommonTime(),
						bullet:{spell:b.bullet.spell, damage: {damage:b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, lifetime: b.bullet.spell.lifetime, name:b.bullet.name+"Hit", width:1, height:1}})
				}
			}
		
	}
}

function KinkyDungeonBulletsCheckCollision(bullet, AoE) {
	var mapItem = KinkyDungeonMapGet(bullet.x, bullet.y)
	if (!bullet.bullet.passthrough && !KinkyDungeonOpenObjects.includes(mapItem)) return false
	
	if (bullet.bullet.damage) {
		if (bullet.bullet.aoe) {
			if (AoE) {
				if (bullet.bullet.spell && bullet.bullet.spell.playerEffect && bullet.bullet.aoe >= Math.sqrt((KinkyDungeonPlayerEntity.x - bullet.x) * (KinkyDungeonPlayerEntity.x - bullet.x) + (KinkyDungeonPlayerEntity.y - bullet.y) * (KinkyDungeonPlayerEntity.y - bullet.y))) {
					KinkyDungeonPlayerEffect(bullet.bullet.spell.playerEffect, bullet.bullet.spell)
				}
				var nomsg = false
				for (let L = 0; L < KinkyDungeonEntities.length; L++) {
					let enemy = KinkyDungeonEntities[L]
					if (bullet.bullet.aoe >= Math.sqrt((enemy.x - bullet.x) * (enemy.x - bullet.x) + (enemy.y - bullet.y) * (enemy.y - bullet.y))) {
						KinkyDungeonDamageEnemy(enemy, bullet.bullet.damage, true, nomsg, bullet.bullet.spell)
						nomsg = true
					}
				}
			}
		} else {
			if (bullet.bullet.spell && bullet.bullet.spell.playerEffect && KinkyDungeonPlayerEntity.x == bullet.x && KinkyDungeonPlayerEntity.y == bullet.y) {
				KinkyDungeonPlayerEffect(bullet.bullet.spell.playerEffect, bullet.bullet.spell)
				return false
			}
			for (let L = 0; L < KinkyDungeonEntities.length; L++) {
				let enemy = KinkyDungeonEntities[L]
				if (enemy.x == bullet.x && enemy.y == bullet.y) {
					KinkyDungeonDamageEnemy(enemy, bullet.bullet.damage, true, bullet.bullet.NoMsg, bullet.bullet.spell)
					
					return false
				}
			}
		}
	}
	
	return true
}


function KinkyDungeonLaunchBullet(x, y, targetx, targety, speed, bullet) {
	var direction = Math.atan2(targety, targetx)
	var vx = Math.cos(direction) * speed
	var vy = Math.sin(direction) * speed
	KinkyDungeonBullets.push({born: 1, time:bullet.lifetime, x:x, y:y, vx:vx, vy:vy, xx:x, yy:y, spriteID:bullet.name + CommonTime(), bullet:bullet})
}

function KinkyDungeonDrawFight(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var bullet = KinkyDungeonBullets[E].bullet
		var sprite = bullet.name
		var spriteCanvas = KinkyDungeonBulletsID[KinkyDungeonBullets[E].spriteID]
		if (!spriteCanvas) {
			spriteCanvas = document.createElement("canvas");
			spriteCanvas.width = bullet.width*KinkyDungeonSpriteSize
			spriteCanvas.height = bullet.height*KinkyDungeonSpriteSize
			KinkyDungeonBulletsID[KinkyDungeonBullets[E].spriteID] = spriteCanvas;
			
		}
		
		var Img = DrawGetImage(KinkyDungeonRootDirectory + "Bullets/" + sprite + ".png", 0, 0)
		
		var spriteContext = spriteCanvas.getContext("2d")
		var direction = Math.atan2(KinkyDungeonBullets[E].vy, KinkyDungeonBullets[E].vx)
		
		// Rotate the canvas m,  
		spriteContext.translate(spriteCanvas.width/2, spriteCanvas.height/2);
		spriteContext.rotate(direction);
		spriteContext.translate(-spriteCanvas.width/2, -spriteCanvas.height/2);

		// Draw the sprite
		spriteContext.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
		spriteContext.drawImage(Img, 0, 0);
		
		// Reset the transformation
		spriteContext.setTransform(1, 0, 0, 1, 0, 0);
		
		if (KinkyDungeonBullets[E].x >= CamX && KinkyDungeonBullets[E].y >= CamY && KinkyDungeonBullets[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonBullets[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			KinkyDungeonContext.drawImage(spriteCanvas,  (KinkyDungeonBullets[E].x - CamX - (bullet.width-1)/2)*KinkyDungeonGridSizeDisplay, (KinkyDungeonBullets[E].y - CamY - (bullet.height-1)/2)*KinkyDungeonGridSizeDisplay); 				
		}
		

	}
}
