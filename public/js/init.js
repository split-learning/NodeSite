var dom = require("ace/lib/dom");
var EncapEditor = null;

// create first editor
// Modify edtor settings
var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/javascript");
editor.renderer.setScrollMargin(10, 10);
// Homepage Settings
if(typeof HOMEPAGE == undefined) {
	editor.setOptions({
		wrap: true,
		fontSize: "1.3em",
		autoScrollEditorIntoView: true,
	})
} else {
	editor.setOptions({
	    // "scrollPastEnd": 0.8,
	    fontSize: "1.1em",
	    autoScrollEditorIntoView: true,
	});
}

editor.setReadOnly(true)
// editor.setReadOnly(true)
// Disbale annotations
// editor.session.setOption("useWorker", false)

// Multiple file manager
EncapEditor = new MultipleEditor(editor)



var player;
var playerSize = 450
var aspect = 640/360

// Find the get paramters
const searchParams = new URLSearchParams(window.location.search)
let youtubeID = searchParams.get('youtubeID')
const record = searchParams.get('record') == 'true'

console.log("Y", youtubeID)
if(youtubeID == undefined) {
	youtubeID = 'rHiSsgFRgx4'
	if(typeof HOMEPAGE != undefined) {
		youtubeID =  'rHiSsgFRgx4' //'4K4QhIAfGKY'
	}
}

var player;
var dataFile = null
var livePlayer = null

function onTranscriptReady() {
	// Load datafile (it was loaded from transcripts)
	dataFile = transcriptData
	loadYoutube()
}

function loadYoutube() {
	// Youbtube Init
	// 	This code loads the IFrame Player API code asynchronously.
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
	livePlayer = new CodingVideo(dataFile, EncapEditor, record)
	player = new YT.Player('player', {
		height: playerSize,
		width: playerSize * aspect,
		videoId: youtubeID,
		events: {
			'onReady': onPlayerReady,
			'onStateChange': livePlayer.onPlayerStateChange
		}
	});
	if(livePlayer.recording) {
       add_recording()
    }
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	// When the player is created, but not started
	console.log("Video Started")
	livePlayer.player = event.target
	// livePlayer.player.mute()
	livePlayer.player.seekTo(0)
	livePlayer.player.playVideo()

	$('#vidTitle').text(livePlayer.player.getVideoData().title)
	$('#vidAuthor').text("By " + livePlayer.player.getVideoData().author)


	var t = setInterval(function(){
		if(livePlayer.player.getVideoData().author != ""){
			$('#vidAuthor').text("By " + livePlayer.player.getVideoData().author)
			clearInterval(t)
		}
	}, 100);
}



// https://stackoverflow.com/questions/14521108/dynamically-load-js-inside-js
var loadJS = function(url, implementationCode, location, errorFunc){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;
    scriptTag.onerror = errorFunc

    location.appendChild(scriptTag);
};

// Load the transcript and video
loadJS('transcripts/'+youtubeID+'.js', onTranscriptReady, document.body, function() {
	// Error function, means no transcript
	transcriptData = {"youtubeID":youtubeID,"formatArray":[]}
	onTranscriptReady()
})
