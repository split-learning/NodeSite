var recordPos = false

$(document).ready(function(){
	if(searchParams.get('record') != 'true'){
		return;
	}

	editor.setReadOnly(false)

	$(".record-item").removeClass("hide")


	// // Enable button to make new files
	$("#new-tab").on('click', function() {
		console.log("Clicked new tab")
		var filename = prompt("Please enter the filename", "main.js");
		if(filename == undefined || filename == null  || filename == '') {
			return;
		}
		insertEvent(newAddFileEvent(filename))
		livePlayer.addFile(filename);
	})

	$('#editor').click(function() {
		opCursor()
	})
})




function binaryInsertEvent(arr, event) {
	return binaryInsert(arr, event, true, function(a, b){
		return parseFloat(a['ts']) - parseFloat(b['ts'])
	})
} 

// Binary Insert from https://stackoverflow.com/questions/12369824/javascript-binary-search-insertion-preformance
/* 
    target: the object to search for in the array
    comparator: (optional) a method for comparing the target object type
    return value: index of a matching item in the array if one exists, otherwise the bitwise complement of the index where the item belongs
*/
function binarySearch(arr, target, comparator) {
    var l = 0,
        h = arr.length - 1,
        m, comparison;
    comparator = comparator || function (a, b) {
        return (a < b ? -1 : (a > b ? 1 : 0)); /* default comparison method if one was not provided */
    };
    while (l <= h) {
        m = (l + h) >>> 1; /* equivalent to Math.floor((l + h) / 2) but faster */
        comparison = comparator(arr[m], target);
        if (comparison < 0) {
            l = m + 1;
        } else if (comparison > 0) {
            h = m - 1;
        } else {
            return m;
        }
    }
    return~l;
};


// Transcript insertion functions
function insertEvent(event) {
	if(event == undefined) {
		console.log("Undefined event")
		return
	}
	var i = binaryInsertEvent(livePlayer.file.formatArray, event)
	if(i == livePlayer.loc) {
		livePlayer.loc += 1
	}
}

function newAddFileEvent(filename) {
	return {'ts':getYTTime(), 'op':"adf", 'file':filename}
}

function getYTTime() {
	return livePlayer.player.getCurrentTime().toFixed(2)
}

/*
    target: the object to insert into the array
    duplicate: (optional) whether to insert the object into the array even if a matching object already exists in the array (false by default)
    comparator: (optional) a method for comparing the target object type
    return value: the index where the object was inserted into the array, or the index of a matching object in the array if a match was found and the duplicate parameter was false 
*/
function binaryInsert(arr, target, duplicate, comparator) {
    var i = binarySearch(arr, target, comparator);
    if (i >= 0) { /* if the binarySearch return value was zero or positive, a matching object was found */
        if (!duplicate) {
            return i;
        }
    } else { /* if the return value was negative, the bitwise complement of the return value is the correct index for this object */
        i = ~i;
    }
    arr = arr.splice(i, 0, target);
    return i
};


function opCharacter(ch) {
		insertEvent({
			"op": "ch",
			"ts": getYTTime(),
			"ch": ch
		})
	}

	function opBlock(lines) {
		let blockStr = ""
		lines.forEach((line, i) => {
			blockStr += line
			if (i !== lines.length-1) {
				blockStr += '\n'
			}
		})
		insertEvent({
			"op": "block",
			"ts": getYTTime(),
			"block": blockStr
		})
	}

	function opCursor() {
		let pos = livePlayer.multiEdit.editor.getCursorPosition()
		insertEvent({
			"op": "cur",
			"ts": getYTTime(),
			"pos": [pos.row, pos.column],
			"file": livePlayer.getSelectedFile()
		})
		// console.log(JSON.stringify(d.formatArray))
	}

	function opBackspace() {
		insertEvent({
			"op": "bck",
			"ts": getYTTime(),
		})
	}


	function opAddFile(name) {
		insertEvent({
			"op": "adf",
			"ts": getYTTime(),
			"file": livePlayer.getSelectedFile()
		})
	}

function add_sessionChange() {
	livePlayer.multiEdit.editor.getSession().on('change', function(e) {
		 if (livePlayer.multiEdit.editor.curOp && livePlayer.multiEdit.editor.curOp.command.name){
		 	// console.log("user change")
		 }	else {
			// console.log("other change")
			return
		 } 


		if(recordPos) {
			opCursor()
			recordPos = false
		}
		console.log(e)
		if (e.action === 'insert') {
			if (e.lines.length > 1 || e.lines[0].length > 1){
				opBlock(e.lines)
				recordPos = true
			} else {
				opCharacter(e.lines[0])
			}
		} else if (e.action === 'remove') {
			opBackspace()
		}
		//console.log(d)
	});
}

function add_recording() {
	// down
	livePlayer.multiEdit.editor.commands.addCommand({
	    name: "down-arrow",
	    exec: function(editor, args) {
			livePlayer.multiEdit.editor.navigateDown(args.times);
			opCursor()
		},
	    bindKey: {mac: "Down", win: "Down"}
	})
	// up
	livePlayer.multiEdit.editor.commands.addCommand({
	    name: "up-arrow",
	    exec: function(editor, args) {
			livePlayer.multiEdit.editor.navigateUp(args.times);
			opCursor()
		},
	    bindKey: {mac: "Up", win: "Up"}
	})
	// left
	livePlayer.multiEdit.editor.commands.addCommand({
	    name: "left-arrow",
	    exec: function(editor, args) {
			livePlayer.multiEdit.editor.navigateLeft(args.times);
			opCursor()
		},
	    bindKey: {mac: "Left", win: "Left"}
	})
	// right
	livePlayer.multiEdit.editor.commands.addCommand({
	    name: "right-arrow",
	    exec: function(editor, args) {
			livePlayer.multiEdit.editor.navigateRight(args.times); 
			opCursor()
		},
	    bindKey: {mac: "Right", win: "Right"}
	})
}


// Saving
$("#save-json").click(() => {
	save(youtubeID + ".json", JSON.stringify(livePlayer.file))
})

function save(filename, data) {
    var blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}
