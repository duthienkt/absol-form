import Context from 'absol/src/AppPattern/Context';
import Assembler from '../core/Assembler';
import RelativeLayout from '../layouts/RelativeLayout';
import Dom from 'absol/src/HTML5/Dom';

import Fcore from '../core/FCore';
import '../dom/HLine';
import '../dom/VLine';
import EventEmitter from 'absol/src/HTML5/EventEmitter';
import R from '../R';
import PluginManager from '../core/PluginManager';


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
    this._publicDataChange = true;

    /**
     * @type {Array<import('../anchoreditors/AnchorEditor')>}
     */
    this.anchorEditors = [];
}


Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(Assembler.prototype));
Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
LayoutEditor.prototype.constructor = LayoutEditor;



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
        }
        else {
            editor = this._newAnchorEditor(arguments[i]);
            this.anchorEditors.push(editor);
            editor.focus();
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
    
    this.rootLayout = this.build(data);
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

LayoutEditor.prototype.editLayout = function (component) {

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
        layoutBound:layoutBound,
        rootBound: rootBound,
        selt: this,
        constructor: contructor,
        assembler: this,
        descript: 'You can set result by your own component. After plugin was called, if result still null, the editor will build the element by tag',
        preventDefault: function(){
            this.prevented = true;
        },
        prevented: false,
        addedComponets:[],
        
        addcomponent: function(newComponent, x, y){
            this.addedComponets = newComponent;
            layout.addChildByPosition(newComponent, x,y);
            newComponent.reMeasure();
        }
    };

    PluginManager.exec("BUILD_ELEMENT_BY_CONSTRUCTOR", context);

    if (!context.prevented){
        context.addcomponent(this.build({ tag: contructor.prototype.tag }), context.posX, context.posY);
    }

    this.emit('addcomponent', { type: 'addcomponent', components: context.addedComponets, target: this }, this);
    this.setActiveComponent.apply(this, context.addedComponets);
    this.notifyDataChange();
    setTimeout(this.updateAnchorPosition.bind(this), 1);
    this.commitHistory('add', "Add " + context.addedComponets.map(function(comp){return comp.getAttribute('name')}).join(', ') + '[' + tag + ']');
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