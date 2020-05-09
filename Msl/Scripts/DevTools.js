'use strict';
var DevTools = {
	Init(){
		DevTools.OnScreenChange();
	}
	,UnInit(){}
	,Interrupt(){}

	,OnScreenChange(){
		if(DevToolsSettings.highilghtSpotClickDivs)
			Object.values(LocationController.delegates.actions.spotClickDivs).forEach(el => el.style.border = "1px black solid");
		
		if(DevToolsSettings.highilghtSpotFigreDivs)
			Object.values(LocationController.delegates.actions.figureClickDivs).forEach(el => el.style.border = "1px black solid");
		
		if(! DevToolsSettings.spotPositionAdjustment) return;
		
		for(let spotName in LocationController.actionDelegate.spotClickDivs){
			let toolContainer = Util.CreateElement({parent:LocationController.delegates.actions.spotClickDivs[spotName], template:"SpotClickDivToolTemplate", className:"full-block"});
			toolContainer.onclick = function(event){event.stopPropagation();}
			
			var delta = 0.5;
			
			function UpdatePosition(s, left, top, scale){
				console.log(s);
				var el1 = LocationController.delegates.actions.spotClickDivs[s], el2 = LocationController.viewDelegate.spotDivs[s];
				[el1, el2].forEach(divElement => {
					if(null != left) divElement.style.left = left + "%";
					if(null != top) divElement.style.top = top + "%";
					if(null != scale) divElement.style.width = scale + "%";
					if(null != scale) divElement.style.height = scale*2/LocationController.viewDelegate.aspectRatio + "%";
				});
				
				var str = s + "<br/>";
				str += "left: " +  el1.style.left + "<br />";
				str += "top: " + el1.style. top + "<br />";
				str += "scale: " + el1.style.width + "<br />";
				
				Util.GetFirstChildNodeWithAttribute(toolContainer, "name", "info").innerHTML = str;
			}
			
			Util.GetFirstChildNodeWithAttribute(toolContainer, "value", "Up").onclick = function(event){
				UpdatePosition(spotName, null, (parseFloat(LocationController.delegates.actions.spotClickDivs[spotName].style.top)-delta), null);
			}
			
			Util.GetFirstChildNodeWithAttribute(toolContainer, "value", "Down").onclick = function(event){
				UpdatePosition(spotName, null, (parseFloat(LocationController.delegates.actions.spotClickDivs[spotName].style.top)+delta), null);
			}
			
			Util.GetFirstChildNodeWithAttribute(toolContainer, "value", "Left").onclick = function(event){
				UpdatePosition(spotName, (parseFloat(LocationController.delegates.actions.spotClickDivs[spotName].style.left)-delta), null, null);
			}
			
			Util.GetFirstChildNodeWithAttribute(toolContainer, "value", "Right").onclick = function(event){
				UpdatePosition(spotName, (parseFloat(LocationController.delegates.actions.spotClickDivs[spotName].style.left)+delta), null, null);
			}
			
			Util.GetFirstChildNodeWithAttribute(toolContainer, "value", "+++").onclick = function(event){
				UpdatePosition(spotName, null, null, (parseFloat(LocationController.delegates.actions.spotClickDivs[spotName].style.width)+delta));
			}
			
			Util.GetFirstChildNodeWithAttribute(toolContainer, "value", "---").onclick = function(event){
				UpdatePosition(spotName, null, null, (parseFloat(LocationController.delegates.actions.spotClickDivs[spotName].style.width)-delta));
			}
			
			Util.GetFirstChildNodeWithAttribute(toolContainer, "value", "Dismiss").onclick = function(event){
				LocationController.delegates.actions.spotClickDivs[spotName].removeChild(toolContainer);
			}
			
			UpdatePosition(spotName);
		}
	}
} 