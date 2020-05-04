'use strict'

var LocationFocusView = {
	playerUpdateDelegate:null

	,mainContainer:null
	,figureContainer:null
	,itemSelectionContainer:null
	,itemActionButtonsContainer:null
	,itemGroupSelectionContainer:null
	
	,selectedItemGroupTypeName:null
	,selectedItemGroupName:null
	,selectedItemName:null
	
	,itemActionViews:{"Color":null, "Variant":null, "Lock":null, "Remote":null, "Direct":null, "Arousal":null}
	,selectedAction:"Color"
	
	,Commit(){
		if(this.playerUpdateDelegate.HasChanges()){
			LocationController.UpdatePlayer(this.playerUpdateDelegate);
			this.Dismiss();
		}else
			this.ShowErrors(["No changes"]);
	}
	,Undo(){
		this.ShowErrorsOrPlayer(this.playerUpdateDelegate.Undo());
	}
	,Dismiss(){
		this.playerUpdateDelegate = this.undefined;
		Util.DetachElementsAndClear(LocationView.actionIcons);
	}
	
	,Show(player){
		this.playerUpdateDelegate = player.GetUpdateDelegate();
		Util.DetachElementsAndClear(LocationView.actionIcons);
		this.mainContainer = Util.CreateElement({parent:"LocationViewInput", template:"FocusSelfTemplate"});
		LocationView.actionIcons.push(this.mainContainer);
		
		this.figureContainer = Util.GetFirstChildNodeByName(this.mainContainer, "figureContainer");
		this.itemSelectionContainer = Util.GetFirstChildNodeByName(this.mainContainer, "itemSelection");
		this.itemActionButtonsContainer = Util.GetFirstChildNodeByName(this.mainContainer, "itemActionButtons");
		this.itemGroupSelectionContainer = Util.GetFirstChildNodeByName(this.figureContainer, "itemGroupSelection");
		
		for(var actionName in this.itemActionViews){
			var containerElement = Util.GetFirstChildNodeByName(this.mainContainer, "item"+actionName+"Actions");
			var constructorFunction = window[actionName + "ActionView"];
			if(constructorFunction && containerElement)
				this.itemActionViews[actionName] = new constructorFunction(containerElement, this["ItemActionCallback" + actionName]);
			else
				console.log("invalid conf for " + actionName + " " + containerElement + " " + constructorFunction);
		}
		
		this.BuildPlayerFigureAndIconsAndEvents();
	}
	
	,ShowErrorsOrPlayer(validationErrors){
		if(validationErrors?.length === 0){
			this.ShowPlayer();
		}else{
			this.ShowErrors(validationErrors);
		}
		
		this.UpdateControlAndActionButtons();
	}
	
	,ShowPlayer(){
		this.figureContainer.removeChild(this.figureContainer.figure);
		this.BuildPlayerFigureAndIconsAndEvents();
	}
	
	,ShowErrors(validationErrors){
		validationErrors.forEach(error => {
			var errorDiv = Util.CreateElement({
				parent:this.figureContainer
				,innerHTML:error
				,className:"validation_message_fadout"
			});
			setTimeout(() => {errorDiv.parentNode.removeChild(errorDiv);}, 4000);
		});
	}
	
	,BuildPlayerFigureAndIconsAndEvents(){
		LocationView.BuildPlayerFigure(this.figureContainer, this.playerUpdateDelegate.appearance);
		
		Util.MoveNodeToEndOfList(this.itemGroupSelectionContainer);
		
		for(let itemGroupTypeName in this.playerUpdateDelegate.inventory.items){
			var icon = Util.GetFirstChildNodeByName(Util.GetFirstChildNodeByName(this.mainContainer, "itemGroupTypeSelection"), itemGroupTypeName)
			icon.addEventListener("click", (e) => this.OnItemGroupTypeClick(e, itemGroupTypeName));
		}
	}
	
	
	,OnItemGroupTypeClick(e, itemGroupTypeName){
		e.stopPropagation();
		LocationFocusView.selectedItemGroupTypeName = itemGroupTypeName;
		
		Util.ClearNodeContent(this.itemSelectionContainer);
		Util.HideAllChildNodes(this.itemGroupSelectionContainer);
		
		for(let itemGroupName in this.playerUpdateDelegate.inventory.items[itemGroupTypeName]){
			var itemGroupIcon = Util.GetFirstChildNodeByName(this.itemGroupSelectionContainer, itemGroupName);
			if(! itemGroupIcon) throw "No item group icon defined for " + itemGroupName
			itemGroupIcon.style.display = "block";
			itemGroupIcon.addEventListener("click", (e) => this.OnItemGroupClick(e, itemGroupName));
			
			this.UpdateItemGroupIconImage(this.selectedItemGroupTypeName, itemGroupName);
		}
	}
	
	
	,OnItemGroupClick(e, itemGroupName){
		e.stopPropagation();
		LocationFocusView.selectedItemGroupName = itemGroupName;
		Util.ClearNodeContent(this.itemSelectionContainer);
		
		Util.SelectElementAndDeselectSiblings(event.target.parentNode, "selected");
		
		for(let itemName in this.playerUpdateDelegate.inventory.items[this.selectedItemGroupTypeName][itemGroupName]){
			let itemData = this.playerUpdateDelegate.inventory.items[this.selectedItemGroupTypeName][itemGroupName][itemName];
			
			var iconContainer = Util.CreateElement({parent:this.itemSelectionContainer});
			var events = {};
			
			if(itemData.validation.length == 0)
				events.click = (e) => this.OnItemClick(e, itemName);
			else
				for(var i = 0; i < itemData.validation.length; i++)
					Util.CreateElement({parent:iconContainer,innerHTML:itemData.validation[i],cssStyles:{color:"#fcc",top:(i+1)+"em",fontSize:"1em"}});
			
			Util.CreateElement({parent:iconContainer, tag:"img", events:events, attributes:{src:itemData.iconUrl, alt:itemName}});
			if(! itemData.owned) Util.CreateElement({parent:iconContainer,innerHTML:"NOT OWNED",cssStyles:{color:"#f88",top:7+"em",fontSize:".8em"}});
			Util.CreateElement({parent:iconContainer,innerHTML:itemName,cssStyles:{fontSize:".8em"}});
		}
		
		this.UpdateControlAndActionButtons();
	}
	
	
	,OnItemClick(e, itemName){
		e.stopPropagation();
		this.selectedItemName = itemName;
		var appearanceItem = F3dcgAssets.InitAppearanceItem(this.selectedItemGroupTypeName, this.selectedItemGroupName, this.selectedItemName);
		var validationErrors = this.playerUpdateDelegate.Add(appearanceItem);
		this.ShowErrorsOrPlayer(validationErrors);
		if(! validationErrors.length) this.UpdateItemGroupIconImage(this.selectedItemGroupTypeName, this.selectedItemGroupName);
	}
	
	
	,UpdateItemGroupIconImage(itemGroupTypeName, itemGroupName){
		var wornItem = this.playerUpdateDelegate.appearance.items[itemGroupName];
		if(wornItem){
			var itemGroupIcon = Util.GetFirstChildNodeByName(this.itemGroupSelectionContainer, itemGroupName);		
			var inventoryItem = this.playerUpdateDelegate.inventory.items[itemGroupTypeName][itemGroupName][wornItem.itemName];
			itemGroupIcon.childNodes[1].setAttribute("src", inventoryItem?.iconUrl ? inventoryItem.iconUrl : "./Images/Icons/e4x4.png");
		}		
	}
	
	
	,UpdateControlAndActionButtons(){
		var wornItem = this.playerUpdateDelegate.appearance.items[this.selectedItemGroupName];
		
		var buttonsToShow = [];
		for(var action in this.itemActionViews)
			Util.GetFirstChildNodeWithAttribute(this.itemActionButtonsContainer, "alt", action).style.display="none";
		
		if(wornItem){
			var inventoryItem = this.playerUpdateDelegate.inventory.items[this.selectedItemGroupTypeName][this.selectedItemGroupName][wornItem.itemName];
			if(! inventoryItem) inventoryItem = {};//to avoid null reference
			
			if(wornItem.colorize){
				buttonsToShow.push("Color");
				if(wornItem.color) this.itemActionViews.Color.SetColor(wornItem.color);	
			}
			
			if(wornItem.lock || wornItem.allowedLocks?.length > 0){
				buttonsToShow.push("Lock");
				this.itemActionViews.Lock.SetItem(wornItem, inventoryItem, this.playerUpdateDelegate.inventory.locks, this.playerUpdateDelegate.inventory.keys);
			}
			
			if(inventoryItem.variants){
				buttonsToShow.push("Variant");
				this.itemActionViews.Variant.SetItem(wornItem, inventoryItem);
			}
		}
		
		buttonsToShow.forEach(altValue => Util.GetFirstChildNodeWithAttribute(this.itemActionButtonsContainer, "alt", altValue).style.display="block");
		
		if(! buttonsToShow.includes(this.selectedAction)) 
			this.itemActionViews[this.selectedAction].Hide();
		else
			this.itemActionViews[this.selectedAction].Show();
	}
	
	
	,ShowOrHideActions(action){
		this.selectedAction = action;
		for(var actionName in this.itemActionViews)
			this.itemActionViews[actionName].Hide();
		
		this.itemActionViews[action].Show();
	}
	
	
	,ItemActionCallbackColor(color){
		if(!color || ! LocationFocusView.selectedItemGroupName || ! LocationFocusView.figureContainer) return;
		
		var appearanceItemWorn = LocationFocusView.playerUpdateDelegate.appearance.items[LocationFocusView.selectedItemGroupName];
		var appearanceItemCopy = Util.CloneRecursive(appearanceItemWorn);
		appearanceItemCopy.color = color;
		LocationFocusView.ShowErrorsOrPlayer(LocationFocusView.playerUpdateDelegate.Add(appearanceItemCopy));
	}
	
	
	,ItemActionCallbackLock(action){
		var appearanceItemWorn = LocationFocusView.playerUpdateDelegate.appearance.items[LocationFocusView.selectedItemGroupName];
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
		
		var validationErrors = LocationFocusView.playerUpdateDelegate.Add(appearanceItemCopy);
		if(validationErrors.length > 0)
			LocationFocusView.ShowErrors(validationErrors);
		else if(updateCharacter) 
			LocationFocusView.ShowErrorsOrPlayer(validationErrors)
		else if(updateTime !== false)
			LocationFocusView.itemActionViews.Lock.OnTimerUpdate(appearanceItemCopy.lock.timer);
		
	}
	
	,ItemActionCallbackVariant(itemVariantName){
		var appearanceItemWorn = LocationFocusView.playerUpdateDelegate.appearance.items[LocationFocusView.selectedItemGroupName];
		if(itemVariantName == appearanceItemWorn.itemVariantName) return;
		
		var appearanceItemCopy = Util.CloneRecursive(appearanceItemWorn);
		appearanceItemCopy.itemVariantName = itemVariantName;
		
		var validationErrors = LocationFocusView.playerUpdateDelegate.Add(appearanceItemCopy);
		LocationFocusView.ShowErrorsOrPlayer(validationErrors)
	}
	
	
	,ItemActionCallbackRemote(){}
	,ItemActionCallbackDirect(){}
	,ItemActionCallbackArousal(){}
}
