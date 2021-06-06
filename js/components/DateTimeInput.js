import ScalableComponent from "../core/ScalableComponent";
import {_} from "../core/FCore";
import OOP from "absol/src/HTML5/OOP";
import {inheritComponentClass} from "../core/BaseComponent";


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
        this.domElt.value = value;
    },
    get: function () {
        return this.domElt.value;
    },
    descriptor: {
        type: 'DateTime'
    },
    export: function () {
        var value = this.value;
        if (value) return value;
        return undefined;
    }
};

DateTimeInput.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames().concat('value', 'format');
}

DateTimeInput.prototype.render = function () {
    return _({
        tag: 'datetimeinput'
    })
};


export default DateTimeInput;

