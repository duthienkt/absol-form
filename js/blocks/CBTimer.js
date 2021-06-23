import {AssemblerInstance} from "../core/Assembler";
import BaseBlock from "../core/BaseBlock";
import inheritComponentClass from "../core/inheritComponentClass";

function CBTimer() {
    BaseBlock.call(this);
    this._intervalId = -1;
    this.attributes.duration = 0;
    this['tick'] = this.tick.bind(this);
}

inheritComponentClass(CBTimer, BaseBlock);

CBTimer.prototype.tag = 'CBTimer';

CBTimer.prototype.pinHandlers.signal = {
    get: function () {
        return true;
    },
    descriptor: {
        type: "bool"
    }
};

CBTimer.prototype.attributeHandlers.duration = {
    set: function (value) {
        if (!(value > 0)) {
            value = 0;
        }
        if (this._intervalId >= 0) {
            clearInterval(this._intervalId);
            this._intervalId = -1;
        }
        if (value > 0) {
            this._intervalId = setInterval(this.tick, value);
        }
        return value;
    },
    descriptor: {
        type: 'number',
        min: 0
    }
};

CBTimer.prototype.tick = function () {
    this.pinFire('signal');
};


AssemblerInstance.addClass(CBTimer);

export default CBTimer;