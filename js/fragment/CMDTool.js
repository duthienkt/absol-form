import BaseEditor from "../core/BaseEditor";
import Fcore from "../core/FCore";
import Dom from "absol/src/HTML5/Dom";
import '../../css/cmdtool.css';
import WindowManager from "../dom/WindowManager";
import QuickMenu from "absol-acomp/js/QuickMenu";

var _ = Fcore._;
var $ = Fcore.$;

function CMDTool() {
    BaseEditor.call(this);
    this.$dockElt = null;
    this.cmdTree = [];
    this.$buttons = {};// button dictionaryx
    this.$visiable = [];
    this.updateVisiable = this.updateVisiable.bind(this);
    this.refresh = this.refresh.bind(this);

}

Object.defineProperties(CMDTool.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
CMDTool.prototype.constructor = CMDTool;

CMDTool.prototype.CONFIG_STORE_KEY = "AS_CMDTool_config";
CMDTool.prototype.config = {
    windowStyle: {
        left: '320px',
        top: Dom.getScreenSize().height - 330 + 'px',
        height: '110px'
    }
};

/**
 * @param {import('../editor/editor').default} editor
 */
CMDTool.prototype.bindWithEditor = function (editor) {
    // this.updateVisiable is binded
    if (this.editor){
        this.editor.off('cmddescriptorschange', this.updateVisiable);
        this.editor.off('cmdchange', this.refresh);
    }

    this.editor = editor;
    if (this.editor) {
        this.editor.on('cmdchange', this.refresh);
        this.editor.on("cmddescriptorschange", this.updateVisiable);
    }
    this.refresh();
};

CMDTool.prototype.ev_windowPosChange = function () {
    this.config.windowStyle = {
        width: this.$window.style.width,
        height: this.$window.style.height,
        top: this.$window.style.top,
        left: this.$window.style.left
    };
    this.saveConfig();
};

CMDTool.prototype.onStart = function () {
    this.getView();
};


CMDTool.prototype.onPause = function () {
    //todo
    if (this.$dockElt) {

    }
    else {
        WindowManager.remove(this.$window);
    }
};

CMDTool.prototype.updateVisiable = function () {
    if (!this.editor) return;
    var self = this;
    Object.keys(this.$buttons).forEach(function (name) {
        var descriptor = self.editor.getCmdDescriptor(name);
        self.$buttons[name].disabled = descriptor.disabled;
    });
};

CMDTool.prototype.onResume = function () {
    this.loadPosition();
    this.updateVisiable();
};


CMDTool.prototype.getView = function () {
    if (this.$view) return this.$view;
    var thisCmdTool = this;
    this.$window = _({
        tag: "onscreenwindow",
        attr: {
            tabIndex: '1'
        },
        class: "as-form-cmd-tool-window",
        props: {
            windowTitle: "Tools",
            windowIcon: "span.mdi.mdi-shape-plus"
        },
        on: {
            sizechange: this.ev_windowPosChange.bind(this),
            drag: this.ev_windowPosChange.bind(this),
            relocation: this.ev_windowPosChange.bind(this),
            keydown: this.ev_cmdKeyDown.bind(this)
        }
    });

    this.$view = _({
        tag: 'bscroller',
        class: "as-form-cmd-tool",
    });
    $('.absol-onscreen-window-body-container', this.$window, function (e) {
        e.addClass('absol-bscroller');
    });
    if (!this.$dockElt) {
        this.$window.addChild(this.$view);
    }

    this.$minimizeBtn = this.$window.$minimizeBtn;
    this.$minimizeBtn.on('click', this.dockToEditor.bind(this));
    this.$quickmenuBtn = _({
        tag: 'button',
        class: ['as-form-cmd-tool-menu-trigger', 'as-from-tool-button'],
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
                case 'undock': thisCmdTool.undock(); break;
            }
        }
    })
    this.refresh();
    return this.$view;
};

CMDTool.prototype.dockToEditor = function () {
    this.$dockBtn = this.editor && this.editor.getCmdToolCtn && this.editor.getCmdToolCtn();
    if (this.$dockBtn) {
        this.$window.remove();
        this.getView().addTo(this.$dockBtn);
        Dom.updateResizeSystem();
        this.config.docked = true;
        this.saveConfig();
        this.$quickmenuBtn.addTo(this.$view);
    }
};


CMDTool.prototype.undock = function () {
    this.config.docked = false;
    this.$view.addTo(this.$window);
    this.$window.addStyle(this.config.windowStyle).addTo(document.body);
    Dom.updateResizeSystem();
};

CMDTool.prototype.loadPosition = function () {
    if (this.config.docked) {
        this.dockToEditor();
    }
    else {
        this.undock();
    }
};


CMDTool.prototype.refresh = function () {
    if (!this.editor) return;
    this.$view.clearChild();
    this.$buttons = {};
    var groupTree = this.editor.getCmdGroupTree();
    var self = this;
    function visit(node) {
        if (node instanceof Array) {
            return _({
                class: 'as-from-tool-group-buttons',
                child: node.map(visit)
            })
        }
        else {
            var descriptor = self.editor.getCmdDescriptor(node);
            var title = descriptor.desc;
            if (descriptor.bindKey && descriptor.bindKey.win) {
                title += ' (' + descriptor.bindKey.win + ')';
            }
            self.$buttons[node] = _({
                tag: 'button',
                class: ['as-from-tool-button'],
                attr: { title: title },
                child: descriptor.icon,
                props: {
                    disabled: !!descriptor.disabled
                },
                on: {
                    click: function () {
                        self.execCmd.apply(self, [node].concat(descriptor.args || []));
                    }
                }
            });
            return self.$buttons[node];
        }
    }
    this.$view.addChild(visit(groupTree));
    if (this.config.docked) this.dockToEditor();
};

CMDTool.prototype.execCmd = function () {
    this.editor.execCmd.apply(this.editor, arguments);
};


CMDTool.prototype.ev_cmdKeyDown = function (event) {
    this.editor.ev_cmdKeyDown(event);//repeat event
}
export default CMDTool;
