import EventEmitter from "absol/src/HTML5/EventEmitter";
import CMDRunner from "absol/src/AppPattern/CMDRunner";

/**
 * 
 * @param {import('../editor/LayoutEditor').default} layoutEditor 
 */
function BaseAnchorEditor(layoutEditor) {
    EventEmitter.call(this);
    this.layoutEditor = layoutEditor;
    this.component = null;
    this.cmdRunner = new CMDRunner(this);

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



BaseAnchorEditor.prototype.getCmdNames = function(){
    var res = [];
    if (this.component.isLayout && !this.component.formType){
        res.push('layoutEdit');
    }
    res.push('delete');
    return res;
};

BaseAnchorEditor.prototype.getCmdDescriptor = function(name){
    
};


export default BaseAnchorEditor;