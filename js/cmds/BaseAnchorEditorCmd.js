export var BaseAnchorEditorCmdDescriptors = {

};

var BaseAnchorEditorCmd = {

};



BaseAnchorEditorCmd.delete = function () {
    var editors = this.layoutEditor.anchorEditors;
    var components = editors.map(function (e) {
        return e.component;
    });
    this.layoutEditor.removeComponent.apply(this.layoutEditor, components);
};

BaseAnchorEditorCmd.layoutEdit = function () {
    //todo
    if (this.component.isLayout && !this.component.isFragmentView){
        this.layoutEditor.editLayout(this.component);
    }
};


export default BaseAnchorEditorCmd;