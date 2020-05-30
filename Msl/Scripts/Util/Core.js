'use strict'


Util.GetProperty = function(obj, property){
	var propertyPathStack = property.split(".");

	for(var i = 0; i < propertyPathStack.length - 1; i++)
		obj = obj[propertyPathStack[i]];
	
	return obj[propertyPathStack[propertyPathStack.length-1]];
}


Util.SetProperty = function(obj, property, value){
	var propertyPathStack = property.split(".");

	for(var i = 0; i < propertyPathStack.length - 1; i++)
		obj = obj[propertyPathStack[i]];
	
	obj[propertyPathStack[propertyPathStack.length-1]] = value;
}


Util.ReplaceInPlace = function(existingObject, sourceObject){
	for(var key in existingObject) delete existingObject[key];
	for(var key in sourceObject) existingObject[key] = sourceObject[key];
}

Util.CloneRecursive = function(o){
	if(o === null) return o;
	
	var clone = o;
	if(Array.isArray(o)){
		clone = [];
		o.forEach(value => {clone.push(this.CloneRecursive(value))});
	}else if(typeof o === 'object'){
		clone = {}
		for(var key in o) clone[key] = this.CloneRecursive(o[key]);
	}
	
	return clone;
}

Util.RandomId = function(){
	return Math.random().toString(36).replace('0.', '') 
}


Util.setCookie = function(params) {
    var expires = "";
    
	if (params.days) {
        var date = new Date();
        date.setTime(date.getTime() + (params.days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
	
	var path = params.path ? params.path : "/";
	
    document.cookie = params.name + "=" + (params.value || "")  + expires + "; path=" + path;
}

Util.getCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

Util.eraseCookie = function(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}





