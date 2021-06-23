import EventEmitter from "absol/src/HTML5/EventEmitter";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import Toast from "absol-acomp/js/Toast";

/**
 *
 * @param {LayoutEditor} layoutEditor
 */
function BaseAnchorEditor(layoutEditor) {
    EventEmitter.call(this);
    this._bindEvent();
    this.layoutEditor = layoutEditor;
    this.component = null;
    this.cmdRunner = new CMDRunner(this);

}

Object.defineProperties(BaseAnchorEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
BaseAnchorEditor.prototype.constructor = BaseAnchorEditor;

BaseAnchorEditor.prototype._bindEvent = function () {
    for (var key in this) {
        if (key.startsWith('ev_'))
            this[key] = this[key].bind(this);
    }
};


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

BaseAnchorEditor.prototype.update = function () {

};


BaseAnchorEditor.prototype.getCmdNames = function () {
    var res = [];
    if (this.component.isLayout && !this.component.formType) {
        res.push('layoutEdit');
    }
    res.push('delete');
    return res;
};

BaseAnchorEditor.prototype.getCmdDescriptor = function (name) {

};

BaseAnchorEditor.prototype.ev_dblClick = function () {
    if (!this.component) return;
    if (this.component.isFragmentView) {
        var message = Toast.make({
            props: {
                title: "TODO",
                message: "Edit Form"
            }
        }, 'auto');
        setTimeout(message.disappear.bind(message), 2000);
    }
    else {
        this.layoutEditor.editLayout(this.component);
    }
};

export default BaseAnchorEditor;