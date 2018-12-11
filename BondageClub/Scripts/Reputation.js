// Pushes the reputation to the server
function ReputationSave(R) {
	AccountRequest("reputation_set", "&type=" + R.Type + "&value=" + R.Value);
}

// When we need to alter a reputation (positive or negative)
function ReputationChange(RepType, RepValue, Push) {

	// Nothing will be done for a zero change
	RepValue = parseInt(RepValue) || 0;
	if (RepValue != 0) {
		
		// If the reputation already exists, we update and push it
		for (var R = 0; R < Player.Reputation.length; R++)
			if (Player.Reputation[R].Type == RepType) {
				Player.Reputation[R].Value = Player.Reputation[R].Value + RepValue;
				if (Player.Reputation[R].Value > 100) Player.Reputation[R].Value = 100;
				if (Player.Reputation[R].Value < -100) Player.Reputation[R].Value = -100;
				if ((Push == null) || Push) ReputationSave(Player.Reputation[R]);
				return;
			}
		
		// Creates the new reputation
		var NewRep = {
			Type: RepType,
			Value: RepValue
		}
		if (NewRep.Value > 100) NewRep.Value = 100;
		if (NewRep.Value < -100) NewRep.Value = -100;
		Player.Reputation.push(NewRep);
		if ((Push == null) || Push) ReputationSave(NewRep);

	}

}

// Loads the reputation data
function ReputationLoad(NewRep) {

	// Make sure we have something to load
	if (NewRep != null) {

		// Add each reputation entry one by one
		for (var R = 0; R < NewRep.length; R++)
			ReputationChange(NewRep[R].Type, NewRep[R].Value, false);

	}
	
}

// Returns a specific reputation value 
function ReputationGet(RepType) {
	for (var R = 0; R < Player.Reputation.length; R++)
		if (Player.Reputation[R].Type == RepType)
			return Player.Reputation[R].Value;
	return 0;
}

// Returns a timer length based on a reputation value
function ReputationTimer(RepType, Reverse) {
	var V = ReputationGet(RepType) * (((Reverse != null) && Reverse) ? -1 : 1);
	if (V <= 0) return new Date().getTime() + (30000 * (1 + Math.random()));
	else return new Date().getTime() + ((30 + (V / 2)) * 1000 * (1 + Math.random()));
}

// Alter the reputation progress by a factor (The higher the rep, the slower it gets, a reputation is easier to break than to build)
function ReputationProgress(RepType, Value) {
	var V = ReputationGet(RepType);
	if (Value > 0) {
		if ((V >= 70) && (V <= 100)) ReputationChange(RepType, Math.floor(Value / 3));
		if ((V >= 30) && (V < 70)) ReputationChange(RepType, Math.floor(Value / 2));
		if ((V > -30) && (V < 30)) ReputationChange(RepType, Value);
		if ((V > -70) && (V <= -30)) ReputationChange(RepType, Value * 2);
		if ((V >= -100) && (V <= -70)) ReputationChange(RepType, Value * 4);
	} else {
		if ((V >= -100) && (V <= -70)) ReputationChange(RepType, Math.floor(Value / 3));
		if ((V > -70) && (V <= -30)) ReputationChange(RepType, Math.floor(Value / 2));
		if ((V > -30) && (V < 30)) ReputationChange(RepType, Value);
		if ((V >= 30) && (V < 70)) ReputationChange(RepType, Value * 2);
		if ((V >= 70) && (V <= 100)) ReputationChange(RepType, Value * 4);
	}
}