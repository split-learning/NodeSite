$("body").on('click', "#codeSide .nav-item a", function() {
  livePlayer.selectFile($(this).text())
});

function addFileToUI(filename) {
	let button = `
		<li class="nav-item">
			<a class="nav-link" id="main-tab" data-toggle="tab" role="tab" 
			aria-controls="home" aria-selected="true">`+filename+`</a>
		</li>`
	$("#tabList").append(button)
}
