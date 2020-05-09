'use strict'

var LocationMinigames = {
	Init(){}
	,UnInit(){}
	,OnScreenChange(){}
	,Interrupt(){}
	
	,StartMinigame(params, endCallback){
		switch(params.type){
			case "ComplyRefuse":
				MinigameComplyRefuse.Start(endCallback, params.autoProgress);
			break;
			case "AbCancel":
				MinigameAbCancel.Start(endCallback, params.autoProgress, params.mashProgress, params.extraChallenge); 
			break;
			default:  throw "Not implemented " + params.type;
		}
	}
}