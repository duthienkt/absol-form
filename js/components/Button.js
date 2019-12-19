import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;

function Button() {
    ScalableComponent.call(this);
}

Object.defineProperties(Button.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
Button.prototype.constructor = Button;

Button.prototype.tag = "Button";
Button.prototype.menuIcon = "span.mdi.mdi-alpha-b-box";

Button.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.text = this.attributes.name;
    this.attributes.icon = 'span.mdi.mdi-format-font';
    this.style.colorTheme = 'default';
};

Button.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('click', function (event) {
        self.emit('click', { type: 'click', target: this, originEvent: event.originEvent || event }, self)
    });
};


Button.prototype.render = function () {
    return _('flexiconbutton');
};


Button.prototype.setStyleHeight = function (value) {
    var res = ScalableComponent.prototype.setStyleHeight.call(this, value);
    this.view.childNodes[0].addStyle('height', value - 2 + 'px');
    return res;
};

Button.prototype.setStyleColorTheme = function (value) {
    var view = this.view;
    ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link', 'default'].forEach(function (name) {
        view.removeClass(name);
    });
    if (['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link', 'default'].indexOf(value) < 0) value = 'default';
    view.addClass(value);
    return value;
};



Button.prototype.getStyleColorThemeDescriptor = function (value) {
    return {
        type: 'enum',
        values: ['default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link']
    }
};


Button.prototype.setAttributeText = function (value) {
    this.view.text = value;
    return value;
};


Button.prototype.setAttributeIcon = function (value) {
    this.view.icon = value;
    return value;
};


Button.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['text', 'icon']);
};

Button.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['colorTheme']);
};


Button.prototype.getAttributeTextDescriptor = function () {
    return {
        type: "text",
    };
};


Button.prototype.getAttributeIconDescriptor = function () {
    return {
        type: "icon"
    };
};

Button.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['click']);
};

Button.prototype.measureMinSize = function () {
    var fontSize = this.view.getFontSize();
    return { width: fontSize * 2 + 2, height: fontSize * 2 + 2 }
};


export default Button;