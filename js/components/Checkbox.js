import Fcore from "../core/FCore";

import '../../css/component.css';
import ContentScalelessComponent from "../core/ContentScalelessComponent";
import inheritComponentClass from "../core/inheritComponentClass";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";

var _ = Fcore._;
var $ = Fcore.$;

/***
 * @extends ContentScalelessComponent
 * @constructor
 */
function CheckBox() {
    ContentScalelessComponent.call(this);
}

inheritComponentClass(CheckBox, ContentScalelessComponent);

CheckBox.prototype.tag = "CheckBox";
CheckBox.prototype.menuIcon = "span.mdi.mdi-check-box-outline";

CheckBox.prototype.onCreate = function () {
    ContentScalelessComponent.prototype.onCreate.call(this);
    this.style.width = 18;
    this.style.height = 18;
    this.style.vAlign = 'top';
    this.style.hAlign = 'left';
    this.style.textHAlign = 'center';
    this.style.textVAlign = 'center';
    this.attributes.checked = false;
};


CheckBox.prototype.onCreated = function () {
    ContentScalelessComponent.prototype.onCreated.call(this);
    this.$content.on('change', function () {
        this.pinFire('checked');
    }.bind(this));
};



CheckBox.prototype.renderContent = function () {
    return _('checkboxbutton');
};


CheckBox.prototype.getAcceptsEventNames = function () {
    return ContentScalelessComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};


CheckBox.prototype.measureMinSize = function () {
    return { width: 18, height: 18 };
};

CheckBox.prototype.createDataBindingDescriptor = function () {
    var thisC = this;
    return {
        set: function (value) {
            return thisC.setAttribute('checked', !!value);
        },
        get: function () {
            return thisC.getAttribute('checked');
        },
        configurable: true
    }
};

CheckBox.prototype.attributeHandlers.checked = {
    set: function (value) {
        this.$content.checked = !!value;
    },
    get: function () {
        return this.$content.checked;
    },
    descriptor: {
        type: "bool",
        sign: "NotDependentBool"
    },
    export: function () {
        return this.$content.checked || undefined;
    }
};


Object.assign(CheckBox.prototype.attributeHandlers, InputAttributeHandlers);

CheckBox.prototype.attributeHandlers.disabled = {
    set: function (value) {
        this.$content.disabled = value;
    },
    get: function () {
        return this.$content.disabled;
    },
    export: function () {
        return this.$content.disabled || undefined;
    }
};


CheckBox.prototype.pinHandlers.checked = {
    receives: function (value) {
        this.attributes.checked = !!value;
    },
    get: function () {
        return this.$content.checked;
    },
    descriptor: {
        type: "bool"
    }
};

AssemblerInstance.addClass(CheckBox);

export default CheckBox;