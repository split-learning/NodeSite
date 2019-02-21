/**
 * Editor: Holds the editor and its operations
 */
class MultipleEditor {
  constructor(editor) {
    // Initialize editor
    this.mode = 'ace/mode/javascript';
    this.editor = editor; // ace.edit('editor', this.mode);
    // this.editor.setTheme('ace/theme/github');

    // Inititalize fileManager
    this.fileManager = new FileManager();
    // Start event listeners
    // editorUI.startEventListeners();
  }
}

/**
 * Editor's file operations
 */
MultipleEditor.prototype.addFile = function (filename) {
  var self = this;
  var check = this.fileManager.addFile(filename, function () {
    return ace.createEditSession('', self.mode);
  });

  if (check) {
    // editorUI.createFile(filename);
    // $("#files").append(`
    //   <li class="`+classFilename(filename)+` files-list">`+filename+`</li>
    //   `)
    this.selectFile(filename);
  }
};

MultipleEditor.prototype.removeFile = function (filename) {
  return this.fileManager.removeFile(filename);
};

MultipleEditor.prototype.renameFile = function (oldFilename, newFilename) {
  return this.fileManager.renameFile(oldFilename, newFilename);
};

MultipleEditor.prototype.selectFile = function (filename) {
  var session = this.fileManager.selectFile(filename);
  if (session) {
    this.editor.setSession(session);
    // TODO: UI Change
    // editorUI.selectFile(filename);
    $(".files-list").css("font-weight","normal");
    $("."+classFilename(filename)).css("font-weight","Bold");
  }
};

function classFilename(filename) {
  return filename.replace(".", "D")
}
