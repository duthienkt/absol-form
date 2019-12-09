import BaseEditor from "../core/BaseEditor";
import Fcore from "../core/FCore";
import Dom from "absol/src/HTML5/Dom";
import '../../css/CMDTool.css';
import { LayoutEditorCmdDescriptors } from "../cmds/LayoutEditorCmd";

var _ = Fcore._;
var $ = Fcore.$;

function CMDTool() {
    BaseEditor.call(this);
    this.$dockElt = null;
    this.cmdTree = [];
    this.$buttons = {};// button dictionaryx
    this.$visiable = [];
    this.updateVisiable = this.updateVisiable.bind(this);

}

Object.defineProperties(CMDTool.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
CMDTool.prototype.constructor = CMDTool;

CMDTool.prototype.CONFIG_STORE_KEY = "AS_ComponentEditorTool_config";
CMDTool.prototype.config = {
    windowStyle: {
        left: '320px',
        top: Dom.getScreenSize().height - 330 + 'px',
        height: '110px'
    }
};

/**
 * @param {import('../editor/LayoutEditor').default} editor
 */
CMDTool.prototype.bindWithLayoutEditor = function (editor) {
    // this.updateVisiable is binded
    if (this.layoutEditor)
        this.layoutEditor.off('selectedcomponentchange', this.updateVisiable);
    this.layoutEditor = editor;
    if (this.layoutEditor) {
        this.layoutEditor.on("selectedcomponentchange", this.updateVisiable);
    }
    this.refresh();
};

CMDTool.prototype.ev_windowPosChange = function () {
    this.config.windowStyle = {
        width: this.$window.style.width,
        height: this.$window.style.height,
        top: this.$window.style.top,
        left: this.$window.style.left,
        minWidth: this.$window.style.minWidth,
    };
    this.saveConfig();
};

CMDTool.prototype.onStart = function () {
    this.getView();
};

// CMDTool.prototype.onResume

CMDTool.prototype.onPause = function () {
    //todo
    if (this.$dockElt) {

    }
    else {
        this.$window.selfRemove();
    }
};

CMDTool.prototype.updateVisiable = function () {
    var self = this;
    Object.keys(this.$buttons).forEach(function (name) {
        var descriptor = self.layoutEditor.getCmdDescriptor(name);
        self.$buttons[name].disabled = descriptor.disabled;
    });
};

CMDTool.prototype.onResume = function () {
    if (this.$dockElt) {

    }
    else {
        this.$window.addStyle(this.config.windowStyle).addTo(document.body);
    }
    this.refresh();
};

CMDTool.prototype.button = function (object) {
    var classArray = ["as-from-tool-button"]
    if (Array.isArray(object.tag))
        classArray.concat(object.tag);
    else
        classArray.push(object.tag);
    return _(
        {
            tag: "button",
            class: classArray,
            child: object.child,
            on: {
                click: function () {
                    object.click();

                }
            },
            attr: {
                title: object.hover
            }
        }
    );
};

CMDTool.prototype.container = function (object, arrayVisiable) {
    var container, button;
    var classArray = ["as-from-align-controler-edit-tool"]
    if (Array.isArray(object.tag))
        classArray.concat(object.tag);
    else
        classArray.push(object.tag);
    container = _(
        {
            tag: "div",
            class: classArray
        }
    )
    for (var j = 0; j < object.child.length; j++) {
        button = this.button(object.child[j]);
        container.addChild(button);
        arrayVisiable.push(button);
    }
    return container;
}

// CMDTool.prototype.extract = function (object) {
//     var classArray;
//     var edges = object.Edges;
//     this.$edges = [];
//     var final = [];
//     var button, container;

//     for (var i = 0; i < edges.length; i++) {
//         container = this.container(edges[i], this.$edges);
//         final.push(container);
//     }

//     var distribute = object.Distribute;
//     this.$distribute = [];
//     for (var i = 0; i < distribute.length; i++) {
//         container = this.container(distribute[i], this.$distribute);
//         final.push(container);
//     }

//     var deleteTemp = object.Delete;
//     this.$delete = [];
//     for (var i = 0; i < deleteTemp.length; i++) {
//         container = this.container(deleteTemp[i], this.$delete);
//         final.push(container);
//     }

//     var previewTemp = object.Preview;
//     this.$preview = [];
//     for (var i = 0; i < previewTemp.length; i++) {
//         container = this.container(previewTemp[i], this.$preview);
//         final.push(container);
//     }
//     return final;
// }

CMDTool.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;

    this.$window = _({
        tag: "onscreenwindow",
        class: "as-form-component-properties-editor-window",
        props: {
            windowTitle: "Tools",
            windowIcon: "span.mdi.mdi-shape-plus"
        },
        on: {
            sizechange: this.ev_windowPosChange.bind(this),
            drag: this.ev_windowPosChange.bind(this),
            relocation: this.ev_windowPosChange.bind(this)
        }
    });
    this.$view = _({
        class: "as-form-component-edit-tool",
        // child: CMDTool.prototype.extract(this.$dataButton)
    });
    if (!this.$dockElt) {
        this.$window.addChild(this.$view);
    }
    this.refresh();
    // this.updateVisiable();
    return this.$view;
};


CMDTool.prototype.refresh = function () {
    if (!this.layoutEditor) return;
    this.$view.clearChild();
    this.$buttons = {};
    var cmdNames = this.layoutEditor.getCmdNames();
    var descriptors = this.layoutEditor.getCmdDescriptors();
    var groupTree = this.layoutEditor.getCmdGroupTree();
    var self = this;
    function visit(node) {
        if (node instanceof Array) {
            return _({
                class: 'as-from-tool-group-buttons',
                child: node.map(visit)
            })
        }
        else {
            var descriptor = self.layoutEditor.getCmdDescriptor(node);
            self.$buttons[node] = _({
                tag: 'button',
                class: ['as-from-tool-button'],
                attr: { title: descriptor.desc },
                child: descriptor.icon,
                props: {
                    disabled: !!descriptor.disabled
                },
                on:{
                    click:function(){
                        self.runCmd.apply(self, [node].concat(descriptor.args||[]));
                    }
                }
            });
            return self.$buttons[node];
        }
    }
    this.$view.addChild(visit(groupTree));
};

CMDTool.prototype.runCmd = function () {
        this.layoutEditor.runCmd.apply(this.layoutEditor, arguments);
};

export default CMDTool;
