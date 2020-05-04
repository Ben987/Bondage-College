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
	
	,IsInProgress(){return status.startTime > 0}
	
	,SetNextKey(key){
		MinigameAbCancel.nextKey = key;
		MinigameAbCancel.gameContainer.childNodes[1].style.textShadow = "none";
		MinigameAbCancel.gameContainer.childNodes[3].style.textShadow = "none";
		var elem = key == "KeyA" ? MinigameAbCancel.gameContainer.childNodes[1] : MinigameAbCancel.gameContainer.childNodes[3];
		elem.style.textShadow = MinigameAbCancel.highlightShadow;
	}
	
	
	,AdvanceEffort(pressedKey, deviceBonusFactor){
		var progress = 0;
		deviceBonusFactor = deviceBonusFactor ? deviceBonusFactor : 1.0;
		if(pressedKey == MinigameAbCancel.nextKey){
			MinigameAbCancel.status.hits++;
			MinigameAbCancel.SetNextKey(MinigameAbCancel.nextKey == "KeyA" ? "KeyB" : "KeyA");
			progress = MinigameAbCancel.extraChallenge
					? (MinigameAbCancel.mashProgress * ((MinigameAbCancel.extraChallenge - MinigameAbCancel.progressBarProgress)/100)) 
					: MinigameAbCancel.mashProgress;
		}else{
			MinigameAbCancel.status.misses++;
			progress = -MinigameAbCancel.mashProgress;
		}
		
		progress *= deviceBonusFactor;
		
		MinigameAbCancel.progressBarProgress += progress;
		MinigameAbCancel.progressBarProgress = MinigameAbCancel.progressBarProgress < 0 ? 0 : MinigameAbCancel.progressBarProgress;
	}
	
	
	,Progress(){
		MinigameAbCancel.progressBarProgress += MinigameAbCancel.autoProgress;
		MinigameAbCancel.progressBarProgress = MinigameAbCancel.progressBarProgress < 0 ? 0 : MinigameAbCancel.progressBarProgress;
		
		MinigameAbCancel.progressBarElem.style.width = MinigameAbCancel.progressBarProgress + "%";
		
		if(MinigameAbCancel.progressBarProgress >= 100)	MinigameAbCancel.EndSuccess();
	}
	
	
	//extra challenge of 120 is practically impossible, 100 and below theoretically impossible.
	,Start(endCallback, autoProgress, mashProgress, extraChallenge){
		MinigameAbCancel.status = {startTime:Date.now(), hits:0, misses:0};
		MinigameAbCancel.gameContainer = Util.CreateElement({"template":"MinigameAbCancelTemplate", parent:"LocationViewInput"});
		MinigameAbCancel.progressBarElem = MinigameAbCancel.gameContainer.childNodes[7].childNodes[1];
		MinigameAbCancel.progressBarElem.style.width = "0";
		MinigameAbCancel.progressBarProgress = 0;
		MinigameAbCancel.endCallback = endCallback
		MinigameAbCancel.autoProgress = autoProgress;
		MinigameAbCancel.mashProgress = mashProgress;
		MinigameAbCancel.extraChallenge = extraChallenge;
		
		var childNodes = MinigameAbCancel.gameContainer.childNodes;
		childNodes[1].addEventListener("touch", (e) => {MinigameAbCancel.AdvanceEffort("KeyA", 2); e.stopPropagation();});
		childNodes[3].addEventListener("touch", (e) => {MinigameAbCancel.AdvanceEffort("KeyB", 2); e.stopPropagation();});		
		childNodes[1].addEventListener("click", (e) => {MinigameAbCancel.AdvanceEffort("KeyA", 3); e.stopPropagation();});
		childNodes[3].addEventListener("click", (e) => {MinigameAbCancel.AdvanceEffort("KeyB", 3); e.stopPropagation();});
		childNodes[childNodes.length-2].addEventListener("click", (e) => {MinigameAbCancel.EndCancel(); e.stopPropagation();});
		
		KeyDownEventListeners.MinigameAbCancel = function(e){
			if(e.code == "KeyA" || e.code == "KeyB") MinigameAbCancel.AdvanceEffort(e.code);
		}
		
		MinigameAbCancel.SetNextKey("KeyA");		
		MinigameAbCancel.progressBarTimer = setInterval(MinigameAbCancel.Progress, 25);
	}
	
	
	,Stop(){
		clearInterval(MinigameAbCancel.progressBarTimer);
		MinigameAbCancel.status = {};
		delete KeyDownEventListeners.MinigameAbCancel;
	}
	
	
	,End(){
		clearInterval(MinigameAbCancel.progressBarTimer); 
		MinigameAbCancel.status.totalTime = Date.now() - MinigameAbCancel.status.startTime;
		MinigameAbCancel.endCallback(MinigameAbCancel.status);
		MinigameAbCancel.status = {};
		delete KeyDownEventListeners.MinigameAbCancel;
		MinigameAbCancel.gameContainer.parentNode.removeChild(MinigameAbCancel.gameContainer);
		MinigameAbCancel.gameContainer = null;
		MinigameAbCancel.progressBarElem = null;
	}
	
	
	,EndSuccess(){
		MinigameAbCancel.status.success = true;
		MinigameAbCancel.End();
	}
	
	
	,EndCancel(){
		MinigameAbCancel.status.canceled = true;
		MinigameAbCancel.End();
	}
}