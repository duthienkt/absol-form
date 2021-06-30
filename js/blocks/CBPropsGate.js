import {AssemblerInstance} from "../core/Assembler";
import BaseBlock from "../core/BaseBlock";
import inheritComponentClass from "../core/inheritComponentClass";

function CBPropsGate() {
    BaseBlock.call(this);
}

inheritComponentClass(CBPropsGate, BaseBlock);

CBPropsGate.prototype.tag = 'CBPropsGate';

CBPropsGate.prototype.pinHandlers.props = {
    receives: function (value) {
        this.fragment.props = value;
    },
    get: function () {
        return this.fragment.props;
    },
    descriptor: {
        type: "object"
    }
};

CBPropsGate.prototype.pinHandlers.propsChangeInfo = {
    get: function () {
        return this.fragment._propsChangeInfo;
    },
    descriptor: {
        type: "object"
    }
};

CBPropsGate.prototype.pinHandlers.get = {
    receives: function () {
        this.pinFire('props');
    },
    descriptor: {
        type: "bool"
    }
};

AssemblerInstance.addClass(CBPropsGate);

export default CBPropsGate;