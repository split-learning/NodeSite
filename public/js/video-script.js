$("body").on('click', "#codeSide .nav-item a", function() {
  livePlayer.selectFile($(this).text())
});

setInterval(function(){
  blink(livePlayer.getVirtualFile());
}, 800);

function blink(filename) {
	if(filename == "") {
		return
	}
	console.log(filename)

	$("."+classFilename(filename)).css("background-color", "");
	$("."+classFilename(filename)).stop().animate({
        backgroundColor: '#cfa920'
    }, 500, 'easeOutBounce');

    setInterval(function(){
    	$("."+classFilename(filename)).css("background-color", "");
    }, 800)
}

function classFilename(filename) {
  return filename.replace(".", "D")
}

var selected = false
function addFileToUI(filename) {
	let a = ""
	if(!selected) { 
		a = "active"
		selected = true
	}
	let button = `
		<li class="nav-item">
			<a class="`+a+` nav-link filename-tab `+classFilename(filename)+`" id="main-tab" data-toggle="tab" role="tab" 
			aria-controls="home" aria-selected="true">`+filename+`</a>
		</li>`
	$("#tabList").append(button)
}
