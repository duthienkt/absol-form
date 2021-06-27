import BaseBlock from "../core/BaseBlock";
import inheritComponentClass from "../core/inheritComponentClass";
import {AssemblerInstance} from "../core/Assembler";


/***
 * @extends BaseBlock
 * @constructor
 */
function CBRadioGroup() {
    this._value = undefined;//not define yet
    this['ev_radio'] = this.ev_radio.bind(this);
    BaseBlock.call(this);
}


inheritComponentClass(CBRadioGroup, BaseBlock);

CBRadioGroup.prototype.tag = "CBRadioGroup";


CBRadioGroup.prototype.attributeHandlers.groupName = {
    set: function (value) {
        var ref = arguments[arguments.length - 1];
        this._assignToFragment(ref.get(), value);
        return value;
    },
    descriptor: {
        type: 'text'
    }
};

CBRadioGroup.prototype.attributeHandlers.value = {
    set: function (value) {
        value = value || null;
        var prev = this._getValue(value);
        if (this.fragment) {
            this._value = this._setValue(value);
        }
        else {
            this._value = value;
        }
        if (prev !== value)
            this.pinFire('value');
    },
    get: function () {
        if (this.fragment) {
            this._value = this._getValue(value);
        }
        return this._value;
    },
    descriptor: {
        type: "text"
    }
};

CBRadioGroup.prototype.pinHandlers.value = {
    receives: function (value) {
        this.attributes.value = value;
    },
    get: function () {
        return this._value;
    },
    descriptor: {
        type: 'text'
    }
};

CBRadioGroup.prototype._getValue = function () {
    if (!this.fragment) return this._value;
    if (!this.fragment.__radio_assigned__) return null;
    var assigned = this.fragment.__radio_assigned__;
    var list = assigned[this.attributes.groupName];
    if (!list) return null;
    var radio;
    for (var i = 0; i < list.length; ++i) {
        radio = list[i];
        if (radio.attributes.checked) return radio.attributes.value;
    }
    return null;
};


CBRadioGroup.prototype._setValue = function (value) {
    if (!this.fragment) return this._value;
    if (!this.fragment.__radio_assigned__) return null;
    var assigned = this.fragment.__radio_assigned__;
    var list = assigned[this.attributes.groupName];
    if (!list) return null;
    if (value) value = value + '';
    var res = null;
    var radio;
    for (var i = 0; i < list.length; ++i) {
        radio = list[i];
        if (radio.attributes.value === value) {
            radio.attributes.checked = true;
            res = value;
        }
        else radio.attributes.checked = false;
    }
    return res;
};


CBRadioGroup.prototype.onAttached = function () {
    if (this._value !== undefined) this._setValue(this._value);
};

CBRadioGroup.prototype._assignToFragment = function (oldGName, newGName) {
    if (!this.fragment) return;
    this.fragment.emittor.off('radio.' + oldGName, this.ev_radio);
    this.fragment.emittor.on('radio.' + newGName, this.ev_radio);
};

CBRadioGroup.prototype.ev_radio = function (event) {
    this._value = event.value;
    this.pinFire('value', this._value);
};

AssemblerInstance.addClass(CBRadioGroup);

export default CBRadioGroup;