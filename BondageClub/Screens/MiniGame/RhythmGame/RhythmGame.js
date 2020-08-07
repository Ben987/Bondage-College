"use strict";
var RhythmGameBackground = 'RhythmGameLoading';
let RhythmGameBeatmap = '';
let RhythmGameDifficulty = '';
let RhythmGameStarted = false;
let RhythmGameEnded = false;
let RhythmGamePassed = true;
let RhythmGamePreloadCompleted = false;

/**
 * Rhythm game initialization object: Handles pre and post loading, invokes initialization of other objects.
 * @constant
 * @type {object} - The game initialization object. Contains the functions required to load the game. 
 */
let RhythmGameInit = {
    RhythmGamePreload : function(){
        RhythmGameBackground = 'RhythmGameLoading';
        RhythmGameBeatmap = MiniGameDifficulty.substring(0, MiniGameDifficulty.lastIndexOf(' '));
        RhythmGameDifficulty = MiniGameDifficulty.substr(MiniGameDifficulty.lastIndexOf(' ')+1, 2);
        RhythmGameStarted = false;
        RhythmGameEnded = false;
        RhythmGamePassed = true;
        RhythmGamePreloadCompleted = false;
        RhythmGameImage.preload();
        RhythmGameAudio.preload();
        RhythmGameChart.preload();
    },

    RhythmGamePreloadCheck : function(){
        RhythmGamePreloadCompleted = RhythmGameAudio.preloadComplted
            && RhythmGameChart.preloadComplted
            && RhythmGameImage.preloadComplted;
        if(RhythmGamePreloadCompleted) RhythmGameInit.RhythmGamePostLoad();
    },

    RhythmGamePostLoad : function(){
        RhythmGameChart.load();
        RhythmGameKey.load();
        RhythmGameKernel.load();
        RhythmGameScript.load();
        RhythmGameRender.load();
        RhythmGameIntegration.load();

        let pressToStart = function(event){
            if(event.code === 'Space'){
                RhythmGameBackground = 'RhythmGame';
                RhythmGameStarted = true;
                RhythmGameAudio.play(RhythmGameKernel.offsetTime/1000);
                window.removeEventListener('keydown', pressToStart);
            }
        };
        window.addEventListener('keydown', pressToStart);
    },

    RhythmGameLoadingPage : function(){
        if(!RhythmGamePreloadCompleted){
            let text = 'Downloading resources';
            MainCanvas.font = '70px Courier';
            MainCanvas.fillStyle = '#FFFFFF';
            MainCanvas.globalAlpha = 1;
            MainCanvas.textAlign = 'center';
            MainCanvas.fillText(text,1000,150);
            text = 'If it takes too long, your browser may not be supported';
            MainCanvas.font = '40px Courier';
            MainCanvas.fillText(text,1000,250);
            text = 'Try latest Chrome, FireFox or Safari';
            MainCanvas.fillText(text,1000,300);
        }
        else{
            let text = 'Press SPACE to begin';
            MainCanvas.font = '70px Courier';
            MainCanvas.fillStyle = '#FFFFFF';
            MainCanvas.globalAlpha = 1;
            MainCanvas.textAlign = 'center';
            MainCanvas.fillText(text,1000,150);
        }

        let text = 'Use S D K L to hit notes';
        MainCanvas.font = '70px Courier';
        MainCanvas.fillStyle = '#FFFFFF';
        MainCanvas.globalAlpha = 1;
        MainCanvas.textAlign = 'center';
        MainCanvas.fillText(text,1000,750);
    },
};

/**
 * Rhythm game image object: Loads and caches the image resources.
 * @constant
 * @type {object} - The game image object. Contains the functions required to load the images. 
 */
let RhythmGameImage = {
    preload : function () {
        RhythmGameImage.preloadTotal = 5;
        RhythmGameImage.preloadLoaded = 0;
        RhythmGameImage.preloadComplted = false;
        let loadImageComplete = function(){
            RhythmGameImage.preloadLoaded++;
            if(RhythmGameImage.preloadLoaded === RhythmGameImage.preloadTotal) RhythmGameImage.preloadComplted = true;
        };
        let loadImage = function(src){
            let img = new Image();
            img.src = src;
            img.onload = loadImageComplete;
            return img;
        };
        RhythmGameImage.stage_light = loadImage('Screens/MiniGame/RhythmGame/res/img/stage/stage-light.png');
        RhythmGameImage.key_black_up = loadImage('Screens/MiniGame/RhythmGame/res/img/key/Black.png');
        RhythmGameImage.key_black_down = loadImage('Screens/MiniGame/RhythmGame/res/img/key/Black-D.png');
        RhythmGameImage.key_white_up = loadImage('Screens/MiniGame/RhythmGame/res/img/key/White.png');
        RhythmGameImage.key_white_down = loadImage('Screens/MiniGame/RhythmGame/res/img/key/White-D.png');
    },
};

/**
 * Rhythm game audio object: Handles loading audio and starting the music
 * @constant
 * @type {object} - The game audio object. Contains the functions required to load, start and stop the audio files. 
 */
let RhythmGameAudio =  {
    preload : function () {
        RhythmGameAudio.preloadComplted = false;
        RhythmGameAudio.audioCtx = null;
        RhythmGameAudio.bufferSource = null;
        let url = 'Screens/MiniGame/RhythmGame/res/beatmap/' + RhythmGameBeatmap + '/' + RhythmGameBeatmap + '.mp3';
        let mp3 = new XMLHttpRequest();
        mp3.onreadystatechange = function() {
            if (mp3.readyState === 4 && mp3.status === 200) {
                let audioData = mp3.response;
                RhythmGameAudio.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                RhythmGameAudio.bufferSource = RhythmGameAudio.audioCtx.createBufferSource();
                RhythmGameAudio.audioCtx.decodeAudioData(
                    audioData,
                    function(buffer) {
                        RhythmGameAudio.bufferSource.buffer = buffer;
                        RhythmGameAudio.bufferSource.connect(RhythmGameAudio.audioCtx.destination);
                        RhythmGameAudio.preloadComplted = true;
                    },
                    function(){ console.log("Error with decoding audio data");});
            }
        };
        mp3.open("GET", url, true);
        mp3.responseType = 'arraybuffer';
        mp3.send();
    },
    play : function (offset) {
        RhythmGameAudio.bufferSource.start(RhythmGameAudio.audioCtx.currentTime + offset);
    },
    stop : function (){
        RhythmGameAudio.bufferSource.stop();
    }
};

/**
 * Rhythm game chart object: Handles loading chart, parsing xml, caching chart for rendering and judging.
 * @constant
 * @type {object} - The game chart object. Contains the functions required to load the charts.
 */
let RhythmGameChart = {
    preload : function () {
        RhythmGameChart.preloadComplted = false;
        RhythmGameChart.chartFile = null;
        let url = 'Screens/MiniGame/RhythmGame/res/beatmap/' + RhythmGameBeatmap + '/' + RhythmGameBeatmap + '-' + RhythmGameDifficulty + '.xml';

        let xml = new XMLHttpRequest();
        xml.onreadystatechange = function() {
            if (xml.readyState === 4 && xml.status === 200) {
                RhythmGameChart.chartFile = xml.responseXML;
                RhythmGameChart.preloadComplted = true;
            }
        };
        xml.open("GET", url, true);
        xml.responseType = 'document';
        xml.send();
    },
    load : function(){
        RhythmGameChart.title = '';
        RhythmGameChart.artist = '';
        RhythmGameChart.creator = '';
        RhythmGameChart.bpm = -1;
        RhythmGameChart.length = -1;

        RhythmGameChart.notes = []; // {id, key, time, para}
        RhythmGameChart.notes_state = []; // {id, judge}
        RhythmGameChart.notes_judge = [[],[],[],[]]; // {id, time, para}
        RhythmGameChart.notes_render = [[],[],[],[]]; // {id, time, para}
        RhythmGameChart.timestamps = []; //{id, time, data}
        RhythmGameChart.timestamps_render = []; //{id, time, data}

        let notes = RhythmGameChart.chartFile.getElementsByTagName('Notes')[0].children;
        for(let i=0; i<notes.length; i++){
            let key = parseInt(notes[i].getAttribute('Key'), 10);
            let time = parseInt(notes[i].getAttribute('Time'), 10);
            let para = parseInt(notes[i].getAttribute('Para'), 10);
            RhythmGameChart.notes.push({
                id : i,
                key : key,
                time : time,
                para : para,
            });
            RhythmGameChart.notes_state.push({
                id : i,
                judge : 'unhandled',
            });
            RhythmGameChart.notes_judge[key].push({
                id : i,
                time : time,
                para : para,
            });
            RhythmGameChart.notes_render[key].push({
                id : i,
                time : time,
                para : para,
            });
            if(time + para > RhythmGameChart.length) RhythmGameChart.length = time + para;
        }

        let timings = RhythmGameChart.chartFile.getElementsByTagName('Timings')[0].children;
        for(let i=0; i<timings.length; i++){
            let type = timings[i].getAttribute('Type');
            let time = parseInt(timings[i].getAttribute('Time'), 10);
            let data = parseFloat(timings[i].getAttribute('Data'));
            if(RhythmGameChart.bpm === -1 && type === 'BPM'){
                RhythmGameChart.bpm = data;
            }
            else{
                RhythmGameChart.timestamps.push({
                    id : i,
                    time : time,
                    data : data,
                });
                RhythmGameChart.timestamps_render.push({
                    id : i,
                    time : time,
                    data : data,
                });
            }
        }

    },
};

/**
 * Rhythm game keyboard input handler object: Handles keyboard inputs.
 * @constant
 * @type {object} - The game keyboard input handler object. Contains the functions and properties required to handle key press events.
 */
let RhythmGameKey = {
    keyPressed : [false, false, false, false],
    key_log : [], //{key,type,time}
    key_log_ref : [], //{key,type,time}

    KEY_0 : 'KeyS',
    KEY_1 : 'KeyD',
    KEY_2 : 'KeyK',
    KEY_3 : 'KeyL',

    load : function(){
        RhythmGameKey.keyPressed = [false, false, false, false];
        RhythmGameKey.key_log = [];
        RhythmGameKey.key_log_ref = [];

        RhythmGameKey.addKeyListener();
    },

    addKeyListener : function () {
        window.addEventListener('keydown', RhythmGameKey.keyDownEvent);
        window.addEventListener('keyup', RhythmGameKey.keyUpEvent);
    },
    removeKeyListener : function () {
        window.removeEventListener('keydown', RhythmGameKey.keyDownEvent);
        window.removeEventListener('keyup', RhythmGameKey.keyUpEvent);
    },
    keyDownEvent : {
        handleEvent : function (event) {
            let time = performance.now() - RhythmGameKernel.initTime;
            switch(event.code){
                case RhythmGameKey.KEY_0:
                    if(!RhythmGameKey.keyPressed[0]){
                        RhythmGameKey.key_log.push({key : 0,type : 'down', time : time});
                        RhythmGameKey.keyPressed[0] = true;
                    }
                    break;
                case RhythmGameKey.KEY_1:
                    if(!RhythmGameKey.keyPressed[1]){
                        RhythmGameKey.key_log.push({key : 1,type : 'down', time : time});
                        RhythmGameKey.keyPressed[1] = true;
                    }
                    break;
                case RhythmGameKey.KEY_2:
                    if(!RhythmGameKey.keyPressed[2]){
                        RhythmGameKey.key_log.push({key : 2,type : 'down', time : time});
                        RhythmGameKey.keyPressed[2] = true;
                    }
                    break;
                case RhythmGameKey.KEY_3:
                    if(!RhythmGameKey.keyPressed[3]){
                        RhythmGameKey.key_log.push({key : 3,type : 'down', time : time});
                        RhythmGameKey.keyPressed[3] = true;
                    }
                    break;
            }
        }
    },
    keyUpEvent : {
        handleEvent : function (event) {
            let time = performance.now() - RhythmGameKernel.initTime;
            switch(event.code){
                case RhythmGameKey.KEY_0:
                    RhythmGameKey.key_log.push({key : 0,type : 'up', time : time});
                    RhythmGameKey.keyPressed[0] = false;
                    break;
                case RhythmGameKey.KEY_1:
                    RhythmGameKey.key_log.push({key : 1,type : 'up', time : time});
                    RhythmGameKey.keyPressed[1] = false;
                    break;
                case RhythmGameKey.KEY_2:
                    RhythmGameKey.key_log.push({key : 2,type : 'up', time : time});
                    RhythmGameKey.keyPressed[2] = false;
                    break;
                case RhythmGameKey.KEY_3:
                    RhythmGameKey.key_log.push({key : 3,type : 'up', time : time});
                    RhythmGameKey.keyPressed[3] = false;
                    break;
            }

        }
    },
};

/**
 * Rhythm game kernel object: Handles game timing.
 * @constant
 * @type {object} - The game kernel object. Contains the functions required to handle the game's timing.
 */
let RhythmGameKernel = {
    load : function(){
        RhythmGameKernel.offsetTime = 3000;

        RhythmGameKernel.onFirstInvoke = true;
        RhythmGameKernel.pastTime = 0;
        RhythmGameKernel.currentTime = 0;
        RhythmGameKernel.initTime = 0;
        RhythmGameKernel.elapsedTime = 0;
        RhythmGameKernel.deltaTime = 0;
        RhythmGameKernel.frame = 0;
    },
    update : function(){
        let time = performance.now();
        if(RhythmGameKernel.onFirstInvoke){
            RhythmGameKernel.onFirstInvoke = false;
            RhythmGameKernel.pastTime = time;
            RhythmGameKernel.currentTime = time;
            RhythmGameKernel.initTime = time + RhythmGameKernel.offsetTime;
            RhythmGameKernel.elapsedTime = 0;
            RhythmGameKernel.deltaTime = 0;
            RhythmGameKernel.frame = 0;
        }
        RhythmGameKernel.currentTime = time;
        RhythmGameKernel.elapsedTime = time - RhythmGameKernel.initTime;
        RhythmGameKernel.deltaTime = time - RhythmGameKernel.pastTime;
        RhythmGameKernel.pastTime = time;
        RhythmGameKernel.frame++;

        if(RhythmGameKernel.elapsedTime > RhythmGameChart.length + 4000) RhythmGameEnded = true;

        RhythmGameScript.update();
        RhythmGameRender.update();
        RhythmGameIntegration.update();
    },
};

/**
 * Rhythm game script object: Handles game mechanics.
 * @constant
 * @type {object} - The game kernel object. Contains the functions related to game mechanics such as health, score and accuracy.
 */
let RhythmGameScript = {
    judge_perfect : 50,
    judge_great   : 120,
    judge_miss    : 200,
    judge_end     : 100,

    score  : 0,
    acc    : {value : 0, perfect : 0, great : 0, miss : 0, endMiss : 0},
    combo  : {value : 0, rendered : false, max : 0},
    judge  : [],
    health : 1,

    load : function(){
        RhythmGameScript.judge_perfect = 50;
        RhythmGameScript.judge_great   = 100;
        RhythmGameScript.judge_miss    = 200;
        RhythmGameScript.judge_end     = 100;

        RhythmGameScript.score  = 0;
        RhythmGameScript.acc    = {value : 0, perfect : 0, great : 0, miss : 0, endMiss : 0};
        RhythmGameScript.combo  = {value : 0, rendered : false, max : 0};
        RhythmGameScript.judge  = [];
        RhythmGameScript.health = 1;
    },

    update : function(){
        RhythmGameScript.map_judge();
        RhythmGameScript.update_combo();
        RhythmGameScript.update_accuracy();
        RhythmGameScript.update_score();
        RhythmGameScript.update_health();
    },

    map_judge : function () {
        RhythmGameScript.judge = [];
        for(let k=0; k<4; k++){
            let collectionPoint = RhythmGameKernel.elapsedTime;
            while(RhythmGameChart.notes_judge[k].length !== 0){
                let note = RhythmGameChart.notes_judge[k][0];
                if(note.time + RhythmGameScript.judge_miss > collectionPoint) break;
                else {
                    if(RhythmGameChart.notes_state[note.id].judge === 'unhandled') RhythmGameScript.setJudge(note.id, 'late miss');
                    else break;
                }
                RhythmGameChart.notes_judge[k].shift();
            }
        }
        while(RhythmGameKey.key_log.length !== 0){
            let keyEvent = RhythmGameKey.key_log[0];
            if(RhythmGameChart.notes_judge[keyEvent.key].length === 0) {
                RhythmGameKey.key_log.shift();
                continue;
            }
            let note = RhythmGameChart.notes_judge[keyEvent.key][0];
            let timeDiff = note.time - keyEvent.time;

            if(timeDiff <= RhythmGameScript.judge_miss){
                if(note.para === 0){//Single Note
                    if(keyEvent.type === 'down'){
                        RhythmGameScript.setJudge(note.id, RhythmGameScript.judgeType(timeDiff));
                    }
                    else if(keyEvent.type === 'up'){
                        RhythmGameChart.notes_judge[keyEvent.key].shift();
                    }
                }
                else{//Long Note
                    if(keyEvent.type === 'down') {
                        RhythmGameScript.setJudge(note.id, RhythmGameScript.judgeType(timeDiff));
                    }
                    else if(keyEvent.type === 'up'){
                        if(timeDiff + note.para > RhythmGameScript.judge_end) {
                            RhythmGameScript.setJudge(note.id, 'end miss');
                        }
                        //else setJudge(note.id, GameChart.notes_state[note.id].judge);
                        RhythmGameChart.notes_judge[keyEvent.key].shift();
                    }
                }
            }

            RhythmGameKey.key_log.shift();
        }
    },
    setJudge : function(noteID, judge){
        RhythmGameChart.notes_state[noteID].judge = judge;
        RhythmGameScript.judge.push({
            judge : judge,
            key : RhythmGameChart.notes[noteID].key,
            para : RhythmGameChart.notes[noteID].para,
        });
    },
    judgeType : function (timeDiff) {
        if(       RhythmGameScript.judge_great   <= timeDiff && timeDiff <=  RhythmGameScript.judge_miss    ) return 'early miss';
        else if(  RhythmGameScript.judge_perfect <= timeDiff && timeDiff <=  RhythmGameScript.judge_great   ) return 'early great';
        else if(  0                              <= timeDiff && timeDiff <=  RhythmGameScript.judge_perfect ) return 'early perfect';
        else if( -RhythmGameScript.judge_perfect <= timeDiff && timeDiff <=  0                              ) return 'late perfect';
        else if( -RhythmGameScript.judge_great   <= timeDiff && timeDiff <= -RhythmGameScript.judge_perfect ) return 'late great';
        else if(                                                timeDiff <= -RhythmGameScript.judge_great   ) return 'late miss';
        // else return 'unhandled';
    },
    judgeToVal : function(judge){
        if(judge === 'early miss' || judge === 'late miss') return 0;
        else if(judge === 'end miss') return 1;
        else if(judge === 'early great' || judge === 'late great') return 2;
        else if(judge === 'early perfect' || judge === 'late perfect') return 3;
        else return -1;
    },


    update_combo : function () {
        for(let i=0; i<RhythmGameScript.judge.length; i++){
            let judge = RhythmGameScript.judgeToVal(RhythmGameScript.judge[i].judge);
            if(judge === 2 || judge === 3) {
                RhythmGameScript.combo.value++;
                if(RhythmGameScript.combo.value > RhythmGameScript.combo.max)
                    RhythmGameScript.combo.max = RhythmGameScript.combo.value;
            }
            else RhythmGameScript.combo.value = 0;
            RhythmGameScript.combo.rendered = false;
        }
    },

    update_accuracy : function (){
        for(let i=0; i<RhythmGameScript.judge.length; i++){
            let judge = RhythmGameScript.judgeToVal(RhythmGameScript.judge[i].judge);
            switch(judge){
                case 0:
                    RhythmGameScript.acc.miss++;
                    break;
                case 1:
                    RhythmGameScript.acc.endMiss++;
                    break;
                case 2:
                    RhythmGameScript.acc.great++;
                    break;
                case 3:
                    RhythmGameScript.acc.perfect++;
                    break;
                default:
                    break;
            }
        }
        let count = RhythmGameScript.acc.perfect + RhythmGameScript.acc.great + RhythmGameScript.acc.miss;
        let total = RhythmGameScript.acc.perfect + 0.75 * RhythmGameScript.acc.great;
        if(count !== 0) RhythmGameScript.acc.value = total/count;
        else RhythmGameScript.acc.value = 0;
    },

    update_score : function(){
        for(let i=0; i<RhythmGameScript.judge.length; i++){
            let judge = RhythmGameScript.judgeToVal(RhythmGameScript.judge[i].judge);
            switch(judge){
                case 2:
                    RhythmGameScript.score += Math.log10(RhythmGameScript.combo.value+1) * 0.01;
                    break;
                case 3:
                    RhythmGameScript.score += Math.log10(RhythmGameScript.combo.value+1) * 0.03;
                    break;
                default:
                    break;
            }
        }
    },

    update_health : function () {
        for(let i=0; i<RhythmGameScript.judge.length; i++){
            let judge = RhythmGameScript.judgeToVal(RhythmGameScript.judge[i].judge);
            switch(judge){
                case 0:
                    RhythmGameScript.health = RhythmGameScript.health - 0.1 < 0 ? 0 : RhythmGameScript.health - 0.1;
                    break;
                case 1:
                    RhythmGameScript.health = RhythmGameScript.health - 0.1 < 0 ? 0 : RhythmGameScript.health - 0.1;
                    break;
                case 2:
                    RhythmGameScript.health = RhythmGameScript.health + 0.001 > 1 ? 1 : RhythmGameScript.health + 0.001;
                    break;
                case 3:
                    RhythmGameScript.health = RhythmGameScript.health + 0.004 > 1 ? 1 : RhythmGameScript.health + 0.004;
                    break;
            }
            if(RhythmGameScript.health === 0) {
                RhythmGameScript.health = 1;
                RhythmGameIntegration.setPunishment();
            }
        }
    },
};

/**
 * Rhythm game render object: Handles game rendering.
 * @constant
 * @type {object} - The game render object. Contains the functions related to game rendering such as the visual effects and notes.
 */
let RhythmGameRender = {
    scrollSpeed : 2.1,

    cache_judge     : {val : 4},
    cache_hitEffect : [{judge :0},{judge :0},{judge :0},{judge :0}],
    cache_sv        : {startFrame : 0, endFrame : 0, startSpeed : 0, endSpeed : 0},

    load : function(){
        RhythmGameRender.scrollSpeed = 2.1;

        RhythmGameRender.cache_judge     = {val : 4};
        RhythmGameRender.cache_hitEffect = [{judge :0},{judge :0},{judge :0},{judge :0}];
        RhythmGameRender.cache_sv        = {startFrame : 0, endFrame : 0, startSpeed : 0, endSpeed : 0};
    },

    update : function(){
        RhythmGameRender.keyPressEffectStageLight();
        RhythmGameRender.noteDrop();
        RhythmGameRender.keyPressEffectKeyLight();
        RhythmGameRender.hitEffect();
        RhythmGameRender.showResult();
        RhythmGameRender.showHealth();
    },

    keyPressEffectStageLight : function () {
        MainCanvas.globalAlpha = 1;
        if(RhythmGameKey.keyPressed[0]) MainCanvas.drawImage(RhythmGameImage.stage_light, 750, 0);
        if(RhythmGameKey.keyPressed[1]) MainCanvas.drawImage(RhythmGameImage.stage_light, 875, 0);
        if(RhythmGameKey.keyPressed[2]) MainCanvas.drawImage(RhythmGameImage.stage_light, 1000, 0);
        if(RhythmGameKey.keyPressed[3]) MainCanvas.drawImage(RhythmGameImage.stage_light, 1125, 0);
    },

    keyPressEffectKeyLight : function () {
        MainCanvas.globalAlpha = 1;
        if(RhythmGameKey.keyPressed[0]) MainCanvas.drawImage(RhythmGameImage.key_black_down, 750, 949);
        else                            MainCanvas.drawImage(RhythmGameImage.key_black_up,750,949);
        if(RhythmGameKey.keyPressed[1]) MainCanvas.drawImage(RhythmGameImage.key_white_down, 875, 949);
        else                            MainCanvas.drawImage(RhythmGameImage.key_white_up,875,949);
        if(RhythmGameKey.keyPressed[2]) MainCanvas.drawImage(RhythmGameImage.key_white_down, 1000, 949);
        else                            MainCanvas.drawImage(RhythmGameImage.key_white_up,1000,949);
        if(RhythmGameKey.keyPressed[3]) MainCanvas.drawImage(RhythmGameImage.key_black_down, 1125, 949);
        else                            MainCanvas.drawImage(RhythmGameImage.key_black_up,1125,949);
    },

    hitEffect : function(){
        for(let i=0; i<RhythmGameScript.judge.length; i++){
            let judge = RhythmGameScript.judge[i];
            if(RhythmGameScript.judgeToVal(judge.judge) === 2 || RhythmGameScript.judgeToVal(judge.judge) === 3){
                RhythmGameRender.cache_hitEffect[judge.key].judge = RhythmGameScript.judgeToVal(judge.judge);
                RhythmGameRender.cache_hitEffect[judge.key].para = judge.para;
                RhythmGameRender.cache_hitEffect[judge.key].startFrame = RhythmGameKernel.frame;
            }
        }

        for(let k=0; k<4; k++){
            let obj = RhythmGameRender.cache_hitEffect[k];
            if(obj.judge === 0) continue;

            if(obj.para === 0){
                let maxFrame = 10;
                obj.frame = RhythmGameKernel.frame - obj.startFrame;
                if(obj.frame > maxFrame) continue;

                let frame = maxFrame - obj.frame;
                let step = 10 * frame / maxFrame;

                let fill;
                if(obj.judge === 3) fill = '#CBC611';
                else if(obj.judge === 2) fill = '#449610';
                else continue;
                MainCanvas.fillStyle = fill;
                MainCanvas.globalAlpha = 0.3-0.03*step;
                MainCanvas.beginPath();
                MainCanvas.arc(812.5+125*k, 975, 75-5*step, 0, 2 * Math.PI);
                MainCanvas.fill();
                MainCanvas.closePath();
            }
            else{
                let totalFrame = Math.round(obj.para/TimerRunInterval);
                obj.frame = RhythmGameKernel.frame - obj.startFrame;
                if(obj.frame > totalFrame) continue;

                let maxFrame = 10;
                let frame = maxFrame - obj.frame % (maxFrame + 1);
                let step = 10 * frame / maxFrame;

                let fill;
                if(obj.judge === 3) fill = '#CBC611';
                else if(obj.judge === 2) fill = '#449610';
                else continue;
                MainCanvas.fillStyle = fill;
                MainCanvas.globalAlpha = 0.3-0.03*step;
                MainCanvas.beginPath();
                MainCanvas.arc(812.5+125*k, 975, 100-10*step, 0, 2 * Math.PI);
                MainCanvas.fill();
                MainCanvas.closePath();
            }
        }
    },

    noteDrop : function () {
        let renderTimeBot = RhythmGameKernel.elapsedTime;
        let renderTimeTop = renderTimeBot + 1000/RhythmGameRender.scrollSpeed;

        for(let k=0; k<4 ;k++){
            for(let i = 0; i < RhythmGameChart.notes_render[k].length;){
                let note = RhythmGameChart.notes_render[k][i];
                if(note.time > renderTimeTop) break;
                if(note.time > renderTimeBot){
                    if(note.para === 0){//Single Note
                        let y0 = 950 - (note.time - renderTimeBot) * RhythmGameRender.scrollSpeed;
                        RhythmGameRender.drawSingleNote(k, y0, RhythmGameChart.notes_state[note.id].judge);
                    }
                    else{//Long Note
                        let y0 = 950 - (note.time - renderTimeBot) * RhythmGameRender.scrollSpeed + 50;
                        let y1 = 950 - (note.time + note.para - renderTimeBot) * RhythmGameRender.scrollSpeed;
                        RhythmGameRender.drawLongNote(k, y1, y0-y1, RhythmGameChart.notes_state[note.id].judge);
                    }
                    i++;
                }
                else{
                    if(note.para === 0){//Single Note
                        RhythmGameChart.notes_render[k].shift();
                    }
                    else{//Long Note
                        if(note.time + note.para < renderTimeBot) RhythmGameChart.notes_render[k].shift();
                        else{
                            let y0 = 950 - (note.time - renderTimeBot) * RhythmGameRender.scrollSpeed + 50;
                            let y1 = 950 - (note.time + note.para - renderTimeBot) * RhythmGameRender.scrollSpeed;
                            RhythmGameRender.drawLongNote(k, y1, y0-y1, RhythmGameChart.notes_state[note.id].judge);
                            i++;
                        }
                    }
                }
            }
        }
    },
    drawSingleNote : function(key, y, judge){
        if(RhythmGameScript.judgeToVal(judge) !== 0){
            switch(key){
                case 0:
                    MainCanvas.fillStyle = '#2EC1FF';
                    MainCanvas.fillRect(750, y, 125, 50);
                    break;
                case 1:
                    MainCanvas.fillStyle = '#FFFFFF';
                    MainCanvas.fillRect(875, y, 125, 50);
                    break;
                case 2:
                    MainCanvas.fillStyle = '#FFFFFF';
                    MainCanvas.fillRect(1000, y, 125, 50);
                    break;
                case 3:
                    MainCanvas.fillStyle = '#2EC1FF';
                    MainCanvas.fillRect(1125, y, 125, 50);
                    break;
            }
        }
    },
    drawLongNote : function(key, y, h, judge){
        let c_green = '';
        let c_purple = '';
        switch(RhythmGameScript.judgeToVal(judge)){
            case 0:
                c_green = '#2A2A2A';
                c_purple = '#2A2A2A';
                break;
            case 1:
                c_green = '#2A2A2A';
                c_purple = '#2A2A2A';
                break;
            case 2:
                c_green = '#9AFFA5';
                c_purple = '#DE9AFF';
                break;
            case 3:
                c_green = '#9AFFA5';
                c_purple = '#DE9AFF';
                break;
            case -1:
                c_green = '#61FF49';
                c_purple = '#A93DFF';
                break;
        }
        switch(key){
            case 0:
                MainCanvas.fillStyle = c_green;
                MainCanvas.fillRect(750, y, 125, h);
                break;
            case 1:
                MainCanvas.fillStyle = c_purple;
                MainCanvas.fillRect(875, y, 125, h);
                break;
            case 2:
                MainCanvas.fillStyle = c_purple;
                MainCanvas.fillRect(1000, y, 125, h);
                break;
            case 3:
                MainCanvas.fillStyle = c_green;
                MainCanvas.fillRect(1125, y, 125, h);
                break;
        }
    },

    showResult : function(){
        RhythmGameRender.showJudge();
        RhythmGameRender.showCombo();
        RhythmGameRender.showAcc();
        RhythmGameRender.showScore();
        RhythmGameRender.showJudgeCount();
    },

    showJudge : function(){
        if(RhythmGameScript.judge.length > 0){
            RhythmGameRender.cache_judge = {val : 4};
            for(let i=0; i<RhythmGameScript.judge.length; i++){
                let val = RhythmGameScript.judgeToVal(RhythmGameScript.judge[i].judge);
                if(val < RhythmGameRender.cache_judge.val) RhythmGameRender.cache_judge.val = val;
            }
            RhythmGameRender.cache_judge.startFrame = RhythmGameKernel.frame;
        }
        RhythmGameRender.judgeRender(RhythmGameRender.cache_judge);
    
    },
    judgeRender : function(obj){
        let maxFrame = 15;
        obj.frame = RhythmGameKernel.frame - obj.startFrame;
        if(obj.frame > maxFrame) return;
    
        let text, font, fill, opacity, x, y;
        let frame = maxFrame - obj.frame;
        let step = 10 * frame / maxFrame;
        switch(obj.val){
            case 0:
                text = 'MISS';
                font = '70px Courier';
                fill = '#5F5E56';
                opacity = 1 - 0.05 * step;
                x = 1000;
                y = 800 - 1.5 * step;
                break;
            case 1:
                text = 'END MISS';
                font = '70px Courier';
                fill = '#5F5E56';
                opacity = 1 - 0.05 * step;
                x = 1000;
                y = 800 - 1.5 * step;
                break;
            case 2:
                text = 'GREAT';
                font = '70px Courier';
                fill = '#449610';
                opacity = 1 - 0.05 * step;
                x = 1000;
                y = 800 - 1.5 * step;
                break;
            case 3:
                text = 'PERFECT';
                font = '70px Courier';
                fill = '#CBC611';
                opacity = 1 - 0.05 * step;
                x = 1000;
                y = 800 - 1.5 * step;
                break;
            default:
                return;
        }
        MainCanvas.font = font;
        MainCanvas.fillStyle = fill;
        MainCanvas.globalAlpha = opacity;
        MainCanvas.textAlign = 'center';
        MainCanvas.fillText(text,x,y);
    },

    showCombo : function(){
        if(!RhythmGameScript.combo.rendered){
            RhythmGameScript.combo.startFrame = RhythmGameKernel.frame;
            RhythmGameScript.combo.rendered = true;
        }
    
        let maxFrame = 15;
        RhythmGameScript.combo.frame = RhythmGameKernel.frame - RhythmGameScript.combo.startFrame;
        let frame = maxFrame - RhythmGameScript.combo.frame >= 0 ? maxFrame - RhythmGameScript.combo.frame : 0;
        let step = 10 * frame / maxFrame;
    
        let text = RhythmGameScript.combo.value;
    
        MainCanvas.font = '80px Courier';
        MainCanvas.fillStyle = '#9F9F9F';
        MainCanvas.globalAlpha = 1 - 0.09 * step;
        MainCanvas.textAlign = 'center';
        MainCanvas.fillText(text,1000,200);
    },

    showAcc : function(){
        let text = TextGet('Acc') + ': ' + (RhythmGameScript.acc.value * 100).toFixed(2) + '%';
        MainCanvas.font = '40px Courier';
        MainCanvas.fillStyle = '#FFFFFF';
        MainCanvas.globalAlpha = 1;
        MainCanvas.textAlign = 'left';
        MainCanvas.fillText(text,1350,150);
    },

    showScore : function(){
        let text = TextGet('Score') + ': ' + RhythmGameScript.score.toFixed(3);
        MainCanvas.font = '40px Courier';
        MainCanvas.fillStyle = '#FFFFFF';
        MainCanvas.globalAlpha = 1;
        MainCanvas.textAlign = 'left';
        MainCanvas.fillText(text,1350,100);
    },

    showJudgeCount : function(){
        let text_p = 'PERFECT   : ' + RhythmGameScript.acc.perfect;
        let text_g = 'GREAT     : ' + RhythmGameScript.acc.great;
        let text_m = 'MISS      : ' + RhythmGameScript.acc.miss;
        let text_e = 'END MISS  : ' + RhythmGameScript.acc.endMiss;
        let text_c = 'MAX COMBO : ' + RhythmGameScript.combo.max;
        MainCanvas.font = '30px Courier';
        MainCanvas.fillStyle = '#FFFFFF';
        MainCanvas.globalAlpha = 1;
        MainCanvas.textAlign = 'left';
        MainCanvas.fillText(text_p,1350,300);
        MainCanvas.fillText(text_g,1350,340);
        MainCanvas.fillText(text_m,1350,380);
        MainCanvas.fillText(text_e,1350,420);
        MainCanvas.fillText(text_c,1350,460);
    },

    showHealth : function () {
        let h = 400 * RhythmGameScript.health;
        let w = 40;
        let x = 1290;
        let bot_y = 970;
        let top_y = bot_y - h;
        MainCanvas.fillStyle = '#FFFFFF';
        MainCanvas.fillRect(x, top_y, w, h);

        MainCanvas.font = '40px Courier';
        MainCanvas.fillStyle = '#FFFFFF';
        MainCanvas.globalAlpha = 1;
        MainCanvas.textAlign = 'left';
        MainCanvas.fillText(TextGet('AudiencePatienceLevel'),1350,700);
        // MainCanvas.fillText('Patience',1350,800);
        // MainCanvas.fillText('Level',1350,900);
    },
};

/**
 * Rhythm game integration object: Handles bondage club specific functions.
 * @constant
 * @type {object} - The game integration object. Contains the functions related to handling functions from the club such as punishing the player for being inaccurate.
 */
let RhythmGameIntegration = {
    punishment_level : 0,

    load : function(){
        RhythmGameIntegration.punishment_level = 0;
    },

    update : function(){
        DrawCharacter(Player, 300, 0, 1);
    },

    setPunishment : function () {
        RhythmGameIntegration.punishment_level++;
        switch(RhythmGameIntegration.punishment_level){
            case 0:
                break;
            case 1:
                InventoryWearRandom(Player, 'ItemFeet', 7);
                RhythmGameScript.judge_perfect = 45;
                RhythmGameScript.judge_great = 110;
                break;
            case 2:
                InventoryWearRandom(Player, 'ItemLegs', 7);
                RhythmGameScript.judge_perfect = 40;
                RhythmGameScript.judge_great = 100;
                break;
            case 3:
                InventoryWearRandom(Player, 'ItemMouth', 7);
                InventoryWearRandom(Player, 'ItemHead', 7);
                RhythmGameScript.judge_perfect = 35;
                RhythmGameScript.judge_great = 90;
                break;
            case 4:
                InventoryWearRandom(Player, 'ItemArms', 7);
                RhythmGameScript.judge_perfect = 30;
                RhythmGameScript.judge_great = 80;
                RhythmGamePassed = false;
                RhythmGameEnded = true;
                break;
        }
    },
};

/**
 * Loads the rythm mini game after saving the main cancas to restore it once the game is done.
 * @returns {void} - Nothing
 */
function RhythmGameLoad(){
    MainCanvas.save();
    RhythmGameInit.RhythmGamePreload();
}

/**
 * Runs and draws the canvas for the rythm mini game. The game uses objects to handle various processes.
 * @returns {void} - Nothing
 */
function RhythmGameRun() {
    if(!RhythmGameStarted) {
        if(!RhythmGamePreloadCompleted) RhythmGameInit.RhythmGamePreloadCheck();
        RhythmGameInit.RhythmGameLoadingPage();
    }
    else if(RhythmGameEnded){
        MainCanvas.restore();
        MiniGameVictory = RhythmGamePassed;
        MiniGameAdvancedPayment = RhythmGamePassed ? Math.round(RhythmGameScript.score + 10) : 0;
        RhythmGameAudio.stop();
        RhythmGameKey.removeKeyListener();
        CommonDynamicFunction(MiniGameReturnFunction + "()");
    }
    else RhythmGameKernel.update();
}