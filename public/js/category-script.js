// Find the get paramters
const searchParams = new URLSearchParams(window.location.search)
let cat = searchParams.get('cat')
if(cat == undefined) {
	window.location = "/";
}

$("#category-rows-container").ready(() => {
    let rows = prepJSON()
    console.log(rows.length);
    let index = -1;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].name == cat) {
            index = i;
            break;
        }
    }
    console.log(index);
    // if (index < 0) { window.location = "/"; }

    let singleRow = [rows[index]];
    singleRow.forEach(category => {
        let row = $("<div class='row'>")

        let videos = $("<div class='videos'>")
        row.append($("<div class='row-title'>").html(category.name))

        category.data.forEach(data => {
            let video_cell = $("<div class='video-cell'>")
            video_cell.append($("<img class='video-thumbnail' src="+data.img_src+"/>"))
            video_cell.append($("<div class='video-title'>").html(data.title))
            video_cell.append($("<div class='video-channel'>").html(data.channel))
            videos.append(video_cell)
        })
        row.append(videos)
        $("#category-rows-container").append(row)
    })
});