
/**
 * @type {import('../editor/FormEditor').default}
 */
var FormEditorCmd = {};

FormEditorCmd.closeAll = function () {
    var holder;
    var sync = Promise.resolve();
    var tabview = this.$mainTabview;
    for (var key in this.editorHolders) {
        holder = this.editorHolders[key];
        sync = sync.then(tabview.removeTab.bind(tabview, holder.tabframe.attr('id')));
    };
    return sync;
};


FormEditorCmd.closeSaved = function () {
    var holder;
    var sync = Promise.resolve();
    var tabview = this.$mainTabview;
    for (var key in this.editorHolders) {
        holder = this.editorHolders[key];
        if (!holder.tabframe.modified)
            sync = sync.then(tabview.removeTab.bind(tabview, holder.tabframe.attr('id')));
    };
    return sync;
};

FormEditorCmd.saveAllNClose = function () {
    var holder;
    var sync = Promise.resolve();
    var tabview = this.$mainTabview;
    var savePromise;
    for (var key in this.editorHolders) {
        holder = this.editorHolders[key];
        if (holder.tabframe.modified) {
            try {
                savePromise = holder.editor.execCmd('save');
                if (!savePromise || !savePromise.then) savePromise = Promise.resolve(savePromise);
            }
            catch (error) {
                savePromise = Promise.resolve();
            }
        }
        else savePromise = Promise.resolve();
        sync = Promise.all([sync, savePromise]).then(tabview.removeTab.bind(tabview, holder.tabframe.attr('id')));
    };
    return sync;
};



export default FormEditorCmd;