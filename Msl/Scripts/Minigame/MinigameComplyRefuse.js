'use strict'


var MinigameComplyRefuse = {
	status:{}
	,gameContainer:null
	,progressBarElem:null
	,endCallback:null
	,progressBarProgress:0
	,autoProgress:.25
	
	,Progress(){
		MinigameComplyRefuse.progressBarProgress += MinigameComplyRefuse.autoProgress;
		MinigameComplyRefuse.progressBarProgress = MinigameComplyRefuse.progressBarProgress < 0 ? 0 : MinigameComplyRefuse.progressBarProgress;
		
		MinigameComplyRefuse.progressBarElem.style.width = MinigameComplyRefuse.progressBarProgress + "%";
		
		if(MinigameComplyRefuse.progressBarProgress >= 100)	MinigameComplyRefuse.EndTimeout();
	}
	
	,Start(endCallback){
		MinigameComplyRefuse.status = {startTime:Date.now()};
		MinigameComplyRefuse.gameContainer = Util.CreateElement({"template":"MinigameComplyRefuseTemplate", parent:"LocationViewInput"});
		MinigameComplyRefuse.progressBarElem = MinigameComplyRefuse.gameContainer.childNodes[7].childNodes[1];
		MinigameComplyRefuse.progressBarElem.style.width = "0";
		MinigameComplyRefuse.progressBarProgress = 0;
		MinigameComplyRefuse.endCallback = endCallback;
		
		var childNodes = MinigameComplyRefuse.gameContainer.childNodes;
		childNodes[1].addEventListener("touch", (e) => MinigameComplyRefuse.EndComply());
		childNodes[3].addEventListener("touch", (e) => MinigameComplyRefuse.EndRefuse());		
		childNodes[1].addEventListener("click", (e) => MinigameComplyRefuse.EndComply());
		childNodes[3].addEventListener("click", (e) => MinigameComplyRefuse.EndRefuse());
		
		MinigameComplyRefuse.progressBarTimer = setInterval(MinigameComplyRefuse.Progress, 25);
	}
	
	,EndComply(){
		MinigameComplyRefuse.End(true);
	}
	,EndRefuse(){
		MinigameComplyRefuse.End(false);
	}
	,EndTimeout(){	
		MinigameComplyRefuse.End(false);
	}
	
	,End(success){
		clearInterval(MinigameComplyRefuse.progressBarTimer); 
		MinigameComplyRefuse.status.totalTime = Date.now() - MinigameComplyRefuse.status.startTime;
		MinigameComplyRefuse.status.result = success;
		MinigameComplyRefuse.endCallback(MinigameComplyRefuse.status);
		MinigameComplyRefuse.status = {};
		delete KeyDownEventListeners.MinigameComplyRefuse;
		MinigameComplyRefuse.gameContainer.parentNode.removeChild(MinigameComplyRefuse.gameContainer);
		MinigameComplyRefuse.gameContainer = null;
		MinigameComplyRefuse.progressBarElem = null;
	}
}