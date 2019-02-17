$("body").on('click', "#codeSide .nav-item a", function() {
  livePlayer.selectFile($(this).text())
  if(livePlayer.getVirtualFile() == livePlayer.getSelectedFile()) {
  	$(this).removeClass("flash")
  }

});

let prev = ''
setInterval(function(){
	let ch = livePlayer.getVirtualFile()
	console.log(ch != livePlayer.getSelectedFile())
	if(ch != livePlayer.getSelectedFile() && ch != "") {
	 	if(ch != prev && prev != "") {
	 		$("."+classFilename(prev)).removeClass("flash");
	 	}
	 	$("."+classFilename(ch)).addClass("flash");
	 }
}, 300);

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
