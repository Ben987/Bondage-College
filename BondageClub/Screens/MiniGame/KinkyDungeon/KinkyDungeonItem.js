"use strict";
var KinkyDungeonGroundItems = []; // Tracking all items on the ground

function KinkyDungeonItemDrop(x, y, dropTable) {

	if (dropTable) {
		var dropWeightTotal = 0;
		var dropWeights = [];

		for (let L = 0; L < dropTable.length; L++) {
			var drop = dropTable[L];
			dropWeights.push({drop: drop, weight: dropWeightTotal});
			dropWeightTotal += drop.weight;
		}

		var selection = Math.random() * dropWeightTotal;

		for (let L = dropWeights.length - 1; L >= 0; L--) {
			if (selection > dropWeights[L].weight) {
				var dropped = {x:x, y:y, name: dropWeights[L].drop.name, amount: dropWeights[L].drop.amountMin + Math.floor(Math.random()*dropWeights[L].drop.amountMax)};
				KinkyDungeonGroundItems.push(dropped);
				return dropped;
			}
		}
	}
	return false;
}

function KinkyDungeonItemEvent(Item, Index) {
	let color = "white";
	let priority = 1;
	if (Item.name == "Gold") {
		color = "yellow";
		KinkyDungeonAddGold(Item.amount);
	} else if (Item.name == "RedKey") {
		priority = 2;
		color = "lightgreen";
		KinkyDungeonRedKeys += 1;
	} else if (Item.name == "GreenKey") {
		priority = 2;
		color = "lightgreen";
		KinkyDungeonGreenKeys += 1;
	} else if (Item.name == "BlueKey") {
		priority = 2;
		color = "lightgreen";
		KinkyDungeonBlueKeys += 1;
	}
	KinkyDungeonSendActionMessage(priority, TextGet("ItemPickup" + Item.name).replace("XXX", Item.amount), color, 2);
}


function KinkyDungeonItemCheck(x, y, Index) {
	for (let I = 0; I < KinkyDungeonGroundItems.length; I++) {
		var item = KinkyDungeonGroundItems[I];
		if (KinkyDungeonPlayerEntity.x == item.x && KinkyDungeonPlayerEntity.y == item.y) {
			KinkyDungeonGroundItems.splice(I, 1);
			return KinkyDungeonItemEvent(item, Index);
		}
	}
}




function KinkyDungeonDrawItems(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonGroundItems.length; E++) {
		var item = KinkyDungeonGroundItems[E];
		var sprite = item.name;
		if (KinkyDungeonGroundItems[E].x >= CamX && KinkyDungeonGroundItems[E].y >= CamY && KinkyDungeonGroundItems[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonGroundItems[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Items/" + sprite + ".png",
				KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
				(KinkyDungeonGroundItems[E].x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonGroundItems[E].y - CamY)*KinkyDungeonGridSizeDisplay,
				KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);


		}


	}
}

