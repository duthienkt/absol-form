import EventEmitter from "absol/src/HTML5/EventEmitter";

/**
 * 
 * @param {import('../editor/LayoutEditor').default} layoutEditor 
 */
function BaseAnchorEditor(layoutEditor) {
    EventEmitter.call(this);
    this.layoutEditor = layoutEditor;
    this.component = null;

}

Object.defineProperties(BaseAnchorEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
BaseAnchorEditor.prototype.constructor = BaseAnchorEditor;

BaseAnchorEditor.prototype.focus = function () {
    //not implement
};

BaseAnchorEditor.prototype.blur = function () {
    //not implement
};

BaseAnchorEditor.prototype.edit = function (component) {
    this.component = component;
    if (!this.component) this.blur();
    this.update();
};

BaseAnchorEditor.prototype.update = function(){

};


BaseAnchorEditor.prototype.cmd_delete = function () {
    var editors = this.layoutEditor.anchorEditors;
    var components = editors.map(function (e) {
        return e.component;
    });
    this.layoutEditor.removeComponent.apply(this.layoutEditor, components);
};

BaseAnchorEditor.prototype.cmd_layoutEdit = function () {
    //todo
    if (this.component.isLayout && !this.component.formType){
        this.layoutEditor.editLayout(this.component);
    }
};

export default BaseAnchorEditor;