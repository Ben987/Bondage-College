var KinkyDungeonKilledEnemy = null

var KinkyDungeonMissChancePerBlind = 0.3 // Max 3
var KinkyDungeonBullets = [] // Bullets on the game board

function KinkyDungeonEvasion(Enemy) {
	var hitChance = 1.0
	
	hitChance -= Math.min(3, KinkyDungeonPlayer.GetBlindLevel()) * KinkyDungeonMissChancePerBlind
	if (KinkyDungeonPlayer.IsDeaf()) hitChance *= 0.67
	
	if (Math.random() < hitChance) return true
	
	return false;
}

function KinkyDungeonDamageEnemy(Enemy, Damage) {
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
	
	KinkyDungeonActionMessageTime = 2
	KinkyDungeonActionMessage = (hit) ? TextGet("PlayerAttack").replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)).replace("DamageDealt", dmg) : TextGet("PlayerMiss").replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name))
	KinkyDungeonActionMessageColor = (hit) ? "orange" : "red"
	KinkyDungeonActionMessagePriority = 1
	

}

function KinkyDungeonAttackEnemy(Enemy, Damage) {
	KinkyDungeonDamageEnemy(Enemy, Damage)
}

function KinkyDungeonDrawFight(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var bullet = KinkyDungeonBullets[E]
		var sprite = bullet.name
		if (KinkyDungeonBullets[E].x >= CamX && KinkyDungeonBullets[E].y >= CamY && KinkyDungeonBullets[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonBullets[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			DrawImageZoomCanvas("Screens/Minigame/KinkyDungeon/Enemies/" + sprite + ".png",
				KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
				(KinkyDungeonBullets[E].x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonBullets[E].y - CamY)*KinkyDungeonGridSizeDisplay,
				KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false)
				
				
		}
		

	}
}