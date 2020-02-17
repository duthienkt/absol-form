import BaseEditor from "../core/BaseEditor";
import Fcore from "../core/FCore";
import '../../css/componentpropertieseditor.css';
import AttributeEditor from "./AttributeEditor";
import R from "../R";
import StyleEditor from "./StyleEditor";
import AllPropertyEditor from "./AllPropertyEditor";
import Dom from "absol/src/HTML5/Dom";
import EventEditor from "./EventEditor";
import WindowManager from "../dom/WindowManager";
import QuickMenu from "absol-acomp/js/QuickMenu";

var _ = Fcore._;
var $ = Fcore.$;

function ComponentPropertiesEditor(editor) {
    BaseEditor.call(this);
    this.editor = editor;
    var self = this;
    var repeatEvents = {
        change: function (event) {
            self.emit('change', Object.assign({ componentPropertiesEditor: self }, event), self);
        },
        stopchange: function (event) {
            self.emit('stopchange', Object.assign({ componentPropertiesEditor: self }, event), self);
        }
    };
    this.attributeEditor = new AttributeEditor().on(repeatEvents)
        .on('stopchange', function (event) {
            self.allPropertyEditor.updatePropertyRecursive(event.name);
        });
    this.styleEditor = new StyleEditor().on(repeatEvents)
        .on('stopchange', function (event) {
            self.allPropertyEditor.updatePropertyRecursive(event.name);
        });
    this.eventEditor = new EventEditor().on(repeatEvents)
        .on('stopchange', function (event) {
            self.allPropertyEditor.updatePropertyRecursive(event.name);
        });
    this.allPropertyEditor = new AllPropertyEditor().on(repeatEvents)
        .on('stopchange', function (event) {
            self.attributeEditor.updatePropertyRecursive(event.name);
            self.styleEditor.updatePropertyRecursive(event.name);
            self.eventEditor.updatePropertyRecursive(event.name);
        });

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
    var thisEditor = this;
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

    this.$dockBtn = this.$window.$dockBtn;
    this.$dockBtn.children[0].attr('class', 'mdi mdi-dock-right');
    this.$dockBtn.on('click', this.dockToEditor.bind(this));

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
                },
                child: this.eventEditor.getView()
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

    this.$quickmenuBtn = _({
        tag: 'button',
        class: ['as-form-component-properties-editor-quickmenu-button', 'as-from-tool-button'],
        child: 'span.mdi.mdi-dots-horizontal'
    });

    QuickMenu.toggleWhenClick(this.$quickmenuBtn, {
        getMenuProps: function () {
            return {
                extendStyle: {
                    'font-size': '12px'
                },
                items: [
                    {
                        text: 'Undock',
                        icon: 'span.mdi.mdi-dock-window',
                        cmd: 'undock'
                    },
                    {
                        text: 'Help',
                        icon: 'span.mdi.mdi-help'
                    }
                ]
            }
        },
        onSelect: function (item) {
            switch (item.cmd) {
                case 'undock': thisEditor.undock(); break;
            }
        }
    });
    this.$view.appendChild(this.$quickmenuBtn);
    return this.$view;
};

ComponentPropertiesEditor.prototype.onAttached = function () {
    this.setContext(R.ATTRIBUTE_EDITOR, this.attributeEditor);
    this.setContext(R.STYLE_EDITOR, this.styleEditor);
    this.setContext(R.ALL_PROPERTY_EDITOR, this.allPropertyEditor);
    this.setContext(R.EVENT_EDITOR, this.eventEditor);
    this.attributeEditor.attach(this);
    this.eventEditor.attach(this);
    this.styleEditor.attach(this);
    this.allPropertyEditor.attach(this);
};

ComponentPropertiesEditor.prototype.onStart = function () {
    this.getView();
    this.attributeEditor.start();
    this.eventEditor.start();
    this.styleEditor.start();
    this.allPropertyEditor.start();
};

ComponentPropertiesEditor.prototype.onDestroy = function () {
    this.attributeEditor.destroy();
    this.eventEditor.destroy();
    this.styleEditor.destroy();
    this.allPropertyEditor.destroy();
};

ComponentPropertiesEditor.prototype.onPause = function () {
    //todo
    this.$window.remove();
    this.attributeEditor.pause();
    this.eventEditor.pause();
    this.styleEditor.pause();
    this.allPropertyEditor.pause();
};

ComponentPropertiesEditor.prototype.onResume = function () {
    this.loadPosition();
    this.attributeEditor.resume();
    this.eventEditor.resume();
    this.styleEditor.resume();
    this.allPropertyEditor.resume();
};


ComponentPropertiesEditor.prototype.loadPosition = function () {
    if (this.config.docked) {
        this.dockToEditor();
    }
    else {
        this.undock();
    }
};

ComponentPropertiesEditor.prototype.dockToEditor = function () {
    this.$dockElt = this.editor && this.editor.getPropertyCtn && this.editor.getPropertyCtn();
    if (this.$dockElt) {
        this.$view.addTo(this.$dockElt);
        this.$window.remove();
        this.config.docked = true;
        this.saveConfig();
        Dom.updateResizeSystem();
    }
    // propertyCtn
};

ComponentPropertiesEditor.prototype.undock = function () {
    this.config.docked = false;
    this.$view.addTo(this.$window.addStyle(this.config.windowStyle).addTo(document.body));
    Dom.updateResizeSystem();
    this.saveConfig();
};

ComponentPropertiesEditor.prototype.edit = function () {
    this.component = arguments[0];
    this.components = Array.prototype.slice.call(arguments);
    this.styleEditor.edit.apply(this.styleEditor, arguments);
    this.attributeEditor.edit.apply(this.attributeEditor, arguments);
    this.allPropertyEditor.edit.apply(this.allPropertyEditor, arguments);
    this.eventEditor.edit.apply(this.eventEditor, arguments);
};


export default ComponentPropertiesEditor;