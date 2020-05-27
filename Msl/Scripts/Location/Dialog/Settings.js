'use strict'

var LocationDialogSettingsView  = function(mainDialog, containerElement){
	this.mainDialog = mainDialog;
	this.mainContainer = containerElement;
	
	
	//console.log(this.mainDialog
	
}

/*


var ProfileManagement ={
	profileContainer:null
	,Init(){}
	,OnScreenChange(){}
	,Interrupt(){
		ProfileManagement.profileContainer?.parentNode?.removeChild(ProfileManagement.profileContainer);	
	}
	,UnInit(){
		ProfileManagement.profileContainer?.parentNode?.removeChild(ProfileManagement.profileContainer);
	}
	,UpdatePlayerProfile(){
		var f = document.forms["profileSettings"];
		
		var settingsCopy = Util.CloneRecursive(MainController.playerAccount.settings);
		this.PullFromFormRecursive(document.forms["profileSettings"], [], settingsCopy);
		console.log(settingsCopy);
		MainController.playerAccount.settings = settingsCopy;
		LocationController.UpdatePlayerProfile(settingsCopy);
	}
	
	,ShowProfile(player){
		ProfileManagement.profileContainer = Util.CreateElement({parent:LocationController.hudContainer
			,className:"full-block"
			,events:{click:(event) => ProfileManagement.Interrupt()}
		});
		
		Util.CreateElement({parent:ProfileManagement.profileContainer, template:"PlayerProfileTemplate", events:{
			click:(event) => event.stopPropagation()
		}});
		
		this.FillFormRecursive(document.forms["profileSettings"], [], MainController.playerAccount.settings);
	}
	
	,PullFromFormRecursive(form, keyStack, settings){
		for(var key in settings){
			var value = settings[key];
			if(value === true || value === false){
				settings[key] = !!form.elements[keyStack.join(".") + "." + key].checked;
			}else if(Array.isArray(value)){
				var ids = {};//numeric or string player id or item name ids
				form.elements[keyStack.join(".") + "." + key].value.split(",").forEach(id => {ids[id] = true;})
				var er = /^-?[0-9]+$/;
				settings[key] = Object.keys(ids).map(id => er.test(id) ? parseInt(id) : id);
			}else if(typeof(value) == "object"){
				keyStack.push(key);
				this.PullFromFormRecursive(form, keyStack, value);
				keyStack.pop();
			}else{
				settings[key] = form.elements[keyStack.join(".") + "." + key].value;
			}
		}
	}
	
	,FillFormRecursive(form, keyStack, settings){
		for(var key in settings){
			var value = settings[key];
			if(value === true || value === false){
				form.elements[keyStack.join(".") + "." + key].checked = value;
			}else if(Array.isArray(value)){
				form.elements[keyStack.join(".") + "." + key].value = value.join(",");
			}else if(typeof(value) == "object"){
				keyStack.push(key);
				this.FillFormRecursive(form, keyStack, value);
				keyStack.pop();
			}else{
				form.elements[keyStack.join(".") + "." + key].value = value;
			}
		}
	}
}




*/