import AComp from 'absol-acomp';

var _ = AComp._;
var $ = AComp.$;

/**
 * AnchorBox only has on child node
 */
function RelativeAnchor() {
    this.hAlign = this.HALIGN_VALUE[0];
    this.vAlign = this.VALIGN_VALUE[0];
    
    this.viewBinding = {};
    this.childNode = null;
    this.view = this.render();
    this.created();
}

RelativeAnchor.prototype.created = function () {
    for (var key in this.viewBinding) {
        this[key] = $(this.viewBinding[key], this.view);
    }
};

RelativeAnchor.prototype.VALIGN_VALUE = ['top', 'bottom', 'center', 'fixed'];
RelativeAnchor.prototype.HALIGN_VALUE = ['left', 'right', 'center'];

RelativeAnchor.prototype.hAlign = RelativeAnchor.prototype.HALIGN_VALUE[0];
RelativeAnchor.prototype.vAlign = RelativeAnchor.prototype.VALIGN_VALUE[0];
RelativeAnchor.prototype.left = 0;
RelativeAnchor.prototype.right = 0;
RelativeAnchor.prototype.top = 0;
RelativeAnchor.prototype.bottom = 0;
RelativeAnchor.prototype.width = 0;
RelativeAnchor.prototype.height = 0;

RelativeAnchor.prototype.HALIGN_CLASS_NAMES = {
    left: 'as-halign-left',
    right: 'as-halign-right',
    center: 'as-halign-center',
    fixed: 'as-halign-fixed'
};

RelativeAnchor.prototype.VALIGN_CLASS_NAMES = {
    top: 'as-valign-top',
    bottom: 'as-valign-bottom',
    center: 'as-valign-center',
    fixed: 'as-valign-fixed'
};

RelativeAnchor.prototype.HALIGN_ACEPT_STYLE = {
    left: { left: true, right: false, width: true },
    right: { left: false, right: true, width: true },
    center: { left: false, right: false, width: true },
    fixed: { left: true, right: true, width: false }
}

RelativeAnchor.prototype.VALIGN_ACEPT_STYLE = {
    top: { top: true, bottom: false, height: true },
    bottom: { top: false, bottom: true, height: true },
    center: { top: false, bottom: false, height: true },
    fixed: { top: true, bottom: true, height: false }
}


RelativeAnchor.prototype.TOP_CLASS_NAME = 'as-relative-anchor-box';

RelativeAnchor.prototype.render = function () {

    var layout = {
        class: [this.TOP_CLASS_NAME, this.HALIGN_CLASS_NAMES[this.hAlign], this.VALIGN_CLASS_NAMES[this.vAlign]]
    };

    this.viewBinding.$containter = '.' + this.TOP_CLASS_NAME;
    if (this.vAlign == 'center') {
        layout.child = {
            class: 'as-center-table',
            child: 'as-center-cell'
        };
        this.viewBinding.$containter = '.as-center-cell';
    }
    return _(layout);
};


/**
 * @param {BaseComponent} child
 */
RelativeAnchor.prototype.attachChild = function (child) {
    if (this.childNode) {
        this.childNode.view.remove();
        this.childNode = null;
        this.childNode._anchorBox = null;
    }

    if (child._anchorBox) throw new Error("Detach anchorBox first");
    this.childNode = child;
    child.anchor = this;
    this.$containter.addChild(child.view);
};

RelativeAnchor.prototype.dettachChild = function () {
    if (this.childNode) {
        this.childNode.view.remove();
        this.childNode = null;
        this.childNode._anchorBox = null;
    }
    else
        throw new Error("Nothing to detach");
};


RelativeAnchor.prototype.setHAlign = function (value) {
    if (this.hAlign == value) return;
    this.view.removeClass(this.HALIGN_CLASS_NAMES[this.hAlign]);
    this.hAlign = value;
    this.view.addClass(this.HALIGN_CLASS_NAMES[this.hAlign]);
};

RelativeAnchor.prototype.setVAlign = function (value) {
    if (this.vAlign == value) return;

    this.view.removeClass(this.VALIGN_CLASS_NAMES[this.vAlign]);
    if (this.vAlign == 'center') {
        this.view.clearChild();
        this.viewBinding.$containter = '.' + this.TOP_CLASS_NAME;
        this.$containter = this.view;
        
        if (this.childNode) {
            this.$containter.addChild(this.childNode.view);
        }
    }

    this.vAlign = value;
    this.view.addClass(this.VALIGN_CLASS_NAMES[this.vAlign]);
    if (this.vAlign == 'center') {
        this.view.clearChild();
        this.view.addChild(_({
            class: 'as-center-table',
            child: '.as-center-cell'
        }
        ));
        this.viewBinding.$containter = '.as-center-cell';
        this.$containter = $(this.viewBinding.$containter, this.view);
        if (this.childNode) {
            this.$containter.addChild(this.childNode.view);
        }
    }
    for (var key in this.VALIGN_ACEPT_STYLE[this.vAlign]) {
        if (this.VALIGN_ACEPT_STYLE[this.vAlign][key]) {
            this.view.addStyle(key, this['_' + key] + 'px');
        }
        else {
            this.view.removeStyle(key);
        }
    }
};

RelativeAnchor.prototype.setLeft = function (value) {
    this.left = value;
    if (this.HALIGN_ACEPT_STYLE[this.hAlign].left) {
        this.view.addStyle('left', value + 'px');
    }
};

RelativeAnchor.prototype.setRight = function (value) {
    this.right = value;
    if (this.HALIGN_ACEPT_STYLE[this.hAlign].right) {
        this.view.addStyle('right', value + 'px');
    }
};



RelativeAnchor.prototype.setBottom = function (value) {
    this.bottom = value;
    if (this.VALIGN_ACEPT_STYLE[this.vAlign].bottom) {
        this.view.addStyle('bottom', value + 'px');
    }
};

RelativeAnchor.prototype.setTop = function (value) {
    this.top = value;
    if (this.VALIGN_ACEPT_STYLE[this.vAlign].top) {
        this.view.addStyle('top', value + 'px');
    }
};


RelativeAnchor.prototype.setWidth = function (value) {
    this.width = value;
    //must set width in componet, not anchor
   
};

RelativeAnchor.prototype.setHeight = function (value) {
    this.height = value;
    //must set height in componet, not anchor
};



export default RelativeAnchor;