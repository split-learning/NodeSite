let row_featured = [
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Frameworks/frame_3.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Ruby/ruby_2.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/javascript/javascript_2.jpg" },
]
let row_trending = [
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/javascript/javascript_1.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/C#/C#_1.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Frameworks/frame_1.jpg" },
]
let row_js = [
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/javascript/javascript_1.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/javascript/javascript_2.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/javascript/javascript_3.jpg" },
]
let row_csharp = [
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/C#/C#_1.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/C#/C#_2.jpg" },
]
let row_frameworks = [
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Frameworks/frame_1.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Frameworks/frame_2.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Frameworks/frame_3.jpg" },
]
let row_php = [
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Php/php_1.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Php/php_2.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Php/php_3.jpg" },
]
let row_ruby = [
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Ruby/ruby_1.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Ruby/ruby_2.jpg" },
    { title: "A Video", channel: "Astronaut", img_src: "/assets/thumbnails/Ruby/ruby_3.jpg" },
]

let rows = [row_featured, row_trending, row_js, row_csharp, row_frameworks, row_php, row_ruby]

$("#rows-container").ready(() => {
    rows.forEach(category => {
        let row = $("<div class='row'>")
        category.forEach(vid => {
            let video_cell = $("<div class='video_cell'>")
            video_cell.append($("<img class='video_thumbnail' src="+vid.img_src+"/>"))
            video_cell.append($("<div class='video_title'>").html(vid.title))
            video_cell.append($("<div class='video_channel'>").html(vid.channel))
            row.append(video_cell)
        })
    })
    $("#rows-container").append(rows)
})