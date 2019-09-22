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


var _ = Fcore._;
var $ = Fcore.$;

function LayoutEditor() {
    Context.call(this);
    Assembler.call(this);
    this.addConstructor('RelativeLayout', RelativeLayout);
    this.rootLayout = null;
}


Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(LayoutEditor.prototype, Object.getOwnPropertyDescriptors(Assembler.prototype));
LayoutEditor.prototype.constructor = LayoutEditor;


LayoutEditor.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        class: 'as-layout-editor',
        child: ['.as-layout-editor-background',
            '.as-layout-editor-layout-contaner',
            '.as-layout-editor-forceground',
            {
                class: 'as-layout-editor-hrule-container',
                child: 'hruler'
            },
            {
                class: 'as-layout-editor-vrule-container',
                child: 'vruler'
            }
        ]
    });
    var self = this;
    this.$attachHook = _('attachhook').on('error', function () {
        this.updateSize = self.updateSize.bind(self);
        Dom.addToResizeSystem(this);
        self.updateSize();
    }).addTo(this.$view);

    this.$layoutCtn = $('.as-layout-editor-layout-contaner', this.$view);
    this.$background = $('.as-layout-editor-background', this.$view);
    this.$forceground = $('.as-layout-editor-forceground', this.$view)
        .on('click', this.ev_clickForceground.bind(this));

    this.$resizeBox = _('resizebox')
        .on('beginmove', this.ev_beginMove.bind(this))
        .on('moving', this.ev_moving.bind(this));

    this.$leftAlignLine = _('hline');
    this.$rightAlignLine = _('hline');

    this.$topAlignLine = _('vline');
    this.$bottomAlignLine = _('vline');

    return this.$view;
};

LayoutEditor.prototype.ev_beginMove = function (event) {
    var bound = this.$forceground.getBoundingClientRect();
    this._movingStateData = {
        x0: event.clientX - bound.left,
        y0: event.clientY - bound.top,
        dx: 0,
        dy: 0,
        option: event.option,
        aceptStyleNames: this._activatedCompnent.getAceptStyleNames(),
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
    if (movingData.aceptStyleNames.left && (movingData.option.left || movingData.option.body)) {
        movingData.comp.setStyle('left', movingData.style0.left + movingData.dx);
    }


    if (movingData.aceptStyleNames.right && (movingData.option.right || movingData.option.body)) {
        movingData.comp.setStyle('right', movingData.style0.right - movingData.dx);
    }

    if (movingData.aceptStyleNames.width) {
        if (movingData.option.left) {
            movingData.comp.setStyle('width', movingData.style0.width - movingData.dx);
        }
        if (movingData.option.right) {
            movingData.comp.setStyle('width', movingData.style0.width + movingData.dx);
        }
    }

    if (movingData.aceptStyleNames.top && (movingData.option.top || movingData.option.body)) {
        movingData.comp.setStyle('top', movingData.style0.top + movingData.dy);
    }

    if (movingData.aceptStyleNames.bottom && (movingData.option.bottom || movingData.option.body)) {

        movingData.comp.setStyle('bottom', movingData.style0.bottom - movingData.dy);
    }

    if (movingData.aceptStyleNames.height) {
        if (movingData.option.top) {
            movingData.comp.setStyle('height', movingData.style0.height - movingData.dy);
        }
        if (movingData.option.bottom) {
            movingData.comp.setStyle('height', movingData.style0.height + movingData.dy);
        }
    }

    this.updateAnchorPosition();
};

LayoutEditor.prototype.ev_endMoving = function (event) {
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

LayoutEditor.prototype.activeComponent = function (comp) {
    this._activatedCompnent = comp;
    this.updateAnchor();
};

LayoutEditor.prototype.updateAnchor = function () {
    var comp = this._activatedCompnent;
    if (comp && comp != this.rootLayout) {
        this.$resizeBox.addTo(this.$forceground);

        var anchorAceptStyle = comp.anchor.getAceptStyleNames();
        if (anchorAceptStyle.top) {
            this.$topAlignLine.addTo(this.$forceground)
        }
        else {
            this.$topAlignLine.remove();
        }

        if (anchorAceptStyle.bottom) {
            this.$bottomAlignLine.addTo(this.$forceground);
        }
        else {
            this.$bottomAlignLine.remove();
        }

        if (anchorAceptStyle.left) {
            this.$leftAlignLine.addTo(this.$forceground);
        }
        else {
            this.$leftAlignLine.remove();
        }

        if (anchorAceptStyle.right) {
            this.$rightAlignLine.addTo(this.$forceground);
        }
        else {
            this.$rightAlignLine.remove();
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
    if (comp && comp != this.rootLayout) {
        var bound = this.$layoutCtn.getBoundingClientRect();
        var compBound = comp.view.getBoundingClientRect();
        this.$resizeBox.addStyle({
            left: compBound.left - bound.left + 'px',
            top: compBound.top - bound.top + 'px',
            width: compBound.width + 'px',
            height: compBound.height + 'px'
        }).addTo(this.$forceground);

        if (this.$leftAlignLine.parentNode)
            this.$leftAlignLine.addStyle({
                left: '0',
                width: compBound.left - bound.left + 'px',
                top: compBound.top - bound.top + compBound.height / 2 + 'px',
            });

        if (this.$rightAlignLine.parentNode)
            this.$rightAlignLine.addStyle({
                right: '0',
                width: bound.right - compBound.right + 'px',
                top: compBound.top - bound.top + compBound.height / 2 + 'px',
            });


        if (this.$topAlignLine.parentNode)
            this.$topAlignLine.addStyle({
                top: '0',
                height: compBound.top - bound.top + 'px',
                left: compBound.left - bound.left + compBound.width / 2 + 'px',
            });
        if (this.$bottomAlignLine.parentNode)
            this.$bottomAlignLine.addStyle({
                bottom: '0',
                height: bound.bottom - compBound.bottom + 'px',
                left: compBound.left - bound.left + compBound.width / 2 + 'px',
            });
    }
};



LayoutEditor.prototype.updateSize = function () {
    this.updateAnchorPosition();
};


LayoutEditor.prototype.setData = function (data) {
    var self = this;
    function visit(node) {
        var constructor = self.constructors[node.tag];
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
};


LayoutEditor.prototype.getData = function (data) {

};




export default LayoutEditor;