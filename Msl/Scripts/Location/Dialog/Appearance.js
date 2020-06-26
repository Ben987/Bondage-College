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
	this.containerElements.wardrobe = null;//Lazily initialized
	
	Util.InitSelectableMenu(this.containerElements.itemGroupTypeSelection);
	Util.InitSelectableMenu(this.containerElements.itemActionButtons);
	Util.InitSelectableMenu(this.containerElements.itemGroupSelection,);
	
	for(let itemGroupTypeName in this.mainDialog.updateDelegate.GetApplicableItems()){
		var icon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupTypeSelection, itemGroupTypeName);
		
		if(! icon) console.log(itemGroupTypeName);
		icon.addEventListener("click", function(e){this.SelectItemGroupType(itemGroupTypeName);}.bind(this));
		
		if(itemGroupTypeName == this.selectedItemGroupTypeName){
			this.SelectItemGroupType(itemGroupTypeName);
		}
	}
	
	Util.GetFirstChildNodeByName(this.containerElements.itemGroupTypeSelection, "wardrobe").addEventListener("click", function(event){this.ShowWardrobe();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.controlButtons, "commit").addEventListener("click", function(event){this.Commit();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.controlButtons, "cancel").addEventListener("click", function(event){this.Cancel();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.controlButtons, "undo").addEventListener("click", function(event){this.Undo();}.bind(this));
	
	for(let actionName in this.itemActionViews){
		var containerElement = Util.GetFirstChildNodeByName(this.containerElements.main, "item"+actionName+"Actions");
		var constructorFunction = window[actionName + "DialogAppearanceActionView"];
		this.itemActionViews[actionName] = new constructorFunction(containerElement, function(data){this["ItemActionCallback_" + actionName](data);}.bind(this));
		
		var button = Util.GetFirstChildNodeByName(this.containerElements.itemActionButtons, actionName.toLowerCase());
		button.addEventListener("click", function(event){
			for(var action in this.itemActionViews)
				this.itemActionViews[action].Hide();
			
			this.itemActionViews[actionName].Show();
			this.selectedAction = actionName;
		}.bind(this));
	}
	
	this.RenderAppearance = function(){
		if(this.containerElements.figure.figure) this.containerElements.figure.removeChild(this.containerElements.figure.figure);		
		LocationController.delegates.view.BuildPlayerFigure(this.containerElements.figure, this.mainDialog.updateDelegate.render)
		Util.MoveNodeToEndOfList(this.containerElements.itemGroupSelection);
	}
	setTimeout(this.RenderAppearance.bind(this), 50);
	
	this.Struggle = function(){
		if(this.mainDialog.updateDelegate.HasChanges() )
			this.DisplayErrors(["ClearChanges"]);
		else{
			LocationController.StartPlayerStruggle(this.selectedItemGroupName);
		}
	}
	
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
		this.mainDialog.updateDelegate.Invalidate();
		this.mainDialog.updateDelegate = this.mainDialog.player.GetUpdateDelegate();
		this.DisplayErrors(["Reset"]);		
		this.RenderAppearance();
	}
	
	this.DisplayErrors = function(errors){
		errors.forEach(error => {
			var errorDiv = Util.CreateElement({
				parent:this.figureContainer
				,innerHTML:error
				,className:"validation_message_fadout"
				,removeAfter:4000
			});
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
	
	
	this.ShowWardrobe = function(){
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
	
	this.SelectItemGroupType = function(itemGroupTypeName){
		Util.SelectElementAndDeselectSiblings(Util.GetFirstChildNodeByName(this.containerElements.itemGroupTypeSelection, itemGroupTypeName));//because may be selected not by click
		
		this.selectedItemGroupTypeName = itemGroupTypeName;
		//var icon = Util.GetFirstChildNodeByName(Util.GetFirstChildNodeByName(this.containerElements.main, "itemGroupTypeSelection"), itemGroupTypeName)
		
		Util.ClearNodeContent(this.containerElements.itemSelection);
		Util.HideAllChildNodes(this.containerElements.itemGroupSelection);
		Util.ClearNodeContent(this.containerElements.itemSelection);
		if(this.containerElements.wardrobe) this.containerElements.wardrobe.style.display = "none";	
		Util.MoveNodeToEndOfList(this.containerElements.itemGroupSelection);
		
		for(let itemGroupName in this.mainDialog.updateDelegate.GetApplicableItems()[itemGroupTypeName]){		
			var itemGroupIcon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupSelection, itemGroupName);
			if(! itemGroupIcon) throw "No item group icon defined for " + itemGroupName
			itemGroupIcon.style.display = "block";
			itemGroupIcon.addEventListener("click", function(event){this.SelectItemGroup(itemGroupName);}.bind(this));
			
			var applicableGroup = this.mainDialog.updateDelegate.GetApplicableItems()[itemGroupTypeName][itemGroupName];
			if(applicableGroup.currentItem) itemGroupIcon.classList.add("filled"); else itemGroupIcon.classList.remove("filled");			
			if(applicableGroup.validation?.length) itemGroupIcon.classList.add("blocked"); else itemGroupIcon.classList.remove("blocked");
			
			this.UpdateItemGroupIconImage(this.selectedItemGroupTypeName, itemGroupName);
			
			//if(itemGroupName == this.selectedItemGroupName)
				//this.SelectItemGroup(itemGroupName);
		}
	}
	
	
	this.SelectItemGroup = function(itemGroupName){
		this.selectedItemGroupName = itemGroupName;
		Util.ClearNodeContent(this.containerElements.itemSelection);
		
		var applicableGroup = this.mainDialog.updateDelegate.GetApplicableItems()[this.selectedItemGroupTypeName][itemGroupName];
		//var icon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupSelection, itemGroupName);
		
		if(applicableGroup.currentItem){
			var iconContainer = Util.CreateElement({parent:this.containerElements.itemSelection, cssClass:"current"});
			Util.CreateElement({parent:iconContainer, tag:"img", attributes:{src:applicableGroup.currentItem.iconUrl, alt:applicableGroup.currentItem.name}});
			Util.CreateElement({parent:iconContainer,innerHTML:applicableGroup.currentItem.name});			
			
			if(applicableGroup.struggleable){
				var iconContainer = Util.CreateElement({parent:this.containerElements.itemSelection, events:{
					click:function(event){this.Struggle();}.bind(this)
				}});
				Util.CreateElement({parent:iconContainer, tag:"img", attributes:{src:"../BondageClub/Icons/Struggle.png", alt:"Struggle"}});
			}
			
			if(applicableGroup.removable){
				var iconContainer = Util.CreateElement({parent:this.containerElements.itemSelection, events:{
					click:function(event){this.SelectItem("None");}.bind(this)
				}});
				Util.CreateElement({parent:iconContainer, tag:"img", attributes:{src:"../BondageClub/Icons/Remove.png", alt:"Remove"}});				
			}
		}
		
		if(applicableGroup.validation?.length == 0){
			applicableGroup.items.forEach(itemData => {
				var iconContainer = Util.CreateElement({parent:this.containerElements.itemSelection});
				var events = {};
				
				if(! itemData.validation?.length)
					events.click = function(event){this.SelectItem(itemData.itemName)}.bind(this);
				else
					for(var i = 0; i < itemData.validation.length; i++)
						Util.CreateElement({parent:iconContainer,innerHTML:itemData.validation[i],cssStyles:{top:(i+1)+"em"},cssClass:"invalid"});
				
				Util.CreateElement({parent:iconContainer, tag:"img", events:events, attributes:{src:itemData.iconUrl, alt:itemData.itemName}});
				Util.CreateElement({parent:iconContainer,innerHTML:itemData.itemName});
			})
			
			this.UpdateControlAndActionButtons();
		}else{
			applicableGroup.validation.forEach(validationError => {
				var iconContainer = Util.CreateElement({parent:this.containerElements.itemSelection,innerHTML:validationError,cssClass:"invalid"});
			});
			
			this.HideControlAndActionButtons();			
		}
	}
	
	
	this.SelectItem = function(itemName){
		this.selectedItemName = itemName;
		var validationErrors = this.mainDialog.updateDelegate.AddItem(this.selectedItemGroupName, this.selectedItemName);
		this.RenderAppearanceOrShowErrors(validationErrors);
		
		if(! validationErrors.length) this.UpdateItemGroupIconImage(this.selectedItemGroupTypeName, this.selectedItemGroupName);
		this.UpdateControlAndActionButtons();
	}
	
	
	this.UpdateItemGroupIconImage = function(itemGroupTypeName, itemGroupName){
		var wornItem; //= this.mainDialog.updateDelegate.GetCurrentWornItem(itemGroupName);
		if(wornItem){
			//current item will be displayed elsewhere
			//var itemGroupIcon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupSelection, itemGroupName);		
			//var inventoryItem = this.mainDialog.updateDelegate.inventory.items[itemGroupTypeName][itemGroupName][wornItem.itemName];
			//itemGroupIcon.childNodes[1].setAttribute("src", inventoryItem?.iconUrl ? inventoryItem.iconUrl : "./Images/Icons/e4x4.png");
		}		
	}
	
	this.UpdateControlAndActionButtons = function(){
		this.HideControlAndActionButtons();
		var buttonsToShow = [];
		
		var appliedItem = this.mainDialog.updateDelegate.GetApplicableItems()[this.selectedItemGroupTypeName][this.selectedItemGroupName].currentItem;
		this.selectedItemName = appliedItem?.name;
		
		//hide the buttons, views will be hidden later
		for(var action in this.itemActionViews)
			Util.GetFirstChildNodeByName(this.containerElements.itemActionButtons, action.toLowerCase()).style.display="none";
		
		if(appliedItem){
			if(appliedItem.colorable){
				buttonsToShow.push("Color");
				if(appliedItem.color) this.itemActionViews.Color.SetHexValue(appliedItem.color);	
			}
			
			if(appliedItem.lock || appliedItem.allowedLocks?.length){
				buttonsToShow.push("Lock");
				this.itemActionViews.Lock.SetItem(appliedItem);
			}
			
			if(appliedItem.variants){
				buttonsToShow.push("Variant");
				this.itemActionViews.Variant.SetItem(appliedItem);
			}
		}
		
		buttonsToShow.forEach(action => {Util.GetFirstChildNodeByName(this.containerElements.itemActionButtons, action.toLowerCase()).style.display="block"});
		
		//TODO:  select the first available action
		if(! buttonsToShow.includes(this.selectedAction)){
			this.itemActionViews[this.selectedAction].Hide();
		}else{
			this.itemActionViews[this.selectedAction].Show();
			Util.GetFirstChildNodeByName(this.containerElements.itemActionButtons, this.selectedAction.toLowerCase()).click();
		}
	}
	
	this.HideControlAndActionButtons = function(){
		for(var action in this.itemActionViews){
			Util.GetFirstChildNodeByName(this.containerElements.itemActionButtons, action.toLowerCase()).style.display="none";
			this.itemActionViews[action].Hide();
		}
	}
	
	/*
	this.ShowOrHideActions = function(action){
		this.selectedAction = action;
		for(var actionName in this.itemActionViews)
			this.itemActionViews[actionName].Hide();
		
		this.itemActionViews[action].Show();
	}*/
	
	
	this.ItemActionCallback_Color = function(color){
		if(! this.selectedItemGroupName) return;
		
		var validationErrors = this.mainDialog.updateDelegate.AddColor(this.selectedItemName, color);
		this.RenderAppearanceOrShowErrors(validationErrors);
	}
	
	
	this.ItemActionCallback_Lock = function(action){
		if(! this.selectedItemGroupName || ! this.selectedItemName) return;
		
		var updateCharacter = false, updateTime = false, validationErrors;
		switch(action.actionType){
			case "lock":
				validationErrors = this.mainDialog.updateDelegate.AddLock(this.selectedItemName, action.value, MainController.playerAccount.id);
				updateCharacter = true;
			break;
			case "unlock":
				validationErrors = this.mainDialog.updateDelegate.RemoveLock(this.selectedItemName);
				updateCharacter = true;
			break;
			case "updateProperty":
				validationErrors = this.mainDialog.updateDelegate.UpdateLock(this.selectedItemName, action.value);
				updateTime = true;
			break;
			
			//timer adjustment,
			/*case "selection":		
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
			break;*/
			default: throw "Unrecognized action " + action.actionType;
		}
		
		/*
		if(updateTime){
			var maxTime = Date.now() + appearanceItemCopy.lock.timer.maxTime * 1000;
			appearanceItemCopy.lock.timer.time = Math.min(maxTime, appearanceItemCopy.lock.timer.time+updateTime);
		}*/
		
		if(validationErrors.length > 0)
			this.RenderAppearanceOrShowErrors(validationErrors);
		else if(updateCharacter) 
			this.RenderAppearanceOrShowErrors(validationErrors);
		//else if(updateTime !== false)
			//this.itemActionViews.Lock.OnTimerUpdate(appearanceItemCopy.lock.timer);
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
