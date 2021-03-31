
import Draggable from 'absol-acomp/js/Draggable';

import '../../css/formeditor.css';
import Fcore from '../core/FCore';
import LayoutEditor from './LayoutEditor';
import Dom from 'absol/src/HTML5/Dom';

import ComponentPicker from './ComponentPicker';
import R from '../R';
import FormPreview from './FormPreview';
import { randomIdent } from 'absol/src/String/stringGenerate';
import QuickMenu from 'absol-acomp/js/QuickMenu';
import ProjectExplorer from '../fragment/ProjectExplorer';
import PluginManager from '../core/PluginManager';
import BaseEditor from '../core/BaseEditor';
import CMDTool from '../fragment/CMDTool';
import CodeEditor from './CodeEditor';
import FormEditorCmd from '../cmds/FormEditorCmd';
import PhotoViewer from './PhotoViewer';
import '../dom/StatusBar';

var _ = Fcore._;
var $ = Fcore.$;

function FormEditor() {
    BaseEditor.call(this);
    this.prefix = randomIdent(16) + "_";
    this.setContext(R.FORM_EDITOR, this);
    this.cmdRunner.assign(FormEditorCmd);
    this.style = {
        leftSizeWidth: 16,//em
        leftSizeMinWidth: 10,

        rightSizeWidth: 23,//em
        rightSizeMinWidth: 15,
    };

    this.projectExplorer = new ProjectExplorer();
    this.editorHolders = {};
    this.activeEditorHolder = null;


    this.mFormPreview = new FormPreview();

    this.mComponentPicker = new ComponentPicker();
    this.mCMDTool = new CMDTool();

    this.statusBarElt = _('statusbar');

    this.setContext(R.STATUS_BAR_ELT, this.statusBarElt);
    this.setContext(R.COMPONENT_PICKER, this.mComponentPicker);
    this.setContext(R.CMD_TOOL, this.mCMDTool);
    this.setContext(R.PROJECT_EXPLORER, this.projectExplorer);
    this.mComponentPicker.attach(this);// share, but not run
    this.mCMDTool.attach(this);
    this.mFormPreview.attach(this);
    this.projectExplorer.attach(this);
}

Object.defineProperties(FormEditor.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
FormEditor.prototype.constructor = FormEditor;

FormEditor.prototype.CONFIG_STORE_KEY = "AS_FormEditor_config";

FormEditor.prototype.SUPPORT_EDITOR = {
    form: LayoutEditor,
    image: PhotoViewer,
    jpg: PhotoViewer
};

Object.keys(CodeEditor.prototype.TYPE_MODE).forEach(function (typeName) {
    FormEditor.prototype.SUPPORT_EDITOR[typeName] = CodeEditor;
})

FormEditor.prototype.onStart = function () {
    this.projectExplorer.start();
};


FormEditor.prototype.onStop = function () {
    this.projectExplorer.stop();
};


FormEditor.prototype.onPause = function () {
    this.projectExplorer.pause();
    var self = this;
    this.runningEditorsIsPaused = Object.keys(this.editorHolders).filter(function (id) {
        var holder = self.editorHolders[id];
        if (holder.editor && holder.editor.state == 'RUNNING') {
            holder.editor.pause();
            return true;
        }
    });

};


FormEditor.prototype.onResume = function () {
    this.projectExplorer.resume();
    var self = this;
    if (this.runningEditorsIsPaused) {
        this.runningEditorsIsPaused.forEach(function (id) {
            var holder = self.editorHolders[id];
            if (holder.editor && holder.editor.state.match('PAUSE')) {
                holder.editor.resume();
            }
        });
        this.runningEditorsIsPaused = [];
    }
};


FormEditor.prototype.config = {
    leftSiteWidthPercent: 15
};


FormEditor.prototype.openProject = function (name) {
    this.projectExplorer.openProject(name);
    this.mComponentPicker.getView();//load component constructor
};


FormEditor.prototype.openItem = function (type, ident, name, contentArguments, desc) {
    var self = this;
    if (this.editorHolders[ident]) {
        this.editorHolders[ident].tabframe.requestActive();
    }
    else {
        if (this.SUPPORT_EDITOR[type]) {
            var editor = new this.SUPPORT_EDITOR[type];
            editor.attach(this);

            var accumulator = {
                type: type,
                contentArguments: contentArguments
            };
            this.openEditorTab(ident, name, desc, editor, accumulator);
            PluginManager.exec(this, R.PLUGINS.LOAD_CONTENT_DATA, accumulator)
        }
        else {
            throw new Error("The editor not support " + type + ' type!');
        }
    }
    return this.editorHolders[ident];
};


FormEditor.prototype.openEditorTab = function (ident, name, desc, editor, accumulator) {
    var self = this;
    accumulator = accumulator || {};
    var componentTool = editor.getComponentTool();
    var outlineTool = editor.getOutlineTool();

    var tabframe = _({
        tag: 'tabframe',
        attr: {
            name: name,
            desc: desc
        },
        child: editor.getView()

    });
    Object.assign(accumulator, {
        tabframe: tabframe,
        ident: ident,
        name: name,
        desc: desc,
        editor: editor,
        formEditor: this,
        componentTool: componentTool,
        outlineTool: outlineTool,
        sync: Promise.resolve(),
        waitFor: function (aw) {
            if (!aw.then)
                aw = Promise.resolve(aw);
            this.sync = Promise.all([this.sync, aw]);
        }
    });
    this.editorHolders[ident] = accumulator;

    this.$editorSpaceCtn.removeStyle('visibility');
    tabframe.on({
        deactive: function () {
            editor.pause();
            if (self.activeEditorHolder == accumulator)
                self.activeEditorHolder = null;
            if (componentTool)
                componentTool.getView().remove();
            if (outlineTool)
                outlineTool.getView().remove();
            if (componentTool == self.mComponentPicker) self.mComponentPicker.bindWithEditor(undefined);

        },
        active: function () {
            editor.start();
            self.activeEditorHolder = accumulator;
            if (componentTool)
                componentTool.getView().addTo(self.$componentTabFrame);
            if (outlineTool)
                outlineTool.getView().addTo(self.$outlineTabFrame);
            if (componentTool == self.mComponentPicker) self.mComponentPicker.bindWithEditor(editor);
        },
        remove: function () {
            self.editorHolders[ident].editor.destroy();
            self.editorHolders[ident] = undefined;
            delete self.editorHolders[ident];
            if (Object.keys(self.editorHolders).length == 0)
                self.$editorSpaceCtn.addStyle('visibility', 'hidden');
        }
    });
    this.$mainTabview.addChild(tabframe);
    return accumulator;
};


FormEditor.prototype.getEditorHolderByIdent = function (ident) {
    return this.editorHolders[ident];
};


FormEditor.prototype.getEditorHolderByEditor = function (editor) {
    for (var ident in this.editorHolders) {
        if (this.editorHolders[ident].editor == editor) return this.editorHolders[ident];
    }
    return null;
};

FormEditor.prototype.getAllEditorHolderByEditorClass = function (clazz){
    var res = [];
    for (var ident in this.editorHolders) {
        if (this.editorHolders[ident].editor.constructor == clazz)  res.push(this.editorHolders[ident]);
    }
    return res;
};


FormEditor.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    this.$view = _({
        class: 'as-form-editor',
        attr: {
            tabindex: '1'
        },
        child: [
            {
                class: 'as-form-editor-left-tab-bar',
                child: [
                    {
                        tag: 'button',
                        id: this.prefix + 'button-tab-explorer',
                        child: 'span.mdi.mdi-file-multiple',
                        attr: {
                            title: 'Explorer'
                        },
                        on: {
                            click: this.toggleToolTab.bind(this, 'tab-explorer')
                        }
                    },
                    {
                        tag: 'button',
                        id: this.prefix + 'tab-component',
                        child: 'span.mdi.mdi-view-grid-outline',
                        attr: {
                            title: 'Components'
                        },
                        on: {
                            click: this.toggleToolTab.bind(this, 'tab-component')
                        }
                    },
                    {
                        tag: 'button',
                        child: 'span.mdi.mdi-view-list',
                        id: this.prefix + 'tab-outline',
                        attr: {
                            title: 'Outline'
                        },
                        on: {
                            click: this.toggleToolTab.bind(this, 'tab-outline')
                        }
                    },
                    {
                        class: 'as-form-editor-left-tab-bar-bottom-container',
                        child: {
                            tag: 'button',
                            child: 'span.mdi.mdi-settings-outline'
                        }
                    }
                ]
            },
            {
                class: 'as-form-editor-left-site-container',
                style: {
                    width: 'calc(' + this.config.leftSiteWidthPercent + "% - 3em)"
                },
                child: {
                    tag: 'frameview',
                    class: ['xp-tiny', 'as-form-editor-left-site'],
                    child: [
                        {
                            tag: 'tabframe',
                            class: ['as-form-left-tool-site-tab'],
                            attr: {
                                name: 'Explorer',
                                id: this.prefix + 'tab-explorer',
                            },
                            child: [
                                {
                                    class: 'as-form-tool-site-header',
                                    child: {
                                        tag: 'span',
                                        child: { text: 'EXPLORER' }
                                    }
                                },
                                this.projectExplorer.getView()
                            ]
                        },
                        {
                            tag: 'tabframe',
                            class: ['as-form-left-tool-site-tab', 'absol-bscroller'],
                            attr: {
                                name: 'Component',
                                id: this.prefix + 'tab-component',
                            },
                            child: [
                                {
                                    class: 'as-form-tool-site-header',
                                    child: {
                                        tag: 'span',
                                        child: { text: 'COMPONENTS' }
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'tabframe',
                            class: ['as-form-left-tool-site-tab'],
                            attr: {
                                name: 'Outline',
                                id: this.prefix + 'tab-outline',
                            },
                            child: [
                                {
                                    class: 'as-form-tool-site-header',
                                    child: {
                                        tag: 'span',
                                        child: { text: 'OUTLINE' }
                                    }
                                }
                            ]
                        },
                    ]
                }
            },
            {
                class: 'as-form-editor-empty-space',
                style: {
                    left: 'calc(' + this.config.leftSiteWidthPercent + "%)"
                },
                child: {
                    tag: 'frame-ico',
                    style: {
                        width: '10em',
                        height: '10em',
                        '-webkit-filter': 'grayscale(100%)',
                        filter: 'grayscale(100%)',
                        opacity: '0.2',
                        position: 'absolute',
                        right: '1em',
                        bottom: '1em'
                    }
                }
            },
            {
                class: 'as-form-editor-editor-space-container',
                style: {
                    left: 'calc(' + this.config.leftSiteWidthPercent + "%)",
                    visibility: 'hidden'
                },
                child: {
                    tag: 'tabview',
                    class: 'as-form-editor-main-tabview'
                }
            },

            {
                class: ['as-form-editor-resizer', 'vertical', 'left-site'],
                style: {
                    left: 'calc(' + this.config.leftSiteWidthPercent + "% - 0.2em)"
                }
            }
        ],
        on: {
            keydown: this.ev_keydown.bind(this)
        }
    });

    this.$quickToolBar = _({
        class: 'as-form-editor-quick-toolbar',
    });

    this.quickToolTabMenu = _({
        tag: 'button',
        child: 'span.mdi.mdi-dots-horizontal'
    }).addTo(this.$quickToolBar);

    QuickMenu.toggleWhenClick(this.quickToolTabMenu, {
        onSelect: function (item) {
            var cmd = item.cmd;
            if (cmd) {
                self.execCmd(cmd);
            }
        },
        getMenuProps: function () {
            return {
                extendStyle: {
                    'font-size': '14px'
                },
                items: [
                    { text: "Close All", icon: 'span.mdi.mdi-close-box-multiple-outline', cmd: 'closeAll' },
                    { text: "Close Saved", icon: 'span.mdi.mdi-progress-close', cmd: 'closeSaved' },
                    { text: "Save All and Close", icon: 'span.mdi.mdi-content-save-all-outline', cmd: 'saveAllNClose' }
                ]
            };
        }
    });

    this.$leftTabbar = $('.as-form-editor-left-tab-bar', this.$view);

    this.$mainTabview = $('.as-form-editor-main-tabview', this.$view);
    this.$mainTabview.appendChild(this.$quickToolBar);

    this.$exploreTabFrame = $('tabframe#' + this.prefix + 'tab-explorer', this.$view);
    this.$componentTabFrame = $('tabframe#' + this.prefix + 'tab-component', this.$view);
    this.$outlineTabFrame = $('tabframe#' + this.prefix + 'tab-outline', this.$view);

    this.$attachhook = _('attachook').addTo(this.$view).on('error', function () {
        Dom.addToResizeSystem(this);
        this.updateSize = this.updateSize || self.ev_resize.bind(this);
    });
    this.$leftSiteCtn = $('.as-form-editor-left-site-container', this.$view);
    this.$rightSiteCtn = $('.as-form-editor-right-site-container', this.$view);
    this.$editorSpaceCtn = $('.as-form-editor-editor-space-container', this.$view);
    this.$emptySpace = $('.as-form-editor-empty-space', this.$view);


    this.$leftSiteResizer = Draggable($('.as-form-editor-resizer.vertical.left-site', this.$view))
        .on('predrag', this.ev_preDragLeftResizer.bind(this))
        .on('enddrag', this.ev_endDragLeftResizer.bind(this))
        .on('drag', this.ev_dragLeftResizer.bind(this));



    this.$leftFrameView = $('frameview', this.$leftSiteCtn);
    this.$leftFrameView.activeFrameById(this.prefix + 'tab-component');


    this.$contextCaptor = _('contextcaptor').addTo(this.$view).attachTo(this.$view);
    this.toggleToolTab('tab-explorer');
    return this.$view;
};


FormEditor.prototype.ev_styleEditorChange = function (event) {
    // this.mLayoutEditor.autoExpandRootLayout();
    if (this._focusElement) this._focusElement.reMeasure();
    Dom.updateResizeSystem();
    if (event.name == 'vAlign' || event.name == 'hAlign')
        this.mLayoutEditor.updateAnchor();
    else
        this.mLayoutEditor.updateAnchorPosition();
    this.emit('change', Object.assign({ formEditor: this }, event), this);
};


FormEditor.prototype.setComponentProperty = function (name, value) {
    return this.component.setAttribute(name, value);
};


FormEditor.prototype.getComponentProperty = function (name) {
    return this.component.getAttribute(name);
};


FormEditor.prototype.ev_resize = function () {

};


FormEditor.prototype.setLeftSiteWidthPercent = function (value) {
    if (value > 8) {
        this.config.leftSiteWidthPercent = value;
        this.saveConfig();
        if (this.$view) {
            this.$leftSiteCtn.addStyle('width', 'calc(' + this.config.leftSiteWidthPercent + "% - 3em)");
            this.$editorSpaceCtn.addStyle('left', this.config.leftSiteWidthPercent + '%');
            this.$emptySpace.addStyle('left', this.config.leftSiteWidthPercent + '%');

            if (this._dragLeftMovingData) {
                this.$leftSiteResizer.addStyle({
                    left: 'calc(' + this.config.leftSiteWidthPercent + '% - 8em)'
                });
            }
            else
                this.$leftSiteResizer.addStyle('left', 'calc(' + this.config.leftSiteWidthPercent + "% - 0.1em)");
        }
    }
};


FormEditor.prototype.ev_preDragLeftResizer = function (event) {
    this.$leftSiteResizer.addStyle({
        width: '19em',
        left: 'calc(' + this.config.leftSiteWidthPercent + '% - 8em)'
    });

    this._dragLeftMovingData = {
        widthPercent: this.config.leftSiteWidthPercent,
        fontSize: this.$view.getFontSize(),
        bound: this.$view.getBoundingClientRect()
    };
};

FormEditor.prototype.ev_endDragLeftResizer = function (event) {
    this._dragLeftMovingData = undefined;
    delete this._dragLeftMovingData;
    this.setLeftSiteWidthPercent(this.config.leftSiteWidthPercent);
    this.$leftSiteResizer.removeStyle('width');
    this.saveConfig();
};

FormEditor.prototype.ev_dragLeftResizer = function (event) {
    this.setLeftSiteWidthPercent(this._dragLeftMovingData.widthPercent + event.moveDX / this._dragLeftMovingData.bound.width * 100);
    Dom.updateResizeSystem();
};





FormEditor.prototype.ev_keydown = function (event) {

};

FormEditor.prototype.ev_layoutEditorChange = function () {

};


FormEditor.prototype.toggleToolTab = function (ident) {
    if (this._lastToolTabIdent != ident) {
        this.$leftFrameView.activeFrameById(this.prefix + ident);
        $('button', this.$leftTabbar, function (button) {
            if (button.id && button.id.indexOf(ident) >= 0) {
                button.addClass('active');
            }
            else {
                button.removeClass('active');
            }
        });
        this.$leftSiteResizer.removeStyle('display');
        if (!this._lastToolTabIdent) {
            this.$leftSiteCtn.removeStyle('visibility');
            this.$leftSiteCtn.addStyle('width', 'calc(' + this.config.leftSiteWidthPercent + "% - 3em)");
            this.$editorSpaceCtn.addStyle('left', this.config.leftSiteWidthPercent + '%');
            this.$emptySpace.addStyle('left', this.config.leftSiteWidthPercent + '%');
            window.dispatchEvent(new Event('resize'));
        }
        this._lastToolTabIdent = ident;
    }
    else {
        this._lastToolTabIdent = null;
        this.$leftFrameView.activeFrame(null);
        $('button', this.$leftTabbar, function (button) {
            button.removeClass('active');
        });
        this.$leftSiteResizer.addStyle('display', 'none');
        this.$leftSiteCtn.addStyle('visibility', 'hidden');
        this.$editorSpaceCtn.addStyle('left', '3em');
        this.$emptySpace.addStyle('left', '3em');
        window.dispatchEvent(new Event('resize'));
    }
};



export default FormEditor; 