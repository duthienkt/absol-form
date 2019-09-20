import Context from 'absol/src/AppPattern/Context';
import Assembler from '../core/Assembler';
import RelativeLayout from '../layouts/RelativeLayout';
import Dom from 'absol/src/HTML5/Dom';
import Fcore from '../core/FCore';
import '../dom/ResizeBox';

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
            '.as-layout-editor-forceground'
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

    this.$resizeBox = _('resizebox');
    return this.$view;
};

LayoutEditor.prototype.ev_clickForceground = function (event) {
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
    this._activeCompnent = comp;
    this.updateResizeBox()
};

LayoutEditor.prototype.updateResizeBox = function () {
    var comp = this._activeCompnent;
    if (comp) {
        if (comp != this.rootLayout) {
            var bound = this.$view.getBoundingClientRect();
            var compBound = comp.view.getBoundingClientRect();
            this.$resizeBox.addStyle({
                left: compBound.left - bound.left - 1 + 'px',
                top: compBound.top - bound.top - 1 + 'px',
                width: compBound.width + 2 + 'px',
                height: compBound.height + 2 + 'px'
            }).addTo(this.$forceground);
        }
        else {
            this.$resizeBox.remove();
        }
    }
    else {
        this.$resizeBox.remove();
    }
};



LayoutEditor.prototype.updateSize = function () {
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