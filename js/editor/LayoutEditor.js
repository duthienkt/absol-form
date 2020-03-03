import Assembler from '../core/Assembler';
import Dom from 'absol/src/HTML5/Dom';

import Fcore from '../core/FCore';
import '../dom/HLine';
import '../dom/VLine';
import R from '../R';
import BaseEditor from '../core/BaseEditor';
import UndoHistory from './UndoHistory';
import ComponentPropertiesEditor from './ComponentPropertiesEditor';
import ComponentOutline from './ComponentOutline';
import LayoutEditorCMD, { LayoutEditorCmdDescriptors, LayoutEditorCmdTree } from '../cmds/LayoutEditorCmd';
import ClipboardManager from '../ClipboardManager';
import EventEmitter from 'absol/src/HTML5/EventEmitter';
import Rectangle from 'absol/src/Math/Rectangle';
import RelativeAnchorEditor from '../anchoreditors/RelativeAnchorEditor';

var _ = Fcore._;
var $ = Fcore.$;

function LayoutEditor() {
    BaseEditor.call(this);
    Assembler.call(this);
    this._softScale = 1;
    var self = this;
    this.rootLayout = null;
    this.editingLayout = null;
    this.snapshots = [];
    this.snapshotsIndex = 0;
    this.lastCommitData = {
        editing: null,
        data: null,
        selected: []
    };
    this._changeCommited = true;
    this.setContext(R.LAYOUT_EDITOR, this);
    this.setContext(R.HAS_CMD_EDITOR, this);

    this.ev_clipboardSet = this.ev_clipboardSet.bind(this);
    this.ev_mouseFinishForceGround = this.ev_mouseFinishForceGround.bind(this);
    this.ev_mouseMoveForceGround = this.ev_mouseMoveForceGround.bind(this);
    this.ev_clickEditorSpaceCtn = this.ev_clickEditorSpaceCtn.bind(this);
    this.ev_mouseMove = this.ev_mouseMove.bind(this);
    this.ev_dblclickCurtain = this.ev_dblclickCurtain.bind(this);
    //setup cmd
    this.cmdRunner.assign(LayoutEditorCMD);
    Object.keys(LayoutEditorCmdDescriptors).forEach(function (cmd) {
        if (LayoutEditorCmdDescriptors[cmd].bindKey)
            self.bindKeyToCmd(LayoutEditorCmdDescriptors[cmd].bindKey.win, cmd);
    });

    /**
     * @type {Array<import('../anchoreditors/AnchorEditor')>}
     */
    this.anchorEditors = [];

    this.undoHistory = new UndoHistory();
    this.undoHistory.on('checkout', function (event) {
        var editing = event.item.data.editing;
        var selected = event.item.data.selected;
        self.applyData(event.item.data.data);
        self.lastCommitData = event.item.data;
        if (editing) {
            self.editLayoutByName(editing);
        }
        else {
            self.editLayout(self.rootLayout);
        }
        self.setActiveComponentByName.apply(self, selected);
        self.updateAnchor();
        self.notifyCmdDescriptorsChange();
        self.notifyUnsaved();
        // self.mComponentOutline.updateComponetTree();
    });
    this.setContext(R.UNDO_HISTORY, this.undoHistory);// because it had it's ContextManager

    this.componentOtline = new ComponentOutline();
    this.setContext(R.COMPONENT_OUTLINE, this.componentOtline);


    this.componentPropertiesEditor = new ComponentPropertiesEditor(this)
        .on({
            change: function (event) {
                self.updateAnchorPosition();
                Dom.updateResizeSystem();
                if (event.name && event.name.match(/vAlign|hAlign|top|bottom|left|right/)) {
                    self.updateAnchor();
                    self.updateEditing();
                }
                this.component.reMeasure();
            },
            stopchange: function (event) {
                var compName = event.object ? event.object.getAttribute('name') : ('{' + event.objects.map(function (object) {
                    return object.getAttribute('name')
                }).join(', ') + '}');
                self.commitHistory('edit', compName + '.' + event.name + '');
                self.notifyUnsaved();

            }
        });
}


Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(Assembler.prototype));


LayoutEditor.prototype.constructor = LayoutEditor;

LayoutEditor.prototype.setSoftScale = function (val) {
    //todo
    this._softScale = val;
    this.$editorSpace.addStyle('transform', 'scale(' + val + ')');
};


LayoutEditor.prototype.getSoftScale = function (val) {
    return this._softScale;
};


LayoutEditor.prototype.zoomBy = function (val) {
    this.setSoftScale(val * this._softScale);
};


LayoutEditor.prototype.onAttached = function () {
    this.componentPropertiesEditor.attach(this);
    this.undoHistory.attach(this);
    this.componentOtline.attach(this);
    this.CMDTool = this.getContext(R.CMD_TOOL);
    if (this.CMDTool)
        this.CMDTool.start();
};


LayoutEditor.prototype.onStart = function () {
    this.undoHistory.start();
    this.componentPropertiesEditor.start();
    this.componentOtline.start();
};


LayoutEditor.prototype.onResume = function () {
    /**
     * @type {import('./FormEditor').default}
     */
    this.formEditor = this.getContext(R.FORM_EDITOR);

    this.selfHolder = this.formEditor.getEditorHolderByEditor(this);
    /**
     * @type {import('./UndoHistory').default}
     */
    this.undoHistory.resume();
    this.componentPropertiesEditor.resume();
    this.componentOtline.resume();
    /**
     * @type {import('../fragment/CMDTool'.default)}
     */
    this.CMDTool = this.getContext(R.CMD_TOOL);
    if (this.CMDTool) {
        this.CMDTool.bindWithEditor(this);
        this.CMDTool.start();
    }
    ClipboardManager.on('set', this.ev_clipboardSet);
    this.getView().focus();
    //
    this.statusBarElt = this.getContext(R.STATUS_BAR_ELT);
    this.$mouseOffsetStatus.addTo(this.statusBarElt.$rightCtn);


};


LayoutEditor.prototype.onPause = function () {
    // release undoHistory
    this.undoHistory.pause();
    this.componentPropertiesEditor.pause();
    this.componentOtline.pause();

    if (this.CMDTool) {
        this.CMDTool.pause();
        this.CMDTool.bindWithEditor(undefined);
    }
    ClipboardManager.off('set', this.ev_clipboardSet);
    this.getView().blur();
    this.$mouseOffsetStatus.remove();

    //
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
    if (this.autoDestroyInt > 0) {
        clearInterval(this.autoDestroyInt);
    }
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
        attr: { tabindex: '1' },
        child: [
            {
                class: 'as-layout-editor-header',
                child: [
                    {
                        class: 'as-layout-editor-cmd-tool-container'
                    },
                    {
                        class: 'as-layout-editor-quickpath-container',
                        child: {
                            tag: 'quickpath',
                            on: {
                                change: this.ev_quickpathChange.bind(this)
                            }
                        }
                    }
                ]
            },

            {
                class: 'as-layout-editor-property-container'
            },
            {
                class: 'as-layout-editor-measure-container',
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
            }
        ],

        on: {
            keydown: this.ev_cmdKeyDown.bind(this),
            mousemove: this.ev_mouseMove
        }
    });


    var self = this;

    this.$header = $('.as-layout-editor-header', this.$view);
    this.$quickpath = $('quickpath', this.$header);

    this.$attachHook = _('attachhook').on('error', function () {
        this.updateSize = self.updateSize.bind(self);
        Dom.addToResizeSystem(this);
        self.updateSize();
    }).addTo(this.$view);

    this.$hruler = $('hruler', this.$view);
    this.$hruler.measureElement($('.as-relative-layout', this.$view));
    this.$spaceCtn = $('.as-layout-editor-space-container', this.$view)
        .on('scroll', this.ev_layoutCtnScroll.bind(this));
    this.$hrulerMouse = _('.as-hruler-mouse').addTo(this.$hruler);
    this.$hrulerEditing = _('.as-hruler-editing').addTo(this.$hruler);


    this.$vruler = $('vruler', this.$view);
    this.$vruler.measureElement($('.as-relative-layout', this.$view));
    this.$vrulerMouse = _('.as-vruler-mouse').addTo(this.$vruler);
    this.$vrulerEditing = _('.as-vruler-editing').addTo(this.$vruler);


    this.$layoutCtn = $('.as-layout-editor-layout-container', this.$view);

    this.$forceground = $('.as-layout-editor-forceground', this.$view)
        .on('mousedown', this.ev_mousedownForceGround.bind(this));

    this.$editorSpaceCtn = $('.as-layout-editor-space-container', this.$view)
        .on('click', this.ev_clickEditorSpaceCtn);
    this.autoDestroyInt = setInterval(function () {
        if (!self.$view.isDescendantOf(document.body)) {
            self.destroy();
        }
    }, 6900);
    this.$editorSpace = $('.as-layout-editor-space', this.$view)

    this.$mouseSelectingBox = _('.as-layout-editor-mouse-selecting-box');

    this.$curtainLeft = _('.as-layout-editor-curtain')
        .on('dblclick', this.ev_dblclickCurtain)
        .addTo(this.$forceground);
    this.$curtainRight = _('.as-layout-editor-curtain')
        .on('dblclick', this.ev_dblclickCurtain)
        .addTo(this.$forceground);
    this.$curtainTop = _('.as-layout-editor-curtain')
        .on('dblclick', this.ev_dblclickCurtain)
        .addTo(this.$forceground);
    this.$curtainBottom = _('.as-layout-editor-curtain')
        .on('dblclick', this.ev_dblclickCurtain)
        .addTo(this.$forceground);

    this.$cmdToolCtn = $('.as-layout-editor-cmd-tool-container', this.$view);
    this.$measureCtn = $('.as-layout-editor-measure-container', this.$view);
    this.$propertyCtn = $('.as-layout-editor-property-container', this.$view);
    this.$mouseOffsetStatus = _({
        tag: 'button',
        class: 'as-status-bar-item',
        child: [
            'span.mdi.mdi-cursor-move',
            'span',
            'span'
        ]
    });
    return this.$view;
};

LayoutEditor.prototype.getCmdToolCtn = function () {
    return this.$cmdToolCtn;
};


LayoutEditor.prototype.getPropertyCtn = function () {
    return this.$propertyCtn;
};

LayoutEditor.prototype.ev_quickpathChange = function (event) {
    console.log(event);
    var layout = event.item.layout;
    var thisEditor = this;
    setTimeout(function () {
        thisEditor.editLayout(layout);
    }, 10);
};

/**
 * @param {MouseEvent} event
 */
LayoutEditor.prototype.ev_mouseMove = function (event) {
    var vruleBound = this.$vruler.getBoundingClientRect();
    var hruleBound = this.$hruler.getBoundingClientRect();
    this.$vrulerMouse.addStyle('top', event.clientY - vruleBound.top - 1 - 1 + 'px');
    this.$hrulerMouse.addStyle('left', event.clientX - hruleBound.left - 1 - 1 + 'px');
    this.mouseClientX = event.clientX;
    this.mouseClientY = event.clientY;
    if (this.rootLayout) {
        var rootBound = this.rootLayout.view.getBoundingClientRect();
        this.mouseOffsetX = Math.round(event.clientX - rootBound.left);
        this.mouseOffsetY = Math.round(event.clientY - rootBound.top);
        this.$mouseOffsetStatus.children[1].innerHTML = this.mouseOffsetX + ',' + this.mouseOffsetY;
    }
    //update  mouse position on 
};


LayoutEditor.prototype.ev_clickEditorSpaceCtn = function (event) {
    if (event.target == this.$editorSpaceCtn) {
        this.setActiveComponent();
    }
};


LayoutEditor.prototype.ev_mousedownForceGround = function (event) {
    if (!EventEmitter.isMouseLeft(event)) return;
    if (event.target != this.$forceground) return;
    var hitComponent = this.findComponentsByMousePostion(event.clientX, event.clientY);
    if (hitComponent) {
        if (event.shiftKey)
            this.toggleActiveComponent(hitComponent);
        else
            this.setActiveComponent(hitComponent);
        var anchorEditor = this.anchorEditors[this.anchorEditors.length - 1];

        //cheating
        var repeatedEvent = EventEmitter.copyEvent(event, { target: $('.as-resize-box-body', anchorEditor.$resizeBox), preventDefault: event.preventDefault.bind(event) });
        anchorEditor.$resizeBox.eventHandler.mouseDownBody(repeatedEvent);
        this.$view.focus();// layouteditor may be not focus before, prevent default effect make it not focus

        // prevent auto toggle with click event
        anchorEditor.preventClick = true;
        anchorEditor.once('click', function () {
            setTimeout(function () {
                anchorEditor.preventClick = false;
            }, 1)
        });
        anchorEditor.$resizeBox.on('endmove', function () {
            anchorEditor.preventClick = false;
        });
    }
    else {
        $(document.body).on('mouseup', this.ev_mouseFinishForceGround)
            .on('mouseleave', this.ev_mouseFinishForceGround)
            .on('mousemove', this.ev_mouseMoveForceGround);
        this.$editorSpaceCtn.off('click', this.ev_clickEditorSpaceCtn);
        this.$mouseSelectingBox.addTo(this.$forceground);
        var forcegroundBound = this.$forceground.getBoundingClientRect();
        this._forgroundMovingData = {
            left: event.clientX - forcegroundBound.left,
            top: event.clientY - forcegroundBound.top,
            width: 0,
            height: 0,
            event0: event
        };
        this.$mouseSelectingBox.addStyle({
            left: this._forgroundMovingData.left + 'px',
            top: this._forgroundMovingData.top + 'px',
            width: '0',
            height: '0'
        });
    }
};


LayoutEditor.prototype.ev_mouseMoveForceGround = function (event) {
    var forcegroundBound = this.$forceground.getBoundingClientRect();
    this._forgroundMovingData.width = event.clientX - forcegroundBound.left - this._forgroundMovingData.left;
    this._forgroundMovingData.height = event.clientY - forcegroundBound.top - this._forgroundMovingData.top;
    if (this._forgroundMovingData.width < 0) {
        this.$mouseSelectingBox.addStyle({
            left: this._forgroundMovingData.left + this._forgroundMovingData.width + 'px',
            width: - this._forgroundMovingData.width + 'px',
        });
    }
    else {
        this.$mouseSelectingBox.addStyle({
            left: this._forgroundMovingData.left + 'px',
            width: this._forgroundMovingData.width + 'px',
        });


    }
    if (this._forgroundMovingData.height < 0) {
        this.$mouseSelectingBox.addStyle({
            top: this._forgroundMovingData.top + this._forgroundMovingData.height + 'px',
            height: - this._forgroundMovingData.height + 'px',
        });
    }
    else {
        this.$mouseSelectingBox.addStyle({
            top: this._forgroundMovingData.top + 'px',
            height: this._forgroundMovingData.height + 'px',
        });
    }
};


LayoutEditor.prototype.ev_mouseFinishForceGround = function (event) {

    $(document.body).off('mouseup', this.ev_mouseFinishForceGround)
        .off('mouseleave', this.ev_mouseFinishForceGround)
        .off('mousemove', this.ev_mouseMoveForceGround);
    setTimeout(this.$editorSpaceCtn.on.bind(this.$editorSpaceCtn, 'click', this.ev_clickEditorSpaceCtn), 10);
    this.$mouseSelectingBox.remove();
    //find all rectangle
    var selectedComp = [];
    var event0 = this._forgroundMovingData.event0;
    var left = Math.min(event0.clientX, event.clientX);
    var right = Math.max(event0.clientX, event.clientX);
    var top = Math.min(event0.clientY, event.clientY);
    var bottom = Math.max(event0.clientY, event.clientY);

    var selectRect = new Rectangle(left, top, right - left, bottom - top);

    var children = this.editingLayout.children;

    if (this.anchorEditors.length > 0) {
        children = this.editingLayout.children;
    }
    var comp, compRect;

    for (var i = 0; i < children.length; ++i) {
        comp = children[i];
        compRect = Rectangle.fromClientRect(comp.view.getBoundingClientRect());
        if (compRect.isCollapse(selectRect))
            selectedComp.push(comp);
    }

    var self = this;

    if (event.shiftKey) {
        this.toggleActiveComponent.apply(this, selectedComp.filter(function (comp) {
            return !self.findAnchorEditorByComponent(comp);
        }));
    }
    else {
        this.setActiveComponent.apply(this, selectedComp);
    }
};


LayoutEditor.prototype.ev_clickPreviewBtn = function (button, event) {
    var next = {
        'interact': 'design',
        'design': 'interact'
    };
    var buttonTitle = {
        'interact': 'Interact Mode',
        'design': 'Design Mode'
    };
    this.setMode(next[this.mode]);
    this.$previewBtn.attr('title', buttonTitle[this.mode]);
};

LayoutEditor.prototype.ev_layoutCtnScroll = function () {
    this.updateRuler();
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
            self.execCmd(cmd);
        });
    }
};


LayoutEditor.prototype.ev_clipboardSet = function () {
    this.notifyCmdDescriptorsChange();
};


LayoutEditor.prototype.ev_dblclickCurtain = function (event) {
    var parentLayout = this.findNearestLayoutParent(this.editingLayout.parent);
    if (parentLayout) this.editLayout(parentLayout);
};


LayoutEditor.prototype.updateEditing = function () {
    var hruleBound = this.$hruler.getBoundingClientRect();
    var vruleBound = this.$vruler.getBoundingClientRect();
    var editingBound = this.editingLayout.view.getBoundingClientRect();
    this.$hrulerEditing.addStyle({
        left: editingBound.left - hruleBound.left - 1 + 'px',
        width: editingBound.width + 'px'
    });

    this.$vrulerEditing.addStyle({
        top: editingBound.top - vruleBound.top - 1 + 'px',
        height: editingBound.height + 'px'
    });

    var foregroundBound = this.$forceground.getBoundingClientRect();
    if (this.editingLayout == this.rootLayout) {
        this.$curtainLeft.addStyle({
            visibility: 'hidden'
        });
        this.$curtainBottom.addStyle({
            visibility: 'hidden'
        });

        this.$curtainRight.addStyle({
            visibility: 'hidden'
        });

        this.$curtainTop.addStyle({
            visibility: 'hidden'
        });

    }
    else {
        this.$curtainLeft.addStyle({
            left: '0',
            top: '0',
            width: editingBound.left - foregroundBound.left + 'px',
            height: editingBound.bottom - foregroundBound.top + 'px'
        }).removeStyle('visibility');

        this.$curtainBottom.addStyle({
            left: '0',
            top: editingBound.bottom - foregroundBound.top + 'px',
            width: editingBound.right - foregroundBound.left + 'px',
            height: foregroundBound.bottom - editingBound.bottom + 'px'
        }).removeStyle('visibility');

        this.$curtainRight.addStyle({
            left: editingBound.right - foregroundBound.left + 'px',
            top: editingBound.top - foregroundBound.top + 'px',
            width: foregroundBound.right - editingBound.right + 'px',
            height: foregroundBound.bottom - editingBound.top + 'px'
        }).removeStyle('visibility');

        this.$curtainTop.addStyle({
            left: editingBound.left - foregroundBound.left + 'px',
            top: '0',
            width: foregroundBound.right - editingBound.left + 'px',
            height: editingBound.top - foregroundBound.top + 'px'
        }).removeStyle('visibility');
    }
};

LayoutEditor.prototype.updateRuler = function () {
    this.$vruler.update();
    this.$hruler.update();

    var hruleBound = this.$hruler.getBoundingClientRect();
    var vruleBound = this.$vruler.getBoundingClientRect();
    var editingBound = this.editingLayout.view.getBoundingClientRect();
    this.$hrulerEditing.addStyle({
        left: editingBound.left - hruleBound.left - 1 + 'px',
        width: editingBound.width + 'px'
    });

    this.$vrulerEditing.addStyle({
        top: editingBound.top - vruleBound.top - 1 + 'px',
        height: editingBound.height + 'px'
    });
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
    if (from.getAttribute('name') == name) {
        return [from];
    }
    var self = this;
    if (from.children)
        res = from.children.reduce(function (ac, child) {
            var found = self.findComponentsByName(name, child);
            if (found) return ac.concat(found);
            return ac;
        }, []);
    if (res.length > 0) return res;
    return undefined;
};

LayoutEditor.prototype.findComponentsByMousePostion = function (clientX, clientY) {
    var children = this.editingLayout.children;
    var child, childBound;
    for (var i = children.length - 1; i >= 0; --i) {
        child = children[i];
        childBound = child.view.getBoundingClientRect();
        if (clientX >= childBound.left && clientX <= childBound.right && clientY >= childBound.top && clientY <= childBound.bottom)
            return child;
    }
    return undefined;
};

LayoutEditor.prototype.updateSize = function () {
    //todo
    // var bound = this.$view.getBoundingClientRect();
    var headerBound = this.$header.getBoundingClientRect();
    var propertyCtnBound = this.$propertyCtn.getBoundingClientRect();
    this.$measureCtn.addStyle({
        top: headerBound.height + 'px',
        right: propertyCtnBound.width + 'px'
    });
    this.$propertyCtn.addStyle({
        top: headerBound.height + 'px',

    });
};



LayoutEditor.prototype._newAnchorEditor = function (component) {
    var self = this;
    var AnchorEditor = component.parent ? component.parent.getAnchorEditorConstructor() : RelativeAnchorEditor;
    //craete new, repeat event to other active anchor editor
    var editor = new AnchorEditor(this).on('click', function (event) {
        if (editor.preventClick) return;
        if (this.component)
            if (event.shiftKey) {
                self.toggleActiveComponent(this.component)
            }
            else
                self.setActiveComponent(this.component);
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
            self.componentPropertiesEditor.styleEditor.updatePropertyRecursive('width');
            self.componentPropertiesEditor.styleEditor.updatePropertyRecursive('height');
            self.componentPropertiesEditor.allPropertyEditor.updatePropertyRecursive('width');
            self.componentPropertiesEditor.allPropertyEditor.updatePropertyRecursive('height');
            self.updateEditing();
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
            self.notifyUnsaved();
        })
        .on('focus', function (event) {
            self.componentPropertiesEditor.edit.apply(self.componentPropertiesEditor, self.getActivatedComponents());
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
    var components = Array.prototype.slice.call(arguments);
    var oldEditors = this.anchorEditors.slice();
    var oldComponents = this.anchorEditors.map(function (editor) {
        return editor.component;
    });

    //todo
    while (this.anchorEditors.length > 0) {
        var editor = this.anchorEditors.pop();
    }

    var oldIndex;
    var component;
    var editor;
    while (this.anchorEditors.length < components.length) {
        component = components[this.anchorEditors.length];
        oldIndex = oldComponents.indexOf(component);
        if (oldIndex >= 0) {
            editor = oldEditors[oldIndex];
            oldEditors[oldIndex] = null;// for removing
        }
        else {
            editor = this._newAnchorEditor(components[this.anchorEditors.length]);
        }
        this.anchorEditors.push(editor);
    }
    oldEditors.forEach(function (editor) {
        editor && editor.edit();
    });
    if (this.anchorEditors.length > 0)
        this.anchorEditors[this.anchorEditors.length - 1].focus();
    this.componentOtline.updateComponentStatus();
    this.lastCommitData.selected = this.getSelected();
    this.lastCommitData.editing = this.editingLayout.getAttribute('name');
    this.emit('selectedcomponentchange', { target: this, type: 'selectedcomponentchange' }, this);
    this.notifyCmdDescriptorsChange();
};

LayoutEditor.prototype.setActiveComponentByName = function () {
    var components = Array(arguments.length).fill(null);
    var dict = Array.prototype.reduce.call(arguments, function (ac, cr, i) {
        ac[cr] = i;
        return ac;
    }, {});
    function visit(node) {
        var name = node.getAttribute('name');
        if (typeof dict[name] == 'number') {
            components[dict[name]] = node;
        }
        node.children.forEach(visit);
    }
    visit(this.rootLayout);
    this.setActiveComponent.apply(this, components);
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
    this.lastCommitData.selected = this.getSelected();
    this.lastCommitData.editing = this.editingLayout.getAttribute('name');
    this.emit('selectedcomponentchange', { target: this, type: 'selectedcomponentchange' }, this);
    this.notifyCmdDescriptorsChange();
};


LayoutEditor.prototype.findAnchorEditorByComponent = function (comp) {
    for (var i = 0; i < this.anchorEditors.length; ++i) {
        if (this.anchorEditors[i].component == comp) return this.anchorEditors[i];
    }
    return undefined;
};


LayoutEditor.prototype.findFocusAnchorEditor = function () {
    // faster
    for (var i = this.anchorEditors.length - 1; i >= 0; --i) {
        if (this.anchorEditors[i].isFocus) return this.anchorEditors[i];
    }
    return null;
};


LayoutEditor.prototype.getActivatedComponents = function () {
    return this.anchorEditors.map(function (e) {
        return e.component;
    }).filter(function (e) { return !!e });
};


LayoutEditor.prototype.applyData = function (data) {
    this.rootLayout = this.build(data);
    this.$layoutCtn.clearChild().addChild(this.rootLayout.view);
    this.rootLayout.onAttached(this);
    this.$vruler.measureElement(this.rootLayout.view);
    this.$hruler.measureElement(this.rootLayout.view);
    this.editLayout(this.rootLayout)
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


LayoutEditor.prototype.editLayout = function (layout) {
    if (!layout) throw new Error("Layout must be not null");
    var lastTag = this.editingLayout && this.editingLayout.tag;
    var currentTag = layout && layout.tag;
    this.editingLayout = layout;
    this.lastCommitData.editing = layout.getAttribute('name');
    this.$quickpath.path = this.getQuickpathFrom(layout);
    this.setActiveComponent();
    this.updateEditing();
    if (lastTag != currentTag) {
        this.notifyCmdChange();
    }
};

LayoutEditor.prototype.editLayoutByName = function (name) {
    var comps = this.findComponentsByName(name);
    if (comps && comps.length > 0)
        this.editLayout(comps[0]);
};


LayoutEditor.prototype.getQuickpathFrom = function (layout) {
    var thisEditor = this;
    while (layout && !layout.isLayout) {
        layout = layout.parent;
    }
    var res = [];
    if (layout) {
        var childLayoutItems = layout.children.filter(function (comp) {
            return comp.isLayout;
        }).map(function (comp) {
            return { name: comp.getAttribute('name'), icon: comp.menuIcon, layout: comp };
        });
        if (childLayoutItems.length > 0) {
            res.push({
                name: '...',
                items: childLayoutItems
            });
        }
    }

    var node;
    while (layout) {
        node = { name: layout.getAttribute('name'), icon: layout.menuIcon, layout: layout };
        if (layout.parent && layout.parent.children) {
            node.items = layout.parent.children.filter(function (comp) {
                return comp.isLayout;
            }).map(function (comp) {
                return { name: comp.getAttribute('name'), icon: comp.menuIcon, layout: comp, extendStyle: layout == comp ? { color: "#009" } : {} };
            });
        }
        else node.items = [{ name: layout.getAttribute('name'), icon: layout.menuIcon, layout: layout }];
        res.unshift(node);
        layout = layout.parent;
    }
    return res;
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
    var descriptor = LayoutEditorCmdDescriptors[name];
    if (this.editingLayout) {
        var anchorEditorConstructor = this.editingLayout.getAnchorEditorConstructor();
        if (anchorEditorConstructor.prototype.getCmdDescriptor) {
            descriptor = descriptor || (anchorEditorConstructor.prototype.getCmdDescriptor.call(null, name));
        }
    }

    var res = Object.assign({
        type: 'trigger',
        desc: 'command: ' + name,
        icon: 'span.mdi.mdi-apple-keyboard-command'
    }, descriptor)
    if ((name.startsWith('align') || name.startsWith('equalise')) && this.anchorEditors.length < 2) {
        res.disabled = true;
    }
    else if (name.startsWith('distribute') && this.anchorEditors.length < 3) {
        res.disabled = true;
    } else if (name.match(/^(delete|copy|cut)/) && this.anchorEditors.length < 1) {
        res.disabled = true;
    } else if (name == 'paste') {
        res.disabled = !ClipboardManager.get(R.CLIPBOARD.COMPONENTS);
    }
    else if (name == 'undo') {
        res.disabled = this.undoHistory.lastItemIndex <= 0;
    }
    else if (name == 'redo') {
        res.disabled = this.undoHistory.lastItemIndex >= this.undoHistory.items.length - 1;
    }

    return res;
};



LayoutEditor.prototype.getCmdGroupTree = function () {
    var tree = [LayoutEditorCmdTree];
    if (this.editingLayout) {
        var anchorEditorConstructor = this.editingLayout.getAnchorEditorConstructor();
        if (anchorEditorConstructor.prototype.getCmdGroupTree) {
            tree.push(anchorEditorConstructor.prototype.getCmdGroupTree.call(null));
        }
    }

    return tree;
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
    var layout = this.editingLayout;
    var rootBound = this.rootLayout.view.getBoundingClientRect();
    var layoutBound = layout.view.getBoundingClientRect();
    var layoutPosX = posX - (layoutBound.left - rootBound.left);
    var layoutPosY = posY - (layoutBound.top - rootBound.top);
    var addedComponets = [];
    if (!(contructor instanceof Array)) {
        contructor = [contructor];
    }

    addedComponets = contructor.map(function (cst) {
        var comp;
        if (typeof cst == 'function' && cst.prototype.tag) {
            comp = self.build({ tag: cst.prototype.tag });
        }
        else {
            comp = self.build(cst);
        }
        layout.addChildByPosition(comp, layoutPosX, layoutPosY);
        comp.reMeasure();
        return comp;
    });

    this.emit('addcomponent', { type: 'addcomponent', components: addedComponets, target: this }, this);
    this.setActiveComponent.apply(this, addedComponets);
    this.notifyDataChange();
    setTimeout(this.updateAnchorPosition.bind(this), 1);
    this.componentOtline.updateComponetTree();
    this.commitHistory('add', "Add " + addedComponets.map(function (comp) { return comp.getAttribute('name') }).join(', '));
    this.notifyUnsaved();
};


LayoutEditor.prototype.build = function () {
    var comp = Assembler.prototype.build.apply(this, arguments);
    var thisEditor = this;
    var originFunction = comp.getStyle;
    comp.getStyle = function(){
        var res = originFunction.apply(this, arguments);
        if (arguments[1] == 'px' && comp.style[arguments[0]]!= res){
            res/= thisEditor._softScale;
        }
        return res;
    };
    return comp;
};

LayoutEditor.prototype.clearRootLayout = function () {
    this._activatedComponent = undefined;
    this.rootLayout.clearChild();
    this.updateAnchor();
    this.emit('clearallcomponent', { target: this }, this);
    this.notifyDataChange();
    this.componentOtline.updateComponetTree();
    this.commitHistory('remove', 'Remove all components');
    this.notifyUnsaved();
};


LayoutEditor.prototype.removeComponent = function () {
    var removedComponents = Array.prototype.slice.call(arguments);
    this.toggleActiveComponent.apply(this, removedComponents);
    removedComponents.forEach(function (comp) {
        comp.remove();
    })
    //edit nothing
    this.emit('removecomponent', { type: 'removecomponent', target: this, components: removedComponents }, this);
    this.componentPropertiesEditor.edit();
    this.notifyDataChange();

    if (removedComponents.length > 0) {
        this.componentOtline.updateComponetTree();
        this.commitHistory('remove', 'Remove ' + removedComponents.map(function (c) {
            return c.getAttribute('name');
        }).join(', '));
        this.notifyUnsaved();
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
    this.notifyUnsaved();
    this.updateAnchorPosition();
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
    this.notifyUnsaved();
    this.updateAnchorPosition();
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
    this.notifyUnsaved();
    this.updateAnchorPosition();
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
    this.notifyUnsaved();
};

LayoutEditor.prototype.notifyUnsaved = function () {
    this.selfHolder.tabframe.modified = true;
};

LayoutEditor.prototype.notifySaved = function () {
    this.selfHolder.tabframe.modified = false;
};

LayoutEditor.prototype.getSelected = function () {
    return this.anchorEditors.map(function (aed) {
        return aed.component.getAttribute('name');
    })
};

LayoutEditor.prototype.commitHistory = function (type, description) {
    if (!this.undoHistory) return;
    this.lastCommitData = {
        editing: this.editingLayout && this.editingLayout.getAttribute('name'),
        selected: this.getSelected(),
        data: this.getData()
    };
    this.undoHistory.commit(type, this.lastCommitData, description, new Date());
};


LayoutEditor.prototype.execCmd = function () {
    try {
        return BaseEditor.prototype.execCmd.apply(this, arguments);
    }
    catch (error) {
    }

    try {
        var focusEditor = this.findFocusAnchorEditor();
        if (focusEditor) {
            return focusEditor.execCmd.apply(focusEditor, arguments);
        }
    }
    catch (error1) {
        //other 
        console.log(error1);

    }
};


export default LayoutEditor;

