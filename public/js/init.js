var dom = require("ace/lib/dom");
var EncapEditor = null;

// create first editor
// Modify edtor settings
var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/javascript");
editor.renderer.setScrollMargin(10, 10);
editor.setOptions({
    // "scrollPastEnd": 0.8,
    autoScrollEditorIntoView: true
});
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
if(youtubeID == undefined) {
	youtubeID = 'rHiSsgFRgx4'
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
	livePlayer = new CodingVideo(dataFile, EncapEditor)
	player = new YT.Player('player', {
		height: playerSize,
		width: playerSize * aspect,
		videoId: youtubeID,
		events: {
			'onReady': onPlayerReady,
			'onStateChange': livePlayer.onPlayerStateChange
		}
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  // When the player is created, but not started
  console.log("Video Started")
  livePlayer.player = event.target
  livePlayer.player.mute()
  livePlayer.player.seekTo(0)
  livePlayer.player.playVideo()

  $('#vidTitle').text(livePlayer.player.getVideoData().title)
  if(livePlayer.player.getVideoData().author != "")
    $('#vidAuthor').text("By " + livePlayer.player.getVideoData().author)
}



var loadJS = function(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

// Load the transcript and video
loadJS('/transcripts/'+youtubeID+'.js', onTranscriptReady, document.body)
