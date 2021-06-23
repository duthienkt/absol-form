import {AssemblerInstance} from "../core/Assembler";
import BaseBlock from "../core/BaseBlock";
import inheritComponentClass from "../core/inheritComponentClass";

function CBEntry() {
    BaseBlock.call(this);
}

inheritComponentClass(CBEntry, BaseBlock);

CBEntry.prototype.tag = 'CBEntry';

CBEntry.prototype.pinHandlers.signal = {
    get: function () {
        return true;
    },
    descriptor: {
        type: "bool"
    }
};

CBEntry.prototype.exec = function (){
    this.pinFire('signal');
};

AssemblerInstance.addClass(CBEntry);

export default CBEntry;