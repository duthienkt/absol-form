import Context from 'absol/src/AppPattern/Context';

import Draggable from 'absol-acomp/js/Draggable';

import '../../css/formeditor.css';
import Fcore from '../core/FCore';
import LayoutEditor from './LayoutEditor';
import Dom from 'absol/src/HTML5/Dom';
import EventEmitter from 'absol/src/HTML5/EventEmitter';

import ComponentPicker from './ComponentPicker';
import ContextManager from 'absol/src/AppPattern/ContextManager';
import R from '../R';
import AttributeEditor from './AttributeEditor';
import StyleEditor from './StyleEditor';
import AllPropertyEditor from './AllPropertyEditor';
import FormPreview from './FormPreview';
import { randomIdent } from 'absol/src/String/stringGenerate';
import QuickMenu from 'absol-acomp/js/QuickMenu';
import ProjectExplorer from '../fragment/ProjectExplorer';
import PluginManager from '../core/PluginManager';
import BaseEditor from '../core/BaseEditor';
import ComponentEditTool from '../fragment/ComonentEditTool';
import CodeEditor from './CodeEditor';

var _ = Fcore._;
var $ = Fcore.$;

function FormEditor() {
    BaseEditor.call(this);
    this.prefix = randomIdent(16) + "_";
    this.ctxMng.set(R.FORM_EDITOR, this);
    var self = this;
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
    this.mAttributeEditor = new AttributeEditor();
    this.mComponentEditTool = new ComponentEditTool();

    this.mStyleEditor = new StyleEditor()
        .on('change', this.ev_styleEditorChange.bind(this))
        .on('stopchange', function (event) {
            self.commitHistory('edit', event.object.getAttribute('name') + '.' + event.name + '')
        }
        );

    this.mAllPropertyEditor = new AllPropertyEditor().on('stopchange', function (event) {
        self.commitHistory('edit', event.object.getAttribute('name') + '.' + event.name + '')
    }
    );
    this.mAllPropertyEditor.on('change', function (event) {
        self.mLayoutEditor.autoExpandRootLayout();
        if (self._focusElement) self._focusElement.reMeasure();
        if (event.name == 'vAlign' || event.name == 'hAlign')
            self.mLayoutEditor.updateAnchor();
        else
            self.mLayoutEditor.updateAnchorPosition();
        self.mStyleEditor.notifyChange();
        self.mAttributeEditor.notifyChange();
        self.emit('change', Object.assign({ formEditor: this }, event), self);
        Dom.updateResizeSystem();
    }).on('stopchange', function (event) {
        self.commitHistory('edit', event.object.getAttribute('name') + '.' + event.name + '')
    }
    );
    this.ctxMng.set(R.LAYOUT_EDITOR, this.mLayoutEditor);
    this.ctxMng.set(R.COMPONENT_PICKER, this.mComponentPicker);
    this.ctxMng.set(R.UNDO_HISTORY, this.mUndoHistory);
    this.ctxMng.set(R.COMPONENT_EDIT_TOOL, this.mComponentEditTool);
    this.mComponentPicker.attach(this);// share, but not run
    this.mFormPreview.attach(this);
    this.projectExplorer.attach(this);
}

Object.defineProperties(FormEditor.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
FormEditor.prototype.constructor = FormEditor;

FormEditor.prototype.CONFIG_STORE_KEY = "AS_FormEditor_config";

FormEditor.prototype.SUPPORT_EDITOR = {
    form: LayoutEditor
};

Object.keys(CodeEditor.prototype.TYPE_MODE).forEach(function(typeName){
    FormEditor.prototype.SUPPORT_EDITOR [typeName] = CodeEditor;
})

FormEditor.prototype.onStart = function () {
    this.projectExplorer.start();
};


FormEditor.prototype.onStop = function () {
    this.projectExplorer.stop();
};


FormEditor.prototype.onPause = function () {
    this.projectExplorer.pause();


};


FormEditor.prototype.onResume = function () {
    this.projectExplorer.resume();

};


FormEditor.prototype.config = {
    leftSiteWidthPercent: 15
};


FormEditor.prototype.openProject = function (name) {
    this.projectExplorer.openProject(name)
}


FormEditor.prototype.openItem = function (type, ident, name, contentArguments, desc) {
    
    var self = this;
    if (this.editorHolders[ident]) {
        this.editorHolders[ident].tabframe.requestActive();
    }
    else {
        if (this.SUPPORT_EDITOR[type]) {
            var editor = new this.SUPPORT_EDITOR[type];
            editor.attach(this);
            var componentTool = editor.getComponentTool();
            var outlineTool = editor.getOutlineTool();
            var tabframe = _({
                tag: 'tabframe',
                attr: {
                    name: name,
                    desc: desc
                },
                child: editor.getView(),

            });
            var accumulator = {
                tabframe: tabframe,
                type: type,
                ident: ident,
                name: name,
                contentArguments: contentArguments,
                desc: desc,
                editor: editor,
                formEditor: this,
                componentTool: componentTool,
                outlineTool: outlineTool
            };
            this.editorHolders[ident] = accumulator;

            this.$editorSpaceCtn.removeStyle('visibility');
            PluginManager.exec(this, R.PLUGINS.LOAD_CONTENT_DATA, accumulator)
            tabframe.on({
                deactive: function () {
                    editor.pause();
                    if (self.activeEditorHolder == accumulator)
                        self.activeEditorHolder = null;
                    if (componentTool)
                        componentTool.getView().remove();
                    if (outlineTool)
                        outlineTool.getView().remove();
                    if (componentTool == self.mComponentPicker) self.mComponentPicker.bindWithLayoutEditor(undefined);

                },
                active: function () {
                    editor.start();
                    self.activeEditorHolder = accumulator;
                    if (componentTool)
                        componentTool.getView().addTo(self.$componentTabFrame);
                    if (outlineTool)
                        outlineTool.getView().addTo(self.$outlineTabFrame);
                    if (componentTool == self.mComponentPicker) self.mComponentPicker.bindWithLayoutEditor(editor);
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
            // editor.start();
        }
        else {
            throw new Error("The editor not supprt " + type + ' type!');
        }
    }

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
                            click: this.showToolTab.bind(this, 'tab-explorer')
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
                            click: this.showToolTab.bind(this, 'tab-component')
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
                            click: this.showToolTab.bind(this, 'tab-outline')
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
                            class: ['as-form-left-tool-site-tab'],
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
                    left: 'calc(' + this.config.leftSiteWidthPercent + "% - 0.2em)"
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
                    left: 'calc(' + this.config.leftSiteWidthPercent + "% - 0.2em)",
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
            },
            // '.as-form-editor-resizer.vertical.right-site'

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
            console.log(item.text);

        },
        getMenuProps: function () {
            return {
                extendStyle: {
                    'font-size': '14px'
                },
                items: [
                    { text: "Close All", icon: 'span.mdi.mdi-close-box-multiple-outline' },
                    { text: "Close Saved", icon: 'span.mdi.mdi-progress-close' }
                ]
            }
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
    this.showToolTab('tab-explorer');
    return this.$view;
};




FormEditor.prototype.ev_addComponent = function () {
    this.mComponentOutline.updateComponetTree();
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
}

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



// FormEditor.prototype.ev_preDragRightResizer = function (event) {
//     this.$rightSiteResizer.addStyle({
//         width: '100px',
//         right: 'calc(' + this.style.rightSizeWidth + 'em - 50px)'
//     });

//     this._dragRightMovingDate = {
//         width: this.style.rightSizeWidth,
//         fontSize: this.$view.getFontSize(),
//         bound: this.$view.getBoundingClientRect()
//     };
// };

// FormEditor.prototype.ev_endDragRightResizer = function (event) {
//     this.$rightSiteResizer.addStyle({
//         right: 'calc(' + this.style.rightSizeWidth + 'em - 0.2em)'
//     }).removeStyle('width');
//     this._dragRightMovingDate = undefined;
//     delete this._dragRightMovingDate;
// };

// FormEditor.prototype.ev_dragRightResizer = function (event) {
//     var dxEm = event.moveDXem;
//     var newWidth = this._dragRightMovingDate.width - dxEm;
//     this.$rightSiteResizer.addStyle({
//         width: '100px',
//         right: 'calc(' + newWidth + 'em - 50px)'
//     });

//     this.style.rightSizeWidth = Math.max(this.style.rightSizeMinWidth, Math.min(this._dragRightMovingDate.bound.width / 3 / this._dragRightMovingDate.fontSize, newWidth));
//     this.$rightSiteCtn.addStyle('width', this.style.rightSizeWidth + 'em');
//     this.$editorSpaceCtn.addStyle('right', this.style.rightSizeWidth + 0.2 + 'em');
//     window.dispatchEvent(new Event('resize'));
// };



FormEditor.prototype.ev_keydown = function (event) {
    this._lastKeydownTime = this._lastKeydownTime || 0;
    var now = new Date().getTime();
    if (now - this._lastKeydownTime > 100) {
        if (event.ctrlKey && event.key == 'z') {
            this._lastKeydownTime = now;
            this.mUndoHistory.undo();
        }
        else if (event.ctrlKey && event.key == 'y') {
            this._lastKeydownTime = now;
            this.mUndoHistory.redo();
        }
    }
};

FormEditor.prototype.ev_layoutEditorChange = function () {

};


FormEditor.prototype.showToolTab = function (ident) {
    this.$leftFrameView.activeFrameById(this.prefix + ident);
    $('button', this.$leftTabbar, function (button) {
        if (button.id && button.id.indexOf(ident) >= 0) {
            button.addClass('active');
        }
        else {
            button.removeClass('active');
        }
    });
};

FormEditor.prototype.setData = function (data) {
    return
    this.mLayoutEditor.setData(data);
    this.mComponentOutline.updateComponetTree();
};


FormEditor.prototype.getData = function () {
    return
    return this.mLayoutEditor.getData();
};


FormEditor.prototype.commitHistory = function (type, description) {
    this.mUndoHistory.commit(type, this.getData(), description, new Date());
};


FormEditor.prototype.addComponent = function (data) {
    if (this.mLayoutEditor.rootLayout) {
        var newComponent = this.mLayoutEditor.build(data);
        this.mLayoutEditor.rootLayout.addChild(newComponent);
        this.mLayoutEditor.activeComponent(newComponent);
        this.commitHistory('add', 'Add' + newComponent.tag);
    }
};

FormEditor.prototype.notifyAllChange = function () {
    this.mStyleEditor.notifyChange();
    this.mAttributeEditor.notifyChange();
    this.mAllPropertyEditor.notifyChange();
    this.emit('change', Object.assign({}, { formEditor: this }), this);
}

FormEditor.prototype.notifyStyleChange = function () {
    this.mStyleEditor.notifyChange();
    this.emit('change', Object.assign({}, { formEditor: this }), this);

};

FormEditor.prototype.notifyAttributeChange = function () {
    this.emit('change', Object.assign({}, { formEditor: this }), this);
};


export default FormEditor; 