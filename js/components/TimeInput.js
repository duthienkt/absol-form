import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import {beginOfDay} from "absol/src/Time/datetime";
import OOP from "absol/src/HTML5/OOP";
import {inheritComponentClass} from "../core/BaseComponent";


var _ = Fcore._;

/***
 * @extends ScalableComponent
 * @constructor
 */
function TimeInput() {
    ScalableComponent.call(this);
}

inheritComponentClass(TimeInput, ScalableComponent);


TimeInput.prototype.tag = "TimeInput";
TimeInput.prototype.menuIcon = "span.mdi.mdi-clock-outline";

TimeInput.prototype.attributeHandlers.value = {
    set: function (value) {
        this.domElt.dayOffset = value;
    },
    get: function () {
        return  this.domElt.dayOffset;
    }
};


TimeInput.prototype.render = function () {
    return _('timeinput');
};


TimeInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.value = null;
    this.style.width = 100;
    this.style.height = 30;
};

TimeInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
};


TimeInput.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['value']);
};


TimeInput.prototype.getAttributeValueDescriptor = function () {
    return {
        type: 'number',
        sign: 'DateOffset'
    }
};


TimeInput.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};

TimeInput.prototype.measureMinSize = function () {
    return { width: 75, height: 16 };
};

TimeInput.prototype.getDataBindingDescriptor = function () {
    var thisC = this;
    return {
        configurable: true,
        set: function (value) {
            thisC.setAttribute('value', value);
        },
        get: function () {
            return thisC.getAttribute('value');
        }
    };
};


export default TimeInput;