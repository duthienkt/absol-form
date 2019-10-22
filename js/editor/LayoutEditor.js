import Context from 'absol/src/AppPattern/Context';
import Assembler from '../core/Assembler';
import RelativeLayout from '../layouts/RelativeLayout';
import Dom from 'absol/src/HTML5/Dom';

import Fcore from '../core/FCore';
import '../dom/ResizeBox';
import '../dom/HLine';
import '../dom/VLine';
import '../dom/HRuler';
import '../dom/VRuler';
import EventEmitter from 'absol/src/HTML5/EventEmitter';


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
                            extendEvent: 'contextmenu',
                            on: {
                                contextmenu: this.ev_contextMenuLayout.bind(this)
                            }
                        },
                        {
                            class: 'as-layout-editor-forceground-container',
                            child: '.as-layout-editor-forceground',
                            extendEvent: 'contextmenu',
                            on: {
                                contextmenu: this.ev_contextMenuForceGround.bind(this)
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

    this.$resizeBox = _('resizebox')
        .on('beginmove', this.ev_beginMove.bind(this))
        .on('moving', this.ev_moving.bind(this))
        .on('endmove', this.ev_endMoving.bind(this));
    this.$leftAlignLine = _('hline');
    this.$rightAlignLine = _('hline');

    this.$topAlignLine = _('vline');
    this.$bottomAlignLine = _('vline');
    this.$editorSpaceCtn = $('.as-layout-editor-space-container', this.$view)
        .on('click', function (ev) {
            if (ev.target == this) {
                self.activeComponent(null);
            }
        });

    return this.$view;
};

LayoutEditor.prototype.ev_layoutCtnScroll = function () {
    this.updateRuler();
};


LayoutEditor.prototype.ev_beginMove = function (event) {
    var bound = this.$forceground.getBoundingClientRect();
    this._movingStateData = {
        x0: event.clientX - bound.left,
        y0: event.clientY - bound.top,
        dx: 0,
        dy: 0,
        option: event.option,
        styleDescriptors: this._activatedCompnent.getStyleDescriptors(),
        style0: Object.assign({}, this._activatedCompnent.style),
        comp: this._activatedCompnent
    };
};


LayoutEditor.prototype.ev_moving = function (event) {
    var movingData = this._movingStateData;

    var bound = this.$forceground.getBoundingClientRect();
    var x = event.clientX - bound.left;
    var y = event.clientY - bound.top;
    movingData.dx = x - movingData.x0;
    movingData.dy = y - movingData.y0;
    var positionIsChange = false;
    //TODO; size may be invalid
    if (movingData.styleDescriptors.left && !movingData.styleDescriptors.left.disabled && (movingData.option.left || movingData.option.body)) {
        movingData.comp.setStyle('left', Math.max(0, movingData.style0.left + movingData.dx));
        positionIsChange = true;
    }


    if (movingData.styleDescriptors.right && !movingData.styleDescriptors.right.disabled && (movingData.option.right || movingData.option.body)) {
        movingData.comp.setStyle('right', Math.max(0, movingData.style0.right - movingData.dx));
        positionIsChange = true;

    }

    if (movingData.styleDescriptors.width && !movingData.styleDescriptors.width.disabled) {
        if (movingData.option.left) {
            if (!!movingData.styleDescriptors.left.disabled && !!movingData.styleDescriptors.right.disabled) {
                movingData.comp.setStyle('width', Math.max(movingData.comp.measureMinSize().width, movingData.style0.width - movingData.dx * 2));
                //center align
            }
            else {
                movingData.comp.setStyle('width', Math.max(movingData.style0.width - movingData.dx));
            }
            positionIsChange = true;
        }
        if (movingData.option.right) {
            if (movingData.styleDescriptors.left && !!movingData.styleDescriptors.left.disabled && !!movingData.styleDescriptors.right.disabled) {
                movingData.comp.setStyle('width', Math.max(movingData.comp.measureMinSize().width, movingData.style0.width + movingData.dx * 2));
                //center align
            }
            else {
                movingData.comp.setStyle('width', Math.max(movingData.comp.measureMinSize().width, movingData.style0.width + movingData.dx));
            }
            positionIsChange = true;
        }
    }

    if (movingData.styleDescriptors.top && !movingData.styleDescriptors.top.disabled && (movingData.option.top || movingData.option.body)) {
        movingData.comp.setStyle('top', Math.max(0, movingData.style0.top + movingData.dy));
        positionIsChange = true;
    }

    if (movingData.styleDescriptors.bottom && !movingData.styleDescriptors.bottom.disabled && (movingData.option.bottom || movingData.option.body)) {
        movingData.comp.setStyle('bottom', Math.max(0, movingData.style0.bottom - movingData.dy));
        positionIsChange = true;
    }

    if (movingData.styleDescriptors.height && !movingData.styleDescriptors.height.disabled) {
        if (movingData.option.top) {
            if (movingData.styleDescriptors.top && !!movingData.styleDescriptors.top.disabled && !!movingData.styleDescriptors.bottom.disabled) {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height - movingData.dy * 2));
            }
            else {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height - movingData.dy));
            }
            positionIsChange = true;

        }
        if (movingData.option.bottom) {
            if (movingData.styleDescriptors.top && !!movingData.styleDescriptors.top.disabled && !!movingData.styleDescriptors.bottom.disabled) {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height + movingData.dy * 2));
            }
            else {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height + movingData.dy));
            }
            positionIsChange = true;
        }
    }

    this.updateAnchorPosition();
    movingData.comp.reMeasure();
    if (positionIsChange) {
        this.emit("repositioncomponent", { component: movingData.comp, movingData: movingData }, this);
        movingData.isChange = true;
    }
};

LayoutEditor.prototype.ev_endMoving = function (event) {
    if (this._movingStateData.isChange) {
        this.notifyDataChange();
    }
    this._movingStateData = undefined;
}

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
        this.activeComponent(hitComponent);
    }
};



LayoutEditor.prototype.ev_contextMenuForceGround = function (event) {
    this.ev_clickForceground(event);
    var self = this;
    var activatedComponent = this._activatedCompnent;
    if (activatedComponent) {
        if (activatedComponent == this.rootLayout) {
            event.showContextMenu({
                items: [
                    {
                        text: 'New',
                        icon: 'span.mdi.mdi-plus',
                        cmd: 'new'
                        // items: self.getMenuComponentItems()
                    },
                    {
                        icon: 'span.mdi.mdi-eraser',
                        text: 'Clear',
                        cmd: 'clear'
                    },
                    {
                        text: "Interact Mode",
                        cmd: 'interact',
                        icon: "span.mdi.mdi-android-auto.mdi-rotate-90"
                    }
                ]
            }, function (menuEvent) {
                var cmd = menuEvent.menuItem.cmd;
                switch (cmd) {
                    case 'clear': self.clearRootLayout(); break;
                    case 'new': setTimeout(self.$componentMenuTrigger.click.bind(self.$componentMenuTrigger), 10); break;
                    case 'interact': self.setMode('interact'); break;
                }
            });
        }
        else {
            event.showContextMenu({
                items: [
                    {
                        text: 'Edit Attributes',
                        icon: 'span.mdi.mdi-table-edit',
                        cmd: 'attributes-edit'
                        // items: self.getMenuComponentItems()
                    },
                    {
                        text: 'Edit Style',
                        icon: 'span.mdi.mdi-square-edit-outline',
                        cmd: 'style-edit'
                        // items: self.getMenuComponentItems()
                    },
                    {
                        icon: 'span.mdi.mdi-delete-variant',
                        text: 'Delete',
                        cmd: 'delete',
                        extendStyle: {
                            color: 'red'
                        }
                    }
                ]
            }, function (menuEvent) {
                var cmd = menuEvent.menuItem.cmd;
                switch (cmd) {
                    case 'delete':
                        activatedComponent.parent.removeChild(activatedComponent);
                        self.activeComponent(undefined);
                        self.notifyChanged();
                        self.commitChanged();
                        break;
                    case 'attributes-edit': break;
                }
            });

        }
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


LayoutEditor.prototype.updateAnchor = function () {
    var comp = this._activatedCompnent;
    if (comp) {
        this.$resizeBox.addTo(this.$forceground);
        var styleDescriptors = comp.getStyleDescriptors();

        this.$resizeBox.canMove = !!(styleDescriptors.top || styleDescriptors.bottom || styleDescriptors.left || styleDescriptors.right);
        this.$resizeBox.canResize = !!(styleDescriptors.width || styleDescriptors.height);

        if (!styleDescriptors.top || styleDescriptors.top.disabled) {
            this.$topAlignLine.remove();
        }
        else {

            this.$topAlignLine.addTo(this.$forceground);

        }

        if (!styleDescriptors.bottom || styleDescriptors.bottom.disabled) {
            this.$bottomAlignLine.remove();
        }
        else {
            this.$bottomAlignLine.addTo(this.$forceground);
        }

        if (!styleDescriptors.left || styleDescriptors.left.disabled) {
            this.$leftAlignLine.remove();
        }
        else {
            this.$leftAlignLine.addTo(this.$forceground);
        }

        if (!styleDescriptors.right || styleDescriptors.right.disabled) {
            this.$rightAlignLine.remove();
        }
        else {
            this.$rightAlignLine.addTo(this.$forceground);
        }
    }
    else {
        this.$resizeBox.remove();
        this.$leftAlignLine.remove();
        this.$rightAlignLine.remove();
        this.$topAlignLine.remove();
        this.$bottomAlignLine.remove();
    }
    this.updateAnchorPosition();
};


LayoutEditor.prototype.updateAnchorPosition = function () {
    var comp = this._activatedCompnent;
    if (comp) {
        var bound = this.$forceground.getBoundingClientRect();
        var compBound = comp.view.getBoundingClientRect();
        this.$resizeBox.addStyle({
            left: compBound.left - bound.left + 'px',
            top: compBound.top - bound.top + 'px',
            width: compBound.width + 'px',
            height: compBound.height + 'px'
        }).addTo(this.$forceground);

        if (this.$leftAlignLine.parentNode)
            this.$leftAlignLine.addStyle({
                left: compBound.left - bound.left - comp.style.left + 'px',
                width: comp.style.left + 'px',
                top: compBound.top - bound.top + compBound.height / 2 + 'px',
            });

        if (this.$rightAlignLine.parentNode)
            this.$rightAlignLine.addStyle({
                left: compBound.right - bound.left + 'px',
                width: comp.style.right + 'px',
                top: compBound.top - bound.top + compBound.height / 2 + 'px',
            });

        if (this.$topAlignLine.parentNode)

            this.$topAlignLine.addStyle({
                top: compBound.top - bound.top - comp.style.top + 'px',
                height: comp.style.top + 'px',
                left: compBound.left - bound.left + compBound.width / 2 + 'px',
            });

        if (this.$bottomAlignLine.parentNode)
            this.$bottomAlignLine.addStyle({
                top: compBound.bottom - bound.top + 'px',
                height: comp.style.bottom + 'px',
                left: compBound.left - bound.left + compBound.width / 2 + 'px',
            });
    }
};




LayoutEditor.prototype.updateSize = function () {
    //todo
};


LayoutEditor.prototype.setData = function (data) {
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
                comp.addChild(visit(cNode));
            });
        }
        return comp;
    }

    this.rootLayout = visit(data);
    this.$layoutCtn.addChild(this.rootLayout.view);
    this.rootLayout.onAttached(this);
    this.$vruler.measureElement(this.rootLayout.view);
    this.$hruler.measureElement(this.rootLayout.view);
    this.emit('change', { type: 'change', target: this, data: data }, this);
};



LayoutEditor.prototype.autoExpandRootLayout = function () {
    if (this.rootLayout) {
        var minSize = this.rootLayout.measureMinSize();
        var isChange = false;
        if (minSize.width > this.rootLayout.style.width) { this.rootLayout.setStyle('width', minSize.width); isChange = true; }
        if (minSize.height > this.rootLayout.style.height) { this.rootLayout.setStyle('height', minSize.height); isChange = true; }
        if (isChange){
            this.emit('layoutexpand', { type: 'layoutexpand', target: this, layout: this.rootLayout }, this);
            this.notifyDataChange();
        }
    }
};



LayoutEditor.prototype.activeComponent = function (comp) {
    if (this._activatedCompnent == comp) return;
    this._activatedCompnent = comp;
    if (comp)
        comp.reMeasure();
    this.updateAnchor();
    this.emit('activecomponent', { target: this, component: comp }, this);
};


LayoutEditor.prototype.getData = function (data) {
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
    this.rootLayout.addChild(newComponent);
    posX = Math.max(0, Math.min(this.rootLayout.style.width - newComponent.style.width, posX));
    posY = Math.max(0, Math.min(this.rootLayout.style.height - newComponent.style.height, posY));
    newComponent.setStyle('left', posX);
    newComponent.setStyle('top', posY);
    newComponent.reMeasure();
    this.emit('addcomponent', { type: 'addcomponent', component: newComponent, target: this }, this);
    this.activeComponent(newComponent);
    this.notifyDataChange();
    setTimeout(this.updateAnchorPosition.bind(this), 1);
};


LayoutEditor.prototype.clearRootLayout = function () {
    this._activatedCompnent = undefined;
    this.rootLayout.clearChild();
    this.updateAnchor();
    this.emit('clearallcomponent', { target: this }, this);
    this.notifyDataChange();
};


LayoutEditor.prototype.removeComponent = function (comp) {
    comp.remove();
    this.emit('removecomponent', { type: 'removecomponent', target: this, component: comp }, this);
    this.notifyDataChange();
    if (this._activatedCompnent == comp) {
        this.activeComponent(undefined);
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
};


LayoutEditor.prototype.moveToBottomComponent = function (comp) {
    var parent = comp.parent;
    if (!parent) return;
    var lastChild = parent.children[parent.children - 1];
    if (lastChild == comp) return;
    comp.remove();
    parent.addChild(comp);
    this.updateComponetTree();
    this.emit('movetobottomcomponent', { type: 'movetobottomcomponent', target: this, component: comp }, this);
    this.notifyDataChange();
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
};


export default LayoutEditor;