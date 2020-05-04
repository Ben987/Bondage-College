'use strict'

var MainContainer = {
	aspectRatio:.5
	,fontSizeRatio:.15
	
	,Resize() {
		var mainContainer = document.getElementById("MainContainer");
		
		var windowRatio = window.innerHeight / window.innerWidth;
		
		if (windowRatio < MainContainer.aspectRatio) {
			mainContainer.style.height = window.innerHeight + "px";
			mainContainer.style.width =  window.innerHeight / MainContainer.aspectRatio + "px";
			mainContainer.style.left = (window.innerWidth - (window.innerHeight / MainContainer.aspectRatio)) / 2 + "px";
			mainContainer.style.top = "0px";
			mainContainer.style.fontSize = window.innerHeight * MainContainer.fontSizeRatio + "%";
			
			//var w = parseInt(mainContainer.style.width), h = parseInt(mainContainer.style.height);	console.log(w/h);
		} else {
			mainContainer.style.width = window.innerWidth + "px";
			mainContainer.style.height = window.innerWidth * MainContainer.aspectRatio + "px";
			mainContainer.style.left = "0px";
			mainContainer.style.top = (window.innerHeight - (window.innerWidth * MainContainer.aspectRatio)) / 2 + "px";
			mainContainer.style.fontSize = window.innerWidth * MainContainer.aspectRatio * MainContainer.fontSizeRatio + "%";
			
			//var w = parseInt(mainContainer.style.width), h = parseInt(mainContainer.style.height);	console.log(w/h);
		}
	}
}
