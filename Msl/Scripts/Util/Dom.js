'use strict'

Util.ProcessIncludes = function(callback){
	var includes = document.getElementsByTagName("include");//is dynamic list
	var loadCount = 0, totalToLoad = includes.length;
	for(var i = 0; i < includes.length; i++){
		let includeElement = includes[i];
		var r = new XMLHttpRequest();
		r.open("GET", includeElement.getAttribute("src"));
		r.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var el = Util.CreateElement({
					parent:includeElement.parentNode,  innerHTML : this.responseText, insertBefore:includeElement
					,className:includeElement.className
					,attributes:{id:includeElement.getAttribute("id"), name:includeElement.getAttribute("name")}
				});
				includeElement.parentNode.removeChild(includeElement);
				if(++loadCount == totalToLoad && callback) callback();				
			}
		}
		r.send();
	}	
}
	

Util.CreateElement = function(params){
	var element = params.template ? document.getElementById(params.template).cloneNode(true) : document.createElement(params.tag ? params.tag : "DIV");
	element.removeAttribute("id");
	
	if(params.innerHTML) 
		element.innerHTML = params.innerHTML;
	
	if(params.textContent)
		element.appendChild(document.createTextNode(params.textContent));
	
	for(var key in params.attributes)
		if(params.attributes[key])
			element.setAttribute(key, params.attributes[key]);
	
	for(var key in params.events) 
		if(params.events[key])
			element.addEventListener(key, params.events[key]);
	
	if(params.className) 
		element.className = params.className;
	
	if(params.cssClass) 
		element.className = params.cssClass;
	
	if(params.cssText) 
		element.style.cssText = params.cssText ;
	
	for(var key in params.cssStyles ) 
		element.style[key] = params.cssStyles[key] ;
	
	if(params.parent){
		var parent = typeof(params.parent) === "string" ? document.getElementById(params.parent) : params.parent;
		if(params.insertFirst)
			parent.insertBefore(element, parent.firstElementChild);
		else if(params.insertBefore)
			parent.insertBefore(element, params.insertBefore);
		else
			parent.appendChild(element);
	}
	
	return element;
}


Util.HideAllChildNodes = function(node){
	for(var i = 0; i < node.childNodes.length; i++)
		if(node.childNodes[i].nodeType == 1)
			node.childNodes[i].style.display = "none";
}
	
Util.MoveNodeToEndOfList = function(node){
	var parentNode = node.parentNode;
	parentNode.removeChild(node);
	parentNode.appendChild(node);
}
	
Util.ClearNodeContent = function(node){
	while(node.lastElementChild)
		node.removeChild(node.lastElementChild);
}
	
Util.GetFirstChildNodeWithAttribute = function(element, attributeName, attributeValue){
	for(var i = 0; i < element.childNodes.length; i++)
		if(element.childNodes[i].getAttribute && attributeValue === element.childNodes[i].getAttribute(attributeName))
			return element.childNodes[i];
}
	
Util.GetFirstChildNodeByName = function(element, name){
	return Util.GetFirstChildNodeWithAttribute(element, "name", name);
}

Util.SelectElementAndDeselectSiblings = function(elementToSelect, selectionCssClass){
	var nodes = elementToSelect.parentNode.childNodes;
	for(var i = 0; i < nodes.length; i++)
		if(nodes[i].nodeType == 1)
			nodes[i].classList.remove(selectionCssClass);
		
	if(elementToSelect) elementToSelect.classList.add(selectionCssClass);
}
	
Util.DetachElementsAndClear = function(listOrMap){
	if(listOrMap.forEach){
		listOrMap.forEach(el => el.parentNode.removeChild(el));
		listOrMap.length = 0;
	}else{
		for(var key in listOrMap){
			listOrMap[key].parentNode.removeChild(listOrMap[key]);
			delete listOrMap[key];
		}
	}
}

Util.ScrollableElementIsAtBottom = function(element){
	return Math.abs(Math.ceil(element.scrollHeight - element.scrollTop) - element.clientHeight) < 10;
}

Util.DateTime = {
	FormatSimplest(timestamp){
		var days = Math.floor(timestamp / (1000 * 60 * 60 * 24));
		var hours = Math.floor((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((timestamp % (1000 * 60)) / 1000);
		return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
	}
	
	,InitCountdown(element, timestamp, callback){
		element.innerHTML = Util.DateTime.FormatSimplest(timestamp - new Date().getTime());
		
		let scheduledInterval = setInterval(function() {
			var timeRemaining = timestamp - new Date().getTime();
			element.innerHTML = Util.DateTime.FormatSimplest(timeRemaining);
			if(! element.parentNode)
				clearInterval(scheduledInterval);
			
			if (timeRemaining <= 0) {
				clearInterval(scheduledInterval);
				if(callback) callback();
			}
		}, 1000);
	}
}
	