import BaseEditor from "../core/BaseEditor";
import Fcore from "../core/FCore";
import Dom from "absol/src/HTML5/Dom";

var _ = Fcore._;
var $ = Fcore.$;

function ComponentEditTool() {
    BaseEditor.call(this);
    this.$dockElt = null; 
}

Object.defineProperties(ComponentEditTool.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
ComponentEditTool.prototype.constructor = ComponentEditTool;

ComponentEditTool.prototype.CONFIG_STORE_KEY = "AS_ComponentPropertiesEditor_config";
ComponentEditTool.prototype.config = {
    windowStyle: {
        left: Dom.getScreenSize().width - 346 + 'px',
        top: '59px',
        height: Dom.getScreenSize().height - 100 + 'px'
    }
};


ComponentEditTool.prototype.ev_windowPosChange = function () {
    this.config.windowStyle = { width: this.$window.style.width, height: this.$window.style.height, top: this.$window.style.top, left: this.$window.style.left };
    this.saveConfig();
};



ComponentEditTool.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$window = _({
        tag: 'onscreenwindow',
        class: 'as-form-component-properties-editor-window',
        props: {
            windowTitle: 'Properties',
            windowIcon: 'span.mdi.mdi-shape-plus'
        },
        on: {
            sizechange: this.ev_windowPosChange.bind(this),
            drag: this.ev_windowPosChange.bind(this),
            relocation: this.ev_windowPosChange.bind(this),
        }
    });

    this.$view = _({
        class :'as-form-component-edit-tool'
    });
    return this.$view;
};





export default ComponentEditTool;