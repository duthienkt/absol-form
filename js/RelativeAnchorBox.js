import AComp from 'absol-acomp';

var _ = AComp._;

/**
 * AnchorBox only has on child node
 */
function RelativeAnchorBox() {
    this._halign = this.HALIGN_VALUE[0];
    this._valign = this.VALIGN_VALUE[0];
    this._left = 0;
    this._right = 0;
    this._top = 0;
    this._bottom = 0;
    this._width = 0;
    this._height = 0;
    this.viewBinding = {};
    this.childNode = null;
    this.view = this.render();
    this.created();
}

RelativeAnchorBox.prototype.created = function () {
    for (var key in this.viewBinding) {
        this[key] = $(this.viewBinding[key], this.view);
    }
};

RelativeAnchorBox.prototype.VALIGN_VALUE = ['top', 'bottom', 'center', 'fixed'];
RelativeAnchorBox.prototype.HALIGN_VALUE = ['left', 'right', 'center'];

RelativeAnchorBox.prototype.HALIGN_CLASS_NAMES = {
    left: 'as-halign-left',
    right: 'as-halign-right',
    center: 'as-halign-center',
    fixed: 'as-halign-fixed'
};

RelativeAnchorBox.prototype.VALIGN_CLASS_NAMES = {
    top: 'as-valign-top',
    top: 'as-valign-bottom',
    center: 'as-valign-center',
    fixed: 'as-valign-fixed'
};

RelativeAnchorBox.prototype.HALIGN_ACEPT_STYLE = {
    left: { left: true, right: false, width: true },
    right: { left: false, right: true, width: true },
    center: { left: false, right: false, width: true },
    fixed: { left: true, right: true, width: false }
}

RelativeAnchorBox.prototype.VALIGN_ACEPT_STYLE = {
    top: { top: true, bottom: false, height: true },
    right: { top: false, bottom: true, height: true },
    center: { top: false, bottom: false, height: true },
    fixed: { top: true, bottom: true, height: false }
}


RelativeAnchorBox.prototype.TOP_CLASS_NAME = 'as-relative-anchor-box';

RelativeAnchorBox.prototype.render = function () {

    var layout = {
        class: [this.TOP_CLASS_NAME, this.HALIGN_CLASS_NAMES[this._halign], this.VALIGN_CLASS_NAMES[this._valign]]
    };

    this.viewBinding.$containter = '.' + this.TOP_CLASS_NAME;
    if (this._valign == 'center') {
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
RelativeAnchorBox.prototype.attachChild = function (child) {
    if (this.childNode) {
        this.childNode.view.remove();
        this.childNode = null;
        this.childNode._anchorBox = null;
    }

    if (child._anchorBox) throw new Error("Detach anchorBox first");
    this.childNode = child;
    this.$containter.addChild(child);
};

RelativeAnchorBox.prototype.dettachChild = function () {
    if (this.childNode) {
        this.childNode.view.remove();
        this.childNode = null;
        this.childNode._anchorBox = null;
    }
    else
        throw new Error("Nothing to detach");
};


RelativeAnchorBox.prototype.setHAlign = function (value) {
    if (this._halign == value) return;
    this.view.removeClass(this.HALIGN_CLASS_NAMES[this._halign]);
    this._halign = value;
    this.view.addClass(this.HALIGN_CLASS_NAMES[this._halign]);
};

RelativeAnchorBox.prototype.setVAlign = function (value) {
    if (this._valign == value) return;

    this.view.removeClass(this.VALIGN_CLASS_NAMES[this._valign]);
    if (this._valign == 'center') {
        this.view.clearChild();
        this.viewBinding.$containter = '.' + this.TOP_CLASS_NAME;
        this.$containter = this.view;
        if (this.childNode) {
            this.$containter.addChild(this.childNode.view);
        }
    }

    this._valign = value;
    this.view.addClass(this.VALIGN_CLASS_NAMES[this._valign]);
    if (this._valign == 'center') {
        this.view.clearChild();
        this.view.addChild(_({
            class: 'as-center-table',
            child: 'as-center-cell'
        }
        ));
        this.viewBinding.$containter = '.as-center-cell';
        this.$containter = $(this.viewBinding.$containter, this.view);
        if (this.childNode) {
            this.$containter.addChild(this.childNode.view);
        }
    }
    for (var key in this.VALIGN_ACEPT_STYLE[this._valign]) {
        if (this.VALIGN_ACEPT_STYLE[this._valign][key]) {
            this.view.addStyle(key, this['_' + key] + 'px');
        }
        else {
            this.view.removeStyle(key);
        }
    }
};

RelativeAnchorBox.prototype.setLeft = function (value) {
    this._left = value;
    if (this.HALIGN_ACEPT_STYLE[this._halign].left) {
        this.addStyle('left', value + 'px');
    }
};

RelativeAnchorBox.prototype.setRight = function (value) {
    this._right = value;
    if (this.HALIGN_ACEPT_STYLE[this._halign].right) {
        this.addStyle('right', value + 'px');
    }
};

RelativeAnchorBox.prototype.setWidth = function (value) {
    this._width = value;
    if (this.HALIGN_ACEPT_STYLE[this._halign].width) {
        this.addStyle('width', value + 'px');
    }
};

RelativeAnchorBox.prototype.setBotton = function (value) {
    this._bottom = value;
    if (this.VALIGN_ACEPT_STYLE[this._valign].bottom) {
        this.addStyle('bottom', value + 'px');
    }
};

RelativeAnchorBox.prototype.setTop = function (value) {
    this._top = value;
    if (this.VALIGN_ACEPT_STYLE[this._valign].top) {
        this.addStyle('top', value + 'px');
    }
};

RelativeAnchorBox.prototype.setHeight = function (value) {
    this._height = value;
    if (this.VALIGN_ACEPT_STYLE[this._valign].height) {
        this.addStyle('height', value + 'px');
    }
};


export default RelativeAnchorBox;