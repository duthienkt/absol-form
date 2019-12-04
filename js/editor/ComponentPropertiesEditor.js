import BaseEditor from "../core/BaseEditor";
import Fcore from "../core/FCore";
import '../../css/componentpropertieseditor.css';
import AttributeEditor from "./AttributeEditor";
import R from "../R";
import StyleEditor from "./StyleEditor";
import AllPropertyEditor from "./AllPropertyEditor";
import Dom from "absol/src/HTML5/Dom";

var _ = Fcore._;
var $ = Fcore.$;

function ComponentPropertiesEditor() {
    BaseEditor.call(this);
    var self = this;
    var repeatEvents = {
        change: function (event) {
            self.emit('change', Object.assign({ componentPropertiesEditor: self }, event), self);
        },
        stopchange: function (event) {
            self.emit('stopchange', Object.assign({ componentPropertiesEditor: self }, event), self);
        }
    }
    this.attributeEditor = new AttributeEditor().on(repeatEvents);
    this.styleEditor = new StyleEditor().on(repeatEvents);
    // this.eveEditor = new StyleEditor().on(repeatEvents);
    this.allPropertyEditor = new AllPropertyEditor().on(repeatEvents);

    this.$dockElt = null;
    this.component = undefined;
}

Object.defineProperties(ComponentPropertiesEditor.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
ComponentPropertiesEditor.prototype.constructor = ComponentPropertiesEditor;

ComponentPropertiesEditor.prototype.CONFIG_STORE_KEY = "AS_ComponentPropertiesEditor_config";
ComponentPropertiesEditor.prototype.config = {
    windowStyle: {
        left: Dom.getScreenSize().width - 346 + 'px',
        top: '59px',
        height: Dom.getScreenSize().height - 100 + 'px'
    }
};


ComponentPropertiesEditor.prototype.ev_windowPosChange = function () {
    this.config.windowStyle = { width: this.$window.style.width, height: this.$window.style.height, top: this.$window.style.top, left: this.$window.style.left };
    this.saveConfig();
};

ComponentPropertiesEditor.prototype.getView = function () {
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
        tag: 'tabview',
        class: ["as-form-component-properties-editor", 'xp-tiny'],
        child: [
            {
                tag: 'tabframe',
                class: 'absol-bscroller',
                attr: {
                    name: 'Attribute'
                },
                child: this.attributeEditor.getView()
            },
            {
                tag: 'tabframe',
                attr: {
                    name: 'Style'
                },
                child: this.styleEditor.getView()
            },
            {
                tag: 'tabframe',
                class: 'absol-bscroller',
                attr: {
                    name: 'Event'
                }
            },
            {
                tag: 'tabframe',
                class: 'absol-bscroller',
                attr: {
                    name: 'All'
                },
                child: this.allPropertyEditor.getView()
            }
        ]
    });
    if (!this.$dockElt) {
        this.$window.addChild(this.$view);
    }
    return this.$view;
};

ComponentPropertiesEditor.prototype.onAttached = function () {
    this.setContext(R.ATTRIBUTE_EDITOR, this.attributeEditor);
    this.attributeEditor.attach(this);
    // this.attributeEditor.attach(this);
}

ComponentPropertiesEditor.prototype.onStart = function () {
    this.getView();
}

ComponentPropertiesEditor.prototype.onPause = function () {
    //todo
    if (this.$dockElt) {

    }
    else {
        this.$window.selfRemove();
    }
};

ComponentPropertiesEditor.prototype.onResume = function () {
    if (this.$dockElt) {

    }
    else {
        this.$window.addStyle(this.config.windowStyle).addTo(document.body);
    }
};


ComponentPropertiesEditor.prototype.dockToElt = function (elt) {

};

ComponentPropertiesEditor.prototype.undock = function () {

};

ComponentPropertiesEditor.prototype.edit = function (comp) {
    this.component = comp;
    this.styleEditor.edit(comp);
    this.attributeEditor.edit(comp);
    this.allPropertyEditor.edit(comp);
};


export default ComponentPropertiesEditor;