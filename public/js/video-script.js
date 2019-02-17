$("body").on('click', "#codeSide .nav-item a", function() {
  livePlayer.selectFile($(this).text())
});

function deselectTabs() {

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
			<a class="`+a+` nav-link" id="main-tab" data-toggle="tab" role="tab" 
			aria-controls="home" aria-selected="true">`+filename+`</a>
		</li>`
	$("#tabList").append(button)
}
