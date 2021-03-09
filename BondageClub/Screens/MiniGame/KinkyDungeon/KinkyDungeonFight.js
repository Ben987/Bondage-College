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

function KinkyDungeonDamageEnemy(Enemy, Damage, Ranged, NoMsg) {
	var dmg = Damage.damage
	var type = Damage.type
	var hit = false;
	
	
	if (KinkyDungeonEvasion(Enemy)) {
		hit = true
		Enemy.hp -= dmg
		
		if (Enemy.hp <= 0) {
			KinkyDungeonKilledEnemy = Enemy
		}
		
		
	}
	if (!NoMsg && 1 >= KinkyDungeonActionMessagePriority) {
		KinkyDungeonActionMessageTime = 2
		KinkyDungeonActionMessage = (hit) ? TextGet((Ranged) ? "PlayerRanged" : "PlayerAttack").replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)).replace("DamageDealt", dmg) : TextGet("PlayerMiss").replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name))
		KinkyDungeonActionMessageColor = (hit) ? "orange" : "red"
		KinkyDungeonActionMessagePriority = 1
	}
	

}

function KinkyDungeonAttackEnemy(Enemy, Damage) {
	KinkyDungeonDamageEnemy(Enemy, Damage)
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
				KinkyDungeonBulletHit(b, 2)
			}
		}
	}
}

function KinkyDungeonUpdateBulletsCollisions(delta) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var b = KinkyDungeonBullets[E]
		
		if (!KinkyDungeonBulletsCheckCollision(b)) {
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
	}
}

function KinkyDungeonBulletsCheckCollision(bullet) {
	var mapItem = KinkyDungeonMapGet(bullet.x, bullet.y)
	if (!bullet.bullet.passthrough && !KinkyDungeonOpenObjects.includes(mapItem)) return false
	
	if (bullet.bullet.damage)
		for (let L = 0; L < KinkyDungeonEntities.length; L++) {
			var enemy = KinkyDungeonEntities[L]
			if (enemy.x == bullet.x && enemy.y == bullet.y) {
				KinkyDungeonDamageEnemy(enemy, bullet.bullet.damage, true, bullet.bullet.NoMsg)
				
				return false
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
		
		var Img = DrawGetImage("Screens/Minigame/KinkyDungeon/Bullets/" + sprite + ".png", 0, 0)
		
		var spriteContext = spriteCanvas.getContext("2d")
		var direction = Math.atan2(KinkyDungeonBullets[E].vy, KinkyDungeonBullets[E].vx)
		
		// Rotate the canvas
		spriteContext.translate(spriteCanvas.width/2, spriteCanvas.height/2);
		spriteContext.rotate(direction);
		spriteContext.translate(-spriteCanvas.width/2, -spriteCanvas.height/2);

		// Draw the sprite
		spriteContext.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
		spriteContext.drawImage(Img, 0, 0);
		
		// Reset the transformation
		spriteContext.setTransform(1, 0, 0, 1, 0, 0);
		
		if (KinkyDungeonBullets[E].x >= CamX && KinkyDungeonBullets[E].y >= CamY && KinkyDungeonBullets[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonBullets[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			KinkyDungeonContext.drawImage(spriteCanvas,  (KinkyDungeonBullets[E].x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonBullets[E].y - CamY)*KinkyDungeonGridSizeDisplay); 				
		}
		

	}
}