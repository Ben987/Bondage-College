"use strict";
var Log = [];

// Add a new log to the server side
function LogAdd(NewLogName, NewLogGroup, Push) {

	// Checks to make sure we don't duplicate a log
	var AddToLog = true;
	for (var L = 0; L < Log.length; L++)
		if ((Log[L].Name == NewLogName) && (Log[L].Group == NewLogGroup)) {
			AddToLog = false;
			break;
		}

	// Adds a new log object if we need to
	if (AddToLog) {
		var NewLog = {
			Name: NewLogName,
			Group: NewLogGroup
		}
		Log.push(NewLog);
	}

	// Sends the log to the server
	if ((Push == null) || Push)
		AccountRequest("log_add", "&name=" + NewLogName + "&group=" + NewLogGroup);

}

// Checks if the log exists, return true if it does
function LogQuery(QueryLogName, QueryLogGroup) {
	for (var L = 0; L < Log.length; L++)
		if ((Log[L].Name == QueryLogName) && (Log[L].Group == QueryLogGroup))
			return true;
	return false;
}

// Loads the account log
function LogLoad(NewLog) {

	// Make sure we have something to load
	Log = [];
	if (NewLog != null) {

		// Add each log entry one by one
		for (var L = 0; L < NewLog.length; L++)
			LogAdd(NewLog[L].Name, NewLog[L].Group, false);

	}
	
}