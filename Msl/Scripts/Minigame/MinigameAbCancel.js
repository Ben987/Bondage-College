'use strict'

var MinigameAbCancel = {
	highlightShadow:"2px 2px 2px darkred"
	,progressBarProgress:0
	,progressBarElem:null
	,progressBarTimer:null
	,autoProgress:null
	,mashProgress:null
	,extraChallenge:null
	,nextKey:null
	,endCallback:null
	,status:{}
	
	,mainContainer:null
	,buttons:{a:null,b:null,cancel:null}
	
	,IsInProgress(){return status.startTime > 0}
	
	,SetNextKey(key){
		this.nextKey = key;
		this.buttons.a.style.textShadow = "none";
		this.buttons.b.style.textShadow = "none";
		var elem = key == "KeyA" ? this.buttons.a : this.buttons.b;
		elem.style.textShadow = this.highlightShadow;
	}
	
	//updates progress, but not UI
	,AdvanceEffort(pressedKey, deviceBonusFactor){
		var progress = 0;
		deviceBonusFactor = deviceBonusFactor ? deviceBonusFactor : 1.0;
		if(pressedKey == this.nextKey){
			this.status.hits++;
			this.SetNextKey(this.nextKey == "KeyA" ? "KeyB" : "KeyA");
			progress = this.extraChallenge
					? (this.mashProgress * ((this.extraChallenge - this.progressBarProgress)/100)) 
					: this.mashProgress;
		}else{
			this.status.misses++;
			progress = -this.mashProgress;
		}
		
		progress *= deviceBonusFactor;
		
		this.progressBarProgress += progress;
		this.progressBarProgress = this.progressBarProgress < 0 ? 0 : this.progressBarProgress;
	}
	
	//update progress and UI
	,Progress(){
		this.progressBarProgress += this.autoProgress;
		this.progressBarProgress = this.progressBarProgress < 0 ? 0 : this.progressBarProgress;
		
		this.progressBarElem.style.width = this.progressBarProgress + "%";
		
		if(this.progressBarProgress >= 100)	this.EndSuccess();
	}
	
	
	//extra challenge of 120 is practically impossible, 100 and below theoretically impossible.
	,Start(endCallback, autoProgress, mashProgress, extraChallenge){
		this.status = {startTime:Date.now(), hits:0, misses:0};
		this.mainContainer = Util.CreateElement({"template":"MinigameAbCancelTemplate", parent:LocationController.inputContainer});
		
		this.progressBarElem = Util.GetFirstChildNodeByName(this.mainContainer, "progress").childNodes[0];
		this.progressBarElem.style.width = "0";
		this.progressBarProgress = 0;
		this.endCallback = endCallback
		this.autoProgress = autoProgress;
		this.mashProgress = mashProgress;
		this.extraChallenge = extraChallenge;
		
		this.buttons.a = Util.GetFirstChildNodeByName(this.mainContainer, "buttonA");
		this.buttons.b = Util.GetFirstChildNodeByName(this.mainContainer, "buttonB");
		this.buttons.cancel = Util.GetFirstChildNodeByName(this.mainContainer, "buttonCancel");
		
		this.buttons.a.addEventListener("touch", function(e){this.AdvanceEffort("KeyA", 2); e.stopPropagation();}.bind(this));
		this.buttons.b.addEventListener("touch", function(e){this.AdvanceEffort("KeyB", 2); e.stopPropagation();}.bind(this));		
		
		this.buttons.a.addEventListener("click", function(e){this.AdvanceEffort("KeyA", 3); e.stopPropagation();}.bind(this));
		this.buttons.b.addEventListener("click", function(e){this.AdvanceEffort("KeyB", 3); e.stopPropagation();}.bind(this));
		
		this.buttons.cancel.addEventListener("click", function(e){this.EndCancel(); e.stopPropagation();}.bind(this));
		
		KeyDownEventListeners.MinigameAbCancel = function(e){
			if(e.code == "KeyA" || e.code == "KeyB") this.AdvanceEffort(e.code);
		}.bind(this);
		
		this.SetNextKey("KeyA");		
		this.progressBarTimer = setInterval(this.Progress.bind(this), 25);
	}
	
	
	,Stop(){
		clearInterval(this.progressBarTimer);
		this.status = {};
		delete KeyDownEventListeners.MinigameAbCancel;
	}
	
	
	,End(){
		clearInterval(this.progressBarTimer); 
		this.status.totalTime = Date.now() - this.status.startTime;
		this.endCallback(this.status);
		this.status = {};
		delete KeyDownEventListeners.MinigameAbCancel;
		this.mainContainer.parentNode.removeChild(this.mainContainer);
		this.mainContainer = null;
		this.progressBarElem = null;
	}
	
	
	,EndSuccess(){
		this.status.success = true;
		this.End();
	}
	
	
	,EndCancel(){
		this.status.canceled = true;
		this.End();
	}
}