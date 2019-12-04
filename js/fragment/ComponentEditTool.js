import BaseEditor from "../core/BaseEditor";
import Fcore from "../core/FCore";
import Dom from "absol/src/HTML5/Dom";
import '../../css/componentedittool.css';

var _ = Fcore._;
var $ = Fcore.$;

function ComponentEditTool() {
    BaseEditor.call(this);
    //TODO
    this.buttonData = {
        rows: [
            // [{ icon: '', cmd: 'delele' }]
        ]
    }

    this.$dockElt = null;
    this.$visiable = [];
    this.updateVisiable = this.updateVisiable.bind(this);
}

Object.defineProperties(ComponentEditTool.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
ComponentEditTool.prototype.constructor = ComponentEditTool;

ComponentEditTool.prototype.CONFIG_STORE_KEY = "AS_ComponentEditorTool_config";
ComponentEditTool.prototype.config = {
    windowStyle: {
        left: '57px',
        top: Dom.getScreenSize().height - 330 + 'px',
        height: '110px'
    }
};

ComponentEditTool.prototype.bindWithLayoutEditor = function (editor) {
    // this.updateVisiable is binded
    if (this.layoutEditor)
        this.layoutEditor.off('selectedcomponentchange', this.updateVisiable);
    this.layoutEditor = editor;
    if (this.layoutEditor)
        this.layoutEditor.on("selectedcomponentchange", this.updateVisiable);
};

ComponentEditTool.prototype.ev_windowPosChange = function () {
    this.config.windowStyle = {
        width: this.$window.style.width,
        height: this.$window.style.height,
        top: this.$window.style.top,
        left: this.$window.style.left,
        minWidth: this.$window.style.minWidth,
    };
    this.saveConfig();
};

ComponentEditTool.prototype.onStart = function () {
    this.getView();
};

ComponentEditTool.prototype.onPause = function () {
    //todo
    this.$view.selfRemove();
};

ComponentEditTool.prototype.updateVisiable = function () {
    if (this.$visiable === undefined)
        return;
    var editors = [];
    if (this.layoutEditor !== undefined)
        editors = this.layoutEditor.anchorEditors;
    if (editors.length > 2) {
        for (var i = 0; i < this.$visiable[2].length; i++)
            this.$visiable[2][i].disabled = false;
    } else {
        for (var i = 0; i < this.$visiable[2].length; i++)
            this.$visiable[2][i].disabled = true;
    }
    if (editors.length > 1) {
        for (var i = 0; i < this.$visiable[1].length; i++)
            this.$visiable[1][i].disabled = false;
    } else {
        for (var i = 0; i < this.$visiable[1].length; i++)
            this.$visiable[1][i].disabled = true;
    }

    if (editors.length > 0) {
        for (var i = 0; i < this.$visiable[0].length; i++)
            this.$visiable[0][i].disabled = false;
    } else {
        for (var i = 0; i < this.$visiable[0].length; i++)
            this.$visiable[0][i].disabled = true;
    }

};

ComponentEditTool.prototype.onResume = function () {
    this.$window.addStyle(this.config.windowStyle).addTo(document.body);
};



ComponentEditTool.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    var items = [];
    var tempItem;
    this.$visiable = [];
    //////////////////////////////1//////////////////////////
    this.$visiable[1] = [];
    this.$visiable[2] = [];
    this.$visiable[0] = [];
    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: "mdi-align-horizontal-left",
        on: {
            click: this.cmd_alignLeftDedge.bind(this)
        },
        props: {
            hover: "Align Left Edges"
        }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: "mdi-align-horizontal-center",
        on: {
            click: this.cmd_alignHorizontalCenter.bind(this)
        },
        props: {
            hover: "Align Horizontal Center"
        }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: "mdi-align-horizontal-right",
        on: {
            click: this.cmd_alignRightDedge.bind(this)
        },
        props: {
            hover: "Align Right Edges"
        }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_("span.mdi.mdi-arrow-expand-horizontal")],
        on: {
            click: this.cmd_equaliseWidth.bind(this)
        },
        props: {
            hover: "Equalise Width"
        }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    items.push(_({ tag: "br" }));

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_("mdi-align-vertical-top")],
        on: {
            click: this.cmd_alignTopDedge.bind(this)
        },
        props: {
            hover: "Align Top Edges"
        }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_('mdi-align-vertical-bottom')],
        on: {
            click: this.cmd_alignBottomDedge.bind(this)
        },
        props: {
            hover: "Align Bottom Edges"
        }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_('mdi-align-vertical-center')],
        on: {
            click: this.cmd_alignVerticalCenter.bind(this)
        },
        props: {
            hover: "Align Vertical Center"
        }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_('mdi-align-vertical-center')],
        on: {
            click: this.cmd_equaliseHeight.bind(this)
        },
        props: {
            hover: "Equalise Height"
        }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    items.push(_({ tag: "br" }));
    ///////////////////////////2////////////////////////
    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_('span.mdi.mdi-distribute-horizontal-left')],
        on: {
            click: this.cmd_distributeHorizontalLeft.bind(this)
        },
        props: {
            hover: "Distribute Horizontal Left"
        }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_('span.mdi.mdi-distribute-horizontal-center')],
        on: {
            click: this.cmd_distributeHorizontalCenter.bind(this)
        },
        props: {
            hover: "Distribute Horizontal Center"
        }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_('span.mdi.mdi-distribute-horizontal-right')],
        on: {
            click: this.cmd_distributeHorizontalRight.bind(this)
        },
        props: {
            hover: 'Distribute Horizontal Right',
        }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_('<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\<path d="m21 7v10h-5v5h-2v-20h2v5h5"/>\<path d="m8 2h2v20h-2v-3h-5v-14h5z"/>\</svg>')],
        on: {
            click: this.cmd_distributeHorizontalDistance.bind(this)
        },
        props: {
            hover: 'Distribute Horizontal Distance',
        }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

    items.push(_({ tag: "br" }));

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_('span.mdi.mdi-distribute-vertical-top')],
        on: {
            click: this.cmd_distributeVerticalTop.bind(this)
        },
        props: {
            hover: 'Distribute Vertical Top',
        }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_('span.mdi.mdi-distribute-vertical-center')],
        on: {
            click: this.cmd_distributeVerticalCenter.bind(this)
        },
        props: {
            hover: 'Distribute Vertical Center',
        }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_('span.mdi.mdi-distribute-vertical-bottom')],
        on: {
            click: this.cmd_distributeVerticalBottom.bind(this)
        },
        props: {
            hover: 'Distribute Vertical Bottom',
        }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: [_('<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\<path d="m7 3h10v5h5v2h-20v-2h5v-5"/>\<path d="m2 16v-2h20v2h-3v5h-14v-5z"/>\</svg>')],
        on: {
            click: this.cmd_distributeVerticalDistance.bind(this)
        },
        props: {
            hover: 'Distribute Verlical Distance',
        }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);
    items.push(_({ tag: "br" }));
    tempItem = _({
        tag: "button",
        class: "as-from-tool-button",
        child: ['span.mdi.mdi-delete-variant'],
        on: {
            click: this.cmd_delete.bind(this)
        },
        props: {
            hover: 'Delete',
        }
    });
    items.push(tempItem);
    this.$visiable[0].push(tempItem);

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
        child: items
    });
    this.$window.addChild(this.$view);
    this.updateVisiable();
    return this.$view;
};

ComponentEditTool.prototype.findFocusAnchorEditor = function () {
    var focusEditor = this.layoutEditor.anchorEditors.filter(function (e) { return e.isFocus });
    return focusEditor[0];
}

ComponentEditTool.prototype.cmd_distributeVerticalDistance = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalDistance();
    }
};

ComponentEditTool.prototype.cmd_distributeVerticalBottom = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeVerticalBottom();
    }
};

ComponentEditTool.prototype.cmd_distributeVerticalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeVerticalCenter();
    }
};

ComponentEditTool.prototype.cmd_distributeVerticalTop = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeVerticalTop();
    }
};

ComponentEditTool.prototype.cmd_distributeHorizontalDistance = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalDistance();
    }
};

ComponentEditTool.prototype.cmd_distributeHorizontalRight = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalRight();
    }
};

ComponentEditTool.prototype.cmd_distributeHorizontalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalCenter();
    }
};

ComponentEditTool.prototype.cmd_distributeHorizontalLeft = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalLeft();
    }
};

ComponentEditTool.prototype.cmd_equaliseHeight = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_equaliseHeight();
    }
};

ComponentEditTool.prototype.cmd_alignVerticalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignVerticalCenter();
    }
};

ComponentEditTool.prototype.cmd_alignBottomDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignBottomDedge();
    }
};

ComponentEditTool.prototype.cmd_alignTopDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignTopDedge();
    }
};

ComponentEditTool.prototype.cmd_equaliseWidth = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_equaliseWidth();
    }
};

ComponentEditTool.prototype.cmd_alignHorizontalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignHorizontalCenter();
    }
};

ComponentEditTool.prototype.cmd_alignRightDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignRightDedge();
    }
};

ComponentEditTool.prototype.cmd_alignLeftDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignLeftDedge();
    }
};

ComponentEditTool.prototype.cmd_delete = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_delete();
    }
};

export default ComponentEditTool;
