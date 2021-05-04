"use strict";
var KinkyDungeonKilledEnemy = null;

var KinkyDungeonMissChancePerBlind = 0.3; // Max 3
var KinkyDungeonBullets = []; // Bullets on the game board
var KinkyDungeonBulletsID = {}; // Bullets on the game board

var KinkyDungeonOpenObjects = KinkyDungeonTransparentObjects; // Objects bullets can pass thru
var KinkyDungeonMeleeDamageTypes = ["crush", "slash", "pierce", "grope", "pain"]

function KinkyDungeonEvasion(Enemy) {
	var hitChance = 1.0;

	hitChance -= Math.min(3, KinkyDungeonPlayer.GetBlindLevel()) * KinkyDungeonMissChancePerBlind;
	if (KinkyDungeonPlayer.IsDeaf()) hitChance *= 0.67;

	if (Math.random() < hitChance) return true;

	return false;
}

function KinkyDungeonGetImmunity(tags, type, resist) {
	if (tags.includes(type + resist)
		|| (KinkyDungeonMeleeDamageTypes.includes(type) && tags.includes("melee" + resist))
		|| (!KinkyDungeonMeleeDamageTypes.includes(type) && tags.includes("magic"+resist)))
		return true;
	return false;
}

function KinkyDungeonDamageEnemy(Enemy, Damage, Ranged, NoMsg, Spell) {
	var dmg = (Damage) ? Damage.damage : 0;
	if (!dmg) dmg = 0;
	var type = (Damage) ? Damage.type : "";
	var effect = false;
	var resistStun = 0;
	let resistDamage = 0;
	let dmgDealt = 0;

	if (Damage) {
		if (Enemy.Enemy.tags) {
			if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, Damage.type, "immune")) resistDamage = 2;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, Damage.type, "resist")) resistDamage = 1;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, Damage.type, "weakness")) resistDamage = -1;
			if (Enemy.Enemy.tags.includes("unstoppable")) resistStun = 2;
			else if (Enemy.Enemy.tags.includes("unflinching")) resistStun = 1;
			
		}
		
		if (Damage.type != "inert" && Damage.type != "stun" && resistDamage < 2) {
			if (resistDamage == 1)
				dmgDealt = Math.max(1, dmg-1); // Enemies that resist the damage type can only take 1 damage, and if they would take 1 damage it deals 0 damage instead
			else if (resistDamage == -1)
				dmgDealt = Math.max(dmg+1, Math.floor(dmg*1.5)); // Enemies that are vulnerable take either dmg+1 or 1.5x damage, whichever is greater
			else
				dmgDealt = dmg
			Enemy.hp -= dmgDealt;
		}
		if ((resistStun < 2 && resistDamage < 2) && (Damage.type == "stun" || Damage.type == "electric" || Damage.type == "ice")) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.stun) Enemy.stun = 0;
			if (resistStun == 1)
				Enemy.stun = Math.max(Enemy.stun, Math.min(1, Damage.time-1)); // Enemies with stun resistance can't be stunned more than one turn, and anything that stuns them for one turn doesn't affect them
			else Enemy.stun = Math.max(Enemy.stun, Damage.time);
		}
	}

	var atkname = (Spell) ? TextGet("KinkyDungeonSpell" + Spell.name) : TextGet("KinkyDungeonBasicAttack");

	if (Enemy.hp <= 0) {
		KinkyDungeonKilledEnemy = Enemy;
	}

	if (!NoMsg && (dmgDealt > 0 || !Spell || effect)) KinkyDungeonSendActionMessage(3, (Damage) ? TextGet((Ranged) ? "PlayerRanged" : "PlayerAttack").replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)).replace("AttackName", atkname).replace("DamageDealt", dmgDealt) : TextGet("PlayerMiss").replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)),
			(Damage && (dmg > 0 || effect)) ? "orange" : "red", 2);

	return dmg;
}

function KinkyDungeonAttackEnemy(Enemy, Damage) {
	var hit = false;


	if (KinkyDungeonEvasion(Enemy)) {
		hit = true;

	}


	KinkyDungeonDamageEnemy(Enemy, (hit) ? Damage : null);
}

function KinkyDungeonUpdateBullets(delta) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var b = KinkyDungeonBullets[E];
		var d = delta;

		while (d > 0.1) {
			var dt = (d - Math.max(0, d - 1))/Math.sqrt(b.vx*b.vx+b.vy*b.vy);
			if (b.born >= 0) b.born -= 1;

			if (b.born < 0) {
				b.xx += b.vx * dt;
				b.yy += b.vy * dt;
				b.time -= delta;
			}

			b.x = Math.round(b.xx);
			b.y = Math.round(b.yy);

			d -= dt;


			if (!KinkyDungeonBulletsCheckCollision(b) || (b.bullet.lifetime > 0 && b.time <= 0)) {
				d = 0;
				KinkyDungeonBullets.splice(E, 1);
				KinkyDungeonBulletsID[b.spriteID] = null;
				E -= 1;
				KinkyDungeonBulletHit(b, 1);
			}
		}
	}
}

function KinkyDungeonUpdateBulletsCollisions(delta) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var b = KinkyDungeonBullets[E];

		if (!KinkyDungeonBulletsCheckCollision(b, b.time >= 0)) {
			KinkyDungeonBullets.splice(E, 1);
			KinkyDungeonBulletsID[b.spriteID] = null;
			E -= 1;
			KinkyDungeonBulletHit(b, 1);
		}
	}
}

function KinkyDungeonBulletHit(b, born) {
	if (b.bullet.hit == "") {
		KinkyDungeonBullets.push({born: born, time:1, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(), bullet:{lifetime: 1, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}});
	} else if (b.bullet.hit == "aoe") {
		KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(),
			bullet:{spell:b.bullet.spell, damage: {damage:b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}});
	} else if (b.bullet.hit == "lingering") {
		var rad = (b.bullet.spell.aoe) ? b.bullet.spell.aoe : 0;
		for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
			for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
				if (Math.sqrt(X*X+Y*Y) <= rad) {
					KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime, x:b.x+X, y:b.y+Y, vx:0, vy:0, xx:b.x+X, yy:b.y+Y, spriteID:b.bullet.name+"Hit" + CommonTime(),
						bullet:{spell:b.bullet.spell, damage: {damage:b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, lifetime: b.bullet.spell.lifetime, name:b.bullet.name+"Hit", width:1, height:1}});
				}
			}

	}
}

function KinkyDungeonBulletsCheckCollision(bullet, AoE) {
	var mapItem = KinkyDungeonMapGet(bullet.x, bullet.y);
	if (!bullet.bullet.passthrough && !KinkyDungeonOpenObjects.includes(mapItem)) return false;

	if (bullet.bullet.damage) {
		if (bullet.bullet.aoe) {
			if (AoE) {
				if (bullet.bullet.spell && bullet.bullet.spell.playerEffect && bullet.bullet.aoe >= Math.sqrt((KinkyDungeonPlayerEntity.x - bullet.x) * (KinkyDungeonPlayerEntity.x - bullet.x) + (KinkyDungeonPlayerEntity.y - bullet.y) * (KinkyDungeonPlayerEntity.y - bullet.y))) {
					KinkyDungeonPlayerEffect(bullet.bullet.spell.playerEffect, bullet.bullet.spell);
				}
				var nomsg = false;
				for (let L = 0; L < KinkyDungeonEntities.length; L++) {
					let enemy = KinkyDungeonEntities[L];
					if (bullet.bullet.aoe >= Math.sqrt((enemy.x - bullet.x) * (enemy.x - bullet.x) + (enemy.y - bullet.y) * (enemy.y - bullet.y))) {
						KinkyDungeonDamageEnemy(enemy, bullet.bullet.damage, true, nomsg, bullet.bullet.spell);
						nomsg = true;
					}
				}
			}
		} else {
			if (bullet.bullet.spell && bullet.bullet.spell.playerEffect && KinkyDungeonPlayerEntity.x == bullet.x && KinkyDungeonPlayerEntity.y == bullet.y) {
				KinkyDungeonPlayerEffect(bullet.bullet.spell.playerEffect, bullet.bullet.spell);
				return false;
			}
			for (let L = 0; L < KinkyDungeonEntities.length; L++) {
				let enemy = KinkyDungeonEntities[L];
				if (enemy.x == bullet.x && enemy.y == bullet.y) {
					KinkyDungeonDamageEnemy(enemy, bullet.bullet.damage, true, bullet.bullet.NoMsg, bullet.bullet.spell);

					return false;
				}
			}
		}
	}

	return true;
}


function KinkyDungeonLaunchBullet(x, y, targetx, targety, speed, bullet) {
	var direction = Math.atan2(targety, targetx);
	var vx = Math.cos(direction) * speed;
	var vy = Math.sin(direction) * speed;
	KinkyDungeonBullets.push({born: 1, time:bullet.lifetime, x:x, y:y, vx:vx, vy:vy, xx:x, yy:y, spriteID:bullet.name + CommonTime(), bullet:bullet});
}

function KinkyDungeonDrawFight(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var bullet = KinkyDungeonBullets[E].bullet;
		var sprite = bullet.name;
		var spriteCanvas = KinkyDungeonBulletsID[KinkyDungeonBullets[E].spriteID];
		if (!spriteCanvas) {
			spriteCanvas = document.createElement("canvas");
			spriteCanvas.width = bullet.width*KinkyDungeonSpriteSize;
			spriteCanvas.height = bullet.height*KinkyDungeonSpriteSize;
			KinkyDungeonBulletsID[KinkyDungeonBullets[E].spriteID] = spriteCanvas;

		}

		var Img = DrawGetImage(KinkyDungeonRootDirectory + "Bullets/" + sprite + ".png", 0, 0);

		var spriteContext = spriteCanvas.getContext("2d");
		var direction = Math.atan2(KinkyDungeonBullets[E].vy, KinkyDungeonBullets[E].vx);

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
