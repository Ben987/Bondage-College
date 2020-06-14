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
	
	var itemsBlackList = mainDialog.player.settings.permissions.items.black;
	itemsBlackList.forEach(itemName => this.AddItemRow(itemName));
	
	this.itemBlackSelectElement = this.tableItemsBlack.tFoot.rows[0].cells[0].childNodes[0];
	for(var itemName in F3dcgAssets.ItemNameToGroupNameMap){
		Util.CreateElement({tag:"option", parent:this.itemBlackSelectElement, textContent:itemName, attributes:{value:itemName}});
	}
	
	this.itemBlackAddButton = this.tableItemsBlack.tFoot.rows[0].cells[1].childNodes[0];
	this.itemBlackAddButton.addEventListener("click", function(event){
		var itemName = this.itemBlackSelectElement.value;
		if(itemsBlackList.includes(itemName)) return;
		
		MslServer.Send("UpdatePlayerProperty", {property:"settings.permissions.items.black", value:itemName, operation:"add"}, function(data){
			Util.SetTypedPropertyValueOnObjectAndElement(mainDialog.player, data.property, event.target, data.value);
			itemsBlackList.push(data.value);
			this.AddItemRow(data.value);
		}.bind(this));
	}.bind(this))
	
	//simple drop downs, checkboxes, textboxes
	this.FillFormRecursive = function(form, keyStack, settings){
		for(var key in settings){
			var value = settings[key];
			
			if(Array.isArray(value)){
				continue;//lists are handled separately
			}else if(typeof(value) == "object"){
				keyStack.push(key);
				this.FillFormRecursive(form, keyStack, value);
				keyStack.pop();
			}else{
				let property = keyStack.join(".") + "." + key;			
				var element = form.elements[property];		
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
				else{
					console.error("input element not found for " + property);
				}
			}
		}
	}
	
	this.FillFormRecursive(this.form, ["settings"], MainController.playerAccount.settings);
	
	this.RemoveItemFromBlackList = function(itemName, tableRowElement){
		if(! itemsBlackList.includes(itemName)) return;
		MslServer.Send("UpdatePlayerProperty", {property:"settings.permissions.itemLists.black", value:itemName, operation:"remove"}, function(data){
			tableRowElement.parentNode.removeChild(tableRowElement);
			var index = itemsBlackList.indexOf(itemName);
			itemsBlackList.splice(index, 1);
		}.bind(this));
	}
}
