// Lots of good info here: http://www.adammil.net/blog/v125_Roguelike_Vision_Algorithms.html#permissivecode
// For this implementation I decided that a variant of shadow casting would be ideal
// -Ada

var KinkyDungeonTransparentObjects = "0C"

function KinkyDungeonMakeLightMap(width, height, Lights) {
	KinkyDungeonLightGrid = ""
	// Generate the grid
	for (let X = 0; X < KinkyDungeonGridHeight; X++) {
		for (let Y = 0; Y < KinkyDungeonGridWidth; Y++)
			KinkyDungeonLightGrid = KinkyDungeonLightGrid + '0' // 0 = pitch dark
		KinkyDungeonLightGrid = KinkyDungeonLightGrid + '\n'
	}
	
	var maxPass = 0
	
	for (let L = 0; L < Lights.length; L++) {
		maxPass = Math.max(maxPass, Lights[L].brightness)
		KinkyDungeonLightSet(Lights[L].x, Lights[L].y, "" + Lights[L].brightness)
	}
	
	for (let L = maxPass; L > 0; L--) {
		// if a grid square is next to a brighter transparent object, it gets that light minus one, or minus two if diagonal
		
		// Main grid square loop
		for (let X = 0; X < KinkyDungeonGridWidth; X++) {
			for (let Y = 0; Y < KinkyDungeonGridHeight; Y++) {
				var currBrightness = Number(KinkyDungeonLightGet(X, Y))
				var brighestNeighbor = currBrightness
				// Check neighbors
				if (KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(X-1, Y)))
					brighestNeighbor = Math.max(brighestNeighbor, Number(KinkyDungeonLightGet(X-1, Y)))
				if (KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(X+1, Y)))
					brighestNeighbor = Math.max(brighestNeighbor, Number(KinkyDungeonLightGet(X+1, Y)))
				if (KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(X, Y-1)))
					brighestNeighbor = Math.max(brighestNeighbor, Number(KinkyDungeonLightGet(X, Y-1)))
				if (KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(X, Y+1)))
					brighestNeighbor = Math.max(brighestNeighbor, Number(KinkyDungeonLightGet(X, Y+1)))
				
				if (KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(X-1, Y-1)))
					brighestNeighbor = Math.max(brighestNeighbor, Number(KinkyDungeonLightGet(X-1, Y-1))-(Math.random() > 0.4 ? 1 : 0))
				if (KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(X+1, Y+1)))
					brighestNeighbor = Math.max(brighestNeighbor, Number(KinkyDungeonLightGet(X+1, Y+1))-(Math.random() > 0.4 ? 1 : 0))
				if (KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(X+1, Y-1)))
					brighestNeighbor = Math.max(brighestNeighbor, Number(KinkyDungeonLightGet(X+1, Y-1))-(Math.random() > 0.4 ? 1 : 0))
				if (KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(X-1, Y+1)))
					brighestNeighbor = Math.max(brighestNeighbor, Number(KinkyDungeonLightGet(X-1, Y+1))-(Math.random() > 0.4 ? 1 : 0))
				
				if (brighestNeighbor > currBrightness && brighestNeighbor > 1) {
					KinkyDungeonLightSet(X, Y, "" + (brighestNeighbor-1))
				}
			}
		}
	}
	
}


