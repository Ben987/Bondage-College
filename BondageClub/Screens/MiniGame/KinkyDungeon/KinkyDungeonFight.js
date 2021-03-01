var KinkyDungeonKilledEnemy = null

function KinkyDungeonDamageEnemy(Enemy, Damage) {
	var dmg = Damage.damage
	var type = Damage.type
	
	Enemy.hp -= dmg
	
	KinkyDungeonActionMessageTime = 2
	KinkyDungeonActionMessage = TextGet("PlayerAttack").replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)).replace("DamageDealt", dmg)
	KinkyDungeonActionMessageColor = "orange"
	KinkyDungeonActionMessagePriority = 1
	
	if (Enemy.hp <= 0) {
		KinkyDungeonKilledEnemy = Enemy
	}
}

function KinkyDungeonAttackEnemy(Enemy, Damage) {
	KinkyDungeonDamageEnemy(Enemy, Damage)
}