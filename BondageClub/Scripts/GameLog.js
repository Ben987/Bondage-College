"use strict";
var Log = [];

// Add a new log to the server side
function LogAdd(NewLogName, NewLogGroup, NewLogValue, Push) {

	// Makes sure the value is numeric
	if (NewLogValue != null) NewLogValue = parseInt(NewLogValue);

	// Checks to make sure we don't duplicate a log
	var AddToLog = true;
	for (var L = 0; L < Log.length; L++)
		if ((Log[L].Name == NewLogName) && (Log[L].Group == NewLogGroup)) {
			Log[L].Value = NewLogValue;
			AddToLog = false;
			break;
		}

	// Adds a new log object if we need to
	if (AddToLog) {
		var NewLog = {
			Name: NewLogName,
			Group: NewLogGroup,
			Value: NewLogValue
		}
		Log.push(NewLog);
	}

	// Sends the log to the server
	if ((Push == null) || Push)
		ServerPlayerLogSync();

}

// Deletes a log entry
function LogDelete(DelLogName, DelLogGroup, Push) {

	// Finds the log entry and deletes it
	for (var L = 0; L < Log.length; L++)
		if ((Log[L].Name == DelLogName) && (Log[L].Group == DelLogGroup)) {
			Log.splice(L, 1);
			break;
		}

	// Sends the new log to the server
	if ((Push == null) || Push)
		ServerPlayerLogSync();

}

// Checks if the log exists, return true if it does (if there's a value, it counts as an expiry time)
function LogQuery(QueryLogName, QueryLogGroup) {
	for (var L = 0; L < Log.length; L++)
		if ((Log[L].Name == QueryLogName) && (Log[L].Group == QueryLogGroup))
			if ((Log[L].Value == null) || (Log[L].Value >= CurrentTime))
				return true;
	return false;
}

// Returns the value associated to the log
function LogValue(QueryLogName, QueryLogGroup) {
	for (var L = 0; L < Log.length; L++)
		if ((Log[L].Name == QueryLogName) && (Log[L].Group == QueryLogGroup))
			return Log[L].Value;
	return null;
}

// Loads the account log
function LogLoad(NewLog) {

	// Make sure we have something to load
	Log = [];
	if (NewLog != null) {

		// Add each log entry one by one, validates the type to prevent client crashes
		for (var L = 0; L < NewLog.length; L++)
			if ((typeof NewLog[L].Name === "string") && (typeof NewLog[L].Group === "string") && ((NewLog[L].Value == null) || (typeof NewLog[L].Value === "number")))
				LogAdd(NewLog[L].Name, NewLog[L].Group, NewLog[L].Value, false);

	}
	
}