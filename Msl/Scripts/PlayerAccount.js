'use strict'

var PlayerAccount = function(data){
	for(var key in data)
		this[key] = data[key]
		
	this.wardrobe.forEach(suit => suit.render = F3dcgAssetsRender.BuildSuitRender(suit.appearance));
}