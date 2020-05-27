'use strict'

var LocationDialogProfileView = function(mainDialog, containerElement){
	this.mainDialog = mainDialog;
	this.containerElements = {}
	this.containerElements.main = containerElement;
	
	var currentTimestamp = new Date().getTime();
	
	this.containerElements.character = Util.GetFirstChildNodeByName(this.containerElements.main, "character");
	
	if(mainDialog.player.character.name)
		Util.GetFirstChildNodeByName(this.containerElements.character, "name").innerText = "Name: " + mainDialog.player.character.name;
	
	if(mainDialog.player.character.number)
		Util.GetFirstChildNodeByName(this.containerElements.character, "number").innerText = "Number: " + mainDialog.player.character.number;
	
	var title = mainDialog.player.character.title ? mainDialog.player.character.title : "";
	if(title) 
		Util.GetFirstChildNodeByName(this.containerElements.character, "title").innerText = "Title " + title;
	
	var days = parseInt((currentTimestamp - mainDialog.player.character.created) / 1000 / 60 / 60 / 24);
	Util.GetFirstChildNodeByName(this.containerElements.character, "age").innerText = "Member for " + days + " day(s)";

	var owner = mainDialog.player.character.owner;//lover ash 199 dating for collared for
	if(owner) {
		var days = parseInt((currentTimestamp - owner.created) / 1000 / 60 / 60 / 24);
		var htmlStr = "Owned by: " + owner.name + " (" + owner.id + ")<br /> Stage: " + owner.stage + " for " + days + " day(s)" ;
		Util.GetFirstChildNodeByName(this.containerElements.character, "owner").innerHTML = htmlStr;
	}
	
	var lover = mainDialog.player.character.lover;//lover ash 199 dating for collared for
	if(lover) {
		var days = parseInt((currentTimestamp - lover.created) / 1000 / 60 / 60 / 24);
		var htmlStr = "Loved by: " + lover.name + " (" + lover.id + ")<br /> Stage: " + lover.stage + " for " + days + " day(s)" ;
		Util.GetFirstChildNodeByName(this.containerElements.character, "lover").innerHTML = htmlStr;
	}
	
	this.containerElements.reputation = Util.GetFirstChildNodeByName(this.containerElements.main, "reputation");
	var reputation = mainDialog.player.clubStanding.reputation;
	for(var key in reputation){
		if(key == "dominant" && reputation[key] < 0)
			Util.GetFirstChildNodeByName(this.containerElements.reputation, "submissive").innerText = "submissive: " -1*reputation[key];
		else
			Util.GetFirstChildNodeByName(this.containerElements.reputation, key).innerText = key + ": " + reputation[key];
	}
	
	this.containerElements.skills = Util.GetFirstChildNodeByName(this.containerElements.main, "skills");
	var skills = mainDialog.player.skills;
	for(var key in skills){
		Util.GetFirstChildNodeByName(this.containerElements.skills, key.toLowerCase()).innerText = key + ": " + skills[key];
	}
	
	this.containerElements.description = Util.GetFirstChildNodeByName(this.containerElements.main, "description");
	this.descriptionTextarea = this.containerElements.description.getElementsByTagName("textarea")[0];
	this.descriptionTextarea.value = mainDialog.player.clubStanding.description;
	
	this.updateButton = Util.GetFirstChildNodeByName(this.containerElements.description, "update");
	this.updateButton.addEventListener("click", function(event){
		MslServer.UpdatePlayer("clubStanding.description", this.descriptionTextarea.value, "set", function(data){
			this.descriptionTextarea.value = data;
		});
	}.bind(this));
	
	
	
/*
	this.Show = function(){
		//this.containerElements.main.style.display = "block";
		this.containerElements.main.style.opacity = "1";	
		this.containerElements.main.style.transition = "250ms";// .2s cubic-bezier(.42, 0, .34, 1.01)"
	}
	
	this.Hide = function(){
		//this.containerElements.main.style.display = "none";
		this.containerElements.main.style.opacity = "0";	
		
	}*/
	
	
	//Name
	//Title
	//Member number
	//member for days
	//lover
	//married for
	//owner
	//collared for
	//premissions
	
	
	
	//Reptutation
	//Dom  Nurse  Maid  Gamb Abdl
};
