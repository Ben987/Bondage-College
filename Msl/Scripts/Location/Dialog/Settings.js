'use strict'

var LocationDialogSettingsView = function(mainDialog, containerElement){
	this.mainDialog = mainDialog;
	this.mainContainer = containerElement;
	
	this.form = this.mainContainer.getElementsByTagName("form")[0];

	this.tableItemsBlack = Util.GetFirstChildNodeByName(this.mainContainer, "itemLists").getElementsByTagName("table")[0];
	
	this.AddItemRow = function(itemName){
		var tr = Util.CreateElement({tag:"tr", parent:this.tableItemsBlack.tBodies[0]});
		var td = Util.CreateElement({tag:"td", parent:tr, textContent:itemName});
		var td = Util.CreateElement({tag:"td", parent:tr});
		var removeButton = Util.CreateElement({tag:"a", parent:td, textContent:"Remove"});
		removeButton.addEventListener("click", function(){this.RemoveItemFromBlackList(itemName, tr);}.bind(this));
	}
	
	var itemsBlackList = mainDialog.player.settings.permissions.itemLists.black;
	itemsBlackList.forEach(itemName => this.AddItemRow(itemName));
	
	this.itemBlackSelectElement = this.tableItemsBlack.tFoot.rows[0].cells[0].childNodes[0];
	for(var itemName in F3dcgAssets.ItemNameToGroupNameMap){
		Util.CreateElement({tag:"option", parent:this.itemBlackSelectElement, textContent:itemName, attributes:{value:itemName}});
	}
	
	this.itemBlackAddButton = this.tableItemsBlack.tFoot.rows[0].cells[1].childNodes[0];
	this.itemBlackAddButton.addEventListener("click", function(event){
		var itemName = this.itemBlackSelectElement.value;
		if(itemsBlackList.includes(itemName)) return;
		
		MslServer.Send("UpdatePlayerProperty", {property:"settings.permissions.itemLists.black", value:itemName, operation:"add"}, function(data){
			Util.SetTypedPropertyValueOnObjectAndElement(mainDialog.player, data.property, event.target, data.value);
			itemsBlackList.push(data.value);
			this.AddItemRow(data.value);
		}.bind(this));
	}.bind(this))
	
	//simple drop downs, checkboxes, textboxes
	this.FillFormRecursive = function(form, keyStack, settings){
		for(var key in settings){
			let property = keyStack.join(".") + "." + key;
			var value = settings[key];
			var element = form.elements[property]
			
			if(typeof(value) == "object"){
				keyStack.push(key);
				this.FillFormRecursive(form, keyStack, value);
				keyStack.pop();
			}else{
				if(element){
					if(value === true || value === false)
						element.checked = value;
					else 
						element.value = value;
					
					element.addEventListener("change", function(event){
						var value = Util.GetTypedPropertyValueFromElement(mainDialog.player, property, event.target);
						
						MslServer.Send("UpdatePlayerProperty", {property:property, value:value, operation:"set"}, function(data){
							Util.SetTypedPropertyValueOnObjectAndElement(mainDialog.player, data.property, event.target, data.value);
						});
					}.bind(this));
				}
			}
		}
	}
	
	this.FillFormRecursive(this.form, ["settings"], MainController.playerAccount.settings)
	
	
	
	this.RemoveItemFromBlackList = function(itemName, tableRowElement){
		if(! itemsBlackList.includes(itemName)) return;
		MslServer.Send("UpdatePlayerProperty", {property:"settings.permissions.itemLists.black", value:itemName, operation:"remove"}, function(data){
			tableRowElement.parentNode.removeChild(tableRowElement);
			var index = itemsBlackList.indexOf(itemName);
			itemsBlackList.splice(index, 1);
		}.bind(this));
	}
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