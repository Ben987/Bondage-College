'use strict'

var MslServer = {
	socket:null
	,responseCallbacks:{}
	,Init(){
		//console.log(ServerURL + "/msl");
		MslServer.socket = io(Environment.serverUrl + "/msl");
		
		MslServer.socket.on("GeneralResponse", resp => MslServer.ServerResponse(resp));
		MslServer.socket.on("FriendMessage", resp => MslServer.ServerResponse(resp, MainController.FriendMessageResp));
		MslServer.socket.on("LocationAction", resp => MslServer.ServerResponse(resp, LocationController.LocationActionResp));
	}
	
	,ServerResponse(resp, callback){
		if(callback){
			if(resp.meta.success)
				callback(resp.data);
			else
				MslServer.LogError(resp.meta.error);
		}
		else if(resp.meta.messageId){
			var callbacks = MslServer.responseCallbacks[resp.meta.messageId];			
			var callbackSuccess = typeof(callbacks) == "function" ? callbacks : callbacks.success;
			var callbackError = typeof(callbacks) == "function" ? MslServer.LogError : callbacks.error ? callbacks.error : MslServer.LogError;
			
			if(resp.meta.success)
				callbackSuccess(resp.data);
			else
				callbackError(resp.meta.error);
		}	
		else{
			console.error("unhandled server response");
			console.log(resp);
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