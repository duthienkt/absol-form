import Assembler from '../core/Assembler';
import Dom from 'absol/src/HTML5/Dom';

import Fcore from '../core/FCore';
import '../dom/HLine';
import '../dom/VLine';
import R from '../R';
import PluginManager from '../core/PluginManager';
import BaseEditor from '../core/BaseEditor';
import UndoHistory from './UndoHistory';
import ComponentPropertiesEditor from './ComponentPropertiesEditor';
import ComponentOutline from './ComponentOutline';
import FormPreview from './FormPreview';
import LayoutEditorCMD, { LayoutEditorCmdDescriptors } from '../cmds/LayoutEditorCmd';

var _ = Fcore._;
var $ = Fcore.$;

function LayoutEditor() {
    BaseEditor.call(this);
    Assembler.call(this);
    this.cmdRunner.assign(LayoutEditorCMD);
    var self = this;
    this.rootLayout = null;
    this.snapshots = [];
    this.snapshotsIndex = 0;
    this._changeCommited = true;
    this.setContext(R.LAYOUT_EDITOR, this);


    /**
     * @type {Array<import('../anchoreditors/AnchorEditor')>}
     */
    this.anchorEditors = [];
    this.undoHistory = new UndoHistory()
        .on('checkout', function (event) {
            self.applyData(event.item.data);
            self.updateAnchor();
            // self.mComponentOutline.updateComponetTree();
        });
    this.setContext(R.UNDO_HISTORY, this.undoHistory);// because it had it's ContextManager

    this.componentOtline = new ComponentOutline();
    this.setContext(R.COMPONENT_OUTLINE, this.componentOtline);


    this.componentPropertiesEditor = new ComponentPropertiesEditor()
        .on({
            change: function (event) {
                self.updateAnchorPosition();
                Dom.updateResizeSystem();
                if (event.name == 'vAlign' || event.name == 'hAlign') {
                    self.updateAnchor();
                }
                this.component.reMeasure();
            },
            stopchange: function (event) {
                self.commitHistory('edit', event.object.getAttribute('name') + '.' + event.name + '');
            }
        });
}


Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(Assembler.prototype));


LayoutEditor.prototype.constructor = LayoutEditor;


LayoutEditor.prototype.onAttached = function () {
    this.componentPropertiesEditor.attach(this);
    this.undoHistory.attach(this);
    this.componentOtline.attach(this);
    this.LayoutEditorCMDTool = this.getContext(R.COMPONENT_EDIT_TOOL);
    if (this.LayoutEditorCMDTool)
        this.LayoutEditorCMDTool.start();
};


LayoutEditor.prototype.onStart = function () {
    this.undoHistory.start();
    this.componentPropertiesEditor.start();
    this.componentOtline.start();
};


LayoutEditor.prototype.onResume = function () {
    /**
     * @type {import('./UndoHistory').default}
     */
    this.undoHistory.resume();
    this.componentPropertiesEditor.resume();
    this.componentOtline.resume();
    /**
     * @type {import('../fragment/LayoutEditorCMDTool'.default)}
     */
    this.LayoutEditorCMDTool = this.getContext(R.COMPONENT_EDIT_TOOL);
    console.log(this.LayoutEditorCMDTool);


    if (this.LayoutEditorCMDTool) {
        this.LayoutEditorCMDTool.bindWithLayoutEditor(this);
        this.LayoutEditorCMDTool.start();
    }


};


LayoutEditor.prototype.onPause = function () {
    // release undoHistory
    this.undoHistory.pause();
    this.componentPropertiesEditor.pause();
    this.componentOtline.pause();

    if (this.LayoutEditorCMDTool) {
        this.LayoutEditorCMDTool.pause();
        this.LayoutEditorCMDTool.bindWithLayoutEditor(undefined);
    }
};

LayoutEditor.prototype.onStop = function () {
    this.undoHistory.stop();
    this.componentPropertiesEditor.stop();
    this.componentOtline.stop();
};

LayoutEditor.prototype.onDestroy = function () {
    this.undoHistory.destroy();
    this.componentPropertiesEditor.destroy();
    this.componentOtline.destroy();
};

/**
 * call whenever component is edited, event will not be fired if disable publicDataChange flag
 */
LayoutEditor.prototype.notifyDataChange = function () {
    if (this._publicDataChange)
        this.emit('change', { type: 'change', target: this }, this);
};


LayoutEditor.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    this.$view = _({
        class: ['as-layout-editor'],
        child: [
            {
                class: 'as-layout-editor-vrule-container',
                child: 'vruler'
            },
            {
                class: 'as-layout-editor-hrule-container',
                child: 'hruler'
            },
            {
                class: 'as-layout-editor-background-container'
            },
            {
                class: ["as-layout-editor-space-container", 'absol-bscroller'],
                child: {
                    class: 'as-layout-editor-space',
                    child: [
                        {
                            class: 'as-layout-editor-layout-container'
                        },
                        {
                            class: 'as-layout-editor-forceground-container',
                            child: '.as-layout-editor-forceground',
                            extendEvent: 'contextmenu',
                            on: {
                                contextmenu: this.ev_contextMenuLayout.bind(this)
                            }
                        }
                    ]
                }
            }
        ]
    });


    var self = this;
    this.$attachHook = _('attachhook').on('error', function () {
        this.updateSize = self.updateSize.bind(self);
        Dom.addToResizeSystem(this);
        self.updateSize();
    }).addTo(this.$view);

    this.$hruler = $('hruler', this.$view);
    this.$hruler.measureElement($('.as-relative-layout', this.$view));
    this.$spaceCtn = $('.as-layout-editor-space-container', this.$view)
        .on('scroll', this.ev_layoutCtnScroll.bind(this));

    this.$vruler = $('vruler', this.$view);
    this.$vruler.measureElement($('.as-relative-layout', this.$view));

    this.$layoutCtn = $('.as-layout-editor-layout-container', this.$view);


    this.$forceground = $('.as-layout-editor-forceground', this.$view)
        .on('click', this.ev_clickForceground.bind(this));

    this.$editorSpaceCtn = $('.as-layout-editor-space-container', this.$view)
        .on('click', function (ev) {
            if (ev.target == this) {
                self.setActiveComponent();
            }
        });
    return this.$view;
};

LayoutEditor.prototype.ev_clickPreviewBtn = function (button, event) {
    var next = {
        'interact': 'design',
        'design': 'interact'
    };
    var buttonTitle = {
        'interact': 'Interact Mode',
        'design': 'Design Mode'
    }
    this.setMode(next[this.mode]);
    this.$previewBtn.attr('title', buttonTitle[this.mode]);
};

LayoutEditor.prototype.ev_layoutCtnScroll = function () {
    this.updateRuler();
};


LayoutEditor.prototype.ev_clickForceground = function (event) {
    if (event.target != this.$forceground) return;
    var hitComponent;
    var self = this;
    function visit(node) {
        var bound = node.view.getBoundingClientRect();
        if (bound.left <= event.clientX && bound.right >= event.clientX
            && bound.top <= event.clientY && bound.bottom >= event.clientY) {
            hitComponent = node;
        }
        if (node.children && (!node.attributes.formType || node == self.rootLayout))
            node.children.forEach(visit);
    }
    visit(this.rootLayout, true);

    if (hitComponent) {
        if (event.shiftKey)
            this.toggleActiveComponent(hitComponent);
        else this.setActiveComponent(hitComponent);
    }
};




LayoutEditor.prototype.ev_contextMenuLayout = function (event) {
    var self = this;
    if (event.target == this.$forceground) {
        event.showContextMenu({
            // play-box-outline
            items: [
                {
                    text: 'Preview',
                    icon: 'span.mdi.mdi-pencil-box-multiple-outline',
                    cmd: 'preview'
                }
            ],
            extendStyle: {
                fontSize: '12px'
            }
        }, function (menuEvent) {
            var cmd = menuEvent.menuItem.cmd;
            self.runCmd(cmd);
        });
    }
};

LayoutEditor.prototype.updateRuler = function () {
    this.$vruler.update();
    this.$hruler.update();
};

LayoutEditor.prototype.updateAnchor = function () {
    for (var i = 0; i < this.anchorEditors.length; ++i) {
        this.anchorEditors[i].update();
    }
};


LayoutEditor.prototype.updateAnchorPosition = function () {
    for (var i = 0; i < this.anchorEditors.length; ++i) {
        this.anchorEditors[i].updatePosition();
    }
};

LayoutEditor.prototype.findComponentsByName = function (name, from) {
    from = from || this.rootLayout;
    if (!from) return;
    var res = undefined;
    if (from.name == name) {
        return from;
    }
    var self = this;
    if (from.children)
        res = from.children.reduce(function (ac, child) {
            var found = self.findAnchorEditorByComponent();
            if (found) return ac.concat(found);
            return ac;
        }, []);
    if (res.length > 0) return res;
    return undefined;
};



LayoutEditor.prototype.updateSize = function () {
    //todo
};



LayoutEditor.prototype._newAnchorEditor = function (component) {
    var self = this;
    var AnchorEditor = this.findNearestLayoutParent(component.parent || this.rootLayout).getAnchorEditorConstructor();
    //craete new, repeat event to other active anchor editor
    var editor = new AnchorEditor(this).on('click', function (event) {
        if (this.component)
            if (self.anchorEditors.length > 1)
                self.toggleActiveComponent(this.component);
            else {
                self.setActiveComponent(this.component);
            }
    })//todo: implement in AnchorEditor
        .on('beginmove', function (event) {
            var repeatEvent = event.repeatEvent;
            var other;
            for (var i = 0; i < self.anchorEditors.length; ++i) {
                other = self.anchorEditors[i];
                if (other != this) {
                    other.ev_beginMove(false, repeatEvent);
                }
            }
        })
        .on('moving', function (event) {

            var repeatEvent = event.repeatEvent;
            var other;
            for (var i = 0; i < self.anchorEditors.length; ++i) {
                other = self.anchorEditors[i];
                if (other != this) {
                    other.ev_moving(false, repeatEvent);
                }
            }
            self.notifyDataChange();
            self.componentPropertiesEditor.styleEditor.notifyChangeToProperties();
        })
        .on('endmove', function (event) {
            var originEvent = event.originEvent;
            var other;
            for (var i = 0; i < self.anchorEditors.length; ++i) {
                other = self.anchorEditors[i];
                if (other != this) {
                    other.ev_endMove(false, originEvent);
                }
            }
            self.commitHistory('move', 'Move/Resize component');
        })
        .on('focus', function (event) {
            self.componentPropertiesEditor.edit(this.component);
            self.emit('focuscomponent', { type: 'focuscomponent', component: this.component, originEvent: event, target: self }, self);
        })
        .on('change', function (event) {
            self.notifyDataChange();
        });
    editor.edit(component)
    return editor;
};

/**
 * @argument {Array<import('../core/BaseComponent').default>}
 */
LayoutEditor.prototype.setActiveComponent = function () {
    //todo
    while (this.anchorEditors.length > 0) {
        var editor = this.anchorEditors.pop();
        editor.edit(undefined);
    }

    while (this.anchorEditors.length < arguments.length) {
        var editor = this._newAnchorEditor(arguments[this.anchorEditors.length]);
        this.anchorEditors.push(editor);
        editor.focus();
    }
    this.componentOtline.updateComponentStatus();
    this.emit('selectedcomponentchange', { target: this, type: 'selectedcomponentchange' }, this);
};


/**
 * @argument {Array<import('../core/BaseComponent').default>}
 */
LayoutEditor.prototype.toggleActiveComponent = function () {
    //todo
    var editor;
    var focusEditor = undefined;
    for (var i = 0; i < arguments.length; ++i) {
        editor = this.findAnchorEditorByComponent(arguments[i]);
        if (editor) {
            editor.edit(undefined);
        }
        else {
            editor = this._newAnchorEditor(arguments[i]);
            this.anchorEditors.push(editor);
            focusEditor = editor;
        }
    }

    this.anchorEditors = this.anchorEditors.filter(function (e) {
        return !!e.component;
    });

    if (this.anchorEditors.length > 0) {
        focusEditor = this.anchorEditors[this.anchorEditors.length - 1];
    }
    if (focusEditor) focusEditor.focus();
    this.componentOtline.updateComponentStatus();
    this.emit('selectedcomponentchange', { target: this, type: 'selectedcomponentchange' }, this);
};


LayoutEditor.prototype.findAnchorEditorByComponent = function (comp) {
    for (var i = 0; i < this.anchorEditors.length; ++i) {
        if (this.anchorEditors[i].component == comp) return this.anchorEditors[i];
    }
    return undefined;
};


LayoutEditor.prototype.findFocusAnchorEditor = function () {
    var focusEditor = this.anchorEditors.filter(function (e) { return e.isFocus });
    return focusEditor[0];
};


LayoutEditor.prototype.getActivatedComponents = function () {
    return this.anchorEditors.map(function (e) {
        return e.component;
    }).filter(function (e) { return !!e });
};


LayoutEditor.prototype.applyData = function (data) {
    var self = this;
    this.rootLayout = this.build(data);
    this.$layoutCtn.clearChild().addChild(this.rootLayout.view);
    this.rootLayout.onAttached(this);
    this.$vruler.measureElement(this.rootLayout.view);
    this.$hruler.measureElement(this.rootLayout.view);
    this.componentOtline.updateComponetTree();
    this.emit('change', { type: 'change', target: this, data: data }, this);
};


LayoutEditor.prototype.setData = function (data) {
    this.applyData(data);
    this.commitHistory('set-data', "Set data");
};


LayoutEditor.prototype.autoExpandRootLayout = function () {
    if (this.rootLayout) {
        var minSize = this.rootLayout.measureMinSize();
        var isChange = false;
        if (minSize.width > this.rootLayout.style.width) { this.rootLayout.setStyle('width', minSize.width); isChange = true; }
        if (minSize.height > this.rootLayout.style.height) { this.rootLayout.setStyle('height', minSize.height); isChange = true; }
        if (isChange) {
            this.emit('layoutexpand', { type: 'layoutexpand', target: this, layout: this.rootLayout }, this);
            this.notifyDataChange();
        }
    }
};



LayoutEditor.prototype.getData = function () {
    if (this.rootLayout) return this.rootLayout.getData();
    return null;
};

LayoutEditor.prototype.getComponentTool = function () {
    return this.getContext(R.COMPONENT_PICKER);;
};

LayoutEditor.prototype.getOutlineTool = function () {
    return this.getContext(R.COMPONENT_OUTLINE);
};

LayoutEditor.prototype.getCmdNames = function () {
    return Object.keys(LayoutEditorCMD);
};

LayoutEditor.prototype.getCmdDescriptor = function (name) {
    var res = Object.assign({
        type: 'trigger',
        desc: 'command: ' + name,
        icon: 'span.mdi.mdi-apple-keyboard-command'
    }, LayoutEditorCmdDescriptors[name])
    if ((name.startsWith('align') || name.startsWith('equalise')) && this.anchorEditors.length < 2) {
        res.disabled = true;
    }

    if (name.startsWith('distribute') && this.anchorEditors.length < 3) {
        res.disabled = true;
    }

    if (name.match(/^(delete|copy|cut)/) && this.anchorEditors.length < 1) {
        res.disabled = true;
    }

    return res;
};



LayoutEditor.prototype.getCmdGroupTree = function () {
    return [
        [
            [
                'alignLeftDedge',
                'alignHorizontalCenter',
                'alignRightDedge',
                'equaliseWidth'
            ],
            [
                'alignTopDedge',
                'alignVerticalCenter',
                'alignBottomDedge',
                'equaliseHeight'
            ]
        ],
        [
            [
                'distributeHorizontalLeft',
                'distributeHorizontalCenter',
                'distributeHorizontalRight',
                'distributeHorizontalDistance'
            ],
            [
                'distributeVerticalTop',
                'distributeVerticalCenter',
                'distributeVerticalBottom',
                'distributeVerticalDistance'
            ]
        ],
        [
            [
                'preview'
            ],
            [
                'cut',
                'copy',
                'paste',
                'delete'
            ]

        ]
    ];
};


LayoutEditor.prototype.loadEditableView = function () {
    this.applyData(this.mUndoHistory.items[this.mUndoHistory.items.length].data);
};

LayoutEditor.prototype.findNearestLayoutParent = function (comp) {
    while (comp) {
        if (comp.addChildByPosition) {
            break;
        }
        comp = comp.parent;
    }
    return comp;
};

/**
 * @returns {import('../core/BaseComponent') }
 */
LayoutEditor.prototype.addNewComponent = function (contructor, posX, posY) {
    var self = this;
    var layout;
    if (this.anchorEditors.length > 0) {
        layout = this.findNearestLayoutParent(this.anchorEditors[this.anchorEditors.length - 1].component);
    }
    layout = layout || this.rootLayout;
    var rootBound = this.rootLayout.view.getBoundingClientRect();
    var layoutBound = layout.view.getBoundingClientRect();
    var context = {
        posX: posX - (layoutBound.left - rootBound.left),
        posY: posY - (layoutBound.top - rootBound.top),
        layout: layout,
        layoutBound: layoutBound,
        rootBound: rootBound,
        selt: this,
        constructor: contructor,
        assembler: this,
        descript: 'You can set result by your own component. After plugin was called, if result still null, the editor will build the element by tag',
        preventDefault: function () {
            this.prevented = true;
        },
        prevented: false,
        addedComponets: [],

        addComponent: function (newComponent, x, y) {
            this.addedComponets.push(newComponent);
            layout.addChildByPosition(newComponent, x, y);
            newComponent.reMeasure();
        }
    };

    PluginManager.exec(this, R.PLUGINS.DROP_TO_LAYOUT_EDITOR, context);

    if (!context.prevented) {
        context.addComponent(this.build({ tag: contructor.prototype.tag }), context.posX, context.posY);
    }

    this.emit('addcomponent', { type: 'addcomponent', components: context.addedComponets, target: this }, this);
    this.setActiveComponent.apply(this, context.addedComponets);
    this.notifyDataChange();
    setTimeout(this.updateAnchorPosition.bind(this), 1);
    this.componentOtline.updateComponetTree();

    this.commitHistory('add', "Add " + context.addedComponets.map(function (comp) { return comp.getAttribute('name') }).join(', '));
};


LayoutEditor.prototype.clearRootLayout = function () {
    this._activatedComponent = undefined;
    this.rootLayout.clearChild();
    this.updateAnchor();
    this.emit('clearallcomponent', { target: this }, this);
    this.notifyDataChange();
    this.componentOtline.updateComponetTree();
    this.commitHistory('remove', 'Remove all components');
};


LayoutEditor.prototype.removeComponent = function () {
    var removedComponents = [];
    var comp;
    for (var i = 0; i < arguments.length; ++i) {
        comp = arguments[i];
        comp.remove();
        removedComponents.push(comp);
        var anchorEditor = this.findAnchorEditorByComponent(comp);
        if (anchorEditor) {
            this.toggleActiveComponent(comp);
        }
        if (comp == this.componentPropertiesEditor.component) this.componentPropertiesEditor.edit(undefined);
        this.emit('removecomponent', { type: 'removecomponent', target: this, component: comp }, this);
    }
    this.notifyDataChange();

    if (removedComponents.length > 0) {
        this.componentOtline.updateComponetTree();
        this.commitHistory('remove', 'Remove ' + removedComponents.map(function (c) {
            return c.getAttribute('name');
        }).join(', '));
    }
};


LayoutEditor.prototype.moveUpComponent = function (comp) {
    var parent = comp.parent;
    if (!parent) return;
    var prevChild = parent.findChildBefore(comp);
    if (!prevChild) return;
    comp.remove();
    parent.addChildBefore(comp, prevChild);
    this.emit('moveupcomponent', { type: 'moveupcomponent', target: this, component: comp }, this);
    this.notifyDataChange();
    this.componentOtline.updateComponetTree();
    this.commitHistory('move-order', 'Move ' + comp.getAttribute('name') + ' up');
};


LayoutEditor.prototype.moveDownComponent = function (comp) {
    var parent = comp.parent;
    if (!parent) return;
    var nextChild = parent.findChildAfter(comp);
    if (!nextChild) return;
    nextChild.remove();
    parent.addChildBefore(nextChild, comp);
    this.emit('movedowncomponent', { type: 'movedowncomponent', target: this, component: comp }, this);
    this.notifyDataChange();
    this.componentOtline.updateComponetTree();
    this.commitHistory('move-order', 'Move ' + comp.getAttribute('name') + ' down');

};


LayoutEditor.prototype.moveToBottomComponent = function (comp) {
    var parent = comp.parent;
    if (!parent) return;
    var lastChild = parent.children[parent.children - 1];
    if (lastChild == comp) return;
    comp.remove();
    parent.addChild(comp);
    this.emit('movetobottomcomponent', { type: 'movetobottomcomponent', target: this, component: comp }, this);
    this.notifyDataChange();
    this.componentOtline.updateComponetTree();
    this.commitHistory('move-order', 'Move ' + comp.getAttribute('name') + ' to bottom');
};


LayoutEditor.prototype.moveToTopComponent = function (comp) {
    var parent = comp.parent;
    if (!parent) return;
    var firstChild = parent.children[0];
    if (firstChild == comp) return;
    comp.remove();
    parent.addChildBefore(comp, firstChild);
    this.emit('movetotopcomponent', { type: 'movetotopcomponent', target: this, component: comp }, this);
    this.notifyDataChange();
    this.componentOtline.updateComponetTree();
    this.commitHistory('move-order', 'Move ' + comp.getAttribute('name') + ' to top');
};



LayoutEditor.prototype.commitHistory = function (type, description) {
    if (!this.undoHistory) return;
    this.undoHistory.commit(type, this.getData(), description, new Date());
};


LayoutEditor.prototype.preview = function () {
    if (!this.rootLayout) return;
    /**
     * @type {import('./FormEditor').default}
     */
    var formEditor = this.getContext(R.FORM_EDITOR);
    if (!formEditor) return;
    var tabHolder = formEditor.getEditorHolderByEditor(this);
    var currentTabIdent = tabHolder.ident;
    var previewTabIdent = currentTabIdent + '_preview';
    var previewEditor;
    var previewTabHolder = formEditor.getEditorHolderByIdent(previewTabIdent);
    if (previewTabHolder)
        previewEditor = previewTabHolder.editor;

    if (!previewEditor) {
        previewEditor = new FormPreview();
        previewEditor.attach(this);
        var name = tabHolder.name + ('(Preview)');
        var desc = tabHolder.desc;
        formEditor.openEditorTab(previewTabIdent, name, desc, previewEditor, { layoutEditor: this })
    }
    else {
        previewTabHolder.tabframe.requestActive();
    }

    var data = this.getData();
    previewEditor.setData(data);
};

export default LayoutEditor;

