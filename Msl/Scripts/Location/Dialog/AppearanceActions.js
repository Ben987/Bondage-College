'use strict'

var DialogAppearanceActionView = function(container, callback){
	this.container = container;
	this.callback = callback;
	this.Show = function(){
		this.container.style.display = "block";
	}
	this.Hide = function(){
		this.container.style.display = "none";
	}
	this.ShowOrHide = function(){
		this.container.style.display = this.container.style.display == "block" ? "none" : "block";
	}
}


var LockDialogAppearanceActionView = function(container, callback) {
	this.prototype = Object.create(DialogAppearanceActionView.prototype);
	DialogAppearanceActionView.call(this, container, callback);
	
	this.SetItem = function(appearanceItem, inventoryItem, inventoryLocks, inventoryKeys){
		Util.ClearNodeContent(this.container);
		
		if(appearanceItem.lock)
			this.SetItemLocked(appearanceItem.lock, inventoryLocks, inventoryKeys);
		else
			this.SetItemUnlocked(appearanceItem.allowedLocks, inventoryLocks);
	}
	
	this.SetItemLocked = function(lock,  inventoryLocks, inventoryKeys){
		Util.CreateElement({parent:this.container, tag:"img"
			,attributes:{src:inventoryLocks[lock.itemName].iconUrl, alt:lock.itemName}
			,cssClass:"focus-item-actions-lock-present"
		});
		
		if(lock.unlockable){
			var itemNameKey = lock.itemName;
			Util.CreateElement({parent:this.container, tag:"img"
				,attributes:{src:inventoryKeys[itemNameKey].iconUrl, alt:itemNameKey}
				,events:{click:(event) =>{
					this.callback({actionType:"unlock"});
				}}
			});
		}
		
		Util.CreateElement({parent:this.container, tag:"br", cssStyles:{clear:"both"}});
		Util.CreateElement({parent:this.container, innerHTML:"Locked by " + lock.originPlayerId});
		
		if(lock.timer) this.ShowItemLockedTimer(lock.timer);
	}
	
	
	this.timerCountdownElement = {};
	this.OnTimerUpdate = function(timer){		
		this.RemoveTimer();
		
		if(timer.showTimer){
			this.timerCountdownElement = Util.CreateElement({parent:this.container});
			Util.DateTime.InitCountdown(this.timerCountdownElement, timer.time, this.RemoveTimer);
		}else{
			this.timerCountdownElement = Util.CreateElement({parent:this.container, innerHTML:"Uknown time left"});
		}
	}
	
	this.RemoveTimer = function(){
		if(this.timerCountdownElement?.parentNode){
			this.timerCountdownElement.parentNode.removeChild(this.timerCountdownElement);
			this.timerCountdownElement = null;
		}		
	}
	
	this.ShowItemLockedTimer = function(timer){//time:AppItem.Property.RemoveTimer,removeItem:AppItem.Property.RemoveItem,showTime:AppItem.Property.ShowTimer,enableRandomInput:AppItem.Property.EnableRandomInput
		if(timer.showTimer){
			this.timerCountdownElement = Util.CreateElement({parent:this.container});
			Util.DateTime.InitCountdown(this.timerCountdownElement, timer.time, this.RemoveTimer);
		}else{
			this.timerCountdownElement = Util.CreateElement({parent:this.container, innerHTML:"Uknown time left"});
		}
		
		var removalText = timer.removeItem ? "Item will be removed" : "Item will NOT be removed";
		Util.CreateElement({parent:this.container, innerHTML:removalText});
		
		for(let actionType in timer.actions){
			switch(actionType){
				case "plus":
					Util.CreateElement({
						parent:this.container,tag:"input"
						,attributes:{type:"submit",value:"Add " + timer.actions[actionType]}
						,events:{click:function(event){this.callback({actionType:actionType, value:timer.actions[actionType]});}.bind(this)
					}});
				break;
				case "minus":
					Util.CreateElement({
						parent:this.container,tag:"input"
						,attributes:{type:"submit",value:"Subtract " + timer.actions[actionType]}
						,events:{click:function(event){this.callback({actionType:actionType, value:timer.actions[actionType]});}.bind(this)
					}});
				break;
				case "random":	
					Util.CreateElement({
						parent:this.container,tag:"input"
						,attributes:{type:"submit",value:"Random"}
						,events:{click:function(event){this.callback({actionType:actionType, value:timer.actions[actionType]});}.bind(this)
					}});
				break;
				
				case "selection":
					let timeSelection = Util.CreateElement({parent:this.container, tag:"select"});
					timer.actions[actionType].forEach(sel => {
						Util.CreateElement({parent:timeSelection, tag:"option", attributes:{value:sel}, innerHTML:sel});
					})
					Util.CreateElement({parent:this.container, tag:"input", attributes:{type:"submit",value:"Add/Subtract Time"}, events:{click:function(event){
						this.callback({actionType:actionType, value:timeSelection.value});}.bind(this)
					}});
				break;
			}
		}
		Util.CreateElement({parent:this.container,tag:"br"});
		
		for(let actionType in timer.management){
			var checkboxContainer = Util.CreateElement({parent:this.container});
			var attributes = timer.management[actionType] ? {type:"checkbox", checked:true} : {type:"checkbox"};
			let checkboxElement = Util.CreateElement({parent:checkboxContainer,tag:"input",attributes:attributes});
			Util.CreateElement({parent:checkboxContainer,tag:"label",innerHTML:actionType});
			
			checkboxContainer.addEventListener("click", function(event){
				event.stopPropagation();
				timer.management[actionType] = ! timer.management[actionType];
				checkboxElement.checked = timer.management[actionType];
				this.callback({actionType:actionType, value:timer.management[actionType]});
			}.bind(this));
		}
	} 
	
	this.SetItemUnlocked = function(allowedLocks, inventoryLocks){
		allowedLocks.forEach(lockName => {
			var lock = inventoryLocks[lockName];
			var lockImage = Util.CreateElement({parent:this.container, tag:"img"
				,attributes:{src:lock.iconUrl, alt:lock.itemName}
				,events:{click:(event) =>{
					this.callback({actionType:"lock", value:lock.itemName});
				}}
			});	
		});
	}
}


var VariantDialogAppearanceActionView = function(container, callback) {
	this.prototype = Object.create(DialogAppearanceActionView.prototype);
	DialogAppearanceActionView.call(this, container, callback);
	
	this.SetItem = function(appearanceItem, inventoryItem){
		Util.ClearNodeContent(this.container);
		for(let variantName in inventoryItem.variants){
			var variantData = inventoryItem.variants[variantName];
			
			var iconContainer = Util.CreateElement({parent:this.container});
			Util.CreateElement({parent:iconContainer,innerHTML:variantName,cssStyles:{fontSize:".8em"}});
			
			var events = {};
			if(variantData.validation?.length == 0)
				events.click = (event) => this.callback(variantName);
			else
				for(var i = 0; i < variantData.validation?.length; i++)
					Util.CreateElement({parent:iconContainer,innerHTML:variantData.validation[i],cssStyles:{color:"#fcc",top:(i+1)+"em",fontSize:"1em"}});
			
			Util.CreateElement({parent:iconContainer, tag:"img",attributes:{src:inventoryItem.variants[variantName].iconUrl, alt:variantName},events:events});		
		};
	}
	
	this.Show = function(){
		this.container.style.display = "block";
	}
	this.Hide = function(){
		this.container.style.display = "none";
	}	
};


var RemoteDialogAppearanceActionView = function(container, callback) {
	this.prototype = Object.create(DialogAppearanceActionView.prototype);
	DialogAppearanceActionView.call(this, container, callback);
};


var DirectDialogAppearanceActionView = function(container, callback) {
	this.prototype = Object.create(DialogAppearanceActionView.prototype);
	DialogAppearanceActionView.call(this, container, callback);
};


var ArousalDialogAppearanceActionView = function(container, callback) {
	this.prototype = Object.create(DialogAppearanceActionView.prototype);
	DialogAppearanceActionView.call(this, container, callback);
};



var ColorDialogAppearanceActionView = function(container, callback) {
	this.prototype = Object.create(DialogAppearanceActionView.prototype);
	DialogAppearanceActionView.call(this, container, callback);
	
	this.containerHue = Util.GetFirstChildNodeByName(this.container, "hue");
	this.containerSat = Util.GetFirstChildNodeByName(this.container, "saturation");
	this.containerLig = Util.GetFirstChildNodeByName(this.container, "lightness");
	this.hexColorStringInput = Util.GetFirstChildNodeByName(this.container, "hexColorString");
	
	this.SetHexValue = function(value){
		if(! value) return;
		
		try{
			var color = new Util.Color.Instance(Util.Color.TYPE_HEXSTRING, value);
			this.UpdateInputText(color);
			this.UpdateInputRanges(color);
			this.UpdateBackgrounds(color);			
		}catch(e){return;}
	}
	
	this.SetColor = function(color){
		this.UpdateInputText(color);
		this.UpdateInputRanges(color);
		this.UpdateBackgrounds(color);	
	}

	this.UpdateFromInputElementText = function(){
		try{
			if(! this.hexColorStringInput.value || this.hexColorStringInput.value == "#"){
				this.callback(null);
			}else{
				var color = new Util.Color.Instance(Util.Color.TYPE_HEXSTRING, this.hexColorStringInput.value);
				this.UpdateInputRanges(color);
				this.UpdateBackgrounds(color);
				this.callback(color);
			}
		}catch(e){console.log(e);return;}
	}
	
	this.UpdateFromInputElementsRanges = function(){
		var color = new Util.Color.Instance(Util.Color.TYPE_HSL
				,[this.containerHue.childNodes[1].value, this.containerSat.childNodes[1].value, this.containerLig.childNodes[1].value]);
		
		this.UpdateInputText(color);
		this.UpdateBackgrounds(color);
		
		this.callback(color);
	}
	
	this.UpdateInputText = function(color){
		this.hexColorStringInput.value = color.ToHexString();
	}
	this.UpdateInputRanges = function(color){
		this.containerHue.childNodes[1].value = color.hue;
		this.containerSat.childNodes[1].value = color.saturation;
		this.containerLig.childNodes[1].value = color.lightness;	
	}
	this.UpdateBackgrounds = function(color){
		this.hexColorStringInput.style.backgroundColor = color.ToCssColor();
		
		var saturation = color.saturation, lightness = color.lightness;
		
		color.SetSaturation(0);
		var rgb1 = color.ToCssColor();
		color.SetSaturation(100);
		var rgb2 = color.ToCssColor();
		this.containerSat.style.backgroundImage = "linear-gradient(to right, "+rgb1+"," + rgb2 + ")";
		
		color.SetSaturation(saturation);
		color.SetLightness(0);
		var rgb0 = color.ToCssColor();
		color.SetLightness(50);
		var rgb1 = color.ToCssColor();
		color.SetLightness(100);
		var rgb2 = color.ToCssColor();
		this.containerLig.style.backgroundImage = "linear-gradient(to right, "+rgb0+","+rgb1+","+rgb2+")";
		color.SetLightness(lightness);
	}
	
	this.hexColorStringInput.addEventListener("change", this.UpdateFromInputElementText.bind(this));
	this.containerHue.addEventListener("change", this.UpdateFromInputElementsRanges.bind(this));
	this.containerSat.addEventListener("change", this.UpdateFromInputElementsRanges.bind(this));
	this.containerLig.addEventListener("change", this.UpdateFromInputElementsRanges.bind(this));
}

