'use strict'

var MslServer = {
	socket:null
	,responseCallbacks:{}
	,Init(){
		//console.log(ServerURL + "/msl");
		MslServer.socket = io(ServerURL + "/msl");
		
		MslServer.socket.on("AllOfThem", resp => {MslServer.ServerResponse(resp); });
	}
	
	,ServerResponse(resp, callback){
		if(! resp.meta.messageId){
			console.log(resp);
		}else{
			var callbacks = MslServer.responseCallbacks[resp.meta.messageId];
			var callbackSuccess = typeof(callbacks) == "function" ? callbacks : callbacks.success;
			var callbackError = typeof(callbacks) == "function" ? MslServer.LogError : callbacks.error ? callbacks.error : MslServer.LogError;
			
			if(resp.meta.success)
				callbackSuccess(resp.data);
			else
				callbackError(resp.meta.error);
		}	
	}
	
	,Send(handlerName, data, callbacks){
		var messageId;
		if(callbacks){
			messageId = Util.RandomId();
			MslServer.responseCallbacks[messageId] = callbacks;
		}
		
		MslServer.socket.emit(handlerName, {meta:{messageId:messageId}, data:data});
	}
	
	,LogError(error){
		console.error(error);
	}
}