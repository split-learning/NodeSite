// $("body").on('click', ".files-list", function(e) {
//   livePlayer.selectFile($(this).text())
// })

var livePlayer = null

class CodingVideo {
  constructor(file, multiEdit) {
      this.player = null
      this.file = file // JSON data file
      this.timestamp = 0
      this.loc = 0
      this.multiEdit = multiEdit // The seleced editor
      this.files = []
      // this.addFile(filename)
      // this.selectFile(filename)
      this.platerState = 0
      // this.editors = {}
      // Always increment this on update, to kill past updates
      this.updateLoop = 0
      this.selectedFile = ""
      this.virtualPos = {
        file:"",
        pos: {row:0, column:0}
      }

      // TODO: Do not always run interval
      var lc = this
      this.runInterval = setInterval(function(){lc.run()}, 100);

      this.run = this.run.bind(this)
      this.update = this.update.bind(this)
  }

  getSelectedFile() {
    return this.selectedFile
  }

  getCurrentFile(filename) {
    this.selectedFile = filename
  }

  addFile(filename) {
    if(!this.files.includes(filename)) {
      addFileToUI(filename)
      this.multiEdit.addFile(filename)
      this.multiEdit.editor.getSession().setOption("useWorker", false)
      this.files.push(filename)
    }
    this.selectFile(filename)
  }

  selectFile(filename) {
    this.multiEdit.selectFile(filename)
    this.selectedFile = filename
    console.log("User Selected File " + this.selectedFile)
  }

  getFiles() {
    return this.files
  }

  // Run is the main loop, it will track the current timestamp
  //  and update accordingly
  run() {
    if(this.player == null) {
      return
    }

    this.update(this.player.getCurrentTime())
  }

  // Update the string/dom for timestamp
  //  Args:
  //    ts == timestamp in video
  update(ts) {
      var myLoop = this.updateLoop + 1
      this.updateLoop++

      if(this.timestamp > ts) {
        console.log("Player Seeked backwards from " + this.timestamp + " to " + ts)

        // This person skipped backwards
        // Easiest to reset the location in array, reset all code, and walk through FAST
        for(var ed in this.getFiles()) {
          this.selectFile(ed);
          this.multiEdit.editor.selectAll()
          this.multiEdit.editor.removeLines()
          this.multiEdit.editor.session.setAnnotations([])
        }

        this.loc = 0
        this.timestamp = ts
      }

      // This person is either watching the video, or they have skipped forwards
      while(this.file.formatArray.length > this.loc) {
        if(this.updateLoop > myLoop) {
          // We are running a new update loop, stop this one.
          return
        }

        if(this.file.formatArray[this.loc].ts > ts) {
          // End
          break;
        }
        // Apply this change
        this.apply(this.file.formatArray[this.loc]);
        // Increment the loop
        this.loc = this.loc + 1;
      }


      this.timestamp = ts
  }

  addAnnotation(change) {
    return
    var arr = this.multiEdit.editor.session.getAnnotations()
    arr.push(
      {ts: change.ts,
       row: change.pos[0],
       column: change.pos[1],
       text: change.an,
       type: change.t,
       raw: change.an}
    )
    this.multiEdit.editor.session.setAnnotations(arr);
  }

  updatePos(change) {
    if(change.file != undefined) {
      this.virtualPos.file = change.file
    }
    this.virtualPos.pos = {row:change.pos[0], column:change.pos[1]}
  }

  apply(change) {
    // Opcode
    //console.log(this.virtualPos.pos, change)
    switch(change.op) {
      case "ch":
        this.multiEdit.fileManager.state[this.virtualPos.file].insert(this.virtualPos.pos, change.ch)
        if(change.ch == "\n") {
          this.virtualPos.pos.row++
          this.virtualPos.pos.column = 0
        } else {
          this.virtualPos.pos.column++
        }
        // this.multiEdit.editor.session.insert(this.virtualPos, change.ch)
        break;
      case "block":
        this.multiEdit.fileManager.state[this.virtualPos.file].insert(this.virtualPos.pos, change.block)
        var rowChange = (change.block.match(/\n/g)||[]).length
        this.virtualPos.pos.row += rowChange
        if(rowChange > 0) {
          this.virtualPos.pos.column = 0;
        }

        var colChange = change.block.lastIndexOf('\n');
        if(colChange != -1) {
          this.virtualPos.pos.column = change.block.length - colChange;
        } else {
          this.virtualPos.pos.column += change.block.length
        }
        break;
      case "multi":
        for(com in change.multi) {
          this.apply(com)
        }
        break;
      case "bck":
        var newpos = {row:this.virtualPos.pos.row, column:this.virtualPos.pos.column}
        newpos.column--
        if(newpos.column < 0) {
          newpos.row--
          newpos.column = 0
          if(newpos.row < 0) {
            newpos.row = 0
          }
        }
        // this.multiEdit.editor.remove("left")
        this.multiEdit.fileManager.state[this.virtualPos.file].remove({
          end:this.virtualPos.pos,
          start:newpos
        })
        this.virtualPos.pos = newpos
        break;
      // case "del":
      //   // this.multiEdit.editor.remove("right")
      //   break;
      case "adf":
        this.addFile(change.file)
        break;
      case "cur":
        this.updatePos(change)
        // if(change.file != undefined) {
        //   console.log("CHANGE FILE", change.file)
        //   this.selectFile(change.file)
        // }
        // this.multiEdit.editor.gotoLine(change.pos[0], change.pos[1], true)
        break;
      // case "dell":
      //   this.multiEdit.editor.removeLines()
      //   break;
      case "an":
        this.addAnnotation(change);
        break;
      case "selection":
        // TODO: If adding selection style, use
        // livePlayer.multiEdit.editor.session.getMarkers()
        break;
    }
  }

  // Video control
  pauseVideo() {
    // this.returnCursor = true
    // var ret = this.multiEdit.editor.getCursorPosition()
    // this.return = [this.getSelectedFile(), ret.row, ret.column]
    this.player.pauseVideo();
  }

  // Event Constants
  //  event.data == YT.PlayerState.UNSTARTED  // 0
  //  event.data == YT.PlayerState.ENDED      // 1
  //  event.data == YT.PlayerState.PLAYING    // 2
  //  event.data == YT.PlayerState.PAUSED     // 3
  //  event.data == YT.PlayerState.BUFFERING  // 4
  //  event.data == YT.PlayerState.CUED       // 5
  onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      // Youtube Video is playing, so user could have:
      //  - Resumed
      //  - Seeked
    } else if(event.data == YT.PlayerState.PAUSED) {
      // Youtube Video is paused, user paused
    }
  }
}
