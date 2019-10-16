import BaseComponent from "../core/BaseComponent";
import Fcore from "../core/FCore";

var _ = Fcore._;

function ScalableComponent() {
    BaseComponent.call(this);
}

Object.defineProperties(ScalableComponent.prototype, Object.getOwnPropertyDescriptors(BaseComponent.prototype));
ScalableComponent.prototype.constructor = ScalableComponent;

ScalableComponent.prototype.tag = "ScalableComponent";
ScalableComponent.prototype.SUPPORT_STYLE_NAMES = ['width', 'height', 'top', 'left', 'right', 'top', 'bottom'];


ScalableComponent.prototype.onCreate = function () {
    BaseComponent.prototype.onCreate.call(this);
    this.style.hAlign = 'left';
    this.style.vAlign = 'top'
    this.style.left = 0;
    this.style.right = 0;
    this.style.top = 0;
    this.style.bottom = 0;
    this.style.height = 30;
    this.style.width = 69;
};



ScalableComponent.prototype.setStyleWidth = function (value) {
    if (this.style.hAlign != 'fixed')
        this.view.addStyle('width', value + 'px');
    else
        this.view.removeStyle('width');
    return value;
};

ScalableComponent.prototype.setStyleHeight = function (value) {
    if (this.style.vAlign != 'fixed')
        this.view.addStyle('height', value + 'px');
    else
        this.view.removeStyle('height');

    return value;
};


ScalableComponent.prototype.setStyleHAlign = function (value) {
    if (value != 'fixed') {
        this.view.addStyle('width', this.style.width + 'px');
    }
    else {
        this.view.removeStyle('width');
    }

    return value;
};


ScalableComponent.prototype.setStyleVAlign = function (value) {
    if (value != 'fixed') {
        this.view.addStyle('height', this.style.height + 'px');
    }
    else {
        this.view.removeStyle('height');
    }
    return value;
};


ScalableComponent.prototype.setStyle = function (key, value) {
    var res;
    if (this.anchorAcceptsStyleName[key]) {
        value = this.anchor.setStyle(key, value);// anchor first
        value = BaseComponent.prototype.setStyle.call(this, key, value);
        if (value === undefined)
            delete this.style[key];
        else this.style[key] = value;
        res = value;
    }
    else {
        res = BaseComponent.prototype.setStyle.call(this, key, value);
    }

    return res;
};


ScalableComponent.prototype.getAcceptsStyleNames = function () {
    return BaseComponent.prototype.getAcceptsStyleNames.call(this).concat(['width', 'height']);
};


ScalableComponent.prototype.getStyleWidthDescriptor = function () {
    return {
        disabled: this.style.hAlign == 'fixed',
        type: 'number',
        min: this.measureMinSize().width,
        max: Infinity
    };
};

ScalableComponent.prototype.getStyleHeightDescriptor = function () {
    return {
        disabled: this.style.vAlign == 'fixed',
        type: 'number',
        min: this.measureMinSize().height,
        max: Infinity
    };
};

export default ScalableComponent;