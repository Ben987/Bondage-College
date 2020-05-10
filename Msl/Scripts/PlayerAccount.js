'use strict'

var PlayerAccount = function(data){
	this.id = data.id
	this.Log = data.Log;
	this.wardrobe = [];
	
	data.WardrobeCharacterNames.forEach((name, index) => {
		if(data.Wardrobe[index])
			this.wardrobe.push({name:data.WardrobeCharacterNames[index],appearance:F3dcgAssets.BuildPlayerWardrobe(data.Wardrobe[index])});
	})
	
	this.Inventory = JSON.parse(LZString.decompressFromUTF16(data.Inventory));

	this.profileSettings = data.profileSettings ? data.profileSettings : {};
	
	this.IsMistress = function(){
		return ! ! this.Log.find(log => log.Group == "Management" && log.Name == "ClubMistress");
	}
}