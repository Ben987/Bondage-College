"use strict"

/** @type {ICommand[]} */
var Commands = [];
let CommandsKey = "/";
/** @type {TextCache} */
let CommandText = null;

/**
 * Loads the commands for the Player
 * @returns {void} - Nothing
 */
function CommandsLoad() {
    CommandCombine(CommonCommands);
    CommandsTranslate();
}

/**
 * Translates the help for commands
 * @returns {void} - Nothing
 */
function CommandsTranslate() {
    if (!CommandText) {
        CommandText = new TextCache("Screens/Online/ChatRoom/Text_Commands.csv");
    }
    else CommandText.buildCache();
}

/**
 * Fill the user input with the command
 * @param {string} command
 * @returns {void} - Nothing
 */
function CommandSet(command) {
    ElementValue("InputChat", CommandsKey + command + " ");
    ElementFocus("InputChat");
}

/**
 * Add a list of commands
 * @param {ICommand|ICommand[]} add - Commands to add
 * @returns {void} - Nothing
 */
function CommandCombine(add) {
    if (!add) return;
    if (!Array.isArray(add)) add = [add];
    Commands = Commands.filter(C => !add.some(A => A.Tag == C.Tag)).concat(add);
    Commands.sort((A, B) => (A.Tag > B.Tag) ? 1 : ((B.Tag > A.Tag) ? -1 : 0));
}

/** Return all awailable commands */
function GetCommands() {
    return Commands;
}

/**
 * Parse the user message
 * @param {string} msg
 * @returns {void} - Nothing
 */
function CommandParse(msg) {
    if (msg.indexOf(CommandsKey) == 0) {
        CommandExecute(msg);
        return;
    }
    if (msg.indexOf("*") == 0) {
        ChatRoomSendEmote(msg);
        ElementValue("InputChat", "");
        return;
    }
    let WhisperTarget;
    for (let C = 0; C < ChatRoomCharacter.length; C++)
        if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber)
            WhisperTarget = ChatRoomCharacter[C];
    if (msg != "" && !((ChatRoomTargetMemberNumber != null || m.indexOf("(") >= 0) && Player.ImmersionSettings && (Player.ImmersionSettings.BlockGaggedOOC && (!Player.Effect.includes("VRAvatars") || !WhisperTarget || !WhisperTarget.Effect.includes("VRAvatars"))) && !Player.CanTalk())) {
        if (ChatRoomTargetMemberNumber == null) {
            // Regular chat
            ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" });
            ChatRoomStimulationMessage("Gag");
        } else {
            // The whispers get sent to the server and shown on the client directly
            ServerSend("ChatRoomChat", { Content: msg, Type: "Whisper", Target: ChatRoomTargetMemberNumber });
            const TargetName = WhisperTarget && WhisperTarget.Name || "";

            const div = document.createElement("div");
            div.setAttribute('class', 'ChatMessage ChatMessageWhisper');
            div.setAttribute('data-time', ChatRoomCurrentTime());
            div.setAttribute('data-sender', Player.MemberNumber.toString());
            div.innerHTML = TextGet("WhisperTo") + " " + TargetName + ": " + msg;

            const Refocus = document.activeElement.id == "InputChat";
            const ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
            if (document.getElementById("TextAreaChatLog") != null) {
                document.getElementById("TextAreaChatLog").appendChild(div);
                if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
                if (Refocus) ElementFocus("InputChat");
            }
        }
    } else {
        // Throw an error message
        ChatRoomMessage({ Content: "ChatRoomBlockGaggedOOC", Type: "Action", Sender: Player.MemberNumber });
    }
    // Clears the chat text message
    ElementValue("InputChat", "");
}

/**
 * Prints out the help for commands with tags that include low
 * @param {string} low - lower case search keyword for tags
 * @param {number} [timeout] - total time to display the help message in ms
 * @returns {void} - Nothing
 */
function CommandHelp(low, timeout) {
    ChatRoomSendLocal(TextGet("CommandHelp").replace('KeyWord', low), timeout)
    CommandPrintHelpFor(GetCommands().filter(C => low == null || low == "" || C.Tag.includes(low)), timeout);
}

/**
 * Prints out the help for commands
 * @param {ICommand[]} commands - list of commands
 * @param {number} timeout - total time to display the help message in ms
 */
function CommandPrintHelpFor(commands, timeout) {
    commands
        .filter(C => C.Prerequisite == null || C.Prerequisite())
        .forEach(C => {
            const Help = CommandText.cache[C.Tag] || C.Description || TextGet("CommandHelpMissing");
            ChatRoomSendLocal("<strong onclick='window.CommandSet(\"" + C.Tag + "\")'>" + CommandsKey + C.Tag + "</strong> " + Help, timeout);
        });
}

/**
 * Finds command and executes it from the message
 * @param {string} msg - User input
 * @returns {void} - Nothing
 */
function CommandExecute(msg) {
    const low = msg.toLowerCase();
    let C = GetCommands().filter(C => low.indexOf(CommandsKey + C.Tag) == 0);
    C = C[0] && C.reduce(function (a, b) { return a.length > b.length ? a : b; });
    if (C && C.Reference) C = GetCommands().find(D => D.Tag == C.Reference);
    if (C == null) {
        ElementValue("InputChat", CommandsKey + "invalid " + TextGet("CommandNoSuchCommand"));
        return;
    }
    if (C.Prerequisite && !C.Prerequisite()) {
        ElementValue("InputChat", CommandsKey + "invalid " + TextGet("CommandPrerequisiteFailed"));
        return;
    }
    C.Action(low.substring(C.Tag.length + 2), msg);
    if (C.Clear == null || C.Clear) {
        ElementValue("InputChat", "");
        ElementFocus("InputChat");
    }
}

/**
 * Tries to complete the message to a command or print help about it
 * @param {string} msg - InputChat content
 */
function CommandAutoComplete(msg) {
    const low = msg.toLowerCase();
    if (!low || !low.startsWith(CommandsKey) || low.length <= CommandsKey.length) return;
    if (low.substr(CommandsKey.length).startsWith(CommandsKey)) return;
    if (low.includes(' ')) return;

    const CS = GetCommands().filter(C => (CommandsKey + C.Tag).indexOf(low) == 0);
    if (CS.length == 0) return;

    if (CS.length == 1) {
        ElementValue("InputChat", CommandsKey + CS[0].Tag + " ");
        return;
    }

    let complete = low;
    for (let I = low.length - CommandsKey.length; ; ++I) {
        const TSI = CS.map(C => C.Tag[I]);
        if (TSI.some(TI => TI == null)) break;
        if (new Set(TSI).size != 1) break;
        complete += TSI[0];
    }

    if (low.length != complete.length) {
        ElementValue("InputChat", complete);
    } else {
        CommandPrintHelpFor(CS, 5000);
    }
}

/**
 * @type {ICommand[]}
 */
const CommonCommands = [
    {
        Tag: 'dice',
        Action: args => {
            // The player can roll X dice of Y faces, using XdY.  If no size is specified, a 6 sided dice is assumed
            let DiceNumber = 0;
            let DiceSize = 0;
            if (/(^\d+)[dD](\d+$)/.test(args)) {
                const Roll = /(^\d+)[dD](\d+$)/.exec(args);
                DiceNumber = (!Roll) ? 1 : parseInt(Roll[1]);
                DiceSize = (!Roll) ? 6 : parseInt(Roll[2]);
                if ((DiceNumber < 1) || (DiceNumber > 100)) DiceNumber = 1;
            } else if (/(^\d+$)/.test(args)) {
                const Roll = /(^\d+)/.exec(args);
                DiceNumber = 1;
                DiceSize = (!Roll) ? 6 : parseInt(Roll[1]);
            }

            // If there's at least one dice to roll
            if (DiceNumber > 0) {
                if ((DiceSize < 2) || (DiceSize > 100)) DiceSize = 6;
                let CurrentRoll = 0;
                const Result = [];
                let Total = 0;
                while (CurrentRoll < DiceNumber) {
                    const Roll = Math.floor(Math.random() * DiceSize) + 1
                    Result.push(Roll);
                    Total += Roll;
                    CurrentRoll++;
                }
                msg = "ActionDice";
                const Dictionary = [];
                Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name });
                Dictionary.push({ Tag: "DiceType", Text: DiceNumber.toString() + "D" + DiceSize.toString() });
                if (DiceNumber > 1) {
                    Result.sort((a, b) => a - b);
                    Dictionary.push({ Tag: "DiceResult", Text: Result.toString() + " = " + Total.toString() });
                } else if (DiceNumber == 1) Dictionary.push({ Tag: "DiceResult", Text: Total.toString() });
                if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
            }
        }
    },
    {
        Tag: 'coin',
        Action: () => {
            const Heads = (Math.random() >= 0.5);
            const Dictionary = [
                { Tag: "SourceCharacter", Text: Player.Name },
                { Tag: "CoinResult", TextToLookUp: Heads ? "Heads" : "Tails" }];
            ServerSend("ChatRoomChat", { Content: "ActionCoin", Type: "Action", Dictionary: Dictionary });
        }
    },
    {
        Tag: 'friendlistadd',
        Action: args => ChatRoomListManipulation(Player.FriendList, null, args)
    },
    {
        Tag: 'friendlistremove',
        Action: args => ChatRoomListManipulation(null, Player.FriendList, args)
    },
    {
        Tag: 'ghostadd',
        Action: args => ChatRoomListManipulation(Player.GhostList, null, args)
    },
    {
        Tag: 'ghostremove',
        Action: args => ChatRoomListManipulation(null, Player.GhostList, args)
    },
    {
        Tag: 'whitelistadd',
        Action: args => ChatRoomListManipulation(Player.WhiteList, Player.BlackList, args)
    },
    {
        Tag: 'whitelistremove',
        Action: args => ChatRoomListManipulation(null, Player.WhiteList, args)
    },
    {
        Tag: 'blacklistadd',
        Action: args => ChatRoomListManipulation(Player.BlackList, Player.WhiteList, args)
    },
    {
        Tag: 'blacklistremove',
        Action: args => ChatRoomListManipulation(null, Player.BlackList, args)
    },
    {
        Tag: 'showblacklist',
        Action: () => ChatRoomSendLocal('Blacklist: ' + JSON.stringify(Player.BlackList))
    },
    {
        Tag: 'showwhitelist',
        Action: () => ChatRoomSendLocal('Whitelist: ' + JSON.stringify(Player.WhiteList))
    },
    {
        Tag: 'showghostlist',
        Action: () => ChatRoomSendLocal('Ghostlist: ' + JSON.stringify(Player.Ghostlist))
    },
    {
        Tag: 'showfriendlist',
        Action: () => ChatRoomSendLocal('Friendlist: ' + JSON.stringify(Player.FriendList))
    },
    {
        Tag: 'ban',
        Prerequisite: () => ChatRoomPlayerIsAdmin(),
        Action: args => ChatRoomAdminChatAction("Ban", args)
    },
    {
        Tag: 'unban',
        Prerequisite: () => ChatRoomPlayerIsAdmin(),
        Action: args => ChatRoomAdminChatAction("Unban", args)
    },
    {
        Tag: 'kick',
        Prerequisite: () => ChatRoomPlayerIsAdmin(),
        Action: args => ChatRoomAdminChatAction("Kick", args)
    },
    {
        Tag: 'promote',
        Prerequisite: () => ChatRoomPlayerIsAdmin(),
        Action: args => ChatRoomAdminChatAction("Promote", args)
    },
    {
        Tag: 'demote',
        Prerequisite: () => ChatRoomPlayerIsAdmin(),
        Action: args => ChatRoomAdminChatAction("Demote", args)
    },
    {
        Tag: 'me',
        Action: (_, msg) => ChatRoomSendEmote(msg)
    },
    {
        Tag: 'action',
        Action: (_, msg) => ChatRoomSendEmote(msg)
    },
    {
        Tag: 'invalid',
        Action: () => { }
    },
    {
        Tag: CommandsKey,
        Action: (_, msg) => { ServerSend("ChatRoomChat", { Content: msg.substr(CommandsKey.length), Type: "Chat" }); }
    },
    {
        Tag: 'help',
        Action: args => CommandHelp(args)
    },
    {
        Tag: 'afk',
        Action: () => CharacterSetFacialExpression(Player, "Emoticon", "Afk")
    },
    {
        Tag: 'beep',
        Action: arg => {
            const T = parseInt(arg);
            if (isFinite(T) && T > 0) FriendListBeep(T);
        }
    },
];

/**
 * @typedef ICommand
 * @property {string} Tag - Key for the command
 * @property {string?} Description - Help for the command
 * @property {(args: string, msg: string) => void} Action - "/Tag args" = msg
 * @property {(() => boolean)?} [Prerequisite] - Must return true or be null before the action can be executed
 */
