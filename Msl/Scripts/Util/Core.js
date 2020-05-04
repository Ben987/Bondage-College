'use strict'


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
	
