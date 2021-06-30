import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import {MILLIS_PER_DAY} from "absol/src/Time/datetime";
import inheritComponentClass from "../core/inheritComponentClass";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";


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

Object.assign(TimeInput.prototype.attributeHandlers, InputAttributeHandlers);

TimeInput.prototype.attributeHandlers.value = {
    set: function (value) {
        var prev = this.domElt.dayOffset;
        this.domElt.dayOffset = value;
        if (this.domElt.dayOffset !== value) {
            this.pinFire('value');
        }
    },
    get: function () {
        return this.domElt.dayOffset;
    },
    descriptor: {
        type: 'number',
        min: 0,
        max: MILLIS_PER_DAY - 1
    }
};

TimeInput.prototype.attributeHandlers.format = {
    set: function (value) {
        this.domElt.format = value;
    },
    get: function () {
        return this.domElt.format;
    },
    export: function () {
        if (this.domElt.format === 'hh:mm a') return undefined;
        return this.domElt.format;
    },
    descriptor: {
        type: 'enum',
        values: ['hh:mm a', 'HH:mm']
    }
};

TimeInput.prototype.pinHandlers.value = {
    receives: function (value) {
        this.attributes.value = value;
    },
    get: function () {
        return this.domElt.dayOffset;
    },
    descriptor: {
        type: 'number'
    }
}


TimeInput.prototype.render = function () {
    return _('timeinput');
};


TimeInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.value = null;
    this.attributes.format = 'hh:mm a';
    this.style.width = 130;
    this.style.height = 30;
};

TimeInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    this.domElt.on('change', function () {
        this.pinFire('value');
    }.bind(this));
};


TimeInput.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['value', 'format'])
        .concat(InputAttributeNames);
};


TimeInput.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};

TimeInput.prototype.measureMinSize = function () {
    return { width: 75, height: 16 };
};

TimeInput.prototype.createDataBindingDescriptor = function () {
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

AssemblerInstance.addClass(TimeInput);

export default TimeInput;