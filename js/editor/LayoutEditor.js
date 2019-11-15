import Context from 'absol/src/AppPattern/Context';
import Assembler from '../core/Assembler';
import RelativeLayout from '../layouts/RelativeLayout';
import Dom from 'absol/src/HTML5/Dom';

import Fcore from '../core/FCore';
import '../dom/HLine';
import '../dom/VLine';
import EventEmitter from 'absol/src/HTML5/EventEmitter';
import R from '../R';


var _ = Fcore._;
var $ = Fcore.$;

function LayoutEditor() {
    Context.call(this);
    Assembler.call(this);
    EventEmitter.call(this);
    this.addConstructor('RelativeLayout', RelativeLayout);
    this.rootLayout = null;
    this.snapshots = [];
    this.snapshotsIndex = 0;
    this._changeCommited = true;
    this.mode = 'design';
    this._publicDataChange = true;

    /**
     * @type {Array<import('../anchoreditors/AnchorEditor')>}
     */
    this.anchorEditors = [];
    /**
     * @type {Array<import('../anchoreditors/AnchorEditor')>}
     */
    this.anchorEditorPool = [];
}


Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(Assembler.prototype));
Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
LayoutEditor.prototype.constructor = LayoutEditor;

LayoutEditor.prototype.MODE_VALUE = ['design', 'interact'];
LayoutEditor.prototype.MODE_CLASS_NAMES = {
    design: 'mode-design',
    interact: 'mode-interact'
};

LayoutEditor.prototype.onAttached = function () {
    /**
     * @type {import('./UndoHistory').default}
     */
    this.mUndoHistory = this.getContext(R.UNDO_HISTORY);
}

LayoutEditor.prototype.activePublicDataChange = function (flag) {
    this._publicDataChange = !!flag;
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
        class: ['as-layout-editor'].concat([this.MODE_CLASS_NAMES[this.mode]]),
        child: [
            {
                class: 'as-layout-editor-mode-button-container',
                child: {
                    tag: 'button',
                    attr:{
                        title: ({
                            'interact': 'Interact Mode',
                            'design': 'Design Mode'
                        })[this.mode]
                    },
                    child: ['span.mdi.mdi-pencil-box-multiple-outline', 'span.mdi.mdi-play-outline']
                }
            },
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
                            class: 'as-layout-editor-layout-container',
                            on: {
                                contextmenu: this.ev_contextMenuLayout.bind(this)
                            }
                        },
                        {
                            class: 'as-layout-editor-forceground-container',
                            child: '.as-layout-editor-forceground',
                            extendEvent: 'contextmenu',

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
    this.$modeBtn = $('.as-layout-editor-mode-button-container > button', this.$view).on('click', this.ev_clickModeBtn.bind(this));
    return this.$view;
};

LayoutEditor.prototype.ev_clickModeBtn = function (button, event) {
    var next = {
        'interact': 'design',
        'design': 'interact'
    };
    var buttonTitle = {
        'interact': 'Interact Mode',
        'design': 'Design Mode'
    }
    this.setMode(next[this.mode]);
    this.$modeBtn.attr('title', buttonTitle[this.mode]);
};

LayoutEditor.prototype.ev_layoutCtnScroll = function () {
    this.updateRuler();
};


LayoutEditor.prototype.ev_clickForceground = function (event) {
    if (event.target != this.$forceground) return;
    var hitComponent;
    function visit(node) {
        var bound = node.view.getBoundingClientRect();
        if (bound.left <= event.clientX && bound.right >= event.clientX
            && bound.top <= event.clientY && bound.bottom >= event.clientY) {
            hitComponent = node;
        }
        if (node.children)
            node.children.forEach(visit);
    }
    visit(this.rootLayout);

    if (hitComponent) {
        if (event.shiftKey)
            this.toggleActiveComponent(hitComponent);
        else this.setActiveComponent(hitComponent);
    }
};




LayoutEditor.prototype.ev_contextMenuLayout = function (event) {
    var self = this;
    event.showContextMenu({
        items: [
            {
                text: 'Design Mode',
                icon: 'span.mdi.mdi-pencil-box-multiple-outline',
                cmd: 'design'
            }
        ]
    }, function (menuEvent) {
        var cmd = menuEvent.menuItem.cmd;
        switch (cmd) {
            case 'design': self.setMode('design'); break;
        }
    });
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




LayoutEditor.prototype.updateSize = function () {
    //todo
};



LayoutEditor.prototype._newAnchorEditor = function () {
    var self = this;
    var AnchorEditor = this.rootLayout.getAnchorEditorConstructor();
    //craete new, repeat event to other active anchor editor
    return new AnchorEditor(this).on('click', function (event) {
        if (this.component)
            if (self.anchorEditors.length > 1)
                self.toggleActiveComponent(this.component);
            else {
                self.setActiveComponent(this.component);
            }
    })//todo: implement in AnchorEditor
        .on('beginmove', function (event) {
            var originEvent = event.originEvent;
            var other;
            for (var i = 0; i < self.anchorEditors.length; ++i) {
                other = self.anchorEditors[i];
                if (other != this) {
                    other.ev_beginMove(false, originEvent);
                }
            }
        })
        .on('beginmove', function (event) {
            var originEvent = event.originEvent;
            var other;
            for (var i = 0; i < self.anchorEditors.length; ++i) {
                other = self.anchorEditors[i];
                if (other != this) {
                    other.ev_beginMove(false, originEvent);
                }
            }
        })
        .on('moving', function (event) {
            var originEvent = event.originEvent;
            var other;
            for (var i = 0; i < self.anchorEditors.length; ++i) {
                other = self.anchorEditors[i];
                if (other != this) {
                    other.ev_moving(false, originEvent);
                }
            }
            self.notifyDataChange();
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
            self.emit('focuscomponent', { type: 'focuscomponent', component: this.component, originEvent: event, target: self }, self);
        })
        .on('change', function (event) {
            self.notifyDataChange();
        });
};

/**
 * @argument {Array<import('../core/BaseComponent').default>}
 */
LayoutEditor.prototype.setActiveComponent = function () {
    //todo
    while (this.anchorEditors.length > arguments.length) {
        var editor = this.anchorEditors.pop();
        editor.edit(undefined);
        this.anchorEditorPool.push(editor);
    }

    while (this.anchorEditors.length < arguments.length) {
        var editor = this.anchorEditorPool.pop() || this._newAnchorEditor();
        this.anchorEditors.push(editor);
    }

    for (var i = 0; i < arguments.length; ++i) {
        this.anchorEditors[i].edit(undefined);
        this.anchorEditors[i].edit(arguments[i]);
    }
    if (this.anchorEditors.length > 0) {
        this.anchorEditors[this.anchorEditors.length - 1].focus();
    }
};


/**
 * @argument {Array<import('../core/BaseComponent').default>}
 */
LayoutEditor.prototype.toggleActiveComponent = function () {
    //todo
    var editor;
    for (var i = 0; i < arguments.length; ++i) {
        editor = this.findAnchorEditorByComponent(arguments[i]);
        if (editor) {
            editor.edit(undefined);
            this.anchorEditorPool.push(editor);
        }
        else {
            editor = this.anchorEditorPool.pop() || this._newAnchorEditor();
            editor.edit(arguments[i]);
            this.anchorEditors.push(editor);
        }
    }

    this.anchorEditors = this.anchorEditors.filter(function (e) {
        return !!e.component;
    });

    if (this.anchorEditors.length > 0) {
        this.anchorEditors[this.anchorEditors.length - 1].focus();
    }
};


LayoutEditor.prototype.findAnchorEditorByComponent = function (comp) {
    for (var i = 0; i < this.anchorEditors.length; ++i) {
        if (this.anchorEditors[i].component == comp) return this.anchorEditors[i];
    }
    return undefined;
};


LayoutEditor.prototype.getActivatedComponents = function () {
    return this.anchorEditors.map(function (e) {
        return e.component;
    }).filter(function (e) { return !!e });
};


LayoutEditor.prototype.applyData = function (data) {
    var self = this;
    function visit(node) {
        var constructor = self.constructors[node.tag];
        if (!constructor) throw new Error(node.tag + ' constructor not found!');
        var comp = new constructor();

        var style = node.style;
        if (typeof style == 'object')
            for (var styleName in style) {
                comp.setStyle(styleName, style[styleName]);
            }


        var attributes = node.attributes;
        if (typeof attributes == 'object')
            for (var attributeName in attributes) {
                comp.setAttribute(attributeName, attributes[attributeName]);
            }

        if (node.children && node.children.length > 0) {
            node.children.forEach(function (cNode) {
                var childComp = visit(cNode);
                comp.addChild(childComp);
                childComp.reMeasure();
            });
        }
        return comp;
    }
    if (this.rootLayout) {
        this.rootLayout.onDetached(this);
        this.rootLayout.view.remove();
    }
    this.rootLayout = visit(data);
    this.$layoutCtn.addChild(this.rootLayout.view);
    this.rootLayout.onAttached(this);
    this.$vruler.measureElement(this.rootLayout.view);
    this.$hruler.measureElement(this.rootLayout.view);
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


LayoutEditor.prototype.setMode = function (mode) {
    if (this.MODE_VALUE.indexOf(mode) < 0 || this.mode == mode) return;
    if (this.$view) {
        this.$view.removeClass(this.MODE_CLASS_NAMES[this.mode])
            .addClass(this.MODE_CLASS_NAMES[mode]);

    }
    var lastMode = this.mode;
    this.mode = mode;
    this.emit('changemode', { type: 'changemode', mode: mode, lastMode: lastMode }, this);
};

/**
 * @returns {import('../core/BaseComponent') }
 */
LayoutEditor.prototype.addNewComponent = function (tag, posX, posY) {
    var newComponent = this.build({ tag: tag });
    this.rootLayout.addChildByPosition(newComponent, posX, posY);
    newComponent.reMeasure();
   
    this.emit('addcomponent', { type: 'addcomponent', component: newComponent, target: this }, this);
    this.setActiveComponent(newComponent);
    this.notifyDataChange();
    setTimeout(this.updateAnchorPosition.bind(this), 1);
    this.commitHistory('add', "Add " + newComponent.getAttribute('name') + '[' + tag + ']');
};


LayoutEditor.prototype.clearRootLayout = function () {
    this._activatedComponent = undefined;
    this.rootLayout.clearChild();
    this.updateAnchor();
    this.emit('clearallcomponent', { target: this }, this);
    this.notifyDataChange();
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
        this.emit('removecomponent', { type: 'removecomponent', target: this, component: comp }, this);
    }
    this.notifyDataChange();

    if (removedComponents.length > 0) {
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
    this.commitHistory('move-order', 'Move ' + comp.getAttribute('name') + ' to top');
};



LayoutEditor.prototype.commitHistory = function (type, description) {
    if (!this.mUndoHistory) return;
    this.mUndoHistory.commit(type, this.getData(), description, new Date());
};

export default LayoutEditor;