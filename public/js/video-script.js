$("body").on('click', "#codeSide .nav-item a", function(e) {
	var p = $(this).parent(".nav-item")
	if(p.attr("isFile") == "false") {
		return
	}

	livePlayer.selectFile($(this).text())
	if(livePlayer.getVirtualFile() == livePlayer.getSelectedFile()) {
		p.removeClass("flash")
	}

});

$(".save-json").on('click', function() {
	console.log("TEST")
	$(this).removeClass("active")
})

let prev = ''
setInterval(function(){
	$(".filename-tab").each(function(){
         $(this).removeClass("flash")
     })
	let ch = livePlayer.getVirtualFile()
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
	var untit = selected
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
	if(!untit) {
		$("#untitiled-tab").remove()
	}
	// $(button).insertBefore("#new-tab")
}
