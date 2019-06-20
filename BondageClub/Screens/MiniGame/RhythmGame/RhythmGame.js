"use strict";
var RhythmGameBackground = 'RhythmGameLoading';
let RhythmGameImgPath = 'Screens/MiniGame/RhythmGame/res/img';
let RhythmGameStarted = false;
let RhythmGamePreloadCompleted = false;

//Rhythm game audio object, handles loading audio and starts the music
let RhythmGameAudio =  {
    preload : function () {
        RhythmGameAudio.preloadComplted = false;
        RhythmGameAudio.audioCtx = null;
        RhythmGameAudio.bufferSource = null;
        let url = 'Screens/MiniGame/RhythmGame/res/beatmap/' + MiniGameDifficulty + '/' + MiniGameDifficulty + '.mp3';
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
    }
};

//Rhythm game chart object, handles loading chart, parse xml, cached chart for rendering and judging
let RhythmGameChart = {
    preload : function () {
        RhythmGameChart.preloadComplted = false;
        RhythmGameChart.chartFile = null;
        let url = 'Screens/MiniGame/RhythmGame/res/beatmap/' + MiniGameDifficulty + '/' + MiniGameDifficulty + '.xml';

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

//Rhythm game keyboard input handler object
let RhythmGameKey = {
    keyPressed : [false, false, false, false],
    key_log : [], //{key,type,time}
    key_log_ref : [], //{key,type,time}

    KEY_0 : 'KeyS',
    KEY_1 : 'KeyD',
    KEY_2 : 'KeyK',
    KEY_3 : 'KeyL',

    load : function(){
        RhythmGameKey.addKeyListener();
    },
    addKeyListener : function () {
        window.addEventListener('keydown', function (event) {
            let time = performance.now() - RhythmGameKernel.initTime;
            console.log(time);
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
        });
        window.addEventListener('keyup', function (event) {
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
        });
    }
};

//Rhythm game kernel object, handles the game timing
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

        RhythmGameScript.update();
        RhythmGameRender.update();
    },
};

//Rhythm game script object, contains functions related to game mechanics
let RhythmGameScript = {
    update : function(){

    }
};

//Rhythm game render object, contains functions related to game rendering
let RhythmGameRender = {
    update : function(){

    }
};

//Loading the game resources
function RhythmGameLoad(){
    RhythmGamePreload();
}

function RhythmGamePreload(){
    RhythmGameAudio.preload();
    RhythmGameChart.preload();
}

function RhythmGamePreloadCheck(){
    RhythmGamePreloadCompleted = RhythmGameAudio.preloadComplted && RhythmGameChart.preloadComplted;
    if(RhythmGamePreloadCompleted) RhythmGamePostLoad();
}

function RhythmGamePostLoad(){
    RhythmGameChart.load();
    RhythmGameKey.load();
    RhythmGameKernel.load();
    console.log('LOAD COMPLETE');

    let pressToStart = function(event){
        if(event.code === 'Space'){
            RhythmGameBackground = 'RhythmGame';
            RhythmGameStarted = true;
            RhythmGameAudio.play(RhythmGameKernel.offsetTime/1000);
            window.removeEventListener('keydown', pressToStart);
        }
    };
    window.addEventListener('keydown', pressToStart);
}

function RhythmGameLoadingPage(){

}

function RhythmGameRun() {
    if(!RhythmGameStarted) {
        RhythmGameLoadingPage();
        if(!RhythmGamePreloadCompleted) RhythmGamePreloadCheck();
    }
    else {
        RhythmGameKernel.update();
        console.log('RHYTHM GAME RUNNING');
    }
}