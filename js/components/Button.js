import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import {inheritComponentClass} from "../core/BaseComponent";
import TextStyleHandlers from "./handlers/TextStyleHandlers";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";

var _ = Fcore._;

/***
 * @extends ScalableComponent
 * @constructor
 */
function Button() {
    ScalableComponent.call(this);
}

inheritComponentClass(Button, ScalableComponent);

Button.prototype.tag = "Button";
Button.prototype.menuIcon = "span.mdi.mdi-alpha-b-box";

Object.assign(Button.prototype.styleHandlers, TextStyleHandlers);

Object.assign(Button.prototype.attributeHandlers, InputAttributeHandlers);

Button.prototype.attributeHandlers.text = {
    set: function (value) {
        this.domElt.text = value;
    },
    get: function () {
        return this.domElt.text;
    },
    descriptor: {
        type: "text",
        sign: 'SimpleText'
    }
};

Button.prototype.attributeHandlers.icon = {
    set: function (value) {
        this.domElt.icon = value;
    },
    get: function () {
        return this.domElt.icon;
    },
    descriptor: {
        type: "icon",
        sign: "SimpleIcon"
    }
};

Button.prototype.colorThemeList = ['default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'];

Button.prototype.styleHandlers.colorTheme = {
    set: function (value) {
        if (this.colorThemeList.indexOf(value) < 0) value = this.colorThemeList[0];
        var currentValue = arguments[arguments.length - 1].get();
        this.domElt.removeClass(currentValue || 'default')
            .addClass(value);
        return value;
    },
    descriptor: {
        type: 'enum',
        values: Button.prototype.colorThemeList
    }
}


Button.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.text = this.attributes.name;
    this.attributes.icon = 'span.mdi.mdi-format-font';
    this.style.colorTheme = 'default';
    this.style.font = 'none';
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


Button.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['text', 'icon']).concat(InputAttributeNames);
};

Button.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['font', 'textSize', 'colorTheme']);
};


Button.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['click']);
};

Button.prototype.measureMinSize = function () {
    var fontSize = this.view.getFontSize();
    return { width: fontSize * 2 + 2, height: fontSize * 2 + 2 }
};

export default Button;