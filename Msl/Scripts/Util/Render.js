'use strict'

//Color and Rendering

Util.imageCache = {}
Util.CreateImageElement = function(src, parent, cS, scaleX, scaleY, callback, placeholderElement){
	var cachedImage = this.imageCache[src];
	
	if(! cachedImage){
		var placeholder = Util.CreateElement({parent:parent,cssStyles:{display:"none"}});
		var imageElement = document.createElement("img");
		imageElement.src = src;
		imageElement.onload =  function(event){
			Util.imageCache[src] = event.target;
			Util.CreateImageElement(src, parent, cS, scaleX, scaleY, callback, placeholder);
		};
	}
	else{
		var imageElement = cachedImage.cloneNode(false);
		
		for(var key in cS) imageElement.style[key] = cS[key] ;			
		imageElement.style.width = imageElement.naturalWidth * scaleX + "%"; 
		imageElement.style.height = imageElement.naturalHeight * scaleY + "%";
		imageElement.style.visibility = "visible";
		
		if(placeholderElement){
			parent.insertBefore(imageElement, placeholderElement);
			parent.removeChild(placeholderElement);
		}else
			parent.appendChild(imageElement);
		
		imageElement.onload = this.undefined;
		callback(imageElement);
	}
}

Util.imageDataCache = {}
Util.cachedCanvas = null
Util.ColorizeImage = function(imageElement, color, fullAlpha){
	if(!this.cachedCanvas) this.cachedCanvas = document.createElement("Canvas");
	
	if(! this.imageDataCache[imageElement.src]){
		this.cachedCanvas.width = imageElement.naturalWidth;
		this.cachedCanvas.height = imageElement.naturalHeight;
		var ctx = this.cachedCanvas.getContext("2d");
		ctx.drawImage(imageElement, 0, 0);
		this.imageDataCache[imageElement.src] = ctx.getImageData(0, 0, this.cachedCanvas.width, this.cachedCanvas.height);
	}
	
	var imageData = new ImageData(new Uint8ClampedArray(this.imageDataCache[imageElement.src].data), imageElement.naturalWidth, imageElement.naturalHeight);
	var data = imageData.data;
	
	if(fullAlpha){
		for (var p = 0, len = data.length; p < len; p += 4) {
			if (data[p + 3] == 0)	continue;
			var trans = ((data[p] + data[p + 1] + data[p + 2]) / 383);
			data[p + 0] = color.red * trans;
			data[p + 1] = color.green * trans;
			data[p + 2] = color.blue * trans;
		}
	}else{
		for (var p = 0, len = data.length; p < len; p += 4) {
			var trans = ((data[p] + data[p + 1] + data[p + 2]) / 383);
			if ((data[p + 3] == 0) || (trans < 0.8) || (trans > 1.2))	continue;
			data[p + 0] = color.red * trans;
			data[p + 1] = color.green * trans;
			data[p + 2] = color.blue * trans;
		}
	}
	
	this.cachedCanvas.width = imageElement.naturalWidth;
	this.cachedCanvas.height = imageElement.naturalHeight;
	this.cachedCanvas.getContext('2d').putImageData(imageData, 0, 0);
	imageElement.src = this.cachedCanvas.toDataURL();
}
	