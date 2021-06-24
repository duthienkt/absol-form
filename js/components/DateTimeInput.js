import ScalableComponent from "../core/ScalableComponent";
import {_} from "../core/FCore";
import inheritComponentClass from "../core/inheritComponentClass";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";


/***
 * @extends ScalableComponent
 * @constructor
 */
function DateTimeInput() {
    ScalableComponent.call(this);
}

inheritComponentClass(DateTimeInput, ScalableComponent);


DateTimeInput.prototype.tag = 'DateTimeInput';
DateTimeInput.prototype.menuIcon = 'span.mdi.mdi-calendar-clock';

DateTimeInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.style.width = 170;
    this.style.height = 30;
    this.attributes.format = 'dd/MM/yyyy hh:mm a';
};


Object.assign(DateTimeInput.prototype.attributeHandlers, InputAttributeHandlers);

DateTimeInput.prototype.attributeHandlers.format = {
    set: function (value) {
        this.domElt.format = value;
    },
    get: function () {
        return this.domElt.format;
    },
    descriptor: {
        type: 'DateTimeFormat'
    },
    export: function () {
        var value = this.format;
        if (value === 'dd/MM/yyyy hh:mm a') return undefined;
        return value;
    }
};

DateTimeInput.prototype.attributeHandlers.value = {
    set: function (value) {
        var prev = this.domElt.value;
        this.domElt.value = value;
        var cur = this.domElt.value;
        if (!prev !== !cur || (prev && cur && prev.getTime() === cur.getTime()))
            this.pinFire('value');
    },
    get: function () {
        return this.domElt.value;
    },
    descriptor: {
        type: 'DateTime'
    },
    export: function () {
        return this.value || undefined;
    }
};

DateTimeInput.prototype.pinHandlers.value = {
    receives: function (value) {
        console.log(this)
        this.domElt.value = value;
    },
    get: function () {
        return this.domElt.value;
    },
    descriptor: {
        type: "Date"
    }
};

DateTimeInput.prototype.onCreated = function () {
    this.domElt.on('change', function () {
        this.pinFire('value');
    }.bind(this));
};


DateTimeInput.prototype.render = function () {
    return _({
        tag: 'datetimeinput'
    });
};


AssemblerInstance.addClass(DateTimeInput);

export default DateTimeInput;

