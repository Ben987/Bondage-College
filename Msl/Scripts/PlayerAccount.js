'use strict'

var PlayerAccount = function(data){
	this.id = data.id
	this.Log = data.Log;

	this.Inventory = JSON.parse(LZString.decompressFromUTF16(data.Inventory));

	this.profileSettings = data.profileSettings ? data.profileSettings : {};
	
	this.IsMistress = function(){
		return ! ! this.Log.find(log => log.Group == "Management" && log.Name == "ClubMistress");
	}
}