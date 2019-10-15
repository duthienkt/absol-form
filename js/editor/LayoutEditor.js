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

LayoutEditor.prototype.notifyChanged = function () {
    this._changeCommited = false;
};


LayoutEditor.prototype.commitChanged = function () {
    if (!this._changeCommited) {
        //todo something
        this.emit('change', { type: 'change', layoutEditor: this }, this);
    }

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
    this.$hruler.mesureElement($('.as-relative-layout', this.$view));
    this.$spaceCtn = $('.as-layout-editor-space-container', this.$view)
        .on('scroll', this.ev_layoutCtnScroll.bind(this));

    this.$vruler = $('vruler', this.$view);
    this.$vruler.mesureElement($('.as-relative-layout', this.$view));

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
        if (ev.target == this){
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

    //TODO; size may be invalid
    if (movingData.styleDescriptors.left && !movingData.styleDescriptors.left.disabled && (movingData.option.left || movingData.option.body)) {
        movingData.comp.setStyle('left', movingData.style0.left + movingData.dx);
        this.notifyChanged();
    }


    if (movingData.styleDescriptors.right && !movingData.styleDescriptors.right.disabled && (movingData.option.right || movingData.option.body)) {
        movingData.comp.setStyle('right', movingData.style0.right - movingData.dx);
        this.notifyChanged();
    }

    if (movingData.styleDescriptors.width && !movingData.styleDescriptors.width.disabled) {
        if (movingData.option.left) {
            if (!!movingData.styleDescriptors.left.disabled && !!movingData.styleDescriptors.right.disabled) {
                movingData.comp.setStyle('width', Math.max(0, movingData.style0.width - movingData.dx * 2));
                //center align
            }
            else {
                movingData.comp.setStyle('width', Math.max(movingData.style0.width - movingData.dx));
            }
            this.notifyChanged();
        }
        if (movingData.option.right) {
            if (movingData.styleDescriptors.left && !!movingData.styleDescriptors.left.disabled && !!movingData.styleDescriptors.right.disabled) {
                movingData.comp.setStyle('width', Math.max(0, movingData.style0.width + movingData.dx * 2));
                //center align
            }
            else {
                movingData.comp.setStyle('width', Math.max(0, movingData.style0.width + movingData.dx));
            }
            this.notifyChanged();
        }
    }

    if (movingData.styleDescriptors.top && !movingData.styleDescriptors.top.disabled && (movingData.option.top || movingData.option.body)) {
        movingData.comp.setStyle('top', movingData.style0.top + movingData.dy);
        this.notifyChanged();
    }

    if (movingData.styleDescriptors.bottom && !movingData.styleDescriptors.bottom.disabled && (movingData.option.bottom || movingData.option.body)) {
        movingData.comp.setStyle('bottom', movingData.style0.bottom - movingData.dy);
        this.notifyChanged();
    }

    if (movingData.styleDescriptors.height && !movingData.styleDescriptors.height.disabled) {
        if (movingData.option.top) {
            if (movingData.styleDescriptors.top && !!movingData.styleDescriptors.top.disabled && !!movingData.styleDescriptors.bottom.disabled) {
                movingData.comp.setStyle('height', Math.max(0, movingData.style0.height - movingData.dy * 2));
            }
            else {
                movingData.comp.setStyle('height', Math.max(0, movingData.style0.height - movingData.dy));
            }
            this.notifyChanged();

        }
        if (movingData.option.bottom) {
            if (movingData.styleDescriptors.top && !!movingData.styleDescriptors.top.disabled && !!movingData.styleDescriptors.bottom.disabled) {
                movingData.comp.setStyle('height', Math.max(0, movingData.style0.height + movingData.dy * 2));
            }
            else {
                movingData.comp.setStyle('height', Math.max(0, movingData.style0.height + movingData.dy));
            }
            this.notifyChanged();
        }
    }

    this.updateAnchorPosition();
    movingData.comp.reMeasure();
    this.emit("movecomponent", { component: movingData.comp, movingData: movingData }, this)
};

LayoutEditor.prototype.ev_endMoving = function (event) {
    this._movingStateData = undefined;
    this.commitChanged();
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




LayoutEditor.prototype.ev_menuComponent = function (item) {
    var componentConstructor = item.componentConstructor;
    var newComponent = new componentConstructor();
    this.rootLayout.addChild(newComponent);
    this.activeComponent(newComponent);
};

LayoutEditor.prototype.clearRootLayout = function () {
    this._activatedCompnent = undefined;
    this.rootLayout.clearChild();
    this.updateAnchor();
};

LayoutEditor.prototype.activeComponent = function (comp) {
    this._activatedCompnent = comp;
    if (comp)
        comp.reMeasure();
    this.updateAnchor();
    this.emit('activecomponent', { target: this, component: comp }, this);
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


LayoutEditor.prototype.updateRuler = function () {
    this.$hruler.update();
    this.$vruler.update();
};

LayoutEditor.prototype.updateSize = function () {
    this.updateRuler();
    // this.updateAnchorPosition();
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
    this.$vruler.mesureElement(this.rootLayout.view);
    this.$hruler.mesureElement(this.rootLayout.view);
};


LayoutEditor.prototype.getData = function (data) {
    if (this.rootLayout) return this.rootLayout.getData();
    return null;
};


LayoutEditor.prototype.getMenuComponentItems = function () {
    var self = this;
    this._menuComponentItems = this._menuComponentItems || [];
    this._menuComponentItems.splice(0, this._menuComponentItems.length);
    var items = Object.keys(this.constructors).map(function (key) {
        var constructor = self.constructors[key];
        return {
            text: key,
            icon: constructor.prototype.menuIcon,
            cmd: 'component',
            componentConstructor: constructor,
            componentTag: key
        }
    });
    this._menuComponentItems.push.apply(this._menuComponentItems, items);
    return this._menuComponentItems;
};

LayoutEditor.prototype.setMode = function (mode) {
    if (this.MODE_VALUE.indexOf(mode) < 0 || this.mode == mode) return;
    if (this.$view) {
        this.$view.removeClass(this.MODE_CLASS_NAMES[this.mode])
            .addClass(this.MODE_CLASS_NAMES[mode]);

    }
    this.mode = mode;
};


export default LayoutEditor;