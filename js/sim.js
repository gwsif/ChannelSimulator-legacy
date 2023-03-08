// VARIABLE DEFINITIONS 
var fs = require('fs')
var done = false
var player
var current_episode = 0
var play_mode = 'e'
var counter = 0
var max_C = 4 // max number of commercials
var min_C = 1 // min number of commercials
var n = generateNewRandom()
var episodeList = readFromFileToArray("episodes.txt")
var commercialList = readFromFileToArray("commercials.txt")
    
//LOAD THE IFRAME PLAYER API CODE ASYNCHRONOUSLY.'
var tag = document.createElement('script')
tag.src = "https://www.youtube.com/iframe_api"
var firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

// CREATE AN IFRAME WITH OUR PLAYER
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
    height: '576', //390
    width: '720', //640
    videoId: '',
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// WHEN PLAYER IS READY PLAY THE VIDEO
function onPlayerReady(event) {
    event.target.playVideo()
}

// WHEN THE STATE OF THE VIDEO CHANGES
function onPlayerStateChange(event) {
    if(player.getPlayerState() == YT.PlayerState.ENDED) {
        if (play_mode == 'e') {
            play_mode = 'c'
        }
        // just click the next button ourselves
        next()``
    }
}

// WHEN THE VIDEO IS STOPPED    
function stopVideo() {
    player.stopVideo()
}

// POWER ON BUTTON
function start() {
    // set play mode to e since we're playing an episode
    play_mode = 'e'

    // generate a new n number for the cycle
    n = generateNewRandom()

    // randomly select an episode
    selectRandEp()

    // set play mode back to c
    play_mode = 'c'
}

// POWER OFF BUTTON
function end() {
    // do some stuff
}

// NEXT BUTTON
function next() {
    if (play_mode == 'c') {
        //play a commercial and increment a counter until the counter hits our maximum randomly generated number
		//when the number hits max, change the play_mode back to 'e'
        if (counter < n) {
            selectRandCo()
        }

        if (counter >= n) {
            play_mode = 'e'
            n = generateNewRandom() // cycle has ended, generate a new one
            counter = -1 // reset the counter
        }
    }
    if (play_mode == 'e') {
        selectNextEp()
        play_mode = 'c'
    }
    //play_mode = 'c'
    counter++
}

// COMM BUTTON
function comm(){
    // set the play mode to c for commercial
    play_mode = 'c'

    // select the next commercial
    selectRandCo()
}

// LOAD EPISODES BUTTON
function loadeplist() {
    readFileIntoArray("episodes.txt", episodeList)
    console.log('loadeplist function was triggered')
}

// PLAY/PAUSE BUTTON
function playPause() {
    if (player.getPlayerState() == YT.PlayerState.ENDED) {
        player.playVideo()
    }
    if (player.getPlayerState() == YT.PlayerState.PLAYING) {
        player.pauseVideo()
    }
    if (player.getPlayerState() == YT.PlayerState.PAUSED) {
        player.playVideo()
    }  
}

// SHOW/HIDE BUTTON
function showHide() {
    var x = document.getElementById("audio-div")
    if (x.style.display === "none") {
        x.style.display = "block"
    } 
    else if (x.style.display === "block") {
        x.style.display = "none"
    }
    else {
        x.style.display = "none"
    }
} 

/* -------------------------------------------------------------------------------------------> */
/* <------------------------------------ HELPER FUNCTIONS ------------------------------------> */
// EXTRACTS A YOUTUBE ID FROM A URL.
//    thank you to takien: https://gist.github.com/takien/4077195
function YouTubeGetID(url){
    var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
    if(url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    }
    else {
        ID = url;
    }
    return ID
}

// SELECTS THE NEXT EPISODE
function selectNextEp() {
    var arrLen = episodeList.length

    // Send the incremented vcount back if it is valid, otherwise round robin
    if (current_episode >= arrLen) {
        current_episode = 0
        // fetch the episodes videoID and load it
        episode = getVideo(episodeList, current_episode)
        player.loadVideoById(episode, 0, "large")
        // increment vcount so we can skip to the next video
        current_episode++
    } 
    
    else {
      // fetch the episodes videoID and load it
      episode = getVideo(episodeList, current_episode)
      player.loadVideoById(episode, 0, "large")
      current_episode++
    }  
}

// SELECTS A RANDOM EPISODE
function selectRandEp() {
    var episode
    var arrLen = episodeList.length
    var vcount = Math.floor(Math.random()*arrLen)

    // set the episode number we chose from the array to our global current episode value
    current_episode = vcount

    // fetch that episodes videoID and load it
    episode = getVideo(episodeList, current_episode)
    player.loadVideoById(episode, 0, "large")
}

// SELECTS A RANDOM COMMERCIAL
function selectRandCo(){
    var commercial
    var arrLen = commercialList.length
    var vcount = Math.floor(Math.random()*arrLen)
    play_mode = 'c'

    // fetch that episodes videoID and load it
    commercial = getVideo(commercialList, vcount)
    player.loadVideoById(commercial, 0, "large")
}

// GENERATES A NEW RANDOM NUMBER
function generateNewRandom() {
    n = Math.floor(Math.random()*(max_C - min_C + 1) + min_C) // generate a new N
    return n
}

// READS FROM A GIVEN FILE AND RETURNS AN ARRAY EQUIVALENT
function readFromFileToArray(filename) {
    var fs = require('fs')
    var array = fs.readFileSync(filename).toString().split("\n")
    for (i in array) {
        console.log(array[i])
    }
    return array
}

// GETS A VIDEO ID FROM A SPECIFIED ARRAY POSITION
function getVideo(arrayName, videoNumber) {
    var videoId = YouTubeGetID(arrayName[videoNumber])
    return videoId
}


