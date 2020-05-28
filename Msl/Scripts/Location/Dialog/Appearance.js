'use strict'


var LocationDialogAppearanceView = function(mainDialog, containerElement){
	this.mainDialog = mainDialog;
	this.containerElements = {};
	
	this.itemActionViews = {"Color":null, "Variant":null, "Lock":null}//, "Remote":null}//, "Direct":null}//, "Arousal":null}
	this.selectedAction= "Color"
	
	this.selectedItemGroupTypeName = "cloth";
	this.selectedItemGroupName = "ClothLower";
	
	//this.containerElements.main = Util.GetFirstChildNodeByName(mainDialog.viewContainer, "appearance");
	this.containerElements.main = containerElement;
	this.containerElements.itemGroupTypeSelection = Util.GetFirstChildNodeByName(this.containerElements.main, "itemGroupTypeSelection");
	this.containerElements.figure = Util.GetFirstChildNodeByName(this.containerElements.main, "figureContainer");
	this.containerElements.itemGroupSelection = Util.GetFirstChildNodeByName(this.containerElements.figure, "itemGroupSelection");
	this.containerElements.itemSelection = Util.GetFirstChildNodeByName(this.containerElements.main, "itemSelection");
	this.containerElements.itemActionButtons = Util.GetFirstChildNodeByName(this.containerElements.main, "itemActionButtons");
	this.containerElements.controlButtons = Util.GetFirstChildNodeByName(this.containerElements.main, "controlButtons");
	this.containerElements.wardrobe = null;//Lazily initizlied
	
	for(let itemGroupTypeName in this.mainDialog.updateDelegate.items){
		var icon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupTypeSelection, itemGroupTypeName);
		
		if(! icon) console.log(itemGroupTypeName);
		icon.addEventListener("click", function(e){this.OnItemGroupTypeClick(itemGroupTypeName);}.bind(this));
		
		if(itemGroupTypeName == this.selectedItemGroupTypeName){
			this.OnItemGroupTypeClick(itemGroupTypeName);
		}
	}
	
	Util.GetFirstChildNodeByName(this.containerElements.itemGroupTypeSelection, "wardrobe").addEventListener("click", function(event){this.OnWardrobeIconClick();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.controlButtons, "commit").addEventListener("click", function(event){this.Commit();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.controlButtons, "cancel").addEventListener("click", function(event){this.Cancel();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.controlButtons, "undo").addEventListener("click", function(event){this.Undo();}.bind(this));
	
	
	for(let actionName in this.itemActionViews){
		var containerElement = Util.GetFirstChildNodeByName(this.containerElements.main, "item"+actionName+"Actions");
		var constructorFunction = window[actionName + "DialogAppearanceActionView"];
		this.itemActionViews[actionName] = new constructorFunction(containerElement, function(data){this["ItemActionCallback_" + actionName](data);}.bind(this));
	}
	
	this.RenderAppearance = function(){
		if(this.containerElements.figure.figure) this.containerElements.figure.removeChild(this.containerElements.figure.figure);		
		LocationController.delegates.view.BuildPlayerFigure(this.containerElements.figure, this.mainDialog.updateDelegate.render)
		Util.MoveNodeToEndOfList(this.containerElements.itemGroupSelection);
	}
	setTimeout(this.RenderAppearance.bind(this), 50);
	
	this.Commit = function(){
		if(!this.mainDialog.updateDelegate.HasChanges() )
			this.DisplayErrors(["NoChanges"]);
		else{
			LocationController.UpdatePlayerAppearance(this.mainDialog.updateDelegate);
		}
	}
	
	this.Undo = function(){
		this.RenderAppearanceOrShowErrors(this.mainDialog.updateDelegate.Undo());
	}
	
	this.Cancel = function(){
		this.mainDialog.Interrupt();
	}
	
	this.DisplayErrors = function(errors){
		errors.forEach(error => {
			var errorDiv = Util.CreateElement({
				parent:this.figureContainer
				,innerHTML:error
				,className:"validation_message_fadout"
			});
			setTimeout(() => {errorDiv.parentNode.removeChild(errorDiv);}, 4000);
		});
	}
	
	
	this.RenderAppearanceOrShowErrors = function(validationErrors){
		if(! validationErrors?.length){
			this.RenderAppearance();
		}else{
			this.DisplayErrors(validationErrors);
		}
		
		//this.UpdateControlAndActionButtons();
	}
	
	
	this.DisplayErrors = function(validationErrors){
		validationErrors.forEach(error => {
			var errorDiv = Util.CreateElement({
				parent:this.containerElements.figure
				,innerHTML:error
				,className:"validation_message_fadout"
			});
			setTimeout(() => {errorDiv.parentNode.removeChild(errorDiv);}, 4000);
		});
	}
	
	
	this.OnWardrobeIconClick = function(){
		Util.ClearNodeContent(this.containerElements.itemSelection);
		Util.HideAllChildNodes(this.containerElements.itemGroupSelection);
		Util.ClearNodeContent(this.containerElements.itemSelection);
		this.HideControlAndActionButtons();
		
		if(null == this.containerElements.wardrobe){
			this.containerElements.wardrobe = Util.CreateElement({parent:this.containerElements.main, className:"dialog-appearance-wardrobe"});
			
			MainController.playerAccount.wardrobe.forEach((suit, index) => {
				if(! suit) return;
				var figureContainer = Util.CreateElement({parent:this.containerElements.wardrobe});
				var figure = Util.CreateElement({parent:figureContainer});
				
				var text = Util.CreateElement({
					parent:figureContainer, tag:"input", 
					attributes:{name:"wardrobeName-"+index,value:suit.name}
				});
				
				var buttonSave = Util.CreateElement({
					parent:figureContainer, tag:"input", attributes:{type:"submit", value:"Save"}
					,cssStyles:{float:"left"}, events:{click:function(event){this.SaveSuit(index);}.bind(this)}
				});
				
				var buttonLoad = Util.CreateElement({
					parent:figureContainer, tag:"input", attributes:{type:"submit", value:"Load"}
					,cssStyles:{float:"right"}, events:{click:function(event){this.LoadSuit(index);}.bind(this)}
				});
				
				setTimeout(function(){
					LocationController.delegates.view.BuildPlayerFigure(figure, suit.render);
				}, (index+1)*100);
			});
		}else
			this.containerElements.wardrobe.style.display = "block";
	}
	
	this.LoadSuit = function(index){
		var validationErrors = this.mainDialog.updateDelegate.AddSuit(MainController.playerAccount.wardrobe[index].appearance);
		this.RenderAppearanceOrShowErrors(validationErrors);
	}
	
	this.SaveSuit = function(index){
		var suit = MainController.playerAccount.wardrobe[index];
		suit.appearance = this.mainDialog.updateDelegate.BuildSuitFromCurrentAppearance();
		suit.render = F3dcgAssetsRender.BuildSuitRender(suit.appearance)
		var figureDiv = this.containerElements.wardrobe.childNodes[index].childNodes[0];
		Util.ClearNodeContent(figureDiv);
		LocationController.delegates.view.BuildPlayerFigure(figureDiv, suit.render);
	}
	
	this.OnItemGroupTypeClick = function(itemGroupTypeName){
		this.selectedItemGroupTypeName = itemGroupTypeName;
		var icon = Util.GetFirstChildNodeByName(Util.GetFirstChildNodeByName(this.containerElements.main, "itemGroupTypeSelection"), itemGroupTypeName)
		Util.SelectElementAndDeselectSiblings(icon, "selected");
		
		Util.ClearNodeContent(this.containerElements.itemSelection);
		Util.HideAllChildNodes(this.containerElements.itemGroupSelection);
		Util.ClearNodeContent(this.containerElements.itemSelection);
		if(this.containerElements.wardrobe) this.containerElements.wardrobe.style.display = "none";	
		Util.MoveNodeToEndOfList(this.containerElements.itemGroupSelection);
		
		for(let itemGroupName in this.mainDialog.updateDelegate.items[itemGroupTypeName]){
			var itemGroupIcon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupSelection, itemGroupName);
			if(! itemGroupIcon) throw "No item group icon defined for " + itemGroupName
			itemGroupIcon.style.display = "block";
			itemGroupIcon.addEventListener("click", function(event){this.OnItemGroupClick(itemGroupName);}.bind(this));
			
			this.UpdateItemGroupIconImage(this.selectedItemGroupTypeName, itemGroupName);
			
			//if(itemGroupName == this.selectedItemGroupName)
				//this.OnItemGroupClick(itemGroupName);
		}
	}
	
	
	this.OnItemGroupClick = function(itemGroupName){
		this.selectedItemGroupName = itemGroupName;
		Util.ClearNodeContent(this.containerElements.itemSelection);
		
		var icon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupSelection, itemGroupName);
		Util.SelectElementAndDeselectSiblings(icon, "selected");
		
		this.mainDialog.updateDelegate.items[this.selectedItemGroupTypeName][itemGroupName].forEach(itemData => {
			var iconContainer = Util.CreateElement({parent:this.containerElements.itemSelection});
			var events = {};
			
			if(! itemData.validation?.length)
				events.click = function(event){this.OnItemClick(itemData.itemName)}.bind(this);
			else
				for(var i = 0; i < itemData.validation.length; i++)
					Util.CreateElement({parent:iconContainer,innerHTML:itemData.validation[i],cssStyles:{color:"#fcc",top:(i+1)+"em",fontSize:"1em"}});
			
			Util.CreateElement({parent:iconContainer, tag:"img", events:events, attributes:{src:itemData.iconUrl, alt:itemData.itemName}});
			Util.CreateElement({parent:iconContainer,innerHTML:itemData.itemName,cssStyles:{fontSize:".8em"}});
		})
		
		this.UpdateControlAndActionButtons();
	}
	
	
	this.OnItemClick = function(itemName){
		this.selectedItemName = itemName;
		var validationErrors = this.mainDialog.updateDelegate.AddItem(this.selectedItemGroupName, this.selectedItemName);
		this.RenderAppearanceOrShowErrors(validationErrors);
		
		//if(! validationErrors.length) this.UpdateItemGroupIconImage(this.selectedItemGroupTypeName, this.selectedItemGroupName);
	}
	
	
	this.UpdateItemGroupIconImage = function(itemGroupTypeName, itemGroupName){
		var wornItem //= this.mainDialog.updateDelegate.GetCurrentWornItem(itemGroupName);
		if(wornItem){
			//current item will be displayed elsewhere
			//var itemGroupIcon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupSelection, itemGroupName);		
			//var inventoryItem = this.mainDialog.updateDelegate.inventory.items[itemGroupTypeName][itemGroupName][wornItem.itemName];
			//itemGroupIcon.childNodes[1].setAttribute("src", inventoryItem?.iconUrl ? inventoryItem.iconUrl : "./Images/Icons/e4x4.png");
		}		
	}
	
	
	this.UpdateControlAndActionButtons = function(){
		var wornItem = this.mainDialog.updateDelegate.GetCurrentWornItem(this.selectedItemGroupName);
		
		this.selectedItemName = wornItem?.name;
		
		var buttonsToShow = [];
		for(var action in this.itemActionViews)
			Util.GetFirstChildNodeWithAttribute(this.containerElements.itemActionButtons, "alt", action).style.display="none";
		
		if(wornItem){
			//var inventoryItem = this.mainDialog.updateDelegate.items[this.selectedItemGroupTypeName][this.selectedItemGroupName].find(inventoryItem => inventoryItem.itemName == wornItem.name);
			var inventoryItem = this.mainDialog.updateDelegate.GetInventoryItem(this.selectedItemGroupName, wornItem.name);
			
			if(inventoryItem.colorize){
				buttonsToShow.push("Color");
				if(wornItem.color) this.itemActionViews.Color.SetHexValue(wornItem.color);	
			}
			
			if(wornItem.lock || inventoryItem.allowedLocks?.length > 0){
				buttonsToShow.push("Lock");
				this.itemActionViews.Lock.SetItem(wornItem, inventoryItem, this.mainDialog.updateDelegate.inventory.locks, this.mainDialog.updateDelegate.inventory.keys);
			}
			
			if(inventoryItem.variants){
				buttonsToShow.push("Variant");
				this.itemActionViews.Variant.SetItem(wornItem, inventoryItem);
			}
		}
		
		buttonsToShow.forEach(altValue => Util.GetFirstChildNodeWithAttribute(this.containerElements.itemActionButtons, "alt", altValue).style.display="block");
		
		if(! buttonsToShow.includes(this.selectedAction)) 
			this.itemActionViews[this.selectedAction].Hide();
		else
			this.itemActionViews[this.selectedAction].Show();
	}
	
	this.HideControlAndActionButtons = function(){
		for(var action in this.itemActionViews){
			Util.GetFirstChildNodeWithAttribute(this.containerElements.itemActionButtons, "alt", action).style.display="none";
			this.itemActionViews[this.selectedAction].Hide();
		}
	}
	
	
	this.ShowOrHideActions = function(action){
		this.selectedAction = action;
		for(var actionName in this.itemActionViews)
			this.itemActionViews[actionName].Hide();
		
		this.itemActionViews[action].Show();
	}
	
	
	this.ItemActionCallback_Color = function(color){
		if(!color || ! this.selectedItemGroupName) return;
		
		var validationErrors = this.mainDialog.updateDelegate.AddColor(this.selectedItemName, color);
		this.RenderAppearanceOrShowErrors(validationErrors);
	}
	
	
	this.ItemActionCallback_Lock = function(action){
		var appearanceItemWorn = this.mainDialog.updateDelegate.appearance.items[this.selectedItemGroupName];
		var appearanceItemCopy = Util.CloneRecursive(appearanceItemWorn);
		var updateCharacter = false, updateTime = false;
		
		switch(action.actionType){
			case "lock":
				appearanceItemCopy.lock = F3dcgAssets.InitAppearanceItemLock(action.value, MainController.playerAccount.id);
				updateCharacter = true;
			break;
			case "unlock":
				delete appearanceItemCopy.lock;
				updateCharacter = true;
			break;
			//timer adjustment,
			case "selection":		
			case "plus":		
				updateTime = action.value*1000*60;
			break;
			case "minus":		
				updateTime =-action.value*1000*60;
			break;
			case "random":
				var value = Math.random() > .5 ? 1 * action.value : -1 * action.value;
				updateTime = value*1000*60;
			break;
			//timer management
			case "showTimer":
				updateTime = true;//no break is intentional
			case "removeItem":
			case "enableActions":	
				appearanceItemCopy.lock.timer[action.actionType] = action.value;			
			break;
			default: throw "Unrecognized action " + action.actionType;
		}
		
		if(updateTime){
			var maxTime = Date.now() + appearanceItemCopy.lock.timer.maxTime * 1000;
			appearanceItemCopy.lock.timer.time = Math.min(maxTime, appearanceItemCopy.lock.timer.time+updateTime);
		}
		
		var validationErrors = this.mainDialog.updateDelegate.Add(appearanceItemCopy);
		if(validationErrors.length > 0)
			this.RenderAppearanceOrShowErrors(validationErrors);
		else if(updateCharacter) 
			this.RenderAppearanceOrShowErrors(validationErrors);
		else if(updateTime !== false)
			this.itemActionViews.Lock.OnTimerUpdate(appearanceItemCopy.lock.timer);
	}
	
	this.ItemActionCallback_Variant = function(itemVariantName){
		var wornItem = this.mainDialog.updateDelegate.GetCurrentWornItem(this.selectedItemGroupName);
		
		if(itemVariantName == wornItem.variant) return;
		
		var validationErrors = this.mainDialog.updateDelegate.AddVariant(this.selectedItemName, itemVariantName);
		
		if(! validationErrors.length){
			this.RenderAppearance();
		}else this.DisplayErrors(validationErrors);
	}
	
	
	
	this.ItemActionCallback_Remote = function(){}
	this.ItemActionCallback_Direct = function(){}
	this.ItemActionCallback_Arousal = function(){}
}
